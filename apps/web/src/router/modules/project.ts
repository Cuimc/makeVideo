import type { RouteRecordRaw } from 'vue-router';
import HomeView from '../../views/HomeView.vue';

export const projectRoutes: RouteRecordRaw[] = [
  {
    path: 'projects/:projectId/workspace',
    name: 'project-workspace',
    component: HomeView,
  },
  {
    path: 'projects/:projectId/video',
    name: 'project-video-generate',
    component: HomeView,
  },
];
