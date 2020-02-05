import { sourceList, sourceChart, downloadExcel } from '@/services/statistics';
import { message } from 'antd/lib/index';
import { getService, exportByPost, postService, exportService,exportService5,exportService6, exportPhotosService } from '@/services/serviceApi';

export default {
  namespace: 'source',
  state: {
    sourceList: {
      list: [],
      total: 0,
    },
  },
  effects: {
    //来源分析列表
    *sourceListFetch({ payload }, { call, put }) {
      const response = yield call(sourceList, payload);
      if (response) {
        for (let i = 0; i < response.page.list.length; i++) {
          response.page.list[i].key = i + 1;
        }
        yield put({
          type: 'querySourceList',
          payload: {
            list: Array.isArray(response.page.list) ? response.page.list : [],
            total: response.page.total ? response.page.total : 0,
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
      console.log(response)
      if (response) {
        for (let i = 0; i < response.data.length; i++) {
          response.data[i].id = i + 1
        };
        resolve({
          data: response.data
        })
      } else {
        message.error(response.retMsg)
      }
    },
    *downloadExcelFetch({ payload, callback }, { call }) {
      const res = yield call(exportService6, `/services/enforcement/DataAnalysis/ExportSourcesAnalysis/${payload.startT}/${payload.endT}/${payload.community}`);
      res && callback(res);
    },

    *exprotData({ payload, callback }, { call }) {
      const res = yield call(exportService5, `/services/enforcement/DataAnalysis/ExportperformanceAnalysis`);
      res && callback(res);
    }
  },
  reducers: {
    querySourceList(state, { payload }) {
      return {
        ...state,
        sourceList: payload,
      };
    },
  }
}
