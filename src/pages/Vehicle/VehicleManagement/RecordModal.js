import React, { Component } from 'react';
// import DateYearPicker from '@/components/DateYearPicker';
import { Form, Input, Button, Row, Col, Modal, DatePicker,Select } from 'antd';
import moment from 'moment';
const Option = Select.Option;
const { MonthPicker } = DatePicker;
const FormItem = Form.Item;
class app extends React.Component {
  render() {
    const {
      visible,
      handleCancel,
      handleOk,
      title,
      showModal,
      query,
      detail={},
      dataDepart,
      onSelects,
      dataPetson,
      dataProduct
    } = this.props;
    const { getFieldDecorator } = this.props.form;
    // console.log(Svalue,"999")
    return (
      <Modal
        title={title}
        visible={visible}
        onOk={handleOk.bind(null, this.props.form, title)}
        onCancel={handleCancel}
        width={'50%'}
        destroyOnClose={true}
        maskClosable={false}
      >
        <Form>
          <Row>
            <Col span={24}>
              <Col span={10}>
                <FormItem labelCol={{ span: 9 }} wrapperCol={{ span: 14 }} label="车辆编号">
                  {getFieldDecorator('carNo', {
                    rules: [
                      {
                        required: true,
                        message: '车辆编号必填!',
                      },
                    ],
                    initialValue:detail.carNo,
                  })(
                    <Input />
                  )}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem label="车架号" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
                  {getFieldDecorator('frameId', {
                    rules: [
                      {
                        pattern:/^((?! ).)*$/,
                        message: '不能输入空格',
                      }
                    ],
                    initialValue:detail.frameId,
                  })(<Input />)}
                </FormItem>
              </Col>
            </Col>
            <Col span={24}>
              <Col span={10}>
                <FormItem label="车牌号" labelCol={{ span: 9 }} wrapperCol={{ span: 14 }}>
                  {getFieldDecorator('plateId', {
                    initialValue: detail.plateId,
                    rules: [
                      {
                        required: true,
                        message: '车牌号必填!',
                      },
                      {
                        pattern:/^((?! ).)*$/,
                        message: '不能输入空格',
                      }
                    ],
                  })(<Input />)}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem label="车型" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
                  {getFieldDecorator('model', { initialValue: detail.model, rules: [
                    {
                      pattern:/^((?! ).)*$/,
                      message: '不能输入空格',
                    },
                  ], })(
                    <Input />
                  )}
                </FormItem>
              </Col>
            </Col>
            <Col span={24}>
              <Col span={10}>
                <FormItem label="使用部门" labelCol={{ span: 9 }} wrapperCol={{ span: 14 }}>
                  {getFieldDecorator('department', {
                    initialValue:  detail.department || undefined,
                    rules: [
                      {
                        required: true,
                        message: '使用部门必填!',
                      },
                    ],
                  })( <Select onSelect={value => onSelects(value)} placeholder="请选择"	>
                    {
                      dataDepart &&
                      dataDepart.map(item => {
                        // console.log(item);
                        return (
                          <Option value={item.id}>
                            {item.orgName}
                          </Option>
                        );
                      })
                    }
                  </Select>)}
                </FormItem>
              </Col>
              <Col span={10}>
              <FormItem label="驾驶员或责任人" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
                {getFieldDecorator('pilot', {
                  initialValue: detail.pilot|| undefined,
                  rules: [
                    {
                      required: true,
                      message: '驾驶员或责任人必填!',
                    },
                  ],
                })( <Select placeholder="请选择">
                {
                  dataPetson &&
                  dataPetson.map(item => {
                    // console.log(item);
                    return (
                      <Option key={item.userId} value={item.userId}>
                        {item.userName}
                      </Option>
                    );
                  })
                }
              </Select>)}
              </FormItem>
            </Col>
            </Col>
            <Col span={24}>
            <Col span={10}>
              <FormItem label="联系电话" labelCol={{ span: 9 }} wrapperCol={{ span: 14 }}>
                {getFieldDecorator('phone', {
                  initialValue: detail.phone,
                  rules: [
                    {
                      required: true,
                      message: '联系电话必填!',
                    },
                     {
                      pattern: /^[1][3,4,5,7,8][0-9]{9}$/,
                      message: '联系电话格式不正确!',
                    },
                  ],
                })( <Input />)}
              </FormItem>
            </Col>
            <Col span={10}>
            <FormItem label="产品所属" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
              {getFieldDecorator('propertyRights', {
                initialValue: detail.propertyRights,
                rules: [
                  {
                    required: true,
                    message: '驾驶员或责任人必填!',
                  },
                ],
              })( <Select onSelect={value => onSelects(value)} placeholder="请选择"	>
              {
                dataProduct &&
                dataProduct.map(item => {
                  // console.log(item);
                  return (
                    <Option value={item.code}>
                      {item.desp}
                    </Option>
                  );
                })
              }
            </Select>)}
            </FormItem>
          </Col>
          </Col>
          <Col span={24}>
          <Col span={12}>
            <FormItem label="交强险截止日期" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
              {getFieldDecorator('deadline', {
                initialValue:(title=="编辑")?moment( detail.deadline): '',
                rules: [
                  {
                    required: true,
                    message: '交强险截止日期必填!',
                  },
                
                ],
              })( <DatePicker
                format="YYYY-MM-DD"
                getCalendarContainer={triggerNode => triggerNode.parentNode}
                style={{ width: 235 }}
              />)}
            </FormItem>
          </Col>
        </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

const RecordModal = Form.create()(app);
export default RecordModal;
