import type { ApiResponse } from '@make-video/shared';
import type { HttpRequestConfig } from './http';

export type MockResolver = (
  config: HttpRequestConfig,
) => ApiResponse<unknown> | Promise<ApiResponse<unknown>>;

export function createMockApiResponse<T>(data: T, message = 'ok'): ApiResponse<T> {
  return {
    code: 0,
    message,
    data,
  };
}

export function createMockTransport(resolver: MockResolver) {
  return async (config: HttpRequestConfig) => ({
    data: await resolver(config),
  });
}
