import React, { PureComponent, Fragment } from 'react';
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
  Checkbox,
  Modal,
  Icon,
  Pagination,
  Tabs,
  message,
  Breadcrumb,
  TreeSelect,
  Divider,
  Upload,
} from 'antd';
import moment from 'moment';
import styles from './Detail.less';


const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

class app extends PureComponent {
  // 整改前
  renderAttachment() {
    const { uploading, fileList, filePath, previewVisible, previewImage } = this.props;
    const uploadProps = {
      name: 'file',
      action: '/services/attachment/file/upload/AttachmentUpload',
      onChange: this.props.handleChange,
      status: 'done',
      fileList: [...fileList],
      listType: 'picture',
      onPreview: this.props.handlePreview.bind(this, "before"),
      onRemove: this.props.handleRemove,
    };
    const uploadButton = (
      <div>
        <Button className="ant-upload-text">整改前附件</Button>
      </div>
    );
    return (
      <Fragment>
        <div className="clearfix">
          <Upload {...uploadProps}>{fileList.length >= 10 ? null : uploadButton}</Upload>
          <Modal visible={previewVisible} footer={null} onCancel={this.props.handleCancel}>
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>
        </div>
      </Fragment>
    );
  }

  render() {
    const {
      form,
      appealTypes,
      majorEmergencyMatters,
      appealSource,
      parentBank,
      returnType,
      gender,
      UrbanApartment,
      UrbanApartmentSelect,
      LeadersInCharge,
      leadership,
      summaryCasesList,
      getUnit,
    } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const selectAfter = (
      <Select onChange={getUnit} defaultValue="1" style={{ width: 70 }}>
        <Option value="1">小时</Option>
        <Option value="2">天</Option>
      </Select>
    );
    return (
      <div id="tableListForm" style={{ background: '#fff', paddingBottom: 28 }}>
        <Form>
          <Row>
            <Col span={16}>
              {/* 诉求信息 */}
              <div id="tableListForm" style={{ padding: '0 10px 0 0' }}>
                <Col span={24}>
                  <h3 style={{ padding: "20px 0 12px 40px" }}>诉求信息</h3>
                </Col>
                <Row style={{ marginLeft: 0 }} gutter={{ xl: 8, xxl: 40 }}>
                  <Col span={24}>
                    <Col span={12}>
                      <FormItem label="诉求类型">
                        {getFieldDecorator('appealTypes', {
                          rules: [
                            {
                              required: true,
                              message: '请选择诉求类型!',
                            },
                          ],
                        })(
                          <Select placeholder="请选择">
                            {appealTypes &&
                              appealTypes.map(item => (
                                <Option value={item.code} key={item.code}>
                                  {item.desp}
                                </Option>
                              ))}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem label="&nbsp;&nbsp;&nbsp;所属社区">
                        {getFieldDecorator('ownCommunity')(
                          <Select placeholder="请选择社区">
                            {parentBank &&
                              parentBank.map(item => (
                                <Option value={item.code} key={item.code}>
                                  {item.desp == '总行' ? '' : item.desp}
                                </Option>
                              ))}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                  </Col>
                  <Col span={24}>
                    <Col span={12}>
                      <FormItem label="诉求时间">
                        {getFieldDecorator('appealTime', {
                          rules: [
                            {
                              required: true,
                              message: '请填写诉求时间!',
                            },
                          ],
                        })(<DatePicker style={{ width: "100%" }} showTime placeholder="请输入" />)}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem
                        label="诉求事发时间"
                        labelCol={{ span: 12 }}
                        wrapperCol={{ span: 12 }}
                      >
                        {getFieldDecorator('appealHappenTime', {
                          rules: [
                            {
                              required: true,
                              message: '请填写诉求事件发生时间!',
                            },
                          ],
                        })(<DatePicker style={{ width: "100%" }} showTime placeholder="请输入" />)}
                      </FormItem>
                    </Col>
                  </Col>
                  <Col span={24}>
                    <Col span={12}>
                      <FormItem label="管辖地">
                        {getFieldDecorator('jurisdiction', {
                          initialValue: '栖霞区',
                          rules: [
                            {
                              required: true,
                              message: '请选管辖地!',
                            },
                          ],
                        })(
                          <Select placeholder="请选择">
                            <Option value="栖霞区" key="栖霞区">
                              栖霞区
                            </Option>
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem label="紧急重大事项">
                        {getFieldDecorator('majorEmergencyMatters', {
                          initialValue: '0',
                          rules: [
                            {
                              required: true,
                              message: '请选择重大类事项!',
                            },
                          ],
                        })(
                          <Select placeholder="请选择">
                            {majorEmergencyMatters &&
                              majorEmergencyMatters.map(item => (
                                <Option value={item.code} key={item.code}>
                                  {item.desp}
                                </Option>
                              ))}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                  </Col>
                  <Col span={24}>
                    <Col span={12}>
                      <FormItem label="诉求来源">
                        {getFieldDecorator('appealSource', {
                          initialValue: '',
                          rules: [
                            {
                              required: true,
                              message: '请选择诉求来源!',
                            },
                          ],
                        })(
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
                    <Col span={12}>
                      <FormItem label="&nbsp;&nbsp;&nbsp;回访类型">
                        {getFieldDecorator('returnType', {
                          initialValue: "1",
                        })(
                          <Select placeholder="请选择">
                            {returnType &&
                              returnType.map(item => (
                                <Option value={item.code} key={item.code}>
                                  {item.desp}
                                </Option>
                              ))}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                  </Col>
                  <Col span={24}>
                    <Col span={12} id="seePosition">
                      <FormItem label="诉求地址">
                        {getFieldDecorator('appealBranch', {
                          rules: [
                            {
                              required: true,
                              message: '请选择述求归属地址!',
                            },
                          ],
                        })(
                          <Select placeholder="请选择社区">
                            {parentBank &&
                              parentBank.map(item => (
                                <Option value={item.code} key={item.code}>
                                  {item.desp == '总行' ? '' : item.desp}
                                </Option>
                              ))}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem>
                        {getFieldDecorator('appealAddress', {
                          rules: [
                            {
                              required: true,
                              message: '请填写详细地址!',
                            },
                          ],
                        })(<Input />)}
                      </FormItem>
                    </Col>
                  </Col>
                  <Col span={24}>
                    <Col span={12}>
                      <FormItem label="诉求内容">
                        {getFieldDecorator('appealContent', {
                          rules: [
                            {
                              required: true,
                              message: '请填写诉求内容!',
                            },
                          ],
                        })(<TextArea rows={4} placeholder="" />)}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem label="&nbsp;&nbsp;&nbsp;诉求目的">
                        {getFieldDecorator('appealObjective')(
                          <TextArea rows={4} placeholder="" />
                        )}
                      </FormItem>
                    </Col>
                  </Col>
                  <Col span={24}>
                    <Col span={12}>
                      <FormItem label="归口类型">
                        {getFieldDecorator('homecomingType', {
                          rules: [
                            {
                              required: true,
                              message: '请选择归口类型!',
                            },
                          ],
                        })(
                          <Select
                            placeholder="请选择"
                            showSearch
                          >
                            {summaryCasesList && summaryCasesList.map(item =>
                              <Option value={item.id}>{item.completeCases}</Option>
                            )}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                  </Col>
                  {/* 诉求人员 */}
                  <Col span={24}>
                    <h3 className="gEditLineColor" style={{ padding: "83px 0 12px 20px" }}>
                      诉求人员
                    </h3>
                  </Col>
                  <Col span={24}>
                    <Col span={12}>
                      <FormItem label="姓名">
                        {getFieldDecorator('appealName', {
                          rules: [
                            {
                              required: true,
                              message: '请填写姓名!',
                            },
                            {
                              pattern: /^[\u2E80-\u9FFF]+$/,
                              message: '姓名只能是中文'
                            }
                          ],
                        })(<Input placeholder="请输入" />)}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem label="性别">
                        {getFieldDecorator('appealGender', {
                          initialValue: '1',
                          rules: [
                            {
                              required: true,
                              message: '请选择!',
                            },
                          ],
                        })(
                          <Select placeholder="请选择" allowClear>
                            {gender &&
                              gender.map(item => (
                                <Option value={item.code} key={item.code}>
                                  {item.desp}
                                </Option>
                              ))}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                  </Col>
                  <Col span={24}>
                    <Col span={12}>
                      <FormItem label="诉求号码">
                        {getFieldDecorator('appealNum', {
                          rules: [
                            {
                              required: true,
                              message: '请填写诉求号码!',
                            }
                          ],
                        })(<Input placeholder="请输入" />)}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem label="&nbsp;&nbsp;&nbsp;联系号码1">
                        {getFieldDecorator('appealPhone')(
                          <Input placeholder="请输入" />
                        )}
                      </FormItem>
                    </Col>
                  </Col>
                  <Col span={24}>
                    <Col span={12}>
                      <FormItem label="&nbsp;&nbsp;&nbsp;联系号码2">
                        {getFieldDecorator('appealPhoneSecond')(<Input placeholder="请输入" />)}
                      </FormItem>
                    </Col>
                  </Col>
                  <Col span={24}>
                    <Col span={24}>
                      <FormItem label="&nbsp;&nbsp;&nbsp;备注">
                        {getFieldDecorator('appealRemark')(<TextArea rows={4} placeholder="请输入" />)}
                      </FormItem>
                    </Col>
                  </Col>
                </Row>
              </div>
            </Col>
            {/* 附件 */}
            <Col span={8}>
              <div id="tableListForm" style={{ padding: '0 40px 0 10px', position: "relative" }}>
                <Col span={24}>
                  <h3 style={{ padding: "20px 0 11px 0" }}>附件清单</h3>
                </Col>
                <Col span={12} style={{ margin: "10px 0", borderRight: "solid 1px #DEE4EC", paddingRight: 19 }}>
                  <Col span={10}><h5 style={{ fontSize: 14, fontWeight: 600, margin: 0, marginBottom: 11 }}>整改前</h5></Col>
                  {/* <h5 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>整改前</h5> */}
                  {this.renderAttachment()}
                </Col>
                <Col span={12} style={{ margin: "10px 0", paddingLeft: 20, }}>
                  <h5 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>整改后</h5>
                </Col>
              </div>
            </Col>
            {/* 工单处理 */}
            <Col span={24}>
              <div id="tableListForm" style={{ padding: '0 10px 0 0' }}>
                <Col span={24}>
                  <h3 style={{ padding: "37px 0 12px 40px" }}>工单处理</h3>
                </Col>
                <Row style={{ marginLeft: 0 }} gutter={{ xl: 8, xxl: 40 }}>
                  <Col span={24}>
                    <Col span={7}>
                      <FormItem label="办结时限">
                        {getFieldDecorator('assistTime', {
                          rules: [
                            {
                              required: true,
                              message: '请填写办结时限!',
                            },
                            {
                              pattern: /^\+?[1-9]\d*$/,
                              message: '请输大于0的正整数',
                            }
                          ],
                        })(
                          <Input placeholder="请输入" addonAfter={selectAfter} style={{ marginTop: 4 }} />
                        )}
                      </FormItem>
                    </Col>
                    <Col span={16}>
                      <FormItem label="&nbsp;&nbsp;&nbsp;备注">{getFieldDecorator('remarks')(<Input />)}</FormItem>
                    </Col>
                  </Col>
                  <Col span={24}>
                    <Col span={7}>
                      <FormItem label="主办部门">
                        {getFieldDecorator(`organizeDepartment`, {
                          rules: [
                            {
                              required: true,
                              message: '请选择主办部门!',
                            },
                          ],
                        })(
                          <Select placeholder="请选择" onSelect={UrbanApartmentSelect}>
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
                    <Col span={6}>
                      <FormItem label="承办人员">
                        {getFieldDecorator(`executor`, {
                          rules: [
                            {
                              required: true,
                              message: '请选择承办人员!',
                            },
                          ],
                        })(
                          <Select placeholder="请选择">
                            {leadership &&
                              leadership.map(item => {
                                return <Option value={item.userId}>{item.userName}</Option>;
                              })}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col span={6}>
                      <FormItem label="分管领导">
                        {getFieldDecorator(`leadership`, {
                          rules: [
                            {
                              required: true,
                              message: '请选择分管领导!',
                            },
                          ],
                        })(
                          <Select placeholder="请选择">
                            {LeadersInCharge &&
                              LeadersInCharge.map(item => {
                                return <Option value={item.userId}>{item.userName}</Option>;
                              })}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col span={4}>
                      <FormItem label="&nbsp;&nbsp;&nbsp;是否送审">{getFieldDecorator(`isExamine`)(<Checkbox />)}</FormItem>
                    </Col>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

const DetailInformation3 = Form.create()(app);
export default DetailInformation3;
