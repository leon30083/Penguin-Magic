# Penguin-Magic 二次开发地图文档

## 文档概述

本文档是 Penguin-Magic 项目的全面二次开发指南，旨在帮助开发者：
- 理解项目整体架构
- 掌握节点系统的使用和扩展
- 了解API接入方式
- 添加新的API平台和功能

---

## 第一部分：项目架构总览

### 1.1 技术栈

| 层级 | 技术 | 版本 |
|------|------|------|
| 前端框架 | React | 19.1.1 |
| 语言 | TypeScript | 5.8.2 |
| 构建工具 | Vite | 6.2.0 |
| 桌面框架 | Electron | 39.2.7 |
| 后端服务 | Node.js + Express | - |
| 可视化 | @xyflow/react | 12.10.0 |
| UI组件 | Lucide-React | 0.562.0 |
| 3D引擎 | Three.js | 0.182.0 |

### 1.2 目录结构

```
Penguin-Magic/
├── App.tsx                    # 主应用入口
├── types.ts                   # 全局类型定义
│
├── components/                # React组件
│   ├── Canvas/                # 画布系统（旧版）
│   ├── PebblingCanvas/        # 画布系统（新版）
│   │   ├── index.tsx          # 画布主组件
│   │   ├── CanvasNode.tsx     # 节点渲染
│   │   ├── Sidebar.tsx        # 侧边栏
│   │   ├── ApiSettings.tsx    # API配置
│   │   └── ...
│   ├── Desktop.tsx            # 桌面系统
│   ├── CreativeLibrary.tsx    # 创意库
│   └── SettingsModal.tsx      # 设置面板
│
├── contexts/                  # 状态管理
│   ├── ThemeContext.tsx       # 主题
│   └── RunningHubTaskContext.tsx
│
├── hooks/                     # 自定义Hooks
│   ├── useCreativeIdeas.ts
│   ├── useDesktopState.ts
│   └── useGenerationHistory.ts
│
├── services/                  # 业务逻辑层
│   ├── api/                   # API封装
│   │   ├── index.ts
│   │   ├── creativeIdeas.ts
│   │   ├── history.ts
│   │   ├── desktop.ts
│   │   ├── files.ts
│   │   └── canvas.ts
│   ├── geminiService.ts       # Gemini API
│   ├── pebblingGeminiService.ts  # 贞贞API
│   ├── soraService.ts         # Sora视频
│   ├── veoService.ts          # Veo视频
│   └── db/                    # IndexedDB
│
├── types/                     # 类型定义
│   ├── pebblingTypes.ts       # 画布节点类型
│   └── desktopTypes.ts        # 桌面类型
│
├── backend-nodejs/            # Node.js后端
│   └── src/
│       ├── server.js          # 服务器入口
│       ├── config.js          # 配置
│       └── routes/            # API路由
│
└── data/                      # 数据文件
    ├── creative_ideas.json
    ├── desktop_items.json
    └── history.json
```

### 1.3 应用架构图

```
┌─────────────────────────────────────────────────────────────┐
│                     React App (App.tsx)                      │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                   Providers                             ││
│  │   ThemeProvider → RunningHubTaskProvider               ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                    Views (3种视图)                      ││
│  │  ┌──────────┐  ┌──────────────┐  ┌──────────────────┐  ││
│  │  │ Editor   │  │ CreativeLib  │  │ PebblingCanvas   │  ││
│  │  │ (编辑器) │  │  (创意库)    │  │    (画布)        │  ││
│  │  └──────────┘  └──────────────┘  └──────────────────┘  ││
│  └─────────────────────────────────────────────────────────┘│
│                          ↓                                  │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                    Services Layer                       ││
│  │  API调用 → AI服务 → 数据存储 → 导出功能                 ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│              Node.js Backend (Express)                       │
│  静态服务 → API路由 → 文件处理 → JSON存储                    │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                    External AI APIs                         │
│  Gemini | 贞贞API | Sora | Veo | [您的API]                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 第二部分：节点系统详解

### 2.1 节点类型定义

**关键文件**: `types/pebblingTypes.ts`

```typescript
// 支持的节点类型
export type NodeType =
  | 'text'          // 文本输入节点
  | 'image'         // 图片生成节点（文生图/图生图）
  | 'idea'          // 创意扩写节点
  | 'edit'          // Magic编辑节点
  | 'video'         // 视频生成节点
  | 'video-output'  // 视频输出节点
  | 'combine'       // 组合节点
  | 'llm'           // LLM/Vision分析节点
  | 'relay'         // 中继节点
  | 'remove-bg'     // 背景移除节点
  | 'upscale'       // 图片放大节点
  | 'resize'        // 图片调整节点
  | 'bp';           // BP智能体节点
```

### 2.2 节点数据结构

```typescript
interface CanvasNode {
  id: string;
  type: NodeType;
  x: number;
  y: number;
  width: number;
  height: number;
  content: string;           // 文本内容或图片URL/Base64
  title?: string;
  data?: NodeData;           // 节点配置数据
  status?: NodeStatus;       // idle | running | completed | error
}

interface NodeData {
  // 通用配置
  prompt?: string;
  systemInstruction?: string;
  settings?: Record<string, any>;
  files?: Array<{ name: string; type: string; data: string }>;

  // 图片元数据
  imageMetadata?: {
    width: number;
    height: number;
    size: string;
    format: string;
  };

  // Resize专用
  resizeMode?: 'longest' | 'shortest' | 'width' | 'height' | 'exact';
  resizeWidth?: number;
  resizeHeight?: number;

  // Video专用
  videoService?: 'sora' | 'veo';
  videoModel?: string;
  videoSize?: string;
  videoSeconds?: string;
  veoMode?: 'text2video' | 'image2video' | 'keyframes' | 'multi-reference';
  veoModel?: string;
  veoAspectRatio?: string;
  veoEnhancePrompt?: boolean;
  veoEnableUpsample?: boolean;
  videoTaskId?: string;
  videoProgress?: number;
  videoTaskStatus?: string;
  videoFailReason?: string;
  videoUrl?: string;

  // BP节点专用
  bpTemplate?: {
    id: number;
    title: string;
    prompt: string;
    bpFields?: Array<{
      id: string;
      type: 'input' | 'agent';
      name: string;
      label: string;
      agentConfig?: {
        instruction: string;
        model: string;
      };
    }>;
    imageUrl?: string;
  };
  bpInputs?: Record<string, string>;

  // LLM输出
  output?: string;
}

interface Connection {
  id: string;
  fromNode: string;  // 源节点ID
  toNode: string;    // 目标节点ID
}
```

### 2.3 节点执行流程

**关键文件**: `components/PebblingCanvas/index.tsx`

```typescript
// 执行流程
1. 用户点击执行
   ↓
2. 级联执行上游节点
   ↓
3. 解析输入（向上递归追溯）
   ↓
4. 根据节点类型调用对应API
   ↓
5. 更新节点状态和内容
   ↓
6. 保存画布状态
```

### 2.4 输入解析机制（就近原则）

```typescript
// resolveInputs函数实现就近原则
const resolveInputs = (nodeId: string): { images: string[], texts: string[] } => {
  // 1. 查找直接上游节点
  const inputConnections = connections.filter(c => c.toNode === nodeId);

  // 2. 按Y坐标排序
  const inputNodes = inputConnections.map(c => nodes.find(n => n.id === c.fromNode));

  // 3. 收集输出
  for (const node of inputNodes) {
    if (node.type === 'image' && isValidImage(node.content)) {
      images.push(node.content);
      // 就近原则：找到图片后停止向上追溯
    } else if (node.type === 'text') {
      texts.push(node.content);
      // 文本节点继续向上找图片
    }
  }

  return { images, texts };
};
```

### 2.5 节点颜色方案（北极冰原主题）

```typescript
// 北极冰原配色方案 - 低饱和度冷色调
export const ARCTIC_COLORS = {
  // 冰川蓝 - Image类节点（image/edit/remove-bg/upscale/resize）
  glacierBlue: 'rgb(125, 163, 184)',
  glacierBlueLight: 'rgb(168, 197, 214)',

  // 苔原灰绿 - Text类节点（text/idea）
  tundraGreen: 'rgb(158, 179, 168)',
  tundraGreenLight: 'rgb(184, 207, 194)',

  // 极光紫灰 - LLM类节点
  auroraViolet: 'rgb(168, 155, 184)',
  auroraVioletLight: 'rgb(194, 184, 207)',

  // 冰雪白蓝 - Video类节点
  snowBlue: 'rgb(184, 197, 207)',
  snowBlueLight: 'rgb(209, 220, 229)',

  // 冰原灰 - Default/Relay节点
  arcticGray: 'rgb(155, 163, 171)',
  arcticGrayLight: 'rgb(184, 192, 200)',

  // BP蓝 - BP节点（智能体模式）
  bpBlue: 'rgb(96, 165, 250)',
  bpBlueLight: 'rgb(147, 197, 253)',
} as const;
```

---

## 第三部分：API接入方式

### 3.1 现有API平台

| 平台 | 服务文件 | 功能 | 配置Key |
|------|----------|------|---------|
| 贞贞API | `pebblingGeminiService.ts` | 文生图/图生图/LLM | `t8star_api_config` |
| Gemini | `geminiService.ts` | 文生图/图生图/LLM | `gemini_api_key` |
| Sora | `soraService.ts` | 视频生成 | `soraConfig` |
| Veo | `veoService.ts` | 视频生成 | `veoConfig` |

### 3.2 API配置存储方式

所有API配置通过 **localStorage** 存储：

```typescript
// Gemini API
localStorage.getItem('gemini_api_key')

// 贞贞API
localStorage.getItem('t8star_api_config')  // 画布专用
localStorage.getItem('third_party_api_config')  // 主应用

// Sora
localStorage.getItem('soraConfig')

// Veo
localStorage.getItem('veoConfig')
```

### 3.3 API服务模板

```typescript
// services/newApiService.ts
const DEFAULT_CONFIG = {
  apiKey: '',
  baseUrl: 'https://api.example.com',
  model: 'default-model',
  enabled: true
};

// 获取配置
export function getNewApiConfig() {
  const saved = localStorage.getItem('newApiConfig');
  return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
}

// 保存配置
export function saveNewApiConfig(config) {
  localStorage.setItem('newApiConfig', JSON.stringify(config));
}

// API调用
export async function callNewApi(params: {
  prompt: string;
  images?: string[];
}): Promise<string> {
  const config = getNewApiConfig();

  const response = await fetch(`${config.baseUrl}/v1/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`
    },
    body: JSON.stringify({
      model: config.model,
      prompt: params.prompt,
      images: params.images
    })
  });

  const data = await response.json();
  return data.output;
}
```

### 3.4 后端API路由

**关键文件**: `backend-nodejs/src/routes/`

```javascript
// backend-nodejs/src/routes/myFeature.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ success: true, data: [] });
});

router.post('/', (req, res) => {
  // 处理请求
  res.json({ success: true, data: result });
});

module.exports = router;
```

在 `server.js` 中注册：

```javascript
const myFeatureRouter = require('./routes/myFeature');
app.use('/api/my-feature', myFeatureRouter);
```

---

## 第四部分：如何添加新API平台

### 步骤1：添加类型定义

**文件**: `types.ts`

```typescript
// 新平台配置接口
export interface NewPlatformConfig {
  apiKey: string;
  baseUrl: string;
  model?: string;
  enabled?: boolean;
}
```

### 步骤2：创建服务文件

**文件**: `services/newPlatformService.ts`

```typescript
import { NewPlatformConfig } from '../types';

const DEFAULT_CONFIG: NewPlatformConfig = {
  apiKey: '',
  baseUrl: 'https://api.example.com',
  model: 'default-model',
  enabled: true
};

export function getNewPlatformConfig(): NewPlatformConfig {
  const saved = localStorage.getItem('newPlatformConfig');
  return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
}

export function saveNewPlatformConfig(config: NewPlatformConfig): void {
  localStorage.setItem('newPlatformConfig', JSON.stringify(config));
}

export async function generateWithNewPlatform(
  prompt: string,
  images?: string[],
  options?: any
): Promise<string> {
  const config = getNewPlatformConfig();

  const response = await fetch(`${config.baseUrl}/v1/images/generations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`
    },
    body: JSON.stringify({
      model: config.model,
      prompt,
      images,
      ...options
    })
  });

  const data = await response.json();
  return data.data[0].url;
}
```

### 步骤3：添加配置UI

**文件**: `components/SettingsModal.tsx`

在设置面板中添加配置表单：

```typescript
const [newPlatformConfig, setNewPlatformConfig] = useState<NewPlatformConfig>({
  apiKey: '',
  baseUrl: 'https://api.example.com'
});

// 加载配置
useEffect(() => {
  if (isOpen) {
    const saved = getNewPlatformConfig();
    setNewPlatformConfig(saved);
  }
}, [isOpen]);

// 保存配置
const handleSaveNewPlatform = () => {
  saveNewPlatformConfig(newPlatformConfig);
  // 显示成功消息
};
```

### 步骤4：在画布节点中使用

**文件**: `types/pebblingTypes.ts`

```typescript
export type NodeType =
  | 'text' | 'image' | 'edit' | 'video' | 'llm'
  | 'relay' | 'remove-bg' | 'upscale' | 'resize' | 'bp'
  | 'new-platform';  // 新增节点类型
```

**文件**: `components/PebblingCanvas/index.tsx`

在 `handleExecuteNode` 函数中添加：

```typescript
else if (node.type === 'new-platform') {
  const { texts, images } = resolveInputs(nodeId);
  const prompt = texts.join('\n') || node.data?.prompt || '';

  const result = await generateWithNewPlatform(prompt, images, node.data?.settings);

  updateNode(nodeId, {
    content: result,
    status: 'completed'
  });
}
```

### 步骤5：添加侧边栏按钮

**文件**: `components/PebblingCanvas/Sidebar.tsx`

```typescript
<DraggableButton
  type="new-platform"
  icon={<Icons.Star />}
  label="新平台API"
/>
```

---

## 第五部分：如何复用现有节点

### 5.1 复用Image节点逻辑

Image节点的核心逻辑支持：
- 文生图
- 图生图（单张/多张）
- 容器模式（传递图片）

```typescript
// 可复用的核心函数
export async function generateCreativeImage(
  prompt: string,
  config: GenerationConfig,
  signal?: AbortSignal
): Promise<string | null>

export async function editCreativeImage(
  base64Images: string[],
  prompt: string,
  genConfig?: GenerationConfig,
  signal?: AbortSignal
): Promise<string | null>
```

### 5.2 复用LLM节点逻辑

LLM节点支持：
- 文本分析
- 图片理解
- 自定义系统指令

```typescript
export async function generateAdvancedLLM(
  userPrompt: string,
  systemInstruction?: string,
  inputImages?: string[]
): Promise<string>
```

### 5.3 复用视频生成逻辑

Sora/Veo节点的异步任务模式：

```typescript
// 创建任务 → 轮询状态 → 获取结果
export async function createVideoWithPolling(
  params: VideoParams,
  onProgress?: (progress: number) => void
): Promise<string>
```

---

## 第六部分：关键文件路径索引

### 核心文件

| 功能 | 文件路径 |
|------|----------|
| 主应用入口 | `App.tsx` |
| 全局类型 | `types.ts` |
| 画布主组件 | `components/PebblingCanvas/index.tsx` |
| 节点渲染 | `components/PebblingCanvas/CanvasNode.tsx` |
| 节点类型定义 | `types/pebblingTypes.ts` |
| 侧边栏 | `components/PebblingCanvas/Sidebar.tsx` |
| API设置 | `components/PebblingCanvas/ApiSettings.tsx` |
| 桌面主组件 | `components/Desktop.tsx` |
| 创意库 | `components/CreativeLibrary.tsx` |
| 设置面板 | `components/SettingsModal.tsx` |

### 服务层

| 功能 | 文件路径 |
|------|----------|
| API封装基础 | `services/api/index.ts` |
| 贞贞API服务 | `services/pebblingGeminiService.ts` |
| Gemini服务 | `services/geminiService.ts` |
| Sora服务 | `services/soraService.ts` |
| Veo服务 | `services/veoService.ts` |
| 画布API | `services/api/canvas.ts` |
| 创意库API | `services/api/creativeIdeas.ts` |
| 历史API | `services/api/history.ts` |
| 桌面API | `services/api/desktop.ts` |
| 文件API | `services/api/files.ts` |
| 图片操作API | `services/api/imageOps.ts` |
| RunningHub API | `services/api/runninghub.ts` |

### 数据库服务

| 功能 | 文件路径 |
|------|----------|
| 创意库DB | `services/db/creativeIdeasDb.ts` |
| 历史DB | `services/db/historyDb.ts` |

### 后端

| 功能 | 文件路径 |
|------|----------|
| 服务器入口 | `backend-nodejs/src/server.js` |
| 配置 | `backend-nodejs/src/config.js` |
| 画布路由 | `backend-nodejs/src/routes/canvas.js` |
| 创意路由 | `backend-nodejs/src/routes/creative.js` |
| 桌面路由 | `backend-nodejs/src/routes/desktop.js` |
| 设置路由 | `backend-nodejs/src/routes/settings.js` |
| 文件路由 | `backend-nodejs/src/routes/files.js` |
| 历史路由 | `backend-nodejs/src/routes/history.js` |
| 图片操作路由 | `backend-nodejs/src/routes/imageOps.js` |

### 配置和状态

| 功能 | 文件路径 |
|------|----------|
| 主题Context | `contexts/ThemeContext.tsx` |
| 任务Context | `contexts/RunningHubTaskContext.tsx` |
| 创意库Hook | `hooks/useCreativeIdeas.ts` |
| 桌面状态Hook | `hooks/useDesktopState.ts` |
| 桌面交互Hook | `hooks/useDesktopInteraction.ts` |
| 桌面布局Hook | `hooks/useDesktopLayout.ts` |
| 历史Hook | `hooks/useGenerationHistory.ts` |

### 常量和工具

| 功能 | 文件路径 |
|------|----------|
| 默认RunningHub创意 | `constants/defaultRunningHubIdeas.ts` |
| 图片工具 | `utils/image.ts` |
| 创意提取 | `services/creativeExtractor.ts` |
| 故事库 | `services/storyLibrary.ts` |

### Electron相关

| 功能 | 文件路径 |
|------|----------|
| Electron主进程 | `electron/main.cjs` |
| Preload脚本 | `electron/preload.cjs` |

---

## 第七部分：开发最佳实践

### 7.1 保留现有功能原则

1. **不删除现有代码** - 新功能通过扩展实现
2. **复用现有节点** - 优先使用现有节点的组合
3. **保持API兼容** - 新API遵循现有接口规范
4. **统一配置管理** - 使用localStorage存储配置

### 7.2 添加新功能检查清单

- [ ] 在 `types.ts` 中添加类型定义
- [ ] 创建对应的服务文件
- [ ] 在设置面板添加配置UI
- [ ] 如需节点，扩展 `NodeType`
- [ ] 在画布中添加执行逻辑
- [ ] 更新侧边栏按钮
- [ ] 测试功能完整性

### 7.3 调试技巧

```typescript
// 查看节点状态
console.log('[节点]', node.type, node.status, node.data);

// 查看连接关系
console.log('[连接]', connections.filter(c => c.toNode === nodeId));

// 查看API配置
console.log('[配置]', getApiConfig());
```

---

## 第八部分：常用代码片段

### 创建新节点

```typescript
import { v4 as uuid } from 'uuid';

const newNode: CanvasNode = {
  id: uuid(),
  type: 'your-type',
  x: 100,
  y: 100,
  width: 300,
  height: 200,
  content: '',
  data: { prompt: '' },
  status: 'idle'
};

setNodes(prev => [...prev, newNode]);
```

### 创建连接

```typescript
import { v4 as uuid } from 'uuid';

const newConnection: Connection = {
  id: uuid(),
  fromNode: sourceNodeId,
  toNode: targetNodeId
};

setConnections(prev => [...prev, newConnection]);
```

### 更新节点

```typescript
updateNode(nodeId, {
  data: { ...node.data, output: result },
  status: 'completed'
});
```

### 获取API配置

```typescript
// 获取贞贞API配置
const t8starConfig = JSON.parse(localStorage.getItem('t8star_api_config') || '{}');

// 获取Gemini API Key
const geminiKey = localStorage.getItem('gemini_api_key');

// 获取Sora配置
const soraConfig = JSON.parse(localStorage.getItem('soraConfig') || '{}');
```

### 保存API配置

```typescript
// 保存贞贞API配置
localStorage.setItem('t8star_api_config', JSON.stringify({
  enabled: true,
  baseUrl: 'https://api.example.com',
  apiKey: 'your-api-key',
  model: 'nano-banana-2'
}));
```

---

## 附录：API端点完整列表

| 端点 | 方法 | 功能 |
|------|------|------|
| `/api/status` | GET | 服务器状态 |
| `/api/creative-ideas` | GET/POST/PUT/DELETE | 创意库CRUD |
| `/api/history` | GET/POST/DELETE | 历史记录CRUD |
| `/api/desktop` | GET/POST | 桌面项目读写 |
| `/api/files/save-output` | POST | 保存输出图片 |
| `/api/files/save-input` | POST | 保存输入图片 |
| `/api/image-ops/merge` | POST | 图片合并 |
| `/api/canvas` | GET/POST | 画布列表 |
| `/api/canvas/:id` | GET/PUT/DELETE | 单个画布操作 |
| `/api/settings` | GET/POST | 设置读写 |
| `/api/settings/:key` | GET/PUT | 单个设置项 |

---

## 附录：启动和构建命令

### 开发命令

```bash
# 启动开发服务器（前端）
npm run dev

# 启动Electron开发模式（包含后端）
npm run electron:dev

# 启动后端服务器
cd backend-nodejs && npm start
```

### 构建命令

```bash
# 构建前端
npm run build

# 构建Electron应用
npm run electron:build

# 打包Windows应用
npm run package

# 打包所有平台
npm run package:all
```

### 发布命令

```bash
# 完整发布流程（打包+上传）
npm run release

# 仅上传
npm run upload
```

---

**文档版本**: v1.0
**最后更新**: 2026-01-21
**项目版本**: 1.4.1
**维护者**: PenguinCreative Team
