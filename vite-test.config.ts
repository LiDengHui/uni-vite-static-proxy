import {defineConfig} from 'vite'
import dts from 'vite-plugin-dts'
import uniViteStaticProxy from "./dist/index.js";

export default defineConfig({
    build: {
        lib: {
            entry: './lib/main.ts',
            name: 'index',
            fileName: 'index',
        },
    },
    plugins: [dts(), uniViteStaticProxy({
        port: 8000,
        staticPath: './public',
        proxyConfigs: [
            {
                pathFilter: '/api',
                target: 'http://localhost:8080',
                pathRewrite: {'^/api': ''}
            },
            {
                pathFilter: '/static',
                target: 'http://localhost:8000',
                pathRewrite: {'^/static': ''}
            }
        ]
    })],
    server: {}
})
