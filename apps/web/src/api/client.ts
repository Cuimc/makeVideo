import { createApiClient } from '@make-video/sdk';
import { useAuthStore } from '../stores/auth';
import { webMockTransport } from './mock';

const mockEnabled = import.meta.env.VITE_ENABLE_MOCK === 'true';
const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

function resolveApiBaseUrl() {
  if (configuredBaseUrl) {
    return configuredBaseUrl;
  }

  if (import.meta.env.DEV) {
    return '';
  }

  return 'http://127.0.0.1:3000';
}

export const apiClient = createApiClient({
  baseUrl: resolveApiBaseUrl(),
  mock: mockEnabled,
  transport: mockEnabled ? webMockTransport : undefined,
  getToken: () => useAuthStore().token,
  onUnauthorized: () => {
    const authStore = useAuthStore();
    authStore.logout();
    window.location.replace('/login');
  },
});
