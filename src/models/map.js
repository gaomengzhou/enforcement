import { message } from 'antd/lib/index';
import { patchPatrolSettingList ,patchMapCount,gripHistoryList,} from '../services/map';

export default {
    namespace: 'map',
    state: {
        patchPatrolList: {
            list: [],
            total: ''
        }
    },
    effects: {
        *patrolSettingList({ payload }, { call, put }) {
            const res = yield call(patchPatrolSettingList, payload)
            if (res) {
                yield put({
                    type: 'patchPatrolListData',
                    payload: {
                        list: res.list,
                        total: res.length
                    }
                })
            } else {
                message.error('网络错误,稍后重试')
            }
        },

        *patchMapCount({ payload ,callback}, { call }) {
            const res = yield call(patchMapCount, payload)
            if (res) {
                callback(res);
            } else {
                message.error('网络错误,稍后重试')
            }
        },

        *gripHistoryList({ payload}, { call, put }) {
            const res = yield call(gripHistoryList, payload)
            if (res) {
                yield put({
                    type: 'patchPatrolListData',
                    payload: {
                        list: res.list,
                        total: res.length
                    }
                })
            } else {
                message.error('网络错误,稍后重试')
            }
        }


    },
    reducers: {
        patchPatrolListData(state, { payload }) {
            return {
                ...state,
                patchPatrolList: payload
            }
        }
    }
}
