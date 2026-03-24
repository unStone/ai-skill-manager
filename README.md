# AI Skill Manager

一款开源的桌面应用，用于统一管理 AI 编程工具中的 Skills 和 Rules（如 Claude Skills、Cursor Rules 等）。设计灵感来自 [MiaoYan](https://github.com/tw93/MiaoYan)，采用极简主义风格和高效的三栏布局。

## 特性

- **多格式支持**：支持 `.claude/skills` 和 `.cursor/rules` 等主流 AI 工具的 Skill/Rule 管理格式
- **极简设计**：参考 MiaoYan 的设计哲学，提供清爽、高效的用户界面
- **三栏布局**：分类导航、Skill 列表、编辑器与预览，一目了然
- **实时预览**：编辑 Markdown 内容时实时预览渲染效果
- **暗黑模式**：完整的深色模式支持，保护眼睛
- **本地优先**：所有数据存储在本地文件系统，无云依赖，完全隐私
- **快速搜索**：全文搜索 Skill 名称和描述
- **跨平台**：基于 Tauri 和 React，支持 macOS、Windows、Linux

## 快速开始

### 前置要求

- Node.js 18+
- Rust 1.70+ （用于 Tauri）
- 系统依赖（Linux）：
  ```bash
  sudo apt-get install libwebkit2gtk-4.1-dev libappindicator3-dev librsvg2-dev
  ```

### 安装

```bash
# 克隆仓库
git clone https://github.com/yourusername/ai-skill-manager.git
cd ai-skill-manager

# 安装依赖
pnpm install

# 开发模式运行
pnpm tauri dev

# 构建生产版本
pnpm tauri build
```

## 使用

### 基本操作

1. **浏览 Skills**：在左侧边栏选择分类（Claude Skills、Cursor Rules 等）
2. **搜索**：使用顶部搜索框快速查找 Skill
3. **编辑**：选择一个 Skill，在右侧编辑器中修改内容
4. **预览**：编辑时自动预览 Markdown 渲染效果
5. **保存**：点击保存按钮或使用快捷键保存更改

### 文件格式

应用支持以下文件格式：

#### Claude Skills (`.claude/skills`)

```
~/.claude/skills/
├── my-skill-1/
│   └── SKILL.md
└── my-skill-2/
    └── SKILL.md
```

SKILL.md 文件格式：
```markdown
---
name: My Skill
description: A brief description of what this skill does
context: project
allowedTools: [tool1, tool2]
---

# Skill Content

Your skill instructions and content here...
```

#### Cursor Rules (`.cursor/rules`)

```
~/.cursor/rules/
├── rule-1.md
├── rule-2.mdc
└── rule-3.md
```

规则文件格式：
```markdown
---
name: My Rule
description: Rule description
globs: src/**/*.ts
alwaysApply: false
---

# Rule Content

Your rule content here...
```

## 项目结构

```
ai-skill-manager/
├── src/
│   ├── components/          # React 组件
│   │   ├── Sidebar.tsx      # 左侧导航栏
│   │   ├── SkillList.tsx    # 中间 Skill 列表
│   │   ├── Editor.tsx       # 右侧编辑器
│   │   └── MarkdownPreview.tsx # Markdown 预览
│   ├── store/
│   │   └── skillStore.ts    # Zustand 状态管理
│   ├── App.tsx              # 主应用组件
│   └── main.tsx             # 入口文件
├── src-tauri/               # Rust 后端代码
├── index.html               # HTML 模板
├── tailwind.config.js       # Tailwind CSS 配置
├── vite.config.ts           # Vite 构建配置
└── tsconfig.json            # TypeScript 配置
```

## 技术栈

- **前端框架**：React 19 + TypeScript
- **桌面框架**：Tauri v2
- **样式**：Tailwind CSS v4 + @tailwindcss/postcss
- **编辑器**：CodeMirror 6
- **Markdown 处理**：React Markdown + Remark + Rehype
- **状态管理**：Zustand
- **构建工具**：Vite 8
- **图标库**：Lucide React

## 开发

### 开发模式

```bash
pnpm tauri dev
```

### 构建

```bash
# 开发构建
pnpm build

# 生产构建
pnpm tauri build
```

## 路线图

### 第一期（当前）
- ✅ 基础三栏布局
- ✅ Claude Skills 支持
- ✅ Cursor Rules 支持
- ✅ Markdown 编辑与预览
- ✅ 暗黑模式
- ✅ 搜索功能

### 第二期（计划中）
- [ ] 创建新 Skill/Rule
- [ ] 删除 Skill/Rule
- [ ] 批量操作
- [ ] 标签管理
- [ ] 快捷键配置
- [ ] 设置页面
- [ ] 导入/导出功能

### 第三期（计划中）
- [ ] 同步到云端（可选）
- [ ] Skill 模板库
- [ ] 社区分享
- [ ] 版本控制集成
- [ ] 插件系统

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 致谢

- 设计灵感来自 [MiaoYan](https://github.com/tw93/MiaoYan)
- 由 [Tauri](https://tauri.app/) 提供支持
- 感谢所有贡献者和用户的支持

---

**Made with ❤️ for AI enthusiasts and developers**
