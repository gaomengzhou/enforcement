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
    const { uploading, fileList, filePath, previewVisible, previewImage, dataSource, seePhotoList } = this.props;
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
      seePhotoList,
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
      results,
      closingType,
      satisfaction,
    } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    return (
      <div id="tableListForm" style={{ background: '#fff', paddingBottom: 28 }}>
        <div>
          <Row gutter={{ md: 8, lg: 8, xl: 16 }}>
            <Col span={24} style={{ marginTop: 18 }}>
              <Col span={11} style={{ margin: "10px 0", borderRight: "solid 1px #DEE4EC", paddingRight: 19, position: "relative" }}>
                <Col span={10}><h5 style={{ fontSize: 14, fontWeight: 600, margin: 0, marginBottom: 11 }}>整改前</h5></Col>
                {this.renderAttachment()}
              </Col>
              <Col span={11} style={{ margin: "10px 0", paddingLeft: 20, position: "relative" }}>
                <Col span={10}>
                  <h5 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>整改后</h5>
                </Col>
                {this.renderAttachmentTwo()}
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