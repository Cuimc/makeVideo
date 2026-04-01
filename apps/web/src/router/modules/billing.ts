import type { RouteRecordRaw } from 'vue-router';
import RechargeView from '../../views/billing/RechargeView.vue';
import PointHistoryView from '../../views/billing/PointHistoryView.vue';

export const billingRoutes: RouteRecordRaw[] = [
  {
    path: 'billing/recharge',
    name: 'billing-recharge',
    component: RechargeView,
  },
  {
    path: 'billing/history',
    name: 'billing-history',
    component: PointHistoryView,
  },
];
