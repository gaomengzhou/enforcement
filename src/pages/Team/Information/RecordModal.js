import React, { Component } from 'react';
// import DateYearPicker from '@/components/DateYearPicker';
import { Form, Input, Button, Row, Col, Modal, DatePicker,Select,Avatar  } from 'antd';
import { picIp } from '@/utils/ipConfig';
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
      showModal,
      query,
      detail={},
    } = this.props;
    const { getFieldDecorator } = this.props.form;
    // console.log(Svalue,"999")
    return (
      <Modal
        title="查看"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={'50%'}
        destroyOnClose={true}
        maskClosable={false}
      >
        <Form>
          <Row>
            <Col span={24}>
              <Col span={12}>
              <FormItem label="" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                {getFieldDecorator('pic')(<div><Avatar shape="square" size={234} src={picIp+detail.pic} /></div>)}
              </FormItem>
            </Col>
              <Col span={10}>
              <FormItem label="姓名" labelCol={{ span: 9 }} wrapperCol={{ span: 15 }}>
              {getFieldDecorator('name')(<div>{ detail.name}</div>)}
            </FormItem>
              </Col>
            </Col>
            <Col span={24} style={{marginTop:"-190px"}}>
            <Col span={10} push={12} style={{marginTop:"-35px"}}>
              <FormItem label="部门" labelCol={{ span: 9 }} wrapperCol={{ span: 15 }}>
              {getFieldDecorator('orgNames')(<div>{ detail.orgNames}</div>)}
            </FormItem>
              </Col>
            </Col>
            <Col span={24} style={{marginTop:"-170px"}}>
            <Col span={10}  push={12} style={{marginTop:"-35px"}}>
              <FormItem label="性别" labelCol={{ span: 9 }} wrapperCol={{ span: 15 }}>
              {getFieldDecorator('sexDesp')(<div>{ detail.sexDesp}</div>)}
            </FormItem>
              </Col>
            </Col>
            <Col span={24} style={{marginTop:"-150px"}}>
            <Col span={10}  push={12} style={{marginTop:"-35px"}}>
              <FormItem label="年龄" labelCol={{ span: 9 }} wrapperCol={{ span: 15 }}>
              {getFieldDecorator('age')(<div>{ detail.age}</div>)}
            </FormItem>
              </Col>
            </Col>
            <Col span={24} style={{marginTop:"-120px"}}>
            <Col span={10}  push={12} style={{marginTop:"-35px"}}>
              <FormItem label="职位" labelCol={{ span: 9 }} wrapperCol={{ span: 15 }}>
              {getFieldDecorator('name')(<div>{ detail.name}</div>)}
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
