import { createRouter, createWebHistory } from 'vue-router';
import AppShell from '../layouts/AppShell.vue';
import { applyRouterGuards } from './guards';
import { accountRoutes } from './modules/account';
import { assetRoutes } from './modules/asset';
import { authRoutes } from './modules/auth';
import { billingRoutes } from './modules/billing';
import { dashboardRoutes } from './modules/dashboard';
import { libraryRoutes } from './modules/library';
import { newsRoutes } from './modules/news';
import { projectRoutes } from './modules/project';
import { referenceRoutes } from './modules/reference';
import { taskRoutes } from './modules/task';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    ...authRoutes,
    {
      path: '/',
      component: AppShell,
      children: [
        {
          path: '',
          redirect: {
            name: 'dashboard',
          },
        },
        ...dashboardRoutes,
        ...newsRoutes,
        ...projectRoutes,
        ...taskRoutes,
        ...libraryRoutes,
        ...assetRoutes,
        ...referenceRoutes,
        ...accountRoutes,
        ...billingRoutes,
      ],
    },
  ],
});

applyRouterGuards(router);

export default router;
