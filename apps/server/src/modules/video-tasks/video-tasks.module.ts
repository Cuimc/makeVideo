import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ProjectsModule } from '../projects/projects.module';
import { VideoTasksController } from './video-tasks.controller';
import { VideoTasksService } from './video-tasks.service';

@Module({
  imports: [AuthModule, ProjectsModule],
  controllers: [VideoTasksController],
  providers: [VideoTasksService],
  exports: [VideoTasksService],
})
export class VideoTasksModule {}
