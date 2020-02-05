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
import styles from './Detail.less';

import moment from 'moment';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

class app extends PureComponent {

  render() {
    const {
      form,
      appealTypes,
      majorEmergencyMatters,
      appealSource,
      parentBank,
      returnType,
      leadership,
      gender,
      info,
      dispatchVos,
      UrbanApartment,
      UrbanApartmentSelect,
      LeadersInCharge,
      userRole,
      summaryCasesList,
      getUnit,
    } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const selectAfter = (
      <Select onChange={getUnit} value="小时" style={{ width: 70 }}>
        <Option value="1">小时</Option>
        <Option value="2">天</Option>
      </Select>
    );
    return (
      <div id="tableListForm" style={{ background: '#fff', paddingBottom: 28 }}>
        <Form>
          <Row>
            <Col span={24}>
              {/* 诉求信息 */}
              <Col span={24}>
                <h3>
                  诉求信息
                  <Divider style={{ margin: '12px 0 8px 0' }} dashed />
                </h3>
              </Col>
              <Col span={24}>
                <Col span={12}>
                  <FormItem label="诉求类型">
                    {getFieldDecorator('appealTypes', {
                      initialValue: info.appealTypes || '',
                      rules: [
                        {
                          required: true,
                          message: '请选择诉求类型!',
                        },
                      ],
                    })(
                      <Select placeholder="请选择" disabled={info.status != '1'}>
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
                  <FormItem label="所属社区">
                    {getFieldDecorator('ownCommunity', {
                      initialValue: info.ownCommunity || '',
                    })(
                      <Select placeholder="请选择社区" disabled={info.status != '1'}>
                        {parentBank &&
                          parentBank.map(item => (
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
                <Col span={10}>
                  <FormItem label="诉求时间">
                    {getFieldDecorator('appealTime', {
                      initialValue: moment(info.appealTime) || '',
                      rules: [
                        {
                          required: true,
                          message: '请填写诉求时间!',
                        },
                      ],
                    })(<DatePicker showTime placeholder="请输入" disabled={info.status != '1'} />)}
                  </FormItem>
                </Col>
                <Col span={14}>
                  <FormItem
                    label="诉求事件发生时间"
                    labelCol={{ span: 12 }}
                    wrapperCol={{ span: 12 }}
                  >
                    {getFieldDecorator('appealHappenTime', {
                      initialValue: moment(info.appealHappenTime) || '',
                      rules: [
                        {
                          required: true,
                          message: '请填写诉求事件发生时间!',
                        },
                      ],
                    })(<DatePicker showTime placeholder="请输入" disabled={info.status != '1'} />)}
                  </FormItem>
                </Col>
              </Col>
              <Col span={24}>
                <Col span={12}>
                  <FormItem label="管辖地">
                    {getFieldDecorator('jurisdiction', {
                      initialValue: info.jurisdiction || '',
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
                <Col span={12}>
                  <FormItem label="紧急重大类事项">
                    {getFieldDecorator('majorEmergencyMatters', {
                      initialValue: info.majorEmergencyMatters || '',
                      rules: [
                        {
                          required: true,
                          message: '请选择重大类事项!',
                        },
                      ],
                    })(
                      <Select placeholder="请选择" disabled={info.status != '1'}>
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
                      initialValue: info.appealSource || '',
                      rules: [
                        {
                          required: true,
                          message: '请选择诉求来源!',
                        },
                      ],
                    })(
                      <Select placeholder="请选择" disabled={info.status != '1'}>
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
                  <FormItem label="回访类型">
                    {getFieldDecorator('returnType', {
                      initialValue: info.returnType || '1',
                    })(
                      <Select placeholder="请选择" disabled={info.status != '1'}>
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
                      initialValue: info.appealBranch || '',
                      rules: [
                        {
                          required: true,
                          message: '请选择述求归属地址!',
                        },
                      ],
                    })(
                      <Select placeholder="请选择社区" disabled={info.status != '1'}>
                        {parentBank &&
                          parentBank.map(item => (
                            <Option value={item.code} key={item.code}>
                              {item.desp}
                            </Option>
                          ))}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={11} push={1}>
                  <FormItem>
                    {getFieldDecorator('appealAddress', {
                      initialValue: info.appealAddress || '',
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
                      initialValue: info.appealContent || '',
                      rules: [
                        {
                          required: true,
                          message: '请填写诉求内容!',
                        },
                      ],
                    })(<TextArea rows={4} placeholder="" disabled={info.status != '1'} />)}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem label="诉求目的">
                    {getFieldDecorator('appealObjective', {
                      initialValue: info.appealObjective || '',
                      rules: [
                        {
                          required: true,
                          message: '请填写诉求目的!',
                        },
                      ],
                    })(<TextArea rows={4} placeholder="" disabled={info.status != '1'} />)}
                  </FormItem>
                </Col>
              </Col>
              <Col span={16}>
                <FormItem label="归口类型" wrapperCol={18}>
                  {getFieldDecorator('homecomingType', {
                    initialValue: info.homecomingType || '',
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
                      style={{ width: 200 }}
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
                <h3 style={{ paddingTop: 28 }}>
                  诉求人员
                  <Divider style={{ margin: '12px 0 8px 0' }} dashed />
                </h3>
              </Col>
              <Col span={24}>
                <Col span={8}>
                  <FormItem label="姓名">
                    {getFieldDecorator('appealName', {
                      initialValue: info.appealName || '',
                      rules: [
                        {
                          required: true,
                          message: '请填写姓名!',
                        },
                      ],
                    })(<Input placeholder="请输入" disabled={info.status != '1'} />)}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="性别">
                    {getFieldDecorator('appealGender', {
                      initialValue: info.appealGender || '',
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
                <Col span={8}>
                  <FormItem label="诉求号码">
                    {getFieldDecorator('appealNum', {
                      initialValue: info.appealNum || '',
                      rules: [
                        {
                          required: true,
                          message: '请填写诉求号码!',
                        },
                      ],
                    })(<Input placeholder="请输入" disabled={info.status != '1'} />)}
                  </FormItem>
                </Col>
              </Col>
              <Col span={24}>
                <Col span={10}>
                  <FormItem label="联系号码1">
                    {getFieldDecorator('appealPhone', {
                      initialValue: info.appealPhone || '',
                      rules: [
                        {
                          required: true,
                          message: '请填写联系号码!',
                        },
                      ],
                    })(<Input placeholder="请输入" disabled={info.status != '1'} />)}
                  </FormItem>
                </Col>
                <Col span={10}>
                  <FormItem label="联系号码2">
                    {getFieldDecorator('appealPhoneSecond', {
                      initialValue: info.appealPhoneSecond || '',
                    })(<Input placeholder="请输入" disabled={info.status != '1'} />)}
                  </FormItem>
                </Col>
              </Col>
              <Col span={24}>
                <FormItem label="备注">
                  {getFieldDecorator('appealRemark', {
                    initialValue: info.appealRemark || '',
                  })(<TextArea rows={4} placeholder="请输入" disabled={info.status != '1'} />)}
                </FormItem>
              </Col>
            </Col>
          </Row>
          {/* 工单处理 */}
          <h3 className="gEditLineColor">
            工单处理
            <Divider style={{ margin: '12px 0 8px 0' }} dashed />
          </h3>
          <Row>
            <Col span={24}>
              <Col span={12}>
                <FormItem label="办结时限">
                  {getFieldDecorator('assistTime', {
                    initialValue: (info.dispatchVos && info.dispatchVos[0]) ? info.dispatchVos[0].assistTime : '',
                    rules: [
                      {
                        required: true,
                        message: '请填写办结时限!',
                      },
                    ],
                  })(
                    <Input
                      placeholder="请输入"
                      addonAfter={selectAfter}
                      style={{ marginTop: 4 }}
                      disabled={info.status != '1'}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="备注">
                  {getFieldDecorator('remarks', {
                    initialValue: info.remarks || '',
                  })(<Input disabled={info.status != '1'} />)}
                </FormItem>
              </Col>
            </Col>
            <Col span={24}>
              <Col span={6}>
                <FormItem label="主办部门">
                  {getFieldDecorator(`organizeDepartment`, {
                    initialValue: (info.dispatchVos && info.dispatchVos[0])
                      ? Number(info.dispatchVos[0].assistDepartment)
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
                      disabled={info.status != '1'}
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
              <Col span={6}>
                <FormItem label="承办人员">
                  {getFieldDecorator(`executor`, {
                    initialValue: (info.dispatchVos && info.dispatchVos[0]) ? Number(info.dispatchVos[0].executor) : '',
                    rules: [
                      {
                        required: true,
                        message: '请选择承办人员!',
                      },
                    ],
                  })(
                    <Select placeholder="请选择" disabled={info.status != '1'}>
                      {leadership &&
                        leadership.map(item => {
                          return <Option value={item.userId}>{item.userName}</Option>;
                        })}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={7}>
                <FormItem label="分管领导">
                  {getFieldDecorator(`leadership`, {
                    initialValue: Number(info.leadership) || '',
                    rules: [
                      {
                        required: true,
                        message: '请选择分管领导!',
                      },
                    ],
                  })(
                    <Select placeholder="请选择" disabled={info.status != '1'}>
                      {LeadersInCharge &&
                        LeadersInCharge.map(item => {
                          return <Option value={item.userId}>{item.userName}</Option>;
                        })}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={5}>
                <FormItem label="是否送审">
                  {getFieldDecorator(`isExamine`, {
                    initialValue: info.isExamine || '',
                  })(<Checkbox checked={info.isExamine == '1'} disabled={info.status != '1'} />)}
                </FormItem>
              </Col>
            </Col>
          </Row>
          <Row gutter={{ xl: 10, xxl: 36 }} hidden={info.isCheck == 0 || userRole != 2}>
            <h3 className="gEditLineColor">复核过程
            <Divider style={{ margin: '12px 0 8px 0' }} dashed />
            </h3>
            <Col span={24}>
              <Col span={7}>
                <FormItem label="复核时限" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} >
                  {getFieldDecorator("fhassistTime", {
                    initialValue: info.assistTime ? info.assistTime : "",
                  })(
                    <Input
                      placeholder="请输入"
                      addonAfter={selectAfter}
                      style={{ marginTop: 4 }}
                      disabled
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="复核部门" >
                  {getFieldDecorator(`fhorganizeDepartment`, {
                    initialValue: Number(info.assistDepartment) || '',
                  })(
                    <Select
                      placeholder="请选择"
                      onSelect={UrbanApartmentSelect}
                      disabled
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
              <Col span={8}>
                <FormItem label="复核人员" >
                  {getFieldDecorator(`fhexecutor`, {
                    initialValue: info.executorDesc ? info.executorDesc : "",
                  })(
                    <Select placeholder="请选择" disabled>
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
        </Form>
      </div>
    );
  }
}

const DetailInformation3 = Form.create()(app);
export default DetailInformation3;
