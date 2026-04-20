#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

const url = process.env.RADQUOTE_MCP_URL;
const apiKey = process.env.RADQUOTE_MCP_API_KEY;

if (!url) {
  console.error('rad quote mcpb-proxy: RADQUOTE_MCP_URL is not set');
  process.exit(1);
}
if (!apiKey) {
  console.error('rad quote mcpb-proxy: RADQUOTE_MCP_API_KEY is not set (user_config.api_key must be configured)');
  process.exit(1);
}

const require = createRequire(import.meta.url);
const pkgJsonPath = require.resolve('mcp-remote/package.json');
const pkg = require('mcp-remote/package.json') as { bin?: Record<string, string> | string };
const binRelative =
  typeof pkg.bin === 'string'
    ? pkg.bin
    : pkg.bin?.['mcp-remote'] ?? (pkg.bin ? Object.values(pkg.bin)[0] : undefined);
if (!binRelative) {
  console.error('rad quote mcpb-proxy: could not resolve mcp-remote binary from its package.json');
  process.exit(1);
}
const binAbsolute = join(dirname(pkgJsonPath), binRelative);

const child = spawn(
  process.execPath,
  [binAbsolute, url, '--header', `Authorization: Bearer ${apiKey}`],
  { stdio: 'inherit' },
);

for (const sig of ['SIGINT', 'SIGTERM'] as const) {
  process.on(sig, () => {
    child.kill(sig);
  });
}

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});
