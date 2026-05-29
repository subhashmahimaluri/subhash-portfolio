---
kind: skill
id: codebase-search
version: 0.2.0
status: stable
---

# Skill: codebase-search

## Description
Search the target repository for files, symbols, or text matching a query. Returns ranked file paths with snippets and line numbers. This is the navigation primitive — the agent uses it to locate code without reading it.

## Inputs
- `query`: string — required — search term, symbol, regex, or natural-language phrase
- `max_results`: int — optional — default 20
- `file_glob`: string — optional — restrict to paths (e.g. `apps/**/*.ts`)
- `exclude_glob`: string — optional — exclude paths (e.g. `**/node_modules/**`)

## Outputs
- `results`: list of `{path, line, snippet, score}` — ranked matches
- `count`: int — total matches before truncation
- `truncated`: bool — true if results were capped

## Tools Needed
- `grep` (via Bash) or `Grep` tool (IDE)
- `ripgrep` (preferred when available — faster)

## Constraints
- max_runtime_seconds: 30
- fail_modes: [`no_matches`, `search_timeout`, `invalid_regex`]
- cacheable: true (per-run, keyed on query+glob hash)

## When to invoke
- At the start of a task when the PBI names a function, error string, component, or selector but not the file path.
- After an edit, to verify no orphaned references remain (search for old symbol name).
- Before adding a regression test, to check whether nearby tests exist.

## How it works
1. Run search via `Grep` / `ripgrep` with the query against the target repo.
2. Apply `file_glob` / `exclude_glob` filters.
3. Rank by frequency + path specificity (deeper paths score higher when query is specific).
4. Cap at `max_results`, return.

## Examples
```yaml
input:
  query: "calculateServiceFee"
  file_glob: "packages/@subhash-portfolio/**/*.ts"
output:
  results:
    - path: "packages/@subhash-portfolio/types/fees.ts"
      line: 42
      snippet: "export function calculateServiceFee(subtotal, plan?)"
      score: 0.95
  count: 1
  truncated: false
```

## Anti-patterns
- Do NOT search broadly when you have a precise query — narrow the glob.
- Do NOT call this skill in a loop to "discover" the codebase — that's bulk retrieval, not A-Rag.
- Do NOT read the result paths automatically — that's `read-file@0.2.0`'s job, separate skill call.
