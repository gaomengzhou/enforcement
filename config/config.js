/* eslint-disable no-console */
/* eslint-disable eqeqeq */
/* eslint-disable no-nested-ternary */
import os from 'os';
import defaultSettings from '../src/defaultSettings';
import webpackPlugin from './plugin.config';
import pageRoutes from './router.config';

const ipAndPort = 'http://58.213.107.106:28080'
// process.env.environment == 'production'
//   ? 'http://58.213.107.106:28080'
//   : process.env.environment == 'test'
//     ? 'http://10.110.200.48:8080'
//     : 'http://192.168.3.147:8080'
console.log('********当前所处环境:', ipAndPort, '***********');
const plugins = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      targets: {
        ie: 11,
      },
      locale: {
        enable: true, // default false
        default: 'zh-CN', // default zh-CN
        baseNavigator: false, // default true, when it is true, will use `navigator.language` overwrite default
      },
      dynamicImport: {
        loadingComponent: './components/PageLoading/index',
      },
      ...(!process.env.TEST && os.platform() === 'darwin'
        ? {
          dll: {
            include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
            exclude: ['@babel/runtime', 'check-prettier'],
          },
        }
        : {}),
    },
  ],
];

// judge add ga
if (process.env.APP_TYPE === 'site') {
  plugins.push([
    'umi-plugin-ga',
    {
      code: 'UA-72788897-6',
    },
  ]);
}

export default {
  // add for transfer to umi
  plugins,
  targets: {
    ie: 11,
  },
  // context:{
  //   a:123
  // },
  define: {
    APP_TYPE: process.env.APP_TYPE || '',
  },
  // 路由配置
  routes: pageRoutes,
  // Theme for antd
  // https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,
  },
  externals: {
    '@antv/data-set': 'DataSet',
  },
  proxy: {
    '/services/': {
      target: ipAndPort,
      changeOrigin: true,
      pathRewrite: { '^/server': '' },
    },
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (context, localIdentName, localName) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }
      const match = context.resourcePath.match(/src(.*)/);
      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = antdProPath
          .split('/')
          .map(a => a.replace(/([A-Z])/g, '-$1'))
          .map(a => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }
      return localName;
    },
  },
  manifest: {
    basePath: '/',
  },
  history: 'hash',
  base: '/workorderweb/',
  //   outputPath:'../../../workorderweb',
  publicPath: `${ipAndPort}/workorderweb/`,
  cssPublicPath: `${ipAndPort}/workorderweb/`,
  runtimePublicPath: true,
  chainWebpack: webpackPlugin,
};
