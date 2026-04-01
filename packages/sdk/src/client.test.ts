import { describe, expect, it, vi } from 'vitest';
import { createApiClient } from './client';

describe('createApiClient', () => {
  it('requests the backend health endpoint and returns the parsed payload', async () => {
    const fetcher = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          status: 'ok',
          service: 'make-video-server',
          timestamp: '2026-04-01T00:00:00.000Z',
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      ),
    );

    const client = createApiClient({
      baseUrl: 'http://127.0.0.1:3000',
      fetcher,
    });

    const payload = await client.getHealth();

    expect(fetcher).toHaveBeenCalledWith('http://127.0.0.1:3000/api/health');
    expect(payload.status).toBe('ok');
    expect(payload.service).toBe('make-video-server');
  });
});
