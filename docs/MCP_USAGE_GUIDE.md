# 企鹅工坊 MCP (Model Context Protocol) 使用指南

> **版本**: 1.0.0
> **更新日期**: 2026-01-21
> **适用项目**: Penguin-Magic (企鹅工坊)

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

---

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

---

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

---

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
| `mcp__github__search_repositories` | 搜索仓库 |
| `mcp__github__issue_write` | 创建/更新 Issue |
| `mcp__github__issue_read` | 读取 Issue 详情 |
| `mcp__github__list_issues` | 列出 Issues |
| `mcp__github__create_pull_request` | 创建 PR |
| `mcp__github__pull_request_read` | 读取 PR 详情 |
| `mcp__github__pull_request_review_write` | 创建/提交审查 |
| `mcp__github__merge_pull_request` | 合并 PR |
| `mcp__github__list_commits` | 列出提交记录 |
| `mcp__github__get_file_contents` | 获取文件内容 |
| `mcp__github__create_or_update_file` | 创建/更新文件 |
| `mcp__github__request_copilot_review` | 请求 Copilot 审查 |
| `mcp__github__assign_copilot_to_issue` | 分配 Copilot 到 Issue |

### 3.3 使用场景

#### 场景 1: 搜索代码实现

```typescript
// 工具: mcp__github__search_code
// 用途: 快速定位代码实现

// 示例 1: 搜索 React 组件
query: "Desktop.tsx filetype:tsx org:leon30083"

// 示例 2: 搜索 API 调用
query: "fetchCreativeIdeas language:typescript"

// 示例 3: 搜索特定模式
query: "useCallback.*deps filetype:tsx"
```

#### 场景 2: 自动创建 Issue

```typescript
// 工具: mcp__github__issue_write
// 用途: 从错误日志自动创建 Bug 报告

// 示例: 创建 Bug Issue
{
  "owner": "leon30083",
  "repo": "Penguin-Magic",
  "method": "create",
  "title": "修复: 桌面拖拽时位置计算错误",
  "body": `## 问题描述
拖拽桌面项时，位置计算不正确，导致项跳跃到错误位置。

## 复现步骤
1. 打开桌面工作空间
2. 拖拽任意图片项
3. 观察位置跳跃

## 错误信息
\`\`\`
TypeError: Cannot read properties of undefined
    at Desktop.tsx:1234
\`\`\`

## 环境
- 版本: 1.4.0
- 系统: Windows 11`,
  "labels": ["bug", "desktop", "priority: high"],
  "assignees": ["developer"]
}
```

#### 场景 3: 创建 Pull Request

```typescript
// 工具: mcp__github__create_pull_request
// 用途: 功能完成后自动创建 PR

// 示例: 创建功能 PR
{
  "owner": "leon30083",
  "repo": "Penguin-Magic",
  "title": "feat: 添加 Veo 视频生成节点",
  "head": "feature/veo-video-node",
  "base": "dev",
  "body": `## 概述
添加 Veo 模型视频生成节点，支持文生视频功能。

## 变更内容
- 新增 VideoNode 节点组件
- 集成 Veo API 服务
- 添加视频预览功能
- 支持导出 MP4 格式

## 测试
- [ ] 文生视频功能正常
- [ ] 视频预览显示正确
- [ ] 导出功能正常
- [ ] 错误处理完善

## 截图
![视频生成节点](screenshot.png)

Closes #123`,
  "draft": false
}
```

#### 场景 4: 代码审查工作流

```typescript
// 步骤 1: 创建待审查
mcp__github__pull_request_review_write({
  "method": "create",
  "owner": "leon30083",
  "repo": "Penguin-Magic",
  "pullNumber": 42
  // event 不指定 = 创建 pending review
})

// 步骤 2: 添加审查评论
mcp__github__add_comment_to_pending_review({
  "owner": "leon30083",
  "repo": "Penguin-Magic",
  "pullNumber": 42,
  "path": "components/Desktop/Desktop.tsx",
  "line": 1234,
  "side": "RIGHT",
  "body": "建议使用 useCallback 优化这个函数",
  "subjectType": "LINE"
})

// 步骤 3: 提交审查
mcp__github__pull_request_review_write({
  "method": "submit_pending",
  "owner": "leon30083",
  "repo": "Penguin-Magic",
  "pullNumber": 42,
  "event": "COMMENT",
  "body": "总体代码质量良好，有几点小建议"
})
```

#### 场景 5: 请求 Copilot 审查

```typescript
// 工具: mcp__github__request_copilot_review
// 用途: 请求 GitHub Copilot 自动审查 PR

mcp__github__request_copilot_review({
  "owner": "leon30083",
  "repo": "Penguin-Magic",
  "pullNumber": 42
})
```

### 3.4 最佳实践

1. **提交前搜索**: 创建 Issue 前先搜索是否已存在
2. **PR 模板**: 使用 `.github/PULL_REQUEST_TEMPLATE.md`
3. **标签规范**: 使用统一的标签体系 (bug, feature, enhancement)
4. **分支策略**: feature/* 用于新功能, hotfix/* 用于紧急修复

---

## 四、Context7 MCP 使用指南

### 4.1 功能概述

Context7 提供最新的技术文档查询服务:

- **实时文档**: 获取最新的库文档和代码示例
- **广泛支持**: React, TypeScript, Vite, Electron 等
- **代码示例**: 提供可直接使用的代码片段

### 4.2 工具列表

| 工具 | 功能 |
|------|------|
| `mcp__context7__resolve-library-id` | 解析库 ID |
| `mcp__context7__query-docs` | 查询文档 |

### 4.3 使用场景

#### 场景 1: 查询 React Flow 文档

```typescript
// 步骤 1: 解析库 ID
mcp__context7__resolve-library-id({
  "query": "How to create custom nodes with multiple input/output handles",
  "libraryName": "reactflow"
})
// 返回: "/xyflow/react"

// 步骤 2: 查询文档
mcp__context7__query-docs({
  "libraryId": "/xyflow/react",
  "query": "How to create custom nodes with multiple input/output handles"
})
```

#### 场景 2: 查询 Electron IPC 通信

```typescript
mcp__context7__resolve-library-id({
  "query": "Main and renderer process communication with invoke and handle",
  "libraryName": "electron"
})
// 返回: "/electron/electron"

mcp__context7__query-docs({
  "libraryId": "/electron/electron",
  "query": "Main and renderer process communication with invoke and handle"
})
```

#### 场景 3: 查询 Vite 配置

```typescript
mcp__context7__resolve-library_id({
  "query": "How to configure path aliases in vite.config.ts",
  "libraryName": "vite"
})

mcp__context7__query-docs({
  "libraryId": "/vitejs/vite",
  "query": "How to configure path aliases in vite.config.ts"
})
```

### 4.4 常用库 ID

| 库名 | Context7 ID |
|------|-------------|
| React | `/facebook/react` |
| React Flow | `/xyflow/react` |
| TypeScript | `/microsoft/TypeScript` |
| Vite | `/vitejs/vite` |
| Electron | `/electron/electron` |
| Zustand | `/pmndrs/zustand` |
| Sharp | `/lovell/sharp` |

---

## 五、Memory MCP 使用指南

### 5.1 功能概述

Memory MCP 提供知识图谱管理能力:

- **实体管理**: 创建、读取、删除实体
- **关系管理**: 建立实体间的关系
- **观察记录**: 存储实体的观察信息
- **知识搜索**: 搜索和检索知识

### 5.2 工具列表

| 工具 | 功能 |
|------|------|
| `mcp__memory__create_entities` | 创建实体 |
| `mcp__memory__create_relations` | 创建关系 |
| `mcp__memory__add_observations` | 添加观察 |
| `mcp__memory__open_nodes` | 读取节点 |
| `mcp__memory__search_nodes` | 搜索节点 |
| `mcp__memory__read_graph` | 读取整个知识图谱 |
| `mcp__memory__delete_entities` | 删除实体 |
| `mcp__memory__delete_relations` | 删除关系 |
| `mcp__memory__delete_observations` | 删除观察 |

### 5.3 使用场景

#### 场景 1: 初始化项目知识库

```typescript
// 创建组件实体
mcp__memory__create_entities({
  "entities": [
    {
      "name": "App.tsx",
      "entityType": "React Component",
      "observations": [
        "主应用组件，3,746 行代码",
        "管理应用全局状态",
        "包含桌面、画布、侧边栏等主要功能区域"
      ]
    },
    {
      "name": "Desktop.tsx",
      "entityType": "React Component",
      "observations": [
        "桌面工作空间组件，2,471 行代码",
        "支持图片项、文件夹项、堆栈项",
        "基于网格的拖拽定位系统"
      ]
    },
    {
      "name": "Canvas.tsx",
      "entityType": "React Component",
      "observations": [
        "画布组件，使用 @xyflow/react",
        "支持节点连接和可视化编程",
        "6 种节点类型"
      ]
    }
  ]
})

// 创建关系
mcp__memory__create_relations({
  "relations": [
    {
      "from": "App.tsx",
      "to": "Desktop.tsx",
      "relationType": "导入并渲染"
    },
    {
      "from": "App.tsx",
      "to": "Canvas.tsx",
      "relationType": "导入并渲染"
    },
    {
      "from": "Desktop.tsx",
      "to": "Canvas.tsx",
      "relationType": "可以打开"
    }
  ]
})
```

#### 场景 2: 记录架构决策

```typescript
// 创建决策实体
mcp__memory__create_entities({
  "entities": [
    {
      "name": "数据存储决策",
      "entityType": "架构决策",
      "observations": [
        "选择 JSON 文件而非数据库",
        "原因: 桌面应用无需复杂查询，文件存储更简单",
        "位置: backend-nodejs/data/",
        "文件: creative_ideas.json, history.json, settings.json 等"
      ]
    },
    {
      "name": "画布技术选型",
      "entityType": "架构决策",
      "observations": [
        "选择 @xyflow/react (React Flow)",
        "原因: 成熟的节点编辑器解决方案",
        "版本: 12.10.0",
        "支持自定义节点和边"
      ]
    }
  ]
})
```

#### 场景 3: 记录问题解决方案

```typescript
mcp__memory__create_entities({
  "entities": [
    {
      "name": "缩略图生成方案",
      "entityType": "解决方案",
      "observations": [
        "问题: 大图加载慢，影响性能",
        "方案: 使用 Sharp 生成缩略图",
        "规格: 160px 宽度，80% 质量",
        "位置: thumbnails/ 目录",
        "实现: backend-nodejs/src/routes/files.js"
      ]
    }
  ]
})
```

#### 场景 4: 搜索相关知识

```typescript
// 搜索桌面相关组件
mcp__memory__search_nodes({
  "query": "Desktop 拖拽"
})
// 返回: Desktop.tsx 及相关实体

// 读取特定节点
mcp__memory__open_nodes({
  "names": ["App.tsx", "Desktop.tsx"]
})
```

---

## 六、Chrome DevTools MCP 使用指南

### 6.1 功能概述

Chrome DevTools MCP 提供 UI 自动化测试能力:

- **页面快照**: 获取页面可访问性树
- **交互操作**: 点击、填表、悬停
- **性能分析**: 录制性能追踪
- **网络监控**: 查看网络请求

### 6.2 工具列表

| 工具 | 功能 |
|------|------|
| `mcp__chrome-devtools__list_pages` | 列出页面 |
| `mcp__chrome-devtools__new_page` | 新建页面 |
| `mcp__chrome-devtools__navigate_page` | 导航页面 |
| `mcp__chrome-devtools__take_snapshot` | 获取页面快照 |
| `mcp__chrome-devtools__take_screenshot` | 截图 |
| `mcp__chrome-devtools__click` | 点击元素 |
| `mcp__chrome-devtools__fill` | 填写表单 |
| `mcp__chrome-devtools__hover` | 悬停元素 |
| `mcp__chrome-devtools__performance_start_trace` | 开始性能追踪 |
| `mcp__chrome-devtools__performance_stop_trace` | 停止性能追踪 |
| `mcp__chrome-devtools__list_network_requests` | 列出网络请求 |

### 6.3 使用场景

#### 场景 1: 测试桌面拖拽功能

```typescript
// 步骤 1: 导航到应用
mcp__chrome-devtools__navigate_page({
  "type": "url",
  "url": "http://localhost:5176"
})

// 步骤 2: 获取快照
mcp__chrome-devtools__take_snapshot()

// 步骤 3: 拖拽测试
mcp__chrome-devtools__drag({
  "from_uid": "desktop-item-1",
  "to_uid": "desktop-position-100-100"
})

// 步骤 4: 验证结果
mcp__chrome-devtools__take_snapshot()
```

#### 场景 2: 性能分析

```typescript
// 开始追踪
mcp__chrome-devtools__performance_start_trace({
  "reload": true,
  "autoStop": false
})

// 执行操作...

// 停止追踪
mcp__chrome-devtools__performance_stop_trace({
  "filePath": "trace.json"
})
```

---

## 七、ZAI MCP 使用指南

### 7.1 功能概述

ZAI MCP 提供多种 AI 视觉能力:

- **UI 转代码**: 将设计稿转换为代码
- **错误诊断**: 分析错误截图
- **技术图理解**: 理解架构图、流程图
- **视频分析**: 分析视频内容
- **数据可视化分析**: 分析图表
- **UI 差异对比**: 对比设计稿与实现

### 7.2 工具列表

| 工具 | 功能 |
|------|------|
| `mcp__zai-mcp-server__ui_to_artifact` | UI 转代码/提示词/规范 |
| `mcp__zai-mcp-server__diagnose_error_screenshot` | 错误诊断 |
| `mcp__zai-mcp-server__understand_technical_diagram` | 技术图理解 |
| `mcp__zai-mcp-server__analyze_video` | 视频分析 |
| `mcp__zai-mcp-server__analyze_data_visualization` | 数据可视化分析 |
| `mcp__zai-mcp-server__ui_diff_check` | UI 差异对比 |
| `mcp__zai-mcp-server__extract_text_from_screenshot` | 截图文字提取 |

### 7.3 使用场景

#### 场景 1: UI 设计转代码

```typescript
mcp__zai-mcp-server__ui_to_artifact({
  "image_source": "design-mockup.png",
  "output_type": "code",
  "prompt": "将这个 UI 设计转换为 React + TypeScript + Tailwind CSS 组件，遵循企鹅工坊现有代码风格"
})
```

#### 场景 2: 错误诊断

```typescript
mcp__zai-mcp-server__diagnose_error_screenshot({
  "image_source": "error-screenshot.png",
  "prompt": "分析这个错误截图，给出可能的解决方案",
  "context": "在尝试保存创意库时发生"
})
```

#### 场景 3: 技术图理解

```typescript
mcp__zai-mcp-server__understand_technical_diagram({
  "image_source": "architecture-diagram.png",
  "prompt": "分析这个系统架构图，列出主要组件和数据流",
  "diagram_type": "architecture"
})
```

---

## 八、Web Search Prime MCP 使用指南

### 8.1 功能概述

Web Search Prime 提供联网搜索能力:

- **中文优化**: 支持中文搜索
- **时间过滤**: 可指定搜索时间范围
- **域名过滤**: 限制搜索结果来源
- **摘要控制**: 控制返回内容长度

### 8.2 使用场景

#### 场景 1: 搜索最新技术

```typescript
mcp__web-search-prime__webSearchPrime({
  "search_query": "React Flow 2026 new features",
  "search_recency_filter": "oneMonth",
  "content_size": "high"
})
```

#### 场景 2: 搜索中文资源

```typescript
mcp__web-search-prime__webSearchPrime({
  "search_query": "Electron 打包教程 NSIS",
  "location": "cn"
})
```

---

## 九、Web Reader MCP 使用指南

### 9.1 功能概述

Web Reader 提供网页内容读取和转换:

- **Markdown 转换**: 自动转换为 Markdown
- **图片处理**: 可保留或移除图片
- **链接摘要**: 提取链接摘要
- **缓存支持**: 可禁用缓存

### 9.2 使用场景

```typescript
// 读取文档
mcp__web-reader__webReader({
  "url": "https://reactflow.dev/learn",
  "return_format": "markdown"
})

// 保留图片
mcp__web-reader__webReader({
  "url": "https://vitejs.dev/guide/",
  "retain_images": true,
  "with_images_summary": true
})
```

---

## 十、ZRead MCP 使用指南

### 10.1 功能概述

ZRead 提供开源仓库快速读取:

- **目录结构**: 获取仓库目录树
- **文件读取**: 读取特定文件
- **文档搜索**: 搜索仓库文档

### 10.2 使用场景

```typescript
// 获取仓库结构
mcp__zread__get_repo_structure({
  "repo_name": "xyflow/react",
  "dir_path": "/packages/react/src"
})

// 读取文件
mcp__zread__read_file({
  "repo_name": "xyflow/react",
  "file_path": "packages/react/src/components/Node.tsx"
})

// 搜索文档
mcp__zread__search_doc({
  "repo_name": "xyflow/react",
  "query": "custom node with handles",
  "language": "en"
})
```

---

## 十一、4.5v Image Analysis MCP 使用指南

### 11.1 功能概述

提供高级图像分析能力，特别适合 UI 截图理解。

### 11.2 使用场景

```typescript
mcp__4_5v_mcp__analyze_image({
  "imageSource": "ui-screenshot.png",
  "prompt": "详细描述这个 UI 的布局结构、颜色风格、主要组件和交互元素，以便后续代码生成"
})
```

---

## 十二、Sequential Thinking MCP 使用指南

### 12.1 功能概述

提供结构化问题分析能力，适合复杂问题拆解。

### 12.2 使用场景

```typescript
mcp__sequential-thinking__sequentialthinking({
  "thought": "首先分析问题: 需要添加视频生成功能...",
  "nextThoughtNeeded": true,
  "thoughtNumber": 1,
  "totalThoughts": 5
})
```

---

## 十三、MCP 工作流集成

### 13.1 开发前准备

```
1. 查询项目架构知识 (Memory MCP)
   └── mcp__memory__search_nodes({ query: "Canvas architecture" })

2. 搜索最新技术趋势 (Web Search Prime MCP)
   └── mcp__web-search-prime__webSearchPrime({ query: "React Flow 2026" })
```

### 13.2 开发中

```
1. 查询技术文档 (Context7 MCP)
   └── mcp__context7__query-docs({ libraryId: "/xyflow/react", query: "..." })

2. 搜索代码示例 (GitHub MCP)
   └── mcp__github__search_code({ query: "useCallback filetype:tsx" })

3. 读取在线文档 (Web Reader MCP)
   └── mcp__web-reader__webReader({ url: "..." })
```

### 13.3 UI 开发

```
1. UI 设计转代码 (ZAI MCP)
   └── mcp__zai-mcp-server__ui_to_artifact({ output_type: "code" })

2. 分析竞品 UI (4.5v Image Analysis MCP)
   └── mcp__4_5v_mcp__analyze_image({ prompt: "分析 UI 设计" })
```

### 13.4 开发后

```
1. 创建 Pull Request (GitHub MCP)
   └── mcp__github__create_pull_request({ title: "...", base: "dev" })

2. 请求代码审查 (GitHub MCP)
   └── mcp__github__request_copilot_review({ pullNumber: 42 })

3. 更新知识库 (Memory MCP)
   └── mcp__memory__add_observations({ observations: [...] })
```

---

## 附录

### A. 快速参考

| 需求 | 使用 MCP | 工具 |
|------|---------|------|
| 查架构知识 | Memory | `search_nodes` |
| 技术文档 | Context7 | `query-docs` |
| 代码示例 | GitHub | `search_code` |
| 最新趋势 | Web Search Prime | `webSearchPrime` |
| UI 转代码 | ZAI | `ui_to_artifact` |
| 错误诊断 | ZAI | `diagnose_error_screenshot` |
| 创建 PR | GitHub | `create_pull_request` |
| 网页内容 | Web Reader | `webReader` |

### B. 相关文档

- `docs/MCP_BEST_PRACTICES.md` - MCP 最佳实践
- `.claude/mcp_config.json` - MCP 配置文件
- `docs/AUTO_DEV_WORKFLOW.md` - 开发流程指南
- `.cursorrules` - 项目编码规则

---

**文档版本**: 1.0.0
**最后更新**: 2026-01-21
