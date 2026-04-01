<script setup lang="ts">
import { ref } from 'vue';
import { NButton } from 'naive-ui';

const props = withDefaults(
  defineProps<{
    buttonText: string;
    accept?: string;
    loading?: boolean;
  }>(),
  {
    accept: '*',
    loading: false,
  },
);

const emit = defineEmits<{
  select: [file: globalThis.File | null];
}>();

const inputRef = ref<globalThis.HTMLInputElement | null>(null);

function handleChoose() {
  inputRef.value?.click();
}

function handleChange(event: globalThis.Event) {
  const target = event.target as globalThis.HTMLInputElement;
  const file = target.files?.[0] ?? null;

  emit('select', file);

  if (target) {
    target.value = '';
  }
}
</script>

<template>
  <div>
    <input
      ref="inputRef"
      type="file"
      class="hidden"
      :accept="accept"
      @change="handleChange"
    >

    <NButton
      type="primary"
      :loading="loading"
      @click="handleChoose"
    >
      {{ props.buttonText }}
    </NButton>
  </div>
</template>
