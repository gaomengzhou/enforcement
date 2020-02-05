/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React, { Component } from 'react';
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
  Carousel,
} from 'antd';
import moment from 'moment';
import styles from './Detail.less';
import PreviewModal from './PreviewModal';
import { picIp } from '@/utils/ipConfig';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class app extends Component {
  constructor(props) {
    super(props);
    this.state = {
      display: false,
      showWDY: false,
      seePhotoSrc: [],
    };
  }

  getDateStr(timeStamp) {
    const time = Math.abs(timeStamp);
    // 取天
    const day = Math.floor(time / (1000 * 60 * 60 * 24));
    // 取小时的时间戳
    const hourStamp = time % (1000 * 3600 * 24);
    // 取小时
    const hour = Math.floor(hourStamp / (1000 * 3600));
    // 取分钟的时间戳
    const minStamp = hourStamp % (1000 * 3600);
    // 取分钟
    const min = Math.floor(minStamp / (1000 * 60));
    // 取秒的时间戳
    const secStamp = min % (1000 * 60);
    // 取秒
    const sec = Math.floor(secStamp / 1000);
    // 判断是否超时
    if (timeStamp > 0) {
      var oTime = `${day}日${hour}时${min}分`;
    } else {
      //   var oTime = '-' + day + '日' + hour + '时' + min + '分';
      var oTime = '已超时';
    }
    return oTime;
  }

  // 补零操作
  addZero = num => {
    if (parseInt(num) < 10) {
      num = `0${num}`;
    }
    return num;
  };

  onSetDisply = val => {
    this.setState({ display: val });
  };

  // 鼠标移入查看整改前，后的图片
  goHome = e => {
    const hope = [];
    if (e.preAttachmentIds) {
      e.preAttachmentIds.map(item => hope.push(item))
    };
    if (e.proAttachmentIds) {
      e.proAttachmentIds.map(item => hope.push(item))
    };
    hope.length > 0 && (this.setState({ showWDY: true, seePhotoSrc: hope, }))
  }

  goback = () => {
    this.setState({
      showWDY: false,
    })
  }

  prevImg = () => {
    this.refs.carouselImg.prev();
  }

  nextImg = () => {
    this.refs.carouselImg.next();
  }

  render() {
    const { dataSource, pagination, pageChange, smallDetail } = this.props;
    const { display, showWDY, seePhotoSrc } = this.state;
    const url = '/workOrder/department/complain/detail/';
    const columns = [
      {
        title: '剩余时间',
        dataIndex: 'time',
        render: (text, record) => {
          if (record.selfDisposal) {
            if (record.selfDisposal == 1) {
              return ( // 自处置
                <span>{text}</span>
              );
            }
          }
          const str = this.getDateStr(new Date(record.deadline).getTime() - new Date().getTime());
          if (record.status == "5") {
            return (
              <span onMouseOver={this.goHome.bind(this, record)}>{text}</span>
            )
          }
          if (record.status != '4' && record.status != '1') {
            const _substr = parseInt(str.substring(str.indexOf('时') + 1, str.indexOf('分')));
            const substr = parseInt(str.substring(str.indexOf('日') + 1, str.indexOf('时')));
            const dsubstr = parseInt(str.split('日')[0]);
            if (str.indexOf("已超时") != -1) {
              return ( // 超时为红色
                <div>
                  <span className={styles._circular} /> <span>已超时</span>
                </div>
              );
            } if (str.indexOf("-") != -1) {
              return ( // 超时为红色
                <div>
                  <span className={styles._circular} /> <span>已超时</span>
                </div>
              );
            } if (dsubstr == 0 && substr == 0 && _substr > 30) {
              return ( // 半小时到一小时为黄色
                <div>
                  <span className={styles.circular} /> <span>{str}</span>
                </div>
              );
            } if (str.indexOf("NaN") != -1) {
              return ( // 未派单
                <div>
                  <span />
                </div>
              );
            } if (dsubstr == 0 && substr == 0 && _substr <= 30) {
              return ( // 半小时以内红色
                <div>
                  <span className={styles._circular} /> <span>{str}</span>
                </div>
              );
            }
            return ( // 大于1小时
              <div>
                <span className={styles.circularG} /><span>{str}</span>
              </div>
            );

          }
            <span>{str}</span>;

        },
      },
      {
        title: '工单编号',
        dataIndex: 'workOrderId',
        render: (text, record) => (
          <div className="source">
            <Link
              to={record.isCheck == 0 ? `${url + record.workOrderId}/${sessionStorage.getItem('userRole')}/0` : `${url + record.workOrderId}/${sessionStorage.getItem('userRole')}/1`}
              onMouseOver={() => {
                this.setState({ display: true });
              }}
            >
              {text}
            </Link>
          </div>
        ),
      },
      {
        title: '当前状态',
        dataIndex: 'statusDesc',
        render: (text, record) => <span
          onMouseOver={this.goHome.bind(this, record)}
          style={{ cursor: 'pointer' }}
        >
          {text}
        </span>,
      },
      {
        title: '诉求事件发生时间',
        dataIndex: 'appealHappenTime',
        render: (text, record) => (
          <span
            style={{ display: "block", cursor: 'pointer', }}
            onClick={smallDetail.bind(this, record.workOrderId, record.isCheck)}
            width="100%"
          >
            {text}
          </span>
        ),
      },
      {
        title: '诉求地址',
        dataIndex: 'appealAddress',
      },
      {
        title: '诉求内容',
        dataIndex: 'appealContent',
      },
      {
        title: '创建时间',
        dataIndex: 'createDate',
      },
      {
        title: '办结时限',
        dataIndex: 'deadline',
      },
      {
        title: '主办部门',
        dataIndex: 'organizeDepartmentDesc',
      },
    ];

    return (
      <div>
        {/* {display && <PreviewModal onDisplay={this.onSetDisply} />} */}
        <div id="listTable">
          <Table
            rowKey={record => record.id}
            columns={columns}
            dataSource={dataSource}
            pagination={pagination}
            onChange={pageChange}
          />
        </div>
        {/* <Modal
          visible={showWDY}
          onCancel={this.goback}
          footer={null}
          style={{ position: "relative" }}
          onMouseOut={this.goback}
          mask={false}
          centered
        >
          <Carousel effect="fade" ref="carouselImg">
            {seePhotoSrc && seePhotoSrc.map(item =>
              <img alt="example" style={{ width: '100%' }} src={picIp + item.filePath} />
            )}
          </Carousel>
          <Icon onClick={this.prevImg} style={{ width: 32, height: 52, lineHeight: "52px", fontSize: 18, position: "absolute", top: "46%", left: 0 }} type="left" />
          <Icon onClick={this.nextImg} style={{ width: 32, height: 52, lineHeight: "52px", fontSize: 18, position: "absolute", top: "46%", right: 0 }} type="right" />
        </Modal> */}
        <div
          style={{ width: "28%", height: "32%", position: "fixed", top: "36%", left: "37%", }}
          hidden={!showWDY}
          onMouseLeave={this.goback}
        >
          <Carousel effect="fade" ref="carouselImg" dots={false}>
            {seePhotoSrc && seePhotoSrc.map(item =>
              <img id="pho" alt="example" style={{ width: "100%" }} src={picIp + item.filePath} draggable="false" />
            )}
          </Carousel>
          <Icon onClick={this.prevImg} style={{ width: 38, height: 58, lineHeight: "58px", fontSize: 28, position: "absolute", top: "46%", left: 8 }} type="left" />
          <Icon onClick={this.nextImg} style={{ width: 38, height: 58, lineHeight: "58px", fontSize: 28, position: "absolute", top: "46%", right: 8 }} type="right" />
        </div>
      </div>
    );
  }
}

const Bodylist = Form.create()(app);
export default Bodylist;
