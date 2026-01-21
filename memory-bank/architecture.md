# Penguin-Magic 项目架构

> **项目名称**: 企鹅工坊（Penguin-Magic）
> **创建日期**: 2026-01-21
> **最后更新**: 2026-01-21

---

## 1. 项目概述

**企鹅工坊** 是一个基于 ComfyUI 的视频生成工作流平台。

### 核心功能

- Sora2 视频生成（文生视频、图生视频）
- 角色创建和管理
- 提示词优化
- LLM Chat 对话
- 双平台支持（贞贞/聚鑫）

### 技术栈

- **前端**: React + TypeScript
- **后端**: Node.js
- **UI框架**: ComfyUI
- **AI模型**: GLM-4.7、Sora-2-all、Gemini

---

## 2. 目录结构

```
Penguin-Magic/
├── memory-bank/              # AI 记忆库（核心）
│   ├── product-requirements.md   # 产品需求文档
│   ├── tech-stack.md             # 技术栈文档
│   ├── implementation-plan.md    # 实施计划
│   ├── progress.md               # 开发进度
│   └── architecture.md           # 项目架构（本文档）
│
├── .dev-docs/                # 开发文档参考
│   └── vibe-coding-cn-main/  # Vibe Coding 模板
│   └── 可能会用到的skill/    # 技能文档
│
├── src/                      # 源代码
│   ├── components/           # React 组件
│   │   └── nodes/           # ComfyUI 节点
│   │       ├── llm/        # LLM 节点
│   │       │   ├── gemini.ts   # Gemini 节点（现有）
│   │       │   └── glm.ts      # GLM 节点（待开发）
│   │       └── sora2/      # Sora2 节点（现有）
│   │           ├── api-config.ts
│   │           ├── character-lib.ts
│   │           ├── video-generate.ts
│   │           ├── task-result.ts
│   │           ├── reference-image.ts
│   │           ├── batch-video.ts
│   │           ├── prompt-optimizer.ts
│   │           └── character-create.ts
│   ├── services/            # 服务层
│   │   └── api/            # API 调用
│   │       ├── gemini.ts   # Gemini API（现有）
│   │       ├── glm.ts      # GLM API（待开发）
│   │       ├── juxin.ts    # 聚鑫 API（待开发）
│   │       └── zhenzhen.ts # 贞贞 API（现有）
│   ├── types/              # TypeScript 类型
│   └── constants/          # 常量定义
│
├── docs/                    # 项目文档
│   └── TEST_REPORT.md      # 测试报告
│
└── package.json
```

---

## 3. 核心模块

### 3.1 LLM 节点模块

**位置**: `src/components/nodes/llm/`

**现有节点**:
- `gemini.ts` - Gemini 模型节点（用于 Chat 和提示词优化）

**待开发节点**:
- `glm.ts` - GLM 编程套餐节点

**功能**:
- Chat 对话
- 提示词生成
- 提示词优化
- 流式响应
- 多轮对话

---

### 3.2 Sora2 节点模块

**位置**: `src/components/nodes/sora2/`

**现有节点**（8个）:

| 文件 | 节点类型 | 功能描述 |
|------|----------|----------|
| `api-config.ts` | `sora2-api-config` | API 配置节点（贞贞/聚鑫切换） |
| `character-lib.ts` | `sora2-character-lib` | 角色库管理 |
| `video-generate.ts` | `sora2-video-generate` | 视频生成（文生/图生） |
| `task-result.ts` | `sora2-task-result` | 任务结果展示 |
| `reference-image.ts` | `sora2-reference-image` | 参考图上传 |
| `batch-video.ts` | `sora2-batch-video` | 批量视频生成 |
| `prompt-optimizer.ts` | `sora2-prompt-optimizer` | 提示词优化 |
| `character-create.ts` | `sora2-character-create` | 角色创建 |

**节点特性**:
- 支持 `@username` 语法引用角色
- 双平台切换（贞贞/聚鑫）
- 30秒轮询间隔（避免429错误）

**复用策略**:
- 聚鑫平台 90% 功能可直接复用现有节点
- 只需修改 API 端点和参数格式
- 通过配置切换平台

---

### 3.3 API 服务模块

**位置**: `src/services/api/`

**现有服务**:
- `gemini.ts` - Gemini API
- `zhenzhen.ts` - 贞贞平台 API

**待开发服务**:
- `glm.ts` - GLM 编程套餐 API
- `juxin.ts` - 聚鑫平台 API

---

## 4. 数据流

### 4.1 GLM Chat 流程

```
用户输入消息
    ↓
GLM 节点
    ↓
GLM API 服务
    ↓
流式返回响应
    ↓
显示对话结果
```

### 4.2 视频生成流程（聚鑫/贞贞）

```
用户输入提示词
    ↓
API 配置节点（选择平台）
    ↓
视频生成节点
    ↓
任务结果节点（轮询进度）
    ↓
显示视频结果
```

### 4.3 角色创建和引用流程

```
生成视频
    ↓
角色创建节点（提取角色）
    ↓
角色库节点（保存角色）
    ↓
视频生成节点（@username 引用）
    ↓
生成新视频（角色一致）
```

---

## 5. API 规范

### 5.1 聚鑫平台

**Base URL**: `https://api.jxincm.cn`

| 端点 | 方法 | 功能 |
|------|------|------|
| `/v1/video/create` | POST | 创建视频 |
| `/v1/video/query?id={taskId}` | GET | 查询任务 |
| `/sora/v1/characters` | POST | 创建角色 |
| `/v1/videos` | POST | 故事板 |

**模型**: `sora-2-all`（唯一支持）

**轮询**: 30 秒间隔

### 5.2 GLM 编程套餐

**Base URL**: `https://open.bigmodel.cn/api/coding/paas/v4`

| 端点 | 方法 | 功能 |
|------|------|------|
| `/chat/completions` | POST | 对话 |

**协议**: OpenAI 兼容

**模型**: glm-4.7 / glm-4.6 / glm-4.5-air

---

## 6. 平台差异

| 特性 | 聚鑫 | 贞贞 |
|------|------|------|
| 模型 | sora-2-all（单一） | sora-2 / sora-2-pro |
| 视频时长 | 10秒、15秒 | 10秒、15秒、25秒（pro） |
| HD 模式 | 不支持 | 支持（sora-2-pro） |
| 查询端点 | `?id={taskId}` | `/{taskId}` |
| 响应格式 | `{id}` | `{task_id}` |
| 轮询间隔 | 30秒 | 根据实际情况 |

---

## 7. 更新日志

| 日期 | 更新内容 | 更新人 |
|------|----------|--------|
| 2026-01-21 | 创建文档 | AI |

---

**文档版本**: v1.0
**创建日期**: 2026-01-21
**维护者**: Penguin-Magic 开发团队
