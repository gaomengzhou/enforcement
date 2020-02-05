/* eslint-disable no-shadow */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable consistent-return */
/* eslint-disable react/no-unused-state */
/* eslint-disable no-undef */
/* eslint-disable eqeqeq */
/* eslint-disable no-param-reassign */
/* eslint-disable radix */
/* eslint-disable no-plusplus */
/* eslint-disable react/sort-comp */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import Link from 'umi/link';
import { Row, Col, Form, Input, Select, Button, DatePicker, Table, Radio, Modal, Breadcrumb } from 'antd';
import residue from "../../../utils/time";

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const RadioGroup = Radio.Group;
@connect(({ timing, select, complain, inspectors, comprehensive }) => ({
  timing, select, complain, inspectors, comprehensive
}))
@Form.create()
class Workplace extends PureComponent {
  state = {
    formValues: {},
    page: 1,
    pageSize: 10,
    selectedRowKeys: [],
    value: 3,
    selectedGroupKeysId: [],         // 当前获取组键id
    complainArr: [],                 // 投诉工单
    complainArrNo: [],               // 不是投诉工单 城管工单 综合执法
    comprehensiveArr: [],            // 综合执法工单
    comprehensiveArrNo: [],          // 不是综合执法工单 是投诉工单 是城管工单
    inspectorArr: [],                // 城管工单
    inspectorArrNo: [],              // 不是城管工单 是综合执法工单 是投诉工单
    complainDispatchIds: [],         // 投诉工单 派遣 状态为2
    complainDispatchNoIds: [],       // 投诉工单 派遣 状态不为2
    comprehensiveDispatchIds: [],    // 综合执法 派遣 状态为2,3
    comprehensiveDispatchNoIds: [],  // 综合执法 派遣 状态不为2,3
    visibleDispatch: false,
    CloseCaseIds: [],                // 投诉工单 城管工单 综合执法 结案 状态为9
    CloseCaseNoIds: [],              // 投诉工单 城管工单 综合执法 结案 状态不为9
    visibleCloseCase: false,
  };

  start = () => {
    this.setState({
      selectedRowKeys: [],
    })
  };

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
    const selectedGroupKeysId = [];// 当前选中的数组id
    const complainArr = [];// 投诉工单
    const complainArrNo = [];// 不是投诉工单 是城管工单 是综合执法
    const comprehensiveArr = [];// 综合执法工单
    const comprehensiveArrNo = [];// 不是综合执法工单 是投诉工单 是城管工单
    const inspectorArr = [];// 城管工单
    const inspectorArrNo = [];// 不是城管工单 是综合执法工单 是投诉工单
    const complainDispatchIds = [];// 投诉工单 派遣 状态为2
    const complainDispatchNoIds = [];// 投诉工单 派遣 状态不为2
    const comprehensiveDispatchIds = [];// 综合执法 派遣 状态为2,3
    const comprehensiveDispatchNoIds = [];// 综合执法 派遣 状态不为2,3
    const CloseCaseIds = [];// 投诉工单 城管工单 综合执法 结案 状态为9
    const CloseCaseNoIds = [];// 投诉工单 城管工单 综合执法 结案 状态不为9
    for (let i = 0; i < selectedRowKeys.length; i++) {
      // 组键id
      const id = selectedRowKeys[i].split('/')[0].substring(0);
      // 工单类型
      const workOrderSourceId = selectedRowKeys[i].workTypeDesc;
      // 工单编号
      const workorderid = selectedRowKeys[i].split('/')[2].substring(0);
      // 当前状态
      const workorderstatus = selectedRowKeys[i].status;
      selectedGroupKeysId.push(parseInt(id));
      if (workOrderSourceId === '投诉工单') {
        complainArr.push(workOrderSourceId);
      } else {
        complainArrNo.push(workOrderSourceId);
      }
      if (workOrderSourceId === '街道自处置工单' || workOrderSourceId === '街城管工单') {
        inspectorArr.push(workOrderSourceId);
      } else {
        inspectorArrNo.push(workOrderSourceId);
      }
      if (workOrderSourceId === '街道综合执法工单' || workOrderSourceId === '区综合执法工单') {
        comprehensiveArr.push(workOrderSourceId);
      } else {
        comprehensiveArrNo.push(workOrderSourceId);
      }
      if (parseInt(workorderstatus) === 2) {
        complainDispatchIds.push(parseInt(workorderstatus));
      }
      if (parseInt(workorderstatus) !== 2) {
        complainDispatchNoIds.push(parseInt(workorderstatus));
      }
      if (parseInt(workorderstatus) === 2 || parseInt(workorderstatus) === 3) {
        comprehensiveDispatchIds.push(parseInt(workorderstatus));
      }
      if (parseInt(workorderstatus) !== 2 && parseInt(workorderstatus) !== 3) {
        comprehensiveDispatchNoIds.push(parseInt(workorderstatus));
      }
      if (parseInt(workorderstatus) === 9) {
        CloseCaseIds.push(parseInt(workorderstatus));
      }
      if (parseInt(workorderstatus) !== 9) {
        CloseCaseNoIds.push(parseInt(workorderstatus));
      }
    }
    this.setState({
      selectedGroupKeysId,
      complainArr,
      complainArrNo,
      inspectorArr,
      inspectorArrNo,
      comprehensiveArr,
      comprehensiveArrNo,
      complainDispatchIds,
      complainDispatchNoIds,
      comprehensiveDispatchIds,
      comprehensiveDispatchNoIds,
      CloseCaseIds,
      CloseCaseNoIds,
    });
  };

  // 派遣
  listDispatchCase = () => {
    this.setState({
      visibleDispatch: true,
    });
  };

  handleOkDispatch = () => {
    // 投诉举报工单类型
    if (this.state.complainArr.length > 0 && this.state.inspectorArr.length === 0 && this.state.comprehensiveArr.length === 0) {
      this.props.dispatch({
        type: 'complain/dispatchFetch',
        payload: {
          goverIds: this.state.selectedGroupKeysId,
          int: 1,
        }
      });
    }
    // 城管工单类型
    if (this.state.inspectorArr.length > 0 && this.state.complainArr.length === 0 && this.state.comprehensiveArr.length === 0) {
      this.props.dispatch({
        type: 'inspectors/dispatchFetch',
        payload: {
          flag: 2,
          orderIds: this.state.selectedGroupKeysId,
          int: 1,
        }
      });
    }
    // 综合执法工单类型
    if (this.state.comprehensiveArr.length > 0 && this.state.inspectorArr.length === 0 && this.state.complainArr.length === 0) {
      this.props.dispatch({
        type: 'comprehensive/comprehensiveDispatchFetch',
        payload: {
          enforceIds: this.state.selectedGroupKeysId,// 数组
          int: 1,
        },
      });
    }
    this.setState({
      visibleDispatch: false,
      selectedGroupKeysId: [],
      complainArr: [],
      complainArrNo: [],
      inspectorArr: [],
      inspectorArrNo: [],
      comprehensiveArr: [],
      comprehensiveArrNo: [],
      complainDispatchIds: [],
      complainDispatchNoIds: [],
      comprehensiveDispatchIds: [],
      comprehensiveDispatchNoIds: [],
      CloseCaseIds: [],
      CloseCaseNoIds: [],
      selectedRowKeys: [],
    });
  };

  handleCancelDispatch = () => {
    this.setState({
      visibleDispatch: false,
      selectedGroupKeysId: [],
      complainArr: [],
      complainArrNo: [],
      inspectorArr: [],
      inspectorArrNo: [],
      comprehensiveArr: [],
      comprehensiveArrNo: [],
      complainDispatchIds: [],
      complainDispatchNoIds: [],
      comprehensiveDispatchIds: [],
      comprehensiveDispatchNoIds: [],
      CloseCaseIds: [],
      CloseCaseNoIds: [],
      selectedRowKeys: [],
    });
  };

  // 结案
  listCloseCase = () => {
    this.setState({
      visibleCloseCase: true,
    });
  };

  handleOkCloseCase = () => {
    // 投诉举报工单类型
    if (this.state.complainArr.length > 0 && this.state.inspectorArr.length === 0 && this.state.comprehensiveArr.length === 0) {
      this.props.dispatch({
        type: 'complain/complainCloseCaseFetch',
        payload: {
          goverIds: this.state.selectedGroupKeysId,
        }
      });
    }
    // 城管工单类型
    if (this.state.inspectorArr.length > 0 && this.state.complainArr.length === 0 && this.state.comprehensiveArr.length === 0) {
      this.props.dispatch({
        type: 'inspectors/intCloseCaseFetch',
        payload: {
          orderIds: this.state.selectedGroupKeysId,
        }
      });
    }
    // 综合执法工单类型
    if (this.state.comprehensiveArr.length > 0 && this.state.inspectorArr.length === 0 && this.state.complainArr.length === 0) {
      this.props.dispatch({
        type: 'comprehensive/comprehensiveCloseCaseFetch',
        payload: {
          enforceIds: this.state.selectedGroupKeysId,// 数组
        },
      });
    }
    this.setState({
      visibleCloseCase: false,
      selectedGroupKeysId: [],
      complainArr: [],
      complainArrNo: [],
      inspectorArr: [],
      inspectorArrNo: [],
      comprehensiveArr: [],
      comprehensiveArrNo: [],
      complainDispatchIds: [],
      complainDispatchNoIds: [],
      comprehensiveDispatchIds: [],
      comprehensiveDispatchNoIds: [],
      CloseCaseIds: [],
      CloseCaseNoIds: [],
      selectedRowKeys: [],
    });
  };

  handleCancelCloseCase = () => {
    this.setState({
      visibleCloseCase: false,
      selectedGroupKeysId: [],
      complainArr: [],
      complainArrNo: [],
      inspectorArr: [],
      inspectorArrNo: [],
      comprehensiveArr: [],
      comprehensiveArrNo: [],
      complainDispatchIds: [],
      complainDispatchNoIds: [],
      comprehensiveDispatchIds: [],
      comprehensiveDispatchNoIds: [],
      CloseCaseIds: [],
      CloseCaseNoIds: [],
      selectedRowKeys: [],
    });
  };

  componentDidMount() {
    // 列表
    this.props.dispatch({
      type: 'timing/timinglistFetch',
      payload: {
        page: 1,
        pageSize: 10,
        userRole: window.sessionStorage.userRole,
        type: 1
      }
    });
    // 社区
    this.props.dispatch({
      type: 'select/community',
    });
    // 部门 department  getdepartment
    this.props.dispatch({
      type: 'select/getdepartment',
    });
    // 状态
    this.props.dispatch({
      type: 'select/status',
    });
  }
  ;

  // 分页
  handleTableChange = (page, size) => {
    this.setState({
      page,
      pageSize: size,
    });
    this.props.dispatch({
      type: 'timing/timinglistFetch',
      payload: Object.assign({
        page,
        pageSize: size,
        userRole: window.sessionStorage.userRole,
        type: 1
      },
        this.state.formValues)
    })
  };

  // 查询
  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (values.createdate) {
        values.createdate = moment(values.createdate).format('YYYY-MM-DD ')
      };
      if (values.reporttime) {
        values.reporttime = moment(values.reporttime).format('YYYY-MM-DD ')
      }
      this.props.dispatch({
        type: 'timing/timinglistFetchForCheck',
        payload: {
          page: 1,
          pageSize: 10,
          userRole: window.sessionStorage.userRole,
          type: 1,
          obj: {
            assistDepartment_S_EQ: values.sponsordepartment,
            createDate_D_GE: `${values.createdate}00:00:00`,
            createDate_D_LE: `${values.createdate}23:59:59`,
            incidentDate_D_GE: `${values.reporttime}00:00:00`,
            incidentDate_D_LE: `${values.reporttime}23:59:59`,
            ownCommunity_S_EQ: values.complainaddresscommunity,
            status_S_EQ: values.workOrderStatusId,
            workOrderId_S_EQ: values.workorderid
          }
        }
      });
      this.setState({
        page: 1,
        pageSize: 10,
        formValues: values,
      })
    });
  };

  // 分页 类型
  // onChangeRadio = (e) => {
  //   this.props.dispatch({
  //     type: 'timing/timinglistFetch',
  //     payload: {
  //       page: 1,
  //       pageSize: 10,
  //       status: e.target.value,
  //       userRole: window.sessionStorage.userRole,
  //       type: 1
  //     }
  //   });
  //   this.setState({
  //     page: 1,
  //     pageSize: 10,
  //     value: e.target.value,
  //   });
  // };
  //
  onChangeRadio = e => {
    const { dispatch } = this.props;
    const { page, pageSize } = this.state;
    // 待处理
    if (e.target.value == '1') {
      this.setState({
        page: 1,
        pageSize: 10,
        value: e.target.value,
      })
      if (window.sessionStorage.userRole == '1') {
        const obj = {};
        obj.statusDesc_S_EQ = "待审核";
        dispatch({
          type: 'timing/timinglistFetch',
          payload: {
            page: 1,
            pageSize: 10,
            userRole: window.sessionStorage.userRole,
            type: 1,
            obj
          },
        });
        // this.setState({
        //   page: 1,
        //   pageSize: 10,
        //   value: e.target.value,

        // callback: res => {
        //   if (res) {
        //     if (res.retCode == 1) {
        //       let w = res.list.filter(item => item.isExamine == '1').filter(item => item.status == '2');
        //       this.setState({
        //         dataSource: w,
        //         totalNumber: w.length,
        //         value: e.target.value,
        //       });
        //     }
        //   }
        // },
        // });
      }
      if (window.sessionStorage.userRole == '2') {
        const obj = {};
        obj.status_S_NE = "1";
        obj.statusDesc_S_IN = ['待派遣', '处置反馈完毕二级'];
        dispatch({
          type: 'timing/timinglistFetch',
          payload: {
            page: 1,
            pageSize: 10,
            userRole: window.sessionStorage.userRole,
            type: 1,
            obj
          },
          // callback: res => {
          //   if (res) {
          //     if (res.retCode == 1) {
          //       let w = res.list.filter(item => item.status == '2' || item.status == '3' || item.status == '9' || (item.status == '5' && item.isReview == "1"));
          //       this.setState({
          //         dataSource: w,
          //         totalNumber: w.length,
          //         value: e.target.value,
          //       });
          //     }
          //   }
          // },
        });
      }
      if (window.sessionStorage.userRole == '3') {
        const obj = {};
        obj.statusDesc_S_IN = ['待派遣', '处置反馈完毕二级'];
        dispatch({
          type: 'timing/timinglistFetch',
          payload: {
            page: 1,
            pageSize: 10,
            userRole: window.sessionStorage.userRole,
            type: 1,
            obj
          },
          // callback: res => {
          //   if (res) {
          //     if (res.retCode == 1) {
          //       let w = res.list.filter(item => item.isArrangeDesc == "需安排" || item.isAuditDesc == "需审核");
          //       this.setState({
          //         dataSource: w,
          //         totalNumber: w.length,
          //         value: e.target.value,
          //       });
          //     }
          //   }
          // },
        });
      }
      if (window.sessionStorage.userRole == '4') {
        const obj = {};
        obj.status_S_IN = ['待上报', '待处置'];
        dispatch({
          type: 'timing/timinglistFetch',
          payload: {
            page: 1,
            pageSize: 10,
            userRole: window.sessionStorage.userRole,
            type: 1,
            obj
          },
          // callback: res => {
          //   if (res) {
          //     if (res.retCode == 1) {
          //       let w = res.list.filter(item => item.status == '1' || (item.status == '5' && item.isReview != "1"));
          //       this.setState({
          //         dataSource: w,
          //         totalNumber: w.length,
          //         value: e.target.value,
          //       });
          //     }
          //   }
          // },
        });
      }
    }
    // 已处理
    if (e.target.value == '2') {
      if (window.sessionStorage.userRole == '1') {
        const obj = {};
        obj.statusDesc_S_IN = ['待派遣', '已结案', '废案', '删除']
        dispatch({
          type: 'timing/timinglistFetch',
          payload: {
            page: 1,
            pageSize: 10,
            userRole: window.sessionStorage.userRole,
            type: 1,
            obj
          },
        });
        this.setState({
          page: 1,
          pageSize: 10,
          value: e.target.value,
        });
      }

      if (window.sessionStorage.userRole == '2') {
        const obj = {};
        obj.statusDesc_S_IN = ['处置反馈完毕', '已结案', '废案'];
        dispatch({
          type: 'timing/timinglistFetch',
          payload: {
            page: 1,
            pageSize: 10,
            userRole: window.sessionStorage.userRole,
            type: 1,
            obj
          },
        });
        this.setState({
          page: 1,
          pageSize: 10,
          value: e.target.value,
        });
      }
      if (window.sessionStorage.userRole == '3') {
        const obj = {};
        dispatch({
          type: 'timing/timinglistFetch',
          payload: {
            page: 1,
            pageSize,
            id: userRole,
            obj,
          },
          callback: res => {
            if (res) {
              if (res.retCode == 1) {
                const w = res.list.filter(item => item.isArrangeDesc != "需安排" && item.isAuditDesc != "需审核");
                this.setState({
                  dataSource: w,
                  totalNumber: w.length,
                  value: e.target.value,
                });
              }
            }
          },
        });
      }
      if (window.sessionStorage.userRole == '4') {
        const obj = {};
        obj.statusDesc_S_S_NE = "待上报";
        dispatch({
          type: 'timing/timinglistFetch',
          payload: {
            page: 1,
            pageSize: 10,
            userRole: window.sessionStorage.userRole,
            type: 1,
            obj
          },
          // callback: res => {
          //   if (res) {
          //     if (res.retCode == 1) {
          //       let w = res.list.filter(item => item.status != '1' && (item.status == '5' && item.isReview == "1"))
          //       this.setState({
          //         dataSource: w,
          //         totalNumber: w.length,
          //         value: e.target.value,
          //       });
          //     }
          //   }
          // },
        });
      }
    }
    // 全部
    if (e.target.value == '3') {
      this.props.dispatch({
        type: 'timing/timinglistFetch',
        payload: {
          page: 1,
          pageSize: 10,
          userRole: window.sessionStorage.userRole,
          type: 1
        }
      });
      this.setState({
        page: 1,
        pageSize: 10,
        value: e.target.value,
      });
    }
  };

  // 重置
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    dispatch({
      type: 'timing/timinglistFetch',
      payload: {
        page: 1,
        pageSize: 10,
        userRole: window.sessionStorage.userRole,
        type: 1,
      }
    });
    this.setState({
      page: 1,
      pageSize: 10,
      formValues: {},
      value: 3
    })
  };

  // 定时设置
  timingSetting = () => {
    this.props.history.push('/workOrder/intelligentize/timing/statistics');
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { selectedRowKeys, page, pageSize, complainArr, complainArrNo, complainDispatchIds, complainDispatchNoIds,
      inspectorArr, inspectorArrNo, comprehensiveArr, comprehensiveArrNo, comprehensiveDispatchIds, comprehensiveDispatchNoIds,
      CloseCaseIds, CloseCaseNoIds } = this.state;
    const { timing, select, complain, inspectors, comprehensive } = this.props;
    const { timingList } = timing;
    const { communityList, departmentList, statusList } = select;
    const disableDispatch = !((complainArr.length > 0 && complainArrNo.length === 0 && complainDispatchIds.length > 0 && complainDispatchNoIds.length === 0) || (inspectorArr.length > 0 && inspectorArrNo.length === 0 && complainDispatchIds.length > 0 && complainDispatchNoIds.length === 0) || (comprehensiveArr.length > 0 && comprehensiveArrNo.length === 0 && comprehensiveDispatchIds.length > 0 && comprehensiveDispatchNoIds.length === 0))
    const disableCloseCase = !((complainArr.length > 0 && complainArrNo.length === 0 && CloseCaseIds.length > 0 && CloseCaseNoIds.length === 0) || (inspectorArr.length > 0 && inspectorArrNo.length === 0 && CloseCaseIds.length > 0 && CloseCaseNoIds.length === 0) || (comprehensiveArr.length > 0 && comprehensiveArrNo.length === 0 && CloseCaseIds.length > 0 && CloseCaseNoIds.length === 0))
    const that = this;
    const url = '/workOrder/intelligentize/timing/detail';
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const columns = [
      {
        title: '工单类型',
        dataIndex: 'workTypeDesc',
      },
      // {
      //   title: '剩余时间',
      //   dataIndex: 'age',
      //   render: (text, record) => (
      //     <span>{residue(record.deadline)}</span>
      //   )
      // },
      {
        title: '工单编号',
        dataIndex: 'workOrderId',
        render: (text, record) => {
          if (record.workType == '1') { // 城管工单
            return (
              <Link to={`/workOrder/department/inspectors/detail/${record.workOrderId}/${sessionStorage.getItem('userRole')}/0`}>{text}</Link>
            )
          } if (record.workType == '2') { // 综合执法工单
            return (
              <Link to={`/workOrder/department/comprehensive/detail/${record.workOrderId}/${sessionStorage.getItem('userRole')}/0`}>{text}</Link>
            )
          } if (record.workType == '3') { // 投诉工单
            return (
              <Link to={`/workOrder/department/complain/detail/${record.workOrderId}/${sessionStorage.getItem('userRole')}/0`}>{text}</Link>
            )
          }
        },
      },
      {
        title: '当前状态',
        dataIndex: 'statusDesc',
      },
      {
        title: '事发时间',
        dataIndex: 'incidentDate',
      },
      {
        title: '所属社区',
        dataIndex: 'ownCommunityDesc',
      },
      {
        title: '创建时间',
        dataIndex: 'createDate',
      },
      {
        title: '主办部门',
        dataIndex: 'assistDepartmentDesc',
      },
    ];
    return (
      <div id="listTitleContent">
        <Breadcrumb separator=">">
          <span id="breadcrumbIcon" />
          <Breadcrumb.Item>首页</Breadcrumb.Item>
          <Breadcrumb.Item href="">智能生成</Breadcrumb.Item>
          <Breadcrumb.Item href="">定时生成</Breadcrumb.Item>
        </Breadcrumb>
        <div id="tableForm">
          <h3 id="listTitle">定时生成</h3>
          <Form onSubmit={this.handleSearch} layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={6} sm={8}>
                <FormItem label="工单编号">
                  {getFieldDecorator('workorderid')(
                    <Input placeholder="请输入" />
                  )}
                </FormItem>
              </Col>
              <Col md={6} sm={8}>
                <FormItem label="状态">
                  {getFieldDecorator('workOrderStatusId')(
                    <Select placeholder="请选择" allowClear>
                      {statusList.map((val) => {
                        return (
                          <Select.Option key={val.id} value={val.parentId}>{val.desp}</Select.Option>
                        )
                      })}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={6} sm={8}>
                <FormItem label="所属社区">
                  {getFieldDecorator('complainaddresscommunity')(
                    <Select placeholder="请选择" allowClear>
                      {communityList.map((val) => {
                        return (
                          <Select.Option key={val.id} value={val.code}>{val.desp}</Select.Option>
                        )
                      })}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={6} sm={8}>
                <FormItem label="创建时间">
                  {getFieldDecorator('createdate')(
                    <DatePicker placeholder="请输入" style={{ width: '100%' }} />
                  )}
                </FormItem>
              </Col>
              <Col md={6} sm={8}>
                <FormItem label="主办部门">
                  {getFieldDecorator('sponsordepartment')(
                    <Select placeholder="请选择" allowClear>
                      {departmentList.map((val) => {
                        return (
                          <Select.Option key={val.id} value={val.orgCode}>{val.orgName}</Select.Option>
                        )
                      })}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={6} sm={8}>
                <FormItem label="事发时间">
                  {getFieldDecorator('reporttime')(
                    <DatePicker placeholder="请选择时间" format="YYYY-MM-DD" style={{ width: '100%' }} />
                  )}
                </FormItem>
              </Col>
              <Col md={12} sm={16} style={{ textAlign: 'right' }}>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button id="buttonReset" style={{ marginRight: 0, marginLeft: 16 }} onClick={this.handleFormReset}>
                  重置
                </Button>
              </Col>
            </Row>
          </Form>
          <div id="listOperator">
            <Button type="primary" disabled={disableCloseCase} onClick={this.listCloseCase}>结案</Button>
            <Button type="primary" disabled={disableDispatch} onClick={this.listDispatchCase}>派遣</Button>
            <Button type="primary" onClick={this.timingSetting.bind(this)}>定时设置</Button>
          </div>
        </div>
        <div id="listTable">
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={timingList.list}
            // rowKey='ids'
            //  return `${record.workOrderId}/${record.workOrderId}2/${record.workOrderId}3/${record.workOrderId}4`}}
            pagination={{
              current: page,
              pageSize,
              onShowSizeChange(current, pageSize) {
                that.handleTableChange(current, pageSize);
              },
              onChange(current, pageSize) {
                that.handleTableChange(current, pageSize);
              },
              total: timingList.total,
              showTotal: total => `共 ${total} 条数据`,
              size: 'small',
              showSizeChanger: true,
              showQuickJumper: true,
              pageSizeOptions: ['10', '15', '20']
            }}
          />
        </div>
        <div style={{ width: 400, position: 'relative', top: '-80px', left: '50px', display: 'none' }}>
          <RadioGroup onChange={this.onChangeRadio} value={this.state.value}>
            <Radio value={1}>待处理</Radio>
            <Radio value={2}>已处理</Radio>
            <Radio value={3}>全部</Radio>
          </RadioGroup>
        </div>
        <Modal
          title="派遣"
          visible={this.state.visibleDispatch}
          onOk={this.handleOkDispatch}
          onCancel={this.handleCancelDispatch}
        >
          <p>请确定是否派遣</p>
        </Modal>
        <Modal
          title="结案"
          visible={this.state.visibleCloseCase}
          onOk={this.handleOkCloseCase}
          onCancel={this.handleCancelCloseCase}
        >
          <p>请确定是否派遣</p>
        </Modal>
      </div>
    );
  }
}

export default Workplace;
