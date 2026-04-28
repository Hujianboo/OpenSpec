**Language / 语言:** [English](README.md) · [中文（本文）](README.zh-CN.md)

---

> **BlockSpec** — 面向 Block 团队的规范驱动 AI 工作流工具，基于 [OpenSpec](https://github.com/Fission-AI/OpenSpec)。

**从 npm 安装 BlockSpec**

```bash
npm install -g @blockdance-lab/blockspec   # 全局 CLI（命令名：blockspec）
npm install @blockdance-lab/blockspec      # 作为项目依赖安装
```

在仓库根目录执行 `blockspec init` 后，即可像上游 OpenSpec 一样使用 `/opsx:…` 斜杠命令。初始化完成提示会直接展示两条 Fast Lane 入口：

```text
Fast lane for small changes: /opsx:do "your request"
Terminal helper: blockspec quick "your request"
Start your first change: /opsx:propose "your idea"
```

除本节说明外，下文仍按 OpenSpec 风格描述工作流与 CLI。

### TDD 工作流（`tdd` schema）

用 **`/opsx:tdd "<名称>"`** 开始变更（或 `blockspec new change "<名称>" --schema tdd`）。产物顺序：**proposal → specs → test-plan → design → tasks**，之后执行 **`/opsx:apply`**。`tdd` schema 在设计之前增加 **test-plan**，把「如何验收」写清楚。

**更偏向人工 / 视觉验收，而不是自动化测试**

BlockSpec 不要求所有内容都走单元测试。三层写法由你（或 AI）控制：

1. **规格（`specs/**/spec.md`）** — 无法用单一确定性断言描述的行为（视觉打磨、动效、设备相关），在场景标题后紧跟 **`<!-- manual-verify -->`**，表示该场景默认不当作自动化测试目标。

2. **`test-plan.md`** — 每个场景对应一条验收项。只有当你真的会写并维护自动化测试时，才标 **`auto-test`**（Setup / Action / Assert）。**「看起来对」** 用 **`visual`**（浏览器、Storybook、截图等）。**「需要人在真机/环境里一步步点」** 用 **`manual`**。若不想上自动化，宁可多写 **`visual` / `manual`**，少写 **`auto-test`**。

3. **`tasks.md`** — 任务标签驱动 apply 阶段。**`[RED]` / `[GREEN]` / `[REFACTOR]`** 表示该块工作要严格测试先行。**`[UI]`** 用于样式与布局，不要求自动化断言。**`[VERIFY]`** 是明确的人工检查点（写清要查什么）。若希望 **主要靠人工评审**，请直接告诉模型，例如：*「需要的地方都加 manual-verify；test-plan 以 visual/manual 为主；任务多用 `[UI]`、`[VERIFY]`，核心逻辑外少用 `[RED]`/`[GREEN]`。」* 只有 **`[RED]` / `[GREEN]`** 才要求先失败测试再写实现；**`[UI]`** 与 **`[VERIFY]`** 不要求。

### 默认工作流（更轻）

**`/opsx:propose "<名称>"`** — **proposal → specs → design → tasks**（无强制的 `test-plan`）。在 OpenSpec 或 `blockspec init` 后均可使用同一斜杠命令。

### Fast Lane 快捷模式

当需求很小、风险很低，并且不想被 proposal/apply 两段式打断时，用 **`/opsx:do "<小需求>"`**。默认会创建很薄的 `quick.md` 与 `tasks.md`，马上实现；除非加 `--verify` 或 AI 判断确实需要，否则默认不跑测试。

终端辅助入口：

```bash
blockspec quick "更新 pricing 页 CTA 文案"          # 创建 quick.md/tasks.md，然后交给 /opsx:do
blockspec quick "调整移动端间距" --verify          # 请求 AI 做一个轻量相关检查
blockspec quick "修复 README 错别字" --no-record   # 不创建 change 记录，直接交给 AI
```

Quick 模式不替代正式流程，只是并列的快车道。遇到 auth、支付、数据库迁移、权限、公共 API、大范围重构、需求不清楚或需要正式评审的工作，应升级为 `/opsx:propose`。有记录的 quick change 也可以 archive；如果没有 `specs/` delta，归档时只保留历史记录，不更新主 specs。

→ 斜杠工作流更多说明：[docs/opsx.md](docs/opsx.md)

<details>
<summary><strong>最受喜爱的 spec 框架。</strong></summary>

[![Stars](https://img.shields.io/github/stars/Fission-AI/OpenSpec?style=flat-square&label=Stars)](https://github.com/Fission-AI/OpenSpec/stargazers)
[![Downloads](https://img.shields.io/npm/dm/@fission-ai/openspec?style=flat-square&label=Downloads/mo)](https://www.npmjs.com/package/@fission-ai/openspec)
[![Contributors](https://img.shields.io/github/contributors/Fission-AI/OpenSpec?style=flat-square&label=Contributors)](https://github.com/Fission-AI/OpenSpec/graphs/contributors)

</details>
<p></p>
我们的理念：

```text
→ fluid not rigid
→ iterative not waterfall
→ easy not complex
→ built for brownfield not just greenfield
→ scalable from personal projects to enterprises
```

<p align="center">
  在 X 上关注 <a href="https://x.com/0xTab">@0xTab</a> 获取更新 · 加入 <a href="https://discord.gg/YctCnvvshC">OpenSpec Discord</a> 提问与交流。
</p>

### 团队

在团队中使用 OpenSpec？[发邮件](mailto:teams@openspec.dev) 申请 Slack 频道访问。

<!-- TODO: Add GIF demo of /opsx:propose → /opsx:archive workflow -->

## 实际效果

**Fast Lane**（`quick`）：最小记录 → 直接实现 → 摘要

```text
You: /opsx:do "把 pricing CTA 改成 Start free trial"
AI:  Created openspec/changes/quick-20260428-pricing-cta/
     ✓ quick.md — request、mode、summary 占位
     ✓ tasks.md — 3-5 条轻量实现任务
     ✓ Updated pricing CTA copy
     No tests run by default quick mode.

You: /opsx:archive quick-20260428-pricing-cta
AI:  Archived as a history-only quick record. No main specs updated.
```

**TDD 工作流**（`tdd`）：proposal → specs → test-plan → design → tasks

```text
You: /opsx:tdd add-payment-validation
AI:  Created openspec/changes/add-payment-validation/
     ✓ proposal.md  — why we're doing this, what's changing
     ✓ specs/       — GIVEN/WHEN/THEN scenarios, manual-verify markers
     ✓ test-plan.md — auto-test / visual / manual classification
     ✓ design.md    — technical approach + test strategy
     ✓ tasks.md     — [RED]/[GREEN]/[REFACTOR]/[UI]/[VERIFY] labeled tasks
     Ready for test-driven implementation!

You: /opsx:apply
AI:  [RED]    Write failing test: validateCard returns error on invalid number
     [GREEN]  Implement validateCard
     [RED]    Write failing test: validateCard accepts Visa/Mastercard
     [GREEN]  Handle card type check
     [REFACTOR] Extract card type constants
     [UI]     Style error message component  ← visual inspection
     [VERIFY] Manual: test on real device   ← manual checkpoint
     All tasks complete!
```

**默认工作流**（`spec-driven`）：proposal → specs → design → tasks

```text
You: /opsx:propose add-dark-mode
AI:  Created openspec/changes/add-dark-mode/
     ✓ proposal.md — why we're doing this, what's changing
     ✓ specs/       — requirements and scenarios
     ✓ design.md    — technical approach
     ✓ tasks.md     — implementation checklist
     Ready for implementation!

You: /opsx:apply
AI:  Implementing tasks...
     ✓ 1.1 Add theme context provider
     ✓ 1.2 Create toggle component
     ✓ 2.1 Add CSS variables
     ✓ 2.2 Wire up localStorage
     All tasks complete!

You: /opsx:archive
AI:  Archived to openspec/changes/archive/2025-01-23-add-dark-mode/
     Specs updated. Ready for the next feature.
```

<details>
<summary><strong>OpenSpec 面板</strong></summary>

<p align="center">
  <img src="assets/openspec_dashboard.png" alt="OpenSpec dashboard preview" width="90%">
</p>

</details>

## 快速开始

**需要 Node.js 20.19.0 或更高版本。**

全局安装 BlockSpec：

```bash
npm install -g @blockdance-lab/blockspec@latest
```

进入项目目录并初始化：

```bash
cd your-project
blockspec init
```

初始化后，小需求可以直接告诉 AI：**`/opsx:do <小需求>`**；也可以先在终端执行 **`blockspec quick "<小需求>"`** 创建最小记录并输出交接提示。需要测试驱动时用 **`/opsx:tdd <要做的事>`**；需要正式规划时用 **`/opsx:propose <要做的事>`**。

若需要扩展工作流（`/opsx:new`、`/opsx:continue`、`/opsx:ff`、`/opsx:verify`、`/opsx:sync`、`/opsx:bulk-archive`、`/opsx:onboard`），执行 `openspec config profile` 选择，再用 `openspec update` 应用。

> [!NOTE]
> 不确定你的工具是否支持？[查看完整列表](docs/supported-tools.md) — 我们支持 25+ 种工具且持续增加。
>
> 也支持 pnpm、yarn、bun、nix。[安装方式见文档](docs/installation.md)。

## 文档

→ **[入门](docs/getting-started.md)**：第一步<br>
→ **[工作流](docs/workflows.md)**：组合与模式<br>
→ **[命令](docs/commands.md)**：斜杠命令与 skills<br>
→ **[CLI](docs/cli.md)**：终端参考<br>
→ **[支持的工具](docs/supported-tools.md)**：集成与安装路径<br>
→ **[概念](docs/concepts.md)**：整体如何协作<br>
→ **[多语言](docs/multi-language.md)**：多语言支持<br>
→ **[定制](docs/customization.md)**：按团队调整

## 为什么选择 OpenSpec？

AI 编程助手很强，但若需求只活在聊天记录里，结果难以预期。OpenSpec 增加一层轻量 spec，让你在写代码前先对齐「要做什么」。

- **先对齐再动手** — 人与 AI 在写代码前对齐规格
- **结构清晰** — 每个变更独立目录：proposal、specs、design、tasks
- **灵活迭代** — 可随时改任意产物，无死板阶段门
- **工具任选** — 通过斜杠命令对接 20+ 种 AI 助手
- **可选纪律** — `tdd`：测试先行 + test-plan + 任务标签；`spec-driven`：更轻的快速迭代

### 与其他方案对比

**对比 [Spec Kit](https://github.com/github/spec-kit)**（GitHub）— 全面但偏重；阶段门 rigid、Markdown 多、需 Python 环境。OpenSpec 更轻，迭代更自由。

**对比 [Kiro](https://kiro.dev)**（AWS）— 能力强但绑定其 IDE 与 Claude 模型。OpenSpec 用你已有的工具链。

**对比「不用 spec」** — 没有 spec 的 AI 编程容易提示词含糊、结果飘。OpenSpec 在不过度仪式化的前提下提高可预期性。

## 升级 OpenSpec

**升级包**

```bash
npm install -g @fission-ai/openspec@latest
```

**刷新 Agent 说明**

在每个项目内执行，以重新生成 AI 指引并确保斜杠命令为最新：

```bash
openspec update
```

## 使用建议

**模型选择**：OpenSpec 更适合高推理能力模型。规划与实现我们都推荐 Opus 4.5 与 GPT 5.2 级别。

**上下文卫生**：尽量在实现前清空上下文，并在会话中保持窗口干净，效果更好。

## 参与贡献

**小改动** — Bug 修复、错别字、小改进可直接提 PR。

**大改动** — 新功能、较大重构或架构调整，请先提交 OpenSpec 变更提案，对齐目标后再动手写实现。

写提案时请牢记 OpenSpec 面向多种 Agent、模型与场景，改动应让广泛用户受益。

**欢迎含 AI 生成代码的 PR** — 前提是已测试验证。请在 PR 中注明使用的 Agent 与模型（例如：「由 Claude Code + claude-opus-4-5-20251101 生成」）。

### 开发本仓库

- 安装依赖：`pnpm install`
- 构建：`pnpm run build`
- 测试：`pnpm test`
- 本地调试 CLI：`pnpm run dev` 或 `pnpm run dev:cli`
- 提交信息（单行）：`type(scope): subject`

## 其他

<details>
<summary><strong>遥测</strong></summary>

OpenSpec 会收集匿名使用统计。

仅收集命令名与版本以了解使用分布，不收集参数、路径、内容或 PII。CI 环境下自动关闭。

**退出：** `export OPENSPEC_TELEMETRY=0` 或 `export DO_NOT_TRACK=1`

</details>

<details>
<summary><strong>维护者与顾问</strong></summary>

见 [MAINTAINERS.md](MAINTAINERS.md)。

</details>

## 许可

MIT
