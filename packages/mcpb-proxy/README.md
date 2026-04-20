# @radquote/mcpb-proxy

A local MCPB bundle that proxies stdio MCP requests to the rad quote remote HTTP endpoint. Distributed as a `.mcpb` file via [GitHub Releases](https://github.com/radquote/mcp/releases), **not** published to npm.

For end-user install instructions see [`docs/mcpb.md`](../../docs/mcpb.md).

## How it works

1. Claude Desktop (or any MCPB-aware client) launches `dist/index.js` as a child process.
2. The script reads `RADQUOTE_MCP_URL` and `RADQUOTE_MCP_API_KEY` from its environment, populated by the MCPB runtime from `user_config.api_key` and the hard-coded URL in `manifest.json`.
3. It spawns the bundled [`mcp-remote`](https://www.npmjs.com/package/mcp-remote) binary, which handles stdio ↔ Streamable HTTP translation for the remote endpoint.
4. All MCP traffic flows stdio ↔ mcp-remote ↔ HTTPS ↔ rad quote backend.

## Build & pack

```bash
cd packages/mcpb-proxy
npm run build
npm run pack:mcpb   # produces radquote-stage.mcpb
```

`pack:mcpb` re-installs production dependencies inside this package directory (bypassing workspace hoisting) so the `.mcpb` archive actually contains `mcp-remote` and its deps.

## Manifest

See [`manifest.json`](./manifest.json). The current bundle targets the **stage** endpoint only (`https://api.limits.run/mcp`); a production variant will be released once the prod URL is final.
