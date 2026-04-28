## Why

The current BlockSpec happy path still asks users to stop after planning and manually invoke `/opsx:apply`, which feels too heavy for small, low-risk edits. We need a Fast Lane that preserves minimal change context while letting users start from one plain-language request and finish with implemented code.

## What Changes

- Add a quick workflow for small changes that creates a minimal change record, generates a short task list, implements immediately, marks completed tasks, and summarizes the result.
- Expose the workflow as `/opsx:do "<request>"` in AI coding assistants.
- Add a terminal-facing `blockspec quick "<request>"` command that creates the minimal quick change record and prints the agent handoff instructions for implementation.
- Support quick-mode flags:
  - `--no-record` skips change creation and performs a direct agent implementation path.
  - `--verify` asks the agent to run a lightweight relevant check after implementation.
- Default quick mode does not require proposal review, does not require a full `design.md`, and does not run tests unless `--verify` is provided or the agent escalates.
- Add automatic escalation rules so quick mode stops before implementation and recommends the formal proposal/apply flow for high-risk, broad, unclear, or policy-sensitive work.
- Keep quick artifacts intentionally thin, using `quick.md` and `tasks.md` instead of the full proposal/spec/design set.

## Capabilities

### New Capabilities

- `quick-change-workflow`: Fast Lane workflow for lightweight changes that creates minimal records, implements immediately, optionally verifies, and escalates to the formal flow when risk is too high.

### Modified Capabilities

- `cli-init`: Core workflow setup includes the quick workflow so supported tools get `/opsx:do` during initialization.
- `cli-update`: Updating managed workflow files refreshes or removes the quick workflow consistently with the active profile.
- `command-generation`: Shared command content and adapters support the new `do` workflow ID across generated command surfaces.
- `cli-archive`: Archive can move completed quick records without requiring spec deltas or updating main specs.

## Impact

- `src/cli/index.ts` and `src/commands/` - add `quick` command wiring and implementation.
- `src/core/templates/workflows/` - add quick workflow skill and `/opsx:do` command templates.
- `src/core/templates/skill-templates.ts` - export quick templates.
- `src/core/profiles.ts` - include quick in the core profile and all workflow IDs.
- `src/core/init.ts` and `src/core/update.ts` - generate, refresh, and remove quick workflow artifacts according to profile and delivery settings.
- `src/core/archive.ts` - archive quick records as history-only changes when they have no spec deltas.
- `src/core/command-generation/` adapters - ensure the `do` workflow ID maps cleanly to each tool's command path and frontmatter.
- `docs/opsx.md`, `docs/commands.md`, `docs/cli.md`, and `README.md` - document Fast Lane behavior, flags, defaults, and escalation rules.
- Tests for quick command behavior, generated workflow content, profile inclusion, archive behavior, update idempotence, and escalation guidance.
