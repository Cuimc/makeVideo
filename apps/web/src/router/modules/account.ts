import type { RouteRecordRaw } from 'vue-router';
import ProfileView from '../../views/account/ProfileView.vue';

export const accountRoutes: RouteRecordRaw[] = [
  {
    path: 'account/profile',
    name: 'account-profile',
    component: ProfileView,
  },
];
