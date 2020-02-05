import React, { Component, Fragment } from 'react';
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
  TreeSelect,
  Upload,
} from 'antd';
import styles from './Detail.less';
import moment from 'moment';

const FormItem = Form.Item;
const { Option } = Select;
let id = 0;

class app extends Component {
  save = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log(values);
    });
  };
  // 增加主办部门
  add = () => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(id++);
    form.setFieldsValue({
      keys: nextKeys,
    });
  };
  // 删除
  remove = k => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    if (keys.length === 1) {
      return;
    }
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };

  // 整改前
  renderAttachment() {
    const { uploading, fileList, filePath, previewVisible, previewImage, dataSource } = this.props;
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
        <Button className="ant-upload-text" disabled={dataSource.status != '2' && dataSource.status != '1'}>
          整改前附件
        </Button>
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
  // 整改后
  renderAttachmentTwo() {
    const {
      uploading,
      fileListTwo,
      filePathTwo,
      previewVisible,
      previewImage,
      dataSource,
      userRole,
    } = this.props;
    const uploadProps = {
      name: 'file',
      action: '/services/attachment/file/upload/AttachmentUpload',
      onChange: this.props.handleChangeTwo,
      status: 'done',
      fileList: [...fileListTwo],
      listType: 'picture',
      onPreview: this.props.handlePreview.bind(this, "after"),
      onRemove: this.props.handleRemoveTwo,
    };
    const uploadButton = (
      <div>
        <Button className="ant-upload-text" disabled={(dataSource.status != '5' || userRole != 4 || dataSource.isApplicationClosure != 0) && (dataSource.selfDisposal == 0 || dataSource.status == 9)}>
          整改后附件
        </Button>
      </div>
    );
    return (
      <Fragment>
        <div className="clearfix">
          <Upload {...uploadProps}>{fileListTwo.length >= 10 ? null : uploadButton}</Upload>
          <Modal visible={previewVisible} footer={null} onCancel={this.props.handleCancel}>
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>
        </div>
      </Fragment>
    );
  }

  render() {
    const {
      workSatisfaction,
      feedbackResults,
      dataSource,
      UrbanApartment,
      form,
      handleCancel,
      leadership,
      UrbanApartmentSelect,
      parentBank,
      userRole,
      getUnit,
    } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    // 处置时限--小时 or 天
    const selectAfter = (
      <Select onChange={getUnit} value="小时" style={{ width: 70 }}>
        <Option value="1">小时</Option>
        <Option value="2">天</Option>
      </Select>
    );
    // 处置时限，部门，人员
    getFieldDecorator('keys', {
      initialValue:
        dataSource.dispatchVos && dataSource.dispatchVos.length > 0
          ? dataSource.dispatchVos
          : ['1'],
    });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => (
      <div hidden={userRole == '4'}>
        <Col span={24}>
          <Col span={7}>
            <FormItem label="处置时限" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} key={index}>
              {getFieldDecorator(`assistTime[${index}]`, {
                initialValue: k.assistTime ? Number(k.assistTime) : '',
                rules: [
                  {
                    required: sessionStorage.getItem('userRole') == '4' ? false : true,
                    message: '请输入处置时限',
                  },
                ],
              })(
                <Input
                  placeholder="请输入"
                  addonAfter={selectAfter}
                  style={{ marginTop: 4 }}
                  disabled={dataSource.status != '2'}
                />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="处置部门" key={index} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
              {getFieldDecorator(`assistDepartment[${index}]`, {
                initialValue: k.assistDepartment ? Number(k.assistDepartment) : '',
                rules: [
                  {
                    required: sessionStorage.getItem('userRole') == '4' ? false : true,
                    message: '请输入处置部门',
                  },
                ],
              })(
                <Select
                  placeholder="请选择"
                  onSelect={UrbanApartmentSelect}
                  disabled={dataSource.status != '2'}
                >
                  {UrbanApartment &&
                    UrbanApartment.map(item => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.orgName}
                      </Select.Option>
                    ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="处置人员" key={index} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
              {getFieldDecorator(`assistWorker[${index}]`, {
                initialValue: k.executor ? Number(k.executor) : '',
                rules: [
                  {
                    required: sessionStorage.getItem('userRole') == '4' ? false : true,
                    message: '请输入处置人员',
                  },
                ],
              })(
                <Select placeholder="请输入" disabled={dataSource.status != '2'}>
                  {leadership &&
                    leadership.map(item => {
                      return <Option value={item.userId}>{item.userName}</Option>;
                    })}
                </Select>
              )}
            </FormItem>
          </Col>
        </Col>
        {/* {index > 0 && (
          <Col lg={12} push={1}>
            <Button type="dashed" style={{ width: 60 }} onClick={() => this.remove(k)}>
              移除
            </Button>
          </Col>
        )} */}
      </div>
    ));
    return (
      <div id="tableListForm" style={{ background: '#fff', paddingBottom: 28 }}>
        <div>
          <Row gutter={{ md: 8, lg: 8, xl: 16 }}>
            <Col lg={16} md={24} sm={24}>
              <div id="tableListForm" style={{ padding: '0 10px 0 0' }}>
                <h3>
                  基本信息
                  <Divider style={{ margin: '12px 0 8px 0' }} dashed />
                </h3>
                <Form layout="inline" style={{ paddingTop: 18 }}>
                  <Col lg={12} md={24} sm={24}>
                    <FormItem label="所属街乡">
                      {getFieldDecorator('ownStreet', {
                        initialValue: dataSource.ownStreet || '',
                      })(<Input disabled />)}
                    </FormItem>
                  </Col>
                  <Col lg={12} md={24} sm={24}>
                    <FormItem label="所属社区">
                      {getFieldDecorator('ownCommunity', {
                        initialValue: String(dataSource.ownCommunity) || '',
                      })(
                        <Select placeholder="请选择" disabled={dataSource.status != '2' && dataSource.status != '1'}>
                          {parentBank &&
                            parentBank.map(item => {
                              return (
                                <Option value={item.code}>
                                  {item.desp == '总行' ? '' : item.desp}
                                </Option>
                              );
                            })}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col lg={12} md={24} sm={24}>
                    <FormItem label="详细位置">
                      {getFieldDecorator('detailedLocation', {
                        initialValue: dataSource.detailedLocation || '',
                      })(<Input placeholder="请输入" disabled={dataSource.status != '2' && dataSource.status != '1'} />)}
                    </FormItem>
                  </Col>
                  <Col lg={12} md={24} sm={24}>
                    <FormItem label="市级编号">
                      {getFieldDecorator('cityNum', {
                        initialValue: dataSource.cityNum || '',
                      })(<Input placeholder="" disabled />)}
                    </FormItem>
                  </Col>
                  <Col lg={12} md={24} sm={24}>
                    <FormItem label="案件编号">
                      {getFieldDecorator('workOrderId', {
                        initialValue: dataSource.workOrderId || '',
                      })(<Input placeholder="请输入" disabled={dataSource.status != '2' && dataSource.status != '1'} />)}
                    </FormItem>
                  </Col>
                  <Col lg={12} md={24} sm={24}>
                    <FormItem label="截止时间">
                      {getFieldDecorator(
                        'deadline',
                        Object.assign({}, { initialValue: dataSource.deadline ? moment(dataSource.deadline) : '' || '' })
                      )(
                        <DatePicker
                          placeholder="待输入"
                          style={{ width: '100%' }}
                          format="YYYY-MM-DD HH:mm:ss"
                          allowClear
                          disabled
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col lg={24} md={24} sm={24}>
                    <FormItem label="案件描述">
                      {getFieldDecorator('caseDescribe', {
                        initialValue: dataSource.caseDescribe || '',
                      })(
                        <Input.TextArea
                          row={4}
                          style={{ resize: 'none' }}
                          disabled={dataSource.status != '2' && dataSource.status != '1'}
                        />
                      )}
                    </FormItem>
                  </Col>

                  {/* <Button type="primary" style={{ width: 160 }} onClick={this.add} hidden={!(sessionStorage.getItem('userRole') == '2' && dataSource.status == '2')}>
                    增加处置部门
                  </Button> */}
                  <div id="tableListForm" style={{ padding: '58px 0 0 0' }} hidden>
                    <h3>
                      反馈处置
                      <Divider style={{ margin: '12px 0' }} dashed />
                    </h3>
                    <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
                      <Col lg={12} md={24} sm={24}>
                        <FormItem label="反馈结果">
                          {getFieldDecorator('feedbackResult')(
                            <Select placeholder="请选择">
                              {feedbackResults &&
                                feedbackResults.map(item => (
                                  <Select.Option key={item.code} value={item.code}>
                                    {item.desp}
                                  </Select.Option>
                                ))}
                            </Select>
                          )}
                        </FormItem>
                      </Col>
                      <Col lg={12} md={24} sm={24}>
                        <FormItem label="满意度">
                          {getFieldDecorator('satisfaction')(
                            <Select placeholder="请选择">
                              {workSatisfaction &&
                                workSatisfaction.map(item => (
                                  <Select.Option key={item.code} value={item.code}>
                                    {item.desp}
                                  </Select.Option>
                                ))}
                            </Select>
                          )}
                        </FormItem>
                      </Col>
                      <Col lg={24} md={24} sm={24}>
                        <FormItem label="反馈内容">
                          {getFieldDecorator('feedbackContent')(
                            <Input.TextArea rows={4} style={{ resize: 'none' }} />
                          )}
                        </FormItem>
                      </Col>
                      <Col lg={24} md={24} sm={24}>
                        <FormItem label="备注">
                          {getFieldDecorator('remark')(
                            <Input.TextArea rows={4} style={{ resize: 'none' }} />
                          )}
                        </FormItem>
                      </Col>
                    </Row>
                  </div>
                  {formItems}
                </Form>
              </div>
            </Col>
            <Col
              lg={{ span: 8, offset: 0 }}
              md={{ span: 24, offset: 0 }}
              sm={{ span: 24, offset: 0 }}
            >
              <h3>
                附件清单
                <Divider style={{ margin: '12px 0 8px 0' }} dashed />
              </h3>
              <Col span={11}>{this.renderAttachment()}</Col>
              <Col span={11} push={1}>
                {this.renderAttachmentTwo()}
              </Col>
            </Col>
            {/* {index > 0 && (
          <Col lg={12} push={1}>
            <Button type="dashed" style={{ width: 60 }} onClick={() => this.remove(k)}>
              移除
            </Button>
          </Col>
        )} */}
          </Row>
          <Row gutter={{ xl: 10, xxl: 36 }} hidden={userRole != 2 || dataSource.isCheck == 0}>
            <h3 className="gEditLineColor">复核过程
            <Divider style={{ margin: '12px 0 8px 0' }} dashed />
            </h3>
            <Col span={24}>
              <Col span={7}>
                <FormItem label="复核时限" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} >
                  {getFieldDecorator("fhassistTime", {
                    initialValue: dataSource.assistTime ? dataSource.assistTime : "",
                  })(
                    <Input
                      placeholder="请输入"
                      addonAfter={selectAfter}
                      style={{ marginTop: 4 }}
                      disabled={dataSource.status != '2'}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="复核部门" >
                  {getFieldDecorator(`fhorganizeDepartment`, {
                    initialValue: dataSource.assistDepartment ? Number(dataSource.assistDepartment) : "",
                  })(
                    <Select
                      placeholder="请选择"
                      onSelect={UrbanApartmentSelect}
                      disabled={dataSource.status != '2'}
                    >
                      {UrbanApartment &&
                        UrbanApartment.map(item => (
                          <Select.Option key={item.id} value={item.id}>
                            {item.orgName}
                          </Select.Option>
                        ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="复核人员" >
                  {getFieldDecorator(`fhexecutor`, {
                    initialValue: dataSource.executorDesc ? dataSource.executorDesc : "",
                  })(
                    <Select placeholder="请输入" disabled={dataSource.status != '2'}>
                      {leadership &&
                        leadership.map(item => {
                          return <Option value={item.userId}>{item.userName}</Option>;
                        })}
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Col>
          </Row>
        </div>
      </div >
    );
  }
}

const DetailCommon1 = Form.create()(app);
export default DetailCommon1;