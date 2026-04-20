# rad quote MCP

The rad quote MCP server lets you create projects from uploaded files directly from your AI assistant.

Pick the install path that matches you:

| Your situation | Path |
| --- | --- |
| I use **Claude Desktop** and do not want to install Node or open a terminal | **[Claude Desktop UI](./docs/claude-desktop-gui.md)** — paste `https://api.limits.run/mcp?key=<YOUR_API_KEY>` into the Custom Connector form |
| I am a developer, I have Node 18+, I use Cursor / Codex / Windsurf / Claude Code | **[One-command CLI](#one-command-cli)** |
| I want a double-click install for Claude Desktop and have Node 18+ on my machine | **[.mcpb bundle](./docs/mcpb.md)** |

---

## One-command CLI

```bash
npx @radquote/mcp-setup@alpha install --env=stage
```

Requires Node 18+. Detects every supported client on your machine and writes the configuration for it. By default it configures all of them; pass `--client=<id>` to target one, or `--pick` to choose interactively.

Supported clients: `claude-code`, `claude-desktop`, `cursor`, `windsurf`, `codex`.

More detail: [`packages/setup/README.md`](./packages/setup/README.md).

## Manual config snippets

If you prefer to edit configuration files yourself, copy the snippet for your client from [`examples/`](./examples). Replace `<MCP_URL>` with `https://api.limits.run/mcp` (stage) and `<YOUR_API_KEY>` with your rad quote workspace API key.

## What you get

Two tools appear in your AI assistant:

- `get_upload_url` — obtain a short-lived signed URL for uploading one file.
- `create_project_import_job` — create a new project by importing tasks from previously uploaded files; optionally copy rates from an existing project as a read-only template.

## Status

**Pre-release.** The production endpoint URL and the MCP Registry listing are being finalized. Currently only the **stage** environment (`https://api.limits.run/mcp`) is wired up — intended for internal QA and partner integration. Running the CLI with `--env=prod` prints a clear "not configured" message until production ships.

See [`docs/stage.md`](./docs/stage.md) for details on the stage environment.

## License

[MIT](./LICENSE)
