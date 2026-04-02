import { Injectable } from '@nestjs/common';
import { NewsProvider, type NewsSearchItem } from './news.provider';

@Injectable()
export class MockNewsProvider extends NewsProvider {
  async search(keyword: string): Promise<NewsSearchItem[]> {
    return [
      createNewsItem(keyword, 1),
      createNewsItem(keyword, 2),
      createNewsItem(keyword, 3),
    ];
  }
}

function createNewsItem(keyword: string, index: number): NewsSearchItem {
  return {
    id: `news-${keyword || 'general'}-${index}`,
    title: `${keyword || 'General'} market update ${index}`,
    summary: `Summary ${index} for keyword ${keyword || 'general'}.`,
    source: 'Mock News',
    publishedAt: new Date(Date.UTC(2026, 3, index, 8, 0, 0)).toISOString(),
    url: `https://example.com/news/${keyword || 'general'}-${index}`,
  };
}
