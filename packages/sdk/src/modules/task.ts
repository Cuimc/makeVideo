import type {
  PagedResult,
  TaskListQuery,
  VideoGenerationForm,
  VideoGenerationTask,
} from '@make-video/shared';
import type { HttpClient } from '../http';

export function createTaskModule(http: HttpClient) {
  return {
    submit(projectId: string, payload: VideoGenerationForm) {
      return http.post<VideoGenerationTask>('/api/video-tasks', {
        projectId,
        ...payload,
      });
    },
    list(params?: TaskListQuery) {
      return http.get<PagedResult<VideoGenerationTask>>('/api/video-tasks', { params });
    },
    retry(taskId: string) {
      return http.post<VideoGenerationTask>(`/api/video-tasks/${taskId}/retry`);
    },
  };
}
