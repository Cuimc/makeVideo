<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { NAlert, NButton, NCard } from 'naive-ui';
import { useRouter } from 'vue-router';
import PageContainer from '../../components/common/PageContainer.vue';
import EmptyState from '../../components/common/EmptyState.vue';
import ListSkeleton from '../../components/common/ListSkeleton.vue';
import ProjectCard from '../../components/cards/ProjectCard.vue';
import VideoCard from '../../components/cards/VideoCard.vue';
import { useAuthStore } from '../../stores/auth';
import { useDashboardStore } from '../../stores/dashboard';

const router = useRouter();
const authStore = useAuthStore();
const dashboardStore = useDashboardStore();

const welcomeText = computed(() => authStore.profile?.nickname ?? '欢迎回来');
const pointBalance = computed(
  () => dashboardStore.summary?.pointBalance ?? authStore.profile?.pointBalance ?? 0,
);

const quickActions = [
  {
    title: '新建项目',
    description: '从已有新闻选题发起新的创作项目',
    actionText: '去选新闻',
    to: '/news/topics',
  },
  {
    title: '去选新闻',
    description: '围绕关键词搜索热点新闻并选择题材',
    actionText: '打开选题页',
    to: '/news/topics',
  },
  {
    title: '上传素材',
    description: '管理参考图片，供创作页和生成页调用',
    actionText: '进入素材库',
    to: '/assets',
  },
  {
    title: '上传参考视频',
    description: '分析视频结构，沉淀到脚本参考库',
    actionText: '进入脚本参考库',
    to: '/references',
  },
];

function openRoute(path: string) {
  void router.push(path);
}

onMounted(() => {
  void dashboardStore.fetchDashboard();
});
</script>

<template>
  <PageContainer
    title="工作台"
    description="快速开始新的内容生产任务"
  >
    <template #extra>
      <div class="rounded-[12px] border border-[#DBEAFE] bg-[#EFF6FF] px-4 py-3 text-right">
        <div class="text-[12px] text-[#6B7280]">
          {{ welcomeText }}
        </div>
        <div class="mt-1 text-[24px] font-semibold text-[#2563EB]">
          {{ pointBalance }}
        </div>
        <div class="text-[12px] text-[#6B7280]">
          当前可用积分
        </div>
      </div>
    </template>

    <div class="grid gap-6 lg:grid-cols-4">
      <NCard
        v-for="item in quickActions"
        :key="item.title"
        class="rounded-[12px]"
      >
        <div class="space-y-4">
          <div>
            <h2 class="text-[18px] font-semibold text-[#111827]">
              {{ item.title }}
            </h2>
            <p class="mt-2 text-[13px] leading-[1.6] text-[#6B7280]">
              {{ item.description }}
            </p>
          </div>
          <NButton
            type="primary"
            secondary
            @click="openRoute(item.to)"
          >
            {{ item.actionText }}
          </NButton>
        </div>
      </NCard>
    </div>

    <div
      v-if="dashboardStore.error"
      class="rounded-[12px] border border-[#FECACA] bg-[#FEF2F2] p-4"
    >
      <NAlert type="error">
        {{ dashboardStore.error }}
      </NAlert>
      <div class="mt-3">
        <NButton
          text
          @click="dashboardStore.fetchDashboard"
        >
          重试
        </NButton>
      </div>
    </div>

    <div class="grid gap-6 xl:grid-cols-2">
      <section class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-[18px] font-semibold text-[#111827]">
            最近项目
          </h2>
          <span class="text-[13px] text-[#6B7280]">
            {{ dashboardStore.summary?.recentProjectCount ?? dashboardStore.projects.length }} 个
          </span>
        </div>

        <ListSkeleton
          v-if="dashboardStore.loading"
          :rows="2"
        />
        <EmptyState
          v-else-if="!dashboardStore.projects.length"
          title="还没有项目"
          description="从新闻选题开始创建第一个项目"
        />
        <div
          v-else
          class="space-y-4"
        >
          <ProjectCard
            v-for="item in dashboardStore.projects"
            :key="item.id"
            :project="item"
          />
        </div>
      </section>

      <section class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-[18px] font-semibold text-[#111827]">
            最近成品视频
          </h2>
          <span class="text-[13px] text-[#6B7280]">
            {{ dashboardStore.summary?.recentVideoCount ?? dashboardStore.videos.length }} 个
          </span>
        </div>

        <ListSkeleton
          v-if="dashboardStore.loading"
          :rows="2"
        />
        <EmptyState
          v-else-if="!dashboardStore.videos.length"
          title="还没有成品视频"
          description="完成视频生成后会自动沉淀到成品库"
        />
        <div
          v-else
          class="grid gap-4 md:grid-cols-2"
        >
          <VideoCard
            v-for="item in dashboardStore.videos"
            :key="item.id"
            :video="item"
            :show-actions="false"
          />
        </div>
      </section>
    </div>
  </PageContainer>
</template>
