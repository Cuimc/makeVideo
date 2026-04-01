import { describe, expect, it, vi } from 'vitest';
import { createSdkClient } from './client';

describe('createSdkClient', () => {
  it('injects bearer token when getToken returns value', async () => {
    const transport = vi.fn().mockResolvedValue({
      data: {
        code: 0,
        message: 'ok',
        data: {
          pointBalance: 2680,
          recentProjectCount: 4,
          recentVideoCount: 6,
          recentProjects: [],
          recentVideos: [],
        },
      },
    });

    const client = createSdkClient({
      baseUrl: 'http://example.com',
      getToken: () => 'token-1',
      transport,
    });

    await client.dashboard.getSummary();

    expect(transport).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer token-1',
        }),
      }),
    );
  });

  it('invokes unauthorized callback on 401 responses', async () => {
    const onUnauthorized = vi.fn();
    const transport = vi.fn().mockRejectedValue({
      response: {
        status: 401,
        data: {
          code: 401,
          message: 'unauthorized',
        },
      },
    });

    const client = createSdkClient({
      baseUrl: 'http://example.com',
      onUnauthorized,
      transport,
    });

    await expect(client.dashboard.getSummary()).rejects.toThrow('unauthorized');
    expect(onUnauthorized).toHaveBeenCalledTimes(1);
  });
});
