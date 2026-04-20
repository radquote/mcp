// TODO: iterate over registered ClientDescriptors and return the ones whose
// config directory or file already exists on disk. Individual detect()
// implementations live in src/clients/*.ts.
import type { ClientDescriptor } from './clients/types.js';

export async function detectInstalledClients(clients: ClientDescriptor[]): Promise<ClientDescriptor[]> {
  const results = await Promise.all(
    clients.map(async (client) => ({ client, present: await client.detect() })),
  );
  return results.filter((r) => r.present).map((r) => r.client);
}
