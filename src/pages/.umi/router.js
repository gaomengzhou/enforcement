import React from 'react';
import {
  Router as DefaultRouter,
  Route,
  Switch,
  StaticRouter,
} from 'react-router-dom';
import dynamic from 'umi/dynamic';
import renderRoutes from 'umi/lib/renderRoutes';
import history from '@@/history';
import RendererWrapper0 from '/Users/gaomengzhou/project/enforcement/src/pages/.umi/LocaleWrapper.jsx';
import _dvaDynamic from 'dva/dynamic';

const Router = require('dva/router').routerRedux.ConnectedRouter;

const routes = [
  {
    path: '/user',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () => import('../../layouts/UserLayout'),
          LoadingComponent: require('/Users/gaomengzhou/project/enforcement/src/components/PageLoading/index')
            .default,
        })
      : require('../../layouts/UserLayout').default,
    routes: [
      {
        path: '/user',
        redirect: '/user/login',
        exact: true,
      },
      {
        path: '/user/login',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () => import('../User/Login'),
              LoadingComponent: require('/Users/gaomengzhou/project/enforcement/src/components/PageLoading/index')
                .default,
            })
          : require('../User/Login').default,
        exact: true,
      },
      {
        component: () =>
          React.createElement(
            require('/Users/gaomengzhou/project/enforcement/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
              .default,
            { pagesPath: 'src/pages', hasRoutesInConfig: true },
          ),
      },
    ],
  },
  {
    path: '/',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () => import('../../layouts/BasicLayout'),
          LoadingComponent: require('/Users/gaomengzhou/project/enforcement/src/components/PageLoading/index')
            .default,
        })
      : require('../../layouts/BasicLayout').default,
    Routes: [require('../Authorized').default],
    authority: ['admin', 'user'],
    routes: [
      {
        path: '/',
        redirect: '/user/login',
        exact: true,
      },
      {
        path: '/index/Home',
        name: 'index',
        icon: 'anticon-enforcement-shouye',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () => import('../Index/Home'),
              LoadingComponent: require('/Users/gaomengzhou/project/enforcement/src/components/PageLoading/index')
                .default,
            })
          : require('../Index/Home').default,
        authority: ['admin', '20901'],
        exact: true,
      },
      {
        path: '/workarchitecture/architecture',
        name: 'workarchitecture',
        icon: 'anticon-enforcement-leader',
        authority: ['admin', '20902'],
        routes: [
          {
            path: '/workarchitecture/architecture/img',
            name: 'img',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () => import('../WorkArchitecture/Architecture'),
                  LoadingComponent: require('/Users/gaomengzhou/project/enforcement/src/components/PageLoading/index')
                    .default,
                })
              : require('../WorkArchitecture/Architecture').default,
            exact: true,
          },
          {
            component: () =>
              React.createElement(
                require('/Users/gaomengzhou/project/enforcement/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                  .default,
                { pagesPath: 'src/pages', hasRoutesInConfig: true },
              ),
          },
        ],
      },
      {
        path: '/workOrder',
        name: 'workOrder',
        icon: 'anticon-enforcement-intelligent',
        routes: [
          {
            path: '/workOrder/intelligentize',
            name: 'intelligentize',
            routes: [
              {
                path: '/workOrder/intelligentize/timing',
                name: 'timing',
                hideChildrenInMenu: true,
                authority: ['admin', '20903'],
                routes: [
                  {
                    path: '/workOrder/intelligentize/timing',
                    name: 'list',
                    redirect: '/workOrder/Intelligentize/timing/list',
                    exact: true,
                  },
                  {
                    path: '/workOrder/intelligentize/timing/list',
                    component: __IS_BROWSER
                      ? _dvaDynamic({
                          app: require('@tmp/dva').getApp(),
                          models: () => [
                            import('/Users/gaomengzhou/project/enforcement/src/pages/Intelligentize/models/Complainmodels.js').then(
                              m => {
                                return {
                                  namespace: 'Complainmodels',
                                  ...m.default,
                                };
                              },
                            ),
                            import('/Users/gaomengzhou/project/enforcement/src/pages/Intelligentize/models/compmodels.js').then(
                              m => {
                                return {
                                  namespace: 'compmodels',
                                  ...m.default,
                                };
                              },
                            ),
                            import('/Users/gaomengzhou/project/enforcement/src/pages/Intelligentize/models/Inspectorsmodels.js').then(
                              m => {
                                return {
                                  namespace: 'Inspectorsmodels',
                                  ...m.default,
                                };
                              },
                            ),
                          ],
                          component: () =>
                            import('../Intelligentize/Timing/list'),
                          LoadingComponent: require('/Users/gaomengzhou/project/enforcement/src/components/PageLoading/index')
                            .default,
                        })
                      : require('../Intelligentize/Timing/list').default,
                    exact: true,
                  },
                  {
                    path: '/workOrder/intelligentize/timing/statistics',
                    component: __IS_BROWSER
                      ? _dvaDynamic({
                          app: require('@tmp/dva').getApp(),
                          models: () => [
                            import('/Users/gaomengzhou/project/enforcement/src/pages/Intelligentize/models/Complainmodels.js').then(
                              m => {
                                return {
                                  namespace: 'Complainmodels',
                                  ...m.default,
                                };
                              },
                            ),
                            import('/Users/gaomengzhou/project/enforcement/src/pages/Intelligentize/models/compmodels.js').then(
                              m => {
                                return {
                                  namespace: 'compmodels',
                                  ...m.default,
                                };
                              },
                            ),
                            import('/Users/gaomengzhou/project/enforcement/src/pages/Intelligentize/models/Inspectorsmodels.js').then(
                              m => {
                                return {
                                  namespace: 'Inspectorsmodels',
                                  ...m.default,
                                };
                              },
                            ),
                          ],
                          component: () =>
                            import('../Intelligentize/Timing/Statistics'),
                          LoadingComponent: require('/Users/gaomengzhou/project/enforcement/src/components/PageLoading/index')
                            .default,
                        })
                      : require('../Intelligentize/Timing/Statistics').default,
                    exact: true,
                  },
                  {
                    component: () =>
                      React.createElement(
                        require('/Users/gaomengzhou/project/enforcement/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                          .default,
                        { pagesPath: 'src/pages', hasRoutesInConfig: true },
                      ),
                  },
                ],
              },
              {
                path: '/workOrder/intelligentize/matching',
                name: 'matching',
                hideChildrenInMenu: true,
                authority: ['admin', '20904'],
                routes: [
                  {
                    path: '/workOrder/intelligentize/matching',
                    component: __IS_BROWSER
                      ? _dvaDynamic({
                          app: require('@tmp/dva').getApp(),
                          models: () => [
                            import('/Users/gaomengzhou/project/enforcement/src/pages/Intelligentize/models/Complainmodels.js').then(
                              m => {
                                return {
                                  namespace: 'Complainmodels',
                                  ...m.default,
                                };
                              },
                            ),
                            import('/Users/gaomengzhou/project/enforcement/src/pages/Intelligentize/models/compmodels.js').then(
                              m => {
                                return {
                                  namespace: 'compmodels',
                                  ...m.default,
                                };
                              },
                            ),
                            import('/Users/gaomengzhou/project/enforcement/src/pages/Intelligentize/models/Inspectorsmodels.js').then(
                              m => {
                                return {
                                  namespace: 'Inspectorsmodels',
                                  ...m.default,
                                };
                              },
                            ),
                          ],
                          component: () => import('../Intelligentize/Matching'),
                          LoadingComponent: require('/Users/gaomengzhou/project/enforcement/src/components/PageLoading/index')
                            .default,
                        })
                      : require('../Intelligentize/Matching').default,
                    exact: true,
                  },
                  {
                    path:
                      '/workOrder/intelligentize/matching/cityManagement/:id/:workOrderId/:check',
                    component: __IS_BROWSER
                      ? _dvaDynamic({
                          app: require('@tmp/dva').getApp(),
                          models: () => [
                            import('/Users/gaomengzhou/project/enforcement/src/pages/Intelligentize/models/Complainmodels.js').then(
                              m => {
                                return {
                                  namespace: 'Complainmodels',
                                  ...m.default,
                                };
                              },
                            ),
                            import('/Users/gaomengzhou/project/enforcement/src/pages/Intelligentize/models/compmodels.js').then(
                              m => {
                                return {
                                  namespace: 'compmodels',
                                  ...m.default,
                                };
                              },
                            ),
                            import('/Users/gaomengzhou/project/enforcement/src/pages/Intelligentize/models/Inspectorsmodels.js').then(
                              m => {
                                return {
                                  namespace: 'Inspectorsmodels',
                                  ...m.default,
                                };
                              },
                            ),
                          ],
                          component: () =>
                            import('../Intelligentize/CityManagement'),
                          LoadingComponent: require('/Users/gaomengzhou/project/enforcement/src/components/PageLoading/index')
                            .default,
                        })
                      : require('../Intelligentize/CityManagement').default,
                    exact: true,
                  },
                  {
                    path:
                      '/workOrder/intelligentize/matching/comprehensiveLawEnforcement/:id/:workOrderId/:check',
                    component: __IS_BROWSER
                      ? _dvaDynamic({
                          app: require('@tmp/dva').getApp(),
                          models: () => [
                            import('/Users/gaomengzhou/project/enforcement/src/pages/Intelligentize/models/Complainmodels.js').then(
                              m => {
                                return {
                                  namespace: 'Complainmodels',
                                  ...m.default,
                                };
                              },
                            ),
                            import('/Users/gaomengzhou/project/enforcement/src/pages/Intelligentize/models/compmodels.js').then(
                              m => {
                                return {
                                  namespace: 'compmodels',
                                  ...m.default,
                                };
                              },
                            ),
                            import('/Users/gaomengzhou/project/enforcement/src/pages/Intelligentize/models/Inspectorsmodels.js').then(
                              m => {
                                return {
                                  namespace: 'Inspectorsmodels',
                                  ...m.default,
                                };
                              },
                            ),
                          ],
                          component: () =>
                            import('../Intelligentize/ComprehensiveLawEnforcement'),
                          LoadingComponent: require('/Users/gaomengzhou/project/enforcement/src/components/PageLoading/index')
                            .default,
                        })
                      : require('../Intelligentize/ComprehensiveLawEnforcement')
                          .default,
                    exact: true,
                  },
                  {
                    path:
                      '/workOrder/intelligentize/matching/complaint/:id/:workOrderId/:check',
                    component: __IS_BROWSER
                      ? _dvaDynamic({
                          app: require('@tmp/dva').getApp(),
                          models: () => [
                            import('/Users/gaomengzhou/project/enforcement/src/pages/Intelligentize/models/Complainmodels.js').then(
                              m => {
                                return {
                                  namespace: 'Complainmodels',
                                  ...m.default,
                                };
                              },
                            ),
                            import('/Users/gaomengzhou/project/enforcement/src/pages/Intelligentize/models/compmodels.js').then(
                              m => {
                                return {
                                  namespace: 'compmodels',
                                  ...m.default,
                                };
                              },
                            ),
                            import('/Users/gaomengzhou/project/enforcement/src/pages/Intelligentize/models/Inspectorsmodels.js').then(
                              m => {
                                return {
                                  namespace: 'Inspectorsmodels',
                                  ...m.default,
                                };
                              },
                            ),
                          ],
                          component: () =>
                            import('../Intelligentize/Complaint'),
                          LoadingComponent: require('/Users/gaomengzhou/project/enforcement/src/components/PageLoading/index')
                            .default,
                        })
                      : require('../Intelligentize/Complaint').default,
                    exact: true,
                  },
                  {
                    component: () =>
                      React.createElement(
                        require('/Users/gaomengzhou/project/enforcement/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                          .default,
                        { pagesPath: 'src/pages', hasRoutesInConfig: true },
                      ),
                  },
                ],
              },
              {
                path: '/workOrder/intelligentize/Statistics',
                name: 'statistics',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import('/Users/gaomengzhou/project/enforcement/src/pages/Intelligentize/models/Complainmodels.js').then(
                          m => {
                            return {
                              namespace: 'Complainmodels',
                              ...m.default,
                            };
                          },
                        ),
                        import('/Users/gaomengzhou/project/enforcement/src/pages/Intelligentize/models/compmodels.js').then(
                          m => {
                            return { namespace: 'compmodels', ...m.default };
                          },
                        ),
                        import('/Users/gaomengzhou/project/enforcement/src/pages/Intelligentize/models/Inspectorsmodels.js').then(
                          m => {
                            return {
                              namespace: 'Inspectorsmodels',
                              ...m.default,
                            };
                          },
                        ),
                      ],
                      component: () => import('../Intelligentize/Statistics'),
                      LoadingComponent: require('/Users/gaomengzhou/project/enforcement/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../Intelligentize/Statistics').default,
                authority: ['admin', '20905'],
                exact: true,
              },
              {
                component: () =>
                  React.createElement(
                    require('/Users/gaomengzhou/project/enforcement/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                      .default,
                    { pagesPath: 'src/pages', hasRoutesInConfig: true },
                  ),
              },
            ],
          },
          {
            path: '/workOrder/leader',
            name: 'leader',
            authority: ['admin', '20906'],
            routes: [
              {
                path: '/workOrder/leader',
                name: 'leader',
                hideChildrenInMenu: true,
                routes: [
                  {
                    path: '/workOrder/leader',
                    name: 'list',
                    redirect: '/workOrder/leader/list',
                    exact: true,
                  },
                  {
                    path: '/workOrder/leader/list',
                    component: __IS_BROWSER
                      ? _dvaDynamic({
                          app: require('@tmp/dva').getApp(),
                          models: () => [
                            import('/Users/gaomengzhou/project/enforcement/src/pages/Leader/models/Leadermodels.js').then(
                              m => {
                                return {
                                  namespace: 'Leadermodels',
                                  ...m.default,
                                };
                              },
                            ),
                          ],
                          component: () => import('../Leader/List'),
                          LoadingComponent: require('/Users/gaomengzhou/project/enforcement/src/components/PageLoading/index')
                            .default,
                        })
                      : require('../Leader/List').default,
                    exact: true,
                  },
                  {
                    path: '/workOrder/leader/add',
                    component: __IS_BROWSER
                      ? _dvaDynamic({
                          app: require('@tmp/dva').getApp(),
                          models: () => [
                            import('/Users/gaomengzhou/project/enforcement/src/pages/Leader/models/Leadermodels.js').then(
                              m => {
                                return {
                                  namespace: 'Leadermodels',
                                  ...m.default,
                                };
                              },
                            ),
                          ],
                          component: () => import('../Leader/Add'),
                          LoadingComponent: require('/Users/gaomengzhou/project/enforcement/src/components/PageLoading/index')
                            .default,
                        })
                      : require('../Leader/Add').default,
                    exact: true,
                  },
                  {
                    path: '/workOrder/leader/detail/:id/:workOrderId/:check',
                    component: __IS_BROWSER
                      ? _dvaDynamic({
                          app: require('@tmp/dva').getApp(),
                          models: () => [
                            import('/Users/gaomengzhou/project/enforcement/src/pages/Leader/models/Leadermodels.js').then(
                              m => {
                                return {
                                  namespace: 'Leadermodels',
                                  ...m.default,
                                };
                              },
                            ),
                          ],
                          component: () => import('../Leader/Detail'),
                          LoadingComponent: require('/Users/gaomengzhou/project/enforcement/src/components/PageLoading/index')
                            .default,
                        })
                      : require('../Leader/Detail').default,
                    exact: true,
                  },
                  {
                    component: () =>
                      React.createElement(
                        require('/Users/gaomengzhou/project/enforcement/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                          .default,
                        { pagesPath: 'src/pages', hasRoutesInConfig: true },
                      ),
                  },
                ],
              },
              {
                component: () =>
                  React.createElement(
                    require('/Users/gaomengzhou/project/enforcement/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                      .default,
                    { pagesPath: 'src/pages', hasRoutesInConfig: true },
                  ),
              },
            ],
          },
          {
            path: '/workOrder/department',
            name: 'department',
            routes: [
              {
                path: '/workOrder/department/inspectors',
                name: 'inspectors',
                hideChildrenInMenu: true,
                authority: ['admin', '20907'],
                routes: [
                  {
                    path: '/workOrder/department/inspectors',
                    name: 'list',
                    redirect: '/workOrder/department/inspectors/list',
                    exact: true,
                  },
                  {
                    path: '/workOrder/department/inspectors/list',
                    component: __IS_BROWSER
                      ? _dvaDynamic({
                          app: require('@tmp/dva').getApp(),
                          models: () => [
                            import('/Users/gaomengzhou/project/enforcement/src/pages/Workorder/Department/Inspectors/models/Inspectorsmodels.js').then(
                              m => {
                                return {
                                  namespace: 'Inspectorsmodels',
                                  ...m.default,
                                };
                              },
                            ),
                          ],
                          component: () =>
                            import('../Workorder/Department/Inspectors/List'),
                          LoadingComponent: require('/Users/gaomengzhou/project/enforcement/src/components/PageLoading/index')
                            .default,
                        })
                      : require('../Workorder/Department/Inspectors/List')
                          .default,
                    exact: true,
                  },
                  {
                    path:
                      '/workOrder/department/inspectors/detail/:id/:workOrderId/:check',
                    component: __IS_BROWSER
                      ? _dvaDynamic({
                          app: require('@tmp/dva').getApp(),
                          models: () => [
                            import('/Users/gaomengzhou/project/enforcement/src/pages/Workorder/Department/Inspectors/models/Inspectorsmodels.js').then(
                              m => {
                                return {
                                  namespace: 'Inspectorsmodels',
                                  ...m.default,
                                };
                              },
                            ),
                          ],
                          component: () =>
                            import('../Workorder/Department/Inspectors/Detail'),
                          LoadingComponent: require('/Users/gaomengzhou/project/enforcement/src/components/PageLoading/index')
                            .default,
                        })
                      : require('../Workorder/Department/Inspectors/Detail')
                          .default,
                    exact: true,
                  },
                  {
                    path: '/workOrder/department/inspectors/add',
                    component: __IS_BROWSER
                      ? _dvaDynamic({
                          app: require('@tmp/dva').getApp(),
                          models: () => [
                            import('/Users/gaomengzhou/project/enforcement/src/pages/Workorder/Department/Inspectors/models/Inspectorsmodels.js').then(
                              m => {
                                return {
                                  namespace: 'Inspectorsmodels',
                                  ...m.default,
                                };
                              },
                            ),
                          ],
                          component: () =>
                            import('../Workorder/Department/Inspectors/Add'),
                          LoadingComponent: require('/Users/gaomengzhou/project/enforcement/src/components/PageLoading/index')
                            .default,
                        })
                      : require('../Workorder/Department/Inspectors/Add')
                          .default,
                    exact: true,
                  },
                  {
                    component: () =>
                      React.createElement(
                        require('/Users/gaomengzhou/project/enforcement/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                          .default,
                        { pagesPath: 'src/pages', hasRoutesInConfig: true },
                      ),
                  },
                ],
              },
              {
                path: '/workOrder/department/comprehensive',
                name: 'comprehensive',
                hideChildrenInMenu: true,
                authority: ['admin', '20908'],
                routes: [
                  {
                    path: '/workOrder/department/comprehensive',
                    name: 'list',
                    redirect: '/workOrder/department/comprehensive/list',
                    exact: true,
                  },
                  {
                    path: '/workOrder/department/comprehensive/list',
                    component: __IS_BROWSER
                      ? _dvaDynamic({
                          app: require('@tmp/dva').getApp(),
                          models: () => [
                            import('/Users/gaomengzhou/project/enforcement/src/pages/Workorder/Department/Comprehensive/models/compmodels.js').then(
                              m => {
                                return {
                                  namespace: 'compmodels',
                                  ...m.default,
                                };
                              },
                            ),
                          ],
                          component: () =>
                            import('../Workorder/Department/Comprehensive/List'),
                          LoadingComponent: require('/Users/gaomengzhou/project/enforcement/src/components/PageLoading/index')
                            .default,
                        })
                      : require('../Workorder/Department/Comprehensive/List')
                          .default,
                    exact: true,
                  },
                  {
                    path:
                      '/workOrder/department/comprehensive/detail/:id/:workOrderId/:check',
                    component: __IS_BROWSER
                      ? _dvaDynamic({
                          app: require('@tmp/dva').getApp(),
                          models: () => [
                            import('/Users/gaomengzhou/project/enforcement/src/pages/Workorder/Department/Comprehensive/models/compmodels.js').then(
                              m => {
                                return {
                                  namespace: 'compmodels',
                                  ...m.default,
                                };
                              },
                            ),
                          ],
                          component: () =>
                            import('../Workorder/Department/Comprehensive/Detail'),
                          LoadingComponent: require('/Users/gaomengzhou/project/enforcement/src/components/PageLoading/index')
                            .default,
                        })
                      : require('../Workorder/Department/Comprehensive/Detail')
                          .default,
                    exact: true,
                  },
                  {
                    path: '/workOrder/department/comprehensive/add',
                    name: 'add',
                    component: __IS_BROWSER
                      ? _dvaDynamic({
                          app: require('@tmp/dva').getApp(),
                          models: () => [
                            import('/Users/gaomengzhou/project/enforcement/src/pages/Workorder/Department/Comprehensive/models/compmodels.js').then(
                              m => {
                                return {
                                  namespace: 'compmodels',
                                  ...m.default,
                                };
                              },
                            ),
                          ],
                          component: () =>
                            import('../Workorder/Department/Comprehensive/Add'),
                          LoadingComponent: require('/Users/gaomengzhou/project/enforcement/src/components/PageLoading/index')
                            .default,
                        })
                      : require('../Workorder/Department/Comprehensive/Add')
                          .default,
                    exact: true,
                  },
                  {
                    component: () =>
                      React.createElement(
                        require('/Users/gaomengzhou/project/enforcement/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                          .default,
                        { pagesPath: 'src/pages', hasRoutesInConfig: true },
                      ),
                  },
                ],
              },
              {
                path: '/workOrder/department/complain',
                name: 'complain',
                hideChildrenInMenu: true,
                authority: ['admin', '20909'],
                routes: [
                  {
                    path: '/workOrder/department/complain',
                    name: 'list',
                    redirect: '/workOrder/department/complain/list',
                    exact: true,
                  },
                  {
                    path: '/workOrder/department/complain/list',
                    component: __IS_BROWSER
                      ? _dvaDynamic({
                          app: require('@tmp/dva').getApp(),
                          models: () => [
                            import('/Users/gaomengzhou/project/enforcement/src/pages/Workorder/Department/Complain/models/Complainmodels.js').then(
                              m => {
                                return {
                                  namespace: 'Complainmodels',
                                  ...m.default,
                                };
                              },
                            ),
                          ],
                          component: () =>
                            import('../Workorder/Department/Complain/List'),
                          LoadingComponent: require('/Users/gaomengzhou/project/enforcement/src/components/PageLoading/index')
                            .default,
                        })
                      : require('../Workorder/Department/Complain/List')
                          .default,
                    exact: true,
                  },
                  {
                    path: '/workOrder/department/complain/add',
                    component: __IS_BROWSER
                      ? _dvaDynamic({
                          app: require('@tmp/dva').getApp(),
                          models: () => [
                            import('/Users/gaomengzhou/project/enforcement/src/pages/Workorder/Department/Complain/models/Complainmodels.js').then(
                              m => {
                                return {
                                  namespace: 'Complainmodels',
                                  ...m.default,
                                };
                              },
                            ),
                          ],
                          component: () =>
                            import('../Workorder/Department/Complain/Add'),
                          LoadingComponent: require('/Users/gaomengzhou/project/enforcement/src/components/PageLoading/index')
                            .default,
                        })
                      : require('../Workorder/Department/Complain/Add').default,
                    exact: true,
                  },
                  {
                    path:
                      '/workOrder/department/complain/detail/:id/:workOrderId/:check',
                    component: __IS_BROWSER
                      ? _dvaDynamic({
                          app: require('@tmp/dva').getApp(),
                          models: () => [
                            import('/Users/gaomengzhou/project/enforcement/src/pages/Workorder/Department/Complain/models/Complainmodels.js').then(
                              m => {
                                return {
                                  namespace: 'Complainmodels',
                                  ...m.default,
                                };
                              },
                            ),
                          ],
                          component: () =>
                            import('../Workorder/Department/Complain/Detail'),
                          LoadingComponent: require('/Users/gaomengzhou/project/enforcement/src/components/PageLoading/index')
                            .default,
                        })
                      : require('../Workorder/Department/Complain/Detail')
                          .default,
                    exact: true,
                  },
                  {
                    component: () =>
                      React.createElement(
                        require('/Users/gaomengzhou/project/enforcement/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                          .default,
                        { pagesPath: 'src/pages', hasRoutesInConfig: true },
                      ),
                  },
                ],
              },
              {
                component: () =>
                  React.createElement(
                    require('/Users/gaomengzhou/project/enforcement/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                      .default,
                    { pagesPath: 'src/pages', hasRoutesInConfig: true },
                  ),
              },
            ],
          },
          {
            path: '/workOrder/community',
            name: 'community',
            authority: ['admin', '20910'],
            routes: [
              {
                path: '/workOrder/community',
                name: 'community',
                hideChildrenInMenu: true,
                routes: [
                  {
                    path: '/workOrder/community',
                    name: 'list',
                    redirect: '/workOrder/community/list',
                    exact: true,
                  },
                  {
                    path: '/workOrder/community/list',
                    component: __IS_BROWSER
                      ? _dvaDynamic({
                          app: require('@tmp/dva').getApp(),
                          models: () => [
                            import('/Users/gaomengzhou/project/enforcement/src/pages/Community/models/Communitymodels.js').then(
                              m => {
                                return {
                                  namespace: 'Communitymodels',
                                  ...m.default,
                                };
                              },
                            ),
                          ],
                          component: () => import('../Community/List'),
                          LoadingComponent: require('/Users/gaomengzhou/project/enforcement/src/components/PageLoading/index')
                            .default,
                        })
                      : require('../Community/List').default,
                    exact: true,
                  },
                  {
                    path: '/workOrder/community/add',
                    component: __IS_BROWSER
                      ? _dvaDynamic({
                          app: require('@tmp/dva').getApp(),
                          models: () => [
                            import('/Users/gaomengzhou/project/enforcement/src/pages/Community/models/Communitymodels.js').then(
                              m => {
                                return {
                                  namespace: 'Communitymodels',
                                  ...m.default,
                                };
                              },
                            ),
                          ],
                          component: () => import('../Community/Add'),
                          LoadingComponent: require('/Users/gaomengzhou/project/enforcement/src/components/PageLoading/index')
                            .default,
                        })
                      : require('../Community/Add').default,
                    exact: true,
                  },
                  {
                    path: '/workOrder/community/detail/:workOrderId/:id/:check',
                    component: __IS_BROWSER
                      ? _dvaDynamic({
                          app: require('@tmp/dva').getApp(),
                          models: () => [
                            import('/Users/gaomengzhou/project/enforcement/src/pages/Community/models/Communitymodels.js').then(
                              m => {
                                return {
                                  namespace: 'Communitymodels',
                                  ...m.default,
                                };
                              },
                            ),
                          ],
                          component: () => import('../Community/Detail'),
                          LoadingComponent: require('/Users/gaomengzhou/project/enforcement/src/components/PageLoading/index')
                            .default,
                        })
                      : require('../Community/Detail').default,
                    exact: true,
                  },
                  {
                    component: () =>
                      React.createElement(
                        require('/Users/gaomengzhou/project/enforcement/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                          .default,
                        { pagesPath: 'src/pages', hasRoutesInConfig: true },
                      ),
                  },
                ],
              },
              {
                component: () =>
                  React.createElement(
                    require('/Users/gaomengzhou/project/enforcement/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                      .default,
                    { pagesPath: 'src/pages', hasRoutesInConfig: true },
                  ),
              },
            ],
          },
          {
            component: () =>
              React.createElement(
                require('/Users/gaomengzhou/project/enforcement/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                  .default,
                { pagesPath: 'src/pages', hasRoutesInConfig: true },
              ),
          },
        ],
      },
      {
        path: '/everyDay',
        name: 'everyDay',
        icon: 'anticon-enforcement-department',
        routes: [
          {
            path: '/everyDay/team',
            name: 'team',
            routes: [
              {
                path: '/everyDay/team/information',
                name: 'information',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import('/Users/gaomengzhou/project/enforcement/src/pages/Team/Information/models/infomodels.js').then(
                          m => {
                            return { namespace: 'infomodels', ...m.default };
                          },
                        ),
                      ],
                      component: () => import('../Team/Information/List'),
                      LoadingComponent: require('/Users/gaomengzhou/project/enforcement/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../Team/Information/List').default,
                authority: ['admin', '20911'],
                exact: true,
              },
              {
                path: '/everyDay/team/track',
                name: 'track',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import('/Users/gaomengzhou/project/enforcement/src/pages/Team/Track/models/TrackList.js').then(
                          m => {
                            return { namespace: 'TrackList', ...m.default };
                          },
                        ),
                      ],
                      component: () => import('../Team/Track/List'),
                      LoadingComponent: require('/Users/gaomengzhou/project/enforcement/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../Team/Track/List').default,
                authority: ['admin', '20912'],
                exact: true,
              },
              {
                path: '/everyDay/team/track/add',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import('/Users/gaomengzhou/project/enforcement/src/pages/Team/Track/models/TrackList.js').then(
                          m => {
                            return { namespace: 'TrackList', ...m.default };
                          },
                        ),
                      ],
                      component: () => import('../Team/Track/add'),
                      LoadingComponent: require('/Users/gaomengzhou/project/enforcement/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../Team/Track/add').default,
                authority: ['admin', '20912'],
                exact: true,
              },
              {
                path: '/everyDay/team/staffappraisal',
                name: 'staffappraisal',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import('/Users/gaomengzhou/project/enforcement/src/pages/Team/StaffAppraisal/models/StaffAppraisalmodels.js').then(
                          m => {
                            return {
                              namespace: 'StaffAppraisalmodels',
                              ...m.default,
                            };
                          },
                        ),
                      ],
                      component: () => import('../Team/StaffAppraisal/List'),
                      LoadingComponent: require('/Users/gaomengzhou/project/enforcement/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../Team/StaffAppraisal/List').default,
                authority: ['admin', '20913'],
                exact: true,
              },
              {
                component: () =>
                  React.createElement(
                    require('/Users/gaomengzhou/project/enforcement/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                      .default,
                    { pagesPath: 'src/pages', hasRoutesInConfig: true },
                  ),
              },
            ],
          },
          {
            path: '/everyDay/vehicle',
            name: 'vehicle',
            authority: ['admin', '20912'],
            routes: [
              {
                path: '/everyDay/vehicle/vehiclemanagement',
                name: 'vehiclemanagement',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import('/Users/gaomengzhou/project/enforcement/src/pages/vehicle/VehicleManagement/models/vemmodels.js').then(
                          m => {
                            return { namespace: 'vemmodels', ...m.default };
                          },
                        ),
                      ],
                      component: () =>
                        import('../vehicle/VehicleManagement/List'),
                      LoadingComponent: require('/Users/gaomengzhou/project/enforcement/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../vehicle/VehicleManagement/List').default,
                authority: ['admin', '20914'],
                exact: true,
              },
              {
                path: '/everyDay/vehicle/positioning',
                name: 'positioning',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import('/Users/gaomengzhou/project/enforcement/src/pages/vehicle/Positioning/models/position.js').then(
                          m => {
                            return { namespace: 'position', ...m.default };
                          },
                        ),
                      ],
                      component: () => import('../vehicle/Positioning/List'),
                      LoadingComponent: require('/Users/gaomengzhou/project/enforcement/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../vehicle/Positioning/List').default,
                authority: ['admin', '20915'],
                exact: true,
              },
              {
                component: () =>
                  React.createElement(
                    require('/Users/gaomengzhou/project/enforcement/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                      .default,
                    { pagesPath: 'src/pages', hasRoutesInConfig: true },
                  ),
              },
            ],
          },
          {
            component: () =>
              React.createElement(
                require('/Users/gaomengzhou/project/enforcement/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                  .default,
                { pagesPath: 'src/pages', hasRoutesInConfig: true },
              ),
          },
        ],
      },
      {
        path: '/statistics',
        name: 'statistics',
        icon: 'anticon-enforcement-statistic',
        routes: [
          {
            path: '/statistics/totality',
            name: 'totality',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () => import('../Statistics/Totality'),
                  LoadingComponent: require('/Users/gaomengzhou/project/enforcement/src/components/PageLoading/index')
                    .default,
                })
              : require('../Statistics/Totality').default,
            authority: ['admin', '20916'],
            exact: true,
          },
          {
            path: '/statistics/increase',
            name: 'increase',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () => import('../Statistics/Increase'),
                  LoadingComponent: require('/Users/gaomengzhou/project/enforcement/src/components/PageLoading/index')
                    .default,
                })
              : require('../Statistics/Increase').default,
            authority: ['admin', '20917'],
            exact: true,
          },
          {
            path: '/statistics/category',
            name: 'category',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () => import('../Statistics/Category'),
                  LoadingComponent: require('/Users/gaomengzhou/project/enforcement/src/components/PageLoading/index')
                    .default,
                })
              : require('../Statistics/Category').default,
            authority: ['admin', '20918'],
            exact: true,
          },
          {
            path: '/statistics/source',
            name: 'source',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () => import('../Statistics/Source'),
                  LoadingComponent: require('/Users/gaomengzhou/project/enforcement/src/components/PageLoading/index')
                    .default,
                })
              : require('../Statistics/Source').default,
            authority: ['admin', '20919'],
            exact: true,
          },
          {
            path: '/statistics/effectiveness',
            name: 'effectiveness',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () => import('../Statistics/Effectiveness'),
                  LoadingComponent: require('/Users/gaomengzhou/project/enforcement/src/components/PageLoading/index')
                    .default,
                })
              : require('../Statistics/Effectiveness').default,
            authority: ['admin', '20920'],
            exact: true,
          },
          {
            path: '/statistics/notice',
            name: 'notice',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () => import('../Statistics/Notice'),
                  LoadingComponent: require('/Users/gaomengzhou/project/enforcement/src/components/PageLoading/index')
                    .default,
                })
              : require('../Statistics/Notice').default,
            authority: ['admin', '20921'],
            exact: true,
          },
          {
            path: '/statistics/map',
            name: 'map',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () => import('../Statistics/Map'),
                  LoadingComponent: require('/Users/gaomengzhou/project/enforcement/src/components/PageLoading/index')
                    .default,
                })
              : require('../Statistics/Map').default,
            authority: ['admin', '20922'],
            exact: true,
          },
          {
            component: () =>
              React.createElement(
                require('/Users/gaomengzhou/project/enforcement/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                  .default,
                { pagesPath: 'src/pages', hasRoutesInConfig: true },
              ),
          },
        ],
      },
      {
        path: '/power',
        name: 'power',
        icon: 'anticon-enforcement-leader',
        authority: ['admin', '20923'],
        routes: [
          {
            path: '/power/power/list',
            name: 'list',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('/Users/gaomengzhou/project/enforcement/src/pages/Power/models/powermodels.js').then(
                      m => {
                        return { namespace: 'powermodels', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../Power/List'),
                  LoadingComponent: require('/Users/gaomengzhou/project/enforcement/src/components/PageLoading/index')
                    .default,
                })
              : require('../Power/List').default,
            exact: true,
          },
          {
            component: () =>
              React.createElement(
                require('/Users/gaomengzhou/project/enforcement/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                  .default,
                { pagesPath: 'src/pages', hasRoutesInConfig: true },
              ),
          },
        ],
      },
      {
        name: 'system',
        icon: 'anticon-enforcement-setting',
        path: '/system',
        routes: [
          {
            path: '/system/grid',
            name: 'grid',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('/Users/gaomengzhou/project/enforcement/src/pages/System/models/departmodels.js').then(
                      m => {
                        return { namespace: 'departmodels', ...m.default };
                      },
                    ),
                    import('/Users/gaomengzhou/project/enforcement/src/pages/System/models/gridmodels.js').then(
                      m => {
                        return { namespace: 'gridmodels', ...m.default };
                      },
                    ),
                    import('/Users/gaomengzhou/project/enforcement/src/pages/System/models/Parametermodels.js').then(
                      m => {
                        return { namespace: 'Parametermodels', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../System/grid'),
                  LoadingComponent: require('/Users/gaomengzhou/project/enforcement/src/components/PageLoading/index')
                    .default,
                })
              : require('../System/grid').default,
            authority: ['admin', '20924'],
            exact: true,
          },
          {
            path: '/system/department',
            name: 'department',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('/Users/gaomengzhou/project/enforcement/src/pages/System/models/departmodels.js').then(
                      m => {
                        return { namespace: 'departmodels', ...m.default };
                      },
                    ),
                    import('/Users/gaomengzhou/project/enforcement/src/pages/System/models/gridmodels.js').then(
                      m => {
                        return { namespace: 'gridmodels', ...m.default };
                      },
                    ),
                    import('/Users/gaomengzhou/project/enforcement/src/pages/System/models/Parametermodels.js').then(
                      m => {
                        return { namespace: 'Parametermodels', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../System/department'),
                  LoadingComponent: require('/Users/gaomengzhou/project/enforcement/src/components/PageLoading/index')
                    .default,
                })
              : require('../System/department').default,
            authority: ['admin', '20925'],
            exact: true,
          },
          {
            path: '/system/parameter',
            name: 'parameter',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('/Users/gaomengzhou/project/enforcement/src/pages/System/models/departmodels.js').then(
                      m => {
                        return { namespace: 'departmodels', ...m.default };
                      },
                    ),
                    import('/Users/gaomengzhou/project/enforcement/src/pages/System/models/gridmodels.js').then(
                      m => {
                        return { namespace: 'gridmodels', ...m.default };
                      },
                    ),
                    import('/Users/gaomengzhou/project/enforcement/src/pages/System/models/Parametermodels.js').then(
                      m => {
                        return { namespace: 'Parametermodels', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../System/Parameter'),
                  LoadingComponent: require('/Users/gaomengzhou/project/enforcement/src/components/PageLoading/index')
                    .default,
                })
              : require('../System/Parameter').default,
            authority: ['admin', '20926'],
            exact: true,
          },
          {
            component: () =>
              React.createElement(
                require('/Users/gaomengzhou/project/enforcement/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                  .default,
                { pagesPath: 'src/pages', hasRoutesInConfig: true },
              ),
          },
        ],
      },
      {
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () => import('../404'),
              LoadingComponent: require('/Users/gaomengzhou/project/enforcement/src/components/PageLoading/index')
                .default,
            })
          : require('../404').default,
        exact: true,
      },
      {
        component: () =>
          React.createElement(
            require('/Users/gaomengzhou/project/enforcement/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
              .default,
            { pagesPath: 'src/pages', hasRoutesInConfig: true },
          ),
      },
    ],
  },
  {
    component: () =>
      React.createElement(
        require('/Users/gaomengzhou/project/enforcement/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
          .default,
        { pagesPath: 'src/pages', hasRoutesInConfig: true },
      ),
  },
];
window.g_routes = routes;
const plugins = require('umi/_runtimePlugin');
plugins.applyForEach('patchRoutes', { initialValue: routes });

export { routes };

export default class RouterWrapper extends React.Component {
  unListen() {}

  constructor(props) {
    super(props);

    // route change handler
    function routeChangeHandler(location, action) {
      plugins.applyForEach('onRouteChange', {
        initialValue: {
          routes,
          location,
          action,
        },
      });
    }
    this.unListen = history.listen(routeChangeHandler);
    // dva 中 history.listen 会初始执行一次
    // 这里排除掉 dva 的场景，可以避免 onRouteChange 在启用 dva 后的初始加载时被多执行一次
    const isDva =
      history.listen
        .toString()
        .indexOf('callback(history.location, history.action)') > -1;
    if (!isDva) {
      routeChangeHandler(history.location);
    }
  }

  componentWillUnmount() {
    this.unListen();
  }

  render() {
    const props = this.props || {};
    return (
      <RendererWrapper0>
        <Router history={history}>{renderRoutes(routes, props)}</Router>
      </RendererWrapper0>
    );
  }
}
