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

- 健康检查与 Swagger 可以先在未接入 MySQL、Redis 业务的情况下验证
- Prisma、Redis 与 BullMQ 当前只提供基础接入落点，业务能力后续再补
