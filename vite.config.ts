
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  return {
    plugins: [react()],
    base: '/kiki4623.github.io/',
    define: {
      // 同時檢查 Vite 載入的變數與 Node 環境變數
      'process.env.API_KEY': JSON.stringify(process.env.VITE_API_KEY || env.VITE_API_KEY || env.API_KEY || ""),
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
        },
      },
    }
  };
});
