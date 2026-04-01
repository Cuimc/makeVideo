import type { RouteRecordRaw } from 'vue-router';
import AiWorkspaceView from '../../views/project/AiWorkspaceView.vue';
import VideoGenerateView from '../../views/project/VideoGenerateView.vue';

export const projectRoutes: RouteRecordRaw[] = [
  {
    path: 'projects/:projectId/workspace',
    name: 'project-workspace',
    component: AiWorkspaceView,
  },
  {
    path: 'projects/:projectId/video',
    name: 'project-video-generate',
    component: VideoGenerateView,
  },
];
