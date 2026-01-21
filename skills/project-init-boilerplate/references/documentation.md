# Documentation Generation Guide

Templates and patterns for generating comprehensive project documentation.

---

## Table of Contents

1. [Documentation Structure](#documentation-structure)
2. [MCP Usage Guide Template](#mcp-usage-guide-template)
3. [MCP Best Practices Template](#mcp-best-practices-template)
4. [Auto Dev Workflow Template](#auto-dev-workflow-template)
5. [Technical Docs Generation](#technical-docs-generation)
6. [Git Commit Patterns](#git-commit-patterns)

---

## Documentation Structure

### Standard Directory Layout

```
docs/
├── MCP_USAGE_GUIDE.md           # MCP server usage guide
├── MCP_BEST_PRACTICES.md        # MCP best practices
├── AUTO_DEV_WORKFLOW.md         # Development workflow
├── tech-docs/                   # Technical reference docs
│   ├── index.md                 # Tech docs index
│   ├── react.md                 # Framework docs (via Context7)
│   ├── vite.md                  # Build tool docs
│   ├── typescript.md            # Language docs
│   └── ...
└── guides/                      # Optional guides
    ├── getting-started.md
    └── contributing.md
```

### File Size Guidelines

| Document | Target Lines | Sections |
|----------|--------------|----------|
| MCP_USAGE_GUIDE.md | 800-1000 | 13+ sections |
| MCP_BEST_PRACTICES.md | 450-550 | 8+ sections |
| AUTO_DEV_WORKFLOW.md | 900-1000 | 10+ sections |
| Individual tech doc | 200-400 | Varies |

---

## MCP Usage Guide Template

### Header Section

```markdown
# {Project Name} MCP (Model Context Protocol) Usage Guide

> **版本**: 1.0.0
> **更新日期**: {YYYY-MM-DD}
> **适用项目**: {Project Name}

---

## 目录

1. [MCP 概述](#一mcp-概述)
2. [已配置的 MCP 服务器](#二已配置的-mcp-服务器)
3. [GitHub MCP 使用指南](#三github-mcp-使用指南)
4. [Context7 MCP 使用指南](#四context7-mcp-使用指南)
5. [Memory MCP 使用指南](#五memory-mcp-使用指南)
6. [Chrome DevTools MCP 使用指南](#六chrome-devtools-mcp-使用指南)
7. [ZAI MCP 使用指南](#七zai-mcp-使用指南)
8. [Web Search Prime MCP 使用指南](#八web-search-prime-mcp-使用指南)
9. [Web Reader MCP 使用指南](#九web-reader-mcp-使用指南)
10. [ZRead MCP 使用指南](#十zread-mcp-使用指南)
11. [4.5v Image Analysis MCP 使用指南](#十一45v-image-analysis-mcp-使用指南)
12. [Sequential Thinking MCP 使用指南](#十二sequential-thinking-mcp-使用指南)
13. [MCP 工作流集成](#十三mcp-工作流集成)
```

### MCP Overview Section

```markdown
## 一、MCP 概述

### 1.1 什么是 MCP?

MCP (Model Context Protocol) 是一个开放协议，允许 AI 应用与外部数据源和工具进行标准化交互。

### 1.2 为什么使用 MCP?

- **提升开发效率**: 快速查询技术文档、搜索代码示例
- **自动化工作流**: 自动创建 PR、管理 Issue
- **知识库管理**: 存储项目架构知识、决策记录
- **联网搜索**: 获取最新技术趋势、竞品分析
- **UI 自动化**: 自动化测试、性能分析

### 1.3 配置文件

MCP 服务器配置位于: `.claude/mcp_config.json`

### 1.4 环境变量

需要在 `.env` 文件中配置:

```bash
# GitHub Personal Access Token (for MCP)
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
```
```

### MCP Servers Table

```markdown
## 二、已配置的 MCP 服务器

| MCP 服务器 | 优先级 | 主要功能 | 相关性 |
|-----------|-------|---------|-------|
| **Memory** | ⭐⭐⭐⭐⭐ | 知识图谱、架构决策记录 | 项目知识管理 |
| **GitHub** | ⭐⭐⭐⭐⭐ | 代码仓库、PR、Issue 管理 | 开发工作流 |
| **Context7** | ⭐⭐⭐⭐⭐ | 技术文档查询 | 技术支持 |
| **Web Search Prime** | ⭐⭐⭐⭐ | 联网搜索、最新趋势 | 信息获取 |
| **Web Reader** | ⭐⭐⭐⭐ | 网页内容读取 | 文档获取 |
| **ZRead** | ⭐⭐⭐ | 开源仓库快速读取 | 代码学习 |
| **ZAI MCP** | ⭐⭐⭐ | UI 转代码、错误诊断 | 开发辅助 |
| **4.5v Image Analysis** | ⭐⭐⭐ | 图像分析、UI 理解 | 设计支持 |
| **Chrome DevTools** | ⭐⭐⭐ | UI 自动化测试 | 测试验证 |
| **Sequential Thinking** | ⭐⭐ | 复杂问题分析 | 问题解决 |
```

### Individual MCP Sections

For each MCP server, include:

```markdown
## 三、GitHub MCP 使用指南

### 3.1 功能概述

GitHub MCP 提供完整的 GitHub 仓库操作能力:

- **Issue 管理**: 创建、搜索、更新、关闭 Issue
- **PR 管理**: 创建、审查、合并 Pull Request
- **代码搜索**: 搜索代码、函数、类定义
- **仓库管理**: 分支、标签、发布管理
- **自动化**: Copilot 审查、任务分配

### 3.2 工具列表

| 工具 | 功能 |
|------|------|
| `mcp__github__search_code` | 搜索代码 |
| `mcp__github__create_pull_request` | 创建 PR |
| ... | ... |

### 3.3 使用场景

#### 场景 1: 搜索代码实现

\`\`\`typescript
// 工具: mcp__github__search_code
query: "Desktop.tsx filetype:tsx org:{owner}"
\`\`\`

#### 场景 2: 自动创建 Issue

\`\`\`typescript
mcp__github__issue_write({
  owner: "{owner}",
  repo: "{repo}",
  method: "create",
  title: "Bug: {description}",
  body: "...",
  labels: ["bug", "priority: high"]
})
\`\`\`

### 3.4 最佳实践

1. 提交前搜索是否已存在
2. 使用 PR 模板
3. 遵循标签规范
```

### Workflow Integration Section

```markdown
## 十三、MCP 工作流集成

### 13.1 开发前准备

\`\`\`
1. 查询项目架构知识 (Memory MCP)
   └── mcp__memory__search_nodes({ query: "..." })

2. 搜索最新技术趋势 (Web Search Prime MCP)
   └── mcp__web-search-prime__webSearchPrime({ query: "..." })
\`\`\`

### 13.2 开发中

\`\`\`
1. 查询技术文档 (Context7 MCP)
2. 搜索代码示例 (GitHub MCP)
3. 读取在线文档 (Web Reader MCP)
\`\`\`

### 13.3 开发后

\`\`\`
1. 创建 Pull Request (GitHub MCP)
2. 请求代码审查 (GitHub MCP)
3. 更新知识库 (Memory MCP)
\`\`\`

### 附录: 快速参考

| 需求 | 使用 MCP | 工具 |
|------|---------|------|
| 查架构知识 | Memory | `search_nodes` |
| 技术文档 | Context7 | `query-docs` |
| 代码示例 | GitHub | `search_code` |
| ... | ... | ... |
```

---

## MCP Best Practices Template

### Structure

```markdown
# {Project Name} MCP 最佳实践

> **版本**: 1.0.0
> **更新日期**: {YYYY-MM-DD}

---

## 目录

1. [MCP 使用原则](#一mcp-使用原则)
2. [Memory MCP 最佳实践](#二memory-mcp-最佳实践)
3. [GitHub MCP 最佳实践](#三github-mcp-最佳实践)
4. [Context7 MCP 最佳实践](#四context7-mcp-最佳实践)
5. [Web 工具 MCP 最佳实践](#五web-工具-mcp-最佳实践)
6. [视觉工具 MCP 最佳实践](#六视觉工具-mcp-最佳实践)
7. [性能优化](#七性能优化)
8. [故障排除](#八故障排除)
```

### Key Sections

```markdown
## 一、MCP 使用原则

### 1.1 核心原则

1. **优先查询**: 使用前先搜索 Memory MCP 中的项目知识
2. **适度使用**: 简单任务直接解决，不滥用 MCP
3. **结果验证**: MCP 结果需人工验证，不可盲目信任
4. **知识沉淀**: 有价值的知识及时存入 Memory MCP

### 1.2 选择决策树

```
需要查询项目架构?
├── 是 → Memory MCP (search_nodes)
└── 否 → 需要最新文档?
    ├── 是 → Context7 MCP (query-docs)
    └── 否 → 需要代码示例?
        ├── 是 → GitHub MCP (search_code)
        └── 否 → 直接处理
```

## 二、Memory MCP 最佳实践

### 2.1 实体设计原则

- **单一职责**: 每个实体代表一个明确的组件/服务/概念
- **具体描述**: observations 应包含具体细节，而非模糊描述
- **关系清晰**: 使用主动语态描述关系

### 2.2 初始化策略

**核心实体类别**:
1. **组件**: React/Vue 组件、页面
2. **服务**: API 客户端、业务逻辑
3. **路由**: API 端点、页面路由
4. **代码模式**: 常见模式、惯用法
5. **解决方案**: 问题解决记录

### 2.3 维护策略

- **定期清理**: 删除过时实体和关系
- **增量更新**: 新功能添加对应实体
- **版本标记**: 重要决策标注版本
```

---

## Auto Dev Workflow Template

### Structure

```markdown
# {Project Name} 自动化开发流程

> **版本**: 1.0.0
> **更新日期**: {YYYY-MM-DD}
> **哲学**: Vibe-Coding - 道生一，一生二，二生三，三生万物

---

## 目录

1. [Vibe-Coding 哲学](#一vibe-coding-哲学)
2. [四阶段 × 十二原则](#二四阶段--十二原则)
3. [开发工作流](#三开发工作流)
4. [MCP 集成模式](#四mcp-集成模式)
5. [代码模式](#五代码模式)
6. [胶水编程](#六胶水编程)
7. [质量标准](#七质量标准)
8. [工具链配置](#八工具链配置)
9. [最佳实践](#九最佳实践)
10. [常见问题](#十常见问题)
```

### Vibe-Coding Philosophy Section

```markdown
## 一、Vibe-Coding 哲学

### 1.1 核心概念

**道生一，一生二，二生三，三生万物**

- **一 (One)**: 单一命令触发整个流程
- **二 (Two)**: AI 读/写所有配置文件
- **三 (Three)**: AI 配置环境、创建文档、初始化知识
- **万物 (All Things)**: 生成的配置、文档、知识、标准

### 1.2 人机协作模式

```
人类: 意图、决策、验证
   ↓
AI:   执行、连接、生成
   ↓
人类: 审查、迭代、完善
```

### 1.3 认知负载预算

- **单次交互**: 1-3 个明确任务
- **上下文切换**: 最小化工具切换
- **反馈频率**: 每步完成后可见进度
```

---

## Technical Docs Generation

### Using Context7 MCP

```typescript
// Step 1: Resolve library ID
mcp__context7__resolve-library-id({
  libraryName: "reactflow"  // or "vite", "typescript", etc.
})
// Returns: "/xyflow/react"

// Step 2: Query documentation
mcp__context7__query-docs({
  libraryId: "/xyflow/react",
  query: "custom node with multiple handles"
})
```

### Tech Docs Structure

```markdown
# {Framework/Library} 技术文档

> 自动生成于: {YYYY-MM-DD}
> 源: Context7 MCP

## 目录

1. [概述](#概述)
2. [核心概念](#核心概念)
3. [API 参考](#api-参考)
4. [常见用法](#常见用法)
5. [最佳实践](#最佳实践)
6. [故障排除](#故障排除)
```

### Index File Template

```markdown
# 技术文档索引

本目录包含项目相关技术栈的参考文档，通过 Context7 MCP 自动同步获取最新内容。

## 文档列表

| 文档 | 描述 | 最后更新 |
|------|------|----------|
| [react.md](./react.md) | React 框架文档 | {YYYY-MM-DD} |
| [vite.md](./vite.md) | Vite 构建工具 | {YYYY-MM-DD} |
| [typescript.md](./typescript.md) | TypeScript 语言 | {YYYY-MM-DD} |
| ... | ... | ... |

## 更新方式

```bash
# 使用 Context7 MCP 更新技术文档
say "更新 React 技术文档"
say "同步 Vite 最新文档"
```
```

---

## Git Commit Patterns

### Conventional Commits

```bash
# Format
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature | `feat(canvas): 添加视频生成节点` |
| `fix` | Bug fix | `fix(desktop): 修复拖拽位置计算错误` |
| `docs` | Documentation | `docs(mcp): 添加 GitHub Token 配置说明` |
| `style` | Code style | `style(components): 统一导入顺序` |
| `refactor` | Refactoring | `refactor(api): 重构请求拦截器` |
| `perf` | Performance | `perf(canvas): 优化节点渲染性能` |
| `test` | Tests | `test(services): 添加 API 单元测试` |
| `build` | Build system | `build(electron): 更新 NSIS 配置` |
| `ci` | CI/CD | `ci(actions): 添加自动化测试` |
| `chore` | Maintenance | `chore(deps): 升级 React 到 19.1` |

### Initial Commit Pattern

```bash
# After project initialization
git add .
git commit -m "feat: 初始化 AI 辅助开发体系

- 配置 10 个 MCP 服务器
- 生成完整文档体系 (2000+ 行)
- 初始化 Memory MCP 知识库
- 配置开发规范 (.cursorrules)
- 添加环境变量模板"
```

### Feature Commit Pattern

```bash
# After implementing a feature
git commit -m "feat(canvas): 添加视频生成节点

- 新增 VideoNode 组件
- 集成 Veo API 服务
- 支持视频预览和导出

Closes #123"
```

---

## Document Generation Checklist

### MCP Usage Guide

- [ ] All 10 MCP servers documented
- [ ] Tool reference tables included
- [ ] Usage scenarios with code examples
- [ ] Best practices section
- [ ] Workflow integration guide
- [ ] Quick reference table
- [ ] Environment variables documented
- [ ] Related docs linked

### MCP Best Practices

- [ ] Core usage principles
- [ ] Decision tree for MCP selection
- [ ] Best practices per MCP
- [ ] Performance optimization tips
- [ ] Troubleshooting guide
- [ ] Common pitfalls

### Auto Dev Workflow

- [ ] Vibe-coding philosophy explained
- [ ] Four phases × twelve principles
- [ ] Development workflow documented
- [ ] MCP integration patterns
- [ ] Code patterns and examples
- [ ] Quality standards defined
- [ ] Tool chain configuration
- [ ] Best practices and FAQ

### Tech Docs

- [ ] Index file with navigation
- [ ] Framework/library docs synced
- [ ] API reference sections
- [ ] Common usage patterns
- [ ] Best practices included
- [ ] Update date stamps

---

**Last Updated**: 2026-01-21
