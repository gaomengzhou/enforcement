/* eslint-disable array-callback-return */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable eqeqeq */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable no-param-reassign */
/* eslint-disable react/sort-comp */
/* eslint-disable react/no-unused-state */
/* eslint-disable import/no-extraneous-dependencies */
import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Row, Col, Form, Select, Button, DatePicker, Table, Modal, InputNumber, Breadcrumb, Checkbox } from 'antd';
import styles from './Notice.less'

const FormItem = Form.Item;
@connect(({ checkNotice, select }) => ({
  checkNotice, select
}))
@Form.create()
class Workplace extends PureComponent {
  state = {
    formValues: {},
    pageSize: 10,
    page: 1,
    selectedRowKeys: [],
    value: 1,
    visible: false,
    visible2: false,
    patrolsSettingsData: '',// 巡查设置任务数据
    effectiveStartTime: '',// 巡查设置任务 生效开始时间
    cycleLength: '',// 巡查设置任务 周期时长
    noticeTime: '',// 巡查设置任务 提前通知时间
    dataList: '',// 列表数据
    patchPatrolListObjs: '',// 网格ID等
    app: [],// 消息提醒方式为"app"的一组参数
    msg: [],// 消息提醒方式为"短信"的一组参数
    msgForPrincipal: [],// 消息提醒方式为"部门负责人"的一组参数
    effectiveEndTime: '',// 禁用时间的数据
    effectiveStartTime2: '',// 判断禁用时间的数据
    userPhone: '',// 电话号码
    isDisable: false,
    isDisablePev: false,
    isDisableNext: false,
    effectiveEndTimeNext: '',// 下一周期结束时间
    effectiveStartTimePve: '',// 上一周期开始时间
  };

  componentDidMount() {
    // 巡查设置任务
    new Promise(resolve => {
      this.props.dispatch({
        type: 'checkNotice/patrolsSettings',
        payload: {
          resolve,
        }
      });
    }).then(res => {
      if (res.data) {
        this.setState({
          patrolsSettingsData: res.data,
          effectiveStartTime: res.data.effectiveStartTime,
          effectiveStartTime2: res.data.effectiveStartTime,
          effectiveEndTime: res.data.effectiveEndTime,
          cycleLength: res.data.cycleLength,
          noticeTime: res.data.noticeTime,
        })
      }
    });

    // 获取列表数据
    this.props.dispatch({
      type: 'checkNotice/patrolList',
      payload: {
        pageSize: 10,
        page: 1
      }
    });

    // 所在片区
    this.props.dispatch({
      type: 'select/community',
    });
  }

  // 禁用时间规则
  disabledDateType = (current) => {
    if (moment(this.state.effectiveStartTime2, "YYYYMMDD").fromNow().indexOf('前') === -1) {
      return current && current <= moment().endOf('day')
    }
    return current && current <= moment(this.state.effectiveEndTime && this.state.effectiveEndTime)
  }

  // 弹框
  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  handleOk = () => {
    this.setState({
      visible: false,
    });
    this.props.dispatch({
      type: 'checkNotice/savePatrolPlanSetting',
      payload: {
        effectiveStartTime: this.state.effectiveStartTime,
        cycleLength: this.state.cycleLength,
        noticeTime: this.state.noticeTime,
      }
    })
  }

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }

  handleOk2 = () => {
    const getData = []
    getData.push(...this.state.app, ...this.state.msg, ...this.state.msgForPrincipal, ...this.state.userPhone)
    this.props.dispatch({
      type: 'checkNotice/pushMsg',
      payload: [
        ...getData
      ]
    });
    this.setState({
      visible2: false,
      app: [],
      msg: [],
      msgForPrincipal: [],
      userPhone: '',
    });
  }

  handleCancel2 = () => {
    this.setState({
      visible2: false,
      app: [],
      msg: [],
      msgForPrincipal: [],
      userPhone: '',
    });
  }

  start = () => {
    this.setState({
      selectedRowKeys: [],
    })
  }

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  };

  onChange = (e) => {
    this.setState({
      value: e.target.value,
    });
  };

  selectCommunity = (val) => {
    // eslint-disable-next-line no-console
    console.log(val)
  }

  // 分页
  handleTableChange = (page, size) => {
    this.setState({
      page,
      pageSize: size,
    })
    this.props.dispatch({
      type: 'checkNotice/patrolList',
      payload: { page, pageSize: size }
    })
  };

  // 查询
  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log(values)
      if (values.number) {
        values.number = moment(values.number).format('YYYY-MM-DD')
      }
      if (!err) {
        this.props.dispatch({
          type: 'checkNotice/checkData',
          payload: {
            ownCommunity: values.idNumber ? values.idNumber : null,
            nowTime: values.number ? values.number : null,
            page: 1,
            pageSize: 10
          }
        });
      }
      // 通过条件查询巡查提醒列表数据
      // if (values.idNumber !== undefined || values.number !== undefined) {
      //   this.props.dispatch({
      //     type: 'checkNotice/checkData',
      //     payload: {
      //       ownCommunity: values.idNumber ? values.idNumber : null,
      //       nowTime: values.number ? values.number : null
      //     }
      //   })
      // } else {
      //   this.props.dispatch({
      //     type: 'checkNotice/patrolList',
      //     payload: {
      //       pageSize: 10,
      //       page: 1
      //     }
      //   });
      // }

      this.setState({
        pageSize: 10,
        page: 1,
      })
    });
  };

  // 重置
  handleReset = () => {
    this.props.form.resetFields();
    this.props.dispatch({
      type: 'checkNotice/patrolList',
      payload: {
        pageSize: 10,
        page: 1
      }
    });
    this.setState({
      pageSize: 10,
      page: 1,
      formValues: {},
    })
  };

  // 新增
  add() {
    this.props.history.push('/workOrder/department/complain/add');
  }

  onSelectsApp = (e, index, item, opt, msgWord) => {
    if (e.target.checked) {
      this.state.app.push({
        latticeId: item.latticeId,// 网格id
        ownGridUser: item.ownGridUser,// 用户id
        reminderChannel: msgWord,// 消息提醒方式
        settingId: item.settingId,
        userPhone: item.userPhone
      })
    } else if (this.state.app.length == 1) {
      this.setState(this.state.app.splice(0, 1))
    } else {
      this.setState(this.state.app.splice(index, 1))
    }
  }

  onSelectsMsg = (e, index, item, opt, msgWord) => {
    if (e.target.checked) {
      this.state.msg.push({
        latticeId: item.latticeId,// 网格id
        ownGridUser: item.ownGridUser,// 用户id
        reminderChannel: msgWord,// 消息提醒方式
        settingId: item.settingId,
        userPhone: item.userPhone
      })
    } else if (this.state.msg.length == 1) {
      this.setState(this.state.msg.splice(0, 1))
    } else {
      this.setState(this.state.msg.splice(index, 1))
    }
  }

  onSelectsMsgForPrincipal = (e, index, item, opt, msgWord) => {
    if (e.target.checked) {
      this.state.msgForPrincipal.push({
        latticeId: item.latticeId,// 网格id
        ownGridUser: item.ownGridUser,// 用户id
        reminderChannel: msgWord,// 消息提醒方式
        settingId: item.settingId,
        userPhone: item.userPhone
      })
    } else if (this.state.msgForPrincipal.length == 1) {
      this.setState(this.state.msgForPrincipal.splice(0, 1))
    } else {
      this.setState(this.state.msgForPrincipal.splice(index, 1))
    }
  }

  // 设置周期时长
  cycleLengthChange = (val) => {
    this.setState({
      cycleLength: val
    })
  }

  // 设置提醒周期
  noticeTimeChange = (val) => {
    this.setState({
      noticeTime: val
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { selectedRowKeys, pageNum, pageSize, effectiveStartTime } = this.state;
    const { checkNotice, select } = this.props
    const { patchPatrolListObj, patchGetModalData, patrolsSettingsListData } = checkNotice
    const { communityList } = select
    const that = this;
    const isStartTimer = patrolsSettingsListData.effectiveStartTime;
    const isEndTimer = patrolsSettingsListData.effectiveEndTime;
    const url = '/workOrder/department/complain/detail';
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const dataListObj = [];
    patchPatrolListObj ? patchPatrolListObj.map(item => {
      dataListObj.push(...item);
    }) : [];
    // 动态合并单元格
    const temp = {};
    const Combiner = (text, array, columns) => {
      let count = 0;
      if (text !== temp[columns]) {
        temp[columns] = text;
        array.forEach((item) => {
          if (item.ownCommunity === temp[columns]) {
            count += 1;
          }
        });
      }
      return count;
    };

    function showModal2(index) {
      that.setState({
        visible2: true,
        app: [],
        msg: [],
        msgForPrincipal: [],
      });
      that.props.dispatch({
        type: 'checkNotice/getModalList',
        payload: {
          latticeId: dataListObj[index].latticeId
        }
      })
    }
    // 周期禁止点击规则
    if (patchPatrolListObj&&patchPatrolListObj.length > 0) {
      if (patchPatrolListObj && patchPatrolListObj[0][0].effectiveStartTime ? patchPatrolListObj[0][0].effectiveStartTime : patchPatrolListObj) {
        if (moment(new Date).format('YYYY-MM-DD HH:mm:00') < moment(patchPatrolListObj[0][0].effectiveStartTime).format('YYYY-MM-DD HH:mm:00') || moment(new Date).format('YYYY-MM-DD HH:mm:00') > moment(patchPatrolListObj[0][0].effectiveEndTime).format('YYYY-MM-DD HH:mm:00')) {
          this.setState({
            isDisableNext: false
          })
        } else {
          this.setState({
            isDisableNext: true
          })
        }
        this.setState({
          effectiveStartTimePve: patchPatrolListObj[0][0].effectiveStartTime,
          effectiveEndTimeNext: patchPatrolListObj[0][0].effectiveEndTime
        })
      }
    }

    // 列表禁止点击的规则
    if (moment(new Date).format('YYYY-MM-DD HH:mm:00') < moment(isStartTimer).format('YYYY-MM-DD HH:mm:00') || moment(new Date).format('YYYY-MM-DD HH:mm:00') > moment(isEndTimer).format('YYYY-MM-DD HH:mm:00') || patrolsSettingsListData.lastCycle === '无数据') {
      this.setState({
        isDisable: true
      })
    } else {
      this.setState({
        isDisable: false
      })
    }

    const columns = [
      {
        title: '片区名称',
        dataIndex: 'ownCommunity',
        key: 'ownCommunity',
        render: (text, record) => {
          const obj = {
            children: text,
            props: {},
          };
          obj.props.rowSpan = Combiner(record.ownCommunity, dataListObj, 'ownCommunity');
          return obj;
        },
        width: 200
      },
      {
        title: '二级网格',
        dataIndex: 'ownGridLocation',
        key: 'net',
        onCell: () => {
          return {
            style: {
              maxWidth: 30,
            }
          }
        },
        render: (text, record, index) => {
          return (
            <span>{record.ownGridLocation ? record.ownGridLocation : record.ownGridName}</span>
          )
        },
      },
      {
        title: '周期内是否巡查',
        dataIndex: 'result1',
        key: 'address',
        width: 140,
        render: (text, record, index) => {
          return (
            <span>
              <p className={text == 0 ? styles.statuLedNo : styles.statuLed} /><span style={{ float: 'left', marginLeft: 20, marginTop: 10 }}>{text == 0 ? '未巡查' : '已巡查'}</span>
            </span>
          )
        },
      },
      {
        title: '网格员',
        dataIndex: 'lastName',
        key: 'people',
        onCell: () => {
          return {
            style: {
              maxWidth: 30,
            }
          }
        },
      },
      {
        title: '手机号',
        dataIndex: 'userPhone',
        key: 'phone',
        onCell: () => {
          return {
            style: {
              maxWidth: 30,
            }
          }
        },
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record, index) => {
          return (
            <a onClick={() => showModal2(index)} disabled={this.state.isDisable || record.noSelect === '查询'}>发送提醒</a>
          )
        },
        width: 140
      },
    ];

    function onChange(dateString) {
      that.setState({
        effectiveStartTime: dateString
      })
    };

    function onOk(value) {
      that.setState({
        effectiveStartTime: moment(value).format('YYYY-MM-DD HH:mm:00')
      })
    };

    function prevDate() {
      that.props.dispatch({
        type: 'checkNotice/prevDateStatus',
        payload: {
          page: 1,
          pageSize: 10,
          effectiveStartTime: that.state.effectiveStartTimePve
        }
      });
      // if (patchPatrolListObj == '') {
      //   that.setState({
      //     isDisablePev: true
      //   })
      // }
    }

    function nextDate() {
      that.props.dispatch({
        type: 'checkNotice/prevDateStatus',
        payload: {
          page: 1,
          pageSize: 10,
          effectiveEndTime: that.state.effectiveEndTimeNext
        }
      });
      // if (patchPatrolListObj == '') {
      //   that.setState({
      //     isDisableNext: true,
      //   })
      // }
    }

    return (
      <div id="listTitleContent">
        <Breadcrumb separator=">">
          <span id="breadcrumbIcon" />
          <Breadcrumb.Item>统计分析</Breadcrumb.Item>
          <Breadcrumb.Item>巡查提醒</Breadcrumb.Item>
        </Breadcrumb>
        <div id="tableForm">
          <h3 id="listTitle" style={{ paddingBottom: 0 }}>巡查提醒</h3>
          <Form onSubmit={this.handleSearch} layout="inline" style={{ marginTop: 20 }}>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={6} sm={8}>
                <FormItem label="时间">
                  {getFieldDecorator('number')(
                    <DatePicker placeholder="选择时间" style={{ width: '100%' }} />
                  )}
                </FormItem>
              </Col>
              <Col md={6} sm={8}>
                <FormItem label="所在片区">
                  {getFieldDecorator('idNumber')(
                    <Select placeholder="请选择一个社区" onChange={this.selectCommunity}>
                      {communityList ? communityList.map(item => {
                        return (<Select.Option key={item.id} value={item.code}>{item.desp}</Select.Option>)
                      }) : []}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={12} sm={12} />
              <Col md={24} sm={24} style={{ textAlign: 'right' }}>
                <Button
                  onClick={prevDate}
                  disabled={this.state.isDisablePev}
                >上一周期
                </Button>
                <Button
                  style={{ marginRight: 0, marginLeft: 16 }}
                  disabled={this.state.isDisableNext}
                  onClick={nextDate}
                >下一周期
                </Button>
                <Button style={{ marginRight: 0, marginLeft: 16 }} type="primary" htmlType="submit">
                  查询
                </Button>
                <Button style={{ marginRight: 0, marginLeft: 16 }} onClick={this.handleReset}>
                  重置
                </Button>
              </Col>
            </Row>
          </Form>
          <div id="listOperator" style={{ position: 'relative', background: 'transparent' }}>
            <span>{this.state.patrolsSettingsData.lastCycle}</span>
            <span style={{ position: 'absolute', right: '160px', }}>自动提醒时间：周期结束前{this.state.patrolsSettingsData.noticeTime}天</span>
            <Button type="primary" style={{ position: 'absolute', top: '14px', right: '0', width: '120px' }} onClick={this.showModal}>设置巡查任务</Button>
          </div>
        </div>

        <div id="listTable" className={styles.tableList}>
          <Table
            rowKey={record => record.latticeId}
            columns={columns}
            dataSource={dataListObj || []}
            rowClassName={() => 'editable-row'}
            pagination={{
              current: pageNum,
              pageSize,
              onShowSizeChange(current, pageSize) {
                that.handleTableChange(current, pageSize);
              },
              onChange(current, pageSize) {
                that.handleTableChange(current, pageSize);
              },
              // total: patchPatrolListObj.length,
              showTotal: total => `共 ${total} 条数据`,
              size: 'small',
              showSizeChanger: true,
              showQuickJumper: true,
              pageSizeOptions: ['10', '15', '20'],
            }}
          />
        </div>
        <Modal
          title="巡查任务设置"
          width={700}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <div id="tableFormModal" style={{ background: 'transparent', boxShadow: '0 0 0 0 transparent' }}>
            <Form layout="inline">
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={24} sm={24}>
                  <FormItem label="设置周期时长">
                    {/* {getFieldDecorator('length', {
                      initalValue: '3'
                    })(
                      <InputNumber min={1} max={10000} formatter={value => `${value}天`} parser={value => value.replace('天', '')} />
                    )} */}
                    <InputNumber min={1} max={10000} defaultValue={this.state.cycleLength} formatter={value => `${value}天`} parser={value => value.replace('天', '')} onChange={this.cycleLengthChange} />
                  </FormItem>
                </Col>
                <Col md={24} sm={24}>
                  <FormItem label="设置起始时间">
                    {getFieldDecorator('startEnd', {
                      initialValue: moment(this.state.effectiveStartTime !== '' ? this.state.effectiveStartTime : '')
                    })(
                      <DatePicker
                        format="YYYY-MM-DD HH:mm"
                        showTime={{
                          format: 'HH:mm',
                        }}
                        onChange={onChange}
                        onOk={onOk}
                        disabledDate={this.disabledDateType}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col md={24} sm={24}>
                  <FormItem label="设置提醒周期">
                    <span style={{ fontSize: 14, marginRight: 6 }}>周期结束前</span>
                    <InputNumber min={1} max={3} defaultValue={this.state.noticeTime} formatter={value => `${value}天`} parser={value => value.replace('天', '')} onChange={this.noticeTimeChange} />
                    <span style={{ fontSize: 14 }}>，自动发送短信提醒</span>
                    <p style={{ marginTop: 30 }}>{this.state.patrolsSettingsData.lastCycle}</p>
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </div>
        </Modal>
        <Modal
          title="发送提醒"
          width={700}
          visible={this.state.visible2}
          onOk={this.handleOk2}
          onCancel={this.handleCancel2}
          destroyOnClose
          maskClosable={false}
        >
          {
            patchGetModalData ? patchGetModalData.map((item, index, opt) => {
              return (
                <div key={item.ownGridUser} style={{ marginBottom: '2%' }}>
                  <p className={styles.nameWidth}>{item.lastName}</p>
                  <span style={{ marginRight: '13%' }}>{item.userPhone}</span>
                  <Checkbox defaultChecked={false} onChange={(e) => this.onSelectsApp(e, index, item, opt, '1')}>App</Checkbox>
                  <Checkbox onChange={(e) => this.onSelectsMsg(e, index, item, opt, '2')}>短信</Checkbox>
                  <Checkbox onChange={(e) => this.onSelectsMsgForPrincipal(e, index, item, opt, '3')}>部门负责人短信</Checkbox>
                </div>
              )
            }) : []
          }
        </Modal>
      </div>
    );
  }
}

export default Workplace;
