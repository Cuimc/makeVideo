import { isHealthResponse, type HealthResponse } from '@make-video/shared';

export interface ApiClientOptions {
  baseUrl: string;
  fetcher?: typeof fetch;
}

export function createApiClient(options: ApiClientOptions) {
  const baseUrl = options.baseUrl.replace(/\/$/, '');
  const fetcher = options.fetcher ?? fetch;

  return {
    async getHealth(): Promise<HealthResponse> {
      const response = await fetcher(`${baseUrl}/api/health`);

      if (!response.ok) {
        throw new Error(`Health request failed with status ${response.status}`);
      }

      const payload = await response.json();

      if (!isHealthResponse(payload)) {
        throw new Error('Invalid health response payload');
      }

      return payload;
    },
  };
}
