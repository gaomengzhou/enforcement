import request from '../utils/request';
// import { getQueryUrl } from '@/utils/queryFilter';

export async function patchPatrolSettingList(params) {
    return request(`/services/enforcement/DataAnalysis/selectPatrolTask/${params.page}/${params.pageSize}`, {
        method: 'POST',
        body: params
    })
}

export async function patchMapCount(params) {
    return request(`/services/enforcement/DataAnalysis/getNumByTime`, {
        method: 'POST',
        body: params
    })
}


export async function gripHistoryList(params) {
    return request(`/services/enforcement/DataAnalysis/getRecordByGridId/${params.page}/${params.pageSize}/${params.gridId}?Q=startTime_D_GE=${params.startTime}&Q=taskNumber_S_LK=${params.taskNumber}&Q=startTime_D_LE=${params.endTime}`)
}

