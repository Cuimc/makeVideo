import type { StoryboardGenerationResult } from '@make-video/shared';
import { Inject, Injectable } from '@nestjs/common';
import { StoryboardProvider } from '../../providers/ai/storyboard.provider';
import {
  ProjectsService,
  buildStoryboardScenes,
} from '../projects/projects.service';

const STORYBOARD_POINT_COST = 120;

@Injectable()
export class StoryboardsService {
  constructor(
    private readonly projectsService: ProjectsService,
    @Inject(StoryboardProvider)
    private readonly storyboardProvider: StoryboardProvider,
  ) {}

  async generate(
    projectId: string,
    userId: string,
  ): Promise<StoryboardGenerationResult> {
    const input = this.projectsService.getStoryboardInput(projectId, userId);
    const result = await this.storyboardProvider.generate(input);
    const payload: StoryboardGenerationResult = {
      storyboard: buildStoryboardScenes(result.frames),
      estimatedPointCost: STORYBOARD_POINT_COST,
    };

    this.projectsService.setStoryboardDraft(userId, projectId, payload);

    return payload;
  }
}
