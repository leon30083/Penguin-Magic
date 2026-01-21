# 企鹅工坊自动化开发流程指南

> **版本**: 1.0.0
> **更新日期**: 2026-01-21
> **适用模型**: GLM-4.7 (200K tokens)

---

## 目录

1. [项目概述](#一项目概述)
2. [开发环境配置](#二开发环境配置)
3. [四阶段×十二原则方法论](#三四阶段十二原则方法论)
4. [上下文控制规范](#四上下文控制规范-glm-47-专用)
5. [胶水编程实践指南](#五胶水编程实践指南)
6. [代码质量规范](#六代码质量规范)
7. [Git 工作流](#七-git-工作流)
8. [常见问题与解决方案](#八常见问题与解决方案)

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

## 三、四阶段×十二原则方法论

### 3.1 方法论概览

```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│   准备阶段   │   执行阶段   │   协作阶段   │   迭代阶段   │
├─────────────┼─────────────┼─────────────┼─────────────┤
│ 1. 单一真源  │ 4. 人类在环  │ 7. 负载预算  │10. 休息反思  │
│ 2. 提示词先行│ 5. 任务块化  │ 8. 流保护罩  │11. 技能均衡  │
│ 3. 上下文洁净│ 6. 并行流动  │ 9. 可复现性  │12. 好奇文化  │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

### 3.2 准备阶段 (Setup)

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

### 3.3 执行阶段 (Execute)

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

### 3.4 协作阶段 (Collaborate)

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

### 3.5 迭代阶段 (Iterate)

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

## 四、上下文控制规范 (GLM-4.7 专用)

### 4.1 限制说明

**GLM-4.7 最大上下文**: 200,000 tokens (约 175,000 字符)

### 4.2 控制策略

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

### 4.3 上下文清理建议

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

## 五、胶水编程实践指南

### 5.1 核心宣言

> **AI 写代码，人审代码，AI 连接代码，人审连接**

### 5.2 三大痛点解决

| 痛点 | 解决方案 |
|------|----------|
| AI 幻觉 | 零幻觉 (只使用已验证代码) |
| 复杂性爆炸 | 复杂性归零 (组合简单模块) |
| 门槛过高 | 门槛消失 (复用成熟方案) |

### 5.3 核心流程

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

### 5.4 金句

> **"能抄不写，能连不造，能复用不原创"**

### 5.5 实践示例

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

## 六、代码质量规范

### 6.1 代码风格

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

### 6.2 类型安全

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

### 6.3 错误处理

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

### 6.4 性能优化

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

## 七、Git 工作流

### 7.1 分支策略

```
main (生产环境)
  ↑
dev (开发环境) ← 主要开发分支
  ↑
feature/* (功能分支)
hotfix/* (紧急修复)
```

### 7.2 提交规范

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

### 7.3 PR 流程

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

## 八、常见问题与解决方案

### 8.1 API 调用失败

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

### 8.2 状态更新不生效

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

### 8.3 Electron 通信问题

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

### 8.4 内存泄漏

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
