/* eslint-disable react/jsx-no-bind */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-shadow */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-use-before-define */
/* eslint-disable func-names */
/* eslint-disable react/sort-comp */
/* eslint-disable no-plusplus */
/* eslint-disable react/no-unused-state */
/* eslint-disable no-unused-vars */
import React, { PureComponent } from 'react';
import {Tabs,Row,Col,Select,DatePicker,Button,Form} from 'antd';
import echarts from 'echarts'
import { connect } from 'dva/index';
import moment from 'moment/moment';
import styles from './style.less'
import range from './range'
import TableList from '../List/TableList';

const {RangePicker} = DatePicker;
const {Option} = Select;
const {TabPane} = Tabs;
const FormItem = Form.Item;
@connect(({ increase,select }) => ({
  increase,select
}))
@Form.create()
class Home extends PureComponent {
  state={
    chartKey:'1',
    chartKeyLeader:'1',
    chartKeyInt:'1',

    dayDepDealtDisabled:7,
    dayDepDisposal:7,
    range:range(7),
    communityDepDealt:'',
    bigTimeDepDealt:'',
    endTimeDepDealt:'',
    increaseDepDisposaList:{},
    CloseWorkNumArr:[],// 部门派发 案件减少
    intDate:[],// 部门派发 时间

    increaseLeaderList:{},
    dayLeaderDisabled:7,
    dayLeader:7,
    rangeLeader:range(7),
    bigTimeLeader:'',
    endTimeLeader:'',
    communityLeader:'',
    CloseWorkNumArrLeader:[],// 领导交办 案件减少
    LeaderDate:[],// 领导交办 时间

    increaseIntList:{},
    dayIntDisabled:7,
    dayInt:7,
    rangeInt:range(7),
    bigTimeInt:'',
    endTimeInt:'',
    communityInt:'',
    CloseWorkNumArrInt:[],// 智能生成 案件减少
    IntDate:[],// 智能生成 时间
  };

  componentDidMount(){
    const date=moment().subtract(7, 'days').calendar();
    const reg = new RegExp('/','g');
    const dates = date.replace(reg,'-');
    new Promise(resolve => {
      this.props.dispatch({
        type:'increase/increaseDepDisposalFetch',
        payload:{
          resolve,
          bigtime:dates,
          endtime:moment().format().substring(0,10),
        },
      })
    }).then((res)=>{
      const  CloseWorkNumArr = [];
      const  intDate = [];
      for(let i = 0;i < res.data.CloseWorkNum.length; i++){
        const a = res.data.CloseWorkNum[i];
        CloseWorkNumArr.push(-(a));
      }
      for(let i = 0;i < res.data.date.length; i++){
        const a = res.data.date[i];
        intDate.push(a.substring(0,10));
      }
      this.setState({
        increaseDepDisposaList:res.data,
        CloseWorkNumArr,
        intDate,
        bigTimeDepDealt:dates,
        endTimeDepDealt:moment().format().substring(0,10),
      });
      new Promise(resolve => {
        this.props.dispatch({
          type:'increase/increaseLeaderFetch',
          payload:{
            resolve,
            bigtime:dates,
            endtime:moment().format().substring(0,10),
          },
        })
      }).then((resLeader)=>{
        const  CloseWorkNumArrLeader = [];
        const  LeaderDate = [];
        for(let i = 0;i < res.data.CloseWorkNum.length; i++){
          const a = res.data.CloseWorkNum[i];
          CloseWorkNumArrLeader.push(-(a));
        }
        for(let i = 0;i < res.data.date.length; i++){
          const a = res.data.date[i];
          LeaderDate.push(a.substring(0,10));
        }
        this.setState({
          increaseLeaderList:resLeader.data,
          CloseWorkNumArrLeader,
          LeaderDate,
          bigTimeLeader:dates,
          endTimeLeader:moment().format().substring(0,10),
        })
      });
      new Promise(resolve => {
        this.props.dispatch({
          type:'increase/increaseIntFetch',
          payload:{
            resolve,
            bigtime:dates,
            endtime:moment().format().substring(0,10),
          },
        })
      }).then((resInt)=>{
        const  CloseWorkNumArrInt = [];
        const  IntDate = [];
        for(let i = 0;i < resInt.data.CloseWorkNum.length; i++){
          const a = resInt.data.CloseWorkNum[i];
          CloseWorkNumArrInt.push(-(a));
        }
        for(let i = 0;i < resInt.data.date.length; i++){
          const a = resInt.data.date[i];
          IntDate.push(a.substring(0,10));
        }
        this.setState({
          increaseIntList:resInt.data,
          CloseWorkNumArrInt,
          IntDate,
          bigTimeInt:dates,
          endTimeInt:moment().format().substring(0,10),
        })
      });
      // 社区
      this.props.dispatch({
        type:'select/community',
      });
    });
  }

  // 部门交办
  handleChangeDepDisposal=(dayDepDisposal)=>{
    const {form} = this.props;
    const arr=range(dayDepDisposal);
    this.setState({
      range:arr,
      dayDepDealtDisabled:dayDepDisposal,
      bigTimeDepDealt: moment(arr[0]).format('YYYY-MM-DD'),
      endTimeDepDealt: moment(arr[1]).format('YYYY-MM-DD'),
    });
    new Promise(resolve => {
      this.props.dispatch({
        type:'increase/increaseDepDisposalFetch',
        payload:{
          resolve,
          bigtime:moment(arr[0]).format('YYYY-MM-DD'),
          endtime:moment(arr[1]).format('YYYY-MM-DD'),
          community:this.state.communityDepDealt,
        },
      })
    }).then((res)=>{
      const  CloseWorkNumArr = [];
      const  intDate = [];
      for(let i = 0;i < res.data.CloseWorkNum.length; i++){
        const a = res.data.CloseWorkNum[i];
        CloseWorkNumArr.push(-(a));
      }
      for(let i = 0;i < res.data.date.length; i++){
        const a = res.data.date[i];
        intDate.push(a.substring(0,10));
      }
      this.setState({
        increaseDepDisposaList:res.data,
        CloseWorkNumArr,
        intDate,
      })
    });
    form.setFieldsValue({'range':arr})
  };

  disabledDepDisDate = current => current && current > moment().endOf('day') || current < moment().subtract(this.state.dayDepDealtDisabled+1, 'day');

  handleDepDisDateChange=(dayDepDisposal)=>{
    const start =  moment(dayDepDisposal[0]).format('YYYY-MM-DD');
    const end =  moment(dayDepDisposal[1]).format('YYYY-MM-DD');
    this.setState({
      bigTimeDepDealt: moment(dayDepDisposal[0]).format('YYYY-MM-DD'),
      endTimeDepDealt: moment(dayDepDisposal[1]).format('YYYY-MM-DD'),
    });
    new Promise(resolve => {
      this.props.dispatch({
        type:'increase/increaseDepDisposalFetch',
        payload:{
          resolve,
          bigtime:start,
          endtime:end,
          community:this.state.communityDepDealt,
        },
      })
    }).then((res)=>{
      const  CloseWorkNumArr = [];
      const  intDate = [];
      for(let i = 0;i < res.data.CloseWorkNum.length; i++){
        const a = res.data.CloseWorkNum[i];
        CloseWorkNumArr.push(-(a));
      }
      for(let i = 0;i < res.data.date.length; i++){
        const a = res.data.date[i];
        intDate.push(a.substring(0,10));
      }
      this.setState({
        increaseDepDisposaList:res.data,
        CloseWorkNumArr,
        intDate,
      })
    });
  };

  selectDepDisDateChange(val){
    this.setState({
      communityDepDealt:val,
    });
    new Promise(resolve => {
      this.props.dispatch({
        type:'increase/increaseDepDisposalFetch',
        payload:{
          resolve,
          bigtime:this.state.bigTimeDepDealt,
          endtime:this.state.endTimeDepDealt,
          community:val,
        },
      })
    }).then((res)=>{
      const  CloseWorkNumArr = [];
      const  intDate = [];
      for(let i = 0;i < res.data.CloseWorkNum.length; i++){
        const a = res.data.CloseWorkNum[i];
        CloseWorkNumArr.push(-(a));
      }
      for(let i = 0;i < res.data.date.length; i++){
        const a = res.data.date[i];
        intDate.push(a.substring(0,10));
      }
      this.setState({
        increaseDepDisposaList:res.data,
        CloseWorkNumArr,
        intDate,
      })
    });
  }

  // 领导交办
  handleChangeLeader=(dayLeader)=>{
    const {form} = this.props;
    const arr=range(dayLeader);
    this.setState({
      range:arr,
      dayLeaderDisabled:dayLeader,
      bigTimeLeader: moment(arr[0]).format('YYYY-MM-DD'),
      endTimeLeader: moment(arr[1]).format('YYYY-MM-DD'),
    });
    new Promise(resolve => {
      this.props.dispatch({
        type:'increase/increaseLeaderFetch',
        payload:{
          resolve,
          bigtime:moment(arr[0]).format('YYYY-MM-DD'),
          endtime:moment(arr[1]).format('YYYY-MM-DD'),
          community:this.state.communityLeader,
        },
      })
    }).then((resLeader)=>{
      const  CloseWorkNumArrLeader = [];
      const  LeaderDate = [];
      for(let i = 0;i < resLeader.data.CloseWorkNum.length; i++){
        const a = resLeader.data.CloseWorkNum[i];
        CloseWorkNumArrLeader.push(-(a));
      }
      for(let i = 0;i < resLeader.data.date.length; i++){
        const a = resLeader.data.date[i];
        LeaderDate.push(a.substring(0,10));
      }
      this.setState({
        increaseLeaderList:resLeader.data,
        CloseWorkNumArrLeader,
        LeaderDate,
      })
    });
    form.setFieldsValue({'rangeLeader':arr})
  };

  disabledLeaderDate = current => current && current > moment().endOf('day') || current < moment().subtract(this.state.dayLeaderDisabled+1, 'day');

  handleLeaderDateChange=(dayDepDisposal)=>{
    const start =  moment(dayDepDisposal[0]).format('YYYY-MM-DD');
    const end =  moment(dayDepDisposal[1]).format('YYYY-MM-DD');
    this.setState({
      bigTimeLeader: moment(dayDepDisposal[0]).format('YYYY-MM-DD'),
      endTimeLeader: moment(dayDepDisposal[1]).format('YYYY-MM-DD'),
    });
    new Promise(resolve => {
      this.props.dispatch({
        type:'increase/increaseLeaderFetch',
        payload:{
          resolve,
          bigtime:start,
          endtime:end,
          community:this.state.communityLeader,
        },
      })
    }).then((resLeader )=>{
      const  CloseWorkNumArrLeader = [];
      const  LeaderDate = [];
      for(let i = 0;i < resLeader.data.CloseWorkNum.length; i++){
        const a = resLeader.data.CloseWorkNum[i];
        CloseWorkNumArrLeader.push(-(a));
      }
      for(let i = 0;i < resLeader.data.date.length; i++){
        const a = resLeader.data.date[i];
        LeaderDate.push(a.substring(0,10));
      }
      this.setState({
        increaseDepDisposaList:resLeader .data,
        CloseWorkNumArrLeader,
        LeaderDate,
      })
    });
  };

  leaderCommunityChange(val){
    this.setState({
      communityLeader:val,
    });
    new Promise(resolve => {
      this.props.dispatch({
        type:'increase/increaseLeaderFetch',
        payload:{
          resolve,
          bigtime:this.state.bigTimeLeader,
          endtime:this.state.endTimeLeader,
          community:val,
        },
      })
    }).then((resLeader )=>{
      const  CloseWorkNumArrLeader = [];
      const  LeaderDate = [];
      for(let i = 0;i < resLeader.data.CloseWorkNum.length; i++){
        const a = resLeader.data.CloseWorkNum[i];
        CloseWorkNumArrLeader.push(-(a));
      }
      for(let i = 0;i < resLeader.data.date.length; i++){
        const a = resLeader.data.date[i];
        LeaderDate.push(a.substring(0,10));
      }
      this.setState({
        increaseDepDisposaList:resLeader .data,
        CloseWorkNumArrLeader,
        LeaderDate,
      })
    });
  }

  // 智能生成
  handleChangeInt=(dayLeader)=>{
    const {form} = this.props;
    const arr = range(dayLeader);
    this.setState({
      rangeInt:arr,
      dayIntDisabled:dayLeader,
      bigTimeInt: moment(arr[0]).format('YYYY-MM-DD'),
      endTimeInt: moment(arr[1]).format('YYYY-MM-DD'),
    });
    new Promise(resolve => {
      this.props.dispatch({
        type:'increase/increaseIntFetch',
        payload:{
          resolve,
          bigtime:moment(arr[0]).format('YYYY-MM-DD'),
          endtime:moment(arr[1]).format('YYYY-MM-DD'),
          community:this.state.communityInt,
        },
      })
    }).then((resInt)=>{
      const  CloseWorkNumArrInt = [];
      const  IntDate = [];
      for(let i = 0;i < resInt.data.CloseWorkNum.length; i++){
        const a = resInt.data.CloseWorkNum[i];
        CloseWorkNumArrInt.push(-(a));
      }
      for(let i = 0;i < resInt.data.date.length; i++){
        const a = resInt.data.date[i];
        IntDate.push(a.substring(0,10));
      }
      this.setState({
        increaseIntList:resInt.data,
        CloseWorkNumArrInt,
        IntDate,
      })
    });
    form.setFieldsValue({'rangeInt':arr})
  };

  disabledIntDate = current => current && current > moment().endOf('day') || current < moment().subtract(this.state.dayIntDisabled+1, 'day');

  handleIntDateChange=(dayDepDisposal)=>{
    const start =  moment(dayDepDisposal[0]).format('YYYY-MM-DD');
    const end =  moment(dayDepDisposal[1]).format('YYYY-MM-DD');
    this.setState({
      bigTimeInt: moment(dayDepDisposal[0]).format('YYYY-MM-DD'),
      endTimeInt: moment(dayDepDisposal[1]).format('YYYY-MM-DD'),
    });
    new Promise(resolve => {
      this.props.dispatch({
        type:'increase/increaseIntFetch',
        payload:{
          resolve,
          bigtime:start,
          endtime:end,
          community:this.state.communityInt,
        },
      })
    }).then((resInt)=>{
      const  CloseWorkNumArrInt = [];
      const  IntDate = [];
      for(let i = 0;i < resInt.data.CloseWorkNum.length; i++){
        const a = resInt.data.CloseWorkNum[i];
        CloseWorkNumArrInt.push(-(a));
      }
      for(let i = 0;i < resInt.data.date.length; i++){
        const a = resInt.data.date[i];
        IntDate.push(a.substring(0,10));
      }
      this.setState({
        increaseIntList:resInt.data,
        CloseWorkNumArrInt,
        IntDate,
      })
    });
  };

  IntCommunityChange(val){
    this.setState({
      communityInt:val,
    });
    new Promise(resolve => {
      this.props.dispatch({
        type:'increase/increaseIntFetch',
        payload:{
          resolve,
          bigtime:this.state.bigTimeInt,
          endtime:this.state.endTimeInt,
          community:val,
        },
      })
    }).then((resInt)=>{
      const  CloseWorkNumArrInt = [];
      const  IntDate = [];
      for(let i = 0;i < resInt.data.CloseWorkNum.length; i++){
        const a = resInt.data.CloseWorkNum[i];
        CloseWorkNumArrInt.push(-(a));
      }
      for(let i = 0;i < resInt.data.date.length; i++){
        const a = resInt.data.date[i];
        IntDate.push(a.substring(0,10));
      }
      this.setState({
        increaseIntList:resInt.data,
        CloseWorkNumArrInt,
        IntDate,
      })
    });
  }

  componentWillUpdate(){
    // 多图表自适应
    window.addEventListener("resize", function () {
      myChart.resize();
      myChartLeader.resize();
      myChartInt.resize();
    });
    const myChart = echarts.init(document.getElementById('myChart'));
    const myChartLeader = echarts.init(document.getElementById('myChartLeader'));
    const myChartInt = echarts.init(document.getElementById('myChartInt'));
    const options = {
      xAxis: {
        type: 'category',
        data: this.state.intDate ? this.state.intDate : '',
      },
      legend: {
        data:this.state.chartKey==='1'?['累计待处理','累计已处理','累计已结案','累计已废案',]:['工单增加--新增','工单减少--已结案'],
        // x: 'center',
        // y: 'bottom',
      },
      yAxis: {
        type: 'value'
      },
      series: this.state.chartKey==='1'?[
        {
          name:'累计待处理',
          type:'line',
          // smooth: true,
          data: this.state.increaseDepDisposaList ? (this.state.increaseDepDisposaList.CPendingNum ? this.state.increaseDepDisposaList.CPendingNum  : 0) : '',
        },
        {
          name:'累计已处理',
          type:'line',
          // smooth: true,
          data: this.state.increaseDepDisposaList ? (this.state.increaseDepDisposaList.CProcessedNum ? this.state.increaseDepDisposaList.CProcessedNum  : 0) : '',
        },
        {
          name:'累计已结案',
          type:'line',
          // smooth: true,
          data: this.state.increaseDepDisposaList ? (this.state.increaseDepDisposaList.CClosedNum ? this.state.increaseDepDisposaList.CClosedNum  : 0) : '',
        },
        {
          name:'累计已废案',
          type:'line',
          // smooth: true,
          data: this.state.increaseDepDisposaList ? (this.state.increaseDepDisposaList.CWasteNum ? this.state.increaseDepDisposaList.CWasteNum  : 0) : '',
        },
      ]:[
        {
          name:'工单增加--新增',
          data: this.state.increaseDepDisposaList ? (this.state.increaseDepDisposaList.NewWorkNum ? this.state.increaseDepDisposaList.NewWorkNum  : 0) : '',
          type: 'line'
        },
        {
          name:'工单减少--已结案',
          data: this.state.CloseWorkNumArr ? this.state.CloseWorkNumArr : '',
          type: 'line'
        }
      ]
    };
    const optionsLeader = {
      xAxis: {
        type: 'category',
        data: this.state.LeaderDate ? this.state.LeaderDate : '',
      },
      legend: {
        data:this.state.chartKeyLeader ==='1'? ['累计待处理','累计已处理','累计已结案','累计已废案',]:['工单增加--新增','工单减少--已结案'],
        // x: 'center',
        // y: 'bottom',
      },
      yAxis: {
        type: 'value'
      },
      series: this.state.chartKeyLeader ==='1'? [
        {
          name:'累计待处理',
          type:'line',
          // smooth: true,
          data: this.state.increaseLeaderList ? (this.state.increaseLeaderList.CPendingNum ? this.state.increaseLeaderList.CPendingNum  : 0) : '',
        },
        {
          name:'累计已处理',
          type:'line',
          // smooth: true,
          data: this.state.increaseLeaderList ? (this.state.increaseLeaderList.CProcessedNum ? this.state.increaseLeaderList.CProcessedNum  : 0) : '',
        },
        {
          name:'累计已结案',
          type:'line',
          // smooth: true,
          data: this.state.increaseLeaderList ? (this.state.increaseLeaderList.CClosedNum ? this.state.increaseLeaderList.CClosedNum  : 0) : '',
        },
        {
          name:'累计已废案',
          type:'line',
          // smooth: true,
          data: this.state.increaseLeaderList ? (this.state.increaseLeaderList.CWasteNum ? this.state.increaseLeaderList.CWasteNum  : 0) : '',
        },
      ]:[
        {
          name:'工单增加--新增',
          data: this.state.increaseLeaderList ? (this.state.increaseLeaderList.NewWorkNum ? this.state.increaseLeaderList.NewWorkNum  : 0) : '',
          type: 'line'
        },
        {
          name:'工单减少--已结案',
          data: this.state.CloseWorkNumArrLeader ? this.state.CloseWorkNumArrLeader : '',
          type: 'line'
        }
      ]
    };
    const optionsInt = {
      xAxis: {
        type: 'category',
        data: this.state.IntDate ? this.state.IntDate : '',
      },
      legend: {
        data:this.state.chartKeyInt ==='1'? ['累计待处理','累计已处理','累计已结案','累计已废案',]:['工单增加--新增','工单减少--已结案'],
        // x: 'center',
        // y: 'bottom',
      },
      yAxis: {
        type: 'value'
      },
      series: this.state.chartKeyInt ==='1'? [
        {
          name:'累计待处理',
          type:'line',
          // smooth: true,
          data: this.state.increaseIntList ? (this.state.increaseIntList.CPendingNum ? this.state.increaseIntList.CPendingNum  : 0) : '',
        },
        {
          name:'累计已处理',
          type:'line',
          // smooth: true,
          data: this.state.increaseIntList ? (this.state.increaseIntList.CProcessedNum ? this.state.increaseIntList.CProcessedNum  : 0) : '',
        },
        {
          name:'累计已结案',
          type:'line',
          // smooth: true,
          data: this.state.increaseIntList ? (this.state.increaseIntList.CClosedNum ? this.state.increaseIntList.CClosedNum  : 0) : '',
        },
        {
          name:'累计已废案',
          type:'line',
          // smooth: true,
          data: this.state.increaseIntList ? (this.state.increaseIntList.CWasteNum ? this.state.increaseIntList.CWasteNum  : 0) : '',
        },
      ]:[
        {
          name:'工单增加--新增',
          data: this.state.increaseIntList ? (this.state.increaseIntList.NewWorkNum ? this.state.increaseIntList.NewWorkNum  : 0) : '',
          type: 'line'
        },
        {
          name:'工单减少--已结案',
          data: this.state.CloseWorkNumArrInt ? this.state.CloseWorkNumArrInt : '',
          type: 'line'
        }
      ]
    };
    myChart.setOption(options,true);
    myChartLeader.setOption(optionsLeader,true);
    myChartInt.setOption(optionsInt,true);
  }

  callback(val){
    this.setState({
      chartKey : 1,
      chartKeyLeader : 1,
    })
  }

  callbackChart(val){
    this.setState({
      chartKey : val,
    })
  }

  callbackChartLeader(val){
    this.setState({
      chartKeyLeader : val,
    })
  }

  callbackChartInt(val){
    this.setState({
      chartKeyInt : val,
    })
  }

  printDeparment(){
    window.print();
  }

  render(){
    const { getFieldDecorator } = this.props.form;
    const {range,rangeLeader,rangeInt} = this.state;
    const { select } = this.props;
    const { communityList } = select;
    return(
      <div>
        <h3 id="listTitle">统计分析 / 工单增减分析</h3>
        <div id="listTitleDetailTab">
          <Tabs defaultActiveKey="1" onChange={this.callback.bind(this)} type="card">
            <TabPane tab="部门派发" key="1">
              <div className={styles.statistics}>
                <div className={styles.first}>
                  关键指标（本页数据根据实时数据计算。）
                </div>
                <ul className={styles.two}>
                  <li>
                    <p>累计待处理工单</p>
                    <h1>
                      {this.state.increaseDepDisposaList ? (this.state.increaseDepDisposaList.CumulativePending ? this.state.increaseDepDisposaList.CumulativePending : 0): 0}
                    </h1>
                  </li>
                  <li>
                    <p>累计已处理工单</p>
                    <h1>
                      {this.state.increaseDepDisposaList ? (this.state.increaseDepDisposaList.CumulativeProcessed ? this.state.increaseDepDisposaList.CumulativeProcessed : 0): 0}
                    </h1>
                  </li>
                  <li>
                    <p>累计已结案工单</p>
                    <h1>
                      {this.state.increaseDepDisposaList ? (this.state.increaseDepDisposaList.CumulativeClosed ? this.state.increaseDepDisposaList.CumulativeClosed : 0): 0}
                    </h1>
                  </li>
                  <li>
                    <p>累计已废案工单</p>
                    <h1>
                      {this.state.increaseDepDisposaList ? (this.state.increaseDepDisposaList.CumulativeWaste ? this.state.increaseDepDisposaList.CumulativeWaste : 0): 0}
                    </h1>
                  </li>
                  <li>
                    <p>近7天新增工单</p>
                    {/* <span>(增加)</span> */}
                    <h1>
                      {this.state.increaseDepDisposaList ? (this.state.increaseDepDisposaList.NewWorkInSevenDay ? this.state.increaseDepDisposaList.NewWorkInSevenDay : 0): 0}
                    </h1>
                  </li>
                  <li>
                    <p>近7天结案工单</p>
                    {/* <span>(减少)</span> */}
                    <h1>
                      {this.state.increaseDepDisposaList ? (this.state.increaseDepDisposaList.CloseWorkInSevenDay ? this.state.increaseDepDisposaList.CloseWorkInSevenDay : 0): 0}
                    </h1>
                  </li>
                </ul>
              </div>
              <Tabs defaultActiveKey="1" onChange={this.callbackChart.bind(this)} type="card">
                <TabPane tab="累计待处理工单" key="1" />
                <TabPane tab="工单增减趋势" key="2" />
              </Tabs>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{marginTop:10,padding:10}}>
                <Col md={4} sm={8}>
                  <FormItem label="">
                    {getFieldDecorator('dayDepDisposal',{
                      initialValue:7
                    })(
                      <Select style={{width:'100%'}} onChange={this.handleChangeDepDisposal}>
                        <Option value={7}>最近7天</Option>
                        <Option value={15}>最近15天</Option>
                        <Option value={30}>最近30天</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col md={6} sm={8}>
                  <FormItem label="">
                    {getFieldDecorator('range',{
                      initialValue:range
                    })(
                      <RangePicker style={{width:'100%'}} allowClear={false} disabledDate={this.disabledDepDisDate} onChange={this.handleDepDisDateChange}  />
                    )}
                  </FormItem>
                </Col>
                <Col md={6} sm={8}>
                  <FormItem label="">
                    {getFieldDecorator('community')(
                      <Select placeholder="请选择" allowClear style={{width:'100%'}} onChange={this.selectDepDisDateChange.bind(this)}>
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
                <Col md={8} sm={8} style={{ textAlign: 'right',padding: '4px 0' }}>
                  <Button style={{ marginRight:0, marginLeft:16 }} type='primary' onClick={this.printDeparment.bind(this)}>
                    打印
                  </Button>
                </Col>
              </Row>
              <div id='myChart' style={{width:'100%',height:500}} />
            </TabPane>
            <TabPane tab="领导交办" key="2" forceRender>
              <div>
                <div className={styles.statistics}>
                  <div className={styles.first}>
                    关键指标（本页数据根据实时数据计算。）
                  </div>
                  <ul className={styles.two}>
                    <li>
                      <p>累计待处理工单</p>
                      <h1>
                        {this.state.increaseLeaderList ? (this.state.increaseLeaderList.CumulativePending ? this.state.increaseLeaderList.CumulativePending : 0): 0}
                      </h1>
                    </li>
                    <li>
                      <p>累计已处理工单</p>
                      <h1>
                        {this.state.increaseLeaderList ? (this.state.increaseLeaderList.CumulativeProcessed ? this.state.increaseLeaderList.CumulativeProcessed : 0): 0}
                      </h1>
                    </li>
                    <li>
                      <p>累计已结案工单</p>
                      <h1>
                        {this.state.increaseLeaderList ? (this.state.increaseLeaderList.CumulativeClosed ? this.state.increaseLeaderList.CumulativeClosed : 0): 0}
                      </h1>
                    </li>
                    <li>
                      <p>累计已废案工单</p>
                      <h1>
                        {this.state.increaseLeaderList ? (this.state.increaseLeaderList.CumulativeWaste ? this.state.increaseLeaderList.CumulativeWaste : 0): 0}
                      </h1>
                    </li>
                    <li>
                      <p>近7天新增工单</p>
                      {/* <span>(增加)</span> */}
                      <h1>
                        {this.state.increaseLeaderList ? (this.state.increaseLeaderList.NewWorkInSevenDay ? this.state.increaseLeaderList.NewWorkInSevenDay : 0): 0}
                      </h1>
                    </li>
                    <li>
                      <p>近7天结案工单</p>
                      {/* <span>(减少)</span> */}
                      <h1>
                        {this.state.increaseLeaderList ? (this.state.increaseLeaderList.CloseWorkInSevenDay ? this.state.increaseLeaderList.CloseWorkInSevenDay : 0): 0}
                      </h1>
                    </li>
                  </ul>
                </div>
                <Tabs defaultActiveKey="1" onChange={this.callbackChartLeader.bind(this)} type="card">
                  <TabPane tab="累计待处理工单" key="1" />
                  <TabPane tab="工单增减趋势" key="2" />
                </Tabs>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{marginTop:10,padding:10}}>
                  <Col md={4} sm={8}>
                    <FormItem label="">
                      {getFieldDecorator('dayLeader',{
                        initialValue:7
                      })(
                        <Select style={{width:'100%'}} onChange={this.handleChangeLeader}>
                          <Option value={7}>最近7天</Option>
                          <Option value={15}>最近15天</Option>
                          <Option value={30}>最近30天</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col md={6} sm={8}>
                    <FormItem label="">
                      {getFieldDecorator('rangeLeader',{
                        initialValue:rangeLeader,
                      })(
                        <RangePicker style={{width:'100%'}} allowClear={false} disabledDate={this.disabledLeaderDate} onChange={this.handleLeaderDateChange}  />
                      )}
                    </FormItem>
                  </Col>
                  <Col md={6} sm={8}>
                    <FormItem label="">
                      {getFieldDecorator('leaderCommunity')(
                        <Select placeholder="请选择" allowClear style={{width:'100%'}} onChange={this.leaderCommunityChange.bind(this)}>
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
                  <Col md={8} sm={8} style={{ textAlign: 'right',padding: '4px 0' }}>
                    <Button style={{ marginRight:0, marginLeft:16 }} type='primary' onClick={this.printDeparment.bind(this)}>
                      打印
                    </Button>
                  </Col>
                </Row>
                <div id='myChartLeader' style={{width:'100%',height:500}} />
              </div>
            </TabPane>
            <TabPane tab="智能生成" key="3" forceRender>
              <div>
                <div className={styles.statistics}>
                  <div className={styles.first}>
                    关键指标（本页数据根据实时数据计算。）
                  </div>
                  <ul className={styles.two}>
                    <li>
                      <p>累计待处理工单</p>
                      <h1>
                        {this.state.increaseIntList ? (this.state.increaseIntList.CumulativePending ? this.state.increaseIntList.CumulativePending : 0): 0}
                      </h1>
                    </li>
                    <li>
                      <p>累计已处理工单</p>
                      <h1>
                        {this.state.increaseIntList ? (this.state.increaseIntList.CumulativeProcessed ? this.state.increaseIntList.CumulativeProcessed : 0): 0}
                      </h1>
                    </li>
                    <li>
                      <p>累计已结案工单</p>
                      <h1>
                        {this.state.increaseIntList ? (this.state.increaseIntList.CumulativeClosed ? this.state.increaseIntList.CumulativeClosed : 0): 0}
                      </h1>
                    </li>
                    <li>
                      <p>累计已废案工单</p>
                      <h1>
                        {this.state.increaseIntList ? (this.state.increaseIntList.CumulativeWaste ? this.state.increaseIntList.CumulativeWaste : 0): 0}
                      </h1>
                    </li>
                    <li>
                      <p>近7天新增工单</p>
                      {/* <span>(增加)</span> */}
                      <h1>
                        {this.state.increaseIntList ? (this.state.increaseIntList.NewWorkInSevenDay ? this.state.increaseIntList.NewWorkInSevenDay : 0): 0}
                      </h1>
                    </li>
                    <li>
                      <p>近7天结案工单</p>
                      {/* <span>(减少)</span> */}
                      <h1>
                        {this.state.increaseIntList ? (this.state.increaseIntList.CloseWorkInSevenDay ? this.state.increaseIntList.CloseWorkInSevenDay : 0): 0}
                      </h1>
                    </li>
                  </ul>
                </div>
                <Tabs defaultActiveKey="1" onChange={this.callbackChartInt.bind(this)} type="card">
                  <TabPane tab="累计待处理工单" key="1" />
                  <TabPane tab="工单增减趋势" key="2" />
                </Tabs>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{marginTop:10,padding:10}}>
                  <Col md={4} sm={8}>
                    <FormItem label="">
                      {getFieldDecorator('dayLeader',{
                        initialValue:7
                      })(
                        <Select style={{width:'100%'}} onChange={this.handleChangeInt}>
                          <Option value={7}>最近7天</Option>
                          <Option value={15}>最近15天</Option>
                          <Option value={30}>最近30天</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col md={6} sm={8}>
                    <FormItem label="">
                      {getFieldDecorator('rangeInt',{
                        initialValue:rangeInt,
                      })(
                        <RangePicker style={{width:'100%'}} allowClear={false} disabledDate={this.disabledIntDate} onChange={this.handleIntDateChange}  />
                      )}
                    </FormItem>
                  </Col>
                  <Col md={6} sm={8}>
                    <FormItem label="">
                      {getFieldDecorator('intCommunity')(
                        <Select placeholder="请选择" allowClear style={{width:'100%'}} onChange={this.IntCommunityChange.bind(this)}>
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
                  <Col md={8} sm={8} style={{ textAlign: 'right',padding: '4px 0' }}>
                    <Button style={{ marginRight:0, marginLeft:16 }} type='primary' onClick={this.printDeparment.bind(this)}>
                      打印
                    </Button>
                  </Col>
                </Row>
                <div id='myChartInt' style={{width:'100%',height:500}} />
              </div>
            </TabPane>
          </Tabs>
        </div>
      </div>
    )
  }
}
export default Home;
