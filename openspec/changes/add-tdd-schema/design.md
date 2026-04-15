## Context

OpenSpec 使用 `schemas/<name>/` 目录定义工作流 schema，每个 schema 包含 `schema.yaml`（artifact 依赖图定义）和 `templates/` 子目录（artifact 模板文件）。现有的 `spec-driven` schema 定义了 4 个 artifact（proposal → specs → design → tasks）。

核心系统（`src/core/artifact-graph/`）已实现完整的 schema 加载、解析、验证、状态检测和指令生成机制：
- `resolver.ts` 按 project → user → package 三层解析 schema 目录
- `schema.ts` 解析 YAML 并验证依赖图（无环、引用合法、无重复 ID）
- `graph.ts` 计算拓扑序、就绪集合、阻塞集合
- `instruction-loader.ts` 加载模板和生成 artifact 指令

新增 `tdd` schema 只需在 `schemas/` 目录下创建新的子目录和文件，**不需要修改任何 TypeScript 源码**。

## Goals / Non-Goals

**Goals:**
- 创建完整的 `tdd` schema，包含 `schema.yaml` 和 5 个模板文件
- 在 specs 和 design 之间插入 `test-plan` artifact，强制先想清楚验证策略再做技术设计
- 通过任务标签系统（[RED]/[GREEN]/[REFACTOR]/[UI]/[VERIFY]）区分不同类型的验证方式
- 通过 apply 指令强制 [RED]/[GREEN] 任务遵循 TDD 循环
- schema 随 npm 包分发，用户通过 `--schema tdd` 即可使用

**Non-Goals:**
- 不修改核心 artifact-graph 系统的 TypeScript 代码
- 不添加运行时的标签验证逻辑（标签约束通过指令文本引导 AI 遵守，而非程序化校验）
- 不修改现有的 `spec-driven` schema
- 不添加自动化测试运行器（测试执行由 AI 在 apply 阶段调用项目自身的测试命令完成）

## Decisions

### Decision 1: 纯文件方案，不修改源码

**选择**: 仅在 `schemas/tdd/` 下创建 YAML 和 Markdown 文件。

**替代方案**: 在核心系统中添加标签验证逻辑（如解析 tasks.md 中的标签并校验排序）。

**理由**: OpenSpec 的 schema 系统设计为声明式——schema 是数据，不是代码。标签排序规则通过 instruction 文本约束 AI 行为，与现有的 `spec-driven` schema 一致。如果未来需要程序化校验，可以作为独立 feature 添加 `validate` 钩子，不影响本次设计。

### Decision 2: test-plan 放在 specs 之后、design 之前

**选择**: 依赖图为 specs → test-plan → design，test-plan 只依赖 specs，design 依赖 proposal + test-plan。

**替代方案 A**: test-plan 与 design 并行（都只依赖 specs）。
**替代方案 B**: test-plan 在 design 之后。

**理由**: TDD 的核心原则是"先想清楚怎么验证，再想怎么实现"。把 test-plan 放在 design 之前，强制 AI 在技术设计时已经知道每个场景的验证策略。design 可以基于 test-plan 的分类结果来安排架构（如哪些模块需要可测试的接口设计）。

### Decision 3: proposal 模板复用 spec-driven

**选择**: `tdd` 的 proposal.md 模板与 `spec-driven` 完全相同。

**理由**: proposal 阶段的目标（描述 why 和 what）与开发方法论无关。复用模板避免维护两份相似内容，且用户从 spec-driven 切换到 tdd 时 proposal 阶段体验一致。

### Decision 4: 标签约束通过指令文本而非结构化规则

**选择**: 在 `tasks` artifact 的 `instruction` 字段和 `apply.instruction` 中用自然语言描述标签规则和 TDD 循环。

**替代方案**: 在 schema.yaml 中定义结构化的 `labels` 字段，由核心系统解析并验证。

**理由**: 结构化标签验证需要修改核心 TypeScript 代码（types.ts、instruction-loader.ts 等），增加系统复杂度。当前阶段通过指令文本约束 AI 已经足够有效——AI 模型对明确的自然语言指令有很高的遵从度。如果实践中发现 AI 频繁违反标签规则，再考虑添加程序化校验。

### Decision 5: 三种验证分类（auto-test / visual / manual）

**选择**: test-plan 将场景分为 auto-test（可写确定性断言）、visual（看起来对就行）、manual（需要真机/真实环境验证）三类。

**替代方案**: 只分 auto-test 和 non-auto-test 两类。

**理由**: visual 和 manual 的验证方式不同——visual 可以用 Storybook/截图对比等工具辅助，manual 需要在特定设备/环境下操作。区分这两类让 tasks 阶段能生成更精确的验证指引（`[UI]` vs `[VERIFY]`）。

## Risks / Trade-offs

- **[Risk] AI 可能忽视标签规则** → Mitigation: instruction 文本中使用强指令词（MUST, SHALL），明确列出违规后果（"删掉实现，从 RED 重来"）。未来可添加 lint 钩子检查 tasks.md 的标签顺序。
- **[Risk] test-plan 增加工作流长度** → Mitigation: test-plan 不需要很长——对于简单变更，可能只需要 10-20 行。增加的思考成本换来的是实现阶段更清晰的方向。
- **[Risk] 与 spec-driven 的 proposal 模板同步** → Mitigation: 短期直接复制。如果 spec-driven 的 proposal 模板频繁更新，可以考虑模板继承机制（但这超出本次 scope）。
