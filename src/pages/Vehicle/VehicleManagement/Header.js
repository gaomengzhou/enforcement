import React, { PureComponent } from 'react';
import {
  Row,
  Col,
  Form,
  Button,
  Table,
  Radio,
  Modal,
  Icon,
  Input,
  Pagination,
  message,
  Breadcrumb,
  Popconfirm,
} from 'antd';


const FormItem = Form.Item;
const RadioGroup = Radio.Group;


class app extends PureComponent {
  render() {
    const { showModal, form, query, reset, deleteList } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Breadcrumb separator=">">
          <span id="breadcrumbIcon" />
          <Breadcrumb.Item>日常管理</Breadcrumb.Item>
          <Breadcrumb.Item>车辆管理</Breadcrumb.Item>
          <Breadcrumb.Item>车辆管理</Breadcrumb.Item>
        </Breadcrumb>
        <div id="tableForm">
          <h3 id="listTitle">车辆管理</h3>
          <div layout="inline">
            <Form layout="inline">
              <Row gutter={{ md: 24, lg: 32 }}>
                <Col md={7} sm={9}>
                  <FormItem label="车辆编号">
                    {getFieldDecorator('carNo')(<Input placeholder="请输入" />)}
                  </FormItem>
                </Col>
                <Col md={6} sm={8}>
                  <FormItem label="车架号">
                    {getFieldDecorator('frameId')(<Input placeholder="请输入" />)}
                  </FormItem>
                </Col>
                <Col md={6} sm={8}>
                  <FormItem label="车辆型号">
                    {getFieldDecorator('model')(<Input placeholder="请输入" />)}
                  </FormItem>
                </Col>
                <Col span={24}>
                  <Col span={7} push={17}>
                    <Button
                      type="primary"
                      style={{ marginRight: 15 }}
                      onClick={query.bind(null, this.props.form)}
                    >
                      查询
                    </Button>
                    <Button onClick={reset.bind(null, this.props.form)}
                    >清空</Button>
                  </Col>
                </Col>
              </Row>
            </Form>
            <div id="listOperator">
              <Button type="primary" onClick={showModal.bind(this, 'add')}>新增</Button>
              <Button
                hidden
                type="primary"
              >
                导入
              </Button>
              <Button
                hidden
                type="primary"
              >
                导出
                </Button>
              <Button
                hidden
                type="primary"
              >
                导出全部
              </Button>
              <Popconfirm
                onConfirm={deleteList.bind(this)}
                title="你确定要删除吗？删除将不能恢复！"
                okText="确定"
                cancelText="取消"
              >
                <Button type="primary">删除</Button>
              </Popconfirm>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const Header = Form.create()(app);
export default Header;
