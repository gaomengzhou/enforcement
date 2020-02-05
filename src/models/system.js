import {message} from 'antd';

import {Dictionary,DictionaryList,AddDicCat,EditDicCat,DelDicCat,AddMyDic,EditMyDic,DelMyDic} from '@/services/system';
export default {
  namespace: 'system',
  state: {
    dictionaryLists:[],
    eachDicList:{
      list:[],
      total:0,
    },
    cpuDetail:{},
    errorLogList:{
      list:[],
      total:0,
    },
    errorLogDetail:{},
    visitLogList:{
    		list:[],
        total:0,
    },
    visitLogDetail:{},
    urlLogLists:{},
    homeStatistics:{},
  },

  effects: {
    *login({payload},{call,put}){
      const response = yield call(Login, payload)
    },
    *homeStatisticsFetch({ payload }, { call, put }) {
      const {resolve} = payload
      const response=yield call(homeStatistics, payload);
      if(response&&response.success){
         resolve({data: Array.isArray( response.map) ?  response.map:[]})
      }else{
         message.error(response.msg)
      }
    },
    *homeStatisticsFetch({ payload }, { call, put }) {
      const {resolve} = payload
      const response=yield call(homeStatistics, payload);
      if(response&&response.success){
         resolve({data:response.map})
      }else{
         message.error(response.msg)
      }
    },



    *dictionary({payload}, { call, put }) {
      const response = yield call(Dictionary);
      const {resolve} = payload
      if(response&&response.success){
        for(let i=0;i<response.data.length;i++){
          response.data[i].key=i+1
          // response.page.list[i].key=response.page.list[i].dictentryid
        }
        resolve({
          data:Array.isArray(response.data) ? response.data:[]
        })
      }
    },
    *addDicCat({payload},{call,put}){
      const {resolve} = payload
      const response=yield call(AddDicCat,payload.data)
      if(response&&response.success){
        message.success('添加成功')
        const result = yield call(Dictionary);
        if(result&&result.success){
          for(let i=0;i<result.data.length;i++){
            result.data[i].key=i+1
          }
          resolve({data:Array.isArray(result.data) ? result.data:[]})
        }
      }else{
        message.error('添加失败')
      }
    },
    *editDicCat({payload},{call,put}){
      const {resolve} = payload
      const response=yield call(EditDicCat,payload.data)
      if(response&&response.success){
        message.success('修改成功')
        const result = yield call(Dictionary);
        if(result&&result.success){
          for(let i=0;i<result.data.length;i++){
            result.data[i].key=i+1
          }
          resolve({data:Array.isArray(result.data) ? result.data:[]})
        }
      }else{
        message.error('修改失败')
      }
    },
    *delDicCat({payload},{call,put}){
      const {resolve} = payload
      const response=yield call(DelDicCat,payload)
      if(response&&response.success){
        message.success('删除成功')
        const result = yield call(Dictionary);
        if(result&&result.success){
          for(let i=0;i<result.data.length;i++){
            result.data[i].key=i+1
          }
          resolve({data:Array.isArray(result.data) ? result.data:[]})
        }
      }else{
        message.error('删除失败')
      }
    },
    *addMyDic({payload},{call,put}){
      const {resolve} = payload
      const response=yield call(AddMyDic,payload.data)
      if(response&&response.success){
        message.success('添加成功')
        const result = yield call(DictionaryList,payload.list);
        if(result&&result.success){
          for(let i=0;i<result.page.list.length;i++){
            result.page.list[i].key=(payload.list.pageNum-1)*(payload.list.pageSize)+i+1
          }
          resolve({data:{
            list:Array.isArray(result.page.list) ? result.page.list:[],
            total:result.page.total,
          }})
        }
      }else{
        message.error('添加失败')
      }
    },
    *editMyDic({payload},{call,put}){
      const {resolve} = payload
      const response=yield call(EditMyDic,payload.data)
      if(response&&response.success){
        message.success('修改成功')
        const result = yield call(DictionaryList,payload.list);
        if(result&&result.success){
          for(let i=0;i<result.page.list.length;i++){
            result.page.list[i].key=(payload.list.pageNum-1)*payload.list.pageSize+i+1
          }
          resolve({data:{
            list:Array.isArray(result.page.list) ? result.page.list:[],
            total:result.page.total,
          }})
        }
      }else{
        message.error('修改失败')
      }
    },
    *delMyDic({payload},{call,put}){
      const {resolve} = payload
      const response=yield call(DelMyDic,payload.data)
      if(response&&response.success){
        message.success('删除成功')
        const result = yield call(DictionaryList,payload.list);
        if(result&&result.success){
          for(let i=0;i<result.page.list.length;i++){
            result.page.list[i].key=(payload.list.pageNum-1)*payload.list.pageSize+i+1
          }
          resolve({data:{
            list:Array.isArray(result.page.list) ? result.page.list:[],
            total:result.page.total,
          }})
        }
      }else{
        message.error('删除失败')
      }
    },
    *dicLists({payload}, { call, put }) {
      const {resolve} = payload
      const response = yield call(DictionaryList,payload);
      if(response&&response.success){
        for(let i=0;i<response.page.list.length;i++){
           response.page.list[i].key=(payload.pageNum-1)*10+i+1
          // response.page.list[i].key=response.page.list[i].dictentryid
        }
        resolve({data:{
          list:Array.isArray(response.page.list) ? response.page.list:[],
          total:response.page.total,
        }})
      }
    },
  },

  reducers: {
    dictionaryList(state, { payload }) {
      return {
        ...state,
        dictionaryLists:payload,
      };
    },
    dicList(state, { payload }) {
      return {
        ...state,
        eachDicList:{
          list:payload.list,
          total:payload.total,
        },
      };
    },
    queryDetailCpuList(state, action) {
      return {
        ...state,
        cpuDetail: action.payload,
      };
    },
    listError(state, { payload }) {
      return {
        ...state,
        errorLogList:{
          list:payload.list,
          total:payload.total,
        },
      };
    },
    queryDetailErrorLogList(state, action) {
      return {
        ...state,
        errorLogDetail: action.payload,
      };
    },
    queryListVisit(state, { payload }) {
      return {
        ...state,
        visitLogList:{
          list:payload.list,
          total:payload.total,
        },
      };
    },
    queryDetailVisitLogList(state, action) {
      return {
        ...state,
        visitLogDetail: action.payload,
      };
    },
    urlLog(state,action){
      return {
        ...state,
        urlLogLists: action.payload,
      };
    },
    queryHomeStatistics(state,action){
      return {
        ...state,
        homeStatistics: action.payload,
      };
    },
  },
};
