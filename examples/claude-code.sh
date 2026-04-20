#!/usr/bin/env bash
# Adds rad quote MCP as a user-scope HTTP MCP server in Claude Code.
# Replace <MCP_URL> and <YOUR_API_KEY> before running.
set -euo pipefail

claude mcp add radquote "<MCP_URL>" \
  --transport http \
  --header "Authorization: Bearer <YOUR_API_KEY>" \
  --scope user
