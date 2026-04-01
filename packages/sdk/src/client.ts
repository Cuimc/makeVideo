import { createAssetModule } from './modules/asset';
import { createAuthModule } from './modules/auth';
import { createBillingModule } from './modules/billing';
import { createDashboardModule } from './modules/dashboard';
import { createLibraryModule } from './modules/library';
import { createNewsModule } from './modules/news';
import { createProjectModule } from './modules/project';
import { createReferenceModule } from './modules/reference';
import { createTaskModule } from './modules/task';
import {
  createHttpClient,
  type CreateHttpClientOptions,
  type HttpRequestConfig,
} from './http';

export interface SdkClientOptions extends CreateHttpClientOptions {
  transport?: (config: HttpRequestConfig) => Promise<{ data: unknown }>;
}

export function createSdkClient(options: SdkClientOptions) {
  const http = createHttpClient(options);
  const auth = createAuthModule(http);
  const dashboard = createDashboardModule(http);
  const news = createNewsModule(http);
  const project = createProjectModule(http);
  const task = createTaskModule(http);
  const library = createLibraryModule(http);
  const asset = createAssetModule(http);
  const reference = createReferenceModule(http);
  const billing = createBillingModule(http);

  return {
    auth,
    dashboard,
    news,
    project,
    task,
    library,
    asset,
    reference,
    billing,
    getHealth: dashboard.getHealth,
  };
}

export const createApiClient = createSdkClient;

export type ApiClientOptions = SdkClientOptions;
