# Monorepo Scaffold Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 搭建一个轻量稳定的 `pnpm workspace + turbo` monorepo，包含 `apps/web`、`apps/server` 与四个共享包，并打通前端通过 SDK 访问后端健康检查接口的最小链路。

**Architecture:** 根目录只负责工作区、脚本与任务编排；共享工程配置放入 `packages/tsconfig` 与 `packages/eslint-config`；跨端契约与 API 客户端分别放入 `packages/shared` 与 `packages/sdk`。后端先落基础健康检查、Swagger 与基础设施占位模块，前端先落 Vue 壳子、路由、状态管理与健康状态首页。

**Tech Stack:** pnpm workspace, Turbo, TypeScript, tsup, ESLint, Vitest, Vue 3, Vite, Naive UI, Pinia, Vue Router, UnoCSS, NestJS, Prisma, MySQL, Redis, BullMQ, JWT, Swagger, Jest, Supertest

---

## 文件结构与职责

### 根目录

- `package.json`：统一脚本入口，只做调度
- `pnpm-workspace.yaml`：声明 `apps/*` 与 `packages/*`
- `turbo.json`：定义构建、测试、类型检查与开发任务图
- `.gitignore`：忽略依赖、产物、缓存和本地环境文件
- `.nvmrc`：固定 Node 版本
- `README.md`：记录安装、启动与验证方式
- `tests/root/workspace-config.test.mjs`：验证根目录调度文件存在且结构正确
- `tests/root/tooling-packages.test.mjs`：验证共享配置包结构
- `tests/root/env-examples.test.mjs`：验证环境变量示例文件

### 共享工程配置包

- `packages/tsconfig/package.json`：导出各类 TS 配置
- `packages/tsconfig/base.json`：全仓公共 TS 选项
- `packages/tsconfig/web.json`：前端配置
- `packages/tsconfig/server.json`：后端配置
- `packages/tsconfig/library.json`：库包配置
- `packages/eslint-config/package.json`：导出基础、Vue、Nest 三套 ESLint 配置
- `packages/eslint-config/base.mjs`：共享基础规则
- `packages/eslint-config/vue.mjs`：Vue + TypeScript 配置
- `packages/eslint-config/nest.mjs`：Nest + Node 配置

### 共享业务包

- `packages/shared/package.json`：跨端契约包
- `packages/shared/src/health.ts`：健康检查响应类型与运行时守卫
- `packages/shared/src/index.ts`：共享导出入口
- `packages/sdk/package.json`：前端 API SDK 包
- `packages/sdk/src/client.ts`：统一 API Client
- `packages/sdk/src/index.ts`：SDK 导出入口

### 后端

- `apps/server/package.json`：Nest 工作区脚本与依赖
- `apps/server/src/main.ts`：服务启动入口
- `apps/server/src/bootstrap.ts`：统一应用配置与 Swagger 注册
- `apps/server/src/app.module.ts`：根模块
- `apps/server/src/modules/health/*`：健康检查模块
- `apps/server/src/modules/auth/auth.module.ts`：JWT 占位模块
- `apps/server/src/modules/queue/*`：BullMQ 占位模块
- `apps/server/src/prisma/*`：Prisma Service 与模块
- `apps/server/src/redis/*`：Redis Service 与模块
- `apps/server/src/common/config/app-env.ts`：环境变量读取
- `apps/server/test/health.e2e-spec.ts`：健康检查 e2e
- `apps/server/test/docs.e2e-spec.ts`：Swagger 文档 e2e
- `prisma/schema.prisma`：根级 Prisma schema

### 前端

- `apps/web/package.json`：Vite 工作区脚本与依赖
- `apps/web/src/main.ts`：应用注册入口
- `apps/web/src/App.vue`：顶层容器
- `apps/web/src/router/index.ts`：路由
- `apps/web/src/stores/app.ts`：基础应用 store
- `apps/web/src/stores/health.ts`：健康状态 store
- `apps/web/src/apis/client.ts`：基于 SDK 的 API Client 实例
- `apps/web/src/views/HomeView.vue`：首页
- `apps/web/src/views/HomeView.spec.ts`：首页与健康状态测试
- `apps/web/vite.config.ts`：Vite 配置
- `apps/web/uno.config.ts`：UnoCSS 配置
- `apps/web/vitest.config.ts`：Vitest 配置

## 实施顺序

先稳定根目录与共享配置，再建立共享包，然后搭后端、搭前端，最后补环境变量示例和全仓验收。这样可以让后续每个工作区都直接消费前面已经稳定的约束，不会反复返工。

### Task 1: 建立根目录 workspace 与调度骨架

**Files:**
- Create: `tests/root/workspace-config.test.mjs`
- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Create: `turbo.json`
- Create: `.gitignore`
- Create: `.nvmrc`
- Create: `README.md`

- [ ] **Step 1: 先写根目录结构校验测试**

```js
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
```

- [ ] **Step 2: 运行测试，确认当前仓库确实缺少这些文件**

Run: `node --test tests/root/workspace-config.test.mjs`

Expected: FAIL，并出现 `ENOENT` 或断言失败，说明根目录工作区文件尚未建立。

- [ ] **Step 3: 用最小可用内容建立根目录骨架**

`package.json`

```json
{
  "name": "make-video",
  "private": true,
  "packageManager": "pnpm@10",
  "scripts": {
    "predev": "pnpm --filter @make-video/shared build && pnpm --filter @make-video/sdk build",
    "dev": "turbo run dev --parallel --filter=@make-video/shared --filter=@make-video/sdk --filter=@make-video/server --filter=@make-video/web",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "typecheck": "turbo run typecheck",
    "test": "turbo run test",
    "format": "prettier --write .",
    "clean": "turbo run clean"
  }
}
```

`pnpm-workspace.yaml`

```yaml
packages:
  - apps/*
  - packages/*
```

`turbo.json`

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "dev": {
      "cache": false,
      "persistent": true
    },
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".vite/**", "coverage/**"]
    },
    "lint": {
      "outputs": []
    },
    "typecheck": {
      "dependsOn": ["^build"],
      "outputs": []
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    },
    "clean": {
      "cache": false
    }
  }
}
```

`.gitignore`

```gitignore
node_modules
dist
coverage
.turbo
.DS_Store
.env
.env.local
.env.*.local
```

`.nvmrc`

```text
22
```

`README.md`

```md
# makeVideo

基于 `pnpm workspace + turbo` 的前后端 monorepo。

## 目录

- `apps/web`：Vue 3 前端
- `apps/server`：NestJS 后端
- `packages/*`：共享配置与共享代码

## 常用命令

- `pnpm install`
- `pnpm dev`
- `pnpm build`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
```

安装根目录开发依赖：

```bash
pnpm add -Dw turbo typescript tsup prettier eslint vitest @vitest/coverage-v8 @types/node
```

- [ ] **Step 4: 重新运行根目录测试，确认骨架通过**

Run: `node --test tests/root/workspace-config.test.mjs`

Expected: PASS，至少 1 个测试通过。

- [ ] **Step 5: 提交当前任务**

```bash
git add package.json pnpm-workspace.yaml turbo.json .gitignore .nvmrc README.md tests/root/workspace-config.test.mjs
git commit -m "chore: add monorepo root workspace"
```

### Task 2: 建立共享 TypeScript 与 ESLint 配置包

**Files:**
- Create: `tests/root/tooling-packages.test.mjs`
- Modify: `package.json`
- Create: `packages/tsconfig/package.json`
- Create: `packages/tsconfig/base.json`
- Create: `packages/tsconfig/web.json`
- Create: `packages/tsconfig/server.json`
- Create: `packages/tsconfig/library.json`
- Create: `packages/eslint-config/package.json`
- Create: `packages/eslint-config/base.mjs`
- Create: `packages/eslint-config/vue.mjs`
- Create: `packages/eslint-config/nest.mjs`

- [ ] **Step 1: 先写共享配置包结构测试**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

test('tsconfig package exports all profiles', () => {
  const pkg = JSON.parse(
    readFileSync(new URL('../../packages/tsconfig/package.json', import.meta.url), 'utf8'),
  );

  assert.equal(pkg.name, '@make-video/tsconfig');
  assert.equal(pkg.exports['./base'], './base.json');
  assert.equal(pkg.exports['./web'], './web.json');
  assert.equal(pkg.exports['./server'], './server.json');
  assert.equal(pkg.exports['./library'], './library.json');

  assert.equal(existsSync(new URL('../../packages/tsconfig/base.json', import.meta.url)), true);
  assert.equal(existsSync(new URL('../../packages/tsconfig/web.json', import.meta.url)), true);
  assert.equal(existsSync(new URL('../../packages/tsconfig/server.json', import.meta.url)), true);
  assert.equal(existsSync(new URL('../../packages/tsconfig/library.json', import.meta.url)), true);
});

test('eslint config package exports base, vue and nest profiles', () => {
  const pkg = JSON.parse(
    readFileSync(new URL('../../packages/eslint-config/package.json', import.meta.url), 'utf8'),
  );

  assert.equal(pkg.name, '@make-video/eslint-config');
  assert.equal(pkg.exports['./base'], './base.mjs');
  assert.equal(pkg.exports['./vue'], './vue.mjs');
  assert.equal(pkg.exports['./nest'], './nest.mjs');

  assert.equal(existsSync(new URL('../../packages/eslint-config/base.mjs', import.meta.url)), true);
  assert.equal(existsSync(new URL('../../packages/eslint-config/vue.mjs', import.meta.url)), true);
  assert.equal(existsSync(new URL('../../packages/eslint-config/nest.mjs', import.meta.url)), true);
});
```

- [ ] **Step 2: 运行测试，确认共享配置包还不存在**

Run: `node --test tests/root/tooling-packages.test.mjs`

Expected: FAIL，并出现 `ENOENT` 或断言失败。

- [ ] **Step 3: 创建共享配置包并补齐依赖**

`packages/tsconfig/package.json`

```json
{
  "name": "@make-video/tsconfig",
  "version": "0.0.0",
  "private": true,
  "exports": {
    "./base": "./base.json",
    "./web": "./web.json",
    "./server": "./server.json",
    "./library": "./library.json"
  }
}
```

`packages/tsconfig/base.json`

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "useDefineForClassFields": true
  }
}
```

`packages/tsconfig/web.json`

```json
{
  "extends": "./base.json",
  "compilerOptions": {
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "types": ["vite/client"]
  }
}
```

`packages/tsconfig/server.json`

```json
{
  "extends": "./base.json",
  "compilerOptions": {
    "module": "CommonJS",
    "moduleResolution": "Node",
    "lib": ["ES2022"],
    "types": ["node"]
  }
}
```

`packages/tsconfig/library.json`

```json
{
  "extends": "./base.json",
  "compilerOptions": {
    "lib": ["ES2022"],
    "types": ["node"]
  }
}
```

`packages/eslint-config/package.json`

```json
{
  "name": "@make-video/eslint-config",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "exports": {
    "./base": "./base.mjs",
    "./vue": "./vue.mjs",
    "./nest": "./nest.mjs"
  }
}
```

`packages/eslint-config/base.mjs`

```js
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: ['dist', 'coverage', '.turbo', 'node_modules'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
];
```

`packages/eslint-config/vue.mjs`

```js
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';

export default [
  {
    ignores: ['dist', 'coverage', '.turbo', 'node_modules'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        sourceType: 'module',
      },
    },
  },
];
```

`packages/eslint-config/nest.mjs`

```js
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default [
  {
    ignores: ['dist', 'coverage', '.turbo', 'node_modules'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
];
```

安装 ESLint 相关依赖：

```bash
pnpm add -Dw @eslint/js typescript-eslint eslint-plugin-vue vue-eslint-parser globals
```

- [ ] **Step 4: 重新运行结构测试**

Run: `node --test tests/root/tooling-packages.test.mjs`

Expected: PASS，两个测试都通过。

- [ ] **Step 5: 提交当前任务**

```bash
git add tests/root/tooling-packages.test.mjs packages/tsconfig packages/eslint-config package.json
git commit -m "chore: add shared tooling packages"
```

### Task 3: 建立 `@make-video/shared` 与 `@make-video/sdk`

**Files:**
- Create: `packages/shared/package.json`
- Create: `packages/shared/tsconfig.json`
- Create: `packages/shared/eslint.config.mjs`
- Create: `packages/shared/src/health.ts`
- Create: `packages/shared/src/index.ts`
- Create: `packages/shared/src/index.test.ts`
- Create: `packages/sdk/package.json`
- Create: `packages/sdk/tsconfig.json`
- Create: `packages/sdk/eslint.config.mjs`
- Create: `packages/sdk/src/client.ts`
- Create: `packages/sdk/src/index.ts`
- Create: `packages/sdk/src/client.test.ts`

- [ ] **Step 1: 先为共享包写失败测试**

`packages/shared/src/index.test.ts`

```ts
import { describe, expect, it } from 'vitest';
import { HEALTH_SERVICE_NAME, HEALTH_STATUS_OK, isHealthResponse } from './index';

describe('shared health contract', () => {
  it('accepts a valid health payload', () => {
    expect(
      isHealthResponse({
        status: HEALTH_STATUS_OK,
        service: HEALTH_SERVICE_NAME,
        timestamp: '2026-04-01T00:00:00.000Z',
      }),
    ).toBe(true);
  });

  it('rejects an invalid health payload', () => {
    expect(
      isHealthResponse({
        status: 'down',
        service: HEALTH_SERVICE_NAME,
      }),
    ).toBe(false);
  });
});
```

`packages/sdk/src/client.test.ts`

```ts
import { describe, expect, it, vi } from 'vitest';
import { createApiClient } from './client';

describe('createApiClient', () => {
  it('requests the backend health endpoint and returns the parsed payload', async () => {
    const fetcher = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          status: 'ok',
          service: 'make-video-server',
          timestamp: '2026-04-01T00:00:00.000Z',
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      ),
    );

    const client = createApiClient({
      baseUrl: 'http://127.0.0.1:3000',
      fetcher,
    });

    const payload = await client.getHealth();

    expect(fetcher).toHaveBeenCalledWith('http://127.0.0.1:3000/api/health');
    expect(payload.status).toBe('ok');
    expect(payload.service).toBe('make-video-server');
  });
});
```

- [ ] **Step 2: 运行测试，确认共享包尚未实现**

Run: `pnpm --filter @make-video/shared test`

Expected: FAIL，提示找不到测试脚本、包文件或导出实现。

Run: `pnpm --filter @make-video/sdk test`

Expected: FAIL，原因同上。

- [ ] **Step 3: 用最小实现补齐两个共享包**

`packages/shared/package.json`

```json
{
  "name": "@make-video/shared",
  "version": "0.0.0",
  "private": true,
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    }
  },
  "devDependencies": {
    "@make-video/eslint-config": "workspace:*",
    "@make-video/tsconfig": "workspace:*"
  },
  "scripts": {
    "build": "tsup src/index.ts --format esm,cjs --dts",
    "dev": "tsup src/index.ts --format esm,cjs --dts --watch",
    "lint": "eslint \"src/**/*.ts\"",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "test": "vitest run",
    "clean": "rm -rf dist coverage"
  }
}
```

`packages/shared/tsconfig.json`

```json
{
  "extends": "@make-video/tsconfig/library",
  "compilerOptions": {
    "rootDir": "./src"
  },
  "include": ["src/**/*.ts"]
}
```

`packages/shared/eslint.config.mjs`

```js
import config from '@make-video/eslint-config/base';

export default config;
```

`packages/shared/src/health.ts`

```ts
export const HEALTH_STATUS_OK = 'ok';
export const HEALTH_SERVICE_NAME = 'make-video-server';

export interface HealthResponse {
  status: typeof HEALTH_STATUS_OK;
  service: typeof HEALTH_SERVICE_NAME;
  timestamp: string;
}

export function isHealthResponse(value: unknown): value is HealthResponse {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;

  return (
    record.status === HEALTH_STATUS_OK &&
    record.service === HEALTH_SERVICE_NAME &&
    typeof record.timestamp === 'string'
  );
}
```

`packages/shared/src/index.ts`

```ts
export * from './health';
```

`packages/sdk/package.json`

```json
{
  "name": "@make-video/sdk",
  "version": "0.0.0",
  "private": true,
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    }
  },
  "dependencies": {
    "@make-video/shared": "workspace:*"
  },
  "devDependencies": {
    "@make-video/eslint-config": "workspace:*",
    "@make-video/tsconfig": "workspace:*"
  },
  "scripts": {
    "build": "tsup src/index.ts --format esm,cjs --dts",
    "dev": "tsup src/index.ts --format esm,cjs --dts --watch",
    "lint": "eslint \"src/**/*.ts\"",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "test": "vitest run",
    "clean": "rm -rf dist coverage"
  }
}
```

`packages/sdk/tsconfig.json`

```json
{
  "extends": "@make-video/tsconfig/library",
  "compilerOptions": {
    "rootDir": "./src"
  },
  "include": ["src/**/*.ts"]
}
```

`packages/sdk/eslint.config.mjs`

```js
import config from '@make-video/eslint-config/base';

export default config;
```

`packages/sdk/src/client.ts`

```ts
import { isHealthResponse, type HealthResponse } from '@make-video/shared';

export interface ApiClientOptions {
  baseUrl: string;
  fetcher?: typeof fetch;
}

export function createApiClient(options: ApiClientOptions) {
  const baseUrl = options.baseUrl.replace(/\/$/, '');
  const fetcher = options.fetcher ?? fetch;

  return {
    async getHealth(): Promise<HealthResponse> {
      const response = await fetcher(`${baseUrl}/api/health`);

      if (!response.ok) {
        throw new Error(`Health request failed with status ${response.status}`);
      }

      const payload = await response.json();

      if (!isHealthResponse(payload)) {
        throw new Error('Invalid health response payload');
      }

      return payload;
    },
  };
}
```

`packages/sdk/src/index.ts`

```ts
export * from './client';
```

安装共享包依赖：

```bash
pnpm install
```

- [ ] **Step 4: 重新运行共享包测试**

Run: `pnpm --filter @make-video/shared test`

Expected: PASS，`shared health contract` 下的两个测试通过。

Run: `pnpm --filter @make-video/sdk test`

Expected: PASS，`createApiClient` 测试通过。

Run: `pnpm --filter @make-video/shared build`

Expected: PASS，并生成 `packages/shared/dist`。

Run: `pnpm --filter @make-video/sdk build`

Expected: PASS，并生成 `packages/sdk/dist`。

- [ ] **Step 5: 提交当前任务**

```bash
git add packages/shared packages/sdk pnpm-lock.yaml
git commit -m "feat: add shared contracts and sdk"
```

### Task 4: 搭建 Nest 后端基础骨架与健康检查

**Files:**
- Create: `apps/server/package.json`
- Create: `apps/server/tsconfig.json`
- Create: `apps/server/tsconfig.build.json`
- Create: `apps/server/nest-cli.json`
- Create: `apps/server/eslint.config.mjs`
- Create: `apps/server/src/main.ts`
- Create: `apps/server/src/app.module.ts`
- Create: `apps/server/src/modules/health/health.module.ts`
- Create: `apps/server/src/modules/health/health.controller.ts`
- Create: `apps/server/src/modules/health/health.service.ts`
- Create: `apps/server/test/jest-e2e.json`
- Create: `apps/server/test/health.e2e-spec.ts`

- [ ] **Step 1: 先写健康检查 e2e 失败用例**

```ts
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Health endpoint (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('returns the service health payload', async () => {
    const response = await request(app.getHttpServer()).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 'ok',
      service: 'make-video-server',
      timestamp: expect.any(String),
    });
  });
});
```

- [ ] **Step 2: 运行 e2e，确认后端还不存在**

Run: `pnpm --filter @make-video/server test`

Expected: FAIL，提示缺少 `@make-video/server` 包或缺少 `AppModule`。

- [ ] **Step 3: 用最小可运行的 Nest 结构让测试变绿**

`apps/server/package.json`

```json
{
  "name": "@make-video/server",
  "version": "0.0.0",
  "private": true,
  "dependencies": {
    "@make-video/shared": "workspace:*",
    "@nestjs/common": "^11.0.0",
    "@nestjs/core": "^11.0.0",
    "@nestjs/platform-express": "^11.0.0",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.1",
    "reflect-metadata": "^0.2.2",
    "rxjs": "^7.8.1"
  },
  "devDependencies": {
    "@make-video/eslint-config": "workspace:*",
    "@make-video/tsconfig": "workspace:*",
    "@nestjs/cli": "^11.0.0",
    "@nestjs/testing": "^11.0.0",
    "@types/jest": "^29.5.14",
    "@types/supertest": "^6.0.3",
    "jest": "^29.7.0",
    "supertest": "^7.0.0",
    "ts-jest": "^29.2.5",
    "ts-node": "^10.9.2"
  },
  "scripts": {
    "build": "nest build",
    "dev": "nest start --watch",
    "lint": "eslint \"src/**/*.ts\" \"test/**/*.ts\"",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "test": "jest --config ./test/jest-e2e.json",
    "clean": "rm -rf dist coverage"
  }
}
```

`apps/server/tsconfig.json`

```json
{
  "extends": "@make-video/tsconfig/server",
  "compilerOptions": {
    "declaration": true,
    "outDir": "./dist",
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "strictPropertyInitialization": false
  },
  "include": ["src/**/*.ts", "test/**/*.ts"]
}
```

`apps/server/tsconfig.build.json`

```json
{
  "extends": "./tsconfig.json",
  "exclude": ["test/**/*.ts"]
}
```

`apps/server/nest-cli.json`

```json
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "tsConfigPath": "tsconfig.build.json"
  }
}
```

`apps/server/eslint.config.mjs`

```js
import config from '@make-video/eslint-config/nest';

export default config;
```

`apps/server/src/main.ts`

```ts
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  await app.listen(process.env.PORT ? Number(process.env.PORT) : 3000);
}

void bootstrap();
```

`apps/server/src/app.module.ts`

```ts
import { Module } from '@nestjs/common';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [HealthModule],
})
export class AppModule {}
```

`apps/server/src/modules/health/health.module.ts`

```ts
import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

@Module({
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
```

`apps/server/src/modules/health/health.controller.ts`

```ts
import { Controller, Get } from '@nestjs/common';
import type { HealthResponse } from '@make-video/shared';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  getHealth(): HealthResponse {
    return this.healthService.getHealth();
  }
}
```

`apps/server/src/modules/health/health.service.ts`

```ts
import { Injectable } from '@nestjs/common';
import {
  HEALTH_SERVICE_NAME,
  HEALTH_STATUS_OK,
  type HealthResponse,
} from '@make-video/shared';

@Injectable()
export class HealthService {
  getHealth(): HealthResponse {
    return {
      status: HEALTH_STATUS_OK,
      service: HEALTH_SERVICE_NAME,
      timestamp: new Date().toISOString(),
    };
  }
}
```

`apps/server/test/jest-e2e.json`

```json
{
  "moduleFileExtensions": ["js", "json", "ts"],
  "rootDir": "..",
  "testEnvironment": "node",
  "testRegex": "test/.*\\.e2e-spec\\.ts$",
  "transform": {
    "^.+\\.(t|j)s$": "ts-jest"
  }
}
```

安装后端依赖：

```bash
pnpm install
```

- [ ] **Step 4: 重新运行健康检查 e2e**

Run: `pnpm --filter @make-video/server test`

Expected: PASS，`Health endpoint (e2e)` 通过。

- [ ] **Step 5: 提交当前任务**

```bash
git add apps/server pnpm-lock.yaml
git commit -m "feat: add nest health module"
```

### Task 5: 接入 Swagger 与后端基础设施占位模块

**Files:**
- Modify: `package.json`
- Modify: `apps/server/package.json`
- Create: `apps/server/src/bootstrap.ts`
- Create: `apps/server/src/common/config/app-env.ts`
- Create: `apps/server/src/modules/auth/auth.module.ts`
- Create: `apps/server/src/modules/queue/queue.module.ts`
- Create: `apps/server/src/modules/queue/queue.service.ts`
- Create: `apps/server/src/prisma/prisma.module.ts`
- Create: `apps/server/src/prisma/prisma.service.ts`
- Create: `apps/server/src/redis/redis.module.ts`
- Create: `apps/server/src/redis/redis.service.ts`
- Create: `apps/server/test/docs.e2e-spec.ts`
- Create: `prisma/schema.prisma`
- Create: `apps/server/.env.example`
- Modify: `apps/server/src/main.ts`
- Modify: `apps/server/src/app.module.ts`
- Modify: `apps/server/test/health.e2e-spec.ts`

- [ ] **Step 1: 先写 Swagger 文档失败测试，并把健康检查验证改为真实前缀**

`apps/server/test/docs.e2e-spec.ts`

```ts
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/bootstrap';

describe('Swagger docs (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await configureApp(app);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('exposes the OpenAPI json document', async () => {
    const response = await request(app.getHttpServer()).get('/docs-json');

    expect(response.status).toBe(200);
    expect(response.body.openapi).toBe('3.0.0');
    expect(response.body.paths['/api/health']).toBeDefined();
  });
});
```

`apps/server/test/health.e2e-spec.ts`

```ts
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/bootstrap';

describe('Health endpoint (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await configureApp(app);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('returns the service health payload', async () => {
    const response = await request(app.getHttpServer()).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 'ok',
      service: 'make-video-server',
      timestamp: expect.any(String),
    });
  });
});
```

- [ ] **Step 2: 运行后端测试，确认 Swagger 与基础设施模块尚未补齐**

Run: `pnpm --filter @make-video/server test`

Expected: FAIL，提示 `configureApp` 不存在、`/docs-json` 为 404，或模块导入失败。

- [ ] **Step 3: 增加应用配置、Swagger 和基础设施占位实现**

`apps/server/src/common/config/app-env.ts`

```ts
export interface AppEnv {
  port: number;
  swaggerPath: string;
  databaseUrl: string;
  redisUrl: string;
  jwtSecret: string;
}

export function getAppEnv(env: NodeJS.ProcessEnv = process.env): AppEnv {
  return {
    port: Number(env.PORT ?? 3000),
    swaggerPath: env.SWAGGER_PATH ?? 'docs',
    databaseUrl:
      env.DATABASE_URL ?? 'mysql://root:password@127.0.0.1:3306/make_video',
    redisUrl: env.REDIS_URL ?? 'redis://127.0.0.1:6379',
    jwtSecret: env.JWT_SECRET ?? 'dev-jwt-secret',
  };
}
```

`apps/server/src/bootstrap.ts`

```ts
import { ValidationPipe, type INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { getAppEnv } from './common/config/app-env';

export async function configureApp(app: INestApplication) {
  const env = getAppEnv();

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('makeVideo API')
      .setDescription('Monorepo scaffold backend API')
      .setVersion('0.1.0')
      .build(),
  );

  SwaggerModule.setup(env.swaggerPath, app, document, {
    jsonDocumentUrl: `${env.swaggerPath}-json`,
  });
}
```

`apps/server/src/modules/auth/auth.module.ts`

```ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { getAppEnv } from '../../common/config/app-env';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: getAppEnv().jwtSecret,
      signOptions: {
        expiresIn: '1h',
      },
    }),
  ],
})
export class AuthModule {}
```

`apps/server/src/redis/redis.service.ts`

```ts
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { getAppEnv } from '../common/config/app-env';

@Injectable()
export class RedisService {
  private client: Redis | null = null;

  getClient() {
    if (!this.client) {
      this.client = new Redis(getAppEnv().redisUrl, {
        lazyConnect: true,
        maxRetriesPerRequest: null,
      });
    }

    return this.client;
  }
}
```

`apps/server/src/redis/redis.module.ts`

```ts
import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
```

`apps/server/src/modules/queue/queue.service.ts`

```ts
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { RedisService } from '../../redis/redis.service';

@Injectable()
export class QueueService {
  constructor(private readonly redisService: RedisService) {}

  createQueue(name: string) {
    return new Queue(name, {
      connection: this.redisService.getClient().duplicate({
        lazyConnect: true,
      }),
    });
  }
}
```

`apps/server/src/modules/queue/queue.module.ts`

```ts
import { Module } from '@nestjs/common';
import { RedisModule } from '../../redis/redis.module';
import { QueueService } from './queue.service';

@Module({
  imports: [RedisModule],
  providers: [QueueService],
  exports: [QueueService],
})
export class QueueModule {}
```

`apps/server/src/prisma/prisma.service.ts`

```ts
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { getAppEnv } from '../common/config/app-env';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({
      datasources: {
        db: {
          url: getAppEnv().databaseUrl,
        },
      },
    });
  }
}
```

`apps/server/src/prisma/prisma.module.ts`

```ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

`apps/server/src/app.module.ts`

```ts
import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';
import { QueueModule } from './modules/queue/queue.module';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [AuthModule, HealthModule, QueueModule, PrismaModule, RedisModule],
})
export class AppModule {}
```

`apps/server/src/main.ts`

```ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configureApp } from './bootstrap';
import { getAppEnv } from './common/config/app-env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await configureApp(app);
  await app.listen(getAppEnv().port);
}

void bootstrap();
```

`prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

`apps/server/.env.example`

```dotenv
PORT=3000
DATABASE_URL=mysql://root:password@127.0.0.1:3306/make_video
REDIS_URL=redis://127.0.0.1:6379
JWT_SECRET=dev-jwt-secret
SWAGGER_PATH=docs
```

安装后端新增依赖并生成 Prisma Client：

```bash
pnpm --filter @make-video/server add @nestjs/swagger @nestjs/jwt swagger-ui-express bullmq ioredis @prisma/client
pnpm add -Dw prisma
pnpm exec prisma generate --schema prisma/schema.prisma
```

- [ ] **Step 4: 重新运行后端测试**

Run: `pnpm --filter @make-video/server test`

Expected: PASS，`Health endpoint (e2e)` 与 `Swagger docs (e2e)` 都通过。

- [ ] **Step 5: 提交当前任务**

```bash
git add apps/server prisma package.json pnpm-lock.yaml
git commit -m "feat: add backend infrastructure placeholders"
```

### Task 6: 搭建 Vue 前端骨架与基础首页

**Files:**
- Create: `apps/web/package.json`
- Create: `apps/web/tsconfig.json`
- Create: `apps/web/tsconfig.node.json`
- Create: `apps/web/eslint.config.mjs`
- Create: `apps/web/vite.config.ts`
- Create: `apps/web/vitest.config.ts`
- Create: `apps/web/uno.config.ts`
- Create: `apps/web/index.html`
- Create: `apps/web/src/main.ts`
- Create: `apps/web/src/App.vue`
- Create: `apps/web/src/router/index.ts`
- Create: `apps/web/src/stores/app.ts`
- Create: `apps/web/src/views/HomeView.vue`
- Create: `apps/web/src/views/HomeView.spec.ts`
- Create: `apps/web/src/styles/main.css`

- [ ] **Step 1: 先写首页渲染失败测试**

```ts
import { createPinia } from 'pinia';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import HomeView from './HomeView.vue';

describe('HomeView', () => {
  it('renders the monorepo dashboard title', () => {
    const wrapper = mount(HomeView, {
      global: {
        plugins: [createPinia()],
      },
    });

    expect(wrapper.text()).toContain('Make Video Console');
    expect(wrapper.text()).toContain('前后端 Monorepo 已初始化');
  });
});
```

- [ ] **Step 2: 运行前端测试，确认前端工作区尚未存在**

Run: `pnpm --filter @make-video/web test`

Expected: FAIL，提示缺少 `@make-video/web` 包或测试文件。

- [ ] **Step 3: 建立前端壳子并让首页测试通过**

`apps/web/package.json`

```json
{
  "name": "@make-video/web",
  "version": "0.0.0",
  "private": true,
  "dependencies": {
    "@make-video/sdk": "workspace:*",
    "naive-ui": "^2.40.0",
    "pinia": "^3.0.1",
    "vue": "^3.5.13",
    "vue-router": "^4.5.0"
  },
  "devDependencies": {
    "@make-video/eslint-config": "workspace:*",
    "@make-video/tsconfig": "workspace:*",
    "@vitejs/plugin-vue": "^5.2.1",
    "@vue/test-utils": "^2.4.6",
    "happy-dom": "^16.8.1",
    "unocss": "^0.65.4",
    "vite": "^6.2.0",
    "vitest": "^3.0.8",
    "vue-tsc": "^2.2.8"
  },
  "scripts": {
    "build": "vue-tsc --noEmit && vite build",
    "dev": "vite",
    "lint": "eslint .",
    "typecheck": "vue-tsc --noEmit",
    "test": "vitest run",
    "clean": "rm -rf dist coverage"
  }
}
```

`apps/web/tsconfig.json`

```json
{
  "extends": "@make-video/tsconfig/web",
  "compilerOptions": {
    "baseUrl": "."
  },
  "include": ["src/**/*.ts", "src/**/*.vue", "vite.config.ts", "vitest.config.ts", "uno.config.ts"]
}
```

`apps/web/tsconfig.node.json`

```json
{
  "extends": "@make-video/tsconfig/web",
  "compilerOptions": {
    "composite": true
  },
  "include": ["vite.config.ts", "vitest.config.ts", "uno.config.ts"]
}
```

`apps/web/eslint.config.mjs`

```js
import config from '@make-video/eslint-config/vue';

export default config;
```

`apps/web/vite.config.ts`

```ts
import { defineConfig } from 'vite';
import Vue from '@vitejs/plugin-vue';
import UnoCSS from 'unocss/vite';

export default defineConfig({
  plugins: [Vue(), UnoCSS()],
  server: {
    host: '127.0.0.1',
    port: 5173,
  },
});
```

`apps/web/vitest.config.ts`

```ts
import { defineConfig } from 'vitest/config';
import Vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [Vue()],
  test: {
    environment: 'happy-dom',
  },
});
```

`apps/web/uno.config.ts`

```ts
import { defineConfig, presetAttributify, presetUno } from 'unocss';

export default defineConfig({
  presets: [presetUno(), presetAttributify()],
});
```

`apps/web/index.html`

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Make Video Console</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
  </html>
```

`apps/web/src/main.ts`

```ts
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { create, NConfigProvider, NMessageProvider } from 'naive-ui';
import App from './App.vue';
import router from './router';
import 'virtual:uno.css';
import './styles/main.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(
  create({
    components: [NConfigProvider, NMessageProvider],
  }),
);

app.mount('#app');
```

`apps/web/src/App.vue`

```vue
<template>
  <RouterView />
</template>
```

`apps/web/src/router/index.ts`

```ts
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
  ],
});
```

`apps/web/src/stores/app.ts`

```ts
import { defineStore } from 'pinia';

export const useAppStore = defineStore('app', {
  state: () => ({
    title: 'Make Video Console',
    subtitle: '前后端 Monorepo 已初始化',
  }),
});
```

`apps/web/src/views/HomeView.vue`

```vue
<script setup lang="ts">
import { NCard, NTag } from 'naive-ui';
import { storeToRefs } from 'pinia';
import { useAppStore } from '../stores/app';

const appStore = useAppStore();
const { title, subtitle } = storeToRefs(appStore);
</script>

<template>
  <main class="min-h-screen bg-slate-100 p-10 text-slate-900">
    <div class="mx-auto max-w-4xl">
      <NCard title="控制台概览">
        <div class="space-y-4">
          <div>
            <h1 class="text-3xl font-bold">{{ title }}</h1>
            <p class="mt-2 text-base text-slate-600">{{ subtitle }}</p>
          </div>
          <NTag type="success" size="large">Vue 3 + Vite + Pinia + Router + UnoCSS</NTag>
        </div>
      </NCard>
    </div>
  </main>
</template>
```

`apps/web/src/styles/main.css`

```css
:root {
  color: #0f172a;
  background: #f8fafc;
  font-family: 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
}

body {
  margin: 0;
}
```

安装前端依赖：

```bash
pnpm install
```

- [ ] **Step 4: 重新运行首页测试**

Run: `pnpm --filter @make-video/web test`

Expected: PASS，`HomeView` 首页渲染测试通过。

- [ ] **Step 5: 提交当前任务**

```bash
git add apps/web pnpm-lock.yaml
git commit -m "feat: add vue app shell"
```

### Task 7: 让前端通过 SDK 获取后端健康状态

**Files:**
- Create: `apps/web/src/apis/client.ts`
- Create: `apps/web/src/stores/health.ts`
- Modify: `apps/web/src/views/HomeView.vue`
- Modify: `apps/web/src/views/HomeView.spec.ts`

- [ ] **Step 1: 先把首页测试改成真正验证 SDK 联调链路**

`apps/web/src/views/HomeView.spec.ts`

```ts
import { createPinia } from 'pinia';
import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import HomeView from './HomeView.vue';

const getHealth = vi.fn();

vi.mock('../apis/client', () => ({
  apiClient: {
    getHealth,
  },
}));

describe('HomeView', () => {
  beforeEach(() => {
    getHealth.mockReset();
  });

  it('renders backend health status loaded through the sdk client', async () => {
    getHealth.mockResolvedValue({
      status: 'ok',
      service: 'make-video-server',
      timestamp: '2026-04-01T00:00:00.000Z',
    });

    const wrapper = mount(HomeView, {
      global: {
        plugins: [createPinia()],
      },
    });

    await flushPromises();

    expect(getHealth).toHaveBeenCalledTimes(1);
    expect(wrapper.text()).toContain('API 状态：ok');
    expect(wrapper.text()).toContain('服务名：make-video-server');
  });
});
```

- [ ] **Step 2: 运行首页测试，确认健康状态能力尚未实现**

Run: `pnpm --filter @make-video/web test`

Expected: FAIL，提示找不到 `../apis/client`、找不到健康 store，或断言文本不存在。

- [ ] **Step 3: 增加 API Client、健康状态 store，并把首页接起来**

`apps/web/src/apis/client.ts`

```ts
import { createApiClient } from '@make-video/sdk';

export const apiClient = createApiClient({
  baseUrl: import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:3000',
});
```

`apps/web/src/stores/health.ts`

```ts
import { defineStore } from 'pinia';
import { apiClient } from '../apis/client';

interface HealthState {
  status: string;
  service: string;
  timestamp: string;
  loading: boolean;
  error: string;
}

export const useHealthStore = defineStore('health', {
  state: (): HealthState => ({
    status: 'idle',
    service: '-',
    timestamp: '-',
    loading: false,
    error: '',
  }),
  actions: {
    async loadHealth() {
      this.loading = true;
      this.error = '';

      try {
        const payload = await apiClient.getHealth();
        this.status = payload.status;
        this.service = payload.service;
        this.timestamp = payload.timestamp;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'unknown error';
      } finally {
        this.loading = false;
      }
    },
  },
});
```

`apps/web/src/views/HomeView.vue`

```vue
<script setup lang="ts">
import { NCard, NDescriptions, NDescriptionsItem, NTag } from 'naive-ui';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
import { useAppStore } from '../stores/app';
import { useHealthStore } from '../stores/health';

const appStore = useAppStore();
const healthStore = useHealthStore();

const { title, subtitle } = storeToRefs(appStore);
const { status, service, timestamp, error } = storeToRefs(healthStore);

onMounted(() => {
  void healthStore.loadHealth();
});
</script>

<template>
  <main class="min-h-screen bg-slate-100 p-10 text-slate-900">
    <div class="mx-auto max-w-4xl">
      <NCard title="控制台概览">
        <div class="space-y-6">
          <div>
            <h1 class="text-3xl font-bold">{{ title }}</h1>
            <p class="mt-2 text-base text-slate-600">{{ subtitle }}</p>
          </div>

          <NTag type="success" size="large">Vue 3 + Vite + Pinia + Router + UnoCSS</NTag>

          <NDescriptions bordered :column="1" label-placement="left">
            <NDescriptionsItem label="API 状态">{{ status }}</NDescriptionsItem>
            <NDescriptionsItem label="服务名">{{ service }}</NDescriptionsItem>
            <NDescriptionsItem label="时间戳">{{ timestamp }}</NDescriptionsItem>
            <NDescriptionsItem label="错误信息">{{ error || '无' }}</NDescriptionsItem>
          </NDescriptions>
        </div>
      </NCard>
    </div>
  </main>
</template>
```

- [ ] **Step 4: 重新运行首页测试**

Run: `pnpm --filter @make-video/web test`

Expected: PASS，首页会在测试中通过 mocked SDK 渲染健康状态。

- [ ] **Step 5: 提交当前任务**

```bash
git add apps/web
git commit -m "feat: show backend health status in web app"
```

### Task 8: 补齐环境变量示例与使用说明

**Files:**
- Create: `tests/root/env-examples.test.mjs`
- Create: `.env.example`
- Create: `apps/web/.env.example`
- Modify: `README.md`

- [ ] **Step 1: 先写环境变量示例文件测试**

```js
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
```

- [ ] **Step 2: 运行环境变量测试，确认示例文件还未补齐**

Run: `node --test tests/root/env-examples.test.mjs`

Expected: FAIL，提示 `.env.example` 不存在或内容断言失败。

- [ ] **Step 3: 创建示例文件并完善 README**

`.env.example`

```dotenv
NODE_ENV=development
```

`apps/web/.env.example`

```dotenv
VITE_API_BASE_URL=http://127.0.0.1:3000
```

`README.md`

```md
# makeVideo

基于 `pnpm workspace + turbo` 的前后端 monorepo。

## 目录

- `apps/web`：Vue 3 前端
- `apps/server`：NestJS 后端
- `packages/shared`：跨端共享类型
- `packages/sdk`：前端 API Client
- `packages/tsconfig`：共享 TypeScript 配置
- `packages/eslint-config`：共享 ESLint 配置

## 环境准备

- `cp .env.example .env`
- `cp apps/web/.env.example apps/web/.env`
- `cp apps/server/.env.example apps/server/.env`

## 常用命令

- `pnpm install`
- `pnpm dev`
- `pnpm build`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`

## 本地访问

- 前端：`http://127.0.0.1:5173`
- 健康检查：`http://127.0.0.1:3000/api/health`
- Swagger：`http://127.0.0.1:3000/docs`

## 说明

- 健康检查与 Swagger 可在未连接 MySQL、Redis 的情况下先行验证
- Prisma、Redis 与 BullMQ 先提供接入落点，业务功能后续再补
```

- [ ] **Step 4: 重新运行环境变量测试**

Run: `node --test tests/root/env-examples.test.mjs`

Expected: PASS，三个测试全部通过。

- [ ] **Step 5: 提交当前任务**

```bash
git add .env.example apps/web/.env.example apps/server/.env.example README.md tests/root/env-examples.test.mjs
git commit -m "docs: add environment examples and setup guide"
```

### Task 9: 全仓验收与最终收尾

**Files:**
- Modify: `package.json`（仅当验证过程中必须修正脚本）
- Modify: `turbo.json`（仅当验证过程中必须修正任务依赖）
- Modify: `apps/server/**`（仅当验证失败必须修复）
- Modify: `apps/web/**`（仅当验证失败必须修复）

- [ ] **Step 1: 先运行 lint，验证 ESLint 配置链路**

Run: `pnpm lint`

Expected: PASS，四个工作区的 `lint` 全部通过。

- [ ] **Step 2: 运行 typecheck，验证 TS 配置链路**

Run: `pnpm typecheck`

Expected: PASS，`packages/shared`、`packages/sdk`、`apps/server`、`apps/web` 都通过类型检查。

- [ ] **Step 3: 运行测试，验证最小行为链路**

Run: `pnpm test`

Expected: PASS，至少包含：
- `packages/shared` 的共享契约测试
- `packages/sdk` 的客户端测试
- `apps/server` 的健康检查与 Swagger e2e
- `apps/web` 的首页健康状态测试

- [ ] **Step 4: 运行构建，验证构建顺序与产物输出**

Run: `pnpm build`

Expected: PASS，并生成：
- `packages/shared/dist`
- `packages/sdk/dist`
- `apps/server/dist`
- `apps/web/dist`

- [ ] **Step 5: 做手工联调与最终提交**

Run: `pnpm dev`

Expected:
- `http://127.0.0.1:5173` 可打开首页
- `http://127.0.0.1:3000/api/health` 返回 `status: "ok"`
- `http://127.0.0.1:3000/docs` 可打开 Swagger

联调通过后提交：

```bash
git add .
git commit -m "feat: scaffold web and server monorepo"
```

## 自检记录

### Spec coverage

- 根目录 `pnpm workspace + turbo`：Task 1
- `packages/tsconfig` 与 `packages/eslint-config`：Task 2
- `packages/shared` 与 `packages/sdk`：Task 3
- 后端健康检查：Task 4
- Swagger、JWT、Prisma、Redis、BullMQ 接入落点：Task 5
- 前端 Vue 3 + Vite + TypeScript + Naive UI + Pinia + Vue Router + UnoCSS：Task 6
- 前端通过 SDK 调后端：Task 7
- 环境变量示例：Task 5、Task 8
- 根目录统一 `lint`、`typecheck`、`test`、`build` 验收：Task 9

### Placeholder scan

- 未使用 `TODO`、`TBD`、`implement later` 等占位语
- 每个任务都给出具体文件、代码片段、命令和预期结果

### Type consistency

- 共享健康响应类型统一为 `HealthResponse`
- 后端控制器、SDK 客户端、前端首页都使用同一响应结构
- 健康接口统一路径为 `/api/health`
- Swagger JSON 路径统一为 `/docs-json`
