import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, message } from 'antd';

import Header from './Header';
import Bodylist from './Bodylist';
import RecordModal from './RecordModal';
import RecordsModal from './RecordModal';
@connect(({ infomodels, loading }) => ({
  infomodels,
  loading: loading.models.infomodels,
}))
class app extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      visibles: false,
      selectedRowKeys: [],
      form: '',
      page: 1,
      pageSize: 10,
      totalNum: 10,
      dataSource: [], //列表数据
      detail: {}, //详情数据
    };
  }
  componentDidMount() {
    this.getList();
  }
  getList = () => {
    const { dispatch } = this.props;
    const obj = {};
    dispatch({
      type: 'infomodels/getList',
      payload: {
        page: 1,
        pageSize: 10,
        ...obj,
      },
      callback: res => {
        if (res) {
          if (res.retCode == 1) {
            // console.log(res,"666")
            this.setState({ dataSource: res.list, totalNum: res.length, page: 1 });
          } else {
            message.error('获取数据失败');
          }
        }
      },
    });
  };
  //弹窗
  showModal = (type, r) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'infomodels/getdetail',
      payload: {
        page: this.state.page,
        pageSize: this.state.pageSize,
        id: r.id,
      },
      callback: res => {
        if (res) {
          if (res.retCode == 1) {
            console.log(res, '66');
            this.setState({
              visible: true,
              detail: res.data,
            });
          } else {
            message.error('获取数据失败');
          }
        }
      },
    });
  };
  showModals = (type, r) => {
    const { dispatch } = this.props;
    this.setState({
      visibles: true,
    });
  };
  handleCancel = e => {
    this.setState({
      visible: false,
      detail: {},
    });
  };
  handleOk = e => {
    this.setState({
      visible: false,
      detail: {},
    });
  };
  handleCancels = e => {
    this.setState({
      visibles: false,
      // detail: {},
    });
  };
  handleOks = e => {
    this.setState({
      visibles: false,
      // detail: {},
    });
  };
  //查询
  query(form) {
    this.setState({ form });
    const { getFieldsValue } = form;
    const values = getFieldsValue();
    const { dispatch } = this.props;
    const obj = {};
    values.id && (obj.id_S_LK = values.id);
    values.name && (obj.name_S_LK = values.name);
    values.phone && (obj.phone_S_LK = values.phone);

    dispatch({
      type: 'infomodels/getList',
      payload: {
        page: 1,
        pageSize: this.state.pageSize,
        ...obj,
      },
      callback: res => {
        if (res) {
          // console.log(res, '888');
          if (res.retCode == 1) {
            this.setState({ dataSource: res.list, totalNum: res.length, page: 1 });
          } else {
            message.error('获取数据失败');
          }
        }
      },
    });
  }
  // 重置
  reset(form) {
    const { resetFields } = form;
    resetFields();
    this.getList();
    // this.setState({year: new Date().getFullYear()})
  }
  // 选中项
  onSelectChange(selectedRowKeys, selectedRows) {
    this.setState({ selectedRowKeys });
  }
  onChangePage = pagination => {
    const { form } = this.state;
    const obj = {};
    if (form) {
      const { getFieldsValue } = form;
      const values = getFieldsValue();
      values.id && (obj.id_S_LK = values.id);
      values.name && (obj.name_S_LK = values.name);
      values.phone && (obj.phone_S_LK = values.phone);
    }
    const { dispatch } = this.props;
    this.setState({ page: pagination.current, pageSize: pagination.pageSize }, function () {
      dispatch({
        type: 'infomodels/getList',
        payload: {
          page: this.state.page,
          pageSize: this.state.pageSize,
          ...obj,
        },
        callback: res => {
          if (res) {
            // console.log(res,"6666")
            this.setState({ dataSource: res.list, totalNum: res.length, selectedRowKeys: [] });
          }
        },
      });
    });
  };
  render() {
    const {
      visible,
      visibles,
      dataSource,
      totalNum,
      page,
      pageSize,
      selectedRowKeys,
      detail, //详情数据
    } = this.state;
    const hasSelected = selectedRowKeys.length > 0;
    const Bodylistinfo = {
      visible,
      form: this.props.form,
      dataSource,
    };
    const pagination = {
      current: page,
      total: totalNum,
      pageSize: pageSize,
      showSizeChanger: true,
      showQuickJumper: true,
    };
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange.bind(this),
    };
    const modals = {
      showModal: this.showModal.bind(this),
      handleCancel: this.handleCancel.bind(this),
      handleOk: this.handleOk.bind(this),
      visible: this.state.visible,
      query: this.query.bind(this),
      reset: this.reset.bind(this),
      onChange: this.onChangePage.bind(this),
      showModals: this.showModals.bind(this),
      visibles: this.state.visibles,
      handleCancels: this.handleCancels.bind(this),
      handleOks: this.handleOks.bind(this),
      dataSource,
      pagination,
      page,
      pageSize,
      rowSelection,
      detail,
    };
    const modalss = {
      showModals: this.showModals.bind(this),
      visibles: this.state.visibles,
      handleCancels: this.handleCancels.bind(this),
      handleOks: this.handleOks.bind(this),
    }
    return (
      <div id="listTitleContent">
        <Header {...modals} />
        <Bodylist {...modals} />
        <RecordModal {...modals} />
        <RecordsModal {...modalss} />
      </div>
    );
  }
}

const Information = Form.create()(app);
export default Information;
