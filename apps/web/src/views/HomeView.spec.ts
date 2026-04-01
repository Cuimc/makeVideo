import { createPinia } from 'pinia';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import HomeView from './HomeView.vue';

describe('HomeView', () => {
  it('renders the monorepo dashboard title', () => {
    const wrapper = mount(HomeView, {
      global: {
        plugins: [createPinia()],
      },
    });

    expect(wrapper.text()).toContain('Make Video Console');
    expect(wrapper.text()).toContain('前后端 Monorepo 已初始化');
  });
});
