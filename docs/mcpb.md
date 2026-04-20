# Install rad quote in Claude Desktop (.mcpb)

> **Requires Node.js 18+** on your machine — Claude Desktop launches `node` to run the bundled proxy script. If Node is not installed, install it from [nodejs.org](https://nodejs.org) first (or `brew install node` on macOS). If you do not want to install Node, use the [Custom Connector UI path](./claude-desktop-gui.md) instead — that one needs nothing but Claude Desktop.

If you already have Node 18+ and use **Claude Desktop**, this is the double-click install path. Everyone else, use the [CLI](../README.md#one-command-cli) or the [Custom Connector UI](./claude-desktop-gui.md).

## Steps

1. Open [github.com/radquote/mcp/releases](https://github.com/radquote/mcp/releases) and download the latest `radquote-stage.mcpb`.
2. Double-click the downloaded file.
3. Claude Desktop opens an install dialog. Paste your rad quote **API key** and click **Install**.
4. Restart Claude Desktop.

The tools `get_upload_url`, `create_project_import_job`, and `get_project_import_job` will appear in your chats.

## Requirements

- Claude Desktop 0.12 or newer
- Node.js 18+ on your system PATH — Claude Desktop launches `node` to run the bundled proxy

## What actually happens

The `.mcpb` archive contains a tiny Node script plus the [`mcp-remote`](https://www.npmjs.com/package/mcp-remote) library. When Claude Desktop starts the server, the script spawns `mcp-remote` with your API key injected as a header and forwards stdio to the rad quote HTTP endpoint. Your key lives in the OS keychain, never in a plaintext config file.

## Uninstall

Claude Desktop → **Settings** → **Extensions** → **rad quote (stage)** → **Uninstall**.

## Stage vs production

The current `.mcpb` targets the **stage** environment (`https://api.limits.run/mcp`). A production bundle will ship once the production endpoint is finalized; it will appear on the same Releases page as `radquote.mcpb`.
