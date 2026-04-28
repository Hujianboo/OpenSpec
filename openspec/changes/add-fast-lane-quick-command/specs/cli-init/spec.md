## ADDED Requirements

### Requirement: Core setup includes quick workflow
The init command SHALL include the quick workflow in the default core workflow setup.

#### Scenario: Generate quick workflow during initialization
- **WHEN** a user runs `blockspec init`
- **AND** the core profile is active
- **AND** the selected AI tool supports managed workflow artifacts
- **THEN** the system SHALL generate the quick workflow skill or command artifacts for that tool using the same delivery rules as other core workflows
- **AND** the generated command surface SHALL expose the workflow as `/opsx:do`

#### Scenario: Quick workflow path generation is cross-platform
- **WHEN** init writes quick workflow artifacts for a selected tool
- **THEN** the system SHALL construct output paths with Node.js path APIs
- **AND** SHALL use the tool adapter or explicit tool metadata instead of hardcoded path separators

#### Scenario: Initialization summary mentions quick workflow
- **WHEN** initialization completes and quick workflow artifacts were generated
- **THEN** the success output SHALL include quick mode in the generated workflow counts
- **AND** the getting started guidance SHALL mention `/opsx:do` as the Fast Lane for lightweight changes
