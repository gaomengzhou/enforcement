/* eslint-disable array-callback-return */
/* eslint-disable func-names */
/* eslint-disable no-shadow */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-nested-ternary */
/* eslint-disable consistent-return */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-plusplus */
/* eslint-disable eqeqeq */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-param-reassign */
/* eslint-disable react/sort-comp */
/* eslint-disable react/no-unused-state */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import Link from 'umi/link';
import { Row, Col, Form, Input, Select, Button, DatePicker, Table, Radio, Tabs, Icon, Modal, message, Breadcrumb, Tooltip, Upload } from 'antd';
import residue from "../../utils/time";
import CityDetail from './CityDetail';
import ComprehensiveDetail from './ComprehensiveDetail';
import ComplaintDetail from './ComplaintDetail';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const { Dragger } = Upload;
const Formats = 'YYYY-MM-DD HH:mm:ss';

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

@connect(({ match, select, inspectors }) => ({
  match, select, inspectors
}))
@Form.create()
class Workplace extends PureComponent {
  state = {
    unit: '1',
    formValues: {},
    page: 1,
    pageSize: 10,
    selectedRowKeys: [],
    value: 1,
    visible: false,
    mapBox: false, // 地图弹窗
    statisticalConditionList: [],
    statisticalConditionList0: [],
    statisticalConditionList1: [],
    statisticalConditionList2: [],
    statisticalConditionList3: [],
    statisticalConditionList4: [],
    statisticalConditionList5: [],
    statisticalConditionList6: [],
    statisticsIntArr: [],// 统计条件数组
    listbigAllClass: [],// 查询列表 所有案件大类
    listSmallAllClass: [],// 查询列表 所有案件小类
    statisticsIntObj: {},// 手动条件
    visibleImportWord: false,
    fileWordName: '',
    info: {},
    fileList: [],
    fileListTwo: [],
    orderId: [],
    orderType: [],
    isOrderTypeChange: '',// 根据这里面的状态来决定显示哪个工单
    tabsKey: '0',
  };

  // 导入12345工单
  import = () => {
    this.setState({
      visibleImportWord: true,
    });
  };

  // 保存
  increaseIt = () => {
    this.setState({
      visible: false,
      orderId: [],
      orderType: []
    });
  };

  handleOkImportWord() {
    const form = new FormData;
    const word = document.getElementById('file').files[0];
    if (word) {
      form.append('file', word);
      new Promise(resolve => {
        this.props.dispatch({
          type: 'match/import',
          payload: {
            file: form,
            resolve,
          },
        })
      }).then((res) => {

      });
      this.setState({
        fileWordName: '',
        visibleImportWord: false,
      })
    } else {
      message.error('请先选择需要导入的文件')
    }
  };

  handleCancelImportWord = () => {
    this.setState({
      fileWordName: '',
      visibleImportWord: false,
    });
  };

  changeImpotWord = () => {
    const file = document.getElementById('file').files[0];
    if (file) {
      this.setState({
        fileWordName: file.name
      })
    } else {
      this.setState({
        fileWordName: ''
      })
    }
  };

  start = () => {
    this.setState({
      selectedRowKeys: [],
    })
  };

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  };

  componentDidMount() {
    // 列表  //type: 'match/matchListFetch',
    this.props.dispatch({
      type: 'match/matchListFetch',
      payload: {
        page: 1,
        pageSize: 10,
        userRole: window.sessionStorage.userRole,
        type: 2
      }
    });
    // 统计条件 列表
    new Promise(resolve => {
      this.props.dispatch({
        type: 'match/matchGenerationFetch',
        payload: {
          resolve,
        }
      })
    }).then((res) => {
      this.setState({
        statisticalConditionList: res.data,
        statisticalConditionList0: res.data[0],
        statisticalConditionList1: res.data[1],
        statisticalConditionList2: res.data[2],
        statisticalConditionList3: res.data[3],
        statisticalConditionList4: res.data[4],
        statisticalConditionList5: res.data[5],
        statisticalConditionList6: res.data[6],
      });
    });
    // 查询列表 查询所有案件大类 bigAllClassFetch
    new Promise(resolve => {
      this.props.dispatch({
        type: 'inspectors/bigAllClassFetch',
        payload: {
          resolve,
        }
      })
    }).then((res) => {
      this.setState({
        listbigAllClass: res.data,
      })
    });
    // 社区
    this.props.dispatch({
      type: 'select/community',
    });
    // 部门 department
    this.props.dispatch({
      type: 'select/getdepartment',
    });
    // 状态
    this.props.dispatch({
      type: 'select/status',
    });
    // 归口类型
    this.props.dispatch({
      type: 'select/convergenceProgram',
    });
    // 案件类别
    this.props.dispatch({
      type: 'select/bigClass',
    });
  }
  ;
  // 手动条件智能生成  列表案件大类 查询 案件小类
  bigClassSearch = (value) => {
    const { form } = this.props;
    const int = this.state.statisticsIntObj;
    // 案件小类
    if (value) {
      const { parentId } = this.state.listbigAllClass.filter(i => i.code == value)[0];
      new Promise(resolve => {
        this.props.dispatch({
          type: 'inspectors/smallClassFetch',
          payload: {
            resolve,
            largeClassCode: parentId,
          }
        })
      }).then((res) => {
        this.setState({
          listSmallAllClass: res.data,
        });
      });
      const t = Object.assign({ "bigTypeValue": value }, int);
      this.setState({
        statisticsIntObj: t,
      })
    } else {
      this.setState({
        listSmallAllClass: [],
      })
    }
    form.setFieldsValue({ smallTypeValue: '' })
  };

  // 手动条件智能生成 案件小类 查询
  smallClassSearch(value) {
    console.log(value);
  }

  // 手动条件智能生成 社区
  communitySearch(value) {
    console.log(value)
  }

  // 手动条件智能生成 归口类型
  typeSearch(value) {
    console.log(value)
  }

  // 手动条件智能生成 案件类别
  caseBigSearch(value) {
    console.log(value)
  }

  // 分页 类型
  onChangeRadio = (e) => {
    this.props.dispatch({
      type: 'match/matchListFetch',
      payload: {
        page: 1,
        pageSize: 10,
        workOrderStatus: e.target.value,
        userRole: window.sessionStorage.userRole,
        type: 2
      }
    });
    this.setState({
      page: 1,
      pageSize: 10,
      value: e.target.value,
    });
  };

  // 分页
  handleTableChange = (page, size) => {
    this.setState({
      page,
      pageSize: size,
    });
    this.props.dispatch({
      type: 'match/matchListFetch',
      payload: {
        page,
        pageSize: size,
        userRole: window.sessionStorage.userRole,
        type: 2
      },

    })
  };

  // 查询
  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (values.createdateSearch) {
        values.createdateSearch = moment(values.createdateSearch).format('YYYY-MM-DD ')
      }
      this.props.dispatch({
        type: 'match/matchListFetch',
        payload: {
          page: 1,
          pageSize: 10,
          userRole: window.sessionStorage.userRole,
          type: 2,
          obj: {
            workOrderId_S_EQ: values.workorderidSearch,
            status_S_EQ: values.workOrderStatusSearch,
            ownCommunity_S_EQ: values.ownCommunitySearch,
            createDate_D_GE: `${values.createdateSearch}00:00:00`,
            createDate_D_LE: `${values.createdateSearch}23:59:59`,
            assistDepartment_S_EQ: values.sponsorDepartmentSearch
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

  // 重置
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    dispatch({
      type: 'match/matchListFetch',
      payload: {
        page: 1,
        pageSize: 10,
        userRole: window.sessionStorage.userRole,
        type: 2
      }
    });
    this.setState({
      page: 1,
      pageSize: 10,
      formValues: {},
    })
  };

  changeUnit = (key) => {
    this.setState({
      unit: key
    })
  };

  // 统计条件 列表
  statisticsInt(id) {
    const int = this.state.statisticsIntArr;
    for (let i = 0; i < this.state.statisticalConditionList.length; i++) {
      if (id === this.state.statisticalConditionList[i].id) {
        if (int.length === 0) {
          int.push(this.state.statisticalConditionList[i]);
        } else if (int.indexOf(this.state.statisticalConditionList[i]) == -1) {
          int.push(this.state.statisticalConditionList[i]);
        } else {
          for (let j = 0; j < int.length; j++) {
            if (id === int[j].id) {
              int.splice(j, 1)
            }
          }
        }
      }
    }
    this.setState({
      statisticsIntArr: [...int],
    })
  }
  ;
  // 右侧条件统计 智能生成 按钮
  statisticsIntClose = (id) => {
    const int = this.state.statisticsIntArr;
    for (let j = 0; j < int.length; j++) {
      if (id === int[j].id) {
        int.splice(j, 1)
      }
    }
    this.setState({
      statisticsIntArr: [...int],
    })
  }

  statisticsIntList() {
    if (this.state.statisticsIntArr.length > 0) {
      this.setState({
        visible: true
      })
    }

    new Promise(resolve => {
      this.props.dispatch({
        type: 'match/matchGenerationIntFetch',
        payload: {
          statisticsIntArr: this.state.statisticsIntArr,
          resolve
        }
      });
    }).then(res => {
      if (res) {
        for (let i = 0; i < res.data.length; i++) {
          this.state.orderId.push(res.data[i].orderId);
          this.state.orderType.push(res.data[i].orderType);
        }
        if (this.state.orderType[0] === 'complaint_order') {// 投诉工单
          this.setState({
            isOrderTypeChange: 'complaint_order'
          })

          this.props.dispatch({
            type: 'match/complaint_order',
            payload: {
              id: this.state.orderId[0],
              userRole: window.sessionStorage.userRole,
              check: '0'
            }
          });
        }
        if (this.state.orderType[0] === 'urban_order') { // 城管工单
          this.setState({
            isOrderTypeChange: 'urban_order'
          })

          this.props.dispatch({
            type: 'match/urban_order',
            payload: {
              id: this.state.orderId[0],
              userRole: window.sessionStorage.userRole,
              check: '0'
            }
          });
        }
        if (this.state.orderType[0] === 'comprehensive_order') { // 综合执法
          this.setState({
            isOrderTypeChange: 'comprehensive_order'
          })

          this.props.dispatch({
            type: 'match/comprehensive_order',
            payload: {
              id: this.state.orderId[0],
              userRole: window.sessionStorage.userRole,
              check: '0'
            }
          });
        }
      }
    })
  }

  // 统计条件 生成 清空
  statisticsIntListClear() {
    this.setState({
      statisticsIntArr: [],
    })
  }

  // 手动条件生成 按钮
  manualIntList = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      this.props.dispatch({
        type: 'match/matchManualFetch',
        payload: {
          ownCommunity: values.communityValue,
          caseBigType: values.bigTypeValue,
          caseSmallType: values.smallTypeValue,
          homecomingType: values.typeValue,
          workOrderType: values.caseBigType,
          assistTime: values.completeTime,
          unit: this.state.unit
        },
      });
    });
  };

  // 手动条件生成 清空
  manualIntListClear() {
    const { form } = this.props;
    form.resetFields();
  }

  handleOk = e => {
    this.setState({
      visible: false,
      orderId: [],
      orderType: []
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false,
      orderId: [],
      orderType: []
    });
  };

  handleCancelMap = () => {
    this.setState({
      mapBox: false
    })
  }

  // 查看地图
  showMap = v => {
    this.setState({
      mapBox: true,
    });
  };

  // 整改前上传图片
  handleChange = info => {
    const { dispatch } = this.props;
    this.setState({ fileList: info.fileList }, () => {
      const { fileList, filePath, datail } = this.state;
      if (info.file.status === 'error') {
        this.setState({ uploading: false }, () => {
          message.error('上传失败!');
        });
        return;
      }
      if (info.file.status === 'uploading') {
        this.setState({ uploading: true });
        return;
      }
      if (info.file.status === 'done') {
        const { name, originFileObj } = info.file;
        const that = this;
        const oldPic = getBase64(originFileObj);
        oldPic.then(function (result) {
          const watermark = document.createElement('canvas');
          watermark.width = 533;
          watermark.height = 300;
          const imgs = new Image();
          const timer = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
          imgs.width = 533;
          imgs.height = 300;
          imgs.src = result;
          imgs.onload = () => {
            const ctx = watermark.getContext('2d');
            ctx.drawImage(imgs, 0, 0, 533, 300);
            ctx.font = "16px Arial";
            ctx.fillStyle = 'red';
            ctx.fillText(`${timer} -- 整改前`, 292, 280);
            const img = watermark.toDataURL('image/png').substr(22);
            dispatch({
              type: 'Inspectorsmodels/watermarks',
              payload: {
                data: img,
                name: originFileObj.name
              },
              callback: res => {
                if (res.sucess) {
                  const id = Array.isArray(res.entity) ? res.entity[0].id : '';
                  that.setState({
                    uploading: false,
                    filePath: [id, ...filePath],
                  });
                } else {
                  that.setState({ uploading: false }, () => {
                    message.error('上传失败!');
                  });
                }
              },
            })
          };
        });
      }
    });
  };

  // 整改后上传图片
  handleChangeTwo = info => {
    const { dispatch } = this.props;
    this.setState({ fileListTwo: info.fileList }, () => {
      const { fileListTwo, filePathTwo, datail } = this.state;
      if (info.file.status === 'error') {
        this.setState({ uploading: false }, () => {
          message.error('上传失败!');
        });
        return;
      }
      if (info.file.status === 'uploading') {
        this.setState({ uploading: true });
        return;
      }
      if (info.file.status === 'done') {
        const { name, originFileObj } = info.file;
        const that = this;
        const oldPic = getBase64(originFileObj);
        oldPic.then(function (result) {
          const watermark = document.createElement('canvas');
          watermark.width = 533;
          watermark.height = 300;
          const imgs = new Image();
          const timer = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
          imgs.width = 533;
          imgs.height = 300;
          imgs.src = result;
          imgs.onload = () => {
            const ctx = watermark.getContext('2d');
            ctx.drawImage(imgs, 0, 0, 533, 300);
            ctx.font = "16px Arial";
            ctx.fillStyle = 'red';
            ctx.fillText(`${timer} -- 整改后`, 292, 280);
            const img = watermark.toDataURL('image/png').substr(22);
            dispatch({
              type: 'Inspectorsmodels/watermarks',
              payload: {
                data: img,
                name: originFileObj.name
              },
              callback: res => {
                if (res.sucess) {
                  const id = Array.isArray(res.entity) ? res.entity[0].id : '';
                  that.setState({
                    uploading: false,
                    filePathTwo: [id, ...filePathTwo],
                  });
                } else {
                  that.setState({ uploading: false }, () => {
                    message.error('上传失败!');
                  });
                }
              },
            })
          };
        });
      }
    });
  };

  // 整改前
  renderAttachment() {
    const { uploading, fileList, filePath, previewVisible, previewImage } = this.props;
    const uploadProps = {
      name: 'file',
      action: '/services/attachment/file/upload/AttachmentUpload',
      onChange: this.handleChange,
      status: 'done',
      fileList: [...fileList],
      listType: 'picture',
      onPreview: this.props.handlePreview.bind(this, "before"),
      onRemove: this.props.handleRemove,
    };
    const uploadButton = (
      <div>
        <Button className="ant-upload-text">整改前附件</Button>
      </div>
    );
    return (
      <Fragment>
        <div className="clearfix">
          <Upload {...uploadProps}>{fileList.length >= 10 ? null : uploadButton}</Upload>
          <Modal visible={previewVisible} footer={null} onCancel={this.props.handleCancel}>
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>
        </div>
      </Fragment>
    );
  }

  // 整改后
  renderAttachmentTwo() {
    const {
      uploading,
      fileListTwo,
      filePathTwo,
      previewVisible,
      previewImage,
    } = this.props;
    const uploadProps = {
      name: 'file',
      action: '/services/attachment/file/upload/AttachmentUpload',
      onChange: this.handleChangeTwo,
      status: 'done',
      fileList: [...fileListTwo],
      listType: 'picture',
      onPreview: this.props.handlePreview.bind(this, "after"),
      onRemove: this.props.handleRemoveTwo,
    };
    const uploadButton = (
      <div>
        <Button className="ant-upload-text">
          整改后附件
        </Button>
      </div>
    );
    return (
      <Fragment>
        <div className="clearfix">
          <Upload {...uploadProps}>{fileListTwo.length >= 10 ? null : uploadButton}</Upload>
          <Modal visible={previewVisible} footer={null} onCancel={this.props.handleCancel}>
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>
        </div>
      </Fragment>
    );
  }

  render() {
    const { select, match } = this.props;
    const { matchList, orderData, modalDataList } = match;
    console.log(modalDataList)
    const { communityList, departmentList, statusList, bigClassListSelect, convergenceProgramList } = select;
    const { selectedRowKeys, page, pageSize, unit, listbigAllClass, listSmallAllClass, } = this.state;
    const { getFieldDecorator } = this.props.form;
    const that = this;
    function callback(val) {
      that.setState({
        tabsKey: val
      });
      if (that.state.orderType[val] === 'complaint_order') {// 投诉工单
        that.setState({
          isOrderTypeChange: 'complaint_order'
        })

        that.props.dispatch({
          type: 'match/complaint_order',
          payload: {
            id: that.state.orderId[val],
            userRole: window.sessionStorage.userRole,
            check: '0'
          }
        });
      }
      if (that.state.orderType[val] === 'urban_order') { // 城管工单
        that.setState({
          isOrderTypeChange: 'urban_order'
        })

        that.props.dispatch({
          type: 'match/urban_order',
          payload: {
            id: that.state.orderId[val],
            userRole: window.sessionStorage.userRole,
            check: '0'
          }
        });
      }
      if (that.state.orderType[val] === 'comprehensive_order') {
        that.setState({
          isOrderTypeChange: 'comprehensive_order'
        })

        that.props.dispatch({
          type: 'match/comprehensive_order',
          payload: {
            id: that.state.orderId[val],
            userRole: window.sessionStorage.userRole,
            check: '0'
          }
        });
      }
    }
    const selectAfter = (
      <Select value={unit} style={{ width: 80 }} onChange={this.changeUnit}>
        <Option value="1">小时</Option>
        <Option value="2">天</Option>
      </Select>
    );
    const selectAfter2 = (
      <Select value={unit} style={{ width: 80 }} onChange={this.changeUnit}>
        <Option value="1">小时</Option>
        <Option value="2">天</Option>
      </Select>
    );
    const url = '/workOrder/intelligentize/timing/detail';
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const columns = [
      {
        title: '工单类型',
        dataIndex: 'workTypeDesc',
        key: 'workTypeDesc',
        // render: (text, record) =>{
        //   return (
        //   <span>{text ? (
        //     text === 1 ? '投诉工单' : (
        //       text === 2 ? '综合执法' : (
        //         text === 3 ? '投诉工单' : ''
        //       )
        //     )
        //   ) : ''}
        //   </span>
        // )},
      },
      // {
      //   title: '剩余时间',
      //   dataIndex: 'age',
      //   key: 'age',
      //   render: (text, record) => (
      //     <span>{residue(record.deadline)}</span>
      //   )
      // },
      {
        title: '工单编号',
        dataIndex: 'workOrderId',
        key: 'workOrderId',
        render: (text, record) => {
          if (record.workType == '1') { // 城管工单
            return (
              <Link to={`/workOrder/intelligentize/matching/cityManagement/${record.workOrderId}/${sessionStorage.getItem('userRole')}/0`}>{text}</Link>
              // <Link to={`/workOrder/department/inspectors/detail/${record.workOrderId}/${sessionStorage.getItem('userRole')}/0`}>{text}</Link>
            )
          } if (record.workType == '2') { // 综合执法工单
            return (
              <Link to={`/workOrder/intelligentize/matching/comprehensiveLawEnforcement/${record.workOrderId}/${sessionStorage.getItem('userRole')}/0`}>{text}</Link>
              // <Link to={`/workOrder/department/comprehensive/detail/${record.workOrderId}/${sessionStorage.getItem('userRole')}/0`}>{text}</Link>
            )
          } if (record.workType == '3') { // 投诉工单
            return (
              <Link to={`/workOrder/intelligentize/matching/complaint/${record.workOrderId}/${sessionStorage.getItem('userRole')}/0`}>{text}</Link>
              // <Link to={`/workOrder/department/complain/detail/${record.workOrderId}/${sessionStorage.getItem('userRole')}/0`}>{text}</Link>
            )
          }
        },
      },
      {
        title: '当前状态',
        dataIndex: 'statusDesc',
        key: 'statusDesc',
      },
      {
        title: '办结时限',
        dataIndex: 'deadline',
        key: 'deadline',
      },
      {
        title: '所属社区',
        dataIndex: 'ownCommunityDesc',
        key: 'ownCommunityDesc',
      },
      {
        title: '案件描述',
        dataIndex: 'caseDescribe',
        key: 'caseDescribe',
      },
      {
        title: '创建时间',
        dataIndex: 'createDate',
        key: 'createDate',
      },
      {
        title: '主办部门',
        dataIndex: 'assistDepartmentDesc',
        key: 'assistDepartmentDesc',
      },
    ];
    return (
      <div id="listTitleContent">
        <Breadcrumb separator=">">
          <span id="breadcrumbIcon" />
          <Breadcrumb.Item>首页</Breadcrumb.Item>
          <Breadcrumb.Item href="">智能生成</Breadcrumb.Item>
          <Breadcrumb.Item href="">匹配生成</Breadcrumb.Item>
        </Breadcrumb>
        <div id="listTitleDetailTabMatch">
          <h3 id="listTitle">匹配生成</h3>
          <div style={{ position: 'absolute', zIndex: 10, }}>
            <Button type="primary" style={{ width: 130, height: 39, marginLeft: 10 }} onClick={this.import}>导入12345工单</Button>
          </div>
          <Tabs defaultActiveKey="1" type="card">
            <TabPane tab="统计条件" key="1">
              <Row gutter={{ md: 18, lg: 24, xl: 48 }}>
                <Col md={24} sm={24} style={{ background: '#fff' }}>
                  <ul id="statisticalAnalysis">
                    {/* {this.state.statisticalConditionList ? (
                      this.state.statisticalConditionList.map((val) => {
                       return  (
                        <li key={val.id} onClick={this.statisticsInt.bind(this, val.id)} style={{ cursor: 'pointer' }}>
                          <Tooltip title={val.caseType}>
                            <h3>{val.caseType}</h3>
                          </Tooltip>
                          <p>本周此类型工单数{val.countNum ? val.countNum : 0}件</p>
                          <ol>
                            {val.depart ? (
                              val.depart.map((value) => (
                                <li key={value}>
                                  {value ? value : ''}
                                </li>
                              ))
                            ) : []}
                          </ol>
                        </li>
                      )})
                    ) : []} */}
                    <li onClick={this.statisticsInt.bind(this, (this.state.statisticalConditionList0) ? (this.state.statisticalConditionList0.id ? this.state.statisticalConditionList0.id : '') : '')} style={{ cursor: 'pointer' }}>
                      <Tooltip title={(this.state.statisticalConditionList0) && (this.state.statisticalConditionList0.caseType != 'undefined' ? this.state.statisticalConditionList0.caseType : '暂无数据')}>
                        <h3>{(this.state.statisticalConditionList0) ? (this.state.statisticalConditionList0.caseType ? this.state.statisticalConditionList0.caseType : '暂无数据') : "暂无数据"}</h3>
                      </Tooltip>
                      <p>本周此类型工单数{(this.state.statisticalConditionList0) ? (this.state.statisticalConditionList0.countNum ? this.state.statisticalConditionList0.countNum : 0) : 0}件</p>
                      <ol>
                        {(this.state.statisticalConditionList0) ? (this.state.statisticalConditionList0.depart ? this.state.statisticalConditionList0.depart.map((value, i) => {
                          return (
                            <li key={i + 1}>
                              {value || '暂无数据'}
                            </li>
                          )
                        }) : '暂无数据') : '暂无数据'}
                      </ol>
                    </li>
                    <li onClick={this.statisticsInt.bind(this, (this.state.statisticalConditionList1) ? (this.state.statisticalConditionList1.id ? this.state.statisticalConditionList1.id : '') : '')} style={{ cursor: 'pointer' }}>
                      <Tooltip title={(this.state.statisticalConditionList1) && (this.state.statisticalConditionList1.caseType != 'undefined' ? this.state.statisticalConditionList1.caseType : '暂无数据')}>
                        <h3>{(this.state.statisticalConditionList1) ? (this.state.statisticalConditionList1.caseType ? this.state.statisticalConditionList1.caseType : '暂无数据') : "暂无数据"}</h3>
                      </Tooltip>
                      <p>本周此类型工单数{(this.state.statisticalConditionList1) ? (this.state.statisticalConditionList1.countNum ? this.state.statisticalConditionList1.countNum : 0) : 0}件</p>
                      <ol>
                        {(this.state.statisticalConditionList1) ? (this.state.statisticalConditionList1.depart ? this.state.statisticalConditionList1.depart.map((value, i) => (
                          <li key={i + 2}>
                            {value || '暂无数据'}
                          </li>
                        )) : '暂无数据') : '暂无数据'}
                      </ol>
                    </li>

                    <li onClick={this.statisticsInt.bind(this, (this.state.statisticalConditionList2) ? (this.state.statisticalConditionList2.id ? this.state.statisticalConditionList2.id : '') : '')} style={{ cursor: 'pointer' }}>
                      <Tooltip title={(this.state.statisticalConditionList2) && (this.state.statisticalConditionList2.caseType != 'undefined' ? this.state.statisticalConditionList2.caseType : '暂无数据')}>
                        <h3>{(this.state.statisticalConditionList2) ? (this.state.statisticalConditionList2.caseType ? this.state.statisticalConditionList2.caseType : '暂无数据') : "暂无数据"}</h3>
                      </Tooltip>
                      <p>本周此类型工单数{(this.state.statisticalConditionList2) ? (this.state.statisticalConditionList2.countNum ? this.state.statisticalConditionList2.countNum : 0) : 0}件</p>
                      <ol>
                        {(this.state.statisticalConditionList2) ? (this.state.statisticalConditionList2.depart ? this.state.statisticalConditionList2.depart.map((value, i) => (
                          <li key={i + 3}>
                            {value || '暂无数据'}
                          </li>
                        )) : '暂无数据') : '暂无数据'}
                      </ol>
                    </li>

                    <li onClick={this.statisticsInt.bind(this, (this.state.statisticalConditionList3) ? (this.state.statisticalConditionList3.id ? this.state.statisticalConditionList3.id : '') : '')} style={{ cursor: 'pointer' }}>
                      <Tooltip title={(this.state.statisticalConditionList3) && (this.state.statisticalConditionList3.caseType != 'undefined' ? this.state.statisticalConditionList3.caseType : '暂无数据')}>
                        <h3>{(this.state.statisticalConditionList3) ? (this.state.statisticalConditionList3.caseType ? this.state.statisticalConditionList3.caseType : '暂无数据') : "暂无数据"}</h3>
                      </Tooltip>
                      <p>本周此类型工单数{(this.state.statisticalConditionList3) ? (this.state.statisticalConditionList3.countNum ? this.state.statisticalConditionList3.countNum : 0) : 0}件</p>
                      <ol>
                        {(this.state.statisticalConditionList3) ? (this.state.statisticalConditionList3.depart ? this.state.statisticalConditionList3.depart.map((value, i) => (
                          <li key={i + 4}>
                            {value || '暂无数据'}
                          </li>
                        )) : '暂无数据') : '暂无数据'}
                      </ol>
                    </li>

                    <li onClick={this.statisticsInt.bind(this, (this.state.statisticalConditionList4) ? (this.state.statisticalConditionList4.id ? this.state.statisticalConditionList4.id : '') : '')} style={{ cursor: 'pointer' }}>
                      <Tooltip title={(this.state.statisticalConditionList4) && (this.state.statisticalConditionList4.caseType != 'undefined' ? this.state.statisticalConditionList4.caseType : '暂无数据')}>
                        <h3>{(this.state.statisticalConditionList4) ? (this.state.statisticalConditionList4.caseType ? this.state.statisticalConditionList4.caseType : '暂无数据') : "暂无数据"}</h3>
                      </Tooltip>
                      <p>本周此类型工单数{(this.state.statisticalConditionList4) ? (this.state.statisticalConditionList4.countNum ? this.state.statisticalConditionList4.countNum : 0) : 0}件</p>
                      <ol>
                        {(this.state.statisticalConditionList4) ? (this.state.statisticalConditionList4.depart ? this.state.statisticalConditionList4.depart.map((value, i) => {
                          return (
                            <li key={i + 5}>
                              {value || '暂无数据'}
                            </li>
                          )
                        }) : '暂无数据') : '暂无数据'}
                      </ol>
                    </li>

                    <li onClick={this.statisticsInt.bind(this, (this.state.statisticalConditionList5) ? (this.state.statisticalConditionList5.id ? this.state.statisticalConditionList5.id : '') : '')} style={{ cursor: 'pointer' }}>
                      <Tooltip title={(this.state.statisticalConditionList5) && (this.state.statisticalConditionList5.caseType != 'undefined' ? this.state.statisticalConditionList5.caseType : '暂无数据')}>
                        <h3>{(this.state.statisticalConditionList5) ? (this.state.statisticalConditionList5.caseType ? this.state.statisticalConditionList5.caseType : '暂无数据') : "暂无数据"}</h3>
                      </Tooltip>
                      <p>本周此类型工单数{(this.state.statisticalConditionList5) ? (this.state.statisticalConditionList5.countNum ? this.state.statisticalConditionList5.countNum : 0) : 0}件</p>
                      <ol>
                        {(this.state.statisticalConditionList5) ? (this.state.statisticalConditionList5.depart ? this.state.statisticalConditionList5.depart.map((value, i) => (
                          <li key={i + 6}>
                            {value || '暂无数据'}
                          </li>
                        )) : '暂无数据') : '暂无数据'}
                      </ol>
                    </li>

                    <li onClick={this.statisticsInt.bind(this, (this.state.statisticalConditionList6) ? (this.state.statisticalConditionList6.id ? this.state.statisticalConditionList6.id : '') : '')} style={{ cursor: 'pointer' }}>
                      <Tooltip title={(this.state.statisticalConditionList6) && (this.state.statisticalConditionList6.caseType != 'undefined' ? this.state.statisticalConditionList6.caseType : '暂无数据')}>
                        <h3>{(this.state.statisticalConditionList6) ? (this.state.statisticalConditionList6.caseType ? this.state.statisticalConditionList6.caseType : '暂无数据') : "暂无数据"}</h3>
                      </Tooltip>
                      <p>本周此类型工单数{(this.state.statisticalConditionList6) ? (this.state.statisticalConditionList6.countNum ? this.state.statisticalConditionList6.countNum : 0) : 0}件</p>
                      <ol>
                        {(this.state.statisticalConditionList6) ? (this.state.statisticalConditionList6.depart ? this.state.statisticalConditionList6.depart.map((value, i) => (
                          <li key={i + 7}>
                            {value || '暂无数据'}
                          </li>
                        )) : '暂无数据') : '暂无数据'}
                      </ol>
                    </li>
                  </ul>
                </Col>
              </Row>
              <Row gutter={{ md: 18, lg: 24, xl: 48 }} style={{ background: '#fff' }}>
                <Col md={24} sm={24}>
                  <div id="statisticsMatch">
                    <h3>已选择:</h3>
                    <ul style={{ padding: 0, margin: 0 }}>
                      {this.state.statisticsIntArr ? (
                        this.state.statisticsIntArr.map((val, i) => {
                          return (
                            <li key={val.id}>
                              <Tooltip title={val.caseType}>
                                <span>{val.caseType}</span>
                              </Tooltip>
                              <span style={{ cursor: 'pointer' }} onClick={() => this.statisticsIntClose(val.id)}>
                                <Icon type="close-circle" theme="filled" />
                              </span>
                            </li>
                          )
                        })
                      ) : []}
                    </ul>
                  </div>
                  <div>
                    <Button type="primary" onClick={this.statisticsIntList.bind(this)}>
                      智能生成
                    </Button>
                    <Button id="buttonReset" style={{ marginRight: 0, marginLeft: 16 }} onClick={this.statisticsIntListClear.bind(this)}>
                      清空
                    </Button>
                  </div>
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="手动条件" key="2">
              <div id="tableForm" style={{ height: '394px', background: '#e8e8e8' }}>
                <Form layout="inline">
                  <Row gutter={{ md: 18, lg: 24, xl: 48 }}>
                    <Col md={18} sm={18}>
                      <Row gutter={{ md: 18, lg: 24, xl: 48 }}>
                        <Col md={8} sm={8}>
                          <FormItem label="案件大类">
                            {getFieldDecorator('bigTypeValue')(
                              <Select placeholder="请选择" allowClear style={{ width: '100%' }} onChange={this.bigClassSearch}>
                                {/* {listbigAllClass.map((val)=>( */}
                                {/* <Select.Option key={val.largeClassCode} value={val.largeClassCode}>{val.largeClassName}</Select.Option> */}
                                {/* ))} */}
                                {listbigAllClass ? (
                                  listbigAllClass.map((val) => (
                                    <Select.Option key={val.id} value={val.code}>
                                      {val.desp ? val.desp : ''}
                                    </Select.Option>
                                  ))
                                ) : []}
                              </Select>
                            )}
                          </FormItem>
                        </Col>
                        <Col md={8} sm={8}>
                          <FormItem label="案件小类">
                            {getFieldDecorator('smallTypeValue')(
                              <Select placeholder="请选择" allowClear style={{ width: '100%' }} onChange={this.smallClassSearch}>
                                {
                                  listSmallAllClass ? (
                                    listSmallAllClass.map((val) => (
                                      <Select.Option key={val.id} value={val.code}>{val.desp}</Select.Option>
                                    ))
                                  ) : []
                                }
                              </Select>
                            )
                            }
                          </FormItem>
                        </Col>
                        <Col md={8} sm={8}>
                          <FormItem label="所属社区">
                            {getFieldDecorator('communityValue')(
                              <Select placeholder="请选择" allowClear onChange={this.communitySearch}>
                                {communityList.map((val) => {
                                  return (
                                    <Select.Option key={val.id} value={val.code}>{val.desp}</Select.Option>
                                  )
                                })}
                              </Select>
                            )}
                          </FormItem>
                        </Col>
                        <Col md={8} sm={8}>
                          <FormItem label="归口类型">
                            {getFieldDecorator('typeValue')(
                              <Select placeholder="请选择" allowClear onChange={this.typeSearch}>
                                {convergenceProgramList.map((val) => {
                                  return (
                                    <Select.Option key={val.id} value={val.completeCases}>{val.completeCases}</Select.Option>
                                  )
                                })}
                              </Select>
                            )}
                          </FormItem>
                        </Col>
                        <Col md={8} sm={8}>
                          <FormItem label="案件类别">
                            {getFieldDecorator('caseBigType')(
                              <Select placeholder="请选择" allowClear onChange={this.caseBigSearch}>
                                {bigClassListSelect.map((val) => (
                                  <Select.Option key={val.id} value={val.code}>{val.desp}</Select.Option>
                                ))}
                              </Select>
                            )}
                          </FormItem>
                        </Col>
                        <Col md={8} sm={8}>
                          <FormItem label="办结时限">
                            {getFieldDecorator('completeTime', {
                              rules: [
                                // {
                                //   required: (sessionStorage.getItem('userRole') != '4') && (!isManageFlag[index]),
                                //   message: '请输入处置时限',
                                // },
                                {
                                  pattern: /^\+?[1-9]\d*$/,
                                  message: '请输大于0的正整数',
                                },
                              ],
                            })(
                              <Input placeholder="请输入" addonAfter={selectAfter} />
                            )}
                          </FormItem>
                        </Col>
                      </Row>
                    </Col>
                    <Col md={6} sm={6} style={{ position: 'relative', height: '360px' }}>
                      <h3>请从左侧板块选择生成条件</h3>
                      <div style={{ position: 'absolute', bottom: 10 }}>
                        <Button type="primary" onClick={this.manualIntList.bind(this)}>
                          智能生成
                        </Button>
                        <Button style={{ marginRight: 0, marginLeft: 16 }} onClick={this.manualIntListClear.bind(this)}>
                          清空
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Form>
              </div>
            </TabPane>
          </Tabs>
        </div>
        <div id="tableForm">
          <Form onSubmit={this.handleSearch} layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={6} sm={8}>
                <FormItem label="工单编号">
                  {getFieldDecorator('workorderidSearch')(
                    <Input placeholder="请输入" />
                  )}
                </FormItem>
              </Col>
              <Col md={6} sm={8}>
                <FormItem label="状态">
                  {getFieldDecorator('workOrderStatusSearch')(
                    <Select placeholder="请选择" allowClear>
                      {statusList.map((val) => {
                        return (
                          <Select.Option key={val.id} value={val.code}>{val.desp}</Select.Option>
                        )
                      })}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={6} sm={8}>
                <FormItem label="所属社区">
                  {getFieldDecorator('ownCommunitySearch')(
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
                  {getFieldDecorator('createdateSearch')(
                    <DatePicker placeholder="请输入" style={{ width: '100%' }} />
                  )}
                </FormItem>
              </Col>
              <Col md={6} sm={8}>
                <FormItem label="主办部门">
                  {getFieldDecorator('sponsorDepartmentSearch')(
                    <Select placeholder="请选择" allowClear>
                      {departmentList.map((val) => {
                        return (
                          <Select.Option key={val.id} value={val.id}>{val.orgName}</Select.Option>
                        )
                      })}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={18} sm={24} style={{ textAlign: 'right' }}>
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
        <div id="listTable">
          <Table
            // rowSelection={rowSelection}
            columns={columns}
            dataSource={matchList.list}
            rowKey='ids'
            // rowKey={(record) => `${record.createDate}/${record.workOrderId}`}
            pagination={{
              current: page,
              pageSize,
              onShowSizeChange(current, pageSize) {
                that.handleTableChange(current, pageSize);
              },
              onChange(current, pageSize) {
                that.handleTableChange(current, pageSize);
              },
              total: matchList.total,
              showTotal: total => `共 ${total} 条数据`,
              size: 'small',
              showSizeChanger: true,
              showQuickJumper: true,
              pageSizeOptions: ['10', '15', '20']
            }}
          />
        </div>
        <Modal
          title="导入12345工单"
          visible={this.state.visibleImportWord}
          onOk={this.handleOkImportWord.bind(this)}
          onCancel={this.handleCancelImportWord.bind(this)}
        >
          <div style={{ position: 'relative', height: 40, lineHeight: '30px', marginTop: 10 }}>
            <Button type='primary' style={{ position: 'absolute', top: 0, left: 0, textAlign: 'center', width: 'auto' }}>上传文件</Button>
            <span style={{ marginLeft: 100 }}>{this.state.fileWordName}</span>
            <input type="file" id='file' onChange={this.changeImpotWord} style={{ position: 'absolute', top: 0, left: 0, zIndex: 5, width: 98, height: 32, opacity: 0 }} />
          </div>
        </Modal>

        {/* 工单 */}
        <Modal
          title={this.state.isOrderTypeChange === 'urban_order' ? '城管工单' : (this.state.isOrderTypeChange === 'comprehensive_order' ? '综合执法工单' : '投诉工单')}
          visible={this.state.visible}
          destroyOnClose={false}
          onOk={this.increaseIt}// handleOk
          onCancel={this.handleCancel}
          width='80%'
          footer={null}
        >
          <Tabs
            defaultActiveKey="0"
            onChange={callback}
            animated={false}
          >
            {
              this.state.statisticsIntArr ? this.state.statisticsIntArr.map((item, index) => {
                if (this.state.isOrderTypeChange === 'urban_order' && modalDataList[0]) { // 城管
                  return (
                    <TabPane tab={item.caseType} key={index}>
                      <CityDetail {...modalDataList} onClick={this.increaseIt} />
                    </TabPane>
                  )
                }
                if (this.state.isOrderTypeChange === 'comprehensive_order' && modalDataList[0]) { // 综合执法
                  return (
                    <TabPane tab={item.caseType} key={index}>
                      <ComprehensiveDetail {...modalDataList} onClick={this.increaseIt} />
                    </TabPane>
                  )
                }
                if (this.state.isOrderTypeChange === 'complaint_order' && modalDataList[0]) { // 投诉工单
                  return (
                    <TabPane tab={item.caseType} key={index}>
                      <ComplaintDetail {...modalDataList} onClick={this.increaseIt} />
                    </TabPane>
                  )
                }
              }) : []
            }
          </Tabs>
        </Modal>
      </div>
    );
  }
}

export default Workplace;
