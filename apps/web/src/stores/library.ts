import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { LibraryVideo } from '@make-video/shared';
import { apiClient } from '../api/client';

export const useLibraryStore = defineStore('library', () => {
  const items = ref<LibraryVideo[]>([]);
  const loading = ref(false);
  const removingIds = ref<string[]>([]);

  async function load() {
    loading.value = true;

    try {
      const result = await apiClient.library.list({
        page: 1,
        pageSize: 20,
      });
      items.value = result.items;
      return result;
    } finally {
      loading.value = false;
    }
  }

  async function remove(videoId: string) {
    removingIds.value = [...removingIds.value, videoId];

    try {
      await apiClient.library.remove(videoId);
      items.value = items.value.filter((item) => item.id !== videoId);
    } finally {
      removingIds.value = removingIds.value.filter((item) => item !== videoId);
    }
  }

  return {
    items,
    load,
    loading,
    remove,
    removingIds,
  };
});
