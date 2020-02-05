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
import styles from '../Detail.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { Option } = Select;
const role = sessionStorage.getItem('userRole');

class app extends PureComponent {
  render() {
    const {
      eventCategory,
      caseSmallType,
      onSelect,
      DepartmentAssign,
      Search,
      reset,
      UrbanApartment,
      workSource,
      workOrderCategory,
      userRole,
    } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Breadcrumb separator=">">
          <span id="breadcrumbIcon" />
          <Breadcrumb.Item>工单派发</Breadcrumb.Item>
          <Breadcrumb.Item>部门派发</Breadcrumb.Item>
          <Breadcrumb.Item>综合执法</Breadcrumb.Item>
        </Breadcrumb>
        <div id="tableForm">
          <h3 id="listTitle">综合执法</h3>
          <div layout="inline">
            <Form layout="inline">
              <Row>
                <Col md={6} sm={8} style={{ paddingRight: 40 }}>
                  <FormItem label="工单编号">
                    {getFieldDecorator('workOrderId_S_LK')(<Input />)}
                  </FormItem>
                </Col>
                <Col md={6} sm={8} style={{ paddingRight: 40 }}>
                  <FormItem label="工单来源">
                    {getFieldDecorator('workOrderSource_S_EQ')(
                      <Select placeholder="全部" allowClear style={{ width: '100%' }}>
                        {workSource &&
                          workSource.map(item => {
                            return (
                              <Option value={item.code}>
                                {item.desp == '市级菜单' ? '' : item.desp}
                              </Option>
                            );
                          })}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col md={6} sm={8} style={{ paddingRight: 40 }}>
                  <FormItem label="工单类别">
                    {getFieldDecorator('workOrderType_S_EQ')(
                      <Select
                        placeholder="全部"
                        allowClear
                        style={{ width: '100%' }}
                        onSelect={onSelect}
                      >
                        {workOrderCategory &&
                          workOrderCategory.map(item => {
                            return (
                              <Option key={item.code} value={item.code}>
                                {item.desp}
                              </Option>
                            );
                          })}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col md={6} sm={8}>
                  <FormItem label="事发时间">
                    {getFieldDecorator('incidentDate')(
                      <DatePicker placeholder="年 /月/日" style={{ width: '100%' }} />
                    )}
                  </FormItem>
                </Col>
                <Col md={6} sm={8} style={{ paddingRight: 40 }}>
                  <FormItem label="主办部门">
                    {getFieldDecorator('assistDepartment_S_EQ')(
                      <Select placeholder="全部" allowClear style={{ width: '100%' }}>
                        {UrbanApartment &&
                          UrbanApartment.map(item => {
                            return <Option value={item.id}>{item.orgName}</Option>;
                          })}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col md={6} sm={8} style={{ paddingRight: 40 }}>
                  <FormItem label="状态" style={{ width: '100%' }}>
                    {getFieldDecorator('status_S_EQ')(
                      <Select placeholder="全部" allowClear style={{ width: '100%' }}>
                        {DepartmentAssign &&
                          DepartmentAssign.map(item => {
                            return (
                              <Option value={item.code}>
                                {role == 2 && item.desp == '待上报' ? '' : item.desp}
                              </Option>
                            );
                          })}
                      </Select>
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
              <Link to="/workOrder/department/comprehensive/add">
                <Button
                  type="primary"
                  hidden={userRole != 2 && userRole != 4}
                >
                  新 增
                </Button>
              </Link>
              <Link to="/workOrder/department/comprehensive/add?zcz">
                <Button
                  type="primary"
                  hidden={userRole != 4}
                >
                  自处置
                </Button>
              </Link>
              <Button
                type="primary"
                // hidden={userRole != 2 && userRole != 4}
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
