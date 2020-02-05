/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-use-before-define */
/* eslint-disable func-names */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/sort-comp */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-plusplus */
/* eslint-disable react/no-unused-state */
import React, { PureComponent } from 'react';
import {Tabs,Row,Col,Button,Select,DatePicker,Form} from 'antd';
import echarts from 'echarts';
import { connect } from 'dva/index';
import moment from 'moment/moment';
import range from './range';

const {RangePicker} = DatePicker;
const {Option} = Select;
const {TabPane} = Tabs;
const FormItem = Form.Item;
@connect(({ category,select,inspectors }) => ({
  category,select,inspectors
}))
@Form.create()
class Home extends PureComponent {
  state={
    chartKey:'1',
    day:7,
    dayDepComDisabled:7,
    rangeDepCom:range(7),
    categoryComprehensive:{},// 部门派发 综合执法
    departmentCompreate:[],// 部门派发 综合执法 时间
    departmentCompreClassNames:[],// 部门派发 综合执法 案件类别
    departmentCompreClassNamesLength:0,
    bigtimeDepCom:'',
    endtimeDepCom:'',
    communityDepComprehensive:'',
    caseBigTypeDepComprehensive:'',
    statusDepComprehensive:'',
    caseSmallType:'',
    caseBigType:'',
    caseBigTypeNumLength:0,
    categoryIntelligent:{},// 部门派发 综合执法
    intelligentDate:[],// 部门派发 综合执法 时间
    intelligentClassNames:[],// 部门派发 综合执法 案件类别
    intelligentClassNamesLength:0,
    caseBigTypeNumLengthInt:0,
    statusRecord:'',
    communityRecord:'',
    listbigAllClass:[],// 查询列表 所有案件大类
    listSmallAllClass:[],// 查询列表 所有案件小类
    categoryInspectors:{},// 城管工单数据
    inspectorsCompreate:[],// 城管工单时间
    inspectorsClassNamesLength:'',// 城管工单类型长度
    inspectorsClassNames:'',// 城管工单
    categoryLeader:{},// 领导交办数据
    leaderCompreate:[],// 领导交办时间
    leaderClassNamesLength:'',// 领导交办类型长度
    leaderClassNames:'',// 领导交办
    orderType:'',// 工单类型
    categoryComplain:{},// 投诉工单数据
    complainDate:[],// 投诉工单时间
    complainClassNamesLength:'',// 投诉工单类型长度
    complainClassNames:'',// 投诉工单
    convergenceProgram:'',// 投诉工单 归口类型
  };

  componentDidMount(){
    // 查询列表 查询所有案件大类 bigAllClassFetch
    new Promise(resolve => {
      this.props.dispatch({
        type:'inspectors/bigAllClassFetch',
        payload: {
          resolve,
        }
      })
    }).then((res) => {
      this.setState({
        listbigAllClass: res.data,
      })
    });
    this.props.dispatch({
      type:'select/type',
    });
    const date = moment().subtract(7, 'days').calendar();
    const reg = new RegExp('/','g');
    const dates = date.replace(reg,'-');
    new Promise(resolve => {
      this.props.dispatch({
        type:'category/categoryComprehensiveFetch',
        payload:{
          resolve,
          bigtime:dates,
          endtime:moment().format().substring(0,10),
          community:'',
          caseBigType:'',
          status:'',
        },
      })
    }).then((res)=>{
      const  departmentCompreate = [];
      for(let i = 0;i < res.data.date.length; i++){
        const a = res.data.date[i];
        departmentCompreate.push(a.substring(0,10));
      }
      this.setState({
        categoryComprehensive:res.data,
        departmentCompreate,
        departmentCompreClassNames:res.data.classNames,
        departmentCompreClassNamesLength:res.data.classNames.length,
        bigtimeDepCom:dates,
        endtimeDepCom:moment().format().substring(0,10),
      })
    });
    // 社区
    this.props.dispatch({
      type:'select/community',
    });
    // 综合执法 案件类别
    this.props.dispatch({
      type:'select/bigClass',
    });
    // 综合执法 案件状态 status
    this.props.dispatch({
      type:'select/status',
    });
    // 归口类型
    this.props.dispatch({
      type:'select/convergenceProgram',
    });
    // 智能生成列表
    // new Promise(resolve => {
    //   this.props.dispatch({
    //     type:'category/categoryIntelligentFetch',
    //     payload:{
    //       resolve,
    //       bigtime:dates,
    //       endtime:moment().format().substring(0,10),
    //       community:'',
    //       caseBigType:'',
    //       status:'',
    //     },
    //   })
    // }).then((resInt)=>{
    //   const  departmentCompreate = [];
    //   for(let i = 0;i < resInt.data.date.length; i++){
    //     let a = resInt.data.date[i];
    //     departmentCompreate.push(a.substring(0,10));
    //   }
    //   this.setState({
    //     categoryIntelligent:resInt.data,
    //     intelligentDate:departmentCompreate,
    //     intelligentClassNames:resInt.data.classNames,
    //     intelligentClassNamesLength:resInt.data.classNames.length,
    //     bigtimeDepCom:dates,
    //     endtimeDepCom:moment().format().substring(0,10),
    //   })
    // })
  }

  // 列表案件大类 查询 案件小类
  bigClassSearch =(value)=>{
    new Promise(resolve => {
      this.props.dispatch({
        type:'category/categoryInspectorFetch',
        payload:{
          resolve,
          bigtime:this.state.bigtimeDepCom,
          endtime:this.state.endtimeDepCom,
          community:this.state.communityDepComprehensive,
          caseBigType:value,
          caseSmallType:'',
          status:this.state.statusDepComprehensive,
        },
      })
    }).then((res)=>{
      const  inspectorsCompreate = [];
      const inspectorsClassNames = res.data.classNames ? res.data.classNames : [];
      for(let i = 0;i < res.data.date.length; i++){
        const a = res.data.date[i];
        inspectorsCompreate.push(a.substring(0,10));
      }
      this.setState({
        categoryInspectors:res.data,
        inspectorsCompreate,
        inspectorsClassNamesLength:inspectorsClassNames.length,
        inspectorsClassNames,
        caseBigType:value,
      });
    });
    const {form} = this.props;
    // 案件小类
    if(value){
      new Promise(resolve => {
        this.props.dispatch({
          type: 'inspectors/smallClassFetch',
          payload: {
            resolve,
            largeClassCode:value,
          }
        })
      }).then((res) => {
        this.setState({
          listSmallAllClass: res.data,
        });
      });
    }else{
      this.setState({
        listSmallAllClass:[],
        caseSmallType:'',
      })
    }
    form.setFieldsValue({caseSmallTypeSearch:''})
  };

  // 案件小类
  smallClassSearch =(value)=>{
    new Promise(resolve => {
      this.props.dispatch({
        type:'category/categoryInspectorFetch',
        payload:{
          resolve,
          bigtime:this.state.bigtimeDepCom,
          endtime:this.state.endtimeDepCom,
          community:this.state.communityDepComprehensive,
          caseBigType:this.state.caseBigType,
          caseSmallType:value,
          status:this.state.statusDepComprehensive,
        },
      })
    }).then((res)=>{
      const  inspectorsCompreate = [];
      const inspectorsClassNames = res.data.classNames ? res.data.classNames : [];
      for(let i = 0;i < res.data.date.length; i++){
        const a = res.data.date[i];
        inspectorsCompreate.push(a.substring(0,10));
      }
      this.setState({
        categoryInspectors:res.data,
        inspectorsCompreate,
        inspectorsClassNamesLength:inspectorsClassNames.length,
        inspectorsClassNames,
        caseSmallType:value,
      });
    });
  };

  // 时间区间
  depComChange=(day)=>{
    const {form} = this.props;
    const arr=range(day);
    this.setState({
      rangeDepCom:arr,
      dayDepComDisabled:day,
      bigtimeDepCom: moment(arr[0]).format('YYYY-MM-DD'),
      endtimeDepCom: moment(arr[1]).format('YYYY-MM-DD'),
    });
    if(this.state.chartKey === '1'){
      new Promise(resolve => {
        this.props.dispatch({
          type:'category/categoryComprehensiveFetch',
          payload:{
            resolve,
            bigtime:moment(arr[0]).format('YYYY-MM-DD'),
            endtime:moment(arr[1]).format('YYYY-MM-DD'),
            community:this.state.communityDepComprehensive,
            caseBigType:this.state.caseBigTypeDepComprehensive,
            status:this.state.statusDepComprehensive,
          },
        })
      }).then((res)=>{
        const  departmentCompreate = [];
        const caseBigTypeNum = res.data.num ? res.data.num : [];
        for(let i = 0;i < res.data.date.length; i++){
          const a = res.data.date[i];
          departmentCompreate.push(a.substring(0,10));
        }
        this.setState({
          categoryComprehensive:res.data,
          departmentCompreate,
          departmentCompreClassNames:res.data.classNames,
          caseBigTypeNumLength:caseBigTypeNum.length,
          bigtimeDepCom: moment(arr[0]).format('YYYY-MM-DD'),
          endtimeDepCom: moment(arr[1]).format('YYYY-MM-DD'),
        })
      });
    }else if(this.state.chartKey === '2'){
      new Promise(resolve => {
        this.props.dispatch({
          type:'category/categoryInspectorFetch',
          payload:{
            resolve,
            bigtime:moment(arr[0]).format('YYYY-MM-DD'),
            endtime:moment(arr[1]).format('YYYY-MM-DD'),
            community:this.state.communityDepComprehensive,
            caseBigType:this.state.caseBigType,
            caseSmallType:this.state.caseSmallType,
            status:this.state.statusDepComprehensive,
          },
        })
      }).then((res)=>{
        const  inspectorsCompreate = [];
        const inspectorsClassNames = res.data.classNames ? res.data.classNames : [];
        for(let i = 0;i < res.data.date.length; i++){
          const a = res.data.date[i];
          inspectorsCompreate.push(a.substring(0,10));
        }
        this.setState({
          categoryInspectors:res.data,
          inspectorsCompreate,
          inspectorsClassNamesLength:inspectorsClassNames.length,
          inspectorsClassNames,
          bigtimeDepCom: moment(arr[0]).format('YYYY-MM-DD'),
          endtimeDepCom: moment(arr[1]).format('YYYY-MM-DD'),
        });
      });
    }else if(this.state.chartKey === '3'){
      new Promise(resolve => {
        this.props.dispatch({
          type:'category/categoryLeaderFetch',
          payload:{
            resolve,
            bigtime:moment(arr[0]).format('YYYY-MM-DD'),
            endtime:moment(arr[1]).format('YYYY-MM-DD'),
            community:this.state.communityDepComprehensive,
            orderType:this.state.orderType,
            status:this.state.statusDepComprehensive,
          },
        })
      }).then((res)=>{
        const  leaderCompreate = [];
        const leaderClassNames = res.data.classNames ? res.data.classNames : [];
        for(let i = 0;i < res.data.date.length; i++){
          const a = res.data.date[i];
          leaderCompreate.push(a.substring(0,10));
        }
        this.setState({
          categoryLeader:res.data,
          leaderCompreate,
          leaderClassNamesLength:leaderClassNames.length,
          leaderClassNames,
          bigtimeDepCom: moment(arr[0]).format('YYYY-MM-DD'),
          endtimeDepCom: moment(arr[1]).format('YYYY-MM-DD'),
        });
      });
    }else if(this.state.chartKey === '4'){
      new Promise(resolve => {
        this.props.dispatch({
          type:'category/categoryComplainFetch',
          payload:{
            resolve,
            bigtime:moment(arr[0]).format('YYYY-MM-DD'),
            endtime:moment(arr[1]).format('YYYY-MM-DD'),
            community:this.state.communityDepComprehensive,
            orderType:this.state.convergenceProgram,
            status:this.state.statusDepComprehensive,
          },
        })
      }).then((res)=>{
        const  complainDate = [];
        const complainClassNames = res.data.classNames ? res.data.classNames : [];
        for(let i = 0;i < res.data.date.length; i++){
          const a = res.data.date[i];
          complainDate.push(a.substring(0,10));
        }
        this.setState({
          categoryComplain:res.data,
          complainDate,
          complainClassNamesLength:complainClassNames.length,
          complainClassNames,
          bigtimeDepCom: moment(arr[0]).format('YYYY-MM-DD'),
          endtimeDepCom: moment(arr[1]).format('YYYY-MM-DD'),
        });
      });
    }
    form.setFieldsValue({'rangeDepCom':arr})
  };

  disabledDepComDate = current => current && current > moment().endOf('day') || current < moment().subtract(this.state.dayDepComDisabled+1, 'day');

// 部门派发 综合执法 打印
  printDeparmentCom(){
    window.print();
  }

  // 部门派发 综合执法 时间段
  depComDateChange(val){
    const start =  moment(val[0]).format('YYYY-MM-DD');
    const end =  moment(val[1]).format('YYYY-MM-DD');
    if(this.state.chartKey === '1'){
      new Promise(resolve => {
        this.props.dispatch({
          type:'category/categoryComprehensiveFetch',
          payload:{
            resolve,
            bigtime:start,
            endtime:end,
            community:this.state.communityDepComprehensive,
            caseBigType:this.state.caseBigTypeDepComprehensive,
            status:this.state.statusDepComprehensive,
          },
        })
      }).then((res)=>{
        const  departmentCompreate = [];
        const caseBigTypeNum = res.data.num ? res.data.num : [];
        for(let i = 0;i < res.data.date.length; i++){
          const a = res.data.date[i];
          departmentCompreate.push(a.substring(0,10));
        }
        this.setState({
          categoryComprehensive:res.data,
          departmentCompreate,
          departmentCompreClassNames:res.data.classNames,
          caseBigTypeNumLength:caseBigTypeNum.length,
          bigtimeDepCom: moment(val[0]).format('YYYY-MM-DD'),
          endtimeDepCom: moment(val[1]).format('YYYY-MM-DD'),
        })
      });
    }else if(this.state.chartKey === '2'){
      new Promise(resolve => {
        this.props.dispatch({
          type:'category/categoryInspectorFetch',
          payload:{
            resolve,
            bigtime:start,
            endtime:end,
            community:this.state.communityDepComprehensive,
            caseBigType:this.state.caseBigType,
            caseSmallType:this.state.caseSmallType,
            status:this.state.statusDepComprehensive,
          },
        })
      }).then((res)=>{
        const  inspectorsCompreate = [];
        const inspectorsClassNames = res.data.classNames ? res.data.classNames : [];
        for(let i = 0;i < res.data.date.length; i++){
          const a = res.data.date[i];
          inspectorsCompreate.push(a.substring(0,10));
        }
        this.setState({
          categoryInspectors:res.data,
          inspectorsCompreate,
          inspectorsClassNamesLength:inspectorsClassNames.length,
          inspectorsClassNames,
          bigtimeDepCom: moment(val[0]).format('YYYY-MM-DD'),
          endtimeDepCom: moment(val[1]).format('YYYY-MM-DD'),
        });
      });
    }else if(this.state.chartKey === '3'){
      new Promise(resolve => {
        this.props.dispatch({
          type:'category/categoryLeaderFetch',
          payload:{
            resolve,
            bigtime:start,
            endtime:end,
            community:this.state.communityDepComprehensive,
            orderType:this.state.orderType,
            status:this.state.statusDepComprehensive,
          },
        })
      }).then((res)=>{
        const  leaderCompreate = [];
        const leaderClassNames = res.data.classNames ? res.data.classNames : [];
        for(let i = 0;i < res.data.date.length; i++){
          const a = res.data.date[i];
          leaderCompreate.push(a.substring(0,10));
        }
        this.setState({
          categoryLeader:res.data,
          leaderCompreate,
          leaderClassNamesLength:leaderClassNames.length,
          leaderClassNames,
          bigtimeDepCom: moment(val[0]).format('YYYY-MM-DD'),
          endtimeDepCom: moment(val[1]).format('YYYY-MM-DD'),
        });
      });
    }else if(this.state.chartKey === '4'){
      new Promise(resolve => {
        this.props.dispatch({
          type:'category/categoryComplainFetch',
          payload:{
            resolve,
            bigtime:start,
            endtime:end,
            community:this.state.communityDepComprehensive,
            orderType:this.state.convergenceProgram,
            status:this.state.statusDepComprehensive,
          },
        })
      }).then((res)=>{
        const  complainDate = [];
        const complainClassNames = res.data.classNames ? res.data.classNames : [];
        for(let i = 0;i < res.data.date.length; i++){
          const a = res.data.date[i];
          complainDate.push(a.substring(0,10));
        }
        this.setState({
          categoryComplain:res.data,
          complainDate,
          complainClassNamesLength:complainClassNames.length,
          complainClassNames,
          bigtimeDepCom: moment(val[0]).format('YYYY-MM-DD'),
          endtimeDepCom: moment(val[1]).format('YYYY-MM-DD'),
        });
      });
    }
  }

  // 部门派发 综合执法 社区
  onDepComCommunity(val){
    this.setState({
      communityRecord:val,
    });
    // 综合执法
    if(this.state.chartKey === '1'){
      new Promise(resolve => {
        this.props.dispatch({
          type:'category/categoryComprehensiveFetch',
          payload:{
            resolve,
            bigtime:this.state.bigtimeDepCom,
            endtime:this.state.endtimeDepCom,
            community:val,
            caseBigType:this.state.caseBigTypeDepComprehensive,
            status:this.state.statusDepComprehensive,
          },
        })
      }).then((res)=>{
        const  departmentCompreate = [];
        const caseBigTypeNum = res.data.num ? res.data.num : [];
        for(let i = 0;i < res.data.date.length; i++){
          const a = res.data.date[i];
          departmentCompreate.push(a.substring(0,10));
        }
        this.setState({
          categoryComprehensive:res.data,
          departmentCompreate,
          departmentCompreClassNames:res.data.classNames,
          communityDepComprehensive:val,
          caseBigTypeNumLength:caseBigTypeNum.length,
          departmentCompreClassNamesLength:res.data.classNames.length,
        })
      });
    }
    // 城管工单
    if(this.state.chartKey === '2'){
      new Promise(resolve => {
        this.props.dispatch({
          type:'category/categoryInspectorFetch',
          payload:{
            resolve,
            bigtime:this.state.bigtimeDepCom,
            endtime:this.state.endtimeDepCom,
            community:val,
            caseBigType:this.state.caseBigType,
            caseSmallType:this.state.caseSmallType,
            status:this.state.statusDepComprehensive,
          },
        })
      }).then((res)=>{
        const  inspectorsCompreate = [];
        const inspectorsClassNames = res.data.classNames ? res.data.classNames : [];
        for(let i = 0;i < res.data.date.length; i++){
          const a = res.data.date[i];
          inspectorsCompreate.push(a.substring(0,10));
        }
        this.setState({
          categoryInspectors:res.data,
          inspectorsCompreate,
          inspectorsClassNamesLength:inspectorsClassNames.length,
          inspectorsClassNames,
          communityDepComprehensive:val,
        });
      });
    }else if(this.state.chartKey === '3'){
      new Promise(resolve => {
        this.props.dispatch({
          type:'category/categoryLeaderFetch',
          payload:{
            resolve,
            bigtime:this.state.bigtimeDepCom,
            endtime:this.state.endtimeDepCom,
            community:val,
            orderType:this.state.orderType,
            status:this.state.statusDepComprehensive,
          },
        })
      }).then((res)=>{
        const  leaderCompreate = [];
        const leaderClassNames = res.data.classNames ? res.data.classNames : [];
        for(let i = 0;i < res.data.date.length; i++){
          const a = res.data.date[i];
          leaderCompreate.push(a.substring(0,10));
        }
        this.setState({
          categoryLeader:res.data,
          leaderCompreate,
          leaderClassNamesLength:leaderClassNames.length,
          leaderClassNames,
          communityDepComprehensive:val,
        });
      });
    }else if(this.state.chartKey === '4'){
      new Promise(resolve => {
        this.props.dispatch({
          type:'category/categoryComplainFetch',
          payload:{
            resolve,
            bigtime:this.state.bigtimeDepCom,
            endtime:this.state.endtimeDepCom,
            community:val,
            orderType:this.state.convergenceProgram,
            status:this.state.statusDepComprehensive,
          },
        })
      }).then((res)=>{
        const  complainDate = [];
        const complainClassNames = res.data.classNames ? res.data.classNames : [];
        for(let i = 0;i < res.data.date.length; i++){
          const a = res.data.date[i];
          complainDate.push(a.substring(0,10));
        }
        this.setState({
          categoryComplain:res.data,
          complainDate,
          complainClassNamesLength:complainClassNames.length,
          complainClassNames,
          communityDepComprehensive:val,
        });
      });
    }
  }

  // 部门派发 综合执法 工单类别
  onDepComCaseType(val){
    if(this.state.chartKey === '1'){
      new Promise(resolve => {
        this.props.dispatch({
          type:'category/categoryComprehensiveFetch',
          payload:{
            resolve,
            bigtime:this.state.bigtimeDepCom,
            endtime:this.state.endtimeDepCom,
            community:this.state.communityDepComprehensive,
            status:this.state.statusDepComprehensive,
            caseBigType:val,
          },
        })
      }).then((res)=>{
        const  departmentCompreate = [];
        const caseBigTypeNum = res.data.num ? res.data.num : [];
        for(let i = 0;i < res.data.date.length; i++){
          const a = res.data.date[i];
          departmentCompreate.push(a.substring(0,10));
        }
        this.setState({
          categoryComprehensive:res.data,
          departmentCompreate,
          departmentCompreClassNames:res.data.classNames,
          departmentCompreClassNamesLength:res.data.classNames.length,
          caseBigTypeDepComprehensive:val,
          caseBigTypeNum:caseBigTypeNum.length,
        })
      });
    }
  }

  // 部门派发 综合执法 工单状态
  onDepComStatus(val){
    if(this.state.chartKey === '1'){
      new Promise(resolve => {
        this.props.dispatch({
          type:'category/categoryComprehensiveFetch',
          payload:{
            resolve,
            bigtime:this.state.bigtimeDepCom,
            endtime:this.state.endtimeDepCom,
            community:this.state.communityDepComprehensive,
            caseBigType:this.state.caseBigTypeDepComprehensive,
            status:val,
          },
        })
      }).then((res)=>{
        const  departmentCompreate = [];
        const caseBigTypeNum = res.data.num ? res.data.num : [];
        for(let i = 0;i < res.data.date.length; i++){
          const a = res.data.date[i];
          departmentCompreate.push(a.substring(0,10));
        }
        this.setState({
          categoryComprehensive:res.data,
          departmentCompreate,
          departmentCompreClassNames:res.data.classNames,
          departmentCompreClassNamesLength:res.data.classNames.length,
          caseBigTypeDepComprehensive:this.state.caseBigTypeDepComprehensive,
          statusDepComprehensive:val,
          caseBigTypeNum:caseBigTypeNum.length,
        })
      });
    }
    if(this.state.chartKey === '2'){
      new Promise(resolve => {
        this.props.dispatch({
          type:'category/categoryInspectorFetch',
          payload:{
            resolve,
            bigtime:this.state.bigtimeDepCom,
            endtime:this.state.endtimeDepCom,
            community:this.state.communityDepComprehensive,
            caseBigType:this.state.caseBigType,
            caseSmallType:this.state.caseSmallType,
            status:val,
          },
        })
      }).then((res)=>{
        const  inspectorsCompreate = [];
        const inspectorsClassNames = res.data.classNames ? res.data.classNames : [];
        for(let i = 0;i < res.data.date.length; i++){
          const a = res.data.date[i];
          inspectorsCompreate.push(a.substring(0,10));
        }
        this.setState({
          categoryInspectors:res.data,
          inspectorsCompreate,
          inspectorsClassNamesLength:inspectorsClassNames.length,
          inspectorsClassNames,
          statusDepComprehensive:val,
        });
      });
    }else if(this.state.chartKey === '3'){
      new Promise(resolve => {
        this.props.dispatch({
          type:'category/categoryLeaderFetch',
          payload:{
            resolve,
            bigtime:this.state.bigtimeDepCom,
            endtime:this.state.endtimeDepCom,
            community:this.state.communityDepComprehensive,
            orderType:this.state.orderType,
            status:val,
          },
        })
      }).then((res)=>{
        const  leaderCompreate = [];
        const leaderClassNames = res.data.classNames ? res.data.classNames : [];
        for(let i = 0;i < res.data.date.length; i++){
          const a = res.data.date[i];
          leaderCompreate.push(a.substring(0,10));
        }
        this.setState({
          categoryLeader:res.data,
          leaderCompreate,
          leaderClassNamesLength:leaderClassNames.length,
          leaderClassNames,
          statusDepComprehensive:val,
        });
      });
    }else if(this.state.chartKey === '4'){
      new Promise(resolve => {
        this.props.dispatch({
          type:'category/categoryComplainFetch',
          payload:{
            resolve,
            bigtime:this.state.bigtimeDepCom,
            endtime:this.state.endtimeDepCom,
            community:this.state.communityDepComprehensive,
            orderType:this.state.convergenceProgram,
            status:val,
          },
        })
      }).then((res)=>{
        const  complainDate = [];
        const complainClassNames = res.data.classNames ? res.data.classNames : [];
        for(let i = 0;i < res.data.date.length; i++){
          const a = res.data.date[i];
          complainDate.push(a.substring(0,10));
        }
        this.setState({
          categoryComplain:res.data,
          complainDate,
          complainClassNamesLength:complainClassNames.length,
          complainClassNames,
          statusDepComprehensive:val,
        });
      });
    }
    this.setState({
      statusRecord:val,
    })
  }

  // 领导交办 工单类型
  workOrderType(val){
    if(this.state.chartKey === '3'){
      new Promise(resolve => {
        this.props.dispatch({
          type:'category/categoryLeaderFetch',
          payload:{
            resolve,
            bigtime:this.state.bigtimeDepCom,
            endtime:this.state.endtimeDepCom,
            community:this.state.communityDepComprehensive,
            orderType:val,
            status:this.state.status,
          },
        })
      }).then((res)=>{
        const  leaderCompreate = [];
        const leaderClassNames = res.data.classNames ? res.data.classNames : [];
        for(let i = 0;i < res.data.date.length; i++){
          const a = res.data.date[i];
          leaderCompreate.push(a.substring(0,10));
        }
        this.setState({
          categoryLeader:res.data,
          leaderCompreate,
          leaderClassNamesLength:leaderClassNames.length,
          leaderClassNames,
          orderType:val,
        });
      });
      this.setState({
        orderType:val,
      })
    }
  }

  // 投诉工单 归口类型
  onConvergenceProgram(val){
    if(this.state.chartKey === '4'){
      new Promise(resolve => {
        this.props.dispatch({
          type:'category/categoryComplainFetch',
          payload:{
            resolve,
            bigtime:this.state.bigtimeDepCom,
            endtime:this.state.endtimeDepCom,
            community:this.state.communityDepComprehensive,
            orderType:val,
            status:this.state.statusDepComprehensive,
          },
        })
      }).then((res)=>{
        const  complainDate = [];
        const complainClassNames = res.data.classNames ? res.data.classNames : [];
        for(let i = 0;i < res.data.date.length; i++){
          const a = res.data.date[i];
          complainDate.push(a.substring(0,10));
        }
        this.setState({
          categoryComplain:res.data,
          complainDate,
          complainClassNamesLength:complainClassNames.length,
          complainClassNames,
          convergenceProgram:val,
        });
      });
    }
  }

  componentDidUpdate(){
    // 多图表自适应
    window.addEventListener("resize", function () {
      myChartDepCom.resize();
    });
    const myChartDepCom=echarts.init(document.getElementById('myChartDepCom'));
    // 综合执法
    const option={
      xAxis: {
        type: 'category',
        data: this.state.departmentCompreate ? this.state.departmentCompreate : '',
      },
      legend: {
        data:this.state.departmentCompreClassNames ? this.state.departmentCompreClassNames : '',
        // x: 'center',
        // y: 'bottom',
      },
      yAxis: {
        type: 'value'
      },
      series: this.state.departmentCompreClassNamesLength === 1 ?[

          {
            name:this.state.departmentCompreClassNames ? (this.state.departmentCompreClassNames[0] ? this.state.departmentCompreClassNames[0] : '') : '',
            data: this.state.categoryComprehensive ? (this.state.categoryComprehensive.num ? this.state.categoryComprehensive.num  : 0) : '',
            type: 'line'
          },
        ]
        : [
        {
          name:this.state.departmentCompreClassNames ? (this.state.departmentCompreClassNames[0] ? this.state.departmentCompreClassNames[0] : '') : '',
          data: this.state.categoryComprehensive ? (this.state.categoryComprehensive.num1 ? this.state.categoryComprehensive.num1  : 0) : '',
          type: 'line'
        },
        {
          name:this.state.departmentCompreClassNames ? (this.state.departmentCompreClassNames[1] ? this.state.departmentCompreClassNames[1] : '') : '',
          data: this.state.categoryComprehensive ? (this.state.categoryComprehensive.num2 ? this.state.categoryComprehensive.num2  : 0) : '',
          type: 'line'
        },
        {
          name:this.state.departmentCompreClassNames ? (this.state.departmentCompreClassNames[2] ? this.state.departmentCompreClassNames[2] : '') : '',
          data: this.state.categoryComprehensive ? (this.state.categoryComprehensive.num3 ? this.state.categoryComprehensive.num3  : 0) : '',
          type: 'line'
        },
        {
          name:this.state.departmentCompreClassNames ? (this.state.departmentCompreClassNames[3] ? this.state.departmentCompreClassNames[3] : '') : '',
          data: this.state.categoryComprehensive ? (this.state.categoryComprehensive.num4 ? this.state.categoryComprehensive.num4  : 0) : '',
          type: 'line'
        },
        {
          name:this.state.departmentCompreClassNames ? (this.state.departmentCompreClassNames[4] ? this.state.departmentCompreClassNames[4] : '') : '',
          data: this.state.categoryComprehensive ? (this.state.categoryComprehensive.num5 ? this.state.categoryComprehensive.num5  : 0) : '',
          type: 'line'
        },
        {
          name:this.state.departmentCompreClassNames ? (this.state.departmentCompreClassNames[5] ? this.state.departmentCompreClassNames[5] : '') : '',
          data: this.state.categoryComprehensive ? (this.state.categoryComprehensive.num6 ? this.state.categoryComprehensive.num6  : 0) : '',
          type: 'line'
        },
        {
          name:this.state.departmentCompreClassNames ? (this.state.departmentCompreClassNames[6] ? this.state.departmentCompreClassNames[6] : '') : '',
          data: this.state.categoryComprehensive ? (this.state.categoryComprehensive.num7 ? this.state.categoryComprehensive.num7  : 0) : '',
          type: 'line'
        },
        {
          name:this.state.departmentCompreClassNames ? (this.state.departmentCompreClassNames[7] ? this.state.departmentCompreClassNames[7] : '') : '',
          data: this.state.categoryComprehensive ? (this.state.categoryComprehensive.num8 ? this.state.categoryComprehensive.num8  : 0) : '',
          type: 'line'
        },
        {
          name:this.state.departmentCompreClassNames ? (this.state.departmentCompreClassNames[8] ? this.state.departmentCompreClassNames[8] : '') : '',
          data: this.state.categoryComprehensive ? (this.state.categoryComprehensive.num9 ? this.state.categoryComprehensive.num9  : 0) : '',
          type: 'line'
        },
        {
          name:this.state.departmentCompreClassNames ? (this.state.departmentCompreClassNames[9] ? this.state.departmentCompreClassNames[9] : '') : '',
          data: this.state.categoryComprehensive ? (this.state.categoryComprehensive.num10 ? this.state.categoryComprehensive.num10  : 0) : '',
          type: 'line'
        },
      ]
    };
    // 城管工单
    const optionInspectors={
      xAxis: {
        type: 'category',
        data: this.state.inspectorsCompreate ? this.state.inspectorsCompreate : '',
      },
      legend: {
        data:this.state.inspectorsClassNames ? this.state.inspectorsClassNames : '',
        // x: 'center',
        // y: 'bottom',
      },
      yAxis: {
        type: 'value'
      },
      series: this.state.inspectorsClassNamesLength === 1 ?[
          {
            name:this.state.inspectorsClassNames ? (this.state.inspectorsClassNames[0] ? this.state.inspectorsClassNames[0] : '') : '',
            data: this.state.categoryInspectors ? (this.state.categoryInspectors.num ? this.state.categoryInspectors.num  : this.state.categoryInspectors.num1) : '',
            type: 'line'
          },
        ]
        :
        [
          {
            name:this.state.inspectorsClassNames ? (this.state.inspectorsClassNames[0] ? this.state.inspectorsClassNames[0] : '') : '',
            data: this.state.categoryInspectors ? (this.state.categoryInspectors.num1 ? this.state.categoryInspectors.num1  : 0) : '',
            type: 'line'
          },
          {
            name:this.state.inspectorsClassNames ? (this.state.inspectorsClassNames[1] ? this.state.inspectorsClassNames[1] : '') : '',
            data: this.state.categoryInspectors ? (this.state.categoryInspectors.num2 ? this.state.categoryInspectors.num2  : 0) : '',
            type: 'line'
          },
          {
            name:this.state.inspectorsClassNames ? (this.state.inspectorsClassNames[2] ? this.state.inspectorsClassNames[2] : '') : '',
            data: this.state.categoryInspectors ? (this.state.categoryInspectors.num3 ? this.state.categoryInspectors.num3  : 0) : '',
            type: 'line'
          },
          {
            name:this.state.inspectorsClassNames ? (this.state.inspectorsClassNames[1] ? this.state.inspectorsClassNames[1] : '') : '',
            data: this.state.categoryInspectors ? (this.state.categoryInspectors.num4 ? this.state.categoryInspectors.num4  : 0) : '',
            type: 'line'
          },
          {
            name:this.state.inspectorsClassNames ? (this.state.inspectorsClassNames[2] ? this.state.inspectorsClassNames[2] : '') : '',
            data: this.state.categoryInspectors ? (this.state.categoryInspectors.num5 ? this.state.categoryInspectors.num5  : 0) : '',
            type: 'line'
          },
        ]
    };
    // 领导交办
    const optionLeader={
      xAxis: {
        type: 'category',
        data: this.state.leaderCompreate ? this.state.leaderCompreate : '',
      },
      legend: {
        data:this.state.leaderClassNames ? this.state.leaderClassNames : '',
        // x: 'center',
        // y: 'bottom',
      },
      yAxis: {
        type: 'value'
      },
      series: this.state.leaderClassNamesLength === 1 ?[
          {
            name:this.state.leaderClassNames ? (this.state.leaderClassNames[0] ? this.state.leaderClassNames[0] : '') : '',
            data: this.state.categoryLeader ? (this.state.categoryLeader.num ? this.state.categoryLeader.num  : this.state.categoryLeader.num1) : '',
            type: 'line'
          },
        ]
        :
        [
          {
            name:this.state.leaderClassNames ? (this.state.leaderClassNames[0] ? this.state.leaderClassNames[0] : '') : '',
            data: this.state.categoryLeader ? (this.state.categoryLeader.num1 ? this.state.categoryLeader.num1  : 0) : '',
            type: 'line'
          },
          {
            name:this.state.leaderClassNames ? (this.state.leaderClassNames[1] ? this.state.leaderClassNames[1] : '') : '',
            data: this.state.categoryLeader ? (this.state.categoryLeader.num2 ? this.state.categoryLeader.num2  : 0) : '',
            type: 'line'
          },
          {
            name:this.state.leaderClassNames ? (this.state.leaderClassNames[2] ? this.state.leaderClassNames[2] : '') : '',
            data: this.state.categoryLeader ? (this.state.categoryLeader.num3 ? this.state.categoryLeader.num3  : 0) : '',
            type: 'line'
          },
          {
            name:this.state.leaderClassNames ? (this.state.leaderClassNames[1] ? this.state.leaderClassNames[1] : '') : '',
            data: this.state.categoryLeader ? (this.state.categoryLeader.num4 ? this.state.categoryLeader.num4  : 0) : '',
            type: 'line'
          },
          {
            name:this.state.leaderClassNames ? (this.state.leaderClassNames[2] ? this.state.leaderClassNames[2] : '') : '',
            data: this.state.categoryLeader ? (this.state.categoryLeader.num5 ? this.state.categoryLeader.num5  : 0) : '',
            type: 'line'
          },
        ]
    };
    // 投诉工单
    const optionComplain={
      xAxis: {
        type: 'category',
        data: this.state.complainDate ? this.state.complainDate : '',
      },
      legend: {
        data:this.state.complainClassNames ? this.state.complainClassNames : '',
        // x: 'center',
        // y: 'bottom',
      },
      yAxis: {
        type: 'value'
      },
      series: this.state.complainClassNamesLength === 1 ?
        [
          {
            name:this.state.complainClassNames ? (this.state.complainClassNames[0] ? this.state.complainClassNames[0] : '') : '',
            data: this.state.categoryComplain ? (this.state.categoryComplain.num ? this.state.categoryComplain.num  : this.state.categoryComplain.num1) : '',
            type: 'line'
          },
        ]
        :
        [
          {
            name:this.state.complainClassNames ? (this.state.complainClassNames[0] ? this.state.complainClassNames[0] : '') : '',
            data: this.state.categoryComplain ? (this.state.categoryComplain.num1 ? this.state.categoryComplain.num1  : 0) : '',
            type: 'line'
          },
          {
            name:this.state.complainClassNames ? (this.state.complainClassNames[0] ? this.state.complainClassNames[0] : '') : '',
            data: this.state.categoryComplain ? (this.state.categoryComplain.num2 ? this.state.categoryComplain.num2  : 0) : '',
            type: 'line'
          },
          {
            name:this.state.complainClassNames ? (this.state.complainClassNames[0] ? this.state.complainClassNames[0] : '') : '',
            data: this.state.categoryComplain ? (this.state.categoryComplain.num3 ? this.state.categoryComplain.num3  : 0) : '',
            type: 'line'
          },
          {
            name:this.state.complainClassNames ? (this.state.complainClassNames[0] ? this.state.complainClassNames[0] : '') : '',
            data: this.state.categoryComplain ? (this.state.categoryComplain.num4 ? this.state.categoryComplain.num4  : 0) : '',
            type: 'line'
          },
          {
            name:this.state.complainClassNames ? (this.state.complainClassNames[0] ? this.state.complainClassNames[0] : '') : '',
            data: this.state.categoryComplain ? (this.state.categoryComplain.num5 ? this.state.categoryComplain.num5  : 0) : '',
            type: 'line'
          },
        ]
    };
   this.state.chartKey === '1' ? myChartDepCom.setOption(option,true) :  (
     this.state.chartKey === '2' ? myChartDepCom.setOption(optionInspectors,true) : (
       this.state.chartKey === '3' ? myChartDepCom.setOption(optionLeader,true) : (
         this.state.chartKey === '4' ?  myChartDepCom.setOption(optionComplain,true) : ''
       )
     )
   );
  }

  callback(val){
    const date = moment().subtract(7, 'days').calendar();
    const reg = new RegExp('/','g');
    const dates = date.replace(reg,'-');
    const { form } = this.props;
    form.resetFields();
    this.setState({
      chartKey:val,
    });
    if(val === '1'){
      new Promise(resolve => {
        this.props.dispatch({
          type:'category/categoryComprehensiveFetch',
          payload:{
            resolve,
            bigtime:dates,
            endtime:moment().format().substring(0,10),
            community:'',
            caseBigType:'',
            status:'',
          },
        })
      }).then((res)=>{
        const  departmentCompreate = [];
        const caseBigTypeNum = res.data.num ? res.data.num : [];
        for(let i = 0;i < res.data.date.length; i++){
          const a = res.data.date[i];
          departmentCompreate.push(a.substring(0,10));
        }
        this.setState({
          categoryComprehensive:res.data,
          departmentCompreate,
          departmentCompreClassNames:res.data.classNames,
          departmentCompreClassNamesLength:res.data.classNames.length,
          caseBigTypeDepComprehensive:this.state.caseBigTypeDepComprehensive,
          statusDepComprehensive:this.state.statusDepComprehensive,
        })
      });
    }else if(val === '2'){
      new Promise(resolve => {
        this.props.dispatch({
          type:'category/categoryInspectorFetch',
          payload:{
            resolve,
            bigtime:dates,
            endtime:moment().format().substring(0,10),
            community:'',
            caseBigType:'',
            caseSmallType:'',
            status:'',
          },
        })
      }).then((res)=>{
        const  inspectorsCompreate = [];
        const inspectorsClassNames = res.data.classNames ? res.data.classNames : [];
        for(let i = 0;i < res.data.date.length; i++){
          const a = res.data.date[i];
          inspectorsCompreate.push(a.substring(0,10));
        }
        this.setState({
          categoryInspectors:res.data,
          inspectorsCompreate,
          inspectorsClassNamesLength:inspectorsClassNames.length,
          inspectorsClassNames,
        });
      });
    }else if(val === '3'){
      new Promise(resolve => {
        this.props.dispatch({
          type:'category/categoryLeaderFetch',
          payload:{
            resolve,
            bigtime:dates,
            endtime:moment().format().substring(0,10),
            community:'',
            orderType:'',
            status:'',
          },
        })
      }).then((res)=>{
        const  leaderCompreate = [];
        const leaderClassNames = res.data.classNames ? res.data.classNames : [];
        for(let i = 0;i < res.data.date.length; i++){
          const a = res.data.date[i];
          leaderCompreate.push(a.substring(0,10));
        }
        this.setState({
          categoryLeader:res.data,
          leaderCompreate,
          leaderClassNamesLength:leaderClassNames.length,
          leaderClassNames,
        });
      });
    }else if(val === '4'){
      new Promise(resolve => {
        this.props.dispatch({
          type:'category/categoryComplainFetch',
          payload:{
            resolve,
            bigtime:dates,
            endtime:moment().format().substring(0,10),
            community:'',
            orderType:'',
            status:'',
          },
        })
      }).then((res)=>{
        const  complainDate = [];
        const complainClassNames = res.data.classNames ? res.data.classNames : [];
        for(let i = 0;i < res.data.date.length; i++){
          const a = res.data.date[i];
          complainDate.push(a.substring(0,10));
        }
        this.setState({
          categoryComplain:res.data,
          complainDate,
          complainClassNamesLength:complainClassNames.length,
          complainClassNames,
        });
      });
    }
    this.setState({
      communityDepComprehensive:'',
      caseBigTypeDepComprehensive:'',
      statusDepComprehensive:'',
    });
    form.setFieldsValue({'rangeDepCom':range(7)});
    form.setFieldsValue({'day':7})
  }

  render(){
    const { getFieldDecorator } = this.props.form;
    const { select,inspectors } = this.props;
    const { rangeDepCom,chartKey,statusRecord,communityRecord,listbigAllClass,listSmallAllClass } = this.state;
    const { communityList,bigClassListSelect,typeList,convergenceProgramList } = select;
    return(
      <div>
        <h3 id="listTitle">统计分析 / 工单类别分析</h3>
        <div id="listTitleDetailTab">
          <Tabs defaultActiveKey="1" onChange={this.callback.bind(this)} type="card">
            <TabPane tab="综合执法" key="1" />
            <TabPane tab="城管工单" key="2" />
            <TabPane tab="领导交办" key="3" />
            <TabPane tab="投诉工单" key="4" />
          </Tabs>
          <p style={{height:40,border:'1px solid #000',width:'100%',margin:10,paddingLeft:10,lineHeight:'40px'}}>关键指标（本页数据根据昨日数据计算。）</p>
        </div>
        {
          chartKey === '1' ? (
            <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{marginTop:10,padding:10}}>
              <Col md={3} sm={3}>
                <FormItem label="">
                  {getFieldDecorator('day',{
                    initialValue:7
                  })(
                    <Select style={{width:'100%'}} onChange={this.depComChange}>
                      <Option value={7}>最近7天</Option>
                      <Option value={15}>最近15天</Option>
                      <Option value={30}>最近30天</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={5} sm={5}>
                <FormItem label="">
                  {getFieldDecorator('rangeDepCom',{
                    initialValue:rangeDepCom
                  })(
                    <RangePicker style={{width:'100%'}} allowClear={false} disabledDate={this.disabledDepComDate} onChange={this.depComDateChange.bind(this)} />
                  )}
                </FormItem>
              </Col>
              <Col md={4} sm={4}>
                <FormItem label="">
                  {getFieldDecorator('community')(
                    <Select placeholder="请选择社区" allowClear style={{width:'100%'}} onChange={this.onDepComCommunity.bind(this)}>
                      {
                        communityList ?
                          (communityList.map((val)=>(
                            <Select.Option key={val.dictid} value={val.dictid}>{val.dictname}</Select.Option>
                          ))): ''
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={4} sm={4}>
                <FormItem label="">
                  {getFieldDecorator('caseType')(
                    <Select placeholder="请选择工单类别" allowClear style={{width:'100%'}} onChange={this.onDepComCaseType.bind(this)}>
                      {
                        bigClassListSelect ?
                          (bigClassListSelect.map((val)=>(
                            <Select.Option key={val.dictid} value={val.dictid}>{val.dictname}</Select.Option>
                          ))): ''
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={4} sm={4}>
                <FormItem label="">
                  {getFieldDecorator('caseStatus')(
                    <Select placeholder="请选择工单状态" allowClear style={{width:'100%'}} onChange={this.onDepComStatus.bind(this)}>
                      <Select.Option value={1}>已经结案</Select.Option>
                      <Select.Option value={2}>待处理</Select.Option>
                      <Select.Option value={3}>已处理</Select.Option>
                      <Select.Option value={4}>待结案</Select.Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={4} sm={4} style={{ textAlign: 'right',padding: '4px 0' }}>
                <Button style={{ marginRight:0, marginLeft:16 }} type='primary' onClick={this.printDeparmentCom}>
                  打印
                </Button>
              </Col>
            </Row>
          ) : (chartKey === '2' ? (
            <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{marginTop:10,padding:10}}>
              <Col md={3} sm={3}>
                <FormItem label="">
                  {getFieldDecorator('day',{
                    initialValue:7
                  })(
                    <Select style={{width:'100%'}} onChange={this.depComChange}>
                      <Option value={7}>最近7天</Option>
                      <Option value={15}>最近15天</Option>
                      <Option value={30}>最近30天</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={5} sm={5}>
                <FormItem label="">
                  {getFieldDecorator('rangeDepCom',{
                    initialValue:rangeDepCom
                  })(
                    <RangePicker style={{width:'100%'}} allowClear={false} disabledDate={this.disabledDepComDate} onChange={this.depComDateChange.bind(this)} />
                  )}
                </FormItem>
              </Col>
              <Col md={4} sm={4}>
                <FormItem label="">
                  {getFieldDecorator('communityWE')(
                    <Select placeholder="请选择社区" allowClear style={{width:'100%'}} onChange={this.onDepComCommunity.bind(this)}>
                      {
                        communityList ?
                          (communityList.map((val)=>(
                            <Select.Option key={val.dictid} value={val.dictid}>{val.dictname}</Select.Option>
                          ))): ''
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={4} sm={4}>
                <FormItem label="">
                  {getFieldDecorator('caseBigTypeSearch')(
                    <Select placeholder="请选择案件大类" allowClear style={{width: '100%'}} onChange={this.bigClassSearch}>
                      {listbigAllClass.map((val)=>(
                        <Select.Option key={val.largeClassCode} value={val.largeClassCode}>{val.largeClassName}</Select.Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={4} sm={4}>
                <FormItem label="">
                  {getFieldDecorator('caseSmallTypeSearch')(
                    <Select placeholder="请选择案件小类" allowClear style={{width: '100%'}} onChange={this.smallClassSearch}>
                      {listSmallAllClass.map((val)=>(
                        <Select.Option key={val.smallClassCode} value={val.smallClassCode}>{val.smallClassName}</Select.Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={4} sm={4}>
                <FormItem label="">
                  {getFieldDecorator('caseStatus')(
                    <Select placeholder="请选择工单状态" allowClear style={{width:'100%'}} onChange={this.onDepComStatus.bind(this)}>
                      <Select.Option value={1}>已经结案</Select.Option>
                      <Select.Option value={2}>待处理</Select.Option>
                      <Select.Option value={3}>已处理</Select.Option>
                      <Select.Option value={4}>待结案</Select.Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={4} sm={4} style={{ textAlign: 'right',padding: '4px 0' }}>
                <Button style={{ marginRight:0, marginLeft:16 }} type='primary' onClick={this.printDeparmentCom}>
                  打印
                </Button>
              </Col>
            </Row>
          ) : (chartKey === '3' ? (
            <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{marginTop:10,padding:10}}>
              <Col md={3} sm={3}>
                <FormItem label="">
                  {getFieldDecorator('day',{
                    initialValue:7
                  })(
                    <Select style={{width:'100%'}} onChange={this.depComChange}>
                      <Option value={7}>最近7天</Option>
                      <Option value={15}>最近15天</Option>
                      <Option value={30}>最近30天</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={5} sm={5}>
                <FormItem label="">
                  {getFieldDecorator('rangeDepCom',{
                    initialValue:rangeDepCom
                  })(
                    <RangePicker style={{width:'100%'}} allowClear={false} disabledDate={this.disabledDepComDate} onChange={this.depComDateChange.bind(this)} />
                  )}
                </FormItem>
              </Col>
              <Col md={4} sm={4}>
                <FormItem label="">
                  {getFieldDecorator('community1')(
                    <Select placeholder="请选择社区" allowClear style={{width:'100%'}} onChange={this.onDepComCommunity.bind(this)}>
                      {
                        communityList ?
                          (communityList.map((val)=>(
                            <Select.Option key={val.dictid} value={val.dictid}>{val.dictname}</Select.Option>
                          ))): ''
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={4} sm={4}>
                <FormItem label="">
                  {getFieldDecorator('orderType')(
                    <Select placeholder="请选择工单类型" allowClear style={{width:'100%'}} onChange={this.workOrderType.bind(this)}>
                      {typeList.map((val)=>(
                        <Select.Option key={val.dictid} value={val.dictid}>{val.dictname}</Select.Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={4} sm={4}>
                <FormItem label="">
                  {getFieldDecorator('caseStatus')(
                    <Select placeholder="请选择工单状态" allowClear style={{width:'100%'}} onChange={this.onDepComStatus.bind(this)}>
                      <Select.Option value={1}>已经结案</Select.Option>
                      <Select.Option value={2}>待处理</Select.Option>
                      <Select.Option value={3}>已处理</Select.Option>
                      <Select.Option value={4}>待结案</Select.Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={4} sm={4} style={{ textAlign: 'right',padding: '4px 0' }}>
                <Button style={{ marginRight:0, marginLeft:16 }} type='primary' onClick={this.printDeparmentCom}>
                  打印
                </Button>
              </Col>
            </Row>) : (
              chartKey === '4' ? (
                <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{marginTop:10,padding:10}}>
                  <Col md={3} sm={3}>
                    <FormItem label="">
                    {getFieldDecorator('day',{
                      initialValue:7
                    })(
                      <Select style={{width:'100%'}} onChange={this.depComChange}>
                        <Option value={7}>最近7天</Option>
                        <Option value={15}>最近15天</Option>
                        <Option value={30}>最近30天</Option>
                      </Select>
                    )}
                    </FormItem>
                  </Col>
                  <Col md={5} sm={5}>
                    <FormItem label="">
                    {getFieldDecorator('rangeDepCom',{
                      initialValue:rangeDepCom
                    })(
                      <RangePicker style={{width:'100%'}} allowClear={false} disabledDate={this.disabledDepComDate} onChange={this.depComDateChange.bind(this)} />
                    )}
                    </FormItem>
                  </Col>
                  <Col md={4} sm={4}>
                    <FormItem label="">
                    {getFieldDecorator('community')(
                      <Select placeholder="请选择社区" allowClear style={{width:'100%'}} onChange={this.onDepComCommunity.bind(this)}>
                        {
                          communityList ?
                            (communityList.map((val)=>(
                              <Select.Option key={val.dictid} value={val.dictid}>{val.dictname}</Select.Option>
                            ))): ''
                        }
                      </Select>
                    )}
                    </FormItem>
                  </Col>
                  <Col md={4} sm={4}>
                    <FormItem label="">
                    {getFieldDecorator('underCentralizedType', {
                      rules: [
                        {
                          required: false,
                          message: '请填写归口类型',
                        },
                      ],
                    })(
                      <Select placeholder="请选择归口类型" allowClear style={{width:'100%'}} onChange={this.onConvergenceProgram.bind(this)}>
                        {convergenceProgramList.map((val)=>(
                          <Select.Option key={val.dictid} value={val.dictid}>{val.dictname}</Select.Option>
                        ))}
                      </Select>
                    )}
                    </FormItem>
                  </Col>
                  <Col md={4} sm={4}>
                    <FormItem label="">
                    {getFieldDecorator('caseStatus')(
                      <Select placeholder="请选择工单状态" allowClear style={{width:'100%'}} onChange={this.onDepComStatus.bind(this)}>
                        <Select.Option value={1}>已经结案</Select.Option>
                        <Select.Option value={2}>待处理</Select.Option>
                        <Select.Option value={3}>已处理</Select.Option>
                        <Select.Option value={4}>待结案</Select.Option>
                      </Select>
                    )}
                    </FormItem>
                  </Col>
                  <Col md={4} sm={4} style={{ textAlign: 'right',padding: '4px 0' }}>
                    <Button style={{ marginRight:0, marginLeft:16 }} type='primary' onClick={this.printDeparmentCom}>
                    打印
                    </Button>
                  </Col>
                </Row>
          ) : '')))
        }
        <div id='myChartDepCom' style={{width:'100%',height:500}} />
        {
         chartKey === '1' ? (
           <div style={{paddingLeft:100}}>
             <div><span>片区</span><span>{
              communityRecord === 1 ? '尧化社区' : (
                communityRecord === 2 ? '翠林山庄' : (
                  communityRecord === 3 ? '金尧花园' : (
                    communityRecord === 4 ? '青田雅居' : (
                      communityRecord === 5 ? '尧林仙居' : (
                        communityRecord === 6 ? '王子楼社区' : (
                          communityRecord === 7 ? '尧辰社区' : (
                            communityRecord === 8 ? '吴边社区' : (
                              communityRecord === 9 ? '尧新社区' : (
                                communityRecord === 10 ? '尧胜社区' : (
                                  communityRecord === 11 ? '尧化新村' : (
                                    communityRecord === 12 ? '尧安新村' :(
                                      communityRecord === 13 ? '尧石二村' : ''
                                    )
                                  )
                                )
                              )
                            )
                          )
                        )
                      )
                    )
                  )
                )
              )
            }
                                 </span>
             </div>
             <div><span>工单状态</span><span>{statusRecord === 1 ? '已经结案' : (statusRecord === 2 ? '待处理' : (statusRecord === 3 ? '已处理' : (statusRecord === 4 ? '待结案' : '')))}</span></div>
           </div>): (chartKey === '2' ? ((
             <div style={{paddingLeft:100}}>
                <div>
                  <span>片区</span>
                  <span>
                  {
                    communityRecord === 1 ? '尧化社区' : (
                      communityRecord === 2 ? '翠林山庄' : (
                        communityRecord === 3 ? '金尧花园' : (
                          communityRecord === 4 ? '青田雅居' : (
                            communityRecord === 5 ? '尧林仙居' : (
                              communityRecord === 6 ? '王子楼社区' : (
                                communityRecord === 7 ? '尧辰社区' : (
                                  communityRecord === 8 ? '吴边社区' : (
                                    communityRecord === 9 ? '尧新社区' : (
                                      communityRecord === 10 ? '尧胜社区' : (
                                        communityRecord === 11 ? '尧化新村' : (
                                          communityRecord === 12 ? '尧安新村' :(
                                            communityRecord === 13 ? '尧石二村' : ''
                                          )
                                        )
                                      )
                                    )
                                  )
                                )
                              )
                            )
                          )
                        )
                      )
                    )
                  }
                  </span>
                </div>
                <div><span>工单状态</span><span /></div>
             </div>)) : ((
                <div style={{paddingLeft:100}}>
                <div>
                  <span>片区</span>
                  <span>
                  {
                    communityRecord === 1 ? '尧化社区' : (
                      communityRecord === 2 ? '翠林山庄' : (
                        communityRecord === 3 ? '金尧花园' : (
                          communityRecord === 4 ? '青田雅居' : (
                            communityRecord === 5 ? '尧林仙居' : (
                              communityRecord === 6 ? '王子楼社区' : (
                                communityRecord === 7 ? '尧辰社区' : (
                                  communityRecord === 8 ? '吴边社区' : (
                                    communityRecord === 9 ? '尧新社区' : (
                                      communityRecord === 10 ? '尧胜社区' : (
                                        communityRecord === 11 ? '尧化新村' : (
                                          communityRecord === 12 ? '尧安新村' :(
                                            communityRecord === 13 ? '尧石二村' : ''
                                          )
                                        )
                                      )
                                    )
                                  )
                                )
                              )
                            )
                          )
                        )
                      )
                    )
                  }
                  </span>
                </div>
                <div>
                  <span>工单状态</span>
                  <span>
                  {statusRecord === 1 ? '已经结案' : (statusRecord === 2 ? '待处理' : (statusRecord === 3 ? '已处理' : (statusRecord === 4 ? '待结案' : '')))}
                  </span>
                </div>
                </div>)))
        }
      </div>
    )
  }
}
export default Home;
