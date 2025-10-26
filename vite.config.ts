import path from 'path';
import { defineConfig, loadEnv, UserConfig } from 'vite';
import react from '@vitejs/plugin-react';

export const commonConfig: UserConfig = {
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  }
};

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      ...commonConfig,
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
    };
});
