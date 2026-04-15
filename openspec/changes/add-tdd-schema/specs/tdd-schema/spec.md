## ADDED Requirements

### Requirement: TDD schema definition
The system SHALL provide a built-in schema named `tdd` in the `schemas/tdd/` directory with a `schema.yaml` defining 5 artifacts (`proposal`, `specs`, `test-plan`, `design`, `tasks`) and an `apply` phase.

#### Scenario: Schema is discoverable
- **WHEN** user runs `openspec schemas`
- **THEN** the output SHALL include a schema named "tdd" with source "package"
- **AND** its description SHALL indicate it is a test-driven workflow

#### Scenario: Schema can be used to create a change
- **WHEN** user runs `openspec new change my-feature --schema tdd`
- **THEN** the system SHALL create a change with `.openspec.yaml` containing `schema: tdd`

#### Scenario: Schema file is valid
- **WHEN** `schemas/tdd/schema.yaml` is loaded by `parseSchema()`
- **THEN** validation SHALL succeed with no errors
- **AND** the parsed schema SHALL contain exactly 5 artifacts

### Requirement: TDD artifact flow
The system SHALL define the TDD artifact dependency graph as: `proposal` (no deps) → `specs` (requires proposal) → `test-plan` (requires specs) → `design` (requires proposal, test-plan) → `tasks` (requires specs, test-plan, design).

#### Scenario: Build order
- **WHEN** `ArtifactGraph` is constructed from the TDD schema
- **THEN** `getBuildOrder()` SHALL return artifacts in a valid topological order where `proposal` comes first, `specs` comes after `proposal`, `test-plan` comes after `specs`, `design` comes after `test-plan`, and `tasks` comes last

#### Scenario: test-plan blocks design
- **WHEN** `proposal` and `specs` are completed but `test-plan` is not
- **THEN** `getNextArtifacts()` SHALL include `test-plan` but NOT `design`

#### Scenario: Apply requires only tasks
- **WHEN** the TDD schema is loaded
- **THEN** `apply.requires` SHALL be `["tasks"]`
- **AND** `apply.tracks` SHALL be `"tasks.md"`

### Requirement: TDD schema templates directory
The system SHALL include a `templates/` subdirectory under `schemas/tdd/` containing template files for all 5 artifacts: `proposal.md`, `spec.md`, `test-plan.md`, `design.md`, `tasks.md`.

#### Scenario: All templates exist
- **WHEN** the `schemas/tdd/templates/` directory is listed
- **THEN** it SHALL contain exactly 5 files: `proposal.md`, `spec.md`, `test-plan.md`, `design.md`, `tasks.md`

#### Scenario: Each artifact references its template
- **WHEN** the TDD schema is loaded
- **THEN** each artifact's `template` field SHALL reference a file that exists in `schemas/tdd/templates/`

### Requirement: TDD proposal artifact
The TDD schema's `proposal` artifact SHALL be identical in structure to `spec-driven`'s proposal, reusing the same template and instruction pattern.

#### Scenario: Proposal has no dependencies
- **WHEN** the TDD schema is loaded
- **THEN** the `proposal` artifact SHALL have an empty `requires` array

#### Scenario: Proposal generates proposal.md
- **WHEN** the TDD schema is loaded
- **THEN** the `proposal` artifact's `generates` field SHALL be `"proposal.md"`

### Requirement: TDD specs artifact with GIVEN/WHEN/THEN
The TDD schema's `specs` artifact SHALL require scenarios to use GIVEN/WHEN/THEN format and support a `<!-- manual-verify -->` marker for scenarios that cannot be automatically tested.

#### Scenario: Specs depend on proposal
- **WHEN** the TDD schema is loaded
- **THEN** the `specs` artifact SHALL require `["proposal"]`

#### Scenario: Specs generates glob pattern
- **WHEN** the TDD schema is loaded
- **THEN** the `specs` artifact's `generates` field SHALL be `"specs/**/*.md"`

#### Scenario: Specs instruction mentions GIVEN/WHEN/THEN
- **WHEN** the TDD schema's `specs` artifact instruction is read
- **THEN** it SHALL contain guidance about using GIVEN/WHEN/THEN format for scenarios

#### Scenario: Specs instruction mentions manual-verify marker
- **WHEN** the TDD schema's `specs` artifact instruction is read
- **THEN** it SHALL contain guidance about marking non-testable scenarios with `<!-- manual-verify -->`

### Requirement: TDD design artifact with test strategy
The TDD schema's `design` artifact SHALL include a Test Strategy section in its template and instruction, in addition to the standard design sections.

#### Scenario: Design depends on proposal and test-plan
- **WHEN** the TDD schema is loaded
- **THEN** the `design` artifact SHALL require `["proposal", "test-plan"]`

#### Scenario: Design template includes test strategy section
- **WHEN** the TDD schema's `design.md` template is read
- **THEN** it SHALL contain a "Test Strategy" section header

#### Scenario: Design instruction references test-plan
- **WHEN** the TDD schema's `design` artifact instruction is read
- **THEN** it SHALL mention reading the test-plan for verification strategy context

### Requirement: TDD tasks artifact with label system
The TDD schema's `tasks` artifact SHALL require tasks to use `[RED]`, `[GREEN]`, `[REFACTOR]`, `[UI]`, and `[VERIFY]` labels with defined ordering rules.

#### Scenario: Tasks depend on specs, test-plan, and design
- **WHEN** the TDD schema is loaded
- **THEN** the `tasks` artifact SHALL require `["specs", "test-plan", "design"]`

#### Scenario: Tasks instruction defines all five labels
- **WHEN** the TDD schema's `tasks` artifact instruction is read
- **THEN** it SHALL define the meaning of `[RED]`, `[GREEN]`, `[REFACTOR]`, `[UI]`, and `[VERIFY]` labels

#### Scenario: Tasks instruction specifies ordering rules
- **WHEN** the TDD schema's `tasks` artifact instruction is read
- **THEN** it SHALL state that every `[GREEN]` MUST be preceded by a `[RED]`, and `[REFACTOR]` SHALL only appear after `[GREEN]`

### Requirement: TDD apply phase instruction
The TDD schema's `apply` phase instruction SHALL enforce strict TDD cycles for `[RED]/[GREEN]` tasks and relaxed verification for `[UI]/[VERIFY]` tasks.

#### Scenario: Apply instruction enforces RED-GREEN cycle
- **WHEN** the TDD schema's `apply.instruction` is read
- **THEN** it SHALL state that `[RED]` tasks require writing a test, running it, and confirming failure before marking complete

#### Scenario: Apply instruction enforces GREEN completion
- **WHEN** the TDD schema's `apply.instruction` is read
- **THEN** it SHALL state that `[GREEN]` tasks require writing minimal implementation, running tests, and confirming all pass before marking complete

#### Scenario: Apply instruction allows UI tasks without tests
- **WHEN** the TDD schema's `apply.instruction` is read
- **THEN** it SHALL state that `[UI]` and `[VERIFY]` tasks do not require automated tests
