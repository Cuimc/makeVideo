import type {
  CreateProjectPayload,
  ProjectCreationResult,
  ProjectDetail,
  ProjectListItem,
  SaveProjectDraftPayload,
  ScriptGenerationResult,
  StoryboardGenerationResult,
  StoryboardScene,
} from '@make-video/shared';
import type { NewsItem } from '@make-video/shared';
import { Injectable } from '@nestjs/common';
import { BusinessException } from '../../common/exceptions/business.exception';
import { NewsService } from '../news/news.service';
import { DEFAULT_PROJECT_FORM } from './project-defaults';

const DEMO_OWNER_ID = 'user_demo';
const DEMO_PROJECT_ID = 'project_1';
const DEMO_NEWS_ITEMS: NewsItem[] = [
  {
    id: 'seed-news-1',
    title: '机器人养老成为社区服务新热点',
    summary: '多地开始试点机器人养老服务，市场关注度持续上升。',
    source: '科技日报',
    publishedAt: '2026-04-01T08:30:00.000Z',
    keyword: '养老',
    url: 'https://example.com/news/seed-news-1',
  },
];

const projects = new Map<string, ProjectDetail & { ownerId: string }>([
  [
    DEMO_PROJECT_ID,
    {
      id: DEMO_PROJECT_ID,
      ownerId: DEMO_OWNER_ID,
      name: '机器人养老趋势解读',
      keyword: '养老',
      status: 'script_confirmed',
      newsItems: DEMO_NEWS_ITEMS,
      form: { ...DEFAULT_PROJECT_FORM },
      scriptDraft:
        'Opening: 机器人养老正在从概念走向真实场景。\nBody: 政策与需求共同推动市场增长。',
      storyboardDraft: [
        {
          id: 'scene_1',
          title: '趋势引入',
          durationSeconds: 10,
          visualPrompt: '社区养老中心与服务机器人同框',
          narration: '机器人养老正在从概念走向真实场景。',
          subtitle: '趋势正在落地',
        },
      ],
      referenceImageIds: ['image_1'],
      referenceVideoIds: ['reference_video_1'],
      referenceResultIds: ['reference_1'],
      updatedAt: '2026-04-01T10:30:00.000Z',
    },
  ],
]);

@Injectable()
export class ProjectsService {
  constructor(private readonly newsService: NewsService) {}

  async create(
    userId: string,
    payload: CreateProjectPayload,
  ): Promise<ProjectCreationResult> {
    const newsItems = this.newsService.getByIds(payload.newsIds);

    if (newsItems.length === 0) {
      throw new BusinessException(400, '请选择至少一条新闻');
    }

    const id = `project_${projects.size + 1}`;
    const now = new Date().toISOString();
    const projectName = `${payload.keyword} 选题创作`;
    const detail: ProjectDetail & { ownerId: string } = {
      id,
      ownerId: userId,
      name: projectName,
      keyword: payload.keyword,
      status: 'created',
      newsItems,
      form: { ...DEFAULT_PROJECT_FORM },
      scriptDraft: '',
      storyboardDraft: [],
      referenceImageIds: [],
      referenceVideoIds: [],
      referenceResultIds: [],
      updatedAt: now,
    };

    projects.set(id, detail);

    return {
      id,
      name: projectName,
      status: detail.status,
      createdAt: now,
    };
  }

  getOwnedProject(userId: string, projectId: string) {
    const detail = projects.get(projectId);

    if (!detail || detail.ownerId !== userId) {
      throw new BusinessException(404, '项目不存在', 404);
    }

    return detail;
  }

  getDetail(userId: string, projectId: string): ProjectDetail {
    const detail = this.getOwnedProject(userId, projectId);

    return sanitizeProjectDetail(detail);
  }

  listByUser(userId: string): ProjectListItem[] {
    return Array.from(projects.values())
      .filter((project) => project.ownerId === userId)
      .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
      .map((project) => ({
        id: project.id,
        name: project.name,
        keyword: project.keyword,
        status: project.status,
        updatedAt: project.updatedAt,
      }));
  }

  saveDraft(
    userId: string,
    projectId: string,
    payload: SaveProjectDraftPayload,
  ): ProjectDetail {
    const detail = this.getOwnedProject(userId, projectId);
    detail.form = payload.form;
    detail.scriptDraft = payload.scriptDraft;
    detail.storyboardDraft = payload.storyboardDraft;
    detail.referenceImageIds = payload.referenceImageIds;
    detail.referenceVideoIds = payload.referenceVideoIds;
    detail.referenceResultIds = payload.referenceResultIds;
    detail.updatedAt = new Date().toISOString();

    return sanitizeProjectDetail(detail);
  }

  confirm(userId: string, projectId: string): ProjectDetail {
    const detail = this.getOwnedProject(userId, projectId);
    detail.status = 'script_confirmed';
    detail.updatedAt = new Date().toISOString();

    return sanitizeProjectDetail(detail);
  }

  setScriptDraft(
    userId: string,
    projectId: string,
    result: ScriptGenerationResult,
  ): ProjectDetail {
    const detail = this.getOwnedProject(userId, projectId);
    detail.scriptDraft = result.script;
    detail.status = 'script_pending_confirm';
    detail.updatedAt = new Date().toISOString();

    return sanitizeProjectDetail(detail);
  }

  setStoryboardDraft(
    userId: string,
    projectId: string,
    result: StoryboardGenerationResult,
  ): ProjectDetail {
    const detail = this.getOwnedProject(userId, projectId);
    detail.storyboardDraft = result.storyboard;
    detail.updatedAt = new Date().toISOString();

    return sanitizeProjectDetail(detail);
  }

  getScriptGenerationInput(projectId: string, userId: string) {
    const detail = this.getOwnedProject(userId, projectId);
    const primaryNews = detail.newsItems[0];

    return {
      projectId: detail.id,
      title: primaryNews?.title ?? detail.name,
      summary:
        primaryNews?.summary ??
        `Project ${detail.id} is focused on ${detail.keyword}.`,
    };
  }

  getStoryboardInput(projectId: string, userId: string) {
    const detail = this.getOwnedProject(userId, projectId);
    const sections = parseScriptSections(detail.scriptDraft);

    return {
      projectId: detail.id,
      scriptTitle: detail.name,
      sections:
        sections.length > 0
          ? sections
          : [
              {
                title: 'Opening',
                narration: 'Introduce the project topic and key takeaway.',
              },
            ],
    };
  }
}

function sanitizeProjectDetail(
  detail: ProjectDetail & { ownerId: string },
): ProjectDetail {
  return {
    id: detail.id,
    name: detail.name,
    keyword: detail.keyword,
    status: detail.status,
    newsItems: detail.newsItems,
    form: detail.form,
    scriptDraft: detail.scriptDraft,
    storyboardDraft: detail.storyboardDraft,
    referenceImageIds: detail.referenceImageIds,
    referenceVideoIds: detail.referenceVideoIds,
    referenceResultIds: detail.referenceResultIds,
    updatedAt: detail.updatedAt,
  };
}

function parseScriptSections(scriptDraft: string) {
  return scriptDraft
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => ({
      title: `Section ${index + 1}`,
      narration: line,
    }));
}

export function buildStoryboardScenes(
  frames: Array<{
    title: string;
    narration: string;
    visual: string;
  }>,
): StoryboardScene[] {
  return frames.map((frame, index) => ({
    id: `scene_${index + 1}`,
    title: frame.title,
    durationSeconds: 10,
    visualPrompt: frame.visual,
    narration: frame.narration,
    subtitle: frame.narration,
  }));
}
