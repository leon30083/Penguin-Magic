# 企鹅工坊自动化开发流程指南

> **版本**: 1.0.0
> **更新日期**: 2026-01-21
> **适用模型**: GLM-4.7 (200K tokens)

---

## 目录

1. [项目概述](#一项目概述)
2. [开发环境配置](#二开发环境配置)
3. [MCP 使用规范](#三mcp-使用规范)
4. [四阶段×十二原则方法论](#四四阶段十二原则方法论)
5. [上下文控制规范](#五上下文控制规范-glm-47-专用)
6. [胶水编程实践指南](#六胶水编程实践指南)
7. [代码质量规范](#七代码质量规范)
8. [Git 工作流](#八git-工作流)
9. [常见问题与解决方案](#九常见问题与解决方案)

---

## 一、项目概述

### 1.1 项目简介

**企鹅工坊 (Penguin-Magic)** 是世界首款 AI 图像桌面管理工具，结合了 AI 图像生成与可视化桌面工作空间。

### 1.2 技术架构

```
┌─────────────────────────────────────────────────────────────┐
│                       Electron 桌面层                         │
│                    (electron/main.cjs)                       │
│              - 应用生命周期管理                               │
│              - 窗口管理与通信                                 │
│              - 自动更新                                       │
├─────────────────────────────────────────────────────────────┤
│                       React 前端层                           │
│         (App.tsx + components/ + services/)                  │
│              - 桌面工作空间 (Desktop)                         │
│              - 画布系统 (@xyflow/react)                      │
│              - 创意库管理                                     │
├─────────────────────────────────────────────────────────────┤
│                      Node.js 后端层                          │
│              (backend-nodejs/src/)                           │
│              - RESTful API (8 路由)                          │
│              - JSON 文件存储                                  │
│              - 图片处理 (Sharp)                               │
└─────────────────────────────────────────────────────────────┘
```

### 1.3 核心目录结构

```
Penguin-Magic/
├── components/          # React 组件
│   ├── Canvas/         # 画布节点组件
│   ├── Desktop/        # 桌面工作空间
│   └── nodes/          # 6 种节点类型
├── services/           # 业务逻辑服务
│   ├── api/           # API 客户端层
│   ├── geminiService.ts
│   ├── veoService.ts   # 视频生成
│   └── soraService.ts
├── backend-nodejs/
│   ├── src/routes/    # API 路由
│   └── data/          # JSON 数据存储
├── electron/          # Electron 主进程
├── types.ts           # 核心类型定义
├── skills/            # 开发技能文档
└── docs/              # 项目文档
```

---

## 二、开发环境配置

### 2.1 初始安装

```bash
# 安装前端依赖
npm install

# 安装后端依赖
cd backend-nodejs && npm install && cd ..
```

### 2.2 开发命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动 Vite 开发服务器 (端口 5176) |
| `npm run electron:dev` | 启动 Electron 开发模式 |
| `npm run build` | 构建前端生产版本 |
| `npm run electron:build` | 构建 Electron 应用 |
| `npm run package` | 打包当前平台 |
| `npm run package:all` | 打包全平台 |

### 2.3 编辑器配置

项目已配置以下编辑器配置文件：

- `.cursorrules` - Cursor IDE 编码规则
- `.editorconfig` - 跨编辑器统一配置
- `.eslintrc.js` - ESLint 代码检查
- `.prettierrc` - Prettier 代码格式化

---

## 三、MCP 使用规范

### 3.1 MCP 概述

MCP (Model Context Protocol) 是一个开放协议，允许 AI 应用与外部数据源和工具进行标准化交互。企鹅工坊已配置以下 MCP 服务器:

| MCP 服务器 | 主要功能 | 相关性 |
|-----------|---------|-------|
| **Memory** | 知识图谱、架构决策记录 | ⭐⭐⭐⭐⭐ |
| **GitHub** | 代码仓库、PR、Issue 管理 | ⭐⭐⭐⭐⭐ |
| **Context7** | 技术文档查询 | ⭐⭐⭐⭐⭐ |
| **Web Search Prime** | 联网搜索、最新趋势 | ⭐⭐⭐⭐ |
| **Web Reader** | 网页内容读取 | ⭐⭐⭐⭐ |
| **ZRead** | 开源仓库快速读取 | ⭐⭐⭐ |
| **ZAI MCP** | UI 转代码、错误诊断 | ⭐⭐⭐ |
| **4.5v Image Analysis** | 图像分析、UI 理解 | ⭐⭐⭐ |
| **Chrome DevTools** | UI 自动化测试 | ⭐⭐⭐ |

### 3.2 MCP 工具速查表

| 需求 | 使用 MCP | 工具 |
|------|---------|------|
| 查架构 | Memory | `mcp__memory__search_nodes` |
| 存知识 | Memory | `mcp__memory__create_entities` |
| 搜代码 | GitHub | `mcp__github__search_code` |
| 创建 PR | GitHub | `mcp__github__create_pull_request` |
| 创建 Issue | GitHub | `mcp__github__issue_write` |
| 查文档 | Context7 | `mcp__context7__query-docs` |
| 搜最新 | Web Search Prime | `mcp__web-search-prime__webSearchPrime` |
| 读网页 | Web Reader | `mcp__web-reader__webReader` |
| UI 转码 | ZAI | `mcp__zai-mcp-server__ui_to_artifact` |
| 诊断错 | ZAI | `mcp__zai-mcp-server__diagnose_error_screenshot` |

### 3.3 开发前准备 (使用 Memory + Web Search MCP)

```typescript
// 1. 查询项目架构知识
mcp__memory__search_nodes({ query: "Desktop component architecture" })

// 2. 查找相关组件关系
mcp__memory__open_nodes({ names: ["App.tsx", "Desktop.tsx", "Canvas.tsx"] })

// 3. 搜索最新技术趋势
mcp__web-search-prime__webSearchPrime({ query: "React Flow 2026 best practices" })
```

### 3.4 开发中 (使用 Context7 + GitHub + Web Reader + ZRead MCP)

```typescript
// 1. 查询技术文档 (Context7)
// 先解析库 ID
mcp__context7__resolve-library_id({ libraryName: "reactflow", query: "custom nodes" })
// 返回: "/xyflow/react"
// 再查询文档
mcp__context7__query-docs({ libraryId: "/xyflow/react", query: "How to create custom nodes" })

// 2. 搜索代码示例 (GitHub)
mcp__github__search_code({ query: "useCallback filetype:tsx org:leon30083" })

// 3. 读取在线文档 (Web Reader)
mcp__web-reader__webReader({ url: "https://reactflow.dev/learn", return_format: "markdown" })

// 4. 分析开源仓库 (ZRead)
mcp__zread__get_repo_structure({ repo_name: "xyflow/react", dir_path: "/packages/src" })
```

### 3.5 UI 开发 (使用 ZAI + 4.5v Image Analysis MCP)

```typescript
// 1. UI 设计转代码 (ZAI)
mcp__zai-mcp-server__ui_to_artifact({
  image_source: "design.png",
  output_type: "code",
  prompt: "转换为 React + TypeScript 组件，遵循企鹅工坊代码风格"
})

// 2. 分析竞品 UI (4.5v)
mcp__4_5v_mcp__analyze_image({
  imageSource: "ui-screenshot.png",
  prompt: "分析这个 UI 的设计风格和交互模式"
})
```

### 3.6 开发后 (使用 GitHub MCP)

```typescript
// 1. 创建 Pull Request
mcp__github__create_pull_request({
  owner: "leon30083",
  repo: "Penguin-Magic",
  title: "feat(canvas): 添加视频生成节点",
  head: "feature/video-node",
  base: "dev",
  body: "## 概述\n添加 Veo 模型视频生成节点...\n\n## 变更\n- 新增 VideoNode 组件\n- 集成 Veo API\n\n## 测试\n- [ ] 功能正常\n- [ ] 错误处理完善"
})

// 2. 请求代码审查
mcp__github__request_copilot_review({ owner: "leon30083", repo: "Penguin-Magic", pullNumber: 42 })

// 3. 更新 Memory 知识库
mcp__memory__add_observations({
  observations: [{
    entityName: "VideoNode",
    contents: ["新增视频生成节点，位于 components/nodes/VideoNode.tsx", "集成 Veo API 服务"]
  }]
})
```

### 3.7 Memory MCP 知识管理

#### 创建实体

```typescript
mcp__memory__create_entities({
  "entities": [
    {
      "name": "Desktop.tsx",
      "entityType": "React Component",
      "observations": [
        "桌面工作空间组件，2,471 行代码",
        "支持图片项、文件夹项、堆栈项",
        "基于网格的拖拽定位系统"
      ]
    }
  ]
})
```

#### 建立关系

```typescript
mcp__memory__create_relations({
  "relations": [
    {
      "from": "App.tsx",
      "to": "Desktop.tsx",
      "relationType": "导入并渲染"
    }
  ]
})
```

### 3.8 MCP 使用原则

| 原则 | 说明 |
|------|------|
| **优先查询** | 使用前先搜索 Memory MCP 中的项目知识 |
| **适度使用** | 简单任务直接解决，不滥用 MCP |
| **结果验证** | MCP 结果需人工验证，不可盲目信任 |
| **知识沉淀** | 有价值的知识及时存入 Memory MCP |

### 3.9 相关文档

- `.claude/mcp_config.json` - MCP 配置文件
- `docs/MCP_USAGE_GUIDE.md` - MCP 详细使用指南
- `docs/MCP_BEST_PRACTICES.md` - MCP 最佳实践

---

## 四、四阶段×十二原则方法论

### 4.1 方法论概览

```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│   准备阶段   │   执行阶段   │   协作阶段   │   迭代阶段   │
├─────────────┼─────────────┼─────────────┼─────────────┤
│ 1. 单一真源  │ 4. 人类在环  │ 7. 负载预算  │10. 休息反思  │
│ 2. 提示词先行│ 5. 任务块化  │ 8. 流保护罩  │11. 技能均衡  │
│ 3. 上下文洁净│ 6. 并行流动  │ 9. 可复现性  │12. 好奇文化  │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

### 4.2 准备阶段 (Setup)

#### 原则 1: 单一真源

> **核心思想**: 所有需求集中在一个文档管理

实施方式：
```
docs/FEATURES.md          # 功能需求文档
docs/AUTO_DEV_WORKFLOW.md # 开发流程规范 (本文档)
CLAUDE.md                 # AI 助手项目指令
```

#### 原则 2: 提示词先行

> **核心思想**: 开发前先编写 AI 提示词

提示词模板：
```markdown
## 任务目标
[清晰描述要实现的功能]

## 技术要求
- 涉及文件: [...]
- 依赖类型: [...]
- 输出格式: [...]

## 验证标准
- [ ] 功能正常
- [ ] 类型正确
- [ ] 错误处理完善
```

#### 原则 3: 上下文洁净

> **核心思想**: 每个功能独立会话，避免上下文污染

实施方式：
- 新功能开发时开启新对话
- 保持对话主题单一
- 定期清理无关历史

### 4.3 执行阶段 (Execute)

#### 原则 4: 人类在环

> **核心思想**: AI 生成代码必须人工审查

审查清单：
```typescript
// ✅ 好的实践
interface UserData {
  id: string;
  name: string;
}

// ❌ 需要改进
const data: any = {}; // 缺少类型定义
```

#### 原则 5: 任务块化

> **核心思想**: 大任务拆解为 10-30 分钟小任务

任务拆解示例：
```
大任务: 实现视频生成功能
├── 小任务 1: 创建视频生成服务 (15 分钟)
├── 小任务 2: 添加 API 路由 (10 分钟)
├── 小任务 3: 实现前端 UI (20 分钟)
└── 小任务 4: 集成测试 (15 分钟)
```

#### 原则 6: 并行流动

> **核心思想**: AI 工作时人类做副任务

并行模式：
```
AI: 生成组件代码 → 人类: 准备测试数据
AI: 实现 API 逻辑 → 人类: 设计 UI 样式
```

### 4.4 协作阶段 (Collaborate)

#### 原则 7: 负载预算

> **核心思想**: 设定每日 AI 协作时长上限

建议配置：
- AI 辅助开发: ≤ 4 小时/天
- 人工代码审查: ≥ 1 小时/天
- 学习新技术: ≥ 1 小时/天

#### 原则 8: 流保护罩

> **核心思想**: 设定 90 分钟专注时段

番茄工作法变体：
```
[90 分钟专注] + [15 分钟休息] + [5 分钟复盘]
```

#### 原则 9: 可复现性

> **核心思想**: 保存 Prompt、AI 版本、变更原因

版本控制示例：
```bash
git commit -m "feat(canvas): 添加视频生成节点

- Prompt: 使用 GLM-4.7 生成初始代码
- 变更原因: 用户需要 Veo 模型支持
- 依赖: @veo/sdk@1.0.0
"
```

### 4.5 迭代阶段 (Iterate)

#### 原则 10: 休息反思

> **核心思想**: 冲刺结束后 5 分钟复盘

复盘清单：
- 今天完成了什么？
- 遇到了什么问题？
- 明天如何改进？

#### 原则 11: 技能均衡

> **核心思想**: 持续学习领域知识

学习路径：
```
基础语法 → 框架原理 → 设计模式 → 系统架构
```

#### 原则 12: 好奇文化

> **核心思想**: 先问"为什么"，再问"还能更好吗"

提问示例：
```
❌ "怎么实现这个功能？"
✅ "为什么选择这个方案？有更好的方式吗？"
```

---

## 五、上下文控制规范 (GLM-4.7 专用)

### 5.1 限制说明

**GLM-4.7 最大上下文**: 200,000 tokens (约 175,000 字符)

### 5.2 控制策略

#### 策略 1: 限制单次返回长度

```typescript
// ❌ 避免: 一次性读取整个大文件
const content = await fs.readFile('large-file.ts', 'utf-8');

// ✅ 推荐: 分段读取
const CHUNK_SIZE = 500; // 每次最多 500 行
let offset = 0;
while (true) {
  const chunk = await readFileChunk('large-file.ts', offset, CHUNK_SIZE);
  if (!chunk || chunk.length === 0) break;
  // 处理 chunk
  offset += CHUNK_SIZE;
}
```

#### 策略 2: 优先使用专用工具

```typescript
// ❌ 避免: 长篇读取后用自然语言总结
const allFiles = await readAllFiles('src/');
// 然后用大量 tokens 总结...

// ✅ 推荐: 使用 Task agent 的 Explore 模式
const explorer = await Task.create('explore');
await explorer.search('src/', 'pattern');
```

#### 策略 3: 使用 Grep 工具快速定位

```typescript
// ✅ 推荐: 使用 head_limit 限制结果
const results = await grep({
  pattern: 'function Component',
  path: 'components/',
  head_limit: 50,  // 最多返回 50 条
  output_mode: 'files_with_matches'
});
```

#### 策略 4: 减少重复读取

```typescript
// ❌ 避免: 多次读取同一文件
const content1 = await readFile('file.ts');
const content2 = await readFile('file.ts'); // 重复读取

// ✅ 推荐: 一次性读取，缓存结果
const cache = new Map();
async function getCachedContent(path: string) {
  if (!cache.has(path)) {
    cache.set(path, await readFile(path));
  }
  return cache.get(path);
}
```

#### 策略 5: 简洁的响应

```typescript
// ❌ 避免: 详细罗列每个文件
"已完成 component1.ts, component2.ts, component3.ts, ..."

// ✅ 推荐: 简洁总结 + 链接引用
"已完成 3 个组件文件:
- components/Canvas/Canvas.tsx:120-145
- components/Desktop/Desktop.tsx:200-230
- components/nodes/TextNode.tsx:50-75"
```

### 5.3 上下文清理建议

#### 新任务开始前

```
1. 总结上一阶段成果 (100-200 字符)
2. 清理无关对话历史
3. 保留必要的代码引用
```

#### 长对话中断

```
建议: 开启新对话继续，携带关键上下文摘要

摘要格式:
"""
之前完成了 [功能 A]，现在需要继续 [功能 B]。
关键文件: file1.ts, file2.ts
关键类型: TypeA, TypeB
"""
```

---

## 六、胶水编程实践指南

### 6.1 核心宣言

> **AI 写代码，人审代码，AI 连接代码，人审连接**

### 6.2 三大痛点解决

| 痛点 | 解决方案 |
|------|----------|
| AI 幻觉 | 零幻觉 (只使用已验证代码) |
| 复杂性爆炸 | 复杂性归零 (组合简单模块) |
| 门槛过高 | 门槛消失 (复用成熟方案) |

### 6.3 核心流程

```
1. 明确目标
   ↓
2. 寻找轮子 (用 GitHub Topics 精准找成熟库)
   ↓
3. 理解接口 (阅读文档和类型定义)
   ↓
4. 描述连接 (用自然语言描述集成方式)
   ↓
5. 验证运行 (测试集成结果)
```

### 6.4 金句

> **"能抄不写，能连不造，能复用不原创"**

### 6.5 实践示例

#### 示例 1: 集成图片裁剪功能

```typescript
// ❌ 从零实现
async function cropImage(image: Buffer, x, y, w, h) {
  // 手动实现裁剪逻辑... (复杂且容易出错)
}

// ✅ 使用 Sharp 库
import sharp from 'sharp';

async function cropImage(image: Buffer, x, y, w, h) {
  return sharp(image)
    .extract({ left: x, top: y, width: w, height: h })
    .toBuffer();
}
```

#### 示例 2: 集成状态管理

```typescript
// ❌ 自己实现状态管理
class Store {
  private state = {};
  private listeners = [];
  // ... 大量代码
}

// ✅ 使用 Zustand
import { create } from 'zustand';

const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));
```

---

## 七、代码质量规范

### 7.1 代码风格

#### 命名规范

```typescript
// 组件: PascalCase
export function UserProfile() {}

// 函数: camelCase
function getUserData() {}

// 常量: UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3;

// 类型/接口: PascalCase
interface UserData {}
type OptionType = 'a' | 'b' | 'c';

// 私有成员: 前缀下划线
class MyClass {
  private _internalValue: string;
}
```

#### 注释规范

```typescript
/**
 * 函数功能描述 (中文)
 *
 * @param param1 - 参数说明
 * @param param2 - 参数说明
 * @returns 返回值说明
 *
 * @example
 * ```typescript
 * const result = functionName('arg1', 'arg2');
 * ```
 */
function functionName(param1: string, param2: number): boolean {
  // 实现逻辑
  return true;
}
```

### 7.2 类型安全

```typescript
// ✅ 推荐: 使用 interface 定义对象
interface CreativeIdea {
  id: string;
  name: string;
  category: CreativeCategoryType;
}

// ✅ 推荐: 使用 enum 定义固定值
enum ApiStatus {
  Idle = 'idle',
  Loading = 'loading',
  Success = 'success',
  Error = 'error',
}

// ❌ 避免: 使用 any
function process(data: any) { }

// ✅ 推荐: 使用泛型
function process<T>(data: T): T {
  return data;
}
```

### 7.3 错误处理

```typescript
// 统一错误处理模式
try {
  const result = await apiCall(params);
  return { success: true, data: result };
} catch (error) {
  console.error('操作失败:', error);
  return {
    success: false,
    error: error instanceof Error ? error.message : '未知错误'
  };
}
```

### 7.4 性能优化

```typescript
// 使用 useCallback 优化函数
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);

// 使用 useMemo 优化计算
const memoizedValue = useMemo(() => {
  return computeExpensiveValue(a, b);
}, [a, b]);

// 避免不必要的渲染
const MemoizedComponent = React.memo(({ data }) => {
  return <div>{data}</div>;
});
```

---

## 八、Git 工作流

### 8.1 分支策略

```
main (生产环境)
  ↑
dev (开发环境) ← 主要开发分支
  ↑
feature/* (功能分支)
hotfix/* (紧急修复)
```

### 8.2 提交规范

```
<type>(<scope>): <subject>

<body>

<footer>
```

#### 类型 (type)

| 类型 | 说明 |
|------|------|
| `feat` | 新功能 |
| `fix` | Bug 修复 |
| `docs` | 文档更新 |
| `style` | 代码格式 (不影响功能) |
| `refactor` | 重构 |
| `perf` | 性能优化 |
| `test` | 添加测试 |
| `chore` | 构建/工具变更 |

#### 示例

```bash
git commit -m "feat(canvas): 添加视频生成节点

- 实现 Veo 模型集成
- 添加视频预览功能
- 支持导出 MP4 格式

Closes #123"
```

### 8.3 PR 流程

1. 创建功能分支
   ```bash
   git checkout -b feature/video-generation
   ```

2. 开发并提交
   ```bash
   git add .
   git commit -m "feat: 添加视频生成功能"
   ```

3. 推送并创建 PR
   ```bash
   git push origin feature/video-generation
   ```

4. 使用 `.github/PULL_REQUEST_TEMPLATE.md` 模板

---

## 九、常见问题与解决方案

### 9.1 API 调用失败

**问题**: API 返回 401/403 错误

**解决方案**:
```typescript
// 检查 API Key 配置
const apiKey = settings.get('apiKey');
if (!apiKey) {
  showToast({ type: 'error', message: '请先配置 API Key' });
  return;
}

// 添加重试机制
async function callWithRetry(fn, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      await sleep(1000 * (i + 1));
    }
  }
}
```

### 9.2 状态更新不生效

**问题**: setState 后界面没有更新

**解决方案**:
```typescript
// ❌ 错误: 直接修改 state
state.items.push newItem);
setState(state);

// ✅ 正确: 创建新对象
setState(prev => ({
  ...prev,
  items: [...prev.items, newItem]
}));
```

### 9.3 Electron 通信问题

**问题**: 主进程与渲染进程通信失败

**解决方案**:
```typescript
// 渲染进程
import { ipcRenderer } from 'electron';

ipcRenderer.invoke('save-file', data)
  .then(result => console.log('保存成功'))
  .catch(error => console.error('保存失败', error));

// 主进程
ipcMain.handle('save-file', async (event, data) => {
  try {
    await saveToFile(data);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
```

### 9.4 内存泄漏

**问题**: 应用运行一段时间后变慢

**解决方案**:
```typescript
// 清理定时器
useEffect(() => {
  const timer = setInterval(() => {
    // ...
  }, 1000);

  return () => clearInterval(timer); // 清理
}, []);

// 清理事件监听
useEffect(() => {
  const handler = () => {};
  window.addEventListener('resize', handler);

  return () => window.removeEventListener('resize', handler);
}, []);
```

---

## 附录

### A. 相关文档

- `.cursorrules` - Cursor IDE 编码规则
- `.github/copilot-instructions.md` - GitHub Copilot 工作指令
- `CLAUDE.md` - AI 助手项目指令
- `skills/` - 开发技能文档集

### B. 外部资源

- [React 文档](https://react.dev)
- [TypeScript 文档](https://www.typescriptlang.org/docs)
- [Electron 文档](https://www.electronjs.org/docs)
- [@xyflow/react 文档](https://reactflow.dev)

### C. 联系方式

- 项目地址: [GitHub Repository]
- 问题反馈: [Issues]
- 功能建议: [Discussions]

---

**文档版本**: 1.0.0
**最后更新**: 2026-01-21
