---
name: penguin-nodes-guide
description: Penguin-Magic 节点复用指南。当需要了解如何使用 Penguin-Magic 现有节点实现 WinJin 功能时使用此 skill。
---

# Penguin-Magic 节点复用指南

> **重要**: 这是一份需求说明书，不是技术文档。
> **目的**: 说明如何使用 Penguin-Magic 现有节点实现 WinJin 功能，而不是指导如何开发新节点。

---

## 快速开始

Penguin-Magic 已经实现了 **90% 的 WinJin Sora2 功能**！

✅ **可以直接复用的节点**：
- 文生视频、图生视频、批量生成
- 角色创建、角色库管理
- 提示词优化
- 双平台支持（聚鑫/贞贞）

❌ **需要补充的功能**：
- 故事板功能（多镜头视频制作）
- 旁白处理工作流（可用 text + llm 节点组合替代）

---

## 现有节点清单

### Sora2 专用节点（8个）

| 节点类型 | 节点名称 | 功能描述 | 状态 |
|---------|---------|---------|------|
| `sora2-api-config` | API 配置节点 | 配置聚鑫/贞贞平台的 API Key 和模型 | ✅ 可用 |
| `sora2-character-lib` | 角色库节点 | 管理和选择角色 | ✅ 可用 |
| `sora2-video-generate` | 视频生成节点 | 文生视频、图生视频 | ✅ 可用 |
| `sora2-task-result` | 任务结果节点 | 显示视频生成进度和结果 | ✅ 可用 |
| `sora2-reference-image` | 参考图节点 | 上传和选择参考图片 | ✅ 可用 |
| `sora2-batch-video` | 批量生成节点 | 多提示词批量生成视频 | ✅ 可用 |
| `sora2-prompt-optimizer` | 提示词优化节点 | 使用 OpenAI API 优化提示词 | ✅ 可用 |
| `sora2-character-create` | 角色创建节点 | 从视频创建角色 | ✅ 可用 |

### 基础节点（可复用于 WinJin 工作流）

| 节点类型 | 节点名称 | 功能描述 | 在 WinJin 中的替代 |
|---------|---------|---------|-----------------|
| `text` | 文本节点 | 输入文本内容 | NarratorNode（旁白输入） |
| `llm` | LLM 节点 | 调用大语言模型 | PromptOptimizerNode（部分功能） |
| `image` | 图片节点 | 图片生成和管理 | ReferenceImageNode（部分功能） |
| `video-output` | 视频输出节点 | 视频结果展示 | TaskResultNode（部分功能） |

---

## 功能映射表

### WinJin 功能 → Penguin 节点映射

| WinJin 功能 | Penguin 节点 | 复用方式 | 状态 |
|------------|-------------|---------|------|
| **文生视频** | `sora2-video-generate` | 直接使用 | ✅ 完全复用 |
| **图生视频** | `sora2-reference-image` + `sora2-video-generate` | 节点组合 | ✅ 完全复用 |
| **批量生成** | `sora2-batch-video` | 直接使用 | ✅ 完全复用 |
| **角色创建** | `sora2-character-create` | 直接使用 | ✅ 完全复用 |
| **角色管理** | `sora2-character-lib` | 直接使用 | ✅ 完全复用 |
| **角色引用** | `sora2-video-generate` 的 @username 语法 | 内置功能 | ✅ 完全复用 |
| **提示词优化** | `sora2-prompt-optimizer` | 直接使用 | ✅ 完全复用 |
| **旁白输入** | `text` 节点 | 替代方案 | ✅ 功能等效 |
| **任务结果** | `sora2-task-result` | 直接使用 | ✅ 完全复用 |
| **API 配置** | `sora2-api-config` | 直接使用 | ✅ 完全复用 |
| **双平台支持** | `sora2-api-config` 的平台选择 | 内置功能 | ✅ 完全复用 |
| **故事板** | ❓ 待确认 | 需要新增 | ❌ 需要补充 |

### 关键发现

1. **核心视频功能 100% 复用**
   - 单个视频生成、批量生成、图生视频都已实现
   - 无需任何开发，直接使用现有节点

2. **角色系统 100% 复用**
   - 角色创建、管理、引用功能完整
   - 双显示功能（别名/真实ID）已实现

3. **旁白处理可用 text + llm 节点替代**
   - WinJin 的 NarratorNode 可以用 `text` 节点替代
   - WinJin 的 NarratorProcessorNode 可以用 `llm` 节点替代
   - 工作流略微不同，但功能等效

4. **故事板功能待确认**
   - 需要进一步探索是否已实现
   - 可能是唯一需要新增的功能

---

## 工作流组合方案

### 1. 简单文生视频工作流

**目标**: 输入提示词生成单个视频

**节点组合**:
```
sora2-api-config (API 配置)
    ↓
sora2-video-generate (视频生成)
    ↓
sora2-task-result (任务结果)
```

**步骤**:
1. 添加 `sora2-api-config` 节点，配置 API Key 和平台
2. 添加 `sora2-video-generate` 节点，输入提示词
3. 添加 `sora2-task-result` 节点，查看生成进度和结果
4. 连接节点：API 配置 → 视频生成 → 任务结果

---

### 2. 图生视频工作流

**目标**: 基于参考图片生成视频

**节点组合**:
```
sora2-api-config (API 配置)
    ↓
sora2-reference-image (参考图)
    ↓
sora2-video-generate (视频生成)
    ↓
sora2-task-result (任务结果)
```

**步骤**:
1. 添加 `sora2-api-config` 节点配置 API
2. 添加 `sora2-reference-image` 节点上传参考图片
3. 添加 `sora2-video-generate` 节点，在提示词中描述图片内容
4. 连接节点：参考图 → 视频生成（自动传递图片）

---

### 3. 角色创建和引用工作流

**目标**: 从视频提取角色，并在新视频中使用角色

**节点组合**:
```
sora2-api-config (API 配置)
    ↓
sora2-character-create (角色创建)
    ↓
sora2-character-lib (角色库)
    ↓
sora2-video-generate (使用 @username 引用角色)
    ↓
sora2-task-result (任务结果)
```

**步骤**:
1. 生成视频后，使用 `sora2-character-create` 从视频提取角色
2. 角色保存到 `sora2-character-lib` 角色库
3. 在 `sora2-video-generate` 中使用 `@username` 语法引用角色
4. 生成新视频时，角色会自动出现在视频中

**角色引用语法**:
- 输入框显示：`@阳光小猫`（别名）
- 内部存储：`@ebfb9a758.sunnykitte`（真实ID）
- API 使用：真实ID

---

### 4. 动画绘本工作流（text + llm 节点组合）

**目标**: 从文本旁白生成系列动画视频

**节点组合**:
```
text 节点（旁白输入）
    ↓
llm 节点（旁白优化）
    ↓
sora2-prompt-optimizer（提示词优化）
    ↓
sora2-batch-video（批量生成）
    ↓
sora2-task-result（任务结果）
```

**步骤**:
1. 使用 `text` 节点输入旁白文本（每行一句话）
2. 使用 `llm` 节点逐句优化为详细提示词
3. 使用 `sora2-prompt-optimizer` 进一步优化（可选）
4. 使用 `sora2-batch-video` 批量生成多个视频
5. 使用 `sora2-task-result` 查看所有视频结果

**与 WinJin 的差异**:
- WinJin 使用 NarratorNode + NarratorProcessorNode（专用节点）
- Penguin 使用通用的 `text` + `llm` 节点组合
- 功能等效，但节点更通用

---

### 5. 提示词优化工作流

**目标**: 使用 AI 优化提示词质量

**节点组合**:
```
text 节点（简单描述）
    ↓
sora2-prompt-optimizer（OpenAI 优化）
    ↓
sora2-video-generate（生成视频）
```

**步骤**:
1. 使用 `text` 节点输入简单描述
2. 使用 `sora2-prompt-optimizer` 优化为详细提示词
3. 使用优化后的提示词生成视频

**优化风格**:
- picture-book（动画绘本）
- animation（动画风格）
- cinematic（电影风格）
- documentary（纪录片风格）

---

## 复用策略

### ✅ 可以直接复用的功能

1. **核心视频生成功能**
   - 文生视频、图生视频、批量生成
   - 使用 `sora2-video-generate` 和 `sora2-batch-video` 节点

2. **角色系统功能**
   - 角色创建、管理、引用
   - 使用 `sora2-character-create` 和 `sora2-character-lib` 节点

3. **提示词优化功能**
   - OpenAI API 优化
   - 使用 `sora2-prompt-optimizer` 节点

4. **双平台支持**
   - 聚鑫/贞贞平台切换
   - 使用 `sora2-api-config` 节点配置

### ⚠️ 需要适配的功能

1. **旁白处理工作流**
   - WinJin: NarratorNode + NarratorProcessorNode（专用节点）
   - Penguin: `text` + `llm` 节点（通用节点组合）
   - 功能等效，但工作流略微不同

### ❌ 需要新增的功能

1. **故事板功能**（待确认）
   - 多镜头视频制作
   - 镜头管理（添加/删除/编辑）
   - 参考图支持（全局 + 镜头图片）
   - 可能需要开发新节点

---

## 验收标准

### 功能完整性

- [ ] 所有 8 个 Sora2 节点正常工作
- [ ] 节点之间可以正常连接
- [ ] 文生视频、图生视频功能正常
- [ ] 角色创建和引用功能正常
- [ ] 批量生成功能正常
- [ ] 提示词优化功能正常

### 工作流可用性

- [ ] 简单文生视频工作流可用
- [ ] 图生视频工作流可用
- [ ] 角色创建和引用工作流可用
- [ ] 动画绘本工作流可用（text + llm 组合）
- [ ] 提示词优化工作流可用

### 双平台支持

- [ ] 聚鑫平台功能正常
- [ ] 贞贞平台功能正常
- [ ] 平台切换功能正常
- [ ] 角色跨平台通用

---

## 参考文档

- `references/existing-nodes.md` - 现有节点详细列表
- `references/workflow-combinations.md` - 工作流组合方案
- `../juxin-platform/SKILL.md` - 聚鑫平台功能需求
- `../zhenzhen-platform/SKILL.md` - 贞贞平台功能需求

---

**文档版本**: v1.0
**创建日期**: 2026-01-21
**维护者**: WinJin 开发团队
