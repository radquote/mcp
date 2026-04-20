# Troubleshooting

## Installer cannot find any clients

The installer looks for known configuration paths. If your AI client stores its MCP config somewhere non-standard, install manually using a snippet from [`../examples/`](../examples).

## `401 Unauthorized`

- You may have used a stage key against production (or vice versa).
- The key may be revoked or expired — regenerate it in the rad quote workspace settings.
- The `Authorization: Bearer <key>` header may have been stripped by a proxy; check your client's logs.

## Claude Desktop does not show the server

Claude Desktop reads its config at startup. Fully quit and reopen the app after running the installer.

## Codex / Windsurf / Claude Desktop — "command not found: npx"

These clients use a local `mcp-remote` proxy to talk to the remote HTTP endpoint. Ensure Node.js 18+ is on `PATH` for the shell that launches the client.

## Installer writes into a client I don't use

Use `--client=<name>` to restrict the installation to specific clients, e.g.

```bash
npx @radquote/mcp-setup install --client=cursor --client=claude-code
```
