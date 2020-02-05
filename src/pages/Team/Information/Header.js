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
} from 'antd';


const FormItem = Form.Item;


class app extends PureComponent {
  render() {
    const { form, query, reset, } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Breadcrumb separator=">">
          <span id="breadcrumbIcon" />
          <Breadcrumb.Item>日常管理</Breadcrumb.Item>
          <Breadcrumb.Item>队员管理</Breadcrumb.Item>
          <Breadcrumb.Item>队员信息</Breadcrumb.Item>
        </Breadcrumb>
        <div id="tableForm">
          <h3 id="listTitle">队员信息</h3>
          <div layout="inline">
            <Form layout="inline">
              <Row gutter={{ md: 24, lg: 32 }}>
                <Col md={7} sm={9}>
                  <FormItem label="队员编号">
                    {getFieldDecorator('id')(<Input placeholder="请输入" />)}
                  </FormItem>
                </Col>
                <Col md={6} sm={8}>
                  <FormItem label="队员姓名">
                    {getFieldDecorator('name')(<Input placeholder="请输入" />)}
                  </FormItem>
                </Col>
                <Col md={6} sm={8}>
                  <FormItem label="联系电话">
                    {getFieldDecorator('phone')(<Input placeholder="请输入" />)}
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
              <Button
                type="primary"
                hidden
              >
                导出
                </Button>
              <Button
                hidden
                type="primary"
              >
                导出全部
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const Header = Form.create()(app);
export default Header;
