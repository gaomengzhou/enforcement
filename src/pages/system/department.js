import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Form,
  Row,
  Col,
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
} from 'antd';

import Header from "./departHeader";
import Body from "./departBody"
@connect(({ departmodels, loading }) => ({
  departmodels,
  loading: loading.models.departmodels,
}))
class app extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleMoal:false,
      setList:[],
      teams:[],
      departmentList:[],
    };
  }
  componentDidMount() {
  }
  showModal = () => {
    this.areaSet();
    this.teamList();
    this.setState({
      visibleMoal:true,
    })
  }
  // 获取片区设置数据
  areaSet = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'departmodels/areaSet',
      payload: {},
      callback: res => {
        if (res) {
          this.setState({
            setList:res.list,
          })
        }
      },
    });
  }
  // 获取下拉框数据信息
  teamList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'departmodels/teamList',
      payload: {},
      callback: res => {
        if (res) {
          this.setState({
            teams:res,
          })
        }
      },
    });
  }
  handleOk = (form) => {
    const departmentList = []; 
    const { validateFields, resetFields } = form;
    validateFields((errors, values) => {
      if (!errors) {
        values.squadronNum.map((k, index) => {
          if(k !== undefined){
            departmentList.push({"squadronNum":k,"id":index.toString()})
          }
        })
        const { dispatch } = this.props;
        dispatch({
          type: 'departmodels/update',
          payload: {
            "departmentList":departmentList,
          },
          callback: res => {
            if (res.retCode == 1) {
              message.success('操作成功');
            }else{
              message.error(res.retMsg);
            }
          },
        });
      }
    })
    this.setState({
      visibleMoal:false,
    })  
  }
  handleCancel = () => {
    this.setState({
      visibleMoal:false,
    })
  }
  render() {
    const {
      visibleMoal,
      teams,
      setList,
    } = this.state;
    const departHeader = {
      visibleMoal,
      showModal:this.showModal,
      handleCancel:this.handleCancel,
      handleOk: this.handleOk.bind(this),
      teams,
      setList,
    };
    const departBody = {
    };
    return (
      <div id="listTitleContent">
        <Header {...departHeader} />
        <Body {...departBody} />
      </div>
    )
  }
}

const department = Form.create()(app);
export default department;