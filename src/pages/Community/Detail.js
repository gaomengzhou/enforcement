import React, { PureComponent } from 'react';
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
import DetailInformation1 from './DetailInformation1';
import DetailCourse2 from './DetailCourse2';
import { picIp } from '@/utils/ipConfig';


const Formats = 'YYYY-MM-DD HH:mm:ss';
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
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

@connect(({ Communitymodels, loading }) => ({
  Communitymodels,
  loading: loading.models.Communitymodels,
}))

class app extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      userRole: sessionStorage.getItem('userRole'), // 身份id
      businessType: [], // 业务类型
      gender: [], // 性别
      parentBank: [], // 详细地址
      gridList: [], // 网格名称
      newgridList: [], // 网格名称(有社区之后)
      unit: "", // 处置时限--小时，天
      UrbanApartment: [], //主办部门
      leadership: [], // 处置人员
      info: "", // 详情页所有数据
      courseInfo: "", // 工作过程所有数据
      dispatchVos: [], // 副表数据
      modalTitle: "", // 弹出框标题
      modalVisible: false, // 弹出框
      WasteCasevisible: false, // 废案弹窗
      detelevisible: false, // 删除弹窗
      executorHandlevisible: false, // 申请结案弹窗
      closingCasevisible: false, // 结案弹窗
      goBackvisible: false, // 退回弹窗
      applicationExtension: false, // 申请延期弹窗
      deferredAuditvisible: false, // 延期审核弹窗
      reCheckvisible: false, // 复核弹窗
      uploading: false, // 附件
      previewVisible: false,
      previewImage: '',
      fileList: [],
      fileListTwo: [],
      filePath: "",
      filePathTwo: "",
      seePhoptovisible: false, // 工作过程图片查看
      seePhotoSrc: "", // 工作过程图片地址
    }
  }


  componentDidMount() {
    this.getSelect("businessType");
    this.getSelect("gender");
    this.getSelect("parentBank");
    this.getGrid();
    this.getListInfo();
    this.getUrbanApartment();
    this.getListCourseInfo();
  }

  buttons = (userRole, status, isCheck, info) => {
    //信息中心待派遣
    if (userRole == '2' && status == '2') {
      return (
        <Col span={21}>
          <Button
            style={{ marginRight: 10 }}
            type="primary"
            onClick={() => this.increase("BC")}
          >
            保存
          </Button>
          <Button
            style={{ marginRight: 10, border: "#2B49C4 1px solid", color: "#2B49C4" }}
            onClick={() => this.increase("PD")}
          >
            派单
          </Button>
          <Button
            style={{ marginRight: 10, border: "#2B49C4 1px solid", color: "#2B49C4" }}
            onClick={() => this.showModal("GoBack")}
          >
            退回
          </Button>
          <Button
            style={{ marginRight: 10, border: "#2B49C4 1px solid", color: "#2B49C4" }}
            onClick={() => this.showModal("FeiA")}
          >
            废案
          </Button>
          <Button style={{ marginRight: 10 }} type="primary" hidden>
            导出
          </Button>
          <Button
            style={{ marginRight: 10 }}
            onClick={() => { this.showModal('DEL') }}
            type="primary"
          >
            删除
          </Button>
        </Col>
      );
    }
    // 信息中心待处置二级
    if (userRole == '2' && status == '5') {
      return (
        <Col span={21}>
          <Button
            style={{ marginRight: 10, border: "#2B49C4 1px solid", color: "#2B49C4" }}
            onClick={() => { this.showModal('YQSH') }}
            hidden={info.isReview == 0}
          >
            延期审核
          </Button>
          <Button
            style={{ marginRight: 10, border: "#2B49C4 1px solid", color: "#2B49C4" }}
            onClick={() => { this.showModal('FeiA') }}
          >
            废案
          </Button>
        </Col>
      );
    }
    if (userRole == '2' && status == '9' && isCheck == "1") {
      return (
        <Col span={21}>
          <Button type="primary" onClick={() => { this.showModal('JA') }}>
            确认结案
          </Button>
          <Button
            style={{ marginRight: 10, border: "#2B49C4 1px solid", color: "#2B49C4" }}
            onClick={() => this.showModal("BC")}
          >
            退回
          </Button>
          <Button
            style={{ marginRight: 10, border: "#2B49C4 1px solid", color: "#2B49C4" }}
            onClick={() => this.showModal("FeiA")}
          >
            废案
          </Button>
        </Col>
      );
    }
    if (userRole == '2' && status == '9' && isCheck == "0") {
      return (
        <Col span={21}>
          <Button style={{ marginRight: 10 }} onClick={() => this.showModal("FH")} type="primary">
            复核
          </Button>
          <Button type="primary" onClick={() => this.showModal("JA")}>
            确认结案
          </Button>
          <Button
            style={{ marginRight: 10, border: "#2B49C4 1px solid", color: "#2B49C4" }}
            onClick={() => this.showModal("GoBack")}
          >
            退回
          </Button>
          <Button
            style={{ marginRight: 10, border: "#2B49C4 1px solid", color: "#2B49C4" }}
            onClick={() => this.showModal("BC")}
          >
            废案
          </Button>
        </Col>
      );
    }
    if (userRole == '4' && status == '1') {
      return (
        <Col span={21}>
          <Button
            style={{ marginRight: 10 }}
            type="primary"
            onClick={() => this.increase("BC")}
          >
            保存
          </Button>
          <Button
            style={{ marginRight: 10, border: "#2B49C4 1px solid", color: "#2B49C4" }}
            hidden={info.selfDisposal == 1}
            onClick={this.report.bind(this, this.props.form)}
          >
            上报
          </Button>
          <Button style={{ marginRight: 10, border: "#2B49C4 1px solid", color: "#2B49C4" }} hidden={info.selfDisposal == 0} onClick={this.self.bind(this, this.props.form)}>
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
            onClick={() => { this.showModal('SQJA') }}
          >
            申请结案
          </Button>
          <Button
            style={{ marginRight: 10, border: "#2B49C4 1px solid", color: "#2B49C4" }}
            onClick={() => { this.showModal('SQYQ') }}
            hidden={info.isReview == 1 || info.isApplicationClosure == 1}
          >
            申请延期
          </Button>
          <Button
            hidden={info.isApplicationClosure == 1 || info.isReview == 1}
            onClick={() => { this.showModal('GoBack') }}
            style={{ marginRight: 10, border: "#2B49C4 1px solid", color: "#2B49C4" }}
          >
            退回
          </Button>
        </Col>
      );
    }
  }

  // 获取 处置时限--小时，天
  getUnit = e => {
    this.setState({
      unit: e
    })
  }

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
          type: 'Leadermodels/downPhoto',
          payload: {
            producer: 'AttachmentDownload',
            id: item,
          }
        })
      })
    }
  }

  // 保存，派单，上报，自处置
  increase = (type) => {
    const { validateFields } = this.props.form;
    const { dispatch } = this.props;
    const { info, fileList, fileListTwo, filePath, filePathTwo } = this.state;
    let url = "";
    if (type == 'BC') {
      url = 'Communitymodels/save'
    } else if (type == 'PD') {
      url = 'Communitymodels/systemDispatch'
    } else if (type == 'SB') {
      url = 'Communitymodels/reportedData'
    } else if (type == 'ZCZ') {
      url = 'Communitymodels/self'
    }
    validateFields((error, values) => {
      if (error) {
        return
      }
      values.reportTime && (values.reportTime = moment(values.reportTime).format(Formats));
      info.workOrderId && (values.workOrderId = info.workOrderId);
      let dispatchVos = [];
      let json = {
        assistDepartment: values.assistDepartment,
        assistTime: values.assistTime,
        executor: values.executor,
        unit: this.state.unit ? this.state.unit : info.dispatchVos.length > 0 ? info.dispatchVos[0].unit : "1",
      };
      dispatchVos.push(json);
      values.dispatchVos = dispatchVos;
      values.assistDepartment && (values.assistDepartment = undefined);
      values.assistTime && (values.assistTime = undefined);
      values.executor && (values.executor = undefined);
      values.unit && (values.unit = undefined);
      (type == 'ZCZ' && addZCZ == "zcz") && (values.selfDisposal = '1');
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
    })
  }

  // 附件
  // 关闭预览图片框
  handleCancel = () => this.setState({ previewVisible: false, seePhoptovisible: false, });
  // 打开预览图片框
  handlePreview = async (f, file) => {
    const that = this;
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    let watermark = document.createElement('canvas');
    watermark.width = 533;
    watermark.height = 300;
    let imgs = new Image();
    let timer = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    imgs.width = 533;
    imgs.height = 300;
    imgs.src = file.url || file.preview;
    imgs.onload = () => {
      let ctx = watermark.getContext('2d');
      ctx.drawImage(imgs, 0, 0, 533, 300);
      ctx.font = "16px Arial";
      ctx.fillStyle = 'red';
      if (f == "before") {
        ctx.fillText(timer + " -- 整改前", 292, 280);
      }
      if (f == "after") {
        ctx.fillText(timer + " -- 整改后", 292, 280);
      }
      let img = watermark.toDataURL('image/png')
      that.setState({
        previewImage: img,
        previewVisible: true,
      })
    };
  };
  // base64转文件格式
  dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }
  blobToFile(theBlob, fileName) {
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    return theBlob;
  }
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
        let that = this;
        let oldPic = getBase64(originFileObj);
        oldPic.then(function (result) {
          let watermark = document.createElement('canvas');
          watermark.width = 533;
          watermark.height = 300;
          let imgs = new Image();
          let timer = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
          imgs.width = 533;
          imgs.height = 300;
          imgs.src = result;
          imgs.onload = () => {
            let ctx = watermark.getContext('2d');
            ctx.drawImage(imgs, 0, 0, 533, 300);
            ctx.font = "16px Arial";
            ctx.fillStyle = 'red';
            ctx.fillText(timer + " -- 整改前", 292, 280);
            let img = watermark.toDataURL('image/png').substr(22);
            dispatch({
              type: 'Communitymodels/watermarks',
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
        let that = this;
        let oldPic = getBase64(originFileObj);
        oldPic.then(function (result) {
          let watermark = document.createElement('canvas');
          watermark.width = 533;
          watermark.height = 300;
          let imgs = new Image();
          let timer = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
          imgs.width = 533;
          imgs.height = 300;
          imgs.src = result;
          imgs.onload = () => {
            let ctx = watermark.getContext('2d');
            ctx.drawImage(imgs, 0, 0, 533, 300);
            ctx.font = "16px Arial";
            ctx.fillStyle = 'red';
            ctx.fillText(timer + " -- 整改后", 292, 280);
            let img = watermark.toDataURL('image/png').substr(22);
            dispatch({
              type: 'Communitymodels/watermarks',
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
  // 整改前删除图片
  handleRemove = file => {
    this.setState(state => {
      const index = state.fileList.indexOf(file);
      let newFileList = state.filePath.slice();
      newFileList && newFileList.reverse().splice(index, 1);
      return {
        filePath: newFileList,
      };
    });
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
  // 水印
  watermark64 = b => {
    this.setState({
      previewImage: b,
    });
  }

  // 获取下拉框的值
  getSelect(groupCode) {
    const { dispatch } = this.props;
    dispatch({
      type: 'Communitymodels/getGroupCode',
      payload: { groupCode },
      callback: res => {
        if (res) {
          groupCode == 'businessType' && this.setState({ businessType: res });
          groupCode == 'gender' && this.setState({ gender: res });
          groupCode == 'parentBank' && this.setState({ parentBank: res });
        }
      },
    });
  }

  // 获取网格
  getGrid = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'Communitymodels/getGrid',
      payload: {},
      callback: res => {
        if (res) {
          if (res.retCode == '1') {
            this.setState({ gridList: res.list })
          }
        }
      }
    })
  }
  // 社区，网格联动
  communityGrid = (value, key) => {
    let newgridList = this.state.gridList.filter(item => item.name.indexOf(key.props.children) != -1);
    this.setState({
      newgridList,
    })
  }

  // 获取处置部门
  getUrbanApartment = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'Communitymodels/getUrbanApartment',
      payload: {},
      callback: res => {
        if (res) {
          this.setState({ UrbanApartment: res.list });
        }
      },
    });
  };
  // 处置部门选中项变化的回调
  UrbanApartmentSelect = (value, key) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'Communitymodels/getUserListByOrgIdAndIsExecutive',
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

  // 获取列表数据(常用，案件信息)
  getListInfo() {
    const { dispatch } = this.props;
    const { userRole } = this.state;
    dispatch({
      type: 'Communitymodels/getDetailList',
      payload: {
        listid: window.location.href.split('/')[window.location.href.split('/').length - 3],
        userRole,
        check: userRole == 4 ? window.location.href.split('/')[window.location.href.split('/').length - 1] : 0
      },
      callback: res => {
        if (res) {
          this.setState(
            {
              info: res.list[0],
              dispatchVos: res.list[0].dispatchVos
                ? res.list[0].dispatchVos.length > 0
                  ? res.list[0].dispatchVos
                  : []
                : [],
              fileArr: res.list[0] ? res.list[0].preAttachmentIds : [],
              fileArrTwo: res.list[0] ? res.list[0].proAttachmentIds : [],
            }, () => {
              const { info, dispatchVos, userRole, fileArr, fileArrTwo } = this.state;
              dispatchVos.length > 0 && this.UrbanApartmentSelect(dispatchVos[0].assistDepartment);
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
          )
        }
      },
    });
  }
  // 获取工作工程数据
  getListCourseInfo() {
    this.props.dispatch({
      type: 'Communitymodels/getDetailListCourse',
      payload: {
        id: window.location.href.split('/')[window.location.href.split('/').length - 3],
        userRole: this.state.userRole,
      },
      callback: res => {
        if (res) {
          this.setState(
            { courseInfo: res.list }
          )
        }
      },
    });
  }

  // 弹出框
  showModal = type => {
    if (type == 'JA') {
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

  // 弹出框确定
  handleOk = type => {
    const { form, dispatch } = this.props;
    const { getFieldsValue } = form;
    const { info, userRole, dispatchVos, title, filePathTwo } = this.state;
    const values = getFieldsValue();
    const obj = dispatchVos[0];
    const infos = info;
    values.executor && (obj.executor = values.executor);
    values.arrangeOpinions && (obj.arrangeOpinions = values.arrangeOpinions);
    values.auditOpinions && (obj.auditOpinions = values.auditOpinions);
    values.closureExplain && (infos.closureExplain = values.closureExplain);
    values.closingEvaluation && (infos.closingEvaluation = values.closingEvaluation);
    if (type == 'JA') {
      let closingEvaluation = "";
      values.closingEvaluation && (closingEvaluation = values.closingEvaluation);
      dispatch({
        type: 'Communitymodels/closingCase',
        payload: {
          workOrderId: info.workOrderId,
          closingEvaluation,
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
    } else if (type == 'SQJA') {
      filePathTwo && (infos.proPicture = filePathTwo.join(','));
      let processingDescription = "";
      values.processingDescription && (processingDescription = values.processingDescription);
      dispatch({
        type: 'Communitymodels/executorHandle',
        payload: {
          workOrderId: info.workOrderId,
          isCheck: info.isCheck,
          deadline: info.deadline,
          processingDescription,
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
    } else if (type == 'DEL' || type == 'FeiA') { // 删除
      const id = info.workOrderId;
      this.props.dispatch({
        type: "Communitymodels/deteles",
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
      values && (reCheckObj.unit = this.state.unit ? this.state.unit : "1");
      values && (reCheckObj.workOrderId = info.workOrderId);
      values && (reCheckObj.workOrderType = 5);
      if (values.fhassistTime) {
        dispatch({
          type: "Communitymodels/reCheck",
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
      let delayObj = {};
      values.applicationNote && (delayObj.applicationNote = values.applicationNote);
      values.delayDate && (delayObj.delayDate = values.delayDate);
      values.sqyqassistTime && (delayObj.assistTime = values.sqyqassistTime);
      info && (delayObj.isCheck = info.isCheck);
      values && (delayObj.orderId = info.workOrderId);
      values && (delayObj.workOrderType = 5);
      values && (delayObj.unit = this.state.unit ? this.state.unit : "1");
      if (values.delayDate) {
        dispatch({
          type: "Communitymodels/application",
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
      dispatch({
        type: "Communitymodels/deferredAudit",
        payload: {
          workOrderId: info.workOrderId,
          approvalResults: values.approvalResults,
          isReview: "1",
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
      dispatch({
        type: "Communitymodels/deferredAudit",
        payload: {
          workOrderId: info.workOrderId,
          approvalResults: values.approvalResults,
          isReview: "0",
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
        type: "Communitymodels/goBackS",
        payload:
          userRole == 4 ?
            {
              workOrderId: info.workOrderId,
              workOrderType: 5,
              isCheck: info.isCheck,
            } : {
              workOrderId: info.workOrderId,
              workOrderType: 5,
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
      dispatch({
        type: 'Inspectorsmodels/manageArrange',
        payload: {
          ...obj,
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
    }
  };

  componentwillunmount() {
    this.setState({})
  }

  render() {
    const {
      businessType,
      gender,
      parentBank,
      gridList,
      newgridList,
      UrbanApartment,
      leadership,
      userRole,
      info,
      dispatchVos,
      courseInfo,
      uploading,
      previewVisible,
      previewImage,
      fileList,
      fileListTwo,
      filePath,
      filePathTwo,
      seePhoptovisible,
      seePhotoSrc,
    } = this.state
    const DetailForms = {
      form: this.props.form,
      businessType,
      gender,
      parentBank,
      communityGrid: this.communityGrid,
      gridList,
      newgridList,
      getUnit: this.getUnit,
      UrbanApartment,
      leadership,
      UrbanApartmentSelect: this.UrbanApartmentSelect,
      info,
      dispatchVos,
      courseInfo,
      uploading,
      previewVisible,
      previewImage,
      fileList,
      fileListTwo,
      filePath,
      filePathTwo,
      watermark64: this.watermark64,
      handlePreview: this.handlePreview,
      handleChange: this.handleChange,
      handleChangeTwo: this.handleChangeTwo,
      handleCancel: this.handleCancel,
      handleRemove: this.handleRemove,
      handleRemoveTwo: this.handleRemoveTwo,
      loopDownPhopto: this.loopDownPhopto,
      seePhopto: this.seePhopto,
    }


    const { getFieldDecorator } = this.props.form;
    const selectAfter = (
      <Select onChange={this.getUnit} defaultValue={dispatchVos.length > 0 ? dispatchVos[0].unit : ""} style={{ width: 80 }}>
        <Option value="1" key="1">小时</Option>
        <Option value="2" key="2">天</Option>
      </Select>
    );


    return (
      <div id="listTitleContent">
        <Breadcrumb separator=">">
          <span id="breadcrumbIcon" />
          <Breadcrumb.Item>工单派发</Breadcrumb.Item>
          <Breadcrumb.Item>领导交办</Breadcrumb.Item>
          <Breadcrumb.Item>处理</Breadcrumb.Item>
        </Breadcrumb>
        <div id="listTitleDetailBanner">
          <h3>
            <span>工单编号 ：{info ? info.workOrderId : ''}</span>
            <span />
            <span style={{ margin: '0 0 0 40px' }}>
              状态 ：{info ? info.statusDesc : ''}
            </span>
            <span />
          </h3>
          <Row>
            <Col span={24}>
              <Col span={3}>
                <Button
                  type="primary"
                  style={{ marginRight: 40, marginLeft: 28 }}
                  onClick={() => {
                    history.back(-1);
                  }}
                >
                  <Icon type="caret-left" />
                  返回
                </Button>
              </Col>
              {this.buttons(this.state.userRole, info.status, info.isCheck, info)}
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
          title="废案"
          visible={this.state.WasteCasevisible}
          onOk={() => { this.handleOk('FeiA') }}
          onCancel={() => { this.setState({ WasteCasevisible: false }) }}
        >
          <Form>
            <h2 style={{ textAlign: "center", fontWeight: 100, color: "red" }}>请确认是否废案</h2>
          </Form>
        </Modal>
        <Modal
          title="删除"
          visible={this.state.detelevisible}
          onOk={() => { this.handleOk('DEL') }}
          onCancel={() => { this.setState({ detelevisible: false }) }}
        >
          <Form>
            <h2 style={{ textAlign: "center", fontWeight: 100, color: "red" }}>请确认是否删除</h2>
          </Form>
        </Modal>
        <Modal
          title="申请结案"
          visible={this.state.executorHandlevisible}
          onOk={() => { this.handleOk('SQJA') }}
          onCancel={() => { this.setState({ executorHandlevisible: false }) }}
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
          title="确认结案"
          visible={this.state.closingCasevisible}
          onOk={() => { this.handleOk('JA') }}
          onCancel={() => { this.setState({ closingCasevisible: false }) }}
        >
          <Form>
            <Row>
              <Col span={24}>
                <FormItem label="结案评价" labelCol={{ span: 4 }} wrapperCol={{ span: 17 }}>
                  {getFieldDecorator('closingEvaluation')(<TextArea />)}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
        <Modal
          title="退回"
          visible={this.state.goBackvisible}
          onOk={() => { this.handleOk('GoBack') }}
          onCancel={() => { this.setState({ goBackvisible: false }) }}
        >
          <Form>
            <h2 style={{ textAlign: "center", fontWeight: 100, color: "red" }}>请确认是否退回</h2>
          </Form>
        </Modal>
        <Modal
          title="申请延期"
          visible={this.state.applicationExtension}
          onOk={() => { this.handleOk('SQYQ') }}
          onCancel={() => { this.setState({ applicationExtension: false }) }}
        >
          <Form>
            <Row>
              <Col span={24}>
                <Col span={12}>
                  <FormItem label="处置时限" labelCol={{ span: 8 }} wrapperCol={{ span: 15 }}>
                    {getFieldDecorator("sqyqassistTime", {
                      initialValue: dispatchVos.length > 0 ? dispatchVos[0].assistTime : "",
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
                        required: info.status == 5 ? true : false,
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
          onCancel={() => { this.setState({ deferredAuditvisible: false }) }}
          footer={[
            <Button key="submit" type="primary" onClick={() => { this.handleOk('YQSHY') }}>
              审核通过
            </Button>,
            <Button key="back" onClick={() => { this.handleOk('YQSHN') }}>
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
                      initialValue: info.postponementVos && info.postponementVos.length > 0 ? info.postponementVos[0].assistTime : "",
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
                      initialValue: info.postponementVos && info.postponementVos.length > 0 ? info.postponementVos[0].delayDate : "",
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
                    initialValue: info.postponementVos && info.postponementVos.length > 0 ? info.postponementVos[0].applicationNote : "",
                  })(<TextArea disabled />)}
                </FormItem>
              </Col>
              <Col span={24}>
                <FormItem label="申请人" labelCol={{ span: 4 }} wrapperCol={{ span: 19 }}>
                  {getFieldDecorator('applicationPeople', {
                    initialValue: info.postponementVos && info.postponementVos.length > 0 ? info.postponementVos[0].applicationUserIdDesc : "",
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
          title="复核"
          visible={this.state.reCheckvisible}
          onOk={() => { this.handleOk('FH') }}
          onCancel={() => { this.setState({ reCheckvisible: false }) }}
          destroyOnClose={true}
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
                  <FormItem label="复核部门" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
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
                  <FormItem label="复核人员" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
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
                            return <Option value={item.userId} key={item.userId}>{item.userName}</Option>;
                          })}
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Col>
            </Row>
          </Form>
        </Modal>
        <Modal visible={seePhoptovisible} footer={null} onCancel={this.handleCancel} style={{ position: "relative" }}>
          <Carousel effect="fade" ref="carouselImg">
            {seePhotoSrc && seePhotoSrc.map(item =>
              <img alt="example" style={{ width: '100%' }} key={item.filePath} src={picIp + item.filePath} />
            )}
          </Carousel>
          <Icon onClick={this.prevImg} style={{ width: 32, height: 52, lineHeight: "52px", fontSize: 18, position: "absolute", top: "46%", left: 0 }} type="left" />
          <Icon onClick={this.nextImg} style={{ width: 32, height: 52, lineHeight: "52px", fontSize: 18, position: "absolute", top: "46%", right: 0 }} type="right" />
        </Modal>
      </div>
    )
  }
}

const Detail = Form.create()(app);
export default Detail;