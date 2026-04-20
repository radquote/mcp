import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

export async function readJSONIfExists<T>(path: string): Promise<T | undefined> {
  try {
    const raw = await readFile(path, 'utf8');
    return JSON.parse(raw) as T;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      return undefined;
    }
    throw err;
  }
}

export async function writeJSONAtomic(path: string, data: unknown): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  const tmp = `${path}.radquote-tmp-${process.pid}`;
  const body = `${JSON.stringify(data, null, 2)}\n`;
  await writeFile(tmp, body, { encoding: 'utf8', mode: 0o600 });
  await rename(tmp, path);
}

export async function readTextIfExists(path: string): Promise<string | undefined> {
  try {
    return await readFile(path, 'utf8');
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      return undefined;
    }
    throw err;
  }
}

export async function writeTextAtomic(path: string, body: string): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  const tmp = `${path}.radquote-tmp-${process.pid}`;
  await writeFile(tmp, body, { encoding: 'utf8', mode: 0o600 });
  await rename(tmp, path);
}

export type MergeAction = 'created' | 'updated' | 'skipped';

export interface MergeJSONMcpOptions {
  rootKey: string;
  serverKey: string;
  serverConfig: unknown;
  force: boolean;
}

export function mergeJSONMcp(
  existing: Record<string, unknown> | undefined,
  opts: MergeJSONMcpOptions,
): { next: Record<string, unknown>; action: MergeAction } {
  const base: Record<string, unknown> =
    existing && typeof existing === 'object' ? { ...existing } : {};
  const rawServers = base[opts.rootKey];
  const servers: Record<string, unknown> =
    rawServers && typeof rawServers === 'object' ? { ...(rawServers as Record<string, unknown>) } : {};
  const had = Object.prototype.hasOwnProperty.call(servers, opts.serverKey);
  if (had && !opts.force) {
    return { next: base, action: 'skipped' };
  }
  servers[opts.serverKey] = opts.serverConfig;
  base[opts.rootKey] = servers;
  return { next: base, action: had ? 'updated' : 'created' };
}
