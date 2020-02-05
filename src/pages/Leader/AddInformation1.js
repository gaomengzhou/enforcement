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
import moment from 'moment';
import styles from './Detail.less';
import uploadHead from "../../../public/upload.png"

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

class app extends PureComponent {
  // 整改前
  renderAttachment() {
    const { uploading, fileList, filePath, previewVisible, previewImage, watermark64 } = this.props;
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
        <Button style={{ position: "absolute", top: -6, left: 88 }} className="ant-upload-text">整改前</Button>
      </div>
    );
    const timer = moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
    const watermarkObj = { previewImage, watermark64 }
    return (
      <Fragment>
        <div className="clearfix">
          <Upload {...uploadProps}>{fileList.length >= 10 ? null : uploadButton}</Upload>
          <Modal visible={previewVisible} footer={null} onCancel={this.props.handleCancel}>
            {/* <ExtensionCom {...watermarkObj} /> */}
            <img id="watermarkImg" alt="example" style={{ width: '100%' }} src={previewImage} />
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
      getUnit,
      classification,
    } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const selectAfter = (
      <Select onChange={getUnit} defaultValue="1" style={{ width: 70 }}>
        <Option value="1">小时</Option>
        <Option value="2">天</Option>
      </Select>
    );


    return (
      <div id="tableListForm" style={{ background: '#fff', paddingBottom: 28 }}>
        <Form>
          <Row>
            <Col span={16}>
              {/* 工单内容 */}
              <div id="tableListForm" style={{ padding: '0 10px 0 0' }}>
                <Col span={24}>
                  <h3 style={{ padding: "20px 0 12px 40px" }}>工单内容</h3>
                </Col>
                <Row style={{ marginLeft: 0 }} gutter={{ xl: 8, xxl: 40 }}>
                  <Col span={24}>
                    <Col span={12}>
                      <FormItem labelAlign="left" label="工单来源">
                        {getFieldDecorator('workSource', {
                          initialValue: "2",
                          rules: [{
                            required: true,
                            message: "请填写工单来源",
                          }]
                        })(
                          <Select placeholder="请选择">
                            {handOverSource && handOverSource.map(item =>
                              <Option value={item.code} key={item.code}>
                                {item.desp}
                              </Option>
                            )}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem label="任务分类">
                        {getFieldDecorator('taskClassify', {
                          rules: [{
                            required: true,
                            message: "请填写任务分类",
                          }]
                        })(
                          <Select placeholder="请选择">
                            {classification && classification.map(item =>
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
                    <Col span={12}>
                      <FormItem label="类型">
                        {getFieldDecorator('taskType', {
                          rules: [{
                            required: true,
                            message: "请填写类型",
                          }]
                        })(
                          <Select placeholder="请选择">
                            {taskType && taskType.map(item =>
                              <Option value={item.code} key={item.code}>
                                {item.desp}
                              </Option>
                            )}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem label="优先级">
                        {getFieldDecorator('taskPriority', {
                          initialValue: "1",
                          rules: [{
                            required: true,
                            message: "请填写优先级",
                          }]
                        })(
                          <Select placeholder="请选择">
                            {taskPriority && taskPriority.map(item =>
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
                    <Col span={24}>
                      <FormItem label="工作描述">
                        {getFieldDecorator('workDescription', {
                          rules: [{
                            required: true,
                            message: "请填写工作描述",
                          }]
                        })(
                          <TextArea rows={4} placeholder="" />
                        )}
                      </FormItem>
                    </Col>
                  </Col>
                  <Col span={24}>
                    <Col span={24}>
                      <FormItem label="工作要求">
                        {getFieldDecorator('require', {
                          rules: [{
                            required: true,
                            message: "请填写工作要求",
                          }]
                        })(
                          <TextArea rows={4} placeholder="" />
                        )}
                      </FormItem>
                    </Col>
                  </Col>
                  <Col span={24}>
                    <h3 className="gEditLineColor" style={{ padding: "40px 0 12px 20px" }}>
                      工单处理
                    </h3>
                  </Col>
                  <Col span={24}>
                    <Col span={12}>
                      <FormItem label="办结时限" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                        {getFieldDecorator("assistTime", {
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
                          />
                        )}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem label="所属社区" labelAlign="left">
                        {getFieldDecorator("ownCommunity", {
                          rules: [{
                            required: true,
                            message: "请填写所属社区",
                          }]
                        })(
                          <Select
                            placeholder="请选择社区"
                          >
                            {parentBank && parentBank.map(item =>
                              <Option value={item.code} key={item.code}>
                                {item.desp == "总行" ? null : item.desp}
                              </Option>
                            )}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                  </Col>
                  <Col span={24}>
                    <Col span={12}>
                      <FormItem label="主办部门">
                        {getFieldDecorator(`organizeDepartment`, {
                          rules: [
                            {
                              required: true,
                              message: '请选择主办部门!',
                            },
                          ],
                        })(
                          <Select
                            placeholder="请选择"
                            onChange={UrbanApartmentSelect}
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
                    <Col span={12}>
                      <FormItem label="承办人员">
                        {getFieldDecorator(`executor`, {
                          rules: [
                            {
                              required: true,
                              message: '请选择承办人员!',
                            },
                          ],
                        })(
                          <Select
                            placeholder="请选择"
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
                  <Col span={24}>
                    <Col span={12}>
                      <FormItem label="分管领导">
                        {getFieldDecorator(`leadership`, {
                          rules: [
                            {
                              required: true,
                              message: '请选择分管领导!',
                            },
                          ],
                        })(
                          <Select
                            placeholder="请选择"
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
                    <Col span={12}>
                      <FormItem label="&nbsp;&nbsp;&nbsp;是否送审">
                        {getFieldDecorator(`isExamine`)(
                          <Checkbox />
                        )}
                      </FormItem>
                    </Col>
                  </Col>
                  <Col span={24}>
                    <Col span={24}>
                      <FormItem label="&nbsp;&nbsp;&nbsp;备注">
                        {getFieldDecorator("remarks")(
                          <Input />
                        )}
                      </FormItem>
                    </Col>
                  </Col>
                </Row>
              </div>
            </Col>
            {/* 附件 */}
            <Col span={8}>
              <div id="tableListForm" style={{ padding: '0 40px 0 10px', position: "relative" }}>
                <Col span={24}>
                  <h3 style={{ padding: "20px 0 11px 0" }}>附件清单</h3>
                </Col>
                <Col span={12} style={{ margin: "10px 0", borderRight: "solid 1px #DEE4EC", paddingRight: 19 }}>
                  <Col span={10}><h5 style={{ fontSize: 14, fontWeight: 600, margin: 0, marginBottom: 11 }}>整改前</h5></Col>
                  {/* <h5 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>整改前</h5> */}
                  {this.renderAttachment()}
                </Col>
                <Col span={12} style={{ margin: "10px 0", paddingLeft: 20, }}>
                  <h5 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>整改后</h5>
                </Col>
              </div>
            </Col>
          </Row>
          {/* 工单处理 */}
          {/* <div id="tableListForm" style={{ padding: '30px 10px 0 0' }}>
            <h3 className="gEditLineColor">工单处理
            </h3>
            <Row gutter={{ xl: 10, xxl: 36 }}>
              <Col span={24}>
                <Col span={6}>
                  <FormItem label="办结时限" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} >
                    {getFieldDecorator("assistTime", {
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
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={10}>
                  <FormItem label="备注" >
                    {getFieldDecorator("remarks")(
                      <Input />
                    )}
                  </FormItem>
                </Col>
              </Col>
              <Col span={24}>
                <Col span={6}>
                  <FormItem label="主办部门" >
                    {getFieldDecorator(`organizeDepartment`, {
                      rules: [
                        {
                          required: true,
                          message: '请选择主办部门!',
                        },
                      ],
                    })(
                      <Select
                        placeholder="请选择"
                        onChange={UrbanApartmentSelect}
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
                <Col span={6}>
                  <FormItem label="承办人员" >
                    {getFieldDecorator(`executor`, {
                      rules: [
                        {
                          required: true,
                          message: '请选择承办人员!',
                        },
                      ],
                    })(
                      <Select
                        placeholder="请选择"
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
                <Col span={7}>
                  <FormItem label="分管领导" >
                    {getFieldDecorator(`leadership`, {
                      rules: [
                        {
                          required: true,
                          message: '请选择分管领导!',
                        },
                      ],
                    })(
                      <Select
                        placeholder="请选择"
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
                <Col span={5}>
                  <FormItem label="是否送审">
                    {getFieldDecorator(`isExamine`)(
                      <Checkbox />
                    )}
                  </FormItem>
                </Col>
              </Col>
            </Row>
          </div> */}
        </Form>
      </div>
    )
  }
}

class ExtensionCom extends PureComponent {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const imgs = new Image();
    const timer = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    imgs.src = this.props.previewImage;
    imgs.onload = () => {
      const watermark = document.getElementById("watermark");
      const ctx = watermark.getContext("2d");
      ctx.drawImage(imgs, 0, 0, 472, 265);
      ctx.font = "14px Arial";
      ctx.fillStyle = "red";
      ctx.fillText(`${timer} -- 整改前`, 262, 252);
      const img = watermark.toDataURL('image/png')
      this.props.watermark64(img);
    }
  }


  render() {
    return (
      <canvas id="watermark" width={472} height={265} />
    )
  }
}

const AddInformation1 = Form.create()(app);
export default AddInformation1;
