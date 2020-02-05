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
        visibles,
      handleCancels,
      handleOks,
      showModals,
    } = this.props;
    const { getFieldDecorator } = this.props.form;
    // console.log(Svalue,"999")
    return (
      <Modal
        title="查看工单"
        visible={visibles}
        onOk={handleOks}
        onCancel={handleCancels}
        width={'50%'}
        destroyOnClose={true}
        maskClosable={false}
      >
        <Form>
          <Row>
            <Col span={24} style={{marginTop:"-190px"}}>
            <Col span={10} push={12} style={{marginTop:"-35px"}}>
              <FormItem label="部门" labelCol={{ span: 9 }} wrapperCol={{ span: 15 }}>
              {getFieldDecorator('orgNames')(<div>{ detail.orgNames}</div>)}
            </FormItem>
              </Col>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

const RecordsModal = Form.create()(app);
export default RecordsModal;
