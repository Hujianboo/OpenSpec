## ADDED Requirements

### Requirement: Task label definitions
The TDD schema's tasks template and instruction SHALL define 5 task labels with specific semantics.

#### Scenario: RED label defined
- **WHEN** the TDD tasks instruction is read
- **THEN** it SHALL define `[RED]` as: write a failing test; the test MUST be seen to fail before the task can be marked complete

#### Scenario: GREEN label defined
- **WHEN** the TDD tasks instruction is read
- **THEN** it SHALL define `[GREEN]` as: write the minimum code to make the test pass; all tests MUST pass before the task can be marked complete

#### Scenario: REFACTOR label defined
- **WHEN** the TDD tasks instruction is read
- **THEN** it SHALL define `[REFACTOR]` as: improve code structure without changing behavior; all tests MUST remain passing throughout

#### Scenario: UI label defined
- **WHEN** the TDD tasks instruction is read
- **THEN** it SHALL define `[UI]` as: visual/style task; does not require automated tests; verification is by visual inspection or Storybook

#### Scenario: VERIFY label defined
- **WHEN** the TDD tasks instruction is read
- **THEN** it SHALL define `[VERIFY]` as: manual verification checkpoint; describes what to check and how

### Requirement: Task label ordering rules
The TDD schema SHALL enforce ordering constraints between labels.

#### Scenario: GREEN must follow RED
- **WHEN** a tasks.md file is being created for the TDD schema
- **THEN** every `[GREEN]` task SHALL be preceded by a corresponding `[RED]` task for the same test

#### Scenario: REFACTOR follows GREEN
- **WHEN** a tasks.md file is being created for the TDD schema
- **THEN** `[REFACTOR]` tasks SHALL only appear after a `[GREEN]` task in the same group

#### Scenario: UI not used for testable logic
- **WHEN** a tasks.md file is being created for the TDD schema
- **THEN** the instruction SHALL warn against using `[UI]` to avoid testing logic that has deterministic inputs and outputs

### Requirement: Tasks template with label examples
The TDD schema's `tasks.md` template SHALL show example task groups using the label system for different verification types.

#### Scenario: Template shows strict TDD group
- **WHEN** the TDD tasks template is read
- **THEN** it SHALL contain an example group with `[RED]`, `[GREEN]`, and `[REFACTOR]` tasks in correct order

#### Scenario: Template shows visual verification group
- **WHEN** the TDD tasks template is read
- **THEN** it SHALL contain an example group with `[UI]` and `[VERIFY]` tasks

#### Scenario: Template uses checkbox format
- **WHEN** the TDD tasks template is read
- **THEN** all task items SHALL use `- [ ] X.Y [LABEL] description` format compatible with the apply phase's checkbox parser

### Requirement: Apply phase TDD enforcement
The TDD schema's `apply.instruction` SHALL enforce strict TDD discipline for `[RED]` and `[GREEN]` tasks.

#### Scenario: RED task execution
- **WHEN** the apply phase encounters a `[RED]` task
- **THEN** the instruction SHALL require: (1) write the test, (2) run the test, (3) confirm the test fails, (4) mark complete

#### Scenario: GREEN task execution
- **WHEN** the apply phase encounters a `[GREEN]` task
- **THEN** the instruction SHALL require: (1) write minimum implementation, (2) run all tests, (3) confirm all pass, (4) mark complete

#### Scenario: Implementation-first violation
- **WHEN** the apply instruction is read
- **THEN** it SHALL state that writing implementation code before its corresponding `[RED]` test is a violation — the implementation MUST be deleted and work restarted from the `[RED]` task

#### Scenario: UI task execution
- **WHEN** the apply phase encounters a `[UI]` task
- **THEN** the instruction SHALL allow completing it without running automated tests

#### Scenario: VERIFY task execution
- **WHEN** the apply phase encounters a `[VERIFY]` task
- **THEN** the instruction SHALL require describing what was checked and the verification result
