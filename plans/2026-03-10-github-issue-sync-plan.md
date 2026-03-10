# Plan: Paperclip Issue Sync to GitHub Issues

Date: 2026-03-10
Owner: CEO
Source issue: BILAAA-6

## Goal
Add optional, explicit one-way sync from Paperclip issues/comments/status updates to GitHub Issues for configured projects/repositories.

## Scope (V1)
- One-way: Paperclip -> GitHub.
- Sync events:
  - issue create
  - issue title/description/priority/status updates
  - new Paperclip issue comments
- Per-project opt-in configuration.
- Reliable retries and operator-visible failure states.

## Out of Scope (V1)
- GitHub -> Paperclip reverse sync.
- Historical backfill of old issues (except optional manual command).
- Cross-repo fanout from a single issue.

## Architecture
1. Configuration model
- Add project-level GitHub sync config:
  - `enabled`
  - `owner`
  - `repo`
  - `labelPrefix` (optional)
  - `syncStatuses` map (Paperclip -> GitHub labels/state)
- Store GitHub token in existing secrets provider, referenced by key id (not plaintext in DB).

2. Data model
- Add link table mapping Paperclip issue to GitHub issue:
  - `paperclipIssueId`
  - `githubRepo`
  - `githubIssueNumber`
  - `githubIssueNodeId`
  - timestamps + lastSync metadata
- Add outbound event/outbox table for reliable delivery:
  - event type, payload, dedupe key, status, retry count, next retry at.

3. Event production
- In issue/comment mutation paths, emit domain events into outbox inside same transaction where feasible.
- Event types:
  - `issue.created`
  - `issue.updated`
  - `issue.comment.created`

4. Delivery worker
- Background worker polls pending outbox rows and calls GitHub REST API.
- Idempotency via dedupe keys and upsert behavior.
- Retry with bounded exponential backoff; terminal failures moved to dead-letter status.

5. GitHub mapping rules
- Title: direct mapping from Paperclip issue title.
- Body: include Paperclip description + metadata block (identifier, URLs, company/project).
- Status:
  - `done/cancelled` -> close issue.
  - reopened Paperclip statuses -> reopen issue.
- Priority labels:
  - add labels like `paperclip:priority:high`.

6. API + UI
- Add project settings endpoints/UI for GitHub sync config and secret key reference.
- Add issue detail UI metadata showing linked GitHub issue URL and last sync state.
- Add admin endpoint/UI for outbox health (queued/failed counts).

7. Observability and governance
- Activity log entries for sync configuration changes and significant sync failures.
- Structured logs with issue id + GitHub issue number.
- Metrics: success rate, retry count, dead-letter count, sync latency.

8. Security
- Use least-privilege GitHub token scopes.
- Keep token only in encrypted secrets storage.
- Validate repo ownership format and reject unsafe config.

## Implementation Steps
1. Schema and shared contracts
- Add DB tables + migrations.
- Export schema and shared types/validators/constants.

2. Server domain changes
- Add config CRUD endpoints (company/project scoped).
- Add outbox writer in issue/comment mutation services.
- Add worker process and delivery client.

3. UI changes
- Project settings page for sync enable/config.
- Issue page GitHub link + sync status.

4. Tests
- Unit tests for mapping logic and retry policy.
- Integration tests for outbox enqueue and issue lifecycle sync.
- Contract tests for config endpoints.

5. Rollout
- Ship behind feature flag per project.
- Enable on one internal project first.
- Monitor for 48 hours before wider enablement.

## Risks and Mitigations
- Duplicate GitHub issues due to retries: use dedupe keys + persisted link table.
- API rate limits: retry with backoff + jitter; batch where possible.
- Drift between systems: expose manual "resync issue" action and reconciliation tooling.

## Effort Estimate
- Engineering: 4-6 days for V1 (schema, server, worker, UI, tests).
- Validation + staged rollout: 1-2 additional days.
