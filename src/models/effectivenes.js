import { message } from 'antd/lib/index';
import { patchNewWorkOrderToday, patchQuantityOfWorkOrderProcessing, patchProcessingRate, patchProcessingRateTime } from '@/services/effeApi';

export default {
    namespace: 'effectivenes',
    state: {
        orderToday: {},
        numEchats: {},
        pieRateDatas: {},
    },
    effects: {
        //今日新增工单
        *newWorkOrderToday({ payload }, { call, put }) {
            const res = yield call(patchNewWorkOrderToday, payload)
            if (res) {
                const orderStatistics = [];
                const sectoralStatistics = [];
                for (let i = res.data.length - 1; i >= res.data.length - 4; i--) {
                    orderStatistics.push(res.data[i])
                }
                for (let i = 0; i < res.data.length - 4; i++) {
                    sectoralStatistics.push(res.data[i])
                }
                orderStatistics.reverse()
                yield put({
                    type: 'patchNewWorkOrderTodayList',
                    payload: {
                        orderStatistics,
                        sectoralStatistics
                    }
                })
            } else {
                message.error(res.retMsg)
            }
        },
        //工单处理数量
        *quantityOfWorkOrderProcessing({ payload }, { call, put }) {
            const { resolve } = payload;
            const res = yield call(patchQuantityOfWorkOrderProcessing, payload);
            if (res) {
                const columnarData = [];
                const columnarDataNum = [];
                //处理柱状数据
                for (let i = 0; i < res.data.length; i++) {
                    columnarData.push(res.data[i].departType)
                    columnarDataNum.push(res.data[i].departNum)
                }
                //处理饼状数据
                const pieData = res.data.map(item => {
                    return {
                        value: item.departNum,
                        name: item.departType
                    }
                })
                yield put({
                    type: 'quantityOfWorkOrderProcessingList',
                    payload: {
                        columnarData,
                        columnarDataNum,
                        pieData
                    }
                });
            }
        },

        //工单处理速率
        *processingRate({ payload }, { call, put }) {
            const res = yield call(patchProcessingRate, payload);
            if (res) {
                const pieRateData = []
                pieRateData.push({ value: res.data[0].redoNum, name: '重办数量' });
                pieRateData.push({ value: res.data[0].unclosed, name: '未办数量' });
                pieRateData.push({ value: res.data[0].hasClosed, name: '已结办' });
                yield put({
                    type: 'processingRateList',
                    payload: {
                        pieRateData
                    }
                })
            }
        },

        //处理时间情况
        *processingRateTime({ payload }, { call, put }) {
            const { resolve } = payload
            const res = yield call(patchProcessingRateTime, payload)
            if (res) {
                const outTimeCity = res.data[1].outTime;
                const fortyEightCity = res.data[1].fortyEight;
                const twentyFourCity = res.data[1].twentyFour;
                const eightCity = res.data[1].eight;
                const eightLessCity = res.data[1].eightLess;

                const outTime = res.data[0].outTime;
                const fortyEight = res.data[0].fortyEight;
                const twentyFour = res.data[0].twentyFour;
                const eight = res.data[0].eight;
                const eightLess = res.data[0].eightLess;
                resolve({
                    data: {
                        eight,
                        eightCity,
                        eightLess,
                        eightLessCity,
                        fortyEight,
                        fortyEightCity,
                        outTime,
                        outTimeCity,
                        twentyFour,
                        twentyFourCity
                    }
                });
            }
        }
    },
    reducers: {
        patchNewWorkOrderTodayList(state, { payload }) {
            return {
                ...state,
                orderToday: payload
            }
        },

        quantityOfWorkOrderProcessingList(state, { payload }) {
            return {
                ...state,
                numEchats: payload
            }
        },

        processingRateList(state, { payload }) {
            return {
                ...state,
                pieRateDatas: payload
            }
        },

    }
}