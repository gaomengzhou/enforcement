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
  add = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log(values)
    })
  }


  render() {
    const {
      feedbackResults,
      dataSourceSecond,
      dataSource,
      form,
    } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    return (
      <div id="tableListForm" style={{ background: '#fff', paddingBottom: 28 }}>
        <Form>
          <Row>
            <Col span={24}>
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
                          initialValue: dataSourceSecond ? dataSourceSecond.filesId : "",
                        })(
                          <Input
                            disabled
                          />
                        )}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem label="默认部门">
                        {getFieldDecorator("defaultDepartment", {
                          initialValue: dataSourceSecond ? dataSourceSecond.defaultDepartment : "",
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
                      <FormItem label="处置要求">
                        {getFieldDecorator("disposalRequirements", {
                          initialValue: dataSourceSecond ? dataSourceSecond.disposalRequirements : "",
                        })(
                          <Input
                            disabled
                          />
                        )}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem label="备注">
                        {getFieldDecorator("remark", {
                          initialValue: dataSourceSecond ? dataSourceSecond.remark : "",
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
                      <FormItem label="派遣人">
                        {getFieldDecorator("dispatchUserId", {
                          initialValue: dataSourceSecond ? dataSourceSecond.dispatchUserId : "",
                        })(
                          <Input
                            disabled
                          />
                        )}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem label="派遣时间">
                        {getFieldDecorator("dispatchDate",
                          Object.assign({}, dataSourceSecond.dispatchDate ? { initialValue: moment(dataSourceSecond.dispatchDate) } : { initialValue: "" }),
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
                      <FormItem label="处置时限">
                        {getFieldDecorator("disposalDateLimit", {
                          initialValue: dataSourceSecond ? dataSourceSecond.disposalDateLimit : "",
                        })(
                          <Input
                            disabled
                          />
                        )}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem label="处置部门">
                        {getFieldDecorator("disposalDepartment", {
                          initialValue: dataSourceSecond ? dataSourceSecond.disposalDepartmentDesc : "",
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
                      <FormItem label="处置人员">
                        {getFieldDecorator("assistWorker", {
                          initialValue: dataSourceSecond ? dataSourceSecond.assistWorker : "",
                        })(
                          <Input
                            disabled
                          />
                        )}
                      </FormItem>
                    </Col>
                  </Col>
                </Row>
              </div>
              {/* 反馈处置 */}
              <div id="tableListForm" style={{ padding: '0 10px 0 0' }}>
                <Col span={24}>
                  <h3 style={{ padding: "20px 0 12px 40px" }}>反馈处置</h3>
                </Col>
                <Row style={{ marginLeft: 0 }} gutter={{ xl: 8, xxl: 40 }}>
                  <Col span={24}>
                    <h3 style={{ fontWeight: 500, margin: "8px 0 8px 20px" }}>{dataSourceSecond && dataSourceSecond.disposalDepartmentDesc}</h3>
                  </Col>
                  <Col span={24}>
                    <Col span={12}>
                      <FormItem label="反馈结果" >
                        {getFieldDecorator('feedbackResults', {
                          initialValue: dataSource && dataSource.feedbackResults || "1",
                        })(
                          <Select placeholder="请选择" style={{ width: "100%" }}>
                            {feedbackResults && feedbackResults.map(item =>
                              <Select.Option key={item.code} value={item.code}>
                                {item.desp}
                              </Select.Option>
                            )}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                  </Col>
                  <Col span={24}>
                    <Col span={24}>
                      <FormItem label="反馈内容">
                        {getFieldDecorator('feedbackContent', {
                          initialValue: dataSource && dataSource.feedbackContent || "处置完毕",
                        })(
                          <Input.TextArea rows={4} style={{ resize: 'none' }} />
                        )}
                      </FormItem>
                    </Col>
                  </Col>
                  <Col span={24}>
                    <Col span={24}>
                      <FormItem label="备注">
                        {getFieldDecorator('remark', {
                          initialValue: dataSource && dataSource.remark || "",
                        })(
                          <Input.TextArea rows={4} style={{ resize: 'none' }} />
                        )}
                      </FormItem>
                    </Col>
                  </Col>
                  <Col span={24}>
                    <Col span={12}>
                      <FormItem label="反馈人">
                        {getFieldDecorator('feedbackUserId', {
                          initialValue: dataSource && dataSource.executorDesc || "",
                        })(
                          <Input disabled />
                        )}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem label="反馈时间">
                        {getFieldDecorator("dispatchDate",
                          Object.assign({}, { initialValue: dataSourceSecond ? moment(dataSourceSecond.dispatchDate) : "" }),
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
          </Row>
        </Form>
      </div >
    )
  }
}

const DetailSecond5 = Form.create()(app);
export default DetailSecond5;