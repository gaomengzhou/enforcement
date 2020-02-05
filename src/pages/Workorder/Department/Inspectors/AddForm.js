/* eslint-disable jsx-a11y/iframe-has-title */
/* eslint-disable no-plusplus */
/* eslint-disable no-restricted-globals */
/* eslint-disable eqeqeq */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/sort-comp */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-no-bind */
import React, { Component, Fragment } from 'react';
import Link from 'umi/link';
import moment from 'moment';
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
  Upload,
  InputNumber
} from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
let id = 0;

class app extends Component {
  // 整改前
  renderAttachment() {
    const { uploading, fileList, filePath, previewVisible, previewImage } = this.props;
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
        <Button style={{ position: "absolute", top: -6, left: 88 }} className="ant-upload-text">整改前附件</Button>
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
        <Button hidden={sessionStorage.getItem('userRole') != '4' || addZCZ != "zcz"} style={{ position: "absolute", top: -6, left: 108 }} className="ant-upload-text">
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

  add = () => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(id++);
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const {
      increase,
      leadership,
      workImpactScope,
      parentBank,
      processProgram,
      workLevel,
      workDestructionDegree,
      eventCategory,
      onSelect,
      bigClass,
      caseSmallType,
      UrbanApartment,
      previewVisible,
      previewImage,
      fileList,
      handlePreview,
      handleCancel,
      handleChange,
      UrbanApartmentSelect,
      gridList,
      showMap,
      mapBox,
      iframeSrc,
      getSrc,
      getUnit,
      addZCZ,
      communityGrid,
      newgridList,
    } = this.props;
    const selectAfter = (
      <Select onChange={getUnit} defaultValue="1" style={{ width: 80 }}>
        <Option value="1" key="1">小时</Option>
        <Option value="2" key="2">天</Option>
      </Select>
    );
    getFieldDecorator('keys', { initialValue: ['1'] });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => (
      <Row>
        <Col span={24}>
          <Col span={6}>
            <Form.Item
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 17 }}
              label="处置时限"
              key={index}
            >
              {getFieldDecorator(`assistTime[${index}]`, {
                initialValue: k.desp,
                rules: [
                  {
                    required: sessionStorage.getItem('userRole') != '4',
                    message: '请输入处置时限',
                  },
                  {
                    pattern: /^\+?[1-9]\d*$/,
                    message: '请输大于0的正整数',
                  }
                ],
              })(<Input addonAfter={selectAfter} />)}
            </Form.Item>
          </Col>
          <Col span={7} push={2}>
            <Form.Item
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 17 }}
              label="处置部门"
              key={index}
            >
              {getFieldDecorator(`assistDepartment[${index}]`, {
                initialValue: k.desp,
                rules: [
                  {
                    required: sessionStorage.getItem('userRole') != '4',
                    message: '请选择处置部门',
                  },
                ],
              })(
                <Select placeholder="请选择" onSelect={UrbanApartmentSelect}>
                  {UrbanApartment &&
                    UrbanApartment.map(item => {
                      return <Option value={item.id} key={item.id}>{item.orgName}</Option>;
                    })}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col span={7} push={3}>
            <Form.Item
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 17 }}
              label="处置人员"
              key={index}
            >
              {getFieldDecorator(`assistWorker[${index}]`, {
                initialValue: k.desp,
                rules: [
                  {
                    required: sessionStorage.getItem('userRole') != '4',
                    message: '请选择处置人员',
                  },
                ],
              })(
                <Select placeholder="请选择">
                  {leadership &&
                    leadership.map(item => {
                      return <Option value={item.userId} key={item.userId}>{item.userName}</Option>;
                    })}
                </Select>
              )}
            </Form.Item>
          </Col>
          {index > 0 && (
            <Col span={3} push={1} style={{ marginTop: 10 }}>
              <a onClick={() => this.remove(k)}>移除</a>
            </Col>
          )}
        </Col>
      </Row>
    ));
    return (
      <div>
        <div id="listTitleDetailBanner">
          <h3>新增</h3>
          <Button
            style={{ marginRight: 40, marginLeft: 28 }}
            type="primary"
            onClick={() => {
              history.back(-1);
            }}
          >
            <Icon type="caret-left" />
            返回
          </Button>
          <Button
            style={{ marginRight: 10 }}
            type="primary"
            onClick={increase.bind(this, this.props.form)}
          >
            保存
          </Button>
          <Button
            onClick={increase.bind(this, this.props.form, 'PD')}
            style={{ marginRight: 10, border: "#2B49C4 1px solid", color: "#2B49C4" }}
            hidden={sessionStorage.getItem('userRole') == '4'}
          >
            派单
          </Button>
          <Button
            onClick={increase.bind(this, this.props.form, 'PD')}
            hidden={sessionStorage.getItem('userRole') == '2' || addZCZ == "zcz"}
            style={{ marginRight: 10, border: "#2B49C4 1px solid", color: "#2B49C4" }}
          >
            上报
          </Button>
          <Button
            onClick={increase.bind(this, this.props.form, 'ZCZ')}
            hidden={sessionStorage.getItem('userRole') == '2' || addZCZ != "zcz"}
            style={{ marginRight: 10, border: "#2B49C4 1px solid", color: "#2B49C4" }}
          >
            自处置
          </Button>
        </div>
        <div id="listTitleDetailTabEdit">
          <Form>
            <Tabs defaultActiveKey="1" type="card">
              <Tabs.TabPane tab="案件信息" key="1">
                <div id="tableListForm" style={{ background: '#fff', paddingBottom: 28 }}>
                  <Row>
                    <Col span={16}>
                      {/* 事发地点 */}
                      <div id="tableListForm" style={{ padding: '0 10px 0 0' }}>
                        <Col span={24}>
                          <h3 style={{ padding: "20px 0 12px 40px" }}>事发地点</h3>
                        </Col>
                        <Row style={{ marginLeft: 0 }} gutter={{ xl: 8, xxl: 40 }}>
                          <Col span={24}>
                            <Col span={12}>
                              <FormItem label="&nbsp;&nbsp;&nbsp;所属街乡" labelCol={{ span: 9 }} wrapperCol={{ span: 15 }}>
                                {getFieldDecorator('ownStreet', { initialValue: '尧化街道' })(
                                  <Input disabled />
                                )}
                              </FormItem>
                            </Col>
                            <Col span={12}>
                              <FormItem label="所属社区" labelCol={{ span: 9 }} wrapperCol={{ span: 15 }}>
                                {getFieldDecorator('ownCommunity', {
                                  rules: [
                                    {
                                      required: true,
                                      message: '请选择所属社区',
                                    },
                                  ],
                                })(
                                  <Select onSelect={communityGrid} placeholder="请选择">
                                    {parentBank &&
                                      parentBank.map(item => {
                                        return (
                                          <Option value={item.code} key={item.desp}>
                                            {item.desp == '总行' ? '' : item.desp}
                                          </Option>
                                        );
                                      })}
                                  </Select>
                                )}
                              </FormItem>
                            </Col>
                          </Col>
                          <Col span={24}>
                            <Col span={12}>
                              <FormItem label="所属网格" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                                {getFieldDecorator('ownGridNumber', {
                                  rules: [
                                    {
                                      required: true,
                                      message: '请选择所属网格',
                                    },
                                  ],
                                })(
                                  <Select
                                    placeholder="请选择"
                                    showSearch
                                    filterOption={(input, option) =>
                                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    onSelect={getSrc}
                                    allowClear
                                  >
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
                            <Col span={12}>
                              <FormItem label="&nbsp;&nbsp;&nbsp;所在位置" labelCol={{ span: 7 }} wrapperCol={{ span: 17 }}>
                                <a
                                  onClick={showMap}
                                  disabled={iframeSrc == ''}
                                  href="javascriput:;"
                                >查看
                                </a>
                              </FormItem>
                            </Col>
                          </Col>
                          <Col span={24}>
                            <Col span={24}>
                              <FormItem label="&nbsp;&nbsp;&nbsp;详细位置" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                                {getFieldDecorator('detailedLocation', {
                                  initialValue: '',
                                })(<Input />)}
                              </FormItem>
                            </Col>
                          </Col>
                          {/* 案件类别 */}
                          <Col span={24}>
                            <h3 className="gEditLineColor" style={{ padding: "40px 0 12px 20px" }}>
                              案件类别
                            </h3>
                          </Col>
                          <Col span={24}>
                            <Col span={12}>
                              <FormItem label="处理程序" labelCol={{ span: 9 }} wrapperCol={{ span: 15 }}>
                                {getFieldDecorator('processingProgram', {
                                  initialValue: '1',
                                  rules: [
                                    {
                                      required: true,
                                      message: '请选择处理程序',
                                    },
                                  ],
                                })(
                                  <Select onSelect={bigClass}>
                                    {processProgram &&
                                      processProgram.map(item => {
                                        return <Option value={item.code} key={item.code}>{item.desp}</Option>;
                                      })}
                                  </Select>
                                )}
                              </FormItem>
                            </Col>
                            <Col span={12}>
                              <FormItem label="案件大类" labelCol={{ span: 9 }} wrapperCol={{ span: 15 }}>
                                {getFieldDecorator('caseBigType', {
                                  rules: [
                                    {
                                      required: true,
                                      message: '请选择案件大类',
                                    },
                                  ],
                                })(
                                  <Select placeholder="请选择" onSelect={onSelect}>
                                    {eventCategory &&
                                      eventCategory.map(item => {
                                        return <Option value={item.code} key={item.id}>{item.desp}</Option>;
                                      })}
                                  </Select>
                                )}
                              </FormItem>
                            </Col>
                          </Col>
                          <Col span={24}>
                            <Col span={12}>
                              <FormItem label="案件小类" labelCol={{ span: 9 }} wrapperCol={{ span: 15 }}>
                                {getFieldDecorator('caseSmallType', {
                                  rules: [
                                    {
                                      required: true,
                                      message: '请选择案件小类',
                                    },
                                  ],
                                })(
                                  <Select placeholder="请选择">
                                    {caseSmallType &&
                                      caseSmallType.map(item => {
                                        return <Option value={item.code} key={item.code}>{item.desp}</Option>;
                                      })}
                                  </Select>
                                )}
                              </FormItem>
                            </Col>
                            <Col span={12} />
                          </Col>
                          {/* 上报来源 */}
                          <Col span={24}>
                            <h3 className="gEditLineColor" style={{ padding: "40px 0 12px 20px" }}>上报来源</h3>
                          </Col>
                          <Col span={24}>
                            <Col span={12}>
                              <FormItem label="上报渠道" labelCol={{ span: 9 }} wrapperCol={{ span: 15 }}>
                                {getFieldDecorator('reportChannel', {
                                  initialValue: '1',
                                  rules: [
                                    {
                                      required: true,
                                      message: '请选择上报渠道',
                                    },
                                  ],
                                })(
                                  <Select placeholder="请选择" disabled>
                                    <Option value="1" key="1">街道菜单</Option>
                                  </Select>
                                )}
                              </FormItem>
                            </Col>
                            <Col span={12}>
                              <FormItem label="&nbsp;&nbsp;&nbsp;举报人" labelCol={{ span: 7 }} wrapperCol={{ span: 17 }}>
                                {getFieldDecorator('informer', {
                                  rules: [
                                    {
                                      pattern: /^[\u2E80-\u9FFF]+$/,
                                      message: '姓名只能是中文',
                                      required: true,
                                    }
                                  ],
                                })(<Input />)}
                              </FormItem>
                            </Col>
                          </Col>
                          <Col span={24}>
                            <Col span={12}>
                              <FormItem label="&nbsp;&nbsp;&nbsp;联系方式" labelCol={{ span: 7 }} wrapperCol={{ span: 17 }}>
                                {getFieldDecorator('contact', {
                                  rules: [
                                    {
                                      pattern: /^1(3|4|5|6|7|8|9)\d{9}$/,
                                      message: '手机号码格式有误',
                                      required: true,
                                    }
                                  ]
                                })(<Input />)}
                              </FormItem>
                            </Col>
                          </Col>
                          {/* 问题详情 */}
                          <Col span={24}>
                            <h3 className="gEditLineColor" style={{ padding: "40px 0 12px 20px" }}>问题详情</h3>
                          </Col>
                          <Col span={24}>
                            <Col span={12}>
                              <FormItem label="&nbsp;&nbsp;&nbsp;案卷号" labelCol={{ span: 7 }} wrapperCol={{ span: 17 }}>
                                {getFieldDecorator('filesId')(<Input disabled placeholder="" />)}
                              </FormItem>
                            </Col>
                            <Col span={12}>
                              <FormItem label="&nbsp;&nbsp;&nbsp;市级编号" labelCol={{ span: 7 }} wrapperCol={{ span: 17 }}>
                                {getFieldDecorator('cityNum')(<Input disabled placeholder="" />)}
                              </FormItem>
                            </Col>
                          </Col>
                          <Col span={24}>
                            <Col span={12}>
                              <FormItem label="&nbsp;&nbsp;&nbsp;案件编号" labelCol={{ span: 7 }} wrapperCol={{ span: 17 }}>
                                {getFieldDecorator('unitNumber')(<Input disabled placeholder="" />)}
                              </FormItem>
                            </Col>
                            <Col span={12}>
                              <FormItem label="上报时间" labelCol={{ span: 7 }} wrapperCol={{ span: 17 }}>
                                {getFieldDecorator('reportTime', {
                                  initialValue: moment(new Date()),
                                  rules: [
                                    {
                                      required: true,
                                      message: '请选择上报时间',
                                    },
                                  ],
                                })(<DatePicker style={{ width: '100%' }} format="YYYY-MM-DD HH:mm:ss" allowClear disabled />)}
                              </FormItem>
                            </Col>
                          </Col>
                          <Col span={24}>
                            <Col span={12}>
                              <FormItem label="问题级别" labelCol={{ span: 7 }} wrapperCol={{ span: 17 }}>
                                {getFieldDecorator('issueLevel', {
                                  initialValue: '1',
                                  rules: [
                                    {
                                      required: true,
                                      message: '请选择问题级别',
                                    },
                                  ],
                                })(
                                  <Select placeholder="请选择">
                                    {workLevel &&
                                      workLevel.map(item => {
                                        return <Option value={item.code} key={item.code}>{item.desp}</Option>;
                                      })}
                                  </Select>
                                )}
                              </FormItem>
                            </Col>
                            <Col span={12}>
                              <FormItem label="破坏程度" labelCol={{ span: 7 }} wrapperCol={{ span: 17 }}>
                                {getFieldDecorator('destroyingDegree', {
                                  initialValue: '1',
                                  rules: [
                                    {
                                      required: true,
                                      message: '请选择破坏程度',
                                    },
                                  ],
                                })(
                                  <Select placeholder="请选择">
                                    {workDestructionDegree &&
                                      workDestructionDegree.map(item => {
                                        return <Option value={item.code} key={item.code}>{item.desp}</Option>;
                                      })}
                                  </Select>
                                )}
                              </FormItem>
                            </Col>
                          </Col>
                          <Col span={24}>
                            <Col span={12}>
                              <FormItem label="影响范围" labelCol={{ span: 7 }} wrapperCol={{ span: 17 }}>
                                {getFieldDecorator('influenceScope', {
                                  initialValue: '1',
                                  rules: [
                                    {
                                      required: true,
                                      message: '请选择影响范围',
                                    },
                                  ],
                                })(
                                  <Select placeholder="请选择">
                                    {workImpactScope &&
                                      workImpactScope.map(item => {
                                        return <Option value={item.code} key={item.code}>{item.desp}</Option>;
                                      })}
                                  </Select>
                                )}
                              </FormItem>
                            </Col>
                            <Col span={12}>
                              <FormItem label="&nbsp;&nbsp;&nbsp;影响范围数值" labelCol={{ span: 9 }} wrapperCol={{ span: 14 }}>
                                {getFieldDecorator('influenceScopeNum')(<InputNumber style={{ width: '100%' }} placeholder="请输入" />)}
                              </FormItem>
                            </Col>
                          </Col>
                          <Col span={24}>
                            <Col span={12}>
                              <FormItem label="&nbsp;&nbsp;&nbsp;派遣时间" labelCol={{ span: 7 }} wrapperCol={{ span: 17 }}>
                                {getFieldDecorator('dispatchTime')(<Input disabled />)}
                              </FormItem>
                            </Col>
                            <Col span={12}>
                              <FormItem label="&nbsp;&nbsp;&nbsp;结束时间" labelCol={{ span: 7 }} wrapperCol={{ span: 17 }}>
                                {getFieldDecorator('deadline')(<Input disabled />)}
                              </FormItem>
                            </Col>
                          </Col>
                          <Col span={24}>
                            <Col span={24}>
                              <FormItem label="案件描述" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                                {getFieldDecorator('caseDescribe', {
                                  rules: [
                                    {
                                      required: true,
                                      message: '请填写案件描述',
                                    },
                                  ],
                                })(<TextArea rows={4} />)}
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
                        <Col span={12} style={{ margin: "10px 0", paddingLeft: 20, position: "relative" }}>
                          <Col span={10}>
                            <h5 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>整改后</h5>
                          </Col>
                          {this.renderAttachmentTwo()}
                        </Col>
                      </div>
                    </Col>
                    {/* 处置派遣  */}
                    <Col span={24}>
                      <h3 className="gEditLineColor" style={{ padding: "40px 0 12px 40px" }}>处置派遣</h3>
                    </Col>
                    <Col style={{ padding: "0 40px" }} span={24} hidden={sessionStorage.getItem('userRole') == '4'}>
                      {formItems}
                    </Col>
                  </Row>
                </div>
              </Tabs.TabPane>
            </Tabs>
          </Form>
        </div>
        <Modal
          title="查看地图"
          visible={mapBox}
          footer={null}
          onCancel={handleCancel}
        >
          <iframe
            width="100%"
            height="400"
            scrolling="no"
            frameBorder="0"
            src={iframeSrc}
            marginHeight="0"
            marginWidth="0"
          />
        </Modal>
      </div>
    );
  }
}

const AddForm = Form.create()(app);
export default AddForm;
