import { Injectable } from '@nestjs/common';
import {
  VideoProvider,
  type SubmitVideoTaskInput,
  type VideoSubmissionResult,
} from './video.provider';

@Injectable()
export class MockVideoProvider extends VideoProvider {
  async submit(input: SubmitVideoTaskInput): Promise<VideoSubmissionResult> {
    return {
      providerTaskId: `mock-video-${input.taskId}`,
    };
  }
}
