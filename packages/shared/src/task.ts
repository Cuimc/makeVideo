import type { PagingParams } from './api';
import type { TaskStatus } from './status';

export interface VideoGenerationForm {
  count: number;
  aspectRatio: '9:16' | '16:9' | '1:1';
  durationSeconds: number;
  styleBias: string;
  withSubtitle: boolean;
}

export interface VideoGenerationTask {
  id: string;
  projectId: string;
  projectName: string;
  status: TaskStatus;
  progressText: string;
  pointCost: number;
  refundPoints: number;
  createdAt: string;
  updatedAt: string;
  resultVideoIds: string[];
}

export interface TaskListQuery extends PagingParams {
  status?: TaskStatus;
  projectName?: string;
}
