import { getQueryUrl } from '@/utils/queryFilter';
import { getService, exportByPost, postService, exportService } from '@/services/serviceApi';
import { message } from 'antd/lib/index';
export default {
  namespace: 'gridmodels',

  state: {},

  effects: {
    // 默认下拉数据
    *getGroupCode({ payload, callback }, { call }) {
      const res = yield call(getService, `/services/lookup/init/${payload.groupCode}`);
      callback && callback(res);
    },
    // 获取列表数据
    *getList({ payload, callback }, { call }) {
      const query = getQueryUrl(payload);
      const res = yield call(
        getService,
        `/services/enforcement/lattice/getList/${payload.page}/${
        payload.pageSize
        }${query}`
      );
      callback && callback(res);
    },
    //获取网格
    *getGrid({ payload, callback }, { call }) {
      const res = yield call(getService, `/services/enforcement/appApi/getGrid`);
      callback && callback(res);
    },
    //获取网格员
    *getGridUser({ payload, callback }, { call }) {
      const query = getQueryUrl(payload);
      const res = yield call(
        getService,
        `/services/enforcement/lattice/getUserList`
      );
      callback && callback(res);
    },
    *gridMark({ payload, callback }, { call }) {
      const res = yield call(getService, `/services/lookup/init/gridMark`);
      callback && callback(res);
    },
    // 新增
    *save({ payload, callback }, { call }) {
      const res = yield call(postService, `/services/enforcement/lattice/save`, payload);
      res && callback(res);
    },
    // 编辑
    *update({ payload, callback }, { call }) {
      const res = yield call(postService, `/services/enforcement/lattice/update`, payload);
      res && callback(res);
    },
    // 删除
    *deleteData({ payload, callback }, { call }) {
      const res = yield call(postService, `/services/enforcement/lattice/delete`, payload);
      res && callback(res);
    },
    // 网格长网格员树
    *gridTreeSelect({ payload, callback }, { call }) {
      const query = getQueryUrl(payload);
      const res = yield call(getService, `/services/system/org/getTreeNodeUsers`);
      callback && callback(res);
    },
    //  // 导出全部
    //  *exportAlls({ payload, callback }, { call }) {
    //   const query = getQueryUrl(payload); 
    //   const res = yield call(  
    //     exportByPost,
    //     `/services/enforcement/rightMatter/exportAll${query}`
    //   );
    //   callback && callback(res);
    // },
    // // 导出
    // *exportAll({ payload, callback }, { call }) {
    //   const res = yield call(  
    //     exportByPost,
    //     `/services/enforcement/rightMatter/exportById`
    //     ,null,payload
    //   );
    //   callback && callback(res);
    // },
    // //模板下载
    // *download({ payload, callback }, { call }) {
    //   // const query = getQueryUrl(payload);  
    //   const res = yield call(  
    //     exportService,
    //     `/services/enforcement/rightMatter/exportRightMatter`
    //   );
    //   callback && callback(res);
    // },
  },

  reducers: {},
};
