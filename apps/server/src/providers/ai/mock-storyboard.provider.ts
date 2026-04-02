import { Injectable } from '@nestjs/common';
import {
  StoryboardProvider,
  type GenerateStoryboardInput,
  type StoryboardGenerationResult,
} from './storyboard.provider';

@Injectable()
export class MockStoryboardProvider extends StoryboardProvider {
  async generate(
    input: GenerateStoryboardInput,
  ): Promise<StoryboardGenerationResult> {
    return {
      title: `${input.scriptTitle} Storyboard`,
      frames: input.sections.map((section, index) => ({
        title: section.title,
        narration: section.narration,
        visual: `Mock visual ${index + 1} for ${section.title}`,
      })),
    };
  }
}
