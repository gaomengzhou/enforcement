import React, { PureComponent } from 'react';
import Link from 'umi/link';
import {
  Form,
  Radio,
} from 'antd';

import Header from './Header.js';
import Bodylist from './Bodylist.js';
import { connect } from 'dva';

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
      userRole: sessionStorage.getItem('userRole'), // 身份
      value: "3",
      dataSource: [], //列表数据
      page: 1, // 列表查询所有数据
      pageSize: 10,
      totalNumber: 10,
      DepartmentAssign: [], // 状态

    }
  }


  componentDidMount() {
    this.getList();
    this.getSelect("DepartmentAssign");
  }

  // 获取下拉框的值
  getSelect(groupCode) {
    const { dispatch } = this.props;
    dispatch({
      type: 'Communitymodels/getGroupCode',
      payload: { groupCode },
      callback: res => {
        if (res) {
          groupCode == 'DepartmentAssign' && this.setState({ DepartmentAssign: res });
        }
      },
    });
  }

  // 获取列表数据
  getList(obj) {
    const { dispatch } = this.props;
    const { page, pageSize, userRole } = this.state;
    dispatch({
      type: 'Communitymodels/getList',
      payload: {
        page,
        pageSize,
        userRole,
        obj,
      },
      callback: res => {
        if (res) {
          if (res.retCode == 1) {
            if (userRole == '1') {
              this.setState({
                dataSource: res.list.filter(item => item.isExamine == '1'),
                totalNumber: res.length,
              });
            } else {
              this.setState({ dataSource: res.list, totalNumber: res.length });
            }
          }
        }
      },
    });
  }
  // 查询
  Search = form => {
    // const { getFieldsValue } = form;
    // this.setState({ form })
    // const values = getFieldsValue();
    // if (values.createDate) {
    //   values.createDate_D_GE = moment(values.createDate).format('YYYY-MM-DD 00:00:00');
    //   values.createDate_D_LE = moment(values.createDate).format('YYYY-MM-DD 23:59:59');
    //   values.createDate = '';
    // }
    // if (values.createDate == null) {
    //   values.createDate = '';
    // }
    // this.setState({ form, page: 1, value: "3" }, () => {
    //   this.getList(values);
    // });
  };
  // 重置
  reset = form => {
    const { resetFields } = form;
    resetFields();
  };


  render() {
    const {
      userRole,
      dataSource,
      DepartmentAssign,
    } = this.state

    const DetailForms = {
    }
    const headForms = {
      userRole,
      Search: this.Search,
      reset: this.reset,
      DepartmentAssign,
    };
    const bodyForms = {
      dataSource,
    };

    return (
      <div id="listTitleContent" className="bigBox">
        <Header {...headForms} />
        <Bodylist {...bodyForms} />
        <div style={{ width: 400, position: 'relative', top: '-80px', left: '50px' }}>
          <Radio.Group onChange={this.onChange} value={this.state.value}>
            <Radio value="1">待处理</Radio>
            <Radio value="2">已处理</Radio>
            <Radio value="3">全部</Radio>
          </Radio.Group>
        </div>
      </div>
    )

  }
}

const Workplace = Form.create()(app);
export default Workplace;