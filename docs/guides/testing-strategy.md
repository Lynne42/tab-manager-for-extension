# 测试策略执行契约

## 核心准则
1. 一切针对数据层 (`src/services` 及 `src/utils`) 的变更，**必须能够通过 `make test` 的 Vitest 单测自证正确性**。
2. Storage 封装层 (`storage.ts`) 相关的 Mock 应维持并收敛于基础基座配置内。

## 执行方法
- 常规检查与重构保证: 运行 `make test`
- 人工介入的可视化验证: 运行 `make test-ui`
