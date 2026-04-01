# Monorepo 项目框架设计

日期：2026-04-01

## 背景

当前仓库还是空仓库，需要先搭建一个轻量但稳定的 monorepo 基础框架，首期只包含两个应用：

- `apps/web`：前端，技术栈为 Vue 3、Vite、TypeScript、Naive UI、Pinia、Vue Router、UnoCSS
- `apps/server`：后端，技术栈为 NestJS、Prisma、MySQL、Redis、BullMQ、JWT、Swagger

用户已经明确要求第一版以“轻量、稳定、不过度设计”为原则，不引入不必要的平台复杂度。

## 目标

- 使用 `pnpm workspace` 建立 monorepo，并用 `turbo` 进行任务编排
- 第一版只聚焦两个应用和少量共享包
- 明确区分应用代码、共享业务无关代码、共享工程配置
- 支持从仓库根目录进行统一开发、构建和校验
- 为后续功能扩展预留合理空间，避免很快重新整理目录结构

## 非目标

- 第一版不引入 CI/CD、发版流程、包发布流程
- 第一版不为了未来假设提前拆出大量空目录或空包
- 第一版不实现完整业务模块，只搭好基础设施接入点
- 第一版不引入完整的端到端测试平台

## 推荐方案

采用 `pnpm workspace + turbo`，并包含以下组成：

- `apps/` 下的两个应用工作区
- `packages/` 下的四个共享工作区
- 仓库根部单独维护一个 `prisma/` 目录作为统一数据库基础设施入口

这样可以在保持当前简单度的同时，为后续的共享类型、SDK 封装、工程配置复用留出明确位置。

## 仓库结构

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
│  └─ superpowers/
│     └─ specs/
├─ package.json
├─ pnpm-workspace.yaml
└─ turbo.json
```

## Workspace 命名

所有 workspace 包统一使用 `@make-video/*` 作用域。

推荐包名如下：

- `@make-video/web`
- `@make-video/server`
- `@make-video/eslint-config`
- `@make-video/tsconfig`
- `@make-video/shared`
- `@make-video/sdk`

## 包职责划分

### 应用层

#### `apps/web`

负责内容：

- Vue 应用启动与注册
- 路由定义
- Pinia 状态管理
- Naive UI 接入
- UnoCSS 接入
- 页面与组件层 UI
- 通过 `@make-video/sdk` 消费后端接口

不应包含：

- 前后端重复维护的 DTO 类型
- 本应放在共享包中的后端实现细节

#### `apps/server`

负责内容：

- NestJS 启动入口与模块组装
- HTTP API 暴露
- JWT 鉴权基础能力
- Swagger 文档输出
- BullMQ 队列接入
- Prisma 持久化接入
- Redis 基础设施接入

不应包含：

- 面向前端的请求客户端逻辑
- 可被前后端共同复用但却留在服务端内部的工具代码

### 共享包

#### `packages/tsconfig`

提供共享的 TypeScript 配置变体：

- `base.json`
- `web.json`
- `server.json`
- `library.json`

这个包只包含 TypeScript 配置，不包含业务代码。

#### `packages/eslint-config`

提供共享的 ESLint 配置变体：

- 基础配置
- Vue 应用配置
- Nest 应用配置

这个包只包含 lint 配置，不包含运行时代码。

#### `packages/shared`

提供前后端都能消费的纯 TypeScript 内容，例如：

- 通用 API 类型
- 共享常量
- 通用工具类型
- 不依赖 Vue 或 Nest 运行时的 schema 或结构定义

约束规则：

- 不允许引入 Vue 专属依赖
- 不允许引入 Nest 专属依赖
- 不允许引入仅能在 Node 环境运行的依赖，除非该依赖明确适用于所有消费方

#### `packages/sdk`

提供给前端消费的统一 API 访问层。

第一版职责：

- 统一创建 API Client
- 按模块组织的类型化请求封装
- 作为未来 Swagger/OpenAPI 代码生成客户端的接入位置

约束规则：

- 要向 `apps/web` 提供稳定、直接可消费的接口
- 不承载业务状态
- 后续即使从手写客户端切到代码生成客户端，也应尽量不影响前端调用层

## 根目录工具链策略

### 包管理器

- 使用 `pnpm` 作为 workspace 包管理器
- 固定一个 LTS Node 版本，建议为 `Node 22`

### 根依赖

根目录只放全仓通用的开发依赖，例如：

- `turbo`
- `typescript`
- `eslint`
- `prettier`
- `husky`
- `lint-staged`

应用运行时依赖放在各自 workspace 内部，不放到根目录。

### 根脚本

根 `package.json` 只暴露全仓统一入口：

- `dev`
- `build`
- `lint`
- `typecheck`
- `test`
- `format`
- `clean`

根目录的职责是调度与规范，不承载业务逻辑。

## Turbo 任务编排设计

第一版 `turbo.json` 只定义一组精简任务：

- `dev`：长驻进程，不缓存
- `build`：可缓存，依赖上游包的构建
- `lint`：按需要缓存
- `typecheck`：按需要缓存
- `test`：不缓存或仅按工具默认方式轻量缓存
- `clean`：不缓存

行为要求：

- `@make-video/shared`、`@make-video/sdk` 等上游包应先于应用层完成 `build` / `typecheck`
- `dev` 阶段前后端各自独立运行，不视为可缓存产物
- 只对确定性任务启用缓存

## 前端应用设计

### 建议目录结构

```text
apps/web/
├─ src/
│  ├─ apis/
│  ├─ components/
│  ├─ layouts/
│  ├─ router/
│  ├─ stores/
│  ├─ styles/
│  ├─ views/
│  ├─ App.vue
│  └─ main.ts
├─ public/
├─ index.html
├─ package.json
├─ tsconfig.json
├─ vite.config.ts
└─ uno.config.ts
```

### 前端职责说明

- `main.ts` 负责挂载 Vue 应用，并注册 Pinia、Vue Router、Naive UI、UnoCSS
- `apis/` 通过 `@make-video/sdk` 访问接口，而不是在各页面分散拼接请求逻辑
- `stores/` 只负责前端状态，不承担底层 HTTP 细节
- `views/` 与 `components/` 负责页面与展示逻辑

## 后端应用设计

### 建议目录结构

```text
apps/server/
├─ src/
│  ├─ common/
│  ├─ modules/
│  │  ├─ auth/
│  │  ├─ health/
│  │  └─ queue/
│  ├─ prisma/
│  ├─ redis/
│  ├─ app.module.ts
│  └─ main.ts
├─ test/
├─ package.json
├─ tsconfig.json
└─ nest-cli.json
```

### 后端职责说明

- `main.ts` 负责启动阶段配置，例如全局前缀、参数校验、Swagger
- `app.module.ts` 负责聚合核心模块
- `modules/auth/` 提供 JWT 鉴权基础能力
- `modules/health/` 提供基础健康检查接口，便于本地联调验证
- `modules/queue/` 负责 BullMQ 接线
- `prisma/` 提供给 Nest 使用的 Prisma Service
- `redis/` 提供 Redis 连接封装

第一版的目标是先把基础设施入口搭好，而不是提前铺满业务模块。

## Prisma 放置位置

推荐把 `prisma/` 放在仓库根目录，而不是塞进 `apps/server`。

原因：

- 数据库 schema 和 migration 属于全仓级基础设施
- 生成逻辑、脚本和后续维护可以集中管理
- 后续如果有其他 workspace 也需要引用数据库定义，无需再次迁移目录

服务端仍然是主要运行时消费者，但 schema 资产放在根目录更合理。

## 数据流边界

建议的数据流如下：

1. `apps/web` 的页面或 store 调用 `@make-video/sdk`
2. `@make-video/sdk` 向 `apps/server` 发起类型化 HTTP 请求
3. `apps/server` 按 `controller -> service -> persistence/infrastructure` 路径处理请求
4. 前后端共享的类型、常量等通过 `@make-video/shared` 提供

这样可以让前端不直接耦合 Nest 内部实现，同时把跨端契约固定在稳定边界上。

## 环境变量策略

不提交真实密钥，只提交示例文件。

建议文件：

- `.env.example`
- `apps/web/.env.example`
- `apps/server/.env.example`

### 后端最小变量集合

- `PORT`
- `DATABASE_URL`
- `REDIS_URL`
- `JWT_SECRET`
- `SWAGGER_PATH`

### 前端最小变量集合

- `VITE_API_BASE_URL`

## 测试策略

第一版测试保持精简：

- 前端使用 `Vitest`
- 后端使用 Nest 默认的 Jest 测试体系
- 根目录统一暴露 `test`、`lint`、`typecheck`

第一版不引入完整的端到端测试编排。

## 第一阶段实施范围

脚手架阶段应包含：

- 仓库根目录 workspace 初始化
- Turbo 配置
- 共享工程配置包
- 前端应用骨架，接入 Vue 3、Vite、TypeScript、Naive UI、Pinia、Vue Router、UnoCSS
- 后端应用骨架，接入 NestJS、Prisma、MySQL、Redis、BullMQ、JWT、Swagger 的基础入口
- 共享包占位与明确导出入口
- 一个可访问的后端健康检查接口
- 一个通过 SDK 调用后端接口的最小前端接入路径

脚手架阶段不包含：

- 完整鉴权流程
- 生产级队列业务流
- 完整领域模块建模
- 部署自动化

## 验收标准

以下条件同时满足时，monorepo 骨架可视为通过验收：

- `pnpm dev` 可以从仓库根目录同时启动前端和后端
- `pnpm build` 可以覆盖所有可构建 workspace
- `pnpm lint` 可以从仓库根目录执行
- `pnpm typecheck` 可以从仓库根目录执行
- `pnpm test` 可以从仓库根目录执行
- 后端暴露基础健康检查接口
- Swagger UI 可访问
- 前端已按 `@make-video/sdk` 方式消费后端接口
- 下游 workspace 复用了共享配置包，而不是各自复制配置

## 下一阶段实施说明

下一阶段的实现计划应优先遵循以下原则：

- 轻量初始化，不做平台化过度建设
- 边界清晰，避免为了“未来可能会用到”而过度抽象
- 搭出足够稳定的骨架，让第一个业务功能接入成本低

在真正开始搭建应用代码之前，下一步应先输出具体的实施计划。
