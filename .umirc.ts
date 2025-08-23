import { defineConfig } from 'umi';
import 'dotenv/config'

const API_DOMAIN = `http://${process.env.RASPBERRY_IP}`;
// const API_DOMAIN = 'http://localhost:4000';

export default defineConfig({
  plugins: ['umi-plugin-keep-alive'],
  hash: true,
  history: {
    type: 'hash',
  },
  ...(process.env.REACT_APP_ENV === 'prod' ? {
    // base: '/api/backend/eat-what/',
    base: '/',
    publicPath: '/api/backend/timeout/',
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
  // keepalive: [
  //   /image-list/, 
  //   /event-detail/,
  //   /image-detail/
  // ],
  routes: [
    { name: "首页", path: '/', component: '@/pages/Home/index', keepalive: true, },
    { name: "图片列表", path: '/image-list', component: '@/pages/ImageList/index', keepalive: true, },
    { name: "事件详情", path: '/event-detail', component: '@/pages/EventDetail/index', keepalive: true, },
    { path: '/event-edit', component: '@/pages/EventEdit/index' },
    { path: '/image-edit', component: '@/pages/ImageEdit/index' },
    { path: '/image-delete', component: '@/pages/ImageDelete/index' },
    { name: "图片详情", path: '/image-detail', component: '@/pages/ImageDetail/index', keepalive: true, },
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
