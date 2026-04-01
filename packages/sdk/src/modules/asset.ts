import type { ImageUploadPayload, PagedResult, PagingParams, ReferenceImage } from '@make-video/shared';
import type { HttpClient } from '../http';

export function createAssetModule(http: HttpClient) {
  return {
    list(params?: PagingParams) {
      return http.get<PagedResult<ReferenceImage>>('/api/assets/images', { params });
    },
    uploadImage(payload: ImageUploadPayload) {
      return http.post<ReferenceImage>('/api/assets/images', payload);
    },
    remove(imageId: string) {
      return http.delete<void>(`/api/assets/images/${imageId}`);
    },
  };
}
