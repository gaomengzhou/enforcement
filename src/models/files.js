import {importComprehensiveFiles,listComprehensiveFiles,deleteComprehensiveFiles,downloadComprehensiveFiles,
  importComplainFiles,listComplainFiles,deleteComplainFiles,
  importInspectorFiles,listInspectorsFiles,deleteInspectorFiles,
  importLeaderFiles,listLeaderFiles,deleteListLeaderFiles,importAddLeaderFiles,listAddLeaderFiles,deleteAddListLeaderFiles,
} from '@/services/files';
import { message } from 'antd/lib/index';
import { complainListBaseInfo, editComplainDataModal } from '../services/workOrder';

export default {
  namespace:'files',
  state:{
    comprehensiveFilesListBefore: {
      list: [],
      total: 0,
    },
    comprehensiveFilesListAfter: {
      list: [],
      total: 0,
    },
    complainFilesListBefore: {
      list: [],
      total: 0,
    },
    complainFilesListAfter: {
      list: [],
      total: 0,
    },
    inspectorsFilesListBefore: {
      list: [],
      total: 0,
    },
    inspectorsListAfter: {
      list: [],
      total: 0,
    },
    leaderListBefore: {
      list: [],
      total: 0,
    },
    leaderListAfter: {
      list: [],
      total: 0,
    },
    addleaderListBefore: {
      list: [],
      total: 0,
    },
    addLeaderListAfter: {
      list: [],
      total: 0,
    },
  },
  effects:{
    //综合执法 附件列表
    *listComprehensiveFilesFetch({ payload }, { call, put }) {
      const response = yield call(listComprehensiveFiles, payload);
      if(payload.flag === 0){
        if(response && response.success){
          yield put({
            type: 'queryComprehensiveListBefore',
            payload: {
              list: Array.isArray(response.page.list) ? response.page.list : [],
              total: response.page.total ? response.page.total : 0,
            },
          });
        }
      }else if(payload.flag === 1){
        if(response && response.success){
          yield put({
            type: 'queryComprehensiveListAfter',
            payload: {
              list: Array.isArray(response.page.list) ? response.page.list : [],
              total: response.page.total ? response.page.total : 0,
            },
          });
        }
      }
    },
    //综合执法 附件删除
    *deleteComprehensiveFilesFetch({ payload }, { call, put }) {
      const response = yield call(deleteComprehensiveFiles, payload);
      if(response&&response.success){
        message.success(response.msg);
        const responseFiles = yield call(listComprehensiveFiles, payload.listBefore);
        const responseFilesAfter = yield call(listComprehensiveFiles, payload.listAfter);
        if(payload.listBefore.flag === 0){
          if(responseFiles && responseFiles.success){
            yield put({
              type: 'queryComprehensiveListBefore',
              payload: {
                list: Array.isArray(responseFiles.page.list) ? responseFiles.page.list : [],
                total: responseFiles.page.total ? responseFiles.page.total : 0,
              },
            });
          }
        }
        if(payload.listAfter.flag === 1){
          if(responseFilesAfter && responseFilesAfter.success){
            yield put({
              type: 'queryComprehensiveListAfter',
              payload: {
                list: Array.isArray(responseFilesAfter.page.list) ? responseFilesAfter.page.list : [],
                total: responseFilesAfter.page.total ? responseFilesAfter.page.total : 0,
              },
            });
          }
        }
      }else{
        message.error(response.msg);
      }
    },
    //综合执法 上传附件
    *importComprehensiveFilesFetch({payload},{call,put}){
      const { resolve } = payload;
      const response = yield call(importComprehensiveFiles,payload.file);
      if(response&&response.success){
        resolve({success:true});
        const responseFiles = yield call(listComprehensiveFiles, payload.listBefore);
        const responseFilesAfter = yield call(listComprehensiveFiles, payload.listAfter);
        if(payload.listBefore.flag === 0){
          if(responseFiles && responseFiles.success){
            yield put({
              type: 'queryComprehensiveListBefore',
              payload: {
                list: Array.isArray(responseFiles.page.list) ? responseFiles.page.list : [],
                total: responseFiles.page.total ? responseFiles.page.total : 0,
              },
            });
          }
        }
        if(payload.listAfter.flag === 1){
          if(responseFilesAfter && responseFilesAfter.success){
            yield put({
              type: 'queryComprehensiveListAfter',
              payload: {
                list: Array.isArray(responseFilesAfter.page.list) ? responseFilesAfter.page.list : [],
                total: responseFilesAfter.page.total ? responseFilesAfter.page.total : 0,
              },
            });
          }
        }
      }else{
        // message.error('导入失败');
        resolve({success:false});
      }
    },
    //综合执法 下载附件
    *downloadComprehensiveFilesFetch({payload},{call,put}){
      const {resolve} = payload;
      const response = yield call(downloadComprehensiveFiles,payload);
      if(response){
        message.success('下载成功');
        const realFileName = response.headers.get('content-disposition').split('fileName=')[1];
        resolve({ blob: response.blob(), fileName: realFileName });
      }else{
        message.error('无法下载');
      }
    },
    //投诉举报 附件列表
    *listComplainFilesFetch({ payload }, { call, put }) {
      const response = yield call(listComplainFiles, payload);
      if(payload.flag === 0){
        if(response && response.success){
          yield put({
            type: 'queryComplainListBefore',
            payload: {
              list: Array.isArray(response.page.list) ? response.page.list : [],
              total: response.page.total ? response.page.total : 0,
            },
          });
        }
      }else if(payload.flag === 1){
        if(response && response.success){
          yield put({
            type: 'queryComplainListAfter',
            payload: {
              list: Array.isArray(response.page.list) ? response.page.list : [],
              total: response.page.total ? response.page.total : 0,
            },
          });
        }
      }
    },
    //投诉工单 上传附件
    *importComplainFilesFetch({payload},{call,put}){
      const { resolve } = payload;
      const response = yield call(importComplainFiles,payload.file);
      if(response&&response.success){
        // message.success('导入成功');
        resolve({success:true});
        const responseFiles = yield call(listComplainFiles, payload.listBefore);
        const responseFilesAfter = yield call(listComplainFiles, payload.listAfter);
        if(payload.listBefore.flag === 0){
          if(responseFiles && responseFiles.success){
            yield put({
              type: 'queryComplainListBefore',
              payload: {
                list: Array.isArray(responseFiles.page.list) ? responseFiles.page.list : [],
                total: responseFiles.page.total ? responseFiles.page.total : 0,
              },
            });
          }
        }
        if(payload.listAfter.flag === 1){
          if(responseFilesAfter && responseFilesAfter.success){
            yield put({
              type: 'queryComplainListAfter',
              payload: {
                list: Array.isArray(responseFilesAfter.page.list) ? responseFilesAfter.page.list : [],
                total: responseFilesAfter.page.total ? responseFilesAfter.page.total : 0,
              },
            });
          }
        }
      }else{
        // message.error('导入失败');
        resolve({success:false})
      }
    },
    //投诉举报 附件删除
    *deleteComplainFilesFetch({ payload }, { call, put }) {
      const response = yield call(deleteComplainFiles, payload);
      if(response&&response.success){
        message.success(response.msg);
        const responseFiles = yield call(listComplainFiles, payload.listBefore);
        const responseFilesAfter = yield call(listComplainFiles, payload.listAfter);
        if(payload.listBefore.flag === 0){
          if(responseFiles && responseFiles.success){
            yield put({
              type: 'queryComplainListBefore',
              payload: {
                list: Array.isArray(responseFiles.page.list) ? responseFiles.page.list : [],
                total: responseFiles.page.total ? responseFiles.page.total : 0,
              },
            });
          }
        }
        if(payload.listAfter.flag === 1){
          if(responseFilesAfter && responseFilesAfter.success){
            yield put({
              type: 'queryComplainListAfter',
              payload: {
                list: Array.isArray(responseFilesAfter.page.list) ? responseFilesAfter.page.list : [],
                total: responseFilesAfter.page.total ? responseFilesAfter.page.total : 0,
              },
            });
          }
        }
      }else{
        message.error(response.msg);
      }
    },
    //城管工单 上传附件
    *importInspectorFilesFetch({payload},{call,put}){
      const { resolve } = payload;
      const response = yield call(importInspectorFiles,payload.file);
      if(response&&response.success){
        resolve({success:true})
        const responseFiles = yield call(listInspectorsFiles, payload.listBefore);
        const responseFilesAfter = yield call(listInspectorsFiles, payload.listAfter);
        if(payload.listBefore.flag === 0){
          if(responseFiles && responseFiles.success){
            yield put({
              type: 'queryInspectorsListBefore',
              payload: {
                list: Array.isArray(responseFiles.page.list) ? responseFiles.page.list : [],
                total: responseFiles.page.total ? responseFiles.page.total : 0,
              },
            });
          }
        }
        if(payload.listAfter.flag === 1){
          if(responseFilesAfter && responseFilesAfter.success){
            yield put({
              type: 'queryInspectorsListAfter',
              payload: {
                list: Array.isArray(responseFilesAfter.page.list) ? responseFilesAfter.page.list : [],
                total: responseFilesAfter.page.total ? responseFilesAfter.page.total : 0,
              },
            });
          }
        }
      }else{
        // message.error('导入失败');
        resolve({success:false})
      }
    },
    //城管工单 附件列表
    *listInspectorsFilesFetch({ payload }, { call, put }) {
      const response = yield call(listInspectorsFiles, payload);
      if(payload.flag === 0){
        if(response && response.success){
          yield put({
            type: 'queryInspectorsListBefore',
            payload: {
              list: Array.isArray(response.page.list) ? response.page.list : [],
              total: response.page.total ? response.page.total : 0,
            },
          });
        }
      }else if(payload.flag === 1){
        if(response && response.success){
          yield put({
            type: 'queryInspectorsListAfter',
            payload: {
              list: Array.isArray(response.page.list) ? response.page.list : [],
              total: response.page.total ? response.page.total : 0,
            },
          });
        }
      }
    },
    //城管工单 附件删除
    *deleteInspectorFilesFetch({ payload }, { call, put }) {
      const response = yield call(deleteInspectorFiles, payload);
      if(response&&response.success){
        message.success(response.msg);
        const responseFiles = yield call(listInspectorsFiles, payload.listBefore);
        const responseFilesAfter = yield call(listInspectorsFiles, payload.listAfter);
        if(payload.listBefore.flag === 0){
          if(responseFiles && responseFiles.success){
            yield put({
              type: 'queryInspectorsListBefore',
              payload: {
                list: Array.isArray(responseFiles.page.list) ? responseFiles.page.list : [],
                total: responseFiles.page.total ? responseFiles.page.total : 0,
              },
            });
          }
        }
        if(payload.listAfter.flag === 1){
          if(responseFilesAfter && responseFilesAfter.success){
            yield put({
              type: 'queryInspectorsListAfter',
              payload: {
                list: Array.isArray(responseFilesAfter.page.list) ? responseFilesAfter.page.list : [],
                total: responseFilesAfter.page.total ? responseFilesAfter.page.total : 0,
              },
            });
          }
        }
      }else{
        message.error(response.msg);
      }
    },
    //领导交办 上传附件 新增
    *importAddLeaderFilesFetch({payload},{call,put}){
      const { resolve } = payload;
      const response = yield call(importAddLeaderFiles,payload.file);
      const{ data } = response;
      if(payload.listBefore&&payload.listBefore.flag === 0 && payload.listBefore.valueRadio === 0){
        if(response&&response.success){
          payload.listBefore.pids = data;
          const responseFiles = yield call(listAddLeaderFiles, payload.listBefore);
          if(responseFiles && responseFiles.success){
            resolve({
              data:{
                list:responseFiles.page.list?responseFiles.page.list :[],
                total:responseFiles.page.total?responseFiles.page.total : 0,
                pids:data
              }
            })
          }else{
            message.error(response.msg)
          }
        }else{
          resolve({success:false})
        }
      }
      if(payload.listAfter&&payload.listAfter.flag === 1 && payload.listAfter.valueRadio === 1){
        if(response&&response.success){
          payload.listAfter.pids = data;
          const responseFilesAfter = yield call(listAddLeaderFiles, payload.listAfter);
          if(responseFilesAfter && responseFilesAfter.success){
            resolve({
              data:{
                list:responseFilesAfter.page.list?responseFilesAfter.page.list :[],
                total:responseFilesAfter.page.total?responseFilesAfter.page.total : 0,
                pids:data,
              }
            })
          }
        }else{
          message.error(response.msg)
        }
      }else{
        resolve({success:false})
      }
    },
    //领导交办 附件列表 新增 listAddLeaderFiles
    *listAddLeaderFilesFetch({ payload }, { call, put }) {
      const {resolve} = payload;
      // const response=yield call(editComplainDataModal,payload.data);
      const response = yield call(listAddLeaderFiles, payload);
      if(payload.flag === 0){
        if(response && response.success){
          resolve({
            data:{
              list:response.page.list?response.page.list :[],
              total:response.page.total?response.page.total : 0
            }
          })
        }
      }else if(payload.flag === 1){
        if(response && response.success){
          resolve({
            data:{
              list:response.page.list?response.page.list :[],
              total:response.page.total?response.page.total : 0
            }
          })
        }
      }
    },
    //领导交办 新增 附件删除
    *deleteAddLeaderFilesFetch({ payload }, { call, put }) {
      const { resolve } = payload;
      const response = yield call(deleteAddListLeaderFiles,payload.delete);
      const{ data } = response;
      console.log(response);
      if(payload.listBefore&&payload.listBefore.flag === 0 && payload.listBefore.valueRadio === 0){
        if(response&&response.success){
          payload.listBefore.pids = data;
          const responseFiles = yield call(listAddLeaderFiles, payload.listBefore);
          if(responseFiles && responseFiles.success){
            resolve({
              data:{
                list:responseFiles.page.list?responseFiles.page.list :[],
                total:responseFiles.page.total?responseFiles.page.total : 0,
                pids:data
              }
            })
          }else{
            message.success(response.msg)
          }
        }else{
          resolve({success:false})
        }
      }
      if(payload.listAfter&&payload.listAfter.flag === 1 && payload.listAfter.valueRadio === 1){
        if(response&&response.success){
          payload.listAfter.pids = data;
          const responseFiles = yield call(listAddLeaderFiles, payload.listAfter);
          if(responseFiles && responseFiles.success){
            resolve({
              data:{
                list:responseFiles.page.list?responseFiles.page.list :[],
                total:responseFiles.page.total?responseFiles.page.total : 0,
                pids:data
              }
            })
          }else{
            message.success(response.msg)
          }
        }else{
          resolve({success:false})
        }
      }
    },
    //领导交办 上传附件
    *importLeaderFilesFetch({payload},{call,put}){
      const { resolve } = payload;
      const response = yield call(importLeaderFiles,payload.file);
      if(response&&response.success){
        resolve({success:true});
        const responseFiles = yield call(listLeaderFiles, payload.listBefore);
        const responseFilesAfter = yield call(listLeaderFiles, payload.listAfter);
        if(payload.listBefore.flag === 0){
          if(responseFiles && responseFiles.success){
            yield put({
              type: 'queryLeaderListBefore',
              payload: {
                list: Array.isArray(responseFiles.page.list) ? responseFiles.page.list : [],
                total: responseFiles.page.total ? responseFiles.page.total : 0,
              },
            });
          }
        }
        if(payload.listAfter.flag === 1){
          if(responseFilesAfter && responseFilesAfter.success){
            yield put({
              type: 'queryLeaderListAfter',
              payload: {
                list: Array.isArray(responseFilesAfter.page.list) ? responseFilesAfter.page.list : [],
                total: responseFilesAfter.page.total ? responseFilesAfter.page.total : 0,
              },
            });
          }
        }
      }else{
        resolve({success:false})
      }
    },
    //领导交办 附件删除
    *deleteLeaderFilesFetch({ payload }, { call, put }) {
      const response = yield call(deleteListLeaderFiles, payload);
      if(response&&response.success){
        message.success(response.msg);
        const responseFiles = yield call(listLeaderFiles, payload.listBefore);
        const responseFilesAfter = yield call(listLeaderFiles, payload.listAfter);
        if(payload.listBefore.flag === 0){
          if(responseFiles && responseFiles.success){
            yield put({
              type: 'queryLeaderListBefore',
              payload: {
                list: Array.isArray(responseFiles.page.list) ? responseFiles.page.list : [],
                total: responseFiles.page.total ? responseFiles.page.total : 0,
              },
            });
          }
        }
        if(payload.listAfter.flag === 1){
          if(responseFilesAfter && responseFilesAfter.success){
            yield put({
              type: 'queryLeaderListAfter',
              payload: {
                list: Array.isArray(responseFilesAfter.page.list) ? responseFilesAfter.page.list : [],
                total: responseFilesAfter.page.total ? responseFilesAfter.page.total : 0,
              },
            });
          }
        }
      }else{
        message.error(response.msg);
      }
    },
    //领导交办 附件列表
    *listLeaderFilesFetch({ payload }, { call, put }) {
      const response = yield call(listLeaderFiles, payload);
      if(payload.flag === 0){
        if(response && response.success){
          yield put({
            type: 'queryLeaderListBefore',
            payload: {
              list: Array.isArray(response.page.list) ? response.page.list : [],
              total: response.page.total ? response.page.total : 0,
            },
          });
        }
      }else if(payload.flag === 1){
        if(response && response.success){
          yield put({
            type: 'queryLeaderListAfter',
            payload: {
              list: Array.isArray(response.page.list) ? response.page.list : [],
              total: response.page.total ? response.page.total : 0,
            },
          });
        }
      }
    },
    //领导交办 悬浮
    *listLeaderFilesMouseFetch({ payload }, { call, put }) {
      const {resolve} = payload;
      const response = yield call(listLeaderFiles, payload);
      if(payload.flag === 0){
        if(response&&response.success){
          resolve({
            data: {
              list: Array.isArray(response.page.list) ? response.page.list : [],
              total: response.page.total ? response.page.total : 0,
              nextPage: response.page.nextPage ? response.page.nextPage : 0,
              prePage: response.page.prePage ? response.page.prePage : 0,
              pageNum:response.page.pageNum ? response.page.pageNum : 0,
            }
          })
        }else{
          message.error(response.msg)
        }
      }else if(payload.flag === 1){
        if(response&&response.success){
          resolve({
            data: {
              list: Array.isArray(response.page.list) ? response.page.list : [],
              total: response.page.total ? response.page.total : 0,
              nextPage: response.page.nextPage ? response.page.nextPage : 0,
              prePage: response.page.prePage ? response.page.prePage : 0,
              pageNum:response.page.pageNum ? response.page.pageNum : 0,
            }
          })
        }else{
          message.error(response.msg)
        }
      }
    },
    //城管工单 悬浮
    *listInspectorsFilesMouseFetch({ payload }, { call, put }) {
      const {resolve} = payload;
      const response = yield call(listInspectorsFiles, payload);
      if(payload.flag === 0){
        if(response&&response.success){
          resolve({
            data: {
              list: Array.isArray(response.page.list) ? response.page.list : [],
              total: response.page.total ? response.page.total : 0,
              nextPage: response.page.nextPage ? response.page.nextPage : 0,
              prePage: response.page.prePage ? response.page.prePage : 0,
              pageNum:response.page.pageNum ? response.page.pageNum : 0,
            }
          })
        }else{
          message.error(response.msg)
        }
      }else if(payload.flag === 1){
        if(response&&response.success){
          resolve({
            data: {
              list: Array.isArray(response.page.list) ? response.page.list : [],
              total: response.page.total ? response.page.total : 0,
              nextPage: response.page.nextPage ? response.page.nextPage : 0,
              prePage: response.page.prePage ? response.page.prePage : 0,
              pageNum:response.page.pageNum ? response.page.pageNum : 0,
          }
          })
        }else{
          message.error(response.msg)
        }
      }
    },
    //综合执法 悬浮
    *listComprehensiveFilesMouseFetch({ payload }, { call, put }) {
      const {resolve} = payload;
      const response = yield call(listComprehensiveFiles, payload);
      if(payload.flag === 0){
        if(response&&response.success){
          resolve({
            data: {
              list: Array.isArray(response.page.list) ? response.page.list : [],
              total: response.page.total ? response.page.total : 0,
              nextPage: response.page.nextPage ? response.page.nextPage : 0,
              prePage: response.page.prePage ? response.page.prePage : 0,
              pageNum:response.page.pageNum ? response.page.pageNum : 0,
            }
          })
        }else{
          message.error(response.msg)
        }
      }else if(payload.flag === 1){
        if(response&&response.success){
          resolve({
            data: {
              list: Array.isArray(response.page.list) ? response.page.list : [],
              total: response.page.total ? response.page.total : 0,
              nextPage: response.page.nextPage ? response.page.nextPage : 0,
              prePage: response.page.prePage ? response.page.prePage : 0,
              pageNum:response.page.pageNum ? response.page.pageNum : 0,
            }
          })
        }else{
          message.error(response.msg)
        }
      }
    },
    //投诉举报工单 悬浮
    *listComplainFilesMouseFetch({ payload }, { call, put }) {
      const {resolve} = payload;
      const response = yield call(listComplainFiles, payload);
      if(payload.flag === 0){
        if(response&&response.success){
          resolve({
            data: {
              list: Array.isArray(response.page.list) ? response.page.list : [],
              total: response.page.total ? response.page.total : 0,
              nextPage: response.page.nextPage ? response.page.nextPage : 0,
              prePage: response.page.prePage ? response.page.prePage : 0,
              pageNum:response.page.pageNum ? response.page.pageNum : 0,
            }
          })
        }else{
          message.error(response.msg)
        }
      }else if(payload.flag === 1){
        if(response&&response.success){
          resolve({
            data: {
              list: Array.isArray(response.page.list) ? response.page.list : [],
              total: response.page.total ? response.page.total : 0,
              nextPage: response.page.nextPage ? response.page.nextPage : 0,
              prePage: response.page.prePage ? response.page.prePage : 0,
              pageNum:response.page.pageNum ? response.page.pageNum : 0,
            }
          })
        }else{
          message.error(response.msg)
        }
      }
    },
  },
  reducers:{
    queryComprehensiveListBefore(state, { payload }) {
      return {
        ...state,
        comprehensiveFilesListBefore: {
          list: payload.list,
          total: payload.total,
        },
      };
    },
    queryComprehensiveListAfter(state, { payload }) {
      return {
        ...state,
        comprehensiveFilesListAfter: {
          list: payload.list,
          total: payload.total,
        },
      };
    },
    queryComplainListBefore(state, { payload }) {
      return {
        ...state,
        complainFilesListBefore: {
          list: payload.list,
          total: payload.total,
        },
      };
    },
    queryComplainListAfter(state, { payload }) {
      return {
        ...state,
        complainFilesListAfter: {
          list: payload.list,
          total: payload.total,
        },
      };
    },
    queryInspectorsListBefore(state, { payload }) {
      return {
        ...state,
        inspectorsFilesListBefore: {
          list: payload.list,
          total: payload.total,
        },
      };
    },
    queryInspectorsListAfter(state, { payload }) {
      return {
        ...state,
        inspectorsListAfter: {
          list: payload.list,
          total: payload.total,
        },
      };
    },
    queryLeaderListBefore(state, { payload }) {
      return {
        ...state,
        leaderListBefore: {
          list: payload.list,
          total: payload.total,
        },
      };
    },
    queryLeaderListAfter(state, { payload }) {
      return {
        ...state,
        leaderListAfter: {
          list: payload.list,
          total: payload.total,
        },
      };
    },
    queryAddLeaderListBefore(state, { payload }) {
      return {
        ...state,
        addleaderListBefore: {
          list: payload.list,
          total: payload.total,
        },
      };
    },
    queryAddLeaderListAfter(state, { payload }) {
      return {
        ...state,
        addLeaderListAfter: {
          list: payload.list,
          total: payload.total,
        },
      };
    },
  }
}
