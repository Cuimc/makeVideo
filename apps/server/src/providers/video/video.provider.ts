export interface SubmitVideoTaskInput {
  taskId: string;
  script: string;
  storyboard: Array<{
    title: string;
    narration: string;
  }>;
}

export interface VideoSubmissionResult {
  providerTaskId: string;
}

export abstract class VideoProvider {
  abstract submit(input: SubmitVideoTaskInput): Promise<VideoSubmissionResult>;
}
