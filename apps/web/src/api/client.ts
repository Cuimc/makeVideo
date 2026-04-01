import { createApiClient } from '@make-video/sdk';
import { useAuthStore } from '../stores/auth';
import { webMockTransport } from './mock';

const mockEnabled = import.meta.env.VITE_ENABLE_MOCK === 'true';

export const apiClient = createApiClient({
  baseUrl: import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:3000',
  mock: mockEnabled,
  transport: mockEnabled ? webMockTransport : undefined,
  getToken: () => useAuthStore().token,
  onUnauthorized: () => {
    const authStore = useAuthStore();
    authStore.logout();
    window.location.replace('/login');
  },
});
