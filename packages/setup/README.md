# @radquote/mcp-setup

One-command installer for the [rad quote MCP server](https://github.com/radquote/mcp) across AI clients — Claude Desktop, Claude Code, Cursor, Windsurf, and Codex CLI.

## Status

**Alpha.** Only the stage endpoint (`https://api.limits.run/mcp`) is wired up. The production endpoint is still being finalized; running with `--env=prod` prints a clear "not configured" message and exits. For QA and partner integration, use `--env=stage`.

## Install into your AI clients

```bash
npx @radquote/mcp-setup@alpha install --env=stage
```

The installer detects which supported clients are present on your machine, asks which ones to configure, prompts for your stage API key, and writes the configuration atomically. To target a subset, pass `--client=<id>`:

```bash
npx @radquote/mcp-setup@alpha install --env=stage --client=cursor --client=claude-code
```

Known client ids: `claude-code`, `claude-desktop`, `cursor`, `windsurf`, `codex`.

By default, the installer configures **every detected supported client** without an interactive picker.

## Options

```
--env=<prod|stage>   target environment (default: prod; prod is not wired in alpha)
--client=<name>      install into a specific client only; repeatable
--pick               show an interactive picker to narrow the install to a subset
--api-key=<key>      non-interactive API key (otherwise prompted)
--dry-run            print planned changes without writing
--force              overwrite the server entry if it already exists
-h, --help           show usage
```

## Requirements

- Node.js 18 or newer
- One of the supported AI clients installed locally

## What gets written

Each client has its own configuration file and schema. Cursor and Claude Code receive a native HTTP MCP entry; Claude Desktop, Windsurf, and Codex receive a stdio entry that proxies through [`mcp-remote`](https://www.npmjs.com/package/mcp-remote) because those clients do not yet support remote HTTP transport directly.

The server is registered under the key `radquote` (prod) or `radquote-stage` (stage), so both environments can live side-by-side in the same client.

## License

[MIT](https://github.com/radquote/mcp/blob/main/LICENSE)
