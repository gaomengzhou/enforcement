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
      communityGrid,
      newgridList,
      onEnterprise,
      handleSearch,
      handleSearchList,
      handleSearchLength,
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
          <Col span={5}>
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
                    required: (sessionStorage.getItem('userRole') != '4') && (!isManageFlag[index]),
                    message: '请输入处置时限',
                  },
                  {
                    pattern: /^\+?[1-9]\d*$/,
                    message: '请输大于0的正整数',
                  }
                ],
              })(<Input disabled={isManageFlag[index]} addonAfter={<SelectAfter index={index} />} />)}
            </Form.Item>
          </Col>
          <Col span={6} style={{ marginLeft: 40 }}>
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
          <Col span={7} style={{ marginLeft: 40 }}>
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
                    required: sessionStorage.getItem('userRole') != '4',
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
          <Col span={2} style={{ marginLeft: 40 }}>
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
          {index > 0 && (
            <Col span={1} style={{ marginTop: 9, marginLeft: 58 }}>
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
          // hidden={sessionStorage.getItem('userRole') == '4'}
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
          <Tabs defaultActiveKey="1" type="card">
            <TabPane tab="案件信息" key="1">
              <Form>
                <div id="tableListForm" style={{ background: '#fff', paddingBottom: 28 }}>
                  <Row>
                    <Col span={16}>
                      {/* 综合执法 */}
                      <div id="tableListForm" style={{ padding: '0 10px 0 0' }}>
                        <Col span={24}>
                          <h3 style={{ padding: "20px 0 12px 40px" }}>综合执法</h3>
                        </Col>
                        <Row style={{ marginLeft: 0 }} gutter={{ xl: 8, xxl: 40 }}>
                          <Col span={24}>
                            <Col span={12}>
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
                                  <Select placeholder="请选择" onSelect={communityGrid}>
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
                            <Col span={12}>
                              <FormItem label="所属网格" allowClear labelCol={{ span: 7 }} wrapperCol={{ span: 15 }}>
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
                                    {newgridList.length > 0 ?
                                      newgridList.map(
                                        item => <Option value={item.id}>{item.name}</Option>
                                      ) : gridList.map(
                                        item => <Option value={item.id}>{item.name}</Option>
                                      )
                                    }
                                  </Select>
                                )}
                              </FormItem>
                            </Col>
                          </Col>
                          <Col span={24}>
                            <Col span={12}>
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
                            <Col span={12}>
                              <FormItem label="&nbsp;&nbsp;&nbsp;所在位置" labelCol={{ span: 9 }} wrapperCol={{ span: 15 }}>
                                <a
                                  onClick={showMap}
                                  disabled={iframeSrc == ''}
                                  href="javascriput:;"
                                >
                                  查看
                                </a>
                              </FormItem>
                            </Col>
                          </Col>
                          <Col span={24}>
                            <Col span={24}>
                              <FormItem label="&nbsp;&nbsp;&nbsp;详细位置">
                                {getFieldDecorator('detailedLocation', {
                                  initialValue: '',
                                })(<Input />)}
                              </FormItem>
                            </Col>
                          </Col>
                          <Col span={24}>
                            <Col span={12}>
                              <FormItem
                                label="当事人类型"
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
                                  <Select onSelect={this.onSelects}>
                                    <Option value="1">个人</Option>
                                    <Option value="2">企业</Option>
                                  </Select>
                                )}
                              </FormItem>
                            </Col>

                          </Col>
                          <Col span={24}>
                            <Col span={12}>
                              <FormItem
                                label={partiesType == 1 ? '当事人姓名' : '涉事企业名'}
                                labelCol={{ span: 12 }}
                                wrapperCol={{ span: 12 }}
                              >
                                {getFieldDecorator(
                                  `${partiesType == 1 ? 'partiesUsername' : 'enterprisesName'}`,
                                  partiesType == 1 ? {
                                    initialValue: '',
                                    rules: [
                                      {
                                        required: true,
                                        message: '请填写当事人姓名!',
                                      },
                                      {
                                        pattern: /^[\u2E80-\u9FFF]+$/,
                                        message: '姓名只能是中文'
                                      }
                                    ],
                                  } : {
                                      initialValue: '',
                                      rules: [
                                        {
                                          required: true,
                                          message: '请填写涉事企业名!',
                                        },
                                      ],
                                    }
                                )(partiesType == 2 ? <Select showSearch onSearch={handleSearch} onChange={onEnterprise}>{handleSearchList && handleSearchList.map(item => <Option value={item.partiesUsername}>{item.partiesUsername}</Option>)}</Select> : <Input />)}
                              </FormItem>
                            </Col>
                            <Col span={12}>
                              <FormItem
                                label={partiesType == 1 ? '证件号码' : '机构代码'}
                                labelCol={{ span: 9 }}
                                wrapperCol={{ span: 15 }}
                              >
                                {getFieldDecorator(
                                  `${partiesType == 1 ? 'identificationNum' : 'institutionalCode'}`,
                                  {
                                    initialValue: partiesType == 2 ? handleSearchLength && handleSearchLength : '',
                                    rules: [
                                      {
                                        required: true,
                                        message: partiesType == 1 ? '请填写证件号码!' : '请填写机构代码!',
                                      },
                                      // {
                                      //   pattern: /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/,
                                      //   message: '请输正确格式的号码',
                                      // },
                                    ],
                                  }
                                )(partiesType == 2 ? <Input disabled /> : <Input />)}
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
                                })(<DatePicker style={{ width: '100%' }} format="YYYY-MM-DD HH:mm:ss" allowClear showTime />)}
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
                            <Col span={24}>
                              <FormItem label="案件地址" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                                {getFieldDecorator('caseAddress', {
                                  initialValue: '',
                                  rules: [
                                    {
                                      required: true,
                                      message: '请填写案件地址!',
                                    },
                                  ],
                                })(<Input />)}
                              </FormItem>
                            </Col>
                          </Col>
                          <Col span={24}>
                            <Col span={24}>
                              <FormItem label="案件描述" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                                {getFieldDecorator('caseDescribe', {
                                  initialValue: '',
                                  rules: [
                                    {
                                      required: true,
                                      message: '请填写案件描述!',
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
                        <Col span={12} style={{ margin: "10px 0", borderRight: "solid 1px #DEE4EC", paddingRight: 19, position: "relative" }}>
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
                    <Col span={24} hidden={sessionStorage.getItem('userRole') == '4'}>
                      <h3 classNme="gEditLineColor" style={{ padding: "40px 0 12px 40px" }}>处置派遣</h3>
                    </Col>
                    <Col style={{ padding: "0 40px" }} span={24} hidden={sessionStorage.getItem('userRole') == '4'}>
                      {formItems}
                    </Col>
                    <Col span={24}>
                      <Form.Item labelCol={{ span: 7 }} wrapperCol={{ span: 17 }}>
                        <Button
                          type="dashed"
                          onClick={this.add}
                          style={{ width: '45%', marginLeft: 40 }}
                          hidden={
                            // sessionStorage.getItem('userRole') == '4'
                            //   ? isDetail == 'detail' && (info.status == '1' || info.status != '1')
                            //   : (sessionStorage.getItem('userRole') != '2' ||
                            //     sessionStorage.getItem('userRole') == '2') &&
                            //   info.status != '2'
                            sessionStorage.getItem('userRole') != '2'
                          }
                        >
                          <Icon type="plus" />
                          增加处置部门
                        </Button>
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
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
          />
        </Modal>
      </div>
    );
  }
}

const AddForm = Form.create()(app);
export default AddForm;
