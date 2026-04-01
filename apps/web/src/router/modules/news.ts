import type { RouteRecordRaw } from 'vue-router';
import HomeView from '../../views/HomeView.vue';

export const newsRoutes: RouteRecordRaw[] = [
  {
    path: 'news/topics',
    name: 'news-topics',
    component: HomeView,
  },
];
