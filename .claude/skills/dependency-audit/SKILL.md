---
kind: skill
id: dependency-audit
version: 0.1.0
status: stable
---

# Skill: dependency-audit

## Description
Inspect `package.json` + lockfile to report on dependency health: known CVEs, outdated majors, unused deps, and "secret-name" deps (deps whose function the agent should know — auth, validation, testing). Diagnostic-only — does NOT modify package.json.

## Inputs
- `severity_filter`: enum — `all` | `high+` | `critical+` — default `high+`

## Outputs
- `cve_findings`: list of `{package, version, cve_id, severity, fixed_in}`
- `outdated_majors`: list of `{package, current, latest, ecosystem_risk}` — risk: `low | medium | high`
- `unused`: list[string] — packages in dependencies but not imported anywhere
- `phantom`: list[string] — packages imported but not declared in dependencies
- `security_sensitive`: list[string] — auth / crypto / db packages with versions noted

## Tools Needed
- `Bash` (to run `pnpm audit` / `npm audit` / `yarn audit`)
- `codebase-search` to check unused/phantom

## Constraints
- max_runtime_seconds: 60
- fail_modes: [`no-lockfile`, `audit-network-error`, `parse-error`]
- cacheable: true (per-run; deps don't change mid-run)

## When to invoke
- Pre-deploy security pass (via `nextjs-security-orchestrator`)
- After a dependency PR
- Periodically for hygiene

## How it works
1. Detect package manager from lockfile.
2. Run `pnpm audit --json` (or equivalent) — extract findings filtered by severity.
3. Run `pnpm outdated --json` — find majors that are behind.
4. For each declared dep: `codebase-search` for `import X from 'package'` patterns; if no match, mark unused.
5. For each phantom import (`@/` doesn't count): mark phantom.
6. Highlight auth / crypto / db packages with version + ecosystem context.

## Examples

```yaml
output:
  cve_findings:
    - package: "axios"
      version: "0.27.0"
      cve_id: "GHSA-wf5p-g6vw-rhxx"
      severity: "high"
      fixed_in: "0.28.0"
  outdated_majors:
    - package: "next-auth"
      current: "4.24.5"
      latest: "5.0.0"
      ecosystem_risk: "high"  # major auth library change
    - package: "react"
      current: "18.3.1"
      latest: "19.0.0"
      ecosystem_risk: "high"
  unused: ["lodash"]
  phantom: []
  security_sensitive:
    - "next-auth@4.24.5"
    - "@prisma/client@5.20.0"
    - "zod@3.23.8"
```

## Anti-patterns
- Do NOT modify `package.json` — that's a separate agent's responsibility (and a safety-rail forbids it for most agents)
- Do NOT recommend major upgrades without ecosystem-risk context (e.g. NextAuth v4 → v5 is a rewrite)
- Do NOT flag dev deps as unused if they're used in scripts (e.g. eslint, prettier)
- Do NOT skip the network-error branch — `pnpm audit` can flake
