import request from '../utils/request';

export async function Login() {
  return request('/enforcement/sys/login', {
    method: 'POST',
  });
}
export async function Dictionary() {
  return request('/services/enforcement/sys/myDictSelect');
}
export async function AddDicCat(params) {
  return request('/services/enforcement/sys/insertDictType', {
    method: 'POST',
    body: params,
  });
}
export async function EditDicCat(params) {
  return request('/services/enforcement/sys/updateDictType', {
    method: 'POST',
    body: params,
  });
}
export async function DelDicCat(params) {
  return request('/services/enforcement/sys/deleteDictType', {
    method: 'POST',
    body: params,
  });
}

export async function AddMyDic(params) {
  return request('/services/enforcement/sys/addMyDict', {
    method: 'POST',
    body: params,
  });
}

export async function EditMyDic(params) {
  return request('/services/enforcement/sys/updateMyDict', {
    method: 'POST',
    body: params,
  });
}
export async function DelMyDic(params) {
  return request('/services/enforcement/sys/deleteMyDict', {
    method: 'POST',
    body: params,
  });
}
export async function DictionaryList(params) {
  return request('/services/enforcement/sys/listMyDict', {
    body: params,
    method: 'POST',
  });
}
export async function DictionarySelect() {
  return request(`/services/lookup/init/parentBank`, {
    method: 'GET',
  });
}
export async function taksType() {
  return request(`/services/lookup/init/taskType`, {
    method: 'GET',
  });
}
export async function patchWorkOrderStatus() {
  return request(`/services/lookup/init/workOrdersStatistics`, {
    method: 'GET'
  })
}
export async function categoriesOfCases() {
  return request(`/services/lookup/init/workOrderCategory`, {
    method: 'GET'
  })
}
export async function summaryCases() {
  return request(`/services/enforcement/summaryCases/getList`, {
    method: 'GET'
  })
}
export async function DictionarySelectStatus() {
  return request(`/services/lookup/init/workOrdersStatistics`, {
    method: 'GET',
  });
}
export async function DepartmentSelect() {
  return request(`/services/enforcement/role/getAllApartment`, {
    method: 'GET',
  });
}
export async function CooperationSelect(params) {
  return request(`/services/enforcement/sys/getSponsorDepartmentPeople/${params.id}`, {
    method: 'GET',
  });
}

