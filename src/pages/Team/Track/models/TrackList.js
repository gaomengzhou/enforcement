import { getQueryUrl } from '@/utils/queryFilter';
import { getService, exportByPost, postService, exportService } from '@/services/serviceApi';
export default {
  namespace: 'TrackListmodels',

  state: {},

  effects: {
    // 部门数据获取
    *getTrackDepartment({ payload, callback }, { call }) {
      const res = yield call(getService, `/services/enforcement/role/getAllApartment`);
      callback && callback(res);
    },
    // 默认任务类型下拉数据
    *getGroupCode({ payload, callback }, { call }) {
      const res = yield call(getService, `/services/lookup/init/questType`);
      callback && callback(res);
    },
    //巡查任务设置列表
    *patrolGetList({ payload, callback }, { call }) {
      const query = getQueryUrl(payload);
      const res = yield call(
        getService,
        `/services/enforcement/quest/questRunList/${payload.page}/${
        payload.pageSize
        }${query}`
      );
      callback && callback(res);
    },
    //计划管理列表
    *planGetList({ payload, callback }, { call }) {
      const query = getQueryUrl(payload);
      const res = yield call(
        getService,
        `/services/enforcement/plan/list/${payload.page}/${
        payload.pageSize
        }${query}`
      );
      callback && callback(res);
    },
    //计划管理删除
    *planDelete({ payload, callback }, { call }) {
      const res = yield call(postService, `/services/enforcement/plan/delete/${payload.id}`);
      res && callback(res);
    },
    //计划管理启用
    *planEnable({ payload, callback }, { call }) {
      const res = yield call(postService, `/services/enforcement/plan/enable/${payload.id}`);
      res && callback(res);
    },
    //计划管理禁用
    *planDisable({ payload, callback }, { call }) {
      const res = yield call(postService, `/services/enforcement/plan/disable/${payload.id}`);
      res && callback(res);
    },
    //任务设置列表
    *taskGetList({ payload, callback }, { call }) {
      const query = getQueryUrl(payload);
      const res = yield call(
        getService,
        `/services/enforcement/plan/list/${payload.page}/${
        payload.pageSize
        }${query}`
      );
      callback && callback(res);
    },
    //任务设置新增
    *taskAdd({ payload, callback }, { call }) {
      const res = yield call(postService, `/services/enforcement/quest/create`, payload);
      res && callback(res);
    },
    //任务设置更新
    *taskUpdate({ payload, callback }, { call }) {
      const res = yield call(postService, `/services/enforcement/quest/update/${payload.id}`, payload);
      res && callback(res);
    },
    //临时任务巡查队员
    *temporaryList({ payload, callback }, { call }) {
      const query = getQueryUrl(payload);
      const res = yield call(
        getService,
        `/services/enforcement/player/list/${payload.page}/${
        payload.pageSize
        }${query}`
      );
      callback && callback(res);
    },

    // 轨迹查询
    *trajectoryList({ payload, callback }, { call }) {
      const query = getQueryUrl(payload);
      const res = yield call(
        getService,
        `/services/enforcement/trajectory/list/${payload.page}/${
        payload.pageSize
        }${query}`
      );
      callback && callback(res);
    },

    //临时任务新增
    *temporaryAdd({ payload, callback }, { call }) {
      const res = yield call(postService, `/services/enforcement/quest/addTemporaryQuest`, payload);
      res && callback(res);
    },
  },
  reducers: {},
};
