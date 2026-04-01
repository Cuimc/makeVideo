import type { HttpRequestConfig } from '@make-video/sdk';
import { createVideoTask, mockTasks, retryVideoTask } from './state';

const retryPattern = /^\/api\/video-tasks\/([^/]+)\/retry$/;

export function resolveTaskMock(config: HttpRequestConfig) {
  if (config.url === '/api/video-tasks' && config.method === 'GET') {
    const status = config.params?.status;
    const items =
      typeof status === 'string'
        ? mockTasks.filter((item) => item.status === status)
        : mockTasks;

    return {
      matched: true,
      data: {
        items,
        total: items.length,
        page: 1,
        pageSize: 20,
      },
    };
  }

  if (config.url === '/api/video-tasks' && config.method === 'POST') {
    const payload = config.data as {
      projectId: string;
      count: number;
      aspectRatio: '9:16' | '16:9' | '1:1';
      durationSeconds: number;
      styleBias: string;
      withSubtitle: boolean;
    };

    return {
      matched: true,
      data: createVideoTask(payload.projectId, payload),
    };
  }

  const retryMatch = config.url.match(retryPattern);

  if (retryMatch?.[1] && config.method === 'POST') {
    return {
      matched: true,
      data: retryVideoTask(retryMatch[1]),
    };
  }

  return {
    matched: false,
  } as const;
}
