import type { RouteRecordRaw } from 'vue-router';
import NewsTopicView from '../../views/news/NewsTopicView.vue';

export const newsRoutes: RouteRecordRaw[] = [
  {
    path: 'news/topics',
    name: 'news-topics',
    component: NewsTopicView,
  },
];
