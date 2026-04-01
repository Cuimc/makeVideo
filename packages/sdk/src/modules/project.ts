import type {
  ProjectDetail,
  SaveProjectDraftPayload,
  ScriptGenerationResult,
  StoryboardGenerationResult,
} from '@make-video/shared';
import type { HttpClient } from '../http';

export function createProjectModule(http: HttpClient) {
  return {
    getDetail(projectId: string) {
      return http.get<ProjectDetail>(`/api/projects/${projectId}`);
    },
    saveDraft(projectId: string, payload: SaveProjectDraftPayload) {
      return http.put<ProjectDetail>(`/api/projects/${projectId}`, payload);
    },
    generateScript(projectId: string) {
      return http.post<ScriptGenerationResult>(`/api/projects/${projectId}/script/generate`);
    },
    generateStoryboard(projectId: string) {
      return http.post<StoryboardGenerationResult>(
        `/api/projects/${projectId}/storyboard/generate`,
      );
    },
    confirm(projectId: string) {
      return http.post<ProjectDetail>(`/api/projects/${projectId}/confirm`);
    },
  };
}
