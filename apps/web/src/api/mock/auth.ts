import type { HttpRequestConfig } from '@make-video/sdk';
import { mockProfile } from './state';

export function resolveAuthMock(config: HttpRequestConfig) {
  if (config.url === '/api/auth/login' && config.method === 'POST') {
    return {
      matched: true,
      data: {
        token: 'mock-token',
        profile: mockProfile,
      },
    };
  }

  if (config.url === '/api/auth/profile' && config.method === 'GET') {
    return {
      matched: true,
      data: mockProfile,
    };
  }

  return {
    matched: false,
  } as const;
}
