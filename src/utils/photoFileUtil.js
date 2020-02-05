/**
 * 文件相关工具类
 */
import { message } from 'antd';
export function exportPhotoService(path, fileName) {
  fetch(path, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    cache: 'default',
    dataType: 'application/excel;charset=utf-8',
  })
    .then(response => response.blob())
    .then(blob => {
      if (blob.size < 500) {
        message.error('文件下载失败，请稍后再试');
        return;
      }
      let url = window.URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.href = url;
      if (fileName == null) {
        fileName = 'photo';
      }
      a.download = fileName + '.png';
      if (document.all) {
        a.click();
      } else {
        let evt = document.createEvent('MouseEvents');
        evt.initEvent('click', true, true);
        a.dispatchEvent(evt);
      }
    })
    .catch(error => {
      console.log(error);
    });
}

//post方式导出文件
export function exportServiceByPost(path, fileName, data) {
  fetch(path, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include',
    cache: 'default',
    dataType: 'application/excel;charset=utf-8',
  })
    .then(response => response.blob())
    .then(blob => {
      if (blob.size < 500) {
        message.error('文件下载失败，请稍后再试');
        return;
      }
      let url = window.URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.href = url;
      if (fileName == null) {
        fileName = 'default_excel_name';
      }
      a.download = fileName + '.png';
      if (document.all) {
        a.click();
      } else {
        let evt = document.createEvent('MouseEvents');
        evt.initEvent('click', true, true);
        a.dispatchEvent(evt);
      }
    })
    .catch(error => {
      console.log(error);
    });
}
