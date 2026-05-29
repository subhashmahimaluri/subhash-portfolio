---
kind: skill
id: apply-edit
version: 0.2.0
status: stable
---

# Skill: apply-edit

## Description
Apply a single, surgical edit to one file. Pre-validates path policy, secret patterns, and dependency-add patterns BEFORE writing. This is the only write primitive — agents never write files directly.

## Inputs
- `path`: string — required — target file path
- `old_string`: string — required — exact existing content (with sufficient context for uniqueness)
- `new_string`: string — required — replacement content
- `create_if_missing`: bool — optional — default false; allow creating a new file

## Outputs
- `success`: bool
- `bytes_changed`: int
- `lines_changed`: `{added: int, removed: int}`
- `validation_log`: list of `{check, passed, detail}` — what was checked pre-write

## Tools Needed
- `Edit` tool (IDE) or `Write` tool

## Constraints
- max_runtime_seconds: 15
- fail_modes: [`path_denied`, `secret_detected`, `dep_change_attempted`, `string_not_unique`, `string_not_found`]
- cacheable: false (edits are stateful)
- path_policy: enforced pre-write
- safety_rails: enforced pre-write

## Pre-write validation pipeline
1. **Path check** — must pass project allowlist + denylist + agent override. Fail → `path_denied`.
2. **Secret scan** — `new_string` scanned for high-entropy strings, `password=`, `secret=`, `_KEY=`, `token=`. Fail → `secret_detected`.
3. **Dependency-add check** — if path is `package.json` / `*.csproj` / `requirements.txt` / etc., inspect diff for new entries in `dependencies`/`PackageReference`. Fail → `dep_change_attempted`.
4. **Uniqueness check** — `old_string` must match exactly once in the current file. Fail → `string_not_unique` or `string_not_found`.
5. **Lint pre-check** (optional) — if a linter config exists for the file extension, run a fast syntax check. Soft warning only.

## When to invoke
- Once per file per change. NEVER edit the same file twice with separate `apply-edit` calls — combine into one edit with broader context.
- After confirming the edit window via `read-file`.
- After hypothesis is stated in scratchpad memory.

## How it works
1. Run all 5 pre-write validations.
2. If any hard validation fails, return failure WITHOUT touching the file.
3. Apply edit via `Edit` tool.
4. Re-read the file to confirm change applied as expected.
5. Emit telemetry: `skill:returned` with `bytes_changed`, `lines_changed`.

## Examples
```yaml
input:
  path: "packages/@subhash-portfolio/types/fees.ts"
  old_string: "  return subtotal * rate;\n}"
  new_string: "  if (subtotal < 0) return 0;\n  return subtotal * rate;\n}"
output:
  success: true
  bytes_changed: 35
  lines_changed: {added: 1, removed: 0}
  validation_log:
    - {check: "path", passed: true}
    - {check: "secret", passed: true}
    - {check: "deps", passed: true}
    - {check: "unique", passed: true}
```

## Anti-patterns
- Do NOT use this skill to refactor surrounding code — surgical edits only.
- Do NOT pass tiny `old_string` (e.g. just `}`) — uniqueness will fail. Provide context.
- Do NOT batch unrelated changes into one edit — one concern per edit.
