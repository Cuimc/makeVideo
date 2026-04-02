import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { BillingModule } from './modules/billing/billing.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { HealthModule } from './modules/health/health.module';
import { LibraryModule } from './modules/library/library.module';
import { NewsModule } from './modules/news/news.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { QueueModule } from './modules/queue/queue.module';
import { ReferencesModule } from './modules/references/references.module';
import { ScriptsModule } from './modules/scripts/scripts.module';
import { StoryboardsModule } from './modules/storyboards/storyboards.module';
import { UsersModule } from './modules/users/users.module';
import { VideoTasksModule } from './modules/video-tasks/video-tasks.module';
import { AssetsModule } from './modules/assets/assets.module';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    AuthModule,
    AssetsModule,
    BillingModule,
    DashboardModule,
    HealthModule,
    LibraryModule,
    NewsModule,
    ProjectsModule,
    QueueModule,
    ReferencesModule,
    ScriptsModule,
    StoryboardsModule,
    UsersModule,
    VideoTasksModule,
    PrismaModule,
    RedisModule,
  ],
})
export class AppModule {}
