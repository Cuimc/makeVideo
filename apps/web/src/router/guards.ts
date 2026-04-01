import type { Router } from 'vue-router';
import { useAuthStore } from '../stores/auth';

export function applyRouterGuards(router: Router) {
  router.beforeEach((to) => {
    const authStore = useAuthStore();
    const isPublic = to.matched.some((record) => record.meta.public === true);
    const isGuestOnly = to.matched.some((record) => record.meta.guestOnly === true);

    if (!authStore.isAuthenticated && !isPublic) {
      return {
        name: 'login',
      };
    }

    if (authStore.isAuthenticated && isGuestOnly) {
      return {
        name: 'dashboard',
      };
    }

    return true;
  });
}
