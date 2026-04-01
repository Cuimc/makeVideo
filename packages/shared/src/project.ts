import type { LibraryVideo } from './asset';
import type { NewsItem } from './news';
import type { ProjectStatus } from './status';

export interface ProjectCreativeParams {
  videoType: string;
  style: string;
  platform: string;
  durationSeconds: number;
  targetAudience: string;
}

export interface StoryboardScene {
  id: string;
  title: string;
  durationSeconds: number;
  visualPrompt: string;
  narration: string;
  subtitle?: string;
}

export interface ProjectListItem {
  id: string;
  name: string;
  keyword: string;
  status: ProjectStatus;
  updatedAt: string;
}

export interface DashboardSummary {
  pointBalance: number;
  recentProjectCount: number;
  recentVideoCount: number;
}

export interface DashboardData {
  summary: DashboardSummary;
  recentProjects: ProjectListItem[];
  recentVideos: LibraryVideo[];
}

export interface ProjectDetail {
  id: string;
  name: string;
  keyword: string;
  status: ProjectStatus;
  newsItems: NewsItem[];
  form: ProjectCreativeParams;
  scriptDraft: string;
  storyboardDraft: StoryboardScene[];
  referenceImageIds: string[];
  referenceVideoIds: string[];
  referenceResultIds: string[];
  updatedAt: string;
}

export interface SaveProjectDraftPayload {
  form: ProjectCreativeParams;
  scriptDraft: string;
  storyboardDraft: StoryboardScene[];
  referenceImageIds: string[];
  referenceVideoIds: string[];
  referenceResultIds: string[];
}

export interface ScriptGenerationResult {
  script: string;
  estimatedPointCost: number;
}

export interface StoryboardGenerationResult {
  storyboard: StoryboardScene[];
  estimatedPointCost: number;
}
