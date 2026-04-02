# Backend MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 基于当前 monorepo 后端脚手架，交付一个可直接进入联调阶段的 NestJS 后端 MVP，覆盖验证码登录、新闻搜索、项目创建、脚本与分镜生成、素材上传、参考视频分析、视频生成任务、成品库、积分账户与充值订单。

**Architecture:** 采用 `apps/server` + `prisma/` 的分层方案：`apps/server` 负责 HTTP、鉴权、业务编排、队列与 provider 适配，`prisma/` 负责数据库建模、迁移与 seed。实现顺序按“基础设施与统一契约 -> 用户与积分底座 -> 项目主链路 -> 资产与视频任务 -> 支付与收口”推进，确保每个阶段都能独立运行和验收。

**Tech Stack:** Node.js, NestJS, Prisma ORM, MySQL, Redis, BullMQ, JWT, Swagger, Jest, Supertest, TypeScript

---

## 前置注意

1. 当前前端与 `packages/shared` 中的状态值是小写风格，而后端需求明确要求数据库、DTO、接口返回统一使用大写枚举。本计划按后端需求设计，执行前应先确认是否在同一轮开发中统一共享契约，否则会出现联调状态不一致。
2. 当前后端代码仍然是脚手架级别，只包含 `auth` 空模块、`health`、`queue`、`prisma`、`redis` 基础模块和 Swagger 启动逻辑。后续任务默认可以直接重构这些脚手架文件。
3. 当前 `prisma/schema.prisma` 只有 `generator` 与 `datasource`，尚未落任何业务模型；本计划会把 Prisma schema 作为主数据边界优先完成。

## 文件结构与职责

### 根目录与 `prisma/`

- `prisma/schema.prisma`：所有业务模型、枚举、索引、唯一约束、软删除和幂等键。
- `prisma/seed.ts`：开发 seed，初始化测试用户、积分账户、新闻、项目、素材、订单等最小联调数据。
- `docker-compose.yml`：本地 MySQL / Redis 开发依赖。
- `.env.example`：根级示例环境变量，指向 MySQL、Redis 与 Nest 服务。

### `apps/server/src/common`

- `common/config/app-env.ts`：环境变量解析与默认值。
- `common/constants/error-codes.ts`：业务错误码。
- `common/constants/queue-names.ts`：BullMQ 队列常量。
- `common/dto/api-response.dto.ts`：统一响应体。
- `common/enums/*.ts`：项目状态、任务状态、参考分析状态、支付状态、积分流水类型。
- `common/exceptions/business.exception.ts`：统一业务异常。
- `common/filters/http-exception.filter.ts`：统一异常输出。
- `common/interceptors/response.interceptor.ts`：统一包装 `ApiResponse<T>`。
- `common/guards/jwt-auth.guard.ts`：JWT 鉴权。
- `common/decorators/current-user.decorator.ts`：获取当前用户。
- `common/utils/idempotency.ts`：回调幂等辅助。
- `common/utils/pagination.ts`：分页参数标准化。

### `apps/server/src/providers`

- `providers/news/mock-news.provider.ts`：新闻搜索 mock provider。
- `providers/ai/mock-script.provider.ts`：脚本生成 mock provider。
- `providers/ai/mock-storyboard.provider.ts`：分镜生成 mock provider。
- `providers/video/mock-reference.provider.ts`：参考视频分析 mock provider。
- `providers/video/mock-video.provider.ts`：视频生成 mock provider。
- `providers/sms/mock-sms.provider.ts`：短信验证码 mock provider。
- `providers/payment/mock-payment.provider.ts`：充值订单与支付 mock provider。
- `providers/storage/mock-storage.provider.ts`：本地或 mock 文件存储。

### `apps/server/src/modules`

- `modules/auth`：发送验证码、登录、JWT 签发。
- `modules/users`：当前用户信息。
- `modules/news`：新闻关键词搜索。
- `modules/projects`：创建项目、项目列表、项目详情。
- `modules/scripts`：脚本生成、保存、重新生成。
- `modules/storyboards`：分镜生成、保存、重新生成。
- `modules/assets`：图片素材上传、列表、删除。
- `modules/references`：参考视频上传、分析任务、分析结果列表与详情。
- `modules/video-tasks`：提交视频生成任务、任务列表、详情、重试。
- `modules/videos`：成品库列表、详情、删除。
- `modules/points`：积分账户、积分流水、冻结/扣除/返还统一服务。
- `modules/payments`：充值订单、支付成功回调。

### `apps/server/src/queues`

- `queues/script-generate.processor.ts`
- `queues/storyboard-generate.processor.ts`
- `queues/reference-analyze.processor.ts`
- `queues/video-generate.processor.ts`
- `queues/video-writeback.processor.ts`

### `apps/server/test`

- `test/health.e2e-spec.ts`：保留健康检查。
- `test/docs.e2e-spec.ts`：保留 Swagger。
- `test/auth.e2e-spec.ts`：验证码登录与获取当前用户。
- `test/projects.e2e-spec.ts`：新闻搜索、创建项目、获取项目详情。
- `test/scripts.e2e-spec.ts`：脚本/分镜生成与保存。
- `test/assets-references.e2e-spec.ts`：素材与参考视频。
- `test/video-tasks.e2e-spec.ts`：视频任务提交、状态更新、成品库写回。
- `test/payments-points.e2e-spec.ts`：积分账户、流水、充值订单与回调。

## 实施顺序

先补齐环境、测试、统一响应与错误处理，再落 Prisma schema 和本地依赖。之后优先打通“登录 -> 新闻 -> 项目 -> 脚本/分镜 -> 视频任务 -> 成品库”主链路，再补素材、参考视频、支付与积分回调。最后补 Swagger、seed、README 和全量回归，确保可以稳定联调。

### Task 1: 补测试底座、环境配置与公共响应能力

**Files:**
- Modify: `apps/server/package.json`
- Modify: `apps/server/.env.example`
- Modify: `apps/server/src/bootstrap.ts`
- Modify: `apps/server/src/app.module.ts`
- Create: `apps/server/src/common/constants/error-codes.ts`
- Create: `apps/server/src/common/constants/queue-names.ts`
- Create: `apps/server/src/common/dto/api-response.dto.ts`
- Create: `apps/server/src/common/exceptions/business.exception.ts`
- Create: `apps/server/src/common/filters/http-exception.filter.ts`
- Create: `apps/server/src/common/interceptors/response.interceptor.ts`
- Create: `apps/server/src/common/decorators/current-user.decorator.ts`
- Create: `apps/server/src/common/guards/jwt-auth.guard.ts`
- Create: `apps/server/src/common/enums/project-status.enum.ts`
- Create: `apps/server/src/common/enums/task-status.enum.ts`
- Create: `apps/server/src/common/enums/reference-status.enum.ts`
- Create: `apps/server/src/common/enums/payment-status.enum.ts`
- Create: `apps/server/src/common/enums/point-transaction-type.enum.ts`
- Create: `apps/server/test/auth.e2e-spec.ts`

- [ ] **Step 1: 先写认证与统一响应的失败测试**

```ts
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/bootstrap';

describe('Auth module (e2e)', () => {
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

  it('wraps unauthorized response with unified envelope', async () => {
    const response = await request(app.getHttpServer()).get('/api/users/me');

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      code: 401,
      message: 'Unauthorized',
      data: null,
    });
  });
});
```

- [ ] **Step 2: 运行测试确认当前缺口**

Run: `pnpm --filter @make-video/server test -- --runInBand test/auth.e2e-spec.ts`
Expected: FAIL，提示 `/api/users/me` 未注册或响应结构不是统一 `ApiResponse`

- [ ] **Step 3: 落公共异常、响应拦截器和基础枚举**

```ts
export class BusinessException extends HttpException {
  constructor(code: number, message: string, status = HttpStatus.BAD_REQUEST) {
    super(
      {
        code,
        message,
        data: null,
      },
      status,
    );
  }
}
```

```ts
export const PROJECT_STATUS = {
  CREATED: 'CREATED',
  SCRIPT_GENERATING: 'SCRIPT_GENERATING',
  SCRIPT_PENDING_CONFIRM: 'SCRIPT_PENDING_CONFIRM',
  SCRIPT_CONFIRMED: 'SCRIPT_CONFIRMED',
  VIDEO_GENERATING: 'VIDEO_GENERATING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
} as const;
```

```ts
app.useGlobalFilters(new HttpExceptionFilter());
app.useGlobalInterceptors(new ResponseInterceptor());
```

- [ ] **Step 4: 补齐 JWT guard、当前用户 decorator 与 Swagger Bearer 配置**

```ts
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ user?: { userId: string } }>();
    return request.user;
  },
);
```

```ts
new DocumentBuilder()
  .setTitle('makeVideo API')
  .setDescription('News-driven AI video platform backend')
  .setVersion('0.1.0')
  .addBearerAuth()
  .build();
```

- [ ] **Step 5: 跑基础验证并提交**

Run: `pnpm --filter @make-video/server lint`
Expected: PASS

Run: `pnpm --filter @make-video/server typecheck`
Expected: PASS

Run: `pnpm --filter @make-video/server test -- --runInBand test/health.e2e-spec.ts test/docs.e2e-spec.ts test/auth.e2e-spec.ts`
Expected: FAIL 变 PASS，新增未登录统一响应断言通过

```bash
git add apps/server/package.json apps/server/.env.example apps/server/src/common apps/server/src/bootstrap.ts apps/server/src/app.module.ts apps/server/test/auth.e2e-spec.ts
git commit -m "feat: add server common response foundation"
```

### Task 2: 完成 Prisma Schema、迁移脚本与本地基础设施

**Files:**
- Create: `docker-compose.yml`
- Modify: `prisma/schema.prisma`
- Create: `prisma/seed.ts`
- Modify: `apps/server/package.json`
- Modify: `apps/server/src/prisma/prisma.service.ts`
- Create: `apps/server/src/prisma/prisma.constants.ts`
- Create: `apps/server/test/prisma.e2e-spec.ts`

- [ ] **Step 1: 先写 Prisma schema 校验测试**

```ts
import { execSync } from 'node:child_process';

describe('Prisma schema', () => {
  it('validates the mysql schema and generators', () => {
    expect(() =>
      execSync('pnpm exec prisma validate --schema ../../prisma/schema.prisma', {
        cwd: process.cwd(),
        stdio: 'pipe',
      }),
    ).not.toThrow();
  });
});
```

- [ ] **Step 2: 运行校验确认 schema 仍为空壳**

Run: `pnpm --filter @make-video/server test -- --runInBand test/prisma.e2e-spec.ts`
Expected: FAIL，当前 schema 缺少业务模型与枚举

- [ ] **Step 3: 一次性补齐 MVP 模型、枚举和关键索引**

```prisma
enum ProjectStatus {
  CREATED
  SCRIPT_GENERATING
  SCRIPT_PENDING_CONFIRM
  SCRIPT_CONFIRMED
  VIDEO_GENERATING
  COMPLETED
  FAILED
}

model User {
  id             String         @id @default(cuid())
  phone          String         @unique
  nickname       String
  pointAccount   PointAccount?
  projects       Project[]
  createdAt      DateTime       @default(now())
  updatedAt      DateTime       @updatedAt
}

model PointAccount {
  id              String   @id @default(cuid())
  userId          String   @unique
  availablePoints Int      @default(0)
  frozenPoints    Int      @default(0)
  user            User     @relation(fields: [userId], references: [id])
  transactions    PointTransaction[]
}
```

```prisma
model VideoGenerateTask {
  id          String                  @id @default(cuid())
  projectId   String
  status      VideoTaskStatus         @default(PENDING)
  pointCost   Int
  refundPoints Int                    @default(0)
  items       VideoGenerateTaskItem[]
  createdAt   DateTime                @default(now())
  updatedAt   DateTime                @updatedAt

  @@index([projectId, status])
}
```

- [ ] **Step 4: 增加 seed 与本地 MySQL / Redis 开发配置**

```yaml
services:
  mysql:
    image: mysql:8.4
    environment:
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: make_video
    ports:
      - '3306:3306'
  redis:
    image: redis:7.4
    ports:
      - '6379:6379'
```

```ts
await prisma.user.upsert({
  where: { phone: '13800138000' },
  update: {},
  create: {
    phone: '13800138000',
    nickname: '测试用户',
    pointAccount: {
      create: {
        availablePoints: 3000,
      },
    },
  },
});
```

- [ ] **Step 5: 运行 Prisma 验证并提交**

Run: `pnpm --filter @make-video/server exec prisma validate --schema ../../prisma/schema.prisma`
Expected: PASS

Run: `pnpm --filter @make-video/server exec prisma generate --schema ../../prisma/schema.prisma`
Expected: PASS

Run: `pnpm --filter @make-video/server test -- --runInBand test/prisma.e2e-spec.ts`
Expected: PASS

```bash
git add docker-compose.yml prisma/schema.prisma prisma/seed.ts apps/server/package.json apps/server/src/prisma apps/server/test/prisma.e2e-spec.ts
git commit -m "feat: add prisma schema and local infra"
```

### Task 3: 补 provider、队列注册和统一积分服务骨架

**Files:**
- Modify: `apps/server/src/modules/queue/queue.module.ts`
- Modify: `apps/server/src/modules/queue/queue.service.ts`
- Create: `apps/server/src/providers/news/news.provider.ts`
- Create: `apps/server/src/providers/news/mock-news.provider.ts`
- Create: `apps/server/src/providers/ai/script.provider.ts`
- Create: `apps/server/src/providers/ai/mock-script.provider.ts`
- Create: `apps/server/src/providers/ai/storyboard.provider.ts`
- Create: `apps/server/src/providers/ai/mock-storyboard.provider.ts`
- Create: `apps/server/src/providers/video/reference.provider.ts`
- Create: `apps/server/src/providers/video/mock-reference.provider.ts`
- Create: `apps/server/src/providers/video/video.provider.ts`
- Create: `apps/server/src/providers/video/mock-video.provider.ts`
- Create: `apps/server/src/providers/sms/sms.provider.ts`
- Create: `apps/server/src/providers/sms/mock-sms.provider.ts`
- Create: `apps/server/src/providers/payment/payment.provider.ts`
- Create: `apps/server/src/providers/payment/mock-payment.provider.ts`
- Create: `apps/server/src/providers/storage/storage.provider.ts`
- Create: `apps/server/src/providers/storage/mock-storage.provider.ts`
- Create: `apps/server/src/modules/points/points.module.ts`
- Create: `apps/server/src/modules/points/points.service.ts`
- Create: `apps/server/src/modules/points/points.service.spec.ts`

- [ ] **Step 1: 先写积分冻结 / 扣除 / 返还的单测**

```ts
describe('PointsService', () => {
  it('freezes points before async task submission', async () => {
    const result = await service.freeze({
      userId: 'user-1',
      amount: 200,
      businessType: 'VIDEO_TASK',
      businessId: 'task-1',
    });

    expect(result.availablePoints).toBe(2800);
    expect(result.frozenPoints).toBe(200);
  });
});
```

- [ ] **Step 2: 运行测试确认 PointsService 尚不存在**

Run: `pnpm --filter @make-video/server test -- --runInBand src/modules/points/points.service.spec.ts`
Expected: FAIL，提示 module 或 service 缺失

- [ ] **Step 3: 定义 provider 抽象接口和 mock 实现**

```ts
export interface NewsProvider {
  search(keyword: string): Promise<Array<{
    title: string;
    summary: string;
    source: string;
    publishedAt: string;
    url: string;
  }>>;
}
```

```ts
export interface VideoProvider {
  submit(payload: {
    taskId: string;
    script: string;
    storyboard: Array<{ title: string; narration: string }>;
  }): Promise<{ providerTaskId: string }>;
}
```

- [ ] **Step 4: 实现 PointsService 骨架和 BullMQ 队列常量**

```ts
async freeze(input: FreezePointInput) {
  return this.prisma.$transaction(async (tx) => {
    const account = await tx.pointAccount.findUniqueOrThrow({
      where: { userId: input.userId },
    });

    if (account.availablePoints < input.amount) {
      throw new BusinessException(4001, '积分不足');
    }

    await tx.pointAccount.update({
      where: { id: account.id },
      data: {
        availablePoints: { decrement: input.amount },
        frozenPoints: { increment: input.amount },
      },
    });

    await tx.pointTransaction.create({
      data: {
        userId: input.userId,
        type: 'FREEZE',
        points: input.amount,
        businessType: input.businessType,
        businessId: input.businessId,
      },
    });
  });
}
```

- [ ] **Step 5: 运行单测与类型检查并提交**

Run: `pnpm --filter @make-video/server test -- --runInBand src/modules/points/points.service.spec.ts`
Expected: PASS

Run: `pnpm --filter @make-video/server typecheck`
Expected: PASS

```bash
git add apps/server/src/modules/queue apps/server/src/providers apps/server/src/modules/points
git commit -m "feat: add providers and points foundation"
```

### Task 4: 实现 auth、users 与验证码登录链路

**Files:**
- Create: `apps/server/src/modules/auth/auth.controller.ts`
- Modify: `apps/server/src/modules/auth/auth.module.ts`
- Create: `apps/server/src/modules/auth/auth.service.ts`
- Create: `apps/server/src/modules/auth/dto/send-code.dto.ts`
- Create: `apps/server/src/modules/auth/dto/login-by-sms.dto.ts`
- Create: `apps/server/src/modules/auth/jwt.strategy.ts`
- Create: `apps/server/src/modules/users/users.module.ts`
- Create: `apps/server/src/modules/users/users.controller.ts`
- Create: `apps/server/src/modules/users/users.service.ts`
- Modify: `apps/server/src/app.module.ts`
- Create: `apps/server/test/auth.e2e-spec.ts`

- [ ] **Step 1: 写验证码发送、登录和获取当前用户的 e2e**

```ts
it('logs in by sms code and fetches current user profile', async () => {
  await request(app.getHttpServer())
    .post('/api/auth/send-code')
    .send({ phone: '13800138000' })
    .expect(200);

  const login = await request(app.getHttpServer())
    .post('/api/auth/login-by-sms')
    .send({ phone: '13800138000', code: '123456' })
    .expect(200);

  const token = login.body.data.accessToken;

  const me = await request(app.getHttpServer())
    .get('/api/users/me')
    .set('Authorization', `Bearer ${token}`)
    .expect(200);

  expect(me.body.data.phone).toBe('13800138000');
});
```

- [ ] **Step 2: 运行 e2e 确认登录链路尚未打通**

Run: `pnpm --filter @make-video/server test -- --runInBand test/auth.e2e-spec.ts`
Expected: FAIL，验证码、登录或 JWT 鉴权链路缺失

- [ ] **Step 3: 实现验证码发送、登录与 JWT 签发**

```ts
async sendCode(dto: SendCodeDto) {
  const code = '123456';

  await this.prisma.userAuthCode.create({
    data: {
      phone: dto.phone,
      code,
      expiresAt: addMinutes(new Date(), 5),
    },
  });

  await this.smsProvider.sendCode(dto.phone, code);
}
```

```ts
async loginBySms(dto: LoginBySmsDto) {
  const record = await this.prisma.userAuthCode.findFirstOrThrow({
    where: {
      phone: dto.phone,
      code: dto.code,
      usedAt: null,
    },
    orderBy: { createdAt: 'desc' },
  });

  const user = await this.usersService.findOrCreateByPhone(dto.phone);
  const accessToken = await this.jwtService.signAsync({ sub: user.id });
  return { accessToken, user };
}
```

- [ ] **Step 4: 实现当前用户接口和 PointsAccount 自动初始化**

```ts
async findOrCreateByPhone(phone: string) {
  return this.prisma.$transaction(async (tx) => {
    const existing = await tx.user.findUnique({ where: { phone } });
    if (existing) return existing;

    return tx.user.create({
      data: {
        phone,
        nickname: `用户${phone.slice(-4)}`,
        pointAccount: {
          create: {
            availablePoints: 1000,
          },
        },
      },
    });
  });
}
```

- [ ] **Step 5: 跑 e2e 并提交**

Run: `pnpm --filter @make-video/server test -- --runInBand test/auth.e2e-spec.ts`
Expected: PASS

```bash
git add apps/server/src/modules/auth apps/server/src/modules/users apps/server/src/app.module.ts apps/server/test/auth.e2e-spec.ts
git commit -m "feat: add auth and users modules"
```

### Task 5: 实现 news、projects、scripts、storyboards 与项目主链路

**Files:**
- Create: `apps/server/src/modules/news/news.module.ts`
- Create: `apps/server/src/modules/news/news.controller.ts`
- Create: `apps/server/src/modules/news/news.service.ts`
- Create: `apps/server/src/modules/news/dto/search-news.dto.ts`
- Create: `apps/server/src/modules/projects/projects.module.ts`
- Create: `apps/server/src/modules/projects/projects.controller.ts`
- Create: `apps/server/src/modules/projects/projects.service.ts`
- Create: `apps/server/src/modules/projects/dto/create-project.dto.ts`
- Create: `apps/server/src/modules/scripts/scripts.module.ts`
- Create: `apps/server/src/modules/scripts/scripts.controller.ts`
- Create: `apps/server/src/modules/scripts/scripts.service.ts`
- Create: `apps/server/src/modules/storyboards/storyboards.module.ts`
- Create: `apps/server/src/modules/storyboards/storyboards.controller.ts`
- Create: `apps/server/src/modules/storyboards/storyboards.service.ts`
- Create: `apps/server/src/queues/script-generate.processor.ts`
- Create: `apps/server/src/queues/storyboard-generate.processor.ts`
- Create: `apps/server/test/projects.e2e-spec.ts`
- Create: `apps/server/test/scripts.e2e-spec.ts`

- [ ] **Step 1: 先写项目、脚本、分镜主链路 e2e**

```ts
it('searches news, creates project, generates script and storyboard', async () => {
  const token = await loginAndGetAccessToken(app);

  const news = await request(app.getHttpServer())
    .get('/api/news/search')
    .query({ keyword: '养老' })
    .set('Authorization', `Bearer ${token}`)
    .expect(200);

  const createProject = await request(app.getHttpServer())
    .post('/api/projects')
    .set('Authorization', `Bearer ${token}`)
    .send({
      keyword: '养老',
      newsIds: [news.body.data.items[0].id],
    })
    .expect(200);

  await request(app.getHttpServer())
    .post(`/api/projects/${createProject.body.data.id}/generate-script`)
    .set('Authorization', `Bearer ${token}`)
    .expect(200);

  await request(app.getHttpServer())
    .post(`/api/projects/${createProject.body.data.id}/generate-storyboard`)
    .set('Authorization', `Bearer ${token}`)
    .expect(200);
});
```

- [ ] **Step 2: 运行测试确认模块缺失**

Run: `pnpm --filter @make-video/server test -- --runInBand test/projects.e2e-spec.ts test/scripts.e2e-spec.ts`
Expected: FAIL，新闻、项目、脚本或分镜接口缺失

- [ ] **Step 3: 实现新闻搜索、项目创建与项目详情**

```ts
async create(userId: string, dto: CreateProjectDto) {
  return this.prisma.$transaction(async (tx) => {
    const project = await tx.project.create({
      data: {
        userId,
        keyword: dto.keyword,
        name: `${dto.keyword} 选题创作`,
        status: 'CREATED',
      },
    });

    await tx.projectNews.createMany({
      data: dto.newsIds.map((newsId) => ({
        projectId: project.id,
        newsId,
      })),
    });

    return project;
  });
}
```

- [ ] **Step 4: 实现脚本/分镜生成、保存与整版重生成**

```ts
async generate(projectId: string, userId: string) {
  const project = await this.projectsService.getOwnedProject(projectId, userId);

  await this.pointsService.freeze({
    userId,
    amount: 100,
    businessType: 'SCRIPT_TASK',
    businessId: project.id,
  });

  await this.queueService.add('script-generate-queue', {
    projectId: project.id,
    userId,
  });

  return { queued: true };
}
```

```ts
async process(job: Job<{ projectId: string; userId: string }>) {
  const project = await this.projectsService.getById(job.data.projectId);
  const result = await this.scriptProvider.generate({
    keyword: project.keyword,
    news: project.news,
  });

  await this.prisma.$transaction(async (tx) => {
    await tx.script.upsert({
      where: { projectId: project.id },
      update: { content: result.content, version: { increment: 1 } },
      create: { projectId: project.id, content: result.content, version: 1 },
    });

    await this.pointsService.consumeFrozenInTx(tx, {
      userId: job.data.userId,
      amount: 100,
      businessType: 'SCRIPT_TASK',
      businessId: project.id,
    });
  });
}
```

- [ ] **Step 5: 跑主链路测试并提交**

Run: `pnpm --filter @make-video/server test -- --runInBand test/projects.e2e-spec.ts test/scripts.e2e-spec.ts`
Expected: PASS

```bash
git add apps/server/src/modules/news apps/server/src/modules/projects apps/server/src/modules/scripts apps/server/src/modules/storyboards apps/server/src/queues/script-generate.processor.ts apps/server/src/queues/storyboard-generate.processor.ts apps/server/test/projects.e2e-spec.ts apps/server/test/scripts.e2e-spec.ts
git commit -m "feat: add project script and storyboard flow"
```

### Task 6: 实现 assets、references 与参考视频分析链路

**Files:**
- Create: `apps/server/src/modules/assets/assets.module.ts`
- Create: `apps/server/src/modules/assets/assets.controller.ts`
- Create: `apps/server/src/modules/assets/assets.service.ts`
- Create: `apps/server/src/modules/assets/dto/upload-asset.dto.ts`
- Create: `apps/server/src/modules/references/references.module.ts`
- Create: `apps/server/src/modules/references/references.controller.ts`
- Create: `apps/server/src/modules/references/references.service.ts`
- Create: `apps/server/src/modules/references/dto/upload-reference-video.dto.ts`
- Create: `apps/server/src/queues/reference-analyze.processor.ts`
- Create: `apps/server/test/assets-references.e2e-spec.ts`

- [ ] **Step 1: 写素材上传与参考视频分析的 e2e**

```ts
it('uploads asset, uploads reference video and returns analysis result', async () => {
  const token = await loginAndGetAccessToken(app);

  const asset = await request(app.getHttpServer())
    .post('/api/assets/upload')
    .set('Authorization', `Bearer ${token}`)
    .send({
      fileName: 'ref-image-1.png',
      fileType: 'image/png',
      content: 'mock-base64',
    })
    .expect(200);

  expect(asset.body.data.url).toContain('/uploads/');

  const reference = await request(app.getHttpServer())
    .post('/api/references/upload-video')
    .set('Authorization', `Bearer ${token}`)
    .send({
      projectId: 'project-1',
      fileName: 'reference.mp4',
      fileType: 'video/mp4',
      content: 'mock-base64',
    })
    .expect(200);

  await request(app.getHttpServer())
    .post(`/api/references/${reference.body.data.id}/analyze`)
    .set('Authorization', `Bearer ${token}`)
    .expect(200);
});
```

- [ ] **Step 2: 运行测试确认文件与参考模块仍不存在**

Run: `pnpm --filter @make-video/server test -- --runInBand test/assets-references.e2e-spec.ts`
Expected: FAIL

- [ ] **Step 3: 实现文件存储抽象和图片素材接口**

```ts
async uploadImage(userId: string, dto: UploadAssetDto) {
  const stored = await this.storageProvider.save({
    fileName: dto.fileName,
    content: dto.content,
    mimeType: dto.fileType,
    folder: 'assets',
  });

  return this.prisma.asset.create({
    data: {
      userId,
      name: dto.fileName,
      fileType: dto.fileType,
      url: stored.url,
      size: stored.size,
    },
  });
}
```

- [ ] **Step 4: 实现参考视频上传、分析队列与详情列表**

```ts
async analyze(referenceId: string, userId: string) {
  const reference = await this.getOwnedReference(referenceId, userId);

  await this.prisma.referenceVideo.update({
    where: { id: reference.id },
    data: { status: 'PROCESSING' },
  });

  await this.queueService.add('reference-analyze-queue', {
    referenceId: reference.id,
    userId,
  });
}
```

```ts
const result = await this.referenceProvider.analyze({
  url: reference.url,
});

await tx.scriptReference.create({
  data: {
    userId: job.data.userId,
    referenceVideoId: reference.id,
    title: result.title,
    structureSummary: result.structureSummary,
    scriptSummary: result.scriptSummary,
    storyboardSummary: result.storyboardSummary,
  },
});
```

- [ ] **Step 5: 跑 e2e 并提交**

Run: `pnpm --filter @make-video/server test -- --runInBand test/assets-references.e2e-spec.ts`
Expected: PASS

```bash
git add apps/server/src/modules/assets apps/server/src/modules/references apps/server/src/queues/reference-analyze.processor.ts apps/server/test/assets-references.e2e-spec.ts
git commit -m "feat: add assets and references modules"
```

### Task 7: 实现 video-tasks、videos 与视频结果写回

**Files:**
- Create: `apps/server/src/modules/video-tasks/video-tasks.module.ts`
- Create: `apps/server/src/modules/video-tasks/video-tasks.controller.ts`
- Create: `apps/server/src/modules/video-tasks/video-tasks.service.ts`
- Create: `apps/server/src/modules/video-tasks/dto/create-video-task.dto.ts`
- Create: `apps/server/src/modules/videos/videos.module.ts`
- Create: `apps/server/src/modules/videos/videos.controller.ts`
- Create: `apps/server/src/modules/videos/videos.service.ts`
- Create: `apps/server/src/queues/video-generate.processor.ts`
- Create: `apps/server/src/queues/video-writeback.processor.ts`
- Create: `apps/server/test/video-tasks.e2e-spec.ts`

- [ ] **Step 1: 写视频任务提交、任务状态和成品库写回 e2e**

```ts
it('creates video task, updates status and writes result video', async () => {
  const token = await loginAndGetAccessToken(app);

  const submit = await request(app.getHttpServer())
    .post('/api/video-tasks')
    .set('Authorization', `Bearer ${token}`)
    .send({
      projectId: 'project-1',
      count: 1,
      aspectRatio: '9:16',
      durationSeconds: 60,
      styleBias: '专业理性',
      withSubtitle: true,
    })
    .expect(200);

  expect(submit.body.data.status).toBe('QUEUED');

  const list = await request(app.getHttpServer())
    .get('/api/video-tasks')
    .set('Authorization', `Bearer ${token}`)
    .expect(200);

  expect(list.body.data.items[0].projectId).toBe('project-1');
});
```

- [ ] **Step 2: 运行测试确认视频任务模块缺失**

Run: `pnpm --filter @make-video/server test -- --runInBand test/video-tasks.e2e-spec.ts`
Expected: FAIL

- [ ] **Step 3: 实现视频任务创建、积分冻结与 BullMQ 提交**

```ts
async create(userId: string, dto: CreateVideoTaskDto) {
  const pointCost = this.estimatePointCost(dto);

  await this.pointsService.freeze({
    userId,
    amount: pointCost,
    businessType: 'VIDEO_TASK',
    businessId: dto.projectId,
  });

  const task = await this.prisma.videoGenerateTask.create({
    data: {
      userId,
      projectId: dto.projectId,
      status: 'QUEUED',
      pointCost,
    },
  });

  await this.queueService.add('video-generate-queue', {
    taskId: task.id,
    userId,
  });

  return task;
}
```

- [ ] **Step 4: 实现视频生成 processor、写回 processor 与失败返还**

```ts
try {
  const providerTask = await this.videoProvider.submit({
    taskId: task.id,
    script: script.content,
    storyboard: storyboard.items,
  });

  await tx.videoGenerateTask.update({
    where: { id: task.id },
    data: {
      status: 'PROCESSING',
      providerTaskId: providerTask.providerTaskId,
    },
  });
} catch (error) {
  await this.pointsService.refund({
    userId: task.userId,
    amount: task.pointCost,
    businessType: 'VIDEO_TASK',
    businessId: task.id,
  });
  throw error;
}
```

```ts
await tx.video.create({
  data: {
    projectId: task.projectId,
    taskId: task.id,
    title: `${project.name}-成片 01`,
    coverUrl: result.coverUrl,
    previewUrl: result.previewUrl,
    downloadUrl: result.downloadUrl,
  },
});
```

- [ ] **Step 5: 跑 e2e 并提交**

Run: `pnpm --filter @make-video/server test -- --runInBand test/video-tasks.e2e-spec.ts`
Expected: PASS

```bash
git add apps/server/src/modules/video-tasks apps/server/src/modules/videos apps/server/src/queues/video-generate.processor.ts apps/server/src/queues/video-writeback.processor.ts apps/server/test/video-tasks.e2e-spec.ts
git commit -m "feat: add video task and library flow"
```

### Task 8: 实现 points、payments、充值回调与幂等控制

**Files:**
- Modify: `apps/server/src/modules/points/points.module.ts`
- Create: `apps/server/src/modules/points/points.controller.ts`
- Create: `apps/server/src/modules/payments/payments.module.ts`
- Create: `apps/server/src/modules/payments/payments.controller.ts`
- Create: `apps/server/src/modules/payments/payments.service.ts`
- Create: `apps/server/src/modules/payments/dto/create-recharge-order.dto.ts`
- Create: `apps/server/test/payments-points.e2e-spec.ts`

- [ ] **Step 1: 写积分账户、流水、充值订单与支付回调 e2e**

```ts
it('creates recharge order and credits points idempotently', async () => {
  const token = await loginAndGetAccessToken(app);

  const order = await request(app.getHttpServer())
    .post('/api/payments/recharge-orders')
    .set('Authorization', `Bearer ${token}`)
    .send({ packageId: 'starter-1000' })
    .expect(200);

  await request(app.getHttpServer())
    .post('/api/payments/recharge-orders/callback')
    .send({
      orderNo: order.body.data.orderNo,
      providerTradeNo: 'mock-trade-1',
      status: 'PAID',
    })
    .expect(200);

  const account = await request(app.getHttpServer())
    .get('/api/points/account')
    .set('Authorization', `Bearer ${token}`)
    .expect(200);

  expect(account.body.data.availablePoints).toBeGreaterThan(1000);
});
```

- [ ] **Step 2: 运行测试确认 points / payments 接口尚未落地**

Run: `pnpm --filter @make-video/server test -- --runInBand test/payments-points.e2e-spec.ts`
Expected: FAIL

- [ ] **Step 3: 实现积分账户接口与流水列表**

```ts
@Get('account')
getAccount(@CurrentUser() user: JwtUser) {
  return this.pointsService.getAccount(user.userId);
}

@Get('transactions')
getTransactions(@CurrentUser() user: JwtUser, @Query() query: PagingDto) {
  return this.pointsService.getTransactions(user.userId, query);
}
```

- [ ] **Step 4: 实现充值订单、mock 支付回调与幂等处理**

```ts
async handlePaidCallback(payload: PaymentCallbackDto) {
  return this.prisma.$transaction(async (tx) => {
    const order = await tx.rechargeOrder.findUniqueOrThrow({
      where: { orderNo: payload.orderNo },
    });

    if (order.status === 'PAID') {
      return order;
    }

    await tx.rechargeOrder.update({
      where: { id: order.id },
      data: {
        status: 'PAID',
        providerTradeNo: payload.providerTradeNo,
      },
    });

    await this.pointsService.rechargeInTx(tx, {
      userId: order.userId,
      amount: order.packagePoints,
      businessType: 'RECHARGE_ORDER',
      businessId: order.id,
    });
  });
}
```

- [ ] **Step 5: 跑 e2e 并提交**

Run: `pnpm --filter @make-video/server test -- --runInBand test/payments-points.e2e-spec.ts`
Expected: PASS

```bash
git add apps/server/src/modules/points apps/server/src/modules/payments apps/server/test/payments-points.e2e-spec.ts
git commit -m "feat: add points and payment flow"
```

### Task 9: 补全 Swagger、seed、README 与最终回归

**Files:**
- Modify: `apps/server/src/bootstrap.ts`
- Modify: `apps/server/src/main.ts`
- Create: `apps/server/README.md`
- Modify: `apps/server/test/docs.e2e-spec.ts`
- Modify: `apps/server/test/health.e2e-spec.ts`
- Modify: `apps/server/.env.example`

- [ ] **Step 1: 先写 Swagger 覆盖断言**

```ts
it('exposes auth, project, video task and payment paths in openapi', async () => {
  const response = await request(app.getHttpServer()).get('/docs-json');

  expect(response.status).toBe(200);
  expect(response.body.paths['/api/auth/login-by-sms']).toBeDefined();
  expect(response.body.paths['/api/projects']).toBeDefined();
  expect(response.body.paths['/api/video-tasks']).toBeDefined();
  expect(response.body.paths['/api/payments/recharge-orders']).toBeDefined();
});
```

- [ ] **Step 2: 运行 docs 测试确认接口尚未完整暴露**

Run: `pnpm --filter @make-video/server test -- --runInBand test/docs.e2e-spec.ts`
Expected: FAIL，直到所有控制器和 Swagger 注解完善

- [ ] **Step 3: 补全 README、seed 和联调说明**

````md
# Server Backend

## 启动

```bash
docker compose up -d
pnpm --filter @make-video/server exec prisma migrate dev --schema ../../prisma/schema.prisma
pnpm --filter @make-video/server exec ts-node ../../prisma/seed.ts
pnpm --filter @make-video/server dev
```

## 核心模块

- auth / users
- news / projects / scripts / storyboards
- assets / references
- video-tasks / videos
- points / payments

## 本地联调

- Swagger: `http://127.0.0.1:3000/docs`
- OpenAPI JSON: `http://127.0.0.1:3000/docs-json`
````

- [ ] **Step 4: 跑最终全量验证**

Run: `pnpm --filter @make-video/server lint`
Expected: PASS

Run: `pnpm --filter @make-video/server typecheck`
Expected: PASS

Run: `pnpm --filter @make-video/server test`
Expected: PASS

Run: `pnpm --filter @make-video/server build`
Expected: PASS

- [ ] **Step 5: 提交**

```bash
git add apps/server/README.md apps/server/.env.example apps/server/src/bootstrap.ts apps/server/src/main.ts apps/server/test prisma/seed.ts
git commit -m "docs: finish backend mvp setup guide"
```

## 自检

- 产品主链路覆盖：
  - 登录 -> 新闻搜索 -> 创建项目 -> 生成脚本 -> 生成分镜 -> 提交视频任务 -> 成品入库
- 资产与辅助能力覆盖：
  - 图片素材上传、参考视频上传与分析、脚本参考库
- 商业化与积分覆盖：
  - 积分账户、积分流水、冻结 / 扣除 / 返还、充值订单、支付成功回调
- 工程要求覆盖：
  - Prisma schema、Swagger、BullMQ、Redis、provider 抽象、统一异常、统一响应、事务与幂等

## 计划自检结论

1. 需求覆盖完整：MVP 中列出的 26 项功能已经映射到 Task 4 到 Task 9，没有遗漏支付、回调、冻结积分或成品库写回。
2. 已识别前置风险：当前前端共享状态值与后端需求的大写枚举冲突，本计划没有忽略这一点，执行前必须明确是否同步调整共享契约。
3. 没有占位语句：任务、文件、测试命令、提交点和关键实现骨架都已写明，可直接按任务执行。
