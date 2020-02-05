/* eslint-disable eqeqeq */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-vars */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import {
  Row,
  Col,
  Form,
  Input,
  Select,
  Button,
  DatePicker,
  Checkbox,
  Modal,
  Divider,
  Upload,
} from 'antd';
import moment from 'moment';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

@connect(({ match }) => ({
  match
}))
class app extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      unit: '0'
    }
  }

  // 整改前
  renderAttachment() {
    const { uploading, fileList, filePath, previewVisible, previewImage, info } = this.props;
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
        <Button
          className="ant-upload-text"
        >整改前附件
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
    const { uploading, fileListTwo, filePathTwo, previewVisible, previewImage, info, userRole } = this.props;
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
        <Button className="ant-upload-text" disabled={info.status != '3' || userRole != 4 || info.isApplicationClosure != 0}>整改后附件</Button>
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
    const that = this;
    const {
      parentBank,
      leadership,
      gender,
      info,
      UrbanApartment,
      UrbanApartmentSelect,
      LeadersInCharge,
      userRole,
      summaryCasesList,
      form,
      getUnit,
      appealAddress,
      appealBranch,
      appealBranchDesc,
      appealContent,
      appealGender,
      appealGenderDesc,
      appealHappenTime,
      appealName,
      appealNum,
      appealSource,
      appealSourceDesc,
      appealTime,
      appealTypes,
      appealTypesDesc,
      createDate,
      createUserDesc,
      createUserId,
      dispatchVos,
      homecomingType,
      homecomingTypeDesc,
      id,
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
      jurisdiction,
      lastUpdateDate,
      lastUpdateUserDesc,
      lastUpdateUserId,
      majorEmergencyMatters,
      majorEmergencyMattersDesc,
      organizeDepartment,
      organizeDepartmentDesc,
      ownCommunity,
      ownCommunityDesc,
      preAttachmentIds,
      prePicture,
      returnType,
      returnTypeDesc,
      status,
      statusDesc,
      tenantId,
      workOrderId,
      workOrderStatus,
      workOrderStatusDesc,
      appealPhone,
      appealPhoneSecond,
      appealRemark,
      remarks,
      proAttachmentIds,
      appealObjective,
      handlePreview,
      handleChange,
      handleChangeTwo,
      handleCancel,
      handleRemove,
      handleRemoveTwo,
      seePhopto,
      loopDownPhopto,
      onClick
    } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    function getUnits(val) {
      that.setState({
        unit: val
      })
    }
    const selectAfter = (
      <Select onChange={getUnits} defaultValue='1' style={{ width: 70 }}>
        <Option value="1">小时</Option>
        <Option value="2">天</Option>
      </Select>
    );
    function setDataBtn(e) {
      e.preventDefault();
      that.props.form.validateFields((error, values) => {
        if (!error) {
          that.props.dispatch({
            type: 'match/patchComplantDatas',
            payload: {
              workOrderId,
              isExamine: values.isExamine == true ? '1' : '0',// "是否审核（0 不需要，1需要）")
              leadership: values.leadership,// 分管领导
              dispatchVos: {
                assistDepartment: values.organizeDepartment, // 部门
                assistTime: values.assistTime, // 时限
                executor: values.executor, // 执行员
                remarks: values.remarks,// 备注
                unit: that.state.unit  // 单位
              },
            }
          })
        }
      });
      onClick()
    }
    return (
      <div id="tableListForm" style={{ background: '#fff', paddingBottom: 28, paddingLeft: 40 }}>
        <Form>
          <Row>
            <Col span={15}>
              {/* 诉求信息 */}
              <Col span={24}>
                <h3 style={{ marginTop: 20, marginBottom: 12 }}>
                  诉求信息
                </h3>
              </Col>
              <Col span={24}>
                <Col span={12}>
                  <FormItem label="诉求类型">
                    {getFieldDecorator('appealTypes', {
                      initialValue: appealTypesDesc || '',
                      // initialValue: info.appealTypes || '',
                      rules: [
                        {
                          required: true,
                          message: '请选择诉求类型!',
                        },
                      ],
                    })(
                      <Select placeholder="请选择" disabled={info.status != '1'}>
                        {/* {appealTypes &&
                          appealTypes.map(item => (
                            <Option value={item.code} key={item.code}>
                              {item.desp}
                            </Option>
                          ))} */}
                        <Option value={1}>
                          {appealTypesDesc}
                        </Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={12} style={{ paddingLeft: 40 }}>
                  <FormItem label="&nbsp;&nbsp;&nbsp;所属社区">
                    {getFieldDecorator('ownCommunity', {
                      initialValue: ownCommunityDesc || '',
                      // initialValue: info.ownCommunity || '',
                    })(
                      <Select placeholder="请选择社区" disabled={info.status != '1'}>
                        <Option value={1}>
                          {ownCommunityDesc}
                        </Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Col>
              <Col span={24}>
                <Col span={12}>
                  <FormItem label="诉求时间">
                    {getFieldDecorator('appealTime', {
                      initialValue: moment(appealTime) || '',
                      // initialValue: moment(info.appealTime) || '',
                      rules: [
                        {
                          required: true,
                          message: '请填写诉求时间!',
                        },
                      ],
                    })(<DatePicker style={{ width: '100%' }} showTime disabled={info.status != '1'} />)}
                  </FormItem>
                </Col>
                <Col span={12} style={{ paddingLeft: 40 }}>
                  <FormItem
                    label="诉求事件发生时间"
                    labelCol={{ span: 12 }}
                    wrapperCol={{ span: 12 }}
                  >
                    {getFieldDecorator('appealHappenTime', {
                      initialValue: moment(appealHappenTime) || '',
                      rules: [
                        {
                          required: true,
                          message: '请填写诉求事件发生时间!',
                        },
                      ],
                    })(<DatePicker style={{ width: '100%' }} showTime disabled={info.status != '1'} />)}
                  </FormItem>
                </Col>
              </Col>
              <Col span={24}>
                <Col span={12}>
                  <FormItem label="管辖地">
                    {getFieldDecorator('jurisdiction', {
                      initialValue: jurisdiction || '',
                      rules: [
                        {
                          required: true,
                          message: '请选管辖地!',
                        },
                      ],
                    })(
                      <Select placeholder="请选择" disabled={info.status != '1'}>
                        <Option value="栖霞区" key="栖霞区">
                          栖霞区
                        </Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={12} style={{ paddingLeft: 40 }}>
                  <FormItem label="紧急重大类事项">
                    {getFieldDecorator('majorEmergencyMatters', {
                      initialValue: majorEmergencyMattersDesc || '',
                      // initialValue: info.majorEmergencyMatters || '',
                      rules: [
                        {
                          required: true,
                          message: '请选择重大类事项!',
                        },
                      ],
                    })(
                      <Select placeholder="请选择" disabled={info.status != '1'}>
                        <Option value={1}>
                          {majorEmergencyMatters}
                        </Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Col>
              <Col span={24}>
                <Col span={12}>
                  <FormItem label="诉求来源">
                    {getFieldDecorator('appealSource', {
                      initialValue: appealSourceDesc || '',
                      // initialValue: info.appealSource || '',
                      rules: [
                        {
                          required: true,
                          message: '请选择诉求来源!',
                        },
                      ],
                    })(
                      <Select placeholder="请选择" disabled={info.status != '1'}>
                        <Option value={1}>
                          {appealSource}
                        </Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem label="&nbsp;&nbsp;&nbsp;回访类型" style={{ paddingLeft: 40 }}>
                    {getFieldDecorator('returnType', {
                      initialValue: returnType || '1',
                      // initialValue: info.returnType || '1',
                    })(
                      <Select placeholder="请选择" disabled={info.status != '1'}>
                        <Option value='1'>
                          {returnTypeDesc}
                        </Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Col>
              <Col span={24}>
                <Col span={12} id="seePosition">
                  <FormItem label="诉求地址">
                    {getFieldDecorator('appealBranch', {
                      initialValue: appealBranchDesc || '',
                      // initialValue: info.appealBranch || '',
                      rules: [
                        {
                          required: true,
                          message: '请选择述求归属地址!',
                        },
                      ],
                    })(
                      <Select placeholder="请选择社区" disabled={info.status != '1'}>
                        <Option value='1'>
                          {appealBranchDesc}
                        </Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={11} push={1}>
                  <FormItem>
                    {getFieldDecorator('appealAddress', {
                      initialValue: appealAddress || '',
                      // initialValue: info.appealAddress || '',
                      rules: [
                        {
                          required: true,
                          message: '请填写详细地址!',
                        },
                      ],
                    })(<Input disabled={info.status != '1'} />)}
                  </FormItem>
                </Col>
              </Col>
              <Col span={24}>
                <Col span={12}>
                  <FormItem label="诉求内容">
                    {getFieldDecorator('appealContent', {
                      initialValue: appealContent || '',
                      // initialValue: info.appealContent || '',
                      rules: [
                        {
                          required: true,
                          message: '请填写诉求内容!',
                        },
                      ],
                    })(<TextArea rows={4} placeholder="" disabled={info.status != '1'} />)}
                  </FormItem>
                </Col>
                <Col span={12} style={{ paddingLeft: 40 }}>
                  <FormItem label="&nbsp;&nbsp;&nbsp;诉求目的">
                    {getFieldDecorator('appealObjective', {
                      initialValue: appealObjective || '',
                      // initialValue: info.appealObjective || '',
                    })(<TextArea rows={4} placeholder="" disabled={info.status != '1'} />)}
                  </FormItem>
                </Col>
              </Col>
              <Col span={12}>
                <FormItem label="归口类型" wrapperCol={18}>
                  {getFieldDecorator('homecomingType', {
                    initialValue: homecomingTypeDesc || '',
                    rules: [
                      {
                        required: true,
                        message: '请选择归口类型!',
                      },
                    ],
                  })(
                    <Select
                      placeholder="请选择"
                      disabled={info.status != '1'}
                      showSearch
                      style={{ width: '100%' }}
                    >
                      {summaryCasesList && summaryCasesList.map(item =>
                        <Option value={item.completeCases}>{item.completeCases}</Option>
                      )}
                    </Select>
                  )}
                </FormItem>
              </Col>
              {/* 诉求人员 */}
              <Col span={24}>
                <h3 style={{ paddingTop: 28, marginBottom: 12 }}>
                  诉求人员
                </h3>
              </Col>
              <Col span={12}>
                <FormItem label="姓名">
                  {getFieldDecorator('appealName', {
                    initialValue: appealName || '',
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
                  })(<Input disabled={info.status != '1'} />)}
                </FormItem>
              </Col>
              <Col span={12} style={{ paddingLeft: 40 }}>
                <FormItem label="性别">
                  {getFieldDecorator('appealGender', {
                    initialValue: appealGenderDesc || '',
                    rules: [
                      {
                        required: true,
                        message: '请选择性别!',
                      },
                    ],
                  })(
                    <Select placeholder="请选择" allowClear disabled={info.status != '1'}>
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
              <Col span={12}>
                <FormItem label="诉求号码">
                  {getFieldDecorator('appealNum', {
                    initialValue: appealNum || '',
                    rules: [
                      {
                        required: true,
                        message: '请填写诉求号码!',
                      },
                    ],
                  })(<Input disabled={info.status != '1'} />)}
                </FormItem>
              </Col>
              <Col span={12} style={{ paddingLeft: 40 }}>
                <FormItem label="&nbsp;&nbsp;&nbsp;联系号码1">
                  {getFieldDecorator('appealPhone', {
                    initialValue: appealPhone || '',
                  })(<Input disabled={info.status != '1'} />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="&nbsp;&nbsp;&nbsp;联系号码2">
                  {getFieldDecorator('appealPhoneSecond', {
                    initialValue: appealPhoneSecond || '',
                  })(<Input disabled={info.status != '1'} />)}
                </FormItem>
              </Col>
              <Col span={24}>
                <FormItem label="&nbsp;&nbsp;&nbsp;备注">
                  {getFieldDecorator('appealRemark', {
                    initialValue: appealRemark || '',
                  })(<TextArea rows={4} disabled={info.status != '1'} />)}
                </FormItem>
              </Col>
            </Col>
            {/* 附件 */}
            <Col span={8} push={1} style={{ padding: 10, height: 300, overflow: 'auto' }}>
              <h3>
                附件清单
                <Divider style={{ margin: '12px 0 8px 0' }} dashed />
              </h3>
              <Col span={11}>{this.renderAttachment()}</Col>
              <Col span={11} push={1}>{this.renderAttachmentTwo()}</Col>
            </Col>
          </Row>
          {/* 工单处理 */}
          <h3 className="gEditLineColor" style={{ marginBottom: 12, marginTop: 20 }}>
            工单处理
          </h3>
          <Row>
            <Col span={24}>
              <Col span={6}>
                <FormItem label="办结时限">
                  {getFieldDecorator('assistTime', {
                    initialValue: (dispatchVos && dispatchVos[0]) ? dispatchVos[0].assistTime : '',
                    // initialValue: (info.dispatchVos && info.dispatchVos[0]) ? info.dispatchVos[0].assistTime : '',
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
                    <Input
                      placeholder="请输入"
                      addonAfter={selectAfter}
                      style={{ marginTop: 4 }}
                    // disabled={info.status != '1'}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={18} style={{ paddingLeft: 40, paddingRight: 21 }}>
                <FormItem label="&nbsp;&nbsp;&nbsp;备注">
                  {getFieldDecorator('remarks', {
                    initialValue: remarks || '',
                  })(<Input />)}
                </FormItem>
              </Col>
            </Col>
            <Col span={24}>
              <Col span={7}>
                <FormItem label="主办部门">
                  {getFieldDecorator(`organizeDepartment`, {
                    initialValue: (dispatchVos && dispatchVos[0])
                      // initialValue: (info.dispatchVos && info.dispatchVos[0])
                      ? Number(dispatchVos[0].assistDepartment)
                      : '',
                    rules: [
                      {
                        required: true,
                        message: '请选择主办部门!',
                      },
                    ],
                  })(
                    <Select
                      placeholder="请选择"
                      onSelect={UrbanApartmentSelect}
                    // disabled={info.status != '1'}
                    >
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
              <Col span={7} style={{ paddingLeft: 40 }}>
                <FormItem label="承办人员">
                  {getFieldDecorator(`executor`, {
                    initialValue: (dispatchVos && dispatchVos[0]) ? Number(dispatchVos[0].executor) : '',
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
              <Col span={6} style={{ paddingLeft: 40 }}>
                <FormItem label="分管领导">
                  {getFieldDecorator(`leadership`, {
                    initialValue: Number(leadership) || '',
                    rules: [
                      {
                        required: true,
                        message: '请选择分管领导!',
                      },
                    ],
                  })(
                    <Select
                      style={{ width: '90%' }}
                      placeholder="请选择"
                    // disabled={info.status != '1'}
                    >
                      {LeadersInCharge &&
                        LeadersInCharge.map(item => {
                          return <Option value={item.userId}>{item.userName}</Option>;
                        })}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={4} style={{ paddingLeft: 40 }}>
                <FormItem label="&nbsp;&nbsp;&nbsp;是否送审">
                  {getFieldDecorator(`isExamine`, {
                  })(<Checkbox
                    // {...Object.assign({}, true ? { checked: true } : { aa: false })}
                    defaultChecked={info.isExamine}
                  // disabled={info.status != '1'}
                  />)}
                </FormItem>
              </Col>
              <Col md={24} style={{ paddingBottom: "5%" }} />
              <Divider dashed />
              <Col md={8} style={{ marginLeft: '84%' }}>
                <Button style={{ marginRight: '1%' }} onClick={onClick}>取消</Button>
                <Button type='primary' onClick={setDataBtn}>确定</Button>
              </Col>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

const DetailInformation3 = Form.create()(app);
export default DetailInformation3;
