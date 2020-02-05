import { getQueryUrl } from '@/utils/queryFilter';
import { getService, exportByPost, postService, exportService, exportPhotosService } from '@/services/serviceApi';
export default {
  namespace: 'Complainmodels',

  state: {},

  effects: {
    // 默认下拉数据
    *getGroupCode({ payload, callback }, { call }) {
      const res = yield call(getService, `/services/lookup/init/${payload.groupCode}`);
      callback && callback(res);
    },
    // 投诉工单新增
    *save({ payload, callback }, { call }) {
      const res = yield call(postService, `/services/enforcement/complaint/save`, payload);
      res && callback(res);
    },
    // 获取主办部门
    *getUrbanApartment({ payload, callback }, { call }) {
      const res = yield call(getService, `/services/enforcement/role/getAllApartment`);
      res && callback(res);
    },
    //  获取承办人员
    *getUserListByOrgIdAndIsExecutive({ payload, callback }, { call }) {
      const res = yield call(
        getService,
        `/services/enforcement/role/getUserListByOrgIdAndIsExecutive/${payload.id}`
      );
      res && callback(res);
    },
    //获取分管领导
    *getLeadersInCharge({ payload, callback }, { call }) {
      const res = yield call(
        getService,
        `/services/enforcement/role/getLeadersInCharge/${payload.id}`
      );
      res && callback(res);
    },
    //获取列表的数据
    *getList({ payload, callback }, { call }) {
      const query = getQueryUrl(payload.obj);
      const res = yield call(
        getService,
        `/services/enforcement/complaint/getList/${payload.page}/${payload.pageSize}/${
        payload.id
        }${query}`
      );
      res && callback(res);
    },
    // 详情页获取列表数据(常用，案件信息)
    *getDetailList({ payload, callback }, { call }) {
      const res = yield call(
        getService,
        `/services/enforcement/complaint/getById/${payload.id}/${payload.userRole}/${payload.check}`
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
    //综合执法信息中心派单
    *systemDispatch({ payload, callback }, { call }) {
      const res = yield call(
        postService,
        `/services/enforcement/complaint/systemDispatch`,
        payload
      );
      res && callback(res);
    },
    //领导审核
    *manageExamine({ payload, callback }, { call }) {
      const res = yield call(
        postService,
        `/services/enforcement/complaint/leadershipExamine`,
        payload
      );
      res && callback(res);
    },
    // 确认结案
    *closingCase({ payload, callback }, { call }) {
      const res = yield call(postService, `/services/enforcement/complaint/closingCase`, payload);
      res && callback(res);
    },
    //申请结案
    *executorHandle({ payload, callback }, { call }) {
      const res = yield call(
        postService,
        `/services/enforcement/complaint/executorHandle`,
        payload
      );
      res && callback(res);
    },
    // 删除
    *deteles({ payload, callback }, { call }) {
      const res = yield call(
        postService,
        `/services/enforcement/complaint/update/${payload.status}/${payload.id}`,
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
        postService, `/services/enforcement/postponement/complaintExamine`,
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
    // 归口类型
    *summaryCases({ payload, callback }, { call }) {
      const res = yield call(
        getService,
        `/services/enforcement/summaryCases/getList`
      );
      callback && callback(res);
    },
    // 批量下载图片
    *downPhoto({ payload, callback }, { call }) {
      console.log(77)
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
