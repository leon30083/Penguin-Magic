---
name: zhenzhen-platform
description: 贞贞平台（ai.t8star.cn）功能需求规范。当需要使用贞贞平台的高级 Sora2 API 功能时使用此 skill。
---

# 贞贞平台功能需求规范

> **重要**: 这是一份需求说明书，不是技术文档。
> **目的**: 说明贞贞平台的功能特性、用户场景和验收标准，而不是如何调用 API。

---

## 平台概述

**贞贞平台**（ai.t8star.cn）是 Sora2 视频生成服务的高级提供方，专注于提供高质量视频生成功能。

**核心特点**:
- ✅ 模型可选：支持 `sora-2` 和 `sora-2-pro` 模型
- ✅ 高级功能：HD 高清模式、长视频（25秒）
- ✅ 专业创作：适合高质量内容制作

---

## 支持的功能列表

### 视频生成功能

| 功能 | 描述 | 用户价值 |
|------|------|----------|
| **文生视频** | 输入文字描述生成视频 | 零门槛创作 |
| **图生视频** | 基于参考图片生成视频 | 保持角色/场景一致性 |
| **视频时长** | 支持 10秒、15秒、25秒（sora-2-pro） | 满足不同时长需求 |
| **画面比例** | 支持 16:9（横屏）、9:16（竖屏） | 适配不同发布平台 |
| **HD 模式** | sora-2-pro 支持高清画质（可选） | 专业质量要求 |
| **水印控制** | 可选是否添加水印 | 保护原创内容 |

### 模型功能

| 模型 | 特点 | 适用场景 |
|------|------|----------|
| **sora-2** | 基础模型，10秒/15秒视频 | 日常内容创作 |
| **sora-2-pro** | 高级模型，支持 HD 和 25秒视频 | 专业质量要求 |

### 角色系统功能

| 功能 | 描述 | 用户价值 |
|------|------|----------|
| **角色创建** | 从视频提取角色 | 一次创建，多次复用 |
| **角色引用** | 使用 `@username` 语法在视频中调用角色 | 保持角色一致性 |
| **角色管理** | 搜索、收藏、删除角色 | 高效管理角色库 |
| **跨平台通用** | 贞贞创建的角色可在聚鑫平台使用 | 降低迁移成本 |

---

## 高级功能说明

### HD 高清模式

**功能描述**: sora-2-pro 模型支持 HD 高清画质选项

**启用条件**:
- 模型必须选择 `sora-2-pro`
- 画面比例必须是 16:9（横屏）
- 视频时长支持 25 秒

**用户价值**:
- ✅ 专业画质要求
- ✅ 适合大屏幕播放
- ✅ 适合商业广告

**使用场景**:
- 品牌宣传视频
- 商业广告制作
- 专业内容创作

---

### 长视频功能

**功能描述**: sora-2-pro 模型支持 25 秒长视频

**时长对比**:
| 模型 | 支持时长 |
|------|---------|
| sora-2 | 10秒、15秒 |
| sora-2-pro | 10秒、15秒、**25秒** |

**用户价值**:
- ✅ 讲述更完整的故事
- ✅ 展示更丰富的场景
- ✅ 适合短片制作

**使用场景**:
- 动画短片
- 产品演示视频
- 教育培训视频

---

## 模型功能说明

### sora-2 模型（基础）

**特点**:
- ✅ 开箱即用：基础质量，快速生成
- ✅ 成本经济：适合大量生成
- ✅ 稳定可靠：成熟模型

**适用场景**:
- 日常内容创作
- 社交媒体视频
- 测试和实验阶段

**参数限制**:
- 视频时长：10秒、15秒
- 不支持 HD 模式
- 不支持 25 秒视频

---

### sora-2-pro 模型（高级）

**特点**:
- ✅ 高级功能：HD 模式、25秒视频
- ✅ 专业质量：适合商业用途
- ✅ 灵活选择：根据需求开启高级功能

**适用场景**:
- 商业广告制作
- 品牌宣传视频
- 专业短片创作

**高级功能**:
- HD 模式：高清画质（16:9 横屏）
- 25秒视频：讲述更完整的故事
- 水印控制：可选是否添加水印

**参数限制**:
- HD 模式：仅支持 16:9 横屏
- 25秒视频：仅 sora-2-pro 支持

---

## 用户场景

### 场景 1: 生成高质量商业视频

**用户需求**: 为品牌制作高质量宣传视频

**操作步骤**:
1. 在 `sora2-api-config` 节点选择"贞贞"平台
2. 在 `sora2-api-config` 节点选择 `sora-2-pro` 模型
3. 在 `sora2-api-config` 节点启用 HD 模式
4. 在 `sora2-video-generate` 节点输入专业提示词
5. 等待 5-10 分钟，视频生成完成

**预期结果**:
- 视频时长：10秒、15秒或 25 秒
- 画质：HD 高清
- 画面比例：16:9（横屏）
- 视频质量：专业级别，适合商业用途

---

### 场景 2: 制作长视频短片

**用户需求**: 讲述一个完整的故事，需要较长的视频时长

**操作步骤**:
1. 在 `sora2-api-config` 节点选择"贞贞"平台和 `sora-2-pro` 模型
2. 在 `sora2-video-generate` 节点输入详细的场景描述
3. 选择视频时长为 25 秒
4. 等待 8-12 分钟，视频生成完成

**预期结果**:
- 视频时长：25 秒
- 足够时间展示完整的故事线
- 包含丰富的场景和角色活动

---

### 场景 3: 角色创建和跨平台使用

**用户需求**: 从贞贞平台创建角色，在聚鑫平台使用

**操作步骤**:
1. 在贞贞平台生成视频（如"卡通小猫在花园玩"）
2. 使用 `sora2-character-create` 节点提取角色
3. 角色保存到 `sora2-character-lib` 角色库
4. 切换到聚鑫平台，在同一节点中使用 `@username` 引用角色
5. 生成新视频

**预期结果**:
- 角色在两个平台保持一致的外观
- 无需重新创建角色
- 降低平台切换成本

---

## API 功能描述

### 创建视频功能

**功能描述**: 用户输入提示词和参数，系统创建视频生成任务

**输入需求**:
- **提示词**: 文字描述视频内容
- **模型**: `sora-2` 或 `sora-2-pro`
- **时长**: 10秒、15秒、25秒（pro）
- **比例**: 16:9（横屏）或 9:16（竖屏）
- **HD 模式**: 可选，仅 sora-2-pro 支持
- **水印**: 可选是否添加
- **参考图**: 可选，图生视频时使用
- **角色引用**: 可选，使用 `@username` 语法

**输出需求**:
- **任务 ID**: 用于查询视频生成进度
- **初始状态**: `queued`（排队中）或 `processing`（处理中）
- **预计时间**:
  - sora-2: 3-5 分钟
  - sora-2-pro: 5-10 分钟

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

## 故事板功能说明

### 功能概述

**故事板**: 通过多镜头提示词格式生成一个连贯的视频

**与聚鑫平台的差异**:
- ❌ 贞贞平台**没有**专用故事板端点
- ✅ 使用常规视频端点 + 特殊提示词格式

**用户价值**:
- 制作有剧情的动画短片
- 控制每个镜头的内容和时长
- 保持角色在多个镜头中的一致性

---

### 提示词格式

**故事板提示词格式**:
```
Shot 1:
duration: 5sec
Scene: 老鹰展翅高飞

Shot 2:
duration: 5sec
Scene: 老鹰在空中盘旋

Shot 3:
duration: 5sec
Scene: 老鹰俯冲捕捉猎物
```

**关键要求**:
- 每个镜头使用 `Shot N:` 开头
- 指定镜头时长：`duration: Xsec`
- 描述镜头场景：`Scene: 场景描述`
- 镜头之间用空行分隔

---

### 镜头管理功能

**功能需求**:
- **添加镜头**: 在提示词中添加新的 `Shot N:`
- **删除镜头**: 从提示词中移除某个镜头
- **编辑镜头**: 修改镜头的场景描述或时长
- **调整顺序**: 重新排列镜头顺序

**镜头参数**:
- **场景描述**: 每个镜头的文字描述
- **时长**: 每个镜头的时长（秒）
- **参考图**: 可选，为整个故事板添加全局参考图
- **角色引用**: 可选，在镜头中使用 `@username` 语法

---

## 验收标准

### 功能完整性

- [ ] 文生视频功能正常
- [ ] 图生视频功能正常
- [ ] sora-2 和 sora-2-pro 模型切换正常
- [ ] HD 模式功能正常（sora-2-pro）
- [ ] 25秒视频生成功能正常（sora-2-pro）
- [ ] 角色创建功能正常
- [ ] 角色引用功能正常
- [ ] 故事板功能正常

### 用户体验

- [ ] 界面清晰易懂
- [ ] 操作流程顺畅
- [ ] 错误提示友好
- [ ] 进度显示准确
- [ ] 高级功能选项清晰

### 性能要求

- [ ] 视频生成时间：
  - sora-2: 3-5 分钟
  - sora-2-pro: 5-10 分钟
- [ ] 任务查询响应时间：< 1 秒
- [ ] 角色创建响应时间：< 5 秒
- [ ] 支持 429 错误处理（自动重试）

---

## 平台差异对比

### 贞贞 vs 聚鑫

| 维度 | 贞贞平台 | 聚鑫平台 |
|------|---------|---------|
| **模型** | sora-2 / sora-2-pro（可选） | sora-2-all（单一） |
| **视频时长** | 10秒、15秒、**25秒（pro）** | 10秒、15秒 |
| **HD 模式** | ✅ 支持（sora-2-pro） | ❌ 不支持 |
| **故事板端点** | 常规端点 + 特殊格式 | 专用端点 |
| **查询参数** | `/{taskId}` | `?id=taskId` |
| **响应格式** | `{task_id}` | `{id}` |

### 选择建议

**选择贞贞平台**:
- ✅ 需要 HD 高清画质
- ✅ 需要长视频（25秒）
- ✅ 商业广告制作
- ✅ 专业短片创作

**选择聚鑫平台**:
- ✅ 快速生成（无需选择模型）
- ✅ 基础质量要求
- ✅ 成本敏感场景

---

## 参考文档

- `references/api-features.md` - API 功能详细说明
- `references/advanced-features.md` - 高级功能详细说明
- `../penguin-nodes-guide/SKILL.md` - Penguin 节点复用指南

---

## API 技术指导 ⭐ 重要

> **说明**: 本章节提供完整的 API 技术指导，包含端点、参数、代码示例。

---

### API 基础信息

**Base URL**: `https://ai.t8star.cn`

**认证方式**: Bearer Token
```javascript
headers: {
  'Authorization': 'Bearer YOUR_API_KEY',
  'Content-Type': 'application/json'
}
```

---

### 1. 文生视频 API ⭐ 核心端点

**端点**: `POST /v2/videos/generations`

**请求格式**: `application/json`

**请求参数**:
```javascript
{
  "model": "sora-2",              // 模型：sora-2 或 sora-2-pro
  "prompt": "一只可爱的猫咪",      // 提示词
  "duration": "10",                // 时长："10", "15", "25"（字符串）
  "aspect_ratio": "16:9",          // 比例："16:9"（横屏）或 "9:16"（竖屏）
  "hd": false,                     // HD 高清（仅 sora-2-pro 支持）
  "watermark": false,              // 是否添加水印（可选）
  "private": false                 // 是否隐藏视频（可选）
}
```

**完整代码示例**:
```javascript
const response = await fetch('https://ai.t8star.cn/v2/videos/generations', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'sora-2',
    prompt: '@ebfb9a758.sunnykitte 在海边玩耍',
    duration: '10',
    aspect_ratio: '16:9',
    hd: false,
    watermark: false
  })
});

const result = await response.json();
// 返回格式: { task_id: "f0aa213c-c09e-4e19-a0e5-c698fe48acf1" }
```

**关键点**:
- ⚠️ **duration 类型**: 字符串类型（`"10"`），不是数字（`10`）
- ⚠️ **模型选择**: `sora-2`（基础）或 `sora-2-pro`（高级）
- ⚠️ **HD 限制**: 只有 `sora-2-pro` 支持 `hd: true`
- ⚠️ **25秒视频**: 只有 `sora-2-pro` 支持 `duration: "25"`

---

### 2. 图生视频 API ⭐ 核心端点

**端点**: `POST /v2/videos/generations`

**请求格式**: `application/json`

**请求参数**:
```javascript
{
  "model": "sora-2",
  "prompt": "@ebfb9a758.sunnykitte 在火山场景中玩耍",
  "duration": "10",
  "aspect_ratio": "16:9",
  "hd": false,
  "images": ["https://example.com/volcano.jpg"],  // ⭐ 图片数组
  "watermark": false
}
```

**完整代码示例**:
```javascript
const response = await fetch('https://ai.t8star.cn/v2/videos/generations', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'sora-2',
    prompt: '卡通火山场景，火山口有熔岩流动。@ebfb9a758.sunnykitte 在火山附近作业',
    duration: '10',
    aspect_ratio: '16:9',
    images: ['https://example.com/volcano.jpg']
  })
});

const result = await response.json();
// 返回格式: { task_id: "f0aa213c-c09e-4e19-a0e5-c698fe48acf1" }
```

**关键点**:
- ⚠️ **提示词策略**: 描述参考图片内容 + 角色活动
- ⚠️ **images 格式**: 字符串数组，支持 URL 和 base64
- ⚠️ **图片访问速度**: 使用访问速度较快的图片地址

---

### 3. 查询任务状态 API

**端点**: `GET /v2/videos/generations/{task_id}`

**⚠️ 重要**: 使用**路径参数** `/{taskId}`，不是查询参数 `?id=`

**代码示例**:
```javascript
const taskId = 'f0aa213c-c09e-4e19-a0e5-c698fe48acf1';
const response = await fetch(`https://ai.t8star.cn/v2/videos/generations/${taskId}`, {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
});

const result = await response.json();
// 返回格式: {
//   task_id: "xxx",
//   status: "SUCCESS",  // NOT_START | IN_PROGRESS | SUCCESS | FAILURE
//   progress: 100,
//   data: { output: "https://filesystem.site/cdn/..." }
// }
```

**状态枚举**:
| 状态 | 说明 |
|------|------|
| `NOT_START` | 未开始 |
| `IN_PROGRESS` | 正在执行 |
| `SUCCESS` | 执行完成 |
| `FAILURE` | 失败 |

**轮询策略**:
```javascript
// ⭐ 推荐：30 秒轮询间隔（避免 429 错误）
const POLL_INTERVAL = 30000;  // 30 秒

const pollTask = async (taskId) => {
  while (true) {
    const response = await fetch(`https://ai.t8star.cn/v2/videos/generations/${taskId}`);
    const result = await response.json();

    if (result.status === 'SUCCESS') {
      return result.data.output;
    }

    if (result.status === 'FAILURE') {
      throw new Error(result.fail_reason || '任务失败');
    }

    await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL));
  }
};
```

---

### 4. 创建角色 API ⭐ 核心端点

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
const response = await fetch('https://ai.t8star.cn/sora/v1/characters', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    from_task: 'video_637efe22-3b6a-47ad-ab02-ee01a686a0bd',
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

// ⚠️ 重要：角色引用和提示词之间需要空格
// 正确: "@username 在海边玩耍"
// 错误: "@username在海边玩耍"
```

---

### 5. 故事板 API ⭐ 特殊格式

**端点**: `POST /v2/videos/generations`

**⚠️ 重要**: 贞贞平台**没有专用故事板端点**，使用常规视频端点 + 特殊提示词格式

**请求格式**: `application/json`

**提示词格式**（多镜头拼接）:
```javascript
const prompt = `Shot 1:
duration: 7.5sec
Scene: 飞机起飞

Shot 2:
duration: 7.5sec
Scene: 飞机降落`;

// ⚠️ 注意：
// 1. 每个镜头使用 "Shot N:" 开头
// 2. 指定时长：duration: Xsec
// 3. 描述场景：Scene: XXX
// 4. 镜头之间用空行分隔
```

**完整代码示例**:
```javascript
const shots = [
  { duration: '5sec', scene: '老鹰展翅高飞' },
  { duration: '5sec', scene: '老鹰在空中盘旋' },
  { duration: '5sec', scene: '老鹰俯冲捕捉猎物' }
];

// 拼接为故事板格式
const prompt = shots.map((shot, index) =>
  `Shot ${index + 1}:\nduration: ${shot.duration}\nScene: ${shot.scene}`
).join('\n\n');

const response = await fetch('https://ai.t8star.cn/v2/videos/generations', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'sora-2',
    prompt: prompt,      // ⭐ 故事板格式的提示词
    duration: '15',      // 总时长（所有镜头之和）
    aspect_ratio: '16:9',
    hd: false,
    watermark: false
  })
});

const result = await response.json();
// 返回格式: { task_id: "xxx", status: "queued" }
```

**关键差异**（贞贞 vs 聚鑫）:
| 特性 | 贞贞 | 聚鑫 |
|------|------|------|
| **端点** | `/v2/videos/generations` | `/v1/videos` |
| **格式** | `application/json` | `multipart/form-data` |
| **提示词** | 多行文本格式 | 字符串数组格式 |
| **时长参数** | `duration: "15"` | `seconds: "15"` |
| **比例参数** | `aspect_ratio: "16:9"` | `size: "16x9"` |

---

### 6. 高级功能：HD 高清模式

**功能描述**: `sora-2-pro` 模型支持 HD 高清画质

**启用条件**:
- 模型必须选择 `sora-2-pro`
- 画面比例必须是 16:9（横屏）
- 视频时长支持 25 秒

**代码示例**:
```javascript
const response = await fetch('https://ai.t8star.cn/v2/videos/generations', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'sora-2-pro',    // ⭐ 必须使用 pro 模型
    prompt: '专业产品视频',
    duration: '15',
    aspect_ratio: '16:9',  // ⭐ HD 只支持横屏
    hd: true,              // ⭐ 启用 HD 高清
    watermark: false
  })
});
```

**关键约束**:
- ⚠️ **HD 只支持 16:9 横屏**，9:16 竖屏不支持 HD
- ⚠️ **25 秒视频不支持 HD**，当 `duration: "25"` 时，HD 参数不起作用

---

### 7. 高级功能：25秒长视频

**功能描述**: `sora-2-pro` 模型支持 25 秒长视频

**时长对比**:
| 模型 | 支持时长 |
|------|---------|
| sora-2 | 10秒、15秒 |
| sora-2-pro | 10秒、15秒、**25秒** |

**代码示例**:
```javascript
const response = await fetch('https://ai.t8star.cn/v2/videos/generations', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'sora-2-pro',    // ⭐ 必须使用 pro 模型
    prompt: '讲述完整故事的视频',
    duration: '25',        // ⭐ 25 秒长视频
    aspect_ratio: '16:9',
    hd: false,            // ⚠️ 25 秒不支持 HD
    watermark: false
  })
});
```

---

**文档版本**: v1.1
**创建日期**: 2026-01-21
**更新日期**: 2026-01-21（添加完整 API 技术指导）
**维护者**: WinJin 开发团队
