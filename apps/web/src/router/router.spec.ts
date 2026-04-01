import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it } from 'vitest';
import router from './index';
import { useAuthStore } from '../stores/auth';

describe('router guards', () => {
  beforeEach(async () => {
    setActivePinia(createPinia());
    const authStore = useAuthStore();
    authStore.logout();
    await router.replace('/login');
  });

  it('redirects anonymous users to login', async () => {
    await router.push('/dashboard');
    expect(router.currentRoute.value.fullPath).toBe('/login');
  });

  it('redirects logged-in users away from login', async () => {
    const authStore = useAuthStore();
    authStore.token = 'token-1';
    await router.push('/dashboard');
    await router.push('/login');
    expect(router.currentRoute.value.fullPath).toBe('/dashboard');
  });
});
