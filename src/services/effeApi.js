import request from '../utils/request';
// 今日新增工单
export async function patchNewWorkOrderToday(params) {
    return request(`/services/enforcement/DataAnalysis/performance_analysis_add`, {
        method: 'POST',
        body: params
    });
}

export async function patchQuantityOfWorkOrderProcessing(params) {
    return request(`/services/enforcement/DataAnalysis/performance_analysis_num`, {
        method: 'POST',
        body: params
    });
}

export async function patchProcessingRate(params) {
    return request(`/services/enforcement/DataAnalysis/performance_analysis_efficiency`, {
        method: 'POST',
        body: params
    });
}

export async function patchProcessingRateTime(params) {
    return request(`/services/enforcement/DataAnalysis/performance_analysis_time`, {
        method: 'POST',
        body: params
    });
}
