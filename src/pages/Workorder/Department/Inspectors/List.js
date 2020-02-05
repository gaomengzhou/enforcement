/* eslint-disable no-unused-expressions */
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
import { connect } from 'dva';
import styles from './Detail.less';
import Header from './Header.js';
import Bodylist from './Bodylist.js';


import DetailCommon11 from './DetailCommon11';
import DetailCourse22 from './DetailCourse22';
import DetailInformation33 from './DetailInformation33';
import DetailDispose44 from './DetailDispose44';
import DetailSecond55 from './DetailSecond55';
import DetailInspect66 from './DetailInspect66';
import DetailDelay77 from './DetailDelay77';

import DetailInformation12 from './c12';
import { picIp } from '@/utils/ipConfig';

const Formats = 'YYYY-MM-DD HH:mm:ss';
const {TabPane} = Tabs;
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

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

@connect(({ Inspectorsmodels, loading }) => ({
  Inspectorsmodels,
  loading: loading.models.Inspectorsmodels,
}))
class app extends Component {
  constructor(props) {
    super(props);
    this.state = {
      workSource: [], // 工单来源
      eventCategory: [], // 案件类型
      caseSmallType: [], // 案件小类
      DepartmentAssign: [], // 部门派发状态
      parentId: '1101', // 案件大类的parentId用于更新案件小类的下拉框数据
      page: 1,
      pageSize: 10,
      totalNumber: 10,
      userRole: sessionStorage.getItem('userRole'), // 身份Code
      dataSources: [], // 列表数据
      value: '3', // 单选框的值 已处理&&待处理&&全部
      UrbanApartment: [], // 主办部门
      fivefivevisible: false, // 左边弹窗抽屉
      sixsixsixvisible: false, // 右边弹窗抽屉



      workSatisfaction: [], // 满意度
      feedbackResults: [], // 反馈结果
      dataSource: {}, // 列表数据(常用，案件信息)
      totalNumber: '',
      dataSourceSecond: [], // 列表数据(二级处置)
      dataSourceDispose: [], // 列表数据(任务处置)
      dataSourceCourse: [], // 列表数据(工作过程)
      uploading: false, // 附件
      fileList: [],
      previewVisible: false,
      previewImage: '',
      fileArr: [],
      filePath: '',
      fileListTwo: [],
      fileArrTwo: [],
      gridList: [], // 所属网格
      filePathTwo: '',
      leadership: [], // 处置人员
      parentBank: [], // 所属分行
      processProgram: [], // 处理程序
      parentIds: '', // 案件大类的parentId用于更新案件小类的下拉框数据
      workLevel: [], // 问题级别
      workDestructionDegree: [], // 破坏程度
      workImpactScope: [], // 影响范围
      flag: false, // 领导身份进来 显示还是隐藏安排按钮
      visible: false, // 安排按钮弹窗
      leaderships: [], // 安排弹窗的执行人
      examine: '', // 是否审核中
      auditOpinionsvisible: false, // 审核通过&审核驳回
      closingCasevisible: false, // 确认结案
      executorHandlevisible: false, // 申请结案
      title: '',
      detelevisible: false, // 删除
      WasteCasevisible: false, // 废案
      mapBox: false, // 地图弹窗
      iframeSrc: "", // 地图地址
      reCheckvisible: false, // 复核弹窗
      applicationExtension: false, // 申请延期弹窗
      deferredAuditvisible: false, // 延期审核弹窗
      goBackvisible: false, // 退回弹窗
      unit: "1", // 处置时限--小时，天
      seePhoptovisible: false, // 工作过程图片查看
      seePhotoSrc: "", // 工作过程图片地址
      smallType: "", // 获取大类id让小类回显
      tabKey: '1',
      newgridList: [], // 网格
      seePhotoList: [], // 图片轮播
      results: [], // 审批结果
      closingType: [], // 结案类型
      satisfaction: [], // 结案满意度
    };
  }

  // 保存
  increase = form => {
    const { validateFields } = form;
    const { dispatch } = this.props;
    const { dataSource, filePath, filePathTwo } = this.state;
    const url = 'Inspectorsmodels/save';
    validateFields((error, values) => {
      if (error) {
        return;
      }
      values.reportTime && (values.reportTime = moment(values.reportTime).format(Formats));
      values.keys && (values.keys = undefined);
      const dispatchVos = [];
      dataSource.workOrderId && (values.workOrderId = dataSource.workOrderId);
      if (values.assistDepartment) {
        for (let i = 0; i < values.assistDepartment.length; i++) {
          const json = {
            assistDepartment: values.assistDepartment[i],
            assistTime: values.assistTime[i],
            executor: values.assistWorker[i],
            unit: this.state.unit,
          };
          dispatchVos.push(json);
        }
      }
      values.dispatchVos = dispatchVos;
      values.assistDepartment && (values.assistDepartment = undefined);
      values.assistTime && (values.assistTime = undefined);
      values.assistWorker && (values.assistWorker = undefined);
      values.workOrderSource = '1';
      values.dispatchTime = moment(new Date()).format(Formats);
      values.reportTime = moment(new Date()).format(Formats);
      filePath && (values.prePicture = filePath.join(','));
      filePathTwo && (values.proPicture = filePathTwo.join(','));
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

  // 派单
  systemDispatch = () => {
    const { dispatch, form } = this.props;
    const { validateFields } = form;
    // prePicture,
    const { dataSource, filePath } = this.state;
    const url = 'Inspectorsmodels/systemDispatch';
    validateFields((error, values) => {
      if (error) {
        return;
      }
      values.reportTime && (values.reportTime = moment(values.reportTime).format(Formats));
      values.keys && (values.keys = undefined);
      const dispatchVos = [];
      dataSource.workOrderId && (values.workOrderId = dataSource.workOrderId);
      if (values.assistDepartment) {
        for (let i = 0; i < values.assistDepartment.length; i++) {
          const json = {
            assistDepartment: values.assistDepartment[i],
            assistTime: values.assistTime[i],
            executor: values.assistWorker[i],
            unit: this.state.unit,
          };
          dispatchVos.push(json);
        }
      }
      values.dispatchVos = dispatchVos;
      values.assistDepartment && (values.assistDepartment = undefined);
      values.assistTime && (values.assistTime = undefined);
      values.assistWorker && (values.assistWorker = undefined);
      values.workOrderSource = '1';
      values.dispatchTime = moment(new Date()).format(Formats);
      values.reportTime = moment(new Date()).format(Formats);
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

  // 上报
  report = () => {
    const { validateFields } = this.props.form;
    validateFields((error, values) => {
      const { dispatch } = this.props;
      if (error) {
        return;
      }
      values.reportTime && (values.reportTime = moment(values.reportTime).format(Formats));
      values.keys && (values.keys = undefined);
      const dispatchVos = [];
      if (values.assistDepartment) {
        for (let i = 0; i < values.assistDepartment.length; i++) {
          const json = {
            assistDepartment: values.assistDepartment[i],
            assistTime: values.assistTime[i],
            assistWorker: values.assistWorker[i],
            unit: this.state.unit,
          };
          dispatchVos.push(json);
        }
      }
      values.dispatchVos = dispatchVos;
      values.assistDepartment && (values.assistDepartment = undefined);
      values.assistTime && (values.assistTime = undefined);
      values.assistWorker && (values.assistWorker = undefined);
      values.workOrderSource = '1';
      values.dispatchTime = moment(new Date()).format(Formats);
      values.reportTime = moment(new Date()).format(Formats);
      values.deadline && (values.deadline = moment(values.deadline).format(Formats));
      dispatch({
        type: 'Inspectorsmodels/reportedData',
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

  // 自处置
  self = () => {
    const { validateFields } = this.props.form;
    validateFields((error, values) => {
      const { dispatch } = this.props;
      if (error) {
        return;
      }
      values.reportTime && (values.reportTime = moment(values.reportTime).format(Formats));
      values.keys && (values.keys = undefined);
      const dispatchVos = [];
      if (values.assistDepartment) {
        for (let i = 0; i < values.assistDepartment.length; i++) {
          const json = {
            assistDepartment: values.assistDepartment[i],
            assistTime: values.assistTime[i],
            assistWorker: values.assistWorker[i],
            unit: this.state.unit,
          };
          dispatchVos.push(json);
        }
      }
      values.dispatchVos = dispatchVos;
      values.assistDepartment && (values.assistDepartment = undefined);
      values.assistTime && (values.assistTime = undefined);
      values.assistWorker && (values.assistWorker = undefined);
      values.workOrderSource = '1';
      values.dispatchTime = moment(new Date()).format(Formats);
      values.reportTime = moment(new Date()).format(Formats);
      values.deadline && (values.deadline = moment(values.deadline).format(Formats));
      values.selfDisposal = '1';
      dispatch({
        type: 'Inspectorsmodels/self',
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

  onTabClick = (val) => {
    this.setState({
      tabKey: val
    })
  }

  // 社区，网格联动
  communityGrid = (value, key) => {
    // console.log(value && this.state.gridList[1].name.indexOf(key.key), key.key)
    const newgridList = this.state.gridList.filter(item => item.name.indexOf(key.key) != -1);
    this.setState({
      newgridList,
    })
  }

  // 事件部件
  bigClass = e => {
    if (e == 1) {
      this.getSelect('eventCategory');
    } else {
      this.getSelect('partsCategory');
    }
  }

  // 案件大类选中项变化的回调
  onSelect = (value, key) => {
    const { eventCategory } = this.state;
    if (value) {
      this.setState(
        { parentIds: eventCategory.filter(item => item.code == value)[0].parentId },
        () => {
          const { parentIds } = this.state;
          this.getcaseSmallType(parentIds);
        }
      );
    }
  };

  // 获取案件小类
  getcaseSmallType(parentIds) {
    const { dispatch } = this.props;
    dispatch({
      type: 'Inspectorsmodels/getcaseSmallType',
      payload: {
        parentIds,
      },
      callback: res => {
        if (res) {
          this.setState({ caseSmallType: res });
        }
      },
    });
  }

  // 取消删除
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

  // 获取主办部门
  getUrbanApartment = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'Inspectorsmodels/getUrbanApartment',
      payload: {},
      callback: res => {
        if (res) {
          this.setState({ UrbanApartment: res.list });
        }
      },
    });
  };

  // 获取网格 和 地图地址
  getGrid = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'Inspectorsmodels/getGrid',
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

  // 主办部门选中项变化的回调
  UrbanApartmentSelect = (value, key) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'Inspectorsmodels/getUserListByOrgIdAndIsExecutive',
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
          type: 'Inspectorsmodels/downPhoto',
          payload: {
            producer: 'AttachmentDownload',
            id: item,
          }
        })
      })
    }
  }

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
          const { dataSource } = this.state;
          const { dispatch } = this.props;
          dispatch({
            type: 'Inspectorsmodels/getUserListByOrgIdAndIsExecutive',
            payload: {
              id: dataSource.dispatchVos[0].assistDepartment,
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
    const { dataSource, title, filePathTwo } = this.state;
    const values = getFieldsValue();
    const obj = dataSource.dispatchVos[0];
    const infos = dataSource;
    values.executor && (obj.executor = values.executor);
    values.arrangeOpinions && (obj.arrangeOpinions = values.arrangeOpinions);
    values.auditOpinions && (obj.auditOpinions = values.auditOpinions);
    values.closureExplain && (infos.closureExplain = values.closureExplain);
    values.closingEvaluation && (infos.closingEvaluation = values.closingEvaluation);
    if (title == '审核通过') {
      obj.examine = '3';
    }
    if (title == '审核驳回') {
      obj.examine = '4';
    }
    if (type == 'TGBH') {
      dispatch({
        type: 'Inspectorsmodels/manageExamine',
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
      values.closingEvaluation && (dataSource.closingEvaluation = values.closingEvaluation);
      dispatch({
        type: 'Inspectorsmodels/closingCase',
        payload: {
          ...dataSource,
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
      values.processingDescription && (dataSource.processingDescription = values.processingDescription);
      dispatch({
        type: 'Inspectorsmodels/executorHandle',
        payload: {
          ...dataSource,
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

      const id = dataSource.workOrderId;
      this.props.dispatch({
        type: "Inspectorsmodels/deteles",
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
              location.reload();
            } else {
              message.error(res.retMsg);
            }
          }
        }
      })
    } else if (type == "FH") {
      const reCheckObj = {};
      values.fhexecutor && (reCheckObj.executor = values.fhexecutor);
      values.fhassistDepartment && (reCheckObj.assistDepartment = values.fhassistDepartment);
      values.fhassistTime && (reCheckObj.assistTime = values.fhassistTime);
      values && (reCheckObj.unit = this.state.unit);
      values && (reCheckObj.workOrderId = window.location.href.split('/')[window.location.href.split('/').length - 2]);
      values && (reCheckObj.workOrderType = 1);
      dispatch({
        type: "Inspectorsmodels/reCheck",
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
      const delayObj = {};
      values.applicationNote && (delayObj.applicationNote = values.applicationNote);
      values.delayDate && (delayObj.delayDate = values.delayDate);
      values.sqyqassistTime && (delayObj.assistTime = values.sqyqassistTime);
      infos && (delayObj.isCheck = infos.isCheck);
      values && (delayObj.orderId = window.location.href.split('/')[window.location.href.split('/').length - 2]);
      values && (delayObj.workOrderType = 1);
      values && (delayObj.unit = this.state.unit);
      dispatch({
        type: "Inspectorsmodels/application",
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
    } else if (type == "YQSHY") {
      values.approvalResults && (infos.approvalResults = values.approvalResults);
      dispatch({
        type: "Inspectorsmodels/deferredAudit",
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
    } else if (type == "YQSHN") {
      values.approvalResults && (infos.approvalResults = values.approvalResults);
      infos && (infos.isReview && (infos.isReview = 0))
      dispatch({
        type: "Inspectorsmodels/deferredAudit",
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
        type: "Inspectorsmodels/goBackS",
        payload: {
          workOrderId: infos.workOrderId,
          workOrderType: 1,
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
    } else {
      dispatch({
        type: 'Inspectorsmodels/manageArrange',
        payload: {
          ...obj,
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
    }
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

  // 轮播图，上一张下一张
  prevImg = e => {
    this.refs.carouselImg.prev();
  }

  nextImg = e => {
    this.refs.carouselImg.next();
  }

  buttons = (status, userRole, isCheck, startIsReview, endIsReview, createRole, isReturn, info) => {
    if (userRole == '2' && status == '2') {
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
          <Button
            style={{ marginRight: 10, border: "#2B49C4 1px solid", color: "#2B49C4" }}
            onClick={this.showModal.bind(null, 'GoBack')}
            hidden={createRole != "4"}
          >
            退回
          </Button>
          <Button style={{ marginRight: 10, border: "#2B49C4 1px solid", color: "#2B49C4" }} onClick={this.showModal.bind(null, 'FeiA')}>
            废案
          </Button>
          <Button style={{ marginRight: 10 }} type="primary" hidden>
            导出
          </Button>
          <Button style={{ marginRight: 10 }} onClick={this.showModal.bind(null, 'DEL')} type="primary">
            删除
          </Button>
        </Col>
      );
    }
    // 信息中心待处置
    if (userRole == '2' && status == '3') {
      return (
        <Col span={21}>
          <Button style={{ marginRight: 10, border: "#2B49C4 1px solid", color: "#2B49C4" }} onClick={this.showModal.bind(null, 'GoBack')}>
            退回
          </Button>
        </Col>
      );
    }
    if (userRole == '2' && status == '5') {
      return (
        <Col span={21}>
          <Button
            style={{ marginRight: 10, border: "#2B49C4 1px solid", color: "#2B49C4" }}
            onClick={this.showModal.bind(null, 'YQSH')}
            hidden={endIsReview == 0}
          >
            延期审核
          </Button>
          <Button
            style={{ marginRight: 10, border: "#2B49C4 1px solid", color: "#2B49C4" }}
            onClick={this.showModal.bind(null, 'FeiA')}
          >
            废案
          </Button>
        </Col>
      );
    }
    if (userRole == '2' && status == '9' && isCheck == "1") {
      return (
        <Col span={21}>
          <Button type="primary" onClick={this.showModal.bind(null, 'JA')}>
            确认结案
          </Button>
          <Button style={{ marginRight: 10, border: "#2B49C4 1px solid", color: "#2B49C4" }} onClick={this.showModal.bind(null, 'GoBack')}>
            退回
          </Button>
          <Button
            style={{ marginRight: 10, border: "#2B49C4 1px solid", color: "#2B49C4" }}
            onClick={this.showModal.bind(null, 'FeiA')}
          >
            废案
          </Button>
        </Col>
      );
    }
    if (userRole == '2' && status == '9' && isCheck == "0") {
      return (
        <Col span={21}>
          <Button style={{ marginRight: 10 }} onClick={this.showModal.bind(null, 'FH')} type="primary">
            复核
          </Button>
          <Button type="primary" onClick={this.showModal.bind(null, 'JA')}>
            确认结案
          </Button>
          <Button style={{ marginRight: 10, border: "#2B49C4 1px solid", color: "#2B49C4" }} onClick={this.showModal.bind(null, 'GoBack')}>
            退回
          </Button>
          <Button
            style={{ marginRight: 10, border: "#2B49C4 1px solid", color: "#2B49C4" }}
            onClick={this.showModal.bind(null, 'FeiA')}
          >
            废案
          </Button>
        </Col>
      );
    }
    if (userRole == '4' && status == '1') {
      return (
        <Col span={21}>
          <Button type="primary" onClick={this.increase.bind(this, this.props.form)}>
            保存
          </Button>
          <Button
            type="primary"
            hidden={info.selfDisposal == 1}
            onClick={this.report.bind(this, this.props.form)}
          >
            上报
          </Button>
          <Button type="primary" hidden={info.selfDisposal == 0} onClick={this.self.bind(this, this.props.form)}>
            自处置
          </Button>
        </Col>
      );
    }
    if (userRole == '4' && status == '5') {
      return (
        <Col span={21}>
          <Button
            style={{ marginRight: 10, border: "#2B49C4 1px solid", color: "#2B49C4" }}
            hidden={info.isReview == 1}
            onClick={this.showModal.bind(null, 'SQJA')}
          >
            申请结案
          </Button>
          <Button
            style={{ marginRight: 10, border: "#2B49C4 1px solid", color: "#2B49C4" }}
            onClick={this.showModal.bind(null, 'SQYQ')}
            // hidden={startIsReview == 1 || info.isApplicationClosure == 1}
            hidden={info.isReview == 1 || info.isApplicationClosure == 1}
          >
            申请延期
          </Button>
          <Button
            hidden={info.isApplicationClosure == 1 || info.isReview == 1}
            onClick={this.showModal.bind(null, 'GoBack')}
            style={{ marginRight: 10, border: "#2B49C4 1px solid", color: "#2B49C4" }}
          >
            退回
          </Button>
        </Col>
      );
    }
  };

  // 查看地图
  showMap = v => {
    this.setState({
      mapBox: true,
    });
  };

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
      type: 'Inspectorsmodels/getGroupCode',
      payload: { groupCode },
      callback: res => {
        if (res) {
          groupCode == 'workSource' && this.setState({ workSource: res });
          // groupCode == 'eventCategory' && this.setState({ eventCategory: res });
          groupCode == 'workLevel' && this.setState({ workLevel: res });
          groupCode == 'workDestructionDegree' && this.setState({ workDestructionDegree: res });
          groupCode == 'workImpactScope' && this.setState({ workImpactScope: res });
          groupCode == 'DepartmentAssign' && this.setState({ DepartmentAssign: res });



          groupCode == 'workSatisfaction' && this.setState({ workSatisfaction: res });
          groupCode == 'feedbackResults' && this.setState({ feedbackResults: res });
          groupCode == 'parentBank' && this.setState({ parentBank: res });
          groupCode == 'processProgram' && this.setState({ processProgram: res });
          groupCode == 'eventCategory' && this.setState({ eventCategory: res.filter(item => item.code % 100 == 0) });
          groupCode == 'partsCategory' && this.setState({ eventCategory: res.filter(item => item.code % 100 == 0) });
          groupCode == 'results' && this.setState({ results: res });
          groupCode == 'closingType' && this.setState({ closingType: res });
          groupCode == 'satisfaction' && this.setState({ satisfaction: res });
        }
      },
    });
  }

  // 获取列表数据
  getList(obj) {
    const { dispatch } = this.props;
    const { page, pageSize, userRole } = this.state;
    const role = sessionStorage.getItem('userRole');
    if (role == 2) {
      obj.status_S_NE = 1;
    }
    dispatch({
      type: 'Inspectorsmodels/getList',
      payload: {
        page,
        pageSize,
        id: role,
        obj,
      },
      callback: res => {
        if (res) {
          if (res.retCode == 1) {
            this.setState({ dataSources: res.list, totalNumber: res.length });
          }
        }
      },
    });
  }

  // 获取案件小类
  getcaseSmallType(parentId) {
    const { dispatch } = this.props;
    dispatch({
      type: 'Inspectorsmodels/getcaseSmallType',
      payload: {
        parentId,
      },
      callback: res => {
        if (res) {
          this.setState({ caseSmallType: res });
        }
      },
    });
  }

  // 案件大类选中项变化的回调
  onSelect = (value, key) => {
    const { eventCategory } = this.state;
    if (value) {
      this.setState(
        { parentId: eventCategory.filter(item => item.code == value)[0].parentId },
        () => {
          const { parentId } = this.state;
          this.getcaseSmallType(parentId);
        }
      );
    }
  };

  // 查询
  Search = form => {
    const { getFieldsValue } = form;
    const values = getFieldsValue();
    if (values.createDate) {
      values.createDate_D_GE = moment(values.createDate).format('YYYY-MM-DD 00:00:00');
      values.createDate_D_LE = moment(values.createDate).format('YYYY-MM-DD 23:59:59');
      values.createDate = '';
    }
    if (values.createDate == null) {
      values.createDate = '';
    }
    this.setState({ page: 1, value: "3" }, () => {
      this.getList(values);
    });
    // this.getList(values);
  };

  // 重置
  reset = form => {
    const { resetFields } = form;
    resetFields();
  };


  // 待处理& 已处理 & 全部
  onChange = e => {
    const { dispatch } = this.props;
    const { page, pageSize, userRole } = this.state;
    // 待处理
    if (e.target.value == '1') {
      if (userRole == '2') {
        const obj = {};
        obj.status_S_NE = "1";
        obj.status_S_IN = "2,3,9,5";
        dispatch({
          type: 'Inspectorsmodels/getList',
          payload: {
            page: "1",
            pageSize,
            id: userRole,
            obj,
          },
          callback: res => {
            console.log(res)
            if (res) {
              if (res.retCode == 1) {
                const w = res.list.filter(item => item.status == '2' || item.status == '3' || item.status == '9' || (item.status == '5' && item.isReview == "1"));
                console.log(w)
                this.setState({
                  dataSource: res.list,
                  totalNumber: res.length,
                  value: e.target.value,
                });
              }
            }
          },
        });
      }
      if (userRole == '3') {
        const obj = {};
        dispatch({
          type: 'Inspectorsmodels/getList',
          payload: {
            page: 1,
            pageSize,
            id: userRole,
            obj,
          },
          callback: res => {
            if (res) {
              if (res.retCode == 1) {
                const w = res.list.filter(item => item.isArrangeDesc == "需安排" || item.isAuditDesc == "需审核");
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
        const obj = {};
        obj.status_S_IN = "1,5";
        dispatch({
          type: 'Inspectorsmodels/getList',
          payload: {
            page: 1,
            pageSize,
            id: userRole,
            obj,
          },
          callback: res => {
            if (res) {
              if (res.retCode == 1) {
                const w = res.list.filter(item => item.status == '1' || (item.status == '5' && item.isReview != "1"));
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
    // 已处理
    if (e.target.value == '2') {
      const obj = {};
      obj.status_S_NE = "1";
      obj.status_S_IN = "4,5,6,7,8";
      if (userRole == '2') {
        dispatch({
          type: 'Inspectorsmodels/getList',
          payload: {
            page: 1,
            pageSize,
            id: userRole,
            obj,
          },
          callback: res => {
            console.log(res)
            if (res) {
              if (res.retCode == 1) {
                const w = res.list.filter(item => (item.status == '5' && item.isReview != "1") || item.status == '4' || item.status == '6' || item.status == '7' || item.status == '8');
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
      if (userRole == '3') {
        const obj = {};
        dispatch({
          type: 'Inspectorsmodels/getList',
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
      if (userRole == '4') {
        const obj = {};
        obj.status_S_IN = "1,5";
        dispatch({
          type: 'Inspectorsmodels/getList',
          payload: {
            page: 1,
            pageSize,
            id: userRole,
            obj,
          },
          callback: res => {
            if (res) {
              if (res.retCode == 1) {
                const w = res.list.filter(item => item.status != '1' || (item.status == '5' && item.isReview == "1"))
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
    // 全部
    if (e.target.value == '3') {
      this.getList({});
      this.setState({ value: "3" });
    }
  };






  // 待处理&已处理&全部
  // onChange = e => {
  //   const { dispatch } = this.props;
  //   const { page, pageSize, userRole } = this.state;
  //   // 待处理
  //   if (e.target.value == '1') {
  //     if (userRole == '2') {
  //       let obj = {};
  //       obj.status_S_NE = "1";
  //       obj.status_S_IN = "2,3,9,5";
  //       dispatch({
  //         type: 'Inspectorsmodels/getList',
  //         payload: {
  //           page: "1",
  //           pageSize,
  //           id: userRole,
  //           obj,
  //         },
  //         callback: res => {
  //           if (res) {
  //             if (res.retCode == 1) {
  //               let w = res.list.filter(item => item.status == '2' || item.status == '3' || item.status == '9' || (item.status == '5' && item.isReview == "1"));
  //               this.setState({
  //                 dataSource: w,
  //                 totalNumber: w.length,
  //                 value: e.target.value,
  //               });
  //             }
  //           }
  //         },
  //       });
  //     }
  //     if (userRole == '3') {
  //       let obj = {};
  //       dispatch({
  //         type: 'Inspectorsmodels/getList',
  //         payload: {
  //           page: 1,
  //           pageSize,
  //           id: userRole,
  //           obj,
  //         },
  //         callback: res => {
  //           if (res) {
  //             if (res.retCode == 1) {
  //               let w = res.list.filter(item => item.isArrangeDesc == "需安排" || item.isAuditDesc == "需审核");
  //               this.setState({
  //                 dataSource: w,
  //                 totalNumber: w.length,
  //                 value: e.target.value,
  //               });
  //             }
  //           }
  //         },
  //       });
  //     }
  //     if (userRole == '4') {
  //       let obj = {};
  //       obj.status_S_IN = "1,5";
  //       dispatch({
  //         type: 'Inspectorsmodels/getList',
  //         payload: {
  //           page: 1,
  //           pageSize,
  //           id: userRole,
  //           obj,
  //         },
  //         callback: res => {
  //           if (res) {
  //             if (res.retCode == 1) {
  //               let w = res.list.filter(item => item.status == '1' || (item.status == '5' && item.isReview != "1"));
  //               this.setState({
  //                 dataSource: w,
  //                 totalNumber: w.length,
  //                 value: e.target.value,
  //               });
  //             }
  //           }
  //         },
  //       });
  //     }
  //   }
  //   //已处理
  //   if (e.target.value == '2') {
  //     let obj = {};
  //     obj.status_S_NE = "1";
  //     obj.status_S_IN = "4,5,6,7,8";
  //     if (userRole == '2') {
  //       dispatch({
  //         type: 'Inspectorsmodels/getList',
  //         payload: {
  //           page: 1,
  //           pageSize,
  //           id: userRole,
  //           obj,
  //         },
  //         callback: res => {
  //           if (res) {
  //             if (res.retCode == 1) {
  //               let w = res.list.filter(item => (item.status == '5' && item.isReview != "1") || item.status == '4' || item.status == '6' || item.status == '7' || item.status == '8');
  //               this.setState({
  //                 dataSource: w,
  //                 totalNumber: w.length,
  //                 value: e.target.value,
  //               });
  //             }
  //           }
  //         },
  //       });
  //     }
  //     if (userRole == '3') {
  //       let obj = {};
  //       dispatch({
  //         type: 'Inspectorsmodels/getList',
  //         payload: {
  //           page: 1,
  //           pageSize,
  //           id: userRole,
  //           obj,
  //         },
  //         callback: res => {
  //           if (res) {
  //             if (res.retCode == 1) {
  //               let w = res.list.filter(item => item.isArrangeDesc != "需安排" && item.isAuditDesc != "需审核");
  //               this.setState({
  //                 dataSource: w,
  //                 totalNumber: w.length,
  //                 value: e.target.value,
  //               });
  //             }
  //           }
  //         },
  //       });
  //     }
  //     if (userRole == '4') {
  //       let obj = {};
  //       obj.status_S_IN = "1,5";
  //       dispatch({
  //         type: 'Inspectorsmodels/getList',
  //         payload: {
  //           page: 1,
  //           pageSize,
  //           id: userRole,
  //           obj,
  //         },
  //         callback: res => {
  //           if (res) {
  //             if (res.retCode == 1) {
  //               let w = res.list.filter(item => item.status != '1' || (item.status == '5' && item.isReview == "1"))
  //               this.setState({
  //                 dataSource: w,
  //                 totalNumber: w.length,
  //                 value: e.target.value,
  //               });
  //             }
  //           }
  //         },
  //       });
  //     }
  //   }
  //   //全部
  //   if (e.target.value == '3') {
  //     this.getList({});
  //     this.setState({ value: "3" });
  //   }
  // };
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
  // 获取主办部门
  // getUrbanApartment = () => {
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'Inspectorsmodels/getUrbanApartment',
  //     payload: {},
  //     callback: res => {
  //       if (res) {
  //         this.setState({ UrbanApartment: res.list });
  //       }
  //     },
  //   });
  // };

  componentDidMount() {
    const { parentId } = this.state;
    this.getSelect('workSource');
    this.getSelect('eventCategory');
    this.getSelect('DepartmentAssign');
    this.getcaseSmallType(parentId);
    this.getList({});
    this.getUrbanApartment();




    this.getSelect('workSatisfaction');
    this.getSelect('feedbackResults');
    this.getSelect('parentBank');
    this.getSelect('processProgram');
    this.getSelect('workLevel');
    this.getSelect('workDestructionDegree');
    this.getSelect('workImpactScope');
    this.getSelect('results');
    this.getSelect('closingType');
    this.getSelect('satisfaction');
    this.getGrid();
  }

  // 点击状态弹窗详情页
  smallDetail = (id, isCheck) => {
    const { userRole } = this.state;
    const { dispatch } = this.props;
    this.setState({
      fivefivevisible: true,
    }, () => {
      this.setState({
        sixsixsixvisible: true,
      })
    });
    dispatch({
      type: 'Inspectorsmodels/getDetailList',
      payload: {
        listid: id,
        userRole,
        check: userRole == 4 ? isCheck : 0,
      },
      callback: res => {
        if (res) {
          if (res.retCode == 1) {
            this.setState(
              {
                dataSource: res.list[0],
                totalNumber: res.length,
                dispatchVos: res.list[0].dispatchVos
                  ? res.list[0].dispatchVos.length > 0
                    ? res.list[0].dispatchVos
                    : ['1']
                  : ['1'],
                fileArr: res.list[0] ? res.list[0].preAttachmentIds : [],
                fileArrTwo: res.list[0] ? res.list[0].proAttachmentIds : [],
              },
              () => {
                const { dataSource, userRole, dispatchVos, fileArr, fileArrTwo } = this.state;
                if (userRole == '3') {
                  dataSource.dispatchVos.map(item => {
                    if (item.executor) {
                      this.setState({ flag: true });
                    } else {
                      this.setState({ flag: false });
                    }
                  });
                }
                if (
                  sessionStorage.getItem('userRole') != '2' &&
                  sessionStorage.getItem('userRole') != '4'
                ) {
                  // 详情处置人员
                  dispatch({
                    type: 'Inspectorsmodels/getUserListByOrgIdAndIsExecutive',
                    payload: {
                      id: dataSource.dispatchVos[0].assistDepartment,
                    },
                    callback: res => {
                      if (res) {
                        if (res.retCode == 1) {
                          this.setState({
                            leadership: res.list.filter(item => item.leadership != '1'),
                          });
                        }
                      }
                    },
                  });
                }
                if (dataSource.dispatchVos && dataSource.dispatchVos.length > 0) {
                  // 处置人员下拉
                  dispatch({
                    type: 'Inspectorsmodels/getUserListByOrgIdAndIsExecutive',
                    payload: {
                      id: dataSource.dispatchVos[0].assistDepartment,
                    },
                    callback: res => {
                      if (res) {
                        if (res.retCode == '1') {
                          this.setState({ leadership: res.list });
                        }
                      }
                    },
                  });
                }
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
                this.onSelect(dataSource.caseBigType, null);
              }
            );

            // 列表数据(二级处置)
            dispatch({
              type: 'Inspectorsmodels/getDetailListSecond',
              payload: {
                id: res.list[0].workOrderId,
                userRole,
              },
              callback: res => {
                if (res) {
                  if (res.retCode == 1) {
                    this.setState({ dataSourceSecond: res.list[0] });
                  }
                }
              },
            });
            // 列表数据(任务处置)
            dispatch({
              type: 'Inspectorsmodels/getDetailListDispose',
              payload: {
                id: res.list[0].workOrderId,
                userRole,
              },
              callback: res => {
                if (res) {
                  if (res.retCode == 1) {
                    this.setState({ dataSourceDispose: res.list[0] });
                  }
                }
              },
            });
            // 列表数据(工作过程)
            if (sessionStorage.getItem('userRole') != '4') {
              if (res.list[0].status != '1') {
                dispatch({
                  type: 'Inspectorsmodels/getDetailListCourse',
                  payload: {
                    id:
                      userRole == '2' || userRole == '1'
                        ? res.list[0].workOrderId
                        : res.list[0].dispatchVos[0].assistId,
                    userRole,
                  },
                  callback: res => {
                    if (res) {
                      if (res.retCode == 1) {
                        this.setState({ dataSourceCourse: res.list });
                      }
                    }
                  },
                });
              }
            }
            // 列表数据(工作过程)
            if (sessionStorage.getItem('userRole') == '4' && res.list[0].status != '1' && res.list[0].status != '2') {
              dispatch({
                type: 'Inspectorsmodels/getDetailListCourse',
                payload: {
                  id:
                    userRole == '2' || userRole == '1'
                      ? res.list[0].workOrderId
                      : res.list[0].dispatchVos[0].assistId,
                  userRole,
                },
                callback: res => {
                  if (res) {
                    if (res.retCode == 1) {
                      this.setState({ dataSourceCourse: res.list });
                    }
                  }
                },
              });
            }
          }
        }
      },
    });
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
      workSource,
      eventCategory,
      caseSmallType,
      DepartmentAssign,
      dataSources,
      UrbanApartment,
      page,
      pageSize,
      totalNumber,




      workSatisfaction,
      feedbackResults,
      dataSource,
      title,
      leaderships,
      dataSourceSecond,
      dataSourceDispose,
      dataSourceCourse,
      fileList,
      previewVisible,
      previewImage,
      filePath,
      fileListTwo,
      filePathTwo,
      leadership,
      parentBank,
      processProgram,
      workLevel,
      workDestructionDegree,
      workImpactScope,
      userRole,
      flag,
      uploading,
      gridList,
      mapBox,
      seePhoptovisible,
      seePhotoSrc,
    } = this.state;

    const DetailForms = {
      workSatisfaction,
      form: this.props.form,
      feedbackResults,
      dataSource,
      dataSourceSecond,
      dataSourceDispose,
      dataSourceCourse,
      UrbanApartment,
      fileList,
      leaderships,
      previewVisible,
      previewImage,
      gridList,
      handlePreview: this.handlePreview,
      handleChange: this.handleChange,
      handleChangeTwo: this.handleChangeTwo,
      handleCancel: this.handleCancel,
      handleRemove: this.handleRemove,
      handleRemoveTwo: this.handleRemoveTwo,
      UrbanApartmentSelect: this.UrbanApartmentSelect,
      onSelect: this.onSelect,
      leadership,
      parentBank,
      userRole,
      processProgram,
      eventCategory,
      caseSmallType,
      workLevel,
      workDestructionDegree,
      workImpactScope,
      uploading,
      fileListTwo,
      filePathTwo,
      filePath,
      showMap: this.showMap,
      mapBox,
      getUnit: this.getUnit,
      seePhopto: this.seePhopto,
      loopDownPhopto: this.loopDownPhopto,
    };

    const headForms = {
      workSource,
      UrbanApartment,
      eventCategory,
      caseSmallType,
      DepartmentAssign,
      onSelect: this.onSelect,
      Search: this.Search,
      reset: this.reset,
    };
    const pagination = {
      current: page,
      total: totalNumber,
      pageSize,
      showSizeChanger: true,
      showQuickJumper: true,
    };
    const bodyForms = {
      dataSources,
      pagination,
      pageChange: this.pageChange.bind(this),
      complainMouse: this.complainMouse,
      complainMouseOut: this.complainMouseOut,
      smallDetail: this.smallDetail,
    };


    const { getFieldDecorator } = this.props.form;
    const selectAfter = (
      <Select onChange={this.getUnit} defaultValue="小时" style={{ width: 80 }}>
        <Option value="1">小时</Option>
        <Option value="2">天</Option>
      </Select>
    );

    return (
      <div id="listTitleContent">
        <Header {...headForms} />
        <Bodylist {...bodyForms} />
        <div style={{ width: 400, position: 'relative', top: '-80px', left: '50px' }}>
          <RadioGroup onChange={this.onChange} value={this.state.value}>
            <Radio value="1" key="1">待处理</Radio>
            <Radio value="2" key="2">已处理</Radio>
            <Radio value="3" key="3">全部</Radio>
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
          <div>
            <div id="listTitleDetailBanner">
              <h3>
                <span>工单编号 ：{dataSource ? dataSource.workOrderId : ''}</span>
                <span />
                <span style={{ margin: '0 0 0 16px' }}>
                  状态 ：{dataSource ? dataSource.statusDesc : ''}
                </span>
                <span />
              </h3>
              <Row>
                <Col span={24}>
                  <Col span={2} style={{ marginRight: 10, marginLeft: 28 }}>
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
                  {
                    this.buttons(dataSource.status, userRole, dataSource.isCheck, (dataSource.dispatchVos && dataSource.dispatchVos[0] ? dataSource.dispatchVos[0].isReview : ''), dataSource.isReview, dataSource.createRole, dataSource.isReturn, dataSource)
                  }
                </Col>
              </Row>
            </div>
            <div id="listTitleDetailTabEdit" style={{ position: "relative" }}>
              <Form>
                <Tabs defaultActiveKey="1" type="card" size="small" onTabClick={this.onTabClick}>
                  <TabPane tab="常用" key="1" forceRender>
                    <DetailCommon11 {...DetailForms} />
                  </TabPane>
                  <TabPane tab="工作过程" key="2">
                    <DetailCourse22 {...DetailForms} />
                  </TabPane>
                  <TabPane tab="案件信息" key="3" forceRender>
                    <DetailInformation33 {...DetailForms} />
                  </TabPane>
                  <TabPane tab="任务处置" key="4">
                    <DetailDispose44 {...DetailForms} />
                  </TabPane>
                  <TabPane tab="二级处置" key="5">
                    <DetailSecond55 {...DetailForms} />
                  </TabPane>
                  <TabPane tab="处置核查" key="6">
                    <DetailInspect66 {...DetailForms} />
                  </TabPane>
                  <TabPane tab="处置延时" key="7">
                    <DetailDelay77 {...DetailForms} />
                  </TabPane>
                </Tabs>
                {/* <Row style={{ position: "absolute", right: '-48%', top: `9%`, width: '81%', display: this.state.tabKey === '2' ? 'none' : 'block' }}>
              <Col span={9}>
                <div id="tableListForm" style={{ padding: '0 40px 0 10px' }}>
                  <Col span={24}>
                    <h3 style={{ padding: "20px 0 11px 0" }}>附件清单</h3>
                  </Col>
                  <Col span={12} style={{ margin: "10px 0", borderRight: "solid 1px #DEE4EC", paddingRight: 19, position: "relative" }}>
                    <Col span={10}><h5 style={{ fontSize: 14, fontWeight: 600, margin: 0, marginBottom: 11 }}>整改前</h5></Col>
                  </Col>
                  <Col span={12} style={{ margin: "10px 0", paddingLeft: 20, position: "relative" }}>
                    <Col span={10}>
                      <h5 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>整改后</h5>
                    </Col>
                  </Col>
                </div>
              </Col>
            </Row> */}
              </Form>
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
                      {getFieldDecorator('processingDescription')(<TextArea />)}
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
                    <Col span={16} push={1}>
                      <FormItem label="复核时限" labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}>
                        {getFieldDecorator("fhassistTime", {
                          rules: [{
                            required: false,
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
                    <Col span={16} push={1}>
                      <FormItem label="复核部门">
                        {getFieldDecorator(`fhassistDepartment`, {
                          rules: [{
                            required: true,
                            message: "请选择复核部门!",
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
                                <Select.Option key={item.id} value={item.id}>
                                  {item.orgName}
                                </Select.Option>
                              ))}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                  </Col>
                  <Col span={24}>
                    <Col span={16} push={1}>
                      <FormItem label="复核人员">
                        {getFieldDecorator(`fhexecutor`, {
                          rules: [{
                            required: true,
                            message: "请选择复核人员!",
                          }],
                          initialValue: "请选择",
                        })(
                          <Select placeholder="请输入">
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
                        {getFieldDecorator("sqyqassistTime", {
                          initialValue: (dataSource.dispatchVos && dataSource.dispatchVos[0]) ? dataSource.dispatchVos[0].assistTime : "",
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
                        {getFieldDecorator("shassistTime", {
                          initialValue: dataSource.postponementVos ? dataSource.postponementVos[0].assistTime : "",
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
                          initialValue: dataSource.postponementVos ? dataSource.postponementVos[0].delayDate : "",
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
                        initialValue: dataSource.postponementVos ? dataSource.postponementVos[0].applicationNote : "",
                      })(<TextArea disabled />)}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem label="申请人" labelCol={{ span: 4 }} wrapperCol={{ span: 19 }}>
                      {getFieldDecorator('applicationPeople', {
                        initialValue: dataSource.postponementVos ? dataSource.postponementVos[0].applicationUserIdDesc : "",
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
          </div>
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

const InspecTors = Form.create()(app);
export default InspecTors;
