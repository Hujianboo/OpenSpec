## ADDED Requirements

### Requirement: Quick command content
The command generation system SHALL include shared command content for the quick workflow.

#### Scenario: Generate quick command for adapter-backed tools
- **WHEN** command generation runs for an adapter-backed tool
- **AND** the active workflow list includes quick
- **THEN** the system SHALL generate a command file from shared quick command content
- **AND** the command content SHALL instruct the agent to expose the user-facing invocation as `/opsx:do`

#### Scenario: Quick command uses explicit workflow ID
- **WHEN** the system looks up command content for quick
- **THEN** it SHALL use the explicit workflow ID `quick`
- **AND** SHALL NOT infer command files through filename pattern matching

#### Scenario: Same quick instructions across tools
- **WHEN** generating the quick command for two different supported tools
- **THEN** both generated commands SHALL use the same shared quick workflow body
- **AND** only the adapter-specific path and frontmatter SHALL differ
