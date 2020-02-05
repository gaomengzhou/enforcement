import { message } from 'antd/lib/index';
import {
  match,
  matchGeneration,
  matchGenerationInt,
  matchManual,
  exportWord,
  patchComplaintOrder,
  patchUrbanOrder,
  patchComprehensiveOrder,
  patchSetModalData,
  patchThatComplantDatas
} from '@/services/workOrder';

export default {
  namespace: 'match',
  state: {
    matchList: {
      list: [],
      total: 0,
    },
    orderData: [],
    modalDataList: []
  },
  effects: {
    *patchComplantDatas({ payload }, { call }) {
      const res = yield call(patchThatComplantDatas, payload)
      if (res.retMsg === "操作成功") {
        message.success(res.retMsg)
      }
    },
    *setModalData({ payload }, { call }) {
      const res = yield call(patchSetModalData, payload)
      if (res.retMsg === "操作成功") {
        message.success(res.retMsg)
      }
    },
    *matchListFetch({ payload }, { call, put }) {
      const response = yield call(match, payload);
      if (response) {
        yield put({
          type: 'queryMatchlist',
          payload: {
            list: response.list ? response.list : [],
            total: response.length ? response.length : 0,
          }
        })
      } else {
        message.error(response.msg ? response.msg : (response.message ? response.message : '数据加载失败'))
      }
    },
    *matchSearchFetch({ payload }, { call }) {
      const response = yield call(matchSearch, payload);
      if (response && response.success) {
        message.success(response.msg);
      } else {
        message.error(response.msg);
      }
    },
    // 统计条件列表
    *matchGenerationFetch({ payload }, { call }) {
      const { resolve } = payload;
      const response = yield call(matchGeneration, payload);
      if (response) {
        for (let i = 0; i < response.data.length; i++) {
          response.data[i].id = i + 1;
        }
        resolve({
          data: response.data
        })
      } else {
        message.error(response.msg)
      }
    },
    // 统计条件 智能生成按钮
    *matchGenerationIntFetch({ payload }, { call }) {
      const { resolve } = payload
      const response = yield call(matchGenerationInt, payload.statisticsIntArr);
      if (response.retMsg === '操作成功') {
        message.success('智能生成成功');
        resolve({
          data: response.data
        })

      } else {
        message.error('请选择正确的生成条件');
      }
    },
    // 统计条件 智能生成按钮
    *matchManualFetch({ payload }, { call }) {
      const response = yield call(matchManual, payload);
      if (response.retMsg == '操作成功') {
        message.success('智能生成成功');
      } else {
        message.error(response.retMsg);
      }
    },
    // 导入12345工单
    *import({ payload }, { call }) {
      const { resolve } = payload;
      const response = yield call(exportWord, payload.file);
      if (response && response.success) {
        response.success('导入成功');
        resolve({ success: true })
      } else {
        response.error('导入失败');
        resolve({ success: false })
      }
    },
    // 投诉工单
    *complaint_order({ payload }, { call, put }) {
      const res = yield call(patchComplaintOrder, payload);
      if (res && res.retMsg === '操作成功') {
        yield put({
          type: 'patchComplaintOrderList',
          payload: res.list
        })
      }
    },

    // 城管工单
    *urban_order({ payload }, { call, put }) {
      const res = yield call(patchUrbanOrder, payload);
      if (res && res.retMsg === '操作成功') {
        yield put({
          type: 'patchComplaintOrderList',
          payload: res.list
        })
      }
    },

    // 综合执法
    *comprehensive_order({ payload }, { call, put }) {
      // const {resolve}= payload;
      const res = yield call(patchComprehensiveOrder, payload);
      if (res && res.retMsg === '操作成功') {
        yield put({
          type: 'patchComplaintOrderList',
          payload: res.list
        })
      }
    }
  },
  reducers: {
    queryMatchlist(state, { payload }) {
      return {
        ...state,
        matchList: payload,
      }
    },
    matchGenerationIntFetchList(state, { payload }) {
      return {
        ...state,
        orderData: payload
      }
    },
    patchComplaintOrderList(state, { payload }) {
      return {
        ...state,
        modalDataList: payload
      }
    }
  }
}
