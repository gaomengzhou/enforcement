/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-vars */
/* eslint-disable spaced-comment,lines-between-class-members,react/destructuring-assignment,prefer-destructuring,import/newline-after-import */
import React, { PureComponent } from 'react';
import { Row, Col, Form, Input, Select, Button, DatePicker, Table, Radio, Tabs, Modal, } from 'antd';
import styles from './Detail.less';
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const { TextArea } = Input;
@Form.create()
class Home extends PureComponent {
  state = {
    visibleUndertake: false,//承办人员
  };
  //承办人员
  onChangeDisposalDepartment = () => {
    this.setState({
      visibleUndertake: true,
    });
  };
  undertakeOk = (e) => {
    this.setState({
      visibleUndertake: false,
    });
  };
  undertakeCancel = (e) => {
    this.setState({
      visibleUndertake: false,
    });
  };
  callback(key) {

  };
  //返回
  goBack() {
    this.props.history.go(-1);
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const selectAfter = (
      <Select defaultValue="小时" style={{ width: 80 }}>
        <Option value="小时">小时</Option>
        <Option value="分">分</Option>
      </Select>
    );
    const dataSource = [
      {
        order: 1,
        operator: '胡彦斌',
        operation: '新建',
        operationTime: '2019-01-08',
        evaluate: '新建',
        explain: '新建'
      },
      {
        order: 2,
        operator: '胡彦祖',
        operation: '新建',
        operationTime: '2019-01-08',
        evaluate: '新建',
        explain: '新建'
      },
      {
        order: 3,
        operator: '胡彦祖',
        operation: '新建',
        operationTime: '2019-01-08',
        evaluate: '新建',
        explain: '新建'
      }
    ];

    const columns = [
      {
        title: '序号',
        dataIndex: 'order',
        key: 'order',
      },
      {
        title: '操作人',
        dataIndex: 'operator',
        key: 'operator',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
      },
      {
        title: '操作时间',
        dataIndex: 'operationTime',
        key: 'operationTime',
      },
      {
        title: '结案评价',
        dataIndex: 'evaluate',
        key: 'evaluate',
      },
      {
        title: '补充说明',
        dataIndex: 'explain',
        key: 'explain',
      }
    ];
    return (
      <div>
        <h3 id="listTitleDetail">状态：</h3>
        <div id="listTitleDetailBanner">
          <Button type="primary" onClick={this.goBack.bind(this)}>返回</Button>
          <Button type="primary">退回</Button>
          <Button type="primary">废案</Button>
          <Button type="primary">导出</Button>
        </div>
        <div id="listTitleDetailTab">
          <Tabs defaultActiveKey="1" onChange={this.callback} type="card">
            <TabPane tab="工单信息" key="1">
              <div id="tableListForm">
                <div>
                  <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col lg={16} md={12} sm={12}>
                      <div id="tableListForm" style={{ padding: '0 10px 0 0' }}>
                        <h3>诉求信息</h3>
                        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                          <Col lg={8} md={12} sm={24}>
                            <div style={{ padding: 10 }}>
                              <span>诉求类型</span>
                              <span>：</span>
                              <span>投诉</span>
                            </div>
                          </Col>
                          <Col lg={8} md={12} sm={24}>
                            <div style={{ padding: 10 }}>
                              <span>诉求事件发生时间</span>
                              <span>：</span>
                              <span>2018-10-10 12:00:00</span>
                            </div>
                          </Col>
                          <Col lg={8} md={12} sm={24}>
                            <div style={{ padding: 10 }}>
                              <span>管辖地</span>
                              <span>：</span>
                              <span>栖霞区</span>
                            </div>
                          </Col>
                          <Col lg={8} md={12} sm={24}>
                            <div style={{ padding: 10 }}>
                              <span>紧急重大事件</span>
                              <span>：</span>
                              <span>否</span>
                            </div>
                          </Col>
                          <Col lg={8} md={12} sm={24}>
                            <div style={{ padding: 10 }}>
                              <span>诉求来源</span>
                              <span>：</span>
                              <span>掌上云社区</span>
                            </div>
                          </Col>
                          <Col lg={16} md={12} sm={24}>
                            <div style={{ padding: 10 }}>
                              <span>诉求地址</span>
                              <span>：</span>
                              <span>江苏省栖霞区尧林仙居7栋1单元1103</span>
                            </div>
                          </Col>
                          <Col lg={24} md={24} sm={24}>
                            <div style={{ padding: 10 }}>
                              <span>诉求内容</span>
                              <span>：</span>
                              <span>江苏省栖霞区尧林仙居7栋1单元1103,自己租的是群租房，会有安全隐患，投诉群租房进行租赁。</span>
                            </div>
                          </Col>
                          <Col lg={24} md={24} sm={24}>
                            <div style={{ padding: 10 }}>
                              <span>诉求目的</span>
                              <span>：</span>
                              <span>投诉群租房进行租赁</span>
                            </div>
                          </Col>
                          <Col lg={16} md={12} sm={24}>
                            <div style={{ padding: 10 }}>
                              <span>归口类型</span>
                              <span>：</span>
                              <span>城建城管-房产部门-物业管理-物业管理-（小区）小区内群租房问题</span>
                            </div>
                          </Col>
                          <Col lg={8} md={12} sm={24}>
                            <div style={{ padding: 10 }}>
                              <span>回访类型</span>
                              <span>：</span>
                              <span>正常回访</span>
                            </div>
                          </Col>
                        </Row>
                      </div>
                      <div id="tableListForm" style={{ padding: '0 10px 0 0' }}>
                        <h3>诉求人员</h3>
                        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                          <Col lg={8} md={12} sm={24}>
                            <div style={{ padding: 10 }}>
                              <span>姓名</span>
                              <span>：</span>
                              <span>刘刚</span>
                            </div>
                          </Col>
                          <Col lg={8} md={12} sm={24}>
                            <div style={{ padding: 10 }}>
                              <span>性别</span>
                              <span>：</span>
                              <span>男</span>
                            </div>
                          </Col>
                          <Col lg={8} md={12} sm={24}>
                            <div style={{ padding: 10 }}>
                              <span>诉求号码</span>
                              <span>：</span>
                              <span>13838003890</span>
                            </div>
                          </Col>
                          <Col lg={8} md={12} sm={24}>
                            <div style={{ padding: 10 }}>
                              <span>联系号码1</span>
                              <span>：</span>
                              <span>13838003890</span>
                            </div>
                          </Col>
                          <Col lg={8} md={12} sm={24}>
                            <div style={{ padding: 10 }}>
                              <span>联系号码2</span>
                              <span>：</span>
                              <span>13838003890</span>
                            </div>
                          </Col>
                          <Col lg={16} md={12} sm={24}>
                            <div style={{ padding: 10 }}>
                              <span>备注</span>
                              <span>：</span>
                              <span>无</span>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </Col>
                    <Col lg={8} md={12} sm={12}>
                      <h3>附件清单</h3>
                      <div style={{ border: '1px solid #000', margin: '20px 0 0 0' }}>
                        <ul className={styles.fileList}>
                          <li>
                            <p>整改前</p>
                            <div>
                              <img src="../../../../favicon.png" />
                            </div>
                            <p>
                              <a>下载</a>
                              <a style={{ marginLeft: 16 }}>删除</a>
                            </p>
                          </li>
                          <li>
                            <p>整改前</p>
                            <div>
                              <img src="../../../../favicon.png" />
                            </div>
                            <p>
                              <a>下载</a>
                              <a style={{ marginLeft: 16 }}>删除</a>
                            </p>
                          </li>
                          <li>
                            <p>整改前</p>
                            <div>
                              <img src="../../../../favicon.png" />
                            </div>
                            <p>
                              <a>下载</a>
                              <a style={{ marginLeft: 16 }}>删除</a>
                            </p>
                          </li>
                          <li>
                            <p>整改前</p>
                            <div>
                              <img src="../../../../favicon.png" />
                            </div>
                            <p>
                              <a>下载</a>
                              <a style={{ marginLeft: 16 }}>删除</a>
                            </p>
                          </li>
                        </ul>

                      </div>
                    </Col>
                  </Row>
                </div>
                <div>
                  <div id="tableListForm" style={{ padding: '0 10px 0 0' }}>
                    <h3 className="gEditLineColor">工单处理</h3>
                    <Form layout="inline" style={{ paddingTop: 20 }}>
                      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={6} sm={8}>
                          <FormItem label="办结时限">
                            {getFieldDecorator('uNumber', {
                              rules: [
                                {
                                  required: false,
                                  message: '请填写单据编号',
                                },
                              ],
                            })(
                              <Input placeholder="请输入" addonAfter={selectAfter} />
                            )}
                          </FormItem>
                        </Col>
                        <Col md={6} sm={8}>
                          <FormItem label="诉求地址">
                            {getFieldDecorator('unitNumber', {
                              rules: [
                                {
                                  required: false,
                                  message: '请填写单据编号',
                                },
                              ],
                            })(
                              <Select placeholder="请输入" allowClear>
                                <Select.Option value="0">栖霞区</Select.Option>
                                <Select.Option value="1">派遣类型2</Select.Option>
                                <Select.Option value="2">派遣类型3</Select.Option>
                              </Select>
                            )}
                          </FormItem>
                        </Col>
                        <Col md={12} sm={8}>
                          <FormItem label="备注">
                            {getFieldDecorator('unitNumber', {
                              rules: [
                                {
                                  required: false,
                                  message: '请填写单据编号',
                                },
                              ],
                            })(
                              <Input placeholder="请输入" />
                            )}
                          </FormItem>
                        </Col>
                        <Col md={6} sm={8}>
                          <FormItem label="主办部门">
                            {getFieldDecorator('unitNumber', {
                              rules: [
                                {
                                  required: false,
                                  message: '请填写单据编号',
                                },
                              ],
                            })(
                              <Select placeholder="请输入" allowClear>
                                <Select.Option value="0">王子楼社区</Select.Option>
                                <Select.Option value="1">派遣类型2</Select.Option>
                                <Select.Option value="2">派遣类型3</Select.Option>
                              </Select>
                            )}
                          </FormItem>
                        </Col>
                        <Col md={6} sm={8}>
                          <FormItem label="承办人员">
                            {getFieldDecorator('unitNumber', {
                              rules: [
                                {
                                  required: false,
                                  message: '请填写单据编号',
                                },
                              ],
                            })(
                              <Select placeholder="请输入">
                                <Select.Option value="0">魏主任</Select.Option>
                                <Select.Option value="1">二级</Select.Option>
                                <Select.Option value="2">三级</Select.Option>
                              </Select>
                            )}
                          </FormItem>
                        </Col>
                        <Col md={6} sm={8}>
                          <FormItem label="分管领导">
                            {getFieldDecorator('unitNumber', {
                              rules: [
                                {
                                  required: false,
                                  message: '请填写单据编号',
                                },
                              ],
                            })(
                              <Select placeholder="请输入">
                                <Select.Option value="0">李主任</Select.Option>
                                <Select.Option value="1">严重</Select.Option>
                              </Select>
                            )}
                          </FormItem>
                        </Col>
                        <Col md={6} sm={8}>
                          <FormItem label="是否送审">
                            {getFieldDecorator('unitNumber', {
                              rules: [
                                {
                                  required: false,
                                  message: '请填写单据编号',
                                },
                              ],
                            })(
                              <Select placeholder="请输入">
                                <Select.Option value="0">是</Select.Option>
                                <Select.Option value="1">否</Select.Option>
                              </Select>
                            )}
                          </FormItem>
                        </Col>
                        <Col md={6} sm={8}>
                          <FormItem label="协办部门">
                            {getFieldDecorator('unitNumber', {
                              rules: [
                                {
                                  required: false,
                                  message: '请填写影响范围',
                                },
                              ],
                            })(
                              <Select placeholder="请输入">
                                <Select.Option value="0">王子楼社区</Select.Option>
                                <Select.Option value="1">大</Select.Option>
                              </Select>
                            )}
                          </FormItem>
                        </Col>
                        <Col md={6} sm={8}>
                          <FormItem label="承办人员">
                            {getFieldDecorator('unitNumber', {
                              rules: [
                                {
                                  required: false,
                                  message: '请填写单据编号',
                                },
                              ],
                            })(
                              <Select placeholder="请输入">
                                <Select.Option value="0">魏主任</Select.Option>
                                <Select.Option value="1">大</Select.Option>
                              </Select>
                            )}
                          </FormItem>
                        </Col>
                        <Col md={12} sm={8}>
                          <Button type="primary">移除</Button>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                </div>
                <div>
                  <Button type="primary" style={{ width: 160 }} onClick={this.onChangeDisposalDepartment}>添加协办部门</Button>
                </div>
              </div>
            </TabPane>
            <TabPane tab="工作过程" key="2">
              <div id="tableListForm">
                <h3 className="gEditLineColor">工作过程</h3>
                <div style={{ marginTop: 20 }}>
                  <Table dataSource={dataSource} columns={columns} />
                </div>
              </div>
            </TabPane>
          </Tabs>
        </div>
        <Modal
          title="承办人员"
          visible={this.state.visibleUndertake}
          onOk={this.undertakeOk}
          onCancel={this.undertakeCancel}
        >
          <Row gutter={{ md: 48, lg: 48, xl: 48 }}>
            <Col md={24} sm={24}>
              <FormItem label="承办人员">
                {getFieldDecorator('undertakePerson')(
                  <Select placeholder="请输入承办人员" allowClear style={{ width: '100%' }}>
                    <Select.Option value="0">张三</Select.Option>
                    <Select.Option value="1">李四</Select.Option>
                    <Select.Option value="2">王五</Select.Option>
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
        </Modal>
      </div>
    )
  }
}
export default Home;
