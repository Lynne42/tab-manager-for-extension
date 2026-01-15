# 项目结构

tab-manager/
├── src/
│   ├── components/
│   │   └── TabList.jsx    # 核心标签管理组件
│   ├── pages/
│   │   └── popup.jsx       # Popup 入口
│   ├── popup.html          # Popup 页面模板
│   ├── index.css           # Tailwind 样式入口
│   └── main.jsx            # 原 Vite 入口
├── public/
│   └── icon.svg            # 扩展图标
├── manifest.json           # 扩展清单
├── vite.config.js          # Vite + CRXJS 配置
├── tailwind.config.js      # Tailwind 配置
└── postcss.config.js       # PostCSS 配置

# 如何使用

1. 加载扩展：
- 打开 Chrome，访问 chrome://extensions/
- 开启"开发者模式"
- 点击"加载已解压的扩展程序"
- 选择项目根目录的 dist 文件夹

2. 开发模式：
pnpm run dev  # 已运行，支持 HMR

3. 生产构建：
pnpm run build

# 功能特性

  - 查看当前窗口所有标签
  - 实时搜索标签（标题/URL）
  - 点击切换标签
  - 悬停显示关闭按钮
  - 标签变更实时同步