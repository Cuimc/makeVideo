import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

test('tsconfig package exports all profiles', () => {
  const pkg = JSON.parse(
    readFileSync(
      new URL('../../packages/tsconfig/package.json', import.meta.url),
      'utf8',
    ),
  );

  assert.equal(pkg.name, '@make-video/tsconfig');
  assert.equal(pkg.exports['./base'], './base.json');
  assert.equal(pkg.exports['./web'], './web.json');
  assert.equal(pkg.exports['./server'], './server.json');
  assert.equal(pkg.exports['./library'], './library.json');

  assert.equal(
    existsSync(new URL('../../packages/tsconfig/base.json', import.meta.url)),
    true,
  );
  assert.equal(
    existsSync(new URL('../../packages/tsconfig/web.json', import.meta.url)),
    true,
  );
  assert.equal(
    existsSync(new URL('../../packages/tsconfig/server.json', import.meta.url)),
    true,
  );
  assert.equal(
    existsSync(new URL('../../packages/tsconfig/library.json', import.meta.url)),
    true,
  );
});

test('eslint config package exports base, vue and nest profiles', () => {
  const pkg = JSON.parse(
    readFileSync(
      new URL('../../packages/eslint-config/package.json', import.meta.url),
      'utf8',
    ),
  );

  assert.equal(pkg.name, '@make-video/eslint-config');
  assert.equal(pkg.exports['./base'], './base.mjs');
  assert.equal(pkg.exports['./vue'], './vue.mjs');
  assert.equal(pkg.exports['./nest'], './nest.mjs');

  assert.equal(
    existsSync(new URL('../../packages/eslint-config/base.mjs', import.meta.url)),
    true,
  );
  assert.equal(
    existsSync(new URL('../../packages/eslint-config/vue.mjs', import.meta.url)),
    true,
  );
  assert.equal(
    existsSync(new URL('../../packages/eslint-config/nest.mjs', import.meta.url)),
    true,
  );
});
