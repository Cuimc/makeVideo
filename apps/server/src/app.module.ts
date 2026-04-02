import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';
import { NewsModule } from './modules/news/news.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { QueueModule } from './modules/queue/queue.module';
import { ScriptsModule } from './modules/scripts/scripts.module';
import { StoryboardsModule } from './modules/storyboards/storyboards.module';
import { UsersModule } from './modules/users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    AuthModule,
    HealthModule,
    NewsModule,
    ProjectsModule,
    QueueModule,
    ScriptsModule,
    StoryboardsModule,
    UsersModule,
    PrismaModule,
    RedisModule,
  ],
})
export class AppModule {}
