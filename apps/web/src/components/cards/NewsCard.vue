<script setup lang="ts">
import { NButton, NCard, NTag } from 'naive-ui';
import type { NewsItem } from '@make-video/shared';

defineProps<{
  news: NewsItem;
  checked: boolean;
}>();

defineEmits<{
  toggle: [];
}>();
</script>

<template>
  <NCard class="rounded-[12px]">
    <div class="space-y-4">
      <div class="flex items-start justify-between gap-4">
        <div class="space-y-2">
          <h3 class="text-[16px] font-semibold text-[#111827]">
            {{ news.title }}
          </h3>
          <div class="flex flex-wrap gap-2">
            <NTag
              size="small"
              round
              :bordered="false"
            >
              {{ news.source }}
            </NTag>
            <NTag
              size="small"
              round
              :bordered="false"
              type="info"
            >
              {{ news.keyword }}
            </NTag>
          </div>
        </div>
        <NButton
          :type="checked ? 'primary' : 'default'"
          secondary
          @click="$emit('toggle')"
        >
          {{ checked ? '取消选择' : '选择新闻' }}
        </NButton>
      </div>
      <p class="text-[13px] leading-[1.6] text-[#6B7280]">
        {{ news.summary }}
      </p>
      <p class="text-[12px] text-[#9CA3AF]">
        发布时间：{{ news.publishedAt }}
      </p>
    </div>
  </NCard>
</template>
