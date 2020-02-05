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
      dataSource,
      getDetailListSeven,
      results
    } = this.props;
    console.log(dataSource)
    return (
      <div id="tableListForm" style={{ background: '#fff', paddingBottom: 28 }}>
        <Form>
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
                      <FormItem label="截止时间">
                        {getFieldDecorator("deadline",
                          Object.assign({}, getDetailListSeven && getDetailListSeven.deadline ? { initialValue: moment(getDetailListSeven.deadline) } : { initialValue: "" }),
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
                    <Col span={12}>
                      <FormItem label="延时时间">
                        {getFieldDecorator("dispatchDate",
                          Object.assign({}, getDetailListSeven && getDetailListSeven.deadDate ? { initialValue: moment(getDetailListSeven.deadDate) } : { initialValue: "" }),
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
                    <Col span={24}>
                      <FormItem label="申请说明">
                        {getFieldDecorator("assistDepartment", {
                          initialValue: getDetailListSeven && getDetailListSeven.applicationNote || "",
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
                          initialValue: getDetailListSeven && getDetailListSeven.remark || "",
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
                      <FormItem label="申请人">
                        {getFieldDecorator("dispatchUserId", {
                          initialValue: getDetailListSeven && getDetailListSeven.applicationUserIdDesc || "",
                        })(
                          <Input
                            disabled
                          />
                        )}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem label="申请时间">
                        {getFieldDecorator("dispatchDate",
                          Object.assign({}, getDetailListSeven && getDetailListSeven.applicationDate ? { initialValue: moment(getDetailListSeven.applicationDate) } : { initialValue: "" }),
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
                      <FormItem label="审批结果">
                        {getFieldDecorator('feedbackResult', {
                          initialValue: "1"
                        })(
                          <Select placeholder="请选择">
                            {results && results.map(item =>
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
                      <FormItem label="审批说明">
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
                      <FormItem label="审批人">
                        {getFieldDecorator('satisfaction', {
                          initialValue: dataSource && dataSource.lastUpdateUserDesc || ""
                        })(
                          <Input
                            placeholder="请选择"
                          />
                        )}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem label="审批时间">
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
            {/* 附件 */}
            <Col span={8}>
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
        </Form>
      </div >



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
      //         <FormItem label="截止时间">
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
      //       <Col lg={8} md={12} sm={24}>
      //         <FormItem label="延时时间">
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
      //       <Col lg={16} md={12} sm={24}>
      //         <FormItem label="申请说明">
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
      //         <FormItem label="申请人">
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
      //         <FormItem label="申请时间">
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
      //       <Button type="primary" style={{ marginLeft: 68 }}>提交</Button>
      //     </Row>
      //     {/* 检查反馈 */}
      //     <div id="tableListForm" style={{ padding: '58px 0 0 0' }}>
      //       <h3>延时申请
      //               <Divider style={{ margin: '12px 0' }} dashed />
      //       </h3>
      //       <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
      //         <Col span={24}>
      //           <Col span={8}>
      //             <FormItem label="审批结果">
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
      //             <FormItem label="审批说明">
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
      //             <FormItem label="审批人">
      //               {getFieldDecorator('satisfaction')(
      //                 <Input
      //                   placeholder="请选择"
      //                 />
      //               )}
      //             </FormItem>
      //           </Col>
      //           <Col span={8}>
      //             <FormItem label="审批时间">
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
      //       </Row>
      //     </div>
      //   </Form>
      // </div>
    )
  }
}

const DetailDelay7 = Form.create()(app);
export default DetailDelay7;