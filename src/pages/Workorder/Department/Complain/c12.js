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
      onPreview: this.props.handlePreview,
      onRemove: this.props.handleRemove,
    };
    const uploadButton = (
      <div>
        <Button className="ant-upload-text" disabled={info.status != '1'}>整改前附件</Button>
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
      onPreview: this.props.handlePreview,
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
            {/* 附件 */}
            <h3> </h3>
            <Col span={24} push={1} style={{ padding: 10, overflow: 'auto' }}>
              <Col span={11}>{this.renderAttachment()}</Col>
              <Col span={11} push={1}>{this.renderAttachmentTwo()}</Col>
            </Col>
          </Row>
          {/* 工单处理 */}
        </Form>
      </div>
    );
  }
}

const DetailInformation3 = Form.create()(app);
export default DetailInformation3;
