import type { ReferenceAnalysisStatus } from './status';

export interface ReferenceVideoUploadPayload {
  name: string;
  url: string;
  durationSeconds: number;
}

export interface ReferenceAnalysisResult {
  id: string;
  title: string;
  status: ReferenceAnalysisStatus;
  theme: string;
  structureSummary: string;
  scriptSummary: string;
  storyboardSummary: string;
  applicableScenes: string[];
  createdAt: string;
}
