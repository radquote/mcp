# Install rad quote in Claude Desktop (no terminal, no Node)

This is the shortest path if you use **Claude Desktop** and do not want to install Node.js or open a terminal. It uses Claude Desktop's built-in Custom Connector UI — nothing runs on your machine besides Claude Desktop itself.

## What you need

- Claude Desktop (latest version recommended)
- A rad quote workspace API key

## Steps

1. Open **Claude Desktop** → **Settings**.
2. Find the **Connectors** section. In recent versions it is a top-level item under Settings; in some builds it sits under **Extensions → Connectors**. If you cannot see it, type `connector` or `MCP` into the Settings search.
3. Click **Add custom connector** (or **+ Add** → **Custom**).
4. Fill in:
   - **Name:** `rad quote`
   - **URL:** `https://api.limits.run/mcp`
   - **Authorization header** (or **Custom header** → **Authorization**): `Bearer <YOUR_API_KEY>` — paste your API key after the word `Bearer ` with a single space.
5. **Save** / **Add**.
6. **Restart Claude Desktop** if it doesn't reload automatically.

Start a new chat. The tools `get_upload_url` and `create_project_import_job` should be available when you ask Claude to create a project from a file.

## Troubleshooting

- **No Connectors item in Settings.** Update Claude Desktop to the latest version. Remote MCP connectors require a recent release.
- **"Invalid token" / `401` in chat.** The API key is wrong, expired, or has a stray space. Copy it again from your rad quote workspace settings, replace only the `<YOUR_API_KEY>` part of the header, and save.
- **Tools don't appear in a new chat.** Fully quit and reopen Claude Desktop (Cmd+Q on macOS, not just close the window). Then ask Claude "what tools do you have available?" — rad quote tools should be listed.

## Removing it

Settings → Connectors → **rad quote** → **Remove**.

## If Custom Connectors are not in your Claude Desktop

Two fallbacks:

- **Double-click install:** see [MCPB bundle install](./mcpb.md). Requires Node.js 18+.
- **CLI install:** see the [root README](../README.md#one-command-cli). Requires Node.js 18+.
