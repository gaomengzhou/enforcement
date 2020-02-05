import {
  addParameterSave,
  inspectorEnd,
  InspectorInfo,
  InspectorListInfo,
  disposalDepartment,
  disposalPersonnel,
  AddInspector,
  DelInspector,
  updateInspectorsDetail,
  inspectorsDetailBaseInfo, LeaderDetail,
  processListInspectors, complainListBaseInfo,
  taskManagementoInfo, managementoFetchInfo,
  bigClass, smallClass, getSponsor, disposalDepartmentid, authInfo,
  topreport, arrange, applySettlement, verified,
  processingProgram, comprehensiveDetailBaseInfo,
  dispatchParameter, returnParameterThree, returnParameterFour, returnParameterNine,
  wasteCaseParameter, closeCaseSixParameter, closeCaseNineParameter, bigAllClass, intCloseCase, deleteCaseInspectors, detailCloseCase,
  directClass, directPelpro,
  patchComprehensiveEcharts
} from '@/services/workOrder';
import { routerRedux } from 'dva/router';
import { message } from 'antd/lib/index';
import closeAnimated from './../utils/closeAnimated';
import { constants } from 'crypto';
export default {
  namespace: 'inspectors',
  state: {
    inspectorList: {
      list: [],
      total: 0
    },
    processList: {
      list: [],
      total: 0
    },
    taskManagemento: {},
    twoManagemento: {},
    queryProcessingList: [],
    queryBigClassList: [],
  },

  effects: {
    //综合执法echarts
    *comprehensiveEcharts({ payload }, { call, put }) {
      const { resolve } = payload;
      const res = yield call(patchComprehensiveEcharts, payload);
      if (res) {
        const timeData = [];
        const timeDatas = [];
        const departmentCompreClassNames = [];
        const departmentCompreClassNames2 = [];
        const top1Data = [];
        const top2Data = [];
        const top3Data = [];
        const top4Data = [];
        const top5Data = [];
        const superTop = [];
        const superData = [];

        for (let i = 0; i < res.data.length; i++) {
          res.data[i].id = i + 1;
          timeData.push((res.data[i].typeTime).substring(0, 10));
          departmentCompreClassNames.push(res.data[i].caseType);
        }
        timeDatas.push(...new Set(timeData));
        departmentCompreClassNames2.push(...new Set(departmentCompreClassNames))
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].caseType == departmentCompreClassNames2[0]) {
            top1Data.push(res.data[i].orderNum)
          }
          if (res.data[i].caseType == departmentCompreClassNames2[1]) {
            top2Data.push(res.data[i].orderNum)
          }
          if (res.data[i].caseType == departmentCompreClassNames2[2]) {
            top3Data.push(res.data[i].orderNum)
          }
          if (res.data[i].caseType == departmentCompreClassNames2[3]) {
            top4Data.push(res.data[i].orderNum)
          }
          if (res.data[i].caseType == departmentCompreClassNames2[4]) {
            top5Data.push(res.data[i].orderNum)
          }
        }
        superTop.push(top1Data, top2Data, top3Data, top4Data, top5Data)
        for (let i = 0; i < departmentCompreClassNames2.length; i++) {
          superData.push(
            {
              name: departmentCompreClassNames2[i],
              type: 'line',
              stack: '数量',
              data: superTop[i]
            }
          )
        }
        resolve({
          data: res.data,
          timeData: timeDatas,
          departmentCompreClassNames: departmentCompreClassNames2,
          superData,
        })
      }
    },





    *addSave({ payload }, { call, put }) {    //保存
      const response = yield call(addParameterSave, payload);
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
    *list({ payload }, { call, put }) {    //列表
      const response = yield call(InspectorListInfo, payload);
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
    *add({ payload }, { call, put }) {   //添加

    },
    *topreports({ payload }, { call, put }) {   //城管 上报
      const response = yield call(topreport, payload);
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
    *arranges({ payload }, { call, put }) { // 工单详情 安排
      const response = yield call(arrange, payload);
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
    *applySettlements({ payload }, { call, put }) { // 工单详情 申请结案
      const response = yield call(applySettlement, payload);
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
    *verifieds({ payload }, { call, put }) { // 工单详情 审核通过
      const response = yield call(verified, payload);
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
    *edit({ payload }, { call, put }) {  //修改
      const response = yield call(updateInspectorsDetail, payload.edit);
      if (payload.leader === 1) {
        if (response && response.success) {
          message.success('修改成功');
          closeAnimated();
          const responseResult = yield call(InspectorListInfo, payload.leaderList);
          if (responseResult && responseResult.success) {
            for (let i = 0; i < responseResult.page.list.length; i++) {
              responseResult.page.list[i].key = responseResult.page.list[i].id + '/' + responseResult.page.list[i].workOrderStatus;
            }
            yield put({
              type: 'lists',
              payload: {
                list: Array.isArray(responseResult.page.list) ? responseResult.page.list : [],
                total: responseResult.page.total ? responseResult.page.total : 0,
              },
            });
          } else {
            message.error(responseResult.msg ? responseResult.msg : (responseResult.message ? responseResult.message : '数据加载失败'))
          }
        } else {
          message.error('修改失败');
        }
      } else if (payload.leader === 2) {
        if (response && response.success) {
          message.success('修改成功');
          yield put(routerRedux.push('/department/inspectors/list'));
        } else {
          message.error('修改失败');
        }
      }
    },
    *info({ payload }, { call, put }) {  //详情
      const { resolve } = payload;
      const response = yield call(InspectorInfo, payload);
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

    *getSponsors({ payload }, { call, put }) {  //获取部门
      const { resolve } = payload;
      const response = yield call(getSponsor, payload);
      if (response && response.success) {
        resolve({ data: response.data ? response.data : {} })
      } else {
        resolve({ data: {} })
      }
    },

    *deleteCaseFetch({ payload }, { call, put }) {  //删除
      const response = yield call(deleteCaseInspectors, payload);
      if (payload.leader === 1) {
        if (response && response.success) {
          message.success('修改成功');
          closeAnimated();
          const responseResult = yield call(InspectorListInfo, payload.leaderList);
          if (responseResult && responseResult.success) {
            for (let i = 0; i < responseResult.page.list.length; i++) {
              responseResult.page.list[i].key = responseResult.page.list[i].id + '/' + responseResult.page.list[i].workOrderStatus;
            }
            yield put({
              type: 'lists',
              payload: {
                list: Array.isArray(responseResult.page.list) ? responseResult.page.list : [],
                total: responseResult.page.total ? responseResult.page.total : 0,
              },
            });
          } else {
            message.error(responseResult.msg ? responseResult.msg : (responseResult.message ? responseResult.message : '数据加载失败'))
          }
        } else {
          message.error('修改失败');
        }
      } else if (payload.leader === 2) {
        if (response && response.success) {
          message.success('修改成功');
          yield put(routerRedux.push('/department/inspectors/list'));
        } else {
          message.error('修改失败');
        }
      }
    },
    //工作过程
    *processListFetch({ payload }, { call, put }) {
      const response = yield call(processListInspectors, payload);
      if (response && response.success) {
        for (let i = 0; i < response.list.length; i++) {
          response.list[i].key = response.list[i].id;
        }
        yield put({
          type: 'queryProcessList',
          payload: {
            list: Array.isArray(response.list) ? response.list : [],
            total: response.total,
          },
        });
      }
    },
    //任务处置
    *taskManagementoFetch({ payload }, { call, put }) {
      const response = yield call(taskManagementoInfo, payload);
      if (response && response.success) {
        yield put({
          type: 'queryTaskManagemento',
          payload: response.data ? response.data : {},
        });
      } else {
        yield put({
          type: 'queryTaskManagemento',
          payload: {},
        });
      }
    },
    //二级处置
    *managementoFetch({ payload }, { call, put }) {
      const response = yield call(managementoFetchInfo, payload);
      if (response && response.success) {
        yield put({
          type: 'queryManagemento',
          payload: response.data ? response.data : {},
        });
      } else {
        yield put({
          type: 'queryManagemento',
          payload: {},
        });
      }
    },
    //综合执法 处理程序--进入页面就请求
    // *processingProgramAllFetch({ payload }, { call, put }) {
    //   const { resolve } = payload;
    //   if (payload.id) {
    //     const res = yield call(comprehensiveDetailBaseInfo, { id: payload.id });
    //     // let resultBigClass=[],resultSmallClass=[];
    //     const response = yield call(processingProgram, {});

    //     resolve({
    //       processingProgramList: response.list ? response.list : {},
    //       // bigClassList:resultBigClass,
    //       // smallClassList:resultSmallClass,
    //     })
    //   } else {
    //     const response = yield call(processingProgram, {});
    //     resolve({
    //       processingProgramList: response.list ? response.list : {},
    //       // bigClassList:[],
    //       // smallClassList:[],
    //     })
    //   }
    // },
    //城管工单 处理程序--进入页面就请求
    *processingProgramAllFetch({ payload }, { call, put }) {
      const { resolve } = payload;
      if (payload.id) {
        const res = yield call(InspectorInfo, { id: payload.id });
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
    // 主办部门
    *directClassFetch({ payload }, { call, put }) {
      const { resolve } = payload;
      const response = yield call(directClass, payload);
      if (response && response.success) {
        resolve({
          directClassList: response.list ? response.list : {},
        })
      } else {
        resolve({ data: {} })
      }
    },

    // 获取登录信息
    *authInfos({ payload, callback }, { call, put }) {
      const response = yield call(authInfo, payload);
      callback && callback(response)
    },

    // 承办人员
    *directPelproFetch({ payload }, { call, put }) {
      const { resolve } = payload;
      const response = yield call(directPelpro, payload);
      if (response && response.success) {
        resolve({
          directPelproList: response.list ? response.list : {},
        })
      } else {
        resolve({ data: {} })
      }
    },
    // 安排执行人 
    *disposalDepartmentids({ payload }, { call, put }) {
      const { resolve } = payload;
      const response = yield call(disposalDepartmentid, payload);
      if (response && response.success) {
        resolve({
          directPelproidList: response.list ? response.list : {},
        })
      } else {
        resolve({ data: {} })
      }
    },
    //处理程序
    *processingProgramFetch({ payload }, { call, put }) {
      const { resolve } = payload;
      const response = yield call(processingProgram, payload);
      if (response && response.success) {
        resolve({
          processingProgramList: response.list ? response.list : {},
        })
      } else {
        resolve({ data: {} })
      }
    },
    //案件大类
    *bigClassFetch({ payload, callback }, { call, put }) {
      // const { resolve } = payload;
      // const {resolve,id,province,city,county,town} = payload
      const res = yield call(bigClass, payload);
      // if (response && response.success) {
      //   resolve({ data: response.list ? response.list : {} })
      // } else {
      //   resolve({ data: {} })
      // }
      res && callback(res);
    },
    //案件小类
    // *smallClassFetch({ payload }, { call, put }) {
    //   console.log(payload)
    //   const { resolve } = payload;
    //   const response = yield call(smallClass, payload);
    //   console.log(response)
    //   // if (response) {
    //   //   resolve({ data: response.list ? response.list : {} })
    //   // } else {
    //   //   resolve({ data: {} })
    //   // }
    // },

    // 处置部门
    *disposalDepartmentSelect({ payload }, { call, put }) {
      const { resolve } = payload;
      // const {resolve,id,province,city,county,town} = payload
      const response = yield call(disposalDepartment, payload);
      if (response && response.success) {
        resolve({ data: response.list ? response.list : {} })
      } else {
        resolve({ data: {} })
      }
    },
    // 处置人员
    *disposalPersonnelSelect({ payload }, { call, put }) {
      const { resolve } = payload;
      const response = yield call(disposalPersonnel, payload);
      if (response && response.success) {
        resolve({ data: response.list ? response.list : {} })
      } else {
        resolve({ data: {} })
      }
    },
    //处置大类
    *bigClassFetch({ payload }, { call, put }) {
      const { resolve } = payload;
      // const {resolve,id,province,city,county,town} = payload
      const response = yield call(bigClass, payload);
      if (response && response.success) {
        resolve({ data: response.list ? response.list : {} })
      } else {
        resolve({ data: {} })
      }
    },
    //处置小类
    *smallClassFetch({ payload }, { call, put }) {
      const { resolve } = payload;
      const response = yield call(smallClass, payload);
      if (response) {
        resolve({ data: response ? response : {} })
      } else {
        resolve({ data: {} })
      }
    },

    //查询所有案件大类 查询列表
    *bigAllClassFetch({ payload }, { call, put }) {
      const { resolve } = payload;
      const response = yield call(bigAllClass, payload);
      if (response) {
        resolve({ data: response ? response : {} })
      } else {
        resolve({ data: {} })
      }
    },
    //派单
    *dispatchFetch({ payload }, { call, put }) {
      const response = yield call(dispatchParameter, payload);
      if (payload.leader === 1) {
        if (response && response.success) {
          message.success(response.msg);
          closeAnimated();
          const responseResult = yield call(InspectorListInfo, payload.leaderList);
          if (responseResult && responseResult.success) {
            for (let i = 0; i < responseResult.page.list.length; i++) {
              responseResult.page.list[i].key = responseResult.page.list[i].id + '/' + responseResult.page.list[i].workOrderStatus;
            }
            yield put({
              type: 'lists',
              payload: {
                list: Array.isArray(responseResult.page.list) ? responseResult.page.list : [],
                total: responseResult.page.total ? responseResult.page.total : 0,
              },
            })
            // yield put(routerRedux.push('/department/inspectors/list'));
          } else {
            message.error(responseResult.msg ? responseResult.msg : (responseResult.message ? responseResult.message : '数据加载失败'));

          }
        } else {
          message.error(response.msg);
        }
      } else if (payload.leader === 2) {
        if (response && response.success) {
          message.success(response.msg);
          yield put(routerRedux.push('/department/inspectors/list'));
        } else {
          message.error(response.msg);
        }
      }
    },
    //退回
    *returnFetch({ payload }, { call, put }) {
      if (payload.backWorkOrderStatus === 3) {
        const response = yield call(returnParameterThree, payload);
        if (payload.leader === 1) {
          if (response && response.success) {
            message.success(response.msg);
            closeAnimated();
            const responseResult = yield call(InspectorListInfo, payload.leaderList);
            if (responseResult && responseResult.success) {
              for (let i = 0; i < responseResult.page.list.length; i++) {
                responseResult.page.list[i].key = responseResult.page.list[i].id + '/' + responseResult.page.list[i].workOrderStatus;
              }
              yield put({
                type: 'lists',
                payload: {
                  list: Array.isArray(responseResult.page.list) ? responseResult.page.list : [],
                  total: responseResult.page.total ? responseResult.page.total : 0,
                },
              });
            } else {
              message.error(responseResult.msg ? responseResult.msg : (responseResult.message ? responseResult.message : '数据加载失败'))
            }
          } else {
            message.error(response.msg);
          }
        } else if (payload.leader === 2) {
          if (response && response.success) {
            message.success(response.msg);
            yield put(routerRedux.push('/department/inspectors/list'));
          } else {
            message.error(response.msg);
          }
        }
      } else if (payload.backWorkOrderStatus === 6) {
        const response = yield call(returnParameterFour, payload);
        if (payload.leader === 1) {
          if (response && response.success) {
            message.success(response.msg);
            closeAnimated();
            const responseResult = yield call(InspectorListInfo, payload.leaderList);
            if (responseResult && responseResult.success) {
              for (let i = 0; i < responseResult.page.list.length; i++) {
                responseResult.page.list[i].key = responseResult.page.list[i].id + '/' + responseResult.page.list[i].workOrderStatus;
              }
              yield put({
                type: 'lists',
                payload: {
                  list: Array.isArray(responseResult.page.list) ? responseResult.page.list : [],
                  total: responseResult.page.total ? responseResult.page.total : 0,
                },
              });
            } else {
              message.error(responseResult.msg ? responseResult.msg : (responseResult.message ? responseResult.message : '数据加载失败'))
            }
          } else {
            message.error(response.msg);
          }
        } else if (payload.leader === 2) {
          if (response && response.success) {
            message.success(response.msg);
            yield put(routerRedux.push('/department/inspectors/list'));
          } else {
            message.error(response.msg);
          }
        }
      } else if (payload.backWorkOrderStatus === 9) {
        const response = yield call(returnParameterNine, payload);
        if (payload.leader === 1) {
          if (response && response.success) {
            message.success(response.msg);
            closeAnimated();
            const responseResult = yield call(InspectorListInfo, payload.leaderList);
            if (responseResult && responseResult.success) {
              for (let i = 0; i < responseResult.page.list.length; i++) {
                responseResult.page.list[i].key = responseResult.page.list[i].id + '/' + responseResult.page.list[i].workOrderStatus;
              }
              yield put({
                type: 'lists',
                payload: {
                  list: Array.isArray(responseResult.page.list) ? responseResult.page.list : [],
                  total: responseResult.page.total ? responseResult.page.total : 0,
                },
              });
            } else {
              message.error(responseResult.msg ? responseResult.msg : (responseResult.message ? responseResult.message : '数据加载失败'))
            }
          } else {
            message.error(response.msg);
          }
        } else if (payload.leader === 2) {
          if (response && response.success) {
            message.success(response.msg);
            yield put(routerRedux.push('/department/inspectors/list'));
          } else {
            message.error(response.msg);
          }
        }
      }
    },
    //详情 结案
    *detailCloseCaseFetch({ payload }, { call, put }) {
      const response = yield call(detailCloseCase, payload);
      if (payload.leader === 1) {
        if (response && response.success) {
          message.success(response.msg);
          closeAnimated();
          const responseResult = yield call(InspectorListInfo, payload.leaderList);
          if (responseResult && responseResult.success) {
            for (let i = 0; i < responseResult.page.list.length; i++) {
              responseResult.page.list[i].key = responseResult.page.list[i].id + '/' + responseResult.page.list[i].workOrderStatus;
            }
            yield put({
              type: 'lists',
              payload: {
                list: Array.isArray(responseResult.page.list) ? responseResult.page.list : [],
                total: responseResult.page.total ? responseResult.page.total : 0,
              },
            });
          } else {
            message.error(responseResult.msg ? responseResult.msg : (responseResult.message ? responseResult.message : '数据加载失败'))
          }
        } else {
          message.error(response.msg);
        }
      } else if (payload.leader === 2) {
        if (response && response.success) {
          message.success(response.msg);
          yield put(routerRedux.push('/department/inspectors/list'));
        } else {
          message.error(response.msg);
        }
      }
    },
    //结案
    *closeCaseFetch({ payload }, { call, put }) {
      if (payload.managementStatu === 6) {
        const response = yield call(closeCaseSixParameter, payload);
        if (response && response.success) {
          message.success(response.msg);
          const result = yield call(InspectorListInfo, payload);
          if (result && result.success) {
            for (let i = 0; i < result.page.list.length; i++) {
              result.page.list[i].key = result.page.list[i].id + '/' + result.page.list[i].workOrderStatus;
            }
            yield put({
              type: 'lists',
              payload: {
                list: Array.isArray(result.page.list) ? result.page.list : [],
                total: result.page.total,
              },
            });
          }
        } else {
          message.error(response.msg);
        }
      } else if (payload.managementStatu === 9) {
        const response = yield call(closeCaseNineParameter, payload);
        if (response && response.success) {
          message.success(response.msg);
        } else {
          const result = yield call(InspectorListInfo, payload);
          if (result && result.success) {
            for (let i = 0; i < result.page.list.length; i++) {
              result.page.list[i].key = result.page.list[i].id + '/' + result.page.list[i].workOrderStatus;
            }
            yield put({
              type: 'lists',
              payload: {
                list: Array.isArray(result.page.list) ? result.page.list : [],
                total: result.page.total,
              },
            });
          }
          message.error(response.msg);
        }
      }
    },
    //列表 结案按钮
    *closeCaseListFetch({ payload }, { call, put }) {
      const response = yield call(intCloseCase, payload);
      if (response && response.success) {
        message.success(response.msg);
        const result = yield call(InspectorListInfo, payload);
        if (result && result.success) {
          for (let i = 0; i < result.page.list.length; i++) {
            result.page.list[i].key = result.page.list[i].id + '/' + result.page.list[i].workOrderStatus;
          }
          yield put({
            type: 'lists',
            payload: {
              list: Array.isArray(result.page.list) ? result.page.list : [],
              total: result.page.total,
            },
          });
        } else {
          message.error(responseResult.msg ? responseResult.msg : (responseResult.message ? responseResult.message : '数据加载失败'))
        }
      } else {
        message.error(response.msg)
      }
    },
    //智能生成 结案
    *intCloseCaseFetch({ payload }, { call, put }) {
      const response = yield call(intCloseCase, payload);
      if (response && response.success) {
        message.success(response.msg);
      } else {
        message.error(response.msg)
      }
    },
    //废案
    *wasteCaseFetch({ payload }, { call, put }) {
      const response = yield call(wasteCaseParameter, payload);
      if (payload.leader === 1) {
        if (response && response.success) {
          message.success(response.msg);
          closeAnimated();
          const responseResult = yield call(InspectorListInfo, payload.leaderList);
          if (responseResult && responseResult.success) {
            for (let i = 0; i < responseResult.page.list.length; i++) {
              responseResult.page.list[i].key = responseResult.page.list[i].id + '/' + responseResult.page.list[i].workOrderStatus;
            }
            yield put({
              type: 'lists',
              payload: {
                list: Array.isArray(responseResult.page.list) ? responseResult.page.list : [],
                total: responseResult.page.total ? responseResult.page.total : 0,
              },
            });
          } else {
            message.error(responseResult.msg ? responseResult.msg : (responseResult.message ? responseResult.message : '数据加载失败'))
          }
        } else {
          message.error(response.msg);
        }
      } else if (payload.leader === 2) {
        if (response && response.success) {
          message.success('修改成功');
          yield put(routerRedux.push('/department/inspectors/list'));
        } else {
          message.error('修改失败');
        }
      }
    },
    *clear(_, { call, put }) {
      yield put({
        type: 'init',
        payload: {},
      })
    },
    *inspectorEndFetch({ payload }, { call, put }) { // 申请结案
      const response = yield call(inspectorEnd, payload);
      if (payload.leader === 1) {
        if (response && response.success) {
          message.success(response.msg);
          closeAnimated();
          const responseResult = yield call(InspectorListInfo, payload.leaderList);
          if (responseResult && responseResult.success) {
            for (let i = 0; i < responseResult.page.list.length; i++) {
              responseResult.page.list[i].key = responseResult.page.list[i].id + '/' + responseResult.page.list[i].workOrderStatus;
            }
            yield put({
              type: 'lists',
              payload: {
                list: Array.isArray(responseResult.page.list) ? responseResult.page.list : [],
                total: responseResult.page.total ? responseResult.page.total : 0,
              },
            });
          } else {
            message.error(responseResult.msg ? responseResult.msg : (responseResult.message ? responseResult.message : '数据加载失败'))
          }
        } else {
          message.error(response.msg);
        }
      } else if (payload.leader === 2) {
        if (response && response.success) {
          message.success('申请结案成功');
          yield put(routerRedux.push('/department/inspectors/list'));
        } else {
          message.error('修改失败');
        }
      }
    },
  },

  reducers: {
    init(state, { payload }) {
      return {
        ...state,
        info: payload,
      };
    },
    lists(state, { payload }) {
      return {
        ...state,
        inspectorList: {
          list: payload.list,
          total: payload.total,
        },
      };
    },
    queryProcessList(state, { payload }) {
      return {
        ...state,
        processList: payload,
      };
    },
    queryTaskManagemento(state, action) {
      return {
        ...state,
        taskManagemento: action.payload,
      };
    },
    queryManagemento(state, action) {
      return {
        ...state,
        twoManagemento: action.payload,
      };
    },
    queryProcessingProgram(state, action) {
      return {
        ...state,
        queryProcessingList: action.payload,
      };
    },
    queryBigClass(state, action) {
      return {
        ...state,
        queryBigClassList: action.payload,
      };
    },
  }
}
