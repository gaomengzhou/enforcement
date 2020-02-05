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
  Tabs,
  Modal,
  Pagination,
  message,
  Icon,
  Breadcrumb,
} from 'antd';

import { connect } from 'dva';
import styles from './Detail.less';
import AddInformation1 from './AddInformation1';
import AddCourse2 from './AddCourse2';
import $ from 'jquery';

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

@connect(({ Leadermodels, loading }) => ({
  Leadermodels,
  loading: loading.models.Leadermodels,
}))
class app extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      uploading: false, // 附件
      previewVisible: false,
      previewImage: '',
      fileList: [],
      filePath: "",
      handOverSource: [], // 工单来源
      taskType: [], // 类型
      classification: [], // 任务分类
      parentBank: [], // 所属分行
      taskPriority: [], // 优先级
      dispatchVos: [],
      executor: [], // 承办人员
      leadership: [], // 分管领导
      userRole: sessionStorage.getItem('userRole'), // 身份id
      unit: "1", // 处置时限--小时，天
    };
  }


  // 获取 处置时限--小时，天
  getUnit = e => {
    this.setState({
      unit: e
    })
  }

  // 保存 && 派单
  increase = type => {
    const { validateFields } = this.props.form;
    const { dispatch } = this.props;
    const { fileList, filePath } = this.state;
    const url = (type == 'PD' ? 'Leadermodels/systemDispatch' : 'Leadermodels/save')
    validateFields((error, values) => {
      if (error) {
        return
      }
      type == "PD" ? (values.startTime = moment(new Date()).format(Formats)) : null;
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
              history.back(-1);
            } else {
              message.error(res.retMsg);
            }
          }
        },
      });
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
  // 上传图片
  handleChange = info => {
    const { dispatch } = this.props;
    // var _this = this;
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
          // watermark.width = 858;
          // watermark.height = 483;
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
            // var blob = _this.dataURLtoBlob(img);
            // var file = _this.blobToFile(blob, 'aa');

            // var data = new FormData();
            // data.append('file', file);
            // $.ajax({
            //   url: 'http://172.16.34.188:8080/services/attachment/file/upload/AttachmentUpload',
            //   type: 'POST',
            //   data: data,
            //   cache: false,
            //   processData: false,
            //   contentType: 'multipart/form-data'
            // });
            dispatch({
              type: 'Leadermodels/watermarks',
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
      // if (info.file.status === 'done') {
      //   const { name, response } = info.file;
      //   if (response.sucess) {
      //     const id = Array.isArray(response.entity) ? response.entity[0].id : '';
      //     this.setState({
      //       uploading: false,
      //       filePath: [id, ...filePath],
      //     });
      //   } else {
      //     this.setState({ uploading: false }, () => {
      //       message.error('上传失败!');
      //     });
      //   }
      // }
    });
  };
  //删除图片
  handleRemove = file => {
    this.setState(state => {
      console.log(state)
      const index = state.fileList.indexOf(file);
      let newFileList = state.filePath.slice();
      newFileList && newFileList.reverse().splice(index, 1);
      return {
        filePath: newFileList,
      };
    });
  };
  // 水印
  watermark64 = b => {
    this.setState({
      previewImage: b,
    });
  }

  // 主办部门
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

  // 主办部门更改 
  UrbanApartmentSelect = v => {
    const { dispatch } = this.props;
    // 承办人员
    dispatch({
      type: "Leadermodels/ListByOrgIdAndIsExecutive",
      payload: v,
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
      payload: v,
      callback: res => {
        if (res) {
          this.setState({ leadership: res.list });
        }
      }
    });
  };

  // 获取下拉框的值
  getSelect(groupCode) {
    const { dispatch } = this.props;
    dispatch({
      type: 'Leadermodels/getGroupCode',
      payload: { groupCode },
      callback: res => {
        if (res) {
          groupCode == 'handOverSource' && this.setState({ handOverSource: res });
          groupCode == 'taskType' && this.setState({ taskType: res });
          groupCode == 'parentBank' && this.setState({ parentBank: res });
          groupCode == 'taskPriority' && this.setState({ taskPriority: res });
          groupCode == 'classification' && this.setState({ classification: res });
        }
      },
    });
  }

  componentDidMount() {
    this.getSelect('handOverSource');
    this.getSelect('taskType');
    this.Apartment();
    this.getSelect('parentBank');
    this.getSelect('taskPriority');
    this.getSelect('classification');

  }

  render() {
    const {
      uploading,
      previewVisible,
      previewImage,
      fileList,
      filePath,
      handOverSource,
      taskType,
      Apartment,
      parentBank,
      taskPriority,
      executor,
      leadership,
      userRole,
      classification,
    } = this.state;
    const AddForms = {
      form: this.props.form,
      uploading,
      previewVisible,
      previewImage,
      fileList,
      filePath,
      watermark64: this.watermark64,
      handOverSource,
      taskType,
      Apartment,
      parentBank,
      taskPriority,
      UrbanApartmentSelect: this.UrbanApartmentSelect.bind(this),
      executor,
      leadership,
      handlePreview: this.handlePreview,
      handleChange: this.handleChange,
      handleCancel: this.handleCancel,
      handleRemove: this.handleRemove,
      getUnit: this.getUnit,
      classification,
    };
    const { getFieldDecorator } = this.props.form;
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
          <Button type="primary" htmlType="submit" onClick={this.increase}>
            保存
          </Button>
          {
            userRole == 2 ? <Button style={{ border: "#2B49C4 1px solid", color: "#2B49C4" }} onClick={this.increase.bind(this, "PD")}>派单</Button> : null
          }
        </div>
        <div id="listTitleDetailTabEdit">
          <Form>
            <Tabs defaultActiveKey="1" type="card">
              <TabPane tab="工单信息" key="1">
                <AddInformation1 {...AddForms} />
              </TabPane>
              {/* <TabPane tab="工作过程" key="2">
                <AddCourse2 {...AddForms} />
              </TabPane> */}
            </Tabs>
          </Form>
        </div>
        {/* <canvas id="watermark" width={472} height={265} > */}
        {/* <canvas id="watermark" width={200} height={200} >
        </canvas> */}
      </div>
    );
  }
}

const Add = Form.create()(app);
export default Add;
