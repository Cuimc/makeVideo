export const QUEUE_NAMES = {
  SCRIPT_GENERATE: 'script-generate',
  STORYBOARD_GENERATE: 'storyboard-generate',
  REFERENCE_ANALYZE: 'reference-analyze',
  VIDEO_GENERATE: 'video-generate',
  VIDEO_WRITEBACK: 'video-writeback',
} as const;

export type QueueName = (typeof QUEUE_NAMES)[keyof typeof QUEUE_NAMES];
