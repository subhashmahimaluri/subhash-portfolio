---
description: Run the nextjs-review-orchestrator on a PBI
allowed-tools: Read, Edit, Write, Bash, Grep, Glob, WebFetch, Agent
---

# /sparks-nextjs-review

Diagnostic-only orchestrator that produces a structured PR review. Does NOT modify code — output is a report posted as a PR comment. Routes to three specialist reviewers covering correctness, performance, and test quality. Use this BEFORE merging a PR, or BEFORE asking a human reviewer to look at it.

## Steps

1. Parse the PBI reference from $ARGUMENTS (or task description if no PBI).
2. Invoke the **ado-context** skill (`.claude/skills/ado-context/SKILL.md`) to fetch PBI details.
3. If PBI mentions a Figma URL, invoke **figma-context**.
4. Launch the **nextjs-review-orchestrator** agent via the Agent tool. The orchestrator handles routing to sub-agents.
5. Stream telemetry to `.sparks/telemetry/<run-id>.jsonl`.

## Usage

`/sparks-nextjs-review AB#42`     # explicit PBI
`/sparks-nextjs-review <task description>`  # ad-hoc task without a PBI