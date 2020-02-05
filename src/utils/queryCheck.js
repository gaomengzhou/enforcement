import { removeStrSpace } from './regAndFunc';

export function getQueryUrl(params) {
  let result = '';
  if (params) {
    const keys = Object.keys(params);
    if (keys.length) {
      result += '?Q=';
      keys.forEach(key => {
        if (
          params[key] === undefined ||
          params[key] === '' ||
          key === 'complainaddresscommunity_S_EQ' ||
          key === 'createdate_T_EQ' ||
          key === 'reporttime_T_EQ' ||
          key === 'sponsordepartment_I_EQ' ||
          key === 'workOrderStatusId_S_EQ' ||
          key === 'workorderid_S_EQ'
        ) {
          return;
        }
        result += `${key}=${encodeURIComponent(removeStrSpace(params[key]))}&&Q=`;
      });
      if (result === '?Q=') {
        result = '';
      } else {
        result = result.slice(0, result.length - 4);
      }
    }
  }
  return result;
}
