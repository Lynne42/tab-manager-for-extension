# 1. 状态管理依赖 Chrome Storage 架构

Date: 2024-03-23
Status: Accepted

## Context
扩展面临深层级（Space->Group->Tab）的海量数据持有与跨 Popup / Dashboard 页面的实时状态同步问题。

## Decision
采用 `chrome.storage.local` 以单键值 `tab_manager_data` 储存深层 JSON 对象。不引入外部状态库，直接透过 `onStorageChanged` 监听机制同步 React 状态。

## Consequences
- **Pros**: 维持极简架构，彻底去除同源跨页面通信负担。
- **Cons**: 序列化及 I/O 是性能上限，且并发写入时需要特殊容错。
