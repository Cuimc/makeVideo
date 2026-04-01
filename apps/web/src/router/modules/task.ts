import type { RouteRecordRaw } from 'vue-router';
import HomeView from '../../views/HomeView.vue';

export const taskRoutes: RouteRecordRaw[] = [
  {
    path: 'tasks',
    name: 'task-center',
    component: HomeView,
  },
];
