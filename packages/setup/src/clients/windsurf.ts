import { stat } from 'node:fs/promises';
import { join } from 'node:path';
import { HOME, windsurfConfigPath } from '../paths.js';
import { mergeJSONMcp, readJSONIfExists, writeJSONAtomic } from '../writer.js';
import type { ClientDescriptor, InstallContext, InstallResult } from './types.js';

export const windsurf: ClientDescriptor = {
  id: 'windsurf',
  label: 'Windsurf',
  configPath: windsurfConfigPath,

  async detect(): Promise<boolean> {
    try {
      await stat(join(HOME, '.codeium'));
      return true;
    } catch {
      return false;
    }
  },

  async install(ctx: InstallContext): Promise<InstallResult> {
    const path = windsurfConfigPath();
    const existing = await readJSONIfExists<Record<string, unknown>>(path);
    const { next, action } = mergeJSONMcp(existing, {
      rootKey: 'mcpServers',
      serverKey: ctx.serverKey,
      serverConfig: {
        command: 'npx',
        args: ['-y', 'mcp-remote', ctx.url, '--header', `Authorization: Bearer ${ctx.apiKey}`],
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
