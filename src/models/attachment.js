import {AddAttachment,EditAttachment,AttachmentInfo,AttachmentList,DelAttachment} from '../services/workOrder';

export default {
  namespace:'attachment',
  state:{
     attachmentList:{
       list:[],
       total:0,
     },
  },
  effects:{
    *list({payload},{call,put}){    // 附件列表
      const response=yield call(AttachmentList,payload)
      if(response&&response.success){
        yield put({
          type:'lists',
          payload:{
            list:response.page.list?response.page.list:[],
            total:response.page.total?response.page.total:0
          }
        })
      }else{
        yield put({
          type:'lists',
          payload:{
            list:[],
            total:0
          }
        })
      }
    },
    *add({payload},{call,put}){     // 添加附件

    },
    *update({payload},{call,put}){   // 修改附件

    },
    *delete({payload},{call,put}){    // 删除附件

    },
    *detail({payload},{call,put}){    // 附件详情

    },
  },
  reducers:{
    lists(state,{payload}){
       return{
         ...state,
         attachmentList:payload,
       }
     }
  }
}
