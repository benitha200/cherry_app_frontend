import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
  base: "/",
  plugins: [
    VitePWA({
      manifest: {
        name: 'CWS Transactions',
        short_name: 'Cws Transactions',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: './RwacofLogoCoulRVB.png',
            sizes: '192x192',
            type: 'image/png',
          },
        ],
      },
    }),
    react(),
    viteCompression({
      // options for compression, e.g. algorithm: 'gzip'
      algorithm: 'gzip', // or 'brotliCompress' for Brotli compression
      ext: '.gz', // file extension for the compressed files
    }),
  ],
  server: {
    host: '0.0.0.0',
  },
});
