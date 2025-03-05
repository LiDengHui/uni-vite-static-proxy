import {defineConfig} from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
    build: {
        lib: {
            entry: './lib/main.ts',
            name: 'index',
            fileName: 'index',
        },
        target: 'node14',
        rollupOptions: {
            external: ['express', 'http-proxy-middleware','fs', 'path'], // 指定不打包的模块
            output: {
                globals: {
                    'http-proxy-middleware': 'httpProxyMiddleware',
                    'express': 'express'
                }
            }
        },
    },
    plugins: [dts()],
})
