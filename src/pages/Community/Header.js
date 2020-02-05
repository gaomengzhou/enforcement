import React, { PureComponent } from 'react';
import Link from 'umi/link';
import {
  Form,
  Row,
  Col,
  Input,
  Select,
  Button,
  Table,
  Radio,
  Tabs,
  Breadcrumb,
  DatePicker,
} from 'antd';

const FormItem = Form.Item;
const { Option } = Select;
const role = sessionStorage.getItem('userRole');

class app extends PureComponent {
  render() {
    const {
      userRole,
      Search,
      reset,
      DepartmentAssign,
    } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Breadcrumb separator=">">
          <span id="breadcrumbIcon" />
          <Breadcrumb.Item>工单流转</Breadcrumb.Item>
          <Breadcrumb.Item>社区流转</Breadcrumb.Item>
        </Breadcrumb>
        <div id="tableForm">
          <h3 id="listTitle">社区流转</h3>
          <div layout="inline">
            <Form layout="inline">
              <Row>
                <Col md={6} sm={8} style={{ paddingRight: 40 }}>
                  <FormItem label="巡查编号">
                    {getFieldDecorator('workOrderId_S_LK')(<Input placeholder="" />)}
                  </FormItem>
                </Col>
                <Col md={6} sm={8} style={{ paddingRight: 40 }}>
                  <FormItem label="诉求类型">
                    {getFieldDecorator('workSource_S_EQ')(
                      <Select placeholder="全部" allowClear style={{ width: '100%' }}>
                        <Option value="1">
                          垃圾问题
                        </Option>
                        <Option value="2">
                          物业问题
                        </Option>
                        <Option value="3">
                          消防问题
                        </Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col md={6} sm={8}>
                  <FormItem label="诉求内容" style={{ paddingRight: 40 }}>
                    {getFieldDecorator('taskClassify_S_EQ')(
                      <DatePicker placeholder="年 /月/日" style={{ width: '100%' }} />
                    )}
                  </FormItem>
                </Col>
                <Col md={6} sm={8}>
                  <FormItem label="状态">
                    {getFieldDecorator('status_S_EQ')(
                      <Select placeholder="全部" allowClear style={{ width: '100%' }}>
                        {DepartmentAssign &&
                          DepartmentAssign.map(item => {
                            return (
                              <Option value={item.code} key={item.code}>
                                {role == 2 && item.desp == '待上报' ? '' : item.desp}
                              </Option>
                            );
                          })}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col md={6} sm={8} style={{ paddingRight: 40 }}>
                  <FormItem label="创建时间">
                    {getFieldDecorator('createDate')(
                      <DatePicker placeholder="年 /月/日" style={{ width: '100%' }} />
                    )}
                  </FormItem>
                </Col>
                <Col md={6} sm={8}>
                  <FormItem label="所属社区" style={{ paddingRight: 40 }}>
                    {getFieldDecorator(`taskType_S_EQ`)(
                      <Select placeholder="全部" allowClear style={{ width: '100%' }}>
                        <Option value="1" key="1">
                          翠林山庄
                        </Option>
                        <Option value="2" key="2">
                          金尧花园
                        </Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col md={6} sm={8} style={{ paddingRight: 40 }}>
                  <FormItem label="诉求事发时间" style={{ width: '100%' }}>
                    {getFieldDecorator('organizeDepartment_S_EQ')(
                      <DatePicker placeholder="年 /月/日" style={{ width: '100%' }} />
                    )}
                  </FormItem>
                </Col>
                <Col md={6} sm={8}>
                  <FormItem label="至" style={{ width: '100%' }}>
                    {getFieldDecorator('status_S_EQ')(
                      <DatePicker placeholder="年 /月/日" style={{ width: '100%' }} />
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
                    <Button
                      onClick={reset.bind(this, this.props.form)}
                    >
                      重置
                    </Button>
                  </Col>
                </Col>
              </Row>
            </Form>
            <div id="listOperator">
              <Link to="/workOrder/community/add">
                <Button
                  type="primary"
                  hidden={userRole == 1 || userRole == 3}
                >
                  新增
                </Button>
              </Link>
              <Link to="/workOrder/community/add?zcz">
                <Button
                  type="primary"
                  hidden={sessionStorage.getItem('userRole') != 4}
                >
                  自处置
                </Button>
              </Link>
              <Button
                type="primary"
                disabled
                hidden
              >
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
