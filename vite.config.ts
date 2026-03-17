import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    // 代码分割策略
    rollupOptions: {
      output: {
        manualChunks(id) {
          // React 核心库
          if (id.includes('react') || id.includes('react-dom')) {
            return 'react-vendor'
          }
          // 其他 node_modules
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        },
      },
    },
    // 启用 CSS 代码分割
    cssCodeSplit: true,
    // 生成 sourcemap
    sourcemap: false,
    // 分块大小警告阈值
    chunkSizeWarningLimit: 500,
    // 目标浏览器
    target: 'es2015',
  },
  // 依赖优化
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
})
