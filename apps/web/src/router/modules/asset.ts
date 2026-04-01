import type { RouteRecordRaw } from 'vue-router';
import HomeView from '../../views/HomeView.vue';

export const assetRoutes: RouteRecordRaw[] = [
  {
    path: 'assets',
    name: 'asset-library',
    component: HomeView,
  },
];
