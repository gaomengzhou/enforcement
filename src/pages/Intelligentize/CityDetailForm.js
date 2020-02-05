/* eslint-disable react/no-array-index-key */
/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable no-plusplus */
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Form,
  Input,
  Select,
  Button,
  DatePicker,
  Modal,
  Upload,
  Divider
} from 'antd';
import moment from 'moment';

const FormItem = Form.Item;
const { Option } = Select;
let id = 0;

@Form.create()
@connect(({ match, select, inspectors }) => ({
  match, select, inspectors
}))
class app extends Component {
  constructor(props) {
    super(props);
    this.state = {
      unit: '1'// 1是小时,2是天
    }
  }

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
        <Button style={{ position: "absolute", top: -6, left: 88 }} className="ant-upload-text" disabled={dataSource.status != '2' && dataSource.status != '1'}>
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
        <Button style={{ position: "absolute", top: -6, left: 108 }} className="ant-upload-text" disabled={(dataSource.status != '5' || userRole != 4 || dataSource.isApplicationClosure != 0) && (dataSource.selfDisposal == 0 || dataSource.status == 9)}>
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
    const that = this
    const {
      workSatisfaction,
      feedbackResults,
      dataSource,
      UrbanApartment,
      form,
      parentBank,
      userRole,
      getUnit,
      caseBigType,
      caseBigTypeDesc,
      caseDescribe,
      caseSmallType,
      caseSmallTypeDesc,
      createDate,
      createUserDesc,
      createUserId,
      destroyingDegree,
      destroyingDegreeDesc,
      detailedLocation,
      dispatchVos,
      disposalFeedbackVos,
      id,
      influenceScope,
      influenceScopeDesc,
      isApplicationClosure,
      isApplicationClosureDesc,
      isCheck,
      isCheckDesc,
      isExamine,
      isExamineDesc,
      isReturn,
      isReturnDesc,
      isReview,
      isReviewDesc,
      issueLevel,
      issueLevelDesc,
      lastUpdateDate,
      lastUpdateUserDesc,
      lastUpdateUserId,
      ownCommunity,
      ownCommunityDesc,
      ownGridNumber,
      ownGridNumberDesc,
      ownStreet,
      processingProgram,
      processingProgramDesc,
      reportChannel,
      reportChannelDesc,
      reportTime,
      selfDisposal,
      selfDisposalDesc,
      status,
      statusDesc,
      tenantId,
      workOrderId,
      workOrderSource,
      workOrderSourceDesc,
      workOrderStatus,
      workOrderStatusDesc,
      x,
      y,
      dataSourceSecond,
      dataSourceDispose,
      dataSourceCourse,
      fileList,
      leaderships,
      previewVisible,
      previewImage,
      gridList,
      handlePreview,
      handleChange,
      handleChangeTwo,
      handleCancel,
      handleRemove,
      handleRemoveTwo,
      UrbanApartmentSelect,
      onSelect,
      bigClass,
      leadership,
      processProgram,
      eventCategory,
      caseSmallTypes,
      workLevel,
      workDestructionDegree,
      workImpactScope,
      uploading,
      fileListTwo,
      filePathTwo,
      filePath,
      showMap,
      mapBox,
      seePhopto,
      loopDownPhopto,
      communityGrid,
      newgridList,
      cityNum,
      deadline,
      onClick
    } = this.props;
    // console.log(this.props)
    const { getFieldDecorator, getFieldValue } = form;
    function getUnits(val) {
      that.setState({
        unit: val
      })
    }
    // 处置时限--小时 or 天
    const selectAfter = (
      <Select onChange={getUnits} defaultValue='1' style={{ width: 70 }}>
        <Option value="1">小时</Option>
        <Option value="2">天</Option>
      </Select>
    );
    // 处置时限，部门，人员
    getFieldDecorator('keys', {
      initialValue:
        dispatchVos && dispatchVos.length > 0
          ? dispatchVos
          : ['1'],
    });
    function setDataBtn(e) {
      e.preventDefault();
      that.props.form.validateFields((error, values) => {
        if (!error) {
          that.props.dispatch({
            type: 'match/setModalData',
            payload: {
              workOrderId,
              dispatchVos: {
                assistDepartment: values.assistDepartment[0], // 部门
                assistTime: values.assistTime[0], // 时限
                executor: values.assistWorker[0], // 执行员
                unit: that.state.unit  // 单位
              },
            }
          });
          that.props.form.setFieldsValue({
            assistDepartment: '', // 部门
            assistTime: '', // 时限
            assistWorker: '', // 执行员
          })
          that.setState({
            unit: '1'
          })
          onClick()
        }
      });
    }
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => (
      <div hidden={userRole == '4'}>
        <Col span={24}>
          <Col span={12}>
            <FormItem label="处置时限" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} key={index}>
              {getFieldDecorator(`assistTime[${index}]`, {
                initialValue: k.assistTime ? Number(k.assistTime) : '',
                rules: [
                  {
                    required: sessionStorage.getItem('userRole') != '4',
                    message: '请输入处置时限',
                  },
                  {
                    pattern: /^\+?[1-9]\d*$/,
                    message: '请输大于0的正整数',
                  }
                ],
              })(
                <Input
                  placeholder="请输入"
                  addonAfter={selectAfter}
                  style={{ marginTop: 4 }}
                // disabled={dataSource.status != '2'}
                />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="处置部门" key={index} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
              {getFieldDecorator(`assistDepartment[${index}]`, {
                initialValue: k.assistDepartment ? Number(k.assistDepartment) : '',
                rules: [
                  {
                    required: sessionStorage.getItem('userRole') != '4',
                    message: '请输入处置部门',
                  },
                ],
              })(
                <Select
                  placeholder="请选择"
                  onSelect={UrbanApartmentSelect}
                // disabled={dataSource.status != '2'}
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
        </Col>
        <Col span={24}>
          <Col span={12}>
            <FormItem label="处置人员" key={index} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
              {getFieldDecorator(`assistWorker[${index}]`, {
                initialValue: k.executor ? Number(k.executor) : '',
                rules: [
                  {
                    required: sessionStorage.getItem('userRole') != '4',
                    message: '请输入处置人员',
                  },
                ],
              })(
                <Select
                  placeholder="请输入"
                // disabled={dataSource.status != '2'}
                >
                  {leadership &&
                    leadership.map(item => {
                      return <Option value={item.userId}>{item.userName}</Option>;
                    })}
                </Select>
              )}
            </FormItem>
          </Col>
          {index > 0 && (
            <Col lg={12} push={4}>
              <Button type="dashed" style={{ width: 60, marginTop: 3 }} onClick={() => this.remove(k)}>
                移除
              </Button>
            </Col>
          )}
        </Col>
      </div>
    ));
    return (
      <div id="tableListForm" style={{ background: '#fff', paddingBottom: 28 }}>
        <Form>
          <Row>
            <Col span={16}>
              {/* 基本信息 */}
              <div id="tableListForm" style={{ padding: '0 10px 0 0' }}>
                <Col span={24}>
                  <h3 style={{ padding: "20px 0 12px 40px" }}>基本信息</h3>
                </Col>
                <Row style={{ marginLeft: 0 }} gutter={{ xl: 8, xxl: 40 }}>
                  <Col span={24}>
                    <Col span={12}>
                      <FormItem label="所属街乡">
                        {getFieldDecorator('ownStreet', {
                          initialValue: ownStreet || '',
                        })(<Input disabled />)}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem label="所属社区">
                        {getFieldDecorator('ownCommunity', {
                          initialValue: ownCommunityDesc || '',
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
                  </Col>
                  <Col span={24}>
                    <Col span={24}>
                      <FormItem label="详细位置">
                        {getFieldDecorator('detailedLocation', {
                          initialValue: detailedLocation || '',
                        })(<Input placeholder="请输入" disabled={dataSource.status != '2' && dataSource.status != '1'} />)}
                      </FormItem>
                    </Col>
                  </Col>
                  <Col span={24}>
                    <Col span={12}>
                      <FormItem label="市级编号">
                        {getFieldDecorator('cityNum', {
                          initialValue: cityNum || '',
                        })(<Input placeholder="" disabled />)}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem label="案件编号">
                        {getFieldDecorator('workOrderId', {
                          initialValue: workOrderId || '',
                        })(<Input placeholder="请输入" disabled={dataSource.status != '2' && dataSource.status != '1'} />)}
                      </FormItem>
                    </Col>
                  </Col>
                  <Col span={24}>
                    <Col span={12}>
                      <FormItem label="截止时间">
                        {getFieldDecorator(
                          'deadline',
                          Object.assign({}, { initialValue: deadline ? moment(deadline) : '' || '' })
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
                  </Col>
                  <Col span={24}>
                    <Col span={24}>
                      <FormItem label="案件描述">
                        {getFieldDecorator('caseDescribe', {
                          initialValue: caseDescribe || '',
                        })(
                          <Input.TextArea
                            rows={4}
                            style={{ resize: 'none' }}
                            disabled={dataSource.status != '2' && dataSource.status != '1'}
                          />
                        )}
                      </FormItem>
                    </Col>
                  </Col>
                  {formItems}
                </Row>
              </div>
              {/* 反馈处置 */}
              <div id="tableListForm" hidden style={{ padding: '0 10px 0 0' }}>
                <Col span={24}>
                  <h3 style={{ padding: "20px 0 12px 40px" }}>反馈处置</h3>
                </Col>
                <Row style={{ marginLeft: 0 }} gutter={{ xl: 8, xxl: 40 }}>
                  <Col span={24}>
                    <Col span={12}>
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
                    <Col span={12}>
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
                  </Col>
                  <Col span={24}>
                    <Col span={24}>
                      <FormItem label="反馈内容">
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
                  {this.renderAttachment()}
                </Col>
                <Col span={12} style={{ margin: "10px 0", paddingLeft: 20, position: "relative" }}>
                  <Col span={10}>
                    <h5 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>整改后</h5>
                  </Col>
                  {this.renderAttachmentTwo()}
                </Col>
              </div>
            </Col>
            <Col md={24} style={{paddingTop:'5%'}} />
            <Divider dashed />
            <Col md={8} style={{ marginLeft: '84%'}}>
              <Button style={{marginRight:'1%'}} onClick={onClick}>取消</Button>
              <Button type='primary' onClick={setDataBtn}>确定</Button>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

const DetailCommon1 = Form.create()(app);
export default DetailCommon1;
