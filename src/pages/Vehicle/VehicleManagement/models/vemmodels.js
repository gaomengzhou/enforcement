import { getQueryUrl } from '@/utils/queryFilter';
import { getService, exportByPost, postService, exportService } from '@/services/serviceApi';
export default {
  namespace: 'vemmodels',

  state: {},

  effects: {
    // 获取列表数据
    *getList({ payload, callback }, { call }) {
      const query = getQueryUrl(payload);
      const res = yield call(
        getService,
        `/services/enforcement/car/list/${payload.page}/${
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
        `/services/enforcement/car/detail/${payload.id}
         `
      );
      callback && callback(res);
    },
    // 新增
    *createRegistration({ payload, callback }, { call }) {
      const res = yield call(
        postService,
        `/services/enforcement/car/add`,
        payload
      );
      callback && callback(res);
    },
    *updateData({ payload, callback }, { call, put }) {
      const response = yield call(postService, `/services/enforcement/car/update/${payload.id}
      `, payload);
      response && callback(response);
    },
    //services/system/api/getAllOrg使用部门
    *getListDepart({ payload, callback }, { call }) {
      const query = getQueryUrl(payload);
      const res = yield call(
        getService,
        `/services/enforcement/role/getAllApartment`
      );
      callback && callback(res);
    },
    //驾驶员或责任人
    *getListDuty({ payload, callback }, { call }) {
      const query = getQueryUrl(payload);
      const res = yield call(
        getService,
        `/services/system/api/getUserListByOrgId/${payload.id}`
      );
      callback && callback(res);
    },
    //产品所属
    *getListPro({ payload, callback }, { call }) {
      const query = getQueryUrl(payload);
      const res = yield call(
        getService,
        `/services/lookup/init/propertyRights`
      );
      callback && callback(res);
    },
    // //删除
    *deleteData({ payload, callback }, { call, put }) {
      const response = yield call(postService, `/services/enforcement/car/delete
      `, payload);
      response && callback(response);
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
