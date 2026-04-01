<script setup lang="ts">
import { computed } from 'vue';
import { NInput } from 'naive-ui';

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [string];
}>();

const wordCount = computed(() => props.modelValue.trim().length);
</script>

<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between text-sm text-[#6B7280]">
      <span>支持直接编辑 AI 生成的脚本草稿</span>
      <span>当前字数 {{ wordCount }}</span>
    </div>

    <NInput
      type="textarea"
      :value="modelValue"
      :autosize="{ minRows: 12, maxRows: 18 }"
      placeholder="点击“生成脚本”后在这里查看和编辑内容"
      @update:value="(value) => emit('update:modelValue', value)"
    />
  </div>
</template>
