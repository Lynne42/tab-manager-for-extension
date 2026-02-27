# IMPLEMENTATION_PLAN - Tab Move Feature

## Objectives
实现 Tab 跨 Group 和跨 Space 的移动功能，提升标签页管理的灵活性。

## Tasks
- [√] **Asset Preparation**: 新增 `src/assets/move.svg` 图标。
- [√] **Service Layer**: 增强 `src/services/tabService.ts` 中的 `moveTab` 以支持跨 Space 移动。
- [√] **New Component**: 创建 `src/components/dashboard/MoveTabModal.tsx` 交互组件。
- [√] **UI Integration - Tab**: 在 `src/components/dashboard/Tab.tsx` 增加移动按钮及 `onMove` 回调。
- [√] **UI Integration - Detail**: 在 `src/components/dashboard/SpaceDetail.tsx` 集成模态框并处理业务逻辑。
- [√] **Data Flow**: 更新 `Dashboard.tsx` 确保 `SpaceDetail` 拥有跨 Space 移动所需的全局数据。

## Logs
- [2026-02-27] 初始化计划。
- [2026-02-27] 完成所有任务开发。

