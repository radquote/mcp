#!/usr/bin/env node
// Packs this directory into a .mcpb bundle.
//
// Strategy: assemble a clean staging directory in /tmp (outside any npm
// workspace) containing manifest.json, dist/, a lean package.json with runtime
// deps only, then run `npm install --omit=dev` inside it so mcp-remote and its
// transitive deps end up in a non-hoisted node_modules. Finally invoke
// `mcpb pack` against the staging dir and write the artifact next to this
// package. Keeps the workspace root untouched.

import { spawnSync } from 'node:child_process';
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const pkgRoot = dirname(here);
const outputName = process.argv[2] ?? 'radquote-stage.mcpb';
const outputAbs = join(pkgRoot, outputName);

function run(cmd, args, opts = {}) {
  const result = spawnSync(cmd, args, { stdio: 'inherit', ...opts });
  if (result.status !== 0) {
    console.error(`command failed: ${cmd} ${args.join(' ')}`);
    process.exit(result.status ?? 1);
  }
}

run('npx', ['--no-install', 'tsc'], { cwd: pkgRoot });

const staging = mkdtempSync(join(tmpdir(), 'radquote-mcpb-'));
console.log(`staging: ${staging}`);

cpSync(join(pkgRoot, 'manifest.json'), join(staging, 'manifest.json'));
cpSync(join(pkgRoot, 'dist'), join(staging, 'dist'), { recursive: true });
cpSync(join(pkgRoot, 'README.md'), join(staging, 'README.md'));

const srcPkg = JSON.parse(readFileSync(join(pkgRoot, 'package.json'), 'utf8'));
const bundlePkg = {
  name: srcPkg.name,
  version: srcPkg.version,
  description: srcPkg.description,
  license: srcPkg.license,
  type: srcPkg.type,
  main: srcPkg.main,
  engines: srcPkg.engines,
  dependencies: srcPkg.dependencies,
};
writeFileSync(join(staging, 'package.json'), `${JSON.stringify(bundlePkg, null, 2)}\n`);

run('npm', ['install', '--omit=dev', '--no-package-lock', '--no-audit', '--no-fund'], { cwd: staging });

run('npx', ['--no-install', 'mcpb', 'pack', staging, outputAbs], { cwd: pkgRoot });

rmSync(staging, { recursive: true, force: true });

console.log(`\npacked: ${outputAbs}`);
