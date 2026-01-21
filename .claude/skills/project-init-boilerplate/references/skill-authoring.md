# Skill Authoring Best Practices

参考官方文档: https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices.md

---

## Table of Contents

1. [Core Principles](#core-principles)
2. [Privacy and Path References](#privacy-and-path-references)
3. [Versioning](#versioning)
4. [Writing Style](#writing-style)
5. [Progressive Disclosure](#progressive-disclosure)
6. [Reference File Naming](#reference-file-naming)
7. [Token Budget](#token-budget)
8. [Naming Conventions](#naming-conventions)
9. [Description Format](#description-format)
10. [Checklist Pattern](#checklist-pattern)
11. [Creation Workflow](#creation-workflow)

---

## Core Principles

Skills should be:
- **Reusable** across multiple projects and contexts
- **Privacy-aware** with no user/company-specific information
- **Well-structured** following progressive disclosure principles
- **Clearly documented** with reproducible examples

---

## Privacy and Path References

**CRITICAL**: 公开分发的 Skills 必须不包含用户特定或公司特定信息

### 禁止

- 绝对路径到用户目录 (`/home/username/`, `/Users/username/`, `D:\user\username\`)
- 个人用户名、公司名、产品名
- 硬编码的 skill 安装路径 (`~/.claude/skills/`, `skills/claude-skills/`)
- OneDrive 路径、云存储路径

### 允许

- skill bundle 内的相对路径 (`scripts/example.py`, `references/guide.md`)
- 标准占位符 (`~/workspace/project`, `username`, `your-company`)

### Example

```yaml
# ❌ 错误 - 包含绝对路径
Validation Commands: ./skills/claude-skills/scripts/validate-skill.sh

# ✅ 正确 - 使用相对路径
Validation Commands: scripts/validate.sh

# ❌ 错误 - 包含用户名
Copy files to /home/john Doe/projects/

# ✅ 正确 - 使用占位符
Copy files to ~/workspace/project/
```

---

## Versioning

### 禁止

SKILL.md 中包含版本历史或版本号

### 正确位置

版本由 marketplace.json 管理（公开发布的 skills）

### 允许的位置

- README.md 可以包含版本信息（面向用户的文档）
- references/ 文件可以包含 `**Last updated**: YYYY-MM-DD` 作为文档元信息

### Example

```yaml
# ❌ 错误 - SKILL.md 中的版本部分
## Version
Current: 1.0.0
Updated: 2026-01-21

# ✅ 正确 - README.md 中的版本
# Project Init Boilerplate
**Version**: 1.0.0
**Last Updated**: 2026-01-21
```

---

## Writing Style

### 使用命令式/不定式形式

- ✅ "To accomplish X, do Y"
- ✅ "Run `npm install` to install dependencies"
- ❌ "You should do X"
- ❌ "If you need to do X"

### 第三人称描述

description 应使用第三人称：

```yaml
# ✅ 正确
description: "Analyzes code structure and generates documentation"

# ❌ 错误
description: "I will analyze your code and generate docs"
```

### 清晰的可执行指令

```markdown
# ✅ 正确
To verify the skill:
1. Check SKILL.md syntax
2. Verify name matches directory
3. Test with trigger phrase

# ❌ 错误
You should check the syntax first, then verify the name matches
```

---

## Progressive Disclosure

三层加载系统：

### Layer 1: Metadata (始终在上下文中)

- `name` - 技能标识符
- `description` - 简短描述（包含做什么和何时使用）

### Layer 2: SKILL.md body (Skill 触发时加载)

- Quick Reference patterns
- Examples
- Core instructions

### Layer 3: Bundled resources (按需加载)

- `references/` 详细文档
- `assets/` 模板文件
- `scripts/` 辅助脚本

### Token Budget 建议

| Component | Recommended Limit |
|-----------|-------------------|
| SKILL.md body | < 500 lines |
| description | < 1024 characters |
| Quick Reference | < 20 patterns |
| Examples | >= 3 reproducible |

---

## Reference File Naming

文件名必须自解释：

### 模式

`<content-type>_<specificity>.md`

### 示例

| ✅ Good | ❌ Bad |
|---------|--------|
| `api_endpoints.md` | `reference.md` |
| `database_schema.md` | `docs.md` |
| `mcp_servers.md` | `info.md` |
| `quality_checklist.md` | `checklist.md` |

### 从 SKILL.md 链接

```markdown
## References

### Local Documentation

- `references/index.md` - Navigation index
- `references/mcp-servers.md` - MCP server configuration
- `references/documentation.md` - Documentation templates
- `references/knowledge-base.md` - Knowledge base patterns
- `references/quality-checklist.md` - Quality validation
- `references/skill-authoring.md` - Skill creation best practices
```

---

## Token Budget

### SKILL.md 行数限制

- 推荐最大: 500 行
- 当前: ~465 行 ✅

### 长内容拆分

将长内容拆分到 `references/`：

```markdown
# SKILL.md (keep short)

## References

Detailed guides available in `references/`:
- `references/mcp-servers.md` - 800 lines
- `references/documentation.md` - 600 lines
- `references/knowledge-base.md` - 500 lines
```

### Examples 数量

- 推荐最少: 3 个可复现示例
- 当前: 8 个示例 ✅

---

## Naming Conventions

### Skill 名称格式

**推荐**: 动名词形式 (gerund form)

- `processing-pdfs`
- `analyzing-spreadsheets`
- `testing-code`

**可接受**: 名词短语

- `pdf-processing`
- `spreadsheet-analysis`
- `project-init-boilerplate` (当前)

### 正则表达式

```regex
^[a-z][a-z0-9-]*$
```

- 必须以小写字母开头
- 只包含小写字母、数字、连字符
- 必须与目录名称匹配

---

## Description Format

### 要求

- 使用第三人称 (third person)
- 包含"做什么"和"何时使用"
- 最大 1024 字符
- 不能包含 XML 标签

### 示例

```yaml
# ✅ 正确 - 第三人称，包含做什么和何时使用
description: "Initializes AI-assisted development environment for projects. Configures MCP servers, generates documentation system, sets up knowledge base, and establishes development standards. Use when starting new projects, adding AI capabilities to existing repositories, or user says '帮我初始化项目', 'setup project', '配置 MCP'."

# ❌ 错误 - 第二人称
description: "I will help you initialize your project with AI capabilities..."

# ❌ 错误 - 缺少何时使用
description: "Initializes AI-assisted development environment for projects."
```

---

## Checklist Pattern

对于复杂工作流，使用明确的 checklist 模式：

### 示例

```markdown
### Pattern 1: One-Command Initialization

```bash
say "帮我初始化项目"
```

**Initialization checklist** (copy and track progress):
```
Project Initialization Progress:
- [ ] Step 1: Analyze project structure
- [ ] Step 2: Create MCP configuration
- [ ] Step 3: Generate documentation
- [ ] Step 4: Initialize knowledge base
- [ ] Step 5: Configure development standards
```
```

---

## Creation Workflow

### 1. 理解具体使用示例

收集真实的用户交互示例，了解 skill 应该解决的具体问题。

### 2. 规划可复用内容

- 识别可复用的模式
- 规划 progressive disclosure 结构
- 确定 reference 文件需求

### 3. 初始化 Skill 目录结构

```bash
.claude/skills/your-skill-name/
├── SKILL.md           # Main skill file
├── README.md          # User-facing documentation
├── references/        # Detailed reference materials
│   ├── index.md       # Navigation index
│   └── *.md           # Reference documents
├── assets/            # Templates and resources
│   ├── template.json
│   └── example.txt
└── scripts/           # Optional helper scripts
    └── validate.sh
```

### 4. 编辑 Skill 内容

- 编写 SKILL.md（遵循最佳实践）
- 创建 reference 文档
- 添加示例和模式

### 5. 安全审查

- 检查隐私和路径问题
- 验证无硬编码用户信息
- 确认没有版本号在 SKILL.md 中
- 验证 writing style

### 6. 打包分发

- 验证所有文件存在
- 测试 skill 功能
- 创建 git commit

---

## Quality Checklist

使用此清单验证你的 skill：

### Structure

- [ ] Directory name matches `name` in frontmatter
- [ ] `name` uses only lowercase, numbers, hyphens
- [ ] `description` < 1024 characters, third person
- [ ] SKILL.md body < 500 lines

### Content

- [ ] "When to Use This Skill" has decidable triggers
- [ ] "Not For / Boundaries" reduces misfires
- [ ] Quick Reference <= 20 patterns
- [ ] >= 3 reproducible examples

### References

- [ ] Long content split into `references/`
- [ ] All references linked from SKILL.md exist
- [ ] Reference files use descriptive names
- [ ] `references/index.md` provides navigation

### Privacy

- [ ] No absolute paths to user directories
- [ ] No hardcoded `~/.claude/skills/` paths
- [ ] No personal usernames or company names
- [ ] Only relative paths within skill bundle

### Versioning

- [ ] No version sections in SKILL.md
- [ ] No version numbers in SKILL.md body
- [ ] README.md may contain version info

### Style

- [ ] Uses imperative/infinitive form
- [ ] Third person perspective in description
- [ ] Clear, actionable instructions

---

## Related Resources

- [Official Skills Best Practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices.md)
- [skill-creator Skill](https://github.com/leon30083/Penguin-Magic/tree/main/.claude/skills/skill-creator) - Interactive skill creation guide

---

**Last Updated**: 2026-01-21
