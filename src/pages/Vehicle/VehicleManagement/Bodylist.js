import React, { Component } from 'react';
import { connect } from 'dva';
import { mapIp } from '@/utils/ipConfig'
import {
  Row,
  Col,
  Form,
  DatePicker,
  Select,
  Button,
  Table,
  Modal,
  message,
} from 'antd';
import moment from 'moment';
const { RangePicker } = DatePicker;

const dateFormat = 'YYYY-MM-DD';
const baseSrc = `${mapIp}teamTrajectory.html`;

@connect(({ vemmodels, loading }) => ({
  vemmodels,
  loading: loading.models.vemmodels,
}))
class app extends Component {
  state = { visible: false, iframeSrc: baseSrc, };

  getNow = () => {
    return moment().format(dateFormat) + '-000000&' + moment().format(dateFormat) + '-235959'
  }

  getData = (i) => {
    const now = new Date();
    const nowTime = now.getTime();
    const day = now.getDay();
    const oneDayLong = 24 * 60 * 60 * 1000;
    const SundayTime = new Date(nowTime + (i - day) * oneDayLong);
    const y = SundayTime.getFullYear();
    const m = SundayTime.getMonth() + 1;
    const d = SundayTime.getDate();
    return y + "-" + m + "-" + d;
  }

  showTrajectory = (r) => {
    const { dispatch } = this.props;
    const sequencestart = moment(this.getData(2)).format(dateFormat) + ' 00:00:00';
    const sequenceend = moment(this.getData(7)).format(dateFormat) + ' 23:59:59';
    dispatch({
      type: 'vemmodels/getPersonTrajectory',
      payload: {
        id: r.pilot,
        starttime: sequencestart,
        endtime: sequenceend,
      },
      callback: res => {
        if (res) {
          if (res.retCode == 1) {
            // this.setState({ dataSource: res.list, totalNum: res.length, page: 1 });
            if (res.list) {
              let ridListstring = '';
              res.list.forEach(element => {
                ridListstring = ridListstring + element + ',';
              });
              this.setState({
                visible: true,
                record: r,
                iframeSrc: baseSrc + '?' + ridListstring,
                // iframeSrc: baseSrc+`?2558&${this.getNow()}`,
              });
            }
            console.log(res.list);
          } else {
            message.error('获取数据失败');
          }
        }
      },
    });
  }

  hideModal = () => {
    this.setState({
      visible: false,
    });
  };

  queryPathByDate = () => {
    const { dispatch } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const sequencestart = moment(values[0]).format(dateFormat) + ' 000000';
        const sequenceend = moment(values[1]).format(dateFormat) + ' 23:59:59';
        const { record } = this.state;
        dispatch({
          type: 'infomodels/getPersonTrajectory',
          payload: {
            id: record.pilot,
            starttime: sequencestart,
            endtime: sequenceend,
          },
          callback: res => {
            if (res) {
              if (res.retCode == 1) {
                // this.setState({ dataSource: res.list, totalNum: res.length, page: 1 });
                console.log(res.list);
                this.queryCallBack(res);
              } else {
                message.error('获取数据失败');
              }
            }
          },
        });
      }
    });
  }

  queryCallBack = (data) => {
    const thedata = {
      modelType: 'trajectory',
      planId: '',
    };
    if (data.list) {
      let ridListstring = '';
      data.list.forEach(element => {
        ridListstring = ridListstring + element + ',';
      });
      thedata.planId = ridListstring;
    }
    const childFrame = document.getElementById("mapIframe");
    childFrame.contentWindow.postMessage(thedata, "*");
  }

  render() {
    const {
      showModal,
      dataSource,
      rowSelection,
      pagination,
      onChange,
      form,
    } = this.props;
    const { visible, iframeSrc } = this.state;
    const { getFieldDecorator } = form;
    const columns = [
      {
        title: '车辆编号',
        dataIndex: 'carNo',
        // render: text => (<a onClick={this.showModal} href="''">{text}</a >),
        render: (t, r) => (
          <a onClick={showModal.bind(this, 'edit', r)}>
            {t}
          </a>
        ),
      },
      {
        title: '车架号',
        dataIndex: 'frameId',
      },
      {
        title: '车牌号',
        dataIndex: 'plateId',
      },
      {
        title: '车型',
        dataIndex: 'model',
      },
      {
        title: '使用部门',
        dataIndex: 'departmentDesc',
      },
      {
        title: '产权所属',
        dataIndex: 'propertyRightsDesp',
      },

      {
        title: '交强险截止日期',
        dataIndex: 'deadline',
      },
      {
        title: '驾驶员或责任人',
        dataIndex: 'pilotDesc',
      },
      {
        title: '联系电话',
        dataIndex: 'phone',
      },
      {
        title: '操作',
        dataIndex: 'a10',
        render: (_, record) => {
          return (
            <div
              style={{ color: '#140fef', cursor: 'pointer' }}
              onClick={() => this.showTrajectory(record)}
            >
              查看轨迹
            </div>
          );
        },
      },
    ];

    const tsIcon = require('../../../../public/userHeader.png');
    const phone = require('../../../../public/phone.png');
    const email = require('../../../../public/email.png');
    const app = require('../../../../public/app.png');
    // 弹出框数据
    const modalList = [
      { key: '车辆编号', value: '8771' },
      { key: '车架号', value: 'LB1WA5884A80087' },
      { key: '车牌号', value: '苏A88221' },
      { key: '车辆型号', value: '大众帕萨特FA6500' },
      { key: '使用部门', value: '第一中队' },
      { key: '驾驶员', value: '刘刚' },
    ];

    return (
      <div>
        <div id="listTable">
          <Table
            scroll={{ x: '130%' }}
            columns={columns}
            dataSource={dataSource}
            rowSelection={rowSelection}
            pagination={pagination}
            onChange={onChange}
            rowKey="id"
          />
          {/* 弹出框 */}
          <Modal
            title="查看轨迹"
            visible={visible}
            onCancel={this.hideModal}
            cancelText="关闭"
            footer={false}
            width={800}
            bodyStyle={{
              padding: 10,
              height: 520,
              // width: 600
            }}
            destroyOnClose
          >
            <div style={{ height: '100%', width: '100%' }}>
              <Form layout={'inline'}>
                <Row>
                  <Col span={24} style={{ display: 'flex', alignItems: 'center' }}>
                    <Form.Item label={`选择日期`}>
                      {getFieldDecorator(`date`, {
                        rules: [{ required: true, message: '请选择日期!' }],
                        initialValue: [moment(this.getData(1), dateFormat), moment(this.getData(7), dateFormat)],
                      })(<RangePicker />)}
                    </Form.Item>
                    <Button type={'primary'} onClick={this.queryPathByDate}>查询</Button>
                  </Col>
                </Row>
              </Form>
              <iframe
                id='mapIframe'
                width="100%"
                height="440px"
                scrolling="no"
                frameBorder="0"
                src={iframeSrc}
                marginHeight="0"
                marginWidth="0"
              />
            </div>
          </Modal>
        </div>
      </div>
    );
  }
}

const Bodylist = Form.create()(app);
export default Bodylist;
