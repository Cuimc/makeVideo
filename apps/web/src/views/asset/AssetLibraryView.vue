<script setup lang="ts">
import { NButton, NCard } from 'naive-ui';
import { onMounted } from 'vue';
import PageContainer from '../../components/common/PageContainer.vue';
import EmptyState from '../../components/common/EmptyState.vue';
import FileUploadTrigger from '../../components/common/FileUploadTrigger.vue';
import ListSkeleton from '../../components/common/ListSkeleton.vue';
import { useAssetStore } from '../../stores/asset';

const assetStore = useAssetStore();

async function handleSelect(file: globalThis.File | null) {
  if (!file) {
    return;
  }

  await assetStore.uploadImage(file);
}

onMounted(() => {
  void assetStore.load();
});
</script>

<template>
  <PageContainer
    title="素材库"
    description="统一管理参考图片，供 AI 创作页和视频生成页复用"
  >
    <div class="flex items-center justify-between">
      <FileUploadTrigger
        button-text="上传参考图"
        accept="image/*"
        :loading="assetStore.uploading"
        @select="handleSelect"
      />
    </div>

    <ListSkeleton
      v-if="assetStore.loading"
      :rows="5"
      class="mt-6"
    />

    <EmptyState
      v-else-if="!assetStore.items.length"
      class="mt-6"
      title="还没有参考图片"
      description="上传后可在 AI 创作页和视频生成页中快速复用"
    />

    <div
      v-else
      class="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3"
    >
      <NCard
        v-for="item in assetStore.items"
        :key="item.id"
        class="rounded-[12px]"
      >
        <div class="space-y-4">
          <div
            class="h-40 rounded-[10px] bg-[#E5E7EB] bg-cover bg-center"
            :style="{ backgroundImage: `url(${item.url})` }"
          />

          <div>
            <div class="text-base font-semibold text-[#111827]">
              {{ item.name }}
            </div>
            <p class="mt-1 text-sm text-[#6B7280]">
              上传时间：{{ item.createdAt }}
            </p>
            <p class="mt-1 text-sm text-[#9CA3AF]">
              文件大小：{{ item.size }} bytes
            </p>
          </div>

          <div class="flex items-center gap-3">
            <NButton
              secondary
              size="small"
            >
              选择素材
            </NButton>
            <NButton
              text
              size="small"
              type="error"
              :loading="assetStore.removingIds.includes(item.id)"
              @click="assetStore.remove(item.id)"
            >
              删除
            </NButton>
          </div>
        </div>
      </NCard>
    </div>
  </PageContainer>
</template>
