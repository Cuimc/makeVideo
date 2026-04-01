import { computed, ref } from 'vue';
import { defineStore } from 'pinia';

export interface ConfirmDialogOptions {
  title: string;
  content: string;
  confirmText?: string;
  cancelText?: string;
}

export const useUiStore = defineStore('ui', () => {
  const sidebarCollapsed = ref(false);
  const globalLoading = ref(false);
  const confirmDialogVisible = ref(false);
  const confirmDialogOptions = ref<ConfirmDialogOptions | null>(null);

  let resolver: ((value: boolean) => void) | null = null;

  const hasActiveConfirm = computed(() => confirmDialogVisible.value && confirmDialogOptions.value !== null);

  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value;
  }

  function setGlobalLoading(value: boolean) {
    globalLoading.value = value;
  }

  function confirm(options: ConfirmDialogOptions) {
    confirmDialogOptions.value = {
      confirmText: '确认',
      cancelText: '取消',
      ...options,
    };
    confirmDialogVisible.value = true;

    return new Promise<boolean>((resolve) => {
      resolver = resolve;
    });
  }

  function resolveConfirm(result: boolean) {
    confirmDialogVisible.value = false;
    confirmDialogOptions.value = null;
    resolver?.(result);
    resolver = null;
  }

  return {
    confirm,
    confirmDialogOptions,
    confirmDialogVisible,
    globalLoading,
    hasActiveConfirm,
    resolveConfirm,
    setGlobalLoading,
    sidebarCollapsed,
    toggleSidebar,
  };
});
