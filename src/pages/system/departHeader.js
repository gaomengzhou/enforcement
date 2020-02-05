import React, { Component } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
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
  Popconfirm,
  Tabs,
  message,
  Breadcrumb,
  Upload
} from 'antd';

import zoneSetting from "./zoneSetting.less";

const FormItem = Form.Item;
const Option = Select.Option;

class app extends Component {
  render() {
    const {
      handleCancel, visibleMoal, teams, setList, handleOk,
    } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    getFieldDecorator('keys', { initialValue: setList });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => (
      <Row key={index} style={{ border: "1px solid #e8e8e8" }} className={zoneSetting.setUp}>
        <Col span={24}>
          <Col span={24} >
            <Form.Item
              label={k.assistDepartmentDesc}
              required={false}
              key={index}
            >
              {getFieldDecorator(`squadronNum[${k.id}]`, {
                initialValue: k.squadronNum || undefined,
              })(<Select
                style={{ width: '150px', marginLeft: '160px' }}
                showSearch
                placeholder="请选择"
              // filterOption={(input, option) =>
              //   option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              // }
              >
                {teams &&
                  teams.map(item => {
                    return (
                      <Option value={item.code} key={item.code}>
                        {item.desp}
                      </Option>
                    );
                  })}
              </Select>)}
            </Form.Item>
          </Col>
        </Col>
      </Row>
    ));
    return (
      <div>
        <Breadcrumb separator=">">
          <span id="breadcrumbIcon" />
          <Breadcrumb.Item>综合执法部门管理</Breadcrumb.Item>
        </Breadcrumb>
        <div id="tableForm">
          <h3 id="listTitle">综合执法部门管理</h3>
          <div layout="inline">
            <div id="listOperator">
              <Button
                type="primary"
                onClick={this.props.showModal}
              >
                片区设置
              </Button>
            </div>
          </div>
        </div>
        <Modal
          title="片区设置"
          visible={visibleMoal}
          onOk={handleOk.bind(null, this.props.form)}
          onCancel={handleCancel}
          destroyOnClose={true}
          maskClosable={false}
        >
          <Form layout="inline">
            {formItems}
          </Form>
        </Modal>
      </div>
    );
  }
}

const departHeader = Form.create()(app);
export default departHeader;
