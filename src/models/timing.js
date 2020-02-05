import { message } from 'antd/lib/index';
import {
  timinglist, complainGeneratingRule, inspectorsGeneratingRule, comprehensiveGeneratingRule,
  complainDataModal, matchGeneration, editComplainDataModal, downLoadTemplateComplain, importComplainExcel,
  comprehensiveDataModal, editComprehensiveDataModal, downLoadTemplateComprehensive, importComprehensiveExcel,
  inspectorDataModal, editInspectorDataModal, downLoadTemplateInspector, importInspectorExcel, lookList, timinglistFetchForChecks
} from '@/services/workOrder';
import { Dictionary, EditDicCat } from '@/services/system';
import { getService, postService, exportService, exportServiceNew, exportServiceNew2, exportServiceNew3 } from '@/services/serviceApi';

export default {
  namespace: 'timing',
  state: {
    timingList: {
      list: [],
      total: 0,
    },
    complainGeneratingRuleList: {
      list: [],
      total: 0,
    },
    inspectorsGeneratingRuleList: {
      list: [],
      total: 0,
    },
    comprehensiveGeneratingRuleList: {
      list: [],
      total: 0,
    },
  },
  effects: {
    *lookListCheck({ payload, callback }, { call }) {
      const res = yield call(getService, `/services/lookup/init/${payload.creatCycle}`);
      callback && callback(res);
    },

    //定时生成列表
    *timinglistFetch({ payload }, { call, put }) {
      const response = yield call(timinglist, payload);
      if (response) {
        yield put({
          type: 'queryTiminglist',
          payload: {
            list: response.list ? response.list : [],
            total: response.length ? response.length : 0,
          }
        })
      } else {
        message.error(response.retMsg ? response.retMsg : (response.message ? response.message : '数据加载失败'))
      }
    },
    //定是生成列表查询功能
    *timinglistFetchForCheck({ payload }, { call, put }) {
      const response = yield call(timinglistFetchForChecks, payload);
      if (response) {
        yield put({
          type: 'queryTiminglist',
          payload: {
            list: response.list ? response.list : [],
            total: response.total ? response.total : 0,
          }
        })
      } else {
        message.error(response.msg ? response.msg : (response.message ? response.message : '数据加载失败'))
      }
    },


    // 投诉工单定时生成规则表
    *complainGeneratingRuleFetch({ payload }, { call, put }) {
      const response = yield call(complainGeneratingRule, payload);
      if (response) {
        yield put({
          type: 'queryComplainGeneratingRule',
          payload: {
            list: response.list ? response.list : [],
            total: response.length ? response.length : 0,
          }
        })
      } else {
        message.error(response.msg ? response.msg : (response.message ? response.message : '数据加载失败'))
      }
    },
    // 城管工单定时生成规则表
    *inspectorsGeneratingRuleFetch({ payload }, { call, put }) {
      const response = yield call(inspectorsGeneratingRule, payload);
      if (response) {
        yield put({
          type: 'queryInspectorsGeneratingRule',
          payload: {
            list: response.list ? response.list : [],
            total: response.length ? response.length : 0,
          }
        })
      } else {
        message.error(response.msg ? response.msg : (response.message ? response.message : '数据加载失败'))
      }
    },
    // 综合执法工单定时生成规则表
    *comprehensiveGeneratingRuleFetch({ payload }, { call, put }) {
      const response = yield call(comprehensiveGeneratingRule, payload);
      if (response) {
        yield put({
          type: 'queryComprehensiveGeneratingRule',
          payload: {
            list: response.list ? response.list : [],
            total: response.length ? response.length : 0,
          }
        })
      } else {
        message.error(response.msg ? response.msg : (response.message ? response.message : '数据加载失败'))
      }
    },
    // 投诉工单智能生成规则 弹框
    *complainDataModalFetch({ payload }, { call, put }) {
      const { resolve } = payload;
      const response = yield call(complainDataModal, payload);
      if (response) {
        resolve({
          data: {
            list: response.list ? response.list : [],
            total: response.length ? response.length : 0,
          }
        })
      } else {
        message.error(response.msg)
      }
    },
    // 投诉工单 智能生成规则 弹框 修改（保存）
    *editComplainDataModalFetch({ payload }, { call, put }) {
      const { resolve } = payload;
      const response = yield call(editComplainDataModal, payload);
      if (response) {
        message.success('修改成功');
        const result = yield call(complainDataModal, payload);
        if (result) {
          resolve({
            data: {
              list: result.list ? result.list : [],
              total: response.length ? response.length : 0,
            }
          })
        }
      } else {
        message.error('修改失败')
      }
    },
    // 城管工单工单智能生成规则 弹框
    *inspectorDataModalFetch({ payload }, { call, put }) {
      const { resolve } = payload;
      const response = yield call(inspectorDataModal, payload);
      if (response) {
        resolve({
          data: {
            list: response.list ? response.list : [],
            total: response.length ? response.length : 0,
          }
        })
      } else {
        message.error(response.msg)
      }
    },
    // 城管工单 智能生成规则 弹框 修改（保存）
    *editInspectorDataModalFetch({ payload }, { call, put }) {
      const { resolve } = payload;
      const response = yield call(editComplainDataModal, payload);
      if (response) {
        message.success('修改成功');
        const result = yield call(inspectorDataModal, payload);
        if (result) {
          resolve({
            data: {
              list: result.list ? result.list : [],
              total: response.length ? response.length : 0,
            }
          })
        }
      } else {
        message.error('修改失败')
      }
    },
    // 综合执法工单智能生成规则 弹框
    *comprehensiveDataModalFetch({ payload }, { call, put }) {
      const { resolve } = payload;
      const response = yield call(comprehensiveDataModal, payload);
      if (response) {
        resolve({
          data: {
            list: response.list ? response.list : [],
            total: response.length ? response.length : 0,
          }
        })
      } else {
        message.error(response.msg)
      }
    },
    // 综合执法工单 智能生成规则 弹框 修改（保存）
    *editComprehensiveDataModalFetch({ payload }, { call, put }) {
      const { resolve } = payload;
      const response = yield call(editComplainDataModal, payload);
      if (response) {
        message.success('修改成功');
        const result = yield call(comprehensiveDataModal, payload);
        if (result) {
          resolve({
            data: {
              list: result.list ? result.list : [],
              total: response.length ? response.length : 0,
            }
          })
        }
      } else {
        message.error('修改失败')
      }
    },
    // 投诉工单 智能生成规则 弹框 模板下载（导出）
    // *downloadComplain({ payload }, { call, put }) {
    //   const { resolve } = payload;
    //   const response = yield call(downLoadTemplateComplain, {});
    //   if (response) {
    //     const realFileName = response.headers.get('content-disposition').split('fileName=')[1];
    //     resolve({ blob: response.blob(), fileName: realFileName });
    //   } else {
    //     message.error('无法下载')
    //   }
    // },


    *downloadComplain({ payload, callback }, { call }) {
      const res = yield call(exportServiceNew, `/services/enforcement/Intelligence/exportComplian`);
      res && callback(res);
    },



    // 投诉工单 智能生成规则 弹框 导入设置
    *importComplainExcelFetch({ payload }, { call, put }) {
      const { resolve } = payload;
      const response = yield call(importComplainExcel, payload.file);
      if (response.retMsg == '导入成功！') {
        message.success(response.retMsg);
        resolve({ success: true })
      } else {
        message.error(response.root.list[0]);
        resolve({ success: false })
      }
    },
    // 城管工单 智能生成规则 弹框 模板下载（导出）
    // *downloadInspector({ payload }, { call, put }) {
    //   const { resolve } = payload;
    //   const response = yield call(downLoadTemplateInspector, {});
    //   if (response) {
    //     const realFileName = response.headers.get('content-disposition').split('fileName=')[1];
    //     resolve({ blob: response.blob(), fileName: realFileName });
    //   } else {
    //     message.error('无法下载')
    //   }
    // },

    *downloadInspector({ payload, callback }, { call }) {
      const res = yield call(exportServiceNew3, `/services/enforcement/Intelligence/exportUrbanManage`);
      res && callback(res);
    },


    // 城管工单 智能生成规则 弹框 导入设置
    *importInspectorExcelFetch({ payload }, { call, put }) {
      const { resolve } = payload;
      const response = yield call(importInspectorExcel, payload.file);
      if (response.retMsg == '导入成功！') {
        message.success(response.retMsg);
        resolve({ success: true })
      } else {
        message.error(response.root.list[0]);
        resolve({ success: false })
      }
    },
    // 综合执法 智能生成规则 弹框 模板下载（导出）
    // *downloadComprehensive({ payload }, { call, put }) {
    //   const { resolve } = payload;
    //   const response = yield call(downLoadTemplateComprehensive, {});
    //   if (response) {
    //     const realFileName = response.headers.get('content-disposition').split('fileName=')[1];
    //     resolve({ blob: response.blob(), fileName: realFileName });
    //   } else {
    //     message.error('无法下载')
    //   }
    // },

    *downloadComprehensive({ payload, callback }, { call }) {
      const res = yield call(exportServiceNew2, `/services/enforcement/Intelligence/exportComprehensive`);
      res && callback(res);
    },

    // 综合执法 智能生成规则 弹框 导入设置
    *importComprehensiveExcelFetch({ payload }, { call, put }) {
      const { resolve } = payload;
      const response = yield call(importComprehensiveExcel, payload.file);
      if (response.retMsg == '导入成功！') {
        message.success(response.retMsg);
        resolve({ success: true })
      } else {
        message.error(response.root.list[0]);
        resolve({ success: false })
      }
    },
  },
  reducers: {
    // lookUpList(state, { payload }) {
    //   console.log(state)
    //   console.log(payload)
    //   return { ...state, selectionPeriod:payload }
    // },
    queryTiminglist(state, { payload }) {
      return {
        ...state,
        timingList: payload,
      }
    },
    queryComplainGeneratingRule(state, { payload }) {
      return {
        ...state,
        complainGeneratingRuleList: payload,
      }
    },
    queryInspectorsGeneratingRule(state, { payload }) {
      return {
        ...state,
        inspectorsGeneratingRuleList: payload,
      }
    },
    queryComprehensiveGeneratingRule(state, { payload }) {
      return {
        ...state,
        comprehensiveGeneratingRuleList: payload,
      }
    },
  }
}
