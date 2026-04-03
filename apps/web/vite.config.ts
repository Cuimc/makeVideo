import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import UnoCSS from 'unocss/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const proxyTarget =
    env.VITE_API_PROXY_TARGET ||
    env.VITE_API_BASE_URL ||
    'http://bot-api.nibbly.cn';

  return {
    plugins: [vue(), UnoCSS()],
    server: {
      host: '127.0.0.1',
      port: 5173,
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
        },
        '/docs': {
          target: proxyTarget,
          changeOrigin: true,
        },
        '/docs-json': {
          target: proxyTarget,
          changeOrigin: true,
        },
      },
    },
  };
});
