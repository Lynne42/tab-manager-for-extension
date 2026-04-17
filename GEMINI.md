# GEMINI.md - Tab Manager

## Project Overview
**Tab Manager** 是一个高性能 Chrome 扩展 (Manifest V3)，用于组织管理海量标签页。通过 **Spaces** (顶级), **Groups** (子类), 和 **Tabs** 三层结构实现数据索引。

### Core Technologies
- **Framework:** React 19 (TypeScript)
- **Styling:** Tailwind CSS 4.0 + PostCSS (符合 decisions/0002 规约)
- **Build Tool:** Vite + `@crxjs/vite-plugin`
- **Storage:** Chrome Storage API (`chrome.storage.local`) - **核心状态基座 (见 decisions/0001)**
- **Testing:** Vitest + jsdom (自动化验证基座)

---

## Task Gateway (Makefile)
项目所有生命周期指令已由 `Makefile` 统一接管，禁止直接调用复杂的 npm scripts。

| 指令 | 描述 |
| :--- | :--- |
| `make setup` | 依赖安装与环境初始化 |
| `make dev` | 启动开发服务器 (支持 HMR) |
| `make lint` | 强制代码格式化 (Prettier) 与 Lint 校验 (ESLint) |
| `make test` | 执行 Vitest 逻辑单测 |
| `make pack` | 构建生产产物并压缩为 `dist.zip` 供分发 |
| `make help` | 查看所有支持的任务入口说明 |

---

## Engineering Standards
### 1. 代码质量与拦截 (Git Hooks)
- **Commit Guard:** 使用 Husky + lint-staged。
- **Formatting:** 严格执行 `.prettierrc` 规约 (单引号, 无分号, 100 字符宽)。
- **Pre-commit:** 提交前强制运行 `eslint --fix` 和 `prettier --write`。

### 2. 自动化验证
- **Unit Tests:** 位于 `src/**/*.test.ts`。所有数据层 (`services/`, `utils/`) 变更必须通过回归测试。
- **Mocking:** 统一使用 Vitest 模拟 `chrome` 全局 API。

### 3. 持久化决策
- **SSOT:** 所有关键技术选型必须查阅 `docs/decisions/`。
- **State Flow:** 禁止引入 Redux 等外部状态库，直接监听 `chrome.storage.onChanged`。

---

## Directory Hierarchy & Knowledge Map
- `src/services/`: 业务逻辑层 (Spaces/Groups/Tabs 的 CRUD)。
- `src/utils/`: 存储封装 (`storage.ts`) 及工具函数。
- `docs/decisions/`: **架构决策记录 (Decision Logs) - 必须遵循。**
- `docs/guides/`: **项目执行指南 (Workflow Guides) - 开发流水线详细说明。**
- `docs/logic/`: **领域实体映射 (Core Logic) - 核心模型逻辑说明。**
- `toby/`: 数据迁移脚本。

---

## Key Files
- `manifest.json`: 扩展配置索引。
- `Makefile`: 项目唯一的作业中枢。
- `vitest.config.ts`: 自动化测试引擎配置。
- `src/types/index.ts`: 数据结构的“单一事实来源”。
