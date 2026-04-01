import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

function read(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), 'utf8');
}

test('root env example exists', () => {
  const rootEnv = read('../../.env.example');
  assert.match(rootEnv, /NODE_ENV=development/);
});

test('web env example exposes the api base url', () => {
  const webEnv = read('../../apps/web/.env.example');
  assert.match(webEnv, /VITE_API_BASE_URL=http:\/\/127\.0\.0\.1:3000/);
});

test('server env example exposes all backend variables', () => {
  const serverEnv = read('../../apps/server/.env.example');
  assert.match(serverEnv, /PORT=3000/);
  assert.match(serverEnv, /DATABASE_URL=mysql:\/\//);
  assert.match(serverEnv, /REDIS_URL=redis:\/\//);
  assert.match(serverEnv, /JWT_SECRET=/);
  assert.match(serverEnv, /SWAGGER_PATH=docs/);
});
