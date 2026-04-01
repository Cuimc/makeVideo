import type { RouteRecordRaw } from 'vue-router';
import HomeView from '../../views/HomeView.vue';

export const billingRoutes: RouteRecordRaw[] = [
  {
    path: 'billing/recharge',
    name: 'billing-recharge',
    component: HomeView,
  },
  {
    path: 'billing/history',
    name: 'billing-history',
    component: HomeView,
  },
];
