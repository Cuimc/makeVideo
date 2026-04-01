import type { HttpRequestConfig } from '@make-video/sdk';
import { mockProjects } from './state';

const projectDetailPattern = /^\/api\/projects\/([^/]+)$/;
const generateScriptPattern = /^\/api\/projects\/([^/]+)\/script\/generate$/;
const generateStoryboardPattern = /^\/api\/projects\/([^/]+)\/storyboard\/generate$/;
const confirmPattern = /^\/api\/projects\/([^/]+)\/confirm$/;

export function resolveProjectMock(config: HttpRequestConfig) {
  const detailMatch = config.url.match(projectDetailPattern);

  if (detailMatch?.[1] && config.method === 'GET') {
    return {
      matched: true,
      data: mockProjects.get(detailMatch[1]),
    };
  }

  if (detailMatch?.[1] && config.method === 'PUT') {
    const current = mockProjects.get(detailMatch[1]);
    const payload = config.data as {
      form: unknown;
      scriptDraft: string;
      storyboardDraft: unknown[];
      referenceImageIds: string[];
      referenceVideoIds: string[];
      referenceResultIds: string[];
    };

    if (!current) {
      return {
        matched: true,
        data: null,
      };
    }

    const next = {
      ...current,
      form: payload.form as typeof current.form,
      scriptDraft: payload.scriptDraft,
      storyboardDraft: payload.storyboardDraft as typeof current.storyboardDraft,
      referenceImageIds: payload.referenceImageIds,
      referenceVideoIds: payload.referenceVideoIds,
      referenceResultIds: payload.referenceResultIds,
      updatedAt: '2026-04-01 13:10:00',
    };

    mockProjects.set(current.id, next);

    return {
      matched: true,
      data: next,
    };
  }

  const generateScriptMatch = config.url.match(generateScriptPattern);

  if (generateScriptMatch?.[1] && config.method === 'POST') {
    const current = mockProjects.get(generateScriptMatch[1]);

    if (!current) {
      return {
        matched: true,
        data: null,
      };
    }

    current.scriptDraft = `这是针对${current.name}生成的新脚本：先交代新闻背景，再解释传播价值，最后给出视频表达建议。`;
    current.status = 'script_pending_confirm';
    current.updatedAt = '2026-04-01 13:12:00';

    return {
      matched: true,
      data: {
        script: current.scriptDraft,
        estimatedPointCost: 120,
      },
    };
  }

  const generateStoryboardMatch = config.url.match(generateStoryboardPattern);

  if (generateStoryboardMatch?.[1] && config.method === 'POST') {
    const current = mockProjects.get(generateStoryboardMatch[1]);

    if (!current) {
      return {
        matched: true,
        data: null,
      };
    }

    current.storyboardDraft = [
      {
        id: `${current.id}-scene-regen-1`,
        title: '新闻抛题',
        durationSeconds: 8,
        visualPrompt: '新闻标题与关键数据快速切换',
        narration: '先用一条最新热点新闻，把观众拉进问题现场。',
        subtitle: '热点抛题',
      },
      {
        id: `${current.id}-scene-regen-2`,
        title: '观点展开',
        durationSeconds: 10,
        visualPrompt: '社区养老中心与机器人服务场景混剪',
        narration: '再用真实场景和政策信号解释趋势为什么值得关注。',
        subtitle: '趋势展开',
      },
    ];
    current.updatedAt = '2026-04-01 13:15:00';

    return {
      matched: true,
      data: {
        storyboard: current.storyboardDraft,
        estimatedPointCost: 240,
      },
    };
  }

  const confirmMatch = config.url.match(confirmPattern);

  if (confirmMatch?.[1] && config.method === 'POST') {
    const current = mockProjects.get(confirmMatch[1]);

    if (!current) {
      return {
        matched: true,
        data: null,
      };
    }

    current.status = 'script_confirmed';
    current.updatedAt = '2026-04-01 13:18:00';

    return {
      matched: true,
      data: current,
    };
  }

  return {
    matched: false,
  } as const;
}
