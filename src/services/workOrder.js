/* eslint-disable no-param-reassign */
/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
// eslint-disable-next-line import/no-extraneous-dependencies
// eslint-disable-next-line no-unused-vars
// eslint-disable-next-line import/no-extraneous-dependencies
import { async } from 'q';
import request from '../utils/request';
import { getQueryUrl } from '@/utils/queryFilter';

// 智能生成
export async function Login() {
  return request('/enforcement/sys/login', {
    method: 'POST',
  });
}

// 领导交办
export async function LeaderList(params) {    // 列表
  return request('/services/enforcement/ms/listGovernmentWorkOrder', {
    method: 'POST',
    body: params,
  });
}
export async function LeaderAdd(params) {    // 添加
  return request('/services/enforcement/ms/addGovernmentWorkOrder', {
    method: 'POST',
    body: params
  });
}
export async function LeaderUpdate(params) {     // 更新
  return request('/services/enforcement/ms/updateGovernmentWorkOrder', {
    method: 'POST',
    body: params
  });
}
export async function LeaderDetail(params) {      // 详情
  return request(`/services/enforcement/ms/getGovernmentWorkOrder/${params.id}`, {
    method: 'GET',
  });
}
export async function LeaderDelete(params) {      // 删除
  return request(`/services/enforcement/ms/deleteGovernmentWorkOrder/${params.id}`, {
    method: 'GET',
  });
}
// 领导交办 派单
export async function LeaderDispatch(params) {
  return request('/services/enforcement/adminiWorkFlow/sendComplete', {
    method: 'POST',
    body: params
  });
}
// 领导交办 废案
export async function LeaderWasteCase(params) {
  return request('/services/enforcement/adminiWorkFlow/abolishWorkFlow', {
    method: 'POST',
    body: params
  });
}
// 领导交办 复核
export async function LeaderReview(params) {
  return request('/services/enforcement/adminiWorkFlow/senderCheck', {
    method: 'POST',
    body: params
  });
}
// 领导交办 结案、确认结案
export async function LeaderCloseCase(params) {
  return request('/services/enforcement/adminiWorkFlow/batchSenderCheck', {
    method: 'POST',
    body: params
  });
}
// 领导交办 退回
export async function LeaderReturn(params) {
  return request('/services/enforcement/adminiWorkFlow/fallback', {
    method: 'POST',
    body: params
  });
}
// 领导交办 最新处理意见
export async function latestOpinionsProcessing(params) {
  return request(`/services/enforcement/sys/getByWorkOrderId/${params.workOrderId}`, {
    method: 'GET',
  });
}
// 投诉工单
// 投诉工单列表
export async function complainListBaseInfo(params) {
  return request('/services/enforcement/ms/listComplainOrder', {
    body: params,
    method: 'POST',
  });
}
// 投诉工单列表--删除
export async function complainListDeleteBaseInfo(params) {
  return request(`/services/enforcement/ms/deleteComplainOrder/${params.id}`);
}
// 投诉工单详情
export async function complainDetailBaseInfo(params) {
  return request(`/services/enforcement/ms/getComplainOrder/${params.id}`);
}
// 投诉工单列表--添加
export async function complainAddBaseInfo(params) {
  return request('/services/enforcement/ms/addComplainOrder', {
    body: params,
    method: 'POST',
  });
}
// 投诉工单-修改
export async function complainUpdateBaseInfo(params) {
  return request('/services/enforcement/ms/updateComplainOrder', {
    body: params,
    method: 'POST',
  });
}
// 投诉工单 派单
export async function complainDispatch(params) {
  return request('/services/enforcement/complainWorkFlow/sendComplete', {
    body: params,
    method: 'POST',
  });
}
// 投诉工单 废案
export async function complainWasteCase(params) {
  return request('/services/enforcement/complainWorkFlow/abolishWorkFlow', {
    body: params,
    method: 'POST',
  });
}
// 投诉工单 结案/确认结案
export async function complainCloseCase(params) {
  return request('/services/enforcement/complainWorkFlow/batchSenderCheck', {
    body: params,
    method: 'POST',
  });
}
// 投诉工单 退回
export async function complainGoBack(params) {
  return request('/services/enforcement/complainWorkFlow/fallback', {
    body: params,
    method: 'POST',
  });
}
// 投诉工单 复核
export async function complainReview(params) {
  return request('/services/enforcement/complainWorkFlow/senderCheck', {
    method: 'POST',
    body: params,
  });
}

// 城管工单
// 城管工单列表
export async function InspectorListInfo(params) {
  return request('/services/enforcement/ms/listUrbanManagement', {
    body: params,
    method: 'POST',
  });
}
// 城管工单上报
export async function InspectorReport(params) {
  return request('/services/enforcement/enforcementWorkflow/report', {
    body: params,
    method: 'PUT',
  });
}
// 城管工单详情
export async function InspectorInfo(params) {
  return request(`/services/enforcement/ms/getUrbanManagement/${params.id}`);
}
// 城管工单 删除
export async function deleteCaseInspectors(params) {
  return request(`/services/enforcement/ms/deleteUrbanManagement/${params.managementWorkId}`);
}
// 城管工单修改
export async function updateInspectorsDetail(params) {
  return request('/services/enforcement/ms/updateUrbanManagement', {
    body: params,
    method: 'POST',
  });
}
export async function AddInspector(params) {   // 添加
  return request('/services/enforcement/ms/addUrbanManagement', {
    method: 'POST',
    body: params,
  });
}
export async function comprehensiveDelete(params) {     // 删除
  return request(`/services/enforcement/ms/deleteUrbanManagement/${params.id}`, {
    method: 'GET',
  });
}
export async function processListInspectors(params) {   // 城管工单-工作过程
  return request(`/services/enforcement/sys/listWorkProcessByWorkOrderId/${params.workOrderId}`, {
    method: 'GET',
  });
}


// 综合执法列表
export async function comprehensiveListBaseInfo(params) {
  return request('/services/enforcement/ms/listComprehensiveLawEnforcement', {
    body: params,
    method: 'POST',
  });
}
// 综合执法详情
export async function comprehensiveDetailBaseInfo(params) {
  return request(`/services/enforcement/ms/getComprehensiveLawEnforcement/${params.id}`);
}
// 综合执法修改
export async function updateComprehensiveDetail(params) {
  return request('/services/enforcement/ms/updateComprehensiveLawEnforcement', {
    method: 'POST',
    body: params
  });
}
// 综合执法 派单
export async function comprehensiveDispatch(params) {
  return request(`/services/enforcement/enforcementWorkflow/sendEnforceOrder`, {
    method: 'PUT',
    body: params,
  });
}
// 综合执法 退回
export async function comprehensiveReturn(params) {
  return request(`/services/enforcement/enforcementWorkflow/goBack`, {
    method: 'PUT',
    body: params,
  });
}
// 综合执法 废案
export async function comprehensiveWasteCase(params) {
  return request(`/services/enforcement/enforcementWorkflow/goBack`, {
    method: 'PUT',
    body: params,
  });
}
// 综合执法  追回
export async function comprehensiveRecover(params) {
  return request(`/services/enforcement/enforcementWorkflow/recoverEnforceOrder`, {
    method: 'PUT',
    body: params,
  });
}
// 综合执法  复核
export async function comprehensiveReview(params) {
  return request(`/services/enforcement/enforcementWorkflow/review`, {
    method: 'PUT',
    body: params,
  });
}
// 综合执法  确认结案
export async function comprehensiveCloseCase(params) {
  return request(`/services/enforcement/enforcementWorkflow/confirmClosingCase`, {
    method: 'PUT',
    body: params,
  });
}
// 综合执法添加
export async function comprehensiveAdd(params) {
  return request('/services/enforcement/ms/addComprehensiveLawEnforcement', {
    body: params,
    method: 'POST',
  });
}

// 附件信息
export async function AddAttachment(params) {   // 添加
  return request('/services/enforcement/sys/addAttachment', {
    method: 'POST',
    body: params
  });
}
export async function AttachmentList(params) {   // 列表
  return request('/services/enforcement/sys/listAttachment', {
    method: 'POST',
    body: params
  });
}
export async function EditAttachment(params) {   // 修改
  return request('/services/enforcement/sys/updateAttachment', {
    method: 'POST',
    body: params
  })
}
export async function DelAttachment(params) {   // 删除
  return request(`/services/enforcement/sys/deleteAttachment/${params.id}`, {
    method: 'GET',
  });
}
export async function AttachmentInfo(params) {   // 详情
  return request(`/services/enforcement/sys/getAttachment/${params.id}`, {
    method: 'GET',
  });
}
// 工作过程
export async function processList(params) {   // 列表
  return request(`/services/enforcement/sys/listWorkProcessByWorkOrderId/${params.workOrderId}`, {
    method: 'GET',
  });
}
// 任务处置
export async function taskManagementoInfo(params) {
  return request(`/services/enforcement/sys/getTaskDisposeByWorkOrderId/${params.workOrderId}`);
}
// 二级处置
export async function managementoFetchInfo(params) {
  return request(`/services/enforcement/sys/getSecondTaskDisposeByWorkOrderId/${params.workOrderId}`);
}
// 处理程序
export async function processingProgram() {
  return request(`/services/enforcement/sys/getCaseTypes`);
}

// 案件大类
export async function bigClass(params) {
  return request(`/services/enforcement/sys/getCaseLargeClasses/${params.typeCode}`);
}
// 案件小类
export async function smallClass(params) {
  return request(`/services/lookup/${params.largeClassCode}`);
}
// 城管工单 派遣/派单
export async function dispatchParameter(params) {
  return request(`/services/enforcement/manageMentFlow/startAndSendOrder`, {
    method: 'PUT',
    body: params,
  });
}
// 城管工单 退回 5
export async function returnParameterThree(params) {
  return request(`/services/enforcement/manageMentFlow/deferred`, {
    method: 'PUT',
    body: params,
  });
}
// 城管工单 退回 6
export async function returnParameterFour(params) {
  return request(`/services/enforcement/manageMentFlow/checkOrder`, {
    method: 'PUT',
    body: params,
  });
}
// 城管工单 退回 9
export async function returnParameterNine(params) {
  return request(`/services/enforcement/manageMentFlow/checkReOrder`, {
    method: 'PUT',
    body: params,
  });
}
// 城管工单 结案 6
export async function closeCaseSixParameter(params) {
  return request(`/services/enforcement/manageMentFlow/checkOrder`, {
    method: 'PUT',
    body: params,
  });
}
// 城管工单 结案 9
export async function closeCaseNineParameter(params) {
  return request(`/services/enforcement/manageMentFlow/checkReOrder`, {
    method: 'PUT',
    body: params,
  });
}
// 城管工单 废案
export async function wasteCaseParameter(params) {
  return request(`/services/enforcement/manageMentFlow/abolishWorkFlow`, {
    method: 'POST',
    body: params,
  });
}
// 城管工单 结案
export async function detailCloseCase(params) {
  return request(`/services/enforcement/manageMentFlow/checkOrder`, {
    method: 'PUT',
    body: params,
  });
}
// 城管工单 所有案件大类
// export async function bigAllClass(params) {
//   return request(`/services/enforcement/sys/getAllLargeClasses`,{
//     method:'POST',
//     body:params,
//   });
// }
export async function bigAllClass() {
  return request(`/services/lookup/init/eventCategory`, {
    method: 'GET'
  })
}
// 定时生成 列表
export async function timinglist(params) {
  const query = getQueryUrl(params.obj);
  return request(`/services/enforcement/Intelligence/getList/${params.page}/${params.pageSize}/${params.userRole}/${params.type}${query}`, {
    method: 'GET',
  });
}
// 定时生成列表查询功能
export async function timinglistFetchForChecks(params) {
  const query = getQueryUrl(params.obj);
  return request(`/services/enforcement/Intelligence/getList/${params.page}/${params.pageSize}/${params.userRole}/${params.type}${query}`, {
    method: 'GET',
  });
}
// 匹配生成列表
export async function match(params) {
  const query = getQueryUrl(params.obj);
  return request(`/services/enforcement/Intelligence/getList/${params.page}/${params.pageSize}/${params.userRole}/${params.type}${query}`, {
    method: 'GET',
  });
}
export async function patchSetModalData(params) {
  return request(`/services/enforcement/urban/save`, {
    method: 'POST',
    body: params
  })
}
// 匹配生成 统计条件 智能生成 列表
export async function matchGeneration(params) {
  return request(`/services/enforcement/Intelligence/gen_match_list`, {
    method: 'POST',
    body: params,
  });
}
// //匹配生成 统计条件 智能生成按钮
export async function matchGenerationInt(params) {
  return request(`/services/enforcement/Intelligence/fun_gen_match`, {// markConvenience
    method: 'POST',
    body: params,
  });
}
// 匹配生成 手动条件生成 智能生成按钮
export async function matchManual(params) {
  return request(`/services/enforcement/Intelligence/saveList`, {
    method: 'POST',
    body: params,
  });
}
// 导入1234word工单
export async function exportWord(params) {
  return request('/services/enforcement/wordImport/upload', {
    body: params,
    method: 'POST',
  });
}
// 定时生成 投诉工单定时生成规则表
export async function complainGeneratingRule(params) {
  const query = getQueryUrl(params.obj);
  return request(`/services/enforcement/Intelligence/select_ts_ds/${params.pageNum}/${params.pageSize}${query}`, {
    body: params,
    method: 'POST',
  });
}
// 定时生成 城管工单定时生成规则表
export async function inspectorsGeneratingRule(params) {
  const query = getQueryUrl(params.obj);
  return request(`/services/enforcement/Intelligence/select_cg_ds/${params.pageNum}/${params.pageSize}${query}`, {
    body: params,
    method: 'POST',
  });
}
// 定时生成 综合执法工单定时生成规则表
export async function comprehensiveGeneratingRule(params) {
  const query = getQueryUrl(params.obj);
  return request(`/services/enforcement/Intelligence/select_zhzf_ds/${params.pageNum}/${params.pageSize}${query}`, {
    body: params,
    method: 'POST',
  });
}
// 智能生成 定时生成 结案 intCloseCase
export async function intCloseCase(params) {
  return request('/services/enforcement/manageMentFlow/batchSenderCheck', {
    body: params,
    method: 'POST',
  });
}
// 投诉工单智能生成规则 弹框
export async function complainDataModal(params) {
  const query = getQueryUrl(params.obj);
  return request(`/services/enforcement/Intelligence/list_cp/${params.pageNum}/${params.pageSize}${query}`, {
    method: 'GET',
  });
}
// 投诉工单智能生成规则 弹框 修改（保存）
export async function editComplainDataModal(params) {
  if (params.creatCycle == "月") {
    params.creatCycle = "3"
  } else if (params.creatCycle == "周") {
    params.creatCycle = "2"
  } else if (params.creatCycle == "天") {
    params.creatCycle = "1"
  }
  return request(`/services/enforcement/Intelligence/update`, {
    body: params,
    method: 'POST',
  });
}
// 城管工单工单智能生成规则 弹框
export async function inspectorDataModal(params) {
  const query = getQueryUrl(params.obj);
  return request(`/services/enforcement/Intelligence/list_um/${params.pageNum}/${params.pageSize}${query}`, {
    method: 'GET',
  });
}
// 城管智能生成规则 弹框 修改（保存）
export async function editInspectorDataModal(params) {
  if (params.creatCycle == "月") {
    params.creatCycle = "3"
  } else if (params.creatCycle == "周") {
    params.creatCycle = "2"
  } else if (params.creatCycle == "天") {
    params.creatCycle = "1"
  }
  return request('/services/enforcement/intelligence/updateUrbanManagementTimGenera', {
    body: params,
    method: 'POST',
  });
}
// 综合执法工单智能生成规则 弹框
export async function comprehensiveDataModal(params) {
  const query = getQueryUrl(params.obj);
  return request(`/services/enforcement/Intelligence/list_ch/${params.pageNum}/${params.pageSize}${query}`, {
    method: 'GET',
  });
}

// 综合执法工单生成规则 弹框 修改（保存）
export async function editComprehensiveDataModal(params) {
  if (params.creatCycle == "月") {
    params.creatCycle = "3"
  } else if (params.creatCycle == "周") {
    params.creatCycle = "2"
  } else if (params.creatCycle == "天") {
    params.creatCycle = "1"
  }
  return request('/services/enforcement/intelligence/updateComprehensiveLawEnforcementTimeGenera', {
    body: params,
    method: 'POST',
  });
}
// 投诉工单 智能生成规则 弹框 模板下载（导出)
export async function downLoadTemplateComplain() {
  return request('/services/enforcement/intelligence/exportComplainOrderTimeGeneraVo', {
    method: 'GET',
    // body: params,
  });
}
// 投诉工单 智能生成规则 弹框 导入设置
export async function importComplainExcel(params) {
  return request('/services/enforcement/Intelligence/importComplaint', {
    body: params,
    method: 'POST',
  });
}
// 城管工单 智能生成规则 弹框 模板下载（导出)
export async function downLoadTemplateInspector() {
  return request('/services/enforcement/intelligence/exportUrbanManagementTimGenera', {
    method: 'GET',
    // body: params,
  });
}
// 城管工单 智能生成规则 弹框 导入设置
export async function importInspectorExcel(params) {
  return request('/services/enforcement/Intelligence/importUrbanManage', {
    body: params,
    method: 'POST',
  });
}
// 综合执法 智能生成规则 弹框 模板下载（导出)
export async function downLoadTemplateComprehensive() {
  return request('/services/enforcement/intelligence/exportComprehensiveLawEnforcementTimeGenera', {
    method: 'GET',
    // body: params,
  });
}
// 综合执法 智能生成规则 弹框 导入设置
export async function importComprehensiveExcel(params) {
  return request('/services/enforcement/Intelligence/importComprehensive', {
    body: params,
    method: 'POST',
  });
}

// 综合执法 申请延期
export async function ComprehensiveExtend(params) {
  return request(`/services/enforcement/enforcementWorkflow/applyForExtension`, {
    method: 'PUT',
    body: params,
  });
}

// 综合执法 申请结案
export async function ComprehensiveEnd(params) {
  return request(`/services/enforcement/enforcementWorkflow/applyForClosingCase`, {
    method: 'PUT',
    body: params,
  });
}

// 城市管理 申请结案
export async function inspectorEnd(params) {
  return request(`/services/enforcement/manageMentFlow/deferred`, {
    method: 'PUT',
    body: params,
  });
}


// 城管工单 新增 保存
export async function addParameterSave(params) {
  return request(`/services/enforcement/ms/addUrbanManagement`, {
    method: 'POST',
    body: params,
  });
}

// 城管工单 新增 处置部门
export async function disposalDepartment() {
  return request(`/services/enforcement/sys/getSponsorDepartment`);
}
// 城管工单 新增 处置人员
export async function disposalPersonnel(params) {
  return request(`/services/enforcement/sys/getSponsorDepartmentPeople/${params.id}`);
}

// 城管工单 安排 安排执行人
export async function disposalDepartmentid(params) {
  return request(`/services/enforcement/sys/getSponsorDepartment/${params.id}`, {
    method: 'GET',
  });
}

// 城管工单 上报
export async function topreport(params) {
  return request(`/services/enforcement/manageMentFlow/report`, {
    method: 'POST',
    body: params,
  });
}
// 工单详情 安排
export async function arrange(params) {
  return request(`/services/enforcement/manageMentFlow/principalComplete`, {
    method: 'POST',
    body: params,
  });
}
// 工单详情 申请结案
export async function applySettlement(params) {
  return request(`/services/enforcement/manageMentFlow/workflowDeal`, {
    method: 'POST',
    body: params,
  });
}
// 工单详情 审核通过
export async function verified(params) {
  return request(`/services/enforcement/manageMentFlow/leaderCheckComplete`, {
    method: 'POST',
    body: params,
  });
}
// 处置部门
export async function directClass() {
  return request(`/services/enforcement/sys/getSponsorDepartment`, {
    method: 'GET',
  });
}
// 承办人员
export async function directPelpro(params) {
  return request(`/services/enforcement/sys/getSponsorDepartmentPeople/ + ${params.id}`, {
    method: 'GET',
  });
}

// 领导交办 审核通过
export async function leaderCheckComplete(params) {
  return request(`/services/enforcement/adminiWorkFlow/leaderCheckComplete`, {
    method: 'POST',
    body: params,
  });
}

// 领导交办 安排
export async function leaderarrange(params) {
  return request(`/services/enforcement/adminiWorkFlow/principalComplete`, {
    method: 'POST',
    body: params,
  });
}

// 通过部门id查询部门名字
export async function getSponsor(params) {
  return request(`/services/enforcement/sys/getSponsor/ + ${params}`, {
    method: 'GET',
  });
}

// 获取登录信息
export async function authInfo() {
  return request(`/services/security/authInfo`, {
    method: 'GET',
  });
}


// 统计分析-类别分析-综合执法echarts
export async function patchComprehensiveEcharts(params) {
  return request(`/services/enforcement/DataAnalysis/category_analysis_zf`, {
    method: 'POST',
    body: params
  })
}


// 投诉工单
export async function patchComplaintOrder(params) {
  return request(`/services/enforcement/complaint/getById/${params.id}/${params.userRole}/${params.check}`, {
    method: 'GET'
  })
}

// 城管工单
export async function patchUrbanOrder(params) {
  return request(`/services/enforcement/urban/getById/${params.id}/${params.userRole}/${params.check}`, {
    method: 'GET'
  })
}

// 综合执法
export async function patchComprehensiveOrder(params) {
  return request(`/services/enforcement/comprehensive/getById/${params.id}/${params.userRole}/${params.check}`, {
    method: 'GET'
  })
}

export async function patchSetModalDatas(params) {
  return request(`/services/enforcement/comprehensive/save`, {
    method: 'POST',
    body: params
  })
}

export async function patchThatComplantDatas(params) {
  return request(`/services/enforcement/complaint/save`, {
    method: 'POST',
    body: params
  })
}
