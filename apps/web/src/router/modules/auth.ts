import type { RouteRecordRaw } from 'vue-router';
import LoginView from '../../views/auth/LoginView.vue';

export const authRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: {
      public: true,
      guestOnly: true,
    },
  },
];
