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
          key === 'current' ||
          key === 'pageSize' ||
          key === 'total' ||
          key === 'page' ||
          key === 'currentUserId'
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
