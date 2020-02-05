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
    const { uploading, fileListTwo, filePathTwo, previewVisible, previewImage, info } = this.props;
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
        <Button className="ant-upload-text" disabled={info.status != '3'}>整改后附件</Button>
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
      handOverSource,
      taskType,
      Apartment,
      parentBank,
      taskPriority,
      UrbanApartmentSelect,
      leadership,
      executor,
      info,
      userRole,
      getUnit,
    } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const flag = info.status;
    const selectAfter = (
      <Select onChange={getUnit} value="小时" style={{ width: 70 }}>
        <Option value="hour">小时</Option>
        <Option value="day">天</Option>
      </Select>
    );

    return (
      <div id="tableListForm" style={{ background: '#fff', paddingBottom: 28 }}>
        <Form>
          <Row gutter={{ xl: 8, xxl: 48 }}>
            <Col span={24}>
              <h3> </h3>
              <div id="tableListForm" style={{ padding: '0 10px 0 0' }}>
                <Col span={24}>
                  <Col span={11}>{this.renderAttachment()}</Col>
                  <Col span={11} push={1}>{this.renderAttachmentTwo()}</Col>
                </Col>
              </div>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}

const DetailInformation1 = Form.create()(app);
export default DetailInformation1;