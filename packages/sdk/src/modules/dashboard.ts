import type { DashboardData, HealthResponse } from '@make-video/shared';
import type { HttpClient } from '../http';

export function createDashboardModule(http: HttpClient) {
  return {
    getSummary() {
      return http.get<DashboardData>('/api/dashboard/summary');
    },
    getHealth() {
      return http.get<HealthResponse>('/api/health');
    },
  };
}
