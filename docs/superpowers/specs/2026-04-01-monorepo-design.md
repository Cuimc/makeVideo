# Monorepo Project Framework Design

Date: 2026-04-01

## Context

This repository is currently empty and needs a lightweight but stable monorepo foundation for two initial applications:

- `apps/web`: frontend based on Vue 3, Vite, TypeScript, Naive UI, Pinia, Vue Router, and UnoCSS
- `apps/server`: backend based on NestJS, Prisma, MySQL, Redis, BullMQ, JWT, and Swagger

The user explicitly wants a lightweight setup that remains stable and does not introduce unnecessary platform complexity.

## Goals

- Establish a `pnpm workspace` monorepo with `turbo` for task orchestration
- Keep the first version focused on two applications plus a small set of shared packages
- Separate application code, shared business-agnostic code, and shared engineering configuration
- Make local development ergonomic from the repository root
- Ensure the structure can grow without forcing a reorganization after the first few features

## Non-Goals

- Do not introduce CI/CD, release automation, or package publishing workflows in the first version
- Do not over-model future domains with many empty packages
- Do not implement business modules beyond the minimum backend integration points
- Do not add full end-to-end testing infrastructure in the first version

## Recommended Approach

Use `pnpm workspace + turbo` with:

- two application workspaces under `apps/`
- four shared workspaces under `packages/`
- one root-level `prisma/` directory for shared database infrastructure

This balances current simplicity with predictable room for shared types, SDK generation, and centralized engineering configuration.

## Repository Layout

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

## Workspace Naming

All workspace packages should use the `@make-video/*` scope.

Recommended package names:

- `@make-video/web`
- `@make-video/server`
- `@make-video/eslint-config`
- `@make-video/tsconfig`
- `@make-video/shared`
- `@make-video/sdk`

## Package Responsibilities

### Applications

#### `apps/web`

Responsible for:

- Vue application bootstrap
- route definitions
- Pinia state management
- Naive UI setup
- UnoCSS setup
- page-level and component-level UI
- API consumption through `@make-video/sdk`

Must not contain:

- duplicated cross-application DTO definitions
- direct backend-specific implementation details that belong in shared packages

#### `apps/server`

Responsible for:

- NestJS bootstrap and module composition
- HTTP API exposure
- authentication with JWT
- Swagger documentation output
- queue integration through BullMQ
- Prisma-based persistence and Redis-based infrastructure integration

Must not contain:

- frontend-facing request client logic
- reusable cross-platform utilities that belong in `@make-video/shared`

### Shared Packages

#### `packages/tsconfig`

Provides shared TypeScript configuration variants:

- `base.json`
- `web.json`
- `server.json`
- `library.json`

This package only contains TypeScript configuration and no application code.

#### `packages/eslint-config`

Provides shared ESLint configuration variants:

- base config
- Vue app config
- Nest app config

This package only contains linting configuration and no runtime code.

#### `packages/shared`

Provides pure TypeScript content that can be consumed by both frontend and backend, such as:

- common API types
- shared constants
- common utility types
- schema-like definitions that do not depend on Vue or Nest runtime APIs

Rules:

- no Vue-specific imports
- no Nest-specific imports
- no Node-only runtime dependencies unless they are safe and intentional for all consumers

#### `packages/sdk`

Provides the frontend-facing API access layer.

Initial responsibilities:

- central API client creation
- typed request wrappers grouped by backend module
- integration point for future Swagger/OpenAPI-based client generation

Rules:

- expose an interface that `apps/web` can consume directly
- keep business state out of this package
- allow future migration from handwritten clients to generated clients without changing frontend call sites broadly

## Root Tooling Strategy

### Package Manager

- Use `pnpm` as the workspace package manager
- Pin a single LTS Node version, recommended: `Node 22`

### Root Dependencies

Keep only repository-wide development tooling at the root, such as:

- `turbo`
- `typescript`
- `eslint`
- `prettier`
- `husky`
- `lint-staged`

Application runtime dependencies stay in their own workspaces.

### Root Scripts

The root `package.json` should expose only common entry points:

- `dev`
- `build`
- `lint`
- `typecheck`
- `test`
- `format`
- `clean`

The root is a coordination layer and should not contain business scripts.

## Turbo Pipeline Design

The first version of `turbo.json` should define a small task graph:

- `dev`: long-running, uncached
- `build`: cached, depends on upstream package builds
- `lint`: cached where appropriate
- `typecheck`: cached where appropriate
- `test`: uncached or minimally cached depending on tool defaults
- `clean`: uncached

Behavioral expectations:

- packages such as `@make-video/shared` and `@make-video/sdk` complete before downstream app build and typecheck tasks
- `dev` runs independently for each app and is not treated as a cacheable artifact
- only deterministic tasks are included in caching

## Frontend Application Design

### Proposed Structure

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

### Frontend Responsibilities

- `main.ts` mounts the Vue app and registers Pinia, Vue Router, Naive UI, and UnoCSS
- `apis/` consumes `@make-video/sdk` instead of building ad hoc request logic everywhere
- `stores/` contains frontend state, not low-level HTTP details
- `views/` and `components/` own presentation concerns

## Backend Application Design

### Proposed Structure

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

### Backend Responsibilities

- `main.ts` configures bootstrap concerns such as global prefix, validation, and Swagger
- `app.module.ts` assembles core modules
- `modules/auth/` provides JWT-based authentication foundations
- `modules/health/` exposes a basic health endpoint for local verification
- `modules/queue/` owns BullMQ integration wiring
- `prisma/` provides Prisma service access for Nest consumers
- `redis/` provides shared Redis connection access

The first version should expose infrastructure entry points without forcing full business modules.

## Prisma Location

Use a root-level `prisma/` directory rather than embedding it in `apps/server`.

Reasons:

- database schema and migrations are repository-wide infrastructure
- generated outputs and scripts can be coordinated centrally
- future workspace consumers can reference the database layer without relocating schema assets

The backend remains the primary runtime consumer, but the schema should live at the repository root.

## Data Flow Boundaries

The intended request flow is:

1. `apps/web` view or store calls `@make-video/sdk`
2. `@make-video/sdk` performs typed HTTP requests to `apps/server`
3. `apps/server` routes requests through controller -> service -> persistence/infrastructure
4. shared types and constants flow through `@make-video/shared`

This keeps frontend code decoupled from Nest internals and preserves a stable contract surface between applications.

## Environment Variable Strategy

Do not commit real secrets. Commit only example files.

Recommended files:

- `.env.example`
- `apps/web/.env.example`
- `apps/server/.env.example`

### Backend Variables

Minimum backend variables:

- `PORT`
- `DATABASE_URL`
- `REDIS_URL`
- `JWT_SECRET`
- `SWAGGER_PATH`

### Frontend Variables

Minimum frontend variables:

- `VITE_API_BASE_URL`

## Testing Strategy

The first version should keep testing intentionally small:

- frontend uses `Vitest`
- backend uses the Nest default Jest-based test setup
- root scripts expose `test`, `lint`, and `typecheck` for full-repository execution

Do not introduce full e2e orchestration in the initial scaffold.

## Initial Scope of Implementation

The scaffold phase should include:

- repository root workspace setup
- Turbo configuration
- shared config packages
- frontend app scaffold wired with Vue 3, Vite, TypeScript, Naive UI, Pinia, Vue Router, and UnoCSS
- backend app scaffold wired with NestJS, Prisma, MySQL, Redis, BullMQ, JWT, and Swagger integration points
- shared package placeholders with clear exported entry points
- a minimal health endpoint reachable from the backend
- a minimal frontend integration path that can call the backend through the SDK layer

The scaffold phase should not include:

- feature-complete auth flows
- production-grade queue workflows
- fully modeled domain modules
- deployment automation

## Acceptance Criteria

The monorepo scaffold is acceptable when all of the following are true:

- `pnpm dev` can start the frontend and backend from the repository root
- `pnpm build` works across all buildable workspaces
- `pnpm lint` runs from the repository root
- `pnpm typecheck` runs from the repository root
- `pnpm test` runs from the repository root
- the backend exposes a health endpoint
- Swagger UI is reachable from the backend runtime
- the frontend is structured to consume backend APIs through `@make-video/sdk`
- shared configuration packages are consumed by downstream workspaces instead of duplicated locally

## Implementation Notes for the Next Step

The implementation plan should favor:

- lightweight initialization over full platform automation
- clear boundaries over speculative abstraction
- enough scaffolding to make the first business feature cheap to add

The next phase should produce a concrete execution plan before any application code is scaffolded.
