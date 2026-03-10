# PLAN.md

This file tracks execution details. Paperclip issues remain the source of truth for ownership and status.

## Current Goals

- Implement reusable coding-agent configuration and instruction templates.
- Ensure role-specific instruction files are generated and mapped correctly.

## Active Tasks/Issues

- `BILAAA-10`: Coding Agent Config (execution in progress this update cycle).

## Decisions and Rationale

- Canonical guidance lives in `templates/shared/` to minimize drift.
- Role-specific behavior lives in `templates/roles/` and is merged into generated role files.
- Company policy lives in `templates/companies/` for organization-specific overlays.
- Generated files are deterministic: `AGENTS.<role>.md`.

## Risks/Blockers

- Manual edits to generated role files can cause drift from templates.
- Instructions-path mapping must stay aligned with generated filenames.

## Next Checkpoint

- Verify each coding agent points to its matching `AGENTS.<role>.md` instructions file.
- Run one smoke issue per role after template updates.

## Update Log

- 2026-03-10: Initialized file as part of `BILAAA-10` implementation.
