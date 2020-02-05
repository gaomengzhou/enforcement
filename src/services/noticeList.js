import request from '../utils/request';
// import { getQueryUrl } from '@/utils/queryFilter';

// 通过条件查询巡查提醒列表数据
export async function patchCheckData(params) {
    return request(`/services/enforcement/DataAnalysis/selectByCondition/${params.page}/${params.pageSize}`, {
        method: 'POST',
        body: params
    })
}

export async function patchPrevDateStatus(params) {
    return request(`/services/enforcement/DataAnalysis/selectByCycle/${params.page}/${params.pageSize}`, {
        method: 'POST',
        body: params
    })
}

// 巡查设置任务
export async function patchPatrolsSettings(params) {
    return request(`/services/enforcement/DataAnalysis/selectPatrolPlanSetting`, {
        method: 'POST',
        body: params
    })
};

// 巡查设置保存
export async function patchSavePatrolPlanSetting(params) {
    return request(`/services/enforcement/DataAnalysis/savePatrolPlanSetting`, {
        method: 'POST',
        body: params
    })
}

// 巡查列表
export async function patchPatrolList(params) {
    return request(`/services/enforcement/DataAnalysis/selectPatrolPlan/${params.page}/${params.pageSize}`, {
        method: 'GET'
        // body: params
    })
}

// 通过网格编号查询网格员信息
export async function patchGetModalList(params) {
    return request(`/services/enforcement/DataAnalysis/selectByGridId/${params.latticeId}`, {
        method: 'POST',
        body: params
    })
}

// 批量保存巡查消息提醒表
export async function patchPushMsg(params) {
    return request(`/services/enforcement/DataAnalysis/saveBatchRemind`, {
        method: 'POST',
        body: params
    })
}
