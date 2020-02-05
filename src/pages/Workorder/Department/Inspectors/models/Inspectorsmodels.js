import { getQueryUrl } from '@/utils/queryFilter';
import { getService, exportByPost, postService, exportService, exportPhotosService } from '@/services/serviceApi';
export default {
  namespace: 'Inspectorsmodels',

  state: {},

  effects: {
    // 默认下拉数据
    *getGroupCode({ payload, callback }, { call }) {
      const res = yield call(getService, `/services/lookup/init/${payload.groupCode}`);
      callback && callback(res);
    },
    // 案件小类下拉
    *getcaseSmallType({ payload, callback }, { call }) {
      const res = yield call(getService, `/services/lookup/${payload.parentId}`);
      callback && callback(res);
    },
    //获取网格
    *getGrid({ payload, callback }, { call }) {
      const res = yield call(getService, `/services/enforcement/appApi/getGrid`);
      callback && callback(res);
    },
    // 获取列表数据
    *getList({ payload, callback }, { call }) {
      const query = getQueryUrl(payload.obj);
      const res = yield call(
        getService,
        `/services/enforcement/urban/getList/${payload.page}/${payload.pageSize}/${
        payload.id}${query}`
      );
      callback && callback(res);
    },
    // 获取主办部门
    *getUrbanApartment({ payload, callback }, { call }) {
      const res = yield call(getService, `/services/enforcement/role/getUrbanApartment`);
      res && callback(res);
    },
    //  获取处置人员
    *getUserListByOrgIdAndIsExecutive({ payload, callback }, { call }) {
      const res = yield call(
        getService,
        `/services/enforcement/role/getUserListByOrgIdAndIsExecutive/${payload.id}`
      );
      res && callback(res);
    },
    // 详情页获取列表数据(常用，案件信息)
    *getDetailList({ payload, callback }, { call }) {
      const res = yield call(
        getService,
        `/services/enforcement/urban/getById/${payload.listid}/${payload.userRole}/${payload.check}`
      );
      res && callback(res);
    },
    // 详情页获取列表数据(二级处置)
    *getDetailListSecond({ payload, callback }, { call }) {
      const res = yield call(
        getService,
        `/services/enforcement/mission/getByOrderId/${payload.id}/${payload.userRole}`
      );
      callback && callback(res);
    },
    // 详情页获取列表数据(任务处置)
    *getDetailListDispose({ payload, callback }, { call }) {
      const res = yield call(
        getService,
        `/services/enforcement/dispatch/getByOrderId/${payload.id}/${payload.userRole}`
      );
      callback && callback(res);
    },
    // 详情页获取列表数据(工作过程)
    *getDetailListCourse({ payload, callback }, { call }) {
      const res = yield call(
        getService,
        `/services/enforcement/process/getByNumId/${payload.id}/${payload.userRole}`
      );
      callback && callback(res);
    },
    // 详情页获取列表数据(处置延时)
    *getDetailListSeven({ payload, callback }, { call }) {
      const res = yield call(
        getService,
        `/services/enforcement/postponement/getByOrderId/${payload.id}/${payload.operation}`
      );
      callback && callback(res);
    },
    // 城管工单新增
    *save({ payload, callback }, { call }) {
      const res = yield call(postService, `/services/enforcement/urban/save`, payload);
      res && callback(res);
    },
    // 信息中心派单
    *systemDispatch({ payload, callback }, { call }) {
      const res = yield call(postService, `/services/enforcement/urban/systemDispatch`, payload);
      res && callback(res);
    },
    // 详情页上报
    *reportedData({ payload, callback }, { call }) {
      const res = yield call(postService, `/services/enforcement/urban/executorReport`, payload);
      callback && callback(res);
    },
    // 安排
    *manageArrange({ payload, callback }, { call }) {
      const res = yield call(postService, `/services/enforcement/urban/manageArrange`, payload);
      res && callback(res);
    },
    // 执行员二级处置
    *executorHandle({ payload, callback }, { call }) {
      const res = yield call(postService, `/services/enforcement/urban/executorHandle`, payload);
      res && callback(res);
    },
    // 领导审核接口
    *manageExamine({ payload, callback }, { call }) {
      const res = yield call(postService, `/services/enforcement/urban/manageExamine`, payload);
      res && callback(res);
    },
    // 确认结案
    *closingCase({ payload, callback }, { call }) {
      const res = yield call(postService, `/services/enforcement/urban/closingCase`, payload);
      res && callback(res);
    },
    //自处置
    *self({ payload, callback }, { call }) {
      const res = yield call(postService, `/services/enforcement/urban/self`, payload);
      res && callback(res);
    },
    // 删除
    *deteles({ payload, callback }, { call }) {
      const res = yield call(
        postService,
        `/services/enforcement/urban/update/${payload.status}/${payload.id}`,
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
        postService, `/services/enforcement/postponement/manageExamine`,
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
