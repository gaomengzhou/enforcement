import React, { PureComponent } from 'react';
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
  TreeSelect,
  Divider,
} from 'antd';
import moment from 'moment';
import styles from './Detail.less';

const FormItem = Form.Item;
const { Option } = Select;

class app extends PureComponent {
  add = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log(values)
    })
  }

  render() {
    const {
      dataSource,
      parentBank,
      processProgram,
      eventCategory,
      caseSmallType,
      workLevel,
      workDestructionDegree,
      workImpactScope,
      form,
      gridList,
      onSelect,
      bigClass,
      showMap,
      getSrc,
      mapBox,
      handleCancel,
      communityGrid,
      newgridList,
      userRole,
    } = this.props;
    const iframeSrc = `http://58.213.107.106:60019/dcs_dataShow/pages/datashow/gridQuery.html?${dataSource.ownGridNumber}&${dataSource.x}&${dataSource.y}`;
    const { getFieldDecorator, getFieldValue } = form;
    return (
      <div id="tableListForm" style={{ background: '#fff', paddingBottom: 28 }}>
        <Form>
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
                      <FormItem label="所属街乡">
                        {getFieldDecorator('ownStreet', {
                          initialValue: dataSource.ownStreet || "尧化街道",
                        })(
                          <Input disabled />
                        )}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem label="所属社区">
                        {getFieldDecorator('ownCommunity', {
                          initialValue: String(dataSource.ownCommunity) || "",
                        })(
                          <Select onSelect={communityGrid} placeholder="请选择" disabled={dataSource.status != '2' && dataSource.status != '1' || userRole == 1}>
                            {parentBank && parentBank.map(item =>
                              <Option value={item.code} key={item.desp}>
                                {item.desp == '总行' ? '' : item.desp}
                              </Option>
                            )}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                  </Col>
                  <Col span={24}>
                    <Col span={12}>
                      <FormItem label="所属网格">
                        {getFieldDecorator('ownGridNumber', {
                          initialValue: String(dataSource.ownGridNumber) || "",
                        })(
                          <Select placeholder="请选择" disabled={dataSource.status != '2' && dataSource.status != '1' || userRole == 1}>
                            {newgridList && newgridList.length > 0 ?
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
                    <Col span={12}>
                      <FormItem label="所在位置">
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
                      <FormItem label="详细位置">
                        {getFieldDecorator('detailedLocation', {
                          initialValue: dataSource.detailedLocation || "",
                        })(<Input placeholder="请输入" disabled={dataSource.status != '2' && dataSource.status != '1'} />)}
                      </FormItem>
                    </Col>
                  </Col>
                </Row>
              </div>
              {/* 案件类别 */}
              <div id="tableListForm" style={{ padding: '0 10px 0 0' }}>
                <Col span={24}>
                  <h3 style={{ padding: "20px 0 12px 40px" }}>案件类别</h3>
                </Col>
                <Row style={{ marginLeft: 0 }} gutter={{ xl: 8, xxl: 40 }}>
                  <Col span={24}>
                    <Col span={12}>
                      <FormItem label="处理程序">
                        {getFieldDecorator('processingProgram', {
                          initialValue: `${dataSource.processingProgram}` || "",
                        })(
                          <Select onSelect={bigClass} disabled={dataSource.status != '2' && dataSource.status != '1' || userRole == 1}>
                            {processProgram && processProgram.map(item =>
                              <Option value={item.code}>{item.desp}</Option>
                            )}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem label="案件大类">
                        {getFieldDecorator('caseBigType', {
                          initialValue: dataSource.caseBigType || "",
                        })(
                          <Select placeholder="请选择" allowClear onSelect={onSelect} disabled={dataSource.status != '2' && dataSource.status != '1' || userRole == 1}>
                            {eventCategory && eventCategory.map(item =>
                              <Option value={item.code} key={item.id}>{item.desp}</Option>
                            )}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                  </Col>
                  <Col span={24}>
                    <Col span={12}>
                      <FormItem label="案件小类">
                        {getFieldDecorator('caseSmallType', {
                          initialValue: dataSource.caseSmallType || "",
                        })(
                          <Select placeholder="请选择" allowClear disabled={dataSource.status != '2' && dataSource.status != '1' || userRole == 1}>
                            {caseSmallType && caseSmallType.map(item =>
                              <Option value={item.code}>{item.desp}</Option>
                            )}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                  </Col>
                </Row>
              </div>
              {/* 上报来源 */}
              <div id="tableListForm" style={{ padding: '0 10px 0 0' }}>
                <Col span={24}>
                  <h3 style={{ padding: "20px 0 12px 40px" }}>上报来源</h3>
                </Col>
                <Row style={{ marginLeft: 0 }} gutter={{ xl: 8, xxl: 40 }}>
                  <Col span={24}>
                    <Col span={12}>
                      <FormItem label="上报渠道">
                        {getFieldDecorator('reportChannel', {
                          initialValue: dataSource.reportChannel || "1",
                        })(
                          <Select placeholder="请选择" allowClear disabled>
                            <Option key="1" value='1'>
                              街道菜单
                            </Option>
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem label="举报人">
                        {getFieldDecorator('informer', {
                          initialValue: dataSource.informer || "",
                          rules: [
                            {
                              pattern: /^[\u2E80-\u9FFF]+$/,
                              message: '姓名只能是中文'
                            }
                          ],
                        })(
                          <Input placeholder="请输入" disabled={dataSource.status != '2' && dataSource.status != '1' || userRole == 1} />
                        )}
                      </FormItem>
                    </Col>
                  </Col>
                  <Col span={24}>
                    <Col span={12}>
                      <FormItem label="联系方式">
                        {getFieldDecorator('contact', {
                          initialValue: dataSource.contact || "",
                          // rules: [
                          //   {
                          //     pattern: /^1(3|4|5|6|7|8|9)\d{9}$/,
                          //     message: '手机号码格式有误'
                          //   }
                          // ]
                        })(
                          <Input placeholder="请输入" disabled={dataSource.status != '2' && dataSource.status != '1' || userRole == 1} />
                        )}
                      </FormItem>
                    </Col>
                  </Col>
                </Row>
              </div>
              {/* 问题详情 */}
              <div id="tableListForm" style={{ padding: '0 10px 0 0' }}>
                <Col span={24}>
                  <h3 style={{ padding: "20px 0 12px 40px" }}>问题详情</h3>
                </Col>
                <Row style={{ marginLeft: 0 }} gutter={{ xl: 8, xxl: 40 }}>
                  <Col span={24}>
                    <Col span={12}>
                      <FormItem label="案卷号">
                        {getFieldDecorator('filesId', {
                          rules: [
                            {
                              required: false,
                              message: '请填写单据编号',
                            },
                          ],
                          initialValue: dataSource.filesId || "",
                        })(<Input placeholder="请输入" disabled />)}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem label="市级编号">
                        {getFieldDecorator('cityNum', {
                          initialValue: dataSource.cityNum || "",
                        })(<Input placeholder="请输入" disabled />)}
                      </FormItem>
                    </Col>
                  </Col>
                  <Col span={24}>
                    <Col span={12}>
                      <FormItem label="案件编号">
                        {getFieldDecorator('workOrderId', {
                          initialValue: dataSource.workOrderId || "",
                        })(<Input placeholder="请输入" disabled />)}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem label="上报时间">
                        {getFieldDecorator('reportTime',
                          Object.assign({}, { initialValue: moment(dataSource.reportTime) || "" }),
                        )(
                          <DatePicker
                            placeholder=""
                            style={{ width: '100%' }}
                            format="YYYY-MM-DD HH:mm:ss"
                            allowClear
                            disabled
                          />
                        )}
                      </FormItem>
                    </Col>
                  </Col>
                  <Col span={24}>
                    <Col span={12}>
                      <FormItem label="问题级别">
                        {getFieldDecorator('issueLevel', {
                          initialValue: dataSource.issueLevel || "1",
                        })(
                          <Select placeholder="请选择" allowClear disabled={dataSource.status != '2' && dataSource.status != '1' || userRole == 1}>
                            {workLevel && workLevel.map(item =>
                              <Option value={item.code}>{item.desp}</Option>
                            )}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem label="破坏程度">
                        {getFieldDecorator('destroyingDegree', {
                          initialValue: dataSource.destroyingDegree || "1",
                        })(
                          <Select placeholder="请选择" allowClear disabled={dataSource.status != '2' && dataSource.status != '1' || userRole == 1}>
                            {workDestructionDegree && workDestructionDegree.map(item =>
                              <Option value={item.code}>{item.desp}</Option>
                            )}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                  </Col>
                  <Col span={24}>
                    <Col span={12}>
                      <FormItem label="影响范围">
                        {getFieldDecorator('influenceScope', {
                          initialValue: dataSource.influenceScope || "1",
                        })(
                          <Select placeholder="请选择" allowClear disabled={dataSource.status != '2' && dataSource.status != '1' || userRole == 1}>
                            {workImpactScope && workImpactScope.map(item =>
                              <Option value={item.code}>{item.desp}</Option>
                            )}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem label="影响范围数值">
                        {getFieldDecorator('influenceScopeNum', {
                          initialValue: dataSource.influenceScopeNum || "",
                        })(<Input placeholder="请输入" disabled={dataSource.status != '2' && dataSource.status != '1' || userRole == 1} />)}
                      </FormItem>
                    </Col>
                  </Col>
                  <Col span={24}>
                    <Col span={24}>
                      <FormItem label="案件描述">
                        {getFieldDecorator('caseDescribe', {
                          initialValue: dataSource.caseDescribe || "",
                        })(<Input.TextArea rows={4} style={{ resize: 'none' }} disabled={dataSource.status != '2' && dataSource.status != '1' || userRole == 1} />)}
                      </FormItem>
                    </Col>
                  </Col>
                  <Col span={24}>
                    <Col span={12}>
                      <FormItem label="派遣时间">
                        {getFieldDecorator('dispatchTime',
                          Object.assign({}, dataSource.dispatchTime ? { initialValue: moment(dataSource.dispatchTime) } : { initialValue: "" })
                          // { initialValue: moment(dataSource.deadline) || "" }
                        )(
                          <DatePicker
                            placeholder=""
                            style={{ width: '100%' }}
                            format="YYYY-MM-DD HH:mm:ss"
                            allowClear
                            disabled
                          />
                        )}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem label="结束时间">
                        {getFieldDecorator('deadline',
                          Object.assign({}, dataSource.deadline ? { initialValue: moment(dataSource.deadline) } : { initialValue: "" }),
                        )(
                          <DatePicker
                            placeholder=""
                            style={{ width: '100%' }}
                            format="YYYY-MM-DD HH:mm:ss"
                            allowClear
                            disabled
                          />
                        )}
                      </FormItem>
                    </Col>
                  </Col>
                </Row>
              </div>
            </Col>
            {/* 附件 */}
            <Col span={8}>
              <div id="tableListForm" style={{ padding: '0 40px 0 10px' }}>
                <Col span={24}>
                  <h3 style={{ padding: "20px 0 11px 0" }}>附件清单</h3>
                </Col>
                <Col span={12} style={{ margin: "10px 0", borderRight: "solid 1px #DEE4EC", paddingRight: 19, position: "relative" }}>
                  <h5 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>整改前</h5>
                </Col>
                <Col span={12} style={{ margin: "10px 0", paddingLeft: 20, position: "relative" }}>
                  <h5 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>整改后</h5>
                </Col>
              </div>
            </Col>
          </Row>
        </Form>
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
    )
  }
}

const DetailInformation3 = Form.create()(app);
export default DetailInformation3;
