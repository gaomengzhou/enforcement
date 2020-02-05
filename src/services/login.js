import request from '../utils/request';

// eslint-disable-next-line import/prefer-default-export
export async function loginIn(params) {
  return request('/services/security/login',{
    body:params,
    method:'POST',
  });
}
