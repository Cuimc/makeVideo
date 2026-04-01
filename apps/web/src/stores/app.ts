import { defineStore } from 'pinia';

export const useAppStore = defineStore('app', {
  state: () => ({
    title: 'Make Video Console',
    subtitle: '前后端 Monorepo 已初始化',
  }),
});
