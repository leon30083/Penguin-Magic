# MCP Server Configuration Guide

Complete guide for configuring Model Context Protocol (MCP) servers in any project.

---

## Table of Contents

1. [MCP Overview](#mcp-overview)
2. [Server Selection Guide](#server-selection-guide)
3. [Configuration Format](#configuration-format)
4. [Server Details](#server-details)
5. [Environment Variables](#environment-variables)
6. [Validation](#validation)

---

## MCP Overview

### What is MCP?

MCP (Model Context Protocol) is an open protocol that enables AI applications to interact with external data sources and tools in a standardized way.

### Why Use MCP?

- **Enhanced AI Capabilities**: Query latest docs, search code, manage GitHub
- **Knowledge Management**: Build project-specific knowledge graphs
- **Workflow Automation**: Auto-create PRs, manage issues, run tests
- **Web Integration**: Search trends, read docs, analyze repos

### Configuration File Location

```
.claude/mcp_config.json
```

---

## Server Selection Guide

### By Project Type

| Project Type | Essential MCP Servers | Optional MCP Servers |
|-------------|----------------------|---------------------|
| **Frontend (React/Vue)** | Memory, Context7, Web Search Prime | Web Reader, ZRead |
| **Backend (Node/Python)** | Memory, GitHub, ZRead | Context7 |
| **Full-Stack** | All essential servers | Chrome DevTools |
| **Desktop (Electron)** | Memory, Context7, GitHub | All servers |
| **Minimal** | Memory, GitHub | - |

### Server Priority Matrix

| MCP Server | Priority | Setup Complexity | Key Benefit |
|-----------|----------|------------------|-------------|
| **Memory** | ⭐⭐⭐⭐⭐ | Simple | Project knowledge graph |
| **GitHub** | ⭐⭐⭐⭐⭐ | Medium | PR/Issue automation |
| **Context7** | ⭐⭐⭐⭐⭐ | Simple | Latest docs |
| **Web Search Prime** | ⭐⭐⭐⭐ | Simple | Web search |
| **Web Reader** | ⭐⭐⭐⭐ | Simple | Web scraping |
| **ZRead** | ⭐⭐⭐ | Simple | GitHub repo reading |
| **ZAI MCP** | ⭐⭐⭐ | Simple | UI-to-code, error diagnosis |
| **4.5v Image Analysis** | ⭐⭐⭐ | Simple | Image understanding |
| **Chrome DevTools** | ⭐⭐⭐ | Medium | UI automation |
| **Sequential Thinking** | ⭐⭐ | Simple | Complex analysis |

---

## Configuration Format

### Basic Structure

```json
{
  "mcpServers": {
    "server-name": {
      "command": "npx",
      "args": ["-y", "package-name"],
      "env": {
        "ENV_VAR": "${ENV_VAR}"
      }
    }
  }
}
```

### Environment Variable Reference

Use `${VAR_NAME}` to reference environment variables from your shell or `.env` file:

```json
{
  "env": {
    "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}",
    "API_KEY": "${CUSTOM_API_KEY}"
  }
}
```

---

## Server Details

### 1. Memory MCP

**Purpose**: Knowledge graph for storing project architecture, decisions, and patterns.

**Configuration**:
```json
{
  "memory": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-memory"],
    "env": {}
  }
}
```

**Key Tools**:
- `mcp__memory__create_entities` - Create knowledge entities
- `mcp__memory__create_relations` - Link entities
- `mcp__memory__search_nodes` - Search knowledge
- `mcp__memory__read_graph` - Read entire graph

**Use Cases**:
- Store component architecture
- Record design decisions
- Document code patterns
- Track solutions to problems

---

### 2. GitHub MCP

**Purpose**: GitHub repository operations, PR/Issue management.

**Configuration**:
```json
{
  "github": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-github"],
    "env": {
      "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
    }
  }
}
```

**Required**: `GITHUB_TOKEN` environment variable

**Get Token**: https://github.com/settings/tokens
**Scopes**: `repo`, `issues`, `pull_requests`

**Key Tools**:
- `mcp__github__search_code` - Search code
- `mcp__github__create_pull_request` - Create PR
- `mcp__github__issue_write` - Create/update Issue
- `mcp__github__request_copilot_review` - Request AI review

**Use Cases**:
- Auto-create PRs from branches
- Generate Issues from error logs
- Search code patterns across repos
- Automate code reviews

---

### 3. Context7 MCP

**Purpose**: Query latest technical documentation from libraries and frameworks.

**Configuration**:
```json
{
  "context7": {
    "command": "npx",
    "args": ["-y", "@context7/mcp-server-context7"],
    "env": {}
  }
}
```

**Key Tools**:
- `mcp__context7__resolve-library-id` - Get library ID
- `mcp__context7__query-docs` - Query documentation

**Supported Libraries**:
- React: `/facebook/react`
- Vue: `/vuejs/core`
- Vite: `/vitejs/vite`
- TypeScript: `/microsoft/TypeScript`
- Electron: `/electron/electron`
- Express: `/expressjs/express`
- + thousands more

**Use Cases**:
- Get latest API docs
- Find code examples
- Learn new frameworks
- Resolve deprecation warnings

---

### 4. Chrome DevTools MCP

**Purpose**: Browser automation, UI testing, performance analysis.

**Configuration**:
```json
{
  "chrome-devtools": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-puppeteer"],
    "env": {}
  }
}
```

**Key Tools**:
- `mcp__chrome-devtools__new_page` - Open page
- `mcp__chrome-devtools__take_snapshot` - Get page structure
- `mcp__chrome-devtools__click` - Click elements
- `mcp__chrome-devtools__performance_start_trace` - Start profiling

**Use Cases**:
- Automated UI testing
- Performance profiling
- Form submission testing
- Screenshot documentation

---

### 5. Sequential Thinking MCP

**Purpose**: Structured problem analysis and step-by-step reasoning.

**Configuration**:
```json
{
  "sequential-thinking": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"],
    "env": {}
  }
}
```

**Key Tools**:
- `mcp__sequential-thinking__sequentialthinking` - Step-by-step analysis

**Use Cases**:
- Complex problem breakdown
- Algorithm design
- Architecture planning
- Debug multi-layer issues

---

### 6. Web Search Prime MCP

**Purpose**: Web search with Chinese optimization and time filtering.

**Configuration**:
```json
{
  "web-search-prime": {
    "command": "npx",
    "args": ["-y", "web-search-prime"],
    "env": {}
  }
}
```

**Key Tools**:
- `mcp__web-search-prime__webSearchPrime` - Search web

**Parameters**:
- `search_query` - Search terms
- `search_recency_filter` - oneDay/oneWeek/oneMonth/oneYear/noLimit
- `location` - cn/us
- `content_size` - medium/high

**Use Cases**:
- Find latest tutorials
- Research competitors
- Get community solutions
- Track tech trends

---

### 7. Web Reader MCP

**Purpose**: Extract web page content as markdown.

**Configuration**:
```json
{
  "web-reader": {
    "command": "npx",
    "args": ["-y", "web-reader-mcp"],
    "env": {}
  }
}
```

**Key Tools**:
- `mcp__web-reader__webReader` - Fetch and convert page

**Parameters**:
- `url` - Page URL
- `return_format` - markdown/text
- `retain_images` - Keep images
- `with_links_summary` - Extract links

**Use Cases**:
- Read documentation offline
- Archive tutorials
- Extract blog content
- Build knowledge base

---

### 8. ZRead MCP

**Purpose**: Fast GitHub repository reading without cloning.

**Configuration**:
```json
{
  "zread": {
    "command": "npx",
    "args": ["-y", "zread-mcp-server"],
    "env": {}
  }
}
```

**Key Tools**:
- `mcp__zread__get_repo_structure` - Get directory tree
- `mcp__zread__read_file` - Read file contents
- `mcp__zread__search_doc` - Search repo docs

**Use Cases**:
- Study open source code
- Find implementation patterns
- Learn project structure
- Quick code research

---

### 9. 4.5v Image Analysis MCP

**Purpose**: Advanced image understanding for UI screenshots and designs.

**Configuration**:
```json
{
  "4.5v-image-analysis": {
    "command": "npx",
    "args": ["-y", "4.5v-mcp"],
    "env": {}
  }
}
```

**Key Tools**:
- `mcp__4_5v_mcp__analyze_image` - Analyze image

**Use Cases**:
- Understand UI from screenshots
- Extract design patterns
- Analyze competitors
- Document visual bugs

---

### 10. ZAI MCP Server

**Purpose**: Multi-purpose AI vision toolkit.

**Configuration**:
```json
{
  "zai-mcp-server": {
    "command": "npx",
    "args": ["-y", "zai-mcp-server"],
    "env": {}
  }
}
```

**Key Tools**:
- `mcp__zai-mcp-server__ui_to_artifact` - UI to code/prompt/spec
- `mcp__zai-mcp-server__diagnose_error_screenshot` - Error diagnosis
- `mcp__zai-mcp-server__understand_technical_diagram` - Diagram analysis
- `mcp__zai-mcp-server__analyze_video` - Video analysis
- `mcp__zai-mcp-server__ui_diff_check` - UI comparison

**Use Cases**:
- Convert mockups to code
- Debug error screenshots
- Understand architecture diagrams
- Compare design vs implementation

---

## Environment Variables

### Required Variables

```bash
# GitHub Token (for GitHub MCP)
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
```

### Optional Variables

```bash
# API Keys for specific services
GEMINI_API_KEY=AIzaSy...        # Google AI (optional)
ANTHROPIC_API_KEY=sk-ant-...    # Claude (optional)
OPENAI_API_KEY=sk-...           # OpenAI (optional)
```

### .env.example Template

```bash
# MCP (Model Context Protocol) Configuration
# Copy this file to .env and fill in actual values

# GitHub Personal Access Token (Required for GitHub MCP)
# Get token: https://github.com/settings/tokens
# Scopes needed: repo, issues, pull_requests
GITHUB_TOKEN=your_github_token_here

# Optional API Keys
GEMINI_API_KEY=your_gemini_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here
```

---

## Validation

### Check MCP Server Status

```bash
# List all MCP servers
# (This depends on your AI client's CLI)

# Example with Claude Code:
claude mcp list
```

### Test Individual Server

```bash
# Test Memory MCP
# Ask AI: "Create a test entity in Memory MCP"

# Test GitHub MCP
# Ask AI: "List my GitHub repositories"

# Test Context7 MCP
# Ask AI: "Query React documentation for useState"
```

### Common Issues

| Issue | Solution |
|-------|----------|
| Server not found | Run `npx -y package-name` to install |
| GitHub auth failed | Check `GITHUB_TOKEN` in `.env` |
| Context7 not working | Some libraries may not be indexed |
| Chrome hanging | Chrome may need to be installed separately |

---

## Minimal Config Example

```json
{
  "mcpServers": {
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"],
      "env": {}
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

---

## Full Config Example

See `../assets/mcp_config.template.json` for complete configuration with all 10 servers.

---

**Last Updated**: 2026-01-21
