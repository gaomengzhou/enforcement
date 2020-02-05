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
  Divider,
  Checkbox,
} from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;
let id = 0;

class app extends Component {
  constructor(props) {
    super(props);
    this.state = {
      partiesType: '1',
    };
  }

  onSelects = value => {
    this.setState({ partiesType: value });
  };
  // 企业
  enterprise = e => {
    console.log(e)
  }
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
        <Button className="ant-upload-text">整改前附件</Button>
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
        <Button className="ant-upload-text">
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
      caseSmallType,
      UrbanApartment,
      previewVisible,
      previewImage,
      fileList,
      handlePreview,
      handleCancel,
      handleChange,
      UrbanApartmentSelect,
      workOrderCategory,
      gridList,
      mapBox,
      showMap,
      getSrc,
      iframeSrc,
      unit,
      getUnit,
      rightMatterList,
      addZCZ,
      isManageFlag,
      isManageChange,
      becomeMulti,
      becomeMultiFlag,
      canleBecomeMulti,
    } = this.props;
    const SelectAfter = props => {
      return (
        <Select onChange={getUnit.bind(this, props.index)} value={unit.length > 0 ? (unit[props.index] ? unit[props.index] : "1") : "1"} defaultValue="1" style={{ width: 80 }}>
          <Option value="1">小时</Option>
          <Option value="2">天</Option>
        </Select>
      )
    };
    const columns = [
      {
        title: '业务操作',
        dataIndex: 'operation',
        key: 'operation',
      },
      {
        title: '执行部门',
        dataIndex: 'extend2',
        key: 'extend2',
      },
      {
        title: '处理结果',
        dataIndex: 'additionalRemarks',
        key: 'additionalRemarks',
      },
      {
        title: '操作员',
        dataIndex: 'operator',
        key: 'operator',
      },
      {
        title: '操作时间',
        dataIndex: 'operationTime',
        key: 'operationTime',
      },
      {
        title: '受理部门',
        dataIndex: 'extend3',
        key: 'extend3',
      },
      {
        title: '图片',
        dataIndex: 'extend1',
        key: 'extend1',
        render: text => <a href="''">{text}</a>,
      },
      {
        title: '',
        dataIndex: 'download',
        key: 'download',
        render: text => <a href="''">下载</a>,
      },
      {
        title: '处理描述',
        dataIndex: 'finalAppraise',
        key: 'finalAppraise',
      },
    ];
    const { partiesType } = this.state;
    getFieldDecorator('keys', { initialValue: ['1'] });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => (
      <Row>
        <Col span={24}>
          <Col span={7}>
            <Form.Item
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label="处置时限"
              required={false}
              key={index}
            >
              {/* {console.log(isManageFlag[index])} */}
              {getFieldDecorator(`assistTime[${index}]`, {
                initialValue: k.desp,
                rules: [
                  {
                    required: (sessionStorage.getItem('userRole') == '4' ? false : true) && (!isManageFlag[index]),
                    message: '请输入处置时限',
                  },
                ],
              })(<Input disabled={isManageFlag[index]} addonAfter={<SelectAfter index={index} />} />)}
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label="处置部门"
              required={false}
              key={index}
            >
              {getFieldDecorator(`assistDepartment[${index}]`, {
                initialValue: k.desp,
                rules: [
                  {
                    required: sessionStorage.getItem('userRole') == '4' ? false : true,
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
          <Col span={7}>
            <Form.Item
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label="处置人员"
              required={false}
              key={index}
            >
              {getFieldDecorator(`assistWorker[${index}]`, {
                initialValue: k.desp,
                rules: [
                  {
                    required: sessionStorage.getItem('userRole') == '4' ? false : true,
                    message: '请选择处置人员',
                  },
                ],
              })(
                <Select placeholder="请选择">
                  {leadership &&
                    leadership.map(item => {
                      return <Option value={item.userId}>{item.userName}</Option>;
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
          <Col span={24}>
            <Col span={7}>
              <Form.Item
                labelCol={{ span: 13 }}
                wrapperCol={{ span: 10 }}
                label="由部门负责人设置"
                key={index}
              >
                {getFieldDecorator(`isManage[${index}]`)(
                  <Checkbox onChange={isManageChange.bind(this, index, this.props.form)} />
                )}
              </Form.Item>
            </Col>
          </Col>
        </Col>
      </Row >
    ));
    return (
      <div>
        <div id="listTitleDetailBanner" style={{ margin: 20, marginRight: 0, padding: 20 }}>
          <h3>新增</h3>
          <Button
            style={{ marginRight: 20 }}
            type="primary"
            onClick={() => {
              history.back(-1);
            }}
          >
            <Icon type="caret-left" />
            返回
              </Button>
          <Button
            style={{ marginRight: 20 }}
            type="primary"
            onClick={increase.bind(this, this.props.form)}
          // hidden={sessionStorage.getItem('userRole') == '4'}
          >
            保存
              </Button>
          <Button
            type="primary"
            onClick={increase.bind(this, this.props.form, 'PD')}
            style={{ marginRight: 20 }}
            hidden={sessionStorage.getItem('userRole') == '4'}
          >
            派单
              </Button>
          <Button
            type="primary"
            onClick={increase.bind(this, this.props.form, 'PD')}
            hidden={sessionStorage.getItem('userRole') == '2' || addZCZ == "zcz"}
            style={{ marginRight: 20 }}
          >
            上报
              </Button>
          <Button
            type="primary"
            onClick={increase.bind(this, this.props.form, 'ZCZ')}
            hidden={sessionStorage.getItem('userRole') == '2' || addZCZ != "zcz"}
          >
            自处置
              </Button>
        </div>
        <div
          style={{
            marginLeft: 20,
            marginTop: 20,
            marginBottom: 20,
            backgroundColor: '#FFFFFF',
            boxShadow: '0px 5px 5px 0px rgba(59, 1, 0, 0.2)',
            padding: 10,
          }}
        >
          <Tabs defaultActiveKey="1">
            <TabPane tab="案件信息" key="1" type="card">
              <Form>
                <Row>
                  <Col span={15}>
                    <Col span={24}>
                      <h4 style={{ fontWeight: 700, borderBottom: '1px dashed #000' }}>综合执法</h4>
                    </Col>
                    <Col span={24}>
                      <Col span={7}>
                        <FormItem
                          label="所属社区"
                          labelCol={{ span: 11 }}
                          wrapperCol={{ span: 13 }}
                        >
                          {getFieldDecorator('ownCommunity', {
                            rules: [
                              {
                                required: true,
                                message: '请选择所属社区',
                              },
                            ],
                          })(
                            <Select placeholder="请选择">
                              {parentBank &&
                                parentBank.map(item => {
                                  return (
                                    <Option value={item.code}>
                                      {item.desp == '总行' ? '' : item.desp}
                                    </Option>
                                  );
                                })}
                            </Select>
                          )}
                        </FormItem>
                      </Col>
                      <Col span={10}>
                        <FormItem label="所属网格" labelCol={{ span: 7 }} wrapperCol={{ span: 15 }}>
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
                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
                                0
                              }
                              onSelect={getSrc}
                            >
                              {gridList &&
                                gridList.map(item => {
                                  return <Option value={item.id}>{item.name}</Option>;
                                })}
                            </Select>
                          )}
                        </FormItem>
                      </Col>
                      <Col span={7}>
                        <FormItem label="工单类别" labelCol={{ span: 9 }} wrapperCol={{ span: 15 }}>
                          {getFieldDecorator('workOrderType', {
                            rules: [
                              {
                                required: true,
                                message: '请选择工单类别',
                              },
                            ],
                          })(
                            <Select
                              placeholder="请选择"
                              onSelect={becomeMulti}
                              onDeselect={canleBecomeMulti.bind(this, this.props.form)}
                              mode={becomeMultiFlag ? "multiple" : ""}
                            >
                              {workOrderCategory &&
                                workOrderCategory.map(item => {
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
                      <Col span={8}>
                        <FormItem label="所在位置" labelCol={{ span: 9 }} wrapperCol={{ span: 15 }}>
                          <a
                            onClick={showMap}
                            disabled={iframeSrc == ''}
                            href="javascriput:;"
                          >
                            查看
                          </a>
                        </FormItem>
                      </Col>
                      <Col span={16}>
                        <FormItem style={{ marginLeft: '-6%' }} label="详细位置" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                          {getFieldDecorator('detailedLocation', {
                            initialValue: '',
                          })(<Input />)}
                        </FormItem>
                      </Col>
                    </Col>
                    <Col span={24}>
                      <Col span={8}>
                        <FormItem
                          label="当事人类型"
                          labelCol={{ span: 12 }}
                          wrapperCol={{ span: 12 }}
                          style={{ marginLeft: '-12%' }}
                        >
                          {getFieldDecorator('partiesType', {
                            initialValue: '1',
                            rules: [
                              {
                                required: true,
                                message: '请选择案件小类',
                              },
                            ],
                          })(
                            <Select onSelect={this.onSelects} onChange={this.enterprise}>
                              <Option value="1">个人</Option>
                              <Option value="2">企业</Option>
                            </Select>
                          )}
                        </FormItem>
                      </Col>
                      <Col span={8}>
                        <FormItem
                          label={partiesType == 1 ? '当事人姓名' : '涉事企业名'}
                          labelCol={{ span: 12 }}
                          wrapperCol={{ span: 12 }}
                        >
                          {getFieldDecorator(
                            `${partiesType == 1 ? 'partiesUsername' : 'enterprisesName'}`,
                            {
                              initialValue: '',
                              rules: [
                                {
                                  required: true,
                                  message: '请填写当事人姓名!',
                                },
                              ],
                            }
                          )(<Input />)}
                        </FormItem>
                      </Col>
                      <Col span={8}>
                        <FormItem
                          label={partiesType == 1 ? '证件号码' : '机构代码'}
                          labelCol={{ span: 9 }}
                          wrapperCol={{ span: 15 }}
                        >
                          {getFieldDecorator(
                            `${partiesType == 1 ? 'identificationNum' : 'institutionalCode'}`,
                            {
                              initialValue: '',
                              rules: [
                                {
                                  required: true,
                                  message: partiesType == 1 ? '请填写证件号码!' : '请填写机构代码!',
                                },
                              ],
                            }
                          )(<Input />)}
                        </FormItem>
                      </Col>
                    </Col>
                    <Col span={24}>
                      <Col span={12}>
                        <FormItem label="事发时间" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                          {getFieldDecorator('incidentDate', {
                            rules: [
                              {
                                required: true,
                                message: '请选择事发时间!',
                              },
                            ],
                          })(<DatePicker format="YYYY-MM-DD HH:mm:ss" allowClear showTime />)}
                        </FormItem>
                      </Col>
                      <Col span={12}>
                        <FormItem label="权力编码" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                          {getFieldDecorator('powerCoding', {
                            initialValue: '',
                            rules: [
                              {
                                required: true,
                                message: '请填写权力编码!',
                              },
                            ],
                          })(<Select showSearch>
                            {rightMatterList && rightMatterList.map(item =>
                              <Option value={item.powerCode}>{item.powerCode}</Option>
                            )}
                          </Select>)}
                        </FormItem>
                      </Col>
                    </Col>
                    <Col span={24}>
                      <Col span={12}>
                        <FormItem label="案件地址" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                          {getFieldDecorator('caseAddress', {
                            initialValue: '',
                            rules: [
                              {
                                required: true,
                                message: '请填写案件地址!',
                              },
                            ],
                          })(<Input style={{ width: '79%' }} />)}
                        </FormItem>
                      </Col>
                      <Col span={12}>
                        <FormItem label="案件描述" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                          {getFieldDecorator('caseDescribe', {
                            initialValue: '',
                            rules: [
                              {
                                required: true,
                                message: '请填写案件描述!',
                              },
                            ],
                          })(<TextArea />)}
                        </FormItem>
                      </Col>
                    </Col>
                    <h3 hidden={sessionStorage.getItem('userRole') == '4'} className="gEditLineColor" style={{ fontWeight: 700 }}>工单处理
                      <Divider style={{ margin: '12px 0 8px 0' }} dashed />
                    </h3>
                    <Col span={24} hidden={sessionStorage.getItem('userRole') == '4'}>
                      {formItems}
                      <Form.Item labelCol={{ span: 7 }} wrapperCol={{ span: 17 }}>
                        <Button type="dashed" onClick={this.add} style={{ width: '45%' }}>
                          <Icon type="plus" />
                          增加处置部门
                        </Button>
                      </Form.Item>
                    </Col>
                  </Col>
                  <Col span={8} push={1} style={{ padding: 10, height: 300, overflow: 'auto' }}>
                    <h4
                      style={{ fontWeight: 700, borderBottom: '1px dashed #000', marginLeft: 15 }}
                    >
                      附件清单
                    </h4>
                    <Col span={11}>{this.renderAttachment()}</Col>
                    <Col span={11} hidden={addZCZ != "zcz"}>
                      {this.renderAttachmentTwo()}
                    </Col>
                  </Col>
                </Row>
              </Form>
            </TabPane>
            {/* <TabPane tab="工作过程" key="2">
              <Row>
                <Col span={24}>
                  <h4 style={{ fontWeight: 700, borderBottom: '1px dashed #000' }}>工作过程</h4>
                </Col>
                <Col span={24}>
                  <Table columns={columns} />
                </Col>
              </Row>
            </TabPane>
           */}
          </Tabs>
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
          ></iframe>
        </Modal>
      </div>
    );
  }
}

const AddForm = Form.create()(app);
export default AddForm;
