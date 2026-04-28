## ADDED Requirements

### Requirement: Quick workflow command
The system SHALL provide a Fast Lane workflow for lightweight changes that records minimal context, implements immediately, updates task progress, and summarizes the result.

#### Scenario: Quick workflow with a clear lightweight request
- **WHEN** a user invokes `/opsx:do "<request>"`
- **AND** the request is clear and does not match escalation criteria
- **THEN** the agent SHALL create a quick change record
- **AND** generate a short task list
- **AND** implement the requested change in the same interaction
- **AND** mark completed tasks in `tasks.md`
- **AND** update the quick record with implementation and verification notes

#### Scenario: Quick workflow without input
- **WHEN** a user invokes `/opsx:do` without a request
- **THEN** the agent SHALL ask what change the user wants to build or fix
- **AND** SHALL NOT create files or edit code until the request is understood

### Requirement: Minimal quick artifacts
The quick workflow SHALL create a minimal record by default instead of the full proposal, spec, design, and tasks artifact set.

#### Scenario: Recorded quick change
- **WHEN** quick mode runs with recording enabled
- **THEN** the agent SHALL create a change directory under `openspec/changes/`
- **AND** the change directory SHALL contain `quick.md`
- **AND** the change directory SHALL contain `tasks.md`
- **AND** the agent SHALL NOT require `proposal.md`, `design.md`, or spec delta files before implementation

#### Scenario: Quick artifact content
- **WHEN** the agent creates `quick.md`
- **THEN** it SHALL include the original request
- **AND** record whether verification was requested
- **AND** record the escalation decision
- **AND** provide an implementation summary after code edits
- **AND** state whether checks were run

#### Scenario: Quick task content
- **WHEN** the agent creates `tasks.md`
- **THEN** it SHALL include 3 to 5 implementation tasks when the request can be decomposed that way
- **AND** each completed task SHALL be marked with a checked Markdown checkbox before the final summary

### Requirement: No-record quick mode
The quick workflow SHALL support a no-record mode for users who explicitly want the fastest direct implementation path.

#### Scenario: No-record mode skips artifacts
- **WHEN** a user invokes quick mode with `--no-record`
- **THEN** the agent SHALL NOT create an `openspec/changes/` directory
- **AND** the agent SHALL implement the lightweight request directly if it does not match escalation criteria
- **AND** the final summary SHALL state that no change record was created

### Requirement: Optional quick verification
The quick workflow SHALL support an explicit verification mode that runs a lightweight relevant check after implementation.

#### Scenario: Verify flag requests checks
- **WHEN** a user invokes quick mode with `--verify`
- **THEN** the agent SHALL select a relevant lightweight verification command when one can be inferred from the project
- **AND** run that command after implementation
- **AND** include the command and result in the final summary

#### Scenario: Verification command cannot be inferred
- **WHEN** quick mode is invoked with `--verify`
- **AND** no relevant lightweight verification command can be inferred
- **THEN** the agent SHALL explain that verification was requested but not run
- **AND** include the reason in `quick.md` when recording is enabled

### Requirement: Quick escalation
The quick workflow SHALL stop before implementation and recommend the formal proposal/apply flow when the request is not suitable for Fast Lane.

#### Scenario: High-risk request escalates
- **WHEN** the request touches authentication, payments, database migrations, data deletion, permissions, public APIs, or security-sensitive behavior
- **THEN** the agent SHALL NOT edit code in quick mode
- **AND** SHALL recommend `/opsx:propose "<request>"` followed by `/opsx:apply`
- **AND** SHALL explain the escalation reason

#### Scenario: Broad or unclear request escalates
- **WHEN** the request has unclear acceptance criteria
- **OR** the agent expects broad changes across many files
- **OR** the agent determines tests or design review are needed before implementation
- **THEN** the agent SHALL NOT edit code in quick mode
- **AND** SHALL recommend the formal workflow

### Requirement: Quick CLI handoff
The CLI SHALL provide a `quick` command that prepares Fast Lane context for agent-driven implementation.

#### Scenario: CLI quick with recording
- **WHEN** a user runs `blockspec quick "<request>"`
- **THEN** the CLI SHALL create a minimal quick change directory using cross-platform path APIs
- **AND** write `quick.md` and `tasks.md` placeholders suitable for agent completion
- **AND** print concise handoff instructions for continuing with `/opsx:do`

#### Scenario: CLI quick no-record
- **WHEN** a user runs `blockspec quick "<request>" --no-record`
- **THEN** the CLI SHALL NOT create files
- **AND** SHALL print direct agent handoff instructions that include the original request

#### Scenario: CLI quick verify flag
- **WHEN** a user runs `blockspec quick "<request>" --verify`
- **THEN** the CLI handoff instructions SHALL indicate that quick verification was requested
- **AND** SHALL NOT run project tests itself
