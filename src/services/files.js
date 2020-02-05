import request from '../utils/request';
// 投诉工单 上传附件
export async function importComplainFiles(params) {
  return request('/services/enforcement/sys/uploadComplainPicture',{
    body:params,
    method:'POST',
  });
}
// 投诉工单  删除
export async function deleteComplainFiles(params) {
  return request('/services/enforcement/ms/deleteComplainPicture',{
    body:params,
    method:'POST',
  });
}
// 投诉举报 上传附件列表
export async function listComplainFiles(params) {
  return request('/services/enforcement/ms/listComplainPicture',{
    body:params,
    method:'POST',
  });
}
// 城管工单 上传附件
export async function importInspectorFiles(params) {
  return request('/services/enforcement/sys/uploadManagementPicture',{
    body:params,
    method:'POST',
  });
}
// 城管工单 附件删除
export async function deleteInspectorFiles(params) {
  return request('/services/enforcement/ms/deleteUrbanManagementPicture',{
    body:params,
    method:'POST',
  });
}
// 城管工单 上传附件列表
export async function listInspectorsFiles(params) {
  return request('/services/enforcement/ms/listUrbanManagementPicture',{
    body:params,
    method:'POST',
  });
}
// 领导交办 上传附件
export async function importLeaderFiles(params) {
  return request('/services/enforcement/sys/uploadGovermentPicture',{
    body:params,
    method:'POST',
  });
}
// 领导交办 上传附件 新增
export async function importAddLeaderFiles(params) {
  return request('/services/enforcement/sys/upload',{
    body:params,
    method:'POST',
  });
}
// 领导交办 上传附件 新增列表
export async function listAddLeaderFiles(params) {
  return request('/services/enforcement/sys/listpictures',{
    body:params,
    method:'POST',
  });
}
// 领导交办 删除
export async function deleteListLeaderFiles(params) {
  return request('/services/enforcement/ms/deleteGovernmentPicture',{
    body:params,
    method:'POST',
  });
}
// 领导交办 新增 删除附件
export async function deleteAddListLeaderFiles(params) {
  return request('/services/enforcement/sys/deleteImage',{
    body:params,
    method:'POST',
  });
}
// 领导交办 附件列表
export async function listLeaderFiles(params) {
  return request('/services/enforcement/ms/listGovernmentPicture',{
    body:params,
    method:'POST',
  });
}
// 综合执法 上传附件列表
export async function listComprehensiveFiles(params) {
  return request('/services/enforcement/ms/listEnforcementPicture',{
    body:params,
    method:'POST',
  });
}
// 综合执法 上传附件
export async function importComprehensiveFiles(params) {
  return request('/services/enforcement/sys/uploadEnforcrmentPicture', {
    method: 'POST',
    body: params,
  });
}
// 综合执法 附件下载
export async function downloadComprehensiveFiles(params) {
  return request('/services/enforcement/sys/downloadImage',{
    body:params,
    method:'POST',
  });
}
// 综合执法 附件删除
export async function deleteComprehensiveFiles(params) {
  return request('/services/enforcement/ms/deleteEnforcementPicture',{
    body:params,
    method:'POST',
  });
}
