import { Module } from '@nestjs/common';
import { MockNewsProvider } from '../../providers/news/mock-news.provider';
import { NewsProvider } from '../../providers/news/news.provider';
import { AuthModule } from '../auth/auth.module';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';

@Module({
  imports: [AuthModule],
  controllers: [NewsController],
  providers: [
    NewsService,
    MockNewsProvider,
    {
      provide: NewsProvider,
      useExisting: MockNewsProvider,
    },
  ],
  exports: [NewsService],
})
export class NewsModule {}
