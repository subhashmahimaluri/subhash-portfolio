---
kind: skill
id: ado-context
version: 0.1.0
status: stable
mcp: ado
backend:
  autonomous: rest-client.ts
  ide: mcp-config.json
---

# Skill: ado-context

## Description
Fetch the full context of an Azure DevOps work item (PBI, Bug, Task) by ID. Returns title, description (HTML-stripped to Markdown), acceptance criteria, tags, state, parent epic, attachments, and Figma URLs found in the description.

## Inputs
- `pbi_id`: string — required — e.g. `AB#42`, `123`, or full URL
- `include_parent`: bool — optional — default true; also fetch parent epic for higher-level context
- `include_comments`: bool — optional — default false; fetch discussion thread (token-heavy)

## Outputs
Returns `IntegrationContext` with:
- `content.title` — work item title
- `content.body` — Markdown-rendered description + acceptance criteria
- `content.fields`:
  - `state`: "New" | "Active" | "Resolved" | "Closed"
  - `work_item_type`: "Product Backlog Item" | "Bug" | "Task"
  - `tags`: string[] — includes `spark-ready` if present
  - `parent_epic`: `{id, title, url}` (if `include_parent`)
  - `figma_urls`: string[] — extracted from description regex
  - `iteration_path`, `area_path`
- `content.references`: parent epic link + comment thread link
- `content.media`: attached image URLs

## Tools Needed
- **Autonomous path:** `rest-client.ts` calling ADO REST API with PAT
- **IDE path:** ADO MCP server (`@azure/mcp-server-azure-devops` or equivalent)

## Constraints
- max_runtime_seconds: 15
- fail_modes: [`not_found`, `auth_failed`, `rate_limited`, `parse_error`]
- cacheable: true (per-run, keyed on pbi_id; ttl 600s for cross-run cache if enabled)

## Authentication
- **Autonomous:** `ADO_PAT` secret in workflow env (read-only scope on Work Items)
- **IDE:** Dev's personal ADO auth (Azure CLI, browser SSO, or MCP-stored PAT)

## How it works
1. Normalize `pbi_id` — strip `AB#`, extract numeric ID from URL.
2. Call `GET /{org}/{project}/_apis/wit/workitems/{id}?$expand=relations`.
3. HTML-strip `System.Description` and `Microsoft.VSTS.Common.AcceptanceCriteria` → Markdown via a basic tag-stripping helper.
4. Regex-extract Figma URLs from description: `https://www\.figma\.com/(file|design)/[a-zA-Z0-9]+/[^\s)]+`.
5. If `include_parent`, follow `System.LinkTypes.Hierarchy-Reverse` relation → fetch parent epic.
6. If `include_comments`, GET `/comments` → append last 10 comments.
7. Return `IntegrationContext`.

## When to invoke
- First skill call in every autonomous run (orchestrator pulls PBI before routing).
- IDE path: when dev triggers "implement PBI #N" via slash command.

## Examples
```yaml
input:
  pbi_id: "AB#42"
  include_parent: true
output:
  integration_id: "ado"
  source_ref: "42"
  fetched_at: "2026-05-28T12:34:56Z"
  content:
    title: "Service fee returns wrong value for unknown order type"
    body: |
      ## Description
      The calculateServiceFee helper falls back to a wrong constant when orderType is undefined...
      
      ## Acceptance Criteria
      - AC1: returns 0 when orderType is undefined
      - AC2: existing tests still pass
      - AC3: regression test added
    fields:
      state: "Active"
      work_item_type: "Bug"
      tags: ["spark-ready", "tech-debt"]
      parent_epic:
        id: 7
        title: "Order pricing reliability"
        url: "https://dev.azure.com/.../workitems/edit/7"
      figma_urls: []
    references:
      - kind: "parent_epic"
        url: "https://dev.azure.com/.../workitems/edit/7"
        label: "Order pricing reliability"
  cache_hint:
    cacheable: true
    ttl_seconds: 600
```

## Anti-patterns
- Do NOT call this skill repeatedly within a run — cache the result.
- Do NOT include comments by default — they're noisy and token-heavy.
- Do NOT post back to ADO from this skill — that's a separate `ado-comment` skill (TBD).
