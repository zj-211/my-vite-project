import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { viteMockServe } from 'vite-plugin-mock'

// 🚀 后端服务器地址（请确保和你的 Django 后端 IP 一致）
const backendUrl = 'http://192.168.171.223:8080'

export default defineConfig({
  plugins: [
    vue(),
    viteMockServe({
      mockPath: 'mock',
      localEnabled: false, // ❌ 关闭 mock，防止和真实接口冲突
      prodEnabled: false,
      injectCode: `
        import { setupProdMockServer } from './mock/mockProdServer';
        setupProdMockServer();
      `,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  publicDir: 'public',
  json: {
    stringify: false,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    sourcemap: false,
    minify: 'terser',
    chunkSizeWarningLimit: 1000,
  },
  server: {
    host: '0.0.0.0', // ✅ 允许局域网访问
    port: 5174, // ✅ 前端端口
    proxy: {
      '/api': {
        target: backendUrl, // ✅ 代理到你的 Django 服务
        changeOrigin: true,
        //rewrite: (path) => path.replace(/^\/api/, ''), // ✅ 自动去掉 /api 前缀
      },
    },
  },
})
