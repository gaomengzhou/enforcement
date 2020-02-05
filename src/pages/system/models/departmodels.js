import { getQueryUrl } from '@/utils/queryFilter';
import { getService, exportByPost, postService, exportService, putService } from '@/services/serviceApi';
import { message } from 'antd/lib/index';
export default {
  namespace: 'departmodels',

  state: {},

  effects: {
    // 默认tree数据
    *getTreeList({ payload, callback }, { call }) {
      const res = yield call(getService, `/services/system/org/list`);
      callback && callback(res);
    },
    // 提交数据
    *submintList({ payload, callback }, { call }) {
      const res = yield call(putService, `/services/system/org/update/${payload.id}`, payload);
      callback && callback(res);
    },
    // 片区设置 
    *areaSet({ payload, callback }, { call }) {
      const res = yield call(getService, `/services/enforcement/department/getList`);
      callback && callback(res);
    },
    // 默认下拉数据
    *teamList({ payload, callback }, { call }) {
      const res = yield call(getService, `/services/lookup/init/squadron`);
      callback && callback(res);
    },
    //片区设置保存
    *update({ payload, callback }, { call }) {
      const res = yield call(postService, `/services/enforcement/department/update`, payload);
      res && callback(res);
    },
  },

  reducers: {},
};
