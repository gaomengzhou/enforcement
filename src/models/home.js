import { toDolist, statistics, statisticsThreshold } from '@/services/home';
import { getService, exportByPost, postService, exportService } from '@/services/serviceApi';
import { message } from 'antd';
export default {
  namespace: 'home',
  state: {
    todoList: {
      list: [],
      total: 0,
    },
    positionList: [],
    statisticsList: {
      list: [],
    }
  },
  effects: {
    *querTimes({ payload, callback }, { call }) {
      console.log(payload)
      const res = yield call(postService, `/services/enforcement/Intelligence/fun_gen_dispense`, payload);
      callback && callback(res)
    },

    *toDoListFetch({ payload }, { call, put }) {
      const response = yield call(toDolist, payload);
      if (response && response.success) {
        yield put({
          type: 'queryToDoList',
          payload: {
            list: response.page.list ? response.page.list : [],
            total: response.page.total ? response.page.total : 0,
          }
        })
      } else {
        message.error('数据加载失败')
      }
    },
    *statisticsFetch({ payload }, { call, put }) {
      const response = yield call(statistics, payload);
      if (response) {
        yield put({
          type: 'queryStatistics',
          payload: {
            list: response.data ? response.data : [],
          }
        })
      } else {
        message.error(response.msg ? response.msg : (response.message ? response.message : '数据加载失败'))
      }
    },
    // *statisticsThresholdFetch({ payload }, { call, put }) {
    //   const response = yield call(statisticsThreshold, payload.orderThreshold);
    //   if (response && response.success) {
    //     const result = yield call(statistics, payload.date);
    //     if (result && result.success) {
    //       yield put({
    //         type: 'queryStatistics',
    //         payload: {
    //           list: result.list ? result.list : [],
    //         }
    //       })
    //     } else {
    //       message.error(result.msg ? result.msg : (result.message ? result.message : '数据加载失败'));
    //     }
    //   } else {
    //     message.error(response.msg);
    //   }
    // },
    *statisticsThresholdFetchs({ payload, callback }, { call, put }) {
      const res = yield call(postService, '/services/enforcement/Intelligence/update_ps', payload);
      console.log(res);
      callback && callback(res)
    },

    *getauthInfo({ payload, callback }, { call, put }) {
      const res = yield call(getService, `/services/security/authInfo`);
      res && callback(res);
    },
    *getuserRole({ payload, callback }, { call, put }) {
      const res = yield call(getService, `/services/enforcement/role/getUserRole/${payload.id}`);
      res && callback(res);
    },
    //获取待办事项表单数据
    *getTodoList({ payload, callback }, { call, put }) {
      const res = yield call(getService, `/services/enforcement/homePage/getList/${payload.page}/${payload.pageSize}/${payload.role}`);
      res && callback(res);
    },
    //用户信息表单数据
    *getUserList({ payload, callback }, { call, put }) {
      const res = yield call(getService, `/services/enforcement/homePage/findAllList/${payload.role}`);
      res && callback(res);
    },
    //用户信息
    *getUserInfo({ payload, callback }, { call, put }) {
      const res = yield call(getService, `/services/enforcement/homePage/findByUserId`);
      res && callback(res);
    },

    //用户定位信息
    *getUserPosition({ payload, callback }, { call, put }) {
      const res = yield call(getService, `/services/enforcement/position/getAllPosition`);
      // yield put({
      //   type: 'savePosition',
      //   payload: response.list ? response.list : [],
      // })
      // console.log(res);
      res.list && callback(res.list);
      // console.log('11111');
    },

  },
  reducers: {
    goChange(state, { payload }) {
      return {
        ...state,
        statisticsList: payload,
      }
    },
    savePosition(state, { payload }) {
      return {
        ...state,
        positionList: payload,
      }
    },
    queryToDoList(state, { payload }) {
      return {
        ...state,
        todoList: payload,
      };
    },
    queryStatistics(state, { payload }) {
      return {
        ...state,
        statisticsList: payload,
      };
    },
  },
};
