/* eslint-disable class-methods-use-this */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable no-use-before-define */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/sort-comp */
/* eslint-disable no-shadow */
/* eslint-disable no-plusplus */
/* eslint-disable react/no-unused-state */
/* eslint-disable no-unused-vars */
import React, { PureComponent } from 'react';
import { Tabs, Row, Col, Select, DatePicker, Button, Form, Breadcrumb } from 'antd';
import echarts from 'echarts'
import { connect } from 'dva/index';
import moment from 'moment/moment';
import styles from './style.less'
import range from './range'
import TableList from '../List/TableList';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;
const FormItem = Form.Item;
@connect(({ increase, select }) => ({
  increase, select
}))
@Form.create()
class Home extends PureComponent {
  state = {
    key: '1',
    chartKey: '1',

    dayDepDealtDisabled: 7,
    dayDepDisposal: 7,
    range: range(7),
    communityDepDealt: '',
    bigTimeDepDealt: '',
    endTimeDepDealt: '',
    increaseDepDisposaList: {},
    increaseDepDisposaListEchats: [],// 累计待处理
    increaseDepDisposaListEchatsToBeClosed: [],// 累计已处理
    increaseDepDisposaListEchatsHasBeenClosed: [],// 累计已结案
    increaseIntListNewWorkNum: [],// 工单增加-新增
    increaseIntListHadWeek: [],// 工单减少-已结案
    CloseWorkNumArr: [],// 部门派发 案件减少
    depDate: [],// 部门派发 时间
    depDateTwo: [],// 回归当前默认7天时间

    increaseLeaderList: {},
    increaseLeaderListEchats: [],// 累计待处理
    increaseLeaderListEchatsToBeClosed: [],// 累计已处理
    increaseLeaderListEchatsHasBeenClosed: [],// 累计已结案
    increaseLeaderListAdd: [],// 工单增加-新增,
    increaseLeaderListReduce: [],// 工单减少-已结案,
    CloseWorkNumArrLeader: [],// 领导交办 案件减少
    LeaderDate: [],// 领导交办 时间
    LeaderDateTwo: [],// 回归当前默认7天时间

    increaseIntList: {},
    increaseIntListEchats: [],// 累计待处理
    increaseIntListEchatsToBeClosed: [],// 累计已处理
    increaseIntListEchatsHasBeenClosed: [],// 累计已结案
    increaseIntListAdd: [],
    increaseIntListReduce: [],
    CloseWorkNumArrInt: [],// 智能生成 案件减少
    intDate: [],// 智能生成 时间
    intDateTwo: []// 回归当前默认7天时间
  };

  componentDidMount() {
    const date = moment().subtract(7, 'days').calendar();
    const reg = new RegExp('/', 'g');
    const dates = date.replace(reg, '-');
    this.setState({
      bigTimeDepDealt: dates,
      endTimeDepDealt: moment().format().substring(0, 10),
    })
    new Promise(resolve => {
      this.props.dispatch({
        type: 'increase/increaseDepDisposalFetch',
        payload: {
          resolve,
        },
      })
    }).then((res) => {
      const CloseWorkNumArr = [];
      const depDate = [];
      if (res.data !== undefined) {
        for (let i = 0; i < res.data.length; i++) {
          const a = res.data.toBeProcessed[i];
          CloseWorkNumArr.push(-(a));
        }
      }
      this.setState({
        increaseDepDisposaList: res.data,
        CloseWorkNumArr,
      });

      new Promise(resolve => {
        this.props.dispatch({
          type: 'increase/increaseLeaderFetch',
          payload: {
            resolve,
          },
        })
      }).then((resLeader) => {
        const CloseWorkNumArrLeader = [];
        const LeaderDate = [];
        this.setState({
          increaseLeaderList: resLeader.data,
          CloseWorkNumArrLeader,
          LeaderDate,
          bigTimeLeader: dates,
          endTimeLeader: moment().format().substring(0, 10),
        })
      });

      new Promise(resolve => {
        this.props.dispatch({
          type: 'increase/increaseIntFetch',
          payload: {
            resolve,
          },
        })
      }).then((resInt) => {
        const CloseWorkNumArrInt = [];
        const intDate = [];
        this.setState({
          increaseIntList: resInt.data,
          CloseWorkNumArrInt,
          intDate,
          bigTimeInt: dates,
          endTimeInt: moment().format().substring(0, 10),
        })
      });
      // 社区
      this.props.dispatch({
        type: 'select/community',
      });

      // 部门派发工单数量趋势
      new Promise(resolve => {
        this.props.dispatch({
          type: 'increase/quantitativetrends',
          payload: {
            startTime: dates,
            endTime: moment().format().substring(0, 10),
            resolve,
          },
        })
      }).then(res => {
        const depDate = [];
        const increaseDepDisposaListEchats = [];
        const increaseDepDisposaListEchatsToBeClosed = [];
        const increaseDepDisposaListEchatsHasBeenClosed = [];
        if (res.data) {
          for (let i = 0; i < res.data.length; i++) {
            depDate.push(res.data[i].typeTime.substring(0, 10));
            increaseDepDisposaListEchats.push(res.data[i].toBeProcessed);
            increaseDepDisposaListEchatsToBeClosed.push(res.data[i].toBeClosed)
            increaseDepDisposaListEchatsHasBeenClosed.push(res.data[i].hasBeenClosed)
          };
        }
        if (res) {
          this.setState({
            increaseDepDisposaListEchats,
            increaseDepDisposaListEchatsToBeClosed,
            increaseDepDisposaListEchatsHasBeenClosed,
            depDate,
            depDateTwo: depDate,
          })
        }
      });

      // 部门派发工单增减趋势
      new Promise(resolve => {
        this.props.dispatch({
          type: 'increase/increaseAndDecreaseTrend',
          payload: {
            startTime: dates,
            endTime: moment().format().substring(0, 10),
            resolve,
          },
        })
      }).then(res => {
        const depDate = [];
        const increaseIntListNewWorkNum = [];
        const increaseIntListHadWeek = [];
        if (res.data) {
          for (let i = 0; i < res.data.length; i++) {
            increaseIntListNewWorkNum.push(res.data[i].newWorkNum);
            increaseIntListHadWeek.push(res.data[i].hadWeek);
            depDate.push(res.data[i].typeTime.substring(0, 10));
          }
        }
        if (res) {
          this.setState({
            increaseIntListNewWorkNum,
            increaseIntListHadWeek,
            depDate,
            depDateTwo: depDate,
          })
        }
      })
      // 领导交办工单增减趋势
      new Promise(resolve => {
        this.props.dispatch({
          type: 'increase/leadershipLncreaseAndDecreaseTrend',
          payload: {
            startTime: dates,
            endTime: moment().format().substring(0, 10),
            resolve,
          },
        })
      }).then(res => {
        const LeaderDate = [];// 领导交办 时间
        const increaseLeaderListAdd = [];// 工单增加-新增,
        const increaseLeaderListReduce = [];// 工单减少-已结案,
        if (res.data) {
          for (let i = 0; i < res.data.length; i++) {
            increaseLeaderListAdd.push(res.data[i].newWorkNum); // 新增
            increaseLeaderListReduce.push(res.data[i].hadWeek); // 结案
            LeaderDate.push(res.data[i].typeTime.substring(0, 10));
          }
        }
        if (res) {
          this.setState({
            increaseLeaderListAdd, // 新增
            increaseLeaderListReduce, // 结案
            LeaderDate,
            LeaderDateTwo: LeaderDate
          })
        }
      })
      // 智能生成工单增减趋势
      new Promise(resolve => {
        this.props.dispatch({
          type: 'increase/intelligentGenerationIncreaseOrDecrease',
          payload: {
            startTime: dates,
            endTime: moment().format().substring(0, 10),
            resolve,
          },
        })
      }).then(res => {
        const increaseIntListAdd = [];
        const increaseIntListReduce = [];
        const intDate = [];// 智能生成 时间
        if (res.data) {
          for (let i = 0; i < res.data.length; i++) {
            increaseIntListAdd.push(res.data[i].newWorkNum); // 新增
            increaseIntListReduce.push(res.data[i].hadWeek); // 结案
            intDate.push(res.data[i].typeTime.substring(0, 10));
          }
        }
        if (res) {
          this.setState({
            increaseIntListAdd, // 新增
            increaseIntListReduce, // 结案
            intDate,
            intDateTwo: intDate
          })
        }
      })

      // 领导交办工单数量趋势
      new Promise(resolve => {
        this.props.dispatch({
          type: 'increase/leadershipQuantityTrend',
          payload: {
            startTime: dates,
            endTime: moment().format().substring(0, 10),
            resolve,
          }
        })
      }).then(res => {
        const increaseLeaderListEchats = [];// 累计待处理
        const increaseLeaderListEchatsToBeClosed = [];// 累计已处理
        const increaseLeaderListEchatsHasBeenClosed = [];// 累计已结案
        const LeaderDate = [];// 领导交办 时间
        if (res.data) {
          for (let i = 0; i < res.data.length; i++) {
            LeaderDate.push(res.data[i].typeTime.substring(0, 10));
            increaseLeaderListEchats.push(res.data[i].toBeProcessed);
            increaseLeaderListEchatsToBeClosed.push(res.data[i].toBeClosed)
            increaseLeaderListEchatsHasBeenClosed.push(res.data[i].hasBeenClosed)
          };
        }
        if (res) {
          this.setState({
            increaseLeaderListEchats,
            increaseLeaderListEchatsToBeClosed,
            increaseLeaderListEchatsHasBeenClosed,
            LeaderDate,
            LeaderDateTwo: LeaderDate
          })
        }
      })
      // 智能生成工单数量趋势
      new Promise(resolve => {
        this.props.dispatch({
          type: 'increase/trendOfIntelligentGeneration',
          payload: {
            resolve,
            startTime: dates,
            endTime: moment().format().substring(0, 10),
          }
        })
      }).then(res => {
        const increaseIntListEchats = [];// 累计待处理
        const increaseIntListEchatsToBeClosed = [];// 累计已处理
        const increaseIntListEchatsHasBeenClosed = [];// 累计已结案
        const intDate = [];// 智能生成 时间
        if (res.data) {
          for (let i = 0; i < res.data.length; i++) {
            intDate.push(res.data[i].typeTime.substring(0, 10));
            increaseIntListEchats.push(res.data[i].toBeProcessed);
            increaseIntListEchatsToBeClosed.push(res.data[i].toBeClosed)
            increaseIntListEchatsHasBeenClosed.push(res.data[i].hasBeenClosed)
          };
        }
        if (res) {
          this.setState({
            increaseIntListEchats,
            increaseIntListEchatsToBeClosed,
            increaseIntListEchatsHasBeenClosed,
            intDate,
            intDateTwo: intDate
          })
        }
      })
    });
  }

  // 部门交办
  handleChangeDepDisposal = (dayDepDisposal) => {
    const { form } = this.props;
    const arr = range(dayDepDisposal);
    this.setState({
      range: arr,
      dayDepDealtDisabled: dayDepDisposal,
      bigTimeDepDealt: moment(arr[0]).format('YYYY-MM-DD'),
      endTimeDepDealt: moment(arr[1]).format('YYYY-MM-DD'),
    });
    if (this.state.key === '1' && this.state.chartKey === '1') {
      new Promise(resolve => {
        this.props.dispatch({
          type: 'increase/quantitativetrends',
          payload: {
            resolve,
            startTime: moment(arr[0]).format('YYYY-MM-DD'),
            endTime: moment(arr[1]).format('YYYY-MM-DD'),
          }
        });
      }).then((res) => {
        const depDate = [];
        const increaseDepDisposaListEchats = [];
        const increaseDepDisposaListEchatsToBeClosed = [];
        const increaseDepDisposaListEchatsHasBeenClosed = [];
        for (let i = 0; i < res.data.length; i++) {
          depDate.push(res.data[i].typeTime.substring(0, 10));
          increaseDepDisposaListEchats.push(res.data[i].toBeProcessed);
          increaseDepDisposaListEchatsToBeClosed.push(res.data[i].toBeClosed)
          increaseDepDisposaListEchatsHasBeenClosed.push(res.data[i].hasBeenClosed)
        }
        if (res) {
          this.setState({
            increaseDepDisposaListEchats,
            increaseDepDisposaListEchatsToBeClosed,
            increaseDepDisposaListEchatsHasBeenClosed,
            depDate
          })
        }
      });
    }
    if (this.state.key === '1' && this.state.chartKey === '2') {
      new Promise(resolve => {
        this.props.dispatch({
          type: 'increase/increaseAndDecreaseTrend',
          payload: {
            resolve,
            startTime: moment(arr[0]).format('YYYY-MM-DD'),
            endTime: moment(arr[1]).format('YYYY-MM-DD'),
          }
        });
      }).then((res) => {
        const depDate = [];
        const increaseIntListNewWorkNum = [];
        const increaseIntListHadWeek = [];
        for (let i = 0; i < res.data.length; i++) {
          increaseIntListNewWorkNum.push(res.data[i].newWorkNum);
          increaseIntListHadWeek.push(res.data[i].hadWeek);
          depDate.push(res.data[i].typeTime.substring(0, 10));
        }
        if (res) {
          this.setState({
            increaseIntListNewWorkNum,
            increaseIntListHadWeek,
            depDate,
          })
        }
      });
    }
    if (this.state.key === '2' && this.state.chartKey === '1') {
      new Promise(resolve => {
        this.props.dispatch({
          type: 'increase/leadershipQuantityTrend',
          payload: {
            resolve,
            startTime: moment(arr[0]).format('YYYY-MM-DD'),
            endTime: moment(arr[1]).format('YYYY-MM-DD'),
          },
        })
      }).then((res) => {
        const increaseLeaderListEchats = [];// 累计待处理
        const increaseLeaderListEchatsToBeClosed = [];// 累计已处理
        const increaseLeaderListEchatsHasBeenClosed = [];// 累计已结案
        const LeaderDate = [];// 领导交办 时间
        for (let i = 0; i < res.data.length; i++) {
          LeaderDate.push(res.data[i].typeTime.substring(0, 10));
          increaseLeaderListEchats.push(res.data[i].toBeProcessed);
          increaseLeaderListEchatsToBeClosed.push(res.data[i].toBeClosed)
          increaseLeaderListEchatsHasBeenClosed.push(res.data[i].hasBeenClosed)
        };
        if (res) {
          this.setState({
            increaseLeaderListEchats,
            increaseLeaderListEchatsToBeClosed,
            increaseLeaderListEchatsHasBeenClosed,
            LeaderDate,
          })
        }
      });
    }
    if (this.state.key === '2' && this.state.chartKey === '2') {
      new Promise(resolve => {
        this.props.dispatch({
          type: 'increase/leadershipLncreaseAndDecreaseTrend',
          payload: {
            resolve,
            startTime: moment(arr[0]).format('YYYY-MM-DD'),
            endTime: moment(arr[1]).format('YYYY-MM-DD'),
          }
        });
      }).then((res) => {
        const LeaderDate = [];// 领导交办 时间
        const increaseLeaderListAdd = [];// 工单增加-新增,
        const increaseLeaderListReduce = [];// 工单减少-已结案,
        for (let i = 0; i < res.data.length; i++) {
          increaseLeaderListAdd.push(res.data[i].newWorkNum); // 新增
          increaseLeaderListReduce.push(res.data[i].hadWeek); // 结案
          LeaderDate.push(res.data[i].typeTime.substring(0, 10));
        }
        if (res) {
          this.setState({
            increaseLeaderListAdd, // 新增
            increaseLeaderListReduce, // 结案
            LeaderDate
          })
        }
      });
    }
    if (this.state.key === '3' && this.state.chartKey === '1') {
      new Promise(resolve => {
        this.props.dispatch({
          type: 'increase/trendOfIntelligentGeneration',
          payload: {
            resolve,
            startTime: moment(arr[0]).format('YYYY-MM-DD'),
            endTime: moment(arr[1]).format('YYYY-MM-DD'),
          },
        })
      }).then((res) => {
        const increaseIntListEchats = [];// 累计待处理
        const increaseIntListEchatsToBeClosed = [];// 累计已处理
        const increaseIntListEchatsHasBeenClosed = [];// 累计已结案
        const intDate = [];// 智能生成 时间
        for (let i = 0; i < res.data.length; i++) {
          intDate.push(res.data[i].typeTime.substring(0, 10));
          increaseIntListEchats.push(res.data[i].toBeProcessed);
          increaseIntListEchatsToBeClosed.push(res.data[i].toBeClosed)
          increaseIntListEchatsHasBeenClosed.push(res.data[i].hasBeenClosed)
        };
        if (res) {
          this.setState({
            increaseIntListEchats,
            increaseIntListEchatsToBeClosed,
            increaseIntListEchatsHasBeenClosed,
            intDate,
          })
        }
      });
    }
    if (this.state.key === '3' && this.state.chartKey === '2') {
      new Promise(resolve => {
        this.props.dispatch({
          type: 'increase/intelligentGenerationIncreaseOrDecrease',
          payload: {
            resolve,
            startTime: moment(arr[0]).format('YYYY-MM-DD'),
            endTime: moment(arr[1]).format('YYYY-MM-DD'),
          }
        });
      }).then((res) => {
        const increaseIntListAdd = [];
        const increaseIntListReduce = [];
        const intDate = [];// 智能生成 时间
        for (let i = 0; i < res.data.length; i++) {
          increaseIntListAdd.push(res.data[i].newWorkNum); // 新增
          increaseIntListReduce.push(res.data[i].hadWeek); // 结案
          intDate.push(res.data[i].typeTime.substring(0, 10));
        }
        if (res) {
          this.setState({
            increaseIntListAdd, // 新增
            increaseIntListReduce, // 结案
            intDate
          })
        }
      });
    }

    form.setFieldsValue({ 'range': arr })
  };

  disabledDepDisDate = current => current && current > moment().endOf('day') || current < moment().subtract(this.state.dayDepDealtDisabled + 1, 'day');

  handleDepDisDateChange = (dayDepDisposal) => {
    const startTime = moment(dayDepDisposal[0]).format('YYYY-MM-DD');
    const endTime = moment(dayDepDisposal[1]).format('YYYY-MM-DD');
    this.setState({
      bigTimeDepDealt: moment(dayDepDisposal[0]).format('YYYY-MM-DD'),
      endTimeDepDealt: moment(dayDepDisposal[1]).format('YYYY-MM-DD'),
    });
    if (this.state.key === '1' && this.state.chartKey === '1') {
      new Promise(resolve => {
        this.props.dispatch({
          type: 'increase/quantitativetrends',
          payload: {
            startTime,
            endTime,
            resolve,
          },
        })
      }).then((res) => {
        const depDate = [];
        const increaseDepDisposaListEchats = [];
        const increaseDepDisposaListEchatsToBeClosed = [];
        const increaseDepDisposaListEchatsHasBeenClosed = [];
        for (let i = 0; i < res.data.length; i++) {
          depDate.push(res.data[i].typeTime.substring(0, 10));
          increaseDepDisposaListEchats.push(res.data[i].toBeProcessed);
          increaseDepDisposaListEchatsToBeClosed.push(res.data[i].toBeClosed)
          increaseDepDisposaListEchatsHasBeenClosed.push(res.data[i].hasBeenClosed)
        };
        if (res) {
          this.setState({
            increaseDepDisposaListEchats,
            increaseDepDisposaListEchatsToBeClosed,
            increaseDepDisposaListEchatsHasBeenClosed,
            depDate,
          })
        }
      });
    }
    if (this.state.key === '1' && this.state.chartKey === '2') {
      new Promise(resolve => {
        this.props.dispatch({
          type: 'increase/increaseAndDecreaseTrend',
          payload: {
            startTime,
            endTime,
            resolve,
          },
        })
      }).then(res => {
        const depDate = [];
        const increaseIntListNewWorkNum = [];
        const increaseIntListHadWeek = [];
        for (let i = 0; i < res.data.length; i++) {
          increaseIntListNewWorkNum.push(res.data[i].newWorkNum);
          increaseIntListHadWeek.push(res.data[i].hadWeek);
          depDate.push(res.data[i].typeTime.substring(0, 10));
        }
        if (res) {
          this.setState({
            increaseIntListNewWorkNum,
            increaseIntListHadWeek,
            depDate
          })
        }
      })
    }
    if (this.state.key === '2' && this.state.chartKey === '1') {
      new Promise(resolve => {
        this.props.dispatch({
          type: 'increase/leadershipQuantityTrend',
          payload: {
            startTime,
            endTime,
            resolve,
          },
        })
      }).then((res) => {
        const increaseLeaderListEchats = [];// 累计待处理
        const increaseLeaderListEchatsToBeClosed = [];// 累计已处理
        const increaseLeaderListEchatsHasBeenClosed = [];// 累计已结案
        const LeaderDate = [];// 领导交办 时间
        for (let i = 0; i < res.data.length; i++) {
          LeaderDate.push(res.data[i].typeTime.substring(0, 10));
          increaseLeaderListEchats.push(res.data[i].toBeProcessed);
          increaseLeaderListEchatsToBeClosed.push(res.data[i].toBeClosed)
          increaseLeaderListEchatsHasBeenClosed.push(res.data[i].hasBeenClosed)
        };
        if (res) {
          this.setState({
            increaseLeaderListEchats,
            increaseLeaderListEchatsToBeClosed,
            increaseLeaderListEchatsHasBeenClosed,
            LeaderDate,
          })
        }
      });
    }
    if (this.state.key === '2' && this.state.chartKey === '2') {
      new Promise(resolve => {
        this.props.dispatch({
          type: 'increase/leadershipLncreaseAndDecreaseTrend',
          payload: {
            startTime,
            endTime,
            resolve,
          },
        })
      }).then(res => {
        const LeaderDate = [];// 领导交办 时间
        const increaseLeaderListAdd = [];// 工单增加-新增,
        const increaseLeaderListReduce = [];// 工单减少-已结案,
        for (let i = 0; i < res.data.length; i++) {
          increaseLeaderListAdd.push(res.data[i].newWorkNum); // 新增
          increaseLeaderListReduce.push(res.data[i].hadWeek); // 结案
          LeaderDate.push(res.data[i].typeTime.substring(0, 10));
        }
        if (res) {
          this.setState({
            increaseLeaderListAdd, // 新增
            increaseLeaderListReduce, // 结案
            LeaderDate
          })
        }
      });
    };
    if (this.state.key === '3' && this.state.chartKey === '1') {
      new Promise(resolve => {
        this.props.dispatch({
          type: 'increase/trendOfIntelligentGeneration',
          payload: {
            startTime,
            endTime,
            resolve,
          },
        })
      }).then((res) => {
        const increaseIntListEchats = [];// 累计待处理
        const increaseIntListEchatsToBeClosed = [];// 累计已处理
        const increaseIntListEchatsHasBeenClosed = [];// 累计已结案
        const intDate = [];// 智能生成 时间
        for (let i = 0; i < res.data.length; i++) {
          intDate.push(res.data[i].typeTime.substring(0, 10));
          increaseIntListEchats.push(res.data[i].toBeProcessed);
          increaseIntListEchatsToBeClosed.push(res.data[i].toBeClosed)
          increaseIntListEchatsHasBeenClosed.push(res.data[i].hasBeenClosed)
        };
        if (res) {
          this.setState({
            increaseIntListEchats,
            increaseIntListEchatsToBeClosed,
            increaseIntListEchatsHasBeenClosed,
            intDate,
          })
        }
      });
    };
    if (this.state.key === '3' && this.state.chartKey === '2') {
      new Promise(resolve => {
        this.props.dispatch({
          type: 'increase/intelligentGenerationIncreaseOrDecrease',
          payload: {
            startTime,
            endTime,
            resolve,
          },
        })
      }).then(res => {
        const increaseIntListAdd = [];
        const increaseIntListReduce = [];
        const intDate = [];// 智能生成 时间
        for (let i = 0; i < res.data.length; i++) {
          increaseIntListAdd.push(res.data[i].newWorkNum); // 新增
          increaseIntListReduce.push(res.data[i].hadWeek); // 结案
          intDate.push(res.data[i].typeTime.substring(0, 10));
        }
        if (res) {
          this.setState({
            increaseIntListAdd, // 新增
            increaseIntListReduce, // 结案
            intDate
          })
        }
      });
    }

  };

  selectDepDisDateChange(val) {
    this.setState({
      communityDepDealt: val,
    });
    if (this.state.key === '1' && this.state.chartKey === '1') {
      new Promise(resolve => {
        this.props.dispatch({
          type: 'increase/quantitativetrends',
          payload: {
            resolve,
            startTime: this.state.bigTimeDepDealt,
            endTime: this.state.endTimeDepDealt,
            community: val,
          },
        })
      }).then((res) => {
        const depDate = [];
        const increaseDepDisposaListEchats = [];
        const increaseDepDisposaListEchatsToBeClosed = [];
        const increaseDepDisposaListEchatsHasBeenClosed = [];
        for (let i = 0; i < res.data.length; i++) {
          depDate.push(res.data[i].typeTime.substring(0, 10));
          increaseDepDisposaListEchats.push(res.data[i].toBeProcessed);
          increaseDepDisposaListEchatsToBeClosed.push(res.data[i].toBeClosed)
          increaseDepDisposaListEchatsHasBeenClosed.push(res.data[i].hasBeenClosed)
        }
        if (res) {
          this.setState({
            increaseDepDisposaListEchats,
            increaseDepDisposaListEchatsToBeClosed,
            increaseDepDisposaListEchatsHasBeenClosed,
            depDate,
          })
        }
      });
    }
    if (this.state.key === '1' && this.state.chartKey === '2') {
      new Promise(resolve => {
        this.props.dispatch({
          type: 'increase/increaseAndDecreaseTrend',
          payload: {
            resolve,
            startTime: this.state.bigTimeDepDealt,
            endTime: this.state.endTimeDepDealt,
            community: val,
          },
        })
      }).then((res) => {
        const depDate = [];
        const increaseIntListNewWorkNum = [];
        const increaseIntListHadWeek = [];
        for (let i = 0; i < res.data.length; i++) {
          increaseIntListNewWorkNum.push(res.data[i].newWorkNum);
          increaseIntListHadWeek.push(res.data[i].hadWeek);
          depDate.push(res.data[i].typeTime.substring(0, 10));
        }
        if (res) {
          this.setState({
            increaseIntListNewWorkNum,
            increaseIntListHadWeek,
            depDate
          })
        }
      });
    }

    if (this.state.key === '2' && this.state.chartKey === '1') {
      new Promise(resolve => {
        this.props.dispatch({
          type: 'increase/leadershipQuantityTrend',
          payload: {
            startTime: this.state.bigTimeDepDealt,
            endTime: this.state.endTimeDepDealt,
            resolve,
            community: val
          }
        })
      }).then(res => {
        const increaseLeaderListEchats = [];// 累计待处理
        const increaseLeaderListEchatsToBeClosed = [];// 累计已处理
        const increaseLeaderListEchatsHasBeenClosed = [];// 累计已结案
        const LeaderDate = [];// 领导交办 时间
        for (let i = 0; i < res.data.length; i++) {
          LeaderDate.push(res.data[i].typeTime.substring(0, 10));
          increaseLeaderListEchats.push(res.data[i].toBeProcessed);
          increaseLeaderListEchatsToBeClosed.push(res.data[i].toBeClosed)
          increaseLeaderListEchatsHasBeenClosed.push(res.data[i].hasBeenClosed)
        };
        if (res) {
          this.setState({
            increaseLeaderListEchats,
            increaseLeaderListEchatsToBeClosed,
            increaseLeaderListEchatsHasBeenClosed,
            LeaderDate,
          })
        }
      })
    }
    if (this.state.key === '2' && this.state.chartKey === '2') {
      new Promise(resolve => {
        this.props.dispatch({
          type: 'increase/leadershipLncreaseAndDecreaseTrend',
          payload: {
            startTime: this.state.bigTimeDepDealt,
            endTime: this.state.endTimeDepDealt,
            resolve,
            community: val
          },
        })
      }).then(res => {
        const LeaderDate = [];// 领导交办 时间
        const increaseLeaderListAdd = [];// 工单增加-新增,
        const increaseLeaderListReduce = [];// 工单减少-已结案,
        for (let i = 0; i < res.data.length; i++) {
          increaseLeaderListAdd.push(res.data[i].newWorkNum); // 新增
          increaseLeaderListReduce.push(res.data[i].hadWeek); // 结案
          LeaderDate.push(res.data[i].typeTime.substring(0, 10));
        }
        if (res) {
          this.setState({
            increaseLeaderListAdd, // 新增
            increaseLeaderListReduce, // 结案
            LeaderDate
          })
        }
      })
    }
    if (this.state.key === '3' && this.state.chartKey === '1') {
      new Promise(resolve => {
        this.props.dispatch({
          type: 'increase/trendOfIntelligentGeneration',
          payload: {
            startTime: this.state.bigTimeDepDealt,
            endTime: this.state.endTimeDepDealt,
            resolve,
            community: val
          }
        })
      }).then(res => {
        const increaseIntListEchats = [];// 累计待处理
        const increaseIntListEchatsToBeClosed = [];// 累计已处理
        const increaseIntListEchatsHasBeenClosed = [];// 累计已结案
        const intDate = [];// 智能生成 时间
        for (let i = 0; i < res.data.length; i++) {
          intDate.push(res.data[i].typeTime.substring(0, 10));
          increaseIntListEchats.push(res.data[i].toBeProcessed);
          increaseIntListEchatsToBeClosed.push(res.data[i].toBeClosed)
          increaseIntListEchatsHasBeenClosed.push(res.data[i].hasBeenClosed)
        };
        if (res) {
          this.setState({
            increaseIntListEchats,
            increaseIntListEchatsToBeClosed,
            increaseIntListEchatsHasBeenClosed,
            intDate,
          })
        }
      })
    }
    if (this.state.key === '3' && this.state.chartKey === '2') {
      new Promise(resolve => {
        this.props.dispatch({
          type: 'increase/intelligentGenerationIncreaseOrDecrease',
          payload: {
            startTime: this.state.bigTimeDepDealt,
            endTime: this.state.endTimeDepDealt,
            resolve,
            community: val
          },
        })
      }).then(res => {
        const increaseIntListAdd = [];
        const increaseIntListReduce = [];
        const intDate = [];// 智能生成 时间
        for (let i = 0; i < res.data.length; i++) {
          increaseIntListAdd.push(res.data[i].newWorkNum); // 新增
          increaseIntListReduce.push(res.data[i].hadWeek); // 结案
          intDate.push(res.data[i].typeTime.substring(0, 10));
        }
        if (res) {
          this.setState({
            increaseIntListAdd, // 新增
            increaseIntListReduce, // 结案
            intDate
          })
        }
      })
    }

  }

  componentDidUpdate() {
    // 多图表自适应
    window.addEventListener("resize", () => {
      myChart.resize();
    });
    const myChart = echarts.init(document.getElementById('myChart'));
    const options = {
      xAxis: {
        type: 'category',
        data: this.state.depDate ? this.state.depDate : '',
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: this.state.chartKey === '1' ? ['累计待处理', '累计已处理', '累计已结案',] : (this.state.chartKey === '2' ? ['工单增加--新增', '工单减少--已结案'] : ''),
        // x: 'center',
        // y: 'bottom',
      },
      yAxis: {
        type: 'value'
      },
      series: this.state.key === '1' && this.state.chartKey === '1' ? [
        {
          name: '累计待处理',
          type: 'line',
          itemStyle: {
            normal: {
              color: '#1BB8FA',
              lineStyle: {
                color: '#1BB8FA'
              }
            }
          },
          data: this.state.increaseDepDisposaListEchats ? this.state.increaseDepDisposaListEchats : '',
        },
        {
          name: '累计已处理',
          type: 'line',
          itemStyle: {
            normal: {
              color: '#FABE1B',
              lineStyle: {
                color: '#FABE1B'
              }
            }
          },
          data: this.state.increaseDepDisposaListEchatsToBeClosed ? this.state.increaseDepDisposaListEchatsToBeClosed : '',
        },
        {
          name: '累计已结案',
          type: 'line',
          itemStyle: {
            normal: {
              color: '#459828',
              lineStyle: {
                color: '#459828'
              }
            }
          },
          data: this.state.increaseDepDisposaListEchatsHasBeenClosed ? this.state.increaseDepDisposaListEchatsHasBeenClosed : '',
        },
      ] : [
          {
            name: '工单增加--新增',
            data: this.state.increaseIntListNewWorkNum ? this.state.increaseIntListNewWorkNum : '',
            type: 'line',
            itemStyle: {
              normal: {
                color: '#FABE1B',
                lineStyle: {
                  color: '#FABE1B'
                }
              }
            },
          },
          {
            name: '工单减少--已结案',
            data: this.state.increaseIntListHadWeek ? this.state.increaseIntListHadWeek : '',
            type: 'line',
            itemStyle: {
              normal: {
                color: '#459828',
                lineStyle: {
                  color: '#459828'
                }
              }
            },
          }
        ]
    };

    const optionsLeader = {
      xAxis: {
        type: 'category',
        data: this.state.LeaderDate ? this.state.LeaderDate : '',
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: this.state.chartKey === '1' ? ['累计待处理', '累计已处理', '累计已结案'] : (this.state.chartKey === '2' ? ['工单增加--新增', '工单减少--已结案'] : ''),
        // x: 'center',
        // y: 'bottom',
      },
      yAxis: {
        type: 'value'
      },
      series: this.state.key === '2' && this.state.chartKey === '1' ? [
        {
          name: '累计待处理',
          type: 'line',
          data: this.state.increaseLeaderListEchats ? this.state.increaseLeaderListEchats : '',
        },
        {
          name: '累计已处理',
          type: 'line',
          data: this.state.increaseLeaderListEchatsToBeClosed ? this.state.increaseLeaderListEchatsToBeClosed : '',
        },
        {
          name: '累计已结案',
          type: 'line',
          data: this.state.increaseLeaderListEchatsHasBeenClosed ? this.state.increaseLeaderListEchatsHasBeenClosed : '',
        }
      ] : [
          {
            name: '工单增加--新增',
            data: this.state.increaseLeaderListAdd ? this.state.increaseLeaderListAdd : '',
            type: 'line'
          },
          {
            name: '工单减少--已结案',
            data: this.state.increaseLeaderListReduce ? this.state.increaseLeaderListReduce : '',
            type: 'line'
          }
        ]
    };
    const optionsInt = {
      xAxis: {
        type: 'category',
        data: this.state.intDate ? this.state.intDate : '',
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: this.state.chartKey === '1' ? ['累计待处理', '累计已处理', '累计已结案'] : (this.state.chartKey === '2' ? ['工单增加--新增', '工单减少--已结案'] : ''),
        // x: 'center',
        // y: 'bottom',
      },
      yAxis: {
        type: 'value'
      },
      series: this.state.key === '3' && this.state.chartKey === '1' ? [
        {
          name: '累计待处理',
          type: 'line',
          data: this.state.increaseIntListEchats ? this.state.increaseIntListEchats : '',
        },
        {
          name: '累计已处理',
          type: 'line',
          data: this.state.increaseIntListEchatsToBeClosed ? this.state.increaseIntListEchatsToBeClosed : '',
        },
        {
          name: '累计已结案',
          type: 'line',
          data: this.state.increaseIntListEchatsHasBeenClosed ? this.state.increaseIntListEchatsHasBeenClosed : '',
        }
      ] : [
          {
            name: '工单增加--新增',
            data: this.state.increaseIntListAdd ? this.state.increaseIntListAdd : '',
            type: 'line'
          },
          {
            name: '工单减少--已结案',
            data: this.state.increaseIntListReduce ? this.state.increaseIntListReduce : '',
            type: 'line'
          }
        ]
    };
    this.state.key === '1' ? myChart.setOption(options, true) : (this.state.key === '2' ? myChart.setOption(optionsLeader, true) : myChart.setOption(optionsInt, true))
  }

  callback(val) {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      key: val,
    });
    form.setFieldsValue({ 'range': range(7) });
    form.setFieldsValue({ 'dayDepDisposal': 7 })
  }

  callbackChart(val) {
    const { form } = this.props;
    this.setState({
      chartKey: val,
      depDate: this.state.depDateTwo,
      LeaderDate: this.state.LeaderDateTwo,
      intDate: this.state.intDateTwo,
    })
    form.setFieldsValue({ 'range': range(7) });
    form.setFieldsValue({ 'dayDepDisposal': 7 })
    if (val === '1' || val === '2') {
      const date = moment().subtract(7, 'days').calendar();
      const reg = new RegExp('/', 'g');
      const dates = date.replace(reg, '-');
      this.setState({
        bigTimeDepDealt: dates,
        endTimeDepDealt: moment().format().substring(0, 10),
      })
      new Promise(resolve => {
        this.props.dispatch({
          type: 'increase/increaseDepDisposalFetch',
          payload: {
            resolve,
          },
        })
      }).then((res) => {
        const CloseWorkNumArr = [];
        const depDate = [];
        if (res.data !== undefined) {
          for (let i = 0; i < res.data.length; i++) {
            const a = res.data.toBeProcessed[i];
            CloseWorkNumArr.push(-(a));
          }
        }
        this.setState({
          increaseDepDisposaList: res.data,
          CloseWorkNumArr,
        });

        new Promise(resolve => {
          this.props.dispatch({
            type: 'increase/increaseLeaderFetch',
            payload: {
              resolve,
            },
          })
        }).then((resLeader) => {
          const CloseWorkNumArrLeader = [];
          const LeaderDate = [];
          this.setState({
            increaseLeaderList: resLeader.data,
            CloseWorkNumArrLeader,
            LeaderDate,
            bigTimeLeader: dates,
            endTimeLeader: moment().format().substring(0, 10),
          })
        });

        new Promise(resolve => {
          this.props.dispatch({
            type: 'increase/increaseIntFetch',
            payload: {
              resolve,
            },
          })
        }).then((resInt) => {
          const CloseWorkNumArrInt = [];
          const intDate = [];
          this.setState({
            increaseIntList: resInt.data,
            CloseWorkNumArrInt,
            intDate,
            bigTimeInt: dates,
            endTimeInt: moment().format().substring(0, 10),
          })
        });
        // 社区
        this.props.dispatch({
          type: 'select/community',
        });

        // 部门派发工单数量趋势
        new Promise(resolve => {
          this.props.dispatch({
            type: 'increase/quantitativetrends',
            payload: {
              startTime: dates,
              endTime: moment().format().substring(0, 10),
              resolve,
            },
          })
        }).then(res => {
          const depDate = [];
          const increaseDepDisposaListEchats = [];
          const increaseDepDisposaListEchatsToBeClosed = [];
          const increaseDepDisposaListEchatsHasBeenClosed = [];
          for (let i = 0; i < res.data.length; i++) {
            depDate.push(res.data[i].typeTime.substring(0, 10));
            increaseDepDisposaListEchats.push(res.data[i].toBeProcessed);
            increaseDepDisposaListEchatsToBeClosed.push(res.data[i].toBeClosed)
            increaseDepDisposaListEchatsHasBeenClosed.push(res.data[i].hasBeenClosed)
          };
          if (res) {
            this.setState({
              increaseDepDisposaListEchats,
              increaseDepDisposaListEchatsToBeClosed,
              increaseDepDisposaListEchatsHasBeenClosed,
              depDate,
              depDateTwo: depDate,
            })
          }
        });

        // 部门派发工单增减趋势
        new Promise(resolve => {
          this.props.dispatch({
            type: 'increase/increaseAndDecreaseTrend',
            payload: {
              startTime: dates,
              endTime: moment().format().substring(0, 10),
              resolve,
            },
          })
        }).then(res => {
          const depDate = [];
          const increaseIntListNewWorkNum = [];
          const increaseIntListHadWeek = [];
          for (let i = 0; i < res.data.length; i++) {
            increaseIntListNewWorkNum.push(res.data[i].newWorkNum);
            increaseIntListHadWeek.push(res.data[i].hadWeek);
            depDate.push(res.data[i].typeTime.substring(0, 10));
          }
          if (res) {
            this.setState({
              increaseIntListNewWorkNum,
              increaseIntListHadWeek,
              depDate,
              depDateTwo: depDate,
            })
          }
        })
        // 领导交办工单增减趋势
        new Promise(resolve => {
          this.props.dispatch({
            type: 'increase/leadershipLncreaseAndDecreaseTrend',
            payload: {
              startTime: dates,
              endTime: moment().format().substring(0, 10),
              resolve,
            },
          })
        }).then(res => {
          const LeaderDate = [];// 领导交办 时间
          const increaseLeaderListAdd = [];// 工单增加-新增,
          const increaseLeaderListReduce = [];// 工单减少-已结案,
          for (let i = 0; i < res.data.length; i++) {
            increaseLeaderListAdd.push(res.data[i].newWorkNum); // 新增
            increaseLeaderListReduce.push(res.data[i].hadWeek); // 结案
            LeaderDate.push(res.data[i].typeTime.substring(0, 10));
          }
          if (res) {
            this.setState({
              increaseLeaderListAdd, // 新增
              increaseLeaderListReduce, // 结案
              LeaderDate,
              LeaderDateTwo: LeaderDate
            })
          }
        })
        // 智能生成工单增减趋势
        new Promise(resolve => {
          this.props.dispatch({
            type: 'increase/intelligentGenerationIncreaseOrDecrease',
            payload: {
              startTime: dates,
              endTime: moment().format().substring(0, 10),
              resolve,
            },
          })
        }).then(res => {
          const increaseIntListAdd = [];
          const increaseIntListReduce = [];
          const intDate = [];// 智能生成 时间
          for (let i = 0; i < res.data.length; i++) {
            increaseIntListAdd.push(res.data[i].newWorkNum); // 新增
            increaseIntListReduce.push(res.data[i].hadWeek); // 结案
            intDate.push(res.data[i].typeTime.substring(0, 10));
          }
          if (res) {
            this.setState({
              increaseIntListAdd, // 新增
              increaseIntListReduce, // 结案
              intDate,
              intDateTwo: intDate
            })
          }
        })

        // 领导交办工单数量趋势
        new Promise(resolve => {
          this.props.dispatch({
            type: 'increase/leadershipQuantityTrend',
            payload: {
              startTime: dates,
              endTime: moment().format().substring(0, 10),
              resolve,
            }
          })
        }).then(res => {
          const increaseLeaderListEchats = [];// 累计待处理
          const increaseLeaderListEchatsToBeClosed = [];// 累计已处理
          const increaseLeaderListEchatsHasBeenClosed = [];// 累计已结案
          const LeaderDate = [];// 领导交办 时间
          for (let i = 0; i < res.data.length; i++) {
            LeaderDate.push(res.data[i].typeTime.substring(0, 10));
            increaseLeaderListEchats.push(res.data[i].toBeProcessed);
            increaseLeaderListEchatsToBeClosed.push(res.data[i].toBeClosed)
            increaseLeaderListEchatsHasBeenClosed.push(res.data[i].hasBeenClosed)
          };
          if (res) {
            this.setState({
              increaseLeaderListEchats,
              increaseLeaderListEchatsToBeClosed,
              increaseLeaderListEchatsHasBeenClosed,
              LeaderDate,
              LeaderDateTwo: LeaderDate
            })
          }
        })
        // 智能生成工单数量趋势
        new Promise(resolve => {
          this.props.dispatch({
            type: 'increase/trendOfIntelligentGeneration',
            payload: {
              resolve,
              startTime: dates,
              endTime: moment().format().substring(0, 10),
            }
          })
        }).then(res => {
          const increaseIntListEchats = [];// 累计待处理
          const increaseIntListEchatsToBeClosed = [];// 累计已处理
          const increaseIntListEchatsHasBeenClosed = [];// 累计已结案
          const intDate = [];// 智能生成 时间
          for (let i = 0; i < res.data.length; i++) {
            intDate.push(res.data[i].typeTime.substring(0, 10));
            increaseIntListEchats.push(res.data[i].toBeProcessed);
            increaseIntListEchatsToBeClosed.push(res.data[i].toBeClosed)
            increaseIntListEchatsHasBeenClosed.push(res.data[i].hasBeenClosed)
          };
          if (res) {
            this.setState({
              increaseIntListEchats,
              increaseIntListEchatsToBeClosed,
              increaseIntListEchatsHasBeenClosed,
              intDate,
              intDateTwo: intDate
            })
          }
        })
      });
    }
  }

  printDeparment() {
    window.print();
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { range, rangeLeader, rangeInt, chartKey } = this.state;
    // console.log(chartKey);
    const { select } = this.props;
    const { communityList } = select;
    return (
      <div id="listTitleContent">
        <Breadcrumb separator=">">
          <span id="breadcrumbIcon" />
          <Breadcrumb.Item>统计分析</Breadcrumb.Item>
          <Breadcrumb.Item>增减分析</Breadcrumb.Item>
        </Breadcrumb>
        <div id="tableForm">
          <h3 id="listTitle" style={{ paddingBottom: 0 }}>增减分析</h3>
        </div>
        <div id="listTitleDetailTabContent" style={{boxShadow:'0 2px 6px 0 rgba(0, 0, 0, 0.3)', marginBottom:'5%',background:'#fff'}}>
          <div id="listTitleDetailTab" style={{ borderRadius: '25px 0 0 0', marginTop: '16px' }}>
            <Tabs defaultActiveKey="1" onChange={this.callback.bind(this)} type="card">
              <TabPane tab="部门派发" key="1" />
              <TabPane tab="领导交办" key="2" />
              <TabPane tab="智能生成" key="3" />
            </Tabs>
            <div className={styles.statistics}>
              <span style={{ color: '#333' }}>关键指标<span style={{ color: '#666' }}>（企业总人数根据当前实时数据计算，而本页其他数据根据昨日数据计算）</span></span>
              <ul className={styles.two}>
                <li>
                  <p>累计待处理工单</p>
                  <h1>
                    {
                      this.state.key === '1' ? (this.state.increaseDepDisposaList ? (this.state.increaseDepDisposaList.toBeProcessed ? this.state.increaseDepDisposaList.toBeProcessed : 0) : 0) :
                        (this.state.key === '2' ? this.state.increaseLeaderList ? (this.state.increaseLeaderList.toBeProcessed ? this.state.increaseLeaderList.toBeProcessed : 0) : 0 :
                          this.state.key === '3' ? this.state.increaseIntList ? (this.state.increaseIntList.toBeProcessed ? this.state.increaseIntList.toBeProcessed : 0) : 0 : 0
                        )
                    }
                  </h1>
                </li>
                <li>
                  <p>累计已处理工单</p>
                  <h1>
                    {
                      this.state.key === '1' ? (this.state.increaseDepDisposaList ? (this.state.increaseDepDisposaList.toBeClosed ? this.state.increaseDepDisposaList.toBeClosed : 0) : 0) :
                        (this.state.key === '2' ? this.state.increaseLeaderList ? (this.state.increaseLeaderList.toBeClosed ? this.state.increaseLeaderList.toBeClosed : 0) : 0 :
                          this.state.key === '3' ? this.state.increaseIntList ? (this.state.increaseIntList.toBeClosed ? this.state.increaseIntList.toBeClosed : 0) : 0 : 0
                        )
                    }
                  </h1>
                </li>
                <li>
                  <p>累计已结案工单</p>
                  <h1>
                    {
                      this.state.key === '1' ? (this.state.increaseDepDisposaList ? (this.state.increaseDepDisposaList.hasBeenClosed ? this.state.increaseDepDisposaList.hasBeenClosed : 0) : 0) :
                        (this.state.key === '2' ? this.state.increaseLeaderList ? (this.state.increaseLeaderList.hasBeenClosed ? this.state.increaseLeaderList.hasBeenClosed : 0) : 0 :
                          this.state.key === '3' ? this.state.increaseIntList ? (this.state.increaseIntList.hasBeenClosed ? this.state.increaseIntList.hasBeenClosed : 0) : 0 : 0
                        )
                    }
                  </h1>
                </li>
                {/* <li>
                  <p>累计已废案工单</p>
                  <h1>
                    {
                      this.state.key === '1' ? (this.state.increaseDepDisposaList ? (this.state.increaseDepDisposaList.CumulativeWaste ? this.state.increaseDepDisposaList.CumulativeWaste : 0) : 0) :
                        (this.state.key === '2' ? this.state.increaseLeaderList ? (this.state.increaseLeaderList.CumulativeWaste ? this.state.increaseLeaderList.CumulativeWaste : 0) : 0 :
                          this.state.key === '3' ? this.state.increaseIntList ? (this.state.increaseIntList.CumulativeWaste ? this.state.increaseIntList.CumulativeWaste : 0) : 0 : 0
                        )
                    }
                  </h1>
                </li> */}
                <li>
                  <p>近7天新增工单</p>
                  <h1>+
                    {
                      this.state.key === '1' ? (this.state.increaseDepDisposaList ? (this.state.increaseDepDisposaList.newWorkNum ? this.state.increaseDepDisposaList.newWorkNum : 0) : 0) :
                        (this.state.key === '2' ? this.state.increaseLeaderList ? (this.state.increaseLeaderList.newWorkNum ? this.state.increaseLeaderList.newWorkNum : 0) : 0 :
                          this.state.key === '3' ? this.state.increaseIntList ? (this.state.increaseIntList.newWorkNum ? this.state.increaseIntList.newWorkNum : 0) : 0 : 0
                        )
                    }
                  </h1>
                </li>
                <li>
                  <p>近7天结案工单</p>
                  <h1>-
                    {
                      this.state.key === '1' ? (this.state.increaseDepDisposaList ? (this.state.increaseDepDisposaList.hadWeek ? this.state.increaseDepDisposaList.hadWeek : 0) : 0) :
                        (this.state.key === '2' ? this.state.increaseLeaderList ? (this.state.increaseLeaderList.hadWeek ? this.state.increaseLeaderList.hadWeek : 0) : 0 :
                          this.state.key === '3' ? this.state.increaseIntList ? (this.state.increaseIntList.hadWeek ? this.state.increaseIntList.hadWeek : 0) : 0 : 0
                        )
                    }
                  </h1>
                </li>
              </ul>
            </div>
            <div id="listTitleDetailTabIncrease" style={{ paddingLeft: 30 }}>
              <Tabs defaultActiveKey="1" tabBarGutter={20} onChange={this.callbackChart.bind(this)} type="card">
                <TabPane tab="工单数量趋势" key="1" />
                <TabPane tab="工单增减趋势" key="2" />
              </Tabs>
            </div>
            <div style={{ background: '#fff', padding: '0 20px 0 16px' }}>
              <div style={{ padding: '20px 20px 0 16px', borderTop: '1px solid #DCDCDC' }}>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                  <Col md={4} sm={8}>
                    <FormItem label="">
                      {getFieldDecorator('dayDepDisposal', {
                        initialValue: 7
                      })(
                        <Select style={{ width: '100%' }} onChange={this.handleChangeDepDisposal}>
                          <Option value={7}>最近7天</Option>
                          <Option value={15}>最近15天</Option>
                          <Option value={30}>最近30天</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col md={6} sm={8}>
                    <FormItem label="">
                      {getFieldDecorator('range', {
                        initialValue: range
                      })(
                        <RangePicker style={{ width: '100%' }} allowClear={false} disabledDate={this.disabledDepDisDate} onChange={this.handleDepDisDateChange} />
                      )}
                    </FormItem>
                  </Col>
                  <Col md={6} sm={8}>
                    <FormItem label="">
                      {getFieldDecorator('community')(
                        <Select placeholder="请选择" allowClear style={{ width: '100%' }} onChange={this.selectDepDisDateChange.bind(this)}>
                          {
                            communityList ?
                              (communityList.map((val) => (
                                <Select.Option key={val.code} value={val.code}>{val.desp}</Select.Option>
                              ))) : ''
                          }
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col md={8} sm={8} style={{ textAlign: 'right', padding: '4px 0' }}>
                    <Button style={{ marginRight: 0, marginLeft: 16 }} type='primary' onClick={this.printDeparment.bind(this)}>
                      打印
                    </Button>
                  </Col>
                </Row>
              </div>
            </div>
            <div style={{ background: '#fff' }}>
              <div id='myChart' style={{ width: '100%', height: 500 }} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default Home;
