import { ref } from 'vue';
import { defineStore } from 'pinia';
import type {
  ReferenceAnalysisResult,
  ReferenceVideoUploadPayload,
} from '@make-video/shared';
import { apiClient } from '../api/client';

function toReferencePayload(
  input: File | ReferenceVideoUploadPayload,
): ReferenceVideoUploadPayload {
  if (input instanceof File) {
    return {
      name: input.name,
      url: globalThis.URL?.createObjectURL?.(input) ?? '',
      durationSeconds: 60,
    };
  }

  return input;
}

export const useReferenceStore = defineStore('reference', () => {
  const items = ref<ReferenceAnalysisResult[]>([]);
  const loading = ref(false);
  const uploading = ref(false);
  const removingIds = ref<string[]>([]);

  async function load() {
    loading.value = true;

    try {
      const result = await apiClient.reference.list({
        page: 1,
        pageSize: 20,
      });
      items.value = result.items;
      return result;
    } finally {
      loading.value = false;
    }
  }

  async function uploadVideo(input: File | ReferenceVideoUploadPayload) {
    uploading.value = true;

    try {
      const result = await apiClient.reference.uploadVideo(toReferencePayload(input));
      items.value = [result, ...items.value];
      return result;
    } finally {
      uploading.value = false;
    }
  }

  async function remove(referenceId: string) {
    removingIds.value = [...removingIds.value, referenceId];

    try {
      await apiClient.reference.remove(referenceId);
      items.value = items.value.filter((item) => item.id !== referenceId);
    } finally {
      removingIds.value = removingIds.value.filter((item) => item !== referenceId);
    }
  }

  return {
    items,
    load,
    loading,
    remove,
    removingIds,
    uploadVideo,
    uploading,
  };
});
