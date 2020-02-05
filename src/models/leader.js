import { message } from 'antd';
import { routerRedux } from 'dva/router'
import {
  LeaderList, LeaderDetail, LeaderDelete, LeaderAdd, LeaderUpdate,
  LeaderDispatch, LeaderWasteCase, LeaderReview, LeaderCloseCase, LeaderReturn,
  leaderCheckComplete, leaderarrange,
} from '@/services/workOrder';
import closeAnimated from './../utils/closeAnimated';
export default {
  namespace: 'leader',
  state: {
    leaderList: {
      list: [],
      total: 0,
    },
    leaderDetail: {},

  },
  effects: {
    *list({ payload }, { call, put }) {
      const response = yield call(LeaderList, payload);
      // if(response && response.success){
      //   for(let i = 0;i < response.page.list.length; i++){
      //     response.page.list[i].key = response.page.list[i].id + '/' +response.page.list[i].workOrderStatus;
      //   }
      //   yield put({
      //     type: 'lists',
      //     payload: {
      //       list: Array.isArray(response.page.list) ? response.page.list : [],
      //       total: response.page.total,
      //     },
      //   });
      // }else{
      //   message.error(response.msg?response.msg:(response.message?response.message:'数据加载失败'))
      // }
      if (response && response.success) {
        yield put({
          type: 'lists',
          payload: {
            list: response.page.list ? response.page.list : [],
            total: response.page.total ? response.page.total : 0,
          }
        })
      } else {
        message.error(response.msg ? response.msg : (response.message ? response.message : '数据加载失败'))
      }
    },
    *add({ payload }, { call, put }) {
      const response = yield call(LeaderAdd, payload);
      if (response && response.success) {
        message.success('添加成功');
        yield put(routerRedux.push('/Leader/List'))
      } else {
        message.error('添加失败');
      }
    },
    *update({ payload }, { call, put }) {
      const response = yield call(LeaderUpdate, payload);
      if (payload.leader === 1) {
        if (response && response.success) {
          message.success('修改成功');
          closeAnimated();
          const responseResult = yield call(LeaderList, payload.leaderList);
          if (responseResult && responseResult.success) {
            yield put({
              type: 'lists',
              payload: {
                list: responseResult.page.list ? responseResult.page.list : [],
                total: responseResult.page.total ? responseResult.page.total : 0,
              }
            })
          } else {
            message.error(responseResult.msg ? responseResult.msg : (responseResult.message ? responseResult.message : '数据加载失败'))
          }
        } else {
          message.error('修改失败');
        }
      } else if (payload.leader === 2) {
        if (response && response.success) {
          message.success('修改成功');
          yield put(routerRedux.push('/Leader/List'));
        } else {
          message.error('修改失败');
        }
      }

    },
    *detail({ payload }, { call, put }) {
      const { resolve } = payload;
      const response = yield call(LeaderDetail, payload);
      if (response && response.success) {
        if (response.data.completeTime) {
          //根据完成时限是否可以被24整除决定初始化的时候的单位
          const division = Math.floor((response.data.completeTime) / 24);
          const residue = (response.data.completeTime) % 24;
          if (residue) {
            response.data.unit = 'hour'
          } else {
            response.data.completeTime = division;
            response.data.unit = 'day'
          }
        }
        resolve({ data: response.data ? response.data : {} })
      } else {
        resolve({ data: {} })
      }
    },
    *delete({ payload }, { call, put }) {
      const response = yield call(LeaderDelete, payload);
      if (payload.leader === 1) {
        if (response && response.success) {
          message.success(response.msg);
          closeAnimated();
          const responseResult = yield call(LeaderList, payload.leaderList);
          if (responseResult && responseResult.success) {
            yield put({
              type: 'lists',
              payload: {
                list: responseResult.page.list ? responseResult.page.list : [],
                total: responseResult.page.total ? responseResult.page.total : 0,
              }
            })
          } else {
            message.error(responseResult.msg ? responseResult.msg : (responseResult.message ? responseResult.message : '数据加载失败'))
          }
        } else {
          message.error(response.msg);
        }
      } else if (payload.leader === 2) {
        if (response && response.success) {
          message.success(response.msg);
          yield put(routerRedux.push('/Leader/List'))
        } else {
          message.error(response.msg);
        }
      }
    },
    //派单
    *leaderDispatchFetch({ payload }, { call, put }) {
      const response = yield call(LeaderDispatch, payload);
      if (payload.leader === 1) {
        if (response && response.success) {
          message.success(response.msg);
          closeAnimated();
          const responseResult = yield call(LeaderList, payload.leaderList);
          if (responseResult && responseResult.success) {
            yield put({
              type: 'lists',
              payload: {
                list: responseResult.page.list ? responseResult.page.list : [],
                total: responseResult.page.total ? responseResult.page.total : 0,
              }
            })
          } else {
            message.error(responseResult.msg ? responseResult.msg : (responseResult.message ? responseResult.message : '数据加载失败'))
          }
        } else {
          message.error(response.msg);
        }
      } else if (payload.leader === 2) {
        if (response && response.success) {
          message.success(response.msg);
          yield put(routerRedux.push('/Leader/List'))
        } else {
          message.error(response.msg);
        }
      }
    },
    // 领导交办 审核通过
    *leaderCheckCompletes({ payload }, { call, put }) {
      const response = yield call(leaderCheckComplete, payload);
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
        yield put(routerRedux.push('/Leader/List'))
      } else {
        message.error(response.msg ? response.msg : (response.message ? response.message : '数据加载失败'))
      }
    },
    // 领导交办 安排
    *leaderarranges({ payload }, { call, put }) {
      const response = yield call(leaderarrange, payload);
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
        routerRedux.push('/Leader/List')
      } else {
        message.error(response.msg ? response.msg : (response.message ? response.message : '数据加载失败'))
      }
    },
    //废案
    *leaderrWasteCaseFetch({ payload }, { call, put }) {
      const response = yield call(LeaderWasteCase, payload);
      if (payload.leader === 1) {
        if (response && response.success) {
          message.success(response.msg);
          closeAnimated();
          const responseResult = yield call(LeaderList, payload.leaderList);
          if (responseResult && responseResult.success) {
            yield put({
              type: 'lists',
              payload: {
                list: responseResult.page.list ? responseResult.page.list : [],
                total: responseResult.page.total ? responseResult.page.total : 0,
              }
            })
          } else {
            message.error(responseResult.msg ? responseResult.msg : (responseResult.message ? responseResult.message : '数据加载失败'))
          }
        } else {
          message.error(response.msg);
        }
      } else if (payload.leader === 2) {
        if (response && response.success) {
          message.success(response.msg);
          yield put(routerRedux.push('/Leader/List'))
        } else {
          message.error(response.msg);
        }
      }
    },
    //复核
    *leaderrReviewFetch({ payload }, { call, put }) {
      const response = yield call(LeaderReview, payload);
      if (payload.leader === 1) {
        if (response && response.success) {
          message.success(response.msg);
          closeAnimated();
          const responseResult = yield call(LeaderList, payload.leaderList);
          if (responseResult && responseResult.success) {
            yield put({
              type: 'lists',
              payload: {
                list: responseResult.page.list ? responseResult.page.list : [],
                total: responseResult.page.total ? responseResult.page.total : 0,
              }
            })
          } else {
            message.error(responseResult.msg ? responseResult.msg : (responseResult.message ? responseResult.message : '数据加载失败'))
          }
        } else {
          message.error(response.msg);
        }
      } else if (payload.leader === 2) {
        if (response && response.success) {
          message.success(response.msg);
          yield put(routerRedux.push('/Leader/List'))
        } else {
          message.error(response.msg);
        }
      }
    },
    //结案
    *leaderrCloseCaseFetch({ payload }, { call, put }) {
      const response = yield call(LeaderCloseCase, payload);
      if (payload.leader === 1) {
        if (response && response.success) {
          message.success(response.msg);
          closeAnimated();
          const responseResult = yield call(LeaderList, payload.leaderList);
          if (responseResult && responseResult.success) {
            yield put({
              type: 'lists',
              payload: {
                list: responseResult.page.list ? responseResult.page.list : [],
                total: responseResult.page.total ? responseResult.page.total : 0,
              }
            })
          } else {
            message.error(responseResult.msg ? responseResult.msg : (responseResult.message ? responseResult.message : '数据加载失败'))
          }
        } else {
          message.error(response.msg);
        }
      } else if (payload.leader === 2) {
        if (response && response.success) {
          message.success(response.msg);
          yield put(routerRedux.push('/Leader/List'))
        } else {
          message.error(response.msg);
        }
      }
    },
    //退回
    *leaderrReturnFetch({ payload }, { call, put }) {
      const response = yield call(LeaderReturn, payload);
      if (payload.leader === 1) {
        if (response && response.success) {
          message.success(response.msg);
          closeAnimated();
          const responseResult = yield call(LeaderList, payload.leaderList);
          if (responseResult && responseResult.success) {
            yield put({
              type: 'lists',
              payload: {
                list: responseResult.page.list ? responseResult.page.list : [],
                total: responseResult.page.total ? responseResult.page.total : 0,
              }
            })
          } else {
            message.error(responseResult.msg ? responseResult.msg : (responseResult.message ? responseResult.message : '数据加载失败'))
          }
        } else {
          message.error(response.msg);
        }
      } else if (payload.leader === 2) {
        if (response && response.success) {
          message.success(response.msg);
          yield put(routerRedux.push('/Leader/List'))
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
    }
  },

  reducers: {
    init(state, { payload }) {
      return {
        ...state,
        leaderDetail: payload,
      };
    },
    lists(state, { payload }) {
      return {
        ...state,
        leaderList: payload,
      };
    },
    details(state, { payload }) {
      return {
        ...state,
        leaderDetail: payload,
      };
    },

  }
}
