## ADDED Requirements

### Requirement: test-plan artifact definition
The TDD schema SHALL define a `test-plan` artifact that generates `test-plan.md`, depends on `specs`, and uses `test-plan.md` as its template.

#### Scenario: test-plan artifact exists in schema
- **WHEN** the TDD schema is loaded
- **THEN** it SHALL contain an artifact with `id: "test-plan"`
- **AND** its `generates` field SHALL be `"test-plan.md"`
- **AND** its `template` field SHALL be `"test-plan.md"`

#### Scenario: test-plan depends only on specs
- **WHEN** the TDD schema is loaded
- **THEN** the `test-plan` artifact's `requires` array SHALL be `["specs"]`

#### Scenario: test-plan unlocks design
- **WHEN** `test-plan` is not yet completed
- **THEN** `design` SHALL be blocked (since design requires test-plan)
- **AND** when `test-plan` is completed, `design` SHALL become ready (assuming proposal is also done)

### Requirement: test-plan template structure
The `test-plan.md` template SHALL organize verification items by module, with each module classified as one of: `auto-test`, `visual`, or `manual`.

#### Scenario: Template contains auto-test section structure
- **WHEN** the `test-plan.md` template is read
- **THEN** it SHALL contain a section pattern for `(auto-test)` modules with Test/Setup/Action/Assert fields

#### Scenario: Template contains visual section structure
- **WHEN** the `test-plan.md` template is read
- **THEN** it SHALL contain a section pattern for `(visual)` modules with Check/How/Acceptance fields

#### Scenario: Template contains manual section structure
- **WHEN** the `test-plan.md` template is read
- **THEN** it SHALL contain a section pattern for `(manual)` modules with Check/Steps/Acceptance fields

### Requirement: test-plan instruction guidance
The `test-plan` artifact instruction SHALL guide the AI to derive verification strategies from spec scenarios, classifying each by testability.

#### Scenario: Instruction references spec scenarios
- **WHEN** the TDD schema's `test-plan` artifact instruction is read
- **THEN** it SHALL instruct the AI to read completed spec files and derive verification items from their scenarios

#### Scenario: Instruction defines classification criteria
- **WHEN** the TDD schema's `test-plan` artifact instruction is read
- **THEN** it SHALL define the classification question: "Can you write an assert with a deterministic expected value?"
- **AND** it SHALL map the answer to: yes → `auto-test`, "looks right" → `visual`, "try on real device" → `manual`

#### Scenario: Instruction requires per-module grouping
- **WHEN** the TDD schema's `test-plan` artifact instruction is read
- **THEN** it SHALL instruct the AI to group verification items by module/component, not by spec file

### Requirement: test-plan references spec scenarios
Each verification item in the test-plan SHALL trace back to a specific spec scenario using a `From Spec:` reference.

#### Scenario: Auto-test item references spec
- **WHEN** a test-plan contains an auto-test verification item
- **THEN** it SHALL include a `### From Spec: <scenario name>` reference linking to the originating spec scenario

#### Scenario: Visual item references spec
- **WHEN** a test-plan contains a visual verification item
- **THEN** it SHALL include a `### From Spec: <scenario name>` reference linking to the originating spec scenario
