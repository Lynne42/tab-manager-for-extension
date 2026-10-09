# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

Chrome 扩展 (Manifest V3)，用 Space → Group → Tab 三层结构管理标签页。React 19 + TypeScript + Tailwind v4，Vite + `@crxjs/vite-plugin` 构建，包管理器为 pnpm。

## 常用命令

`Makefile` 是指定的任务入口（`make help` 查看全部），底层调用 pnpm：

- `make setup` — `pnpm install`
- `make dev` — Vite dev server（固定 `localhost:5173`，`strictPort`，端口被占用会直接失败）
- `make lint` — `eslint . --fix && prettier --write .`（会改写文件）
- `make test` — `vitest run`（jsdom，匹配 `src/**/*.test.{ts,tsx}`）
- 单个测试：`pnpm vitest run src/utils/storage.test.ts`，或加 `-t "<用例名>"`
- `make build` — 产出 `dist/`，在 Chrome「加载已解压的扩展程序」中加载
- `make pack` — build 后压缩为 `dist.zip`（发布顺序：lint → test → pack）

Pre-commit（Husky + lint-staged）会对暂存文件执行 `eslint --fix` 与 `prettier --write`。Prettier：单引号、无分号、100 字符宽。

## 架构

**状态基座是 `chrome.storage.local` 的单个 key `tab_manager_data`**（`src/utils/storage.ts` 的 `STORAGE_KEY`），整棵 `TabManagerStorage` 树（`{ spaces[], activeSpaceId, version }`，每个 Space 内嵌 `groups[]`，每个 Group 内嵌 `tabs[]`）存为一个 JSON。类型定义见 `src/types/index.ts`（数据结构 SSOT）。决策见 `docs/decisions/0001`：禁止引入 Redux 等状态库，UI 通过 `onStorageChanged`（`storage.ts`）监听同步。

**数据层调用链**：`components/` → `services/{space,group,tab}Service.ts` → `utils/storage.ts`。每个 service 函数都是「`getStorage()` 读取整棵树 → 内存中修改 → `setStorage()` 整体写回」。因此：

- 任何写操作都是全量覆写；并发的读-改-写会互相丢更新（ADR 中已注明需要容错）。
- 嵌套实体需要 `spaceId`（及 `groupId`）才能定位，例如 `updateTab(spaceId, groupId, tabId, …)`；Tab/Group 自身也冗余存了 `groupId`/`spaceId`，跨 Space 的 `moveGroup`/`moveTab` 必须同步更新这些字段。
- 排序靠各实体的 `order` 字段，对应 `reorderSpaces/reorderGroups/reorderTabs`。

**入口页面（多入口）**：
- Popup：`manifest.json` 的 `action.default_popup` → `src/popup.html` → `pages/popup.tsx` → `components/Spaces.tsx`
- Dashboard：`src/dashboard.html` → `pages/dashboard.tsx` → `components/Dashboard.tsx`（子组件在 `components/dashboard/`）。它不在 manifest 中，而是通过 `vite.config.ts` 的 `build.rollupOptions.input` 单独打包。
- Service worker：`src/background.ts`，目前仅有 `onInstalled` 日志，tab 事件监听均为注释占位。
- `src/main.tsx` / `src/App.tsx` / 根 `index.html` 是 Vite 模板遗留，不在扩展入口链路上。

**导入导出**：`utils/dataManager.ts` 负责导出（过滤掉空 Group 与内部字段）、导入格式转换与合并（`convertImportFormatToStorage` / `mergeImportedData`）。`toby/` 下是 Toby、Tabme 数据的一次性迁移脚本与样本 JSON，不属于应用代码。`data/init.ts` 提供 Demo 数据初始化（仅在存储为空时生效）。

## 约定

- 路径别名 `@/` → `src/`（vite 与 tsconfig 均已配置，但现有代码多用相对路径）。
- 样式遵循 `docs/decisions/0002`：Tailwind v4 (`@tailwindcss/postcss`)，不用内联冗余样式和 CSS Modules，通用样式抽成原子类（如 `src/atoms/Button.tsx`）。
- `src/services/`、`src/utils/` 的改动必须有 Vitest 回归测试覆盖；`chrome` 全局 API 用 Vitest mock（参考 `src/utils/storage.test.ts`）。
- 更多背景见 `GEMINI.md`、`docs/decisions/`、`docs/guides/`、`docs/logic/`。
