import type { RouteRecordRaw } from 'vue-router';
import HomeView from '../../views/HomeView.vue';

export const libraryRoutes: RouteRecordRaw[] = [
  {
    path: 'library',
    name: 'library',
    component: HomeView,
  },
];
