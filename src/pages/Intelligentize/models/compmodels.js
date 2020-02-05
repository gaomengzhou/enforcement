/* eslint-disable no-unused-expressions */
import { message } from 'antd';
import { getQueryUrl } from '@/utils/queryFilter';
import { getService, exportByPost, postService, exportService, exportPhotosService } from '@/services/serviceApi';
import { patchSetModalDatas } from '@/services/workOrder';

export default {
  namespace: 'compmodels',

  state: {},

  effects: {
    *setModalData({ payload }, { call }) {
      const res = yield call(patchSetModalDatas, payload);
      if (res.retMsg === "操作成功") {
        message.success(res.retMsg)
      }
    },
    // 默认下拉数据
    *getGroupCode({ payload, callback }, { call }) {
      const res = yield call(getService, `/services/lookup/init/${payload.groupCode}`);
      callback && callback(res);
    },
    // 获取列表数据
    *getList({ payload, callback }, { call }) {
      const query = getQueryUrl(payload.obj);
      const res = yield call(
        getService,
        `/services/enforcement/comprehensive/getList/${payload.page}/${payload.pageSize}/${
        payload.id
        }${query}`
      );
      callback && callback(res);
    },
    // 获取主办部门
    *getUrbanApartment({ callback }, { call }) {
      const res = yield call(getService, `/services/enforcement/role/getEnforcementApartment`);
      res && callback(res);
    },
    //  获取处置人员
    *getUserListByOrgIdAndIsExecutive({ payload, callback }, { call }) {
      const res = yield call(
        getService,
        `/services/enforcement/role/getUserListByOrgId/${payload.id}`
      );
      res && callback(res);
    },
    //  获取安排时候的处置人员
    *getUserListByOrgIdAndIsExecutives({ payload, callback }, { call }) {
      const res = yield call(
        getService,
        `/services/enforcement/role/getUserListByOrgIdAndIsExecutive/${payload.id}`
      );
      res && callback(res);
    },
    // 详情页获取列表数据(工作过程)
    *getDetailListCourse({ payload, callback }, { call }) {
      const res = yield call(
        getService,
        `/services/enforcement/process/getByNumId/${payload.id}/${payload.userRole}`
      );
      callback && callback(res);
    },
    // 综合执法工单新增
    *save({ payload, callback }, { call }) {
      const res = yield call(postService, `/services/enforcement/comprehensive/save`, payload);
      res && callback(res);
    },
    // 详情页获取列表数据(常用，案件信息)
    *getDetailList({ payload, callback }, { call }) {
      const res = yield call(
        getService,
        `/services/enforcement/comprehensive/getById/${payload.id}/${payload.userRole}/${payload.check}`
      );
      res && callback(res);
    },
    // 综合执法信息中心派单
    *systemDispatch({ payload, callback }, { call }) {
      const res = yield call(
        postService,
        `/services/enforcement/comprehensive/systemDispatch`,
        payload
      );
      res && callback(res);
    },
    // 详情页上报
    *reportedData({ payload, callback }, { call }) {
      const res = yield call(
        postService,
        `/services/enforcement/comprehensive/executorReport`,
        payload
      );
      callback && callback(res);
    },
    // 领导安排
    *manageArrange({ payload, callback }, { call }) {
      const res = yield call(
        postService,
        `/services/enforcement/comprehensive/manageArrange`,
        payload
      );
      res && callback(res);
    },
    // 申请结案
    *executorHandle({ payload, callback }, { call }) {
      const res = yield call(
        postService,
        `/services/enforcement/comprehensive/executorHandle`,
        payload
      );
      res && callback(res);
    },
    // 领导审核
    *manageExamine({ payload, callback }, { call }) {
      const res = yield call(
        postService,
        `/services/enforcement/comprehensive/manageExamine`,
        payload
      );
      res && callback(res);
    },
    // 确认结案
    *closingCase({ payload, callback }, { call }) {
      const res = yield call(
        postService,
        `/services/enforcement/comprehensive/closingCase`,
        payload
      );
      res && callback(res);
    },
    // 获取网格
    *getGrid({ callback }, { call }) {
      const res = yield call(getService, `/services/enforcement/appApi/getGrid`);
      callback && callback(res);
    },
    // 自处置
    *self({ payload, callback }, { call }) {
      const res = yield call(postService, `/services/enforcement/comprehensive/self`, payload);
      res && callback(res);
    },
    // 删除
    *deteles({ payload, callback }, { call }) {
      const res = yield call(
        postService,
        `/services/enforcement/comprehensive/update/${payload.status}/${payload.id}`,
        payload
      );
      res && callback(res);
    },
    // 复核
    *reCheck({ payload, callback }, { call }) {
      const res = yield call(
        postService, `/services/enforcement/workDisposal/review`,
        payload
      );
      res && callback(res);
    },
    // 申请延期
    *application({ payload, callback }, { call }) {
      const res = yield call(
        postService, `/services/enforcement/postponement/applyDelay`,
        payload
      );
      res && callback(res);
    },
    // 延期审核
    *deferredAudit({ payload, callback }, { call }) {
      const res = yield call(
        postService, `/services/enforcement/postponement/comPreExamine`,
        payload
      );
      res && callback(res);
    },
    // 退回
    *goBackS({ payload, callback }, { call }) {
      const res = yield call(
        postService, `/services/enforcement/option/returnOption`,
        payload
      );
      res && callback(res);
    },
    // 权力编码
    *rightMatter({ payload, callback }, { call }) {
      const res = yield call(
        postService, `/services/enforcement/rightMatter/getAllList`,
        payload
      );
      res && callback(res);
    },
    // 批量下载图片
    *downPhoto({ payload, callback }, { call }) {
      const res = yield call(exportPhotosService, `/services/attachment/file/download/${payload.producer}/?id=${payload.id}`);
      res && callback(res);
    },
    // 水印
    *watermarks({ payload, callback }, { call }) {
      const res = yield call(
        postService, `/services/attachment/file/consumerCustomized`,
        payload
      );
      res && callback(res);
    },
  },

  reducers: {},
};
