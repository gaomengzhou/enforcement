import request from '../utils/request';
// 来源分析 列表
export async function sourceList(params) {
  return request('/services/enforcement/sys/sourceAnalysis', {
    body: params,
    method: 'POST',
  });
}
// 来源分析 饼状图
export async function sourceChart(params) {
  return request('/services/enforcement/DataAnalysis/source_analysis', {
    body: params,
    method: 'POST',
  });
}
// 来源分析 导出表格
export async function downloadExcel(params) {
  return request('/services/enforcement/sys/exportForm', {
    method: 'POST',
    body: params,
  });
}
// 总体分析 部门派发 列表
export async function totalDepList(params) {
  return request('/services/enforcement/DataAnalysis/overallAnalysis', {
    method: 'POST',
    body: params,
  });
}
// 总体分析 领导交办 列表
export async function totalLeaderList(params) {
  return request('/services/enforcement/DataAnalysis/allLeaderset', {
    method: 'POST',
    body: params,
  });
}
// 总体分析 智能生成 列表
export async function totalIntelligenceList(params) {
  return request('/services/enforcement/DataAnalysis/allIntelligence', {
    method: 'POST',
    body: params,
  });
}
// 总体分析 科室类别 列表
export async function totalSectionList(params) {
  return request('/services/enforcement/DataAnalysis/overall_org', {
    method: 'POST',
    body: params,
  });
}
// 总体分析 导出表格 部门派发
export async function downloadExcelDep(params) {
  return request(`/services/enforcement/DataAnalysis/exportAnalysis/${params.startT}/${params.endT}`, {
    method: 'GET',
  });
}
// 总体分析 导出表格 领导交办
export async function downloadExcelLeader(params) {
  return request('/services/enforcement/sys/exportGovAnalysis', {
    method: 'POST',
    body: params,
  });
}
// 总体分析 导出表格 智能生成
export async function downloadExcelInt(params) {
  return request('/services/enforcement/sys/exportGenAnalysis', {
    method: 'POST',
    body: params,
  });
}
// 工单增减趋势
export async function patchIncreaseAndDecreaseTrend(params) {
  return request(`/services/enforcement/DataAnalysis/part_change`, {
    method: 'POST',
    body: params
  })
}
export async function patchLeadershipLncreaseAndDecreaseTrend(params){
  return request(`/services/enforcement/DataAnalysis/leader_change`,{
    method:'POST',
    body:params
  })
}

// 工单数量趋势--部门派发
export async function patchQuantitativetrends(params) {
  return request(`/services/enforcement/DataAnalysis/part_num`, {
    method: 'POST',
    body: params
  })
}
// 工单数量趋势--领导交办
export async function patchLeadershipQuantityTrend(params){
  return request(`/services/enforcement/DataAnalysis/leader_num`,{
    method:'POST',
    body:params
  })
}

export async function patchTrendOfIntelligentGeneration(params){
  return request(`/services/enforcement/DataAnalysis/intelligen_num`,{
    method:'POST',
    body:params
  })
}
export async function patchIntelligentGenerationIncreaseOrDecrease(params){
  return request(`/services/enforcement/DataAnalysis/intelligen_change`,{
    method:'POST',
    body:params
  })
}

// 增减分析 部门派发
export async function increaseDepDisposal(params) {
  return request('/services/enforcement/DataAnalysis/fnc_in_analysis', {
    method: 'POST',
    body: params,
  });
}
// 增减分析 领导交办
export async function increaseLeader(params) {
  return request('/services/enforcement/DataAnalysis/fnc_leader_analysis', {
    method: 'POST',
    body: params,
  });
}
// 增减分析 智能生成
export async function increaseInt(params) {
  return request('/services/enforcement/DataAnalysis/fnc_intel_analysis', {
    method: 'POST',
    body: params,
  });
}
// 类别分析 部门派发 综合执法
export async function categoryComprehensive(params) {
  return request('/services/enforcement/DataAnalysis/category_analysis_zf', {
    method: 'POST',
    body: params,
  });
}
// 类别分析 智能生成
export async function categoryIntelligent(params) {
  return request('/services/enforcement/sys/enforceCategoryAnalysis', {
    method: 'POST',
    body: params,
  });
}
// 类别分析 城管工单
export async function categoryInspector(params) {
  return request('/services/enforcement/DataAnalysis/category_analysis_cg', {
    method: 'POST',
    body: params,
  });
}
// 类别分析 领导交办
export async function categoryLeader(params) {
  return request('/services/enforcement/DataAnalysis/category_analysis_ld', {
    method: 'POST',
    body: params,
  });
}
// 类别分析 投诉工单
export async function categoryComplain(params) {
  return request('/services/enforcement/DataAnalysis/category_analysis_tu', {
    method: 'POST',
    body: params,
  });
}
