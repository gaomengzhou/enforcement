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


const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const Formats = 'YYYY-MM-DD HH:mm:ss';

class app extends PureComponent {
  // 整改前
  renderAttachment() {
    const { uploading, fileList, filePath, previewVisible, previewImage, info } = this.props;
    console.log(fileList)
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
        <Button style={{ position: "absolute", top: -6, left: 88 }} className="ant-upload-text" disabled={info.status != '1'}>整改前</Button>
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
      handleRemoveTwo,
      addZCZ,
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
        <Button style={{ position: "absolute", top: -6, left: 108 }} className="ant-upload-text">
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
      form,
      businessType,
      gender,
      parentBank,
      communityGrid,
      gridList,
      newgridList,
      getUnit,
      UrbanApartment,
      leadership,
      UrbanApartmentSelect,
      info,
      dispatchVos,
    } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const userRole = sessionStorage.getItem('userRole');
    const selectAfter = (
      <Select onChange={getUnit} defaultValue="1" style={{ width: 70 }}>
        <Option value="1" key="1">小时</Option>
        <Option value="2" key="2">天</Option>
      </Select>
    );
    return (
      <div id="tableListForm" style={{ background: '#fff', paddingBottom: 28 }}>
        <Row>
          <Col span={16}>
            {/* 上报信息 */}
            <div id="tableListForm" style={{ padding: '0 10px 0 0' }}>
              <Col span={24}>
                <h3 style={{ padding: "20px 0 12px 40px" }}>上报信息</h3>
              </Col>
              <Row style={{ marginLeft: 0 }} gutter={{ xl: 8, xxl: 40 }}>
                <Col span={24}>
                  <Col span={12}>
                    <FormItem label="业务类型">
                      {getFieldDecorator('businessType', {
                        initialValue: info.businessType || "",
                        rules: [{
                          required: true,
                          message: "请填写业务类型",
                        }]
                      })(
                        <Select disabled={info.status != '2' && info.status != '1'} placeholder="请选择">
                          {businessType &&
                            businessType.map(item => (
                              <Option value={item.code} key={item.code}>
                                {item.desp}
                              </Option>
                            ))}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="上报时间">
                      {getFieldDecorator('reportTime', {
                        initialValue: moment(info.reportTime) || "",
                        rules: [{
                          required: true,
                          message: "请填写上报时间",
                        }]
                      })(
                        <DatePicker
                          format="YYYY-MM-DD HH:mm:ss"
                          disabled={info.status != '2' && info.status != '1'}
                          showTime placeholder="请选择"
                          style={{ width: '100%' }}
                          allowClear
                        />
                      )}
                    </FormItem>
                  </Col>
                </Col>
                <Col span={24}>
                  <Col span={12}>
                    <FormItem label="详细地址">
                      {getFieldDecorator('address', {
                        initialValue: info.address || "",
                        rules: [{
                          required: true,
                          message: "请填写详细地址",
                        }]
                      })(
                        <Select disabled={info.status != '2' && info.status != '1'} onSelect={communityGrid} placeholder="请选择社区">
                          {parentBank &&
                            parentBank.map(item => (
                              <Option value={item.code} key={item.code}>
                                {item.desp == "总行" ? undefined : item.desp}
                              </Option>
                            ))}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem >
                      {getFieldDecorator('detailedLocation', {
                        initialValue: info.detailedLocation || "",
                        rules: [{
                          required: true,
                          message: "请输入地址明细",
                        }]
                      })(
                        <Input disabled={info.status != '2' && info.status != '1'} placeholder="请输入地址明细" />
                      )}
                    </FormItem>
                  </Col>
                </Col>
                <Col span={24}>
                  <Col span={12}>
                    <FormItem label="网格名称">
                      {getFieldDecorator('ownGridNumber', {
                        initialValue: info.ownGridNumber || "",
                        rules: [{
                          required: true,
                          message: "请填写网格名称",
                        }]
                      })(
                        <Select
                          disabled={info.status != '2' && info.status != '1'}
                          placeholder="请选择"
                          showSearch
                          // filterOption={(input, option) =>
                          //   option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          // }
                          allowClear
                        >
                          {/* {console.log(newgridList)} */}
                          {newgridList.length > 0 ?
                            newgridList.map(
                              item => <Option value={item.id} key={item.id}>{item.name}</Option>
                            ) : gridList.map(
                              item => <Option value={item.id} key={item.id}>{item.name}</Option>
                            )
                          }
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                </Col>
                <Col span={24}>
                  <Col span={24}>
                    <FormItem label="上报内容">
                      {getFieldDecorator('reportContent', {
                        initialValue: info.reportContent || "",
                        rules: [{
                          required: true,
                          message: "请填写上报内容",
                        }]
                      })(
                        <TextArea disabled={info.status != '2' && info.status != '1'} rows={4} placeholder="" />
                      )}
                    </FormItem>
                  </Col>
                </Col>
                <Col span={24}>
                  <Col span={24}>
                    <FormItem label="建议">
                      {getFieldDecorator('proposal', {
                        initialValue: info.proposal || "",
                        rules: [{
                          required: true,
                          message: "请填写建议",
                        }]
                      })(
                        <TextArea disabled={info.status != '2' && info.status != '1'} rows={4} placeholder="" />
                      )}
                    </FormItem>
                  </Col>
                </Col>
              </Row>
            </div>
            {/* 联系信息 */}
            <div id="tableListForm" style={{ padding: '0 10px 0 0' }}>
              <Col span={24}>
                <h3 style={{ padding: "20px 0 12px 40px" }}>联系信息</h3>
              </Col>
              <Row style={{ marginLeft: 0 }} gutter={{ xl: 10, xxl: 40 }}>
                <Col span={24}>
                  <Col span={12}>
                    <FormItem label="姓名">
                      {getFieldDecorator('appealName', {
                        initialValue: info.appealName || "",
                        rules: [
                          {
                            required: true,
                            message: '请填写姓名!',
                          },
                          {
                            pattern: /^[\u2E80-\u9FFF]+$/,
                            message: '姓名只能是中文'
                          }
                        ],
                      })(<Input disabled={info.status != '2' && info.status != '1'} placeholder="" />)}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="性别">
                      {getFieldDecorator('appealGender', {
                        initialValue: info.appealGender || "",
                        rules: [
                          {
                            required: true,
                            message: '请选择性别!',
                          },
                        ],
                      })(
                        <Select disabled={info.status != '2' && info.status != '1'} placeholder="请选择" allowClear>
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
                </Col>
                <Col span={24}>
                  <Col span={12}>
                    <FormItem label="联系号码">
                      {getFieldDecorator('contact', {
                        initialValue: info.contact || "",
                        rules: [
                          {
                            required: true,
                            message: '请填写联系号码!',
                          },
                          {
                            pattern: /^1[3456789]\d{9}$/,
                            message: '请输入正确格式的号码',
                          }
                        ],
                      })(<Input disabled={info.status != '2' && info.status != '1'} placeholder="" />)}
                    </FormItem>
                  </Col>
                </Col>
                <Col span={24}>
                  <Col span={24}>
                    <FormItem label="备注">
                      {getFieldDecorator('remark', {
                        initialValue: info.remark || "",
                        rules: [{
                          required: true,
                          message: "请填写工作要求",
                        }]
                      })(
                        <TextArea disabled={info.status != '2' && info.status != '1'} rows={4} placeholder="" />
                      )}
                    </FormItem>
                  </Col>
                </Col>
              </Row>
            </div>
            {/* 上报处理 */}
            <div hidden={sessionStorage.getItem('userRole') == '4'} id="tableListForm" style={{ padding: '0 10px 0 0' }}>
              <Col span={24}>
                <h3 style={{ padding: "20px 0 12px 40px" }}>上报处理</h3>
              </Col>
              <Row style={{ marginLeft: 0 }} gutter={{ xl: 10, xxl: 40 }}>
                <Col span={24}>
                  <Col span={12}>
                    <FormItem label="办结时限" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} >
                      {getFieldDecorator("assistTime", {
                        // initialValue: (info.dispatchVos && info.dispatchVos[0]) ? info.dispatchVos[0].assistTime : "",
                        initialValue: dispatchVos.length > 0 ? dispatchVos[0].assistTime : "",
                        rules: [
                          {
                            required: userRole == 4 ? false : true,
                            message: '请填写办结时限!',
                          },
                          {
                            pattern: /^\+?[1-9]\d*$/,
                            message: '请输大于0的正整数',
                          }
                        ],
                      })(
                        <Input disabled={info.status != '2' && info.status != '1'} addonAfter={selectAfter} />
                      )}
                    </FormItem>
                  </Col>
                </Col>
                <Col span={24}>
                  <Col span={12}>
                    <FormItem label="处置部门" >
                      {getFieldDecorator(`assistDepartment`, {
                        initialValue: dispatchVos.length > 0 ? Number(dispatchVos[0].assistDepartment) : "",
                        rules: [
                          {
                            required: userRole == 4 ? false : true,
                            message: '请选择处置部门!',
                          },
                        ],
                      })(
                        <Select disabled={info.status != '2' && info.status != '1'} placeholder="请选择" onSelect={UrbanApartmentSelect}>
                          {UrbanApartment &&
                            UrbanApartment.map(item => {
                              return <Option value={item.id} key={item.id}>{item.orgName}</Option>;
                            })}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="处置人" >
                      {getFieldDecorator(`executor`, {
                        initialValue: dispatchVos.length > 0 ? Number(dispatchVos[0].executor) : "",
                        rules: [
                          {
                            required: userRole == 4 ? false : true,
                            message: '请选择处置人!',
                          },
                        ],
                      })(
                        <Select disabled={info.status != '2' && info.status != '1'} placeholder="请选择">
                          {leadership &&
                            leadership.map(item => {
                              return <Option value={item.userId} key={item.userId}>{item.userName}</Option>;
                            })}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                </Col>
              </Row>
            </div>
            {/* 复核过程 */}
            <div id="tableListForm" style={{ padding: '0 10px 0 0' }} hidden={info.isCheck == 0 || userRole != 2}>
              <Col span={24}>
                <h3 style={{ padding: "20px 0 12px 40px" }}>复核过程</h3>
              </Col>
              <Row style={{ marginLeft: 0 }} gutter={{ xl: 10, xxl: 40 }} >
                <Col span={24}>
                  <Col span={12}>
                    <FormItem label="复核时限" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                      {getFieldDecorator("fhassistTime", {
                        initialValue: dispatchVos.length > 1 ? dispatchVos[1].assistTime : "",
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
                </Col>
                <Col span={24}>
                  <Col span={12}>
                    <FormItem label="复核部门">
                      {getFieldDecorator(`fhorganizeDepartment`, {
                        initialValue: 1,
                      })(
                        <Select
                          placeholder="请选择"
                          onSelect={UrbanApartmentSelect}
                          disabled
                        >
                          <Option value={1} key={1}>
                            {dispatchVos.length > 1 ? dispatchVos[1].assistDepartmentDesc : ""}
                          </Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="复核人员">
                      {getFieldDecorator(`fhexecutor`, {
                        initialValue: 1,
                      })(
                        <Select
                          placeholder="请选择"
                          disabled
                        >
                          <Option value={1} key={1}>
                            {dispatchVos.length > 1 ? dispatchVos[1].executorDesc : ""}
                          </Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                </Col>
              </Row>
            </div>
          </Col>
          <Col span={8}>
            <div id="tableListForm" style={{ padding: '0 40px 0 10px' }}>
              <Col span={24}>
                <h3 style={{ padding: "20px 0 11px 0" }}>附件清单</h3>
              </Col>
              <Col span={12} style={{ margin: "10px 0", borderRight: "solid 1px #DEE4EC", paddingRight: 19, position: "relative" }}>
                <Col span={10}>
                  <h5 style={{ fontSize: 14, fontWeight: 600, margin: 0, marginBottom: 11 }}>整改前</h5>
                </Col>
                {this.renderAttachment()}
              </Col>
              <Col span={12} style={{ margin: "10px 0", paddingLeft: 20, position: "relative" }}>
                <Col span={10}>
                  <h5 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>整改后</h5>
                </Col>
                {this.renderAttachmentTwo()}
              </Col>
            </div>
          </Col>
        </Row>
      </div>
    )
  }


}

const DetailInformation3 = Form.create()(app);
export default DetailInformation3;