# AGENTS.md

## 语言约定

- 默认使用中文沟通、注释和文档，除非用户明确要求英文

## 项目目标

- 当前仓库用于搭建一个轻量、稳定、不过度设计的 monorepo
- 第一阶段只包含两个应用：
  - `apps/web`：Vue 3 + Vite + TypeScript + Naive UI + Pinia + Vue Router + UnoCSS
  - `apps/server`：NestJS + Prisma + MySQL + Redis + BullMQ + JWT + Swagger
- 包管理使用 `pnpm workspace`
- 任务编排使用 `turbo`

## 目录规划

```text
.
├─ apps/
│  ├─ web/
│  └─ server/
├─ packages/
│  ├─ eslint-config/
│  ├─ tsconfig/
│  ├─ shared/
│  └─ sdk/
├─ prisma/
├─ docs/
├─ package.json
├─ pnpm-workspace.yaml
└─ turbo.json
```

## 命名约定

- 所有 workspace 包统一使用 `@make-video/*`
- 推荐名称：
  - `@make-video/web`
  - `@make-video/server`
  - `@make-video/eslint-config`
  - `@make-video/tsconfig`
  - `@make-video/shared`
  - `@make-video/sdk`

## 包职责边界

### `apps/web`

- 负责 Vue 应用启动、路由、状态管理、UI、页面与组件
- 通过 `@make-video/sdk` 调用后端接口
- 不要在前端重复维护后端 DTO 或直接耦合服务端内部实现

### `apps/server`

- 负责 Nest 启动、模块组装、HTTP API、JWT、Swagger、BullMQ、Prisma、Redis
- 不要把前端请求客户端逻辑放进服务端

### `packages/shared`

- 只放前后端共用的纯 TypeScript 内容
- 例如：通用类型、常量、工具类型、纯 schema 定义
- 禁止引入 Vue 专属、Nest 专属或仅适用于 Node 的运行时依赖

### `packages/sdk`

- 只负责 API Client 与请求封装
- 供前端直接消费
- 不承载业务状态
- 后续如接 Swagger/OpenAPI 代码生成，也继续落在这个包中

### `packages/tsconfig`

- 提供共享 TS 配置：`base.json`、`web.json`、`server.json`、`library.json`

### `packages/eslint-config`

- 提供共享 ESLint 配置：基础、Vue、Nest

## 根目录职责

- 根目录只负责依赖协调、脚本入口、任务编排
- 不放业务逻辑
- 根 `package.json` 只保留统一命令：
  - `dev`
  - `build`
  - `lint`
  - `typecheck`
  - `test`
  - `format`
  - `clean`

## Turbo 约束

- `dev` 为长驻任务，不缓存
- `build`、`lint`、`typecheck` 只在适合时缓存
- `clean` 不缓存
- `@make-video/shared`、`@make-video/sdk` 等上游包先于应用层完成构建或类型检查

## 前端结构建议

```text
apps/web/src/
├─ apis/
├─ components/
├─ layouts/
├─ router/
├─ stores/
├─ styles/
├─ views/
├─ App.vue
└─ main.ts
```

## 后端结构建议

```text
apps/server/src/
├─ common/
├─ modules/
│  ├─ auth/
│  ├─ health/
│  └─ queue/
├─ prisma/
├─ redis/
├─ app.module.ts
└─ main.ts
```

## Prisma 位置

- `prisma/` 放在仓库根目录
- 原因：schema、migration、seed 属于全仓级基础设施，不应绑死在 `apps/server` 内

## 数据流约定

1. 前端页面或 store 调用 `@make-video/sdk`
2. `@make-video/sdk` 调用后端 HTTP API
3. 后端按 `controller -> service -> persistence/infrastructure` 处理
4. 跨端共享类型和常量由 `@make-video/shared` 提供

## 环境变量

只提交示例文件，不提交真实密钥。

- 根目录：`.env.example`
- 前端：`apps/web/.env.example`
- 后端：`apps/server/.env.example`

后端至少预留：

- `PORT`
- `DATABASE_URL`
- `REDIS_URL`
- `JWT_SECRET`
- `SWAGGER_PATH`

前端至少预留：

- `VITE_API_BASE_URL`

## 测试与质量要求

- 前端测试使用 `Vitest`
- 后端测试使用 Nest 默认 Jest
- 根目录统一提供 `lint`、`typecheck`、`test`
- 第一版不引入完整 E2E 平台

## 当前阶段范围

当前阶段只搭脚手架，不做完整业务：

- 初始化 workspace 与 turbo
- 搭前后端基础骨架
- 建立共享配置包、`shared`、`sdk`
- 后端提供健康检查接口
- 前端提供一条通过 `sdk` 调用后端的最小链路

当前阶段不做：

- 完整鉴权流程
- 复杂队列业务
- 完整领域建模
- 部署自动化

## 设计文档

- 详细设计文档位于 `docs/superpowers/specs/2026-04-01-monorepo-design.md`
- 如果后续实现与本文件冲突，以用户最新明确要求为准
