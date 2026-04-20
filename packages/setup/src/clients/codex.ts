import { stat } from 'node:fs/promises';
import { dirname } from 'node:path';
import toml from '@iarna/toml';
import { codexConfigPath } from '../paths.js';
import { readTextIfExists, writeTextAtomic } from '../writer.js';
import type { ClientDescriptor, InstallContext, InstallResult } from './types.js';

type CodexConfig = Record<string, unknown> & {
  mcp_servers?: Record<string, unknown>;
};

export const codex: ClientDescriptor = {
  id: 'codex',
  label: 'Codex CLI',
  configPath: codexConfigPath,

  async detect(): Promise<boolean> {
    try {
      await stat(dirname(codexConfigPath()));
      return true;
    } catch {
      return false;
    }
  },

  async install(ctx: InstallContext): Promise<InstallResult> {
    const path = codexConfigPath();
    const raw = await readTextIfExists(path);
    const parsed: CodexConfig = raw ? (toml.parse(raw) as CodexConfig) : {};
    const rawServers = parsed.mcp_servers;
    const servers: Record<string, unknown> =
      rawServers && typeof rawServers === 'object' ? { ...rawServers } : {};
    const had = Object.prototype.hasOwnProperty.call(servers, ctx.serverKey);
    if (had && !ctx.force) {
      return {
        path,
        action: 'skipped',
        note: `server key "${ctx.serverKey}" already present; rerun with --force to overwrite`,
      };
    }
    servers[ctx.serverKey] = {
      command: 'npx',
      args: ['-y', 'mcp-remote', ctx.url, '--header', `Authorization: Bearer ${ctx.apiKey}`],
    };
    parsed.mcp_servers = servers;
    if (!ctx.dryRun) {
      await writeTextAtomic(path, toml.stringify(parsed as toml.JsonMap));
    }
    return { path, action: had ? 'updated' : 'created' };
  },
};
