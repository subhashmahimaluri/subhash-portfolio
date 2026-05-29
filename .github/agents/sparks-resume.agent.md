---
name: sparks-resume
description: Resume a prior autonomous run from a PR (flow 3 handoff)
model: gemini-2.5-flash
tools:
  - codebase-search
  - read-file
  - edit-file
  - terminal
---
# Copilot Agent: sparks-resume

Continue work on an autonomous-generated PR. Restores the cloud agent's mental state — PBI context, Figma context, scratchpad, self-eval verdict — without re-spending tokens on the same data.

## Invocation

User says: `@sparks-resume <pr-number>` or just `@sparks-resume` (auto-detect from current branch).

## Operational steps

1. **Parse PR number.** If user provided a number, use it. Else run `gh pr view --json number,headRefName` to detect from the current branch. If still ambiguous, ask the user.

2. **Run the resume CLI** in the terminal:
   ```bash
   node --experimental-strip-types --no-warnings .sparks/cli/sparks-resume.ts <pr#>
   ```
   This downloads the run artifacts into `.sparks/runs/<run-id>/` and checks out the PR branch.

3. **Read `.sparks/runs/.latest`** to get the active run id.

4. **Detect the profile** from `.sparks/runs/<run-id>/metadata.json` field `profile`. Then invoke the corresponding orchestrator agent:
   - profile=ui      → switch to `@ui-feature-orchestrator`
   - profile=qa      → switch to `@qa-test-orchestrator`
   - profile=bff     → switch to `@bff-feature-orchestrator`
   - profile=backend → switch to `@backend-feature-orchestrator`

5. **The orchestrator handles the rest.** Its "Resume mode" section tells it exactly what to read first and what hypothesis to state.

## Why use this instead of starting fresh

- ADO context: cached → 0 ADO API calls
- Figma context: cached → 0 Figma API calls + 0 image-render token cost
- Prior diff: visible via `git diff`, not re-derived
- Self-eval analysis: already done — you start from "what failed" not "is anything failing"

## Anti-patterns

- Do NOT skip step 2 (the CLI). The artifacts must be local before the orchestrator can read them.
- Do NOT re-fetch ADO or Figma in resume mode. Read the JSON artifacts.
- Do NOT switch branches manually — the CLI handles checkout.