# Penguin-Magic 技术栈

> **项目名称**: 企鹅工坊二次开发
> **创建日期**: 2026-01-21
> **文档类型**: 技术栈说明

---

## 1. 现有技术栈

### 1.1 前端

- **框架**: React 18
- **语言**: TypeScript
- **状态管理**: React Context / Redux
- **UI 框架**: ComfyUI（节点编辑器）

### 1.2 后端

- **运行时**: Node.js
- **语言**: TypeScript
- **API 层**: Express / Fetch API

### 1.3 现有 AI 集成

- **Gemini**: Google Gemini API（用于 Chat 和提示词优化）
- **Sora2**: 贞贞平台（用于视频生成）

---

## 2. 新增技术栈

### 2.1 GLM 编程套餐

**用途**: Chat 对话、提示词生成/优化

**技术选型**:
```typescript
// 使用 @ai-sdk/openai-compatible（Vercel AI SDK）
import { createOpenAI } from '@ai-sdk/openai-compatible';

const glm = createOpenAI({
  baseURL: 'https://open.bigmodel.cn/api/coding/paas/v4',
  apiKey: process.env.GLM_API_KEY,
});
```

**理由**:
- GLM 编程套餐本身就是 OpenAI 兼容协议
- 无需模拟或特殊处理
- 可直接使用 Vercel AI SDK 的 OpenAI 兼容层

**支持的模型**:
- `glm-4.7`: 最强性能（推荐用于代码生成）
- `glm-4.6`: 高性能平衡
- `glm-4.5-air`: 轻量快速

### 2.2 聚鑫平台 Sora-2-all

**用途**: 视频生成、角色创建

**技术选型**: 现有 Fetch API 调用

**理由**:
- 现有代码库已有贞贞平台的完整实现
- 聚鑫与贞贞 API 结构相似
- 可直接复用现有 Sora2 节点（90% 功能）

**关键差异**:
| 特性 | 聚鑫 | 贞贞 |
|------|------|------|
| Base URL | `api.jxincm.cn` | 不同 |
| 模型 | sora-2-all（单一） | sora-2 / sora-2-pro |
| 查询端点 | `?id={taskId}` | `/{taskId}` |
| 响应格式 | `{id}` | `{task_id}` |

---

## 3. 架构设计

### 3.1 模块化设计

```
src/
├── components/
│   └── nodes/
│       ├── llm/              # LLM 节点
│       │   ├── gemini.ts     # 现有
│       │   └── glm.ts        # 新增
│       └── sora2/            # Sora2 节点（现有，可复用）
│           ├── api-config.ts
│           ├── video-generate.ts
│           └── ...
├── services/
│   └── api/
│       ├── gemini.ts         # 现有
│       ├── glm.ts            # 新增
│       ├── juxin.ts          # 新增（或扩展现有）
│       └── zhenzhen.ts       # 现有
├── types/
│   └── models.ts             # TypeScript 类型定义
└── constants/
    └── platforms.ts          # 平台配置常量
```

### 3.2 代码复用策略

**GLM 节点开发**:
- 参考 `gemini.ts` 的实现
- 复用现有的 UI 组件
- 复用现有的状态管理逻辑

**聚鑫平台接入**:
- 复用现有 8 个 Sora2 节点
- 只需修改 API 端点和参数格式
- 双平台通过配置切换

---

## 4. 开发工具

### 4.1 代码编辑

- **IDE**: VS Code
- **插件**: TypeScript ESLint, Prettier

### 4.2 版本控制

- **工具**: Git
- **工作流**: 小步快跑，频繁提交

### 4.3 AI 辅助开发

- **模型**: GLM-4.7
- **上下文**: 200,000 tokens 限制
- **策略**: 分段读取，定期清理

---

## 5. 部署

### 5.1 环境

- **开发环境**: 本地 ComfyUI
- **测试环境**: 本地 ComfyUI
- **生产环境**: 用户本地部署

### 5.2 配置

**环境变量** (`.env`):
```bash
# GLM 编程套餐
GLM_API_KEY=your_api_key_here
GLM_BASE_URL=https://open.bigmodel.cn/api/coding/paas/v4

# 聚鑫平台
JUXIN_API_KEY=your_api_key_here
JUXIN_BASE_URL=https://api.jxincm.cn

# 贞贞平台（现有）
ZHENZHEN_API_KEY=your_api_key_here
```

---

## 6. 测试

### 6.1 单元测试

- 测试 API 调用
- 测试数据转换
- 测试错误处理

### 6.2 集成测试

- 测试 GLM Chat 完整流程
- 测试聚鑫视频生成完整流程
- 测试双平台切换

### 6.3 手动测试

- 使用真实 API Key 测试
- 验证视频生成结果
- 验证角色创建和引用

---

**文档版本**: v1.0
**创建日期**: 2026-01-21
**维护者**: Penguin-Magic 开发团队
