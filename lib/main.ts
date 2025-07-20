import { createProxyMiddleware } from 'http-proxy-middleware'
import express from 'express'
import http from 'http'
import { Plugin } from 'vite'
import fs from 'fs'
import path from 'path'

const file = path.join(process.cwd(), '_catch.json')
// 设置
const setCache = (key: string, value: string) => {
  let cache = fs.existsSync(file)
    ? JSON.parse(fs.readFileSync(file).toString())
    : {}
  cache[key] = value
  fs.writeFileSync(file, JSON.stringify(cache, null, 2))
}

// c
const getCache = (key?: string) => {
  if (!fs.existsSync(file)) return null
  const cache = JSON.parse(fs.readFileSync(file).toString())
  return key ? cache[key] || null : cache
}
const getLastKey = () => {
  if (!fs.existsSync(file)) return null
  const cache = JSON.parse(fs.readFileSync(file, 'utf-8'))

  const keys = Object.keys(cache)
  return keys.length ? keys[keys.length - 1] : null
}
const removeKey = (key: string) => {
  if (!fs.existsSync(file)) return false

  const cache = JSON.parse(fs.readFileSync(file, 'utf-8'))

  if (!(key in cache)) return false // key 不存在，返回 false

  delete cache[key] // 删除 key

  fs.writeFileSync(file, JSON.stringify(cache, null, 2), 'utf-8') // 重新写入文件

  return true // 删除成功
}

export interface ProxyConfig {
  pathFilter: string
  target: string
  changeOrigin?: boolean
  pathRewrite?: Record<string, string>
}

export default function uniViteStaticProxy({
  port = 3000,
  staticPath = '',
  proxyConfigs = [] as ProxyConfig[],
}): Plugin {
  let app = express()
  let server: http.Server
  return {
    name: 'uni-vite-static-proxy',
    async configResolved(): Promise<void> {
      const lastKey = getLastKey()

      if (lastKey && getCache(lastKey) === 'open') {
        return
      }

      // // 静态资源托管
      if (staticPath) {
        app.use(express.static(staticPath))
      }

      // 配置多个代理
      proxyConfigs.forEach(({ pathFilter, target, pathRewrite }) => {
        app.use(
          pathFilter,
          createProxyMiddleware({
            target,
            changeOrigin: true,
            pathRewrite: pathRewrite || {},
          })
        )
      })

      const key = Date.now().toString()
      try {
        // 监听端口
        server = app.listen(port, () => {
          setCache(key, 'open')
          console.log(`Express server running on port ${port}`)
        })
      } catch (e) {
        console.log(e)
      }

      server.on('close', () => {
        console.log('Express server close ')
        removeKey(key)
      })

      server.on('error', (x: any) => {
        console.log(x)
      })

      process.on('SIGINT', () => {
        if (server) {
          server.close()
          removeKey(key)
          process.exit()
        }
      })
      return
    },
  }
}
