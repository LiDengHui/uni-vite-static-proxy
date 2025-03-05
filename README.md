
# @dhlx/uni-vite-static-proxy

`@dhlx/uni-vite-static-proxy` is a Vite plugin that provides an easy way to serve static files and configure proxy middleware using Express. It also includes a caching mechanism to control server restart behavior.

## Features
- Static file serving using Express.
- Proxy middleware configuration to redirect requests to external targets.
- Caching and key management to control server restart behavior.
- Supports multiple proxy configurations.

## Installation

To install the plugin in your Vite project, run the following command:

```bash
npm install @dhlx/uni-vite-static-proxy --save-dev
```

or using `pnpm`:

```bash
pnpm add @dhlx/uni-vite-static-proxy --dev
```

## Usage

### Basic Usage

1. Import the plugin in your `vite.config.ts` or `vite.config.js` file:

```ts
import uniViteStaticProxy from '@dhlx/uni-vite-static-proxy';
```

2. Configure the plugin in the `plugins` array of your Vite config:

```ts
import { defineConfig } from 'vite';
import uniViteStaticProxy from '@dhlx/uni-vite-static-proxy';

export default defineConfig({
  plugins: [
    uniViteStaticProxy({
      port: 3000, // Port for the Express server
      staticPath: 'path/to/static/files', // Static files directory to be served
      proxyConfigs: [
        {
          pathFilter: '/api', // Path to match for the proxy
          target: 'https://api.example.com', // Target server for the proxy
          pathRewrite: {
            '^/api': '', // Optional: Rewrite paths before proxying
          },
        },
        // Add more proxy configurations as needed
      ],
    }),
  ],
});
```

### Configuration Options

- `port` (default: `3000`): The port on which the Express server will listen.
- `staticPath` (default: `''`): The path to the directory containing static files to serve. If provided, the plugin will serve these files using Express.
- `proxyConfigs` (default: `[]`): An array of objects for configuring proxy rules. Each object should have:
    - `pathFilter`: A string or regex for the path to match.
    - `target`: The target server URL where the requests should be proxied.
    - `pathRewrite` (optional): An object specifying path rewrite rules.

### Caching Mechanism

The plugin uses a caching file (`_catch.json`) to manage server restart behavior. It tracks the state of the server and prevents restarting if the server was previously opened. You can use the following functions to interact with the cache:

- `setCache(key: string, value: string)`: Sets a cache value for a given key.
- `getCache(key?: string)`: Gets the cache value for the given key or the entire cache if no key is provided.
- `getLastKey()`: Gets the last cache key used.
- `removeKey(key: string)`: Removes a cache key.

## Commands

### `npm run dev` or `vite`

When running the Vite development server, the plugin will automatically start the Express server for handling static files and proxies.

### Graceful Shutdown

The plugin supports graceful shutdown. When the Vite server is restarted or terminated, the Express server will also be closed.

### Handling Server Errors

If the Express server encounters an error, it will log the error message.

## Example

Here’s an example of a `vite.config.ts` file using the plugin:

```ts
import { defineConfig } from 'vite';
import uniViteStaticProxy from 'uni-vite-static-proxy';

export default defineConfig({
  plugins: [
    uniViteStaticProxy({
      port: 4000,
      staticPath: 'public',
      proxyConfigs: [
        {
          pathFilter: '/api',
          target: 'https://api.example.com',
        },
      ],
    }),
  ],
});
```

This configuration will start an Express server on port 4000, serve static files from the `public` directory, and proxy requests to `/api` to `https://api.example.com`.

## License

MIT License.
