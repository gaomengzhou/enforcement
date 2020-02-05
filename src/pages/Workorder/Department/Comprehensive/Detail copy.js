import React, { Component, Fragment } from 'react';
import Link from 'umi/link';
import moment from 'moment';
import { connect } from 'dva';
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
  Upload,
  Divider,
  Carousel,
  Checkbox,
} from 'antd';

const Formats = 'YYYY-MM-DD HH:mm:ss';
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;
let id = 0;

import { picIp } from '@/utils/ipConfig';
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

@connect(({ compmodels, loading }) => ({
  compmodels,
  loading: loading.models.compmodels,
}))
class app extends Component {
  constructor(props) {
    super(props);
    this.state = {
      partiesType: '1',
      fileList: [],
      userRole: sessionStorage.getItem('userRole'), //身份id
      isDetail: window.location.href.split('/')[window.location.href.split('/').length - 3], //是否详情页
      info: {}, // 详情数据
      dispatchVos: ['1'], // 详情处置人员数据,
      UrbanApartment: [], // 处置部门
      gridList: [], //所属网格
      parentBank: [], //所属分行
      workSource: [], //工单类别
      uploading: false, // 附件
      fileList: [],
      previewVisible: false,
      previewImage: '',
      fileArr: [],
      filePath: '',
      fileListTwo: [],
      fileArrTwo: [],
      filePathTwo: '',
      leadership: [], // 处置人员
      ListCourse: [], //工作过程
      visible: false, // 安排按钮弹窗
      leaderships: [], //安排弹窗的执行人
      auditOpinionsvisible: false, //审核通过&审核驳回
      closingCasevisible: false, //确认结案
      executorHandlevisible: false, //申请结案
      title: '',
      detelevisible: false, // 删除
      WasteCasevisible: false, // 废案
      mapBox: false, // 地图弹窗
      reCheckvisible: false, // 复核弹窗
      applicationExtension: false, // 申请延期弹窗
      deferredAuditvisible: false, // 延期审核弹窗
      goBackvisible: false, // 退回弹窗
      unit: "1", // 处置时限--小时，天
      rightMatterList: [], // 权力编码
      seePhoptovisible: false, // 工作过程图片查看
      seePhotoSrc: "", // 工作过程图片地址
      isManageFlag: [], // 领导决定处置时间
    };
  }
  onSelects = value => {
    this.setState({ partiesType: value });
  };
  // 获取下拉框的值
  getSelect(groupCode) {
    const { dispatch } = this.props;
    dispatch({
      type: 'compmodels/getGroupCode',
      payload: { groupCode },
      callback: res => {
        if (res) {
          groupCode == 'parentBank' && this.setState({ parentBank: res });
          groupCode == 'workOrderCategory' && this.setState({ workSource: res });
        }
      },
    });
  }
  remove = k => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    if (keys.length === 1) {
      return;
    }
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };
  add = () => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(id++);
    form.setFieldsValue({
      keys: nextKeys,
    });
  };
  // 获取 处置时限--小时，天
  getUnit = (e, name) => {
    const { form: { setFieldsValue } } = this.props;
    setFieldsValue({ [name]: e })
    this.setState({
      // [name]: e
      unit: "1"
    })
  }
  // 权力编码
  getRightMatter = e => {
    this.props.dispatch({
      type: 'compmodels/rightMatter',
      payload: {

      },
      callback: res => {
        if (res) {
          this.setState({ rightMatterList: res.list });
        }
      }
    })
  }
  // 整改前
  renderAttachment() {
    const { uploading, fileList, filePath, previewVisible, previewImage, info } = this.state;
    const uploadProps = {
      name: 'file',
      action: '/services/attachment/file/upload/AttachmentUpload',
      onChange: this.handleChange,
      status: 'done',
      fileList: [...fileList],
      listType: 'picture',
      onPreview: this.handlePreview,
      onRemove: this.handleRemove,
    };
    const uploadButton = (
      <div>
        <Button className="ant-upload-text" disabled={info.status != '1' && info.status != '2'}>
          整改前附件
        </Button>
      </div>
    );
    return (
      <Fragment>
        <div className="clearfix">
          <Upload {...uploadProps}>{fileList.length >= 10 ? null : uploadButton}</Upload>
          <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>
        </div>
      </Fragment>
    );
  }
  // 整改后
  renderAttachmentTwo() {
    const { uploading, fileListTwo, filePathTwo, previewVisible, previewImage, info, userRole } = this.state;
    const uploadProps = {
      name: 'file',
      action: '/services/attachment/file/upload/AttachmentUpload',
      onChange: this.handleChangeTwo,
      status: 'done',
      fileList: [...fileListTwo],
      listType: 'picture',
      onPreview: this.handlePreview,
      onRemove: this.handleRemoveTwo,
    };
    const uploadButton = (
      <div>
        <Button className="ant-upload-text" disabled={(info.status != '5' || userRole != 4 || info.isApplicationClosure != 0) && (info.selfDisposal == 0 || info.status == 9)}>
          整改后附件
        </Button>
      </div>
    );
    return (
      <Fragment>
        <div className="clearfix">
          <Upload {...uploadProps}>{fileListTwo.length >= 10 ? null : uploadButton}</Upload>
          <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>
        </div>
      </Fragment>
    );
  }

  // 关闭删除
  handleCancels = e => {
    this.setState({
      detelevisible: false,
      WasteCasevisible: false,
      reCheckvisible: false,
      applicationExtension: false,
      deferredAuditvisible: false,
      goBackvisible: false,
    });
  };
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
          type: 'compmodels/downPhoto',
          payload: {
            producer: 'AttachmentDownload',
            id: item,
          }
        })
      })
    }
  }

  // 领导决定处置时间
  isManageChange = (i, e) => {
    let isIWantGoHome = this.state.isManageFlag;
    isIWantGoHome[i] = e.target.checked;
    if (e.target.checked) {
      let valueList = [];
      valueList[i] = "";
      this.props.form.setFieldsValue({
        assistTime: valueList,
      })
    }
  }

  // 获取详情数据
  getDetailList = () => {
    const { dispatch } = this.props;
    const { userRole } = this.state;
    dispatch({
      type: 'compmodels/getDetailList',
      payload: {
        id: window.location.href.split('/')[window.location.href.split('/').length - 2],
        userRole: userRole,
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
                if (userRole == '4' || userRole == '3') {
                  if (info.status != '1') {
                    this.getDetailListCourse(dispatchVos[0].assistId, userRole);
                    this.UrbanApartmentSelect(dispatchVos[0].assistDepartment);
                  }
                } else {
                  this.getDetailListCourse(info.workOrderId, userRole);
                  if (dispatchVos && dispatchVos.length > 0) {
                    this.UrbanApartmentSelect(dispatchVos[0].assistDepartment);
                  }
                }
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
    });
  };
  //获取主办部门
  getUrbanApartment = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'compmodels/getUrbanApartment',
      payload: {},
      callback: res => {
        if (res) {
          this.setState({ UrbanApartment: res.list });
        }
      },
    });
  };
  // 关闭预览图片框
  // handleCancel = () => this.setState({ previewVisible: false });
  // 打开预览图片框
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

  //获取工作过程
  getDetailListCourse = (id, userRole) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'compmodels/getDetailListCourse',
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
  // 详情保存
  save = form => {
    const { dispatch } = this.props;
    const { info, filePath } = this.state;
    const infos = info;
    const { validateFields } = form;
    validateFields((error, values) => {
      if (error) {
        return;
      }
      let dispatchVos = [];
      infos.workOrderId && (values.workOrderId = infos.workOrderId);
      if (values.assistDepartment) {
        for (var i = 0; i < values.assistDepartment.length; i++) {
          let json = {
            assistDepartment: values.assistDepartment[i],
            assistTime: values.assistTime[i],
            assistWorker: isNaN(values.assistWorker[i]) ? info.dispatchVos[i].assistWorker : values.assistWorker[i],
            unit: this.state.unit,
            isManage: values.isManage[i] ? "1" : "0",
          };
          dispatchVos.push(json);
        }
      }
      infos.dispatchVos = dispatchVos;
      filePath && (infos.prePicture = filePath.join(','));
      dispatch({
        type: 'compmodels/save',
        payload: {
          ...infos,
        },
        callback: res => {
          if (res) {
            if (res.retCode == '1') {
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
  // 轮播图，上一张下一张
  prevImg = e => {
    this.refs.carouselImg.prev();
  }
  nextImg = e => {
    this.refs.carouselImg.next();
  }
  //派单
  systemDispatch = form => {
    const { dispatch } = this.props;
    const { info, filePath } = this.state;
    const infos = info;
    const { validateFields } = form;
    if (info.dispatchVos && info.dispatchVos.length > 0) {
      validateFields((error, values) => {
        if (error) {
          return;
        }
        let dispatchVos = [];
        infos.workOrderId && (values.workOrderId = infos.workOrderId);
        if (values.assistDepartment) {
          for (var i = 0; i < values.assistDepartment.length; i++) {
            let json = {
              assistDepartment: values.assistDepartment[i],
              assistTime: values.assistTime[i],
              assistWorker: isNaN(values.assistWorker[i]) ? info.dispatchVos[i].assistWorker : values.assistWorker[i],
              unit: this.state.unit,
              isManage: values.isManage[i] ? "1" : "0",
            };
            dispatchVos.push(json);
          }
        }
        infos.dispatchVos = dispatchVos;
        filePath && (infos.prePicture = filePath.join(','));
        dispatch({
          type: 'compmodels/systemDispatch',
          payload: {
            ...infos,
          },
          callback: res => {
            if (res) {
              if (res.retCode == '1') {
                message.success(res.retMsg);
                history.back(-1);
              } else {
                message.error(res.retMsg);
              }
            }
          },
        });
      })
    } else {
      validateFields((error, values) => {
        if (error) {
          return;
        }
        let dispatchVos = [];
        if (values.assistDepartment) {
          for (var i = 0; i < values.assistDepartment.length; i++) {
            let json = {
              assistDepartment: values.assistDepartment[i],
              assistTime: values.assistTime[i],
              assistWorker: values.assistWorker[i],
              unit: this.state.unit,
              isManage: values.isManage[i] ? "1" : "0",
            };
            dispatchVos.push(json);
          }
        }
        infos.dispatchVos = dispatchVos;
        dispatch({
          type: 'compmodels/systemDispatch',
          payload: {
            ...infos,
          },
          callback: res => {
            if (res) {
              if (res.retCode == '1') {
                message.success(res.retMsg);
                history.back(-1);
              } else {
                message.error(res.retMsg);
              }
            }
          },
        });
      });
    }
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
            type: 'compmodels/getUserListByOrgIdAndIsExecutives',
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
    values.assistTime && (obj.assistTime = values.assistTime[0]);
    if (title == '审核通过') {
      obj.examine = '3';
    }
    if (title == '审核驳回') {
      obj.examine = '4';
    }
    if (type == 'TGBH') {
      dispatch({
        type: 'compmodels/manageExamine',
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
        type: 'compmodels/closingCase',
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
        type: 'compmodels/executorHandle',
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
      const id = window.location.href.split('/')[window.location.href.split('/').length - 2];
      this.props.dispatch({
        type: "compmodels/deteles",
        payload: type == 'DEL' ?
          {
            status: 10,
            id
          } : {
            status: 8,
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
      let reCheckObj = {};
      values.fhexecutor && (reCheckObj.executor = values.fhexecutor);
      values.fhassistDepartment && (reCheckObj.assistDepartment = values.fhassistDepartment);
      values.fhassistTime && (reCheckObj.assistTime = values.fhassistTime);
      values && (reCheckObj.unit = this.state.unit);
      values && (reCheckObj.workOrderId = window.location.href.split('/')[window.location.href.split('/').length - 2]);
      values && (reCheckObj.workOrderType = 2);
      dispatch({
        type: "compmodels/reCheck",
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
    } else if (type == "SQYQ") {
      let delayObj = {};
      values.applicationNote && (delayObj.applicationNote = values.applicationNote);
      values.delayDate && (delayObj.delayDate = values.delayDate);
      values.sqyqassistTime && (delayObj.assistTime = values.sqyqassistTime);
      infos && (delayObj.isCheck = infos.isCheck);
      values && (delayObj.orderId = window.location.href.split('/')[window.location.href.split('/').length - 2]);
      values && (delayObj.workOrderType = 2);
      values && (delayObj.unit = this.state.unit);
      dispatch({
        type: "compmodels/application",
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
    } else if (type == "YQSHY") {
      values.approvalResults && (infos.approvalResults = values.approvalResults);
      dispatch({
        type: "compmodels/deferredAudit",
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
        type: "compmodels/deferredAudit",
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
        type: "compmodels/goBackS",
        payload: {
          workOrderId: info.workOrderId,
          workOrderType: 2,
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
      values.assistTime && (obj.assistTime = values.assistTime[0]);
      dispatch({
        type: 'compmodels/manageArrange',
        payload: {
          ...obj,
        },
        callback: res => {
          if (res) {
            if (res.retCode == 1) {
              message.success(res.retMsg);
              this.setState({ visible: false });
              history.back(-1);
            } else {
              message.error(res.retMsg);
            }
          }
        },
      });
    }
  };

  // 查看地图
  showMap = v => {
    this.setState({
      mapBox: true,
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false,
      auditOpinionsvisible: false,
      closingCasevisible: false,
      executorHandlevisible: false,
      previewVisible: false,
      mapBox: false,
      seePhoptovisible: false,
    });
  };
  // 根据工单状态和登陆人员显示按钮组件
  buttons = (status, userRole, isCheck, startIsReview, endIsReview, createRole) => {
    const { info, dispatchVos } = this.state;
    // 信息中心并且是待派遣
    if (userRole == '2' && status == '2') {
      return (
        <Col span={21}>
          <Button
            style={{ marginRight: 20 }}
            type="primary"
            onClick={this.save.bind(this, this.props.form)}
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
          <Button
            style={{ marginRight: 20 }}
            onClick={this.showModal.bind(null, 'GoBack')}
            hidden={createRole != "4"}
            type="primary">
            退回
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
    // 信息中心待处置
    if (userRole == '2' && status == '3') {
      return (
        <Col span={21}>
          <Button style={{ marginRight: 20 }} onClick={this.showModal.bind(null, 'GoBack')} type="primary">
            退回
          </Button>
        </Col>
      )
    }
    //信息中心且是待处置2级
    if (userRole == '2' && status == '5') {
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
    if (userRole == '2' && status == '9' && isCheck == "1") {
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
    if (userRole == '2' && status == '9' && isCheck == "0") {
      return (
        <Col span={21}>
          <Button style={{ marginRight: 20 }} onClick={this.showModal.bind(null, 'FH')} type="primary">
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
      );
    }
    //部门领导且待处置2级
    if (userRole == '3' && status == '5' && dispatchVos[0].examine != '1') {
      return (
        <Col span={21}>
          <Button
            style={{ marginRight: 20 }}
            type="primary"
            onClick={this.showModal}
            hidden={dispatchVos[0].executor != undefined}
          >
            安排
          </Button>
          <Button
            style={{ marginRight: 20 }}
            onClick={this.showModal.bind(null, 'GoBack')}
            type="primary"
            hidden={dispatchVos[0].executor}
          >
            退回
          </Button>
          <Button style={{ marginRight: 20 }} hidden type="primary">
            导出
          </Button>
        </Col>
      );
    }
    //部门领导且待处置2级且待审核状态
    if (userRole == '3' && status == '5' && dispatchVos[0].examine == '1') {
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
          <Button
            style={{ marginRight: 20 }}
            hidden
            onClick={this.showModal.bind(null, 'GoBack')} type="primary"
          >
            退回
          </Button>
        </Col>
      );
    }
    // 执行员且待上报
    if (userRole == '4' && status == '1') {
      return (
        <Col span={21}>
          <Button
            style={{ marginRight: 20 }}
            type="primary"
            onClick={this.increase.bind(null, this.props.form)}
          >
            保存
          </Button>
          <Button
            style={{ marginRight: 20 }}
            type="primary"
            onClick={this.increase.bind(null, this.props.form, 'SB')}
            hidden={info.selfDisposal == 1}
          >
            上报
          </Button>
          <Button
            style={{ marginRight: 20 }}
            type="primary"
            hidden={info.selfDisposal == 0}
            onClick={this.increase.bind(null, this.props.form, 'ZCZ')}
          >
            自处置
          </Button>
        </Col>
      );
    }
    //执行员且待处置2级
    if (userRole == '4' && status == '5') {
      return (
        <Col span={21}>
          <Button
            type="primary"
            style={{ marginRight: 20 }}
            hidden={dispatchVos && dispatchVos[0].examine == '1' || info.isReview == 1}
            onClick={this.showModal.bind(null, 'SQJA')}
          >
            申请结案
          </Button>
          <Button
            type="primary"
            style={{ marginRight: 20 }}
            onClick={this.showModal.bind(null, 'SQYQ')}
            hidden={info.isReview == 1 || info.isApplicationClosure == 1}
          >
            申请延期
          </Button>
          <Button type="primary" hidden={info.isApplicationClosure == 1 || info.isReview == 1} onClick={this.showModal.bind(null, 'GoBack')} style={{ marginRight: 20 }}>
            退回
          </Button>
          <Button type="primary" hidden style={{ marginRight: 20 }}>
            导出
          </Button>
        </Col>
      );
    }
    //执行员且处置反馈完毕2级
    if (userRole == '4' && status == '9') {
      return (
        <Col span={21}>
          <Button style={{ marginRight: 20 }} hidden type="primary">
            追回
          </Button>
          <Button style={{ marginRight: 20 }} hidden type="primary">
            导出
          </Button>
        </Col>
      );
    }
    //已结案
    if (status == '7') {
      return (
        <Col span={21}>
          <Button style={{ marginRight: 20 }} hidden type="primary">
            导出
          </Button>
        </Col>
      );
    }
  };

  //执行员上报&&保存&&自处置
  increase = (form, type) => {
    const { dispatch } = this.props;
    const { info, filePath, filePathTwo } = this.state;
    const infos = info;
    const { validateFields } = form;
    let url = '';
    if (type == 'SB') {
      if (sessionStorage.getItem('userRole') == '4') {
        url = 'compmodels/reportedData';
      }
    } else if (type == 'ZCZ') {
      url = 'compmodels/self';
    } else {
      url = 'compmodels/save';
    }
    validateFields((error, values) => {
      if (error) {
        return;
      }
      let dispatchVos = [];
      if (values.assistDepartment) {
        for (var i = 0; i < values.assistDepartment.length; i++) {
          let json = {
            assistDepartment: values.assistDepartment[i],
            assistTime: values.assistTime[i],
            assistWorker: values.assistWorker[i],
            unit: this.state.unit,
          };
          dispatchVos.push(json);
        }
      }
      url == 'compmodels/reportedData' ? undefined : (values.dispatchVos = dispatchVos);
      values.keys && (values.keys = undefined);
      values.assistDepartment && (values.assistDepartment = undefined);
      values.assistTime && (values.assistTime = undefined);
      values.assistWorker && (values.assistWorker = undefined);
      values.workOrderSource = '1';
      values.incidentDate && (values.incidentDate = moment(values.incidentDate).format(Formats));
      filePath && (values.prePicture = filePath.join(','));
      filePathTwo && (values.proPicture = filePathTwo.join(','));
      infos.workOrderId && (values.workOrderId = infos.workOrderId);
      type == 'ZCZ' && (values.selfDisposal = '1');
      dispatch({
        type: url,
        payload: {
          ...values,
        },
        callback: res => {
          if (res) {
            if (res.retCode == '1') {
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
  // 主办部门选中项变化的回调
  UrbanApartmentSelect = (value, key) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'compmodels/getUserListByOrgIdAndIsExecutive',
      payload: {
        id: value,
      },
      callback: res => {
        if (res) {
          if (res.retCode == 1) {
            let arr = [];
            res.list && (arr = res.list.filter(item => item.leadership == '1'));
            this.setState({ leadership: arr });
          }
        }
      },
    });
  };
  // 复核弹窗回调
  fhUrbanApartmentSelect = (value, key) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'compmodels/getUserListByOrgIdAndIsExecutive',
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
  };
  // 获取网格
  getGrid = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'compmodels/getGrid',
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

  componentDidMount() {
    this.getDetailList();
    this.getUrbanApartment();
    this.getSelect('parentBank');
    this.getSelect('workOrderCategory');
    this.getGrid();
    this.getRightMatter();
    let w = document.getElementsByClassName("anticon-close");
    let d = document.getElementsByClassName("wy666");
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const {
      info,
      dispatchVos,
      partiesType,
      isDetail,
      leaderships,
      title,
      UrbanApartment,
      parentBank,
      workSource,
      previewVisible,
      previewImage,
      fileList,
      leadership,
      ListCourse,
      userRole,
      gridList,
      rightMatterList,
      seePhoptovisible,
      seePhotoSrc,
      unit,
      isManageFlag,
    } = this.state;
    const flag = info.status;
    const iframeSrc = `http://58.213.107.106:60019/dcs_dataShow/pages/datashow/gridQuery.html?${info["ownGridNumber"]}&${info["x"]}&${info["y"]}`;
    const SelectAfter = props => {
      const { index = '' } = props;
      return (
        <Select onChange={val => { this.getUnit(val, `unit${index}`) }} defaultValue={this.state[`unit${index}`] || '1'} style={{ width: 80 }}>
          <Option value="1">小时</Option>
          <Option value="2">天</Option>
        </Select>
      )
    };
    const columns = [
      {
        title: '业务操作',
        dataIndex: 'businessOperationsDec',
        key: 'businessOperationsDec',
      },
      {
        title: '执行部门',
        dataIndex: 'executiveDepartment',
        key: 'executiveDepartment',
      },
      // {
      //   title: '处理结果',
      //   dataIndex: 'additionalRemarks',
      //   key: 'additionalRemarks',
      // },
      {
        title: '操作员',
        dataIndex: 'operator',
        key: 'operator',
      },
      {
        title: '操作时间',
        dataIndex: 'createDate',
        key: 'createDate',
      },
      {
        title: '受理部门',
        dataIndex: 'acceptanceDepartment',
        key: 'acceptanceDepartment',
      },
      {
        title: '图片',
        dataIndex: 'extend1',
        key: 'extend1',
        render: (text, record) => <a onClick={this.seePhopto.bind(this, record)} href="''">{record.photo && "查看"}</a>,
      },
      {
        title: '下载',
        dataIndex: 'download',
        key: 'download',
        render: (text, record) => <a onClick={this.loopDownPhopto.bind(this, record.photo)} href="''">{record.photo && "下载"}</a>,
      },
      {
        title: '处理描述',
        dataIndex: 'processingDescription',
        key: 'processingDescription',
      },
    ];
    getFieldDecorator('keys', { initialValue: dispatchVos });
    const keys = getFieldValue('keys');
    Array.isArray(keys) && keys.forEach((val, index) => {
      getFieldDecorator(`unit[${index}]`, { initialValue: '1' })
    })
    const formItems = keys.map((k, index) => (
      <Row
        hidden={userRole == '4'}
      >
        <Col span={24}>
          <Col span={this.state.info ? (this.state.info.status >= 5 && this.state.info.dispatchVos[0].executor) ? 6 : 6 : 6}>
            <Form.Item
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label="处置时限"
              required={false}
              key={index}
            >
              {getFieldDecorator(`assistTime[${index}]`, {
                initialValue: k.assistTime || '',
                rules: [
                  {
                    required: (sessionStorage.getItem('userRole') == '4' ? false : true) && (!isManageFlag[index]),
                    message: '请输入处置时限',
                  },
                ],
              })(<Input addonAfter={<SelectAfter index={index} />} disabled={(info.dispatchVos && info.dispatchVos[0].isManage == 0 || userRole != 3) && ((flag != 1 && flag != 2) || isManageFlag[index])} />)}
            </Form.Item>
          </Col>
          <Col span={this.state.info ? (this.state.info.status >= 5 && this.state.info.dispatchVos[0].executor) ? 6 : 8 : 8}>
            <Form.Item
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label="处置部门"
              required={false}
              key={index}
            >
              {getFieldDecorator(`assistDepartment[${index}]`, {
                initialValue: Number(k.assistDepartment) || '',
                rules: [
                  {
                    required: sessionStorage.getItem('userRole') == '4' ? false : true,
                    message: '请选择处置部门',
                  },
                ],
              })(
                <Select
                  placeholder="请选择"
                  disabled={flag != 1 && flag != 2}
                  onSelect={this.UrbanApartmentSelect}
                >
                  {UrbanApartment &&
                    UrbanApartment.map(item => {
                      return <Option value={item.id}>{item.orgName}</Option>;
                    })}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col span={this.state.info ? (this.state.info.status >= 5 && this.state.info.dispatchVos[0].executor) ? 6 : 8 : 8}>
            <Form.Item
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label="处置人员"
              required={false}
              key={index}
            >
              {getFieldDecorator(`assistWorker[${index}]`, {
                initialValue: k.assistWorkerDesc || '',
                rules: [
                  {
                    required: sessionStorage.getItem('userRole') == '4' ? false : true,
                    message: '请选择处置人员',
                  },
                ],
              })(
                <Select placeholder="请选择" disabled={flag != 1 && flag != 2}>
                  {leadership &&
                    leadership.map(item => {
                      return <Option value={item.userId}>{item.userName}</Option>;
                    })}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col span={6}
            hidden={this.state.info ? !(this.state.info.status >= 5 && this.state.info.dispatchVos[0].executor) : true}
          >
            <Form.Item label="执行人" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} required={false} key={index}>
              {getFieldDecorator('invalidExecutor', {
                initialValue: k.executorDesc || '',
                rules: [
                  {
                    message: '请选择执行人',
                  },
                ],
              })(
                <Select placeholder="请选择" disabled>
                  {leaderships &&
                    leaderships.map(item => {
                      return <Option value={item.userId}>{item.userName}</Option>;
                    })}
                </Select>
              )}
            </Form.Item>
          </Col>
          {index > 0 && (
            <Col span={1} push={1} style={{ marginTop: 10 }}>
              <a hidden={info.status != 1 && info.status != 2} onClick={() => this.remove(k)}>移除</a>
            </Col>
          )}
          <Col span={24} hidden={(flag != 1 && flag != 2)}>
            <Col span={7}>
              <Form.Item
                labelCol={{ span: 13 }}
                wrapperCol={{ span: 10 }}
                label="由部门负责人设置"
                key={index}
              >
                {getFieldDecorator(`isManage[${index}]`)(
                  <Checkbox onChange={this.isManageChange.bind(this, index)} />
                )}
              </Form.Item>
            </Col>
          </Col>
        </Col>
      </Row>
    ));
    return (
      <div>
        <Breadcrumb separator=">">
          <span id="breadcrumbIcon" />
          <Breadcrumb.Item>工单派发</Breadcrumb.Item>
          <Breadcrumb.Item>部门派发</Breadcrumb.Item>
          <Breadcrumb.Item>综合执法</Breadcrumb.Item>
          <Breadcrumb.Item>处理</Breadcrumb.Item>
        </Breadcrumb>
        <Row
          style={{
            marginLeft: 20,
            padding: 20,
          }}
          id="listTitleDetailBanner"
        >
          <Col span={24}>
            <h3>
              <span>工单编号 ：{info.workOrderId}</span>
              <span style={{ margin: '0 0 0 16px' }}>状态 ：{info.statusDesc}</span>
            </h3>
          </Col>
          <Col span={24}>
            <Col span={3}>
              <Button
                type="primary"
                onClick={() => {
                  history.back(-1);
                }}
              >
                <Icon type="caret-left" />
                返回
              </Button>
            </Col>
            {this.buttons(info.status, userRole, info.isCheck, (info.dispatchVos && info.dispatchVos[0] ? info.dispatchVos[0].isReview : ''), info.isReview, info.createRole)}
          </Col>
        </Row>
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
          <Tabs defaultActiveKey="1">
            <TabPane tab="处置" key="1">
              <Form>
                <Row>
                  <Col span={15}>
                    <Col span={24}>
                      <h4 style={{ fontWeight: 700, borderBottom: '1px dashed #000' }}>综合执法</h4>
                    </Col>
                    <Col span={24}>
                      <Col span={7} className="wy666">
                        <FormItem
                          label="所属社区"
                          labelCol={{ span: 11 }}
                          wrapperCol={{ span: 13 }}
                        >
                          {getFieldDecorator('ownCommunity', {
                            initialValue: info.ownCommunity || '',
                            rules: [
                              {
                                required: true,
                                message: '请选择所属社区',
                              },
                            ],
                          })(
                            <Select placeholder="请选择" disabled={flag != 1 && flag != 2}>
                              {parentBank &&
                                parentBank.map(item => {
                                  return (
                                    <Option value={item.code}>
                                      {item.desp == '总行' ? '' : item.desp}
                                    </Option>
                                  );
                                })}
                            </Select>
                          )}
                        </FormItem>
                      </Col>
                      <Col span={10} className="wy666">
                        <FormItem label="所属网格" labelCol={{ span: 7 }} wrapperCol={{ span: 15 }}>
                          {getFieldDecorator('ownGridNumber', {
                            initialValue: info.ownGridNumber || '',
                            rules: [
                              {
                                required: true,
                                message: '请选择所属网格',
                              },
                            ],
                          })(
                            <Select
                              placeholder="请选择"
                              disabled={flag != 1 && flag != 2}
                              showSearch
                              filterOption={(input, option) =>
                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
                                0
                              }
                            >
                              {gridList &&
                                gridList.map(item => {
                                  return <Option value={item.id}>{item.name}</Option>;
                                })}
                            </Select>
                          )}
                        </FormItem>
                      </Col>
                      <Col span={7}>
                        <FormItem label="工单类别" labelCol={{ span: 9 }} wrapperCol={{ span: 15 }}>
                          {getFieldDecorator('workOrderType', {
                            initialValue: String(info.workOrderType) || '',
                            rules: [
                              {
                                required: true,
                                message: '请选择工单类别',
                              },
                            ],
                          })(
                            <Select placeholder="请选择" disabled={flag != 1 && flag != 2}>
                              {workSource &&
                                workSource.map(item => {
                                  return (
                                    <Option value={item.code}>
                                      {item.desp == '总行' ? '' : item.desp}
                                    </Option>
                                  );
                                })}
                            </Select>
                          )}
                        </FormItem>
                      </Col>
                    </Col>
                    <Col span={24}>
                      <Col span={8}>
                        <FormItem label="所在位置" labelCol={{ span: 9 }} wrapperCol={{ span: 15 }}>
                          <a
                            onClick={this.showMap}
                            disabled={iframeSrc == ''}
                            href="javascriput:;"
                          >查看</a>
                        </FormItem>
                      </Col>
                      <Col span={16}>
                        <FormItem label="详细位置" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                          {getFieldDecorator('detailedLocation', {
                            initialValue: info.detailedLocation || '',
                          })(<Input disabled={flag != 1 && flag != 2} />)}
                        </FormItem>
                      </Col>
                    </Col>
                    <Col span={24}>
                      <Col span={8}>
                        <FormItem
                          label="当事人类型"
                          labelCol={{ span: 12 }}
                          wrapperCol={{ span: 12 }}
                        >
                          {getFieldDecorator('partiesType', {
                            initialValue: '1',
                            rules: [
                              {
                                required: true,
                                message: '请选择案件小类',
                              },
                            ],
                          })(
                            <Select onSelect={this.onSelects} disabled={flag != 1 && flag != 2}>
                              <Option value="1">个人</Option>
                              <Option value="2">企业</Option>
                            </Select>
                          )}
                        </FormItem>
                      </Col>
                      <Col span={8}>
                        <FormItem
                          label={partiesType == 1 ? '当事人姓名' : '涉事企业名'}
                          labelCol={{ span: 12 }}
                          wrapperCol={{ span: 12 }}
                        >
                          {getFieldDecorator(
                            `${partiesType == 1 ? 'partiesUsername' : 'enterprisesName'}`,
                            {
                              initialValue: info.partiesUsername || info.enterprisesName || '',
                              rules: [
                                {
                                  required: true,
                                  message: '请填写当事人姓名!',
                                },
                              ],
                            }
                          )(<Input disabled={flag != 1 && flag != 2} />)}
                        </FormItem>
                      </Col>
                      <Col span={8}>
                        <FormItem
                          label={partiesType == 1 ? '证件号码' : '机构代码'}
                          labelCol={{ span: 9 }}
                          wrapperCol={{ span: 15 }}
                        >
                          {getFieldDecorator(
                            `${partiesType == 1 ? 'identificationNum' : 'institutionalCode'}`,
                            {
                              initialValue: info.identificationNum || info.institutionalCode || '',
                            }
                          )(<Input disabled={flag != 1 && flag != 2} />)}
                        </FormItem>
                      </Col>
                    </Col>
                    <Col span={24}>
                      <Col span={12}>
                        <FormItem label="事发时间" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                          {getFieldDecorator('incidentDate', {
                            initialValue: moment(info.incidentDate) || "",
                            rules: [
                              {
                                required: true,
                                message: '请选择事发时间!',
                              },
                            ],
                          })(
                            <DatePicker
                              format="YYYY-MM-DD HH:mm:ss"
                              allowClear
                              showTime
                              disabled={flag != 1 && flag != 2}
                            />
                          )}
                        </FormItem>
                      </Col>
                      <Col span={12}>
                        <FormItem label="权力编码" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                          {getFieldDecorator('powerCoding', {
                            initialValue: info.powerCoding || '',
                            rules: [
                              {
                                required: true,
                                message: '请填写权力编码!',
                              },
                            ],
                          })(<Select showSearch disabled={flag != 1 && flag != 2} >
                            {rightMatterList && rightMatterList.map((item, index) =>
                              <Option value={item.powerCode} key={index}>{item.powerCode}</Option>
                            )}
                          </Select>)}
                        </FormItem>
                      </Col>
                    </Col>
                    <Col span={24}>
                      <Col span={12}>
                        <FormItem label="案件地址" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                          {getFieldDecorator('caseAddress', {
                            initialValue: info.caseAddress || '',
                            rules: [
                              {
                                required: true,
                                message: '请填写案件地址!',
                              },
                            ],
                          })(<Input disabled={flag != 1 && flag != 2} />)}
                        </FormItem>
                      </Col>
                      <Col span={12}>
                        <FormItem label="案件描述" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                          {getFieldDecorator('caseDescribe', {
                            initialValue: info.caseDescribe || '',
                            rules: [
                              {
                                required: true,
                                message: '请填写案件描述!',
                              },
                            ],
                          })(<TextArea disabled={flag != 1 && flag != 2} />)}
                        </FormItem>
                      </Col>
                    </Col>
                    <Col span={24}>
                      {formItems}
                      <Form.Item labelCol={{ span: 7 }} wrapperCol={{ span: 17 }}>
                        <Button
                          type="dashed"
                          onClick={this.add}
                          style={{ width: '45%' }}
                          hidden={
                            // sessionStorage.getItem('userRole') == '4'
                            //   ? isDetail == 'detail' && (info.status == '1' || info.status != '1')
                            //   : (sessionStorage.getItem('userRole') != '2' ||
                            //     sessionStorage.getItem('userRole') == '2') &&
                            //   info.status != '2'
                            sessionStorage.getItem('userRole') == '2' ? (info.status != 1 && info.status != 2) : true
                          }
                        >
                          <Icon type="plus" />
                          增加处置部门
                        </Button>
                      </Form.Item>
                    </Col>
                    <Row gutter={{ xl: 10, xxl: 36 }} hidden={info.isCheck == 0 || userRole != 2}>
                      <h3 style={{ marginLeft: 8, fontWeight: 700 }}>复核过程
                        <Divider style={{ margin: '12px 0 8px 0' }} dashed />
                      </h3>
                      <Col span={24}>
                        <Col span={7}>
                          <FormItem label="复核时限" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} >
                            {getFieldDecorator("fhassistTime", {
                              initialValue: info.assistTime || "",
                            })(
                              <Input addonAfter={<SelectAfter />} disabled={flag != 1 && flag != 2} />
                            )}
                          </FormItem>
                        </Col>
                        <Col span={8}>
                          <FormItem label="复核部门" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                            {getFieldDecorator(`fhorganizeDepartment`, {
                              initialValue: Number(info.assistDepartment) || '',
                            })(
                              <Select
                                placeholder="请选择"
                                disabled={flag != 1 && flag != 2}
                                onSelect={this.UrbanApartmentSelect}
                              >
                                {UrbanApartment &&
                                  UrbanApartment.map(item => {
                                    return <Option value={item.id}>{item.orgName}</Option>;
                                  })}
                              </Select>
                            )}
                          </FormItem>
                        </Col>
                        <Col span={8}>
                          <FormItem label="复核人员" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                            {getFieldDecorator(`fhexecutor`, {
                              initialValue: info.executorDesc || "",
                            })(
                              <Select placeholder="请选择" disabled={flag != 1 && flag != 2}>
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

                  </Col>
                  <Col span={9} style={{ padding: 10 }}>
                    <h4
                      style={{ fontWeight: 700, borderBottom: '1px dashed #000', marginLeft: 15 }}
                    >
                      附件清单
                    </h4>
                    <Col span={11}>{this.renderAttachment()}</Col>
                    <Col span={11} push={1}>
                      {this.renderAttachmentTwo()}
                    </Col>
                  </Col>
                </Row>
              </Form>
            </TabPane>
            <TabPane tab="工作过程" key="2">
              <Row>
                <Col span={24}>
                  <h4 style={{ fontWeight: 700, borderBottom: '1px dashed #000' }}>工作过程</h4>
                </Col>
                <Col span={24}>
                  <Table columns={columns} dataSource={ListCourse} />
                </Col>
              </Row>
            </TabPane>
          </Tabs>
        </div>
        <Modal
          title="安排"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form>
            <Row>
              <Col span={24}>
                <FormItem label="执行人" labelCol={{ span: 4 }} wrapperCol={{ span: 17 }}>
                  {getFieldDecorator('executor')(
                    <Select placeholder="请选择">
                      {leaderships &&
                        leaderships.map(item => {
                          return <Option value={item.userId}>{item.userName}</Option>;
                        })}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={24}>
                <FormItem label="安排意见" labelCol={{ span: 4 }} wrapperCol={{ span: 17 }}>
                  {getFieldDecorator('arrangeOpinions')(<TextArea />)}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
        <Modal
          title={title}
          visible={this.state.auditOpinionsvisible}
          onOk={this.handleOk.bind(null, 'TGBH')}
          onCancel={this.handleCancel}
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
          onCancel={this.handleCancel}
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
          onCancel={this.handleCancel}
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
          title="查看地图"
          visible={this.state.mapBox}
          footer={null}
          onCancel={this.handleCancel}
        >
          <iframe
            width="100%"
            height="400"
            scrolling="no"
            frameBorder="0"
            src={iframeSrc}
            marginHeight="0"
            marginWidth="0"
          ></iframe>
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
                    {getFieldDecorator("fhassistTime", {
                      initialValue: "",
                    })(
                      <Input
                        placeholder="请输入"
                        addonAfter={<SelectAfter />}
                        style={{ marginTop: 4 }}
                      />
                    )}
                  </FormItem>
                </Col>
              </Col>
              <Col span={24}>
                <Col span={18} push={3}>
                  <FormItem label="复核部门" >
                    {getFieldDecorator(`fhassistDepartment`, {
                      initialValue: "请选择",
                    }
                    )(
                      <Select
                        placeholder="请选择"
                        onSelect={this.fhUrbanApartmentSelect}
                      >
                        {UrbanApartment &&
                          UrbanApartment.map(item => {
                            return <Option value={item.id}>{item.orgName}</Option>;
                          })}
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Col>
              <Col span={24}>
                <Col span={18} push={3}>
                  <FormItem label="复核人员" >
                    {getFieldDecorator(`fhexecutor`, {
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
          destroyOnClose={true}
        >
          <Form>
            <Row>
              <Col span={24}>
                <Col span={12}>
                  <FormItem label="处置时限" labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} >
                    {getFieldDecorator("sqyqassistTime", {
                      rules: [{
                        required: info.status == "5" ? true : false,
                        message: "请填写处置时限!",
                      }],
                      initialValue: (info.dispatchVos && info.dispatchVos[0]) ? info.dispatchVos[0].assistTime : "",
                    })(
                      <Input
                        placeholder="请输入"
                        addonAfter={<SelectAfter />}
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
                        addonAfter={<SelectAfter />}
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
                  <FormItem label="处置时限" labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} >
                    {getFieldDecorator("yqassistTime", {
                      initialValue: info.postponementVos ? info.postponementVos[0].assistTime : "",
                    })(
                      <Input
                        placeholder="请输入"
                        addonAfter={<SelectAfter />}
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
                        addonAfter={<SelectAfter />}
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
          hidden
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
              <img alt="example" style={{ width: '100%' }} src={picIp + item.filePath} >
              </img>
            )}
          </Carousel>
          <Icon onClick={this.prevImg} style={{ width: 32, height: 52, lineHeight: "52px", fontSize: 18, position: "absolute", top: "46%", left: 0 }} type="left" />
          <Icon onClick={this.nextImg} style={{ width: 32, height: 52, lineHeight: "52px", fontSize: 18, position: "absolute", top: "46%", right: 0 }} type="right" />
        </Modal>
      </div >
    );
  }
}

const Detail = Form.create()(app);
export default Detail;
