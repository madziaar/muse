/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import { commonConfig } from './vite.config';

export default defineConfig({
  ...commonConfig,
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
  },
});
