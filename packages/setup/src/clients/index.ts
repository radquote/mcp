import { claudeCode } from './claude-code.js';
import { claudeDesktop } from './claude-desktop.js';
import { codex } from './codex.js';
import { cursor } from './cursor.js';
import { windsurf } from './windsurf.js';
import type { ClientDescriptor } from './types.js';

export const ALL_CLIENTS: readonly ClientDescriptor[] = [
  claudeCode,
  claudeDesktop,
  cursor,
  windsurf,
  codex,
];

export function clientsById(ids: string[]): ClientDescriptor[] {
  const byId = new Map(ALL_CLIENTS.map((client) => [client.id, client]));
  return ids.map((id) => {
    const client = byId.get(id);
    if (!client) {
      const known = ALL_CLIENTS.map((c) => c.id).join(', ');
      throw new Error(`unknown client: ${id} (known: ${known})`);
    }
    return client;
  });
}
