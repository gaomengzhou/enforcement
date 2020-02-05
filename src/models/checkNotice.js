import { message } from 'antd/lib/index';
import { patchPatrolsSettings, patchSavePatrolPlanSetting, patchPatrolList, patchGetModalList, patchPushMsg, patchCheckData, patchPrevDateStatus } from '../services/noticeList';

export default {
    namespace: 'checkNotice',
    state: {
        patchPatrolListObj: '',// 巡查列表数据
        patchGetModalData: '',// 模态框里面的数据 人员,手机号.
        patrolsSettingsListData: ''
    },
    effects: {
        *prevDateStatus({ payload }, { call, put }) {
            const res = yield call(patchPrevDateStatus, payload);
            console.log(res)
            if (res.retMsg === "操作成功") {
                yield put({
                    type: 'patchPatrolListData',
                    payload: res.list
                })
            }
        },
        *checkData({ payload }, { call, put }) {
            const res = yield call(patchCheckData, payload);
            if (res) {
                yield put({
                    type: 'patchPatrolListData',
                    payload: res.list
                })
            } else {
                message.error('网络错误,稍后重试')
            }
        },
        *patrolsSettings({ payload }, { call, put }) {
            const { resolve } = payload
            const res = yield call(patchPatrolsSettings, payload)
            if (res.retMsg === "操作成功") {
                resolve({
                    data: res.data
                });
                yield put({
                    type: 'patrolsSettingsList',
                    payload: res.data
                })
            } else {
                message.error('网络错误,稍后重试')
            }
        },
        *savePatrolPlanSetting({ payload }, { call }) {
            const res = yield call(patchSavePatrolPlanSetting, payload)
            if (res) {
                message.success(res.retMsg)
            } else {
                message.error('网络错误,稍后重试')
            }
        },
        *patrolList({ payload }, { call, put }) {
            const res = yield call(patchPatrolList, payload);
            console.log(res)
            if (res) {
                yield put({
                    type: 'patchPatrolListData',
                    payload: res.list
                })
            } else {
                message.error('网络错误,稍后重试')
            }
        },
        *getModalList({ payload }, { call, put }) {
            const res = yield call(patchGetModalList, payload);
            if (res) {
                yield put({
                    type: 'patchGetModalListData',
                    payload: res.data
                })
            } else {
                message.error('网络错误,稍后重试')
            }
        },
        *pushMsg({ payload }, { call }) {
            const res = yield call(patchPushMsg, payload);
            if (res) {
                message.success(res.retMsg)
            } else {
                message.error('网络错误,稍后重试')
            }
        }
    },
    reducers: {
        // 巡查列表数据,以及查询.
        patchPatrolListData(state, { payload }) {
            return {
                ...state,
                patchPatrolListObj: payload
            }
        },

        // 模态框里面的数据 人员,手机号.
        patchGetModalListData(state, { payload }) {
            return {
                ...state,
                patchGetModalData: payload
            }
        },

        patrolsSettingsList(state, { payload }) {
            return {
                ...state,
                patrolsSettingsListData: payload
            }
        }
    }
}
