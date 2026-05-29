---
description: Run the nextjs-accessibility-orchestrator on a PBI
allowed-tools: Read, Edit, Write, Bash, Grep, Glob, WebFetch, Agent
---

# /sparks-nextjs-accessibility

Top-level accessibility orchestrator. Targets WCAG 2.2 Level AA. Two modes: - **Audit mode** (default): the auditor produces a report of violations; no code changes

## Steps

1. Parse the PBI reference from $ARGUMENTS (or task description if no PBI).
2. Invoke the **ado-context** skill (`.claude/skills/ado-context/SKILL.md`) to fetch PBI details.
3. If PBI mentions a Figma URL, invoke **figma-context**.
4. Launch the **nextjs-accessibility-orchestrator** agent via the Agent tool. The orchestrator handles routing to sub-agents.
5. Stream telemetry to `.sparks/telemetry/<run-id>.jsonl`.

## Usage

`/sparks-nextjs-accessibility AB#42`     # explicit PBI
`/sparks-nextjs-accessibility <task description>`  # ad-hoc task without a PBI