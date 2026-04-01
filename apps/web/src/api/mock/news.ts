import type { HttpRequestConfig } from '@make-video/sdk';
import { createProjectFromNews, mockNewsPool } from './state';

export function resolveNewsMock(config: HttpRequestConfig) {
  if (config.url === '/api/news' && config.method === 'GET') {
    const keyword = String(config.params?.keyword ?? '').trim();
    const items = keyword
      ? mockNewsPool.filter(
          (item) =>
            item.keyword.includes(keyword) ||
            item.title.includes(keyword) ||
            item.summary.includes(keyword),
        )
      : mockNewsPool;

    return {
      matched: true,
      data: items,
    };
  }

  if (config.url === '/api/projects' && config.method === 'POST') {
    const payload = config.data as {
      keyword: string;
      newsIds: string[];
    };

    return {
      matched: true,
      data: createProjectFromNews(payload.keyword, payload.newsIds),
    };
  }

  return {
    matched: false,
  } as const;
}
