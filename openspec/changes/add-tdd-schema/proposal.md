## Why

OpenSpec 现有的 `spec-driven` schema 解决了"先对齐需求再编码"的问题，但没有约束实现阶段的工程纪律。AI 在 apply 阶段可能直接写实现代码而不写测试，或者写完代码再补测试。我们需要一个 TDD schema，把测试驱动开发的 Red-Green-Refactor 纪律融入 OpenSpec 工作流，在 specs 和 design 之间插入 test-plan 阶段，并在 tasks 中使用 `[RED]/[GREEN]/[REFACTOR]/[UI]/[VERIFY]` 标签系统来区分可自动测试和不可自动测试的任务。

## What Changes

- 新增 `tdd` schema（`schemas/tdd/`），包含 5 个 artifact 的完整工作流定义：`proposal → specs → test-plan → design → tasks`
- 新增 `test-plan` artifact 类型，从 spec 场景推导验证策略，区分 auto-test / visual / manual 三类验证方式
- specs 模板增强：要求使用 GIVEN/WHEN/THEN 格式，不可自动测试的场景标注 `<!-- manual-verify -->`
- design 模板增强：增加 Test Strategy 章节
- tasks 模板增强：使用 `[RED]/[GREEN]/[REFACTOR]/[UI]/[VERIFY]` 标签系统，带严格的排序规则
- apply 阶段指令增强：对 `[RED]/[GREEN]` 标签的任务强制 TDD 循环，对 `[UI]/[VERIFY]` 标签放宽约束

## Capabilities

### New Capabilities
- `tdd-schema`: TDD 工作流 schema 定义，包含 schema.yaml 和所有模板文件（proposal.md, spec.md, test-plan.md, design.md, tasks.md）
- `tdd-test-plan`: test-plan artifact 类型的模板和指令，支持按模块分组、按验证类型（auto-test/visual/manual）分类场景
- `tdd-task-labels`: TDD 任务标签系统（[RED]/[GREEN]/[REFACTOR]/[UI]/[VERIFY]）的模板和排序规则

### Modified Capabilities

（无需修改现有 spec。TDD schema 作为独立的新 schema 存在于 `schemas/tdd/` 目录，不影响现有的 `spec-driven` schema 或核心代码。所有新增内容都是新的 schema 文件，通过已有的 schema resolution 机制自动被发现。）

## Impact

- **新增文件**: `schemas/tdd/schema.yaml` 和 `schemas/tdd/templates/` 下的 5 个模板文件
- **不影响现有代码**: 利用已有的 schema resolution 机制（`resolver.ts` 的 package built-in 层），无需修改 TypeScript 源码
- **npm 包分发**: `schemas/` 已在 `package.json` 的 `files` 数组中，新 schema 会自动随包发布
- **向后兼容**: 现有 `spec-driven` schema 和所有基于它的 changes 不受影响
