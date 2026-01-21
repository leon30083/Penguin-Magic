# Knowledge Base Initialization Guide

Complete guide for initializing and maintaining the Memory MCP knowledge base for any project.

---

## Table of Contents

1. [Memory MCP Overview](#memory-mcp-overview)
2. [Entity Types](#entity-types)
3. [Initialization Workflow](#initialization-workflow)
4. [Entity Creation Patterns](#entity-creation-patterns)
5. [Relationship Patterns](#relationship-patterns)
6. [Observation Best Practices](#observation-best-practices)
7. [Maintenance Strategies](#maintenance-strategies)
8. [Query Patterns](#query-patterns)

---

## Memory MCP Overview

### What is Memory MCP?

Memory MCP provides a persistent knowledge graph that stores:
- Project architecture (components, services, routes)
- Design decisions and rationale
- Code patterns and conventions
- Problem solutions and workarounds
- Team knowledge and context

### Key Concepts

| Concept | Description | Example |
|---------|-------------|---------|
| **Entity** | A node in the knowledge graph | "App.tsx", "API Service", "Login Flow" |
| **Entity Type** | Category of the entity | "Component", "Service", "Route" |
| **Observation** | Facts/information about an entity | "Main app component with 3,746 lines" |
| **Relation** | Connection between entities | "App.tsx imports Desktop.tsx" |
| **Relation Type** | Type of connection | "imports", "calls", "extends" |

---

## Entity Types

### Core Entity Categories

#### 1. Components

Frontend/UI building blocks.

```typescript
{
  name: "App.tsx",
  entityType: "React Component",
  observations: [
    "Main application component, 3,746 lines of code",
    "Manages global application state",
    "Renders Desktop, Canvas, and Sidebar components"
  ]
}
```

#### 2. Services

Business logic and API layer.

```typescript
{
  name: "geminiService.ts",
  entityType: "Service",
  observations: [
    "Google Gemini API integration service",
    "Handles text-to-image generation",
    "API key from environment variables"
  ]
}
```

#### 3. Routes

API endpoints or page routes.

```typescript
{
  name: "GET /api/creative",
  entityType: "API Route",
  observations: [
    "Returns all creative ideas",
    "Located in backend-nodejs/src/routes/creative.js",
    "Supports filtering by category"
  ]
}
```

#### 4. Code Patterns

Reusable coding patterns.

```typescript
{
  name: "useCallback Pattern",
  entityType: "Code Pattern",
  observations: [
    "Used for optimizing callback functions in React",
    "Prevents unnecessary re-renders",
    "Pattern: useCallback(fn, deps)"
  ]
}
```

#### 5. Solutions

Problem-solving records.

```typescript
{
  name: "Thumbnail Generation",
  entityType: "Solution",
  observations: [
    "Problem: Large images slow down desktop loading",
    "Solution: Generate 160px thumbnails using Sharp",
    "Location: backend-nodejs/src/routes/files.js"
  ]
}
```

---

## Initialization Workflow

### Phase 1: Discovery

```bash
# Ask AI to analyze project structure
say "分析项目结构，识别主要组件和服务"

# AI will:
# 1. Scan directory structure
# 2. Identify key files
# 3. Categorize by type
# 4. Report findings
```

### Phase 2: Entity Creation

```bash
# Create entities in bulk
say "为以下文件创建 Memory 实体:
- components/App.tsx
- components/Desktop.tsx
- services/api/creative.ts
- backend-nodejs/src/routes/creative.js"
```

### Phase 3: Relationship Building

```bash
# Connect related entities
say "创建组件间的关系:
- App.tsx imports Desktop.tsx
- Desktop.tsx uses Canvas.tsx
- App.tsx calls creative API service"
```

### Phase 4: Validation

```bash
# Verify knowledge graph
say "读取整个知识图谱，检查完整性"

# Or search specific entities
say "搜索 Desktop 相关的所有实体"
```

---

## Entity Creation Patterns

### Pattern 1: Component Entity

```typescript
// React/Vue/Svelte Components
mcp__memory__create_entities({
  entities: [{
    name: "Desktop.tsx",
    entityType: "React Component",
    observations: [
      "Desktop workspace component, 2,471 lines",
      "Supports image items, folder items, stack items",
      "Grid-based drag-and-drop positioning",
      "Located at: components/Desktop/Desktop.tsx",
      "Key state: desktopItems, selectedItems, draggedItem"
    ]
  }]
})
```

### Pattern 2: Service Entity

```typescript
// API Services, Business Logic
mcp__memory__create_entities({
  entities: [{
    name: "creativeApiService",
    entityType: "Service",
    observations: [
      "Creative ideas API client",
      "Functions: fetchCreativeIdeas, createCreativeIdea, updateCreativeIdea",
      "Base URL: /api/creative",
      "Error handling with toast notifications",
      "Located at: services/api/creative.ts"
    ]
  }]
})
```

### Pattern 3: Route Entity

```typescript
// API Endpoints
mcp__memory__create_entities({
  entities: [{
    name: "GET /api/creative",
    entityType: "API Route",
    observations: [
      "Retrieves all creative ideas",
      "Query params: category, search, limit",
      "Returns: Array<CreativeIdea>",
      "Handler: getAllCreative()",
      "File: backend-nodejs/src/routes/creative.js"
    ]
  }]
})
```

### Pattern 4: Decision Entity

```typescript
// Architecture Decisions
mcp__memory__create_entities({
  entities: [{
    name: "JSON File Storage Decision",
    entityType: "Architecture Decision",
    observations: [
      "Decision: Use JSON files instead of database",
      "Rationale: Desktop app, no complex queries needed",
      "Trade-off: Simple setup vs limited query capabilities",
      "Location: backend-nodejs/data/",
      "Files: creative_ideas.json, history.json, settings.json"
    ]
  }]
})
```

### Pattern 5: Problem/Solution Entity

```typescript
// Debug Records
mcp__memory__create_entities({
  entities: [{
    name: "History Limit Fix",
    entityType: "Solution",
    observations: [
      "Problem: History file grows indefinitely",
      "Solution: Limit to 500 items, FIFO removal",
      "Implementation: backend-nodejs/src/routes/history.js",
      "Code: array.slice(-500)"
    ]
  }]
})
```

---

## Relationship Patterns

### Import/Use Relationships

```typescript
mcp__memory__create_relations({
  relations: [
    {
      from: "App.tsx",
      to: "Desktop.tsx",
      relationType: "imports and renders"
    },
    {
      from: "Desktop.tsx",
      to: "Canvas.tsx",
      relationType: "opens and manages"
    }
  ]
})
```

### API Call Relationships

```typescript
mcp__memory__create_relations({
  relations: [
    {
      from: "App.tsx",
      to: "creativeApiService",
      relationType: "calls for creative ideas"
    },
    {
      from: "creativeApiService",
      to: "GET /api/creative",
      relationType: "makes requests to"
    }
  ]
})
```

### Data Flow Relationships

```typescript
mcp__memory__create_relations({
  relations: [
    {
      from: "Desktop.tsx",
      to: "desktopItems.json",
      relationType: "persists state to"
    },
    {
      from: "GET /api/desktop",
      to: "desktopItems.json",
      relationType: "reads from"
    }
  ]
})
```

### Implementation Relationships

```typescript
mcp__memory__create_relations({
  relations: [
    {
      from: "Thumbnail Generation",
      to: "Sharp",
      relationType: "uses library"
    },
    {
      from: "React Flow Decision",
      to: "@xyflow/react",
      relationType: "chose framework"
    }
  ]
})
```

---

## Observation Best Practices

### DO: Specific, Verifiable Facts

```typescript
// Good
observations: [
  "Desktop component has 2,471 lines of code",
  "Uses grid-based positioning with 20px cells",
  "State managed by useState hook"
]
```

### DON'T: Vague, Subjective Statements

```typescript
// Bad
observations: [
  "Desktop is a large component",  // How large?
  "Grid system works well",         // Subjective
  "State is managed"                // How?
]
```

### Include Location Information

```typescript
observations: [
  "Located at: components/Desktop/Desktop.tsx",
  "Related files: components/Desktop/types.ts, components/Desktop/hooks.ts",
  "Imported by: App.tsx, Canvas.tsx"
]
```

### Record Technical Details

```typescript
observations: [
  "React version: 19.1.1",
  "TypeScript: 5.8.2",
  "Key dependencies: @xyflow/react@12.10.0",
  "Build tool: Vite 6.2.0"
]
```

### Document Non-Obvious Behavior

```typescript
observations: [
  "Images are converted to base64 before storage",
  "History auto-removes items older than 30 days",
  "Desktop items snap to 20px grid on drop",
  "Canvas auto-saves every 30 seconds"
]
```

---

## Maintenance Strategies

### Regular Updates

```bash
# After adding new features
say "为新功能创建 Memory 实体:
- VideoNode component
- veoService service
- /api/video route"

# After fixing bugs
say "记录解决方案:
- 视频导出格式问题
- 内存泄漏修复
```

### Periodic Cleanup

```bash
# Remove outdated entities
say "删除过时的实体:
- 旧版本组件 (已移除)
- 废弃的 API 端点"
```

### Version Tracking

```typescript
// Mark important versions
mcp__memory__add_observations({
  observations: [{
    entityName: "App.tsx",
    contents: [
      "v1.4.0: Added canvas system",
      "v1.5.0: Refactored state management",
      "v1.6.0: Added video generation"
    ]
  }]
})
```

### Relationship Updates

```typescript
// Update relationships when architecture changes
mcp__memory__delete_relations({
  relations: [
    { from: "OldComponent", to: "Service", relationType: "used" }
  ]
})

mcp__memory__create_relations({
  relations: [
    { from: "NewComponent", to: "Service", relationType: "uses" }
  ]
})
```

---

## Query Patterns

### Search by Component Name

```typescript
mcp__memory__search_nodes({
  query: "Desktop"
})
// Returns: Desktop.tsx and related entities
```

### Search by Concept

```typescript
mcp__memory__search_nodes({
  query: "drag drop"
})
// Returns: DragDropHandler, Desktop.tsx, Canvas.tsx
```

### Search by Problem

```typescript
mcp__memory__search_nodes({
  query: "thumbnail image performance"
})
// Returns: Thumbnail Generation solution
```

### Read Specific Entities

```typescript
mcp__memory__open_nodes({
  names: ["App.tsx", "Desktop.tsx", "Canvas.tsx"]
})
// Returns: Full details for specified entities
```

### Read Entire Graph

```typescript
mcp__memory__read_graph()
// Returns: All entities and relationships
```

---

## Example: Complete Initialization

```typescript
// Step 1: Create component entities
mcp__memory__create_entities({
  entities: [
    {
      name: "App.tsx",
      entityType: "React Component",
      observations: [
        "Main app component, 3,746 lines",
        "Manages global state",
        "Entry point: index.tsx"
      ]
    },
    {
      name: "Desktop.tsx",
      entityType: "React Component",
      observations: [
        "Desktop workspace, 2,471 lines",
        "Grid-based positioning (20px)",
        "Three item types: image, folder, stack"
      ]
    },
    {
      name: "Canvas.tsx",
      entityType: "React Component",
      observations: [
        "Canvas using @xyflow/react",
        "Six node types: text, image, prompt, creative, save, multi-angle",
        "Workflow execution engine"
      ]
    }
  ]
})

// Step 2: Create service entities
mcp__memory__create_entities({
  entities: [
    {
      name: "geminiService",
      entityType: "Service",
      observations: [
        "Google Gemini image generation",
        "API key from GEMINI_API_KEY",
        "Located at: services/geminiService.ts"
      ]
    },
    {
      name: "creativeApiService",
      entityType: "Service",
      observations: [
        "Creative ideas CRUD operations",
        "Located at: services/api/creative.ts"
      ]
    }
  ]
})

// Step 3: Create relationships
mcp__memory__create_relations({
  relations: [
    { from: "App.tsx", to: "Desktop.tsx", relationType: "imports and renders" },
    { from: "App.tsx", to: "Canvas.tsx", relationType: "imports and renders" },
    { from: "Desktop.tsx", to: "Canvas.tsx", relationType: "opens for editing" },
    { from: "App.tsx", to: "creativeApiService", relationType: "calls" },
    { from: "Canvas.tsx", to: "geminiService", relationType: "calls for generation" }
  ]
})

// Step 4: Verify
mcp__memory__read_graph()
```

---

## Quick Reference

### Common Operations

| Operation | Tool | Example |
|-----------|------|---------|
| Create entities | `create_entities` | Create components, services |
| Create relations | `create_relations` | Link imports, calls |
| Add observations | `add_observations` | Add new facts |
| Search | `search_nodes` | Find by keyword |
| Read nodes | `open_nodes` | Get specific entities |
| Read graph | `read_graph` | Get all knowledge |
| Delete entities | `delete_entities` | Remove outdated |
| Delete relations | `delete_relations` | Remove connections |

### Entity Type Templates

| Type | Use For | Key Fields |
|------|---------|------------|
| React Component | UI components | Location, state, props |
| Service | API/business logic | Functions, endpoints |
| API Route | Endpoints | Method, path, handler |
| Code Pattern | Idioms/recipes | Syntax, usage |
| Architecture Decision | Design choices | Rationale, trade-offs |
| Solution | Bug fixes | Problem, fix |

### Relation Types

| Type | Usage |
|------|-------|
| imports | Module imports |
| renders | Component rendering |
| calls | Function/service calls |
| extends | Inheritance |
| implements | Interface implementation |
| uses | Library/service usage |
| persists to | Data storage |
| reads from | Data retrieval |

---

**Last Updated**: 2026-01-21
