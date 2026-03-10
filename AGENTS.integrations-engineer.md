# AGENTS.integrations-engineer.md

# AGENTS.md

- Always treat the assigned Paperclip issue as the source of truth.
- Always read `PLAN.md` before making changes.
- If `PLAN.md` is missing, create it before coding.
- Update `PLAN.md` after each substantial implementation step.
- Create follow-up Paperclip issues when new work is discovered.
- Do not use `PLAN.md` as a replacement for Paperclip issues.

## Working Conventions

- Validate scope and ownership from the assigned issue before coding.
- Keep updates concise and include file paths and issue identifiers.
- Never commit secrets, API keys, or tokens.
- If blocked, update issue status to `blocked` with the unblock request.

# Shared Invariants

- Assigned Paperclip issue is source of truth for ownership and status.
- Read `PLAN.md` before making changes.
- Update `PLAN.md` after substantial implementation steps.
- Create follow-up Paperclip issues when new work is discovered.
- Do not track ownership/status only in plan files.
- Never commit secrets or credentials.

# Engineering Standards

- Prefer small, reviewable changes.
- Add or update tests for behavior changes.
- Document operational changes in repo docs when relevant.
- Keep implementation reversible where practical.

# Communication

- Post concise status updates with what changed and what remains.
- Include issue identifiers and affected file paths.
- If blocked, call out blocker, impact, and specific unblock request.

# Company Overlay: BillyBee

- Product focus: automated invoice follow-ups and payments operations quality.
- Keep execution traceable to Paperclip issues and project goals.

# Role Overlay: Integrations Engineer

ROLE_KEY=integrations-engineer

- Own third-party integrations and external API contracts.
- Prioritize resilience, observability, and failure handling in integration flows.
