/* eslint-disable no-underscore-dangle */
/* eslint-disable func-names */
/* eslint-disable no-shadow */
/* eslint-disable jsx-a11y/iframe-has-title */
/* eslint-disable eqeqeq */
/* eslint-disable react/no-unused-state */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import Link from 'umi/link';
import { Row, Col, Form, Input, Select, Button, DatePicker, Table, Radio, Modal, InputNumber, Breadcrumb } from 'antd';
import { mapIp } from '@/utils/ipConfig'

const FormItem = Form.Item;
const dateFormat = 'YYYY-MM-DD';
const baseSrc = `${mapIp}statistics.html`;
const newbaseSrc = `${mapIp}TrajectoryHS.html`;

@connect(({ map }) => ({
  map
}))
@Form.create()
class ShowMap extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      iframeSrc: baseSrc,
      newIframeSrc: newbaseSrc,
      visible: false,
      visible2: false,
      page: 1,
      pageSize: 10,
      startTime: moment().subtract(1, 'days').format('YYYY-MM-DD'),
      endTime: moment().add(5, 'days').format('YYYY-MM-DD'),
      // endTime: moment().format('YYYY-MM-DD'),
      gridStartTime: '',
      gridEndTime: '',
      taskNumber: '',
      sleGridId: '',
    }
  }

  componentWillMount() {
    const self = this;
    this.props.dispatch({
      type: 'map/patchMapCount',
      payload: {
        startTime: `${moment(this.getData(2)).format(dateFormat)} 00:00:00`,
        endTime: `${moment(this.getData(7)).format(dateFormat)} 23:59:59`,
      },
      callback: res => {
        if (res) {
          if (res.retCode == 1) {
            const thedata = {
              modelType: 'statistics',
              data: res.data,
            };
            self.setState({
              gridStartTime: moment(this.getData(2)).format(dateFormat),
              gridEndTime: moment(this.getData(7)).format(dateFormat),
            });
            const childFrame = document.getElementById("mapIframe");
            childFrame.contentWindow.postMessage(thedata, "*");
          }
        }
      }
    });

  }

  componentDidMount() {
    const self = this;
    window.receiveMessageFromMap = function (event) {
      if (event != undefined) {
        if (event.data.modalType === 'xctrajectory') {
          const { dispatch } = self.props;
          const { gridStartTime, gridEndTime, taskNumber, } = self.state;
          self.setState({
            sleGridId: event.data.id,
          });
          dispatch({
            type: 'map/gripHistoryList',
            payload: {
              page: 1,
              pageSize: 10,
              gridId: event.data.id,
              taskNumber,
              startTime: gridStartTime,
              endTime: gridEndTime,
            }
          })
          // console.log( '我是react,我接受到了来自iframe的模型ID：', event.data.id );
          self.showModal();
        }
      }
    }
    // eslint-disable-next-line no-undef
    window.addEventListener("message", receiveMessageFromMap, false);
  }

  getData = (i) => {
    const now = new Date();
    const nowTime = now.getTime();
    const day = now.getDay();
    const oneDayLong = 24 * 60 * 60 * 1000;
    const SundayTime = new Date(nowTime + (i - day) * oneDayLong);
    const y = SundayTime.getFullYear();
    const m = SundayTime.getMonth() + 1;
    const d = SundayTime.getDate();
    return `${y}-${m}-${d}`;
  }


  inputChange = (event) => {
    this.setState({
      taskNumber: event.target.value,
    });
  }


  // 分页
  handleTableChange = (page, size) => {
    this.setState({
      page,
      pageSize: size,
    });
  };


  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  showModal2 = (record) => {
    this.setState({
      newIframeSrc: `${mapIp}TrajectoryHS.html?${record.taskNumber}`,
      visible2: true,
    });
  };

  hideModal = () => {
    this.setState({
      visible: false,
    });
  };


  hideModal2 = () => {
    this.setState({
      visible2: false,
    });
  };

  reSetData = () => {
    this.props.form.resetFields(['number', 'endTime', 'startTime']);
    this.props.dispatch({
      type: 'map/patrolSettingList',
      payload: {
        page: 1,
        pageSize: 10,
      }
    })
  }

  handleSubmit = e => {
    const { dispatch } = this.props;
    e.preventDefault();
    const self = this;
    this.props.form.validateFields((err, _) => {
      if (!err) {
        dispatch({
          type: 'map/gripHistoryList',
          payload: {
            page: 1,
            pageSize: 10,
            gridId: self.state.sleGridId,
            taskNumber: self.state.taskNumber,
            startTime: `${moment(self.state.gridStartTime).format(dateFormat)} 00:00:00`,
            endTime: `${moment(self.state.gridEndTime).format(dateFormat)} 23:59:59`,
          }
        })
      }
      // this.props.dispatch({
      //   type: 'map/patrolSettingList',
      //   payload: {
      //     page: 1,
      //     pageSize: 10,
      //     startTime: this.state.startTime,
      //     endTime: this.state.endTime,
      //     taskNumber: values.number == '' ? null : values.number
      //   }
      // });
    });
  };

  dataRangeChange = (_, dateString) => {
    this.setState({
      startTime: dateString[0],
      endTime: dateString[1],
    });
  }

  gridDataRangeChange = (_, dateString) => {
    this.setState({
      gridStartTime: dateString[0],
      gridEndTime: dateString[1],
    });
  }


  queryPathByDate = () => {
    const { dispatch } = this.props;
    const { startTime, endTime, } = this.state;
    const self = this;
    dispatch({
      type: 'map/patchMapCount',
      payload: {
        startTime: `${moment(startTime).format(dateFormat)} 00:00:00`,
        endTime: `${moment(endTime).format(dateFormat)} 23:59:59`,
      },
      callback: res => {
        if (res) {
          if (res.retCode == 1) {
            const thedata = {
              modelType: 'statistics',
              data: res.data,
            };
            self.setState({
              gridStartTime: startTime,
              gridEndTime: endTime,
            });
            const childFrame = document.getElementById("mapIframe");
            childFrame.contentWindow.postMessage(thedata, "*");
          }
        }
      }
    });
  }


  render() {
    const that = this;
    const { getFieldDecorator } = this.props.form
    const { patchPatrolList } = this.props.map
    console.log(patchPatrolList)
    const {
      iframeSrc, newIframeSrc,
    } = this.state
    const {
      MonthPicker,
      RangePicker,
      WeekPicker
    } = DatePicker;

    const { Option } = Select

    const maxHeight = document.body.clientHeight / 1.25;
    const maxHeightModal = document.body.clientHeight / 2;
    const maxWidthModal = document.body.clientWidth / 2.1;

    function onChange(date, dateString) {
      // eslint-disable-next-line no-console
      console.log(date, dateString);
    }

    function handleChange(value) {
      // eslint-disable-next-line no-console
      console.log(`selected ${value}`);
    }

    function onChangeSelect(value) {
      // eslint-disable-next-line no-console
      console.log(`selected ${value}`);
    }

    const columns = [
      {
        title: '巡查编号',
        dataIndex: 'taskNumber',
        key: 'num',
      },
      {
        title: '巡查日期',
        dataIndex: 'startTime',
        key: 'dates',
      },
      {
        title: '巡查人员',
        dataIndex: 'patrolPersonName',
        key: 'pepoper',
      },
      {
        title: '巡查轨迹',
        key: 'address',
        render: (_, record) => <a onClick={() => this.showModal2(record)}>查看</a>,
      },
      {
        title: '巡查时间',
        dataIndex: 'patrolTime',
        key: 'timers',
      },
      {
        title: '巡查距离',
        dataIndex: 'patrolMileage',
        key: 'km',
        render: (text, record) => {
          return `${text}`
        }
      },
      {
        title: '完成巡查',
        dataIndex: 'patrolFinish',
        key: 'finish',
      },
    ];

    const {
      page,
      pageSize,
      startTime,
      endTime,
    } = this.state;

    return (
      <div id="listTitleContent" style={{ position: 'relative' }}>
        <Breadcrumb separator=">">
          <span id="breadcrumbIcon" />
          <Breadcrumb.Item>统计分析</Breadcrumb.Item>
          <Breadcrumb.Item>地图展示</Breadcrumb.Item>
        </Breadcrumb>
        <div id="tableForm">
          <h3 id="listTitle" style={{ paddingBottom: 0 }}>地图展示</h3>
        </div>
        <div style={{ width: '100%', height: '100%', backgroundColor: '#fff', marginTop: '1%', padding: '1%', boxShadow: '0 2px 6px 0 rgba(0, 0, 0, 0.3)', marginBottom: '5%' }}>
          {/*  <div>
            <span>起止时间: </span>
            <DatePicker onChange={onChange} style={{ marginRight: '0.5%' }} />
            <span>到</span>
            <DatePicker onChange={onChange} style={{ marginLeft: '0.5%' }} />
            <span style={{ marginLeft: '3%' }}>所在片区: </span>
            <Select
              showSearch
              style={{ width: '7%' }}
              placeholder="选择片区"
              optionFilterProp="children"
              onChange={onChangeSelect}
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              <Option value="jack">Jack</Option>
              <Option value="lucy">Lucy</Option>
              <Option value="tom">Tom</Option>
            </Select>
            <span style={{ marginLeft: '3%' }}>所在社区: </span>
            <Select
              showSearch
              style={{ width: '7%' }}
              placeholder="选择人员"
              optionFilterProp="children"
              onChange={onChange}
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              <Option value="jack">人员1</Option>
              <Option value="lucy">人员2</Option>
              <Option value="Yiminghe">人员3</Option>
            </Select>
            <span style={{ marginLeft: '3%' }}>网格地址: </span>
            <Select
              showSearch
              style={{ width: '7%' }}
              placeholder="选择车辆"
              optionFilterProp="children"
              onChange={onChange}
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              <Option value="car">车辆1</Option>
              <Option value="lucy">车辆2</Option>
              <Option value="Yiminghe">车辆3</Option>
            </Select>
          </div>
          <div style={{ marginTop: '2%', marginLeft: '53%' }}>
            <Button type="primary" style={{ marginLeft: '3%' }}>查询</Button>
            <Button type="primary" onClick={this.showModal} style={{ marginLeft: '3%' }}>重置</Button>
          </div> */}
          <Form layout="inline">
            <Row>
              <Col span={24} style={{ display: 'flex', alignItems: 'center' }}>
                <Form.Item label="选择日期">
                  {getFieldDecorator(`date`, {
                    rules: [{ required: true, message: '请选择日期!' }],
                    initialValue: [moment(this.getData(1), dateFormat), moment(this.getData(7), dateFormat)],
                  })(<RangePicker onChange={this.dataRangeChange} />)}
                </Form.Item>
                <Button type="primary" onClick={this.queryPathByDate}>查询</Button>
              </Col>
            </Row>
          </Form>
          <div style={{
            marginTop: '2%',
            width: '100%',
            height: maxHeight
          }}
          >
            <iframe
              id='mapIframe'
              width="100%"
              height="100%"
              scrolling="no"
              frameBorder="0"
              src={iframeSrc}
              marginHeight="0"
              marginWidth="0"
            />
          </div>
        </div>
        <Modal
          title="巡查记录"
          visible={this.state.visible}
          onOk={this.hideModal}
          onCancel={this.hideModal}
          okText="确认"
          cancelText="取消"
          width='70%'
        >
          <p>{patchPatrolList.list[0] ? patchPatrolList.list[0].ownGridNameDesc : '暂无网格数据'}</p>
          {/* <span>{moment(this.getData(1), dateFormat)._i}</span> ~ <span>{moment(this.getData(7), dateFormat)._i}</span> */}
          <span>{this.state.startTime}</span> ~ <span>{this.state.endTime}</span>

          <span style={{ marginLeft: '4%' }}><span>本</span>网格共巡查 <span>{patchPatrolList.total}</span>次</span>
          <Form layout="inline" style={{ marginTop: '2%' }}>
            <Row gutter={{ md: 24, lg: 24, xl: 24 }}>
              <Col md={6} lg={6} xl={6}>
                <FormItem label="巡查编号">
                  {getFieldDecorator('number')(
                    <Input onChange={this.inputChange} />
                  )}
                </FormItem>
              </Col>
              <Col md={12} lg={12} xl={12}>
                <Form.Item label="巡查时间">
                  {getFieldDecorator(`xcdate`, {
                    rules: [{ required: true, message: '请选择日期!' }],
                    initialValue: [moment(this.state.startTime), moment(this.state.endTime)],
                    // initialValue: [moment(this.getData(1), dateFormat), moment(this.getData(7), dateFormat)],
                  })(<RangePicker onChange={this.gridDataRangeChange} />)}
                </Form.Item>
              </Col>
              <Col md={12} lg={24} xl={24}>
                <div style={{ marginLeft: '82%' }}>
                  <Button type="primary" onClick={this.handleSubmit}>查询</Button>
                  {/* <Button onClick={this.reSetData} style={{ marginLeft: '2%' }}>清空</Button> */}
                </div>
              </Col>
            </Row>
          </Form>
          <div style={{ marginTop: '3%' }}>
            <Table
              columns={columns}
              dataSource={patchPatrolList.list}
              pagination={{
                current: page,
                pageSize,
                onShowSizeChange(current, pageSize) {
                  that.handleTableChange(current, pageSize);
                },
                onChange(current, pageSize) {
                  that.handleTableChange(current, pageSize);
                },
                // total: timingList.total,
                showTotal: total => `共 ${total} 条数据`,
                size: 'small',
                showSizeChanger: true,
                showQuickJumper: true,
                pageSizeOptions: ['10', '15', '20']
              }}
            />
          </div>
        </Modal>
        <Modal
          title="轨迹查看"
          visible={this.state.visible2}
          onCancel={this.hideModal2}
          footer={false}
          width='50%'
          height='50%'
        >
          <div style={{
            height: maxHeightModal,
            width: maxWidthModal,
          }}
          >
            <iframe
              id='newMapIframe'
              width="100%"
              height="100%"
              scrolling="no"
              frameBorder="0"
              src={newIframeSrc}
              marginHeight="0"
              marginWidth="0"
            />
          </div>
        </Modal>
        <div style={{ width: 150, height: 200, border: '1px solid #999', position: 'absolute', top: '79.2%', left: '2.7%', backgroundColor: '#fff' }}>
          <h4 style={{ textAlign: 'center', marginTop: 10 }}>网格巡查次数</h4>
          <div style={{ paddingLeft: 10 }}>
            <p style={{ width: 110, height: 26, float: 'left', lineHeight: '26px' }}>30+</p>
            <p style={{ width: 15, height: 15, backgroundColor: '#BA0808', float: 'left', marginTop: '4px' }} />
            <p style={{ width: 110, height: 26, float: 'left', lineHeight: '26px' }}>21-30</p>
            <p style={{ width: 15, height: 15, backgroundColor: '#F00000', float: 'left', marginTop: '4px' }} />
            <p style={{ width: 110, height: 26, float: 'left', lineHeight: '26px' }}>11-20</p>
            <p style={{ width: 15, height: 15, backgroundColor: '#F88528', float: 'left', marginTop: '4px' }} />
            <p style={{ width: 110, height: 26, float: 'left', lineHeight: '26px' }}>0-10</p>
            <p style={{ width: 15, height: 15, backgroundColor: '#FDCE5E', float: 'left', marginTop: '4px' }} />
          </div>
        </div>
      </div>
    )
  }
}
export default ShowMap;
