import { createMockTransport, createMockApiResponse, type HttpRequestConfig } from '@make-video/sdk';
import { resolveAssetMock } from './asset';
import { resolveAuthMock } from './auth';
import { resolveBillingMock } from './billing';
import { resolveDashboardMock } from './dashboard';
import { resolveLibraryMock } from './library';
import { resolveNewsMock } from './news';
import { resolveProjectMock } from './project';
import { resolveReferenceMock } from './reference';
import { resolveTaskMock } from './task';

const resolvers = [
  resolveAuthMock,
  resolveDashboardMock,
  resolveNewsMock,
  resolveProjectMock,
  resolveTaskMock,
  resolveLibraryMock,
  resolveAssetMock,
  resolveReferenceMock,
  resolveBillingMock,
];

function resolveMockRequest(config: HttpRequestConfig) {
  for (const resolver of resolvers) {
    const result = resolver(config);

    if (result.matched) {
      return createMockApiResponse(result.data);
    }
  }

  throw new Error(`No mock handler for ${config.method ?? 'GET'} ${config.url}`);
}

export const webMockTransport = createMockTransport(resolveMockRequest);
