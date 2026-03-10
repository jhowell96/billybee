# BillyBee Workspace

## Paperclip Issue Persistence

Issues created in Paperclip are currently persisted only to the Paperclip database for this instance.

In the future, we may add a separate sync service to mirror issues and updates to GitHub.

## Agent Operating Model

Coding agents in this repo use:

- `AGENTS.md` for baseline operating rules.
- `PLAN.md` for execution notes and checkpoints.
- Paperclip issues as source of truth for assignment and status.

Reusable instruction templates live under `templates/`:

- `templates/shared/` for common standards.
- `templates/roles/` for role overlays.
- `templates/companies/` for company-specific policy.

Generate role-specific instruction files with:

```bash
./scripts/generate-agent-instructions.sh
```

This creates:

- `AGENTS.founding-engineer.md`
- `AGENTS.integrations-engineer.md`
- `AGENTS.qa-demo-engineer.md`

Provision or refresh local coding-agent credentials with:

```bash
export COMPANY_ID="${PAPERCLIP_COMPANY_ID:-<company-id>}"
pnpm paperclipai agent local-cli founding-engineer --company-id "$COMPANY_ID"
pnpm paperclipai agent local-cli integrations-engineer --company-id "$COMPANY_ID"
pnpm paperclipai agent local-cli qa-demo-engineer --company-id "$COMPANY_ID"
```

If `PAPERCLIP_COMPANY_ID` is not available, resolve it by calling `GET /api/agents/me` from any authenticated Paperclip shell and use the returned `companyId`.
