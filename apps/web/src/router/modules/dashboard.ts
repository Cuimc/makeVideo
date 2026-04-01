import type { RouteRecordRaw } from 'vue-router';
import HomeView from '../../views/HomeView.vue';

export const dashboardRoutes: RouteRecordRaw[] = [
  {
    path: 'dashboard',
    name: 'dashboard',
    component: HomeView,
  },
];
