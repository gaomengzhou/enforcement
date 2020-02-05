import React, { Component } from 'react';
import { Form, message } from 'antd';
import { connect } from 'dva';
import Header from './Header';
import Bodylist from './Bodylist';
import RecordModal from './RecordModal';
import moment from 'moment';
const dateFormat = 'YYYY-MM-DD';
@connect(({ vemmodels, loading }) => ({
  vemmodels,
  loading: loading.models.vemmodels,
}))
class app extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      selectedRowKeys: [],
      form: '',
      page: 1,
      pageSize: 10,
      totalNum: 10,
      dataSource: [], //列表数据
      detail: {}, //详情数据
      dataDepart: [], //使用部门数据
      dataDepartId: '',
      dataPetson: [], //责任人数据
      dataProduct: [], //产品所属数据
    };
  }
  getList = () => {
    const { dispatch } = this.props;
    const obj = {};
    dispatch({
      type: 'vemmodels/getList',
      payload: {
        page: 1,
        pageSize: 10,
        ...obj,
      },
      callback: res => {
        if (res) {
          if (res.retCode == 1) {
            this.setState({ dataSource: res.list, totalNum: res.length, page: 1 });
          } else {
            message.error('获取数据失败');
          }
        }
      },
    });
  };
  //获取getListDepart使用部门数据
  getListDepart = () => {
    const { dispatch } = this.props;
    const obj = {};
    dispatch({
      type: 'vemmodels/getListDepart',
      payload: {},
      callback: res => {
        if (res) {
          if (res.retCode == 1) {
            // console.log(res,"999")
            this.setState({ dataDepart: res.list });
          } else {
            message.error('获取数据失败');
          }
        }
      },
    });
  };
  //获取产品所属getListPro
  getListPro = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'vemmodels/getListPro',
      payload: {},
      callback: res => {
        if (res) {
          console.log(res, '999');

          this.setState({ dataProduct: res });
        } else {
          message.error('获取数据失败');
        }
      },
    });
  };
  onSelects = value => {
    // console.log(value,"888")
    this.setState({ dataDepartId: value }, () => {
      const { dispatch } = this.props;
      const { dataDepartId } = this.state;
      dispatch({
        type: 'vemmodels/getListDuty',
        payload: {
          id: this.state.dataDepartId,
        },
        callback: res => {
          if (res) {
            if (res.retCode == 1) {
              console.log(res, '77');
              this.setState({ dataPetson: res.list });
            } else {
              message.error('获取数据失败');
            }
          }
        },
      });
    });
  };
  //点击前往导入页面
  goImport() { }
  //查询
  query(form) {
    this.setState({ form });
    const { getFieldsValue } = form;
    const values = getFieldsValue();
    const { dispatch } = this.props;
    const obj = {};
    values.carNo && (obj.carNo_S_LK = values.carNo);
    values.frameId && (obj.frameId_S_LK = values.frameId);
    values.model && (obj.model_S_LK = values.model);

    dispatch({
      type: 'vemmodels/getList',
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
  // 选中项
  onSelectChange(selectedRowKeys, selectedRows) {
    this.setState({ selectedRowKeys });
  }
  //删除
  deleteList() {
    const { dispatch } = this.props;
    if (this.state.selectedRowKeys.length > 0) {
      dispatch({
        type: 'vemmodels/deleteData',
        payload: {
          ids: this.state.selectedRowKeys,
        },
        callback: res => {
          if (res) {
            if (res.retCode == 1) {
              message.success(res.retMsg);
              this.getList();
              this.setState({ selectedRowKeys: [] });
            } else {
              this.setState({ selectedRowKeys: [] });
            }
          }
        },
      });
    } else {
      message.error("请选中打勾项再点击删除");
    }

  }
  //弹窗
  showModal = (type, r) => {
    if (type == 'edit') {
      const { dispatch } = this.props;
      dispatch({
        type: 'vemmodels/getdetail',
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
                title: type == 'edit' ? '编辑' : '新增',
                // totalNum: res.root.length,
                detail: res.data,
              });
            } else {
              message.error('获取数据失败');
            }
          }
        },
      });
    } else {
      this.setState({
        visible: true,
        title: type == 'edit' ? '编辑' : '新增',
      });
    }
  };
  handleOk = (form, type) => {
    const { validateFields, resetFields } = form;
    const obju = {};
    const url = type == '新增' ? 'vemmodels/createRegistration' : 'vemmodels/updateData';
    validateFields((errors, values) => {
      const { detail } = this.state;
      if (errors) {
        return;
      }
      if (type == '编辑') {
        obju.id = this.state.detail.id;
      }
      values.deadline && (values.deadline = moment(values.deadline).format(dateFormat));

      // 新增&&编辑
      const { dispatch } = this.props;
      dispatch({
        type: url,
        payload: {
          ...values,
          id: this.state.detail.id,
        },
        callback: res => {
          if (res) {
            // resetFields();
            if (res.retCode == 1) {
              message.success(res.retMsg);
              this.setState({ visible: false, detail: {} });
              this.getList();
            } else {
              message.error(res.retMsg);
            }
          }
        },
      });
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false,
      detail: {},
    });
  };
  // handleOk = (form, type) => {};
  onChangePage = pagination => {
    const { form } = this.state;
    const obj = {};
    if (form) {
      const { getFieldsValue } = form;
      const values = getFieldsValue();
      values.carNo && (obj.carNo_S_LK = values.carNo);
      values.frameId && (obj.frameId_S_LK = values.frameId);
      values.model && (obj.model_S_LK = values.model);
    }
    const { dispatch } = this.props;
    this.setState({ page: pagination.current, pageSize: pagination.pageSize }, function () {
      dispatch({
        type: 'vemmodels/getList',
        payload: {
          page: 1,
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
  // 导出
  exportList(exo) { }
  // 重置
  reset(form) {
    const { resetFields } = form;
    resetFields();
    this.getList();
    // this.setState({year: new Date().getFullYear()})
  }
  componentDidMount() {
    this.getList();
    this.getListDepart();
    this.getListPro();
  }
  render() {
    const {
      title,
      page,
      pageSize,
      selectedRowKeys,
      dataSource,
      detail,
      dataDepart,
      dataPetson,
      dataProduct,
      totalNum
    } = this.state;
    const hasSelected = selectedRowKeys.length > 0;
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
      handleOk: this.handleOk.bind(this),
      handleCancel: this.handleCancel.bind(this),
      visible: this.state.visible,
      exportList: this.exportList.bind(this),
      query: this.query.bind(this),
      reset: this.reset.bind(this),
      deleteList: this.deleteList.bind(this),
      onChange: this.onChangePage.bind(this),
      onSelects: this.onSelects.bind(this),
      title,
      hasSelected,
      dataSource,
      rowSelection,
      pagination,
      detail,
      dataDepart,
      dataPetson,
      dataProduct,
    };
    return (
      <div id="listTitleContent">
        <Header {...modals} />
        <Bodylist {...modals} />
        <RecordModal {...modals} />
      </div>
    );
  }
}

const Information = Form.create()(app);
export default Information;
