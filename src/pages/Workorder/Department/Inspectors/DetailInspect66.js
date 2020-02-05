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
                      <FormItem label="单据编号">
                        {getFieldDecorator("filesId", {
                          initialValue: "",
                        })(
                          <Input
                            disabled
                          />
                        )}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem label="案卷号">
                        {getFieldDecorator("filesId", {
                          initialValue: "",
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
                      <FormItem label="监督员">
                        {getFieldDecorator("dispatch", {
                          initialValue: "",
                        })(
                          <Input
                            disabled
                          />
                        )}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem label="手机号">
                        {getFieldDecorator("principalDepartments", {
                          initialValue: "",
                        })(
                          <Input
                            disabled
                          />
                        )}
                      </FormItem>
                    </Col>
                  </Col>
                  <Col span={24}>
                    <Col span={24}>
                      <FormItem label="核查要求">
                        {getFieldDecorator("assistDepartment", {
                          initialValue: "",
                        })(
                          <Input
                            disabled
                          />
                        )}
                      </FormItem>
                    </Col>
                  </Col>
                  <Col span={24}>
                    <Col span={24}>
                      <FormItem label="备注">
                        {getFieldDecorator("remark", {
                          initialValue: "",
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
                          initialValue: "",
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
              {/* 检查反馈 */}
              <div id="tableListForm" style={{ padding: '0 10px 0 0' }}>
                <Col span={24}>
                  <h3 style={{ padding: "20px 0 12px 40px" }}>检查反馈</h3>
                </Col>
                <Row style={{ marginLeft: 0 }} gutter={{ xl: 8, xxl: 40 }}>
                  <Col span={24}>
                    <Col span={12}>
                      <FormItem label="检查结果">
                        {getFieldDecorator('feedbackResult')(
                          <Select placeholder="请选择">
                            <Select.Option key={1} value={1}>
                              1
                          </Select.Option>
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                  </Col>
                  <Col span={24}>
                    <Col span={24}>
                      <FormItem label="反馈描述">
                        {getFieldDecorator('feedbackContent')(
                          <Input.TextArea rows={4} style={{ resize: 'none' }} />
                        )}
                      </FormItem>
                    </Col>
                  </Col>
                  <Col span={24}>
                    <Col span={24}>
                      <FormItem label="备注">
                        {getFieldDecorator('remark')(
                          <Input.TextArea rows={4} style={{ resize: 'none' }} />
                        )}
                      </FormItem>
                    </Col>
                  </Col>
                  <Col span={24}>
                    <Col span={12}>
                      <FormItem label="反馈人">
                        {getFieldDecorator('satisfaction')(
                          <Input
                            placeholder="请选择"
                          />
                        )}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem label="反馈时间">
                        {getFieldDecorator("dispatchDate",
                          Object.assign({}, { initialValue: moment() || "" }),
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
      </div>





      // <h3 className="gEditLineColor">任务处置
      //   <Divider style={{ margin: '12px 0 8px 0' }} dashed />
      // </h3>
      // <div id="caseInfo" style={{ marginTop: 18 }}>
      //   <Form>
      //     <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
      //       <Col lg={8} md={12} sm={24}>
      //         <FormItem label="单据编号">
      //           {getFieldDecorator("filesId", {
      //             initialValue: "",
      //           })(
      //             <Input
      //               disabled
      //             />
      //           )}
      //         </FormItem>
      //       </Col>
      //       <Col lg={8} md={12} sm={24}>
      //         <FormItem label="案卷号">
      //           {getFieldDecorator("filesId", {
      //             initialValue: "",
      //           })(
      //             <Input
      //               disabled
      //             />
      //           )}
      //         </FormItem>
      //       </Col>
      //       <Col lg={8} md={12} sm={24}>
      //         <FormItem label="监督员">
      //           {getFieldDecorator("dispatch", {
      //             initialValue: "",
      //           })(
      //             <Input
      //               disabled
      //             />
      //           )}
      //         </FormItem>
      //       </Col>
      //       <Col lg={8} md={12} sm={24}>
      //         <FormItem label="手机号">
      //           {getFieldDecorator("principalDepartments", {
      //             initialValue: "",
      //           })(
      //             <Input
      //               disabled
      //             />
      //           )}
      //         </FormItem>
      //       </Col>
      //       <Col lg={16} md={12} sm={24}>
      //         <FormItem label="核查要求">
      //           {getFieldDecorator("assistDepartment", {
      //             initialValue: "",
      //           })(
      //             <Input
      //               disabled
      //             />
      //           )}
      //         </FormItem>
      //       </Col>
      //       <Col lg={8} md={12} sm={24}>
      //         <FormItem label="备注">
      //           {getFieldDecorator("remark", {
      //             initialValue: "",
      //           })(
      //             <Input
      //               disabled
      //             />
      //           )}
      //         </FormItem>
      //       </Col>
      //       <Col lg={8} md={12} sm={24}>
      //         <FormItem label="派遣人">
      //           {getFieldDecorator("dispatchUserId", {
      //             initialValue: "",
      //           })(
      //             <Input
      //               disabled
      //             />
      //           )}
      //         </FormItem>
      //       </Col>
      //       <Col lg={8} md={12} sm={24}>
      //         <FormItem label="派遣时间">
      //           {getFieldDecorator("dispatchDate",
      //             Object.assign({}, { initialValue: moment() || "" }),
      //           )(
      //             <DatePicker
      //               placeholder=""
      //               style={{ width: '100%' }}
      //               format="YYYY-MM-DD HH:mm:ss"
      //               allowClear
      //               disabled
      //             />
      //           )}
      //         </FormItem>
      //       </Col>
      //     </Row>
      //     {/* 检查反馈 */}
      //     <div id="tableListForm" style={{ padding: '58px 0 0 0' }}>
      //       <h3>检查反馈
      //               <Divider style={{ margin: '12px 0' }} dashed />
      //       </h3>
      //       <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
      //         <Col span={24}>
      //           <Col span={8}>
      //             <FormItem label="检查结果">
      //               {getFieldDecorator('feedbackResult')(
      //                 <Select placeholder="请选择">
      //                   <Select.Option key={1} value={1}>
      //                     1
      //                     </Select.Option>
      //                 </Select>
      //               )}
      //             </FormItem>
      //           </Col>
      //         </Col>
      //         <Col span={24}>
      //           <Col span={16}>
      //             <FormItem label="反馈描述">
      //               {getFieldDecorator('feedbackContent')(
      //                 <Input.TextArea rows={4} style={{ resize: 'none' }} />
      //               )}
      //             </FormItem>
      //           </Col>
      //         </Col>
      //         <Col span={24}>
      //           <Col span={16}>
      //             <FormItem label="备注">
      //               {getFieldDecorator('remark')(
      //                 <Input.TextArea rows={4} style={{ resize: 'none' }} />
      //               )}
      //             </FormItem>
      //           </Col>
      //         </Col>
      //         <Col span={24}>
      //           <Col span={8}>
      //             <FormItem label="反馈人">
      //               {getFieldDecorator('satisfaction')(
      //                 <Input
      //                   placeholder="请选择"
      //                 />
      //               )}
      //             </FormItem>
      //           </Col>
      //           <Col span={8}>
      //             <FormItem label="反馈时间">
      //               {getFieldDecorator("dispatchDate",
      //                 Object.assign({}, { initialValue: moment() || "" }),
      //               )(
      //                 <DatePicker
      //                   placeholder=""
      //                   style={{ width: '100%' }}
      //                   format="YYYY-MM-DD HH:mm:ss"
      //                   allowClear
      //                   disabled
      //                 />
      //               )}
      //             </FormItem>
      //           </Col>
      //         </Col>
      //         <Button type="primary" style={{ marginLeft: 80 }}>提交</Button>
      //       </Row>
      //     </div>
      //   </Form>
      // </div >
    )
  }
}

const DetailInspect6 = Form.create()(app);
export default DetailInspect6;