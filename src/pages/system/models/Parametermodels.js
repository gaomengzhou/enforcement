import { getQueryUrl } from '@/utils/queryFilter';
import { getService, exportByPost, postService, exportService, exportPhotosService } from '@/services/serviceApi';
export default {
  namespace: 'Parametermodels',

  state: {},

  effects: {
    // 获取列表数据
    *getList({ payload, callback }, { call }) {
      const query = getQueryUrl(payload.obj);
      const res = yield call(
        getService,
        `/services/enforcement/manage/getList/${payload.page}/${payload.pageSize}${query}`
      );
      callback && callback(res);
    },
    // 修改
    *upListDate({ payload, callback }, { call }) {
      const query = getQueryUrl(payload.obj);
      const res = yield call(
        postService, `/services/enforcement/manage/update`, payload
      );
      callback && callback(res);
    },
  },

  reducers: {},
};
