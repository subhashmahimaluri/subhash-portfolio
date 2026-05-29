---
description: Run the nextjs-security-orchestrator on a PBI
allowed-tools: Read, Edit, Write, Bash, Grep, Glob, WebFetch, Agent
---

# /sparks-nextjs-security

Security orchestrator targeting OWASP Top 10 (2021) for Next.js apps. Two modes mirror the a11y orchestrator: - **Audit mode** (default): each sub-auditor produces a findings report

## Steps

1. Parse the PBI reference from $ARGUMENTS (or task description if no PBI).
2. Invoke the **ado-context** skill (`.claude/skills/ado-context/SKILL.md`) to fetch PBI details.
3. If PBI mentions a Figma URL, invoke **figma-context**.
4. Launch the **nextjs-security-orchestrator** agent via the Agent tool. The orchestrator handles routing to sub-agents.
5. Stream telemetry to `.sparks/telemetry/<run-id>.jsonl`.

## Usage

`/sparks-nextjs-security AB#42`     # explicit PBI
`/sparks-nextjs-security <task description>`  # ad-hoc task without a PBI