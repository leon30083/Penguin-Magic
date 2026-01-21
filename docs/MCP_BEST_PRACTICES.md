# 企鹅工坊 MCP 最佳实践

> **版本**: 1.0.0
> **更新日期**: 2026-01-21
> **适用项目**: Penguin-Magic (企鹅工坊)

---

## 目录

1. [MCP 使用原则](#一mcp-使用原则)
2. [各 MCP 最佳实践](#二各-mcp-最佳实践)
3. [组合使用模式](#三组合使用模式)
4. [性能优化](#四性能优化)
5. [常见问题](#五常见问题)

---

## 一、MCP 使用原则

### 1.1 核心原则

| 原则 | 说明 |
|------|------|
| **优先查询** | 使用前先搜索已有知识，避免重复劳动 |
| **适度使用** | 不滥用 MCP，简单任务直接解决 |
| **结果验证** | MCP 结果需人工验证，不可盲目信任 |
| **知识沉淀** | 有价值的知识及时存入 Memory MCP |

### 1.2 选择决策树

```
需要查询信息？
├─ 项目内部知识？
│  └─ 是 → Memory MCP (search_nodes)
│  └─ 否 → 继续
├─ 需要代码示例？
│  └─ 是 → GitHub MCP (search_code)
│  └─ 否 → 继续
├─ 需要最新文档？
│  └─ 是 → Context7 MCP (query-docs)
│  └─ 否 → 继续
├─ 需要联网搜索？
│  └─ 是 → Web Search Prime MCP
│  └─ 否 → Web Reader MCP (读取特定网页)
```

---

## 二、各 MCP 最佳实践

### 2.1 Memory MCP 最佳实践

#### DO - 推荐做法

```typescript
// ✅ 创建有意义的实体
{
  "name": "缩略图生成方案",
  "entityType": "解决方案",
  "observations": [
    "问题: 大图加载慢",
    "方案: Sharp 生成 160px 宽度缩略图",
    "位置: backend-nodejs/src/routes/files.js"
  ]
}

// ✅ 建立清晰的关系
{
  "from": "App.tsx",
  "to": "Desktop.tsx",
  "relationType": "导入并渲染"
}

// ✅ 定期更新知识
mcp__memory__add_observations({
  "observations": [{
    "entityName": "缩略图生成方案",
    "contents": ["更新: 新增 WebP 格式支持"]
  }]
})
```

#### DON'T - 避免做法

```typescript
// ❌ 存储过于琐碎的信息
{
  "name": "某次修改",
  "observations": ["修改了一行代码"] // 价值太低
}

// ❌ 关系类型不清晰
{
  "from": "App.tsx",
  "to": "Desktop.tsx",
  "relationType": "有关系" // 不明确
}
```

#### 最佳实践清单

- [ ] 实体名称具有语义
- [ ] 观察信息有价值
- [ ] 关系类型使用动词短语
- [ ] 定期清理过期信息
- [ ] 关键决策必须记录

### 2.2 GitHub MCP 最佳实践

#### DO - 推荐做法

```typescript
// ✅ 提交前搜索重复
mcp__github__search_issues({
  "query": "拖拽位置计算",
  "state": "OPEN"
})

// ✅ 使用规范的提交信息
{
  "title": "feat(canvas): 添加视频生成节点",
  "body": "## 概述\n...\n\n## 变更\n...\n\n## 测试\n- [x] ..."
}

// ✅ 合理使用标签
{
  "labels": ["bug", "desktop", "priority: high"]
}
```

#### DON'T - 避免做法

```typescript
// ❌ 不搜索直接创建 Issue
// 可能导致重复问题

// ❌ 含糊的标题
{
  "title": "有问题" // 不明确
}

// ❌ 过多标签
{
  "labels": ["bug", "feature", "enhancement", "help", "question", ...]
  // 标签太多失去分类意义
}
```

#### 最佳实践清单

- [ ] 创建 Issue 前先搜索
- [ ] 使用规范的提交格式
- [ ] PR 标题包含类型和范围
- [ ] 合理使用标签 (≤ 5 个)
- [ ] 关联相关 Issue

### 2.3 Context7 MCP 最佳实践

#### DO - 推荐做法

```typescript
// ✅ 先解析库 ID
mcp__context7__resolve-library_id({
  "libraryName": "reactflow",
  "query": "custom nodes with handles"
})

// ✅ 明确的查询问题
{
  "query": "How to create custom nodes with multiple input handles?"
}

// ✅ 指定库 ID
{
  "libraryId": "/xyflow/react",
  "query": "custom node example"
}
```

#### DON'T - 避免做法

```typescript
// ❌ 不解析直接查询
mcp__context7__query_docs({
  "libraryId": "reactflow", // 错误格式
  ...
})

// ❌ 过于宽泛的查询
{
  "query": "react" // 太宽泛
}
```

#### 最佳实践清单

- [ ] 查询前先解析库 ID
- [ ] 问题具体明确
- [ ] 不超过 3 次查询/问题
- [ ] 优先使用已知库 ID

### 2.4 Chrome DevTools MCP 最佳实践

#### DO - 推荐做法

```typescript
// ✅ 按步骤操作
1. navigate_page
2. take_snapshot
3. click/fill
4. take_snapshot (验证)

// ✅ 使用 uid 定位元素
{
  "uid": "submit-button"
}

// ✅ 性能分析有明确目的
{
  "reload": true,
  "autoStop": false
}
```

#### DON'T - 避免做法

```typescript
// ❌ 无验证的操作
click(...)
// 不检查结果

// ❌ 不必要的性能追踪
// 简单操作不需要性能分析
```

#### 最佳实践清单

- [ ] 操作前获取快照
- [ ] 操作后验证结果
- [ ] 使用 uid 而非选择器
- [ ] 性能追踪有明确目的

### 2.5 ZAI MCP 最佳实践

#### DO - 推荐做法

```typescript
// ✅ UI 转代码有明确要求
{
  "output_type": "code",
  "prompt": "转换为 React + TypeScript 组件，遵循企鹅工坊代码风格"
}

// ✅ 错误诊断提供上下文
{
  "context": "在保存创意库时发生",
  "prompt": "分析错误原因并给出解决方案"
}

// ✅ 技术图指定类型
{
  "diagram_type": "architecture",
  "prompt": "分析系统架构和数据流"
}
```

#### DON'T - 避免做法

```typescript
// ❌ 提示不明确
{
  "prompt": "分析这个"
}

// ❌ 用错工具
// 用 ui_to_artifact 分析错误截图
// 应该用 diagnose_error_screenshot
```

#### 最佳实践清单

- [ ] 选择正确的工具类型
- [ ] 提供详细的提示信息
- [ ] 技术图指定 diagram_type
- [ ] 错误诊断提供 context

---

## 三、组合使用模式

### 3.1 新功能开发流程

```
1. Memory MCP: 搜索相关架构知识
   └─ mcp__memory__search_nodes({ query: "Canvas" })

2. Context7 MCP: 查询技术文档
   └─ mcp__context7__query-docs({ libraryId: "/xyflow/react", ... })

3. GitHub MCP: 搜索代码示例
   └─ mcp__github__search_code({ query: "custom node" })

4. 开发实现...

5. Memory MCP: 记录新知识
   └─ mcp__memory__add_observations({ ... })

6. GitHub MCP: 创建 PR
   └─ mcp__github__create_pull_request({ ... })
```

### 3.2 Bug 修复流程

```
1. ZAI MCP: 分析错误截图
   └─ mcp__zai-mcp-server__diagnose_error_screenshot({ ... })

2. Memory MCP: 搜索相关代码知识
   └─ mcp__memory__search_nodes({ query: "error location" })

3. GitHub MCP: 搜索类似问题
   └─ mcp__github__search_issues({ query: "similar error" })

4. Web Search Prime MCP: 搜索解决方案
   └─ mcp__web-search-prime__webSearchPrime({ ... })

5. 修复 Bug...

6. GitHub MCP: 创建/更新 Issue
   └─ mcp__github__issue_write({ method: "update", state: "closed" })
```

### 3.3 UI 开发流程

```
1. 4.5v Image Analysis MCP: 分析设计稿
   └─ mcp__4_5v_mcp__analyze_image({ ... })

2. ZAI MCP: UI 转代码
   └─ mcp__zai-mcp-server__ui_to_artifact({ output_type: "code" })

3. Context7 MCP: 查询组件文档
   └─ mcp__context7__query-docs({ ... })

4. 实现 UI...

5. Chrome DevTools MCP: 自动化测试
   └─ mcp__chrome-devtools__take_snapshot()
```

---

## 四、性能优化

### 4.1 减少不必要的调用

```typescript
// ❌ 重复查询相同内容
mcp__memory__search_nodes({ query: "Canvas" })
mcp__memory__search_nodes({ query: "Canvas" })

// ✅ 缓存结果
const canvasInfo = await mcp__memory__search_nodes({ query: "Canvas" });
// 复用 canvasInfo
```

### 4.2 批量操作

```typescript
// ❌ 逐个创建实体
for (const entity of entities) {
  await mcp__memory__create_entities({ entities: [entity] });
}

// ✅ 批量创建
await mcp__memory__create_entities({ entities });
```

### 4.3 选择合适的工具

```typescript
// ❌ 用 Web Search 查询项目内部问题
mcp__web-search-prime__webSearchPrime({ query: "Penguin-Magic 架构" })

// ✅ 用 Memory 查询
mcp__memory__search_nodes({ query: "架构" })
```

---

## 五、常见问题

### Q1: MCP 调用失败怎么办?

**A**: 检查以下几点:
1. `.claude/mcp_config.json` 配置正确
2. 环境变量已设置 (`GITHUB_TOKEN`)
3. 网络连接正常
4. MCP 服务器依赖已安装 (`npx -y`)

### Q2: 如何选择合适的 MCP 工具?

**A**: 参考决策树:
- 项目知识 → Memory MCP
- 代码示例 → GitHub MCP
- 技术文档 → Context7 MCP
- 最新信息 → Web Search Prime MCP
- UI 开发 → ZAI MCP / 4.5v Image Analysis MCP

### Q3: Memory MCP 存储多少信息合适?

**A**: 存储原则:
- ✅ 架构决策
- ✅ 问题解决方案
- ✅ 关键组件关系
- ❌ 临时调试信息
- ❌ 细节代码实现

### Q4: GitHub MCP 创建 PR 后如何更新?

**A**: 使用 `update_pull_request`:
```typescript
mcp__github__update_pull_request({
  "owner": "leon30083",
  "repo": "Penguin-Magic",
  "pullNumber": 42,
  "body": "更新后的描述"
})
```

### Q5: Context7 查询无结果怎么办?

**A**:
1. 确认库 ID 正确 (使用 `resolve-library-id`)
2. 调整查询问题
3. 尝试 Web Reader MCP 读取在线文档
4. 使用 ZRead MCP 分析开源仓库

---

## 附录

### A. MCP 工具速查表

| 需求 | MCP | 工具 |
|------|-----|------|
| 查架构 | Memory | `search_nodes` |
| 存知识 | Memory | `create_entities` |
| 搜代码 | GitHub | `search_code` |
| 创建 PR | GitHub | `create_pull_request` |
| 查文档 | Context7 | `query-docs` |
| 搜最新 | Web Search Prime | `webSearchPrime` |
| 读网页 | Web Reader | `webReader` |
| UI 转码 | ZAI | `ui_to_artifact` |
| 诊断错 | ZAI | `diagnose_error_screenshot` |
| 自动测 | Chrome DevTools | `take_snapshot` |

### B. 相关文档

- `docs/MCP_USAGE_GUIDE.md` - MCP 使用指南
- `.claude/mcp_config.json` - MCP 配置文件
- `docs/AUTO_DEV_WORKFLOW.md` - 开发流程指南
- `.cursorrules` - 项目编码规则

---

**文档版本**: 1.0.0
**最后更新**: 2026-01-21
