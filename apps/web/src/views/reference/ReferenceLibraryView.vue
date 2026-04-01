<script setup lang="ts">
import { NButton, NCard, NTag } from 'naive-ui';
import { onMounted } from 'vue';
import PageContainer from '../../components/common/PageContainer.vue';
import EmptyState from '../../components/common/EmptyState.vue';
import FileUploadTrigger from '../../components/common/FileUploadTrigger.vue';
import ListSkeleton from '../../components/common/ListSkeleton.vue';
import StatusTag from '../../components/common/StatusTag.vue';
import { useReferenceStore } from '../../stores/reference';

const referenceStore = useReferenceStore();

async function handleSelect(file: globalThis.File | null) {
  if (!file) {
    return;
  }

  await referenceStore.uploadVideo(file);
}

onMounted(() => {
  void referenceStore.load();
});
</script>

<template>
  <PageContainer
    title="脚本参考库"
    description="管理参考视频分析结果，并在 AI 创作页中选择复用"
  >
    <NCard class="rounded-[12px]">
      <div class="flex items-center justify-between">
        <div>
          <div class="text-base font-semibold text-[#111827]">
            上传参考视频
          </div>
          <p class="mt-1 text-sm text-[#6B7280]">
            上传后将生成脚本结构分析结果，供后续创作调用
          </p>
        </div>

        <FileUploadTrigger
          button-text="上传参考视频"
          accept="video/*"
          :loading="referenceStore.uploading"
          @select="handleSelect"
        />
      </div>
    </NCard>

    <ListSkeleton
      v-if="referenceStore.loading"
      :rows="5"
      class="mt-6"
    />

    <EmptyState
      v-else-if="!referenceStore.items.length"
      class="mt-6"
      title="还没有参考分析结果"
      description="上传参考视频后，这里会沉淀可复用的脚本与分镜参考"
    />

    <div
      v-else
      class="mt-6 space-y-4"
    >
      <NCard
        v-for="item in referenceStore.items"
        :key="item.id"
        class="rounded-[12px]"
      >
        <div class="space-y-4">
          <div class="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div class="text-base font-semibold text-[#111827]">
                {{ item.title }}
              </div>
              <p class="mt-1 text-sm text-[#6B7280]">
                主题：{{ item.theme }}
              </p>
            </div>

            <div class="text-sm text-[#4B5563]">
              分析状态：
              <StatusTag
                category="reference"
                :status="item.status"
              />
            </div>
          </div>

          <div class="grid gap-4 text-sm text-[#374151] md:grid-cols-2">
            <div>
              <div class="font-medium text-[#111827]">
                结构摘要
              </div>
              <p class="mt-1 leading-[1.7]">
                {{ item.structureSummary }}
              </p>
            </div>

            <div>
              <div class="font-medium text-[#111827]">
                脚本摘要
              </div>
              <p class="mt-1 leading-[1.7]">
                {{ item.scriptSummary }}
              </p>
            </div>

            <div class="md:col-span-2">
              <div class="font-medium text-[#111827]">
                分镜摘要
              </div>
              <p class="mt-1 leading-[1.7]">
                {{ item.storyboardSummary }}
              </p>
            </div>
          </div>

          <div class="flex flex-wrap gap-2">
            <NTag
              v-for="scene in item.applicableScenes"
              :key="scene"
              round
              :bordered="false"
              type="info"
            >
              {{ scene }}
            </NTag>
          </div>

          <div class="flex items-center gap-3">
            <NButton
              secondary
              size="small"
            >
              查看详情
            </NButton>
            <NButton
              text
              size="small"
              type="error"
              :loading="referenceStore.removingIds.includes(item.id)"
              @click="referenceStore.remove(item.id)"
            >
              删除
            </NButton>
          </div>
        </div>
      </NCard>
    </div>
  </PageContainer>
</template>
