# Install rad quote in Claude Desktop (.mcpb)

If you use **Claude Desktop**, you can install rad quote without the terminal. Everyone else, use [`@radquote/mcp-setup`](https://www.npmjs.com/package/@radquote/mcp-setup).

## Steps

1. Open [github.com/radquote/mcp/releases](https://github.com/radquote/mcp/releases) and download the latest `radquote-stage.mcpb`.
2. Double-click the downloaded file.
3. Claude Desktop opens an install dialog. Paste your rad quote **API key** and click **Install**.
4. Restart Claude Desktop.

The tools `get_upload_url` and `create_project_import_job` will appear in your chats.

## Requirements

- Claude Desktop 0.12 or newer
- Node.js 18+ on your system PATH — Claude Desktop launches `node` to run the bundled proxy

## What actually happens

The `.mcpb` archive contains a tiny Node script plus the [`mcp-remote`](https://www.npmjs.com/package/mcp-remote) library. When Claude Desktop starts the server, the script spawns `mcp-remote` with your API key injected as a header and forwards stdio to the rad quote HTTP endpoint. Your key lives in the OS keychain, never in a plaintext config file.

## Uninstall

Claude Desktop → **Settings** → **Extensions** → **rad quote (stage)** → **Uninstall**.

## Stage vs production

The current `.mcpb` targets the **stage** environment (`https://api.limits.run/mcp`). A production bundle will ship once the production endpoint is finalized; it will appear on the same Releases page as `radquote.mcpb`.
