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
// import PreviewModal from './PreviewModal';
import { picIp } from '@/utils/ipConfig';


const FormItem = Form.Item;
const RadioGroup = Radio.Group;
class app extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // display: false,
      showWDY: false,
      seePhotoSrc: [],
    };
  }

  getDateStr(timeStamp) {
    let time = Math.abs(timeStamp)
    // 取天
    let day = Math.floor(time / (1000 * 60 * 60 * 24));
    // 取小时的时间戳
    let hourStamp = time % (1000 * 3600 * 24);
    // 取小时
    let hour = Math.floor(hourStamp / (1000 * 3600));
    // 取分钟的时间戳
    let minStamp = hourStamp % (1000 * 3600);
    // 取分钟
    let min = Math.floor(minStamp / (1000 * 60));
    // 取秒的时间戳
    let secStamp = min % (1000 * 60);
    // 取秒
    let sec = Math.floor(secStamp / 1000);
    // 判断是否超时
    if (timeStamp > 0) {
      var oTime = `${day}日${hour}时${min}分`;
    } else {
      var oTime = `-${day}日${hour}时${min}分`;
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
    this.setState({ showWDY: val });
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
    const {
      dataSource,
      pagination,
      pageChange,
      smallDetail,
    } = this.props;
    const { showWDY, seePhotoSrc } = this.state;
    const url = "/workOrder/leader/detail/";

    const columns = [
      {
        title: '剩余时间',
        dataIndex: 'time',
        render: (text, record) => {
          if (record.selfDisposal) {
            if (record.selfDisposal == 1) {
              return ( // 自处置
                <span> </span>
              );
            }
          }
          let str = this.getDateStr(new Date(record.deadline).getTime() - new Date().getTime());
          if (record.status == "5") {
            return (
              <span onMouseOver={this.goHome.bind(this, record)}>{text}</span>
            )
          }
          if (record.status != '4') {
            let _substr = parseInt(str.substring(str.indexOf('时') + 1, str.indexOf('分')));
            let substr = parseInt(str.substring(str.indexOf('日') + 1, str.indexOf('时')));
            let dsubstr = parseInt(str.split('日')[0]);
            if (dsubstr == 0 && substr == 0 && _substr > 30) {
              return ( // 半小时到一小时为黄色
                <div>
                  <span className={styles['circular']} /> <span>{str}</span>
                </div>
              );
            } if (str.indexOf("NaN") != -1) {
              return ( // 未派单
                <div>
                  <span></span>
                </div>
              );
            } else if (str.indexOf("-") != -1) {
              return ( // 超时为红色
                <div>
                  <span className={styles['_circular']} /> <span>已超时</span>
                </div>
              );
            } else if (dsubstr == 0 && substr == 0 && _substr <= 30) {
              return ( // 半小时以内红色
                <div>
                  <span className={styles['_circular']} /> <span>{str}</span>
                </div>
              );
            } else {
              return ( // 大于1小时
                <div>
                  <span className={styles['circularG']} /><span>{str}</span>
                </div>
              );
            }
          } else {
            <span style={{ display: "block", cursor: 'pointer', width: "100%" }}>{str}</span>;
          }
        },
      },
      {
        title: '工单来源',
        dataIndex: 'workSourceDesc',
        render: (text, record) => (
          <span onMouseOver={this.goHome.bind(this, record)}>{text}</span>
        )
      },
      {
        title: '工单编号',
        dataIndex: 'workOrderId',
        render: (text, record) => (
          <div className="source">
            <Link
              to={record.isCheck == 0 ? `${url + record.workOrderId}/${sessionStorage.getItem('userRole')}/0` : `${url + record.workOrderId}/${sessionStorage.getItem('userRole')}/1`}
            >
              {text}
            </Link>
          </div>
        ),
      },
      {
        title: '状态',
        dataIndex: 'statusDesc',
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
        title: '任务分类',
        dataIndex: 'taskClassifyDesc',
      },
      {
        title: '优先级',
        dataIndex: 'taskPriorityDesc',
      },
      {
        title: '类型',
        dataIndex: 'taskTypeDesc',
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
        title: '处置部门',
        dataIndex: 'organizeDepartmentDesc',
      },
    ];

    return (
      <div>
        {/* {showWDY && <ShowModal onDisplay={this.onSetDisply} />} */}
        <div id="listTable">
          <Table
            // scroll={{ x: '120%' }}
            rowSelection={{}}
            columns={columns}
            dataSource={dataSource}
            pagination={pagination}
            onChange={pageChange}
            rowKey={record => record.workOrderId}
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
          <Carousel effect="fade" ref="carouselImg" dots={false} >
            {seePhotoSrc && seePhotoSrc.map(item =>
              <img alt="example" style={{ width: "20%", marginTop: "10%", marginLeft: "10%" }} src={picIp + item.filePath} />
            )}
          </Carousel>
          <Icon onClick={this.prevImg} style={{ width: 38, height: 58, lineHeight: "58px", fontSize: 28, position: "absolute", top: "46%", left: -38 }} type="left" />
          <Icon onClick={this.nextImg} style={{ width: 38, height: 58, lineHeight: "58px", fontSize: 28, position: "absolute", top: "46%", right: -38 }} type="right" />
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
