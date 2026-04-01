<script setup lang="ts">
import { NCard, NTag } from 'naive-ui';
import { storeToRefs } from 'pinia';
import { useAppStore } from '../stores/app';

const appStore = useAppStore();
const { title, subtitle } = storeToRefs(appStore);
</script>

<template>
  <main class="min-h-screen bg-slate-100 p-10 text-slate-900">
    <div class="mx-auto max-w-4xl">
      <NCard title="控制台概览">
        <div class="space-y-4">
          <div>
            <h1 class="text-3xl font-bold">{{ title }}</h1>
            <p class="mt-2 text-base text-slate-600">{{ subtitle }}</p>
          </div>
          <NTag type="success" size="large">
            Vue 3 + Vite + Pinia + Router + UnoCSS
          </NTag>
        </div>
      </NCard>
    </div>
  </main>
</template>
