export interface NewsSearchItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  url: string;
}

export abstract class NewsProvider {
  abstract search(keyword: string): Promise<NewsSearchItem[]>;
}
