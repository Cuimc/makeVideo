<script setup lang="ts">
import { NForm, NFormItem, NInput, NInputNumber, NSelect } from 'naive-ui';
import type { ProjectCreativeParams } from '@make-video/shared';

const props = defineProps<{
  modelValue: ProjectCreativeParams;
}>();

const emit = defineEmits<{
  'update:modelValue': [ProjectCreativeParams];
}>();

const videoTypeOptions = [
  { label: '口播解读', value: '口播解读' },
  { label: '热点快讯', value: '热点快讯' },
  { label: '深度分析', value: '深度分析' },
];

const styleOptions = [
  { label: '专业理性', value: '专业理性' },
  { label: '观点表达', value: '观点表达' },
  { label: '故事化叙事', value: '故事化叙事' },
];

const platformOptions = [
  { label: '抖音', value: '抖音' },
  { label: '视频号', value: '视频号' },
  { label: 'B 站', value: 'B 站' },
];

function updateField<Key extends keyof ProjectCreativeParams>(
  key: Key,
  value: ProjectCreativeParams[Key],
) {
  emit('update:modelValue', {
    ...props.modelValue,
    [key]: value,
  });
}
</script>

<template>
  <NForm
    label-placement="top"
    class="grid gap-4 md:grid-cols-2"
  >
    <NFormItem label="视频类型">
      <NSelect
        :value="modelValue.videoType"
        :options="videoTypeOptions"
        @update:value="(value) => updateField('videoType', value ?? '')"
      />
    </NFormItem>

    <NFormItem label="内容风格">
      <NSelect
        :value="modelValue.style"
        :options="styleOptions"
        @update:value="(value) => updateField('style', value ?? '')"
      />
    </NFormItem>

    <NFormItem label="发布平台">
      <NSelect
        :value="modelValue.platform"
        :options="platformOptions"
        @update:value="(value) => updateField('platform', value ?? '')"
      />
    </NFormItem>

    <NFormItem label="时长（秒）">
      <NInputNumber
        :value="modelValue.durationSeconds"
        :min="15"
        :step="15"
        class="w-full"
        @update:value="(value) => updateField('durationSeconds', value ?? 60)"
      />
    </NFormItem>

    <NFormItem
      label="目标人群"
      class="md:col-span-2"
    >
      <NInput
        :value="modelValue.targetAudience"
        placeholder="例如：银发经济从业者、短视频运营人员"
        @update:value="(value) => updateField('targetAudience', value)"
      />
    </NFormItem>
  </NForm>
</template>
