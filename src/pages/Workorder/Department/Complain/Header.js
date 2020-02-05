import React, { PureComponent } from 'react';
import Link from 'umi/link';
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
  message,
  Breadcrumb,
} from 'antd';
import styles from './Detail.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { Option } = Select;

class app extends PureComponent {
  render() {
    const { appealSource, UrbanApartment, Search, reset, LeaderAssign, userRole } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Breadcrumb separator=">">
          <span id="breadcrumbIcon" />
          <Breadcrumb.Item>工单派发</Breadcrumb.Item>
          <Breadcrumb.Item>部门派发</Breadcrumb.Item>
          <Breadcrumb.Item>投诉工单</Breadcrumb.Item>
        </Breadcrumb>
        <div id="tableForm">
          <h3 id="listTitle">投诉工单</h3>
          <div layout="inline">
            <Form layout="inline">
              <Row>
                <Col md={6} sm={8} style={{ paddingRight: 40 }}>
                  <FormItem label="工单编号">
                    {getFieldDecorator('workOrderId_S_LK')(<Input placeholder="请输入" />)}
                  </FormItem>
                </Col>
                <Col md={6} sm={8} style={{ paddingRight: 40 }}>
                  <FormItem label="诉求来源">
                    {getFieldDecorator('appealSource_S_EQ')(
                      <Select placeholder="请选择">
                        {appealSource &&
                          appealSource.map(item => (
                            <Option value={item.code} key={item.code}>
                              {item.desp}
                            </Option>
                          ))}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col md={6} sm={8} style={{ paddingRight: 40 }}>
                  <FormItem label="诉求内容">
                    {getFieldDecorator('appealContent_S_LK')(
                      <DatePicker placeholder="请选择" style={{ width: '100%' }} />
                    )}
                  </FormItem>
                </Col>
                <Col md={6} sm={8}>
                  <FormItem label="状态">
                    {getFieldDecorator('status_S_EQ')(
                      <Select placeholder="请选择" allowClear style={{ width: '100%' }}>
                        {LeaderAssign &&
                          LeaderAssign.map(item => (
                            <Option value={item.code} key={item.code}>
                              {item.desp}
                            </Option>
                          ))}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col md={6} sm={8} style={{ paddingRight: 40 }}>
                  <FormItem label="创建时间">
                    {getFieldDecorator('createDate')(
                      <DatePicker placeholder="请选择" style={{ width: '100%' }} />
                    )}
                  </FormItem>
                </Col>
                <Col md={6} sm={8} style={{ paddingRight: 40 }}>
                  <FormItem label="主办部门">
                    {getFieldDecorator('organizeDepartment_S_EQ')(
                      <Select placeholder="请选择" allowClear style={{ width: '100%' }}>
                        {UrbanApartment &&
                          UrbanApartment.map(item => (
                            <Option value={item.id} key={item.id}>
                              {item.orgName}
                            </Option>
                          ))}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col md={6} sm={8} style={{ paddingRight: 40 }}>
                  <FormItem label="诉求事发时间" style={{ width: '100%' }}>
                    {getFieldDecorator('appealHappenTime_D_GE')(
                      <DatePicker placeholder="请选择" style={{ width: '100%' }} />
                    )}
                  </FormItem>
                </Col>
                <Col md={6} sm={8}>
                  <FormItem label="至" style={{ width: '100%' }}>
                    {getFieldDecorator('deadline_D_GE')(
                      <DatePicker placeholder="请选择" style={{ width: '100%' }} />
                    )}
                  </FormItem>
                </Col>
                <Col span={24}>
                  <Col span={4} push={20}>
                    <Button
                      type="primary"
                      style={{ marginRight: 15 }}
                      onClick={Search.bind(this, this.props.form)}
                    >
                      查询
                    </Button>
                    <Button onClick={reset.bind(this, this.props.form)}>重置</Button>
                  </Col>
                </Col>
              </Row>
            </Form>
            <div id="listOperator">
              <Link to="/workOrder/department/complain/add">
                <Button
                  type="primary"
                  hidden={userRole != 2}
                >
                  新增
                </Button>
              </Link>
              <Button type="primary" disabled hidden>
                结案
              </Button>
              <Button type="primary" disabled hidden>
                派遣
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
