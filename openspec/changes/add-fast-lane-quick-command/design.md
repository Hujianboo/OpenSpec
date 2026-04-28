## Context

BlockSpec already has a schema-aware artifact workflow and generated OPSX command templates. The current fastest path, `/opsx:propose` followed by `/opsx:apply`, still creates the full planning set before implementation and asks the user to issue a second command.

The Fast Lane should fit the existing architecture instead of creating a separate planning system. It will be another managed workflow template and CLI command surface that uses the current change directory conventions, profile selection, command generation adapters, and task-progress behavior.

## Goals / Non-Goals

**Goals:**

- Provide a one-command path for small requests: record enough context, implement, optionally verify, and summarize.
- Keep the record minimal and useful: `quick.md` plus `tasks.md` when recording is enabled.
- Install `/opsx:do` with the core workflow profile so the low-friction path is visible by default.
- Add `blockspec quick` as a terminal entry point that prepares the quick change record and emits agent handoff instructions.
- Allow completed quick records to be archived as history-only records when they do not contain spec deltas.
- Escalate clearly to `/opsx:propose` when the request is risky, broad, unclear, or likely to require formal review.

**Non-Goals:**

- Replacing `/opsx:propose`, `/opsx:apply`, or the spec-driven schema.
- Building an autonomous non-agent implementation engine inside the Node CLI.
- Requiring automated tests by default for quick mode.
- Adding a new artifact schema solely for quick changes in this change.
- Requiring quick records to update main specs during archive.

## Decisions

### Decision 1: Model Fast Lane as a workflow, not a schema

Quick mode should be implemented as a managed workflow template (`quick` skill and `/opsx:do` command) plus a CLI helper, not as a full schema. The workflow can create its own minimal artifacts while reusing change directories, task checkboxes, and existing update/init generation.

Alternative considered: add a `quick` schema with `quick.md -> tasks.md -> apply`. That would make status/instructions work naturally, but it would still leave implementation as a second step and would force quick mode back into the artifact-gate model it is trying to streamline.

### Decision 2: Use `/opsx:do` for the slash command and `quick` for the workflow ID

The user-facing slash command should be short and action-oriented: `/opsx:do "<request>"`. Internally the workflow ID should be `quick` so generated paths remain understandable (`opsx-quick.md`, `openspec-quick`, etc.) while the command template text documents the `/opsx:do` invocation.

Alternative considered: use `/opsx:quick`. It is clearer mechanically, but `/opsx:do` better communicates "one sentence, start working" and avoids sounding like another planning shortcut.

### Decision 3: Keep `blockspec quick` as an agent handoff command

The CLI cannot reliably edit arbitrary project code without an agent runtime. `blockspec quick "<request>"` should therefore create or skip the quick record according to flags, then print concise instructions the user can paste or that generated agent commands can follow. This keeps the CLI deterministic and cross-platform.

Alternative considered: make the CLI directly implement changes. That would duplicate agent behavior, require project-specific execution logic, and violate the existing separation between CLI scaffolding and AI implementation.

### Decision 4: Thin artifacts with explicit completion summary

Recorded quick changes should create:

- `quick.md` with request, mode, escalation check, implementation summary, verification summary, and notes.
- `tasks.md` with 3-5 checkbox tasks that the agent marks complete during implementation.

The agent may update `quick.md` after implementation. Full `proposal.md`, `design.md`, and spec deltas are created only when escalation occurs.

### Decision 5: Escalation happens before code edits

The workflow template should instruct the agent to classify the request before editing. Escalation is required for auth, payment, database migrations, data deletion, permissions, public APIs, broad multi-file churn, unclear acceptance criteria, or any situation where verification is necessary before the agent can proceed responsibly.

### Decision 6: Archive quick records as history-only when no spec deltas exist

Recorded quick changes should be archiveable by the normal archive command after their tasks are complete. When a quick record contains `quick.md` and `tasks.md` but no `specs/` delta files, archive should skip spec update discovery and confirmation automatically, move the change into `openspec/changes/archive/`, and report that no main specs were updated.

This is intentionally equivalent to the safe part of `archive --skip-specs`, but scoped to quick records with no spec deltas. If a quick workflow escalates and produces formal spec deltas, the existing archive process still applies those deltas normally.

## Risks / Trade-offs

- [Risk] Quick mode can under-document work that later matters. Mitigation: keep `quick.md` mandatory by default and require escalation for high-risk categories.
- [Risk] Users may assume default quick mode verifies everything. Mitigation: document that default quick mode does not run tests; `--verify` requests a lightweight relevant check.
- [Risk] `blockspec quick` may be mistaken for a direct implementation engine. Mitigation: CLI help and output must state that implementation is performed by the AI assistant workflow.
- [Risk] Adding `/opsx:do` to core increases command surface area. Mitigation: keep the template focused and reuse the existing profile/update machinery.
- [Risk] History-only archive could hide a change that should have updated specs. Mitigation: quick escalation rules send spec-relevant product or API changes through the formal workflow, and archive only auto-skips specs when no delta files exist.

## Migration Plan

1. Add the quick workflow template and exports.
2. Register `quick` in workflow profile constants and default core workflow selection.
3. Add the `quick` CLI command and tests for record/no-record/verify output paths.
4. Update archive handling and tests so quick records without spec deltas archive cleanly as history-only changes.
5. Update init/update generation tests to include the quick workflow in managed artifacts.
6. Update documentation and README quick path examples.

Rollback is straightforward: remove `quick` from the core profile, remove the command/template exports, and update docs. Existing quick change directories can remain as historical notes.

## Open Questions

- Should `/opsx:quick` be provided as a documented alias for tools where command names are less flexible, or should `/opsx:do` remain the only public slash name?
- Should quick records use timestamped names by default (`quick-YYYYMMDD-topic`) or a derived kebab-case topic without a date when the request is specific?
