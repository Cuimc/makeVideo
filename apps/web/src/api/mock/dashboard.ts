import type { HttpRequestConfig } from '@make-video/sdk';
import { buildDashboardData, buildHealthResponse } from './state';

export function resolveDashboardMock(config: HttpRequestConfig) {
  if (config.url === '/api/dashboard/summary' && config.method === 'GET') {
    return {
      matched: true,
      data: buildDashboardData(),
    };
  }

  if (config.url === '/api/health' && config.method === 'GET') {
    return {
      matched: true,
      data: buildHealthResponse(),
    };
  }

  return {
    matched: false,
  } as const;
}
