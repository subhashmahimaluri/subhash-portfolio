---
kind: skill
id: read-file
version: 0.2.0
status: stable
---

# Skill: read-file

## Description
Read a file (or a range of lines within it) from the target repository. Returns content with line numbers. This is the inspection primitive — the agent reads only what the search points at.

## Inputs
- `path`: string — required — file path relative to repo root
- `start_line`: int — optional — default 1
- `end_line`: int — optional — default end-of-file
- `max_bytes`: int — optional — default 100000, hard cap 500000

## Outputs
- `content`: string — file contents with line numbers prepended
- `total_lines`: int
- `truncated`: bool — true if hit `max_bytes` or `end_line` < total

## Tools Needed
- `Read` tool (IDE) or `cat`/`sed` (Bash)

## Constraints
- max_runtime_seconds: 10
- fail_modes: [`file_not_found`, `path_denied`, `binary_file`, `oversize`]
- cacheable: true (per-run, keyed on path+range hash)
- path_policy: enforced — read of denylist path returns `path_denied` without filesystem access

## When to invoke
- After `codebase-search` returns a path the agent wants to inspect.
- Before editing a file, to confirm current state and decide the precise edit window.
- To verify an edit succeeded (read same range, confirm new content).

## How it works
1. Validate path against project allowlist/denylist (synchronous, no FS call needed if denied).
2. Read content via `Read` / `sed -n 'start,end p'`.
3. Prepend line numbers in `<line>: <content>` format.
4. If content exceeds `max_bytes`, truncate and set `truncated: true`.

## Examples
```yaml
input:
  path: "packages/@subhash-portfolio/types/fees.ts"
  start_line: 40
  end_line: 80
output:
  content: |
    40: export const SERVICE_FEE_RATE = 0.05;
    41: 
    42: export function formatReadingTime(content, wpm?) {
    43:   ...
  total_lines: 187
  truncated: false
```

## Anti-patterns
- Do NOT read the whole file when you only need a function — use line ranges.
- Do NOT read multiple files in one call — one skill invocation = one file.
- Do NOT read binary files (images, lockfiles, .pdf) — fails with `binary_file`.
