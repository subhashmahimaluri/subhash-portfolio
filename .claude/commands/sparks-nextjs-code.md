---
description: Run the nextjs-code-orchestrator on a PBI
allowed-tools: Read, Edit, Write, Bash, Grep, Glob, WebFetch, Agent
---

# /sparks-nextjs-code

Top-level Next.js feature orchestrator. Reads the PBI, optionally fetches Figma context, then routes implementation to specialist sub-agents covering pages, Server Components, Client Components, Server Actions, and Route Handlers. App Router (Next.js 13+) is assumed; fall back to Pages Router only if the repo lacks an `app/` directory.

## Steps

1. Parse the PBI reference from $ARGUMENTS (or task description if no PBI).
2. Invoke the **ado-context** skill (`.claude/skills/ado-context/SKILL.md`) to fetch PBI details.
3. If PBI mentions a Figma URL, invoke **figma-context**.
4. Launch the **nextjs-code-orchestrator** agent via the Agent tool. The orchestrator handles routing to sub-agents.
5. Stream telemetry to `.sparks/telemetry/<run-id>.jsonl`.

## Usage

`/sparks-nextjs-code AB#42`     # explicit PBI
`/sparks-nextjs-code <task description>`  # ad-hoc task without a PBI