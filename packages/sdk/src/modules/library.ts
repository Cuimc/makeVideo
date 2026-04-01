import type { LibraryVideo, PagedResult, PagingParams } from '@make-video/shared';
import type { HttpClient } from '../http';

export function createLibraryModule(http: HttpClient) {
  return {
    list(params?: PagingParams & { projectName?: string; createdAt?: string }) {
      return http.get<PagedResult<LibraryVideo>>('/api/library/videos', { params });
    },
    remove(videoId: string) {
      return http.delete<void>(`/api/library/videos/${videoId}`);
    },
  };
}
