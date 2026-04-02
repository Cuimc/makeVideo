import { Module } from '@nestjs/common';
import { MockStoryboardProvider } from '../../providers/ai/mock-storyboard.provider';
import { StoryboardProvider } from '../../providers/ai/storyboard.provider';
import { AuthModule } from '../auth/auth.module';
import { ProjectsModule } from '../projects/projects.module';
import { StoryboardsController } from './storyboards.controller';
import { StoryboardsService } from './storyboards.service';

@Module({
  imports: [AuthModule, ProjectsModule],
  controllers: [StoryboardsController],
  providers: [
    StoryboardsService,
    MockStoryboardProvider,
    {
      provide: StoryboardProvider,
      useExisting: MockStoryboardProvider,
    },
  ],
})
export class StoryboardsModule {}
