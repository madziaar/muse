import path from 'path';
import { defineConfig, loadEnv, UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export const commonConfig: UserConfig = {
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Riffusion Muse',
        short_name: 'Muse',
        description: 'A musical idea generator powered by AI',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    ...commonConfig,
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
  };
});
