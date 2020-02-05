import { getQueryUrl } from '@/utils/queryFilter';
import { getService, exportByPost, postService, exportService } from '@/services/serviceApi';
export default {
  namespace: 'StaffAppraisalmodels',

  state: {},

  effects: {
    // 部门数据获取
    *getStaffDepartment({ payload, callback }, { call }) {
      const res = yield call(getService, `/services/enforcement/role/getAllApartment`);
      callback && callback(res);
    },
    //人员考核列表数据获取
    *getStaffList({ payload,callback }, { call }) {
        const res = yield call(postService, `/services/enforcement/personAssessment/list/${payload.page}/${payload.pageSize}/${payload.orgId}`,payload.date);
        res && callback(res);
    },
    //人员考核在线率列表数据获取
    *getStaffOnlineList({ payload,callback }, { call }) {
      const res = yield call(postService, `/services/enforcement/personAssessment/getOnlineRateStatistics/${payload.orgId}`,payload.date);
      res && callback(res);
    },
  },

  reducers: {},
};
