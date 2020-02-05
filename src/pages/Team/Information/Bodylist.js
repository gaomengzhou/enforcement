import React, { Component } from 'react';
import { mapIp } from '@/utils/ipConfig'
import { connect } from 'dva';
import {
  Form,
  Table,
  Modal,
  Button,
  DatePicker,
  Col,
  Row, Input
} from 'antd';
import moment from "moment";
const { RangePicker } = DatePicker;

const dateFormat = 'YYYY-MM-DD';
const baseSrc = `${mapIp}teamTrajectory.html`;

@connect(({ infomodels, loading }) => ({
  infomodels,
  loading: loading.models.infomodels,
}))
class app extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      iframeSrc: baseSrc,
      startTime: '',
      endTime: '',
      record: undefined
    };
  }

  getNow = () => {
    return moment().format(dateFormat) + '-00:00:00&' + moment().format(dateFormat) + '-23:59:59'
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

  showModal = (r) => {
    const { dispatch } = this.props;
    const sequencestart = moment(this.getData(2)).format(dateFormat) + ' 00:00:00';
    const sequenceend = moment(this.getData(7)).format(dateFormat) + ' 23:59:59';
    dispatch({
      type: 'infomodels/getPersonTrajectory',
      payload: {
        id: r.id,
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
  };


  hideModal = () => {
    this.setState({
      visible: false,
    });
  };

  queryPathByDate = () => {
    const { dispatch } = this.props;
    const { startTime, endTime, } = this.state
    const { record } = this.state;
    dispatch({
      type: 'infomodels/getPersonTrajectory',
      payload: {
        id: record.id,
        starttime: startTime,
        endtime: endTime,
      },
      callback: res => {
        if (res) {
          if (res.retCode == 1) {
            // this.setState({ dataSource: res.list, totalNum: res.length, page: 1 });
            // console.log(res.list);
            this.queryCallBack(res);
          } else {
            message.error('获取数据失败');
          }
        }
      },
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

  dataRangeChange = (value, dateString) => {
    this.setState({
      startTime: dateString[0],
      endTime: dateString[1],
    });
  }

  render() {
    const {
      iframeSrc
    } = this.state
    const {
      showModal,
      form,
      dataSource,
      pagination,
      onChange,
      rowSelection,
      showModals
    } = this.props;
    const { getFieldDecorator } = form;
    const columns = [
      {
        title: '队员编号',
        dataIndex: 'id',
        // render: text => (<a onClick={this.showModal} href="''">{text}</a >),
        render: (t, r) => (
          <a onClick={showModal.bind(this, 'edit', r)}>
            {t}
          </a>
        ),
      },
      {
        title: '姓名',
        dataIndex: 'name',
      },
      {
        title: '性别',
        dataIndex: 'sexDesp',
      },
      {
        title: '年龄',
        dataIndex: 'age',
      },
      {
        title: '联系电话',
        dataIndex: 'phone',
      },
      {
        title: '操作',
        dataIndex: 'a7',
        render: (t, r) => (
          <div>
            <a
              onClick={() => this.showModal(r)}
            // style={{marginRight:"20px"}}
            >
              查看轨迹
            </a>
          </div>
          //  <a href="javascriput:;" onClick={showModals.bind( this,'edit', r)}>
          //   查看工单
          //   </a>
        )
      },
    ];
    return (
      <div>
        <div id="listTable">
          <Table
            scroll={{ x: '100%' }}
            rowSelection={rowSelection}
            columns={columns}
            pagination={pagination}
            onChange={onChange}
            dataSource={dataSource}
          />
        </div>
        {/* 弹出框 */}
        <Modal
          title="查看轨迹"
          visible={this.state.visible}
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
                    })(<RangePicker onChange={this.dataRangeChange} />)}
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
    );
  }
}

const Bodylist = Form.create()(app);
export default Bodylist;
