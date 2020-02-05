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
const role = sessionStorage.getItem('userRole');

class app extends PureComponent {
  render() {
    const {
      workSource,
      eventCategory,
      caseSmallType,
      onSelect,
      DepartmentAssign,
      Search,
      reset,
      UrbanApartment,
    } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Breadcrumb separator=">">
          <span id="breadcrumbIcon" />
          <Breadcrumb.Item>工单派发</Breadcrumb.Item>
          <Breadcrumb.Item>部门派发</Breadcrumb.Item>
          <Breadcrumb.Item>城管工单</Breadcrumb.Item>
        </Breadcrumb>
        <div id="tableForm">
          <h3 id="listTitle">城管工单</h3>
          <div layout="inline">
            <Form layout="inline">
              <Row>
                <Col md={6} sm={8} style={{ paddingRight: 40 }}>
                  <FormItem label="案件编号">
                    {getFieldDecorator('workOrderId_S_LK')(<Input />)}
                  </FormItem>
                </Col>
                <Col md={6} sm={8} style={{ paddingRight: 40 }}>
                  <FormItem label="工单来源">
                    {getFieldDecorator('workOrderSource_S_EQ')(
                      <Select placeholder="全部" allowClear style={{ width: '100%' }}>
                        {workSource &&
                          workSource.map(item => {
                            return <Option value={item.code} key={item.code}>{item.desp}</Option>;
                          })}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col md={6} sm={8} style={{ paddingRight: 40 }}>
                  <FormItem label="案件大类">
                    {getFieldDecorator('caseBigType_S_EQ')(
                      <Select
                        placeholder="全部"
                        allowClear
                        style={{ width: '100%' }}
                        onSelect={onSelect}
                      >
                        {eventCategory &&
                          eventCategory.map(item => {
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
                  <FormItem label="案件小类">
                    {getFieldDecorator('caseSmallType_S_EQ')(
                      <Select placeholder="请先选择大类" allowClear style={{ width: '100%' }}>
                        {caseSmallType &&
                          caseSmallType.map(item => {
                            return <Option value={item.code} key={item.code}>{item.desp}</Option>;
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
                <Col md={6} sm={8} style={{ paddingRight: 40 }}>
                  <FormItem label="主办部门">
                    {getFieldDecorator('department_S_EQ')(
                      <Select placeholder="全部" allowClear style={{ width: '100%' }}>
                        {UrbanApartment &&
                          UrbanApartment.map(item => {
                            return <Option value={item.id} key={item.id}>{item.orgName}</Option>;
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
                              <Option value={item.code} key={item.code}>
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
              <Link to="/workOrder/department/inspectors/add">
                <Button
                  type="primary"
                  hidden={
                    sessionStorage.getItem('userRole') == '3' ||
                    sessionStorage.getItem('userRole') == '1'
                  }
                >
                  {' '}
                  新 增{' '}
                </Button>
              </Link>
              <Link to="/workOrder/department/inspectors/add?zcz">
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
              // hidden={
              //   sessionStorage.getItem('userRole') == '3' ||
              //   sessionStorage.getItem('userRole') == '1'
              // }
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
