import { increaseDepDisposal, increaseLeader, increaseInt, patchQuantitativetrends, patchIncreaseAndDecreaseTrend, patchLeadershipQuantityTrend, patchLeadershipLncreaseAndDecreaseTrend,patchTrendOfIntelligentGeneration,patchIntelligentGenerationIncreaseOrDecrease } from '@/services/statistics';
import { message } from 'antd/lib/index';

export default {
  namespace: 'increase',
  state: {
    sourceList: {
      list: [],
      total: 0,
    },
  },
  effects: {
    //工单增减趋势
    *increaseAndDecreaseTrend({ payload }, { call, put }) {
      const { resolve } = payload;
      const response = yield call(patchIncreaseAndDecreaseTrend, payload)
      if (response) {
        resolve({
          data: response.data
        });
      } else {
        message.error('网络不佳')
      }
    },
    //工单增减趋势--智能生成
    *intelligentGenerationIncreaseOrDecrease({payload},{call,put}){
      const {resolve} = payload;
      const response = yield call(patchIntelligentGenerationIncreaseOrDecrease,payload);
      if(response){
        resolve({
          data:response.data
        })
      } else {
        message.error('网络不佳')
      }
    },
    
    //工单数量趋势--智能生成
    *trendOfIntelligentGeneration({ payload }, { call, put }) {
      const { resolve } = payload;
      const response = yield call(patchTrendOfIntelligentGeneration, payload);
      if (response) {
        resolve({
          data: response.data
        });
      } else {
        message.error('网络不佳')
      }
    },

    //工单数量趋势--部门派发
    *quantitativetrends({ payload }, { call, put }) {
      const { resolve } = payload;
      const response = yield call(patchQuantitativetrends, payload);
      if (response) {
        resolve({
          data: response.data
        });
      } else {
        message.error('网络不佳')
      }
    },
    //工单数量趋势--领导交办
    *leadershipQuantityTrend({ payload }, { call, put }) {
      const { resolve } = payload;
      const response = yield call(patchLeadershipQuantityTrend, payload);
      if (response) {
        resolve({
          data: response.data
        });
      } else {
        message.error('网络不佳')
      }
    },
    //工单增减趋势--领导交办
    *leadershipLncreaseAndDecreaseTrend({ payload }, { call, put }) {
      const { resolve } = payload;
      const response = yield call(patchLeadershipLncreaseAndDecreaseTrend, payload);
      if (response) {
        resolve({
          data: response.data
        });
      } else {
        message.error('网络不佳')
      }
    },

    //部门派发
    *increaseDepDisposalFetch({ payload }, { call, put }) {
      const { resolve } = payload;
      const response = yield call(increaseDepDisposal, payload);
      if (response) {
        resolve({
          data: response.data
        })
      } else {
        message.error(response.msg)
      }
    },
    //领导交办
    *increaseLeaderFetch({ payload }, { call, put }) {
      const { resolve } = payload;
      const response = yield call(increaseLeader, payload);
      if (response) {
        resolve({
          data: response.data
        })
      } else {
        message.error(response.msg)
      }
    },
    //智能生成
    *increaseIntFetch({ payload }, { call, put }) {
      const { resolve } = payload;
      const response = yield call(increaseInt, payload);
      if (response) {
        resolve({
          data: response.data
        })
      } else {
        message.error(response.msg)
      }
    },
  },
  reducers: {
    querySourceList(state, { payload }) {
      return {
        ...state,
        sourceList: payload,
      };
    },
  }
}
