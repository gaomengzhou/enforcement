/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-shadow */
/* eslint-disable class-methods-use-this */
/* eslint-disable eqeqeq */
/* eslint-disable react/no-unused-state */
import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Row, Col, Form, Button, DatePicker, Table, Tabs, Select, Modal, Breadcrumb } from 'antd';
import range from './range';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;
const FormItem = Form.Item;
@connect(({ statisticsTotal, }) => ({
  statisticsTotal,
}))
@Form.create()
class Workplace extends PureComponent {
  state = {
    expandedRowKeys: [],
    key: '',
    keyLeader: '',
    expandedRowKeysLeader: [],
    keyInt: '',
    expandedRowKeysInt: [],
    dayDep: 7,
    dayDepDisabled: 7,
    range: range(7),
    dayLeader: 7,
    dayLeaderDisabled: 7,
    rangeLeader: range(7),
    dayInt: 7,
    dayIntDisabled: 7,
    rangeInt: range(7),
    departmentType: 7,
    departmentTypeDisabled: 7,
    departmentTypeInt: range(7),

    dayIntStart: '',
    dayIntEnd: '',
    visibleExcelDep: false,
    visibleExcelLeader: false,
    visibleExcelInt: false,
    visibleExceDPM: false,
    bigTimeDown: '',
    endTimeDown: '',
  };

  componentWillMount() {
    const date = moment().subtract(7, 'days').calendar();
    const reg = new RegExp('/', 'g');
    const dates = date.replace(reg, '-');

    this.props.dispatch({
      type: 'statisticsTotal/totalDepListFetch',
      payload: {
        startTime: dates,
        endTime: moment().format().substring(0, 10),
      }
    });

    this.props.dispatch({
      type: 'statisticsTotal/totalLeaderListFetch',
      payload: {
        startTime: dates,
        endTime: moment().format().substring(0, 10),
      }
    });
    this.props.dispatch({
      type: 'statisticsTotal/totalIntelligenceListFetch',
      payload: {
        startTime: dates,
        endTime: moment().format().substring(0, 10),
      }
    });
    this.props.dispatch({
      type: 'statisticsTotal/totalSectionListFetch',
      payload: {
        startTime: dates,
        endTime: moment().format().substring(0, 10),
      }
    });
    this.setState({
      bigTimeDown: dates,
      endTimeDown: moment().format().substring(0, 10),
    });
  }

  // 部门派发 时间查询
  handleDepChange = (dayDep) => {
    const { form } = this.props;
    const rangeTime = range(dayDep);
    this.setState({
      range: rangeTime,
      dayDepDisabled: dayDep,
    });
    this.props.dispatch({
      type: 'statisticsTotal/totalDepListFetch',
      payload: {
        startTime: moment(rangeTime[0]).format('YYYY-MM-DD'),
        endTime: moment(rangeTime[1]).format('YYYY-MM-DD'),
      }
    });
    this.setState({
      bigTimeDown: moment(rangeTime[0]).format('YYYY-MM-DD'),
      endTimeDown: moment(rangeTime[1]).format('YYYY-MM-DD'),
    });
    form.setFieldsValue({ 'range': rangeTime });
  };

  // 科室类别 时间查询
  departmentType = (dayDep) => {
    const { form } = this.props;
    const rangeTime = range(dayDep);
    this.setState({
      departmentTypeInt: rangeTime,
      departmentTypeDisabled: dayDep,
    });
    this.props.dispatch({
      type: 'statisticsTotal/totalSectionListFetch',
      payload: {
        startTime: moment(rangeTime[0]).format('YYYY-MM-DD'),
        endTime: moment(rangeTime[1]).format('YYYY-MM-DD'),
      }
    });
    this.setState({
      bigTimeDown: moment(rangeTime[0]).format('YYYY-MM-DD'),
      endTimeDown: moment(rangeTime[1]).format('YYYY-MM-DD'),
    });
    form.setFieldsValue({ 'departmentTypeInt': rangeTime });
  };

  // 时间范围区间 智能生成
  disabledDepDate = current => current && current > moment().endOf('day') || current < moment().subtract(this.state.dayDepDisabled + 1, 'day');

  handleDepDateChange = (dayDep) => {
    const start = moment(dayDep[0]).format('YYYY-MM-DD');
    const end = moment(dayDep[1]).format('YYYY-MM-DD');
    this.props.dispatch({
      type: 'statisticsTotal/totalDepListFetch',
      payload: {
        startTime: start,
        endTime: end,
      }
    });
    this.setState({
      bigTimeDown: moment(dayDep[0]).format('YYYY-MM-DD'),
      endTimeDown: moment(dayDep[1]).format('YYYY-MM-DD'),
    });
  };

  // 领导交办 时间查询
  handleLeaderChange = (dayLeader) => {
    const { form } = this.props;
    const rangeTime = range(dayLeader);
    this.setState({
      rangeLeader: rangeTime,
      dayLeaderDisabled: dayLeader,
    });
    this.props.dispatch({
      type: 'statisticsTotal/totalLeaderListFetch',
      payload: {
        startTime: moment(rangeTime[0]).format('YYYY-MM-DD'),
        endTime: moment(rangeTime[1]).format('YYYY-MM-DD'),
      }
    });
    this.setState({
      bigTimeDown: moment(rangeTime[0]).format('YYYY-MM-DD'),
      endTimeDown: moment(rangeTime[1]).format('YYYY-MM-DD'),
    });
    form.setFieldsValue({ 'rangeLeader': rangeTime });
  };

  // 时间范围区间 智能生成
  disabledLeaderDate = current => current && current > moment().endOf('day') || current < moment().subtract(this.state.dayLeaderDisabled + 1, 'day');

  handleLeaderDateChange = (dayLeader) => {
    const start = moment(dayLeader[0]).format('YYYY-MM-DD');
    const end = moment(dayLeader[1]).format('YYYY-MM-DD');
    this.props.dispatch({
      type: 'statisticsTotal/totalLeaderListFetch',
      payload: {
        startTime: start,
        endTime: end,
      }
    });
    this.setState({
      bigTimeDown: moment(dayLeader[0]).format('YYYY-MM-DD'),
      endTimeDown: moment(dayLeader[1]).format('YYYY-MM-DD'),
    });
  };

  // 智能生成 时间段查询
  handleIntChange = (dayInt) => {
    const { form } = this.props;
    const rangeTime = range(dayInt);
    this.setState({
      rangeInt: rangeTime,
      dayIntDisabled: dayInt,
    });
    this.props.dispatch({
      type: 'statisticsTotal/totalIntelligenceListFetch',
      payload: {
        startTime: moment(rangeTime[0]).format('YYYY-MM-DD'),
        endTime: moment(rangeTime[1]).format('YYYY-MM-DD'),
      }
    });
    this.setState({
      bigTimeDown: moment(rangeTime[0]).format('YYYY-MM-DD'),
      endTimeDown: moment(rangeTime[1]).format('YYYY-MM-DD'),
    });
    form.setFieldsValue({ 'rangeInt': rangeTime });
  };

  // 时间范围区间 智能生成
  disabledDate = current => current && current > moment().endOf('day') || current < moment().subtract(this.state.dayIntDisabled + 1, 'day');

  // 智能生成 时间查询
  handleIntDateChange = (dayInt) => {
    const start = moment(dayInt[0]).format('YYYY-MM-DD');
    const end = moment(dayInt[1]).format('YYYY-MM-DD');
    this.props.dispatch({
      type: 'statisticsTotal/totalIntelligenceListFetch',
      payload: {
        startTime: start,
        endTime: end,
      }
    });
    this.setState({
      bigTimeDown: moment(dayInt[0]).format('YYYY-MM-DD'),
      endTimeDown: moment(dayInt[1]).format('YYYY-MM-DD'),
    });
  };

  // 科室类别 智能生成
  departmentTypeCheckDate = current => current && current > moment().endOf('day') || current < moment().subtract(this.state.dayIntDisabled + 1, 'day');

  // 科室类别 时间查询
  departmentTypeCheck = (dayInt) => {
    const start = moment(dayInt[0]).format('YYYY-MM-DD');
    const end = moment(dayInt[1]).format('YYYY-MM-DD');
    this.props.dispatch({
      type: 'statisticsTotal/totalSectionListFetch',
      payload: {
        startTime: start,
        endTime: end,
      }
    });
    this.setState({
      bigTimeDown: moment(dayInt[0]).format('YYYY-MM-DD'),
      endTimeDown: moment(dayInt[1]).format('YYYY-MM-DD'),
    });
  };

  open = (e, record) => {
    if (e.target.innerHTML == '查看详情') {
      const { expandedRowKeys } = this.state;
      expandedRowKeys.push(record.id);
      this.setState({
        key: record.id,
        expandedRowKeys: [...expandedRowKeys]
      });
      e.target.innerHTML = '收起'
    } else if (e.target.innerHTML == '收起') {
      const { expandedRowKeys } = this.state;
      expandedRowKeys.splice(expandedRowKeys.indexOf(record.id), 1);
      this.setState({
        expandedRowKeys: [...expandedRowKeys]
      });
      e.target.innerHTML = '查看详情';
    }
  };

  openLeader = (e, record) => {
    if (e.target.innerHTML == '查看详情') {
      const { expandedRowKeysLeader } = this.state;
      expandedRowKeysLeader.push(record.id);
      this.setState({
        keyLeader: record.id,
        expandedRowKeysLeader: [...expandedRowKeysLeader]
      });
      e.target.innerHTML = '收起'
    } else if (e.target.innerHTML == '收起') {
      const { expandedRowKeysLeader } = this.state;
      expandedRowKeysLeader.splice(expandedRowKeysLeader.indexOf(record.id), 1);
      this.setState({
        expandedRowKeysLeader: [...expandedRowKeysLeader]
      });
      e.target.innerHTML = '查看详情';
    }
  };

  openInt = (e, record) => {
    if (e.target.innerHTML == '查看详情') {
      const { expandedRowKeysInt } = this.state;
      expandedRowKeysInt.push(record.id);
      this.setState({
        keyInt: record.id,
        expandedRowKeysInt: [...expandedRowKeysInt]
      });
      e.target.innerHTML = '收起'
    } else if (e.target.innerHTML == '收起') {
      const { expandedRowKeysInt } = this.state;
      expandedRowKeysInt.splice(expandedRowKeysInt.indexOf(record.id), 1);
      this.setState({
        expandedRowKeysInt: [...expandedRowKeysInt]
      });
      e.target.innerHTML = '查看详情';
    }
  };

  // 部门派发 打印
  departmentPrint() {
    window.print();
  }

  // 领导交办 打印
  LeaderPrint() {
    window.print();
  }

  // 智能生成 打印
  intelligencePrint() {
    window.print();
  }

  // 导出表格 部门派发
  downExcelDep() {
    this.setState({
      visibleExcelDep: true,
    });
  }

  handleExcelOkDep() {
    this.props.dispatch({
      type: 'statisticsTotal/downloadExcelDepFetch',
      payload: {
        startT: this.state.bigTimeDown,
        endT: this.state.endTimeDown,
      }
    });
    this.setState({
      visibleExcelDep: false,
    });
  }

  handleExcelCancelDep() {
    this.setState({
      visibleExcelDep: false,
    });
  }

  // 导出表格 领导交办
  downExcelLeader() {
    this.setState({
      visibleExcelLeader: true,
    });
  }

  handleExcelOkLeader() {
    this.props.dispatch({
      type: 'statisticsTotal/downloadExcelLeaderFetch',
      payload: {
        startT: this.state.bigTimeDown,
        endT: this.state.endTimeDown,
      }
    });
    this.setState({
      visibleExcelDep: false,
    });

    this.setState({
      visibleExcelLeader: false,
    });
  }

  handleExcelCancelLeader() {
    this.setState({
      visibleExcelLeader: false,
    });
  }

  // 导出表格 智能生成
  downExcelInt() {
    this.setState({
      visibleExcelInt: true,
    });
  }

  handleExcelOkInt() {
    this.props.dispatch({
      type: 'statisticsTotal/downloadExcelIntFetch',
      payload: {
        startT: this.state.bigTimeDown,
        endT: this.state.endTimeDown,
      }
    })
    this.setState({
      visibleExcelInt: false,
    });
  }

  handleExcelCancelInt() {
    this.setState({
      visibleExcelInt: false,
    });
  }

  // 导出表格 科室内别
  downExcelDepartmentType() {
    this.setState({
      visibleExceDPM: true,
    });
  }
;
  handleExcelOkDPM() {
    this.props.dispatch({
      type: 'statisticsTotal/downloadExcelIntDPMFetch',
      payload: {
        startT: this.state.bigTimeDown,
        endT: this.state.endTimeDown,
      }
    })
    this.setState({
      visibleExceDPM: false,
    });
  }

  handleExcelCancelDPM() {
    this.setState({
      visibleExceDPM: false,
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { expandedRowKeys, range, rangeInt, rangeLeader, expandedRowKeysLeader, expandedRowKeysInt, departmentTypeInt } = this.state;
    const { statisticsTotal } = this.props;
    const { totalDepartmentList, totalIntelligenceList, totalLeaderList, totalSectionList } = statisticsTotal;
    const columns = [
      {
        title: '片区',
        dataIndex: 'community',
      },
      {
        title: '市级工单',
        dataIndex: 'municipal',
      },
      {
        title: '区级工单',
        dataIndex: 'address',
        children: [
          {
            title: '城管工单',
            dataIndex: 'districtUrbanManage',
            key: 'districtUrbanManage',
          },
          {
            title: '综合执法工单',
            dataIndex: 'districtLawEnforcement',
            key: 'districtLawEnforcement',
          }
        ]
      },
      {
        title: '街道工单',
        dataIndex: 'statu',
        children: [
          {
            title: '自处置工单',
            dataIndex: 'streetSelf',
            key: 'streetSelf',
          },
          {
            title: '派发工单',
            dataIndex: 'streetDistribute',
            key: 'streetDistribute',
          }
        ]
      },
      {
        title: '工单总数',
        dataIndex: 'totalOrder',
      },
      {
        title: '重办数量',
        dataIndex: 'rerun',
      },
      {
        title: '重办率',
        dataIndex: 'rerunRateDesc',
      },
      {
        title: '办结数量',
        dataIndex: 'finish',
      },
      {
        title: '办结率',
        dataIndex: 'finishRateDesc',
      },
      // {
      //   title: '操作',
      //   dataIndex: '',
      //   key: 'x',
      //   render: (record) => <a style={{ color: '##2B49C4' }} onClick={(e) => this.open(e, record)}>查看详情</a>
      // },
    ];
    const columnsLeader = [
      {
        title: '片区',
        dataIndex: 'community',
      },
      {
        title: '工单总数',
        dataIndex: 'totalOrder',
      },
      {
        title: '重办数量',
        dataIndex: 'rerun',
      },
      {
        title: '重办率',
        dataIndex: 'rerunRateDesc',
      },
      {
        title: '办结数量',
        dataIndex: 'finish',
      },
      {
        title: '办结率',
        dataIndex: 'finishRateDesc',
      },
      // {
      //   title: '操作',
      //   dataIndex: '', key: 'x',
      //   render: (record) => <a style={{ color: '##2B49C4' }} onClick={(e) => this.openLeader(e, record)}>查看详情</a>
      // },
    ];
    const columnsIntelligence = [
      {
        title: '片区',
        dataIndex: 'community',
      },
      {
        title: '投诉工单',
        dataIndex: 'complainNum',
      },
      {
        title: '城管工单',
        dataIndex: 'urbanManageNum',
      },
      {
        title: '综合执法工单',
        dataIndex: 'lawEnforceNum',
      },
      {
        title: '工单总数',
        dataIndex: 'totalOrder',
      },
      {
        title: '重办数量',
        dataIndex: 'rerun',
      },
      {
        title: '重办率',
        dataIndex: 'rerunRateDesc',
      },
      {
        title: '办结数量',
        dataIndex: 'finish',
      },
      {
        title: '办结率',
        dataIndex: 'finishRateDesc',
      },
      // {
      //   title: '操作',
      //   dataIndex: '', key: 'x',
      //   render: (record) => <a style={{ color: '##2B49C4' }} onClick={(e) => this.openInt(e, record)}>查看详情</a>
      // },
    ];
    return (
      <div id="listTitleContent">
        <Breadcrumb separator=">">
          <span id="breadcrumbIcon" />
          <Breadcrumb.Item>统计分析</Breadcrumb.Item>
          <Breadcrumb.Item>总体分析</Breadcrumb.Item>
        </Breadcrumb>
        <div id="tableForm">
          <h3 id="listTitle" style={{ paddingBottom: 0 }}>总体分析</h3>
        </div>
        <div id="listTableStatistics2">
          <div id="listTitleDetailTab" style={{ marginBottom: '5%' }}>
            <Tabs defaultActiveKey="1" onChange={this.callback} type="card">
              <TabPane tab="部门派发" key="1">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginTop: 10, padding: '10px 50px' }}>
                  <Col md={4} sm={8}>
                    <FormItem label="">
                      {getFieldDecorator('dayDep', {
                        initialValue: 7
                      })(
                        <Select style={{ width: '100%' }} onChange={this.handleDepChange}>
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
                        <RangePicker style={{ width: '100%' }} disabledDate={this.disabledDepDate} onChange={this.handleDepDateChange} />
                      )}
                    </FormItem>
                  </Col>
                  <Col md={14} sm={8} style={{ textAlign: 'right', padding: '4px 0' }}>
                    <Button type="primary" onClick={this.downExcelDep.bind(this)}>
                      导出表格
                    </Button>
                    <Button id="buttonReset" style={{ marginRight: 0, marginLeft: 16 }} onClick={this.departmentPrint.bind(this)}>
                      打印
                    </Button>
                  </Col>
                </Row>
                <div id="rowClassNameTotality">
                  <Table
                    rowClassName="disappear"
                    columns={columns}
                    dataSource={totalDepartmentList.list}
                    rowKey={(record) => record.id}
                    expandedRowKeys={expandedRowKeys}
                    // expandedRowRender={(record) => <Extend name={record.sign} totalOrder={record.totalOrder} hasAbolished={record.hasAbolished} toBeProcessed={record.toBeProcessed} toBeClosed={record.toBeClosed} hasBeenClosed={record.hasBeenClosed} />}
                    pagination={false}
                  />
                </div>
              </TabPane>
              <TabPane tab="领导交办" key="2">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginTop: 10, padding: 10 }}>
                  <Col md={4} sm={8}>
                    <FormItem label="">
                      {getFieldDecorator('dayLeader', {
                        initialValue: 7
                      })(
                        <Select style={{ width: '100%' }} onChange={this.handleLeaderChange}>
                          <Option value={7}>最近7天</Option>
                          <Option value={15}>最近15天</Option>
                          <Option value={30}>最近30天</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col md={6} sm={8}>
                    <FormItem label="">
                      {getFieldDecorator('rangeLeader', {
                        initialValue: rangeLeader
                      })(
                        <RangePicker style={{ width: '100%' }} disabledDate={this.disabledLeaderDate} onChange={this.handleLeaderDateChange} />
                      )}
                    </FormItem>

                  </Col>
                  <Col md={14} sm={8} style={{ textAlign: 'right', padding: '4px 0' }}>
                    <Button type="primary" onClick={this.downExcelLeader.bind(this)}>
                      导出表格
                    </Button>
                    <Button id="buttonReset" style={{ marginRight: 0, marginLeft: 16 }} onClick={this.LeaderPrint.bind(this)}>
                      打印
                    </Button>
                  </Col>
                </Row>
                <div id="rowClassNameTotality">
                  <Table
                    rowClassName="disappear"
                    columns={columnsLeader}
                    dataSource={totalLeaderList.list}
                    rowKey={(record) => record.id}
                    expandedRowKeys={expandedRowKeysLeader}
                    // expandedRowRender={(record) => <ExtendLeader name={record.sign} totalOrder={record.totalOrder} hasAbolished={record.hasAbolished} toBeProcessed={record.toBeProcessed} toBeClosed={record.toBeClosed} hasBeenClosed={record.hasBeenClosed} />}
                    pagination={false}
                  />
                </div>
              </TabPane>
              <TabPane tab="智能生成" key="3">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginTop: 10, padding: 10 }}>
                  <Col md={4} sm={8}>
                    <FormItem label="">
                      {getFieldDecorator('dayInt', {
                        initialValue: 7
                      })(
                        <Select style={{ width: '100%' }} onChange={this.handleIntChange}>
                          <Option value={7}>最近7天</Option>
                          <Option value={15}>最近15天</Option>
                          <Option value={30}>最近30天</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col md={6} sm={8}>
                    <FormItem label="">
                      {getFieldDecorator('rangeInt', {
                        initialValue: rangeInt
                      })(
                        <RangePicker style={{ width: '100%' }} disabledDate={this.disabledDate} onChange={this.handleIntDateChange} />
                      )}
                    </FormItem>

                  </Col>
                  <Col md={14} sm={8} style={{ textAlign: 'right', padding: '4px 0' }}>
                    <Button type="primary" onClick={this.downExcelInt.bind(this)}>
                      导出表格
                    </Button>
                    <Button id="buttonReset" style={{ marginRight: 0, marginLeft: 16 }} onClick={this.intelligencePrint.bind(this)}>
                      打印
                    </Button>
                  </Col>
                </Row>
                <div id="rowClassNameTotality">
                  <Table
                    rowClassName="disappear"
                    columns={columnsIntelligence}
                    dataSource={totalIntelligenceList.list}
                    rowKey={(record) => record.id}
                    expandedRowKeys={expandedRowKeysInt}
                    // expandedRowRender={(record) => <ExpendIntelligent name={record.sign} totalOrder={record.totalOrder} hasAbolished={record.hasAbolished} toBeProcessed={record.toBeProcessed} toBeClosed={record.toBeClosed} hasBeenClosed={record.hasBeenClosed} />}
                    pagination={false}
                  />
                </div>
              </TabPane>
              <TabPane tab="科室类别" key="4">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginTop: 10, padding: '10px 50px' }}>
                  <Col md={4} sm={8}>
                    <FormItem label="">
                      {getFieldDecorator('departmentType', {
                        initialValue: 7
                      })(
                        <Select style={{ width: '100%' }} onChange={this.departmentType.bind(this)}>
                          <Option value={7}>最近7天</Option>
                          <Option value={15}>最近15天</Option>
                          <Option value={30}>最近30天</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col md={6} sm={8}>
                    <FormItem label="">
                      {getFieldDecorator('departmentTypeInt', {
                        initialValue: departmentTypeInt
                      })(
                        <RangePicker style={{ width: '100%' }} disabledDate={this.departmentTypeCheckDate} onChange={this.departmentTypeCheck} />
                      )}
                    </FormItem>

                  </Col>
                  <Col md={14} sm={8} style={{ textAlign: 'right', padding: '4px 0' }}>
                    <Button type="primary" onClick={this.downExcelDepartmentType.bind(this)}>
                      导出表格
                    </Button>
                    <Button id="buttonReset" style={{ marginRight: 0, marginLeft: 16 }} onClick={this.departmentPrint.bind(this)}>
                      打印
                    </Button>
                  </Col>
                </Row>
                <div id="rowClassNameTotality">
                  <Table
                    rowClassName="disappear"
                    columns={columns}
                    dataSource={totalSectionList.list}
                    rowKey={(record) => record.id}
                    expandedRowKeys={expandedRowKeys}
                    // expandedRowRender={(record) => <Extend name={record.sign} totalOrder={record.totalOrder} hasAbolished={record.hasAbolished} toBeProcessed={record.toBeProcessed} toBeClosed={record.toBeClosed} hasBeenClosed={record.hasBeenClosed} />}
                    pagination={false}
                  />
                </div>
              </TabPane>
            </Tabs>
          </div>
        </div>
        <Modal
          title="部门派发-导出excel表格"
          visible={this.state.visibleExcelDep}
          onOk={this.handleExcelOkDep.bind(this)}
          onCancel={this.handleExcelCancelDep.bind(this)}
        >
          <p>请确定是否导出表格.</p>
        </Modal>
        <Modal
          title="领导交办-导出excel表格"
          visible={this.state.visibleExcelLeader}
          onOk={this.handleExcelOkLeader.bind(this)}
          onCancel={this.handleExcelCancelLeader.bind(this)}
        >
          <p>请确定是否导出表格.</p>
        </Modal>
        <Modal
          title="智能生成-导出excel表格"
          visible={this.state.visibleExcelInt}
          onOk={this.handleExcelOkInt.bind(this)}
          onCancel={this.handleExcelCancelInt.bind(this)}
        >
          <p>请确定是否导出表格.</p>
        </Modal>
        <Modal
          title="科室类别-导出excel表格"
          visible={this.state.visibleExceDPM}
          onOk={this.handleExcelOkDPM.bind(this)}
          onCancel={this.handleExcelCancelDPM.bind(this)}
        >
          <p>请确定是否导出表格.</p>
        </Modal>
      </div>
    );
  }
}

export default Workplace;
