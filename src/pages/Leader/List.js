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
  Carousel,
} from 'antd';
import styles from './Detail.less';
import Header from './Header.js';
import Bodylist from './Bodylist.js';
import { connect } from 'dva';


import DetailInformation1 from './c1';
import DetailInformation12 from './c12';
import DetailCourse2 from './c2';
import { picIp } from '@/utils/ipConfig';
const Formats = 'YYYY-MM-DD HH:mm:ss';
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const { TextArea } = Input;
const { Option } = Select;

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

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
      classification: [], // 任务分类

      uploading: false, // 附件
      previewVisible: false,
      previewImage: '',
      fileList: [],
      fileArr: [],
      fileListTwo: [],
      filePath: '',
      filePathTwo: "",
      handOverSource: [], // 工单来源
      taskClassify: [], // 任务分类
      parentBank: [], // 所属分行
      dispatchVos: [],
      executor: [], // 承办人员
      leadership: [], // 分管领导
      info: {}, // 详情数据
      ListCourse: [], //工作过程
      isDetail: window.location.href.split('/')[window.location.href.split('/').length - 3], //是否详情页
      auditOpinionsvisible: false, //审核通过&审核驳回
      closingCasevisible: false, //确认结案
      executorHandlevisible: false, //申请结案
      detelevisible: false, // 删除
      WasteCasevisible: false, // 废案
      title: '',
      reCheckvisible: false, // 复核
      applicationExtension: false, // 申请延期弹窗
      deferredAuditvisible: false, // 延期审核弹窗
      goBackvisible: false, // 退回弹窗
      unit: "1", // 处置时限--小时，天
      seePhoptovisible: false, // 工作过程图片查看
      seePhotoSrc: "", // 工作过程图片地址
    };
  }

  // 附件
  // 关闭预览图片框
  handleCancel = () => this.setState({ previewVisible: false, seePhoptovisible: false, });
  //打开预览图片框
  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };
  // 整改后删除图片
  handleRemoveTwo = file => {
    this.setState(state => {
      const index = state.fileListTwo.indexOf(file);
      const newFileList = state.filePathTwo;
      newFileList.reverse().splice(index, 1);
      return {
        filePathTwo: newFileList,
      };
    });
  };
  // 整改前删除图片
  handleRemove = file => {
    this.setState(state => {
      const index = state.fileList.indexOf(file);
      const newFileList = state.filePath;
      newFileList.reverse().splice(index, 1);
      return {
        filePath: newFileList,
      };
    });
  };
  // 上传图片
  handleChange = info => {
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
        const { name, response } = info.file;
        if (response.sucess) {
          const id = Array.isArray(response.entity) ? response.entity[0].id : '';
          this.setState({
            uploading: false,
            filePath: [id, ...filePath],
          });
        } else {
          this.setState({ uploading: false }, () => {
            message.error('上传失败!');
          });
        }
      }
    });
  };
  // 上传图片
  handleChangeTwo = info => {
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
        const { name, response } = info.file;
        if (response.sucess) {
          const id = Array.isArray(response.entity) ? response.entity[0].id : '';
          this.setState({
            uploading: false,
            filePathTwo: [id, ...filePathTwo],
          });
        } else {
          this.setState({ uploading: false }, () => {
            message.error('上传失败!');
          });
        }
      }
    });
  };

  // 获取 处置时限--小时，天
  getUnit = e => {
    this.setState({
      unit: e
    })
  }
  // 工作过程查看图片
  seePhopto = e => {
    console.log(e)
    if (e) {
      if (e.photoAttachmentIds) {
        this.setState({
          seePhoptovisible: true,
          seePhotoSrc: e.photoAttachmentIds,
        })
      }
    }
  }
  // 工作过程批量下载图片
  loopDownPhopto = e => {
    if (e) {
      let photoList = e.split(",");
      const { dispatch } = this.props;
      photoList.map(item => {
        dispatch({
          type: 'Leadermodels/downPhoto',
          payload: {
            producer: 'AttachmentDownload',
            id: item,
          }
        })
      })
    }
  }


  // 主办部门更改
  _UrbanApartmentSelect = (value, key) => {
    const { dispatch } = this.props;
    // 承办人员
    dispatch({
      type: "Leadermodels/ListByOrgIdAndIsExecutive",
      payload: value,
      callback: res => {
        if (res) {
          let arr = [];
          res.list && (arr = res.list.filter(item => item.leadership != '1'));
          this.setState({ executor: arr });
        }
      }
    });
    // 分管领导
    dispatch({
      type: "Leadermodels/LeadersInCharge",
      payload: value,
      callback: res => {
        if (res) {
          this.setState({ leadership: res["list"] });
        }
      }
    });
  };
  get UrbanApartmentSelect() {
    return this._UrbanApartmentSelect;
  }
  set UrbanApartmentSelect(value) {
    this._UrbanApartmentSelect = value;
  }

  // 保存
  increase = form => {
    const { validateFields } = form;
    const { dispatch } = this.props;
    const { info, filePath } = this.state;
    const url = 'Leadermodels/save';
    validateFields((error, values) => {
      if (error) {
        return
      }
      info.workOrderId && (values.workOrderId = info.workOrderId);
      if (values.executor && values.assistTime && values.organizeDepartment) {
        const dispatchVos = [];
        values.assistDepartment = values.organizeDepartment;
        const dispatchVosJson = {
          executor: values.executor,
          assistTime: values.assistTime,
          assistDepartment: values.assistDepartment,
          remarks: values.remarks,
          unit: this.state.unit,
        }
        dispatchVos.push(dispatchVosJson);
        values.dispatchVos = dispatchVos;
      }
      values.executor && (values.executor = undefined);
      values.assistTime && (values.assistTime = undefined);
      values.remarks && (values.remarks = undefined);
      values.isExamine = values.isExamine == true ? "1" : "0";
      filePath && (values.prePicture = filePath.join(','));
      dispatch({
        type: url,
        payload: {
          ...values,
        },
        callback: res => {
          if (res) {
            if (res.retCode == 1) {
              message.success(res.retMsg);
              location.reload();
            } else {
              message.error(res.retMsg);
            }
          }
        },
      });
    });
  };



  //获取工作过程
  getDetailListCourse = (id, userRole) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'Leadermodels/getDetailListCourse',
      payload: {
        id,
        userRole,
      },
      callback: res => {
        if (res) {
          if (res.retCode == '1') {
            this.setState({ ListCourse: res.list });
          }
        }
      },
    });
  };

  //派单
  systemDispatch = form => {
    const { dispatch } = this.props;
    const { info, filePath } = this.state;
    const { validateFields } = form;
    const url = 'Leadermodels/systemDispatch';
    validateFields((error, values) => {
      if (error) {
        return
      }
      values && (values.startTime = moment(new Date()).format(Formats));
      info.workOrderId && (values.workOrderId = info.workOrderId);
      if (values.executor && values.assistTime && values.organizeDepartment) {
        const dispatchVos = [];
        values.assistDepartment = values.organizeDepartment;
        const dispatchVosJson = {
          executor: values.executor,
          assistTime: values.assistTime,
          assistDepartment: values.assistDepartment,
          remarks: values.remarks,
          unit: this.state.unit,
        }
        dispatchVos.push(dispatchVosJson);
        values.dispatchVos = dispatchVos;
      }
      values.executor && (values.executor = undefined);
      values.assistTime && (values.assistTime = undefined);
      values.remarks && (values.remarks = undefined);
      values.isExamine = values.isExamine == true ? "1" : "0";
      filePath && (values.prePicture = filePath.join(','));
      dispatch({
        type: url,
        payload: {
          ...values,
        },
        callback: res => {
          if (res) {
            if (res.retCode == 1) {
              message.success(res.retMsg);
              location.reload();
            } else {
              message.error(res.retMsg);
            }
          }
        },
      });
    });
  };
  // 轮播图，上一张下一张
  prevImg = e => {
    this.refs.carouselImg.prev();
  }
  nextImg = e => {
    this.refs.carouselImg.next();
  }
  // 根据工单状态和登陆人员显示按钮组件 , isDelay
  buttons = (status, userRole, isCheck, startIsReview, endIsReview) => {
    const { info, dispatchVos } = this.state;
    if (userRole == '2' && status == '1') {
      return (
        <Col span={18}>
          <Button
            style={{ marginRight: 20 }} type="primary"
            onClick={this.increase.bind(this, this.props.form)}
          >
            保存
          </Button>
          <Button
            style={{ marginRight: 20 }}
            type="primary"
            onClick={this.systemDispatch.bind(this, this.props.form)}
          >
            派单
          </Button>
          <Button style={{ marginRight: 20 }} onClick={this.showModal.bind(null, 'FeiA')} type="primary">
            废案
          </Button>
          <Button style={{ marginRight: 20 }} hidden type="primary">
            导出
          </Button>
          <Button style={{ marginRight: 20 }} onClick={this.showModal.bind(null, 'DEL')} type="primary">
            删除
          </Button>
        </Col>
      );
    }
    if (userRole == '2' && status == '2') {
      return (
        <Col span={21}>
          <Button style={{ marginRight: 20 }} onClick={this.showModal.bind(null, 'FeiA')} type="primary">
            废案
          </Button>
        </Col>
      );
    }
    if (userRole == '2' && status == '3') {
      return (
        <Col span={21}>
          <Button style={{ marginRight: 20 }} hidden type="primary">
            追回
          </Button>
          <Button
            style={{ marginRight: 20 }}
            onClick={this.showModal.bind(null, 'YQSH')}
            type="primary"
            hidden={endIsReview == 0}
          >
            延期审核
          </Button>
          <Button style={{ marginRight: 20 }} onClick={this.showModal.bind(null, 'FeiA')} type="primary">
            废案
          </Button>
          <Button style={{ marginRight: 20 }} hidden type="primary">
            导出
          </Button>
        </Col>
      );
    }
    //信息中心且处置反馈完毕2级
    if (userRole == '2' && status == '6' && isCheck == "1") {
      return (
        <Col span={21}>
          <Button
            style={{ marginRight: 20 }}
            type="primary"
            onClick={this.showModal.bind(null, 'JA')}
          >
            确认结案
          </Button>
          <Button style={{ marginRight: 20 }} onClick={this.showModal.bind(null, 'GoBack')} type="primary">
            退回
          </Button>
          <Button style={{ marginRight: 20 }} onClick={this.showModal.bind(null, 'FeiA')} type="primary">
            废案
          </Button>
          <Button style={{ marginRight: 20 }} hidden type="primary">
            导出
          </Button>
        </Col>
      );
    }
    if (userRole == '2' && status == '6' && isCheck == "0") {
      return (
        <Col span={21}>
          <Button
            style={{ marginRight: 20 }}
            onClick={this.showModal.bind(null, 'FH')}
            type="primary">
            复核
          </Button>
          <Button
            style={{ marginRight: 20 }}
            type="primary"
            onClick={this.showModal.bind(null, 'JA')}
          >
            确认结案
          </Button>
          <Button style={{ marginRight: 20 }} onClick={this.showModal.bind(null, 'GoBack')} type="primary">
            退回
          </Button>
          <Button style={{ marginRight: 20 }} onClick={this.showModal.bind(null, 'FeiA')} type="primary">
            废案
          </Button>
          <Button style={{ marginRight: 20 }} hidden type="primary">
            导出
          </Button>
        </Col>
      )
    }
    if (userRole == '1' && status == '2') {
      return (
        <Col span={21}>
          <Button
            style={{ marginRight: 20 }}
            type="primary"
            onClick={this.showModal.bind(null, 'TG')}
          >
            审核通过
          </Button>
          <Button
            style={{ marginRight: 20 }}
            type="primary"
            onClick={this.showModal.bind(null, 'BH')}
          >
            审核驳回
          </Button>
        </Col>
      );
    }
    //执行员且待处置2级
    if (userRole == '4' && status == '3') {
      return (
        <Col span={21}>
          <Button
            type="primary"
            style={{ marginRight: 20 }}
            hidden={dispatchVos && dispatchVos[0].examine == '1'}
            onClick={this.showModal.bind(null, 'SQJA')}
          >
            申请结案
          </Button>
          <Button
            type="primary"
            style={{ marginRight: 20 }}
            onClick={this.showModal.bind(null, 'SQYQ')}
            hidden={startIsReview == 1}
          >
            申请延期
          </Button>
          <Button style={{ marginRight: 20 }} onClick={this.showModal.bind(null, 'GoBack')} type="primary">
            退回
          </Button>
          <Button type="primary" hidden style={{ marginRight: 20 }}>
            导出
          </Button>
        </Col>
      );
    }
  }

  showModal = type => {
    if (type == 'TG') {
      this.setState({ auditOpinionsvisible: true, title: '审核通过' });
    } else if (type == 'BH') {
      this.setState({ auditOpinionsvisible: true, title: '审核驳回' });
    } else if (type == 'JA') {
      this.setState({ closingCasevisible: true });
    } else if (type == 'SQJA') {
      this.setState({ executorHandlevisible: true });
    } else if (type == "DEL") {
      this.setState({ detelevisible: true });
    } else if (type == "FeiA") {
      this.setState({ WasteCasevisible: true });
    } else if (type == "FH") {
      this.setState({ reCheckvisible: true });
    } else if (type == "SQYQ") {
      this.setState({ applicationExtension: true });
    } else if (type == "YQSH") {
      this.setState({ deferredAuditvisible: true });
    } else if (type == "GoBack") {
      this.setState({ goBackvisible: true });
    } else {
      this.setState(
        {
          visible: true,
        },
        () => {
          const { dispatchVos } = this.state;
          const { dispatch } = this.props;
          dispatch({
            type: 'Leadermodels/ListByOrgIdAndIsExecutive',
            payload: dispatchVos[0].assistDepartment,
            callback: res => {
              if (res) {
                if (res.retCode == 1) {
                  this.setState({ leaderships: res.list.filter(item => item.leadership == '0') });
                }
              }
            },
          });
        }
      );
    }
  };

  handleOk = type => {
    const { form, dispatch } = this.props;
    const { getFieldsValue } = form;
    const { dispatchVos, title, info, filePathTwo } = this.state;
    const values = getFieldsValue();
    const obj = dispatchVos[0];
    const infos = info;
    values.executor && (obj.executor = values.executor);
    values.arrangeOpinions && (obj.arrangeOpinions = values.arrangeOpinions);
    values.auditOpinions && (obj.auditOpinions = values.auditOpinions);
    values.closureExplain && (infos.closureExplain = values.closureExplain);
    values.closingEvaluation && (infos.closingEvaluation = values.closingEvaluation);
    if (title == '审核通过') {
      obj.examine = '3';
      obj.appealTime = info.appealTime;
    }
    if (title == '审核驳回') {
      obj.examine = '4';
      obj.appealTime = info.appealTime;
    }
    if (type == 'TGBH') {
      dispatch({
        type: 'Leadermodels/manageExamine',
        payload: {
          ...obj,
        },
        callback: res => {
          if (res) {
            if (res.retCode == '1') {
              message.success(res.retMsg);
              location.reload();
            } else {
              message.error(res.retMsg);
            }
          }
        },
      });
    } else if (type == 'JA') {
      dispatch({
        type: 'Leadermodels/closingCase',
        payload: {
          ...infos,
        },
        callback: res => {
          if (res) {
            if (res.retCode == '1') {
              message.success(res.retMsg);
              location.reload();
            } else {
              message.error(res.retMsg);
            }
          }
        },
      });
    } else if (type == 'SQJA') {
      filePathTwo && (infos.proPicture = filePathTwo.join(','));
      dispatch({
        type: 'Leadermodels/executorHandle',
        payload: {
          ...infos,
        },
        callback: res => {
          if (res) {
            if (res.retCode == 1) {
              message.success(res.retMsg);
              location.reload();
            } else {
              message.error(res.retMsg);
            }
          }
        },
      });
    } else if (type == 'DEL' || type == 'FeiA') { // 删除
      // const id = window.location.href.split('/')[window.location.href.split('/').length - 2];
      const id = info.workOrderId;
      this.props.dispatch({
        type: "Leadermodels/deteles",
        payload: type == 'DEL' ?
          {
            status: 7,
            id
          } : {
            status: 5,
            id
          },
        callback: res => {
          if (res) {
            if (res.retCode == 1) {
              message.success(res.retMsg);
              location.reload();
            } else {
              message.error(res.retMsg);
            }
          }
        }
      })
    } else if (type == "FH") {
      let reCheckObj = {};
      values.executor && (reCheckObj.executor = values.executor);
      values.assistDepartment && (reCheckObj.assistDepartment = values.assistDepartment);
      values.assistTime && (reCheckObj.assistTime = values.assistTime);
      values && (reCheckObj.unit = this.state.unit);
      values && (reCheckObj.workOrderId = window.location.href.split('/')[window.location.href.split('/').length - 2]);
      values && (reCheckObj.workOrderType = 4);
      dispatch({
        type: "Leadermodels/reCheck",
        payload: {
          ...reCheckObj
        },
        callback: res => {
          if (res) {
            if (res.retCode == 1) {
              message.success(res.retMsg);
              location.reload();
            } else {
              message.error(res.retMsg);
            }
          }
        }
      })
    } else if (type == "SQYQ") {
      let delayObj = {};
      values.applicationNote && (delayObj.applicationNote = values.applicationNote);
      values.delayDate && (delayObj.delayDate = values.delayDate);
      values.assistTime && (delayObj.assistTime = values.assistTime);
      values && (delayObj.orderId = window.location.href.split('/')[window.location.href.split('/').length - 2]);
      values && (delayObj.workOrderType = 4);
      values && (values.unit = this.state.unit);
      dispatch({
        type: "Leadermodels/application",
        payload: {
          ...delayObj
        },
        callback: res => {
          if (res) {
            if (res.retCode == 1) {
              message.success(res.retMsg);
              location.reload();
            } else {
              message.error(res.retMsg);
            }
          }
        }
      })
    } else if (type == "YQSH") {
      values.approvalResults && (infos.approvalResults = values.approvalResults);
      dispatch({
        type: "Leadermodels/deferredAudit",
        payload: {
          ...infos
        },
        callback: res => {
          if (res) {
            if (res.retCode == 1) {
              message.success(res.retMsg);
              location.reload();
            } else {
              message.error(res.retMsg);
            }
          }
        }
      })
    } else if (type == "GoBack") {
      dispatch({
        type: "Leadermodels/goBackS",
        payload: {
          workOrderId: info.workOrderId,
          workOrderType: 4,
        },
        callback: res => {
          if (res) {
            if (res.retCode == 1) {
              message.success(res.retMsg);
              location.reload();
            } else {
              message.error(res.retMsg);
            }
          }
        }
      })
    }
  };

  handleCancels = e => {
    this.setState({
      visible: false,
      auditOpinionsvisible: false,
      closingCasevisible: false,
      executorHandlevisible: false,
      detelevisible: false,
      WasteCasevisible: false,
      reCheckvisible: false,
      applicationExtension: false,
      deferredAuditvisible: false,
      goBackvisible: false,
      seePhoptovisible,
      seePhotoSrc,
    });
  };






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
          groupCode == 'classification' && this.setState({ classification: res });


          groupCode == 'parentBank' && this.setState({ parentBank: res });
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
    this.setState({ form, page: 1, value: "3" }, () => {
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
    this.getSelect('classification');
    this.Apartment();
    this.getList({});


    this.getSelect('parentBank');
    // this.getDetailList();
  }

  // 待处理&已处理&全部
  onChange = e => {
    const { dispatch } = this.props;
    const { page, pageSize, userRole } = this.state;
    // 待处理
    if (e.target.value == '1') {
      if (userRole == '2') {
        let obj = {};
        obj.status_S_IN = "1,3,6";
        dispatch({
          type: 'Leadermodels/getList',
          payload: {
            page: 1,
            pageSize,
            id: userRole,
            obj,
          },
          callback: res => {
            if (res) {
              if (res.retCode == 1) {
                let w = res.list.filter(item => item.status == '1' || item.status == '6' || (item.status == '3' && item.isReview == "1"));
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
      if (userRole == '1') {
        let obj = {};
        obj.status_S_EQ = "2";
        obj.isExamine_S_EQ = "1";
        dispatch({
          type: 'Leadermodels/getList',
          payload: {
            page: 1,
            pageSize,
            id: userRole,
            obj,
          },
          callback: res => {
            if (res) {
              if (res.retCode == 1) {
                let w = res.list.filter(item => item.isExamine == '1').filter(item => item.status == '2');
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
      if (userRole == '4') {
        let obj = {};
        obj.status_S_EQ = "3";
        dispatch({
          type: 'Leadermodels/getList',
          payload: {
            page: 1,
            pageSize,
            id: userRole,
            obj,
          },
          callback: res => {
            if (res) {
              if (res.retCode == 1) {
                let w = res.list.filter(item => item.status == '3');
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
    }
    //已处理
    if (e.target.value == '2') {
      if (userRole == '2') {
        let obj = {};
        obj.status_S_IN = "2,3,4";
        dispatch({
          type: 'Leadermodels/getList',
          payload: {
            page: 1,
            pageSize,
            id: userRole,
            obj,
          },
          callback: res => {
            if (res) {
              if (res.retCode == 1) {
                let w = res.list.filter(item => item.status == '2' || (item.status == '3' && item.isReview != "1") || item.status == '4');
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
      if (userRole == '1') {
        let obj = {};
        obj.isExamine_S_EQ = "1";
        obj.status_S_NE = "2";
        dispatch({
          type: 'Leadermodels/getList',
          payload: {
            page: 1,
            pageSize,
            id: userRole,
            obj,
          },
          callback: res => {
            if (res) {
              if (res.retCode == 1) {
                let w = res.list.filter(item => item.isExamine == '1').filter(item => item.status != '2');
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
      if (userRole == '4') {
        let obj = {};
        obj.status_S_NE = "3";
        dispatch({
          type: 'Leadermodels/getList',
          payload: {
            page: 1,
            pageSize,
            id: userRole,
            obj,
          },
          callback: res => {
            if (res) {
              if (res.retCode == 1) {
                let w = res.list.filter(item => item.status != '3')
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
    }
    //全部
    if (e.target.value == '3') {
      this.getList({});
      this.setState({ value: "3" });
    }
  };

  // 点击状态弹窗详情页
  smallDetail = (id, isCheck) => {
    const { userRole } = this.state;
    this.setState({
      fivefivevisible: true,
    }, () => {
      this.setState({
        sixsixsixvisible: true,
      })
    });
    this.props.dispatch({
      type: 'Leadermodels/getDetailList',
      payload: {
        id,
        userRole: this.state.userRole,
        check: userRole == 4 ? isCheck : 0,
      },
      callback: res => {
        if (res) {
          if (res.retCode == 1) {
            this.setState(
              {
                info: res.list[0],
                dispatchVos: res.list[0].dispatchVos
                  ? res.list[0].dispatchVos.length > 0
                    ? res.list[0].dispatchVos
                    : ['1']
                  : ['1'],
                fileArr: res.list[0] ? res.list[0].preAttachmentIds : [],
                fileArrTwo: res.list[0] ? res.list[0].proAttachmentIds : [],
              },
              () => {
                const { info, userRole, dispatchVos, fileArr, fileArrTwo } = this.state;
                if (userRole == '4') {
                  if (info.status != '1') {
                    this.getDetailListCourse(dispatchVos[0].assistId, userRole);
                  }
                } else {
                  this.getDetailListCourse(info.workOrderId, userRole);
                }
                this.UrbanApartmentSelect(info.organizeDepartment, null);
                if (fileArr && fileArr.length > 0) {
                  let arr = [];
                  let arrTwo = [];
                  fileArr.map(item => {
                    arr.push({
                      uid: item.id,
                      name: item.fileName,
                      status: 'done',
                      url: `${picIp}${item.filePath}`,
                    });
                    arrTwo.push(item.id);
                  });
                  this.setState({ fileList: arr, filePath: arrTwo });
                }
                if (fileArrTwo && fileArrTwo.length > 0) {
                  let arr = [];
                  let arrTwo = [];
                  fileArrTwo.map(item => {
                    arr.push({
                      uid: item.id,
                      name: item.fileName,
                      status: 'done',
                      url: `${picIp}${item.filePath}`,
                    });
                    arrTwo.push(item.id);
                  });
                  this.setState({ fileListTwo: arr, filePathTwo: arrTwo });
                }
              }
            );
          }
        }
      },
    })
  }
  // 关闭抽屉
  sixClose = () => {
    this.setState({
      sixsixsixvisible: false,
    })
  }
  fiveClose = () => {
    this.setState({
      sixsixsixvisible: false,
    }, () => {
      this.setState({
        fivefivevisible: false,
      })
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
      classification,


      uploading,
      previewVisible,
      previewImage,
      fileList,
      fileListTwo,
      filePathTwo,
      filePath,
      parentBank,
      executor,
      leadership,
      info,
      ListCourse,
      title,
      seePhoptovisible,
      seePhotoSrc,
    } = this.state;

    const DetailForms = {
      uploading,
      previewVisible,
      previewImage,
      fileList,
      fileListTwo,
      filePathTwo,
      filePath,
      handOverSource,
      taskType,
      Apartment,
      parentBank,
      taskPriority,
      UrbanApartmentSelect: this.UrbanApartmentSelect.bind(this),
      handlePreview: this.handlePreview,
      handleChange: this.handleChange,
      handleChangeTwo: this.handleChangeTwo,
      handleCancel: this.handleCancel,
      handleRemove: this.handleRemove,
      handleRemoveTwo: this.handleRemoveTwo,
      executor,
      leadership,
      info,
      ListCourse,
      userRole,
      form: this.props.form,
      getUnit: this.getUnit,
      seePhopto: this.seePhopto,
      loopDownPhopto: this.loopDownPhopto,
    };

    const headForms = {
      Apartment,
      taskPriority,
      Search: this.Search,
      reset: this.reset,
      LeaderAssign,
      handOverSource,
      taskType,
      userRole,
      classification,
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

    const { getFieldDecorator } = this.props.form;
    const selectAfter = (
      <Select onChange={this.getUnit} value="小时" style={{ width: 70 }}>
        <Option value="1">小时</Option>
        <Option value="2">天</Option>
      </Select>
    );

    return (
      <div id="listTitleContent" className="bigBox">
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
          onClose={this.fiveClose}
          visible={this.state.fivefivevisible}
          width={900}
          mask={false}
          maskStyle={{ backgroundColor: "#fff", opacity: 0 }}
          style={{ position: "absolute", right: 0, top: 79 }}
        >
          <div style={{ paddingBottom: 79 }}>
            <div id="listTitleDetailBanner">
              <Row>
                <Col span={24}>
                  <Col span={3}>
                    <Button
                      type="primary"
                      onClick={() => {
                        this.setState({
                          fivefivevisible: false, // 左边弹窗抽屉
                          sixsixsixvisible: false, // 右边弹窗抽屉
                        })
                      }}
                    >
                      <Icon type="caret-left" />
                      返回
                </Button>
                  </Col>
                  {this.buttons(info.status, userRole, info.isCheck, (info.dispatchVos && info.dispatchVos[0] ? info.dispatchVos[0].isReview : ''), info.isReview)}
                </Col>
              </Row>
            </div>
            <div id="listTitleDetailTabEdit">
              <Form>
                <Tabs defaultActiveKey="1" type="card">
                  <TabPane tab="工单信息" key="1">
                    <DetailInformation1 {...DetailForms} />
                  </TabPane>
                  <TabPane tab="工作过程" key="2">
                    <DetailCourse2 {...DetailForms} />
                  </TabPane>
                </Tabs>
              </Form>
            </div>
            <Modal
              title={title}
              visible={this.state.auditOpinionsvisible}
              onOk={this.handleOk.bind(null, 'TGBH')}
              onCancel={this.handleCancels}
            >
              <Form>
                <Row>
                  <Col span={24}>
                    <FormItem label="审核意见" labelCol={{ span: 4 }} wrapperCol={{ span: 17 }}>
                      {getFieldDecorator('auditOpinions')(<TextArea />)}
                    </FormItem>
                  </Col>
                </Row>
              </Form>
            </Modal>
            <Modal
              title="确认结案"
              visible={this.state.closingCasevisible}
              onOk={this.handleOk.bind(null, 'JA')}
              onCancel={this.handleCancels}
            >
              <Form>
                <Row>
                  <Col span={24}>
                    <FormItem label="结案评价" labelCol={{ span: 4 }} wrapperCol={{ span: 17 }}>
                      {getFieldDecorator('closingEvaluation')(<TextArea />)}
                    </FormItem>
                  </Col>
                  <Col span={24} hidden>
                    <Col span={12}>
                      <FormItem label="巡查期限(天)" labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
                        {getFieldDecorator('auditOpinions2')(<Input />)}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem
                        label="每次巡查间隔(天)"
                        labelCol={{ span: 12 }}
                        wrapperCol={{ span: 12 }}
                      >
                        {getFieldDecorator('auditOpinions3')(<Input />)}
                      </FormItem>
                    </Col>
                  </Col>
                </Row>
              </Form>
            </Modal>
            <Modal
              title="申请结案"
              visible={this.state.executorHandlevisible}
              onOk={this.handleOk.bind(null, 'SQJA')}
              onCancel={this.handleCancels}
            >
              <Form>
                <Row>
                  <Col span={24}>
                    <FormItem label="申请说明" labelCol={{ span: 4 }} wrapperCol={{ span: 17 }}>
                      {getFieldDecorator('closureExplain')(<TextArea />)}
                    </FormItem>
                  </Col>
                </Row>
              </Form>
            </Modal>
            <Modal
              title="删除"
              visible={this.state.detelevisible}
              onOk={this.handleOk.bind(null, 'DEL')}
              onCancel={this.handleCancels}
            >
              <Form>
                <h2 style={{ textAlign: "center", fontWeight: 100, color: "red" }}>请确认是否删除</h2>
              </Form>
            </Modal>
            <Modal
              title="废案"
              visible={this.state.WasteCasevisible}
              onOk={this.handleOk.bind(null, 'FeiA')}
              onCancel={this.handleCancels}
            >
              <Form>
                <h2 style={{ textAlign: "center", fontWeight: 100, color: "red" }}>请确认是否废案</h2>
              </Form>
            </Modal>
            <Modal
              title="复核"
              visible={this.state.reCheckvisible}
              onOk={this.handleOk.bind(null, 'FH')}
              onCancel={this.handleCancels}
            >
              <Form>
                <Row>
                  <Col span={24}>
                    <Col span={16} push={4}>
                      <FormItem label="复核时限" labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} >
                        {getFieldDecorator("assistTime", {
                          rules: [{
                            required: true,
                            message: "请填写复核时限!",
                          }],
                          initialValue: "",
                        })(
                          <Input
                            placeholder="请输入"
                            addonAfter={selectAfter}
                            style={{ marginTop: 4 }}
                          />
                        )}
                      </FormItem>
                    </Col>
                  </Col>
                  <Col span={24}>
                    <Col span={18} push={3}>
                      <FormItem label="复核部门" >
                        {getFieldDecorator(`assistDepartment`, {
                          rules: [{
                            required: true,
                            message: "请选择复核部门!",
                          }],
                          initialValue: "请选择",
                        }
                        )(
                          <Select
                            placeholder="请选择"
                            onChange={this.UrbanApartmentSelect}
                          >
                            {Apartment && Apartment.map(item =>
                              <Option value={item.id} key={item.id}>
                                {item.orgName}
                              </Option>
                            )}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                  </Col>
                  <Col span={24}>
                    <Col span={18} push={3}>
                      <FormItem label="复核人员" >
                        {getFieldDecorator(`executor`, {
                          rules: [{
                            required: true,
                            message: "请选择复核人员!",
                          }],
                          initialValue: "请选择",
                        })(
                          <Select
                            placeholder="请选择"
                          >
                            {executor && executor.map(item =>
                              <Option value={item.userId} key={item.userId}>
                                {item.userName}
                              </Option>
                            )}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                  </Col>
                </Row>
              </Form>
            </Modal>
            <Modal
              title="申请延期"
              visible={this.state.applicationExtension}
              onOk={this.handleOk.bind(null, 'SQYQ')}
              onCancel={this.handleCancels}
            >
              <Form>
                <Row>
                  <Col span={24}>
                    <Col span={12}>
                      <FormItem label="处置时限" labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} >
                        {getFieldDecorator("assistTime", {
                          rules: [{
                            required: true,
                            message: "请填写处置时限!",
                          }],
                          initialValue: (info.dispatchVos && info.dispatchVos[0]) ? info.dispatchVos[0].assistTime : "",
                        })(
                          <Input
                            placeholder="请输入"
                            addonAfter={selectAfter}
                            style={{ marginTop: 4 }}
                            disabled
                          />
                        )}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem label="延时时间" labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} >
                        {getFieldDecorator("delayDate", {
                          rules: [{
                            required: true,
                            message: "请填写延时时间!",
                          }],
                          initialValue: "",
                        })(
                          <Input
                            placeholder="请输入"
                            addonAfter={selectAfter}
                            style={{ marginTop: 4 }}
                          />
                        )}
                      </FormItem>
                    </Col>
                  </Col>
                  <Col span={24}>
                    <FormItem label="申请说明" labelCol={{ span: 4 }} wrapperCol={{ span: 19 }}>
                      {getFieldDecorator('applicationNote')(<TextArea />)}
                    </FormItem>
                  </Col>
                </Row>
              </Form>
            </Modal>
            <Modal
              title="延期审核"
              visible={this.state.deferredAuditvisible}
              onCancel={this.handleCancels}
              footer={[
                <Button key="submit" type="primary" onClick={this.handleOk.bind(null, 'YQSH')}>
                  审核通过
            </Button>,
                <Button key="back" onClick={this.handleCancels}>
                  审核驳回
            </Button>,
              ]}
            >
              <Form>
                <Row>
                  <Col span={24}>
                    <Col span={12}>
                      <FormItem label="处置时限" labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} >
                        {getFieldDecorator("assistTime", {
                          initialValue: info.postponementVos ? info.postponementVos[0].assistTime : "",
                        })(
                          <Input
                            placeholder="请输入"
                            addonAfter={selectAfter}
                            style={{ marginTop: 4 }}
                            disabled
                          />
                        )}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem label="延时时间" labelCol={{ span: 9 }} wrapperCol={{ span: 15 }} >
                        {getFieldDecorator("delayDate", {
                          initialValue: info.postponementVos ? info.postponementVos[0].delayDate : "",
                        })(
                          <Input
                            placeholder="请输入"
                            addonAfter={selectAfter}
                            style={{ marginTop: 4 }}
                            disabled
                          />
                        )}
                      </FormItem>
                    </Col>
                  </Col>
                  <Col span={24}>
                    <FormItem label="申请说明" labelCol={{ span: 4 }} wrapperCol={{ span: 19 }}>
                      {getFieldDecorator('applicationNote', {
                        initialValue: info.postponementVos ? info.postponementVos[0].applicationNote : "",
                      })(<TextArea disabled />)}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem label="申请人" labelCol={{ span: 4 }} wrapperCol={{ span: 19 }}>
                      {getFieldDecorator('applicationPeople', {
                        initialValue: info.postponementVos ? info.postponementVos[0].applicationUserIdDesc : "",
                      })(<Input disabled />)}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem label="审核说明" labelCol={{ span: 4 }} wrapperCol={{ span: 19 }}>
                      {getFieldDecorator('approvalResults')(<TextArea />)}
                    </FormItem>
                  </Col>
                </Row>
              </Form>
            </Modal>
            <Modal
              title="退回"
              visible={this.state.goBackvisible}
              onOk={this.handleOk.bind(null, 'GoBack')}
              onCancel={this.handleCancels}
            >
              <Form>
                <h2 style={{ textAlign: "center", fontWeight: 100, color: "red" }}>请确认是否退回</h2>
              </Form>
            </Modal>
            <Modal visible={seePhoptovisible} footer={null} onCancel={this.handleCancel} style={{ position: "relative" }}>
              <Carousel effect="fade" ref="carouselImg">
                {seePhotoSrc && seePhotoSrc.map(item =>
                  <img alt="example" style={{ width: '100%' }} src={picIp + item.filePath} />
                )}
              </Carousel>
              <Icon onClick={this.prevImg} style={{ width: 32, height: 52, lineHeight: "52px", fontSize: 18, position: "absolute", top: "46%", left: 0 }} type="left" />
              <Icon onClick={this.nextImg} style={{ width: 32, height: 52, lineHeight: "52px", fontSize: 18, position: "absolute", top: "46%", right: 0 }} type="right" />
            </Modal>
          </div >
        </Drawer>
        <Drawer
          title="附件清单"
          placement="left"
          onClose={this.sixClose}
          hidden={!this.state.sixsixsixvisible}
          visible={this.state.sixsixsixvisible}
          width={400}
          mask={false}
          maskStyle={{ backgroundColor: "#fff", opacity: 0 }}
          style={{ position: "absolute", left: 271, top: 79 }}
        >
          <div>
            <DetailInformation12 {...DetailForms} />
          </div>
        </Drawer>
      </div>
    );
  }
}

const Workplace = Form.create()(app);
export default Workplace;
