## ADDED Requirements

### Requirement: Quick record archive
The archive command SHALL support completed quick records that contain no spec deltas by archiving them as history-only changes.

#### Scenario: Archive quick record without spec deltas
- **WHEN** a user archives a change containing `quick.md`
- **AND** the change has no `specs/` delta files
- **AND** task completion checks pass or the user confirms incomplete tasks
- **THEN** the system SHALL skip spec update discovery and spec update confirmation
- **AND** move the change directory to the archive location
- **AND** report that no main specs were updated

#### Scenario: Archive quick record with spec deltas
- **WHEN** a user archives a change containing `quick.md`
- **AND** the change also has `specs/` delta files
- **THEN** the system SHALL use the normal spec update process
- **AND** SHALL NOT treat the change as history-only solely because `quick.md` exists

#### Scenario: Quick archive keeps task safety
- **WHEN** a quick record has incomplete tasks in `tasks.md`
- **THEN** the archive command SHALL apply the existing incomplete-task confirmation behavior before moving the change

#### Scenario: Quick archive path handling
- **WHEN** the archive command detects `quick.md` and `specs/` delta files
- **THEN** it SHALL resolve paths with Node.js path APIs
- **AND** SHALL NOT rely on hardcoded path separators
