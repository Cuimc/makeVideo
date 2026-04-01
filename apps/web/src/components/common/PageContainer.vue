<script setup lang="ts">
defineProps<{
  title: string;
  description?: string;
}>();
</script>

<template>
  <section class="space-y-6">
    <header class="flex items-start justify-between gap-4">
      <div>
        <h1 class="text-[24px] font-semibold leading-[1.3] text-[#111827]">
          {{ title }}
        </h1>
        <p
          v-if="description"
          class="mt-2 text-[13px] leading-[1.6] text-[#6B7280]"
        >
          {{ description }}
        </p>
      </div>
      <slot name="extra" />
    </header>
    <slot />
  </section>
</template>
