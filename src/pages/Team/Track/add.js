import React, { Component } from 'react';
import {
  Modal,
  Pagination,
  Row,
  Col,
  Icon,
  Form,
  Select,
  Button,
  Divider,
  Input,
  Radio,
  DatePicker,
  Breadcrumb,
  TreeSelect,
  message,
  Table,
} from 'antd';
import moment from 'moment';
import { mapIp } from '@/utils/ipConfig'
import { connect } from 'dva';
import PlanModal from './PlanModal';
import TaskModal from './TaskModal';
import TemporaryModal from './TemporaryModal';

const Formats = 'YYYY-MM-DD HH:mm:ss';
const FormItem = Form.Item;
const baseSrc = `${mapIp}planTrajectory.html`;

@connect(({ TrackListmodels, loading }) => ({
  TrackListmodels,
  loading: loading.models.TrackListmodels,
}))
class app extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      page: 1,
      pageSize: 10,
      totalNum: '',
      TaskVisible: false,
      TemporaryVisible: false,
      dataSource: [],
      getGroupCodeList: [],
      form: '',
      plandataSource: [],
      plantotalNum: '',
      tasktotalNum: '',
      taskdataSource: [],
      temporaryData: [],
      temporaryData: [],
      planMapSrc: '',
      planModalShow: false,
    };
  }


  componentDidMount() {
    this.getGroupCode();
    this.patrolGetList();
    this.temporaryList();
  }

  //任务类型下拉数据
  getGroupCode = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'TrackListmodels/getGroupCode',
      payload: {},
      callback: res => {
        if (res) {
          this.setState({ getGroupCodeList: res });
        }
      },
    });
  };
  //巡查任务设置列表
  patrolGetList = () => {
    const { dispatch } = this.props;
    const obj = {};
    dispatch({
      type: 'TrackListmodels/patrolGetList',
      payload: {
        page: 1,
        pageSize: 10,
        ...obj,
      },
      callback: res => {
        if (res) {
          if (res.retCode == 1) {
            this.setState({
              dataSource: res.list,
              totalNum: res.length,
            });
          } else {
            message.error('获取数据失败');
          }
        }
      },
    })
  }

  showTaskModal = (r) => {
    console.log(r);
    this.setState({
      planMapSrc: `${baseSrc}?${r.planId}`,
      planModalShow: true,

    });
  }

  showPlanModal = (r) => {
    this.setState({
      planMapSrc: `${baseSrc}?${r.planId}`,
      planModalShow: true,
    });
  }

  hideModal = () => {
    this.setState({
      planModalShow: false,
    });
  }

  //查询
  query = (form) => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { dispatch } = this.props;
        const obj = {};
        values.playerName && (obj.playerName_S_EQ = values.playerName);
        values.planName && (obj.planName_S_EQ = values.planName);
        values.startTime && (obj.startTime_D_GE = moment(values.startTime).format('YYYY-MM-DD'));
        values.endTime && (obj.endTime_D_LE = moment(values.endTime).format('YYYY-MM-DD'));
        values.types && (obj.types_S_EQ = values.types);
        dispatch({
          type: 'TrackListmodels/patrolGetList',
          payload: {
            page: 1,
            pageSize: this.state.pageSize,
            ...obj,
          },
          callback: res => {
            if (res) {
              if (res.retCode == 1) {
                this.setState({ dataSource: res.list });
              } else {
                message.error('获取数据失败');
              }
            }
          },
        });
      }
    });
  }
  //分页
  onChangePage = pagination => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { dispatch } = this.props;
        const obj = {};
        values.playerName && (obj.playerName_S_EQ = values.playerName);
        values.planName && (obj.planName_S_EQ = values.planName);
        values.startTime && (obj.startTime_D_GE = moment(values.startTime).format('YYYY-MM-DD'));
        values.endTime && (obj.endTime_D_LE = moment(values.endTime).format('YYYY-MM-DD'));
        values.typesDesp && (obj.typesDesp_S_EQ = values.typesDesp);
        this.setState({ page: pagination.current, pageSize: pagination.pageSize }, function () {
          dispatch({
            type: 'TrackListmodels/patrolGetList',
            payload: {
              page: pagination.current,
              pageSize: this.state.pageSize,
              ...obj,
            },
            callback: res => {
              if (res) {
                // console.log(res,"6666")
                this.setState({ dataSource: res.list, totalNum: res.length });
              }
            },
          });
        });
      }
    });
  };
  // 清空
  reset(form) {
    const { resetFields } = form;
    resetFields();
    // this.patrolGetList();
  }
  planReset(form) {
    const { resetFields } = form;
    resetFields();
    // this.planList();
  }
  taskReset(form) {
    const { resetFields } = form;
    resetFields();
    // this.taskList();
  }
  //计划管理列表
  planList = () => {
    const { dispatch } = this.props;
    const obj = {};
    dispatch({
      type: 'TrackListmodels/planGetList',
      payload: {
        page: 1,
        pageSize: 10,
        ...obj,
      },
      callback: res => {
        if (res) {
          if (res.retCode == 1) {
            this.setState({
              plandataSource: res.list,
              plantotalNum: res.length,
            });
          } else {
            message.error('获取数据失败');
          }
        }
      },
    })
  }
  //计划管理列表分页
  onChangePlanPage = pagination => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { dispatch } = this.props;
        const obj = {};
        values.playerName && (obj.playerName_S_EQ = values.playerName);
        values.planName && (obj.planName_S_EQ = values.planName);
        values.startTime && (obj.startTime_D_GE = moment(values.startTime).format('YYYY-MM-DD'));
        values.endTime && (obj.endTime_D_LE = moment(values.endTime).format('YYYY-MM-DD'));
        this.setState({ page: pagination.current, pageSize: pagination.pageSize }, function () {
          dispatch({
            type: 'TrackListmodels/planGetList',
            payload: {
              page: pagination.current,
              pageSize: this.state.pageSize,
              ...obj,
            },
            callback: res => {
              if (res) {
                this.setState({ dataSource: res.list, plantotalNum: res.length });
              }
            },
          });
        });
      }
    });
  };
  //计划管理查询
  planQuery = (form) => {
    this.setState({ form });
    const { getFieldsValue } = form;
    const values = getFieldsValue();
    console.log('values', values);
    const { dispatch } = this.props;
    const obj = {};
    values.username && (obj.playerName_S_EQ = values.username);
    values.name && (obj.planName_S_EQ = values.name);
    values.createDate && (obj.createDate_D_GE = moment(values.createDate).format('YYYY-MM-DD'));
    values.endTime && (obj.endTime_D_LE = moment(values.endTime).format('YYYY-MM-DD'));
    console.log('obj', obj);
    dispatch({
      type: 'TrackListmodels/planGetList',
      payload: {
        page: 1,
        pageSize: this.state.pageSize,
        ...obj,
      },
      callback: res => {
        if (res) {
          if (res.retCode == 1) {
            this.setState({ dataSource: res.list });
          } else {
            message.error('获取数据失败');
          }
        }
      },
    });
  }
  //计划管理删除
  palanDelete = (r) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'TrackListmodels/planDelete',
      payload: {
        id: r.planId,
      },
      callback: res => {
        if (res) {
          if (res.retCode == 1) {
            message.success('删除成功');
            this.planList();
          } else {
            message.error('删除失败');
          }
        }
      },
    })
  }
  //计划管理启用
  planEnable = (r) => {
    console.log('需要启用的数据', r);
    const { dispatch } = this.props;
    dispatch({
      type: 'TrackListmodels/planEnable',
      payload: {
        id: r,
      },
      callback: res => {
        if (res) {
          if (res.retCode == 1) {
            message.success('启用成功');
            this.planList();
          } else {
            message.error('启用失败');
          }
        }
      },
    })
  }
  //计划管理禁用
  planDisable = (r) => {
    console.log('需要禁用的数据', r);
    const { dispatch } = this.props;
    dispatch({
      type: 'TrackListmodels/planDisable',
      payload: {
        id: r,
      },
      callback: res => {
        if (res) {
          if (res.retCode == 1) {
            message.success('禁用成功');
            this.planList();
          } else {
            message.error('禁用失败');
          }
        }
      },
    })
  }
  //任务设置列表
  taskList = () => {
    const { dispatch } = this.props;
    const obj = {};
    obj.status_S_EQ = '01';
    dispatch({
      type: 'TrackListmodels/taskGetList',
      payload: {
        page: 1,
        pageSize: 10,
        ...obj,
      },
      callback: res => {
        if (res) {
          if (res.retCode == 1) {
            this.setState({
              taskdataSource: res.list,
              tasktotalNum: res.length,
            });
          } else {
            message.error('获取数据失败');
          }
        }
      },
    })
  }
  //任务设置分页
  onChangetaskPage = pagination => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        const { dispatch } = this.props;
        const obj = {};
        values.playerName && (obj.playerName_S_EQ = values.playerName);
        values.planName && (obj.planName_S_EQ = values.planName);
        values.startTime && (obj.startTime_D_GE = moment(values.startTime).format('YYYY-MM-DD'));
        values.endTime && (obj.endTime_D_LE = moment(values.endTime).format('YYYY-MM-DD'));
        this.setState({ page: pagination.current, pageSize: pagination.pageSize }, function () {
          dispatch({
            type: 'TrackListmodels/taskGetList',
            payload: {
              page: pagination.current,
              pageSize: this.state.pageSize,
              ...obj,
            },
            callback: res => {
              if (res) {
                this.setState({ taskdataSource: res.list, tasktotalNum: res.length });
              }
            },
          });
        });
      }
    });
  };
  //任务设置查询
  taskQuery = (form) => {
    this.setState({ form });
    const { getFieldsValue } = form;
    const values = getFieldsValue();
    const { dispatch } = this.props;
    const obj = {};
    values.playerName && (obj.playerName_S_EQ = values.playerName);
    values.planName && (obj.planName_S_EQ = values.planName);
    values.startTime && (obj.startTime_D_GE = moment(values.startTime).format('YYYY-MM-DD'));
    values.endTime && (obj.endTime_D_LE = moment(values.endTime).format('YYYY-MM-DD'));
    dispatch({
      type: 'TrackListmodels/taskGetList',
      payload: {
        page: 1,
        pageSize: this.state.pageSize,
        ...obj,
      },
      callback: res => {
        if (res) {
          if (res.retCode == 1) {
            this.setState({ taskdataSource: res.list });
          } else {
            message.error('获取数据失败');
          }
        }
      },
    });
  }
  //临时任务获取巡查队员  
  temporaryList = () => {
    const { dispatch } = this.props;
    const obj = {};
    dispatch({
      type: 'TrackListmodels/temporaryList',
      payload: {
        page: 1,
        pageSize: 10,
        ...obj,
      },
      callback: res => {
        if (res) {
          this.setState({ temporaryData: res.list });
        }
      },
    });
  }
  showModal = (type, r) => {
    this.setState({
      visible: true,
    });
    this.planList();
  };
  TaskShowModal = (type, r) => {
    this.setState({
      TaskVisible: true,
    });
    this.taskList();
  }
  TemporaryShowModal = (type, r) => {
    this.setState({
      TemporaryVisible: true,
    });
  }
  TemporaryHandleCancel = (form) => {
    this.setState({ form });
    const { getFieldsValue } = form;
    const values = getFieldsValue();
    values.startTime = moment(values.startTime).format('YYYY-MM-DD');
    console.log('临时任务提交的数据', values);
    const { dispatch } = this.props;
    dispatch({
      type: 'TrackListmodels/temporaryAdd',
      payload: {
        "planId": values.planName,
        "playerId": values.name,
        "startTime": values.startTime,
      },
      callback: res => {
        if (res) {
          if (res.retCode == 1) {
            message.success('添加成功');
            this.patrolGetList();
          } else {
            message.error('添加失败');
          }
        }
      },
    })
    const { resetFields } = form;
    resetFields();
    this.setState({
      TemporaryVisible: false,
    });
  };
  TemporaryCancel = () => {
    this.setState({
      TemporaryVisible: false,
    });
  }
  TaskHandleCancel = () => {
    this.setState({
      TaskVisible: false,
    });
  };
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      page,
      pageSize,
      dataSource,
      totalNumber,
      planMapSrc,
      planModalShow,
    } = this.state;
    const pagination = {
      current: page,
      total: totalNumber,
      pageSize: pageSize,
      showSizeChanger: true,
      showQuickJumper: true,
    };
    const columns = [
      {
        title: '任务编号',
        dataIndex: 'playerId',
        render: (t, r) => (
          <a href="javascriput:;"
          // onClick={showModal.bind(this, 'edit', r)}
          >
            {t}
          </a>
        ),
      },
      {
        title: '计划名称',
        dataIndex: 'planName',
      },
      {
        title: '队员姓名',
        dataIndex: 'playerName',
      },
      {
        title: '执行时间',
        dataIndex: 'startTime',
      },
      {
        title: '查询情况',
        dataIndex: 'times',
      },
      {
        title: '超时情况',
        dataIndex: 'timeout',
      },
      {
        title: '任务类型',
        dataIndex: 'typesDesp',
      },
    ];
    const modals = {
      // showModal: this.showModal.bind(this),
      visible: this.state.visible,
      // handleCancels: this.handleCancels.bind(this),
      current: this.state.page,
      total: this.state.totalNumber,
      pageSize: this.state.pageSize,
      onChange: this.onChangePlanPage.bind(this),
      // handleOks: this.handleOks.bind(this),
      planQuery: this.planQuery.bind(this),
      plandataSource: this.state.plandataSource,
      handleCancel: this.handleCancel,
      planReset: this.planReset.bind(this),
      palanDelete: this.palanDelete.bind(this),
      planEnable: this.planEnable.bind(this),
      planDisable: this.planDisable.bind(this),
      showPlanModal: this.showPlanModal.bind(this),
    }
    const Taskmodals = {
      // showModal: this.showModal.bind(this),
      taskReset: this.taskReset.bind(this),
      visible: this.state.TaskVisible,
      // handleCancels: this.handleCancels.bind(this),
      current: this.state.page,
      total: this.state.totalNumber,
      pageSize: this.state.pageSize,
      // handleOks: this.handleOks.bind(this),
      handleCancel: this.TaskHandleCancel,
      onChange: this.onChangetaskPage.bind(this),
      taskdataSource: this.state.taskdataSource,
      taskQuery: this.taskQuery.bind(this),
      temporaryData: this.state.temporaryData,
      showTaskModal: this.showTaskModal.bind(this),
    }
    const TemporaryModals = {
      visible: this.state.TemporaryVisible,
      // handleCancels: this.handleCancels.bind(this),
      current: this.state.page,
      total: this.state.totalNumber,
      pageSize: this.state.pageSize,
      // handleOks: this.handleOks.bind(this),
      handleCancel: this.TemporaryHandleCancel.bind(this),
      TemporarydataSource: dataSource,
      TemporaryCancel: this.TemporaryCancel,
      temporaryData: this.state.temporaryData,
    }
    return (
      <div>
        <div id="listTitleDetailBanner" style={{ margin: 20, marginRight: 0, padding: 20 }}>
          <h3>任务设置</h3>
          <Button
            style={{ marginRight: 20 }}
            type="primary"
            onClick={() => {
              history.back(-1);
            }}
          >
            <Icon type="caret-left" />
            返回
              </Button>
          <Button
            style={{ marginRight: 20 }}
            type="primary"
            onClick={this.showModal}
          >
            计划管理
          </Button>
          <Button
            type="primary"
            style={{ marginRight: 20 }}
            onClick={this.TaskShowModal}
          >
            任务设置
          </Button>
          <Button
            type="primary"
            style={{ marginRight: 20 }}
            onClick={this.TemporaryShowModal}
          >
            临时任务
          </Button>
        </div>
        <div
          style={{
            marginLeft: 20,
            marginTop: 20,
            marginBottom: 20,
            backgroundColor: '#FFFFFF',
            boxShadow: '0px 5px 5px 0px rgba(59, 1, 0, 0.2)',
            padding: 10,
          }}
        >
          <h4 style={{ fontWeight: 700, borderBottom: '1px dashed #000' }}>查询信息</h4>
          <Form>
            <Row>
              <Col span={24}>
                <Col span={6}>
                  <FormItem label="队员姓名" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
                    {getFieldDecorator('playerName')(
                      <Input />
                    )}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem label="计划名称" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
                    {getFieldDecorator('planName')(
                      <Input />
                    )}
                  </FormItem>
                </Col>
                <Col span={5}>
                  <FormItem label="执行时间" labelCol={{ span: 7 }} wrapperCol={{ span: 17 }}>
                    {getFieldDecorator('startTime')(
                      <DatePicker
                        placeholder="请选择"
                        allowClear
                        format="YYYY/MM/DD"
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={5}>
                  <FormItem label="至" labelCol={{ span: 4 }} wrapperCol={{ span: 17 }}>
                    {getFieldDecorator('endTime')(
                      <DatePicker
                        placeholder="请选择"
                        allowClear
                        format="YYYY/MM/DD"
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem label="任务类型" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
                    {getFieldDecorator('typesDesp')(
                      <Select placeholder="请选择">
                        {this.state.getGroupCodeList &&
                          this.state.getGroupCodeList.map(item => (
                            <Option value={item.desp} key={item.id}>
                              {item.desp}
                            </Option>
                          ))}
                      </Select>
                    )}
                  </FormItem>
                </Col>

              </Col>
              <Col span={24} style={{ paddingBottom: 18 }}>
                <Col span={16} />
                <Col span={8}>
                  <Button onClick={this.query}>查询</Button>
                  <Button onClick={this.reset.bind(null, this.props.form)} style={{ marginLeft: 18 }}>清空</Button>
                </Col>
              </Col>
            </Row>
          </Form>
          <h4 style={{ fontWeight: 700, borderBottom: '1px dashed #000' }}>任务列表</h4>
          <Table
            dataSource={dataSource}
            columns={columns}
            pagination={pagination}
            onChange={this.onChangePage}
          >
          </Table>
          <PlanModal {...modals} />
          <TaskModal {...Taskmodals} />
          <TemporaryModal {...TemporaryModals} />
          <Modal
            title="查看轨迹"
            visible={planModalShow}
            onCancel={this.hideModal}
            zIndex={10000}
            width={650}>
            <iframe
              id='mapIframe'
              title="mapframe"
              width="600"
              height="600"
              scrolling="no"
              frameBorder="0"
              src={planMapSrc}
              marginHeight="0"
              marginWidth="0"
            >
            </iframe>
          </Modal>
        </div>
      </div>
    );
  }
}

const add = Form.create()(app);
export default add;
