import type { RouteRecordRaw } from 'vue-router';
import HomeView from '../../views/HomeView.vue';

export const accountRoutes: RouteRecordRaw[] = [
  {
    path: 'account/profile',
    name: 'account-profile',
    component: HomeView,
  },
];
