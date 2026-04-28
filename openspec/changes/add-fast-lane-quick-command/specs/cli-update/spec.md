## ADDED Requirements

### Requirement: Update synchronizes quick workflow artifacts
The update command SHALL synchronize managed quick workflow artifacts according to the active workflow profile and delivery settings.

#### Scenario: Refresh quick workflow
- **WHEN** a user runs `blockspec update`
- **AND** quick is active in the configured workflow profile
- **AND** quick workflow artifacts already exist for a configured tool
- **THEN** the system SHALL refresh the managed quick workflow content
- **AND** preserve unmanaged content according to the tool adapter's existing behavior

#### Scenario: Create missing quick workflow when profile requires it
- **WHEN** a user runs `blockspec update`
- **AND** quick is active in the configured workflow profile
- **AND** the update path is allowed to generate missing managed workflow artifacts for the configured tool
- **THEN** the system SHALL create the missing quick workflow artifacts using explicit workflow lookup

#### Scenario: Remove deselected quick workflow
- **WHEN** a user runs `blockspec update`
- **AND** quick is not active in the configured workflow profile
- **AND** managed quick workflow artifacts exist for a configured tool
- **THEN** the system SHALL remove those managed quick workflow artifacts by explicit workflow ID lookup
- **AND** SHALL NOT remove unrelated user-authored files by pattern matching

#### Scenario: Update reports quick workflow changes
- **WHEN** update creates, refreshes, skips, or removes quick workflow artifacts
- **THEN** the output SHALL include those actions in the workflow summary
