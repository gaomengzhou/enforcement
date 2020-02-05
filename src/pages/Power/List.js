import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Form,
  Row,
  Col,
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
} from 'antd';

import Header from "./Header";
import Bodylist from "./Bodylist"
@connect(({ powermodels, loading }) => ({
  powermodels,
  loading: loading.models.powermodels,
}))
class app extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      page: 1,
      pageSize: 10,
      visibleExcel: false,
      visibleExcelall: false,
      totalNum: '',
      dataSource: [],
      form: '',
      selectedRows: [],
      selectedRowKeys: [],
      selectedId: [],
      selectedIds: [],
      value: '',
      visibleImport: false,
      detail: {},
    };
  }
  componentDidMount() {
    this.getList();
  }
  //列表渲染
  getList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'powermodels/getList',
      payload: {
        page: 1,
        pageSize: 10,
      },
      callback: res => {
        if (res) {
          if (res.retCode == 1) {
            this.setState({
              dataSource: res.list,
              totalNum: res.length,
              page: 1,
            });
          } else {
            message.error('获取数据失败');
          }
        }
      },
    })
  };
  //查询
  query = (form) => {
    this.setState({ form });
    const { getFieldsValue } = form;
    const values = getFieldsValue();
    const { dispatch } = this.props;
    const obj = {};
    values.powerCode && (obj.powerCode_S_LK = values.powerCode);
    values.powerNote && (obj.powerNote_S_LK = values.powerNote);

    dispatch({
      type: 'powermodels/getList',
      payload: {
        page: 1,
        pageSize: this.state.pageSize,
        ...obj,
      },
      callback: res => {
        if (res) {
          if (res.retCode == 1) {
            this.setState({ dataSource: res.list, totalNum: res.length });
          } else {
            message.error('获取数据失败');
          }
        }
      },
    });
  }
  handleCancel = e => {
    this.setState({
      visible: false,
      visibleExcel: false,
      visibleExcelall: false,
      visibleImport: false,
      detail: {},
    });
  };
  //确定
  handleOk = (form, type) => {
    const { validateFields, resetFields } = form;
    const obju = {};
    const url = type == '新增' ? 'powermodels/save' : 'powermodels/update';
    validateFields((errors, values) => {
      if (!errors) {
        if (values.powerCodes !== undefined && values.powerCodes !== '' && values.powerNotes !== '' && values.powerNotes !== undefined) {
          this.setState({
            value: values,
          })
          if (type == '编辑') {
            obju.id = this.state.detail.id;
          }
          const { dispatch } = this.props;
          dispatch({
            type: url,
            payload: {
              "powerCode": values.powerCodes,
              "powerNote": values.powerNotes,
              "id": obju.id,
            },
            callback: res => {
              if (res) {
                if (res.retCode == 1) {
                  this.setState({ detail: {} });
                  this.getList();
                }
              }
            },
          })
        } else {
          message.info('请填写完保存')
        }
        this.setState({
          visible: false,
        });
        this.getList();
      }
    })
  };
  // showModal = () => {
  //   this.setState({
  //     visible: true,
  //   });
  // };
  showModal = (type, r) => {
    if (type == 'edit') {
      const { dispatch } = this.props;
      // dispatch({
      //   type: 'powermodels/getList',
      //   payload: {
      //     page: this.state.page,
      //     pageSize: this.state.pageSize,
      //     "powerCode_S_EQ": r.powerCode,
      //   },
      //   callback: res => {
      //     if (res) {
      //       if (res.retCode == 1) {
      //         this.setState({
      //           visible: true,
      //           title: type == 'edit' ? '编辑' : '新增',
      //           detail: res.list[0],
      //         });
      //       } else {
      //         message.error('获取数据失败');
      //       }
      //     }
      //   },
      // });
      this.setState({
        visible: true,
        title: type == 'edit' ? '编辑' : '新增',
        detail: r
      })
    } else {
      this.setState({
        visible: true,
        title: type == 'edit' ? '编辑' : '新增',
      });
    }
  };
  // 清空
  reset(form) {
    const { resetFields } = form;
    resetFields();
  }
  onChangePage = pagination => {
    const { form } = this.state;
    const obj = {};
    if (form) {
      const { getFieldsValue } = form;
      const values = getFieldsValue();
      values.powerCode && (obj.powerCode_S_EQ = values.powerCode);
      values.powerNote && (obj.powerNote_S_EQ = values.powerNote);
    }
    const { dispatch } = this.props;
    this.setState({ page: pagination.current, pageSize: pagination.pageSize }, function () {
      dispatch({
        type: 'powermodels/getList',
        payload: {
          page: pagination.current,
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
  // 选中项
  onSelectChange(selectedRowKeys, selectedRows) {
    this.setState({ selectedRowKeys, selectedRows });
  }
  //删除
  deleteList() {
    const { dispatch } = this.props;
    this.state.selectedRows.map(item => {
      this.state.selectedId.push(item.id);
    })
    if (this.state.selectedId.length > 0) {
      dispatch({
        type: 'powermodels/deleteData',
        payload: {
          "ids": this.state.selectedId,
        },
        callback: res => {
          if (res) {
            if (res.retCode == 1) {
              message.success(res.retMsg);
              this.getList();
              this.setState({ selectedRowKeys: [], selectedId: [] });
            } else {
              message.error(res.retMsg);
              this.setState({ selectedRowKeys: [], selectedId: [] });
            }
          }
        },
      });
    } else {
      message.error("请选中下列表格中的一项或多项")
    }
  }
  //导出
  ExcelshowModal = () => {
    this.setState({
      visibleExcel: true,
    });
  };
  ExcelshowModalall = () => {
    this.setState({
      visibleExcelall: true,
    });
  };
  //导出文件
  handleExcel = () => {
    // this.setState({ selectedRowKeys,selectedRows });
    this.state.selectedRows.map(item => {
      this.state.selectedIds.push(item.id);
    })
    const { dispatch } = this.props;
    if (this.state.selectedIds.length > 0) {
      dispatch({
        type: 'powermodels/exportAll',
        payload: {
          "ids": this.state.selectedIds,
        },
        callback: res => {
          this.setState({ selectedRowKeys: [], selectedIds: [] });
        },
      });
    } else {
      message.error("请选中下列表格中的一项或多项")
    }
    this.setState({
      visibleExcel: false,
    })
  }
  //导出全部
  handleExcelall = (form) => {
    // this.setState({ selectedRowKeys,selectedRows });
    this.setState({ form });
    const { getFieldsValue } = form;
    const values = getFieldsValue();
    const obj = {};
    values.powerCode && (obj.powerCode_S_EQ = values.powerCode);
    values.powerNote && (obj.powerNote_S_EQ = values.powerNote);
    const { dispatch } = this.props;
    dispatch({
      type: 'powermodels/exportAlls',
      payload: {
        ...obj,
      },
      callback: res => {
      },
    });
    this.setState({
      visibleExcelall: false,
    })
  }
  ImportshowModal = () => {
    this.setState({
      visibleImport: true,
    });
  }
  //模板下载
  downloadExcel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'powermodels/download',
      callback: res => {
      },
    });
    // this.setState({
    //   visibleImport:false,
    // })
  }
  render() {
    const {
      dataSource,
      selectedRowKeys,
      page,
      totalNum,
      pageSize,
      detail,
      title,
    } = this.state;
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
    const powerForm = {
      dataSource,
      rowSelection,
      pagination,
      onChange: this.onChangePage.bind(this),
      showModal: this.showModal,
    };
    const headerForm = {
      query: this.query.bind(this),
      reset: this.reset.bind(this),
      handleCancel: this.handleCancel.bind(this),
      handleOk: this.handleOk.bind(this),
      deleteList: this.deleteList.bind(this),
      visible: this.state.visible,
      visibleExcel: this.state.visibleExcel,
      visibleExcelall: this.state.visibleExcelall,
      visibleImport: this.state.visibleImport,
      showModal: this.showModal,
      ExcelshowModal: this.ExcelshowModal,
      ExcelshowModalall: this.ExcelshowModalall,
      ImportshowModal: this.ImportshowModal,
      handleExcelall: this.handleExcelall.bind(this),
      handleExcel: this.handleExcel.bind(this),
      downloadExcel: this.downloadExcel.bind(this),
      getList: this.getList,
      dataSource,
      rowSelection,
      detail,
      title,
    }
    return (
      <div id="listTitleContent">
        <Header {...headerForm} />
        <Bodylist {...powerForm} />
      </div>
    )
  }
}

const Power = Form.create()(app);
export default Power;