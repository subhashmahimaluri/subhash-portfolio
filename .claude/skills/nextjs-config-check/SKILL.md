---
kind: skill
id: nextjs-config-check
version: 0.1.0
status: stable
---

# Skill: nextjs-config-check

## Description
Inspect `package.json`, `next.config.{js,ts,mjs}`, `tsconfig.json`, and the presence of `app/` vs `pages/` directories to determine the Next.js feature set + project conventions. Returns a structured config snapshot the agent can use to make better decisions (e.g. "this project uses App Router so I'll create `app/<route>/page.tsx`, not `pages/<route>.tsx`").

## Inputs
- `repo_root`: string — optional — default `cwd`

## Outputs
- `version`: string — Next.js semver (`14.2.0`, `15.0.0`, etc.)
- `router`: enum — `app` | `pages` | `mixed`
- `language`: enum — `typescript` | `javascript`
- `package_manager`: enum — `pnpm` | `npm` | `yarn` | `bun`
- `auth_library`: enum — `next-auth` | `auth-js` | `clerk` | `lucia` | `iron-session` | `custom` | `none`
- `db_layer`: enum — `prisma` | `drizzle` | `kysely` | `mongoose` | `raw` | `none`
- `validation_lib`: enum — `zod` | `valibot` | `yup` | `none`
- `test_runner`: enum — `vitest` | `jest` | `none`
- `e2e_runner`: enum — `playwright` | `cypress` | `none`
- `tailwind`: bool
- `coverage_threshold_lines`: int | null
- `experimental_features`: list[string] — `serverActions`, `ppr`, etc.
- `aliases`: Record<string, string> — TS path aliases (`@/`, `~/`)

## Tools Needed
- `read-file` (already in skill chain)

## Constraints
- max_runtime_seconds: 5
- fail_modes: [`no-package-json`, `parse-error`]
- cacheable: true (per-run; the config doesn't change mid-run)

## When to invoke
- First call in every `nextjs-*-orchestrator` run
- Before deciding between App Router vs Pages Router code generation
- Before deciding which validation / auth / DB pattern to follow

## How it works
1. `read-file` `package.json` → extract dependencies map.
2. Detect Next version from `dependencies.next`.
3. Detect router by checking for `app/` directory existence + `pages/` directory existence.
4. Detect TS by presence of `tsconfig.json` + `*.ts/tsx` files.
5. Detect package manager by lockfile (`pnpm-lock.yaml` → pnpm, `yarn.lock` → yarn, `bun.lockb` → bun, else npm).
6. Detect auth library by package name in dependencies.
7. Detect DB layer + validation + test runner the same way.
8. `read-file` `next.config.{js,ts,mjs}` → parse experimental flags.
9. `read-file` `vitest.config.{ts,js}` if present → extract coverage threshold.
10. `read-file` `tsconfig.json` → extract `compilerOptions.paths`.
11. Return structured snapshot.

## Examples

```yaml
input:
  repo_root: "."
output:
  version: "15.0.3"
  router: "app"
  language: "typescript"
  package_manager: "pnpm"
  auth_library: "next-auth"
  db_layer: "prisma"
  validation_lib: "zod"
  test_runner: "vitest"
  e2e_runner: "playwright"
  tailwind: true
  coverage_threshold_lines: 90
  experimental_features: ["ppr"]
  aliases:
    "@/*": "./src/*"
```

## Anti-patterns
- Do NOT execute build commands as part of this skill — pure file reads
- Do NOT speculate about config that isn't explicitly declared — return `none` / `null` when unknown
- Do NOT cache results across runs — config can change between PBIs
