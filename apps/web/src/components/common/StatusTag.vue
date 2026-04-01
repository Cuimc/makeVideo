<script setup lang="ts">
import { computed } from 'vue';
import { NTag } from 'naive-ui';
import {
  projectStatusMap,
  referenceStatusMap,
  taskStatusMap,
  toneToTagType,
} from '../../constants/status';

const props = defineProps<{
  category: 'project' | 'task' | 'reference';
  status: string;
}>();

const current = computed(() => {
  if (props.category === 'project') {
    return projectStatusMap[props.status as keyof typeof projectStatusMap];
  }

  if (props.category === 'task') {
    return taskStatusMap[props.status as keyof typeof taskStatusMap];
  }

  return referenceStatusMap[props.status as keyof typeof referenceStatusMap];
});
</script>

<template>
  <NTag
    :type="toneToTagType[current?.tone ?? 'default']"
    :bordered="false"
    size="small"
    round
  >
    {{ current?.label ?? status }}
  </NTag>
</template>
