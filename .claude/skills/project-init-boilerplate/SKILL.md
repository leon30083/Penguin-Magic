---
name: project-init-boilerplate
description: "AI-driven project initialization boilerplate. Quickly establish complete AI-assisted development system for any new project: MCP configuration, documentation system, knowledge base, and development standards. Trigger with '帮我初始化项目', 'setup project', 'initialize repo', '配置 MCP'."
---

# Project Init Boilerplate Skill

Turn any empty repository into a production-ready AI-assisted development environment in minutes, not hours.

## When to Use This Skill

Trigger this skill when you need to:
- Start a completely new project from scratch
- Add AI-assisted development capabilities to existing projects
- Standardize project initialization across multiple repositories
- Set up MCP (Model Context Protocol) servers for enhanced AI capabilities
- Initialize project documentation and knowledge base systems

**Common trigger phrases:**
- "帮我初始化项目"
- "setup project"
- "initialize repo"
- "configure MCP"
- "配置 MCP"
- "create project docs"

## Not For / Boundaries

This skill is NOT:
- A project template generator (it sets up the AI infrastructure, not the codebase)
- A substitute for understanding your project's specific requirements
- A magic bullet - you still need to provide project-specific context

**Required inputs:**
- Project type (React/Vue/Node.js/Python/etc.) - for customizing documentation
- GitHub Token (if using GitHub MCP) - will prompt if missing
- Project name/description - for generating accurate documentation

### Communication Language

**IMPORTANT**: When using this Skill, AI must communicate with users in **Chinese (中文)** by default. All:
- Progress messages
- Confirmation prompts
- Error messages
- Documentation content
- Status updates

Should be in Chinese unless the user explicitly requests English.

## Quick Reference

### Pattern 1: One-Command Initialization (Recommended)

```bash
# Single command to initialize everything
say "帮我初始化项目"

# AI will automatically:
# 1. Analyze project structure
# 2. Create MCP configuration
# 3. Generate documentation
# 4. Initialize knowledge base
# 5. Configure development standards
```

**Initialization checklist** (copy and track progress):
```
Project Initialization Progress:
- [ ] Step 1: Analyze project structure and detect tech stack
- [ ] Step 2: Create .claude/mcp_config.json with selected MCP servers
- [ ] Step 3: Create .env.example with environment variable templates
- [ ] Step 4: Generate docs/MCP_USAGE_GUIDE.md
- [ ] Step 5: Generate docs/MCP_BEST_PRACTICES.md
- [ ] Step 6: Generate docs/AUTO_DEV_WORKFLOW.md
- [ ] Step 7: Initialize Memory MCP knowledge base (entities + relations)
- [ ] Step 8: Update .cursorrules with project-specific rules
- [ ] Step 9: Update/create CLAUDE.md with project overview
- [ ] Step 10: Run quality validation
- [ ] Step 11: Create git commit with conventional commit message

Note: Skill creation support available via skill-creator and references/skill-authoring.md
```

### Pattern 2: Step-by-Step Initialization

```bash
# Step 1: Configure MCP servers
say "配置 MCP 服务器"

# Step 2: Create documentation
say "创建项目文档"

# Step 3: Initialize knowledge base
say "初始化知识库"

# Step 4: Setup development standards
say "配置开发规范"
```

### Pattern 3: Interactive Mode

```bash
# AI will ask for confirmation before each step
say "初始化项目，交互式确认"

# Output:
# ? 检测到 React + Vite 项目，是否配置 React Flow 相关文档? (Y/n)
# ? 是否需要 GitHub MCP? 需要 GitHub Token，是否已配置? (Y/n)
# ? 是否初始化 Memory MCP 知识库? (Y/n)
```

### Pattern 4: Custom MCP Server Selection

```bash
# Select specific MCP servers only
say "初始化项目，只配置 memory 和 github MCP"

# Or exclude specific servers
say "初始化项目，跳过 chrome-devtools"
```

### Pattern 5: Environment Variable Setup

```bash
# Create .env.example template
say "创建环境变量模板"

# Generates .env.example with:
# GITHUB_TOKEN=your_github_token_here
# GEMINI_API_KEY=your_gemini_key_here (optional)
```

### Pattern 6: Documentation Generation

```bash
# Generate project-specific technical docs
say "生成技术文档"

# AI will:
# 1. Detect project tech stack
# 2. Query Context7 MCP for latest docs
# 3. Generate reference documents
# 4. Create docs/tech-docs/ structure
```

### Pattern 7: Knowledge Base Initialization

```bash
# Initialize Memory MCP with project entities
say "初始化知识库"

# Creates entities for:
# - Components (React components, etc.)
# - Services (API clients, business logic)
# - Routes (API endpoints, pages)
# - Code patterns (common patterns in codebase)
# - Solutions (problem-solving approaches)
```

### Pattern 8: Development Standards

```bash
# Setup .cursorrules and coding standards
say "配置开发规范"

# Updates:
# - .cursorrules (MCP quick reference)
# - CLAUDE.md (project instructions)
# - .github/copilot-instructions.md
# - CHANGELOG.md template
# - CONTRIBUTING.md template
```

### Pattern 9: Minimal Configuration

```bash
# Quick minimal setup (2-3 MCP servers only)
say "初始化项目，最小化配置"

# Creates only:
# - Memory MCP (knowledge base)
# - GitHub MCP (if token available)
# - Context7 MCP (documentation)
```

### Pattern 10: Existing Project Enhancement

```bash
# Add AI capabilities to existing project
say "为现有项目配置 AI 辅助开发"

# AI will:
# 1. Scan existing structure
# 2. Ask what to add/avoid
# 3. Incrementally add AI infrastructure
# 4. Preserve existing configuration
```

### Pattern 11: Tech Stack Detection

```bash
# Auto-detect and configure for specific stack
say "初始化 React 项目"  # or "初始化 Vue 项目"

# Configures:
# - Framework-specific documentation
# - Relevant MCP servers
# - Appropriate code patterns in knowledge base
```

### Pattern 12: Quality Gate Check

```bash
# Run quality checklist after initialization
say "检查初始化质量"

# Validates:
# - MCP servers configured correctly
# - Documentation complete
# - Knowledge base initialized
# - Environment variables set
# - Git commit ready
```

### Pattern 13: Skill Creation Support

```bash
# Create a new Skill using skill-creator
say "创建一个新 skill"

# skill-creator will guide you through:
# 1. Understanding use cases and examples
# 2. Planning reusable content structure
# 3. Writing SKILL.md following best practices
# 4. Creating reference documentation
# 5. Privacy and security review
# 6. Packaging for distribution

# See also: references/skill-authoring.md for detailed best practices
```

## Examples

### Example 1: New React Project Initialization

**Input:**
```text
User: "帮我初始化项目"
Context: New React + Vite project
```

**Steps:**
1. AI detects project type (React + Vite from package.json)
2. Creates `.claude/mcp_config.json` with 10 MCP servers
3. Creates `.env.example` with GitHub token placeholder
4. Generates `docs/MCP_USAGE_GUIDE.md` (820 lines)
5. Generates `docs/MCP_BEST_PRACTICES.md` (470 lines)
6. Generates `docs/AUTO_DEV_WORKFLOW.md`
7. Creates `docs/tech-docs/` with React Flow, Vite, TypeScript references
8. Initializes Memory MCP with component/service entities
9. Updates `.cursorrules`, `CLAUDE.md`, `CHANGELOG.md`

**Expected output:**
- 10 MCP servers configured and ready
- Complete documentation system (2000+ lines)
- Knowledge base with 20-50 entities
- Development standards in place
- Git commit with "feat: 初始化 AI 辅助开发体系"

### Example 2: Existing Node.js Backend Enhancement

**Input:**
```text
User: "setup project"
Context: Existing Express.js backend with no AI configuration
```

**Steps:**
1. AI scans existing structure
2. Asks: "检测到 Express.js 后端，是否配置 API 文档?" (Y/n)
3. Creates MCP configuration (skips React Flow, adds API-related docs)
4. Generates backend-focused documentation
5. Initializes knowledge base with routes and services
6. Updates existing CLAUDE.md if present

**Expected output:**
- Tailored MCP configuration for backend projects
- API-focused documentation
- Knowledge base with routes and middleware
- No disruption to existing code

### Example 3: Minimal Python Project

**Input:**
```text
User: "Initialize repo, minimal config only"
Context: Simple Python script project
```

**Steps:**
1. AI asks which MCP servers are needed
2. Creates minimal `.claude/mcp_config.json` (memory, github only)
3. Creates basic `.env.example`
4. Generates simple `docs/MCP_USAGE_GUIDE.md` (short version)
5. Skips heavy documentation (no tech stack detected)
6. Initializes knowledge base with Python modules

**Expected output:**
- Lightweight MCP configuration (2 servers)
- Essential documentation only
- Basic knowledge base
- Ready for AI assistance without overhead

### Example 4: Interactive Initialization with Customization

**Input:**
```text
User: "初始化项目，交互式"
Context: Full-stack project (React + Express)
```

**Steps:**
1. AI: "检测到 React + Express 全栈项目"
2. AI: "? 配置前端文档 (React Flow, Vite)? (Y/n)" → User: Y
3. AI: "? 配置后端文档 (Express, Node.js)? (Y/n)" → User: Y
4. AI: "? 需要 GitHub MCP? 需要 GITHUB_TOKEN (Y/n)" → User: Y
5. AI: "请在 .env 中设置 GITHUB_TOKEN=ghp_xxx，完成后告诉我"
6. User: "已设置"
7. AI continues with remaining steps
8. AI: "? 初始化 Memory MCP 知识库? (Y/n)" → User: Y
9. AI creates entities for components, services, routes
10. AI: "? 配置 Git 提交规范? (Y/n)" → User: Y

**Expected output:**
- Fully customized initialization based on user choices
- No assumptions, explicit confirmation at each step
- GitHub token properly configured via environment variable
- Complete documentation and knowledge base

### Example 5: Vite + TypeScript Frontend Project

**Input:**
```text
User: "初始化 Vite + TypeScript 项目"
Context: New frontend project
```

**Steps:**
1. Detects Vite from vite.config.ts
2. Detects TypeScript from tsconfig.json
3. Creates MCP config with frontend-focused servers
4. Generates `docs/tech-docs/vite.md` using Context7 MCP
5. Generates `docs/tech-docs/typescript.md` using Context7 MCP
6. Creates knowledge base with Vite plugins, TypeScript patterns
7. Configures .cursorrules with Vite-specific commands

**Expected output:**
- Frontend-optimized MCP configuration
- Latest Vite and TypeScript documentation
- Type system patterns in knowledge base
- Quick reference for Vite commands

### Example 6: Full-Stack MERN Project

**Input:**
```text
User: "帮我初始化 MERN 项目"
Context: MongoDB + Express + React + Node.js
```

**Steps:**
1. Detects full-stack structure
2. Asks about frontend/backend split
3. Creates comprehensive MCP config
4. Generates docs for all MERN components
5. Initializes knowledge base with:
   - React components
   - Express routes
   - MongoDB schemas
   - API layer patterns
6. Sets up .cursorrules with both frontend and backend commands

**Expected output:**
- Complete MERN-focused AI infrastructure
- Documentation for MongoDB, Express, React, Node.js
- Full-stack knowledge base entities
- Unified development standards

### Example 7: Electron Desktop Application

**Input:**
```text
User: "初始化 Electron 桌面应用项目"
Context: New Electron project
```

**Steps:**
1. Detects Electron from package.json
2. Creates MCP config with desktop-focused servers
3. Generates Electron IPC documentation
4. Adds main/renderer process patterns to knowledge base
5. Configures packaging/build documentation
6. Sets up .cursorrules with Electron dev commands

**Expected output:**
- Electron-specific MCP configuration
- IPC communication patterns documented
- Desktop app development workflow
- Packaging and distribution guides

### Example 8: Python FastAPI Backend

**Input:**
```text
User: "setup FastAPI project"
Context: New Python backend project
```

**Steps:**
1. Detects Python + FastAPI from requirements.txt/pyproject.toml
2. Creates Python-focused MCP config
3. Generates FastAPI routing docs
4. Adds async patterns to knowledge base
5. Configures Python-specific .cursorrules
6. Sets up pydantic model documentation

**Expected output:**
- Python-optimized AI infrastructure
- FastAPI routing and middleware patterns
- Async/await code patterns
- Type validation documentation

## References

### Local Documentation

- `references/index.md` - Navigation index for all reference materials
- `references/mcp-servers.md` - Detailed MCP server configuration guide
- `references/documentation.md` - Documentation templates and generators
- `references/knowledge-base.md` - Knowledge base initialization patterns
- `references/quality-checklist.md` - Quality gate checklist
- `references/skill-authoring.md` - Skill creation best practices

### Source Material (Penguin-Magic Project)

This Skill is extracted from the comprehensive initialization work done in the Penguin-Magic project:
- `.claude/mcp_config.json` - 10 MCP servers configuration
- `docs/MCP_USAGE_GUIDE.md` - 820-line usage guide
- `docs/MCP_BEST_PRACTICES.md` - 470-line best practices
- `docs/AUTO_DEV_WORKFLOW.md` - 912-line workflow guide
- `docs/tech-docs/` - Technical documentation synchronized via Context7 MCP
- Memory MCP knowledge base - 48 entities, 47 relationships

### Related Skills

- **skill-creator** - Interactive skill creation guide. Use this when creating new Skills or when user says "create skill", "编写 skill", "创建 skill". The skill-creator ensures all Skills follow official best practices including privacy checks, proper naming, and progressive disclosure.

### Vibe-Coding Philosophy Integration

This Skill follows the vibe-coding principles:
- **One** (一): Single command triggers entire initialization
- **Two** (二): AI reads/writes all configuration files
- **Three** (三): AI configures environment, creates documentation, initializes knowledge
- **All Things** (万物): Generated MCP config, docs, knowledge base, standards

Four Phases × Twelve Principles:
1. **Preparation**: Single source of truth (docs/), prompt first (clear triggers)
2. **Execution**: Human-in-the-loop (interactive confirmations), chunked work (step-by-step)
3. **Collaboration**: Cognitive load budget (user controls pace), flow protection (non-blocking)
4. **Iteration**: Rest & reflection (quality gate), skill parity (learn from initialization)

## Maintenance

- **Sources**: Penguin-Magic project initialization work, vibe-coding philosophy
- **Last updated**: 2026-01-21
- **Known limits**:
  - Project type detection is heuristic (package.json, requirements.txt)
  - MCP server availability depends on external packages
  - GitHub Token required for GitHub MCP features
  - Knowledge base initialization depends on codebase structure

### Quality Gate (Pre-delivery Checklist)

Before considering this Skill complete, verify:

- [ ] `name` matches `^[a-z][a-z0-9-]*$` and matches directory name
- [ ] `description` states "what + when" with concrete trigger keywords
- [ ] "When to Use This Skill" has decidable triggers
- [ ] "Not For / Boundaries" reduces misfires
- [ ] Quick Reference <= 20 patterns, each directly usable
- [ ] >= 3 reproducible examples with input/steps/output
- [ ] Long content split into `references/` with `index.md`
- [ ] Uncertain claims include verification path
- [ ] Reads like operator's manual, not documentation dump

### Validation Commands

To verify this skill is properly configured:

1. Check SKILL.md syntax is valid
2. Verify name matches directory: `project-init-boilerplate`
3. Confirm all reference files exist in `references/`
4. Test with: "帮我初始化项目" in a test repository

Manual verification checklist:
- [ ] YAML frontmatter is valid
- [ ] name uses only lowercase, numbers, hyphens
- [ ] description is non-empty and < 1024 characters
- [ ] SKILL.md body < 500 lines (current: ~465)
- [ ] All reference files linked from SKILL.md exist
- [ ] README.md exists for user documentation
- [ ] No hardcoded absolute paths in any files
- [ ] No version numbers in SKILL.md body
