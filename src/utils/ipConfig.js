// 开发图片服务器
// export const picIp = 'http://172.16.34.137:9333/';
// 测试图片服务器
// export const picIp = 'http://10.110.200.48:9333/';
// 线上图片服务器
// export const picIp = 'http://58.213.107.106:60066/';
// 线上图片服务器
export const mapIp = 'http://www.yhszpt.cn:8086/map/';   // 'http://127.0.0.1:8080/';


const path = window.publicPath;
const Ips = {
  get value() {
    if (path.indexOf('http://58.213.107.106') > -1) {
      return 'http://58.213.107.106:60066/'
    }
    if (path.indexOf('http://10.110.200.48') > -1) {
      return 'http://10.110.200.48:9333/'
    }
    return 'http://172.16.34.137:9333/';
  }
}


// export const picIp = 'http://58.213.107.106:60066/'
export const picIp = Ips.value;

