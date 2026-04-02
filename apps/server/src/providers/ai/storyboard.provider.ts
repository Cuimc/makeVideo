export interface GenerateStoryboardInput {
  projectId: string;
  scriptTitle: string;
  sections: Array<{
    title: string;
    narration: string;
  }>;
}

export interface StoryboardFrame {
  title: string;
  narration: string;
  visual: string;
}

export interface StoryboardGenerationResult {
  title: string;
  frames: StoryboardFrame[];
}

export abstract class StoryboardProvider {
  abstract generate(
    input: GenerateStoryboardInput,
  ): Promise<StoryboardGenerationResult>;
}
