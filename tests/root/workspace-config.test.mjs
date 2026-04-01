import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('root workspace files and scripts exist', () => {
  const pkg = JSON.parse(
    readFileSync(new URL('../../package.json', import.meta.url), 'utf8'),
  );
  const workspace = readFileSync(
    new URL('../../pnpm-workspace.yaml', import.meta.url),
    'utf8',
  );
  const turbo = JSON.parse(
    readFileSync(new URL('../../turbo.json', import.meta.url), 'utf8'),
  );

  assert.equal(pkg.private, true);
  assert.equal(pkg.packageManager.startsWith('pnpm@'), true);
  assert.equal(typeof pkg.scripts.dev, 'string');
  assert.equal(typeof pkg.scripts.build, 'string');
  assert.equal(typeof pkg.scripts.lint, 'string');
  assert.equal(typeof pkg.scripts.typecheck, 'string');
  assert.equal(typeof pkg.scripts.test, 'string');
  assert.equal(typeof pkg.scripts.format, 'string');
  assert.equal(typeof pkg.scripts.clean, 'string');

  assert.match(workspace, /apps\/\*/);
  assert.match(workspace, /packages\/\*/);

  assert.equal(typeof turbo.tasks.dev, 'object');
  assert.equal(typeof turbo.tasks.build, 'object');
  assert.equal(typeof turbo.tasks.typecheck, 'object');
  assert.equal(typeof turbo.tasks.test, 'object');
});
