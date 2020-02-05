/* eslint-disable func-names */
/* eslint-disable consistent-return */
/* eslint-disable react/no-string-refs */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-param-reassign */
/* eslint-disable array-callback-return */
/* eslint-disable no-shadow */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-unused-state */
/* eslint-disable no-unused-expressions */
/* eslint-disable eqeqeq */
/* eslint-disable react/jsx-no-bind */
import React, { PureComponent } from 'react';
import moment from 'moment';
import {
  Row,
  Col,
  Form,
  Input,
  Select,
  Button,
  Tabs,
  Modal,
  message,
  Icon,
  Breadcrumb,
  Carousel,
} from 'antd';

import { connect } from 'dva';
import DetailInformation1 from './DetailInformation1';
import DetailCourse2 from './DetailCourse2';
import { picIp } from '@/utils/ipConfig';

const Formats = 'YYYY-MM-DD HH:mm:ss';
const FormItem = Form.Item;
const { TabPane } = Tabs;
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

@connect(({ Complainmodels, loading }) => ({
  Complainmodels,
  loading: loading.models.Complainmodels,
}))
class app extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dispatchVos: [],
      uploading: false, // 附件
      previewVisible: false,
      previewImage: '',
      fileList: [],
      fileArr: [],
      filePath: '',
      fileListTwo: [],
      fileArrTwo: [],
      filePathTwo: '',
      appealTypes: [], // 诉求类型
      majorEmergencyMatters: [], // 紧急重大类事项
      appealSource: [], // 诉求来源
      returnType: [], // 回访类型
      gender: [], // 性别
      parentBank: [], // 所属分行（社区）
      UrbanApartment: [], // 主办部门
      leadership: [], // 承办人员
      LeadersInCharge: [], // 分管领导
      ListCourse: [], // 工作过程
      userRole: sessionStorage.getItem('userRole'), // 身份id
      isDetail: window.location.href.split('/')[window.location.href.split('/').length - 4], // 是否详情页
      info: {}, // 详情数据
      auditOpinionsvisible: false, // 审核通过&审核驳回
      closingCasevisible: false, // 确认结案
      executorHandlevisible: false, // 申请结案
      title: '',
      detelevisible: false, // 删除
      WasteCasevisible: false, // 废案
      reCheckvisible: false, // 复核弹窗
      applicationExtension: false, // 申请延期弹窗
      deferredAuditvisible: false, // 延期审核弹窗
      goBackvisible: false, // 退回弹窗
      summaryCasesList: [], // 归口类型
      unit: "", // 处置时限--小时，天
      seePhoptovisible: false, // 工作过程图片查看
      seePhotoSrc: "", // 工作过程图片地址
    };
  }

  componentDidMount() {
    this.getSelect('appealTypes');
    this.getSelect('majorEmergencyMatters');
    this.getSelect('appealSource');
    this.getSelect('returnType');
    this.getSelect('gender');
    this.getSelect('parentBank');
    this.getUrbanApartment();
    this.getDetailList();
    this.getSummaryCases();
  }

  // 获取 处置时限--小时，天
  getUnit = e => {
    this.setState({
      unit: e
    })
  }

  // 获取下拉框的值
  getSelect(groupCode) {
    const { dispatch } = this.props;
    dispatch({
      type: 'Complainmodels/getGroupCode',
      payload: { groupCode },
      callback: res => {
        if (res) {
          groupCode == 'appealTypes' && this.setState({ appealTypes: res });
          groupCode == 'majorEmergencyMatters' && this.setState({ majorEmergencyMatters: res });
          groupCode == 'appealSource' && this.setState({ appealSource: res });
          groupCode == 'returnType' && this.setState({ returnType: res });
          groupCode == 'gender' && this.setState({ gender: res });
          groupCode == 'parentBank' && this.setState({ parentBank: res.slice(1, 14) });
        }
      },
    });
  }

  // 获取主办部门
  getUrbanApartment = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'Complainmodels/getUrbanApartment',
      payload: {},
      callback: res => {
        if (res) {
          this.setState({ UrbanApartment: res.list });
        }
      },
    });
  };

  // 归口类型
  getSummaryCases = () => {
    this.props.dispatch({
      type: 'Complainmodels/summaryCases',
      payload: {},
      callback: res => {
        if (res) {
          this.setState({ summaryCasesList: res.list });
        }
      }
    })
  }

  // 获取详情数据
  getDetailList = () => {
    const { dispatch } = this.props;
    const { userRole } = this.state;
    dispatch({
      type: 'Complainmodels/getDetailList',
      payload: {
        id: window.location.href.split('/')[window.location.href.split('/').length - 3],
        userRole,
        check: userRole == 4 ? window.location.href.split('/')[window.location.href.split('/').length - 1] : 0
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
                  const arr = [];
                  const arrTwo = [];
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
                  const arr = [];
                  const arrTwo = [];
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
    });
  };

  // 获取工作过程
  getDetailListCourse = (id, userRole) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'Complainmodels/getDetailListCourse',
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

  // 主办部门选中项变化的回调
  UrbanApartmentSelect = (value) => {
    const { resetFields } = this.props.form;
    resetFields(['executor'])
    const { dispatch } = this.props;
    dispatch({
      type: 'Complainmodels/getUserListByOrgIdAndIsExecutive',
      payload: {
        id: value,
      },
      callback: res => {
        if (res) {
          if (res.retCode == 1) {
            let arr = [];
            res.list && (arr = res.list.filter(item => item.leadership != '1'));
            this.setState({ leadership: arr });
          }
        }
      },
    });
    dispatch({
      type: 'Complainmodels/getLeadersInCharge',
      payload: {
        id: value,
      },
      callback: res => {
        if (res) {
          if (res.retCode == '1') {
            this.setState({ LeadersInCharge: res.list });
          }
        }
      },
    });
  };

  // 派单
  systemDispatch = form => {
    const { dispatch } = this.props;
    const { info, filePath } = this.state;
    const { validateFields } = form;
    const url = 'Complainmodels/systemDispatch';
    validateFields((error, values) => {
      if (error) {
        return;
      }
      const dispatchVos = [];
      info.workOrderId && (values.workOrderId = info.workOrderId);
      values.appealHappenTime &&
        (values.appealHappenTime = moment(values.appealHappenTime).format(Formats));
      values.appealTime && (values.appealTime = moment(values.appealTime).format(Formats));
      if (values.organizeDepartment) {
        const json = {
          assistDepartment: values.organizeDepartment,
          assistTime: values.assistTime,
          executor: values.executor,
          unit: this.state.unit ? this.state.unit : info.dispatchVos.length > 0 ? info.dispatchVos[0].unit : "1",
        };
        dispatchVos.push(json);
      }
      if (values.isExamine == true) {
        values.isExamine = '1';
      }
      if (values.isExamine == false) {
        values.isExamine = '0';
      }
      if (values.isExamine == undefined) {
        values.isExamine = '0';
      }
      values.dispatchVos = dispatchVos;
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
              history.back(-1);
            } else {
              message.error(res.retMsg);
            }
          }
        },
      });
    });
  };

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
            type: 'compmodels/getUserListByOrgIdAndIsExecutive',
            payload: {
              id: dispatchVos[0].assistDepartment,
            },
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
        type: 'Complainmodels/manageExamine',
        payload: {
          ...obj,
        },
        callback: res => {
          if (res) {
            if (res.retCode == '1') {
              message.success(res.retMsg);
              this.setState({ auditOpinionsvisible: false });
              history.back(-1);
            } else {
              message.error(res.retMsg);
            }
          }
        },
      });
    } else if (type == 'JA') {
      values.closingEvaluation && (infos.closingEvaluation = values.closingEvaluation);
      values.durationInspection && (infos.durationInspection = values.durationInspection);
      values.inspectionInterval && (infos.inspectionInterval = values.inspectionInterval);
      dispatch({
        type: 'Complainmodels/closingCase',
        payload: {
          ...infos,
        },
        callback: res => {
          if (res) {
            if (res.retCode == '1') {
              message.success(res.retMsg);
              this.setState({ closingCasevisible: false });
              history.back(-1);
            } else {
              message.error(res.retMsg);
            }
          }
        },
      });
    } else if (type == 'SQJA') {
      filePathTwo && (infos.proPicture = filePathTwo.join(','));
      values.processingDescription && (infos.processingDescription = values.processingDescription);
      dispatch({
        type: 'Complainmodels/executorHandle',
        payload: {
          ...infos,
        },
        callback: res => {
          if (res) {
            if (res.retCode == 1) {
              message.success(res.retMsg);
              this.setState({ executorHandlevisible: false });
              history.back(-1);
            } else {
              message.error(res.retMsg);
            }
          }
        },
      });
    } else if (type == 'DEL' || type == 'FeiA') { // 删除
      const id = window.location.href.split('/')[window.location.href.split('/').length - 3];
      this.props.dispatch({
        type: "Complainmodels/deteles",
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
              history.back(-1);
            } else {
              message.error(res.retMsg);
            }
          }
        }
      })
    } else if (type == "FH") {
      const reCheckObj = {};
      values.executor && (reCheckObj.executor = values.executor);
      values.assistDepartment && (reCheckObj.assistDepartment = values.assistDepartment);
      values.assistTime && (reCheckObj.assistTime = values.newAssistTime);
      values && (reCheckObj.unit = this.state.unit ? this.state.unit : "1");
      values && (reCheckObj.workOrderId = window.location.href.split('/')[window.location.href.split('/').length - 3]);
      values && (reCheckObj.workOrderType = 3);
      if (values.newAssistTime) {
        dispatch({
          type: "Complainmodels/reCheck",
          payload: {
            ...reCheckObj
          },
          callback: res => {
            if (res) {
              if (res.retCode == 1) {
                message.success(res.retMsg);
                history.back(-1);
              } else {
                message.error(res.retMsg);
              }
            }
          }
        })
      } else {
        message.error("请填写复核时限！")
      }
    } else if (type == "SQYQ") {
      const delayObj = {};
      values.applicationNote && (delayObj.applicationNote = values.applicationNote);
      values.delayDate && (delayObj.delayDate = values.delayDate);
      values.assistTime && (delayObj.assistTime = values.assistTime);
      infos && (delayObj.isCheck = infos.isCheck);
      values && (delayObj.orderId = window.location.href.split('/')[window.location.href.split('/').length - 3]);
      values && (delayObj.workOrderType = 3);
      values && (delayObj.unit = this.state.unit ? this.state.unit : "1");
      if (values.delayDate) {
        dispatch({
          type: "Complainmodels/application",
          payload: {
            ...delayObj
          },
          callback: res => {
            if (res) {
              if (res.retCode == 1) {
                message.success(res.retMsg);
                history.back(-1);
              } else {
                message.error(res.retMsg);
              }
            }
          }
        })
      } else {
        message.error("请填写延时时限！")
      }
    } else if (type == "YQSHY") {
      values.approvalResults && (infos.approvalResults = values.approvalResults);
      dispatch({
        type: "Complainmodels/deferredAudit",
        payload: {
          ...infos
        },
        callback: res => {
          if (res) {
            if (res.retCode == 1) {
              message.success(res.retMsg);
              history.back(-1);
            } else {
              message.error(res.retMsg);
            }
          }
        }
      })
    } else if (type == "YQSHN") {
      values.approvalResults && (infos.approvalResults = values.approvalResults);
      infos && (infos.isReview && (infos.isReview = 0))
      dispatch({
        type: "Complainmodels/deferredAudit",
        payload: {
          ...infos
        },
        callback: res => {
          if (res) {
            if (res.retCode == 1) {
              message.success(res.retMsg);
              history.back(-1);
            } else {
              message.error(res.retMsg);
            }
          }
        }
      })
    } else if (type == "GoBack") {
      dispatch({
        type: "Complainmodels/goBackS",
        payload: {
          workOrderId: info.workOrderId,
          workOrderType: 3,
        },
        callback: res => {
          if (res) {
            if (res.retCode == 1) {
              message.success(res.retMsg);
              history.back(-1);
            } else {
              message.error(res.retMsg);
            }
          }
        }
      })
    }
  };

  // 轮播图，上一张下一张
  prevImg = () => {
    this.refs.carouselImg.prev();
  }

  nextImg = () => {
    this.refs.carouselImg.next();
  }

  handleCancels = () => {
    this.setState({
      visible: false,
      auditOpinionsvisible: false,
      closingCasevisible: false,
      executorHandlevisible: false,
      previewVisible: false,
      detelevisible: false,
      WasteCasevisible: false,
      reCheckvisible: false,
      applicationExtension: false,
      deferredAuditvisible: false,
      goBackvisible: false,
      seePhoptovisible: false,
    });
  };

  // 保存
  increase = form => {
    const { validateFields } = form;
    const { dispatch } = this.props;
    const { info, filePath } = this.state;
    const url = 'Complainmodels/save';
    validateFields((error, values) => {
      if (error) {
        return;
      }
      const dispatchVos = [];
      info.workOrderId && (values.workOrderId = info.workOrderId);
      values.appealHappenTime &&
        (values.appealHappenTime = moment(values.appealHappenTime).format(Formats));
      values.appealTime && (values.appealTime = moment(values.appealTime).format(Formats));
      if (values.organizeDepartment) {
        const json = {
          assistDepartment: values.organizeDepartment,
          assistTime: values.assistTime,
          executor: values.executor,
          unit: this.state.unit ? this.state.unit : info.dispatchVos.length > 0 ? info.dispatchVos[0].unit : "1",
        };
        dispatchVos.push(json);
      }
      if (values.isExamine == true) {
        values.isExamine = '1';
      }
      if (values.isExamine == false) {
        values.isExamine = '0';
      }
      if (values.isExamine == undefined) {
        values.isExamine = '0';
      }
      values.dispatchVos = dispatchVos;
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
              history.back(-1);
            } else {
              message.error(res.retMsg);
            }
          }
        },
      });
    });
  };

  // 工作过程查看图片
  seePhopto = e => {
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
      const photoList = e.split(",");
      const { dispatch } = this.props;
      photoList.map(item => {
        dispatch({
          type: 'Complainmodels/downPhoto',
          payload: {
            producer: 'AttachmentDownload',
            id: item,
          }
        })
      })
    }
  }

  // 根据工单状态和登陆人员显示按钮组件
  buttons = (status, userRole, isCheck, startIsReview, endIsReview) => {
    const { info, dispatchVos } = this.state;
    if (userRole == '2' && status == '1') {
      return (
        <Col span={21}>
          <Button
            style={{ marginRight: 10 }}
            type="primary"
            onClick={this.increase.bind(this, this.props.form)}
          >
            保存
          </Button>
          <Button
            style={{ marginRight: 10, border: "#2B49C4 1px solid", color: "#2B49C4" }}
            onClick={this.systemDispatch.bind(this, this.props.form)}
          >
            派单
          </Button>
          <Button style={{ marginRight: 10, border: "#2B49C4 1px solid", color: "#2B49C4" }} onClick={this.showModal.bind(null, 'FeiA')}>
            废案
          </Button>
          <Button style={{ marginRight: 10 }} hidden type="primary">
            导出
          </Button>
          <Button style={{ marginRight: 10, border: "#2B49C4 1px solid", color: "#2B49C4" }} onClick={this.showModal.bind(null, 'DEL')}>
            删除
          </Button>
        </Col>
      );
    }
    if (userRole == '2' && status == '2') {
      return (
        <Col span={21}>
          <Button style={{ marginRight: 10, border: "#2B49C4 1px solid", color: "#2B49C4" }} onClick={this.showModal.bind(null, 'FeiA')}>
            废案
          </Button>
        </Col>
      );
    }
    if (userRole == '2' && status == '3') {
      return (
        <Col span={21}>
          <Button style={{ marginRight: 10 }} hidden type="primary">
            追回
          </Button>
          <Button
            style={{ marginRight: 10, border: "#2B49C4 1px solid", color: "#2B49C4" }}
            onClick={this.showModal.bind(null, 'YQSH')}
            hidden={endIsReview == 0}
          >
            延期审核
          </Button>
          <Button style={{ marginRight: 10, border: "#2B49C4 1px solid", color: "#2B49C4" }} onClick={this.showModal.bind(null, 'FeiA')}>
            废案
          </Button>
          <Button style={{ marginRight: 10 }} hidden type="primary">
            导出
          </Button>
        </Col>
      );
    }
    // 信息中心且处置反馈完毕2级
    if (userRole == '2' && status == '6' && isCheck == "1") {
      return (
        <Col span={21}>
          <Button
            style={{ marginRight: 10 }}
            type="primary"
            onClick={this.showModal.bind(null, 'JA')}
          >
            确认结案
          </Button>
          <Button style={{ marginRight: 10, border: "#2B49C4 1px solid", color: "#2B49C4" }} onClick={this.showModal.bind(null, 'GoBack')}>
            退回
          </Button>
          <Button style={{ marginRight: 10, border: "#2B49C4 1px solid", color: "#2B49C4" }} onClick={this.showModal.bind(null, 'FeiA')}>
            废案
          </Button>
          <Button style={{ marginRight: 10 }} hidden type="primary">
            导出
          </Button>
        </Col>
      );
    }
    if (userRole == '2' && status == '6' && isCheck == "0") {
      return (
        <Col span={21}>
          <Button
            style={{ marginRight: 10 }}
            onClick={this.showModal.bind(null, 'FH')}
            type="primary"
          >
            复核
          </Button>
          <Button
            style={{ marginRight: 10 }}
            type="primary"
            onClick={this.showModal.bind(null, 'JA')}
          >
            确认结案
          </Button>
          <Button style={{ marginRight: 10, border: "#2B49C4 1px solid", color: "#2B49C4" }} onClick={this.showModal.bind(null, 'GoBack')}>
            退回
          </Button>
          <Button style={{ marginRight: 10, border: "#2B49C4 1px solid", color: "#2B49C4" }} onClick={this.showModal.bind(null, 'FeiA')}>
            废案
          </Button>
          <Button style={{ marginRight: 10 }} hidden type="primary">
            导出
          </Button>
        </Col>
      )
    }
    if (userRole == '1' && status == '2' && info.isExamine == "1") {
      return (
        <Col span={21}>
          <Button style={{ marginRight: 10, border: "#2B49C4 1px solid", color: "#2B49C4" }} onClick={this.showModal.bind(null, 'FeiA')}>
            废案
          </Button>
          <Button
            style={{ marginRight: 10, border: "#2B49C4 1px solid", color: "#2B49C4" }}
            onClick={this.showModal.bind(null, 'TG')}
          >
            审核通过
          </Button>
          <Button
            style={{ marginRight: 10, border: "#2B49C4 1px solid", color: "#2B49C4" }}
            onClick={this.showModal.bind(null, 'BH')}
          >
            审核驳回
          </Button>
        </Col>
      );
    }
    // 执行员且待处置2级
    if (userRole == '4' && status == '3') {
      return (
        <Col span={21}>
          <Button
            style={{ marginRight: 10, border: "#2B49C4 1px solid", color: "#2B49C4" }}
            hidden={dispatchVos && dispatchVos[0].examine == '1' || info.isReview == 1}
            onClick={this.showModal.bind(null, 'SQJA')}
          >
            申请结案
          </Button>
          <Button
            style={{ marginRight: 10, border: "#2B49C4 1px solid", color: "#2B49C4" }}
            onClick={this.showModal.bind(null, 'SQYQ')}
            hidden={info.isApplicationClosure == 1}
          >
            申请延期
          </Button>
          <Button hidden={info.isApplicationClosure == 1 || info.isReview == 1} onClick={this.showModal.bind(null, 'GoBack')} style={{ color: "#2B49C4", marginRight: 10, border: "#2B49C4 1px solid" }}>
            退回
          </Button>
          <Button type="primary" hidden style={{ marginRight: 10 }}>
            导出
          </Button>
        </Col>
      );
    }
  };

  // 关闭预览图片框
  handleCancel = () => this.setState({ previewVisible: false });

  // 打开预览图片框
  handlePreview = async (f, file) => {
    const that = this;
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    if (file.preview) {
      const watermark = document.createElement('canvas');
      watermark.width = 533;
      watermark.height = 300;
      const imgs = new Image();
      const timer = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
      imgs.width = 533;
      imgs.height = 300;
      imgs.src = file.preview;
      imgs.onload = () => {
        const ctx = watermark.getContext('2d');
        ctx.drawImage(imgs, 0, 0, 533, 300);
        ctx.font = "16px Arial";
        ctx.fillStyle = 'red';
        if (f == "before") {
          ctx.fillText(`${timer} -- 整改前`, 292, 280);
        }
        if (f == "after") {
          ctx.fillText(`${timer} -- 整改后`, 292, 280);
        }
        const img = watermark.toDataURL('image/png')
        that.setState({
          previewImage: img,
          previewVisible: true,
        })
      };
    } else {
      this.setState({
        previewImage: file.url,
        previewVisible: true,
      });
    }
  };

  // 整改后删除图片
  handleRemoveTwo = file => {
    this.setState(state => {
      const index = state.fileListTwo.indexOf(file);
      let newFileList = state.filePathTwo;
      newFileList && newFileList.reverse().splice(index, 1);
      return {
        filePathTwo: newFileList,
      };
    });
  };

  // 整改前删除图片
  handleRemove = file => {
    this.setState(state => {
      const index = state.fileList.indexOf(file);
      let newFileList = state.filePath;
      newFileList && newFileList.reverse().splice(index, 1);
      return {
        filePath: newFileList,
      };
    });
  };

  // 整改前上传图片
  handleChange = info => {
    const { dispatch } = this.props;
    this.setState({ fileList: info.fileList }, () => {
      const { filePath } = this.state;
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
        const { originFileObj } = info.file;
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
              type: 'Complainmodels/watermarks',
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
      const { filePathTwo } = this.state;
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
        const { originFileObj } = info.file;
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
              type: 'Complainmodels/watermarks',
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

  render() {
    const {
      uploading,
      previewVisible,
      previewImage,
      fileList,
      filePath,
      fileListTwo,
      filePathTwo,
      title,
      appealTypes,
      majorEmergencyMatters,
      appealSource,
      returnType,
      gender,
      dispatchVos,
      leadership,
      parentBank,
      UrbanApartment,
      LeadersInCharge,
      ListCourse,
      info,
      userRole,
      summaryCasesList,
      seePhoptovisible,
      seePhotoSrc,
      unit,
    } = this.state;
    const DetailForms = {
      uploading,
      previewVisible,
      previewImage,
      fileList,
      filePath,
      fileListTwo,
      filePathTwo,
      leadership,
      appealTypes,
      majorEmergencyMatters,
      appealSource,
      returnType,
      gender,
      info,
      dispatchVos,
      UrbanApartment,
      parentBank,
      LeadersInCharge,
      handlePreview: this.handlePreview,
      handleChange: this.handleChange,
      handleChangeTwo: this.handleChangeTwo,
      handleCancel: this.handleCancel,
      handleRemove: this.handleRemove,
      handleRemoveTwo: this.handleRemoveTwo,
      ListCourse,
      UrbanApartmentSelect: this.UrbanApartmentSelect.bind(this),
      form: this.props.form,
      userRole,
      summaryCasesList,
      getUnit: this.getUnit,
      seePhopto: this.seePhopto,
      loopDownPhopto: this.loopDownPhopto,
      unit,
    };
    const { getFieldDecorator } = this.props.form;
    const selectAfter = (
      <Select onChange={this.getUnit} value="小时" style={{ width: 70 }}>
        <Option value="1">小时</Option>
        <Option value="2">天</Option>
      </Select>
    );
    return (
      <div id="listTitleContent">
        <Breadcrumb separator=">">
          <span id="breadcrumbIcon" />
          <Breadcrumb.Item>工单派发</Breadcrumb.Item>
          <Breadcrumb.Item>部门派发</Breadcrumb.Item>
          <Breadcrumb.Item>投诉工单</Breadcrumb.Item>
          <Breadcrumb.Item>处理</Breadcrumb.Item>
        </Breadcrumb>
        <div id="listTitleDetailBanner">
          <h3>
            <span>工单编号 ：{info.workOrderId}</span>
            <span style={{ margin: '0 0 0 16px' }}>状态 ：{info.statusDesc}</span>
          </h3>
          <Row>
            <Col span={24}>
              <Col span={3}>
                <Button
                  style={{ marginRight: 40, marginLeft: 28 }}
                  type="primary"
                  onClick={() => {
                    history.back(-1);
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
          destroyOnClose
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
              <Col span={24}>
                <Col span={12}>
                  <FormItem label="巡查期限(天)" labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
                    {getFieldDecorator('durationInspection')(<Input />)}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    label="每次巡查间隔(天)"
                    labelCol={{ span: 12 }}
                    wrapperCol={{ span: 12 }}
                  >
                    {getFieldDecorator('inspectionInterval')(<Input />)}
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
                  <FormItem label="复核时限" labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}>
                    {getFieldDecorator("newAssistTime", {
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
                  <FormItem label="复核部门">
                    {getFieldDecorator(`assistDepartment`, {
                      rules: [{
                        required: true,
                        message: "请填写复核部门!",
                      }],
                      initialValue: "请选择",
                    }
                    )(
                      <Select
                        placeholder="请选择"
                        onSelect={this.UrbanApartmentSelect}
                      >
                        {UrbanApartment &&
                          UrbanApartment.map(item => (
                            <Option value={item.id} key={item.id}>
                              {item.orgName}
                            </Option>
                          ))}
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Col>
              <Col span={24}>
                <Col span={18} push={3}>
                  <FormItem label="复核人员">
                    {getFieldDecorator(`executor`, {
                      rules: [{
                        required: true,
                        message: "请填写复核人员!",
                      }],
                      initialValue: "请选择",
                    })(
                      <Select placeholder="请选择">
                        {leadership &&
                          leadership.map(item => {
                            return <Option value={item.userId}>{item.userName}</Option>;
                          })}
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
                  <FormItem label="处置时限" labelCol={{ span: 8 }} wrapperCol={{ span: 15 }}>
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
                  <FormItem label="延时时间" labelCol={{ span: 8 }} wrapperCol={{ span: 15 }}>
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
                <FormItem label="申请说明" labelCol={{ span: 4 }} wrapperCol={{ span: 17 }}>
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
            <Button key="submit" type="primary" onClick={this.handleOk.bind(null, 'YQSHY')}>
              审核通过
            </Button>,
            <Button key="back" onClick={this.handleOk.bind(null, 'YQSHN')}>
              审核驳回
            </Button>,
          ]}
        >
          <Form>
            <Row>
              <Col span={24}>
                <Col span={12}>
                  <FormItem label="处置时限" labelCol={{ span: 8 }} wrapperCol={{ span: 15 }}>
                    {getFieldDecorator("assistTime", {
                      initialValue: (info.postponementVos && info.dispatchVos[0]) ? info.postponementVos[0].assistTime : "",
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
                  <FormItem label="延时时间" labelCol={{ span: 9 }} wrapperCol={{ span: 15 }}>
                    {getFieldDecorator("delayDate", {
                      initialValue: (info.postponementVos && info.dispatchVos[0]) ? info.postponementVos[0].delayDate : "",
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
                    initialValue: (info.postponementVos && info.dispatchVos[0]) ? info.postponementVos[0].applicationNote : "",
                  })(<TextArea disabled />)}
                </FormItem>
              </Col>
              <Col span={24}>
                <FormItem label="申请人" labelCol={{ span: 4 }} wrapperCol={{ span: 19 }}>
                  {getFieldDecorator('applicationPeople', {
                    initialValue: (info.postponementVos && info.dispatchVos[0]) ? info.postponementVos[0].applicationUserIdDesc : "",
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
        <Modal visible={seePhoptovisible} footer={null} onCancel={this.handleCancels} style={{ position: "relative" }}>
          <Carousel effect="fade" ref="carouselImg">
            {seePhotoSrc && seePhotoSrc.map(item =>
              <img alt="example" style={{ width: '100%' }} src={picIp + item.filePath} />
            )}
          </Carousel>
          <Icon onClick={this.prevImg} style={{ width: 32, height: 52, lineHeight: "52px", fontSize: 18, position: "absolute", top: "46%", left: 0 }} type="left" />
          <Icon onClick={this.nextImg} style={{ width: 32, height: 52, lineHeight: "52px", fontSize: 18, position: "absolute", top: "46%", right: 0 }} type="right" />
        </Modal>
      </div>
    );
  }
}

const Detail = Form.create()(app);
export default Detail;
