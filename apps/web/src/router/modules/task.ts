import type { RouteRecordRaw } from 'vue-router';
import TaskCenterView from '../../views/task/TaskCenterView.vue';

export const taskRoutes: RouteRecordRaw[] = [
  {
    path: 'tasks',
    name: 'task-center',
    component: TaskCenterView,
  },
];
