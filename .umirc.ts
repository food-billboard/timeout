import { defineConfig } from 'umi';
import 'dotenv/config'

// const API_DOMAIN = `http://${process.env.RASPBERRY_IP}`;
const API_DOMAIN = 'http://localhost:4000';

export default defineConfig({
  hash: true,
  history: {
    type: 'hash',
  },
  ...(process.env.REACT_APP_ENV === 'prod' ? {
    // base: '/api/backend/eat-what/',
    base: '/',
    publicPath: '/api/backend/score/',
  } : {}),
  define: {
    'process.env.DEFAULT_CHILD_ID': process.env.DEFAULT_CHILD_ID,
    'process.env.REACT_APP_ENV': process.env.REACT_APP_ENV,
    'process.env.REQUEST_API': process.env.REQUEST_API,
    'process.env.DEFAULT_FATHER_ID': process.env.DEFAULT_FATHER_ID,
    'process.env.DEFAULT_MATHER_ID': process.env.DEFAULT_MATHER_ID,
    'process.env.DEFAULT_GRANDPA_ID': process.env.DEFAULT_GRANDPA_ID,
    'process.env.DEFAULT_GRANDMA_ID': process.env.DEFAULT_GRANDMA_ID,
    'process.env.API_DOMAIN': API_DOMAIN,

    'process.env.MOCK_MOBILE': process.env.MOCK_MOBILE,
    'process.env.MOCK_PASSWORD': process.env.MOCK_PASSWORD,
    'process.env.MOCK_EMAIL': process.env.MOCK_EMAIL
  },
  routes: [
    { path: '/', component: '@/pages/Home/index' },
    { path: '/image-list', component: '@/pages/ImageList/index' },
    { path: '/event-detail', component: '@/pages/EventDetail/index' },
    { path: '/event-edit', component: '@/pages/EventEdit/index' },
    { path: '/image-edit', component: '@/pages/ImageEdit/index' },
    { path: '/image-delete', component: '@/pages/ImageDelete/index' },
    { path: '/image-detail', component: '@/pages/ImageDetail/index' },
  ],
  npmClient: 'yarn',
  scripts: [
    `
    (function (designWidth, base) {
      var resize = function () {
        document.documentElement.style.fontSize = (window.innerWidth / designWidth) * base + 'px'
      }
      resize()
      window.addEventListener('resize', resize)
    })(375, 10)
    `,
  ],
  proxy: process.env.REACT_APP_ENV === 'dev' ? {
    '/api/': {
      target: API_DOMAIN,
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  } : {
    '/api/': {
      target: API_DOMAIN,
      changeOrigin: true,
      pathRewrite: { '^/api/static': '/static' },
    },
  }
});
