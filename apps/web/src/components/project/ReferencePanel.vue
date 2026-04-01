<script setup lang="ts">
import { NButton, NTag } from 'naive-ui';
import EmptyState from '../common/EmptyState.vue';

withDefaults(
  defineProps<{
    imageIds?: string[];
    videoIds?: string[];
    referenceIds?: string[];
  }>(),
  {
    imageIds: () => [],
    videoIds: () => [],
    referenceIds: () => [],
  },
);
</script>

<template>
  <div class="space-y-5">
    <div class="rounded-[12px] bg-[#F9FAFB] px-4 py-4">
      <p class="text-sm text-[#4B5563]">
        当前阶段先展示已选参考内容，后续在素材库和脚本参考库页面接入真实选择能力。
      </p>
    </div>

    <section class="space-y-3">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-semibold text-[#111827]">
          参考图片
        </h3>
        <NButton
          quaternary
          type="primary"
        >
          去素材库选图
        </NButton>
      </div>

      <div
        v-if="imageIds.length"
        class="flex flex-wrap gap-2"
      >
        <NTag
          v-for="item in imageIds"
          :key="item"
          round
          :bordered="false"
        >
          {{ item }}
        </NTag>
      </div>
      <EmptyState
        v-else
        title="还没有选择图片"
        description="后续可从素材库选择参考图辅助创作"
      />
    </section>

    <section class="space-y-3">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-semibold text-[#111827]">
          参考视频
        </h3>
        <NButton
          quaternary
          type="primary"
        >
          上传参考视频
        </NButton>
      </div>

      <div
        v-if="videoIds.length"
        class="flex flex-wrap gap-2"
      >
        <NTag
          v-for="item in videoIds"
          :key="item"
          round
          :bordered="false"
          type="info"
        >
          {{ item }}
        </NTag>
      </div>
      <EmptyState
        v-else
        title="还没有上传参考视频"
        description="后续可分析参考视频结构并沉淀到脚本参考库"
      />
    </section>

    <section class="space-y-3">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-semibold text-[#111827]">
          脚本参考结果
        </h3>
        <NButton
          quaternary
          type="primary"
        >
          去脚本参考库
        </NButton>
      </div>

      <div
        v-if="referenceIds.length"
        class="flex flex-wrap gap-2"
      >
        <NTag
          v-for="item in referenceIds"
          :key="item"
          round
          :bordered="false"
          type="success"
        >
          {{ item }}
        </NTag>
      </div>
      <EmptyState
        v-else
        title="还没有引用脚本参考"
        description="后续可从脚本参考库选择分析结果辅助创作"
      />
    </section>
  </div>
</template>
