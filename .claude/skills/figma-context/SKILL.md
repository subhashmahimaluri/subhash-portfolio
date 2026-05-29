---
kind: skill
id: figma-context
version: 0.1.0
status: stable
mcp: figma
backend:
  autonomous: rest-client.ts
  ide: mcp-config.json
---

# Skill: figma-context

## Description
Fetch design context from a Figma URL. Returns the target node's structured data (frame hierarchy, text content, styles, component IDs) plus an image render the agent can reference. Used by UI profile agents when a PBI links to a Figma design.

## Inputs
- `figma_url`: string — required — e.g. `https://www.figma.com/design/abc123/MyFile?node-id=12-345`
- `depth`: int — optional — default 3; how deep to walk the node tree
- `include_image`: bool — optional — default true; render PNG of the target node
- `image_format`: enum — optional — `png` | `jpg` | `svg` — default png

## Outputs
Returns `IntegrationContext` with:
- `content.title` — frame/component name
- `content.body` — Markdown summary: structure tree + text content + key styles
- `content.fields`:
  - `node_id`: string
  - `file_key`: string
  - `frame_size`: `{width, height}`
  - `text_content`: list[string] — all text node contents
  - `colors`: list[string] — unique fill/stroke colors
  - `fonts`: list[`{family, size, weight}`]
  - `components`: list[`{id, name, type}`] — referenced library components
- `content.media`:
  - rendered image URL (signed, short-lived from Figma)
  - thumbnail URL

## Tools Needed
- **Autonomous path:** `rest-client.ts` calling Figma REST API with personal access token
- **IDE path:** Figma MCP server (`@figma/mcp-server` or `figma-developer-mcp`)

## Constraints
- max_runtime_seconds: 30
- max_image_size_kb: 500
- fail_modes: [`invalid_url`, `auth_failed`, `node_not_found`, `image_render_failed`]
- cacheable: true (per-run, keyed on figma_url + depth + image_format)

## Authentication
- **Autonomous:** `FIGMA_TOKEN` secret in workflow env (personal access token, file-read scope)
- **IDE:** Dev's Figma desktop app session OR personal token in MCP config

## How it works
1. Parse `figma_url` → extract `file_key` and `node-id`.
2. Call Figma REST `GET /v1/files/{file_key}/nodes?ids={node_id}&depth={depth}`.
3. Walk the returned tree:
   - Collect text nodes → `text_content`
   - Collect unique color values → `colors`
   - Collect unique font families + sizes → `fonts`
   - Collect component instances → `components`
4. Build Markdown summary: ASCII tree of frame hierarchy + text excerpts + style highlights.
5. If `include_image`, call `GET /v1/images/{file_key}?ids={node_id}&format={image_format}` → signed URL valid ~30 min.
6. Return `IntegrationContext`.

## When to invoke
- Whenever a UI profile agent encounters a Figma URL in PBI context (orchestrator detects via `ado-context.fields.figma_urls`).
- Manually by a dev in IDE path when implementing a Figma-linked story.

## Examples
```yaml
input:
  figma_url: "https://www.figma.com/design/abc123/Dashboard?node-id=12-345"
  depth: 3
output:
  integration_id: "figma"
  source_ref: "abc123:12-345"
  fetched_at: "2026-05-28T12:34:56Z"
  content:
    title: "Settings → Account → Profile"
    body: |
      ## Frame structure
      Profile (FRAME, 480×720)
      ├── Header (FRAME, 480×80)
      │   ├── BackButton (INSTANCE, IconButton)
      │   └── Title "Profile" (TEXT)
      ├── Avatar (FRAME, 120×120)
      └── Fields (FRAME, 480×400)
          ├── EmailInput (INSTANCE, TextField)
          └── SaveButton (INSTANCE, PrimaryButton)
      
      ## Text content
      - "Profile"
      - "Email address"
      - "Save changes"
      
      ## Styles
      - Colors: #0A0A0A (text), #FF6B35 (button), #F5F5F5 (bg)
      - Fonts: Inter 14/500, Inter 24/700
    fields:
      node_id: "12:345"
      file_key: "abc123"
      frame_size: {width: 480, height: 720}
      text_content: ["Profile", "Email address", "Save changes"]
      colors: ["#0A0A0A", "#FF6B35", "#F5F5F5"]
      fonts:
        - {family: "Inter", size: 14, weight: 500}
        - {family: "Inter", size: 24, weight: 700}
      components:
        - {id: "100:1", name: "IconButton", type: "INSTANCE"}
        - {id: "100:2", name: "TextField", type: "INSTANCE"}
        - {id: "100:3", name: "PrimaryButton", type: "INSTANCE"}
    media:
      - kind: "image"
        url: "https://figma-renders.s3.amazonaws.com/.../signed-url.png"
        alt: "Profile screen render"
  cache_hint:
    cacheable: true
    ttl_seconds: 1800
```

## Anti-patterns
- Do NOT walk `depth > 5` — token blow-up on dense designs.
- Do NOT include image when only structure is needed (saves render time).
- Do NOT call this skill for URLs that aren't `figma.com/design/...` or `figma.com/file/...`.
