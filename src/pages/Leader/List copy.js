import React, { Component } from 'react';
import Link from 'umi/link';
import moment from 'moment';
import {
  Row,
  Col,
  Form,
  Input,
  Select,
  Button,
  DatePicker,
  Table,
  Radio,
  Modal,
  Icon,
  Pagination,
  Tabs,
  message,
  Breadcrumb,
  Drawer,
} from 'antd';
import styles from './Detail.less';
import Header from './Header.js';
import Bodylist from './Bodylist.js';
import { connect } from 'dva';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

@connect(({ Leadermodels, loading }) => ({
  Leadermodels,
  loading: loading.models.Leadermodels,
}))
class app extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appealSource: [], // 诉求来源
      Apartment: [], //主办部门
      dataSource: [], //列表数据
      handOverSource: [], // 工单来源
      taskPriority: [], // 优先级
      taskType: [], // 类型
      LeaderAssign: [], //状态
      page: 1,
      pageSize: 10,
      totalNumber: 10,
      userRole: sessionStorage.getItem('userRole'),
      value: "3",
      form: '',
      fivefivevisible: false, // 左边弹窗抽屉
      sixsixsixvisible: false, // 右边弹窗抽屉
    };
  }

  // 任务分类（获取主办部门）
  Apartment() {
    const { dispatch } = this.props;
    dispatch({
      type: 'Leadermodels/Apartment',
      dispatch: {},
      callback: res => {
        if (res) {
          this.setState({ Apartment: res.list });
        }
      },
    });
  }

  // 获取列表数据
  getList(obj) {
    const { dispatch } = this.props;
    const { page, pageSize, userRole } = this.state;
    dispatch({
      type: 'Leadermodels/getList',
      payload: {
        page,
        pageSize,
        id: userRole,
        obj,
      },
      callback: res => {
        if (res) {
          if (res.retCode == 1) {
            if (userRole == '1') {
              this.setState({
                dataSource: res.list.filter(item => item.isExamine == '1'),
                totalNumber: res.length,
              });
            } else {
              this.setState({ dataSource: res.list, totalNumber: res.length });
            }
          }
        }
      },
    });
  }

  // 获取下拉框的值
  getSelect(groupCode) {
    const { dispatch } = this.props;
    dispatch({
      type: 'Leadermodels/getGroupCode',
      payload: { groupCode },
      callback: res => {
        if (res) {
          groupCode == 'handOverSource' && this.setState({ handOverSource: res });
          groupCode == 'taskPriority' && this.setState({ taskPriority: res });
          groupCode == 'taskType' && this.setState({ taskType: res });
          groupCode == 'LeaderAssign' && this.setState({ LeaderAssign: res });
        }
      },
    });
  }

  // 查询
  Search = form => {
    const { getFieldsValue } = form;
    this.setState({ form })
    const values = getFieldsValue();
    if (values.createDate) {
      values.createDate_D_GE = moment(values.createDate).format('YYYY-MM-DD 00:00:00');
      values.createDate_D_LE = moment(values.createDate).format('YYYY-MM-DD 23:59:59');
      values.createDate = '';
    }
    if (values.createDate == null) {
      values.createDate = '';
    }
    this.setState({ form, page: 1 }, () => {
      this.getList(values);
    });
  };
  // 重置
  reset = form => {
    const { resetFields } = form;
    resetFields();
  };

  // 分页
  pageChange = pagination => {
    const { form } = this.state;
    this.setState({ page: pagination.current, pageSize: pagination.pageSize }, () => {
      if (form) {
        const { getFieldsValue } = form;
        const obj = getFieldsValue();
        if (obj.incidentDate) {
          obj.incidentDate_D_GE = moment(obj.createDate).format('YYYY-MM-DD 00:00:00');
          obj.incidentDate_D_LE = moment(obj.createDate).format('YYYY-MM-DD 23:59:59');
          obj.incidentDate = '';
        }
        if (obj.incidentDate == null) {
          obj.incidentDate = '';
        }
        this.getList(obj);
      } else {
        this.getList({});
      }
    });
  };

  componentDidMount() {
    this.getSelect('handOverSource');
    this.getSelect('taskPriority');
    this.getSelect('taskType');
    this.getSelect('LeaderAssign');
    this.Apartment();
    this.getList({});
  }

  // 待处理&已处理&全部
  onChange = e => {
    const { dispatch } = this.props;
    const { page, pageSize, userRole } = this.state;
    // 待处理
    if (e.target.value == '1') {
      if (userRole == '2') {
        dispatch({
          type: 'Leadermodels/getList',
          payload: {
            page,
            pageSize,
            id: userRole,
          },
          callback: res => {
            if (res) {
              if (res.retCode == 1) {
                if (userRole == '1') {
                  this.setState({
                    dataSource: res.list
                      .filter(item => item.isExamine == '1')
                      .filter(item => item.status == '1' || item.status == '6'),
                    totalNumber: res.length,
                  });
                } else {
                  this.setState({
                    dataSource: res.list.filter(item => item.status == '1' || item.status == '6'),
                    totalNumber: res.length,
                    value: e.target.value,
                  });
                }
              }
            }
          },
        });
      }
      if (userRole == '1') {
        dispatch({
          type: 'Leadermodels/getList',
          payload: {
            page,
            pageSize,
            id: userRole,
          },
          callback: res => {
            if (res) {
              if (res.retCode == 1) {
                if (userRole == '1') {
                  this.setState({
                    dataSource: res.list
                      .filter(item => item.isExamine == '1')
                      .filter(item => item.status == '2'),
                    totalNumber: res.length,
                    value: e.target.value,
                  });
                } else {
                  this.setState({
                    dataSource: res.list.filter(item => item.status == '2'),
                    totalNumber: res.length,
                    value: e.target.value,
                  });
                }
              }
            }
          },
        });
      }
      if (userRole == '4') {
        dispatch({
          type: 'Leadermodels/getList',
          payload: {
            page,
            pageSize,
            id: userRole,
          },
          callback: res => {
            if (res) {
              if (res.retCode == 1) {
                if (userRole == '1') {
                  this.setState({
                    dataSource: res.list
                      .filter(item => item.isExamine == '1')
                      .filter(item => item.status == '3'),
                    totalNumber: res.length,
                    value: e.target.value,
                  });
                } else {
                  this.setState({
                    dataSource: res.list.filter(item => item.status == '3'),
                    totalNumber: res.length,
                    value: e.target.value,
                  });
                }
              }
            }
          },
        });
      }
    }
    //已处理
    if (e.target.value == '2') {
      if (userRole == '2') {
        dispatch({
          type: 'Leadermodels/getList',
          payload: {
            page,
            pageSize,
            id: userRole,
          },
          callback: res => {
            if (res) {
              if (res.retCode == 1) {
                if (userRole == '1') {
                  this.setState({
                    dataSource: res.list
                      .filter(item => item.isExamine == '1')
                      .filter(
                        item => item.status == '2' || item.status == '3' || item.status == '4'
                      ),
                    totalNumber: res.length,
                    value: e.target.value,
                  });
                } else {
                  this.setState({
                    dataSource: res.list.filter(
                      item => item.status == '2' || item.status == '3' || item.status == '4'
                    ),
                    totalNumber: res.length,
                    value: e.target.value,
                  });
                }
              }
            }
          },
        });
      }
      if (userRole == '1') {
        dispatch({
          type: 'Leadermodels/getList',
          payload: {
            page,
            pageSize,
            id: userRole,
          },
          callback: res => {
            if (res) {
              if (res.retCode == 1) {
                if (userRole == '1') {
                  this.setState({
                    dataSource: res.list
                      .filter(item => item.isExamine == '1')
                      .filter(item => item.status != '2'),
                    totalNumber: res.length,
                    value: e.target.value,
                  });
                } else {
                  this.setState({
                    dataSource: res.list.filter(item => item.status != '2'),
                    totalNumber: res.length,
                    value: e.target.value,
                  });
                }
              }
            }
          },
        });
      }
      if (userRole == '4') {
        dispatch({
          type: 'Leadermodels/getList',
          payload: {
            page,
            pageSize,
            id: userRole,
          },
          callback: res => {
            if (res) {
              if (res.retCode == 1) {
                if (userRole == '1') {
                  this.setState({
                    dataSource: res.list
                      .filter(item => item.isExamine == '1')
                      .filter(item => item.status != '3'),
                    totalNumber: res.length,
                    value: e.target.value,
                  });
                } else {
                  this.setState({
                    dataSource: res.list.filter(item => item.status != '3'),
                    totalNumber: res.length,
                    value: e.target.value,
                  });
                }
              }
            }
          },
        });
      }
    }
    //全部
    if (e.target.value == '3') {
      this.getList({});
      this.setState({ value: e.target.value });
    }
  };

  // 点击状态弹窗详情页
  smallDetail = e => {
    // console.log(e)
    let b = document.getElementsByClassName("bigBox");
    // console.log(b)
    this.setState({
      sixsixsixvisible: true,
      fivefivevisible: true,
    })
  }
  // 关闭抽屉
  sixClose = () => {
    this.setState({
      sixsixsixvisible: false,
      fivefivevisible: false,
    })
  }
  fiveClose = () => {
    this.setState({
      sixsixsixvisible: false,
      fivefivevisible: false,
    })
  }

  render() {
    const {
      Apartment,
      dataSource,
      LeaderAssign,
      page,
      pageSize,
      totalNumber,
      handOverSource,
      taskPriority,
      taskType,
      userRole,
    } = this.state;
    const headForms = {
      Apartment,
      taskPriority,
      Search: this.Search,
      reset: this.reset,
      LeaderAssign,
      handOverSource,
      taskType,
      userRole,
    };
    const pagination = {
      current: page,
      total: totalNumber,
      pageSize: pageSize,
      showSizeChanger: true,
      showQuickJumper: true,
    };
    const bodyForms = {
      dataSource,
      pagination,
      pageChange: this.pageChange.bind(this),
      smallDetail: this.smallDetail,
    };
    const sixsixsix = {

    }
    return (
      <div id="listTitleContent" className="bigBox" style={{ position: "relative" }}>
        <Header {...headForms} />
        <Bodylist {...bodyForms} />
        <div style={{ width: 400, position: 'relative', top: '-80px', left: '50px' }}>
          <RadioGroup onChange={this.onChange} value={this.state.value}>
            <Radio value="1">待处理</Radio>
            <Radio value="2">已处理</Radio>
            <Radio value="3">全部</Radio>
          </RadioGroup>
        </div>
        <Drawer
          title="工单处理"
          placement="right"
          closable={false}
          onClose={this.fiveClose}
          destroyOnClose={true}
          visible={this.state.fivefivevisible}
          width="45%"
          maskStyle={{ backgroundColor: "#fff", opacity: 0 }}
        >
          <div>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
          </div>
        </Drawer>
        <Drawer
          title="附件清单"
          placement="left"
          onClose={this.sixClose}
          hidden={!this.state.sixsixsixvisible}
          visible={this.state.sixsixsixvisible}
          width="26%"
          destroyOnClose={true}
          maskStyle={{ backgroundColor: "#fff", opacity: 0 }}
          style={{ position: "absolute", top: 80, left: 270 }}
        >
          <div>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
          </div>
        </Drawer>

      </div>
    );
  }
}

const Workplace = Form.create()(app);
export default Workplace;
