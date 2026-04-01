<script setup lang="ts">
import { NButton, NCard } from 'naive-ui';
import type { LibraryVideo } from '@make-video/shared';

withDefaults(
  defineProps<{
    video: LibraryVideo;
    showActions?: boolean;
  }>(),
  {
    showActions: true,
  },
);

defineEmits<{
  preview: [videoId: string];
  download: [videoId: string];
  delete: [videoId: string];
}>();
</script>

<template>
  <NCard class="rounded-[12px]">
    <div class="space-y-4">
      <div
        class="h-36 rounded-[8px] bg-[#E5E7EB] bg-cover bg-center"
        :style="{ backgroundImage: `url(${video.coverUrl})` }"
      />
      <div>
        <h3 class="text-[16px] font-semibold text-[#111827]">
          {{ video.title }}
        </h3>
        <p class="mt-1 text-[13px] text-[#6B7280]">
          生成时间：{{ video.createdAt }}
        </p>
      </div>
      <div
        v-if="showActions"
        class="flex gap-3"
      >
        <NButton
          secondary
          size="small"
          @click="$emit('preview', video.id)"
        >
          预览
        </NButton>
        <NButton
          secondary
          size="small"
          @click="$emit('download', video.id)"
        >
          下载
        </NButton>
        <NButton
          tertiary
          type="error"
          size="small"
          @click="$emit('delete', video.id)"
        >
          删除
        </NButton>
      </div>
    </div>
  </NCard>
</template>
