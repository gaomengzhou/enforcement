//正则表达式检验
export const regExp = {
  isPint: /[1-9]\d*/, // 正整数
  isNint: /-[1-9]\d*/, // 负整数
  isMail: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/, // 邮箱
  isNumber: /^\d{2,4}$/, //m n 需要自定义,判断是否是2位/3位或4位数字
  isNumberOrFloat: /^(-)?\d+(\.\d+)?$/, //正负整数或者正负小数
  isMobilephone: '^1[0-9]{10}$|^+[0-9]{1,3}1[0-9]{10}$', //手机号码
  isPhone: /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/, //电话
  isPhoneArea: /^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/, //带区号的电话
  isIntOrFloat: /^([1-9][0-9]*)+(.[0-9]{1,4})?$/, //非零开头的最多带4位小数的数字
  isSocialCreditCode: /^[A-Z0-9]{18}$/, //社会统一信用代码,18位 数字或大写英文字母组成
  isSocialCreditCode_precise: /^[^_IOZSVa-z\W]{2}\d{6}[^_IOZSVa-z\W]{10}$/g, //精准的社会统一信用代码,比如这个就是对的:A1430111MA4L16JQ9B
  isBusLicense: /\d{15}$/, //工商注册号:15位数字
  isOrgCode: /^[A-Z0-9]{9}$/, //组织机构代码:9位数字或大写英文字母
  isTaxId: /^[A-Za-z0-9]{15}$|^[A-Za-z0-9]{18}$|^[A-Za-z0-9]{20}$/, //纳税人识别号:15位、18或者20位数字或字母
  // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
  isIdCard: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/,
  isIpAdress: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
};

//正则调用示例：
// let r = regex.isNumberOrFloat.test('1.3332.6')
// console.log(r);

//过滤富文本
export function guolvfuwenben(content) {
  return !!(content
    ? content
        .replace(/<\/?[^>]*>/gim, '')
        .replace(/&nbsp;/, '')
        .replace(/(^\s+)|(\s+$)/g, '')
        .replace(/\s/g, '')
        .replace(/[ ]|[&nbsp;]/g, '')
    : '');
}
//限定字符串长度
export function getchars(content, length) {
  return content.length > length ? content.slice(0, length) + '...' : content;
}

//删去一个字符串左右两端空格
export function removeStrSpace(str) {
  if (str && typeof str === 'string') {
    return str.replace(/(^\s*)|(\s*$)/g, '');
  }
  return str;
}
