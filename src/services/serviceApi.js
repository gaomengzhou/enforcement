/**
 * service层的封装：常见的几种请求
 * 包括GET POST PUT DELETE  导入/导出  excel
 */
import request from '@/utils/request';
import { exportExcelService, exportServiceByPost,exportExcelService1,exportExcelService2,exportExcelService3,exportExcelService4 ,exportExcelService5,exportExcelService6,exportExcelServiceNew,exportExcelServiceNew2,exportExcelServiceNew3} from '@/utils/fileUtil';
import { uploadService as uploadFileService } from '@/utils/myFetch';
import { exportPhotoService } from '@/utils/photoFileUtil';
/**
 * GET请求
 * @param url  请求的地址
 * @param params   格外的参数，默认值为空
 * @returns {Promise.<Object>}
 */
export async function getService(url, options) {
  return request(url, options);
}

/**
 * POST 请求
 * @param url 请求地址
 * @param body  body
 * @returns {Promise.<Object>}
 */
export async function postService(url, body) {
  return request(url, {
    method: 'POST',
    body: {
      ...body,
    },
  });
}
export async function postArrService(url, body) {
  return request(url, {
    method: 'POST',
    body,
  });
}

/**
 * PUT  service
 * @param url
 * @param body
 * @returns {Promise.<Object>}
 */
export async function putService(url, body) {
  return request(url, {
    method: 'PUT',
    body: {
      ...body,
    },
  });
}

/**
 * DELETE service
 * @param url
 * @returns {Promise.<Object>}
 */
export async function deleteService(url) {
  return request(url, { method: 'DELETE' });
}

/**
 * 导出excel  get请求
 * @param url   请求地址
 * @param fileName  文件名
 * @returns {Promise.<void>}
 */
export async function exportServiceNew3(url, fileName) {
  exportExcelServiceNew3(url, fileName);
}
export async function exportServiceNew2(url, fileName) {
  exportExcelServiceNew2(url, fileName);
}
export async function exportServiceNew(url, fileName) {
  exportExcelServiceNew(url, fileName);
}
export async function exportService(url, fileName) {
  exportExcelService(url, fileName);
}
export async function exportService1(url, fileName) {
  exportExcelService1(url, fileName);
}
export async function exportService2(url, fileName) {
  exportExcelService2(url, fileName);
}
export async function exportService3(url, fileName) {
  exportExcelService3(url, fileName);
}
export async function exportService4(url, fileName) {
  exportExcelService4(url, fileName);
}
export async function exportService5(url, fileName) {
  exportExcelService5(url, fileName);
}
export async function exportService6(url, fileName) {
  exportExcelService6(url, fileName);
}
// 导出photo
export async function exportPhotosService(url, fileName) {
  exportPhotoService(url, fileName);
}

/**
 * 上传文件  post请求
 * @param url   请求地址
 * @param files  文件
 * @param name 名字
 * @returns {Promise.<void>}
 */
export async function uploadService(url, files, name) {
  return uploadFileService(url, files, name);
}

/**
 * 上传文件  post请求
 * @param url   请求地址
 * @param files  文件
 * @param callback 回调函数，后天数据传输
 * @returns {Promise.<void>}
 */
export async function exportByPost(url, fileName, data = {}) {
  return exportServiceByPost(url, fileName, data);
}

/**
 * 获取字典接口
 * @param {*} groupCode 字典名称
 */
export async function lookupService(groupCode) {
  return request(`/services/lookup/init/${groupCode}`)
}
