import type {
  CreateProjectPayload,
  NewsItem,
  NewsSearchParams,
  ProjectCreationResult,
} from '@make-video/shared';
import type { HttpClient } from '../http';

export function createNewsModule(http: HttpClient) {
  return {
    search(params: NewsSearchParams) {
      return http.get<NewsItem[]>('/api/news', { params });
    },
    createProject(payload: CreateProjectPayload) {
      return http.post<ProjectCreationResult>('/api/projects', payload);
    },
  };
}
