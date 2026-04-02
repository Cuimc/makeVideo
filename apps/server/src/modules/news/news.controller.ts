import type { NewsItem } from '@make-video/shared';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { SearchNewsDto } from './dto/search-news.dto';
import { NewsService } from './news.service';

@ApiTags('news')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  @ApiOperation({ summary: '搜索新闻' })
  search(@Query() query: SearchNewsDto): Promise<NewsItem[]> {
    return this.newsService.search(query.keyword);
  }
}
