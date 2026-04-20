# rad quote MCP

The rad quote Model Context Protocol (MCP) server lets you create projects from uploaded files directly from your AI assistant — Claude Desktop, Claude Code, Cursor, Codex, Windsurf, VS Code (GitHub Copilot), Zed, and any other MCP-compatible client.

This repository hosts the **distribution** bits: an installer CLI, client configuration snippets, and the public MCP Registry manifest. The server itself runs in rad quote's infrastructure.

## Quick install

1. Grab an API key from your rad quote workspace settings.
2. Run:

    ```bash
    npx @radquote/mcp-setup install
    ```

3. The installer detects supported clients on your machine and writes the configuration for you.

## Manual install

See [`examples/`](./examples) for copy-paste snippets per client:

| File                          | Client                         |
| ----------------------------- | ------------------------------ |
| `claude-desktop.json`         | Claude Desktop                 |
| `claude-code.sh`              | Claude Code CLI                |
| `cursor.mcp.json`             | Cursor                         |
| `vscode.mcp.json`             | VS Code (GitHub Copilot MCP)   |
| `windsurf.mcp_config.json`    | Windsurf                       |
| `codex.config.toml`           | Codex CLI                      |

In every snippet, replace `<MCP_URL>` with the production endpoint and `<YOUR_API_KEY>` with your key.

## What you get

Two tools are exposed to your AI assistant:

- `get_upload_url` — obtain a short-lived signed URL for uploading one file.
- `create_project_import_job` — create a new project by importing tasks from previously uploaded files; optionally copy rates from an existing project as a read-only template.

## Status

Pre-release. The production endpoint URL and the MCP Registry listing are being finalized. Until then, the installer prints a clear message for any client it cannot configure, and the snippets in `examples/` contain a `<MCP_URL>` placeholder.

Stage environment is available for internal QA and partner integration — see [`docs/stage.md`](./docs/stage.md).

## License

[MIT](./LICENSE)
