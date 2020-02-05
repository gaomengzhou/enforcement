/* eslint-disable func-names */
/* eslint-disable react/sort-comp */
/* eslint-disable react/no-unused-state */
/* eslint-disable eqeqeq */
/* eslint-disable no-unused-expressions */
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
import AddForm from './AddForm';
import { picIp } from '@/utils/ipConfig';

const Formats = 'YYYY-MM-DD HH:mm:ss';

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

@connect(({ Inspectorsmodels, loading }) => ({
  Inspectorsmodels,
  loading: loading.models.Inspectorsmodels,
}))
class app extends Component {
  constructor(props) {
    super(props);
    this.state = {
      increasingList: [],
      parentBank: [], // 所属分行
      gridList: [], // 所属网格
      processProgram: [], // 处理程序
      workLevel: [], // 问题级别
      workDestructionDegree: [], // 破坏程度
      workImpactScope: [], // 影响范围
      eventCategory: [], // 案件大类
      caseSmallType: [], // 案件小类
      parentId: '', // 案件大类的parentId用于更新案件小类的下拉框数据
      UrbanApartment: [], // 主办部门
      previewVisible: false,
      previewImage: '',
      fileList: [],
      fileListTwo: [],
      uploading: false,
      filePath: '',
      filePathTwo: "",
      leadership: [], // 处置人员
      iframeSrc: "", // 地图地址
      x: "", // 地图x轴
      y: "", // 地图y轴
      mapBox: false, // 地图弹出框
      unit: "1", // 处置时限--小时，天
      addZCZ: window.location.href.split('?')[window.location.href.split('?').length - 1], // 是否自处置
      isDetail: window.location.href.split('/')[window.location.href.split('/').length - 3], // 是否详情页
      newgridList: [], // 网格
    };
  }

  // 新增&&派单--工单保存
  increase = (form, type) => {
    const { validateFields } = form;
    // prePicture,
    const { fileList, filePath, filePathTwo, addZCZ } = this.state;
    const { dispatch } = this.props;
    let url = ''
    if (type == 'PD') {
      if (sessionStorage.getItem('userRole') == '4') {
        url = 'Inspectorsmodels/reportedData';
      } else {
        url = 'Inspectorsmodels/systemDispatch';
      }
    } else if (type == 'ZCZ') {
      url = 'Inspectorsmodels/self';
    } else {
      url = 'Inspectorsmodels/save';
    }
    validateFields((error, values) => {
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
      values.x = this.state.x;
      values.y = this.state.y;
      type == 'PD' && (values.a = "1");
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

  // 获取下拉框的值
  getSelect(groupCode) {
    const { dispatch } = this.props;
    dispatch({
      type: 'Inspectorsmodels/getGroupCode',
      payload: { groupCode },
      callback: res => {
        if (res) {
          groupCode == 'parentBank' && this.setState({ parentBank: res });
          groupCode == 'processProgram' && this.setState({ processProgram: res });
          groupCode == 'workLevel' && this.setState({ workLevel: res });
          groupCode == 'workDestructionDegree' && this.setState({ workDestructionDegree: res });
          groupCode == 'workImpactScope' && this.setState({ workImpactScope: res });
          groupCode == 'eventCategory' && this.setState({ eventCategory: res });
          groupCode == 'partsCategory' && this.setState({ eventCategory: res });
          // groupCode == 'eventCategory' && this.setState({ eventCategory: res.filter(item => item.code % 100 == 0) });
          // groupCode == 'partsCategory' && this.setState({ eventCategory: res.filter(item => item.code % 100 == 0) });
        }
      },
    });
  }

  // 获取网格
  getGrid = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'Inspectorsmodels/getGrid',
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

  // 获取 处置时限--小时，天
  getUnit = e => {
    this.setState({
      unit: e
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

  // 事件，部件
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
        { parentId: key.key },
        () => {
          const { parentId } = this.state;
          this.getcaseSmallType(parentId);
        }
      );
    }
  };

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

  // 整改后删除图片
  handleRemoveTwo = file => {
    this.setState(state => {
      const index = state.fileListTwo.indexOf(file);
      const newFileList = state.filePathTwo;
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
      const newFileList = state.filePath;
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

  componentDidMount() {
    this.getSelect('parentBank');
    this.getSelect('processProgram');
    this.getSelect('workLevel');
    this.getSelect('workDestructionDegree');
    this.getSelect('workImpactScope');
    this.getSelect('eventCategory');
    this.getUrbanApartment();
    this.getGrid();
  }

  render() {
    const {
      parentBank,
      processProgram,
      workLevel,
      workDestructionDegree,
      workImpactScope,
      eventCategory,
      caseSmallType,
      UrbanApartment,
      fileList,
      filePath,
      filePathTwo,
      fileListTwo,
      leadership,
      previewVisible,
      previewImage,
      gridList,
      mapBox,
      iframeSrc,
      addZCZ,
      newgridList,
    } = this.state;
    const addforms = {
      increase: this.increase,
      workImpactScope,
      parentBank,
      processProgram,
      workLevel,
      workDestructionDegree,
      eventCategory,
      onSelect: this.onSelect,
      bigClass: this.bigClass,
      caseSmallType,
      UrbanApartment,
      handlePreview: this.handlePreview,
      fileList,
      gridList,
      filePath,
      filePathTwo,
      fileListTwo,
      leadership,
      previewImage,
      previewVisible,
      handleChange: this.handleChange,
      handleChangeTwo: this.handleChangeTwo,
      handleRemove: this.handleRemove,
      handleRemoveTwo: this.handleRemoveTwo,
      handleCancel: this.handleCancel,
      UrbanApartmentSelect: this.UrbanApartmentSelect,
      showMap: this.showMap,
      mapBox,
      iframeSrc,
      getSrc: this.getSrc,
      getUnit: this.getUnit,
      addZCZ,
      communityGrid: this.communityGrid,
      newgridList,
    };
    return (
      <div id="listTitleContent">
        <Breadcrumb separator=">">
          <span id="breadcrumbIcon" />
          <Breadcrumb.Item>工单派发</Breadcrumb.Item>
          <Breadcrumb.Item>部门派发</Breadcrumb.Item>
          <Breadcrumb.Item>新城管工单</Breadcrumb.Item>
          <Breadcrumb.Item>新增</Breadcrumb.Item>
        </Breadcrumb>
        <AddForm {...addforms} />
      </div>
    );
  }
}

const Add = Form.create()(app);
export default Add;
