export default [ // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      {
        path: '/user',
        redirect: '/user/login'
      },
      {
        path: '/user/login',
        component: './User/Login'
      }
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['admin', 'user'],
    routes: [ // dashboard
      {
        path: '/',
        redirect: '/user/login'
      },
      // { path: '/', redirect: '/index/home' },
      // 首页
      {
        path: '/index/Home',
        name: 'index',
        icon: 'anticon-enforcement-shouye',
        component: './Index/Home',
        authority: ['admin', '20901'],
      },
      // 工作架构
      {
        path: '/workarchitecture/architecture',
        name: 'workarchitecture',
        icon: 'anticon-enforcement-leader',
        authority: ['admin', '20902'],
        routes: [
          {
            path: '/workarchitecture/architecture/img',
            name: "img",
            component: './WorkArchitecture/Architecture',
          }
        ]
      },
      // 工单派发
      {
        path: '/workOrder',
        name: 'workOrder',
        icon: 'anticon-enforcement-intelligent',
        routes: [
          // 智能生成
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
                  },
                  {
                    path: '/workOrder/intelligentize/timing/list',
                    component: './Intelligentize/Timing/list',
                  },
                  {
                    path: '/workOrder/intelligentize/timing/statistics',
                    component: './Intelligentize/Timing/Statistics',
                  },
                ],
              },
              // {
              //   path: '/workOrder/intelligentize/matching',
              //   name: 'matching',
              //   component: './Intelligentize/Matching',
              // },
              {
                path: '/workOrder/intelligentize/matching',
                name: 'matching',
                hideChildrenInMenu: true,
                authority: ['admin', '20904'],
                routes: [
                  {
                    path: '/workOrder/intelligentize/matching',
                    component: './Intelligentize/Matching',
                  },
                  {
                    path: '/workOrder/intelligentize/matching/cityManagement/:id/:workOrderId/:check',//城管工单
                    component: './Intelligentize/CityManagement'
                  },
                  {
                    path: '/workOrder/intelligentize/matching/comprehensiveLawEnforcement/:id/:workOrderId/:check',//综合执法
                    component: './Intelligentize/ComprehensiveLawEnforcement'
                  },
                  {
                    path: '/workOrder/intelligentize/matching/complaint/:id/:workOrderId/:check',//投诉工单
                    component: './Intelligentize/Complaint'
                  },
                ]
              },
              {
                path: '/workOrder/intelligentize/Statistics',
                name: 'statistics',
                component: './Intelligentize/Statistics',
                authority: ['admin', '20905'],
              },
            ]
          },
          // 领导交办
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
                  },
                  {
                    path: '/workOrder/leader/list',
                    component: './Leader/List',
                  },
                  {
                    path: '/workOrder/leader/add',
                    component: './Leader/Add',
                  },
                  {
                    path: '/workOrder/leader/detail/:id/:workOrderId/:check',
                    component: './Leader/Detail',
                  },
                ]
              }
            ],
          },
          // 部门派发
          {
            path: '/workOrder/department',
            name: 'department',
            routes: [
              // 城管工单
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
                  },
                  {
                    path: '/workOrder/department/inspectors/list',
                    component: './Workorder/Department/Inspectors/List',
                  },
                  {
                    path: '/workOrder/department/inspectors/detail/:id/:workOrderId/:check',
                    component: './Workorder/Department/Inspectors/Detail',
                  },
                  {
                    path: '/workOrder/department/inspectors/add',
                    component: './Workorder/Department/Inspectors/Add',
                  }
                ],
              },
              // 综合执法
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
                  },
                  {
                    path: '/workOrder/department/comprehensive/list',
                    component: './Workorder/Department/Comprehensive/List',
                  },
                  {
                    path: '/workOrder/department/comprehensive/detail/:id/:workOrderId/:check',
                    component: './Workorder/Department/Comprehensive/Detail',
                  },
                  {
                    path: '/workOrder/department/comprehensive/add',
                    name: 'add',
                    component: './Workorder/Department/Comprehensive/Add',
                  }
                ]
              },
              // 投诉工单
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
                  },
                  {
                    path: '/workOrder/department/complain/list',
                    component: './Workorder/Department/Complain/List',
                  },
                  {
                    path: '/workOrder/department/complain/add',
                    component: './Workorder/Department/Complain/Add',
                  },
                  {
                    path: '/workOrder/department/complain/detail/:id/:workOrderId/:check',
                    component: './Workorder/Department/Complain/Detail',
                  }
                ]
              }
            ]
          },
          // 社区流转
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
                  },
                  {
                    path: '/workOrder/community/list',
                    component: './Community/List',
                  },
                  {
                    path: '/workOrder/community/add',
                    component: './Community/Add',
                  },
                  {
                    path: '/workOrder/community/detail/:workOrderId/:id/:check',
                    component: './Community/Detail',
                  },
                ]
              }
            ],
          },
        ]
      },
      // 日常管理
      {
        path: '/everyDay',
        name: 'everyDay',
        icon: 'anticon-enforcement-department',
        routes: [
          // 队员管理
          {
            path: '/everyDay/team',
            name: 'team',
            routes: [
              {
                path: '/everyDay/team/information',
                name: 'information',
                component: './Team/Information/List',
                authority: ['admin', '20911'],
              },
              {
                path: '/everyDay/team/track',
                name: 'track',
                component: './Team/Track/List',
                authority: ['admin', '20912'],
              },
              {
                path: '/everyDay/team/track/add',
                component: './Team/Track/add',
                authority: ['admin', '20912'],
              },
              {
                path: '/everyDay/team/staffappraisal',
                name: 'staffappraisal',
                component: './Team/StaffAppraisal/List',
                authority: ['admin', '20913'],
              }
            ]
          },
          // 车辆管理
          {
            path: '/everyDay/vehicle',
            name: 'vehicle',
            authority: ['admin', '20912'],
            routes: [
              {
                path: '/everyDay/vehicle/vehiclemanagement',
                name: 'vehiclemanagement',
                component: './vehicle/VehicleManagement/List',
                authority: ['admin', '20914'],
              },
              {
                path: '/everyDay/vehicle/positioning',
                name: 'positioning',
                component: './vehicle/Positioning/List',
                authority: ['admin', '20915'],
              },
            ],
          },
          // 综合调度
          // {
          //   path: "/everyDay/Integrated",
          //   name: "Integrated",
          //   component: './Integrated/List',
          // }
        ]
      },
      // 统计分析
      {
        path: '/statistics',
        name: 'statistics',
        icon: 'anticon-enforcement-statistic',
        routes: [
          // 总体分析
          {
            path: '/statistics/totality',
            name: 'totality',
            component: './Statistics/Totality',
            authority: ['admin', '20916'],
          },
          // 增减分析
          {
            path: '/statistics/increase',
            name: 'increase',
            component: './Statistics/Increase',
            authority: ['admin', '20917'],
          },
          // 类别分析
          {
            path: '/statistics/category',
            name: 'category',
            component: './Statistics/Category',
            authority: ['admin', '20918'],
          },
          // 来源分析
          {
            path: '/statistics/source',
            name: 'source',
            component: './Statistics/Source',
            authority: ['admin', '20919'],
          },
          //成效分析
          {
            path: '/statistics/effectiveness',
            name: 'effectiveness',
            component: './Statistics/Effectiveness',
            authority: ['admin', '20920'],
          },
          // 巡查提醒
          {
            path: '/statistics/notice',
            name: 'notice',
            component: './Statistics/Notice',
            authority: ['admin', '20921'],
          },
          // 地图展示 // 网格巡查
          {
            path: '/statistics/map',
            name: 'map',
            component: './Statistics/Map',
            authority: ['admin', '20922'],
          }
        ],
      },
      // 权力事项
      {
        path: 'power',
        name: 'power',
        icon: 'anticon-enforcement-leader',
        authority: ['admin', '20923'],
        routes: [
          {
            path: 'power/list',
            name: 'list',
            component: './Power/List',
          }
        ]
      },
      // 系统设置
      {
        name: 'system',
        icon: 'anticon-enforcement-setting',
        path: '/system',
        routes: [
          // 数据字典管理
          // {
          //   path: '/system/dictionary',
          //   name: 'dictionary',
          //   component: './System/Dictionary',
          // },
          //网格员管理
          {
            path: '/system/grid',
            name: 'grid',
            component: './System/grid',
            authority: ['admin', '20924'],
          },
          //综合执法部门管理
          {
            path: '/system/department',
            name: 'department',
            component: './System/department',
            authority: ['admin', '20925'],
          },
          // 综合执法参数管理
          {
            path: '/system/parameter',
            name: 'parameter',
            component: './System/Parameter',
            authority: ['admin', '20926'],
          },
        ]
      },
      {
        component: '404',
      },
    ],
  },
];
