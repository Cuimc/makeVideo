import type { HttpRequestConfig } from '@make-video/sdk';
import type { ReferenceAnalysisResult } from '@make-video/shared';
import { mockReferences } from './state';

const removePattern = /^\/api\/references\/([^/]+)$/;

export function resolveReferenceMock(config: HttpRequestConfig) {
  if (config.url === '/api/references' && config.method === 'GET') {
    return {
      matched: true,
      data: {
        items: mockReferences,
        total: mockReferences.length,
        page: 1,
        pageSize: 20,
      },
    };
  }

  if (config.url === '/api/references/analyze' && config.method === 'POST') {
    const payload = config.data as {
      name: string;
    };
    const next: ReferenceAnalysisResult = {
      id: `reference-${mockReferences.length + 1}`,
      title: payload.name,
      status: 'success',
      theme: '热点新闻转视频解读',
      structureSummary: '先提问题，再给观点和案例，最后总结。',
      scriptSummary: '适合做 60 秒口播解读视频。',
      storyboardSummary: '镜头节奏偏快，适合数据和场景切换。',
      applicableScenes: ['热点解读', '观点表达'],
      createdAt: '2026-04-01 14:10:00',
    };

    mockReferences.unshift(next);

    return {
      matched: true,
      data: next,
    };
  }

  const removeMatch = config.url.match(removePattern);

  if (removeMatch?.[1] && config.method === 'DELETE') {
    const index = mockReferences.findIndex((item) => item.id === removeMatch[1]);

    if (index >= 0) {
      mockReferences.splice(index, 1);
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
