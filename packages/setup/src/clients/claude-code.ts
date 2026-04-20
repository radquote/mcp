import { stat } from 'node:fs/promises';
import { join } from 'node:path';
import { claudeCodeUserConfigPath, HOME } from '../paths.js';
import { mergeJSONMcp, readJSONIfExists, writeJSONAtomic } from '../writer.js';
import type { ClientDescriptor, InstallContext, InstallResult } from './types.js';

export const claudeCode: ClientDescriptor = {
  id: 'claude-code',
  label: 'Claude Code',
  configPath: claudeCodeUserConfigPath,

  async detect(): Promise<boolean> {
    const candidates = [claudeCodeUserConfigPath(), join(HOME, '.claude')];
    for (const candidate of candidates) {
      try {
        await stat(candidate);
        return true;
      } catch {
        // keep trying
      }
    }
    return false;
  },

  async install(ctx: InstallContext): Promise<InstallResult> {
    const path = claudeCodeUserConfigPath();
    const existing = await readJSONIfExists<Record<string, unknown>>(path);
    const { next, action } = mergeJSONMcp(existing, {
      rootKey: 'mcpServers',
      serverKey: ctx.serverKey,
      serverConfig: {
        type: 'http',
        url: ctx.url,
        headers: { Authorization: `Bearer ${ctx.apiKey}` },
      },
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
