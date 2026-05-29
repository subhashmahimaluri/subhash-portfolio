# sparks (Copilot)

This repo uses the **nextjs** profile from sparks. Canonical content lives in `.sparks/` (sparse-cloned from the sparks repo). The files in `.github/agents/` and `.github/instructions/` are RENDERED — do not edit them directly. Update `sparks/` instead and run `sparks sync`.

## When the user describes a task

1. If the task references a PBI (e.g. "AB#42"), use the **ado-context** skill to fetch full PBI details.
2. If PBI description contains a Figma URL, use **figma-context** to fetch design details.
3. Invoke the **nextjs-test-orchestrator** custom agent — it will route to the right sub-agent.

## Files in this folder

- `agents/<orchestrator>.agent.md` — top-level entry points
- `agents/<category>/<agent>.agent.md` — sub-agents by category
- `instructions/*.instructions.md` — auto-applied rules

## Updating

`sparks sync` — refreshes from sparks repo and re-renders all files in this folder.