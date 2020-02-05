import request from '../utils/request';
// 首页 待办事项
export async function toDolist(params) {
  return request('/services/enforcement/sys/toDoList', {
    method: 'POST',
    body: params,
  });
}
// 智能生成 派单统计
export async function statistics(params) {
  return request('/services/enforcement/Intelligence/fun_gen_dispense', {
    method: 'POST',
    body: params,
  });
}
// 智能生成 派单统计 生成
export async function statisticsThreshold(params) {
  return request('/services/enforcement/sys/setOrderThreshold', {
    method: 'POST',
    body: params,
  });
}


// 修改
export async function changeDatas(params) {
  return request('/services/enforcement/Intelligence/update_ps', {
    method: 'POST',
    body: params,
  })
}
