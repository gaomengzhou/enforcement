/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import {
  Modal,
  Pagination,
  Row,
  Col,
  Icon,
  Form,
  Select,
  Button,
  Input,
  Radio,
  DatePicker,
  Breadcrumb,
  TreeSelect,
  message,
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import AddForm from './components/AddForm';

const Formats = 'YYYY-MM-DD HH:mm:ss';

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
      parentBank: [], // 所属分行
      workOrderCategory: [], // 工单类别
      UrbanApartment: [], // 主办部门
      previewVisible: false,
      previewImage: '',
      fileList: [],
      fileListTwo: [],
      uploading: false,
      filePath: '',
      filePathTwo: "",
      leadership: [], // 处置人员
      gridList: [], // 所属网格
      mapBox: false, // 地图弹出框
      iframeSrc: "", // 地图地址
      x: "", // 地图x轴
      y: "", // 地图y轴
      // unit: "1", // 处置时限--小时，天
      unit: [], // 处置时限--小时，天
      rightMatterList: [], // 权力编码
      addZCZ: window.location.href.split('?')[window.location.href.split('?').length - 1], // 是否自处置
      isManageFlag: [], // 领导决定处置时间
      becomeMultiFlag: false, // 多选标识
      newgridList: [], // 网格
      handleSearchList: [], // 企业列表
      handleSearchLength: "", // 企业编号的下标
    };
  }
  // 获取 处置时限--小时，天
  getUnit = (i, e) => {
    const unitList = this.state.unit;
    unitList[i] = e;
    this.setState({
      unit: unitList
    })
  }

  // 工单类别变成多选
  becomeMulti = (value, key) => {
    const that = this
    key.key == "综合类" && this.setState({
      becomeMultiFlag: true
    })
  }

  // 工单类别变成单选
  canleBecomeMulti = (form, value, key) => {
    key.key == "综合类" && this.setState({
      becomeMultiFlag: false
    }, () => {
      form.setFieldsValue({
        workOrderType: "",
      })
    })
  }

  // 社区，网格联动
  communityGrid = (value, key) => {
    let newgridList = this.state.gridList.filter(item => item.name.indexOf(key.key) != -1);
    this.setState({
      newgridList,
    })
  }

  // 领导决定处置时间
  isManageChange = (i, form, e) => {
    const isIWantGoHome = this.state.isManageFlag;
    isIWantGoHome[i] = e.target.checked;
    if (e.target.checked) {
      const valueList = [];
      valueList[i] = "";
      form.setFieldsValue({
        assistTime: valueList,
      })
    }
  }

  // 新增&&派单--工单保存
  increase = (form, type) => {
    const { validateFields } = form;
    // prePicture,
    const { fileList, filePath, filePathTwo, addZCZ } = this.state;
    const { dispatch } = this.props;
    let url = '';
    if (type == 'PD') {
      if (sessionStorage.getItem('userRole') == '4') {
        url = 'compmodels/reportedData';
      } else {
        url = 'compmodels/systemDispatch';
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
      const dispatchVos = [];
      if (values.assistDepartment) {
        for (let i = 0; i < values.assistDepartment.length; i++) {
          const json = {
            assistDepartment: values.assistDepartment[i],
            assistTime: values.assistTime[i],
            assistWorker: values.assistWorker[i],
            unit: this.state.unit[i] == 2 ? this.state.unit[i] : "1",
            isManage: values.isManage[i] ? "1" : "0",
          };
          dispatchVos.push(json);
        }
      }
      url == 'compmodels/reportedData' ? undefined : (values.dispatchVos = dispatchVos);
      values.keys && (values.keys = undefined);
      values.assistDepartment && (values.assistDepartment = undefined);
      values.assistTime && (values.assistTime = undefined);
      values.assistWorker && (values.assistWorker = undefined);
      values.isManage && (values.isManage = undefined);
      values.workOrderSource = '1';
      values.x = this.state.x;
      values.y = this.state.y;
      type == 'PD' && (values.a = "1");
      values.incidentDate && (values.incidentDate = moment(values.incidentDate).format(Formats));
      filePath && (values.prePicture = filePath.join(','));
      filePathTwo && (values.proPicture = filePathTwo.join(','));
      (type == 'ZCZ' && addZCZ == "zcz") && (values.selfDisposal = '1');
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

  // 权力编码
  getRightMatter = (e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'compmodels/rightMatter',
      payload: {},
      callback: res => {
        if (res) {
          this.setState({ rightMatterList: res.list });
        }
      },
    });
  }

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

  // 获取地图地址
  getSrc = v => {
    const lengths = this.state.gridList[v - 1];
    this.setState({
      x: lengths.x,
      y: lengths.y,
      iframeSrc: `http://58.213.107.106:60019/dcs_dataShow/pages/datashow/gridQuery.html?${v}&${lengths.x}&${lengths.y}`
    });
  };

  // 查看地图
  showMap = v => {
    this.setState({
      mapBox: true,
    });
  };

  // 企业搜索
  handleSearch = e => {
    this.props.dispatch({
      type: 'compmodels/enterpriseOrganization',
      payload: { partiesUsername: e },
      callback: res => {
        console.log(res)
        if (res) {
          this.setState({ handleSearchList: res });
        }
      },
    });
  }
  // 企业联动 证件号码
  onEnterprise = e => {
    for (let w in this.state.handleSearchList) {
      if (this.state.handleSearchList[w].partiesUsername == e) {
        this.setState({
          handleSearchLength: this.state.handleSearchList[w].identificationNum
        })
      }
    }
    // let www = this.state.handleSearchList.forEach((item, i) => { if (item.partiesUsername == e) { return i } })
  }

  // 获取下拉框的值
  getSelect(groupCode) {
    const { dispatch } = this.props;
    dispatch({
      type: 'compmodels/getGroupCode',
      payload: { groupCode },
      callback: res => {
        if (res) {
          groupCode == 'parentBank' && this.setState({ parentBank: res });
          groupCode == 'workOrderCategory' && this.setState({ workOrderCategory: res });
        }
      },
    });
  }

  // 获取主办部门
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

  // 关闭预览图片框
  handleCancel = () => this.setState({ previewVisible: false, mapBox: false });

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
              type: 'compmodels/watermarks',
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
              type: 'compmodels/watermarks',
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
      const index = state.fileListTwo.indexOf(file);
      let newFileList = state.filePathTwo;
      newFileList && newFileList.reverse().splice(index, 1);
      return {
        filePathTwo: newFileList,
      };
    });
  };

  componentDidMount() {
    this.getSelect('parentBank');
    this.getSelect('workOrderCategory');
    this.getUrbanApartment();
    this.getGrid();
    this.getRightMatter();
  }

  render() {
    const {
      parentBank,
      workOrderCategory,
      UrbanApartment,
      fileList,
      leadership,
      previewVisible,
      previewImage,
      gridList,
      mapBox,
      iframeSrc,
      rightMatterList,
      addZCZ,
      fileListTwo,
      filePathTwo,
      isManageFlag,
      unit,
      becomeMultiFlag,
      newgridList,
      handleSearchList,
      handleSearchLength,
    } = this.state;
    const addforms = {
      increase: this.increase,
      parentBank,
      workOrderCategory,
      onSelect: this.onSelect,
      UrbanApartment,
      handlePreview: this.handlePreview,
      fileList,
      gridList,
      leadership,
      previewImage,
      previewVisible,
      mapBox,
      showMap: this.showMap,
      getSrc: this.getSrc,
      handleChange: this.handleChange,
      handleChangeTwo: this.handleChangeTwo,
      handleRemove: this.handleRemove,
      handleRemoveTwo: this.handleRemoveTwo,
      handleCancel: this.handleCancel,
      UrbanApartmentSelect: this.UrbanApartmentSelect,
      iframeSrc,
      unit,
      getUnit: this.getUnit,
      rightMatterList,
      addZCZ,
      fileListTwo,
      filePathTwo,
      isManageFlag,
      isManageChange: this.isManageChange,
      becomeMulti: this.becomeMulti,
      canleBecomeMulti: this.canleBecomeMulti,
      communityGrid: this.communityGrid,
      newgridList,
      becomeMultiFlag,
      onEnterprise: this.onEnterprise,
      handleSearchList,
      handleSearch: this.handleSearch,
      handleSearchLength,
    };
    return (
      <div id="listTitleContent">
        <Breadcrumb separator=">">
          <span id="breadcrumbIcon" />
          <Breadcrumb.Item>工单派发</Breadcrumb.Item>
          <Breadcrumb.Item>部门派发</Breadcrumb.Item>
          <Breadcrumb.Item>综合执法</Breadcrumb.Item>
          <Breadcrumb.Item>新增</Breadcrumb.Item>
        </Breadcrumb>
        <AddForm {...addforms} />
      </div>
    );
  }
}

const Add = Form.create()(app);
export default Add;
