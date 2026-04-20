import { stat } from 'node:fs/promises';
import { claudeDesktopAppDir, claudeDesktopConfigPath } from '../paths.js';
import { mergeJSONMcp, readJSONIfExists, writeJSONAtomic } from '../writer.js';
import type { ClientDescriptor, InstallContext, InstallResult } from './types.js';

function mcpRemoteServer(url: string, apiKey: string): Record<string, unknown> {
  return {
    command: 'npx',
    args: ['-y', 'mcp-remote', url, '--header', `Authorization: Bearer ${apiKey}`],
  };
}

export const claudeDesktop: ClientDescriptor = {
  id: 'claude-desktop',
  label: 'Claude Desktop',
  configPath: claudeDesktopConfigPath,

  async detect(): Promise<boolean> {
    try {
      await stat(claudeDesktopAppDir());
      return true;
    } catch {
      return false;
    }
  },

  async install(ctx: InstallContext): Promise<InstallResult> {
    const path = claudeDesktopConfigPath();
    const existing = await readJSONIfExists<Record<string, unknown>>(path);
    const { next, action } = mergeJSONMcp(existing, {
      rootKey: 'mcpServers',
      serverKey: ctx.serverKey,
      serverConfig: mcpRemoteServer(ctx.url, ctx.apiKey),
      force: ctx.force,
    });
    if (!ctx.dryRun && action !== 'skipped') {
      await writeJSONAtomic(path, next);
    }
    return {
      path,
      action,
      note:
        action === 'skipped'
          ? `server key "${ctx.serverKey}" already present; rerun with --force to overwrite`
          : undefined,
    };
  },
};
