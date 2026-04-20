import * as p from '@clack/prompts';
import type { ClientDescriptor } from './clients/types.js';

export async function pickClients(detected: ClientDescriptor[]): Promise<ClientDescriptor[]> {
  if (detected.length === 0) {
    p.log.warn('No supported AI clients detected on this machine.');
    return [];
  }
  const selected = await p.multiselect({
    message: 'Which clients should I configure?',
    options: detected.map((client) => ({ value: client.id, label: client.label })),
    initialValues: detected.map((client) => client.id),
    required: false,
  });
  if (p.isCancel(selected)) {
    p.cancel('Cancelled.');
    process.exit(0);
  }
  const selectedIds = selected as string[];
  return detected.filter((client) => selectedIds.includes(client.id));
}

export async function promptApiKey(envName: string): Promise<string> {
  const key = await p.password({
    message: `Paste your rad quote ${envName} API key:`,
    validate: (value) => {
      if (!value || value.trim().length === 0) {
        return 'API key is required';
      }
      return undefined;
    },
  });
  if (p.isCancel(key)) {
    p.cancel('Cancelled.');
    process.exit(0);
  }
  return (key as string).trim();
}
