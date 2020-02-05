import { getQueryUrl } from '@/utils/queryFilter';
import { getService, exportByPost, postService, exportService } from '@/services/serviceApi';
export default {
  namespace: 'position',

  state: {},

  effects: {
     // 部门数据获取
     *getTrackDepartment({ payload, callback }, { call }) {
      const res = yield call(getService, `/services/enforcement/role/getAllApartment`);
      callback && callback(res);
    },
    
    // 车辆的定位数据
    *getcarPosition({ payload, callback }, { call }) {
      const query = getQueryUrl(payload.obj);
      const res = yield call(
        getService,
        `/services/enforcement/car/positionList/${payload.page}/${
          payload.pageSize
        }${query}`
      );
      callback && callback(res);
    },

  },

  reducers: {},
};
