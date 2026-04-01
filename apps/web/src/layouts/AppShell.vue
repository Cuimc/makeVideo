<script setup lang="ts">
import { computed } from 'vue';
import { NButton, NLayout, NLayoutContent, NLayoutHeader, NLayoutSider } from 'naive-ui';
import { RouterLink, RouterView, useRouter } from 'vue-router';
import { navigationItems } from '../constants/navigation';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const pointBalance = computed(() => authStore.profile?.pointBalance ?? 0);

function handleLogout() {
  authStore.logout();
  void router.replace({
    name: 'login',
  });
}
</script>

<template>
  <NLayout class="min-h-screen bg-[#F9FAFB]">
    <NLayoutHeader
      bordered
      class="h-[56px] bg-white"
    >
      <div class="mx-auto flex h-full items-center justify-between px-6">
        <div>
          <div class="text-base font-semibold text-[#111827]">
            Make Video
          </div>
          <div class="text-xs text-[#6B7280]">
            新闻驱动的 AI 视频生成平台
          </div>
        </div>

        <div class="flex items-center gap-4">
          <span class="text-sm text-[#6B7280]">
            可用积分 {{ pointBalance }}
          </span>
          <NButton
            quaternary
            @click="handleLogout"
          >
            退出登录
          </NButton>
        </div>
      </div>
    </NLayoutHeader>

    <NLayout
      has-sider
      class="min-h-[calc(100vh-56px)]"
    >
      <NLayoutSider
        bordered
        :width="220"
        collapse-mode="width"
        :collapsed-width="220"
        class="bg-white"
      >
        <nav class="px-3 py-4">
          <RouterLink
            v-for="item in navigationItems"
            :key="item.key"
            :to="item.to"
            class="mb-1 flex h-10 items-center rounded-[8px] px-3 text-sm text-[#374151] transition hover:bg-[#EFF6FF] hover:text-[#2563EB]"
            active-class="bg-[#EFF6FF] text-[#2563EB]"
          >
            {{ item.label }}
          </RouterLink>
        </nav>
      </NLayoutSider>

      <NLayoutContent
        embedded
        class="p-6"
      >
        <RouterView />
      </NLayoutContent>
    </NLayout>
  </NLayout>
</template>
