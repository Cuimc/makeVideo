import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { NewsModule } from '../news/news.module';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';

@Module({
  imports: [AuthModule, NewsModule],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
