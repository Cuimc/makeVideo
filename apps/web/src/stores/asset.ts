import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { ImageUploadPayload, ReferenceImage } from '@make-video/shared';
import { apiClient } from '../api/client';

function toImagePayload(input: File | ImageUploadPayload): ImageUploadPayload {
  if (input instanceof File) {
    return {
      name: input.name,
      url: globalThis.URL?.createObjectURL?.(input) ?? '',
      size: input.size,
    };
  }

  return input;
}

export const useAssetStore = defineStore('asset', () => {
  const items = ref<ReferenceImage[]>([]);
  const loading = ref(false);
  const uploading = ref(false);
  const removingIds = ref<string[]>([]);

  async function load() {
    loading.value = true;

    try {
      const result = await apiClient.asset.list({
        page: 1,
        pageSize: 20,
      });
      items.value = result.items;
      return result;
    } finally {
      loading.value = false;
    }
  }

  async function uploadImage(input: File | ImageUploadPayload) {
    uploading.value = true;

    try {
      const image = await apiClient.asset.uploadImage(toImagePayload(input));
      items.value = [image, ...items.value];
      return image;
    } finally {
      uploading.value = false;
    }
  }

  async function remove(imageId: string) {
    removingIds.value = [...removingIds.value, imageId];

    try {
      await apiClient.asset.remove(imageId);
      items.value = items.value.filter((item) => item.id !== imageId);
    } finally {
      removingIds.value = removingIds.value.filter((item) => item !== imageId);
    }
  }

  return {
    items,
    load,
    loading,
    remove,
    removingIds,
    uploadImage,
    uploading,
  };
});
