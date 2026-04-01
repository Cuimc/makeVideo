import { defineStore } from 'pinia';
import type { DashboardSummary, LibraryVideo, ProjectListItem } from '@make-video/shared';
import { apiClient } from '../api/client';

interface DashboardState {
  summary: DashboardSummary | null;
  projects: ProjectListItem[];
  videos: LibraryVideo[];
  loading: boolean;
  error: string | null;
}

export const useDashboardStore = defineStore('dashboard', {
  state: (): DashboardState => ({
    summary: null,
    projects: [],
    videos: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchDashboard() {
      this.loading = true;
      this.error = null;

      try {
        const result = await apiClient.dashboard.getSummary();
        this.summary = result.summary;
        this.projects = result.recentProjects;
        this.videos = result.recentVideos;
      } catch (error) {
        this.error = error instanceof Error ? error.message : '加载失败';
      } finally {
        this.loading = false;
      }
    },
  },
});
