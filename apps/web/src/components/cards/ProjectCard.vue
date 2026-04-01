<script setup lang="ts">
import { NCard } from 'naive-ui';
import type { ProjectListItem } from '@make-video/shared';
import StatusTag from '../common/StatusTag.vue';

defineProps<{
  project: ProjectListItem;
}>();
</script>

<template>
  <NCard class="rounded-[12px]">
    <div class="space-y-3">
      <div class="flex items-start justify-between gap-3">
        <div>
          <h3 class="text-[16px] font-semibold text-[#111827]">
            {{ project.name }}
          </h3>
          <p class="mt-1 text-[13px] text-[#6B7280]">
            关键词：{{ project.keyword }}
          </p>
        </div>
        <StatusTag
          category="project"
          :status="project.status"
        />
      </div>
      <p class="text-[13px] text-[#6B7280]">
        最近更新：{{ project.updatedAt }}
      </p>
    </div>
  </NCard>
</template>
