# GitHub Copilot 工作指令

## 项目架构

企鹅工坊是三层 Electron 应用：

```
┌─────────────────────────────────────────────────────────┐
│                    Electron 桌面层                        │
│              (electron/main.cjs, 1,539 行)               │
├─────────────────────────────────────────────────────────┤
│                    React 前端层                          │
│         (App.tsx 3,746 行 + components/ 27 文件)         │
│         - Canvas: @xyflow/react 画布系统                 │
│         - Desktop: 桌面工作空间 (2,471 行)               │
├─────────────────────────────────────────────────────────┤
│                   Node.js 后端层                         │
│         (backend-nodejs/src/server.js + 8 路由)          │
│         - 数据存储: JSON 文件                            │
│         - 图片处理: Sharp                                │
└─────────────────────────────────────────────────────────┘
```

## 数据流

```
用户输入 → React 组件 → API 调用 → Express 后端 → 业务逻辑服务 → JSON 文件存储
                  ↓                                              ↓
             状态更新 (useState)                              返回结果
                  ↓                                              ↓
              UI 更新 ←─────────────────────────────────────┘
```

## 组件开发模式

### 标准组件模板

```tsx
import { useState, useCallback } from 'react';

interface ComponentProps {
  // Props 定义 - 使用 interface 描述组件输入
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

/**
 * 组件描述 (中文注释)
 * @param props - 组件属性
 */
export function ComponentName({ value, onChange, disabled = false }: ComponentProps) {
  // 1. 状态定义
  const [state, setState] = useState<string>('');

  // 2. 事件处理 - 使用 useCallback 优化性能
  const handleAction = useCallback(() => {
    // 处理逻辑
  }, [/* 依赖项 */]);

  // 3. 副作用 - 使用 useEffect
  useEffect(() => {
    // 初始化或订阅
    return () => {
      // 清理
    };
  }, []);

  return (
    <div className="component-container">
      {/* JSX 内容 */}
    </div>
  );
}
```

## API 调用模式

### 服务层定义 (services/api/*.ts)

```typescript
import { post, get, put, del } from './index';

// 统一的 API 调用模式
export const apiFunction = async (params: ParamsType): Promise<ResultType> => {
  try {
    return await post('/endpoint', params);
  } catch (error) {
    console.error('API 调用失败:', error);
    throw error;
  }
};

// 带类型定义的完整示例
export interface CreativeIdea {
  id: string;
  name: string;
  category: CreativeCategoryType;
  // ...
}

export const getCreativeIdeas = async (): Promise<CreativeIdea[]> => {
  return get('/creative');
};
```

### 组件中使用

```tsx
import { useState, useEffect } from 'react';
import { getCreativeIdeas } from '@/services/api/creative';

export function CreativeList() {
  const [ideas, setIdeas] = useState<CreativeIdea[]>([]);
  const [loading, setLoading] = useState(false);

  const loadIdeas = async () => {
    setLoading(true);
    try {
      const result = await getCreativeIdeas();
      setIdeas(result);
    } catch (error) {
      console.error('加载创意库失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIdeas();
  }, []);

  // ...
}
```

## 错误处理模式

### 统一错误处理

```typescript
// 1. API 调用错误处理
try {
  const result = await apiCall(params);
  setData(result);
} catch (error) {
  console.error('操作失败:', error);
  // 显示错误提示给用户
  showToast({ type: 'error', message: '操作失败,请稍后重试' });
}

// 2. 表单验证错误处理
const validateForm = (data: FormData): ValidationResult => {
  const errors: string[] = [];

  if (!data.name) errors.push('名称不能为空');
  if (data.prompt && data.prompt.length > 1000) {
    errors.push('提示词不能超过 1000 字符');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

// 3. 异步操作错误处理
const handleSubmit = async () => {
  setApiStatus(ApiStatus.Loading);
  try {
    await submitData(formData);
    setApiStatus(ApiStatus.Success);
    showToast({ type: 'success', message: '操作成功' });
  } catch (error) {
    setApiStatus(ApiStatus.Error);
    showToast({ type: 'error', message: '操作失败' });
  }
};
```

## 类型系统

### 核心类型 (types.ts)

```typescript
// 创意库类型
export interface CreativeIdea {
  id: string;
  name: string;
  category: CreativeCategoryType;
  mode: 'smart' | 'smartPlus' | 'bp' | 'runningHub' | 'workflow';
  // ...
}

// 桌面项类型 (联合类型)
export type DesktopItem = ImageItem | FolderItem | StackItem;

// API 状态枚举
export enum ApiStatus {
  Idle = 'idle',
  Loading = 'loading',
  Success = 'success',
  Error = 'error'
}
```

## 画布节点开发

### 添加新节点类型

```typescript
// 1. 在 types.ts 添加节点类型
export enum WorkflowNodeType {
  text = 'text',
  image = 'image',
  // ... 添加新类型
}

// 2. 创建节点组件
// components/Canvas/nodes/NewNode.tsx
import { Handle, Position } from '@xyflow/react';

export function NewNode({ data }: NodeProps) {
  return (
    <div className="custom-node">
      <Handle type="target" position={Position.Top} />
      <div>{data.label}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

// 3. 在画布组件中注册
const nodeTypes = {
  text: TextNode,
  image: ImageNode,
  newNode: NewNode,
  // ...
};
```

## 数据存储约定

### JSON 文件结构 (backend-nodejs/data/)

```json
// creative_ideas.json - 创意库
{
  "ideas": [
    {
      "id": "uuid",
      "name": "创意名称",
      "mode": "smart",
      // ...
    }
  ]
}

// history.json - 生成历史 (最多 500 条)
{
  "items": [
    {
      "id": "uuid",
      "timestamp": 1234567890,
      "prompt": "...",
      "images": ["..."]
    }
  ]
}

// settings.json - 应用设置
{
  "apiKey": "...",
  "theme": "dark",
  // ...
}
```

## 上下文控制规范

### 针对大文件读取

```typescript
// 避免: 一次性读取整个大文件
// const content = await fs.readFile('large-file.txt', 'utf-8');

// 推荐: 分段读取
const CHUNK_SIZE = 500;
let offset = 0;
while (true) {
  const chunk = await readFileChunk(filePath, offset, CHUNK_SIZE);
  if (!chunk) break;
  // 处理 chunk
  offset += CHUNK_SIZE;
}
```

### 针对 Grep 搜索

```typescript
// 使用 head_limit 限制结果
const results = await grep({
  pattern: 'function',
  path: 'src/',
  head_limit: 50,  // 最多返回 50 条
  output_mode: 'files_with_matches'
});
```

## Git 提交规范

```bash
# 提交格式
<type>(<scope>): <subject>

# 类型
feat:     新功能
fix:      Bug 修复
docs:     文档更新
style:    代码格式 (不影响功能)
refactor: 重构
perf:     性能优化
test:     添加测试
chore:    构建/工具变更

# 示例
feat(canvas): 添加新的视频生成节点
fix(desktop): 修复拖拽时位置计算错误
docs(readme): 更新安装说明
```

## 代码审查清单

- [ ] 代码符合现有风格
- [ ] 添加了必要的中文注释
- [ ] 处理了错误情况
- [ ] 类型定义完整
- [ ] 没有引入安全漏洞
- [ ] 性能影响可接受
- [ ] 手动测试通过

## 常见问题

### Q: 如何添加新的 AI 服务?

1. 在 `services/` 创建新服务文件
2. 实现统一的调用接口
3. 在 `backend-nodejs/src/routes/` 添加路由
4. 更新设置界面添加配置项

### Q: 如何添加新的桌面项类型?

1. 在 `types.ts` 扩展 `DesktopItem` 类型
2. 在 `components/Desktop.tsx` 添加渲染逻辑
3. 更新拖拽和选择逻辑
4. 在 `backend-nodejs/src/routes/desktop.js` 添加存储支持

---

## MCP (Model Context Protocol) 使用说明

### MCP 工具速查

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

### 使用示例

#### 查询项目架构知识

```typescript
// 搜索相关组件
mcp__memory__search_nodes({ query: "Canvas architecture" })

// 读取特定节点
mcp__memory__open_nodes({ names: ["App.tsx", "Desktop.tsx"] })
```

#### 查询技术文档

```typescript
// 1. 先解析库 ID
mcp__context7__resolve-library_id({ libraryName: "reactflow", query: "custom nodes" })
// 返回: "/xyflow/react"

// 2. 再查询文档
mcp__context7__query-docs({ libraryId: "/xyflow/react", query: "How to create custom nodes" })
```

#### 搜索代码示例

```typescript
// 搜索 React 组件中的 useCallback 使用
mcp__github__search_code({ query: "useCallback filetype:tsx org:leon30083" })

// 搜索特定函数实现
mcp__github__search_code({ query: "function fetchCreativeIdeas language:typescript" })
```

#### 创建 Pull Request

```typescript
mcp__github__create_pull_request({
  owner: "leon30083",
  repo: "Penguin-Magic",
  title: "feat(canvas): 添加视频生成节点",
  head: "feature/video-node",
  base: "dev",
  body: `## 概述
添加 Veo 模型视频生成节点...

## 变更
- 新增 VideoNode 组件
- 集成 Veo API

## 测试
- [ ] 功能正常
- [ ] 错误处理完善`
})
```

#### UI 设计转代码

```typescript
mcp__zai-mcp-server__ui_to_artifact({
  image_source: "design.png",
  output_type: "code",
  prompt: "转换为 React + TypeScript 组件，遵循企鹅工坊代码风格，使用函数式组件和 Hooks"
})
```

### MCP 使用原则

1. **优先查询**: 开发前先搜索 Memory MCP 中的项目知识
2. **适度使用**: 简单任务直接解决，不滥用 MCP
3. **结果验证**: MCP 结果需人工验证，不可盲目信任
4. **知识沉淀**: 有价值的知识及时存入 Memory MCP

### 相关文档

- `.claude/mcp_config.json` - MCP 配置文件
- `docs/MCP_USAGE_GUIDE.md` - MCP 详细使用指南
- `docs/MCP_BEST_PRACTICES.md` - MCP 最佳实践
