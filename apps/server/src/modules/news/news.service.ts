import type { NewsItem } from '@make-video/shared';
import { Inject, Injectable } from '@nestjs/common';
import { NewsProvider } from '../../providers/news/news.provider';

const newsCache = new Map<string, NewsItem>();

@Injectable()
export class NewsService {
  constructor(
    @Inject(NewsProvider)
    private readonly newsProvider: NewsProvider,
  ) {}

  async search(keyword: string): Promise<NewsItem[]> {
    const items = await this.newsProvider.search(keyword);
    const mappedItems = items.map<NewsItem>((item) => ({
      ...item,
      keyword,
    }));

    for (const item of mappedItems) {
      newsCache.set(item.id, item);
    }

    return mappedItems;
  }

  getByIds(newsIds: string[]): NewsItem[] {
    return newsIds
      .map((newsId) => newsCache.get(newsId))
      .filter((item): item is NewsItem => Boolean(item));
  }
}
