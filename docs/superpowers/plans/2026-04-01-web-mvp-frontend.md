# Web Frontend MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 基于当前 monorepo 骨架，交付一个可直接进入联调阶段的“新闻驱动的 AI 视频生成平台”前端 MVP，覆盖登录、工作台、新闻选题、AI 创作、视频生成、任务中心、成品库、素材库、脚本参考库、个人中心、积分充值和积分明细页面。

**Architecture:** 延续现有 `apps/web + packages/shared + packages/sdk` 边界：`apps/web` 负责页面、路由、状态和交互，`packages/shared` 承载跨端业务类型与状态枚举，`packages/sdk` 升级为 Axios 驱动的统一 API 客户端与模块接口。前端采用“后台工作台布局 + 模块化路由 + Pinia 模块 store + mock-first API”模式，先打通完整业务主链路和统一状态视图，再补齐资产类与账户类页面。

**Tech Stack:** Vue 3, Vite, TypeScript, Vue Router, Pinia, Naive UI, UnoCSS, Axios, Vitest, Vue Test Utils

---

## 文件结构与职责

### `packages/shared`

- `packages/shared/src/auth.ts`：登录、用户信息、积分信息类型
- `packages/shared/src/news.ts`：新闻、项目创建参数、已选新闻类型
- `packages/shared/src/project.ts`：项目状态、创作参数、脚本、分镜类型
- `packages/shared/src/task.ts`：视频生成任务类型与状态
- `packages/shared/src/asset.ts`：素材、参考图、视频成品类型
- `packages/shared/src/reference.ts`：参考视频分析结果与状态
- `packages/shared/src/billing.ts`：积分套餐、积分明细类型
- `packages/shared/src/api.ts`：`ApiResponse<T>`、分页、通用查询参数
- `packages/shared/src/index.ts`：统一导出入口
- `packages/shared/src/*.test.ts`：关键运行时守卫与状态映射测试

### `packages/sdk`

- `packages/sdk/src/http.ts`：Axios 实例工厂、拦截器、401 处理、超时与错误归一
- `packages/sdk/src/mock.ts`：mock 模式开关与响应包装
- `packages/sdk/src/modules/auth.ts`：认证相关 API
- `packages/sdk/src/modules/dashboard.ts`：工作台 API
- `packages/sdk/src/modules/news.ts`：新闻搜索与项目创建 API
- `packages/sdk/src/modules/project.ts`：脚本/分镜/创作参数 API
- `packages/sdk/src/modules/task.ts`：任务中心 API
- `packages/sdk/src/modules/library.ts`：成品库 API
- `packages/sdk/src/modules/asset.ts`：素材库 API
- `packages/sdk/src/modules/reference.ts`：脚本参考库 API
- `packages/sdk/src/modules/billing.ts`：积分与充值 API
- `packages/sdk/src/client.ts`：聚合模块 client
- `packages/sdk/src/index.ts`：统一导出
- `packages/sdk/src/*.test.ts`：SDK 层单元测试

### `apps/web/src`

- `apps/web/src/main.ts`：注册 Pinia、Router、Naive UI Provider、全局样式
- `apps/web/src/App.vue`：Provider 外壳和全局通知容器
- `apps/web/src/router/index.ts`：组合模块路由
- `apps/web/src/router/guards.ts`：登录守卫、默认跳转、401 失效回退
- `apps/web/src/router/modules/*.ts`：按业务模块拆分路由
- `apps/web/src/constants/*.ts`：导航、状态颜色、积分套餐、mock 开关
- `apps/web/src/types/*.ts`：仅前端本地展示辅助类型
- `apps/web/src/styles/theme.ts`：Naive UI 主题覆盖
- `apps/web/src/styles/main.css`：全局布局、滚动区、编辑器、卡片统一样式
- `apps/web/src/layouts/AppShell.vue`：顶部栏 + 左侧导航 + 内容区
- `apps/web/src/layouts/AuthLayout.vue`：登录页布局
- `apps/web/src/composables/useAsyncPage.ts`：统一 loading / empty / error 状态封装
- `apps/web/src/components/common/PageContainer.vue`：页面容器
- `apps/web/src/components/common/StatusTag.vue`：统一状态标签
- `apps/web/src/components/common/EmptyState.vue`：空状态
- `apps/web/src/components/common/ListSkeleton.vue`：列表加载骨架
- `apps/web/src/components/common/DeleteConfirmDialog.vue`：危险操作确认弹窗
- `apps/web/src/components/common/FileUploadTrigger.vue`：上传入口封装
- `apps/web/src/components/cards/ProjectCard.vue`：项目卡片
- `apps/web/src/components/cards/VideoCard.vue`：视频卡片
- `apps/web/src/components/cards/NewsCard.vue`：新闻卡片
- `apps/web/src/components/forms/ProjectParamForm.vue`：创作参数表单
- `apps/web/src/components/forms/StoryboardEditor.vue`：分镜编辑器
- `apps/web/src/components/forms/ScriptEditor.vue`：脚本编辑器
- `apps/web/src/components/project/ReferencePanel.vue`：AI 创作页参考内容面板
- `apps/web/src/api/client.ts`：创建应用级 SDK 实例
- `apps/web/src/api/mock/*.ts`：mock 数据与 mock handler
- `apps/web/src/stores/auth.ts`：登录态、token、用户信息
- `apps/web/src/stores/ui.ts`：导航折叠、全局 loading、全局对话框
- `apps/web/src/stores/dashboard.ts`：工作台数据
- `apps/web/src/stores/news.ts`：新闻搜索与已选新闻
- `apps/web/src/stores/project.ts`：项目、脚本、分镜、创作参数
- `apps/web/src/stores/task.ts`：任务中心
- `apps/web/src/stores/asset.ts`：素材库
- `apps/web/src/stores/reference.ts`：脚本参考库
- `apps/web/src/stores/library.ts`：成品库
- `apps/web/src/stores/billing.ts`：积分余额、充值套餐、积分明细
- `apps/web/src/views/auth/LoginView.vue`：登录页
- `apps/web/src/views/dashboard/DashboardView.vue`：工作台
- `apps/web/src/views/news/NewsTopicView.vue`：新闻选题页
- `apps/web/src/views/project/AiWorkspaceView.vue`：AI 创作页
- `apps/web/src/views/project/VideoGenerateView.vue`：视频生成页
- `apps/web/src/views/task/TaskCenterView.vue`：任务中心页
- `apps/web/src/views/library/LibraryView.vue`：成品库
- `apps/web/src/views/asset/AssetLibraryView.vue`：素材库
- `apps/web/src/views/reference/ReferenceLibraryView.vue`：脚本参考库
- `apps/web/src/views/account/ProfileView.vue`：个人中心
- `apps/web/src/views/billing/RechargeView.vue`：积分充值页
- `apps/web/src/views/billing/PointHistoryView.vue`：积分明细页
- `apps/web/src/views/*/*.spec.ts`：关键页面渲染与交互测试
- `apps/web/src/router/router.spec.ts`：路由守卫测试
- `apps/web/README.md`：前端独立开发说明

## 实施顺序

先补齐契约、SDK、应用骨架和 mock 能力，再做登录和主布局，之后按“主链路优先”顺序实现工作台、新闻选题、AI 创作、视频生成、任务中心，最后补资产和账户积分页面。这样可以尽快形成一条可演示、可联调、可回归测试的前端主链路。

### Task 1: 补齐跨端类型、Axios SDK 与前端工程骨架

**Files:**
- Modify: `apps/web/package.json`
- Modify: `packages/shared/src/index.ts`
- Create: `packages/shared/src/api.ts`
- Create: `packages/shared/src/auth.ts`
- Create: `packages/shared/src/news.ts`
- Create: `packages/shared/src/project.ts`
- Create: `packages/shared/src/task.ts`
- Create: `packages/shared/src/asset.ts`
- Create: `packages/shared/src/reference.ts`
- Create: `packages/shared/src/billing.ts`
- Create: `packages/shared/src/status.ts`
- Create: `packages/shared/src/status.test.ts`
- Modify: `packages/sdk/package.json`
- Create: `packages/sdk/src/http.ts`
- Create: `packages/sdk/src/mock.ts`
- Create: `packages/sdk/src/modules/auth.ts`
- Create: `packages/sdk/src/modules/dashboard.ts`
- Create: `packages/sdk/src/modules/news.ts`
- Create: `packages/sdk/src/modules/project.ts`
- Create: `packages/sdk/src/modules/task.ts`
- Create: `packages/sdk/src/modules/library.ts`
- Create: `packages/sdk/src/modules/asset.ts`
- Create: `packages/sdk/src/modules/reference.ts`
- Create: `packages/sdk/src/modules/billing.ts`
- Modify: `packages/sdk/src/client.ts`
- Modify: `packages/sdk/src/index.ts`
- Create: `packages/sdk/src/client.test.ts`
- Create: `apps/web/src/constants/navigation.ts`
- Create: `apps/web/src/constants/status.ts`
- Create: `apps/web/src/styles/theme.ts`
- Create: `apps/web/src/composables/useAsyncPage.ts`
- Create: `apps/web/src/stores/ui.ts`

- [ ] **Step 1: 先补依赖和共享契约测试**

```json
{
  "dependencies": {
    "@make-video/shared": "workspace:*",
    "axios": "^1.9.0"
  }
}
```

```ts
import { describe, expect, it } from 'vitest';
import {
  PROJECT_STATUS_OPTIONS,
  TASK_STATUS_OPTIONS,
  REFERENCE_STATUS_OPTIONS,
} from './status';

describe('status catalogs', () => {
  it('covers all project statuses used by web flows', () => {
    expect(PROJECT_STATUS_OPTIONS).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ value: 'created' }),
        expect.objectContaining({ value: 'script_pending_confirm' }),
        expect.objectContaining({ value: 'completed' }),
      ]),
    );
  });

  it('keeps task and reference statuses explicit', () => {
    expect(TASK_STATUS_OPTIONS.some((item) => item.value === 'partial_success')).toBe(true);
    expect(REFERENCE_STATUS_OPTIONS.some((item) => item.value === 'analyzing')).toBe(true);
  });
});
```

- [ ] **Step 2: 定义共享业务类型和状态字典**

```ts
export type ApiResponse<T> = {
  code: number;
  message: string;
  data: T;
};

export type ProjectStatus =
  | 'created'
  | 'script_generating'
  | 'script_pending_confirm'
  | 'script_confirmed'
  | 'video_generating'
  | 'completed'
  | 'failed';

export type TaskStatus =
  | 'pending_submit'
  | 'queued'
  | 'generating'
  | 'success'
  | 'partial_success'
  | 'failed'
  | 'canceled';

export type ReferenceAnalysisStatus =
  | 'pending'
  | 'analyzing'
  | 'success'
  | 'failed';
```

- [ ] **Step 3: 将 SDK 升级为 Axios + 模块接口**

```ts
export interface SdkClientOptions {
  baseUrl: string;
  getToken?: () => string | null;
  onUnauthorized?: () => void;
  mock?: boolean;
  timeout?: number;
  transport?: (config: HttpRequestConfig) => Promise<{ data: unknown }>;
}

export function createSdkClient(options: SdkClientOptions) {
  const http = createHttpClient(options);

  return {
    auth: createAuthModule(http),
    dashboard: createDashboardModule(http),
    news: createNewsModule(http),
    project: createProjectModule(http),
    task: createTaskModule(http),
    library: createLibraryModule(http),
    asset: createAssetModule(http),
    reference: createReferenceModule(http),
    billing: createBillingModule(http),
  };
}
```

- [ ] **Step 4: 补 SDK 层单测，覆盖 token、401 和 mock**

```ts
import { describe, expect, it, vi } from 'vitest';
import { createSdkClient } from './client';

describe('createSdkClient', () => {
  it('injects bearer token when getToken returns value', async () => {
    const transport = vi.fn().mockResolvedValue({
      data: { code: 0, message: 'ok', data: { token: 'x', profile: null } },
    });

    const client = createSdkClient({
      baseUrl: 'http://example.com',
      getToken: () => 'token-1',
      transport,
    });

    await client.dashboard.getSummary();
    expect(transport).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer token-1' }),
      }),
    );
  });
});
```

- [ ] **Step 5: 建立前端主题、导航常量和统一异步状态工具**

```ts
export const appThemeOverrides = {
  common: {
    primaryColor: '#2563EB',
    successColor: '#16A34A',
    warningColor: '#D97706',
    errorColor: '#DC2626',
    borderRadius: '12px',
  },
};
```

```ts
export function useAsyncPage<T>(loader: () => Promise<T>) {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const data = ref<T | null>(null);

  async function execute() {
    loading.value = true;
    error.value = null;

    try {
      data.value = await loader();
    } catch (reason) {
      error.value = reason instanceof Error ? reason.message : '加载失败';
    } finally {
      loading.value = false;
    }
  }

  return { loading, error, data, execute };
}
```

- [ ] **Step 6: 运行基础测试和构建检查**

Run: `env COREPACK_HOME=/tmp/corepack-home NPM_CONFIG_USERCONFIG=/tmp/empty-npmrc npm_config_registry=https://registry.npmjs.org corepack pnpm@10.19.0 --filter @make-video/shared test`
Expected: PASS，新增的 shared 类型/状态测试通过

Run: `env COREPACK_HOME=/tmp/corepack-home NPM_CONFIG_USERCONFIG=/tmp/empty-npmrc npm_config_registry=https://registry.npmjs.org corepack pnpm@10.19.0 --filter @make-video/sdk test`
Expected: PASS，SDK 单测通过

Run: `env COREPACK_HOME=/tmp/corepack-home NPM_CONFIG_USERCONFIG=/tmp/empty-npmrc npm_config_registry=https://registry.npmjs.org corepack pnpm@10.19.0 --filter @make-video/web typecheck`
Expected: PASS，web 可以消费新的 shared/sdk 导出

- [ ] **Step 7: 提交**

```bash
git add packages/shared packages/sdk apps/web/package.json apps/web/src/constants apps/web/src/styles apps/web/src/composables apps/web/src/stores/ui.ts
git commit -m "feat: add frontend shared contracts and sdk foundation"
```

### Task 2: 建立路由体系、登录鉴权和后台主布局

**Files:**
- Modify: `apps/web/src/main.ts`
- Modify: `apps/web/src/App.vue`
- Modify: `apps/web/src/router/index.ts`
- Create: `apps/web/src/router/guards.ts`
- Create: `apps/web/src/router/modules/auth.ts`
- Create: `apps/web/src/router/modules/dashboard.ts`
- Create: `apps/web/src/router/modules/news.ts`
- Create: `apps/web/src/router/modules/project.ts`
- Create: `apps/web/src/router/modules/task.ts`
- Create: `apps/web/src/router/modules/library.ts`
- Create: `apps/web/src/router/modules/asset.ts`
- Create: `apps/web/src/router/modules/reference.ts`
- Create: `apps/web/src/router/modules/account.ts`
- Create: `apps/web/src/router/modules/billing.ts`
- Create: `apps/web/src/layouts/AppShell.vue`
- Create: `apps/web/src/layouts/AuthLayout.vue`
- Create: `apps/web/src/stores/auth.ts`
- Create: `apps/web/src/views/auth/LoginView.vue`
- Create: `apps/web/src/router/router.spec.ts`

- [ ] **Step 1: 先写路由守卫测试**

```ts
import { beforeEach, describe, expect, it } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import router from './index';
import { useAuthStore } from '../stores/auth';

describe('router guards', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('redirects anonymous users to login', async () => {
    await router.push('/dashboard');
    expect(router.currentRoute.value.fullPath).toBe('/login');
  });

  it('redirects logged-in users away from login', async () => {
    const authStore = useAuthStore();
    authStore.token = 'token-1';
    await router.push('/login');
    expect(router.currentRoute.value.fullPath).toBe('/dashboard');
  });
});
```

- [ ] **Step 2: 落认证 store 和登录流程**

```ts
export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null);
  const profile = ref<UserProfile | null>(null);

  const isAuthenticated = computed(() => Boolean(token.value));

  async function login(payload: LoginPayload) {
    const result = await apiClient.auth.login(payload);
    token.value = result.token;
    profile.value = result.profile;
  }

  function logout() {
    token.value = null;
    profile.value = null;
  }

  return { token, profile, isAuthenticated, login, logout };
});
```

- [ ] **Step 3: 构建后台主布局和导航**

```vue
<template>
  <div class="min-h-screen bg-[#F9FAFB] text-[#374151]">
    <header class="h-14 border-b border-[#E5E7EB] bg-white">
      <div class="mx-auto flex h-full items-center justify-between px-6">
        <div class="text-base font-semibold text-[#111827]">Make Video</div>
        <div class="flex items-center gap-4">
          <span class="text-sm text-[#6B7280]">可用积分 {{ pointBalance }}</span>
          <NButton quaternary @click="handleLogout">退出登录</NButton>
        </div>
      </div>
    </header>
    <div class="flex">
      <aside class="min-h-[calc(100vh-56px)] w-[220px] border-r border-[#E5E7EB] bg-white">
        <nav class="px-3 py-4">
          <RouterLink
            v-for="item in navigationItems"
            :key="item.key"
            :to="item.to"
            class="mb-1 flex h-10 items-center rounded-[8px] px-3 text-sm text-[#374151] hover:bg-[#EFF6FF]"
          >
            {{ item.label }}
          </RouterLink>
        </nav>
      </aside>
      <main class="min-w-0 flex-1 p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>
```

- [ ] **Step 4: 实现登录页并接入 Naive UI 表单**

```vue
<template>
  <AuthLayout>
    <NCard title="手机号登录" class="w-full max-w-[420px] rounded-[12px]">
      <NForm :model="form" :rules="rules">
        <NFormItem label="手机号" path="phone">
          <NInput v-model:value="form.phone" placeholder="请输入手机号" />
        </NFormItem>
        <NFormItem label="验证码" path="code">
          <div class="flex gap-3">
            <NInput v-model:value="form.code" placeholder="请输入验证码" />
            <NButton secondary>发送验证码</NButton>
          </div>
        </NFormItem>
        <NButton type="primary" block @click="handleSubmit">登录并进入工作台</NButton>
      </NForm>
    </NCard>
  </AuthLayout>
</template>
```

- [ ] **Step 5: 运行路由、登录页测试与类型检查**

Run: `env COREPACK_HOME=/tmp/corepack-home NPM_CONFIG_USERCONFIG=/tmp/empty-npmrc npm_config_registry=https://registry.npmjs.org corepack pnpm@10.19.0 --filter @make-video/web test`
Expected: PASS，路由守卫测试通过

Run: `env COREPACK_HOME=/tmp/corepack-home NPM_CONFIG_USERCONFIG=/tmp/empty-npmrc npm_config_registry=https://registry.npmjs.org corepack pnpm@10.19.0 --filter @make-video/web lint`
Expected: PASS，新增布局和路由文件 lint 通过

- [ ] **Step 6: 提交**

```bash
git add apps/web/src/main.ts apps/web/src/App.vue apps/web/src/router apps/web/src/layouts apps/web/src/stores/auth.ts apps/web/src/views/auth
git commit -m "feat: add auth flow and admin shell layout"
```

### Task 3: 建立统一页面容器、状态组件和工作台页

**Files:**
- Create: `apps/web/src/components/common/PageContainer.vue`
- Create: `apps/web/src/components/common/StatusTag.vue`
- Create: `apps/web/src/components/common/EmptyState.vue`
- Create: `apps/web/src/components/common/ListSkeleton.vue`
- Create: `apps/web/src/components/common/DeleteConfirmDialog.vue`
- Create: `apps/web/src/components/cards/ProjectCard.vue`
- Create: `apps/web/src/components/cards/VideoCard.vue`
- Create: `apps/web/src/stores/dashboard.ts`
- Create: `apps/web/src/views/dashboard/DashboardView.vue`
- Create: `apps/web/src/views/dashboard/DashboardView.spec.ts`

- [ ] **Step 1: 先写工作台页面测试**

```ts
import { mount } from '@vue/test-utils';
import DashboardView from './DashboardView.vue';

it('renders quick entries and recent sections', async () => {
  const wrapper = mount(DashboardView);
  expect(wrapper.text()).toContain('新建项目');
  expect(wrapper.text()).toContain('最近项目');
  expect(wrapper.text()).toContain('最近成品视频');
});
```

- [ ] **Step 2: 实现通用页面容器与状态组件**

```vue
<template>
  <section class="space-y-6">
    <header class="flex items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold text-[#111827]">{{ title }}</h1>
        <p v-if="description" class="mt-1 text-[13px] text-[#6B7280]">{{ description }}</p>
      </div>
      <slot name="extra" />
    </header>
    <slot />
  </section>
</template>
```

```vue
<template>
  <NTag :type="mapped.type" :bordered="false" round size="small">
    {{ mapped.label }}
  </NTag>
</template>
```

- [ ] **Step 3: 实现工作台 store 和页面**

```ts
export const useDashboardStore = defineStore('dashboard', () => {
  const summary = ref<DashboardSummary | null>(null);
  const projects = ref<ProjectCardItem[]>([]);
  const videos = ref<VideoCardItem[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchDashboard() {
    loading.value = true;
    error.value = null;
    try {
      const result = await apiClient.dashboard.getSummary();
      summary.value = result.summary;
      projects.value = result.recentProjects;
      videos.value = result.recentVideos;
    } catch (reason) {
      error.value = reason instanceof Error ? reason.message : '加载失败';
    } finally {
      loading.value = false;
    }
  }

  return { summary, projects, videos, loading, error, fetchDashboard };
});
```

- [ ] **Step 4: 给工作台补 loading / empty / error 三态**

```vue
<template>
  <PageContainer title="工作台" description="快速开始新的内容生产任务">
    <template #extra>
      <NButton type="primary" @click="router.push('/news/topics')">去选新闻</NButton>
    </template>

    <NAlert v-if="error" type="error" closable>
      {{ error }}
      <template #action>
        <NButton text @click="store.fetchDashboard">重试</NButton>
      </template>
    </NAlert>

    <ListSkeleton v-else-if="loading" :rows="4" />
    <EmptyState v-else-if="!projects.length && !videos.length" title="还没有内容" description="从新闻选题开始创建第一个项目" />
  </PageContainer>
</template>
```

- [ ] **Step 5: 运行工作台测试**

Run: `env COREPACK_HOME=/tmp/corepack-home NPM_CONFIG_USERCONFIG=/tmp/empty-npmrc npm_config_registry=https://registry.npmjs.org corepack pnpm@10.19.0 --filter @make-video/web test -- DashboardView`
Expected: PASS，工作台结构和快捷入口断言通过

- [ ] **Step 6: 提交**

```bash
git add apps/web/src/components/common apps/web/src/components/cards apps/web/src/stores/dashboard.ts apps/web/src/views/dashboard
git commit -m "feat: add dashboard view and shared page components"
```

### Task 4: 实现新闻选题页与项目创建入口

**Files:**
- Create: `apps/web/src/components/cards/NewsCard.vue`
- Create: `apps/web/src/stores/news.ts`
- Create: `apps/web/src/views/news/NewsTopicView.vue`
- Create: `apps/web/src/views/news/NewsTopicView.spec.ts`

- [ ] **Step 1: 先写新闻选题页测试**

```ts
import { mount } from '@vue/test-utils';
import NewsTopicView from './NewsTopicView.vue';

it('supports selecting multiple news items and next step action', async () => {
  const wrapper = mount(NewsTopicView);
  expect(wrapper.text()).toContain('新闻选题');
  expect(wrapper.text()).toContain('搜索新闻');
  expect(wrapper.text()).toContain('下一步：进入 AI 创作');
});
```

- [ ] **Step 2: 落新闻 store，区分关键词、结果、已选新闻**

```ts
export const useNewsStore = defineStore('news', () => {
  const keyword = ref('');
  const items = ref<NewsItem[]>([]);
  const selectedIds = ref<string[]>([]);

  const selectedItems = computed(() =>
    items.value.filter((item) => selectedIds.value.includes(item.id)),
  );

  async function search() {
    items.value = await apiClient.news.search({ keyword: keyword.value });
  }

  async function createProject() {
    return apiClient.news.createProject({
      keyword: keyword.value,
      newsIds: selectedIds.value,
    });
  }

  return { keyword, items, selectedIds, selectedItems, search, createProject };
});
```

- [ ] **Step 3: 实现新闻选题页**

```vue
<template>
  <PageContainer title="新闻选题" description="从热点新闻中筛选可做的视频主题">
    <NCard>
      <div class="flex gap-4">
        <NInput v-model:value="store.keyword" placeholder="输入养老、科技、机器人等关键词" />
        <NButton type="primary" :loading="loading" @click="store.search">搜索新闻</NButton>
      </div>
    </NCard>

    <div class="grid grid-cols-[minmax(0,1fr)_320px] gap-6">
      <NCard title="新闻列表">
        <ListSkeleton v-if="store.loading" :rows="5" />
        <EmptyState
          v-else-if="!store.items.length"
          title="还没有搜索结果"
          description="输入关键词后查看相关新闻"
        />
        <div v-else class="space-y-4">
          <NewsCard
            v-for="item in store.items"
            :key="item.id"
            :news="item"
            :checked="store.selectedIds.includes(item.id)"
            @toggle="store.toggle(item.id)"
          />
        </div>
      </NCard>
      <NCard title="已选新闻">
        <ul class="space-y-3 text-sm text-[#374151]">
          <li v-for="item in store.selectedItems" :key="item.id" class="rounded-[8px] bg-[#F9FAFB] px-3 py-2">
            {{ item.title }}
          </li>
        </ul>
        <NButton type="primary" block :disabled="!store.selectedItems.length" @click="handleNext">
          下一步：进入 AI 创作
        </NButton>
      </NCard>
    </div>
  </PageContainer>
</template>
```

- [ ] **Step 4: 接入项目创建后的跳转**

```ts
async function handleNext() {
  const project = await store.createProject();
  await router.push({ name: 'project-workspace', params: { projectId: project.id } });
}
```

- [ ] **Step 5: 运行测试**

Run: `env COREPACK_HOME=/tmp/corepack-home NPM_CONFIG_USERCONFIG=/tmp/empty-npmrc npm_config_registry=https://registry.npmjs.org corepack pnpm@10.19.0 --filter @make-video/web test -- NewsTopicView`
Expected: PASS，新闻选题页基础流程测试通过

- [ ] **Step 6: 提交**

```bash
git add apps/web/src/components/cards/NewsCard.vue apps/web/src/stores/news.ts apps/web/src/views/news
git commit -m "feat: add news topic selection flow"
```

### Task 5: 实现 AI 创作页主链路

**Files:**
- Create: `apps/web/src/components/forms/ProjectParamForm.vue`
- Create: `apps/web/src/components/forms/ScriptEditor.vue`
- Create: `apps/web/src/components/forms/StoryboardEditor.vue`
- Create: `apps/web/src/components/project/ReferencePanel.vue`
- Create: `apps/web/src/stores/project.ts`
- Create: `apps/web/src/views/project/AiWorkspaceView.vue`
- Create: `apps/web/src/views/project/AiWorkspaceView.spec.ts`

- [ ] **Step 1: 先写 AI 创作页测试**

```ts
import { mount } from '@vue/test-utils';
import AiWorkspaceView from './AiWorkspaceView.vue';

it('renders two-column workspace with script and storyboard sections', async () => {
  const wrapper = mount(AiWorkspaceView);
  expect(wrapper.text()).toContain('AI 创作');
  expect(wrapper.text()).toContain('创作参数');
  expect(wrapper.text()).toContain('脚本模块');
  expect(wrapper.text()).toContain('分镜模块');
  expect(wrapper.text()).toContain('确认进入下一步');
});
```

- [ ] **Step 2: 建立项目 store**

```ts
export const useProjectStore = defineStore('project', () => {
  const detail = ref<ProjectDetail | null>(null);
  const script = ref('');
  const storyboard = ref<StoryboardScene[]>([]);
  const generatingScript = ref(false);
  const generatingStoryboard = ref(false);

  async function load(projectId: string) {
    detail.value = await apiClient.project.getDetail(projectId);
    script.value = detail.value.scriptDraft;
    storyboard.value = detail.value.storyboardDraft;
  }

  async function generateScript() {
    generatingScript.value = true;
    script.value = await apiClient.project.generateScript(detail.value!.id);
    generatingScript.value = false;
  }

  return { detail, script, storyboard, generatingScript, generatingStoryboard, load, generateScript };
});
```

- [ ] **Step 3: 实现左右双栏 AI 创作页**

```vue
<template>
  <PageContainer title="AI 创作" description="补充参数、生成脚本和分镜并完成确认">
    <div class="grid grid-cols-[360px_minmax(0,1fr)] gap-6">
      <div class="space-y-6">
        <NCard title="项目信息">
          <NDescriptions bordered :column="1">
            <NDescriptionsItem label="项目名称">{{ store.detail?.name }}</NDescriptionsItem>
            <NDescriptionsItem label="项目状态">
              <StatusTag category="project" :status="store.detail?.status ?? 'created'" />
            </NDescriptionsItem>
          </NDescriptions>
        </NCard>
        <NCard title="已选新闻">
          <ul class="space-y-3">
            <li v-for="item in store.detail?.newsItems ?? []" :key="item.id">{{ item.title }}</li>
          </ul>
        </NCard>
        <NCard title="创作参数">
          <ProjectParamForm v-model="store.form" />
        </NCard>
        <NCard title="参考内容区">
          <ReferencePanel
            :images="store.referenceImages"
            :videos="store.referenceVideos"
            :references="store.referenceResults"
          />
        </NCard>
      </div>

      <div class="space-y-6">
        <NCard title="脚本模块">
          <NButton type="primary" @click="store.generateScript">生成脚本</NButton>
          <ScriptEditor v-model="store.script" />
        </NCard>

        <NCard title="分镜模块">
          <NButton type="primary" @click="store.generateStoryboard">生成分镜</NButton>
          <StoryboardEditor v-model="store.storyboard" />
        </NCard>
      </div>
    </div>

    <div class="sticky bottom-0 z-10 mt-6 flex justify-end gap-3 border-t border-[#E5E7EB] bg-[#F9FAFB] py-4">
      <NButton @click="store.saveDraft">保存</NButton>
      <NButton type="primary" @click="handleConfirm">确认进入下一步</NButton>
    </div>
  </PageContainer>
</template>
```

- [ ] **Step 4: 确保编辑与重生成能力清晰可用**

```ts
function appendScene() {
  storyboard.value.push({
    id: crypto.randomUUID(),
    title: '',
    durationSeconds: 5,
    visualPrompt: '',
    narration: '',
  });
}

function removeScene(sceneId: string) {
  storyboard.value = storyboard.value.filter((item) => item.id !== sceneId);
}
```

- [ ] **Step 5: 运行测试**

Run: `env COREPACK_HOME=/tmp/corepack-home NPM_CONFIG_USERCONFIG=/tmp/empty-npmrc npm_config_registry=https://registry.npmjs.org corepack pnpm@10.19.0 --filter @make-video/web test -- AiWorkspaceView`
Expected: PASS，AI 创作页双栏布局和核心按钮断言通过

- [ ] **Step 6: 提交**

```bash
git add apps/web/src/components/forms apps/web/src/stores/project.ts apps/web/src/views/project/AiWorkspaceView.vue apps/web/src/views/project/AiWorkspaceView.spec.ts
git commit -m "feat: add ai workspace flow"
```

### Task 6: 实现视频生成页和任务中心

**Files:**
- Create: `apps/web/src/stores/task.ts`
- Create: `apps/web/src/views/project/VideoGenerateView.vue`
- Create: `apps/web/src/views/project/VideoGenerateView.spec.ts`
- Create: `apps/web/src/views/task/TaskCenterView.vue`
- Create: `apps/web/src/views/task/TaskCenterView.spec.ts`

- [ ] **Step 1: 写视频生成页测试**

```ts
import { mount } from '@vue/test-utils';
import VideoGenerateView from './VideoGenerateView.vue';

it('shows generation config, balance and estimated points', async () => {
  const wrapper = mount(VideoGenerateView);
  expect(wrapper.text()).toContain('视频生成');
  expect(wrapper.text()).toContain('预计积分消耗');
  expect(wrapper.text()).toContain('提交生成任务');
});
```

- [ ] **Step 2: 写任务中心页测试**

```ts
import { mount } from '@vue/test-utils';
import TaskCenterView from './TaskCenterView.vue';

it('renders task filters and retry action for failed tasks', async () => {
  const wrapper = mount(TaskCenterView);
  expect(wrapper.text()).toContain('任务中心');
  expect(wrapper.text()).toContain('排队中');
  expect(wrapper.text()).toContain('重新提交');
});
```

- [ ] **Step 3: 实现视频生成页**

```vue
<template>
  <PageContainer title="视频生成" description="确认生成参数并提交异步任务">
    <div class="grid grid-cols-[minmax(0,1fr)_320px] gap-6">
      <NCard title="脚本 / 分镜摘要">
        <NDescriptions bordered :column="1">
          <NDescriptionsItem label="脚本标题">{{ store.summary.title }}</NDescriptionsItem>
          <NDescriptionsItem label="分镜数量">{{ store.summary.sceneCount }}</NDescriptionsItem>
          <NDescriptionsItem label="参考图片">{{ store.selectedImages.length }} 张</NDescriptionsItem>
        </NDescriptions>
      </NCard>
      <NCard title="生成信息">
        <NForm :model="form">
          <NFormItem label="生成数量"><NInputNumber v-model:value="form.count" :min="1" :max="4" /></NFormItem>
          <NFormItem label="画面比例"><NSelect v-model:value="form.aspectRatio" :options="ratioOptions" /></NFormItem>
          <NFormItem label="是否字幕"><NSwitch v-model:value="form.withSubtitle" /></NFormItem>
        </NForm>
        <NAlert type="info">预计积分消耗 {{ estimatedCost }}</NAlert>
        <NAlert type="success">当前积分余额 {{ pointBalance }}</NAlert>
        <NButton type="primary" block @click="handleSubmit">提交生成任务</NButton>
      </NCard>
    </div>
  </PageContainer>
</template>
```

- [ ] **Step 4: 实现任务中心页和统一状态标签**

```vue
<template>
  <PageContainer title="任务中心" description="查看生成任务状态、重试失败任务">
    <NCard>
      <div class="flex flex-wrap gap-3">
        <NSelect v-model:value="filters.status" :options="statusOptions" clearable placeholder="筛选任务状态" />
      </div>
    </NCard>

    <NDataTable :columns="columns" :data="tasks" :loading="loading" />
  </PageContainer>
</template>
```

- [ ] **Step 5: 补齐失败返还和重提逻辑**

```ts
const taskStore = useTaskStore();
const message = useMessage();

async function retryTask(taskId: string) {
  await taskStore.retry(taskId);
  message.success('任务已重新提交');
}
```

- [ ] **Step 6: 运行测试**

Run: `env COREPACK_HOME=/tmp/corepack-home NPM_CONFIG_USERCONFIG=/tmp/empty-npmrc npm_config_registry=https://registry.npmjs.org corepack pnpm@10.19.0 --filter @make-video/web test -- VideoGenerateView TaskCenterView`
Expected: PASS，视频生成页与任务中心页测试通过

- [ ] **Step 7: 提交**

```bash
git add apps/web/src/stores/task.ts apps/web/src/views/project/VideoGenerateView.vue apps/web/src/views/project/VideoGenerateView.spec.ts apps/web/src/views/task
git commit -m "feat: add video generation and task center pages"
```

### Task 7: 实现素材库、脚本参考库和成品库

**Files:**
- Create: `apps/web/src/components/common/FileUploadTrigger.vue`
- Create: `apps/web/src/stores/asset.ts`
- Create: `apps/web/src/stores/reference.ts`
- Create: `apps/web/src/stores/library.ts`
- Create: `apps/web/src/views/asset/AssetLibraryView.vue`
- Create: `apps/web/src/views/asset/AssetLibraryView.spec.ts`
- Create: `apps/web/src/views/reference/ReferenceLibraryView.vue`
- Create: `apps/web/src/views/reference/ReferenceLibraryView.spec.ts`
- Create: `apps/web/src/views/library/LibraryView.vue`
- Create: `apps/web/src/views/library/LibraryView.spec.ts`

- [ ] **Step 1: 写三类资产页测试**

```ts
import { mount } from '@vue/test-utils';
import AssetLibraryView from './AssetLibraryView.vue';

it('renders asset upload and selectable materials', async () => {
  const wrapper = mount(AssetLibraryView);
  expect(wrapper.text()).toContain('素材库');
  expect(wrapper.text()).toContain('上传参考图');
});
```

```ts
import { mount } from '@vue/test-utils';
import ReferenceLibraryView from './ReferenceLibraryView.vue';

it('renders reference analysis states and detail entry', async () => {
  const wrapper = mount(ReferenceLibraryView);
  expect(wrapper.text()).toContain('脚本参考库');
  expect(wrapper.text()).toContain('分析状态');
});
```

```ts
import { mount } from '@vue/test-utils';
import LibraryView from './LibraryView.vue';

it('renders generated video library actions', async () => {
  const wrapper = mount(LibraryView);
  expect(wrapper.text()).toContain('成品库');
  expect(wrapper.text()).toContain('下载');
});
```

- [ ] **Step 2: 落素材库**

```vue
<template>
  <PageContainer title="素材库" description="统一管理参考图片，供创作页和视频生成页引用">
    <div class="flex items-center justify-between">
      <FileUploadTrigger button-text="上传参考图" accept="image/*" @select="store.uploadImage" />
    </div>

    <ListSkeleton v-if="store.loading" :rows="6" />
    <EmptyState v-else-if="!store.items.length" title="还没有参考图片" description="上传后可在 AI 创作和视频生成页复用" />
  </PageContainer>
</template>
```

- [ ] **Step 3: 落脚本参考库**

```vue
<template>
  <PageContainer title="脚本参考库" description="管理参考视频分析结果并在创作页复用">
    <NCard>
      <FileUploadTrigger button-text="上传参考视频" accept="video/*" @select="store.uploadVideo" />
    </NCard>
    <NDataTable :columns="columns" :data="store.items" :loading="store.loading" />
  </PageContainer>
</template>
```

- [ ] **Step 4: 落成品库**

```vue
<template>
  <PageContainer title="成品库" description="集中查看已生成视频，支持预览、下载和删除">
    <div class="grid grid-cols-3 gap-6">
      <VideoCard v-for="item in store.items" :key="item.id" :video="item" @delete="store.remove(item.id)" />
    </div>
  </PageContainer>
</template>
```

- [ ] **Step 5: 接入删除确认与选择回填**

```ts
async function confirmDelete(videoId: string) {
  const accepted = await uiStore.confirm({
    title: '确认删除成品',
    content: '删除后不可恢复，是否继续？',
  });

  if (!accepted) return;
  await store.remove(videoId);
}
```

- [ ] **Step 6: 运行测试**

Run: `env COREPACK_HOME=/tmp/corepack-home NPM_CONFIG_USERCONFIG=/tmp/empty-npmrc npm_config_registry=https://registry.npmjs.org corepack pnpm@10.19.0 --filter @make-video/web test -- AssetLibraryView ReferenceLibraryView LibraryView`
Expected: PASS，三类资产页面测试通过

- [ ] **Step 7: 提交**

```bash
git add apps/web/src/components/common/FileUploadTrigger.vue apps/web/src/stores/asset.ts apps/web/src/stores/reference.ts apps/web/src/stores/library.ts apps/web/src/views/asset apps/web/src/views/reference apps/web/src/views/library
git commit -m "feat: add asset reference and library pages"
```

### Task 8: 实现个人中心、积分充值页和积分明细页

**Files:**
- Create: `apps/web/src/stores/billing.ts`
- Create: `apps/web/src/views/account/ProfileView.vue`
- Create: `apps/web/src/views/account/ProfileView.spec.ts`
- Create: `apps/web/src/views/billing/RechargeView.vue`
- Create: `apps/web/src/views/billing/RechargeView.spec.ts`
- Create: `apps/web/src/views/billing/PointHistoryView.vue`
- Create: `apps/web/src/views/billing/PointHistoryView.spec.ts`

- [ ] **Step 1: 写账户和积分页测试**

```ts
import { mount } from '@vue/test-utils';
import ProfileView from './ProfileView.vue';

it('shows masked phone and balance on profile page', async () => {
  const wrapper = mount(ProfileView);
  expect(wrapper.text()).toContain('个人中心');
  expect(wrapper.text()).toContain('当前积分余额');
});
```

```ts
import { mount } from '@vue/test-utils';
import RechargeView from './RechargeView.vue';

it('shows fixed point packages on recharge page', async () => {
  const wrapper = mount(RechargeView);
  expect(wrapper.text()).toContain('100 积分');
  expect(wrapper.text()).toContain('1000 积分');
});
```

```ts
import { mount } from '@vue/test-utils';
import PointHistoryView from './PointHistoryView.vue';

it('shows only recharge consume and refund on point history page', async () => {
  const wrapper = mount(PointHistoryView);
  expect(wrapper.text()).toContain('充值');
  expect(wrapper.text()).toContain('消耗');
  expect(wrapper.text()).toContain('返还');
});
```

- [ ] **Step 2: 落账户页**

```vue
<template>
  <PageContainer title="个人中心" description="查看账户信息和积分入口">
    <NCard>
      <NDescriptions bordered :column="1">
        <NDescriptionsItem label="手机号">{{ authStore.profile?.maskedPhone ?? '--' }}</NDescriptionsItem>
        <NDescriptionsItem label="昵称">{{ authStore.profile?.nickname ?? '--' }}</NDescriptionsItem>
        <NDescriptionsItem label="当前积分余额">{{ billingStore.balance }}</NDescriptionsItem>
      </NDescriptions>
      <div class="mt-6 flex gap-3">
        <NButton type="primary" @click="router.push('/billing/recharge')">去充值</NButton>
        <NButton @click="router.push('/billing/history')">积分明细</NButton>
        <NButton quaternary @click="logout">退出登录</NButton>
      </div>
    </NCard>
  </PageContainer>
</template>
```

- [ ] **Step 3: 落充值页**

```vue
<template>
  <PageContainer title="积分充值" description="选择固定套餐并查看充值记录">
    <div class="grid grid-cols-4 gap-6">
      <NCard v-for="pack in packs" :key="pack.id">
        <div class="text-lg font-semibold text-[#111827]">{{ pack.points }} 积分</div>
        <div class="mt-2 text-sm text-[#6B7280]">支付方式：微信 / 支付宝</div>
        <NButton type="primary" class="mt-6 w-full">立即充值</NButton>
      </NCard>
    </div>
  </PageContainer>
</template>
```

- [ ] **Step 4: 落积分明细页**

```vue
<template>
  <PageContainer title="积分明细" description="仅展示用户可理解的充值、消耗和返还结果">
    <NDataTable :columns="columns" :data="billingStore.records" :loading="billingStore.loading" />
  </PageContainer>
</template>
```

- [ ] **Step 5: 运行测试**

Run: `env COREPACK_HOME=/tmp/corepack-home NPM_CONFIG_USERCONFIG=/tmp/empty-npmrc npm_config_registry=https://registry.npmjs.org corepack pnpm@10.19.0 --filter @make-video/web test -- ProfileView RechargeView PointHistoryView`
Expected: PASS，账户和积分三页测试通过

- [ ] **Step 6: 提交**

```bash
git add apps/web/src/stores/billing.ts apps/web/src/views/account apps/web/src/views/billing
git commit -m "feat: add account and billing pages"
```

### Task 9: 完成 mock 数据、回归测试和文档

**Files:**
- Modify: `apps/web/src/api/client.ts`
- Create: `apps/web/src/api/mock/auth.ts`
- Create: `apps/web/src/api/mock/dashboard.ts`
- Create: `apps/web/src/api/mock/news.ts`
- Create: `apps/web/src/api/mock/project.ts`
- Create: `apps/web/src/api/mock/task.ts`
- Create: `apps/web/src/api/mock/library.ts`
- Create: `apps/web/src/api/mock/asset.ts`
- Create: `apps/web/src/api/mock/reference.ts`
- Create: `apps/web/src/api/mock/billing.ts`
- Modify: `apps/web/src/styles/main.css`
- Create: `apps/web/README.md`

- [ ] **Step 1: 建立统一 mock 数据入口**

```ts
export const apiClient = createSdkClient({
  baseUrl: import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:3000',
  mock: import.meta.env.VITE_ENABLE_MOCK === 'true',
  getToken: () => useAuthStore().token,
  onUnauthorized: () => {
    const authStore = useAuthStore();
    authStore.logout();
    router.push('/login');
  },
});
```

- [ ] **Step 2: 为每个业务模块补 mock 数据**

```ts
export function buildMockDashboard(): DashboardResponse {
  return {
    summary: {
      pointBalance: 2680,
      recentProjectCount: 4,
      recentVideoCount: 6,
    },
    recentProjects: [
      {
        id: 'project-1',
        name: '机器人养老趋势解读',
        status: 'script_pending_confirm',
        updatedAt: '2026-04-01 10:30:00',
      },
    ],
    recentVideos: [
      {
        id: 'video-1',
        projectId: 'project-1',
        title: '机器人养老趋势解读-成片 01',
        coverUrl: 'https://example.com/mock-cover-1.jpg',
        createdAt: '2026-04-01 11:20:00',
      },
    ],
  };
}
```

- [ ] **Step 3: 统一调整全局样式和后台密度**

```css
:root {
  color: #374151;
  background: #f9fafb;
}

body {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #374151;
  background: #f9fafb;
}
```

- [ ] **Step 4: 补前端 README**

````md
# Web Frontend

## 启动

```bash
pnpm --filter @make-video/web dev
```

## 环境变量

- `VITE_API_BASE_URL`
- `VITE_ENABLE_MOCK`

## 联调方式

- 后端未就绪时使用 `VITE_ENABLE_MOCK=true`
- 联调时关闭 mock，并指向 Nest 服务地址
````

- [ ] **Step 5: 跑最终验证**

Run: `env COREPACK_HOME=/tmp/corepack-home NPM_CONFIG_USERCONFIG=/tmp/empty-npmrc npm_config_registry=https://registry.npmjs.org corepack pnpm@10.19.0 --filter @make-video/web lint`
Expected: PASS，前端 lint 通过

Run: `env COREPACK_HOME=/tmp/corepack-home NPM_CONFIG_USERCONFIG=/tmp/empty-npmrc npm_config_registry=https://registry.npmjs.org corepack pnpm@10.19.0 --filter @make-video/web typecheck`
Expected: PASS，前端类型检查通过

Run: `env COREPACK_HOME=/tmp/corepack-home NPM_CONFIG_USERCONFIG=/tmp/empty-npmrc npm_config_registry=https://registry.npmjs.org corepack pnpm@10.19.0 --filter @make-video/web test`
Expected: PASS，页面和路由测试全部通过

Run: `env COREPACK_HOME=/tmp/corepack-home NPM_CONFIG_USERCONFIG=/tmp/empty-npmrc npm_config_registry=https://registry.npmjs.org corepack pnpm@10.19.0 --filter @make-video/web build`
Expected: PASS，前端生产构建通过

- [ ] **Step 6: 提交**

```bash
git add apps/web/src/api/mock apps/web/src/api/client.ts apps/web/src/styles/main.css apps/web/README.md
git commit -m "docs: finish web frontend mock and integration guide"
```

## 自检

- 产品主链路已覆盖：登录 -> 工作台 -> 新闻选题 -> AI 创作 -> 视频生成 -> 任务中心 -> 成品库
- 资产和账户页面已覆盖：素材库、脚本参考库、个人中心、积分充值、积分明细
- 统一状态展示已覆盖：项目状态、任务状态、参考视频分析状态都收敛到 `StatusTag`
- 前端展示约束已覆盖：只展示可用积分、消耗、返还，不暴露冻结积分概念
- 工程要求已覆盖：模块化路由、Pinia 分模块、Axios 统一 API、mock 模式、loading/empty/error 三态、统一布局和主题
