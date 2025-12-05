import { defineConfig as defineTestConfig, mergeConfig } from 'vitest/config';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';

const base: string = '/front_7th_chapter3-2/';

export default mergeConfig(
  defineConfig({
    base,
    plugins: [react()],
    build: {
      rollupOptions: {
        input: {
          advanced: resolve(__dirname, 'index.advanced.html'),
        },
      },
    },
  }),
  defineTestConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.ts',
    },
  }),
);
