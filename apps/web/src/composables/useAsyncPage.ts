import { computed, ref } from 'vue';

export function useAsyncPage<T>(loader: () => Promise<T>) {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const data = ref<T | null>(null);

  const empty = computed(() => !loading.value && !error.value && data.value === null);

  async function execute() {
    loading.value = true;
    error.value = null;

    try {
      data.value = await loader();
      return data.value;
    } catch (reason) {
      error.value = reason instanceof Error ? reason.message : '加载失败';
      throw reason;
    } finally {
      loading.value = false;
    }
  }

  function reset() {
    loading.value = false;
    error.value = null;
    data.value = null;
  }

  return {
    data,
    empty,
    error,
    execute,
    loading,
    reset,
  };
}
