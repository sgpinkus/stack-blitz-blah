import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import unpluginTypia from '@ryoppippi/unplugin-typia/vite';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  return {
    plugins: [
      vue(),
      unpluginTypia({}),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@package': fileURLToPath(new URL('./package.json', import.meta.url)),
      },
    },
  };
});
