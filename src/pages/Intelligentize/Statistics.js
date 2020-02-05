/* eslint-disable eqeqeq */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/sort-comp */
/* eslint-disable react/no-unused-state */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import Link from 'umi/link';
import { Row, Col, Form, Input, Select, Button, DatePicker, Table, Radio, Modal, Breadcrumb } from 'antd';
// import BaseMenu from '../../../components/SiderMenu/BaseMenu';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const RadioGroup = Radio.Group;
@connect(({ home }) => ({
  home
}))
@Form.create()
class Workplace extends PureComponent {
  state = {
    formValues: {},
    visible: false,
    modalCommunityName: '',
    disabledDateSet: moment().format().substring(0, 10),
    nextPlanOne: '',
  };

  componentDidMount() {

  }

  // 设置 弹框
  showModal = (community) => {
    this.setState({
      visible: true,
      modalCommunityName: community.partNumber,
      nextPlanOne: community.nextPlan
    });
  };

  handleOk(e) {
    e.preventDefault();
    const currentDate = moment().format().substring(0, 10);
    this.props.form.validateFields((err, values) => {
      this.props.dispatch({
        type: 'home/statisticsThresholdFetchs',
        payload: {
          partNumber: this.state.modalCommunityName,
          codeTime: currentDate,
          nextPlan: values.orderThreshold ? values.orderThreshold : this.state.nextPlanOne,
        },
        callback: res => {
          if (res) {
            this.props.dispatch({
              type: 'home/statisticsFetch',
              payload: {
                date: currentDate,
              }
            })
          }
        }
      });
      this.setState({
        visible: false,
        modalCommunityName: '',
      });
      this.props.form.setFieldsValue({ 'orderThreshold': '' })
    });
  }
  ;
  handleCancel() {
    const { form } = this.props;
    this.setState({
      visible: false,
      modalCommunityName: '',
    });
    form.setFieldsValue({ 'orderThreshold': '' })
  }
  ;
  componentWillMount() {
    const currentDate = moment().format().substring(0, 10);
    this.props.dispatch({
      type: 'home/statisticsFetch',
      payload: {
        date: currentDate,
      }
    });
  }
  ;
  // 查询
  handleSearch = (e) => {
    e.preventDefault();
    const currentDate = moment().format().substring(0, 10);
    this.props.dispatch({
      type: 'home/statisticsFetch',
      payload: {
        date: this.state.disabledDateSet ? this.state.disabledDateSet : currentDate,
      }
    });
    this.setState({
      disabledDateSet: this.state.disabledDateSet ? this.state.disabledDateSet : currentDate,
    })
  };

  // 重置
  handleFormReset = () => {
    const currentDate = moment().format().substring(0, 10);
    this.props.form.resetFields();
    this.props.dispatch({
      type: 'home/statisticsFetch',
      payload: {
        date: currentDate,
      }
    });
    this.setState({
      disabledDateSet: currentDate
    })
  };

  // 查询
  queryTime = () => {
    this.props.dispatch({
      type: 'home/querTimes',
      payload: {
        date: this.state.disabledDateSet
      },
      callback: res => {
      }
    })
  }

  // 大于今天的日期不可选
  disabledStatisticsDate = current => current && current > moment().endOf('day');

  statisticsDate(val) {
    const currentDate = moment().format().substring(0, 10);
    this.setState({
      disabledDateSet: moment(val).format('YYYY-MM-DD'),
    });
  }

  // 前一天
  beforeSearchDate() {
    const beforeDate = moment(this.state.disabledDateSet).add(-1, 'days').format('YYYY-MM-DD');
    this.setState({
      disabledDateSet: beforeDate,
    })
  }

  // 后一天
  afterSearchDate() {
    const afterDate = moment(this.state.disabledDateSet).add(1, 'days').format('YYYY-MM-DD');
    this.setState({
      disabledDateSet: afterDate,
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { home } = this.props;
    const { statisticsList } = home;
    const disabledSet = !(this.state.disabledDateSet > moment().format().substring(0, 10) || this.state.disabledDateSet === moment().format().substring(0, 10));
    const disabledAfter = !!(this.state.disabledDateSet > moment().format().substring(0, 10) || this.state.disabledDateSet === moment().format().substring(0, 10))
    let goodsData = [];
    if (statisticsList.list.length > 0) {
      let municipal = 0;
      let districtUrbanManage = 0;
      let districtEnforcement = 0;
      let streetUrbanManage = 0;
      let streetEnforcement = 0;
      let todayOrderNum = 0;
      let todayShouldNum = 0;
      const hasBeenHandled = 0;
      let todayFinshedNum = 0;
      let nextPlan = 0;
      let partNumber = 0
      statisticsList.list.forEach(item => {
        municipal = Number(item.municipal);
        districtUrbanManage = Number(item.districtUrbanManage);
        districtEnforcement = Number(item.districtEnforcement);
        streetUrbanManage = Number(item.streetUrbanManage);
        streetEnforcement = Number(item.streetEnforcement);
        todayOrderNum = Number(item.todayOrderNum);
        todayShouldNum = Number(item.todayShouldNum);
        todayFinshedNum = Number(item.todayFinshedNum);
        nextPlan = Number(item.nextPlan);
        partNumber = Number(item.partNumber)
      });
      goodsData = statisticsList.list
    }
    const columns = [
      {
        title: '片区',
        dataIndex: 'community',
        key: 'community',
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
            dataIndex: 'districtEnforcement',
            key: 'districtEnforcement',
          }
        ]
      },
      {
        title: '街道工单',
        dataIndex: 'statu',
        children: [
          {
            title: '城管工单',
            dataIndex: 'streetUrbanManage',
            key: 'streetUrbanManage',
          },
          {
            title: '综合执法工单',
            dataIndex: 'streetEnforcement',
            key: 'streetEnforcement',
          }
        ]
      },
      {
        title: '今日工单总量',
        dataIndex: 'todayOrderNum',
      },
      {
        title: '今日应处理工单',
        dataIndex: 'todayShouldNum',
      },
      {
        title: '今日已处理工单',
        dataIndex: 'todayFinshedNum',
      },
      {
        title: '明日计划量',
        dataIndex: 'nextPlan',
        render: (text, record) => (
          <span>{text || 0}</span>
        )
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record, index) => {
          return (
            <Button id='statisticsButton' onClick={this.showModal.bind(this, record)} disabled={disabledSet || record.community == '总 计'}>{record.community == "总 计" ? '不可操作' : '设置'}</Button>
          )
        },
      },
    ];
    return (
      <div id="listTitleContent">
        <Breadcrumb separator=">">
          <span id="breadcrumbIcon" />
          <Breadcrumb.Item>首页</Breadcrumb.Item>
          <Breadcrumb.Item href="">智能生成</Breadcrumb.Item>
          <Breadcrumb.Item href="">调剂生成</Breadcrumb.Item>
        </Breadcrumb>
        <div id="tableForm">
          <h3 id="listTitle">调剂生成</h3>
          <Form onSubmit={this.handleSearch} layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={9} sm={8}>
                <FormItem label="日期">
                  <DatePicker
                    placeholder="请输入日期"
                    format="YYYY-MM-DD"
                    value={moment(this.state.disabledDateSet, 'YYYY-MM-DD')}
                    disabledDate={this.disabledStatisticsDate}
                    onChange={this.statisticsDate.bind(this)}
                    style={{ width: '100%' }}
                  />
                </FormItem>
              </Col>
              <Col md={9} sm={8}>
                <div style={{ padding: '4px 0' }}>
                  <Button type="primary" onClick={this.beforeSearchDate.bind(this)}>前一天</Button>
                  <Button type="primary" style={{ marginLeft: 16 }} onClick={this.afterSearchDate.bind(this)} disabled={disabledAfter}>后一天</Button>
                </div>
              </Col>
              <Col md={6} sm={8} style={{ textAlign: 'right', padding: '4px 0' }}>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button id="buttonReset" style={{ marginRight: 0, marginLeft: 16 }} onClick={this.handleFormReset}>
                  重置
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
        <div id="listTableStatistics2" style={{ padding: '40px' }}>
          <Table
            columns={columns}
            dataSource={goodsData}
            rowKey={record => record.community}
            pagination={false}
          />
        </div>
        <Modal
          title="设置"
          visible={this.state.visible}
          onOk={this.handleOk.bind(this)}
          onCancel={this.handleCancel.bind(this)}
        >
          <Form layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={24} sm={24}>
                <FormItem label="每天工单阀值">
                  {getFieldDecorator('orderThreshold')(
                    <Input placeholder="请输入" style={{ width: '100%' }} />
                  )}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default Workplace;
