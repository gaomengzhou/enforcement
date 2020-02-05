import { message } from 'antd';
import { routerRedux } from 'dva/router';
import {
  comprehensiveDetailBaseInfo,
  comprehensiveListBaseInfo, LeaderDetail, comprehensiveDelete,
  updateComprehensiveDetail, bigClass, smallClass,
  processingProgram, complainGoBack,
  comprehensiveDispatch,
  comprehensiveReturn,
  comprehensiveWasteCase,
  comprehensiveReview,
  comprehensiveCloseCase,
  comprehensiveRecover,
  ComprehensiveExtend,
  ComprehensiveEnd,
  comprehensiveAdd,
  InspectorReport
} from '@/services/workOrder';
import closeAnimated from './../utils/closeAnimated';
export default {
  namespace: 'comprehensive',
  state: {
    comprehensiveList: {
      list: [],
      total: 0
    },
  },

  effects: {
    *addSave({ payload }, { call, put }) {    //保存
      const response = yield call(comprehensiveAdd, payload);
      if (response && response.success) {
        for (let i = 0; i < response.page.list.length; i++) {
          response.page.list[i].key = response.page.list[i].id + '/' + response.page.list[i].workOrderStatus;
        }
        yield put({
          type: 'lists',
          payload: {
            list: Array.isArray(response.page.list) ? response.page.list : [],
            total: response.page.total ? response.page.total : 0,
          },
        });
      } else {
        message.error(response.msg ? response.msg : (response.message ? response.message : '数据加载失败'))
      }
    },
    *report({ payload }, { call, put }) {    //上报
      const { resolve } = payload;
      const response = yield call(InspectorReport, payload);
      if (response && response.success) {
        for (let i = 0; i < response.page.list.length; i++) {
          response.page.list[i].key = response.page.list[i].id + '/' + response.page.list[i].workOrderStatus;
        }
        // yield put({
        //   type: 'lists',
        //   payload: {
        //     list: Array.isArray(response.page.list) ? response.page.list : [],
        //     total: response.page.total ? response.page.total : 0,
        //   },
        // });
        resolve({ data: response.data ? response.data : {} })
      } else {
        message.error(response.msg ? response.msg : (response.message ? response.message : '数据加载失败'))
      }
    },
    *list({ payload }, { call, put }) {    //列表
      const response = yield call(comprehensiveListBaseInfo, payload);
      console.log(response)
      if (response && response.success) {
        for (let i = 0; i < response.page.list.length; i++) {
          response.page.list[i].key = response.page.list[i].id + '/' + response.page.list[i].workOrderStatus;
        }
        yield put({
          type: 'queryComprehensiveList',
          payload: {
            list: Array.isArray(response.page.list) ? response.page.list : [],
            total: response.page.total,
          },
        });
      } else {
        message.error(responseResult.msg ? responseResult.msg : (responseResult.message ? responseResult.message : '数据加载失败'))
      }
    },
    *edit({ payload }, { call, put }) {  //修改
      const response = yield call(updateComprehensiveDetail, payload.edit);
      if (payload.leader === 1) {
        if (response && response.success) {
          message.success(response.msg);
          closeAnimated();
          const responseResult = yield call(comprehensiveListBaseInfo, payload.leaderList);
          if (responseResult && responseResult.success) {
            for (let i = 0; i < responseResult.page.list.length; i++) {
              responseResult.page.list[i].key = responseResult.page.list[i].id + '/' + responseResult.page.list[i].workOrderStatus;
            }
            yield put({
              type: 'queryComprehensiveList',
              payload: {
                list: Array.isArray(response.page.list) ? response.page.list : [],
                total: response.page.total,
              },
            });
          } else {
            message.error(responseResult.msg ? responseResult.msg : (responseResult.message ? responseResult.message : '数据加载失败'))
          }
        } else {
          message.info(response.msg);
        }
      } else if (payload.leader === 2) {
        if (response && response.success) {
          message.success(response.msg);
          yield put(routerRedux.push('/department/Comprehensive/list'));
        } else {
          message.error(response.msg);
        }
      }
    },
    *info({ payload }, { call, put }) {  //详情
      const { resolve } = payload;
      const response = yield call(comprehensiveDetailBaseInfo, payload);
      console.log(payload)
      if (response && response.success) {
        if (response.data.completeTime) {
          //根据完成时限是否可以被24整除决定初始化的时候的单位
          const division = Math.floor((response.data.completeTime) / 24);
          const residue = (response.data.completeTime) % 24;
          if (residue) {
            response.data.unit = 'hour';
          } else {
            response.data.completeTime = division;
            response.data.unit = 'day';
          }
        }
        resolve({ data: response.data ? response.data : {} })
      } else {
        resolve({ data: {} })
      }
    },
    //删除
    *comprehensiveDeleteFetch({ payload }, { call, put }) {
      const response = yield call(comprehensiveDelete, payload);
      if (payload.leader === 1) {
        if (response && response.success) {
          message.success(response.msg);
          closeAnimated();
          const responseResult = yield call(comprehensiveListBaseInfo, payload.leaderList);
          if (responseResult && responseResult.success) {
            for (let i = 0; i < responseResult.page.list.length; i++) {
              responseResult.page.list[i].key = responseResult.page.list[i].id + '/' + responseResult.page.list[i].workOrderStatus;
            }
            yield put({
              type: 'queryComprehensiveList',
              payload: {
                list: Array.isArray(response.page.list) ? response.page.list : [],
                total: response.page.total,
              },
            });
          } else {
            message.error(responseResult.msg ? responseResult.msg : (responseResult.message ? responseResult.message : '数据加载失败'))
          }
        } else {
          message.info(response.msg);
        }
      } else if (payload.leader === 2) {
        if (response && response.success) {
          message.success(response.msg);
          yield put(routerRedux.push('/department/Comprehensive/list'));
        } else {
          message.error(response.msg);
        }
      }
    },
    //综合执法 处理程序--进入页面就请求
    *processingProgramAllFetch({ payload }, { call, put }) {
      const { resolve } = payload;
      if (payload.id) {
        const res = yield call(comprehensiveDetailBaseInfo, { id: payload.id });
        let resultBigClass = [], resultSmallClass = [];
        const response = yield call(processingProgram, {});
        if (response && response.success) {
          if (res.data.processingProgram) {
            const bigClassList = yield call(bigClass, {
              typeCode: res.data.processingProgram
            });
            resultBigClass = bigClassList.list ? bigClassList.list : [];
            if (res.data.processingProgram && res.data.caseBigType) {
              const smallClassList = yield call(smallClass, {
                largeClassCode: res.data.caseBigType
              });
              resultSmallClass = smallClassList.list ? smallClassList.list : []
            }
          }
        }
        resolve({
          processingProgramList: response.list ? response.list : {},
          bigClassList: resultBigClass,
          smallClassList: resultSmallClass,
        })
      } else {
        const res = yield call(processingProgram, {});
        resolve({
          processingProgramList: res.list ? res.list : {},
          bigClassList: [],
          smallClassList: [],
        })
      }
    },
    //派单
    *comprehensiveDispatchFetch({ payload }, { call, put }) {
      const response = yield call(sendOrders, payload);
      console.log(response, payload)
      if (payload.leader === 1) {
        if (response && response.success) {
          message.success(response.msg);
          closeAnimated();
          const responseResult = yield call(comprehensiveListBaseInfo, payload.leaderList);
          if (responseResult && responseResult.success) {
            for (let i = 0; i < responseResult.page.list.length; i++) {
              responseResult.page.list[i].key = responseResult.page.list[i].id + '/' + responseResult.page.list[i].workOrderStatus;
            }
            yield put({
              type: 'queryComprehensiveList',
              payload: {
                list: Array.isArray(response.page.list) ? response.page.list : [],
                total: response.page.total,
              },
            });
          } else {
            message.error(responseResult.msg ? responseResult.msg : (responseResult.message ? responseResult.message : '数据加载失败'))
          }
        } else {
          message.info(response.msg);
        }
      } else if (payload.leader === 2) {
        if (response && response.success) {
          message.success(response.msg);
          yield put(routerRedux.push('/department/Comprehensive/list'));
        } else {
          message.error(response.msg);
        }
      }
    },
    //退回
    *comprehensiveReturnFetch({ payload }, { call, put }) {
      const response = yield call(comprehensiveReturn, payload);
      if (payload.leader === 1) {
        if (response && response.success) {
          message.success(response.msg);
          closeAnimated();
          const responseResult = yield call(comprehensiveListBaseInfo, payload.leaderList);
          if (responseResult && responseResult.success) {
            for (let i = 0; i < responseResult.page.list.length; i++) {
              responseResult.page.list[i].key = responseResult.page.list[i].id + '/' + responseResult.page.list[i].workOrderStatus;
            }
            yield put({
              type: 'queryComprehensiveList',
              payload: {
                list: Array.isArray(response.page.list) ? response.page.list : [],
                total: response.page.total,
              },
            });
          } else {
            message.error(responseResult.msg ? responseResult.msg : (responseResult.message ? responseResult.message : '数据加载失败'))
          }
        } else {
          message.info(response.msg);
        }
      } else if (payload.leader === 2) {
        if (response && response.success) {
          message.success(response.msg);
          yield put(routerRedux.push('/department/Comprehensive/list'));
        } else {
          message.error(response.msg);
        }
      }
    },
    //废案
    *comprehensiveWasteCaseFetch({ payload }, { call, put }) {
      const response = yield call(comprehensiveWasteCase, payload);
      if (payload.leader === 1) {
        if (response && response.success) {
          message.success(response.msg);
          closeAnimated();
          const responseResult = yield call(comprehensiveListBaseInfo, payload.leaderList);
          if (responseResult && responseResult.success) {
            for (let i = 0; i < responseResult.page.list.length; i++) {
              responseResult.page.list[i].key = responseResult.page.list[i].id + '/' + responseResult.page.list[i].workOrderStatus;
            }
            yield put({
              type: 'queryComprehensiveList',
              payload: {
                list: Array.isArray(response.page.list) ? response.page.list : [],
                total: response.page.total,
              },
            });
          } else {
            message.error(responseResult.msg ? responseResult.msg : (responseResult.message ? responseResult.message : '数据加载失败'))
          }
        } else {
          message.info(response.msg);
        }
      } else if (payload.leader === 2) {
        if (response && response.success) {
          message.success(response.msg);
          yield put(routerRedux.push('/department/Comprehensive/list'));
        } else {
          message.error(response.msg);
        }
      }
    },
    //追回
    *comprehensiveRecoverFetch({ payload }, { call, put }) {
      const response = yield call(comprehensiveRecover, payload);
      if (payload.leader === 1) {
        if (response && response.success) {
          message.success(response.msg);
          closeAnimated();
          const responseResult = yield call(comprehensiveListBaseInfo, payload.leaderList);
          if (responseResult && responseResult.success) {
            for (let i = 0; i < responseResult.page.list.length; i++) {
              responseResult.page.list[i].key = responseResult.page.list[i].id + '/' + responseResult.page.list[i].workOrderStatus;
            }
            yield put({
              type: 'queryComprehensiveList',
              payload: {
                list: Array.isArray(response.page.list) ? response.page.list : [],
                total: response.page.total,
              },
            });
          } else {
            message.error(responseResult.msg ? responseResult.msg : (responseResult.message ? responseResult.message : '数据加载失败'))
          }
        } else {
          message.info(response.msg);
        }
      } else if (payload.leader === 2) {
        if (response && response.success) {
          message.success(response.msg);
          yield put(routerRedux.push('/department/Comprehensive/list'));
        } else {
          message.error(response.msg);
        }
      }
    },
    //复核
    *comprehensiveReviewFetch({ payload }, { call, put }) {
      const response = yield call(comprehensiveReview, payload);
      if (payload.leader === 1) {
        if (response && response.success) {
          message.success(response.msg);
          closeAnimated();
          const responseResult = yield call(comprehensiveListBaseInfo, payload.leaderList);
          if (responseResult && responseResult.success) {
            for (let i = 0; i < responseResult.page.list.length; i++) {
              responseResult.page.list[i].key = responseResult.page.list[i].id + '/' + responseResult.page.list[i].workOrderStatus;
            }
            yield put({
              type: 'queryComprehensiveList',
              payload: {
                list: Array.isArray(response.page.list) ? response.page.list : [],
                total: response.page.total,
              },
            });
          } else {
            message.error(responseResult.msg ? responseResult.msg : (responseResult.message ? responseResult.message : '数据加载失败'))
          }
        } else {
          message.info(response.msg);
        }
      } else if (payload.leader === 2) {
        if (response && response.success) {
          message.success(response.msg);
          yield put(routerRedux.push('/department/Comprehensive/list'));
        } else {
          message.error(response.msg);
        }
      }
    },
    //确认结案
    *comprehensiveCloseCaseFetch({ payload }, { call, put }) {
      const response = yield call(comprehensiveCloseCase, payload);
      if (payload.leader === 1) {
        if (response && response.success) {
          message.success(response.msg);
          closeAnimated();
          const responseResult = yield call(comprehensiveListBaseInfo, payload.leaderList);
          if (responseResult && responseResult.success) {
            for (let i = 0; i < responseResult.page.list.length; i++) {
              responseResult.page.list[i].key = responseResult.page.list[i].id + '/' + responseResult.page.list[i].workOrderStatus;
            }
            yield put({
              type: 'queryComprehensiveList',
              payload: {
                list: Array.isArray(response.page.list) ? response.page.list : [],
                total: response.page.total,
              },
            });
          } else {
            message.error(responseResult.msg ? responseResult.msg : (responseResult.message ? responseResult.message : '数据加载失败'))
          }
        } else {
          message.info(response.msg);
        }
      } else if (payload.leader === 2) {
        if (response && response.success) {
          message.success(response.msg);
          yield put(routerRedux.push('/department/Comprehensive/list'));
        } else {
          message.error(response.msg);
        }
      }
    },
    *clear(_, { call, put }) {
      yield put({
        type: 'init',
        payload: {},
      })
    },
    //申请延期
    *comprehensiveExtendFetch({ payload }, { call, put }) {
      const response = yield call(ComprehensiveExtend, payload);
      console.log(response)
      if (payload.leader === 1) {
        if (response && response.success) {
          message.success(response.msg);
          closeAnimated();
          const responseResult = yield call(comprehensiveListBaseInfo, payload.leaderList);
          if (responseResult && responseResult.success) {
            for (let i = 0; i < responseResult.page.list.length; i++) {
              responseResult.page.list[i].key = responseResult.page.list[i].id + '/' + responseResult.page.list[i].workOrderStatus;
            }
            yield put({
              type: 'queryComprehensiveList',
              payload: {
                list: Array.isArray(response.page.list) ? response.page.list : [],
                total: response.page.total,
              },
            });
          } else {
            message.error(responseResult.msg ? responseResult.msg : (responseResult.message ? responseResult.message : '数据加载失败'))
          }
        } else {
          message.info(response.msg);
        }
      } else if (payload.leader === 2) {
        if (response && response.success) {
          message.success(response.msg);
          yield put(routerRedux.push('/department/Comprehensive/list'));
        } else {
          message.error(response.msg);
        }
      }
    },
    //申请结案
    *comprehensiveEndFetch({ payload }, { call, put }) {
      const response = yield call(ComprehensiveEnd, payload);
      console.log(response, payload)
      if (payload.leader === 1) {
        if (response && response.success) {
          message.success(response.msg);
          closeAnimated();
          const responseResult = yield call(comprehensiveListBaseInfo, payload.leaderList);
          if (responseResult && responseResult.success) {
            for (let i = 0; i < responseResult.page.list.length; i++) {
              responseResult.page.list[i].key = responseResult.page.list[i].id + '/' + responseResult.page.list[i].workOrderStatus;
            }
            yield put({
              type: 'queryComprehensiveList',
              payload: {
                list: Array.isArray(response.page.list) ? response.page.list : [],
                total: response.page.total,
              },
            });
          } else {
            message.error(responseResult.msg ? responseResult.msg : (responseResult.message ? responseResult.message : '数据加载失败'))
          }
        } else {
          message.info(response.msg);
        }
      } else if (payload.leader === 2) {
        if (response && response.success) {
          message.success(response.msg);
          yield put(routerRedux.push('/department/Comprehensive/list'));
        } else {
          message.error(response.msg);
        }
      }
    },
  },

  reducers: {
    init(state, { payload }) {
      return {
        ...state,
        comprehensiveDetail: payload,
      };
    },
    queryComprehensiveList(state, { payload }) {
      return {
        ...state,
        comprehensiveList: {
          list: payload.list,
          total: payload.total,
        },
      };
    },
    lists(state, { payload }) {
      return {
        ...state,
        comprehensiveList: payload,
      };
    },
  }
}
