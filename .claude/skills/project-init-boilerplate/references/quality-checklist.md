# Quality Gate Checklist

Validation checklist for ensuring project initialization quality.

---

## Table of Contents

1. [Skill Authoring Best Practices](#skill-authoring-best-practices)
2. [MCP Configuration Validation](#mcp-configuration-validation)
3. [Documentation Completeness](#documentation-completeness)
4. [Knowledge Base Integrity](#knowledge-base-integrity)
5. [Environment Setup](#environment-setup)
6. [Development Standards](#development-standards)
7. [Git Repository](#git-repository)
8. [Final Verification](#final-verification)

---

## Skill Authoring Best Practices

Privacy and path reference checks for skills intended for public distribution.

### Privacy and Path Checks

- [ ] No absolute paths to user directories (`/home/username/`, `/Users/username/`)
- [ ] No hardcoded `~/.claude/skills/` installation paths
- [ ] No personal usernames, company names, or product names
- [ ] Only relative paths within skill bundle (`references/guide.md`)
- [ ] Standard placeholders used where needed (`~/workspace/project`, `username`)

### Versioning Checks

- [ ] No version sections in SKILL.md (`## Version`, `## Changelog`, `## Release History`)
- [ ] No version numbers in SKILL.md body
- [ ] README.md may contain version information (user-facing documentation)
- [ ] Version managed by marketplace.json (for published skills)

### Writing Style Checks

- [ ] Uses imperative/infinitive form ("Do X", not "You should do X")
- [ ] Third person perspective in description
- [ ] Clear, actionable instructions
- [ ] No second person ("you") in instructional text

### Reference Material Guidelines

- [ ] SKILL.md body <= 500 lines
- [ ] Long content split into `references/` directory
- [ ] Reference files use descriptive names (`api_endpoints.md`, not `reference.md`)
- [ ] All references linked from SKILL.md exist

---

## MCP Configuration Validation

### File Structure

- [ ] `.claude/` directory exists
- [ ] `mcp_config.json` file exists
- [ ] JSON syntax is valid (no parse errors)

### Server Configuration

#### Essential Servers

- [ ] **Memory MCP** configured
  - [ ] Command: `npx -y @modelcontextprotocol/server-memory`
  - [ ] Can create entities
  - [ ] Can search nodes

- [ ] **GitHub MCP** configured (if using)
  - [ ] Command: `npx -y @modelcontextprotocol/server-github`
  - [ ] `GITHUB_TOKEN` environment variable set
  - [ ] Token has `repo`, `issues`, `pull_requests` scopes
  - [ ] Can list repositories
  - [ ] Can search code

- [ ] **Context7 MCP** configured
  - [ ] Command: `npx -y @context7/mcp-server-context7`
  - [ ] Can resolve library IDs
  - [ ] Can query documentation

### Optional Servers (as needed)

- [ ] **Web Search Prime MCP**
  - [ ] Can perform web searches
  - [ ] Chinese optimization works

- [ ] **Web Reader MCP**
  - [ ] Can fetch web pages
  - [ ] Markdown conversion works

- [ ] **ZRead MCP**
  - [ ] Can read GitHub repos
  - [ ] Directory structure works

- [ ] **ZAI MCP**
  - [ ] Can analyze images
  - [ ] UI-to-code works

- [ ] **4.5v Image Analysis MCP**
  - [ ] Can analyze screenshots
  - [ ] Image understanding works

- [ ] **Chrome DevTools MCP**
  - [ ] Can launch browser
  - [ ] Page snapshot works

- [ ] **Sequential Thinking MCP**
  - [ ] Can perform step-by-step analysis

### Test Commands

```bash
# Test Memory MCP
say "创建一个测试实体并搜索它"

# Test GitHub MCP (requires token)
say "列出我的 GitHub 仓库"

# Test Context7 MCP
say "查询 React 文档关于 useState"
```

---

## Documentation Completeness

### Required Documents

- [ ] **MCP_USAGE_GUIDE.md** exists
  - [ ] ~800-1000 lines
  - [ ] All configured MCP servers documented
  - [ ] Tool reference tables included
  - [ ] Usage scenarios with code examples
  - [ ] Quick reference table
  - [ ] Related docs linked

- [ ] **MCP_BEST_PRACTICES.md** exists
  - [ ] ~450-550 lines
  - [ ] Core usage principles
  - [ ] Decision tree for MCP selection
  - [ ] Best practices per MCP
  - [ ] Troubleshooting guide

- [ ] **AUTO_DEV_WORKFLOW.md** exists
  - [ ] ~900-1000 lines
  - [ ] Vibe-coding philosophy explained
  - [ ] Development workflow documented
  - [ ] MCP integration patterns
  - [ ] Quality standards

### Optional Documents

- [ ] **tech-docs/** directory exists
  - [ ] `index.md` with navigation
  - [ ] Framework-specific docs (React/Vue/etc.)
  - [ ] Tool-specific docs (Vite/Webpack/etc.)
  - [ ] Language docs (TypeScript/Python/etc.)

### Documentation Quality

- [ ] Markdown syntax valid
- [ ] No broken internal links
- [ ] Code blocks properly formatted
- [ ] Tables render correctly
- [ ] Chinese/English consistent
- [ ] Version date included
- [ ] TOC navigation works

---

## Knowledge Base Integrity

### Entity Coverage

- [ ] **Component entities** created
  - [ ] Main UI components (App, Desktop, Canvas, etc.)
  - [ ] Key sub-components
  - [ ] Each has: name, type, location, observations

- [ ] **Service entities** created
  - [ ] API services
  - [ ] Business logic services
  - [ ] Each has: functions, endpoints, dependencies

- [ ] **Route entities** created
  - [ ] API endpoints documented
  - [ ] Page routes documented
  - [ ] Each has: method, path, handler, location

- [ ] **Code pattern entities** created
  - [ ] Common idioms recorded
  - [ ] Usage patterns documented

- [ ] **Solution entities** created
  - [ ] Known fixes documented
  - [ ] Workarounds recorded

### Relationship Quality

- [ ] Import relationships defined
  - [ ] Component imports
  - [ ] Service imports

- [ ] Usage relationships defined
  - [ ] Component → Component
  - [ ] Component → Service
  - [ ] Service → Route

- [ ] Data flow relationships defined
  - [ ] Component → Storage
  - [ ] Route → Data source

### Verification Commands

```bash
# Read entire graph
say "读取整个知识图谱"

# Search test
say "搜索 Desktop 相关实体"

# Open specific nodes
say "打开 App.tsx, Desktop.tsx 的详细信息"
```

---

## Environment Setup

### Environment Variables

- [ ] `.env` file exists (or `.env.example` provided)
- [ ] `GITHUB_TOKEN` documented (if using GitHub MCP)
- [ ] Optional keys documented:
  - [ ] `GEMINI_API_KEY`
  - [ ] `ANTHROPIC_API_KEY`
  - [ ] `OPENAI_API_KEY`

### Security

- [ ] `.env` in `.gitignore`
- [ ] No actual tokens in `.env.example`
- [ ] Placeholder values clear

### Project Detection

- [ ] `package.json` read (JavaScript/Node)
- [ ] `requirements.txt` or `pyproject.toml` read (Python)
- [ ] `go.mod` read (Go)
- [ ] `Cargo.toml` read (Rust)
- [ ] Tech stack correctly identified

---

## Development Standards

### .cursorrules

- [ ] File exists or updated
- [ ] Project name included
- [ ] Tech stack documented
- [ ] Development commands listed
- [ ] Code conventions specified
- [ ] MCP quick reference included

### CLAUDE.md

- [ ] File exists or updated
- [ ] Project overview present
- [ ] Architecture described
- [ ] Key directories listed
- [ ] Common tasks documented

### Optional Standards

- [ ] `.github/copilot-instructions.md` (if using Copilot)
- [ ] `CHANGELOG.md` template
- [ ] `CONTRIBUTING.md` template
- [ ] `README.md` updated

---

## Git Repository

### Initial Commit

- [ ] Commit message follows conventional commits
  - [ ] Format: `feat: 初始化 AI 辅助开发体系`
  - [ ] Body lists key changes

- [ ] All new files committed
  - [ ] `.claude/mcp_config.json`
  - [ ] `docs/*.md`
  - [ ] `.env.example`
  - [ ] `.cursorrules` (if updated)
  - [ ] `CLAUDE.md` (if updated)

### Git Configuration

- [ ] `.gitignore` includes:
  - [ ] `.env`
  - [ ] `node_modules/` (if applicable)
  - [ ] `dist/`, `build/`
  - [ ] OS-specific files

### Branch Strategy

- [ ] Default branch identified (main/dev)
- [ ] Feature branch pattern documented
- [ ] PR template available (optional)

---

## Final Verification

### Smoke Tests

```bash
# Test 1: Project query
say "这个项目使用什么技术栈?"
# Expected: Correct tech stack identified

# Test 2: Architecture query
say "项目的主要组件有哪些?"
# Expected: Key components listed

# Test 3: Documentation query
say "MCP 怎么使用?"
# Expected: Reference to MCP_USAGE_GUIDE.md

# Test 4: Knowledge query
say "搜索 Canvas 相关的实体"
# Expected: Canvas and related entities returned
```

### Quality Criteria

| Criterion | Pass Condition |
|-----------|----------------|
| **MCP Config** | All servers valid, essential servers working |
| **Documentation** | All 3 core docs exist, ~2000+ lines total |
| **Knowledge Base** | 10+ entities, 5+ relationships |
| **Environment** | .env.example provided, tokens documented |
| **Git** | Clean initial commit, proper message |

### Sign-off Checklist

- [ ] All MCP servers validated
- [ ] Documentation complete and reviewed
- [ ] Knowledge base initialized
- [ ] Environment variables documented
- [ ] Development standards in place
- [ ] Git commit ready
- [ ] Smoke tests passed

---

## Issue Resolution

### Common Issues

| Issue | Solution |
|-------|----------|
| MCP server not found | Run `npx -y package-name` to install |
| GitHub auth failed | Verify `GITHUB_TOKEN` in `.env` |
| JSON parse error | Validate `mcp_config.json` syntax |
| Missing docs | Run documentation generation |
| Empty knowledge base | Run initialization workflow |

### Getting Help

```bash
# Check MCP status
say "检查所有 MCP 服务器状态"

# Re-run initialization
say "重新运行项目初始化，只配置缺少的部分"

# Generate missing docs
say "生成缺失的文档"
```

---

## Validation Script Template

```bash
#!/bin/bash
# validate-init.sh

echo "Project Initialization Validation"

# MCP Config
if [ -f ".claude/mcp_config.json" ]; then
  echo "✓ MCP config exists"
else
  echo "✗ MCP config missing"
fi

# Documentation
docs=("MCP_USAGE_GUIDE.md" "MCP_BEST_PRACTICES.md" "AUTO_DEV_WORKFLOW.md")
for doc in "${docs[@]}"; do
  if [ -f "docs/$doc" ]; then
    echo "✓ $doc exists"
  else
    echo "✗ $doc missing"
  fi
done

# Environment
if [ -f ".env.example" ]; then
  echo "✓ .env.example exists"
else
  echo "✗ .env.example missing"
fi

echo "Validation complete"
```

---

**Last Updated**: 2026-01-21
