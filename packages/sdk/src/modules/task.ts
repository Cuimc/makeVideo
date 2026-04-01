import type { PagedResult, TaskListQuery, VideoGenerationTask } from '@make-video/shared';
import type { HttpClient } from '../http';

export function createTaskModule(http: HttpClient) {
  return {
    list(params?: TaskListQuery) {
      return http.get<PagedResult<VideoGenerationTask>>('/api/tasks', { params });
    },
    retry(taskId: string) {
      return http.post<VideoGenerationTask>(`/api/tasks/${taskId}/retry`);
    },
  };
}
