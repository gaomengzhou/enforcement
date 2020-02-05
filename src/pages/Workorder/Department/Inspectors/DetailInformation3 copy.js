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
import styles from './Detail.less';
import moment from 'moment';

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
    } = this.props;
    const iframeSrc = `http://58.213.107.106:60019/dcs_dataShow/pages/datashow/gridQuery.html?${dataSource["ownGridNumber"]}&${dataSource["x"]}&${dataSource["y"]}`;
    const { getFieldDecorator, getFieldValue } = form;
    return (
      <div id="tableListForm" style={{ background: '#fff', paddingBottom: 28 }}>
        <Form>
          <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
            {/* 事发地点 */}
            <div id="tableListForm" style={{ padding: '0 10px 0 0' }}>
              <Col lg={24} md={24} sm={24}>
                <h3>事发地点
              <Divider style={{ margin: '12px 0 8px 0' }} dashed />
                </h3>
              </Col>
              <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
                <Col lg={8} md={24} sm={24}>
                  <FormItem label="所属街乡">
                    {getFieldDecorator('ownStreet', {
                      initialValue: dataSource.ownStreet || "尧化街道",
                    })(
                      <Input disabled />
                    )}
                  </FormItem>
                </Col>
                <Col lg={8} md={24} sm={24}>
                  <FormItem label="所属社区">
                    {getFieldDecorator('ownCommunity', {
                      initialValue: String(dataSource.ownCommunity) || "",
                    })(
                      <Select placeholder="请选择" disabled={dataSource.status != '2' && dataSource.status != '1'}>
                        {parentBank && parentBank.map(item =>
                          <Option value={item.code}>
                            {item.desp == '总行' ? '' : item.desp}
                          </Option>
                        )}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col lg={8} md={24} sm={24}>
                  <FormItem label="所属网格">
                    {getFieldDecorator('ownGridNumber', {
                      initialValue: String(dataSource.ownGridNumber) || "",
                    })(
                      <Select placeholder="请选择" disabled={dataSource.status != '2' && dataSource.status != '1'}>
                        {gridList && gridList.map(item =>
                          <Option value={item.id}>
                            {item.name}
                          </Option>
                        )}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col lg={8} md={24} sm={24} id="seePosition">
                  <FormItem label="所在位置">
                    <a
                      onClick={showMap}
                      disabled={iframeSrc == ''}
                      href="javascriput:;"
                    >查看</a>
                  </FormItem>
                </Col>
                <Col lg={16} md={24} sm={24}>
                  <FormItem label="详细位置">
                    {getFieldDecorator('detailedLocation', {
                      initialValue: dataSource.detailedLocation || "",
                    })(<Input placeholder="请输入" disabled={dataSource.status != '2' && dataSource.status != '1'} />)}
                  </FormItem>
                </Col>
              </Row>
            </div>
            {/* 案件类别 */}
            <div id="tableListForm" style={{ padding: '0 10px 0 0' }}>
              <Col lg={24} md={24} sm={24}>
                <h3 style={{ paddingTop: 28 }}>案件类别
              <Divider style={{ margin: '12px 0 8px 0' }} dashed />
                </h3>
              </Col>
              <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
                <Col lg={8} md={24} sm={24}>
                  <FormItem label="处理程序">
                    {getFieldDecorator('processingProgram', {
                      initialValue: "" + dataSource.processingProgram || "",
                    })(
                      <Select onSelect={bigClass} disabled={dataSource.status != '2' && dataSource.status != '1'}>
                        {processProgram && processProgram.map(item =>
                          <Option value={item.code}>{item.desp}</Option>
                        )}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col lg={8} md={24} sm={24}>
                  <FormItem label="案件大类">
                    {getFieldDecorator('caseBigType', {
                      initialValue: dataSource.caseBigType || "",
                    })(
                      <Select placeholder="请选择" allowClear onSelect={onSelect} disabled={dataSource.status != '2' && dataSource.status != '1'}>
                        {eventCategory && eventCategory.map(item =>
                          <Option value={item.code} key={item.id}>{item.desp}</Option>
                        )}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col lg={8} md={24} sm={24}>
                  <FormItem label="案件小类">
                    {getFieldDecorator('caseSmallType', {
                      initialValue: dataSource.caseSmallType || "",
                    })(
                      <Select placeholder="请选择" allowClear disabled={dataSource.status != '2' && dataSource.status != '1'}>
                        {caseSmallType && caseSmallType.map(item =>
                          <Option value={item.code}>{item.desp}</Option>
                        )}
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
            </div>
            {/* 上报来源 */}
            <div id="tableListForm" style={{ padding: '0 10px 0 0' }}>
              <Col lg={24} md={24} sm={24}>
                <h3 style={{ paddingTop: 28 }}>上报来源
              <Divider style={{ margin: '12px 0 8px 0' }} dashed />
                </h3>
              </Col>
              <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
                <Col lg={8} md={24} sm={24}>
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
                <Col lg={8} md={24} sm={24}>
                  <FormItem label="举报人">
                    {getFieldDecorator('informer', {
                      initialValue: dataSource.informer || "",
                    })(
                      <Input placeholder="请输入" disabled={dataSource.status != '2' && dataSource.status != '1'} />
                    )}
                  </FormItem>
                </Col>
                <Col lg={8} md={24} sm={24}>
                  <FormItem label="联系方式">
                    {getFieldDecorator('contact', {
                      initialValue: dataSource.contact || "",
                    })(
                      <Input placeholder="请输入" disabled={dataSource.status != '2' && dataSource.status != '1'} />
                    )}
                  </FormItem>
                </Col>
              </Row>
            </div>
          </Row>
          {/* 问题详情 */}
          <div id="tableListForm" style={{ padding: '58px 10px 0 0' }}>
            <h3 className="gEditLineColor">问题详情
            <Divider style={{ margin: '12px 0 8px 0' }} dashed />
            </h3>
            <Row gutter={{ md: 8, lg: 12, xl: 24 }}>
              <Col md={6} sm={8}>
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
              <Col md={6} sm={8}>
                <FormItem label="市级编号">
                  {getFieldDecorator('cityNum', {
                    initialValue: dataSource.cityNum || "",
                  })(<Input placeholder="请输入" disabled />)}
                </FormItem>
              </Col>
              <Col md={6} sm={8}>
                <FormItem label="案件编号">
                  {getFieldDecorator('workOrderId', {
                    initialValue: dataSource.workOrderId || "",
                  })(<Input placeholder="请输入" disabled />)}
                </FormItem>
              </Col>
              <Col md={6} sm={8}>
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
              <Col md={6} sm={8}>
                <FormItem label="问题级别">
                  {getFieldDecorator('issueLevel', {
                    initialValue: dataSource.issueLevel || "1",
                  })(
                    <Select placeholder="请选择" allowClear disabled={dataSource.status != '2' && dataSource.status != '1'}>
                      {workLevel && workLevel.map(item =>
                        <Option value={item.code}>{item.desp}</Option>
                      )}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={6} sm={8}>
                <FormItem label="破坏程度">
                  {getFieldDecorator('destroyingDegree', {
                    initialValue: dataSource.destroyingDegree || "1",
                  })(
                    <Select placeholder="请选择" allowClear disabled={dataSource.status != '2' && dataSource.status != '1'}>
                      {workDestructionDegree && workDestructionDegree.map(item =>
                        <Option value={item.code}>{item.desp}</Option>
                      )}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={6} sm={8}>
                <FormItem label="影响范围">
                  {getFieldDecorator('influenceScope', {
                    initialValue: dataSource.influenceScope || "1",
                  })(
                    <Select placeholder="请选择" allowClear disabled={dataSource.status != '2' && dataSource.status != '1'}>
                      {workImpactScope && workImpactScope.map(item =>
                        <Option value={item.code}>{item.desp}</Option>
                      )}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={6} sm={8}>
                <FormItem label="影响范围数值">
                  {getFieldDecorator('influenceScopeNum', {
                    initialValue: dataSource.influenceScopeNum || "",
                  })(<Input placeholder="请输入" disabled={dataSource.status != '2' && dataSource.status != '1'} />)}
                </FormItem>
              </Col>
              <Col md={12} sm={18}>
                <FormItem label="案件描述">
                  {getFieldDecorator('caseDescribe', {
                    initialValue: dataSource.caseDescribe || "",
                  })(<Input.TextArea rows={4} style={{ resize: 'none' }} disabled={dataSource.status != '2' && dataSource.status != '1'} />)}
                </FormItem>
              </Col>
              <Col md={6} sm={8}>
                <FormItem label="派遣时间">
                  {getFieldDecorator('dispatchTime',
                    Object.assign({}, { initialValue: moment(dataSource.dispatchTime) || "" })
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
              <Col md={6} sm={8}>
                <FormItem label="结束时间">
                  {getFieldDecorator('deadline',
                    Object.assign({}, { initialValue: moment(dataSource.deadline) || "" }),
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
            </Row>
          </div>
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
          ></iframe>
        </Modal>
      </div>
    )
  }
}

const DetailInformation3 = Form.create()(app);
export default DetailInformation3;