import type { RouteRecordRaw } from 'vue-router';
import HomeView from '../../views/HomeView.vue';

export const referenceRoutes: RouteRecordRaw[] = [
  {
    path: 'references',
    name: 'reference-library',
    component: HomeView,
  },
];
