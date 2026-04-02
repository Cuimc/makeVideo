import { Injectable } from '@nestjs/common';
import { StoryboardsService } from '../modules/storyboards/storyboards.service';

@Injectable()
export class StoryboardGenerateProcessor {
  constructor(private readonly storyboardsService: StoryboardsService) {}

  process(job: { projectId: string; userId: string }) {
    return this.storyboardsService.generate(job.projectId, job.userId);
  }
}
