import { stat } from 'node:fs/promises';
import { join } from 'node:path';
import { cursorConfigPath, HOME } from '../paths.js';
import { mergeJSONMcp, readJSONIfExists, writeJSONAtomic } from '../writer.js';
import type { ClientDescriptor, InstallContext, InstallResult } from './types.js';

export const cursor: ClientDescriptor = {
  id: 'cursor',
  label: 'Cursor',
  configPath: cursorConfigPath,

  async detect(): Promise<boolean> {
    try {
      await stat(join(HOME, '.cursor'));
      return true;
    } catch {
      return false;
    }
  },

  async install(ctx: InstallContext): Promise<InstallResult> {
    const path = cursorConfigPath();
    const existing = await readJSONIfExists<Record<string, unknown>>(path);
    const { next, action } = mergeJSONMcp(existing, {
      rootKey: 'mcpServers',
      serverKey: ctx.serverKey,
      serverConfig: {
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
