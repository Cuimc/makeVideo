import { defineStore } from 'pinia';
import { apiClient } from '../apis/client';

interface HealthState {
  status: string;
  service: string;
  timestamp: string;
  loading: boolean;
  error: string;
}

export const useHealthStore = defineStore('health', {
  state: (): HealthState => ({
    status: 'idle',
    service: '-',
    timestamp: '-',
    loading: false,
    error: '',
  }),
  actions: {
    async loadHealth() {
      this.loading = true;
      this.error = '';

      try {
        const payload = await apiClient.getHealth();
        this.status = payload.status;
        this.service = payload.service;
        this.timestamp = payload.timestamp;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'unknown error';
      } finally {
        this.loading = false;
      }
    },
  },
});
