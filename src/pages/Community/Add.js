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
  Breadcrumb,
  message,
} from 'antd';

import { connect } from 'dva';
import AddInformation from './AddInformation';

const Formats = 'YYYY-MM-DD HH:mm:ss';

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
      unit: "1", // 处置时限--小时，天
      UrbanApartment: [], //主办部门
      leadership: [], // 处置人员
      addZCZ: window.location.href.split('?')[window.location.href.split('?').length - 1], // 是否自处置
      uploading: false, // 附件
      previewVisible: false,
      previewImage: '',
      fileList: [],
      fileListTwo: [],
      filePath: "",
      filePathTwo: "",
    }
  }


  componentDidMount() {
    this.getSelect("businessType");
    this.getSelect("gender");
    this.getSelect("parentBank");
    this.getGrid();
    this.getUrbanApartment();
  }

  // 获取 处置时限--小时，天
  getUnit = e => {
    this.setState({
      unit: e
    })
  }
  // 保存，派单
  increase = (type) => {
    const { validateFields } = this.props.form;
    const { dispatch } = this.props;
    const { fileList, fileListTwo, filePath, filePathTwo, addZCZ } = this.state;
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
      let dispatchVos = [];
      let json = {
        assistDepartment: values.assistDepartment,
        assistTime: values.assistTime,
        executor: values.executor,
        unit: this.state.unit,
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

  //获取主办部门
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
  // 主办部门选中项变化的回调
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

  // 附件
  // 关闭预览图片框
  handleCancel = () => this.setState({ previewVisible: false });
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
        // previewImage: file.url || file.preview, img
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
      const index = state.filePath.indexOf(file);
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
      const index = state.filePathTwo.indexOf(file);
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
      addZCZ,
      uploading,
      previewVisible,
      previewImage,
      fileList,
      fileListTwo,
      filePath,
      filePathTwo,
    } = this.state
    const AddForms = {
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
      userRole,
      addZCZ,
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
    }
    return (
      <div id="listTitleContent">
        <Breadcrumb separator=">">
          <span id="breadcrumbIcon" />
          <Breadcrumb.Item>工单派发</Breadcrumb.Item>
          <Breadcrumb.Item>领导交办</Breadcrumb.Item>
          <Breadcrumb.Item>新增</Breadcrumb.Item>
        </Breadcrumb>
        <div id="listTitleDetailBanner">
          <h3>
            新增
          </h3>
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
          <Button type="primary" htmlType="submit" onClick={this.increase.bind(this, "BC")}>
            保存
          </Button>
          {
            userRole == 2 ? <Button style={{ border: "#2B49C4 1px solid", color: "#2B49C4" }} onClick={this.increase.bind(this, "PD")}>派单</Button> : null
          }
          <Button
            onClick={this.increase.bind(this, 'SB')}
            hidden={sessionStorage.getItem('userRole') == '2' || addZCZ == "zcz"}
            style={{ marginRight: 10, border: "#2B49C4 1px solid", color: "#2B49C4" }}
          >
            上报
          </Button>
          <Button
            onClick={this.increase.bind(this, 'ZCZ')}
            hidden={sessionStorage.getItem('userRole') == '2' || addZCZ != "zcz"}
            style={{ marginRight: 10, border: "#2B49C4 1px solid", color: "#2B49C4" }}
          >
            自处置
          </Button>
        </div>
        <div id="listTitleDetailTabEdit">
          <Tabs defaultActiveKey="1" type="card">
            <Tabs.TabPane tab="工单信息" key="1">
              <AddInformation {...AddForms} />
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    )

  }
}

const Add = Form.create()(app);
export default Add;