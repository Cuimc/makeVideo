<script setup lang="ts">
import {
  NConfigProvider,
  NDialogProvider,
  NMessageProvider,
  NNotificationProvider,
} from 'naive-ui';
import { appThemeOverrides } from './styles/theme';
</script>

<template>
  <NConfigProvider :theme-overrides="appThemeOverrides">
    <NNotificationProvider>
      <NDialogProvider>
        <NMessageProvider>
          <RouterView />
        </NMessageProvider>
      </NDialogProvider>
    </NNotificationProvider>
  </NConfigProvider>
</template>
