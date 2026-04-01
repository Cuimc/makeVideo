import type { HttpRequestConfig } from '@make-video/sdk';
import { mockVideos } from './state';

const removePattern = /^\/api\/library\/videos\/([^/]+)$/;

export function resolveLibraryMock(config: HttpRequestConfig) {
  if (config.url === '/api/library/videos' && config.method === 'GET') {
    return {
      matched: true,
      data: {
        items: mockVideos,
        total: mockVideos.length,
        page: 1,
        pageSize: 20,
      },
    };
  }

  const removeMatch = config.url.match(removePattern);

  if (removeMatch?.[1] && config.method === 'DELETE') {
    const index = mockVideos.findIndex((item) => item.id === removeMatch[1]);

    if (index >= 0) {
      mockVideos.splice(index, 1);
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
