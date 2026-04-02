<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { FormInst, FormRules } from 'naive-ui';
import {
  NAlert,
  NButton,
  NCard,
  NForm,
  NFormItem,
  NInput,
  useMessage,
} from 'naive-ui';
import { useRouter } from 'vue-router';
import AuthLayout from '../../layouts/AuthLayout.vue';
import { useAuthStore } from '../../stores/auth';

interface LoginFormModel {
  phone: string;
  code: string;
}

const router = useRouter();
const message = useMessage();
const authStore = useAuthStore();
const formRef = ref<FormInst | null>(null);
const submitting = ref(false);
const devLoginEnabled = import.meta.env.DEV;

const form = reactive<LoginFormModel>({
  phone: '',
  code: '',
});

const rules: FormRules = {
  phone: [
    {
      required: true,
      message: '请输入手机号',
      trigger: ['input', 'blur'],
    },
  ],
  code: [
    {
      required: true,
      message: '请输入验证码',
      trigger: ['input', 'blur'],
    },
  ],
};

async function handleSubmit() {
  try {
    await formRef.value?.validate();
    submitting.value = true;
    await authStore.login({
      phone: form.phone,
      code: form.code,
    });
    await router.replace({
      name: 'dashboard',
    });
  } catch (error) {
    if (error instanceof Error && error.message) {
      message.error(error.message);
    }
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <AuthLayout>
    <NCard
      title="手机号登录"
      class="rounded-[12px]"
    >
      <NForm
        ref="formRef"
        :model="form"
        :rules="rules"
        label-placement="top"
      >
        <NAlert
          v-if="devLoginEnabled"
          type="info"
          class="mb-4"
        >
          开发调试可直接使用手机号 13800138000 和验证码 123456 登录，无需先发送验证码。
        </NAlert>

        <NFormItem
          label="手机号"
          path="phone"
        >
          <NInput
            v-model:value="form.phone"
            placeholder="请输入手机号"
          />
        </NFormItem>

        <NFormItem
          label="验证码"
          path="code"
        >
          <div class="flex w-full gap-3">
            <NInput
              v-model:value="form.code"
              placeholder="请输入验证码"
            />
            <NButton secondary>
              发送验证码
            </NButton>
          </div>
        </NFormItem>

        <NButton
          type="primary"
          block
          :loading="submitting"
          @click="handleSubmit"
        >
          登录并进入工作台
        </NButton>
      </NForm>
    </NCard>
  </AuthLayout>
</template>
