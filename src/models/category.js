import { categoryComprehensive, categoryIntelligent, categoryInspector, categoryLeader, categoryComplain } from '@/services/statistics';
import { message } from 'antd/lib/index';

export default {
  namespace: 'category',
  state: {
  },
  effects: {
    //部门派发 综合执法
    *categoryComprehensiveFetch({ payload }, { call, put }) {
      const { resolve } = payload;
      const response = yield call(categoryComprehensive, payload);
      if (response) {
        resolve({
          data: response.data
        })
      } else {
        message.error(response.msg)
      }
    },
    //智能生成
    *categoryIntelligentFetch({ payload }, { call, put }) {
      const { resolve } = payload;
      const response = yield call(categoryIntelligent, payload);
      if (response && response.success) {
        resolve({
          data: response.map
        })
      } else {
        message.error(response.msg)
      }
    },
    //城管工单
    *categoryInspectorFetch({ payload }, { call, put }) {
      const { resolve } = payload;
      const res = yield call(categoryInspector, payload);
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
          inspectorsCompreate: timeDatas,
          inspectorsClassNames: departmentCompreClassNames2,
          urbanManagementData: superData,
        })
      } else {
        message.error(res.retMsg)
      }
    },
    //领导交办
    *categoryLeaderFetch({ payload }, { call, put }) {
      const { resolve } = payload;
      const res = yield call(categoryLeader, payload);
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
          leaderCompreate: timeDatas,
          leaderClassNames: departmentCompreClassNames2,
          leadershipData: superData,
        })
      } else {
        message.error(res.retMsg)
      }
    },
    //投诉工单
    *categoryComplainFetch({ payload }, { call, put }) {
      const { resolve } = payload;
      const res = yield call(categoryComplain, payload);
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
          complainDate: timeDatas,
          complainClassNames: departmentCompreClassNames2,
          complaintData: superData,
        })
      } else {
        message.error(res.msg)
      }
    },
  },
  reducers: {

  }
}
