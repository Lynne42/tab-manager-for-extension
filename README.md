# Tab Manager - 浏览器标签管理扩展

![Tab Manager Logo](public/ico.png)

一个高效管理浏览器标签页的 Chrome 扩展程序，帮助您组织和整理大量的浏览器标签。

## 🚀 功能特性

### 核心功能
- **工作空间管理**：创建多个工作空间来分类管理不同的标签页
- **分组管理**：在每个工作空间内创建分组，进一步组织标签页
- **标签管理**：添加、删除、标签页
- **拖拽排序**：支持拖拽重新排列工作空间的顺序
- **搜索功能**：快速搜索工作空间和标签页

### 数据管理
- **导入导出**：支持备份和恢复工作空间数据
- **数据过滤**：导出的数据只包含必要字段，避免冗余信息
- **增量导入**：导入时保留现有数据，合并新导入的内容
- **自动生成**：自动推导 favicon URL 和标题

### 用户体验
- **响应式设计**：适配不同屏幕尺寸
- **暗色主题**：护眼的深色界面
- **实时同步**：修改后立即保存到本地存储
- **友好提示**：清晰的操作反馈和确认提示

## 📦 安装说明

### 开发环境安装

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd tab-manager
   ```

2. **安装依赖**
   ```bash
   pnpm install
   ```

3. **构建项目**
   ```bash
   pnpm run build
   ```

4. **加载扩展到 Chrome**
   - 打开 Chrome 浏览器
   - 访问 `chrome://extensions/`
   - 开启"开发者模式"
   - 点击"加载已解压的扩展程序"
   - 选择项目的 `dist` 文件夹

## 🛠️ 技术栈

- **框架**：React 18 + TypeScript
- **构建工具**：Vite
- **样式**：Tailwind CSS
- **存储**：Chrome Storage API
- **图标**：SVG + React Components
- **扩展规范**：Chrome Extension Manifest V3

## 📁 项目结构

```
tab-manager/
├── src/                          # 源代码目录
│   ├── components/               # React 组件
│   │   ├── dashboard/            # 仪表板页面组件
│   │   ├── atoms/                # 基础组件
│   ├── pages/                    # 页面入口
│   │   ├── popup.tsx             # Popup 窗口
│   │   └── dashboard.tsx         # 仪表板页面
│   ├── services/                 # 数据服务
│   ├── types/                    # TypeScript 类型定义
│   │   └── index.ts
│   ├── utils/                    # 工具函数
│   │   ├── index.ts
│   │   ├── storage.ts            # 存储工具
│   │   ├── dataManager.ts        # 数据导入导出
│   │   └── url.ts                # URL 工具
│   ├── data/                     # 数据初始化
│   │   └── init.ts               # Demo 数据初始化
│   ├── assets/                   # 静态资源
│   ├── config/                   # 配置文件
│   ├── popup.html                # Popup 页面模板
│   ├── dashboard.html            # 仪表板页面模板
│   ├── manifest.json             # 扩展配置文件
│   └── index.css                 # 全局样式
├── dist/                         # 构建输出目录
├── public/                       # 公共资源
│   └── ico.png                   # 扩展图标
├── .gitignore                    # Git 忽略文件
├── package.json                  # 项目配置
├── tsconfig.json                 # TypeScript 配置
└── vite.config.ts                # Vite 配置
```

## 📖 使用指南

### 基本使用

1. **打开扩展**
   - 点击工具栏中的扩展图标打开 Popup 窗口
   - 或点击扩展图标打开完整的仪表板页面

2. **创建工作空间**
   - 在 Popup 中点击 "New Space" 按钮
   - 输入工作空间名称和描述
   - 选择图标和颜色

3. **创建分组**
   - 选择一个工作空间
   - 点击 "New Group" 按钮
   - 输入分组名称和描述

4. **添加标签页**
   - 选择一个分组
   - 点击 "+" 按钮添加当前标签页
   - 或使用 "Add Tab" 按钮手动添加

### 高级功能

#### 拖拽排序
- 在工作空间列表中拖拽项目来重新排序
- 排序会自动保存到本地存储

#### 数据导入导出
- 点击 Header 中的 "Export" 按钮导出所有数据
- 点击 "Import" 按钮导入 JSON 文件
- 导入时可以选择合并或替换现有数据

#### 搜索过滤
- 使用搜索框快速查找工作空间
- 支持按名称和描述搜索

## 🔧 配置选项

### 工作空间配置
- **名称**：工作空间的显示名称
- **描述**：工作空间的详细描述
- **图标**：工作空间的图标（预设多种图标）
- **颜色**：工作空间的主题颜色

### 分组配置
- **名称**：分组的显示名称
- **描述**：分组的详细描述
- **图标**：分组的图标（可选）
- **颜色**：分组的主题颜色（可选）

### 标签配置
- **URL**：网页地址
- **标题**：标签页标题
- **描述**：自定义描述信息
- **状态**：标签页状态（active/loading/idle）
- **固定**：是否固定标签页

## 📊 数据格式

### 导出的数据结构
```json
{
  "spaces": [
    {
      "name": "工作空间名称",
      "description": "工作空间描述",
      "icon": "work",
      "color": "blue",
      "groups": [
        {
          "name": "分组名称",
          "description": "分组描述",
          "icon": "code",
          "color": "purple",
          "tabs": [
            {
              "url": "https://example.com",
              "title": "页面标题",
              "favIconUrl": "https://example.com/favicon.ico",
              "description": "描述信息",
              "status": "idle",
              "pinned": false
            }
          ]
        }
      ]
    }
  ],
  "activeSpaceId": "当前激活的工作空间ID",
  "version": 1,
  "exportTime": "2024-01-01T12:00:00.000Z",
  "exportedFrom": "Tab Manager"
}
```

## 🚀 开发指南

### 构建和发布

1. **开发构建**
   ```bash
   pnpm run dev
   ```

2. **生产构建**
   ```bash
   pnpm run build
   ```

3. **发布到 Chrome Web Store**
   - 打开 [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/developer/dashboard)
   - 上传 `dist` 目录中的文件
   - 填写扩展信息并提交审核

## 🐛 故障排除

### 常见问题

1. **数据丢失**
   - 检查 Chrome 是否清除了本地存储
   - 使用导入功能恢复备份数据

2. **扩展无法加载**
   - 确保开启了开发者模式
   - 检查 manifest.json 配置是否正确

3. **导入失败**
   - 确保 JSON 文件格式正确
   - 检查文件内容是否符合预期格式

### 调试技巧

1. **查看控制台日志**
   - 在扩展的 popup 窗口中右键选择"检查"
   - 查看 Console 面板的错误信息

2. **使用 Chrome DevTools**
   - 打开 DevTools (F12)
   - 切换到 Application > Storage 查看存储数据

## 🤝 贡献指南

我们欢迎社区贡献！请遵循以下步骤：

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证。查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 联系方式

- 问题反馈：[GitHub Issues](https://github.com/your-repo/tab-manager/issues)


**Tab Manager** - 让您的浏览器标签管理更加高效！ 🚀