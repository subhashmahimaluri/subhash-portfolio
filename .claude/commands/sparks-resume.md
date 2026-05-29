---
description: Resume a prior autonomous run from a PR (flow 3 handoff)
allowed-tools: Read, Edit, Write, Bash, Grep, Glob, Agent
---

# /sparks-resume

Continue work on an autonomous-generated PR. Restores the cloud agent's mental state — PBI context, Figma context, scratchpad, self-eval verdict — so you don't re-spend tokens on the same data.

## Steps

1. **Parse PR number** from `$ARGUMENTS`. If empty, run `gh pr view --json number,headRefName` to auto-detect from the current branch. If still ambiguous, ask the user.

2. **Download artifacts** by running:
   ```bash
   node --experimental-strip-types --no-warnings .sparks/cli/sparks-resume.ts <pr#>
   ```
   This populates `.sparks/runs/<run-id>/` with `scratchpad.md`, `metadata.json`, `ado-context.json`, `figma-context.json` (if applicable), `self-eval.md`, `telemetry.jsonl`. The branch is checked out by the CLI.

3. **Read `.sparks/runs/.latest`** to get the active run id.

4. **Invoke the orchestrator in resume mode** via the Agent tool. The orchestrator's "Resume mode" section is mandatory reading — it tells you exactly what to read first (metadata, scratchpad, self-eval, ADO + Figma JSON) and what hypothesis to state before editing.

   The profile is in `.sparks/runs/<run-id>/metadata.json`. Map to the orchestrator:
   - profile=ui      → invoke `ui-feature-orchestrator`
   - profile=qa      → invoke `qa-test-orchestrator`
   - profile=bff     → invoke `bff-feature-orchestrator`
   - profile=backend → invoke `backend-feature-orchestrator`

5. **State the resumption out loud** before any edits, in this exact form:
   ```
   Resuming run <run-id> (PBI <pbi-id>).
   Prior self-eval: <PASS|FAIL>.
   What was tried: <one sentence>.
   Remaining work: <derived from failed criteria + reviewer comments>.
   Hypothesis: <what to change next>.
   ```

## Usage

`/sparks-resume 47`    # explicit PR number
`/sparks-resume`        # auto-detect from current branch

## Why this is cheaper than starting fresh

- ADO context: cached → 0 ADO calls
- Figma context: cached → 0 Figma calls + 0 image-render token cost
- Prior diff: visible via git, not re-derived from scratch
- Self-eval failure analysis: already done, you start from "what failed" not "is anything failing"