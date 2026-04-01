import type { HttpRequestConfig } from '@make-video/sdk';
import {
  buildBillingSummary,
  mockPointPackages,
  mockPointRecords,
  mockRechargeRecords,
} from './state';

export function resolveBillingMock(config: HttpRequestConfig) {
  if (config.url === '/api/billing/summary' && config.method === 'GET') {
    return {
      matched: true,
      data: buildBillingSummary(),
    };
  }

  if (config.url === '/api/billing/packages' && config.method === 'GET') {
    return {
      matched: true,
      data: mockPointPackages,
    };
  }

  if (config.url === '/api/billing/records' && config.method === 'GET') {
    return {
      matched: true,
      data: {
        items: mockPointRecords,
        total: mockPointRecords.length,
        page: 1,
        pageSize: 20,
      },
    };
  }

  if (config.url === '/api/billing/recharges' && config.method === 'GET') {
    return {
      matched: true,
      data: {
        items: mockRechargeRecords,
        total: mockRechargeRecords.length,
        page: 1,
        pageSize: 20,
      },
    };
  }

  return {
    matched: false,
  } as const;
}
