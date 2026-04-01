import {
  PROJECT_STATUS_OPTIONS,
  REFERENCE_STATUS_OPTIONS,
  TASK_STATUS_OPTIONS,
  type ProjectStatus,
  type ReferenceAnalysisStatus,
  type StatusOption,
  type StatusTone,
  type TaskStatus,
} from '@make-video/shared';

export type NaiveTagType = 'default' | 'info' | 'success' | 'warning' | 'error';

export const toneToTagType: Record<StatusTone, NaiveTagType> = {
  default: 'default',
  info: 'info',
  success: 'success',
  warning: 'warning',
  error: 'error',
};

function toMap<T extends string>(options: StatusOption<T>[]) {
  return Object.fromEntries(options.map((item) => [item.value, item])) as Record<T, StatusOption<T>>;
}

export const projectStatusMap = toMap<ProjectStatus>(PROJECT_STATUS_OPTIONS);
export const taskStatusMap = toMap<TaskStatus>(TASK_STATUS_OPTIONS);
export const referenceStatusMap = toMap<ReferenceAnalysisStatus>(REFERENCE_STATUS_OPTIONS);
