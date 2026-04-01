<script setup lang="ts">
import { onMounted } from 'vue';
import PageContainer from '../../components/common/PageContainer.vue';
import EmptyState from '../../components/common/EmptyState.vue';
import ListSkeleton from '../../components/common/ListSkeleton.vue';
import VideoCard from '../../components/cards/VideoCard.vue';
import { useLibraryStore } from '../../stores/library';
import { useUiStore } from '../../stores/ui';

const libraryStore = useLibraryStore();
const uiStore = useUiStore();

async function handleDelete(videoId: string) {
  const accepted = await uiStore.confirm({
    title: '确认删除成品',
    content: '删除后不可恢复，是否继续？',
  });

  if (!accepted) {
    return;
  }

  await libraryStore.remove(videoId);
}

function handlePreview() {
  return;
}

function handleDownload() {
  return;
}

onMounted(() => {
  void libraryStore.load();
});
</script>

<template>
  <PageContainer
    title="成品库"
    description="集中查看已生成视频，支持预览、下载和删除"
  >
    <ListSkeleton
      v-if="libraryStore.loading"
      :rows="5"
    />

    <EmptyState
      v-else-if="!libraryStore.items.length"
      title="还没有成品视频"
      description="视频生成成功后，结果会自动沉淀到成品库"
    />

    <div
      v-else
      class="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
    >
      <VideoCard
        v-for="item in libraryStore.items"
        :key="item.id"
        :video="item"
        @preview="handlePreview"
        @download="handleDownload"
        @delete="handleDelete"
      />
    </div>
  </PageContainer>
</template>
