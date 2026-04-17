# Space 层级管理领域

## 定义
`Space` (工作空间) 是整个标签管理视图的最外层拓扑。

## 实体特性
- 含全局唯一的 ID 及可追踪的数据关联（内聚多个 `Group` 分支）。
- 其数据结构同步映射在 `chrome.storage.local` 的 `spaces` 切片之下。
