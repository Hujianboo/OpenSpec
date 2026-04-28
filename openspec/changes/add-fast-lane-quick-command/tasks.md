## 1. Workflow Template and Profile Registration

- [x] 1.1 Add a quick workflow template module under `src/core/templates/workflows/` with both skill and command template exports.
- [x] 1.2 Write `/opsx:do` instructions covering recorded mode, `--no-record`, `--verify`, task completion, summary output, and escalation before edits.
- [x] 1.3 Export quick templates from `src/core/templates/skill-templates.ts` and include the quick workflow in `getSkillTemplates()` / `getCommandContents()` lookup logic.
- [x] 1.4 Add `quick` to `CORE_WORKFLOWS`, `ALL_WORKFLOWS`, and related workflow ID typing so init/update can manage it explicitly.

## 2. CLI Quick Command

- [x] 2.1 Add a `blockspec quick <request>` Commander command with `--no-record` and `--verify` options.
- [x] 2.2 Implement recorded quick scaffolding with cross-platform path APIs, creating `quick.md` and `tasks.md` placeholders in a derived quick change directory.
- [x] 2.3 Implement `--no-record` behavior so no files are written and direct agent handoff instructions are printed.
- [x] 2.4 Ensure `--verify` is reflected in generated placeholders and handoff output without running project tests from the CLI.
- [x] 2.5 Handle missing request, invalid derived change names, and existing quick change directories with clear non-destructive errors.

## 3. Init, Update, and Command Generation

- [x] 3.1 Update init generation expectations so selected tools receive quick workflow artifacts as part of the core profile.
- [x] 3.2 Update refresh/removal logic so `blockspec update` creates, refreshes, skips, or removes quick artifacts by explicit `quick` workflow ID.
- [x] 3.3 Verify all command adapters generate stable quick command paths and frontmatter while sharing the same quick command body.
- [x] 3.4 Confirm tools with special command naming still expose the user-facing command as `/opsx:do` in the generated instructions.

## 4. Archive Behavior

- [x] 4.1 Update archive handling so quick records with no spec deltas are archived as history-only changes without spec update prompts.
- [x] 4.2 Preserve normal spec update behavior when a quick record contains `specs/` delta files.
- [x] 4.3 Preserve existing incomplete-task confirmation for quick records before moving them to archive.
- [x] 4.4 Add archive tests for quick records with no specs, quick records with specs, and incomplete quick tasks.

## 5. Documentation

- [x] 5.1 Update `README.md` to describe Fast Lane alongside the default proposal/apply path.
- [x] 5.2 Update `docs/opsx.md` and `docs/commands.md` with `/opsx:do` behavior, defaults, flags, examples, escalation rules, and quick record archive behavior.
- [x] 5.3 Update `docs/cli.md` with `blockspec quick`, `--no-record`, `--verify`, archive behavior, and the agent handoff model.

## 6. Verification

- [x] 6.1 Add unit tests for quick template registration, command content lookup, and core profile inclusion.
- [x] 6.2 Add CLI tests for `quick` recorded mode, `--no-record`, `--verify`, missing request, duplicate directory handling, and cross-platform path expectations.
- [x] 6.3 Add init/update tests proving quick artifacts are generated, refreshed idempotently, and removed when deselected.
- [x] 6.4 Add archive tests proving quick records are history-only when no spec deltas exist.
- [x] 6.5 Run targeted tests for modified modules.
- [x] 6.6 Run `pnpm test` or document why full verification was not run. Full suite was run and currently fails in existing environment/branding-sensitive tests unrelated to quick; see implementation summary.
