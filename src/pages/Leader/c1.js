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
        <Option value="1">小时</Option>
        <Option value="2">天</Option>
      </Select>
    );

    return (
      <div id="tableListForm" style={{ background: '#fff', paddingBottom: 28 }}>
        <Form>
          <Row gutter={{ xl: 8, xxl: 48 }}>
            <Col span={24}>
              {/* 工单内容 */}
              <div id="tableListForm" style={{ padding: '0 10px 0 0' }}>
                <Col span={24}>
                  <h3>工单内容
              <Divider style={{ margin: '12px 0 8px 0' }} dashed />
                  </h3>
                </Col>
                <Row gutter={{ xl: 8, xxl: 48 }}>
                  <Col span={24}>
                    <Col span={8}>
                      <FormItem label="工单来源">
                        {getFieldDecorator('workSource', {
                          rules: [{
                            required: true,
                            message: "请填写工单来源",
                          }],
                          initialValue: info.workSource || "",
                        })(
                          <Select placeholder="请选择" disabled={flag != 1}>
                            {handOverSource && handOverSource.map(item =>
                              <Option value={item.code} key={item.code}>
                                {item.desp}
                              </Option>
                            )}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col span={8}>
                      <FormItem label="任务分类">
                        {getFieldDecorator('taskClassify', {
                          rules: [{
                            required: true,
                            message: "请填写任务分类",
                          }],
                          initialValue: Number(info.taskClassify) || "",
                        })(
                          <Select placeholder="请选择" disabled={flag != 1}>
                            {Apartment && Apartment.map(item =>
                              <Option value={item.id} key={item.id}>
                                {item.orgName}
                              </Option>
                            )}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col span={8}>
                      <FormItem label="类型">
                        {getFieldDecorator('taskType', {
                          rules: [{
                            required: true,
                            message: "请填写类型",
                          }],
                          initialValue: info.taskType || "",
                        })(
                          <Select placeholder="请选择" disabled={flag != 1}>
                            {taskType && taskType.map(item =>
                              <Option value={item.code} key={item.code}>
                                {item.desp}
                              </Option>
                            )}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                  </Col>
                  <Col span={24}>
                    <Col span={8}>
                      <FormItem label="优先级">
                        {getFieldDecorator('taskPriority', {
                          rules: [{
                            required: true,
                            message: "请填写优先级",
                          }],
                          initialValue: info.taskPriority || "",
                        })(
                          <Select placeholder="请选择" disabled={flag != 1}>
                            {taskPriority && taskPriority.map(item =>
                              <Option value={item.code} key={item.code}>
                                {item.desp}
                              </Option>
                            )}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col span={8}>
                      <FormItem label="所属社区" >
                        {getFieldDecorator("ownCommunity", {
                          initialValue: info.ownCommunity || '',
                          rules: [{
                            required: true,
                            message: "请填写所属社区",
                          }],

                        })(
                          <Select
                            placeholder="请选择社区"
                            disabled={flag != 1}
                          >
                            {parentBank && parentBank.map(item =>
                              <Option value={item.code} key={item.code}>
                                {item.desp}
                              </Option>
                            )}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                  </Col>
                  <Col span={24}>
                    <Col span={22}>
                      <FormItem label="工作描述">
                        {getFieldDecorator('workDescription', {
                          rules: [{
                            required: true,
                            message: "请填写工作描述",
                          }],
                          initialValue: info.workDescription || "",
                        })(
                          <TextArea rows={4} placeholder="" disabled={flag != 1} />
                        )}
                      </FormItem>
                    </Col>
                  </Col>
                  <Col span={24}>
                    <Col span={22}>
                      <FormItem label="工作要求">
                        {getFieldDecorator('require', {
                          rules: [{
                            required: true,
                            message: "请填写工作要求",
                          }],
                          initialValue: info.require || "",
                        })(
                          <TextArea rows={4} placeholder="" disabled={flag != 1} />
                        )}
                      </FormItem>
                    </Col>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
          {/* 工单处理 */}
          <div id="tableListForm" style={{ padding: '58px 10px 0 0' }}>
            <h3 className="gEditLineColor">工单处理
            <Divider style={{ margin: '12px 0 8px 0' }} dashed />
            </h3>
            <Row gutter={{ xl: 10, xxl: 36 }}>
              <Col span={24}>
                <Col span={8}>
                  <FormItem label="办结时限" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} >
                    {getFieldDecorator("assistTime", {
                      rules: [
                        {
                          required: true,
                          message: '请填写办结时限!',
                        },
                      ],
                      initialValue: (info.dispatchVos && info.dispatchVos[0]) ? info.dispatchVos[0].assistTime : "",
                    })(
                      <Input
                        placeholder="请输入"
                        addonAfter={selectAfter}
                        style={{ marginTop: 4 }}
                        disabled={flag != 1}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={11}>
                  <FormItem label="备注" >
                    {getFieldDecorator("remarks", {
                      initialValue: (info.dispatchVos && info.dispatchVos[0]) ? info.dispatchVos[0].remarks : "",
                    })(
                      <Input disabled={flag != 1} />
                    )}
                  </FormItem>
                </Col>
                <Col span={5}>
                  <FormItem label="是否送审">
                    {getFieldDecorator(`isExamine`, {
                      initialValue: info.isExamine || ""
                    })(
                      <Checkbox checked={info.isExamine == '1'} disabled={flag != 1} />
                    )}
                  </FormItem>
                </Col>
              </Col>
              <Col span={24}>
                <Col span={8}>
                  <FormItem label="主办部门" >
                    {getFieldDecorator(`organizeDepartment`, {
                      rules: [
                        {
                          required: true,
                          message: '请选择主办部门!',
                        },
                      ],
                      initialValue: Number(info.organizeDepartment) || '',
                    })(
                      <Select
                        placeholder="请选择"
                        onSelect={UrbanApartmentSelect}
                        disabled={flag != 1}
                      >
                        {Apartment && Apartment.map(item =>
                          <Option value={item.id} key={item.id}>
                            {item.orgName}
                          </Option>
                        )}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="承办人员" >
                    {getFieldDecorator(`executor`, {
                      rules: [
                        {
                          required: true,
                          message: '请选择承办人员!',
                        },
                      ],
                      initialValue: (info.dispatchVos && info.dispatchVos[0]) ? Number(info.dispatchVos[0].executor) : "",
                    })(
                      <Select
                        placeholder="请选择"
                        disabled={flag != 1}
                      >
                        {executor && executor.map(item =>
                          <Option value={item.userId} key={item.userId}>
                            {item.userName}
                          </Option>
                        )}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="分管领导" >
                    {getFieldDecorator(`leadership`, {
                      rules: [
                        {
                          required: true,
                          message: '请选择分管领导!',
                        },
                      ],
                      initialValue: Number(info.leadership) || ""
                    })(
                      <Select
                        placeholder="请选择"
                        disabled={flag != 1}
                      >
                        {leadership && leadership.map(item =>
                          <Option value={item.userId} key={item.userId}>
                            {item.userName}
                          </Option>
                        )}
                      </Select>
                    )}
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
                      initialValue: info.assistTime || "",
                    })(
                      <Input
                        placeholder="请输入"
                        addonAfter={selectAfter}
                        style={{ marginTop: 4 }}
                        disabled={flag != 1}
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
                        disabled={flag != 1}
                      >
                        {Apartment && Apartment.map(item =>
                          <Option value={item.id} key={item.id}>
                            {item.orgName}
                          </Option>
                        )}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="复核人员" >
                    {getFieldDecorator(`fhexecutor`, {
                      initialValue: info.executorDesc || "",
                    })(
                      <Select
                        placeholder="请选择"
                        disabled={flag != 1}
                      >
                        {executor && executor.map(item =>
                          <Option value={item.userId} key={item.userId}>
                            {item.userName}
                          </Option>
                        )}
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Col>
            </Row>
          </div>
        </Form>
      </div>
    )
  }
}

const DetailInformation1 = Form.create()(app);
export default DetailInformation1;