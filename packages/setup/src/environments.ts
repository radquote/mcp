export type EnvName = 'prod' | 'stage';

export interface Environment {
  url: string;
  serverKey: string;
}

const PROD_URL = '__RADQUOTE_PROD_URL__';
const STAGE_URL = 'https://api.limits.run/mcp';

export const ENVIRONMENTS: Record<EnvName, Environment> = {
  prod: { url: PROD_URL, serverKey: 'radquote' },
  stage: { url: STAGE_URL, serverKey: 'radquote-stage' },
};

export function isConfigured(env: EnvName): boolean {
  return !ENVIRONMENTS[env].url.startsWith('__');
}
