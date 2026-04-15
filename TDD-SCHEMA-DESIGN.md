# TDD Schema 设计方案

> 在 OpenSpec 中新增一个 `tdd` schema，让 AI 在规范驱动开发的基础上，遵循测试驱动开发的流程。

## 背景

OpenSpec 现有的 `spec-driven` schema 流程是：

```
proposal → specs → design → tasks → apply
```

这个流程解决了"先对齐需求再编码"的问题，但没有约束**实现阶段的工程纪律**。AI 在 apply 阶段可能直接写实现代码而不写测试，或者写完代码再补测试（等于没测）。

参考 Superpowers 项目中 TDD skill 的核心原则（Red-Green-Refactor、先写失败测试再写实现、没看到测试失败就不知道测试是否测对了），我们希望把 TDD 纪律融入 OpenSpec 的工作流中。

## 核心设计思路

### 新增 `test-plan` artifact

在 specs 和 design 之间插入一个新阶段，强制在技术设计之前先想清楚"怎么验证"：

```
proposal → specs → test-plan → design → tasks → apply
                      ▲
                  新增阶段
```

`test-plan` 的作用是从 spec 的 scenario 推导出具体的验证策略。关键是**不强制所有东西都写自动化测试**，而是先分类，再决定验证方式。

### 区分可测试和不可测试的内容

TDD 不是万能的。不同类型的代码适用度差别很大：

| 类型 | TDD 适用度 | 原因 |
|------|-----------|------|
| 后端 API / 业务逻辑 | 非常高 | 输入→输出，确定性强 |
| 数据处理 / 算法 | 非常高 | 纯函数，给定输入必有确定输出 |
| 前端状态管理（hooks/stores） | 高 | 状态转换是确定性的逻辑 |
| 前端组件交互逻辑 | 中等 | 可测按钮点击→状态变化，但 DOM 细节难测 |
| UI 视觉样式 | 很低 | "好不好看"没法写断言 |
| 动画 / 过渡效果 | 很低 | 时序性、视觉效果无法用 assert 表达 |
| 移动端手势 / 硬件特性 | 低 | 滑动、长按、摄像头等依赖真实设备 |
| 第三方 SDK 集成 | 低 | 微信支付、地图 SDK 等依赖外部服务 |

判断标准是一个简单的问题：**"能不能写一个有确定性预期值的 assert？"**

- 能 → 适合 TDD
- "看起来对就行" → 视觉验证
- "在真机上试试" → 手动验证

### 任务标签系统

在 tasks 阶段，每个任务带一个验证标签：

- `[RED]` — 写一个失败测试。必须看到失败才能继续。
- `[GREEN]` — 写最少代码让测试通过。必须看到全部绿。
- `[REFACTOR]` — 重构清理。测试必须全程保持绿色。
- `[UI]` — 视觉/样式任务。不要求自动化测试，肉眼或 Storybook 验证。
- `[VERIFY]` — 手动验证检查点。描述要检查什么。

规则：
- 每个 `[GREEN]` 前面必须有一个 `[RED]`
- `[REFACTOR]` 只在 `[GREEN]` 之后出现
- 不要用 `[UI]` 来逃避可以测试的逻辑

### Apply 阶段的铁律

对于 `[RED]/[GREEN]` 标签的任务，apply 阶段严格执行 TDD 循环：
- `[RED]`：写测试，跑测试，确认失败，标记完成
- `[GREEN]`：写最少实现，跑测试，确认全绿，标记完成
- 如果先写了实现代码再写测试 → 删掉实现，从 `[RED]` 重来

对于 `[UI]` 和 `[VERIFY]` 标签的任务，不受此约束。

## 实现方式

在 `schemas/` 目录下创建 `tdd/` 子目录，包含：

```
schemas/tdd/
├── schema.yaml          # artifact 流转定义（5 个 artifact + apply）
└── templates/
    ├── proposal.md      # 复用 spec-driven 的模板
    ├── spec.md          # 增加 <!-- manual-verify --> 标记
    ├── test-plan.md     # 新增：场景分类 + 验证策略定义
    ├── design.md        # 增加 Test Strategy 章节
    └── tasks.md         # 使用 [RED]/[GREEN]/[REFACTOR]/[UI]/[VERIFY] 标签
```

### schema.yaml 的 artifact 定义

```yaml
name: tdd
version: 1
description: Test-driven workflow - proposal → specs → test-plan → design → tasks
artifacts:
  - id: proposal       # 与 spec-driven 一致
    requires: []
  - id: specs          # 增加 GIVEN/WHEN/THEN 和 manual-verify 标记要求
    requires: [proposal]
  - id: test-plan      # 新增：从 spec 推导验证策略
    requires: [specs]
  - id: design         # 增加 Test Strategy 章节要求
    requires: [proposal, test-plan]
  - id: tasks          # 使用标签系统
    requires: [specs, test-plan, design]
apply:
  requires: [tasks]
  tracks: tasks.md
```

### test-plan 模板结构

按模块分组，每个测试/验证项标注类型：

```markdown
## 1. 模块名 (auto-test)
### From Spec: 场景名
- **Test:** 测试描述
  - **Setup:** 前置条件
  - **Action:** 执行什么
  - **Assert:** 预期结果（确定性的）

## 2. 模块名 (visual)
### From Spec: 场景名
- **Check:** 检查什么
  - **How:** 用什么方式（Storybook / 浏览器 / 真机）
  - **Acceptance:** "通过"长什么样
```

### tasks 模板结构

```markdown
## 1. 后端逻辑（严格 TDD）
- [ ] 1.1 [RED] Write failing test: xxx
- [ ] 1.2 [GREEN] Implement xxx
- [ ] 1.3 [REFACTOR] Extract xxx

## 2. 前端 UI（视觉验证）
- [ ] 2.1 [UI] Create xxx component
- [ ] 2.2 [VERIFY] Manual: check on desktop/mobile
```

## 具体示例：不同项目类型下的任务编排

### 后端项目（大部分可 TDD）

```markdown
## 1. Export Core Logic
- [ ] 1.1 [RED] Write failing test: exportUserData returns CSV with headers
- [ ] 1.2 [GREEN] Implement exportUserData
- [ ] 1.3 [RED] Write failing test: empty data returns headers-only CSV
- [ ] 1.4 [GREEN] Handle empty data case
- [ ] 1.5 [REFACTOR] Extract CSV formatting utility

## 2. API Endpoint
- [ ] 2.1 [RED] Write failing test: GET /api/export returns 200 with CSV
- [ ] 2.2 [GREEN] Create route handler
- [ ] 2.3 [RED] Write failing test: unauthenticated returns 401
- [ ] 2.4 [GREEN] Add auth check
```

### 前端项目（混合策略）

```markdown
## 1. 状态管理（TDD）
- [ ] 1.1 [RED] Write failing test: useExport hook calls API and returns data
- [ ] 1.2 [GREEN] Implement useExport hook
- [ ] 1.3 [RED] Write failing test: useExport sets loading/error states
- [ ] 1.4 [GREEN] Add loading/error handling

## 2. UI 组件（视觉验证）
- [ ] 2.1 [UI] Create ExportButton component with styling
- [ ] 2.2 [UI] Add loading spinner animation
- [ ] 2.3 [UI] Wire up useExport hook
- [ ] 2.4 [VERIFY] Manual: check button on desktop and mobile viewports
```

### Flutter 移动端项目（逻辑层 TDD，UI 层不 TDD）

```markdown
## 1. 数据层（严格 TDD）
- [ ] 1.1 [RED] Write failing test: UserRepository.fetchProfile returns User
- [ ] 1.2 [GREEN] Implement UserRepository.fetchProfile
- [ ] 1.3 [RED] Write failing test: fetchProfile throws on 404
- [ ] 1.4 [GREEN] Add error handling

## 2. 状态管理（严格 TDD）
- [ ] 2.1 [RED] Write failing test: ProfileCubit emits loading then loaded
- [ ] 2.2 [GREEN] Implement ProfileCubit

## 3. UI 页面（视觉验证）
- [ ] 3.1 [UI] Build ProfilePage layout
- [ ] 3.2 [UI] Add pull-to-refresh animation
- [ ] 3.3 [VERIFY] Manual: test on iPhone SE / Pixel 5 / iPad
```

## 使用方式

创建变更时指定 schema：

```bash
openspec new change my-feature --schema tdd
```

或在 AI 对话中：

```
/opsx:propose my-feature --schema tdd
```

OpenSpec 会按 `proposal → specs → test-plan → design → tasks → apply` 引导 AI 工作。

## 与原版 spec-driven 的关键差异

| 阶段 | spec-driven | tdd |
|------|-------------|-----|
| specs | Scenario 描述行为 | Scenario 必须用 GIVEN/WHEN/THEN，不可测的标 manual-verify |
| test-plan | 不存在 | 新增：分类场景，定义验证策略 |
| design | 技术设计 | 技术设计 + Test Strategy 章节 |
| tasks | 实现任务 | 带 [RED]/[GREEN]/[REFACTOR]/[UI]/[VERIFY] 标签 |
| apply | 逐个完成 | [RED]/[GREEN] 严格 TDD，[UI] 视觉验证，[VERIFY] 手动验证 |

## 核心原则

1. **TDD 不是目标，高质量交付才是目标。** TDD 是验证工具箱中最强的一个，但不是唯一的。
2. **能自动测试的严格 TDD，不能自动测试的不硬套。** 判断标准：能不能写一个有确定性预期值的 assert。
3. **先想清楚怎么验证，再想怎么实现。** test-plan 在 design 之前，这是刻意为之。
4. **铁律只适用于可测试的代码。** 写了实现没写测试？删掉重来。但 UI 样式不在此列。
