---
name: juxin-platform
description: 聚鑫平台（api.jxincm.cn）功能需求规范。当需要使用聚鑫平台的 Sora2 API 功能时使用此 skill。
---

# 聚鑫平台功能需求规范

> **重要**: 这是一份需求说明书，不是技术文档。
> **目的**: 说明聚鑫平台的功能特性、用户场景和验收标准，而不是如何调用 API。

---

## 平台概述

**聚鑫平台**（api.jxincm.cn）是 Sora2 视频生成服务的提供方之一，专注于提供基础视频生成功能。

**核心特点**:
- ✅ 模型简单：只支持 `sora-2-all` 模型
- ✅ 功能专注：文生视频、图生视频、角色创建
- ✅ 适合快速生成：无需选择模型，开箱即用

---

## 支持的功能列表

### 视频生成功能

| 功能 | 描述 | 用户价值 |
|------|------|----------|
| **文生视频** | 输入文字描述生成视频 | 零门槛创作 |
| **图生视频** | 基于参考图片生成视频 | 保持角色/场景一致性 |
| **视频时长** | 支持 10秒、15秒 | 满足不同时长需求 |
| **画面比例** | 支持 16:9（横屏）、9:16（竖屏） | 适配不同发布平台 |
| **水印控制** | 可选是否添加水印 | 保护原创内容 |

### 角色系统功能

| 功能 | 描述 | 用户价值 |
|------|------|----------|
| **角色创建** | 从视频提取角色 | 一次创建，多次复用 |
| **角色引用** | 使用 `@username` 语法在视频中调用角色 | 保持角色一致性 |
| **角色管理** | 搜索、收藏、删除角色 | 高效管理角色库 |
| **跨平台通用** | 聚鑫创建的角色可在贞贞平台使用 | 降低迁移成本 |

### 故事板功能

| 功能 | 描述 | 用户价值 |
|------|------|----------|
| **多镜头视频** | 一个任务生成多个镜头的视频 | 制作连贯的动画短片 |
| **镜头管理** | 添加、删除、编辑镜头 | 灵活控制视频内容 |
| **参考图支持** | 支持全局和镜头级别的参考图 | 精确控制视频风格 |
| **角色引用** | 支持在镜头中引用角色 | 角色多场景复用 |

---

## 模型功能说明

### sora-2-all 模型

**唯一支持的模型**: `sora-2-all`

**特点**:
- ✅ 开箱即用：无需选择模型
- ✅ 功能平衡：质量和速度平衡
- ✅ 成本稳定：单一模型定价

**适用场景**:
- 快速视频生成（3-5分钟）
- 基础质量要求
- 测试和实验阶段

**与其他平台对比**:
| 平台 | 模型选择 | 高级功能 |
|------|---------|---------|
| 聚鑫 | sora-2-all（单一） | ❌ 无 HD 模式 |
| 贞贞 | sora-2 / sora-2-pro（可选） | ✅ 支持 HD 模式 |

---

## 用户场景

### 场景 1: 快速生成单个视频

**用户需求**: 快速生成一个简单的视频

**操作步骤**:
1. 在 `sora2-api-config` 节点选择"聚鑫"平台
2. 在 `sora2-video-generate` 节点输入提示词
3. 等待 3-5 分钟，视频生成完成

**预期结果**:
- 视频时长：10 秒或 15 秒
- 画面比例：16:9（横屏）或 9:16（竖屏）
- 视频质量：基础质量（适合社交媒体分享）

---

### 场景 2: 批量生成多个视频

**用户需求**: 一次性生成多个不同场景的视频

**操作步骤**:
1. 在 `sora2-video-generate` 节点准备多个提示词
2. 在 `sora2-batch-video` 节点选择要生成的提示词
3. 点击"批量生成"，系统自动创建多个任务
4. 在 `sora2-task-result` 节点查看所有视频进度

**预期结果**:
- 所有视频并行生成（节省时间）
- 每个视频独立任务（互不影响）
- 失败任务可单独重试

---

### 场景 3: 角色创建和复用

**用户需求**: 从宠物视频提取角色，在不同场景中复用

**操作步骤**:
1. 生成宠物视频（如"橙色小猫在花园玩"）
2. 使用 `sora2-character-create` 节点提取角色
   - 输入任务 ID（from_task）
   - 输入时间范围（timestamps: "1,3"）
3. 角色保存到 `sora2-character-lib` 角色库
4. 在新视频中使用 `@username` 引用角色
   - 输入："@阳光小猫 在海边玩"
   - 系统自动转换为真实 ID（`@ebfb9a758.sunnykitte`）

**预期结果**:
- 角色在不同视频中保持一致的外观
- 角色可在聚鑫和贞贞平台通用
- 支持多角色场景（`@角色A 和 @角色B 在海边玩`）

---

### 场景 4: 图生视频（参考场景和角色）

**用户需求**: 基于参考图片生成视频，同时使用角色

**操作步骤**:
1. 在 `sora2-reference-image` 节点上传参考图（如卡通火山场景）
2. 在 `sora2-character-lib` 节点选择角色（如 `@装载机`）
3. 在 `sora2-video-generate` 节点输入提示词
   - 描述参考场景："卡通火山场景，火山口有熔岩流动"
   - 引用角色："@装载机 在火山附近作业"
4. 生成视频

**预期结果**:
- 视频场景与参考图一致（卡通火山）
- 角色在指定场景中活动（装载机搬运岩石）
- 场景和角色完美融合

---

## API 功能描述

### 创建视频功能

**功能描述**: 用户输入提示词和参数，系统创建视频生成任务

**输入需求**:
- **提示词**: 文字描述视频内容
- **模型**: `sora-2-all`（固定）
- **时长**: 10秒或15秒
- **比例**: 16:9（横屏）或 9:16（竖屏）
- **水印**: 可选是否添加
- **参考图**: 可选，图生视频时使用
- **角色引用**: 可选，使用 `@username` 语法

**输出需求**:
- **任务 ID**: 用于查询视频生成进度
- **初始状态**: `queued`（排队中）或 `processing`（处理中）
- **预计时间**: 3-5 分钟

---

### 查询任务状态功能

**功能描述**: 用户查询视频生成任务的当前状态

**输入需求**:
- **任务 ID**: 创建视频时返回的 ID

**输出需求**:
- **状态**: `queued` / `processing` / `success` / `failure`
- **进度**: 0-100%
- **视频 URL**: 任务完成时返回

**轮询策略**:
- 每 30 秒查询一次（避免 429 错误）
- 直到状态变为 `success` 或 `failure`

---

### 创建角色功能

**功能描述**: 从已生成的视频提取角色

**输入需求**:
- **来源任务 ID**: 使用 `from_task` 参数（推荐）
- **时间范围**: 1-3 秒片段（如 `"1,3"`）
- **替代方案**: 直接输入视频 URL（不推荐）

**输出需求**:
- **角色 ID**: 系统生成的唯一标识
- **用户名**: 真实 ID（如 `ebfb9a758.sunnykitte`）
- **头像 URL**: 角色缩略图

**约束**:
- ⚠️ 时间范围必须是 1-3 秒
- ⚠️ 视频中的角色必须是物品/宠物，不支持真人人物
- ✅ 推荐使用 `from_task` 而非视频 URL（更可靠）

---

### 角色列表功能

**功能描述**: 获取已创建的所有角色

**输出需求**:
- **角色列表**: 包含所有角色的信息
- **角色信息**:
  - 用户名（真实 ID）
  - 别名（可选）
  - 头像 URL
  - 创建时间
  - 是否收藏

**管理功能**:
- **搜索**: 按用户名/别名搜索
- **筛选**: 全部 / 收藏 / 最近使用
- **收藏**: 标记常用角色
- **删除**: 删除不需要的角色

---

## 故事板功能说明

### 功能概述

**故事板**: 通过多个镜头拼接生成一个连贯的视频

**用户价值**:
- 制作有剧情的动画短片
- 控制每个镜头的内容和时长
- 保持角色在多个镜头中的一致性

---

### 镜头管理功能

**功能需求**:
- **添加镜头**: 创建新的镜头
- **删除镜头**: 移除不需要的镜头
- **编辑镜头**: 修改镜头的场景描述、时长、参考图

**镜头参数**:
- **场景描述**: 每个镜头的文字描述
- **时长**: 每个镜头的时长（秒）
- **参考图**: 可选，为每个镜头添加参考图片
- **角色引用**: 可选，在镜头中使用 `@username` 语法

---

### 参考图支持

**全局参考图**:
- 所有镜头共享的参考图
- 用于统一视频风格

**镜头参考图**:
- 单独为某个镜头添加的参考图
- 优先级高于全局参考图

**图片合并策略**:
1. 优先使用镜头参考图
2. 其次使用全局参考图
3. 所有参考图合并传递给 API

---

## 验收标准

### 功能完整性

- [ ] 文生视频功能正常
- [ ] 图生视频功能正常
- [ ] 批量生成功能正常
- [ ] 角色创建功能正常
- [ ] 角色引用功能正常
- [ ] 故事板功能正常

### 用户体验

- [ ] 界面清晰易懂
- [ ] 操作流程顺畅
- [ ] 错误提示友好
- [ ] 进度显示准确

### 性能要求

- [ ] 视频生成时间：3-5 分钟
- [ ] 任务查询响应时间：< 1 秒
- [ ] 角色创建响应时间：< 5 秒
- [ ] 支持 429 错误处理（自动重试）

---

## 平台差异对比

### 聚鑫 vs 贞贞

| 维度 | 聚鑫平台 | 贞贞平台 |
|------|---------|---------|
| **模型** | sora-2-all（单一） | sora-2 / sora-2-pro（可选） |
| **视频时长** | 10秒、15秒 | 10秒、15秒、25秒（pro） |
| **HD 模式** | ❌ 不支持 | ✅ 支持（sora-2-pro） |
| **故事板端点** | 专用端点 | 使用常规端点 + 特殊格式 |
| **查询参数** | `?id=taskId` | `/{taskId}` |
| **响应格式** | `{id}` | `{task_id}` |

### 选择建议

**选择聚鑫平台**:
- ✅ 快速生成（无需选择模型）
- ✅ 基础质量要求
- ✅ 成本敏感场景

**选择贞贞平台**:
- ✅ 需要 HD 高清画质
- ✅ 需要长视频（25秒）
- ✅ 需要高级功能

---

## API 技术指导 ⭐ 重要

> **说明**: 本章节提供完整的 API 技术指导，包含端点、参数、代码示例。

---

### API 基础信息

**Base URL**: `https://api.jxincm.cn`

**认证方式**: Bearer Token
```javascript
headers: {
  'Authorization': 'Bearer YOUR_API_KEY'
}
```

---

### 1. 创建视频 API ⭐ 核心端点

**端点**: `POST /v1/video/create`

**请求格式**: `application/json`

**请求参数**:
```javascript
{
  "model": "sora-2-all",        // ⭐ 聚鑫唯一支持的模型
  "prompt": "一只可爱的猫咪",    // 提示词
  "duration": 10,                // 时长：10 或 15（数字类型）
  "aspect_ratio": "16:9",        // 比例：16:9（横屏）或 9:16（竖屏）
  "watermark": false,            // 是否添加水印（可选）
  "private": false,              // 是否隐藏视频（可选）
  "images": ["url1", "url2"]     // 参考图片数组（可选，图生视频）
}
```

**完整代码示例**:
```javascript
const response = await fetch('https://api.jxincm.cn/v1/video/create', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'sora-2-all',
    prompt: '@ebfb9a758.sunnykitte 在海边玩耍',
    duration: 10,
    aspect_ratio: '16:9',
    watermark: false,
    images: []  // 空数组表示文生视频
  })
});

const result = await response.json();
// 返回格式: { id: "task_xxx", status: "queued", progress: 0 }
```

**关键点**:
- ⚠️ **模型名称**: 必须使用 `sora-2-all`，不是 `sora-2`
- ⚠️ **duration 类型**: 数字类型（10），不是字符串（"10"）
- ⚠️ **images 参数**: 文生视频传空数组 `[]`，图生视频传 URL 数组

---

### 2. 查询任务状态 API

**端点**: `GET /v1/video/query?id={taskId}`

**⚠️ 重要**: 使用**查询参数** `?id=`，不是路径参数

**代码示例**:
```javascript
const taskId = 'task_xxx';
const response = await fetch(`https://api.jxincm.cn/v1/video/query?id=${taskId}`, {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
});

const result = await response.json();
// 返回格式: { id: "task_xxx", status: 100, progress: 50, video_url: "..." }
```

**状态码映射**:
| 聚鑫状态码 | 统一状态 | 说明 |
|-----------|---------|------|
| 100 | NOT_START | 未开始 |
| 101 | NOT_START | 未开始 |
| 102 | IN_PROGRESS | 处理中 |
| 103 | SUCCESS | 完成 |
| 104 | FAILURE | 失败 |

**轮询策略**:
```javascript
// ⭐ 推荐：30 秒轮询间隔（避免 429 错误）
const POLL_INTERVAL = 30000;  // 30 秒

const pollTask = async (taskId) => {
  while (true) {
    const response = await fetch(`https://api.jxincm.cn/v1/video/query?id=${taskId}`);
    const result = await response.json();

    if (result.status === 103) {  // SUCCESS
      return result.video_url;
    }

    if (result.status === 104) {  // FAILURE
      throw new Error('任务失败');
    }

    await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL));
  }
};
```

---

### 3. 创建角色 API ⭐ 核心端点

**端点**: `POST /sora/v1/characters`

**请求格式**: `application/json`

**请求参数**:
```javascript
{
  "from_task": "video_xxx",    // ⭐ 推荐：已完成的视频任务 ID
  "timestamps": "1,3",         // ⭐ 必填：时间范围（1-3 秒）
  "url": "https://..."         // 可选：视频 URL（不推荐）
}
```

**⚠️ 重要约束**:
- **from_task 和 url 二选一**：必须设置其中一个
- **timestamps 范围**：差值必须是 1-3 秒（如 "1,3" 差 2 秒）
- **角色类型**：只支持物品/宠物，**不支持真人人物**

**完整代码示例**:
```javascript
// ✅ 推荐：使用 from_task 参数
const response = await fetch('https://api.jxincm.cn/sora/v1/characters', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    from_task: 'video_e50c76ca-21d4-40e9-8485-e4ead2d37133',
    timestamps: '1,3'
  })
});

const character = await response.json();
// 返回格式: {
//   id: "ch_xxx",
//   username: "ebfb9a758.sunnykitte",  // ⭐ 用于 @ 引用
//   permalink: "https://sora.chatgpt.com/profile/...",
//   profile_picture_url: "https://..."
// }
```

**角色引用语法**:
```javascript
// 使用 username 字段引用角色
const prompt = `@${character.username} 在海边玩耍`;
// 结果: "@ebfb9a758.sunnykitte 在海边玩耍"
```

---

### 4. 故事板 API ⭐ 专用端点

**端点**: `POST /v1/videos`

**⚠️ 重要**: 这是聚鑫平台**专用**的故事板端点，使用 `multipart/form-data` 格式

**请求格式**: `multipart/form-data`

**请求参数**:
```javascript
// FormData 格式
const formData = new FormData();
formData.append('model', 'sora-2-all');
formData.append('prompt', prompt);  // 故事板格式提示词
formData.append('seconds', '15');     // 总时长
formData.append('size', '16x9');      // 横屏: 16x9, 竖屏: 9x16
formData.append('watermark', 'false');
formData.append('private', 'false');
formData.append('input_reference', file);  // 参考图片（可选）
```

**提示词格式**（多镜头拼接）:
```javascript
const shots = [
  { duration: '5sec', scene: '老鹰展翅高飞' },
  { duration: '5sec', scene: '老鹰在空中盘旋' },
  { duration: '5sec', scene: '老鹰俯冲捕捉猎物' }
];

// 拼接为故事板格式
const prompt = shots.map((shot, index) =>
  `Shot ${index + 1}:\nduration: ${shot.duration}\nScene: ${shot.scene}\n`
).join('\n');

// 结果:
// "Shot 1:\nduration: 5sec\nScene: 老鹰展翅高飞\n\nShot 2:\nduration: 5sec\nScene: 老鹰在空中盘旋\n\n..."
```

**完整代码示例**:
```javascript
const shots = [
  { duration: '5sec', scene: '老鹰展翅高飞' },
  { duration: '5sec', scene: '老鹰在空中盘旋' }
];

const prompt = shots.map((shot, index) =>
  `Shot ${index + 1}:\nduration: ${shot.duration}\nScene: ${shot.scene}\n`
).join('\n');

const formData = new FormData();
formData.append('model', 'sora-2-all');
formData.append('prompt', prompt);
formData.append('seconds', '10');  // 总时长（所有镜头之和）
formData.append('size', '16x9');
formData.append('watermark', 'false');

const response = await fetch('https://api.jxincm.cn/v1/videos', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
    // ⚠️ 不设置 Content-Type，让浏览器自动设置 multipart/form-data
  },
  body: formData
});

const result = await response.json();
// 返回格式: { id: "sora-2:task_xxx", status: "queued", ... }
```

**关键差异**（聚鑫 vs 贞贞）:
| 特性 | 聚鑫 | 贞贞 |
|------|------|------|
| **端点** | `/v1/videos` | `/v2/videos/generations` |
| **格式** | `multipart/form-data` | `application/json` |
| **时长参数** | `seconds: "15"` | `duration: "15"` |
| **比例参数** | `size: "16x9"` | `aspect_ratio: "16:9"` |

---

## 参考文档

- `references/api-features.md` - API 功能详细说明
- `references/storyboard-features.md` - 故事板功能详细说明
- `../penguin-nodes-guide/SKILL.md` - Penguin 节点复用指南

---

**文档版本**: v1.1
**创建日期**: 2026-01-21
**更新日期**: 2026-01-21（添加完整 API 技术指导）
**维护者**: WinJin 开发团队
