---
kind: skill
id: format-pr
version: 0.2.0
status: stable
---

# Skill: format-pr

## Description
Generate the PR title and body from the agent's scratchpad memory, telemetry summary, and self-eval result. This is the last skill before the PR is opened. Outputs a single Markdown body — does NOT call the git/GH API itself.

## Inputs
- `pbi_id`: string — required — e.g. `AB#42`, `JIRA-123`
- `pbi_title`: string — required
- `pbi_url`: string — required — link back to source system
- `hypothesis`: string — required — from scratchpad
- `files_touched`: list[string] — required
- `lines_changed`: `{added: int, removed: int}` — required
- `self_eval_result`: object — required — output from `self-evaluate@0.1.0`
- `telemetry_summary`: object — required — rendered from `telemetry/schema.md`
- `mcp_context`: object — optional — Figma/ADO context fetched during run (links + thumbnails)

## Outputs
- `pr_title`: string — under 70 chars, ends with `(<pbi_id>)`
- `pr_body`: string — Markdown body
- `branch_name`: string — suggested branch name (`spark/<profile>/<slugified-title>-<pbi_id_lower>`)

## Tools Needed
- None — pure templating

## Constraints
- max_runtime_seconds: 5
- fail_modes: [`missing_required_input`]
- cacheable: false

## Body template

```markdown
## Summary
<one-paragraph hypothesis + what was changed>

## PBI
<pbi_url> — <pbi_title>

## Hypothesis
<full hypothesis from scratchpad>

## Files touched (<count>)
- `<path>` — <inline change summary>
- ...

## Self-evaluation
<self_eval_result.summary>

| Criterion | Result | Confidence |
|---|---|---|
| <criterion> | ✅ / ❌ | <0..1> |

## Test plan
- [ ] <how reviewer can verify>
- [ ] <regression test added at <path>:<line>>

<!-- MCP context (only if mcp_context present) -->
## Design / context references
- Figma: <node_url> (rendered at <thumbnail_url>)
- ADO parent epic: <epic_url>

<!-- Flow 3 resume hooks — added by telemetry sink as a PR comment, not body.
     The body should NOT include the run-id-dependent resume command because
     the body is written before the workflow run id is finalized. The PR
     comment sink (pr-comment.md) handles the resume guidance with the live
     run id and PR number. -->

---
<details>
<summary>sparks telemetry</summary>

<inline telemetry summary table>

</details>

Fixes <pbi_id>
```

## Companion: telemetry PR comment (flow 3 handoff)

For autonomous runs, a SEPARATE comment is posted by the telemetry sink (see
`telemetry/sinks/pr-comment.md`). That comment carries the resume command:

```markdown
<!-- sparks-telemetry -->
### 🔮 sparks run summary

| Field | Value |
|---|---|
| Run ID | `<run-id>` |
| Self-eval verdict | `PASS|FAIL` |
| ...

### 🔁 Resume this PR in your IDE (flow 3)

If self-eval failed or review found issues, pick up where the cloud agent
left off without re-spending tokens:

\`\`\`bash
node --experimental-strip-types --no-warnings .sparks/cli/sparks-resume.ts <pr#>
\`\`\`
```

Why split body and comment: PR body is written BEFORE the PR exists (no PR#
available), comment is posted AFTER (PR# known). Keeping them split also
keeps the agent's narrative (body) separate from operational metadata
(comment).

## Title template
`<verb-prefix> <short-description> (<pbi_id>)`

Verb prefixes by profile:
- `ui`: `feat:`, `fix:`, `style:`, `refactor:`
- `qa`: `test:`, `qa:`
- `bff`: `feat:`, `fix:`
- `backend`: `feat:`, `fix:`, `perf:`

Auto-selected from agent category. Override possible via agent frontmatter.

## When to invoke
- Always last skill before PR creation.
- After `self-evaluate@0.1.0` returns `passed: true` OR `should_retry: false`.

## Anti-patterns
- Do NOT include LLM cost or run_id in PR title — those go in the body footer.
- Do NOT exceed 70 chars in title — GitHub truncates.
- Do NOT omit the `Fixes <pbi_id>` line — Azure Boards GitHub App needs it for auto-linking.
