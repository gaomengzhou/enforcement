import React, { PureComponent } from 'react';
import {
  Form,
  Breadcrumb,
  Row,
  Col,
  Input,
  Button,
  Table,
  Modal,
} from 'antd';
import { connect } from 'dva';

import zoneSetting from "./zoneSetting.less";

@connect(({ Parametermodels, loading }) => ({
  Parametermodels,
  loading: loading.models.Parametermodels,
}))
class app extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      userRole: sessionStorage.getItem('userRole'), // 身份
      dataSource: [], // 列表数据
      page: 1, // 列表查询所有数据
      pageSize: 10,
      setTableVisible: false, // 弹出框
      names: "",
      notes: "",
      values: "",
      ids: "",
    }
  }

  componentDidMount() {
    this.getList();
  }

  // 获取列表数据
  getList = (obj) => {
    const { dispatch } = this.props;
    const { page, pageSize } = this.state;
    dispatch({
      type: 'Parametermodels/getList',
      payload: {
        page,
        pageSize,
        obj,
      },
      callback: res => {
        if (res) {
          this.setState({ dataSource: res.list });
        }
      },
    });
  }


  // 查询
  Search = form => {
    const { getFieldsValue } = form;
    this.setState({ form })
    let values = getFieldsValue();
    values.name = "";
    values.note = "";
    values.value = "";
    this.setState({ form, page: 1 }, () => {
      this.getList(values);
    });
  };
  // 重置
  reset = form => {
    const { resetFields } = form;
    resetFields();
  };

  // 弹出框出来修改列表内容
  setTables = () => {
    const { validateFields } = this.props.form;
    const { dispatch } = this.props;
    validateFields((error, values) => {
      dispatch({
        type: 'Parametermodels/upListDate',
        payload: {
          name: values.name,
          note: values.note,
          value: values.value,
          id: this.state.ids,
        },
        callback: res => {
          if (res) {
            if (res.retCode == 1) {
              this.setState({ setTableVisible: false }, () => { this.getList() });
            }
          }
        },
      });
    })
  }

  // 点击弹出框
  mouseClick = v => {
    this.setState({
      setTableVisible: true,
      names: v.name,
      notes: v.note,
      values: v.value,
      ids: v.id,
    }, () => {
      const { names, notes, values } = this.state;
      this.props.form.setFieldsValue({
        name: names,
        note: notes,
        value: values,
      })
    })
  }

  render() {
    const {
      dataSource,
      userRole,
      names,
      notes,
      values,
    } = this.state

    const { getFieldDecorator } = this.props.form;
    const columns = [
      {
        title: '参数名称',
        dataIndex: 'name',
        render: (text, record) => {
          return (
            <a
              onClick={() => { this.mouseClick(record) }}
            >
              {text}
            </a>
          )
        },
      },
      {
        title: '参数说明',
        dataIndex: 'note',
      },
      {
        title: '参数值',
        dataIndex: 'value',
      },
    ]
    return (
      <div id="listTitleContent">
        <Breadcrumb separator=">">
          <span id="breadcrumbIcon" />
          <Breadcrumb.Item>系统配置</Breadcrumb.Item>
          <Breadcrumb.Item>综合执法参数管理</Breadcrumb.Item>
        </Breadcrumb>
        <div id="tableForm">
          <h3 id="listTitle">综合执法参数管理</h3>
          <div layout="inline">
            <Form layout="inline">
              <Row>
                <Col md={6} sm={8} style={{ paddingRight: 40 }}>
                  <Form.Item label="参数名称">
                    {getFieldDecorator('name_S_LK')(<Input placeholder="" />)}
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Col span={4} push={20}>
                    <Button
                      type="primary"
                      style={{ marginRight: 15 }}
                      onClick={() => { this.Search(this.props.form) }}
                    >
                      查询
                    </Button>
                    <Button
                      onClick={() => { this.reset(this.props.form) }}
                    >
                      重置
                    </Button>
                  </Col>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
        <div id="listTable">
          <Table
            rowSelection={{}}
            columns={columns}
            dataSource={dataSource}
          // pagination={pagination}
          // onChange={pageChange}
          />
        </div>
        <Modal
          title="编辑"
          visible={this.state.setTableVisible}
          onOk={this.setTables}
          onCancel={() => { this.setState({ names: "", notes: "", values: "", setTableVisible: false }) }}
        >
          <Form layout="inline">
            <Row className={zoneSetting.setUp}>
              <Col span={24}>
                <Form.Item label="参数名称" >
                  {getFieldDecorator('name', {
                    initialValue: names || "",
                  })(<Input disabled placeholder="" />)}
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="参数说明">
                  {getFieldDecorator('note', {
                    initialValue: notes || "",
                  })(<Input disabled placeholder="" />)}
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="参数值">
                  {getFieldDecorator('value', {
                    initialValue: values || "",
                  })(<Input placeholder="" />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div >
    )
  }
}

const Workplace = Form.create()(app);
export default Workplace;