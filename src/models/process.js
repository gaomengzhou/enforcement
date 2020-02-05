import {processList,latestOpinionsProcessing} from '@/services/workOrder';
import { message } from 'antd/lib/index';

export default {
  namespace:'process',
  state:{
    pageList:{
      list:[],
    },
    latestOpinionsList:{
      list:[],
    },
  },
  effects:{
    *list({payload},{call,put}){
      const response=yield call(processList,payload);
      if(response && response.success){
        for(let i = 0;i < response.list.length; i++){
          response.list[i].key = response.list[i].id;
        }
        yield put({
          type: 'lists',
          payload: {
            list: Array.isArray(response.list) ? response.list : [],
          },
        });
      }else{
        message.error(response.msg?response.msg:(response.message?response.message:'数据加载失败'))
      }
    },
    *latestOpinions({payload},{call,put}){
      const response = yield call(latestOpinionsProcessing, payload);
      if(response && response.success){
        for(let i = 0;i < response.list.length; i++){
          response.list[i].key = response.list[i].id;
        }
        yield put({
          type: 'querylatestOpinions',
          payload: {
            list: Array.isArray(response.list) ? response.list : [],
          },
        });
      }else{
        message.error(response.msg?response.msg:(response.message?response.message:'数据加载失败'))
      }
    },
  },
  reducers:{
    lists(state,{payload}){
      return{
        ...state,
        pageList:payload,
      }
    },
    querylatestOpinions(state, { payload }) {
      return {
        ...state,
        latestOpinionsList:{
          list: payload.list,
        },
      };
    },
  }
}
