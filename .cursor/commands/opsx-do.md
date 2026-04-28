---
name: /opsx-do
id: opsx-do
category: Workflow
description: "Fast Lane: implement a lightweight change immediately with a minimal record"
---

Fast Lane implementation for lightweight changes.

Use this when the user invokes `/opsx:do "<request>"` or asks for a quick, one-step implementation.

**Input**: A plain-language request. Optional flags may be included:
- `--no-record`: implement directly without creating a change record
- `--verify`: run a lightweight relevant check after implementation when one can be inferred

**Steps**

1. **Understand the request**
   - If no request is provided, ask: "What change do you want to build or fix?"
   - Do not create files or edit code until the request is clear.

2. **Escalate before editing when needed**

   Stop quick mode and recommend `/opsx:propose "<request>"` followed by `/opsx:apply` when the request touches:
   - authentication, authorization, permissions, payments, database migrations, data deletion, public APIs, or security-sensitive behavior
   - broad changes across many files
   - unclear acceptance criteria
   - work that needs design review or test coverage before implementation

3. **Create or reuse the quick record**

   Unless `--no-record` is present:
   - Create `openspec/changes/quick-YYYYMMDD-<topic>/quick.md`
   - Create `openspec/changes/quick-YYYYMMDD-<topic>/tasks.md`
   - If the user or CLI handoff names an existing quick change, reuse that directory instead of creating a duplicate.

   `quick.md` should include:
   - Request
   - Mode (recorded/no-record, verify requested or not)
   - Escalation decision
   - Implementation Summary
   - Verification
   - Notes

   `tasks.md` should contain 3-5 checkbox tasks. Mark each task complete as soon as it is done.

4. **Implement immediately**

   Make the requested code change in the same interaction. Keep edits small and focused.

5. **Verify only when requested or clearly necessary**

   Default quick mode does not run tests. If `--verify` is present, infer and run one lightweight relevant check when possible. If no check can be inferred, explain that clearly and record the reason in `quick.md`.

6. **Finish**

   Update `quick.md` with implementation and verification notes. Summarize changed files, checks run, and whether a record was created.

**Archive behavior**

Completed quick records can be archived with `/opsx:archive <quick-change-name>`. If the record has no `specs/` delta files, archive moves it to history without updating main specs.

**Guardrails**
- Do not use quick mode for high-risk work.
- Do not run broad test suites by default.
- Do not create proposal/design/spec artifacts unless escalating to the formal workflow.
- Do not leave recorded tasks unchecked after completing them.
