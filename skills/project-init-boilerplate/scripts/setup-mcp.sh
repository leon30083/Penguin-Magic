#!/bin/bash
# MCP Server Setup Script
# This script helps configure MCP servers for a project

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
CLAUDE_DIR="$PROJECT_ROOT/.claude"
CONFIG_FILE="$CLAUDE_DIR/mcp_config.json"
TEMPLATE_FILE="$(dirname "${BASH_SOURCE[0]}")/../assets/mcp_config.template.json"

echo "MCP Server Setup Script"
echo "======================="
echo ""

# Create .claude directory if it doesn't exist
if [ ! -d "$CLAUDE_DIR" ]; then
  echo "Creating .claude directory..."
  mkdir -p "$CLAUDE_DIR"
fi

# Check if config already exists
if [ -f "$CONFIG_FILE" ]; then
  echo "⚠️  MCP config already exists at: $CONFIG_FILE"
  read -p "Overwrite? (y/N): " -n 1 -r
  echo ""
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborting."
    exit 0
  fi
fi

# Prompt for server selection
echo "Select MCP servers to configure:"
echo "1) All servers (recommended)"
echo "2) Minimal (memory, github, context7)"
echo "3) Custom"
read -p "Enter choice (1-3): " choice

case $choice in
  1)
    echo "Configuring all 10 MCP servers..."
    cp "$TEMPLATE_FILE" "$CONFIG_FILE"
    ;;
  2)
    echo "Configuring minimal MCP setup..."
    cat > "$CONFIG_FILE" << 'EOF'
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
    },
    "context7": {
      "command": "npx",
      "args": ["-y", "@context7/mcp-server-context7"],
      "env": {}
    }
  }
}
EOF
    ;;
  3)
    echo "Custom setup - interactive selection"
    echo "Available servers: memory, github, context7, web-search-prime, web-reader, zread"
    read -p "Enter server names (comma-separated): " servers
    # Generate config based on selection
    echo "Custom config generation not implemented in this script."
    echo "Please edit $CONFIG_FILE manually."
    exit 1
    ;;
  *)
    echo "Invalid choice. Exiting."
    exit 1
    ;;
esac

echo ""
echo "✅ MCP configuration created at: $CONFIG_FILE"
echo ""
echo "Next steps:"
echo "1. Set up environment variables (GITHUB_TOKEN)"
echo "2. Copy .env.example to .env and fill in values"
echo "3. Restart your AI client to load MCP servers"
