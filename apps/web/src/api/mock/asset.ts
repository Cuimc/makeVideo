import type { HttpRequestConfig } from '@make-video/sdk';
import { mockAssets } from './state';

const removePattern = /^\/api\/assets\/images\/([^/]+)$/;

export function resolveAssetMock(config: HttpRequestConfig) {
  if (config.url === '/api/assets/images' && config.method === 'GET') {
    return {
      matched: true,
      data: {
        items: mockAssets,
        total: mockAssets.length,
        page: 1,
        pageSize: 20,
      },
    };
  }

  if (config.url === '/api/assets/images' && config.method === 'POST') {
    const payload = config.data as {
      name: string;
      url: string;
      size: number;
    };
    const next = {
      id: `image-${mockAssets.length + 1}`,
      name: payload.name,
      url: payload.url,
      size: payload.size,
      createdAt: '2026-04-01 14:00:00',
    };

    mockAssets.unshift(next);

    return {
      matched: true,
      data: next,
    };
  }

  const removeMatch = config.url.match(removePattern);

  if (removeMatch?.[1] && config.method === 'DELETE') {
    const index = mockAssets.findIndex((item) => item.id === removeMatch[1]);

    if (index >= 0) {
      mockAssets.splice(index, 1);
    }

    return {
      matched: true,
      data: undefined,
    };
  }

  return {
    matched: false,
  } as const;
}
