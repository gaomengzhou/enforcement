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

import Header from "./GridHeader";
import Body from "./GridBody"

@connect(({ gridmodels, loading }) => ({
  gridmodels,
  loading: loading.models.gridmodels,
}))
class app extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      pageSize: 10,
      totalNum: '',
      dataSource: [],
      parentBank: [],   // 所属社区
      selectedRows: [],
      selectedRowKeys: [],
      visible: false,
      gridList: [], // 网格
      userSource: [],
      usertotalNum: '',
      gridMarkdate: [],
      detail: {},
      selectedRows: [],
      selectedId: [],
      gridSelects: '1',
      treeValues: undefined,
    };
  }

  componentDidMount() {
    this.getSelect('parentBank');
    this.getList();
    this.getGrid();
    this.getGridTreeSelect();
    this.gridMark();
  }

  // 获取下拉框的值
  getSelect(groupCode) {
    const { dispatch } = this.props;
    dispatch({
      type: 'gridmodels/getGroupCode',
      payload: { groupCode },
      callback: res => {
        if (res) {
          groupCode == 'parentBank' && this.setState({ parentBank: res });
        }
      },
    });
  }

  gridMark(gridMark) {
    const { dispatch } = this.props;
    dispatch({
      type: 'gridmodels/gridMark',
      payload: {},
      callback: res => {
        if (res) {
          this.setState({ gridMarkdate: res })
        }
      },
    });
  }

  // 列表渲染
  getList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'gridmodels/getList',
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
            });
          } else {
            message.error('获取数据失败');
          }
        }
      },
    })
  };

  // 获取网格
  getGrid = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'gridmodels/getGrid',
      payload: {},
      callback: res => {
        if (res) {
          if (res.retCode == '1') {
            this.setState({ gridList: res.list });
          }
        }
      },
    });
  };

  // 获取网格长网格员
  getGridTreeSelect = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'gridmodels/gridTreeSelect',
      payload: {},
      callback: res => {
        if (res) {
          if (res.retCode == 1) {
            let userSource = [];
            userSource.push(res.data)
            this.setState({ userSource });
          } else {
            message.error('获取数据失败');
          }
        }
      },
    });
  }

  // 获取网格员
  // getGridUser = () => {
  //   const { dispatch } = this.props;
  //   const obj = {};
  //   dispatch({
  //     type: 'gridmodels/getGridUser',
  //     payload: {},
  //     callback: res => {
  //       if (res) {
  //         if (res.retCode == 1) {
  //           this.setState({ userSource: res.list });
  //         } else {
  //           message.error('获取数据失败');
  //         }
  //       }
  //     },
  //   });
  // };

  // 查询
  query = (form) => {
    this.setState({ form });
    const { getFieldsValue } = form;
    const values = getFieldsValue();
    const { dispatch } = this.props;
    const obj = {};
    values.ownGridName && (obj.ownGridName_S_EQ = values.ownGridName);
    values.ownGridLocation && (obj.ownGridLocation_S_LK = values.ownGridLocation);
    values.ownGridOften && (obj.ownGridOftenDesc_S_LK = values.ownGridOften);
    values.ownCommunity && (obj.ownCommunity_S_LK = values.ownCommunity);
    // console.log(obj, values)
    dispatch({
      type: 'gridmodels/getList',
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

  // 清空
  reset(form) {
    const { resetFields } = form;
    resetFields();
  }

  // 分页
  onChangePage = pagination => {
    const { form } = this.state;
    const obj = {};
    if (form) {
      const { getFieldsValue } = form;
      const values = getFieldsValue();
      values.ownGridName && (obj.ownGridName_S_LK = values.ownGridName);
      values.ownGridLocation && (obj.ownGridLocation_S_Lk = values.ownGridLocation);
      values.ownGridOften && (obj.ownGridOftenDesc_S_Lk = values.ownGridOften);
      values.ownCommunity && (obj.ownCommunity_S_LK = values.ownCommunity);
    }
    const { dispatch } = this.props;
    this.setState({ page: pagination.current, pageSize: pagination.pageSize }, function () {
      dispatch({
        type: 'gridmodels/getList',
        payload: {
          page: pagination.current,
          pageSize: this.state.pageSize,
          ...obj,
        },
        callback: res => {
          if (res) {
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

  showModal = (type, r) => {
    if (type === 'edit') {
      const { dispatch } = this.props;
      // dispatch({
      //   type: 'gridmodels/getList',
      //   payload: {
      //     page: this.state.page,
      //     pageSize: this.state.pageSize,
      //     "latticeId_S_EQ": r.latticeId,
      //   },
      //   callback: res => {
      //     console.log(res)
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
        detail: r,

        SortingModal: true,
      })
    } else {
      this.setState({
        visible: true,
        title: type == 'edit' ? '编辑' : '新增',
      });
    }
  };

  // 新增确定
  handleOk = (form, type) => {
    const { validateFields, resetFields } = form;
    const obju = {};
    const userGrid = [];
    const url = type == '新增' ? 'gridmodels/save' : 'gridmodels/update';
    validateFields((errors, values) => {
      if (!errors) {
        const { keys, names } = values;
        values.desp.map(item => {
          userGrid.push({ "gridMark": item })
        })
        values.ownGridUsers.map((item, index) => {
          userGrid[index].ownGridUser = item;
        })
        if (type == '编辑') {
          obju.id = this.state.detail.latticeId;
          if (userGrid.length > 0) {
            userGrid.map((item, index) => {
              userGrid[index].latticeId = obju.id;
            })
          }
        }
        const { dispatch } = this.props;
        dispatch({
          type: url,
          payload: {
            "ownGridName": values.ownGridNames,
            "ownGridOften": values.ownGridOftens,
            "userGridVos": userGrid,
            "latticeId": obju.id,
          },
          callback: res => {
            if (res) {
              if (res.retCode == 1) {
                this.setState({ detail: {} });
                resetFields();
                this.getList();
              }
            }
          },
        })
        this.setState({
          visible: false,
          SortingModal: false,
        });
      }
    })
  };

  // 删除
  deleteList() {
    const { dispatch } = this.props;
    this.state.selectedRows.map(item => {
      this.state.selectedId.push(item.latticeId);
    })
    dispatch({
      type: 'gridmodels/deleteData',
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
  }

  handleCancel = e => {
    this.setState({
      gridSelects: '1',
      visible: false,
      // visibleExcel:false,
      // visibleExcelall:false,
      // visibleImport:false,
      detail: {},
    });
    // window.location.reload();
  };

  // 网格员网格长树
  onChangeTree = e => {
    console.log(e, 100)
  }

  render() {
    const {
      dataSource,
      parentBank,
      selectedRowKeys,
      page,
      totalNum,
      pageSize,
      title,
      gridList,
      userSource,
      gridMarkdate,
      detail,
      gridSelects,
      treeValues,
    } = this.state;
    const pagination = {
      current: page,
      total: totalNum,
      pageSize,
      showSizeChanger: true,
      showQuickJumper: true,
    };
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange.bind(this),
    };
    const gridHeader = {
      userSource,
      gridList,
      parentBank,
      gridMarkdate,
      query: this.query.bind(this),
      reset: this.reset.bind(this),
      handleCancel: this.handleCancel.bind(this),
      deleteList: this.deleteList.bind(this),
      handleOk: this.handleOk.bind(this),
      showModal: this.showModal,
      visible: this.state.visible,
      title,
      detail,
      gridSelects,
      treeValues,
      onChangeTree: this.onChangeTree,
    }
    const gridBody = {
      dataSource,
      rowSelection,
      pagination,
      onChange: this.onChangePage.bind(this),
      showModal: this.showModal,
    };
    return (
      <div id="listTitleContent">
        <Header {...gridHeader} />
        <Body {...gridBody} />
      </div>
    )
  }
}

const Grid = Form.create()(app);
export default Grid;
