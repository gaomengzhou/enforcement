import { DictionarySelect, DepartmentSelect,patchWorkOrderStatus, CooperationSelect, DictionarySelectStatus, summaryCases, categoriesOfCases,taksType } from '../services/system';

export default {
  namespace: 'select',
  state: {
    sourceList: [],
    statusList: [],
    classList: [],
    typeList: [],
    levelList: [],
    feedbackList: [],
    satisfactionList: [],
    appealTypeList: [],
    appealSourceList: [],
    returnTypeList: [],
    whetherTypesList: [],
    bigClassListSelect: [],
    departmentList: [],
    communityList: [],
    smallClassListSelect: [],
    reportingChannelList: [],
    workOrderStatusList: [],
    scopeInfluenceList: [],
    questionLevelList: [],
    damageDegreeList: [],
    departmentArr: [], //主办部门
    processingProgramList: [],
    convergenceProgramList: [],
    intelligenceCycleList: [],
    peopleTypeList: [],
    cooperationArr: [], // 承办人员
    ownGridNumberList: [], // 所属网格
    statusDepComprehensive:[]//工单状态
  },

  effects: {
    //工单来源
    *source(_, { call, put }) {
      const response = yield call(DictionarySelect, { id: 'DM_01' })
      if (response && response.success) {
        yield put({
          type: 'sources',
          payload: response.data ? response.data : [],
        })
      } else {
        yield put({
          type: 'sources',
          payload: [],
        })
      }
    },
    //状态
    *status(_, { call, put }) {
      const response = yield call(DictionarySelectStatus);
      if (response) {
        yield put({
          type: 'statuses',
          payload: response ? response : [],
        })
      } else {
        yield put({
          type: 'statuses',
          payload: [],
        })
      }
    },
    //任务分类
    *class(_, { call, put }) {
      const response = yield call(DictionarySelect, { id: 'DM_03' });
      if (response && response.success) {
        yield put({
          type: 'classes',
          payload: response.data ? response.data : [],
        })
      } else {
        yield put({
          type: 'classes',
          payload: [],
        })
      }
    },
    //类型
    *type(_, { call, put }) {
      const response = yield call(taksType);
      if (response) {
        yield put({
          type: 'types',
          payload: response ? response : [],
        })
      } else {
        yield put({
          type: 'types',
          payload: [],
        })
      }
    },
    //主办部门
    *getdepartment(_, { call, put }) {
      const response = yield call(DepartmentSelect);
      if (response) {
        const res = [];
        for (let i = 0; i < response.list.length; i++) {
          res.push(response.list[i])
        }
        yield put({
          type: 'departmentsNew',
          payload: res,
        })
      }
    },
    // 协作人员
    *getCooperation({ payload, callback }, { call, put }) {
      const response = yield call(CooperationSelect, { id: payload.id });
      if (response && response.success) {
        yield put({
          type: 'cooperations',
          payload: response.data ? response.data : [],
        })
      } else {
        yield put({
          type: 'cooperations',
          payload: [],
        })
      }
      response && callback(response)
      console.log(response)
    },
    //优先级
    *level(_, { call, put }) {
      const response = yield call(DictionarySelect, { id: 'DM_05' });
      if (response && response.success) {
        yield put({
          type: 'levels',
          payload: response.data ? response.data : [],
        })
      } else {
        yield put({
          type: 'levels',
          payload: [],
        })
      }
    },
    //反馈结果
    *feedback(_, { call, put }) {
      const response = yield call(DictionarySelect, { id: 'DM_06' });
      if (response && response.success) {
        yield put({
          type: 'feedBack',
          payload: response.data ? response.data : [],
        })
      } else {
        yield put({
          type: 'feedBack',
          payload: [],
        })
      }
    },
    //满意度
    *satisfaction(_, { call, put }) {
      const response = yield call(DictionarySelect, { id: 'DM_07' });
      if (response && response.success) {
        yield put({
          type: 'satisfactions',
          payload: response.data ? response.data : [],
        })
      } else {
        yield put({
          type: 'satisfactions',
          payload: [],
        })
      }
    },
    //诉求类型
    *appealType(_, { call, put }) {
      const response = yield call(DictionarySelect, { id: 'DM_08' });
      if (response && response.success) {
        yield put({
          type: 'appealTypes',
          payload: response.data ? response.data : [],
        })
      } else {
        yield put({
          type: 'appealTypes',
          payload: [],
        })
      }
    },
    //诉求来源
    *appealSource(_, { call, put }) {
      const response = yield call(DictionarySelect, { id: 'DM_09' });
      if (response && response.success) {
        yield put({
          type: 'appealSources',
          payload: response.data ? response.data : [],
        })
      } else {
        yield put({
          type: 'appealSources',
          payload: [],
        })
      }
    },
    //是否
    *whetherType(_, { call, put }) {
      const response = yield call(DictionarySelect, { id: 'DM_011' });
      if (response && response.success) {
        yield put({
          type: 'whetherTypes',
          payload: response.data ? response.data : [],
        })
      } else {
        yield put({
          type: 'whetherTypes',
          payload: [],
        })
      }
    },
    //回访类型
    *returnType(_, { call, put }) {
      const response = yield call(DictionarySelect, { id: 'DM_012' });
      if (response && response.success) {
        yield put({
          type: 'returnTypes',
          payload: response.data ? response.data : [],
        })
      } else {
        yield put({
          type: 'returnTypes',
          payload: [],
        })
      }
    },
    //案件类别
    *bigClass(_, { call, put }) {
      const response = yield call(categoriesOfCases);
      if (response) {
        yield put({
          type: 'bigClasses',
          payload: response ? response : [],
        })
      } else {
        yield put({
          type: 'bigClasses',
          payload: [],
        })
      }
    },
    //案件小类
    *smallClass(_, { call, put }) {
      const response = yield call(DictionarySelect, { id: 'DM_014' });
      if (response && response.success) {
        yield put({
          type: 'smallClasses',
          payload: response.data ? response.data : [],
        })
      } else {
        yield put({
          type: 'smallClasses',
          payload: [],
        })
      }
    },
    //工单状态
    *workOrderStatusNew({payload},{call,put}){
      const res = yield call(patchWorkOrderStatus,payload)
      console.log(res)
      if(res){
        yield put({
          type:'patchWorkOrderStatusList',
          payload:res
        })
      }
    },
    //部门
    *department(_, { call, put }) {
      const response = yield call(DictionarySelect, { id: 'DM_015' });
      if (response && response.success) {
        yield put({
          type: 'departments',
          payload: response.data ? response.data : [],
        })
      } else {
        yield put({
          type: 'departments',
          payload: [],
        })
      }
    },
    //社区
    *community(_, { call, put }) {
      const response = yield call(DictionarySelect);
      if (response) {
        response.splice(0, 1)
        yield put({
          type: 'communitys',
          payload: response ? response : [],
        })
      } else {
        yield put({
          type: 'communitys',
          payload: [],
        })
      }
    },
    //上报渠道
    *reportingChannel(_, { call, put }) {
      const response = yield call(DictionarySelect, { id: 'DM_017' });
      if (response && response.success) {
        yield put({
          type: 'reportingChannelFetch',
          payload: response.data ? response.data : [],
        })
      } else {
        yield put({
          type: 'reportingChannelFetch',
          payload: [],
        })
      }
    },
    //工单状态
    *workOrderStatus(_, { call, put }) {
      const response = yield call(DictionarySelect, { id: 'DM_018' });
      if (response && response.success) {
        yield put({
          type: 'workOrderStatusFetch',
          payload: response.data ? response.data : [],
        })
      } else {
        yield put({
          type: 'workOrderStatusFetch',
          payload: [],
        })
      }
    },
    //影响范围
    *scopeInfluence(_, { call, put }) {
      const response = yield call(DictionarySelect, { id: 'DM_019' });
      if (response && response.success) {
        yield put({
          type: 'scopeInfluenceFetch',
          payload: response.data ? response.data : [],
        })
      } else {
        yield put({
          type: 'scopeInfluenceFetch',
          payload: [],
        })
      }
    },
    //问题级别
    *questionLevel(_, { call, put }) {
      const response = yield call(DictionarySelect, { id: 'DM_020' });
      if (response && response.success) {
        yield put({
          type: 'questionLevelFetch',
          payload: response.data ? response.data : [],
        })
      } else {
        yield put({
          type: 'questionLevelFetch',
          payload: [],
        })
      }
    },
    //破坏程度
    *damageDegree(_, { call, put }) {
      const response = yield call(DictionarySelect, { id: 'DM_021' });
      if (response && response.success) {
        yield put({
          type: 'damageDegreeFetch',
          payload: response.data ? response.data : [],
        })
      } else {
        yield put({
          type: 'damageDegreeFetch',
          payload: [],
        })
      }
    },
    //处理程序
    *processingProgram(_, { call, put }) {
      const response = yield call(DictionarySelect, { id: 'DM_022' });
      if (response && response.success) {
        yield put({
          type: 'processingProgramFetch',
          payload: response.data ? response.data : [],
        })
      } else {
        yield put({
          type: 'processingProgramFetch',
          payload: [],
        })
      }
    },
    //归口类型
    *convergenceProgram(_, { call, put }) {
      const response = yield call(summaryCases);
      if (response) {
        yield put({
          type: 'convergenceProgramFetch',
          payload: response.list ? response.list : [],
        })
      } else {
        yield put({
          type: 'convergenceProgramFetch',
          payload: [],
        })
      }
    },
    //智能生成周期
    *intelligenceCycle(_, { call, put }) {
      const response = yield call(DictionarySelect, { id: 'DM_025' });
      if (response && response.success) {
        yield put({
          type: 'intelligenceCycleFetch',
          payload: response.data ? response.data : [],
        })
      } else {
        yield put({
          type: 'intelligenceCycleFetch',
          payload: [],
        })
      }
    },
    //当事人类型
    *peopleType(_, { call, put }) {
      const response = yield call(DictionarySelect, { id: 'DM_030' });
      if (response && response.success) {
        yield put({
          type: 'peopleTypeFetch',
          payload: response.data ? response.data : [],
        })
      } else {
        yield put({
          type: 'peopleTypeFetch',
          payload: [],
        })
      }
    },
    //所属网格
    *ownGridNumber(_, { call, put }) {
      const response = yield call(DictionarySelect, { id: 'DM_032' });
      if (response && response.success) {
        yield put({
          type: 'ownGridNumberFetch',
          payload: response.data ? response.data : [],
        })
      } else {
        yield put({
          type: 'ownGridNumberFetch',
          payload: [],
        })
      }
    },
  },

  reducers: {
    sources(state, { payload }) {
      return {
        ...state,
        sourceList: payload
      }
    },
    statuses(state, { payload }) {
      return {
        ...state,
        statusList: payload
      }
    },
    departments(state, { payload }) {
      return {
        ...state,
        departmentArr: payload
      }
    },
    cooperations(state, { payload }) {
      return {
        ...state,
        cooperationArr: payload
      }
    },
    classes(state, { payload }) {
      return {
        ...state,
        classList: payload
      }
    },
    types(state, { payload }) {
      return {
        ...state,
        typeList: payload
      }
    },
    levels(state, { payload }) {
      return {
        ...state,
        levelList: payload
      }
    },
    feedBack(state, { payload }) {
      return {
        ...state,
        feedbackList: payload
      }
    },
    satisfactions(state, { payload }) {
      return {
        ...state,
        satisfactionList: payload
      }
    },
    appealTypes(state, { payload }) {
      return {
        ...state,
        appealTypeList: payload
      }
    },
    appealSources(state, { payload }) {
      return {
        ...state,
        appealSourceList: payload
      }
    },
    returnTypes(state, { payload }) {
      return {
        ...state,
        returnTypeList: payload
      }
    },
    whetherTypes(state, { payload }) {
      return {
        ...state,
        whetherTypesList: payload
      }
    },
    bigClasses(state, { payload }) {
      return {
        ...state,
        bigClassListSelect: payload
      }
    },
    departmentsNew(state, { payload }) {
      return {
        ...state,
        departmentList: payload
      }
    },
    communitys(state, { payload }) {
      return {
        ...state,
        communityList: payload
      }
    },
    smallClasses(state, { payload }) {
      return {
        ...state,
        smallClassListSelect: payload
      }
    },
    reportingChannelFetch(state, { payload }) {
      return {
        ...state,
        reportingChannelList: payload
      }
    },
    workOrderStatusFetch(state, { payload }) {
      return {
        ...state,
        workOrderStatusList: payload
      }
    },
    scopeInfluenceFetch(state, { payload }) {
      return {
        ...state,
        scopeInfluenceList: payload
      }
    },
    questionLevelFetch(state, { payload }) {
      return {
        ...state,
        questionLevelList: payload
      }
    },
    damageDegreeFetch(state, { payload }) {
      return {
        ...state,
        damageDegreeList: payload
      }
    },
    processingProgramFetch(state, { payload }) {
      return {
        ...state,
        processingProgramList: payload
      }
    },
    convergenceProgramFetch(state, { payload }) {
      return {
        ...state,
        convergenceProgramList: payload
      }
    },
    intelligenceCycleFetch(state, { payload }) {
      return {
        ...state,
        intelligenceCycleList: payload
      }
    },
    peopleTypeFetch(state, { payload }) {
      return {
        ...state,
        peopleTypeList: payload
      }
    },
    ownGridNumberFetch(state, { payload }) {
      return {
        ...state,
        ownGridNumberList: payload
      }
    },
    patchWorkOrderStatusList(state,{payload}){
      return {
        ...state,
        statusDepComprehensive:payload
      }
    }
  }
}
