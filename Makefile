.DEFAULT_GOAL := help

## @开发与环境基座
setup: ## 依赖就绪：安装全量构建、测试、格式化依赖
	pnpm install

dev: ## 启动中枢：挂载 HMR Plugin 的 Vite 开发服务器
	pnpm run dev

## @规约流与验证层
lint: ## 代码净化：并发执行 ESLint 规则纠偏与 Prettier 格式洗刷
	pnpm eslint . --fix && pnpm prettier --write .

test: ## 逻辑自证：基于 jsdom 启动 Vitest 进行 Service 单测
	pnpm vitest run

test-ui: ## 用例面板：拉起 Vitest UI 进行可视化验证
	pnpm vitest --ui

## @构建与工件分发
build: ## 静态编译：构建生产环境 Vite 产物
	pnpm run build

pack: build ## 管道收尾：打包产物并通过 zip 汇聚可分发工件
	@echo "Packing extension to dist.zip..."
	@cd dist && zip -rq ../dist.zip *
	@echo "Pack completed."

clean: ## 环境重置：完全清理构建目录和 node_modules
	rm -rf dist dist.zip node_modules

help: ## 透出控制台手册：解析全量 Target 并聚合排版
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n"} /^[a-zA-Z_0-9-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)
