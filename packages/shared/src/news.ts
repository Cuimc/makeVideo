import type { ProjectStatus } from './status';

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  keyword: string;
  url: string;
}

export interface NewsSearchParams {
  keyword: string;
  page?: number;
  pageSize?: number;
}

export interface CreateProjectPayload {
  keyword: string;
  newsIds: string[];
}

export interface ProjectCreationResult {
  id: string;
  name: string;
  status: ProjectStatus;
  createdAt: string;
}
