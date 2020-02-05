import {
  totalDepList, downloadExcelDep,
  totalIntelligenceList, downloadExcelInt,
  totalLeaderList, downloadExcelLeader,
  sourceChart, totalSectionList
} from '@/services/statistics';
import { getService, exportByPost, postService, exportService, exportPhotosService,exportService1,exportService2,exportService3,exportService4 } from '@/services/serviceApi';
import { message } from 'antd/lib/index';

export default {
  namespace: 'statisticsTotal',
  state: {
    totalDepartmentList: {
      list: [],
    },
    totalLeaderList: {
      list: [],
    },
    totalIntelligenceList: {
      list: [],
    },
    totalSectionList: {
      list: []
    }
  },
  effects: {
    //总体分析 部门派发列表
    *totalDepListFetch({ payload }, { call, put }) {
      const response = yield call(totalDepList, payload);
      if (response) {
        for (let i = 0; i < response.data.length; i++) {
          response.data[i].id = i + 1;
          response.data[i].sign = i + 1;
        }
        yield put({
          type: 'queryTotalDepList',
          payload: {
            list: Array.isArray(response.data) ? response.data : [],
          }
        })
      } else {
        message.error(response.msg ? response.msg : (response.message ? response.message : '数据加载失败'))
      }
    },
    //总体分析 领导交办列表
    *totalLeaderListFetch({ payload }, { call, put }) {
      const response = yield call(totalLeaderList, payload);
      if (response) {
        for (let i = 0; i < response.data.length; i++) {
          response.data[i].id = i + 1;
          response.data[i].sign = i + 1;
        }
        yield put({
          type: 'queryTotalLeaderList',
          payload: {
            list: Array.isArray(response.data) ? response.data : [],
          }
        })
      } else {
        message.error(response.msg ? response.msg : (response.message ? response.message : '数据加载失败'))
      }
    },
    //总体分析 智能生成列表
    *totalIntelligenceListFetch({ payload }, { call, put }) {
      const response = yield call(totalIntelligenceList, payload);
      if (response) {
        for (let i = 0; i < response.data.length; i++) {
          response.data[i].id = i + 1;
          response.data[i].sign = i + 1;
        }
        yield put({
          type: 'queryTotalIntelligenceList',
          payload: {
            list: Array.isArray(response.data) ? response.data : [],
          }
        })
      } else {
        message.error(response.msg ? response.msg : (response.message ? response.message : '数据加载失败'))
      }
    },
    //总体分析 科室类别列表
    *totalSectionListFetch({ payload }, { call, put }) {
      const response = yield call(totalSectionList, payload);
      if (response) {
        for (let i = 0; i < response.data.length; i++) {
          response.data[i].id = i + 1;
          response.data[i].sign = i + 1;
        }
        yield put({
          type: 'queryTotalSectionList',
          payload: {
            list: Array.isArray(response.data) ? response.data : [],
          }
        })
      } else {
        message.error(response.msg ? response.msg : (response.message ? response.message : '数据加载失败'))
      }
    },
    //来源分析 饼状图
    *sourceChartFetch({ payload }, { call, put }) {
      const { resolve } = payload;
      const response = yield call(sourceChart, payload);
      if (response && response.success) {
        resolve({
          data: response.list
        })
      } else {
        message.error(response.msg)
      }
    },
    //导出表格 部门派发
    // *downloadExcelDepFetch({ payload }, { call, put }) {
    //   const { resolve } = payload;
    //   const response = yield call(downloadExcelDep, payload);
    //   if (response) {
    //     const realFileName = response.headers.get('content-disposition').split('fileName=')[1];
    //     resolve({ blob: response.blob(), fileName: realFileName });
    //   } else {
    //     message.error('无法下载')
    //   }
    // },
    *downloadExcelDepFetch({ payload, callback }, { call }) {
      const res = yield call(exportService1, `/services/enforcement/DataAnalysis/exportAnalysis/${payload.startT}/${payload.endT}`);
      res && callback(res);
    },
    //导出表格 领导交办
    *downloadExcelLeaderFetch({ payload }, { call, put }) {
      const res = yield call(exportService2, `/services/enforcement/DataAnalysis/exportLeaderAnalysis/${payload.startT}/${payload.endT}`);
      res && callback(res);
    },
    //导出表格 智能生成
    *downloadExcelIntFetch({ payload }, { call, put }) {
      const res = yield call(exportService3, `/services/enforcement/DataAnalysis/exportIntelligenceAnalysis/${payload.startT}/${payload.endT}`);
      res && callback(res);
    },
     //导出表格 科室类别
     *downloadExcelIntDPMFetch({ payload }, { call, put }) {
      const res = yield call(exportService4, `/services/enforcement/DataAnalysis/exportCategoryAnalysis/${payload.startT}/${payload.endT}`);
      res && callback(res);
    },
  },
  reducers: {
    queryTotalDepList(state, { payload }) {
      return {
        ...state,
        totalDepartmentList: payload,
      };
    },
    queryTotalLeaderList(state, { payload }) {
      return {
        ...state,
        totalLeaderList: payload,
      };
    },
    queryTotalIntelligenceList(state, { payload }) {
      return {
        ...state,
        totalIntelligenceList: payload,
      };
    },
    queryTotalSectionList(state, { payload }) {
      return {
        ...state,
        totalSectionList: payload,
      };
    },
  }
}
