## 1. 创建 schema 目录结构

- [x] 1.1 创建 `schemas/tdd/` 目录和 `schemas/tdd/templates/` 子目录

## 2. 创建 schema.yaml

- [x] 2.1 创建 `schemas/tdd/schema.yaml`，定义 5 个 artifact（proposal, specs, test-plan, design, tasks）及其依赖关系、generates、description、template、instruction 字段
- [x] 2.2 定义 `apply` 阶段配置：`requires: [tasks]`、`tracks: tasks.md`、TDD 强制执行的 `instruction`
- [x] 2.3 验证 schema.yaml 能通过 `parseSchema()` 校验：运行 `node -e "import('./dist/core/artifact-graph/index.js').then(m => { const fs = require('fs'); const y = fs.readFileSync('schemas/tdd/schema.yaml','utf8'); m.parseSchema(y); console.log('OK') })"`

## 3. 创建 proposal 模板

- [x] 3.1 创建 `schemas/tdd/templates/proposal.md`，内容与 `spec-driven` 的 proposal 模板相同

## 4. 创建 spec 模板

- [x] 4.1 创建 `schemas/tdd/templates/spec.md`，在 `spec-driven` 基础上增加 GIVEN/WHEN/THEN 格式要求和 `<!-- manual-verify -->` 标记示例

## 5. 创建 test-plan 模板

- [x] 5.1 创建 `schemas/tdd/templates/test-plan.md`，包含 auto-test 模块结构（Test/Setup/Action/Assert）
- [x] 5.2 在模板中加入 visual 模块结构（Check/How/Acceptance）
- [x] 5.3 在模板中加入 manual 模块结构（Check/Steps/Acceptance）

## 6. 创建 design 模板

- [x] 6.1 创建 `schemas/tdd/templates/design.md`，在 `spec-driven` 基础上增加 Test Strategy 章节

## 7. 创建 tasks 模板

- [x] 7.1 创建 `schemas/tdd/templates/tasks.md`，包含严格 TDD 任务组示例（[RED]/[GREEN]/[REFACTOR]）
- [x] 7.2 在模板中加入视觉验证任务组示例（[UI]/[VERIFY]）

## 8. 端到端验证

- [x] 8.1 运行 `openspec schemas` 确认 `tdd` schema 出现在列表中
- [x] 8.2 运行 `openspec new change test-tdd --schema tdd` 创建测试 change，确认成功
- [x] 8.3 运行 `openspec status --change test-tdd` 确认显示 5 个 artifact 的正确依赖关系
- [x] 8.4 清理测试 change：删除 `openspec/changes/test-tdd/` 目录
- [x] 8.5 在 Windows 路径风格下验证 schema 解析正常（确认 schema.yaml 中无硬编码路径分隔符）
