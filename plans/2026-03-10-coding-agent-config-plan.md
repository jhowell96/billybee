# Coding Agent Config Plan (BILAAA-10)

## Objective
Define and stage a repeatable setup for local coding agents (`founding-engineer`, `integrations-engineer`, `qa-demo-engineer`) using `paperclipai agent local-cli`, with repo-level conventions (`AGENTS.md`, `PLAN.md`) and reusable templates for role-specific instructions.

## Scope
- In scope: setup commands, repo file conventions, template strategy, rollout order, validation checklist, and operating guardrails.
- Out of scope: executing the agent provisioning commands, writing final role prompts, or making production workflow changes.

## Deliverables
- A concrete command-and-file workflow for wiring the three local agents.
- A canonical `AGENTS.md` baseline policy set.
- A `PLAN.md` lifecycle process defining update cadence and ownership rules.
- A reusable template structure under `templates/` (`shared/`, `roles/`, `companies/`) with generation steps.
- A validation/runbook checklist for onboarding and future agent additions.

## Assumptions
- `pnpm` and `paperclipai` CLI are available in the operator environment.
- Company ID may be unknown at start; setup includes a discovery step before provisioning.
- Local CLI provisioning is preferred over direct manual API-key management.
- Repo root for this workflow is `invoice-chaser/` (or equivalent project root).

## Execution Plan

### Phase 1: Baseline repo conventions
1. Confirm repository root and ensure required files exist:
   - `AGENTS.md`
   - `PLAN.md`
   - `templates/shared/`
   - `templates/roles/`
   - `templates/companies/`
2. Draft `AGENTS.md` baseline policy with mandatory rules:
   - Paperclip issue is source of truth for ownership/status.
   - Always read `PLAN.md` before coding.
   - Create `PLAN.md` if missing.
   - Update `PLAN.md` after substantial implementation steps.
   - Create follow-up Paperclip issues for discovered work.
   - Do not use `PLAN.md` as a replacement for issue tracking.
3. Add a short “How this repo is operated by agents” section to `README.md` linking to `AGENTS.md` and `PLAN.md`.

### Phase 2: Provision local coding agents
1. Resolve `company-id` before provisioning:
   - Preferred: from an existing agent shell/env (`echo "$PAPERCLIP_COMPANY_ID"`).
   - Fallback: call API from any authenticated Paperclip context (`GET /api/agents/me`) and read `companyId`.
   - Save to shell variable for reuse: `export COMPANY_ID=<resolved-company-id>`.
2. Run local-cli provisioning for each role:
   - `pnpm paperclipai agent local-cli founding-engineer --company-id "$COMPANY_ID"`
   - `pnpm paperclipai agent local-cli integrations-engineer --company-id "$COMPANY_ID"`
   - `pnpm paperclipai agent local-cli qa-demo-engineer --company-id "$COMPANY_ID"`
   - If `COMPANY_ID` is still unavailable, stop and open a Paperclip issue to unblock access rather than guessing.
3. Capture each command output in secure operator notes (not committed):
   - `PAPERCLIP_API_URL`
   - `PAPERCLIP_COMPANY_ID`
   - `PAPERCLIP_AGENT_ID`
   - `PAPERCLIP_API_KEY`
4. Verify skill installation targets:
   - `~/.codex/skills`
   - `~/.claude/skills`
5. Validate each agent identity via a low-risk command (e.g., `GET /api/agents/me` through the configured environment).

### Phase 3: Implement reusable prompt/config system
1. Create shared templates in `templates/shared/` for:
   - Paperclip workflow invariants.
   - Repo coding standards and test requirements.
   - Communication and status update conventions.
2. Create role overlays in `templates/roles/`:
   - `founding-engineer.md`
   - `integrations-engineer.md`
   - `qa-demo-engineer.md`
3. Create company/project overlays in `templates/companies/` for org-specific rules.
4. Define a deterministic generation process (script or manual assembly doc) to compose:
   - shared + role + company overlays -> role-specific `AGENTS.<role>.md` (or equivalent).
5. Keep canonical shared guidance in one place to reduce drift and simplify updates.

### Phase 4: Plan governance and update mechanics
1. Initialize `PLAN.md` with sections:
   - Current goals
   - Active tasks/issues
   - Decisions and rationale
   - Risks/blockers
   - Next checkpoint
2. Define update triggers:
   - After each substantial implementation step
   - At handoffs between agents
   - When scope changes
3. Require every plan update to reference related Paperclip issue identifiers.
4. Add stale-plan guardrail: if plan and issue diverge, issue state wins and plan must be corrected immediately.

### Phase 5: Validation and rollout readiness
1. Dry-run checklist:
   - All three agents provision successfully.
   - Required env vars emitted for each.
   - Skills installed in both Codex and Claude skill directories.
   - `AGENTS.md` and `PLAN.md` exist and contain required policy text.
   - Template composition process documented and repeatable.
2. Risk checks:
   - Secrets handling: API keys never committed.
   - Drift control: changes to shared conventions require updating generated role files.
   - Ownership clarity: Paperclip issue assignment always reflects who acts next.
3. Sign-off output:
   - “Ready to execute” summary with prerequisites met, open risks, and first execution owner.

## Verification: Correct Agent -> Correct Instructions
1. Add explicit role headers to each role overlay (`templates/roles/*.md`) and include a unique marker per role (for example `ROLE_KEY=founding-engineer`).
2. Generate role-specific instruction files with deterministic names:
   - `AGENTS.founding-engineer.md`
   - `AGENTS.integrations-engineer.md`
   - `AGENTS.qa-demo-engineer.md`
3. For each agent, set the instructions path to the matching file via API:
   - `PATCH /api/agents/{agentId}/instructions-path` with the role-specific path.
4. Validate mapping by running each agent and checking:
   - `GET /api/agents/me` reports the expected agent identity.
   - The first action/log line includes that role's unique marker.
   - A controlled test issue assigned to that agent is handled using role-appropriate behavior.
5. Add a lightweight regression check:
   - Re-run one smoke issue per role after any shared template change.
   - If behavior mismatches role markers, block rollout and fix template composition before further work.

## Risks and Mitigations
- Risk: inconsistent role instructions over time.
  - Mitigation: generate role files from shared templates and track source templates as canonical.
- Risk: operators leak API keys in logs/docs.
  - Mitigation: explicit non-commit rule and secure storage procedure.
- Risk: `PLAN.md` diverges from issue state.
  - Mitigation: enforce issue-first policy in `AGENTS.md` and review in every heartbeat.

## Success Criteria
- Three local agents can be provisioned repeatably with one command each.
- Repo has clear, enforced conventions (`AGENTS.md`, `PLAN.md`) that align with Paperclip governance.
- Role-specific instructions are generated from reusable templates with minimal duplication.
- Team has a documented readiness checklist and no blocker for implementation execution.

## Handoff
After board/user review, next execution issue should implement Phase 1 and Phase 3 first (repo conventions + template scaffolding), then Phase 2 provisioning, then Phase 4/5 validation and rollout sign-off.
