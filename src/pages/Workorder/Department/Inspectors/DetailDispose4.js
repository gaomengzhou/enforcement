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
  Divider,
} from 'antd';
import styles from './Detail.less';
import moment from 'moment';

const FormItem = Form.Item;

class app extends PureComponent {
  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      dataSourceDispose,
    } = this.props;
    return (
      <div id="tableListForm" style={{ background: '#fff', paddingBottom: 28 }}>
        <Row>
          <Col span={16}>
            {/* 任务派遣 */}
            <div id="tableListForm" style={{ padding: '0 10px 0 0' }}>
              <Col span={24}>
                <h3 style={{ padding: "20px 0 12px 40px" }}>任务派遣</h3>
              </Col>
              <Row style={{ marginLeft: 0 }} gutter={{ xl: 8, xxl: 40 }}>
                <Col span={24}>
                  <Col span={12}>
                    <FormItem label="案卷号">
                      {getFieldDecorator("filesId", {
                        initialValue: dataSourceDispose ? dataSourceDispose.filesId : "",
                      })(
                        <Input
                          disabled
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="截止时间">
                      {getFieldDecorator("deadDate",
                        Object.assign({}, dataSourceDispose.deadDate ? { initialValue: moment(dataSourceDispose) } : ""),
                      )(
                        <DatePicker
                          placeholder=""
                          style={{ width: '100%' }}
                          format="YYYY-MM-DD HH:mm:ss"
                          allowClear
                          disabled
                        />
                      )}
                    </FormItem>
                  </Col>
                </Col>
                <Col span={24}>
                  <Col span={12}>
                    <FormItem label="派遣类型">
                      {getFieldDecorator("dispatch", {
                        initialValue: dataSourceDispose ? dataSourceDispose.dispatchTypeDesc : "",
                      })(
                        <Input
                          disabled
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="主责部门">
                      {getFieldDecorator("principalDepartments", {
                        initialValue: dataSourceDispose ? dataSourceDispose.principalDepartmentsDesc : "",
                      })(
                        <Input
                          disabled
                        />
                      )}
                    </FormItem>
                  </Col>
                </Col>
                <Col span={24}>
                  <Col span={12}>
                    <FormItem label="协办部门">
                      {getFieldDecorator("assistDepartmentF", {
                        initialValue: dataSourceDispose ? dataSourceDispose.assistDepartment : "",
                      })(
                        <Input
                          disabled
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="处置要求">
                      {getFieldDecorator("disposalRequirements", {
                        initialValue: dataSourceDispose ? dataSourceDispose.disposalRequirements : "",
                      })(
                        <Input
                          disabled
                        />
                      )}
                    </FormItem>
                  </Col>
                </Col>
                <Col span={24}>
                  <Col span={12}>
                    <FormItem label="备注">
                      {getFieldDecorator("remark", {
                        initialValue: dataSourceDispose ? dataSourceDispose.remark : "",
                      })(
                        <Input
                          disabled
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="派遣人">
                      {getFieldDecorator("dispatchUserId", {
                        initialValue: dataSourceDispose ? dataSourceDispose.dispatchUserId : "",
                      })(
                        <Input
                          disabled
                        />
                      )}
                    </FormItem>
                  </Col>
                </Col>
                <Col span={24}>
                  <Col span={12}>
                    <FormItem label="派遣时间">
                      {getFieldDecorator("dispatchDate",
                        Object.assign({}, dataSourceDispose.dispatchDate ? { initialValue: moment(dataSourceDispose.dispatchDate) } : { initialValue: "" }),
                      )(
                        <DatePicker
                          placeholder=""
                          style={{ width: '100%' }}
                          format="YYYY-MM-DD HH:mm:ss"
                          allowClear
                          disabled
                        />
                      )}
                    </FormItem>
                  </Col>
                </Col>
              </Row>
            </div>
          </Col>
          {/* 附件 */}
          <Col span={8} >
            <div id="tableListForm" style={{ padding: '0 40px 0 10px' }}>
              <Col span={24}>
                <h3 style={{ padding: "20px 0 11px 0" }}>附件清单</h3>
              </Col>
              <Col span={12} style={{ margin: "10px 0", borderRight: "solid 1px #DEE4EC", paddingRight: 19, position: "relative" }}>
                <Col span={10}><h5 style={{ fontSize: 14, fontWeight: 600, margin: 0, marginBottom: 11 }}>整改前</h5></Col>
              </Col>
              <Col span={12} style={{ margin: "10px 0", paddingLeft: 20, position: "relative" }}>
                <h5 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>整改后</h5>
              </Col>
            </div>
          </Col>
        </Row>
        {/* <div id="caseInfo" style={{ marginTop: 18 }}>
          <Form>
            <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
              <Col lg={8} md={12} sm={24}>
                <FormItem label="案卷号">
                  {getFieldDecorator("filesId", {
                    initialValue: dataSourceDispose ? dataSourceDispose.filesId : "",
                  })(
                    <Input
                      disabled
                    />
                  )}
                </FormItem>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <FormItem label="截止时间">
                  {getFieldDecorator("deadDate",
                    Object.assign({}, { initialValue: dataSourceDispose ? moment(dataSourceDispose.deadDate) : "" }),
                  )(
                    <DatePicker
                      placeholder=""
                      style={{ width: '100%' }}
                      format="YYYY-MM-DD HH:mm:ss"
                      allowClear
                      disabled
                    />
                  )}
                </FormItem>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <FormItem label="派遣类型">
                  {getFieldDecorator("dispatch", {
                    initialValue: dataSourceDispose ? dataSourceDispose.dispatchType : "",
                  })(
                    <Input
                      disabled
                    />
                  )}
                </FormItem>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <FormItem label="主责部门">
                  {getFieldDecorator("principalDepartments", {
                    initialValue: dataSourceDispose ? dataSourceDispose.principalDepartments : "",
                  })(
                    <Input
                      disabled
                    />
                  )}
                </FormItem>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <FormItem label="协办部门">
                  {getFieldDecorator("assistDepartment", {
                    initialValue: dataSourceDispose ? dataSourceDispose.assistDepartment : "",
                  })(
                    <Input
                      disabled
                    />
                  )}
                </FormItem>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <FormItem label="处置要求">
                  {getFieldDecorator("disposalRequirements", {
                    initialValue: dataSourceDispose ? dataSourceDispose.disposalRequirements : "",
                  })(
                    <Input
                      disabled
                    />
                  )}
                </FormItem>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <FormItem label="备注">
                  {getFieldDecorator("remark", {
                    initialValue: dataSourceDispose ? dataSourceDispose.remark : "",
                  })(
                    <Input
                      disabled
                    />
                  )}
                </FormItem>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <FormItem label="派遣人">
                  {getFieldDecorator("dispatchUserId", {
                    initialValue: dataSourceDispose ? dataSourceDispose.dispatchUserId : "",
                  })(
                    <Input
                      disabled
                    />
                  )}
                </FormItem>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <FormItem label="派遣时间">
                  {getFieldDecorator("dispatchDate",
                    Object.assign({}, { initialValue: dataSourceDispose ? moment(dataSourceDispose.dispatchDate) : "" }),
                  )(
                    <DatePicker
                      placeholder=""
                      style={{ width: '100%' }}
                      format="YYYY-MM-DD HH:mm:ss"
                      allowClear
                      disabled
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
       */}
      </div>
    )
  }
}

const DetailDispose4 = Form.create()(app);
export default DetailDispose4;