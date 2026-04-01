<script setup lang="ts">
import { NCard, NDescriptions, NDescriptionsItem, NTag } from 'naive-ui';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
import { useAppStore } from '../stores/app';
import { useHealthStore } from '../stores/health';

const appStore = useAppStore();
const healthStore = useHealthStore();
const { title, subtitle } = storeToRefs(appStore);
const { status, service, timestamp, error } = storeToRefs(healthStore);

onMounted(() => {
  void healthStore.loadHealth();
});
</script>

<template>
  <main class="min-h-screen bg-slate-100 p-10 text-slate-900">
    <div class="mx-auto max-w-4xl">
      <NCard title="控制台概览">
        <div class="space-y-6">
          <div>
            <h1 class="text-3xl font-bold">{{ title }}</h1>
            <p class="mt-2 text-base text-slate-600">{{ subtitle }}</p>
          </div>

          <NTag type="success" size="large">
            Vue 3 + Vite + Pinia + Router + UnoCSS
          </NTag>

          <NDescriptions bordered :column="1" label-placement="left">
            <NDescriptionsItem label="API 状态">{{ status }}</NDescriptionsItem>
            <NDescriptionsItem label="服务名">{{ service }}</NDescriptionsItem>
            <NDescriptionsItem label="时间戳">{{ timestamp }}</NDescriptionsItem>
            <NDescriptionsItem label="错误信息">{{ error || '无' }}</NDescriptionsItem>
          </NDescriptions>
        </div>
      </NCard>
    </div>
  </main>
</template>
