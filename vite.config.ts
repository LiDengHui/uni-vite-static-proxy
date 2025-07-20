import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    ssr: true,
    lib: {
      entry: './lib/main.ts',
      name: 'index',
      fileName: 'index',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['express', 'http-proxy-middleware', 'fs', 'path'], // 指定不打包的模块
      output: {
        globals: {
          'http-proxy-middleware': 'httpProxyMiddleware',
          express: 'express',
          fs: 'fs',
          path: 'path',
        },
      },
    },
  },
  plugins: [dts()],
})
