export type StatusTone = 'default' | 'info' | 'success' | 'warning' | 'error';

export interface StatusOption<T extends string> {
  value: T;
  label: string;
  tone: StatusTone;
}

export type ProjectStatus =
  | 'created'
  | 'script_generating'
  | 'script_pending_confirm'
  | 'script_confirmed'
  | 'video_generating'
  | 'completed'
  | 'failed';

export type TaskStatus =
  | 'pending_submit'
  | 'queued'
  | 'generating'
  | 'success'
  | 'partial_success'
  | 'failed'
  | 'canceled';

export type ReferenceAnalysisStatus =
  | 'pending'
  | 'analyzing'
  | 'success'
  | 'failed';

export const PROJECT_STATUS_OPTIONS: StatusOption<ProjectStatus>[] = [
  { value: 'created', label: '已创建', tone: 'default' },
  { value: 'script_generating', label: '脚本生成中', tone: 'info' },
  { value: 'script_pending_confirm', label: '脚本待确认', tone: 'warning' },
  { value: 'script_confirmed', label: '脚本已确认', tone: 'success' },
  { value: 'video_generating', label: '视频生成中', tone: 'info' },
  { value: 'completed', label: '已完成', tone: 'success' },
  { value: 'failed', label: '失败', tone: 'error' },
];

export const TASK_STATUS_OPTIONS: StatusOption<TaskStatus>[] = [
  { value: 'pending_submit', label: '待提交', tone: 'default' },
  { value: 'queued', label: '排队中', tone: 'warning' },
  { value: 'generating', label: '生成中', tone: 'info' },
  { value: 'success', label: '成功', tone: 'success' },
  { value: 'partial_success', label: '部分成功', tone: 'warning' },
  { value: 'failed', label: '失败', tone: 'error' },
  { value: 'canceled', label: '已取消', tone: 'default' },
];

export const REFERENCE_STATUS_OPTIONS: StatusOption<ReferenceAnalysisStatus>[] = [
  { value: 'pending', label: '待分析', tone: 'default' },
  { value: 'analyzing', label: '分析中', tone: 'info' },
  { value: 'success', label: '分析成功', tone: 'success' },
  { value: 'failed', label: '分析失败', tone: 'error' },
];
