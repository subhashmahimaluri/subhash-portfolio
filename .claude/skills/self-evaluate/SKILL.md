---
kind: skill
id: self-evaluate
version: 0.1.0
status: stable
---

# Skill: self-evaluate

## Description
Mandatory final skill before `format-pr`. Reads the agent's diff and the agent's declared done criteria, then answers — for each criterion — whether the diff satisfies it. Returns pass/fail. If fail, the agent loops back within budget.

## Inputs
- `done_criteria`: list[string] — required — agent's `Done Criteria` bullets from frontmatter
- `diff`: string — required — `git diff HEAD` output
- `scratchpad_path`: string — optional — path to per-run memory for context

## Outputs
- `passed`: bool
- `criteria_results`: list of `{criterion, passed: bool, evidence: string, confidence: 0..1}`
- `unmet_criteria`: list[string] — copies of criteria that failed
- `should_retry`: bool — true if any criterion failed AND budget remains
- `summary`: string — one-paragraph human-readable verdict

## Tools Needed
- LLM call (model from agent's `model_preference`)
- `Read` tool (to inspect specific files mentioned in criteria)

## Constraints
- max_runtime_seconds: 60
- max_llm_tokens: 4000 input + 1000 output
- fail_modes: [`llm_error`, `diff_too_large`]
- cacheable: false (must run fresh against current diff)

## How it works
1. Build prompt:
   ```
   You are a strict reviewer. Given a diff and a list of done criteria, mark each criterion pass/fail with evidence from the diff.
   
   DONE CRITERIA:
   <bullet list>
   
   DIFF:
   <git diff>
   
   For each criterion, output:
   - PASS/FAIL
   - Evidence (line numbers + quoted code from diff)
   - Confidence 0-1
   ```
2. Call LLM (Gemini 2.5 Flash by default, model_preference can override).
3. Parse structured response.
4. Compute `passed = all(criteria_results.passed)`.
5. Emit `self-eval:result` telemetry event.

## When to invoke
- ALWAYS as the last action before `format-pr`. No exceptions.
- After a `should_retry: true` result, the agent MAY edit again and re-invoke self-evaluate — but only if budget remains.

## Decision tree after invocation
```
passed == true                          → proceed to format-pr
passed == false AND should_retry == true → agent loops back to apply-edit
passed == false AND should_retry == false → exit BLOCKED:self-eval-failed, post unmet criteria
```

## Examples
```yaml
input:
  done_criteria:
    - "calculateServiceFee returns 0 when orderType is undefined"
    - "Existing tests still pass"
    - "Regression test added at fees.test.ts"
  diff: "<git diff>"
output:
  passed: true
  criteria_results:
    - criterion: "calculateServiceFee returns 0 when orderType is undefined"
      passed: true
      evidence: "fees.ts line 67: if (!orderType) return 0;"
      confidence: 0.95
    - criterion: "Existing tests still pass"
      passed: true
      evidence: "run-tests output: 12/12 passed"
      confidence: 1.0
    - criterion: "Regression test added at fees.test.ts"
      passed: true
      evidence: "fees.test.ts line 120: it('returns 0 for undefined orderType', ...)"
      confidence: 0.98
  unmet_criteria: []
  should_retry: false
  summary: "All 3 done criteria satisfied. Diff is surgical, tests pass, regression test added."
```

## Anti-patterns
- Do NOT skip self-evaluate to save a token. The cost of a wrong PR is much higher.
- Do NOT silently pass criteria you can't verify — set `confidence < 0.5` and explain in evidence.
- Do NOT modify the done criteria to make them easier to pass. The criteria come from the agent definition.
