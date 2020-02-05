import { message } from 'antd';
import { routerRedux } from 'dva/router';
import {
  complainListBaseInfo,
  complainDetailBaseInfo,
  complainAddBaseInfo,
  complainListDeleteBaseInfo,
  complainUpdateBaseInfo, complainDispatch,complainWasteCase,complainCloseCase,complainGoBack,complainReview
} from '@/services/workOrder';
import closeAnimated from './../utils/closeAnimated';
export default {
  namespace:'complain',
  state:{
    complainList: {
      list: [],
      total: 0,
    },
  },
  effects:{
    //投诉工单列表
    *listComplainFetch({ payload }, { call, put }) {
      const response = yield call(complainListBaseInfo, payload);
      if(response && response.success){
        for(let i = 0;i < response.page.list.length; i++){
          response.page.list[i].key = response.page.list[i].id + '/' +response.page.list[i].workOrderStatus;
        }
        yield put({
          type: 'queryComplainList',
          payload: {
            list: Array.isArray(response.page.list) ? response.page.list : [],
            total: response.page.total,
          },
        });
      }else{
        message.error(responseResult.msg?responseResult.msg:(responseResult.message?responseResult.message:'数据加载失败'))
      }
    },
    //人员基本信息--删除
    *listComplainDeleteFetch({ payload }, { call, put }) {
      const response = yield call(complainListDeleteBaseInfo, payload);
      if(payload.leader === 1){
        if(response&&response.success){
          message.success(response.msg);
          closeAnimated();
          const responseResult = yield call(complainListBaseInfo, payload.leaderList);
          if(responseResult && responseResult.success){
            for(let i = 0;i < responseResult.page.list.length; i++){
              responseResult.page.list[i].key = responseResult.page.list[i].id + '/' +responseResult.page.list[i].workOrderStatus;
            }
            yield put({
              type: 'queryComplainList',
              payload: {
                list: Array.isArray(responseResult.page.list) ? responseResult.page.list : [],
                total: responseResult.page.total,
              },
            });
          }else{
            message.error(responseResult.msg?responseResult.msg:(responseResult.message?responseResult.message:'数据加载失败'))
          }
        }else{
          message.info(response.msg);
        }
      }else if(payload.leader === 2){
        if(response&&response.success){
          message.success(response.msg);
          yield put(routerRedux.push('/department/complain/list'));
        }else{
          message.error(response.msg);
        }
      }
    },
    //投诉工单详情
    *listComplainDetailFetch({payload},{call,put}){
      const {resolve} = payload;
      const response=yield call(complainDetailBaseInfo,payload);
      if(response&&response.success){
        resolve({data:response.data?response.data:{}})
      }else{
        resolve({data:{}})
      }
    },
    //投诉工单--添加
    *addComplainDetailFetch({ payload }, { call, put }) {
      const response = yield call(complainAddBaseInfo, payload);
      if(response&&response.success){
        message.success(response.msg);
        yield put(routerRedux.push('/department/complain/list'));
      }else{
        message.info(response.msg);
      }
    },
    //投诉工单更新
    *updateComplainDetailFetch({ payload }, { call, put }) {
      const response = yield call(complainUpdateBaseInfo, payload);
      if(payload.leader === 1){
        if(response&&response.success){
          message.success(response.msg);
          closeAnimated();
          const responseResult = yield call(complainListBaseInfo, payload.leaderList);
          if(responseResult && responseResult.success){
            for(let i = 0;i < responseResult.page.list.length; i++){
              responseResult.page.list[i].key = responseResult.page.list[i].id + '/' +responseResult.page.list[i].workOrderStatus;
            }
            yield put({
              type: 'queryComplainList',
              payload: {
                list: Array.isArray(responseResult.page.list) ? responseResult.page.list : [],
                total: responseResult.page.total,
              },
            });
          }else{
            message.error(responseResult.msg?responseResult.msg:(responseResult.message?responseResult.message:'数据加载失败'))
          }
        }else{
          message.info(response.msg);
        }
      }else if(payload.leader === 2){
        if(response&&response.success){
          message.success(response.msg);
          yield put(routerRedux.push('/department/complain/list'));
        }else{
          message.error(response.msg);
        }
      }
    },
    //派单
    *dispatchFetch({ payload }, { call, put }){
      const response = yield call(complainDispatch, payload);
      if(payload.leader === 1){
        if(response&&response.success){
          message.success(response.msg);
          closeAnimated();
          const responseResult = yield call(complainListBaseInfo, payload.leaderList);
          if(responseResult && responseResult.success){
            for(let i = 0;i < responseResult.page.list.length; i++){
              responseResult.page.list[i].key = responseResult.page.list[i].id + '/' +responseResult.page.list[i].workOrderStatus;
            }
            yield put({
              type: 'queryComplainList',
              payload: {
                list: Array.isArray(responseResult.page.list) ? responseResult.page.list : [],
                total: responseResult.page.total,
              },
            });
          }else{
            message.error(responseResult.msg?responseResult.msg:(responseResult.message?responseResult.message:'数据加载失败'))
          }
        }else{
          message.info(response.msg);
        }
      }else if(payload.leader === 2){
        if(response&&response.success){
          message.success(response.msg);
          yield put(routerRedux.push('/department/complain/list'));
        }else{
          message.error(response.msg);
        }
      }
    },
    //废案
    *complainWasteCaseFetch({ payload }, { call, put }){
      const response = yield call(complainWasteCase, payload);
      if(payload.leader === 1){
        if(response&&response.success){
          message.success(response.msg);
          closeAnimated();
          const responseResult = yield call(complainListBaseInfo, payload.leaderList);
          if(responseResult && responseResult.success){
            for(let i = 0;i < responseResult.page.list.length; i++){
              responseResult.page.list[i].key = responseResult.page.list[i].id + '/' +responseResult.page.list[i].workOrderStatus;
            }
            yield put({
              type: 'queryComplainList',
              payload: {
                list: Array.isArray(responseResult.page.list) ? responseResult.page.list : [],
                total: responseResult.page.total,
              },
            });
          }else{
            message.error(responseResult.msg?responseResult.msg:(responseResult.message?responseResult.message:'数据加载失败'))
          }
        }else{
          message.info(response.msg);
        }
      }else if(payload.leader === 2){
        if(response&&response.success){
          message.success(response.msg);
          yield put(routerRedux.push('/department/complain/list'));
        }else{
          message.error(response.msg);
        }
      }
    },
    //结案
    *complainCloseCaseFetch({ payload }, { call, put }){
      const response = yield call(complainCloseCase, payload);
      if(payload.leader === 1){
        if(response&&response.success){
          message.success(response.msg);
          closeAnimated();
          const responseResult = yield call(complainListBaseInfo, payload.leaderList);
          if(responseResult && responseResult.success){
            for(let i = 0;i < responseResult.page.list.length; i++){
              responseResult.page.list[i].key = responseResult.page.list[i].id + '/' +responseResult.page.list[i].workOrderStatus;
            }
            yield put({
              type: 'queryComplainList',
              payload: {
                list: Array.isArray(responseResult.page.list) ? responseResult.page.list : [],
                total: responseResult.page.total,
              },
            });
          }else{
            message.error(responseResult.msg?responseResult.msg:(responseResult.message?responseResult.message:'数据加载失败'))
          }
        }else{
          message.info(response.msg);
        }
      }else if(payload.leader === 2){
        if(response&&response.success){
          message.success(response.msg);
          yield put(routerRedux.push('/department/complain/list'));
        }else{
          message.error(response.msg);
        }
      }
    },
    //退回
    *complainGoBackFetch({ payload }, { call, put }){
      const response = yield call(complainGoBack, payload);
      if(payload.leader === 1){
        if(response&&response.success){
          message.success(response.msg);
          closeAnimated();
          const responseResult = yield call(complainListBaseInfo, payload.leaderList);
          if(responseResult && responseResult.success){
            for(let i = 0;i < responseResult.page.list.length; i++){
              responseResult.page.list[i].key = responseResult.page.list[i].id + '/' +responseResult.page.list[i].workOrderStatus;
            }
            yield put({
              type: 'queryComplainList',
              payload: {
                list: Array.isArray(responseResult.page.list) ? responseResult.page.list : [],
                total: responseResult.page.total,
              },
            });
          }else{
            message.error(responseResult.msg?responseResult.msg:(responseResult.message?responseResult.message:'数据加载失败'))
          }
        }else{
          message.info(response.msg);
        }
      }else if(payload.leader === 2){
        if(response&&response.success){
          message.success(response.msg);
          yield put(routerRedux.push('/department/complain/list'));
        }else{
          message.error(response.msg);
        }
      }
    },
    //复核
    *leaderrReviewFetch({payload},{call,put}){
      const response=yield call(complainReview,payload);
      if(payload.leader === 1){
        if(response&&response.success){
          message.success(response.msg);
          closeAnimated();
          const responseResult = yield call(LeaderList, payload.leaderList);
          if(responseResult&&responseResult.success){
            yield put({
              type:'lists',
              payload:{
                list:responseResult.page.list?responseResult.page.list:[],
                total:responseResult.page.total?responseResult.page.total:0,
              }
            })
          }else{
            message.error(responseResult.msg?responseResult.msg:(responseResult.message?responseResult.message:'数据加载失败'))
          }
        }else{
          message.error(response.msg);
        }
      }else if(payload.leader === 2){
        if(response&&response.success){
          message.success(response.msg);
          yield put(routerRedux.push('/Leader/List'))
        }else{
          message.error(response.msg);
        }
      }
    },
    *clear(_,{call,put}){
      yield put({
        type:'init',
        payload:{},
      })
    },
  },
  reducers:{
    init(state, { payload }) {
      return {
        ...state,
        complainListDetail:payload,
      };
    },
    queryComplainList(state, { payload }) {
      return {
        ...state,
        complainList: {
          list: payload.list,
          total: payload.total,
        },
      };
    },
  }
}
