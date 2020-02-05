/* eslint-disable react/jsx-no-bind */
/* eslint-disable func-names */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-expressions */
/* eslint-disable eqeqeq */
import React, { PureComponent } from 'react';
import moment from 'moment';
import {
  Form,
  Button,
  Tabs,
  message,
  Icon,
  Breadcrumb,
} from 'antd';

import { connect } from 'dva';
import AddInformation1 from './AddInformation1';

const Formats = 'YYYY-MM-DD HH:mm:ss';
const { TabPane } = Tabs;

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
      uploading: false, // 附件
      previewVisible: false,
      previewImage: '',
      fileList: [],
      filePath: '',
      appealTypes: [], // 诉求类型
      majorEmergencyMatters: [], // 紧急重大类事项
      appealSource: [], // 诉求来源
      returnType: [], // 回访类型
      gender: [], // 性别
      leadership: [], // 承办人员
      parentBank: [], // 所属分行（社区）
      UrbanApartment: [], // 主办部门
      LeadersInCharge: [], // 分管领导
      userRole: sessionStorage.getItem('userRole'), // 身份id
      summaryCasesList: [], // 归口类型
      unit: "1", // 处置时限--小时，天
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

  // 保存 派单
  increase = type => {
    const { validateFields } = this.props.form;
    const { dispatch } = this.props;
    const { filePath } = this.state;
    const url = type == 'PD' ? 'Complainmodels/systemDispatch' : 'Complainmodels/save';
    validateFields((error, values) => {
      if (error) {
        return;
      }
      const dispatchVos = [];
      values.appealHappenTime &&
        (values.appealHappenTime = moment(values.appealHappenTime).format(Formats));
      values.appealTime && (values.appealTime = moment(values.appealTime).format(Formats));
      if (values.organizeDepartment) {
        const json = {
          assistDepartment: values.organizeDepartment,
          assistTime: values.assistTime,
          executor: values.executor,
          unit: this.state.unit,
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

  // 主办部门选中项变化的回调
  UrbanApartmentSelect = (value) => {
    const { resetFields } = this.props.form;
    resetFields(['leadership', 'executor'])
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

  // 附件
  // 关闭预览图片框
  handleCancel = () => this.setState({ previewVisible: false });

  // 打开预览图片框
  handlePreview = async (f, file) => {
    const that = this;
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    const watermark = document.createElement('canvas');
    watermark.width = 533;
    watermark.height = 300;
    const imgs = new Image();
    const timer = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    imgs.width = 533;
    imgs.height = 300;
    imgs.src = file.url || file.preview;
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

  // 上传图片
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

  render() {
    const {
      uploading,
      previewVisible,
      previewImage,
      fileList,
      filePath,
      appealTypes,
      majorEmergencyMatters,
      appealSource,
      returnType,
      gender,
      parentBank,
      UrbanApartment,
      LeadersInCharge,
      leadership,
      userRole,
      summaryCasesList,
    } = this.state;
    const AddForms = {
      form: this.props.form,
      uploading,
      previewVisible,
      previewImage,
      fileList,
      filePath,
      appealTypes,
      majorEmergencyMatters,
      appealSource,
      returnType,
      gender,
      parentBank,
      UrbanApartment,
      LeadersInCharge,
      handlePreview: this.handlePreview,
      handleChange: this.handleChange,
      handleCancel: this.handleCancel,
      handleRemove: this.handleRemove,
      leadership,
      UrbanApartmentSelect: this.UrbanApartmentSelect.bind(this),
      summaryCasesList,
      getUnit: this.getUnit,
    };
    return (
      <div id="listTitleContent">
        <Breadcrumb separator=">">
          <span id="breadcrumbIcon" />
          <Breadcrumb.Item>工单派发</Breadcrumb.Item>
          <Breadcrumb.Item>部门派发</Breadcrumb.Item>
          <Breadcrumb.Item>投诉工单</Breadcrumb.Item>
          <Breadcrumb.Item>新增</Breadcrumb.Item>
        </Breadcrumb>
        <div id="listTitleDetailBanner">
          <h3>新增</h3>
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
          <Button style={{ marginRight: 10 }} type="primary" htmlType="submit" onClick={this.increase}>
            保存
          </Button>
          {userRole == 4 ? (
            <Button style={{ marginRight: 10, border: "#2B49C4 1px solid", color: "#2B49C4" }} onClick={this.increase.bind(this, 'PD')}>
              上报
            </Button>
          ) : null}
          {userRole == 2 ? (
            <Button style={{ marginRight: 10, border: "#2B49C4 1px solid", color: "#2B49C4" }} onClick={this.increase.bind(this, 'PD')}>
              派单
            </Button>
          ) : null}
        </div>
        <div
          id="listTitleDetailTabEdit"
        >
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
      </div>
    );
  }
}

const Add = Form.create()(app);
export default Add;
