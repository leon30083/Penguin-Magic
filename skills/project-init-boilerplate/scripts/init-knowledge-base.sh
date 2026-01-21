#!/bin/bash
# Knowledge Base Initialization Script
# This script provides guidance for initializing Memory MCP knowledge base

echo "Memory MCP Knowledge Base Initialization"
echo "========================================"
echo ""

echo "This script helps initialize the Memory MCP knowledge base for your project."
echo ""
echo "The Memory MCP knowledge base should contain:"
echo "  - Component entities (React/Vue components, etc.)"
echo "  - Service entities (API clients, business logic)"
echo "  - Route entities (API endpoints, page routes)"
echo "  - Code pattern entities (common patterns, idioms)"
echo "  - Solution entities (problem-solving records)"
echo ""

# Check for AI context
echo "To initialize the knowledge base, ask your AI assistant:"
echo ""
echo "  say \"初始化知识库\""
echo ""
echo "Or for specific entities:"
echo ""
echo "  say \"创建组件实体: App.tsx, Desktop.tsx, Canvas.tsx\""
echo "  say \"创建服务实体: apiService, authService\""
echo "  say \"创建路由实体: GET /api/users, POST /api/login\""
echo ""

echo "After initialization, verify with:"
echo ""
echo "  say \"读取整个知识图谱\""
echo "  say \"搜索 Desktop 相关实体\""
echo ""

# Optional: Auto-detect project structure
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

echo "Detected project structure:"
if [ -d "$PROJECT_ROOT/components" ]; then
  echo "  ✓ components/ directory found"
fi
if [ -d "$PROJECT_ROOT/services" ]; then
  echo "  ✓ services/ directory found"
fi
if [ -d "$PROJECT_ROOT/src/routes" ] || [ -d "$PROJECT_ROOT/routes" ]; then
  echo "  ✓ routes/ directory found"
fi

echo ""
echo "For detailed guidance, see: references/knowledge-base.md"
