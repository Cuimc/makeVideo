import { createApiClient } from '@make-video/sdk';
import { useAuthStore } from '../stores/auth';
import { webMockTransport } from './mock';

const mockEnabled = import.meta.env.VITE_ENABLE_MOCK === 'true';
const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const defaultApiBaseUrl = 'http://bot-api.nibbly.cn';

function resolveApiBaseUrl() {
  if (configuredBaseUrl) {
    return configuredBaseUrl;
  }

  if (import.meta.env.DEV) {
    return '';
  }

  return defaultApiBaseUrl;
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
