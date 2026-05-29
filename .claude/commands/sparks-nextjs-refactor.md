---
description: Run the nextjs-refactor-orchestrator on a PBI
allowed-tools: Read, Edit, Write, Bash, Grep, Glob, WebFetch, Agent
---

# /sparks-nextjs-refactor

Refactor orchestrator. All sub-agents PRESERVE behavior — they restructure code, never add features. Used to maintain the codebase quality bar without entering "feature work" territory.

## Steps

1. Parse the PBI reference from $ARGUMENTS (or task description if no PBI).
2. Invoke the **ado-context** skill (`.claude/skills/ado-context/SKILL.md`) to fetch PBI details.
3. If PBI mentions a Figma URL, invoke **figma-context**.
4. Launch the **nextjs-refactor-orchestrator** agent via the Agent tool. The orchestrator handles routing to sub-agents.
5. Stream telemetry to `.sparks/telemetry/<run-id>.jsonl`.

## Usage

`/sparks-nextjs-refactor AB#42`     # explicit PBI
`/sparks-nextjs-refactor <task description>`  # ad-hoc task without a PBI