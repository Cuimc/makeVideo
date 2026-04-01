import type {
  PagedResult,
  PagingParams,
  ReferenceAnalysisResult,
  ReferenceVideoUploadPayload,
} from '@make-video/shared';
import type { HttpClient } from '../http';

export function createReferenceModule(http: HttpClient) {
  return {
    list(params?: PagingParams) {
      return http.get<PagedResult<ReferenceAnalysisResult>>('/api/references', { params });
    },
    uploadVideo(payload: ReferenceVideoUploadPayload) {
      return http.post<ReferenceAnalysisResult>('/api/references/analyze', payload);
    },
    remove(referenceId: string) {
      return http.delete<void>(`/api/references/${referenceId}`);
    },
  };
}
