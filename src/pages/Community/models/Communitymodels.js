import { getQueryUrl } from '@/utils/queryFilter';
import { getService, exportByPost, postService, exportService, exportPhotosService } from '@/services/serviceApi';
export default {
  namespace: 'Communitymodels',

  state: {},

  effects: {
    // 默认下拉数据
    *getGroupCode({ payload, callback }, { call }) {
      const res = yield call(getService, `/services/lookup/init/${payload.groupCode}`);
      callback && callback(res);
    },
    // 获取网格
    *getGrid({ payload, callback }, { call }) {
      const res = yield call(getService, `/services/enforcement/appApi/getGrid`);
      callback && callback(res);
    },
    // 获取处置部门
    *getUrbanApartment({ payload, callback }, { call }) {
      const res = yield call(getService, `/services/enforcement/role/getUrbanApartment`);
      res && callback(res);
    },
    // 获取处置人
    *getUserListByOrgIdAndIsExecutive({ payload, callback }, { call }) {
      const res = yield call(
        getService,
        `/services/enforcement/role/getUserListByOrgIdAndIsExecutive/${payload.id}`
      );
      res && callback(res);
    },
    // 新增保存
    *save({ payload, callback }, { call }) {
      const res = yield call(postService, `/services/enforcement/community/save`, payload);
      res && callback(res);
    },
    // 新增派单
    *systemDispatch({ payload, callback }, { call }) {
      const res = yield call(postService, `/services/enforcement/community/systemDispatch`, payload);
      res && callback(res);
    },
    // 详情页上报
    *reportedData({ payload, callback }, { call }) {
      const res = yield call(postService, `/services/enforcement/community/executorReport`, payload);
      callback && callback(res);
    },
    //自处置
    *self({ payload, callback }, { call }) {
      const res = yield call(postService, `/services/enforcement/community/self`, payload);
      res && callback(res);
    },
    // 获取列表数据
    *getList({ payload, callback }, { call }) {
      const query = getQueryUrl(payload.obj);
      const res = yield call(
        getService,
        `/services/enforcement/community/getList/${payload.page}/${payload.pageSize}/${
        payload.userRole}${query}`
      );
      callback && callback(res);
    },
    // 详情页获取列表数据(常用，案件信息)
    *getDetailList({ payload, callback }, { call }) {
      const res = yield call(
        getService,
        `/services/enforcement/community/getById/${payload.listid}/${payload.userRole}/${payload.check}`
      );
      res && callback(res);
    },
    // 删除和废案
    *deteles({ payload, callback }, { call }) {
      const res = yield call(
        postService,
        `/services/enforcement/community/update/${payload.status}/${payload.id}`,
        payload
      );
      res && callback(res);
    },
    // 执行员申请结案
    *executorHandle({ payload, callback }, { call }) {
      const res = yield call(postService, `/services/enforcement/community/executorHandle`, payload);
      res && callback(res);
    },
    // 信息中心确认结案
    *closingCase({ payload, callback }, { call }) {
      const res = yield call(postService, `/services/enforcement/community/closingCase`, payload);
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
        postService, `/services/enforcement/postponement/communityExamine`,
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
    // 详情页获取列表数据(工作过程)
    *getDetailListCourse({ payload, callback }, { call }) {
      const res = yield call(
        getService,
        `/services/enforcement/process/getByNumId/${payload.id}/${payload.userRole}`
      );
      callback && callback(res);
    },
    // 水印
    *watermarks({ payload, callback }, { call }) {
      const res = yield call(
        postService, `/services/attachment/file/consumerCustomized`,
        payload
      );
      res && callback(res);
    },
    // 批量下载图片
    *downPhoto({ payload, callback }, { call }) {
      const res = yield call(exportPhotosService, `/services/attachment/file/download/${payload.producer}/?id=${payload.id}`);
      res && callback(res);
    },
  },

  reducers: {},
};
