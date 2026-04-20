#!/usr/bin/env node
import * as p from '@clack/prompts';
import { ALL_CLIENTS, clientsById } from './clients/index.js';
import type { ClientDescriptor, InstallResult } from './clients/types.js';
import { detectInstalledClients } from './detect.js';
import { ENVIRONMENTS, isConfigured, type EnvName } from './environments.js';
import { pickClients, promptApiKey } from './prompts.js';

interface ParsedArgs {
  env: EnvName;
  clients: string[];
  apiKey: string | undefined;
  dryRun: boolean;
  force: boolean;
  yes: boolean;
  help: boolean;
}

function parseArgs(argv: string[]): ParsedArgs {
  const parsed: ParsedArgs = {
    env: 'prod',
    clients: [],
    apiKey: undefined,
    dryRun: false,
    force: false,
    yes: false,
    help: false,
  };

  for (const arg of argv) {
    if (arg === '-h' || arg === '--help' || arg === 'help') {
      parsed.help = true;
      continue;
    }
    if (arg === '-y' || arg === '--yes') {
      parsed.yes = true;
      continue;
    }
    if (arg === '--dry-run') {
      parsed.dryRun = true;
      continue;
    }
    if (arg === '--force') {
      parsed.force = true;
      continue;
    }
    if (arg.startsWith('--env=')) {
      const value = arg.slice('--env='.length);
      if (value !== 'prod' && value !== 'stage') {
        throw new Error(`invalid --env value: ${value} (expected prod|stage)`);
      }
      parsed.env = value;
      continue;
    }
    if (arg.startsWith('--client=')) {
      parsed.clients.push(arg.slice('--client='.length));
      continue;
    }
    if (arg.startsWith('--api-key=')) {
      parsed.apiKey = arg.slice('--api-key='.length);
      continue;
    }
  }

  return parsed;
}

function printHelp(): void {
  console.log(`
radquote-mcp — install the rad quote MCP server into your AI clients

Usage:
  radquote-mcp install [options]

Options:
  --env=<prod|stage>   target environment (default: prod)
  --client=<name>      install into a specific client only; repeatable
                       (known: ${ALL_CLIENTS.map((c) => c.id).join(', ')})
  --api-key=<key>      non-interactive API key (otherwise prompted)
  --dry-run            print planned changes without writing
  --force              overwrite the server entry if it already exists
  -y, --yes            skip the interactive client picker; use all detected
  -h, --help           show this message
`);
}

interface ClientOutcome {
  client: ClientDescriptor;
  result?: InstallResult;
  error?: string;
}

function summaryLine(outcome: ClientOutcome): string {
  if (outcome.error) {
    return `  ✗ ${outcome.client.label}: ${outcome.error}`;
  }
  const result = outcome.result!;
  const marker = result.action === 'skipped' ? '-' : '✓';
  const note = result.note ? ` — ${result.note}` : '';
  return `  ${marker} ${outcome.client.label}: ${result.action} (${result.path})${note}`;
}

async function install(args: ParsedArgs): Promise<void> {
  p.intro('rad quote MCP installer');

  const env = ENVIRONMENTS[args.env];
  if (!isConfigured(args.env)) {
    p.cancel(
      `The ${args.env} endpoint URL is not configured in this build of the installer yet. See the project README for release status.`,
    );
    process.exit(1);
  }

  let candidates: ClientDescriptor[];
  if (args.clients.length > 0) {
    candidates = clientsById(args.clients);
    p.log.info(`Targeting: ${candidates.map((c) => c.label).join(', ')}`);
  } else {
    candidates = await detectInstalledClients([...ALL_CLIENTS]);
    if (candidates.length === 0) {
      p.cancel(
        'No supported AI clients detected. See the README for manual install snippets, or run with --client=<name> to force.',
      );
      process.exit(1);
    }
    p.log.info(`Detected: ${candidates.map((c) => c.label).join(', ')}`);
  }

  let selected: ClientDescriptor[];
  if (args.clients.length > 0) {
    selected = candidates;
  } else if (args.yes || !process.stdin.isTTY) {
    selected = candidates;
    p.log.info('Non-interactive mode — installing into all detected clients.');
  } else {
    selected = await pickClients(candidates);
  }
  if (selected.length === 0) {
    p.outro('Nothing selected.');
    return;
  }

  let apiKey: string;
  if (args.apiKey) {
    apiKey = args.apiKey;
  } else if (!process.stdin.isTTY) {
    p.cancel('No API key provided and stdin is not a TTY. Pass --api-key=<key>.');
    process.exit(1);
  } else {
    apiKey = await promptApiKey(args.env);
  }

  const outcomes: ClientOutcome[] = [];
  const spinner = p.spinner();
  for (const client of selected) {
    spinner.start(`Configuring ${client.label}`);
    try {
      const result = await client.install({
        env: args.env,
        url: env.url,
        serverKey: env.serverKey,
        apiKey,
        dryRun: args.dryRun,
        force: args.force,
      });
      outcomes.push({ client, result });
      spinner.stop(`${client.label}: ${result.action}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      outcomes.push({ client, error: message });
      spinner.stop(`${client.label}: error`);
    }
  }

  const summary = outcomes.map(summaryLine).join('\n');
  p.note(summary, 'Summary');

  const hadError = outcomes.some((o) => o.error);
  if (hadError) {
    p.outro('Finished with errors. See summary above.');
    process.exit(1);
  }
  p.outro(
    args.dryRun
      ? 'Dry run — no files were written.'
      : 'Done. Restart your AI clients to pick up the new server.',
  );
}

async function main(): Promise<void> {
  const raw = process.argv.slice(2);
  const command = raw[0] ?? 'install';

  if (command === 'help' || command === '-h' || command === '--help') {
    printHelp();
    return;
  }

  if (command !== 'install') {
    console.error(`unknown command: ${command}`);
    process.exit(1);
  }

  const parsed = parseArgs(raw.slice(1));
  if (parsed.help) {
    printHelp();
    return;
  }

  await install(parsed);
}

main().catch((err: unknown) => {
  const msg = err instanceof Error ? err.message : String(err);
  console.error(msg);
  process.exit(1);
});
