# Stage environment

The rad quote MCP stage endpoint is `https://api.limits.run/mcp`. It is intended for internal QA, partner integration, and early testing — not for end users.

## Install

```bash
npx @radquote/mcp-setup install --env=stage
```

The installer writes the server under the key `radquote-stage` in each client configuration, so it can live side-by-side with a production install. In your AI client the two appear as separate tool sets.

## API keys

Stage API keys only authenticate against the stage endpoint; production keys only work against production. If you see `401` after install, you likely swapped the two.

## Why stage is not listed in the public marketplaces

The MCP Registry entry and Smithery listing point at production only. Stage is reachable exclusively via the `--env=stage` CLI flag and through manual edits using the snippets in [`../examples/`](../examples) after replacing `<MCP_URL>` with `https://api.limits.run/mcp`.
