import { routerRedux } from 'dva/router';
import { loginIn } from '@/services/login';
import { message } from 'antd/lib/index';

export default {
  namespace: 'login',

  state: {

  },

  effects: {
    *loginInFetch({ payload }, { call, put }){
      const response = yield call(loginIn, payload);
      if(response&&response.loginStatus === 1){
        yield put(routerRedux.push('/index/home'))
      }else{
        message.error('用户名或者密码错误');
      }

    },
  },

  reducers: {

  },
};
