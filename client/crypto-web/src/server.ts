import sirv from 'sirv';
import polka from 'polka';
import compression from 'compression';
import * as sapper from '@sapper/server';
import { createProxyMiddleware as proxy } from 'http-proxy-middleware';

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

polka()
  .use(
    '/api',
    proxy({
      changeOrigin: true,
      target: process.env.PROXY_API_URL || 'http://localhost:3000',
    })
  )
  .use(
    compression({ threshold: 0 }),
    sirv('static', { dev }),
    sapper.middleware()
  )
  .listen(PORT, (err) => {
    if (err) console.log('error', err);
  });
