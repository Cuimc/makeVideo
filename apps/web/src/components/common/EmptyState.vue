<script setup lang="ts">
import { NEmpty } from 'naive-ui';

defineProps<{
  title: string;
  description?: string;
}>();
</script>

<template>
  <div class="rounded-[12px] border border-dashed border-[#E5E7EB] bg-white px-6 py-10">
    <NEmpty :description="description">
      <template #default>
        {{ title }}
      </template>
    </NEmpty>
  </div>
</template>
