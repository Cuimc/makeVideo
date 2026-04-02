import type {
  CreateProjectPayload,
  ProjectCreationResult,
  ProjectDetail,
  SaveProjectDraftPayload,
  ScriptGenerationResult,
  StoryboardGenerationResult,
  StoryboardScene,
} from '@make-video/shared';
import { Injectable } from '@nestjs/common';
import { BusinessException } from '../../common/exceptions/business.exception';
import { NewsService } from '../news/news.service';
import { DEFAULT_PROJECT_FORM } from './project-defaults';

const projects = new Map<string, ProjectDetail & { ownerId: string }>();

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
