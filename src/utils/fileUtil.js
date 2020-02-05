/**
 * 文件相关工具类
 */
import { message } from 'antd';
export function exportExcelService(path, fileName) {
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
        fileName = 'default_excel_name';
      }
      a.download = fileName + '.xls';
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
//自定义
export function exportExcelServiceNew(path, fileName) {
  const dates = new Date().toLocaleDateString();
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
        fileName = `投诉工单 (${dates})`;
      }
      a.download = fileName + '.xls';
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
export function exportExcelServiceNew2(path, fileName) {
  const dates = new Date().toLocaleDateString();
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
        fileName = `综合执法工单 (${dates})`;
      }
      a.download = fileName + '.xls';
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
export function exportExcelServiceNew3(path, fileName) {
  const dates = new Date().toLocaleDateString();
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
        fileName = `城管工单 (${dates})`;
      }
      a.download = fileName + '.xls';
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
//总体分析-部门派发
export function exportExcelService1(path, fileName) {
  const dates = new Date().toLocaleDateString();
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
        fileName = `总体分析-部门派发 - ${dates}`;
      }
      a.download = fileName + '.xls';
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
};
//总体分析-领导交办
export function exportExcelService2(path, fileName) {
  const dates = new Date().toLocaleDateString();
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
        fileName = `总体分析-领导交办 - ${dates}`;
      }
      a.download = fileName + '.xls';
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
};
//总体分析-智能生成
export function exportExcelService3(path, fileName) {
  const dates = new Date().toLocaleDateString();
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
        fileName = `总体分析-智能生成 - ${dates}`;
      }
      a.download = fileName + '.xls';
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
};
//总体分析-成效分析
export function exportExcelService5(path, fileName) {
  const dates = new Date().toLocaleDateString();
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
        fileName = `总体分析-成效分析 - ${dates}`;
      }
      a.download = fileName + '.xls';
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
};
//总体分析-来源分析
export function exportExcelService6(path, fileName) {
  const dates = new Date().toLocaleDateString();
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
        fileName = `总体分析-来源分析 - ${dates}`;
      }
      a.download = fileName + '.xls';
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
};

//总体分析-科室类别
export function exportExcelService4(path, fileName) {
  const dates = new Date().toLocaleDateString();
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
        fileName = `总体分析-科室类别 - ${dates}`;
      }
      a.download = fileName + '.xls';
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
};

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
      a.download = fileName + '.xls';
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
