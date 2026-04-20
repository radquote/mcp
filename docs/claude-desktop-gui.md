# Install rad quote in Claude Desktop (no terminal, no Node)

This is the shortest path if you use **Claude Desktop** and do not want to install Node.js or open a terminal. It uses Claude Desktop's built-in Custom Connector UI — nothing runs on your machine besides Claude Desktop itself.

## What you need

- Claude Desktop (latest version recommended)
- A rad quote workspace API key

## Steps

1. Open **Claude Desktop** → **Settings** → **Connectors** (the exact menu label varies by version — if you do not see it, search the Settings for `connector`).
2. Click **Add custom connector**.
3. Fill in:
   - **Name:** `rad quote`
   - **Remote MCP server URL:** `https://api.limits.run/mcp?key=<YOUR_API_KEY>` — paste your API key in place of `<YOUR_API_KEY>`. Leave **OAuth Client ID / Secret** blank.
4. **Add**.
5. **Restart Claude Desktop** (Cmd+Q on macOS, then reopen).

Start a new chat. The tools `get_upload_url`, `create_project_import_job`, and `get_project_import_job` should appear when you ask Claude to create a project from a file.

## Why the key goes in the URL

Claude Desktop's Custom Connector UI does not expose a field for an `Authorization` header; it supports either OAuth or an open endpoint. As a pragmatic workaround the rad quote MCP server also accepts the same API key via a `?key=` query parameter, so you can embed it directly in the URL you paste into this field.

Two things to keep in mind:

- **The URL contains a secret.** Do not paste the full URL into chats, tickets, or screenshots. Treat it the same as you would the raw API key.
- **Key rotation works.** If you regenerate your API key in the rad quote workspace, update this connector's URL. The old key stops working as soon as it is revoked on the server.

## Troubleshooting

- **No Connectors item in Settings.** Update Claude Desktop to the latest version — remote MCP connectors require a recent release.
- **`401` or "invalid token" in chat.** The key in the URL is wrong, expired, or has a stray character. Regenerate in your rad quote workspace settings and update the connector URL.
- **Tools do not appear in a new chat.** Fully quit and reopen Claude Desktop. Then ask "what tools do you have available?" — rad quote tools should be listed.

## Removing it

Settings → Connectors → **rad quote** → **Remove**.

## Alternatives

- **CLI install** (Cursor / Claude Code / Windsurf / Codex; requires Node 18+): [root README](../README.md#one-command-cli).
- **Double-click `.mcpb`** (Claude Desktop; requires Node 18+): [MCPB install](./mcpb.md).
