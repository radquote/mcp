import type { EnvName } from '../environments.js';

export interface InstallContext {
  env: EnvName;
  url: string;
  serverKey: string;
  apiKey: string;
  dryRun: boolean;
  force: boolean;
}

export interface ClientDescriptor {
  id: string;
  label: string;
  configPath: () => string;
  detect: () => Promise<boolean>;
  install: (ctx: InstallContext) => Promise<InstallResult>;
}

export interface InstallResult {
  path: string;
  action: 'created' | 'updated' | 'skipped';
  note?: string;
}
