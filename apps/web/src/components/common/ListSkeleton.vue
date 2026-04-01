<script setup lang="ts">
import { NCard, NSkeleton } from 'naive-ui';

withDefaults(
  defineProps<{
    rows?: number;
  }>(),
  {
    rows: 3,
  },
);
</script>

<template>
  <div class="space-y-4">
    <NCard
      v-for="row in rows"
      :key="row"
      class="rounded-[12px]"
    >
      <div class="space-y-3">
        <NSkeleton
          text
          width="35%"
        />
        <NSkeleton
          text
          :repeat="2"
        />
        <NSkeleton
          text
          width="45%"
        />
      </div>
    </NCard>
  </div>
</template>
