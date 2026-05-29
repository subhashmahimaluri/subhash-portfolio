---
kind: skill
id: run-tests
version: 0.2.0
status: stable
---

# Skill: run-tests

## Description
Run tests relevant to the files an agent has touched. Auto-detects test runner (pnpm/npm/jest/vitest/dotnet test/pytest/playwright). Returns pass/fail summary + first 3 failure traces.

## Inputs
- `touched_files`: list[string] — required — files the agent edited; used to find nearby tests
- `runner_hint`: string — optional — force a specific runner (`vitest` | `jest` | `dotnet` | `pytest` | `playwright`)
- `timeout_seconds`: int — optional — default 180, hard cap 600

## Outputs
- `passed`: bool — true only if ALL relevant tests passed
- `summary`: `{total: int, passed: int, failed: int, skipped: int}`
- `failures`: list of `{test_name, file, line, message}` — capped at 3
- `runner_used`: string
- `command`: string — the exact command executed

## Tools Needed
- `Bash` tool

## Constraints
- max_runtime_seconds: 600
- fail_modes: [`no_runner_detected`, `timeout`, `runner_crashed`]
- cacheable: false (must run fresh against current state)

## How it works
1. **Detect runner** — scan `package.json` for `test` script; fall back to `vitest.config.*`, `jest.config.*`, `*.csproj`, `pyproject.toml`.
2. **Find relevant tests** — for each `touched_file`, look for siblings matching:
   - `<basename>.test.{ts,tsx,js,jsx}` (Vitest/Jest)
   - `<basename>.spec.{ts,tsx,js,jsx}`
   - `__tests__/<basename>.*`
   - `<basename>.test.cs` (.NET)
   - `test_<basename>.py` (pytest)
3. **Run scoped command**:
   - Vitest: `pnpm vitest run <file1> <file2>`
   - Jest: `pnpm jest <file1> <file2>`
   - .NET: `dotnet test --filter "FullyQualifiedName~<class>"`
   - Pytest: `pytest <file1> <file2>`
4. **Parse output** for pass/fail counts and failure messages.
5. **Cap failure traces at 3** — full output saved to scratchpad memory.

## When to invoke
- After every `apply-edit` to files that have nearby tests.
- Before `format-pr` — never submit a PR without running tests.
- After adding a regression test, to confirm it passes.

## When NOT to invoke
- After `apply-edit` to a markdown file or config file with no tests.
- During exploratory reads — only after edits.

## Examples
```yaml
input:
  touched_files: ["packages/@subhash-portfolio/types/fees.ts"]
output:
  passed: true
  summary: {total: 12, passed: 12, failed: 0, skipped: 0}
  failures: []
  runner_used: "vitest"
  command: "pnpm vitest run packages/@subhash-portfolio/types/fees.test.ts"
```

## Anti-patterns
- Do NOT run the full test suite — scope to touched files. Full suite is the CI's job.
- Do NOT skip a failing test by modifying the test. Fix the code.
- Do NOT cache test results across runs.
