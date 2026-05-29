---
kind: skill
id: path-check
version: 0.1.0
status: stable
---

# Skill: path-check

## Description
Synchronous, cheap (no LLM) check whether a proposed file path is allowed by the project's `paths_allowlist` + `paths_denylist`. Used before `read-file` and `apply-edit` so violations are caught BEFORE expensive operations.

## Inputs
- `path`: string — required — proposed path
- `operation`: enum — required — `read` | `write` | `create`

## Outputs
- `allowed`: bool
- `reason`: string — if denied, which rule blocked it
- `matched_allow_pattern`: string — if allowed, which glob matched
- `matched_deny_pattern`: string — if denied, which glob blocked

## Tools Needed
- None — pure pattern match against `.sparks.yml` policy

## Constraints
- max_runtime_seconds: 1
- fail_modes: [`policy_file_missing`, `invalid_glob`]
- cacheable: true (per-run, policy is immutable during run)

## How it works
1. Load project's `.sparks.yml` (already loaded into memory at run start).
2. Check `paths_denylist` first — if any pattern matches, deny.
3. Check `paths_allowlist` — if no pattern matches, deny.
4. Otherwise allow.
5. Return verdict + matched pattern (for telemetry / debugging).

## When to invoke
- Before every `read-file` call (in case the search returned a denied path).
- Before every `apply-edit` call (mandatory — `apply-edit` re-runs this internally).
- When proposing a new file path during planning.

## Examples
```yaml
input:
  path: "supabase/migrations/20260601_add_column.sql"
  operation: "create"
output:
  allowed: false
  reason: "Matches denylist pattern: supabase/migrations/**"
  matched_deny_pattern: "supabase/migrations/**"

input:
  path: "apps/web/src/components/Hero.tsx"
  operation: "write"
output:
  allowed: true
  matched_allow_pattern: "apps/*/src/**/*.{ts,tsx,js,jsx,json,css,md}"
```

## Anti-patterns
- Do NOT skip path-check for files you "know" are allowed — the policy may have changed.
- Do NOT attempt to override a denied path — surface as `BLOCKED:forbidden-path`.
