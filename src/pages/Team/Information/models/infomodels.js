import { getQueryUrl } from '@/utils/queryFilter';
import { getService, exportByPost, postService, exportService } from '@/services/serviceApi';
export default {
  namespace: 'infomodels',

  state: {},

  effects: {
    // 获取列表数据
    *getList({ payload, callback }, { call }) {
      const query = getQueryUrl(payload);
      const res = yield call(
        getService,
        `/services/enforcement/player/list/${payload.page}/${
        payload.pageSize
        }${query}`
      );
      callback && callback(res);
    },
    //详情
    *getdetail({ payload, callback }, { call }) {
      const query = getQueryUrl(payload.obj);
      const res = yield call(
        getService,
        `/services/enforcement/player/detail/${payload.id}
         `
      );
      callback && callback(res);
    },

  // 轨迹的idList
  *getPersonTrajectory({ payload, callback }, { call }) {
    // const query = getQueryUrl(payload.obj);
      const res = yield call(
        getService,
        `/services/enforcement/plan/getPlanIds?Q=playerId_S_EQ=${payload.id}&Q=startTime_D_GE=${payload.starttime}&Q=startTime_D_LE=${payload.endtime}
        `
      );
      callback && callback(res);
    },

  },

  reducers: {},
};
