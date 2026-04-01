<script setup lang="ts">
import { NAlert, NButton, NCard, NInput } from 'naive-ui';
import { useRouter } from 'vue-router';
import EmptyState from '../../components/common/EmptyState.vue';
import ListSkeleton from '../../components/common/ListSkeleton.vue';
import PageContainer from '../../components/common/PageContainer.vue';
import NewsCard from '../../components/cards/NewsCard.vue';
import { useNewsStore } from '../../stores/news';

const router = useRouter();
const newsStore = useNewsStore();

async function handleNext() {
  const project = await newsStore.createProject();

  await router.push({
    name: 'project-workspace',
    params: {
      projectId: project.id,
    },
  });
}
</script>

<template>
  <PageContainer
    title="新闻选题"
    description="从热点新闻中筛选适合制作视频的主题"
  >
    <NCard class="rounded-[12px]">
      <div class="flex gap-4">
        <NInput
          v-model:value="newsStore.keyword"
          placeholder="输入养老、科技、机器人等关键词"
        />
        <NButton
          type="primary"
          :loading="newsStore.loading"
          @click="newsStore.search"
        >
          搜索新闻
        </NButton>
      </div>
    </NCard>

    <NAlert
      v-if="newsStore.error"
      type="error"
    >
      {{ newsStore.error }}
    </NAlert>

    <div class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <section class="space-y-4">
        <h2 class="text-[18px] font-semibold text-[#111827]">
          新闻列表
        </h2>
        <ListSkeleton
          v-if="newsStore.loading"
          :rows="4"
        />
        <EmptyState
          v-else-if="!newsStore.items.length"
          title="还没有搜索结果"
          description="输入关键词后查看相关新闻"
        />
        <div
          v-else
          class="space-y-4"
        >
          <NewsCard
            v-for="item in newsStore.items"
            :key="item.id"
            :news="item"
            :checked="newsStore.selectedIds.includes(item.id)"
            @toggle="newsStore.toggle(item.id)"
          />
        </div>
      </section>

      <section class="space-y-4">
        <h2 class="text-[18px] font-semibold text-[#111827]">
          已选新闻
        </h2>
        <NCard class="rounded-[12px]">
          <EmptyState
            v-if="!newsStore.selectedItems.length"
            title="还没有选择新闻"
            description="从左侧列表中选择一个或多个新闻"
          />
          <ul
            v-else
            class="space-y-3"
          >
            <li
              v-for="item in newsStore.selectedItems"
              :key="item.id"
              class="rounded-[8px] bg-[#F9FAFB] px-3 py-3 text-sm text-[#374151]"
            >
              {{ item.title }}
            </li>
          </ul>

          <NButton
            type="primary"
            block
            class="mt-4"
            :disabled="!newsStore.selectedItems.length"
            :loading="newsStore.creating"
            @click="handleNext"
          >
            下一步：进入 AI 创作
          </NButton>
        </NCard>
      </section>
    </div>
  </PageContainer>
</template>
