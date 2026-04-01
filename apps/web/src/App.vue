<script setup lang="ts">
import {
  NConfigProvider,
  NDialogProvider,
  NMessageProvider,
  NNotificationProvider,
} from 'naive-ui';
import DeleteConfirmDialog from './components/common/DeleteConfirmDialog.vue';
import { appThemeOverrides } from './styles/theme';
</script>

<template>
  <NConfigProvider :theme-overrides="appThemeOverrides">
    <NNotificationProvider>
      <NDialogProvider>
        <NMessageProvider>
          <RouterView />
          <DeleteConfirmDialog />
        </NMessageProvider>
      </NDialogProvider>
    </NNotificationProvider>
  </NConfigProvider>
</template>
