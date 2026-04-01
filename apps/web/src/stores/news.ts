import { defineStore } from 'pinia';
import type { NewsItem } from '@make-video/shared';
import { apiClient } from '../api/client';

interface NewsState {
  keyword: string;
  items: NewsItem[];
  selectedIds: string[];
  loading: boolean;
  creating: boolean;
  error: string | null;
}

export const useNewsStore = defineStore('news', {
  state: (): NewsState => ({
    keyword: '',
    items: [],
    selectedIds: [],
    loading: false,
    creating: false,
    error: null,
  }),
  getters: {
    selectedItems(state) {
      return state.items.filter((item) => state.selectedIds.includes(item.id));
    },
  },
  actions: {
    toggle(newsId: string) {
      if (this.selectedIds.includes(newsId)) {
        this.selectedIds = this.selectedIds.filter((item) => item !== newsId);
        return;
      }

      this.selectedIds = [...this.selectedIds, newsId];
    },
    async search() {
      this.loading = true;
      this.error = null;

      try {
        this.items = await apiClient.news.search({
          keyword: this.keyword,
        });
      } catch (error) {
        this.error = error instanceof Error ? error.message : '搜索失败';
      } finally {
        this.loading = false;
      }
    },
    async createProject() {
      this.creating = true;

      try {
        return await apiClient.news.createProject({
          keyword: this.keyword,
          newsIds: this.selectedIds,
        });
      } finally {
        this.creating = false;
      }
    },
  },
});
