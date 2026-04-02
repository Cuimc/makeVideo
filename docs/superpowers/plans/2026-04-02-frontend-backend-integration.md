# Frontend Backend Integration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 消除当前前端真实联调时的 404，按前端现有 SDK 与 mock 契约补齐服务端接口，使工作台、任务中心、成品库、素材库、脚本参考库、积分页能够在真实后端下打开和交互。

**Architecture:** 本轮以前端现有 `packages/sdk` 路由和 `packages/shared` 类型为联调契约源，后端优先按这些路径补控制器和返回结构，不优先改前端 URL。服务端继续沿用“模块 + mock provider / 轻量内存态 + 已有 Prisma/Points 基础设施”的策略，先恢复页面联调，再逐步把模块切到真实持久化。

**Tech Stack:** Vue 3, Pinia, `@make-video/sdk`, `@make-video/shared`, NestJS, Prisma, Jest, Supertest, TypeScript

---

## 当前接口审计

### 已对齐并可联调的接口

- `POST /api/auth/login`
- `GET /api/auth/profile`
- `GET /api/health`
- `GET /api/news`
- `POST /api/projects`
- `GET /api/projects/:projectId`
- `PUT /api/projects/:projectId`
- `POST /api/projects/:projectId/script/generate`
- `POST /api/projects/:projectId/storyboard/generate`
- `POST /api/projects/:projectId/confirm`

### 前端当前真实依赖、但后端未实现的接口

- `GET /api/dashboard/summary`
  - 来源：[dashboard.ts](/Users/cuimengchao/work/myProject/makeVideo/packages/sdk/src/modules/dashboard.ts)
  - 页面/Store：[dashboard.ts](/Users/cuimengchao/work/myProject/makeVideo/apps/web/src/stores/dashboard.ts)
- `GET /api/video-tasks`
- `POST /api/video-tasks`
- `POST /api/video-tasks/:taskId/retry`
  - 来源：[task.ts](/Users/cuimengchao/work/myProject/makeVideo/packages/sdk/src/modules/task.ts)
  - 页面/Store：[task.ts](/Users/cuimengchao/work/myProject/makeVideo/apps/web/src/stores/task.ts)
- `GET /api/library/videos`
- `DELETE /api/library/videos/:videoId`
  - 来源：[library.ts](/Users/cuimengchao/work/myProject/makeVideo/packages/sdk/src/modules/library.ts)
  - 页面/Store：[library.ts](/Users/cuimengchao/work/myProject/makeVideo/apps/web/src/stores/library.ts)
- `GET /api/assets/images`
- `POST /api/assets/images`
- `DELETE /api/assets/images/:imageId`
  - 来源：[asset.ts](/Users/cuimengchao/work/myProject/makeVideo/packages/sdk/src/modules/asset.ts)
  - 页面/Store：[asset.ts](/Users/cuimengchao/work/myProject/makeVideo/apps/web/src/stores/asset.ts)
- `GET /api/references`
- `POST /api/references/analyze`
- `DELETE /api/references/:referenceId`
  - 来源：[reference.ts](/Users/cuimengchao/work/myProject/makeVideo/packages/sdk/src/modules/reference.ts)
  - 页面/Store：[reference.ts](/Users/cuimengchao/work/myProject/makeVideo/apps/web/src/stores/reference.ts)
- `GET /api/billing/summary`
- `GET /api/billing/packages`
- `GET /api/billing/records`
- `GET /api/billing/recharges`
  - 来源：[billing.ts](/Users/cuimengchao/work/myProject/makeVideo/packages/sdk/src/modules/billing.ts)
  - 页面/Store：[billing.ts](/Users/cuimengchao/work/myProject/makeVideo/apps/web/src/stores/billing.ts)

### 已发现的路由命名冲突

1. 原后端计划中的 `assets` 路径倾向于 `/api/assets/upload`，但前端实际使用的是 `/api/assets/images`。
2. 原后端计划中的 `references` 路径倾向于“上传 -> 再分析”两步接口，前端实际使用的是 `/api/references/analyze` 一步提交。
3. 原后端计划中的积分与充值是 `points` / `payments` 模块；前端现阶段消费的是聚合过的 `/api/billing/*`。
4. 前端成品库使用 `/api/library/videos`，后端原领域命名更接近 `videos`；本轮应先保留前端路径，后端用 `library` 或 `videos` 模块提供该别名路由。

## 文件结构与职责

- `apps/server/src/modules/dashboard/dashboard.module.ts`：工作台聚合模块。
- `apps/server/src/modules/dashboard/dashboard.controller.ts`：暴露 `/api/dashboard/summary`。
- `apps/server/src/modules/dashboard/dashboard.service.ts`：聚合积分余额、最近项目、最近成片。
- `apps/server/src/modules/billing/billing.module.ts`：前端账单聚合模块。
- `apps/server/src/modules/billing/billing.controller.ts`：暴露 `/api/billing/*`。
- `apps/server/src/modules/billing/billing.service.ts`：把 points / recharge 数据映射成前端页面要的 `BillingSummary`、`PointPackage`、`PointRecord`、`RechargeRecord`。
- `apps/server/src/modules/assets/assets.module.ts`：图片素材模块。
- `apps/server/src/modules/assets/assets.controller.ts`：暴露 `/api/assets/images`。
- `apps/server/src/modules/assets/assets.service.ts`：图片列表、上传、删除。
- `apps/server/src/modules/references/references.module.ts`：参考视频分析模块。
- `apps/server/src/modules/references/references.controller.ts`：暴露 `/api/references`、`/api/references/analyze`。
- `apps/server/src/modules/references/references.service.ts`：参考视频列表、上传分析、删除。
- `apps/server/src/modules/video-tasks/video-tasks.module.ts`：视频任务模块。
- `apps/server/src/modules/video-tasks/video-tasks.controller.ts`：暴露 `/api/video-tasks`。
- `apps/server/src/modules/video-tasks/video-tasks.service.ts`：任务列表、提交、重试。
- `apps/server/src/modules/library/library.module.ts`：成品库模块。
- `apps/server/src/modules/library/library.controller.ts`：暴露 `/api/library/videos`。
- `apps/server/src/modules/library/library.service.ts`：成片列表与删除。
- `apps/server/test/dashboard-billing.e2e-spec.ts`：dashboard / billing 联调契约测试。
- `apps/server/test/assets-references.e2e-spec.ts`：assets / references 联调契约测试。
- `apps/server/test/video-tasks-library.e2e-spec.ts`：video-tasks / library 联调契约测试。

## 约束与实施策略

1. 本轮不优先改 `packages/sdk` 和页面路由，避免“前端接口、mock、页面、测试”四处一起改。
2. 所有新接口返回结构必须直接匹配 `packages/shared` 中的类型，避免二次 DTO 翻译。
3. 前端当前已有 mock 返回值可直接作为后端最小可用数据形状参考，优先做“结构一致”，再做“真实持久化”。
4. 若后端领域命名与前端路径不一致，优先增加聚合/别名控制器，而不是要求前端立刻迁移。

### Task 1: 冻结前端契约并补联调红测

**Files:**
- Create: `apps/server/test/dashboard-billing.e2e-spec.ts`
- Create: `apps/server/test/assets-references.e2e-spec.ts`
- Create: `apps/server/test/video-tasks-library.e2e-spec.ts`

- [ ] **Step 1: 先写 dashboard / billing 的失败测试**

```ts
it('returns dashboard summary used by the web dashboard page', async () => {
  const token = await loginAndGetAccessToken(app);

  const response = await request(app.getHttpServer())
    .get('/api/dashboard/summary')
    .set('Authorization', `Bearer ${token}`)
    .expect(200);

  expect(response.body.data).toEqual({
    summary: {
      pointBalance: expect.any(Number),
      recentProjectCount: expect.any(Number),
      recentVideoCount: expect.any(Number),
    },
    recentProjects: expect.any(Array),
    recentVideos: expect.any(Array),
  });
});

it('returns billing summary and paged billing lists used by account pages', async () => {
  const token = await loginAndGetAccessToken(app);

  const summary = await request(app.getHttpServer())
    .get('/api/billing/summary')
    .set('Authorization', `Bearer ${token}`)
    .expect(200);

  expect(summary.body.data).toEqual({
    balance: expect.any(Number),
    totalRecharged: expect.any(Number),
    totalConsumed: expect.any(Number),
    totalRefunded: expect.any(Number),
  });
});
```

- [ ] **Step 2: 写 assets / references 的失败测试**

```ts
it('returns paged assets and references using the same paths as the web sdk', async () => {
  const token = await loginAndGetAccessToken(app);

  const assets = await request(app.getHttpServer())
    .get('/api/assets/images?page=1&pageSize=20')
    .set('Authorization', `Bearer ${token}`)
    .expect(200);

  expect(assets.body.data).toEqual({
    items: expect.any(Array),
    total: expect.any(Number),
    page: 1,
    pageSize: 20,
  });

  const references = await request(app.getHttpServer())
    .get('/api/references?page=1&pageSize=20')
    .set('Authorization', `Bearer ${token}`)
    .expect(200);

  expect(references.body.data.items).toEqual(expect.any(Array));
});
```

- [ ] **Step 3: 写 video-tasks / library 的失败测试**

```ts
it('returns task center and library payloads using web-facing routes', async () => {
  const token = await loginAndGetAccessToken(app);

  const tasks = await request(app.getHttpServer())
    .get('/api/video-tasks?page=1&pageSize=20')
    .set('Authorization', `Bearer ${token}`)
    .expect(200);

  expect(tasks.body.data.items).toEqual(expect.any(Array));

  const videos = await request(app.getHttpServer())
    .get('/api/library/videos?page=1&pageSize=20')
    .set('Authorization', `Bearer ${token}`)
    .expect(200);

  expect(videos.body.data.items).toEqual(expect.any(Array));
});
```

- [ ] **Step 4: 运行测试确认这些路由当前确实缺失**

Run: `pnpm --filter @make-video/server test -- --runInBand test/dashboard-billing.e2e-spec.ts test/assets-references.e2e-spec.ts test/video-tasks-library.e2e-spec.ts`
Expected: FAIL，报 404 或 controller 未注册

- [ ] **Step 5: 提交**

```bash
git add apps/server/test/dashboard-billing.e2e-spec.ts apps/server/test/assets-references.e2e-spec.ts apps/server/test/video-tasks-library.e2e-spec.ts
git commit -m "test: lock frontend integration contracts"
```

### Task 2: 补 dashboard 与 billing 聚合接口

**Files:**
- Create: `apps/server/src/modules/dashboard/dashboard.module.ts`
- Create: `apps/server/src/modules/dashboard/dashboard.controller.ts`
- Create: `apps/server/src/modules/dashboard/dashboard.service.ts`
- Create: `apps/server/src/modules/billing/billing.module.ts`
- Create: `apps/server/src/modules/billing/billing.controller.ts`
- Create: `apps/server/src/modules/billing/billing.service.ts`
- Modify: `apps/server/src/app.module.ts`

- [ ] **Step 1: 先实现 dashboard 聚合接口**

```ts
@Get('summary')
getSummary(@CurrentUser() user: JwtUserPayload) {
  return this.dashboardService.getSummary(user.userId);
}
```

```ts
async getSummary(userId: string): Promise<DashboardData> {
  const projects = this.projectsService.listByUser(userId);
  const videos = this.libraryService.listByUser(userId, { page: 1, pageSize: 5 });
  const account = await this.billingService.getSummary(userId);

  return {
    summary: {
      pointBalance: account.balance,
      recentProjectCount: projects.length,
      recentVideoCount: videos.items.length,
    },
    recentProjects: projects.slice(0, 5),
    recentVideos: videos.items.slice(0, 5),
  };
}
```

- [ ] **Step 2: 实现 billing 聚合接口，按前端路径暴露**

```ts
@Get('summary')
getBillingSummary(@CurrentUser() user: JwtUserPayload) {
  return this.billingService.getSummary(user.userId);
}

@Get('packages')
getPackages() {
  return this.billingService.getPackages();
}

@Get('records')
getPointRecords(@CurrentUser() user: JwtUserPayload, @Query() query: PagingDto) {
  return this.billingService.getPointRecords(user.userId, query);
}

@Get('recharges')
getRechargeRecords(@CurrentUser() user: JwtUserPayload, @Query() query: PagingDto) {
  return this.billingService.getRechargeRecords(user.userId, query);
}
```

- [ ] **Step 3: 让 `BillingService` 输出前端共享类型**

```ts
getSummary(userId: string): BillingSummary {
  return {
    balance: this.pointsService.getSnapshot(userId).availablePoints,
    totalRecharged: 5000,
    totalConsumed: 2120,
    totalRefunded: 120,
  };
}
```

```ts
getPointRecords(_userId: string, query: PagingDto): PagedResult<PointRecord> {
  return {
    items: [
      {
        id: 'record-1',
        type: 'recharge',
        label: '充值到账',
        points: 3000,
        createdAt: '2026-04-01 10:00:00',
      },
    ],
    total: 1,
    page: query.page ?? 1,
    pageSize: query.pageSize ?? 20,
  };
}
```

- [ ] **Step 4: 跑红测到绿**

Run: `pnpm --filter @make-video/server test -- --runInBand test/dashboard-billing.e2e-spec.ts`
Expected: PASS

- [ ] **Step 5: 提交**

```bash
git add apps/server/src/modules/dashboard apps/server/src/modules/billing apps/server/src/app.module.ts apps/server/test/dashboard-billing.e2e-spec.ts
git commit -m "feat: add dashboard and billing integration routes"
```

### Task 3: 按前端路由补 assets 与 references

**Files:**
- Create: `apps/server/src/modules/assets/assets.module.ts`
- Create: `apps/server/src/modules/assets/assets.controller.ts`
- Create: `apps/server/src/modules/assets/assets.service.ts`
- Create: `apps/server/src/modules/references/references.module.ts`
- Create: `apps/server/src/modules/references/references.controller.ts`
- Create: `apps/server/src/modules/references/references.service.ts`
- Modify: `apps/server/src/app.module.ts`

- [ ] **Step 1: 先实现图片素材列表、上传、删除**

```ts
@Get('images')
list(@CurrentUser() user: JwtUserPayload, @Query() query: PagingDto) {
  return this.assetsService.list(user.userId, query);
}

@Post('images')
upload(@CurrentUser() user: JwtUserPayload, @Body() payload: ImageUploadPayload) {
  return this.assetsService.upload(user.userId, payload);
}

@Delete('images/:imageId')
remove(@CurrentUser() user: JwtUserPayload, @Param('imageId') imageId: string) {
  return this.assetsService.remove(user.userId, imageId);
}
```

- [ ] **Step 2: 实现 references 的前端一步式分析接口**

```ts
@Get()
list(@CurrentUser() user: JwtUserPayload, @Query() query: PagingDto) {
  return this.referencesService.list(user.userId, query);
}

@Post('analyze')
analyze(@CurrentUser() user: JwtUserPayload, @Body() payload: ReferenceVideoUploadPayload) {
  return this.referencesService.uploadAndAnalyze(user.userId, payload);
}
```

```ts
async uploadAndAnalyze(userId: string, payload: ReferenceVideoUploadPayload) {
  const analyzed = await this.referenceProvider.analyze({
    referenceVideoId: `reference-${Date.now()}`,
    url: payload.url,
  });

  return {
    id: `reference-${Date.now()}`,
    title: payload.name,
    status: 'success',
    theme: '热点新闻转视频解读',
    structureSummary: analyzed.summary,
    scriptSummary: analyzed.summary,
    storyboardSummary: analyzed.summary,
    applicableScenes: analyzed.tags,
    createdAt: new Date().toISOString(),
  };
}
```

- [ ] **Step 3: 跑红测到绿**

Run: `pnpm --filter @make-video/server test -- --runInBand test/assets-references.e2e-spec.ts`
Expected: PASS

- [ ] **Step 4: 用前端页面做最小手工验证**

Run: `curl -s http://127.0.0.1:5173/api/assets/images?page=1&pageSize=20`
Expected: 返回 `PagedResult<ReferenceImage>`

Run: `curl -s http://127.0.0.1:5173/api/references?page=1&pageSize=20`
Expected: 返回 `PagedResult<ReferenceAnalysisResult>`

- [ ] **Step 5: 提交**

```bash
git add apps/server/src/modules/assets apps/server/src/modules/references apps/server/src/app.module.ts apps/server/test/assets-references.e2e-spec.ts
git commit -m "feat: add asset and reference integration routes"
```

### Task 4: 按前端路由补 video-tasks 与 library

**Files:**
- Create: `apps/server/src/modules/video-tasks/video-tasks.module.ts`
- Create: `apps/server/src/modules/video-tasks/video-tasks.controller.ts`
- Create: `apps/server/src/modules/video-tasks/video-tasks.service.ts`
- Create: `apps/server/src/modules/library/library.module.ts`
- Create: `apps/server/src/modules/library/library.controller.ts`
- Create: `apps/server/src/modules/library/library.service.ts`
- Modify: `apps/server/src/app.module.ts`

- [ ] **Step 1: 实现 `/api/video-tasks` 列表、提交、重试**

```ts
@Get()
list(@CurrentUser() user: JwtUserPayload, @Query() query: TaskListQuery) {
  return this.videoTasksService.list(user.userId, query);
}

@Post()
create(@CurrentUser() user: JwtUserPayload, @Body() payload: CreateVideoTaskDto) {
  return this.videoTasksService.create(user.userId, payload);
}

@Post(':taskId/retry')
retry(@CurrentUser() user: JwtUserPayload, @Param('taskId') taskId: string) {
  return this.videoTasksService.retry(user.userId, taskId);
}
```

- [ ] **Step 2: 实现 `/api/library/videos` 列表与删除**

```ts
@Get('videos')
list(@CurrentUser() user: JwtUserPayload, @Query() query: PagingDto) {
  return this.libraryService.list(user.userId, query);
}

@Delete('videos/:videoId')
remove(@CurrentUser() user: JwtUserPayload, @Param('videoId') videoId: string) {
  return this.libraryService.remove(user.userId, videoId);
}
```

- [ ] **Step 3: 列表与结果对象直接复用前端共享类型**

```ts
list(_userId: string, query: TaskListQuery): PagedResult<VideoGenerationTask> {
  return {
    items: [
      {
        id: 'task-1',
        projectId: 'project-1',
        projectName: '机器人养老趋势解读',
        status: 'queued',
        progressText: '正在排队中',
        pointCost: 320,
        refundPoints: 0,
        createdAt: '2026-04-01 12:00:00',
        updatedAt: '2026-04-01 12:00:00',
        resultVideoIds: [],
      },
    ],
    total: 1,
    page: query.page ?? 1,
    pageSize: query.pageSize ?? 20,
  };
}
```

- [ ] **Step 4: 跑红测到绿**

Run: `pnpm --filter @make-video/server test -- --runInBand test/video-tasks-library.e2e-spec.ts`
Expected: PASS

- [ ] **Step 5: 提交**

```bash
git add apps/server/src/modules/video-tasks apps/server/src/modules/library apps/server/src/app.module.ts apps/server/test/video-tasks-library.e2e-spec.ts
git commit -m "feat: add task center and library integration routes"
```

### Task 5: 完成真实联调验收与计划收口

**Files:**
- Modify: `apps/server/test/docs.e2e-spec.ts`
- Modify: `apps/server/README.md`

- [ ] **Step 1: 补 Swagger 路由覆盖断言**

```ts
expect(response.body.paths['/api/dashboard/summary']).toBeDefined();
expect(response.body.paths['/api/billing/summary']).toBeDefined();
expect(response.body.paths['/api/assets/images']).toBeDefined();
expect(response.body.paths['/api/references']).toBeDefined();
expect(response.body.paths['/api/video-tasks']).toBeDefined();
expect(response.body.paths['/api/library/videos']).toBeDefined();
```

- [ ] **Step 2: 跑后端全量验证**

Run: `pnpm --filter @make-video/server lint`
Expected: PASS

Run: `pnpm --filter @make-video/server typecheck`
Expected: PASS

Run: `pnpm --filter @make-video/server test`
Expected: PASS

- [ ] **Step 3: 跑前端真实联调验证**

Run: `pnpm dev`
Expected: 前后端同时启动

Run: `curl -s http://127.0.0.1:5173/api/dashboard/summary`
Expected: 返回 `DashboardData`

Run: `curl -s http://127.0.0.1:5173/api/video-tasks?page=1&pageSize=20`
Expected: 返回 `PagedResult<VideoGenerationTask>`

- [ ] **Step 4: 页面手工回归**

1. 登录后进入工作台，不再出现 `/api/dashboard/summary` 404。
2. 打开任务中心，不再出现 `/api/video-tasks` 404。
3. 打开成品库，不再出现 `/api/library/videos` 404。
4. 打开素材库，不再出现 `/api/assets/images` 404。
5. 打开脚本参考库，不再出现 `/api/references` 404。
6. 打开个人中心、充值页、积分明细页，不再出现 `/api/billing/*` 404。

- [ ] **Step 5: 提交**

```bash
git add apps/server/test/docs.e2e-spec.ts apps/server/README.md
git commit -m "docs: finish frontend backend integration guide"
```

## 计划自检

1. 前端实际触发的 404 已全部映射到具体 SDK 模块和页面 Store，没有漏项。
2. 计划默认以后端适配前端现有路径为准，避免一轮联调中同时大改页面和服务端。
3. 路由之外还固定了返回结构来源：`packages/shared` 与现有 mock 数据形状。
4. 若后续要把 `billing` 重构为 `points + payments`、把 `library` 重构为 `videos`，应在本计划完成后单独起第二轮契约迁移，不与当前 404 修复混做。
