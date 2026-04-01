<script setup lang="ts">
import { NButton, NCard, NModal } from 'naive-ui';
import { useUiStore } from '../../stores/ui';

const uiStore = useUiStore();
</script>

<template>
  <NModal
    :show="uiStore.confirmDialogVisible"
    preset="card"
    style="width: 420px"
  >
    <NCard
      :bordered="false"
      class="rounded-[12px]"
    >
      <div class="space-y-3">
        <h3 class="text-[18px] font-semibold text-[#111827]">
          {{ uiStore.confirmDialogOptions?.title }}
        </h3>
        <p class="text-sm leading-[1.6] text-[#6B7280]">
          {{ uiStore.confirmDialogOptions?.content }}
        </p>
        <div class="flex justify-end gap-3 pt-2">
          <NButton @click="uiStore.resolveConfirm(false)">
            {{ uiStore.confirmDialogOptions?.cancelText ?? '取消' }}
          </NButton>
          <NButton
            type="error"
            @click="uiStore.resolveConfirm(true)"
          >
            {{ uiStore.confirmDialogOptions?.confirmText ?? '确认' }}
          </NButton>
        </div>
      </div>
    </NCard>
  </NModal>
</template>
