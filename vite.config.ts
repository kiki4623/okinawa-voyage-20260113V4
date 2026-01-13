import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 根據當前模式（development 或 production）載入環境變數
  const env = loadEnv(mode, process.cwd(), '');

  return {
    // 確保 base 路徑與您的 GitHub 儲存庫名稱一致
    base: '/okinawa-voyage-20260113V4/',
    
    plugins: [react()],

    define: {
      // 建議優先使用 Vite 的標準變數命名 VITE_API_KEY
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY || env.API_KEY || ""),
    },

    build: {
      outDir: 'dist',
      sourcemap: false,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true, // 生產環境移除 console，保護 API Key 資訊
        },
      },
    },
  };
});
