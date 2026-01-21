# 项目初始化标准流程 Skill (Project Init Boilerplate)

> **理念**: 遵循 vibe-coding 哲学 - "道生一，一生二，二生三，三生万物"
> **目标**: 将教科书级项目初始化过程提炼为可复用 Skill

---

## 简介

本 Skill 将任意空仓库快速转换为生产就绪的 AI 辅助开发环境，包括：
- **MCP 配置**: 10 个 MCP 服务器配置
- **文档系统**: 完整的项目文档体系（2000+ 行）
- **知识库**: Memory MCP 知识图谱初始化
- **开发规范**: .cursorrules、CLAUDE.md 等

## 触发方式

使用以下任意短语触发此 Skill：

```bash
# 中文触发
"帮我初始化项目"
"配置 MCP"
"创建项目文档"
"初始化知识库"

# 英文触发
"setup project"
"initialize repo"
"configure MCP"
```

## 快速开始

### 一键初始化（推荐）

```bash
# 单条命令完成所有初始化
say "帮我初始化项目"

# AI 将自动：
# 1. 分析项目结构
# 2. 创建 MCP 配置
# 3. 生成项目文档
# 4. 初始化知识库
# 5. 配置开发规范
```

### 分步初始化

```bash
# 第 1 步：配置 MCP 服务器
say "配置 MCP 服务器"

# 第 2 步：创建项目文档
say "创建项目文档"

# 第 3 步：初始化知识库
say "初始化知识库"

# 第 4 步：配置开发规范
say "配置开发规范"
```

### 交互式初始化

```bash
# AI 会在每个步骤前询问确认
say "初始化项目，交互式确认"

# 输出示例：
# ? 检测到 React + Vite 项目，是否配置 React Flow 相关文档? (Y/n)
# ? 是否需要 GitHub MCP? 需要 GitHub Token，是否已配置? (Y/n)
# ? 是否初始化 Memory MCP 知识库? (Y/n)
```

## 初始化模式

### 完整模式

配置所有 10 个 MCP 服务器：
- Memory（知识图谱）
- GitHub（仓库管理）
- Context7（技术文档）
- Web Search Prime（联网搜索）
- Web Reader（网页读取）
- ZRead（开源仓库读取）
- ZAI MCP（UI 转代码、错误诊断）
- 4.5v Image Analysis（图像分析）
- Chrome DevTools（UI 自动化）
- Sequential Thinking（复杂问题分析）

### 最小化模式

仅配置核心 MCP 服务器（2-3 个）：
- Memory（必需）
- GitHub（需要 Token）
- Context7（技术文档）

```bash
say "初始化项目，最小化配置"
```

### 自定义模式

选择特定的 MCP 服务器：

```bash
# 只配置指定的 MCP
say "初始化项目，只配置 memory 和 github MCP"

# 排除特定 MCP
say "初始化项目，跳过 chrome-devtools"
```

## 项目类型支持

### 前端项目

- **React + Vite**
- **Vue + Vite**
- **Svelte**
- **Angular**

```bash
say "初始化 React 项目"
say "初始化 Vue 项目"
```

### 后端项目

- **Node.js + Express**
- **Python + FastAPI**
- **Go + Gin**
- **Rust + Axum**

```bash
say "初始化 Express 项目"
say "初始化 FastAPI 项目"
```

### 全栈项目

- **MERN** (MongoDB + Express + React + Node.js)
- **MEAN** (MongoDB + Express + Angular + Node.js)
- **PERN** (PostgreSQL + Express + React + Node.js)

```bash
say "帮我初始化 MERN 项目"
```

### 桌面应用

- **Electron**
- **Tauri**

```bash
say "初始化 Electron 桌面应用项目"
```

## 生成文件结构

```
.
├── .claude/
│   └── mcp_config.json           # MCP 服务器配置
├── .env.example                  # 环境变量模板
├── .cursorrules                  # Cursor IDE 编码规则
├── CLAUDE.md                     # Claude Code 项目说明
├── docs/
│   ├── MCP_USAGE_GUIDE.md        # MCP 使用指南（~820 行）
│   ├── MCP_BEST_PRACTICES.md     # MCP 最佳实践（~470 行）
│   ├── AUTO_DEV_WORKFLOW.md      # 自动化开发流程（~912 行）
│   ├── tech-docs/                # 技术文档
│   │   ├── index.md
│   │   ├── react.md              # React 文档
│   │   ├── vite.md               # Vite 文档
│   │   └── typescript.md         # TypeScript 文档
│   └── guides/                   # 可选指南
├── CHANGELOG.md                  # 变更日志模板
└── CONTRIBUTING.md               # 贡献指南模板
```

## 环境变量配置

复制 `.env.example` 到 `.env` 并填入实际值：

```bash
# GitHub Personal Access Token（必需，如使用 GitHub MCP）
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx

# 可选的 API 密钥
GEMINI_API_KEY=your_gemini_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here
```

### 获取 GitHub Token

1. 访问：https://github.com/settings/tokens
2. 生成新的 Personal Access Token
3. 需要的权限：`repo`, `issues`, `pull_requests`

## 知识库初始化

Memory MCP 知识库将包含以下实体类型：

| 实体类型 | 描述 | 示例 |
|---------|------|------|
| **组件** | React/Vue 组件 | App.tsx, Desktop.tsx |
| **服务** | API 客户端、业务逻辑 | apiService, authService |
| **路由** | API 端点、页面路由 | GET /api/users, /login |
| **代码模式** | 常见编程模式 | useCallback 模式 |
| **解决方案** | 问题解决记录 | 缩略图生成方案 |

## 开发规范

### Git 提交规范

遵循 Conventional Commits：

```bash
feat(canvas): 添加视频生成节点
fix(desktop): 修复拖拽位置计算错误
docs(mcp): 添加 GitHub Token 配置说明
```

### 类型说明

| 类型 | 描述 | 示例 |
|------|------|------|
| `feat` | 新功能 | `feat(api): 添加用户认证` |
| `fix` | Bug 修复 | `fix(ui): 修复按钮样式` |
| `docs` | 文档 | `docs(readme): 更新安装说明` |
| `style` | 代码风格 | `style: 统一导入顺序` |
| `refactor` | 重构 | `refactor(api): 重构请求拦截器` |
| `perf` | 性能优化 | `perf(canvas): 优化渲染性能` |
| `test` | 测试 | `test(api): 添加单元测试` |
| `build` | 构建系统 | `build(vite): 更新配置` |
| `ci` | CI/CD | `ci(actions): 添加自动化测试` |
| `chore` | 维护 | `chore(deps): 升级依赖版本` |

## 示例场景

### 场景 1：全新 React 项目

```bash
用户: "帮我初始化项目"
上下文: 新建的 React + Vite 项目

AI 将执行：
1. 检测项目类型（React + Vite）
2. 创建 .claude/mcp_config.json（10 个 MCP 服务器）
3. 创建 .env.example
4. 生成 docs/MCP_USAGE_GUIDE.md（820 行）
5. 生成 docs/MCP_BEST_PRACTICES.md（470 行）
6. 生成 docs/AUTO_DEV_WORKFLOW.md（912 行）
7. 创建 docs/tech-docs/（React Flow, Vite, TypeScript 文档）
8. 初始化 Memory MCP 知识库（组件、服务实体）
9. 更新 .cursorrules, CLAUDE.md

预期输出：
- 10 个 MCP 服务器配置完成
- 完整文档体系（2000+ 行）
- 知识库 20-50 个实体
- 开发规范就位
- Git 提交："feat: 初始化 AI 辅助开发体系"
```

### 场景 2：现有项目增强

```bash
用户: "为现有项目配置 AI 辅助开发"
上下文: 已有 Express 后端项目，无 AI 配置

AI 将执行：
1. 扫描现有结构
2. 询问："检测到 Express.js 后端，是否配置 API 文档?"
3. 创建 MCP 配置（跳过 React Flow，添加 API 相关文档）
4. 生成后端专属文档
5. 初始化知识库（路由、服务实体）
6. 更新现有 CLAUDE.md

预期输出：
- 针对后端项目的 MCP 配置
- API 专属文档
- 路由和中间件知识库
- 不破坏现有代码
```

## 质量检查

初始化完成后，运行质量检查：

```bash
say "检查初始化质量"

# 验证内容：
# ✓ MCP 服务器配置正确
# ✓ 文档完整
# ✓ 知识库已初始化
# ✓ 环境变量已设置
# ✓ Git 提交就绪
```

## 故障排除

### 常见问题

| 问题 | 解决方案 |
|------|----------|
| MCP 服务器未找到 | 运行 `npx -y package-name` 安装 |
| GitHub 认证失败 | 检查 `.env` 中的 `GITHUB_TOKEN` |
| JSON 解析错误 | 验证 `mcp_config.json` 语法 |
| 文档缺失 | 运行文档生成命令 |
| 知识库为空 | 运行知识库初始化命令 |

### 获取帮助

```bash
# 检查 MCP 状态
say "检查所有 MCP 服务器状态"

# 重新运行初始化
say "重新运行项目初始化，只配置缺少的部分"

# 生成缺失文档
say "生成缺失的文档"
```

## 文档结构

### references/ - 参考文档

| 文档 | 描述 | 行数 |
|------|------|------|
| `index.md` | 导航索引 | ~100 |
| `mcp-servers.md` | MCP 服务器详细配置指南 | ~800 |
| `documentation.md` | 文档生成模板 | ~600 |
| `knowledge-base.md` | 知识库初始化指南 | ~500 |
| `quality-checklist.md` | 质量检查清单 | ~300 |

### assets/ - 模板文件

- `mcp_config.template.json` - MCP 配置模板
- `.env.example` - 环境变量模板
- `.cursorrules.template` - Cursor 规则模板

### scripts/ - 辅助脚本

- `setup-mcp.sh` - MCP 配置脚本
- `init-knowledge-base.sh` - 知识库初始化指南

## Vibe-Coding 哲学

本 Skill 遵循 vibe-coding 原则：

- **一**：单条命令触发整个初始化流程
- **二**：AI 读/写所有配置文件
- **三**：AI 配置环境、创建文档、初始化知识
- **万物**：生成的配置、文档、知识、标准

四阶段 × 十二原则：
1. **准备阶段**：单一真源 (docs/)、提示词先行 (清晰触发)
2. **执行阶段**：人类在环 (交互确认)、任务块化 (分步执行)
3. **协作阶段**：认知负载预算 (用户控制节奏)、流保护罩 (非阻塞)
4. **迭代阶段**：休息反思 (质量关卡)、技能平等 (从初始化中学习)

## 维护

- **来源**：Penguin-Magic 项目初始化实践、vibe-coding 哲学
- **最后更新**：2026-01-21
- **已知限制**：
  - 项目类型检测基于启发式（package.json、requirements.txt）
  - MCP 服务器可用性依赖外部包
  - GitHub MCP 功能需要 GitHub Token
  - 知识库初始化依赖代码库结构

## 贡献

欢迎提交 Issue 和 Pull Request 来改进此 Skill！

## 许可证

MIT License

---

**版本**: 1.0.0
**创建日期**: 2026-01-21
**基于**: Penguin-Magic 项目初始化实践 + vibe-coding 哲学
