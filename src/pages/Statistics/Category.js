/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-dupe-keys */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-use-before-define */
/* eslint-disable func-names */
/* eslint-disable react/sort-comp */
/* eslint-disable class-methods-use-this */
/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unused-state */
import React, { PureComponent } from 'react';
import { Tabs, Row, Col, Button, Select, DatePicker, Form, Breadcrumb } from 'antd';
import echarts from 'echarts';
import { connect } from 'dva/index';
import moment from 'moment/moment';
import range from './range';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;
const FormItem = Form.Item;
@connect(({ category, select, inspectors }) => ({
  category, select, inspectors
}))
@Form.create()
class Home extends PureComponent {
  state = {
    chartKey: '1',
    day: 7,
    dayDepComDisabled: 7,
    rangeDepCom: range(7),
    categoryComprehensive: [],// 部门派发 综合执法
    departmentCompreate: [],// 部门派发 综合执法 时间
    departmentCompreClassNames: [],// 部门派发 综合执法 案件类别
    departmentCompreClassNamesLength: 0,
    bigtimeDepCom: '',
    endtimeDepCom: '',
    communityDepComprehensive: '',
    caseBigTypeDepComprehensive: '',
    statusDepComprehensive: '',
    caseSmallType: '',
    caseBigType: '',
    caseBigTypeNumLength: 0,
    categoryIntelligent: {},// 部门派发 综合执法
    intelligentDate: [],// 部门派发 综合执法 时间
    intelligentClassNames: [],// 部门派发 综合执法 案件类别
    intelligentClassNamesLength: 0,
    caseBigTypeNumLengthInt: 0,
    listbigAllClass: [],// 查询列表 所有案件大类
    listSmallAllClass: [],// 查询列表 所有案件小类
    categoryInspectors: {},// 城管工单数据
    inspectorsCompreate: [],// 城管工单时间
    inspectorsClassNamesLength: '',// 城管工单类型长度
    inspectorsClassNames: '',// 城管工单
    categoryLeader: {},// 领导交办数据
    leaderCompreate: [],// 领导交办时间
    leaderClassNamesLength: '',// 领导交办类型长度
    leaderClassNames: '',// 领导交办
    categoryComplain: {},// 投诉工单数据
    complainDate: [],// 投诉工单时间
    complainClassNamesLength: '',// 投诉工单类型长度
    complainClassNames: '',// 投诉工单
    convergenceProgram: '',// 投诉工单 归口类型

    startTime: moment().subtract('days', 7).format('YYYY-MM-DD'),
    endTime: moment().format().substring(0, 10),
    timeData: [],
    superData: [],// 综合执法数据
    community: '',// 社区
    orderType: '',// 工单类型
    urbanManagementData: [],// 城管数据
    leadershipData: [],// 领导交办数据
    complaintData: []
  };

  componentDidMount() {
    // 综合执法 echarts data
    new Promise(resolve => {
      this.props.dispatch({
        type: 'inspectors/comprehensiveEcharts',
        payload: {
          resolve,
          startTime: this.state.startTime,
          endTime: this.state.endTime
        }
      });
    }).then(res => {
      this.setState({
        timeData: res.timeData,
        departmentCompreClassNames: res.departmentCompreClassNames,
        superData: res.superData
      })
    })







    // 查询列表 查询所有案件大类 bigAllClassFetch
    new Promise(resolve => {
      this.props.dispatch({
        type: 'inspectors/bigAllClassFetch',
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
      type: 'select/type',
    });

    const date = moment().subtract(7, 'days').calendar();
    const reg = new RegExp('/', 'g');
    const dates = date.replace(reg, '-');

    new Promise(resolve => {
      this.props.dispatch({
        type: 'category/categoryComprehensiveFetch',
        payload: {
          resolve,
          startTime: dates,
          endTime: moment().format().substring(0, 10),
        },
      })
    }).then((res) => {
      const departmentCompreate = [];
      const categoryComprehensive = res.data;
      const cc = categoryComprehensive ? categoryComprehensive.map((item, index) => {
        return {
          name: item.caseType,
          data: item.caseCode,
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
      }) : '';
      if (cc) {
        this.setState({
          categoryComprehensive: res.data,
          departmentCompreate,
          departmentCompreClassNames: res.data.caseType,
          departmentCompreClassNamesLength: res.data.length,
          bigtimeDepCom: dates,
          endtimeDepCom: moment().format().substring(0, 10),
        })
      }
    });
    // 社区
    this.props.dispatch({
      type: 'select/community',
    });
    // 工单类型
    this.props.dispatch({
      type: 'select/type'
    })
    // 综合执法 案件类别
    this.props.dispatch({
      type: 'select/bigClass',
    });
    // 综合执法 案件状态 status
    this.props.dispatch({
      type: 'select/status',
    });
    // //工单状态
    // this.props.dispatch({
    //   type: 'select/workOrderStatus'
    // })
    // 归口类型
    this.props.dispatch({
      type: 'select/convergenceProgram',
    });

  }

  // 列表案件大类 查询 案件小类
  bigClassSearch = (value) => {
    const { form } = this.props;
    new Promise(resolve => {
      this.props.dispatch({
        type: 'category/categoryInspectorFetch',
        payload: {
          resolve,
          startTime: this.state.startTime,
          endTime: this.state.endTime,
          community: this.state.community == '' ? null : this.state.community,
          caseBigType: value,
          caseSmallType: this.state.caseSmallType == '' ? null : this.state.caseSmallType,
          orderStatus: this.state.statusDepComprehensive == '' ? null : this.state.statusDepComprehensive,
        },
      });
    }).then(res => {
      this.setState({
        caseBigType: value,
        inspectorsClassNames: res.inspectorsClassNames,
        inspectorsCompreate: res.inspectorsCompreate,
        urbanManagementData: res.urbanManagementData
      })
    })

    // 案件小类
    if (value) {
      const {parentId} = this.state.listbigAllClass.filter(i => i.code == value)[0];
      new Promise(resolve => {
        this.props.dispatch({
          type: 'inspectors/smallClassFetch',
          payload: {
            resolve,
            largeClassCode: parentId,
          }
        })
      }).then((res) => {
        this.setState({
          listSmallAllClass: res.data,
        });
      });
    } else {
      this.setState({
        listSmallAllClass: [],
        caseSmallType: '',
      })
    }
    form.setFieldsValue({ caseSmallTypeSearch: '' })
  };

  // 案件小类
  smallClassSearch = (value) => {
    new Promise(resolve => {
      this.props.dispatch({
        type: 'category/categoryInspectorFetch',
        payload: {
          resolve,
          startTime: this.state.startTime,
          endTime: this.state.endTime,
          community: this.state.community == '' ? null : this.state.community,
          caseBigType: this.state.caseBigType == '' ? null : this.state.caseBigType,
          caseSmallType: value,
          orderStatus: this.state.statusDepComprehensive == '' ? null : this.state.statusDepComprehensive,
        },
      })
    }).then((res) => {
      this.setState({
        caseSmallType: value,
        inspectorsClassNames: res.inspectorsClassNames,
        inspectorsCompreate: res.inspectorsCompreate,
        urbanManagementData: res.urbanManagementData
      });
    });
  };

  // 时间区间
  depComChange = (day) => {
    const { form } = this.props;
    const arr = range(day);
    this.setState({
      rangeDepCom: arr,
      dayDepComDisabled: day,
      bigtimeDepCom: moment(arr[0]).format('YYYY-MM-DD'),
      endtimeDepCom: moment(arr[1]).format('YYYY-MM-DD'),
    });
    if (this.state.chartKey === '1') {
      new Promise(resolve => {
        this.props.dispatch({
          type: 'inspectors/comprehensiveEcharts',
          payload: {
            resolve,
            startTime: moment(arr[0]).format('YYYY-MM-DD'),
            endTime: moment(arr[1]).format('YYYY-MM-DD'),
            community: this.state.community == '' ? null : this.state.community,
            orderType: this.state.orderType == '' ? null : this.state.orderType,
            orderStatus: this.state.statusDepComprehensive == '' ? null : this.state.statusDepComprehensive,
          },
        })
      }).then((res) => {
        this.setState({
          timeData: res.timeData,
          departmentCompreClassNames: res.departmentCompreClassNames,
          superData: res.superData,
          startTime: moment(arr[0]).format('YYYY-MM-DD'),
          endTime: moment(arr[1]).format('YYYY-MM-DD'),
        })
      });
    } else if (this.state.chartKey === '2') {
      new Promise(resolve => {
        this.props.dispatch({
          type: 'category/categoryInspectorFetch',
          payload: {
            resolve,
            startTime: moment(arr[0]).format('YYYY-MM-DD'),
            endTime: moment(arr[1]).format('YYYY-MM-DD'),
            community: this.state.community == '' ? null : this.state.community,
            orderStatus: this.state.statusDepComprehensive == '' ? null : this.state.statusDepComprehensive,
            caseBigType: this.state.caseBigType == '' ? null : this.state.caseBigType,
            caseSmallType: this.state.caseSmallType == '' ? null : this.state.caseSmallType,
          },
        })
      }).then((res) => {
        this.setState({
          inspectorsCompreate: res.inspectorsCompreate,
          inspectorsClassNames: res.inspectorsClassNames,
          urbanManagementData: res.urbanManagementData,
          startTime: moment(arr[0]).format('YYYY-MM-DD'),
          endTime: moment(arr[1]).format('YYYY-MM-DD'),
        })
      });
    } else if (this.state.chartKey === '3') {
      new Promise(resolve => {
        this.props.dispatch({
          type: 'category/categoryLeaderFetch',
          payload: {
            resolve,
            startTime: moment(arr[0]).format('YYYY-MM-DD'),
            endTime: moment(arr[1]).format('YYYY-MM-DD'),
            community: this.state.community == '' ? null : this.state.community,
            orderType: this.state.orderType == '' ? null : this.state.orderType,
            orderStatus: this.state.statusDepComprehensive == '' ? null : this.state.statusDepComprehensive,
          },
        })
      }).then((res) => {
        this.setState({
          leaderCompreate: res.leaderCompreate,
          leaderClassNames: res.leaderClassNames,
          leadershipData: res.leadershipData,
          startTime: moment(arr[0]).format('YYYY-MM-DD'),
          endTime: moment(arr[1]).format('YYYY-MM-DD'),
        });
      });
    } else if (this.state.chartKey === '4') {
      new Promise(resolve => {
        this.props.dispatch({
          type: 'category/categoryComplainFetch',
          payload: {
            resolve,
            startTime: moment(arr[0]).format('YYYY-MM-DD'),
            endTime: moment(arr[1]).format('YYYY-MM-DD'),
            community: this.state.community == '' ? null : this.state.community,
            homecomingType: this.state.convergenceProgram == '' ? null : this.state.convergenceProgram,
            orderStatus: this.state.statusDepComprehensive == '' ? null : this.state.statusDepComprehensive,
          },
        })
      }).then((res) => {
        this.setState({
          complainDate: res.complainDate,
          complainClassNames: res.complainClassNames,
          complaintData: res.complaintData,
          startTime: moment(arr[0]).format('YYYY-MM-DD'),
          endTime: moment(arr[1]).format('YYYY-MM-DD'),
        });
      });
    }
    form.setFieldsValue({ 'rangeDepCom': arr })
  };

  disabledDepComDate = current => current && current > moment().endOf('day') || current < moment().subtract(this.state.dayDepComDisabled + 1, 'day');

  // 部门派发 综合执法 打印
  printDeparmentCom() {
    window.print();
  }

  // 部门派发 综合执法 时间段
  depComDateChange(val) {
    const start = moment(val[0]).format('YYYY-MM-DD');
    const end = moment(val[1]).format('YYYY-MM-DD');
    if (this.state.chartKey === '1') {
      new Promise(resolve => {
        this.props.dispatch({
          type: 'inspectors/comprehensiveEcharts',
          payload: {
            resolve,
            startTime: start,
            endTime: end,
            community: this.state.community == '' ? null : this.state.community,
            orderType: this.state.orderType == '' ? null : this.state.orderType,
            orderStatus: this.state.statusDepComprehensive == '' ? null : this.state.statusDepComprehensive,
          },
        })
      }).then((res) => {
        this.setState({
          timeData: res.timeData,
          departmentCompreClassNames: res.departmentCompreClassNames,
          superData: res.superData,
          startTime: start,
          endTime: end,
        })
      });
    } else if (this.state.chartKey === '2') {
      new Promise(resolve => {
        this.props.dispatch({
          type: 'category/categoryInspectorFetch',
          payload: {
            resolve,
            startTime: start,
            endTime: end,
            community: this.state.community == '' ? null : this.state.community,
            caseBigType: this.state.caseBigType == '' ? null : this.state.caseBigType,
            caseSmallType: this.state.caseSmallType == '' ? null : this.state.caseSmallType,
            orderStatus: this.state.statusDepComprehensive == '' ? null : this.state.statusDepComprehensive,
          },
        })
      }).then((res) => {
        this.setState({
          inspectorsClassNames: res.inspectorsClassNames,
          inspectorsCompreate: res.inspectorsCompreate,
          urbanManagementData: res.urbanManagementData,
          startTime: start,
          endTime: end,
        });
      });
    } else if (this.state.chartKey === '3') {
      new Promise(resolve => {
        this.props.dispatch({
          type: 'category/categoryLeaderFetch',
          payload: {
            resolve,
            startTime: start,
            endTime: end,
            community: this.state.community == '' ? null : this.state.community,
            orderType: this.state.orderType == '' ? null : this.state.orderType,
            orderStatus: this.state.statusDepComprehensive == '' ? null : this.state.statusDepComprehensive,
          },
        })
      }).then((res) => {
        this.setState({
          leaderCompreate: res.leaderCompreate,
          leaderClassNames: res.leaderClassNames,
          leadershipData: res.leadershipData,
          startTime: start,
          endTime: end,
        });
      });
    } else if (this.state.chartKey === '4') {
      new Promise(resolve => {
        this.props.dispatch({
          type: 'category/categoryComplainFetch',
          payload: {
            resolve,
            startTime: start,
            endTime: end,
            community: this.state.community == '' ? null : this.state.community,
            homecomingType: this.state.convergenceProgram == '' ? null : this.state.convergenceProgram,
            orderStatus: this.state.statusDepComprehensive == '' ? null : this.state.statusDepComprehensive,
          },
        })
      }).then((res) => {
        this.setState({
          complainDate: res.complainDate,
          complainClassNames: res.complainClassNames,
          complaintData: res.complaintData,
          startTime: start,
          endTime: end,
        });
      });
    }
  }

  // 部门派发 综合执法 社区
  onDepComCommunity(val) {
    // if(+val<10){
    //   val='0'+val
    // }
    // 综合执法
    if (this.state.chartKey === '1') {
      new Promise(resolve => {
        this.props.dispatch({
          type: 'inspectors/comprehensiveEcharts',
          payload: {
            resolve,
            startTime: this.state.startTime,
            endTime: this.state.endTime,
            community: val,
            orderType: this.state.orderType == '' ? null : this.state.orderType,
            orderStatus: this.state.statusDepComprehensive == '' ? null : this.state.statusDepComprehensive,
          },
        })
      }).then((res) => {
        this.setState({
          timeData: res.timeData,
          departmentCompreClassNames: res.departmentCompreClassNames,
          superData: res.superData,
          community: val
        })
      });
    }
    // 城管工单
    if (this.state.chartKey === '2') {
      new Promise(resolve => {
        this.props.dispatch({
          type: 'category/categoryInspectorFetch',
          payload: {
            resolve,
            startTime: this.state.startTime,
            endTime: this.state.endTime,
            community: val,
            caseBigType: this.state.caseBigType == '' ? null : this.state.caseBigType,
            caseSmallType: this.state.caseSmallType == '' ? null : this.state.caseSmallType,
            orderStatus: this.state.statusDepComprehensive == '' ? null : this.state.statusDepComprehensive,
          }
        });
      }).then(res => {
        this.setState({
          inspectorsClassNames: res.inspectorsClassNames,
          inspectorsCompreate: res.inspectorsCompreate,
          urbanManagementData: res.urbanManagementData,
          community: val,
        })
      })

    } else if (this.state.chartKey === '3') {
      new Promise(resolve => {
        this.props.dispatch({
          type: 'category/categoryLeaderFetch',
          payload: {
            resolve,
            startTime: this.state.startTime,
            endTime: this.state.endTime,
            community: val,
            orderType: this.state.orderType == '' ? null : this.state.orderType,
            orderStatus: this.state.statusDepComprehensive == '' ? null : this.state.statusDepComprehensive,
          },
        })
      }).then((res) => {
        this.setState({
          leaderCompreate: res.leaderCompreate,
          leaderClassNames: res.leaderClassNames,
          leadershipData: res.leadershipData,
          community: val,
        });
      });
    } else if (this.state.chartKey === '4') {
      new Promise(resolve => {
        this.props.dispatch({
          type: 'category/categoryComplainFetch',
          payload: {
            resolve,
            startTime: this.state.startTime,
            endTime: this.state.endTime,
            community: val,
            homecomingType: this.state.convergenceProgram == '' ? null : this.state.convergenceProgram,
            orderStatus: this.state.statusDepComprehensive == '' ? null : this.state.statusDepComprehensive,
          },
        })
      }).then((res) => {
        this.setState({
          complainDate: res.complainDate,
          complainClassNames: res.complainClassNames,
          complaintData: res.complaintData,
          community: val,
        });
      });
    }
  }

  // 部门派发 综合执法 工单类别
  onDepComCaseType(val) {
    if (this.state.chartKey === '1') {
      new Promise(resolve => {
        this.props.dispatch({
          type: 'inspectors/comprehensiveEcharts',
          payload: {
            resolve,
            startTime: this.state.startTime,
            endTime: this.state.endTime,
            community: this.state.community == '' ? null : this.state.community,
            orderType: val,
            orderStatus: this.state.statusDepComprehensive == '' ? null : this.state.statusDepComprehensive,
          },
        })
      }).then((res) => {
        this.setState({
          timeData: res.timeData,
          departmentCompreClassNames: res.departmentCompreClassNames,
          superData: res.superData,
          orderType: val
        })
      });
    }
  }

  // 部门派发 综合执法 工单状态
  onDepComStatus(val) {
    if (this.state.chartKey === '1') {
      new Promise(resolve => {
        this.props.dispatch({
          type: 'inspectors/comprehensiveEcharts',
          payload: {
            resolve,
            startTime: this.state.startTime,
            endTime: this.state.endTime,
            community: this.state.community == '' ? null : this.state.community,
            orderType: this.state.orderType == '' ? null : this.state.orderType,
            orderStatus: val
          },
        })
      }).then((res) => {
        this.setState({
          statusDepComprehensive: val,
          timeData: res.timeData,
          departmentCompreClassNames: res.departmentCompreClassNames,
          superData: res.superData,
        })
      });
    }
    if (this.state.chartKey === '2') {
      new Promise(resolve => {
        this.props.dispatch({
          type: 'category/categoryInspectorFetch',
          payload: {
            resolve,
            startTime: this.state.startTime,
            endTime: this.state.endTime,
            community: this.state.community == '' ? null : this.state.community,
            caseBigType: this.state.caseBigType == '' ? null : this.state.caseBigType,
            caseSmallType: this.state.caseSmallType == '' ? null : this.state.caseSmallType,
            orderStatus: val,
          },
        })
      }).then((res) => {
        this.setState({
          inspectorsClassNames: res.inspectorsClassNames,
          inspectorsCompreate: res.inspectorsCompreate,
          urbanManagementData: res.urbanManagementData,
          statusDepComprehensive: val,
        });
      });
    } else if (this.state.chartKey === '3') {
      new Promise(resolve => {
        this.props.dispatch({
          type: 'category/categoryLeaderFetch',
          payload: {
            resolve,
            startTime: this.state.startTime,
            endTime: this.state.endTime,
            community: this.state.community == '' ? null : this.state.community,
            orderType: this.state.orderType == '' ? null : this.state.orderType,
            orderStatus: val
          },
        })
      }).then((res) => {
        this.setState({
          leaderCompreate: res.leaderCompreate,
          leaderClassNames: res.leaderClassNames,
          leadershipData: res.leadershipData,
          statusDepComprehensive: val,
        });
      });
    } else if (this.state.chartKey === '4') {
      new Promise(resolve => {
        this.props.dispatch({
          type: 'category/categoryComplainFetch',
          payload: {
            resolve,
            startTime: this.state.startTime,
            endTime: this.state.endTime,
            community: this.state.community == '' ? null : this.state.community,
            homecomingType: this.state.convergenceProgram == '' ? null : this.state.convergenceProgram,
            orderStatus: val,
          },
        })
      }).then((res) => {
        this.setState({
          complainDate: res.complainDate,
          complainClassNames: res.complainClassNames,
          complaintData: res.complaintData,
          statusDepComprehensive: val,
        });
      });
    }
  }

  // 领导交办 工单类型
  workOrderType(val) {
    if (this.state.chartKey === '3') {
      new Promise(resolve => {
        this.props.dispatch({
          type: 'category/categoryLeaderFetch',
          payload: {
            resolve,
            startTime: this.state.startTime,
            endTime: this.state.endTime,
            community: this.state.community == '' ? null : this.state.community,
            orderType: val,
            orderStatus: this.state.statusDepComprehensive == '' ? null : this.state.statusDepComprehensive,
          },
        })
      }).then((res) => {
        this.setState({
          leaderCompreate: res.leaderCompreate,
          leaderClassNames: res.leaderClassNames,
          leadershipData: res.leadershipData,
          orderType: val,
        });
      });
    }
  }

  // 投诉工单 归口类型
  onConvergenceProgram(val) {
    if (this.state.chartKey === '4') {
      new Promise(resolve => {
        this.props.dispatch({
          type: 'category/categoryComplainFetch',
          payload: {
            resolve,
            startTime: this.state.startTime,
            endTime: this.state.endTime,
            community: this.state.community == '' ? null : this.state.community,
            homecomingType: val,
            orderStatus: this.state.statusDepComprehensive == '' ? null : this.state.statusDepComprehensive,
          },
        })
      }).then((res) => {
        this.setState({
          complainDate: res.complainDate,
          complainClassNames: res.complainClassNames,
          complaintData: res.complaintData,
          homecomingType: val,
        });
      });
    }
  }

  componentDidUpdate() {
    // 多图表自适应
    window.addEventListener("resize", function () {
      myChartDepCom.resize();
    });
    const myChartDepCom = echarts.init(document.getElementById('myChartDepCom'));
    // 综合执法
    const option = {
      xAxis: {
        type: 'category',
        data: this.state.timeData ? this.state.timeData : '',
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: this.state.departmentCompreClassNames ? this.state.departmentCompreClassNames : '',
        x: 'center', // 'center' | 'left' | {number},
        y: 'bottom', // 'center' | 'bottom' | {number}
      },
      yAxis: {
        type: 'value'
      },
      series: this.state.superData ? this.state.superData : []
    };
    // 城管工单
    const optionInspectors = {
      xAxis: {
        type: 'category',
        data: this.state.inspectorsCompreate ? this.state.inspectorsCompreate : '',
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: this.state.inspectorsClassNames ? this.state.inspectorsClassNames : '',
        x: 'center',
        y: 'bottom',
      },
      yAxis: {
        type: 'value'
      },
      series: this.state.urbanManagementData ? this.state.urbanManagementData : []
    };
    // 领导交办
    const optionLeader = {
      xAxis: {
        type: 'category',
        data: this.state.leaderCompreate ? this.state.leaderCompreate : '',
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: this.state.leaderClassNames ? this.state.leaderClassNames : '',
        x: 'center',
        y: 'bottom',
      },
      yAxis: {
        type: 'value'
      },
      series: this.state.leadershipData ? this.state.leadershipData : []
    };
    // 投诉工单
    const optionComplain = {
      xAxis: {
        type: 'category',
        data: this.state.complainDate ? this.state.complainDate : '',
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: this.state.complainClassNames ? this.state.complainClassNames : '',
        x: 'center',
        y: 'bottom',
      },
      yAxis: {
        type: 'value'
      },
      series: this.state.complaintData ? this.state.complaintData : []
    };
    this.state.chartKey === '1' ? myChartDepCom.setOption(option, true) : (
      this.state.chartKey === '2' ? myChartDepCom.setOption(optionInspectors, true) : (
        this.state.chartKey === '3' ? myChartDepCom.setOption(optionLeader, true) : (
          this.state.chartKey === '4' ? myChartDepCom.setOption(optionComplain, true) : ''
        )
      )
    );
  }

  callback(val) {
    const date = moment().subtract(7, 'days').calendar();
    const reg = new RegExp('/', 'g');
    const dates = date.replace(reg, '-');
    const { form } = this.props;
    form.resetFields();
    this.setState({
      chartKey: val,
    });
    if (val == '1') {
      this.setState({
        community: '',
        caseBigType: '',
        caseSmallType: '',
        orderStatus: '',
        caseBigType: '',
        caseSmallType: '',
        listSmallAllClass: '',
      })
      new Promise(resolve => {
        this.props.dispatch({
          type: 'inspectors/comprehensiveEcharts',
          payload: {
            resolve,
            startTime: dates,
            endTime: moment().format().substring(0, 10),
          },
        })
      }).then((res) => {
        this.setState({
          timeData: res.timeData,
          departmentCompreClassNames: res.departmentCompreClassNames,
          superData: res.superData
        })
      });
    } else if (val === '2') {
      this.setState({
        community: '',
        caseBigType: '',
        caseSmallType: '',
        orderStatus: '',
        caseBigType: '',
        caseSmallType: '',
        listSmallAllClass: '',
      })
      // 城管工单 echarts data
      new Promise(resolve => {
        this.props.dispatch({
          type: 'category/categoryInspectorFetch',
          payload: {
            resolve,
            startTime: dates,
            endTime: moment().format().substring(0, 10),
          }
        });
      }).then(res => {
        this.setState({
          inspectorsClassNames: res.inspectorsClassNames,
          inspectorsCompreate: res.inspectorsCompreate,
          urbanManagementData: res.urbanManagementData
        })
      })
    } else if (val === '3') {
      this.setState({
        community: '',
        caseBigType: '',
        caseSmallType: '',
        orderStatus: '',
        caseBigType: '',
        caseSmallType: '',
        listSmallAllClass: '',
      })
      // 领导交办 echarts data
      new Promise(resolve => {
        this.props.dispatch({
          type: 'category/categoryLeaderFetch',
          payload: {
            resolve,
            startTime: dates,
            endTime: moment().format().substring(0, 10),
          }
        });
      }).then(res => {
        this.setState({
          leaderCompreate: res.leaderCompreate,
          leaderClassNames: res.leaderClassNames,
          leadershipData: res.leadershipData
        })
      })
    } else if (val === '4') {
      this.setState({
        community: '',
        caseBigType: '',
        caseSmallType: '',
        orderStatus: '',
        caseBigType: '',
        caseSmallType: '',
        listSmallAllClass: '',
      })
      // 投诉工单 echarts data
      new Promise(resolve => {
        this.props.dispatch({
          type: 'category/categoryComplainFetch',
          payload: {
            resolve,
            startTime: dates,
            endTime: moment().format().substring(0, 10),
          }
        });
      }).then(res => {
        this.setState({
          complainDate: res.complainDate,
          complainClassNames: res.complainClassNames,
          complaintData: res.complaintData
        })
      })
    }
    this.setState({
      communityDepComprehensive: '',
      caseBigTypeDepComprehensive: '',
      statusDepComprehensive: '',
    });
    form.setFieldsValue({ 'rangeDepCom': range(7) });
    form.setFieldsValue({ 'day': 7 })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { select, inspectors } = this.props;
    const { rangeDepCom, chartKey, listbigAllClass, listSmallAllClass, communityDepComprehensive, statusDepComprehensive } = this.state;
    const { communityList, bigClassListSelect, typeList, convergenceProgramList } = select;
    return (
      <div id="listTitleContent">
        <Breadcrumb separator=">">
          <span id="breadcrumbIcon" />
          <Breadcrumb.Item>统计分析</Breadcrumb.Item>
          <Breadcrumb.Item>类别分析</Breadcrumb.Item>
        </Breadcrumb>
        <div id="tableForm">
          <h3 id="listTitle" style={{ paddingBottom: 20 }}>类别分析</h3>
        </div>
        <div id="listTitleDetailTab" style={{boxShadow:'0 2px 6px 0 rgba(0, 0, 0, 0.3)', background:'#fff',marginBottom:'5%'}}>
          <div style={{ borderRadius: '25px 0 0 0', marginTop: '16px', marginBottom: '-20px' ,boxShadow:'0 2px 6px 0 rgba(0, 0, 0, 0.3)'}}>
            <Tabs defaultActiveKey="1" tabBarGutter={0} onChange={this.callback.bind(this)} type="card">
              <TabPane tab="综合执法" key="1" />
              <TabPane tab="城管工单" key="2" />
              <TabPane tab="领导交办" key="3" />
              <TabPane tab="投诉工单" key="4" />
            </Tabs>
          </div>
          <div style={{ background: '#fff', padding: '20px', marginTop: 10 }} id="listTitleDetailTabAnimate">
            <div style={{ borderBottom: '1px solid #DCDCDC', padding: '0 20px' }} id="tableListForm">
              <Form layout="inline">
                {
                  chartKey === '1' ? (
                    <Row gutter={{ md: 24, lg: 48, xl: 48 }} style={{ marginTop: 10, padding: 10 }}>
                      <Col lg={6} md={12} sm={12}>
                        <FormItem label="时间">
                          {getFieldDecorator('day', {
                            initialValue: 7
                          })(
                            <Select style={{ width: '100%' }} onChange={this.depComChange}>
                              <Option value={7}>最近7天</Option>
                              <Option value={15}>最近15天</Option>
                              <Option value={30}>最近30天</Option>
                            </Select>
                          )}
                        </FormItem>
                      </Col>
                      <Col lg={6} md={12} sm={12}>
                        <FormItem label="">
                          {getFieldDecorator('rangeDepCom', {
                            initialValue: rangeDepCom
                          })(
                            <RangePicker style={{ width: '100%' }} allowClear={false} disabledDate={this.disabledDepComDate} onChange={this.depComDateChange.bind(this)} />
                          )}
                        </FormItem>
                      </Col>
                      <Col lg={6} md={12} sm={12}>
                        <FormItem label="社区">
                          {getFieldDecorator('community')(
                            <Select placeholder="请选择社区" allowClear style={{ width: '100%' }} onChange={this.onDepComCommunity.bind(this)}>
                              {
                                communityList ?
                                  (communityList.map((val) => {
                                    return (
                                      <Select.Option key={val.id} value={val.code}>{val.desp}</Select.Option>
                                    )
                                  })) : ''
                              }
                            </Select>
                          )}
                        </FormItem>
                      </Col>
                      <Col lg={6} md={12} sm={12}>
                        <FormItem label="工单类别">
                          {getFieldDecorator('caseType')(
                            <Select placeholder="请选择工单类别" allowClear style={{ width: '100%' }} onChange={this.onDepComCaseType.bind(this)}>
                              {
                                bigClassListSelect ?
                                  (bigClassListSelect.map((val) => {
                                    return (
                                      <Select.Option key={val.id} value={val.code}>{val.desp}</Select.Option>
                                    )
                                  })) : ''
                              }
                            </Select>
                          )}
                        </FormItem>
                      </Col>
                      <Col lg={6} md={12} sm={12}>
                        <FormItem label="工单状态">
                          {getFieldDecorator('caseStatus')(
                            <Select placeholder="请选择工单状态" allowClear style={{ width: '100%' }} onChange={this.onDepComStatus.bind(this)}>
                              <Select.Option value={4}>已结案</Select.Option>
                              <Select.Option value={3}>待结案</Select.Option>
                              <Select.Option value={2}>已处理</Select.Option>
                              <Select.Option value={1}>待处理</Select.Option>
                            </Select>
                          )}
                        </FormItem>
                      </Col>
                      <Col lg={18} md={12} sm={12} style={{ textAlign: 'right', padding: '4px 0' }}>
                        <Button style={{ marginRight: 0, marginLeft: 16 }} type='primary' onClick={this.printDeparmentCom}>
                          打印
                        </Button>
                      </Col>
                    </Row>
                  ) : (chartKey === '2' ? (
                    <Row gutter={{ md: 24, lg: 48, xl: 48 }} style={{ marginTop: 10, padding: 10 }}>
                      <Col lg={6} md={12} sm={12}>
                        <FormItem label="时间">
                          {getFieldDecorator('day', {
                            initialValue: 7
                          })(
                            <Select style={{ width: '100%' }} onChange={this.depComChange}>
                              <Option value={7}>最近7天</Option>
                              <Option value={15}>最近15天</Option>
                              <Option value={30}>最近30天</Option>
                            </Select>
                          )}
                        </FormItem>
                      </Col>
                      <Col lg={6} md={12} sm={12}>
                        <FormItem label="">
                          {getFieldDecorator('rangeDepCom', {
                            initialValue: rangeDepCom
                          })(
                            <RangePicker style={{ width: '100%' }} allowClear={false} disabledDate={this.disabledDepComDate} onChange={this.depComDateChange.bind(this)} />
                          )}
                        </FormItem>
                      </Col>
                      <Col lg={6} md={12} sm={12}>
                        <FormItem label="社区">
                          {getFieldDecorator('communityWE')(
                            <Select placeholder="请选择社区" allowClear style={{ width: '100%' }} onChange={this.onDepComCommunity.bind(this)}>
                              {
                                communityList ?
                                  (communityList.map((val) => (
                                    <Select.Option key={val.id} value={val.code}>{val.desp}</Select.Option>
                                  ))) : ''
                              }
                            </Select>
                          )}
                        </FormItem>
                      </Col>
                      <Col lg={6} md={12} sm={12}>
                        <FormItem label="案件大类">
                          {getFieldDecorator('caseBigTypeSearch')(
                            <Select placeholder="请选择案件大类" allowClear style={{ width: '100%' }} onChange={this.bigClassSearch}>
                              {listbigAllClass.map((val) => (
                                <Select.Option key={val.id} value={val.code}>{val.desp}</Select.Option>
                              ))}
                            </Select>
                          )}
                        </FormItem>
                      </Col>
                      <Col lg={6} md={12} sm={12}>
                        <FormItem label="案件小类">
                          {getFieldDecorator('caseSmallTypeSearch')(
                            <Select placeholder="请选择案件小类" allowClear style={{ width: '100%' }} onChange={this.smallClassSearch}>
                              {listSmallAllClass ? listSmallAllClass.map((val) => (
                                <Select.Option key={val.id} value={val.code}>{val.desp}</Select.Option>
                              )) : ''}
                            </Select>
                          )}
                        </FormItem>
                      </Col>
                      <Col lg={6} md={12} sm={12}>
                        <FormItem label="工单状态">
                          {getFieldDecorator('caseStatus')(
                            <Select placeholder="请选择工单状态" allowClear style={{ width: '100%' }} onChange={this.onDepComStatus.bind(this)}>
                              <Select.Option value={4}>已结案</Select.Option>
                              <Select.Option value={3}>待结案</Select.Option>
                              <Select.Option value={2}>已处理</Select.Option>
                              <Select.Option value={1}>待处理</Select.Option>
                            </Select>
                          )}
                        </FormItem>
                      </Col>
                      <Col lg={12} md={12} sm={12} style={{ textAlign: 'right', padding: '4px 0' }}>
                        <Button style={{ marginRight: 0, marginLeft: 16 }} type='primary' onClick={this.printDeparmentCom}>
                          打印
                        </Button>
                      </Col>
                    </Row>
                  ) : (chartKey === '3' ? (
                    <Row gutter={{ md: 24, lg: 48, xl: 48 }} style={{ marginTop: 10, padding: 10 }}>
                      <Col lg={6} md={12} sm={12}>
                        <FormItem label="时间">
                          {getFieldDecorator('day', {
                            initialValue: 7
                          })(
                            <Select style={{ width: '100%' }} onChange={this.depComChange}>
                              <Option value={7}>最近7天</Option>
                              <Option value={15}>最近15天</Option>
                              <Option value={30}>最近30天</Option>
                            </Select>
                          )}
                        </FormItem>
                      </Col>
                      <Col lg={6} md={12} sm={12}>
                        <FormItem label="">
                          {getFieldDecorator('rangeDepCom', {
                            initialValue: rangeDepCom
                          })(
                            <RangePicker style={{ width: '100%' }} allowClear={false} disabledDate={this.disabledDepComDate} onChange={this.depComDateChange.bind(this)} />
                          )}
                        </FormItem>
                      </Col>
                      <Col lg={6} md={12} sm={12}>
                        <FormItem label="片区">
                          {getFieldDecorator('community1')(
                            <Select placeholder="请选择社区" allowClear style={{ width: '100%' }} onChange={this.onDepComCommunity.bind(this)}>
                              {
                                communityList ?
                                  (communityList.map((val) => (
                                    <Select.Option key={val.id} value={val.code}>{val.desp}</Select.Option>
                                  ))) : ''
                              }
                            </Select>
                          )}
                        </FormItem>
                      </Col>
                      <Col lg={6} md={12} sm={12}>
                        <FormItem label="工单类型">
                          {getFieldDecorator('orderType')(
                            <Select placeholder="请选择工单类型" allowClear style={{ width: '100%' }} onChange={this.workOrderType.bind(this)}>
                              {typeList.map((val) => (
                                <Select.Option key={val.id} value={val.code}>{val.desp}</Select.Option>
                              ))}
                            </Select>
                          )}
                        </FormItem>
                      </Col>
                      <Col lg={6} md={12} sm={12}>
                        <FormItem label="工单状态">
                          {getFieldDecorator('caseStatus')(
                            <Select placeholder="请选择工单状态" allowClear style={{ width: '100%' }} onChange={this.onDepComStatus.bind(this)}>
                              <Select.Option value={4}>已结案</Select.Option>
                              <Select.Option value={3}>待结案</Select.Option>
                              <Select.Option value={2}>已处理</Select.Option>
                              <Select.Option value={1}>待处理</Select.Option>
                            </Select>
                          )}
                        </FormItem>
                      </Col>
                      <Col lg={18} md={12} sm={12} style={{ textAlign: 'right', padding: '4px 0' }}>
                        <Button style={{ marginRight: 0, marginLeft: 16 }} type='primary' onClick={this.printDeparmentCom}>
                          打印
                        </Button>
                      </Col>
                    </Row>) : (
                      chartKey === '4' ? (
                        <Row gutter={{ md: 24, lg: 48, xl: 48 }} style={{ marginTop: 10, padding: 10 }}>
                          <Col lg={6} md={12} sm={12}>
                            <FormItem label="时间">
                              {getFieldDecorator('day', {
                                initialValue: 7
                              })(
                                <Select style={{ width: '100%' }} onChange={this.depComChange}>
                                  <Option value={7}>最近7天</Option>
                                  <Option value={15}>最近15天</Option>
                                  <Option value={30}>最近30天</Option>
                                </Select>
                              )}
                            </FormItem>
                          </Col>
                          <Col lg={6} md={12} sm={12}>
                            <FormItem label="">
                              {getFieldDecorator('rangeDepCom', {
                                initialValue: rangeDepCom
                              })(
                                <RangePicker style={{ width: '100%' }} allowClear={false} disabledDate={this.disabledDepComDate} onChange={this.depComDateChange.bind(this)} />
                              )}
                            </FormItem>
                          </Col>
                          <Col lg={6} md={12} sm={12}>
                            <FormItem label="社区">
                              {getFieldDecorator('community')(
                                <Select placeholder="请选择社区" allowClear style={{ width: '100%' }} onChange={this.onDepComCommunity.bind(this)}>
                                  {
                                    communityList ?
                                      (communityList.map((val) => (
                                        <Select.Option key={val.id} value={val.code}>{val.desp}</Select.Option>
                                      ))) : ''
                                  }
                                </Select>
                              )}
                            </FormItem>
                          </Col>
                          <Col lg={6} md={12} sm={12}>
                            <FormItem label="归口类型">
                              {getFieldDecorator('underCentralizedType', {
                                rules: [
                                  {
                                    required: false,
                                    message: '请填写归口类型',
                                  },
                                ],
                              })(
                                <Select placeholder="请选择归口类型" allowClear style={{ width: '100%' }} onChange={this.onConvergenceProgram.bind(this)}>
                                  {convergenceProgramList.map((val) => (
                                    <Select.Option key={val.id} value={val.completeCases}>{val.completeCases}</Select.Option>
                                  ))}
                                </Select>
                              )}
                            </FormItem>
                          </Col>
                          <Col lg={6} md={12} sm={12}>
                            <FormItem label="工单状态">
                              {getFieldDecorator('caseStatus')(
                                <Select placeholder="请选择工单状态" allowClear style={{ width: '100%' }} onChange={this.onDepComStatus.bind(this)}>
                                  <Select.Option value={4}>已结案</Select.Option>
                                  <Select.Option value={3}>待结案</Select.Option>
                                  <Select.Option value={2}>已处理</Select.Option>
                                  <Select.Option value={1}>待处理</Select.Option>
                                </Select>
                              )}
                            </FormItem>
                          </Col>
                          <Col lg={18} md={12} sm={12} style={{ textAlign: 'right', padding: '4px 0' }}>
                            <Button style={{ marginRight: 0, marginLeft: 16 }} type='primary' onClick={this.printDeparmentCom}>
                              打印
                            </Button>
                          </Col>
                        </Row>
                      ) : '')))
                }
              </Form>
            </div>
          </div>
          <p style={{ width: '100%', padding: '0 40px 20px 40px', background: '#fff', marginBottom: '0' }}>
            <span style={{ color: '#333' }}>关键指标<span style={{ color: '#666' }}>（本页数据根据昨日数据计算。）</span></span>
          </p>
          <div style={{ background: '#fff' }}>
            <div id='myChartDepCom' style={{ width: '100%', height: 500 }} />
            <div style={{ padding: '0 0 40px 40px' }}>
              <div style={{ lineHeight: '40px' }}>
                <span style={{ color: '#333', fontWeight: 'bolder', display: 'inline-block', width: 80 }}>片区</span>
                <span style={{ color: '#666', display: 'inline-block' }}>
                  {
                    this.state.community == 1 ? '翠林山庄' : (
                      this.state.community == 2 ? '金尧花园' : (
                        this.state.community == 3 ? '青田雅居' : (
                          this.state.community == 4 ? '王子楼社区' : (
                            this.state.community == 5 ? '吴边社区' : (
                              this.state.community == 6 ? '尧安新村' : (
                                this.state.community == 7 ? '尧辰社区' : (
                                  this.state.community == 8 ? '尧化社区' : (
                                    this.state.community == 9 ? '尧化新村' : (
                                      this.state.community == 10 ? '尧化仙居' : (
                                        this.state.community == 11 ? '尧胜社区' : (
                                          this.state.community == 12 ? '尧石二村' : (
                                            this.state.community == 13 ? '尧新社区' : (
                                              this.state.community == 14 ? '尧化街道' : '未选择'
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
                    )
                  }
                </span>
              </div>
              <div style={{ lineHeight: '40px' }}>
                <span style={{ color: '#333', fontWeight: 'bolder', display: 'inline-block', width: 80 }}>工单状态</span>
                <span style={{ color: '#666', display: 'inline-block' }}>
                  {statusDepComprehensive === 1 ? '待处理' : (statusDepComprehensive === 2 ? '已处理' : (statusDepComprehensive === 3 ? '待结案' : (statusDepComprehensive === 4 ? '已结案' : '未选择')))}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default Home;
