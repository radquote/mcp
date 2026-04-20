import test from 'node:test';
import assert from 'node:assert/strict';
import { mergeJSONMcp } from '../src/writer.ts';

test('creates root and server when config is missing', () => {
  const { next, action } = mergeJSONMcp(undefined, {
    rootKey: 'mcpServers',
    serverKey: 'radquote',
    serverConfig: { url: 'https://example/mcp' },
    force: false,
  });
  assert.equal(action, 'created');
  assert.deepEqual(next, { mcpServers: { radquote: { url: 'https://example/mcp' } } });
});

test('preserves unrelated keys at the config root', () => {
  const existing = { theme: 'dark', projects: { a: 1 } };
  const { next, action } = mergeJSONMcp(existing, {
    rootKey: 'mcpServers',
    serverKey: 'radquote',
    serverConfig: { url: 'x' },
    force: false,
  });
  assert.equal(action, 'created');
  assert.equal(next.theme, 'dark');
  assert.deepEqual(next.projects, { a: 1 });
  assert.deepEqual(next.mcpServers, { radquote: { url: 'x' } });
});

test('preserves sibling servers under the same root key', () => {
  const existing = { mcpServers: { other: { command: 'foo' } } };
  const { next, action } = mergeJSONMcp(existing, {
    rootKey: 'mcpServers',
    serverKey: 'radquote',
    serverConfig: { url: 'x' },
    force: false,
  });
  assert.equal(action, 'created');
  assert.deepEqual(next.mcpServers, {
    other: { command: 'foo' },
    radquote: { url: 'x' },
  });
});

test('skips when the target key exists and force is false', () => {
  const existing = { mcpServers: { radquote: { url: 'old' } } };
  const { next, action } = mergeJSONMcp(existing, {
    rootKey: 'mcpServers',
    serverKey: 'radquote',
    serverConfig: { url: 'new' },
    force: false,
  });
  assert.equal(action, 'skipped');
  assert.deepEqual(next, existing);
});

test('overwrites when the target key exists and force is true', () => {
  const existing = { mcpServers: { radquote: { url: 'old' }, other: { command: 'k' } } };
  const { next, action } = mergeJSONMcp(existing, {
    rootKey: 'mcpServers',
    serverKey: 'radquote',
    serverConfig: { url: 'new' },
    force: true,
  });
  assert.equal(action, 'updated');
  const servers = next.mcpServers as Record<string, unknown>;
  assert.deepEqual(servers.radquote, { url: 'new' });
  assert.deepEqual(servers.other, { command: 'k' });
});

test('uses a different root key (e.g. VS Code "servers")', () => {
  const existing = { servers: { prior: { type: 'http' } } };
  const { next, action } = mergeJSONMcp(existing, {
    rootKey: 'servers',
    serverKey: 'radquote',
    serverConfig: { type: 'http' },
    force: false,
  });
  assert.equal(action, 'created');
  assert.deepEqual(next.servers, {
    prior: { type: 'http' },
    radquote: { type: 'http' },
  });
});
