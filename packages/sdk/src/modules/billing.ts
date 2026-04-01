import type {
  BillingSummary,
  PagedResult,
  PagingParams,
  PointPackage,
  PointRecord,
  RechargeRecord,
} from '@make-video/shared';
import type { HttpClient } from '../http';

export function createBillingModule(http: HttpClient) {
  return {
    getSummary() {
      return http.get<BillingSummary>('/api/billing/summary');
    },
    getPointPackages() {
      return http.get<PointPackage[]>('/api/billing/packages');
    },
    getPointRecords(params?: PagingParams) {
      return http.get<PagedResult<PointRecord>>('/api/billing/records', { params });
    },
    getRechargeRecords(params?: PagingParams) {
      return http.get<PagedResult<RechargeRecord>>('/api/billing/recharges', { params });
    },
  };
}
