import React, { Component } from 'react';
import Link from 'umi/link';
import {
  Row,
  Col,
  Form,
  Input,
  Select,
  Button,
  Table,
  Radio,
  Modal,
  Pagination,
  Breadcrumb,
  Carousel,
} from 'antd';

import moment from 'moment';
import { picIp } from '@/utils/ipConfig';


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
    var time = Math.abs(timeStamp)
    //取天
    var day = Math.floor(time / (1000 * 60 * 60 * 24));
    //取小时的时间戳
    var hourStamp = time % (1000 * 3600 * 24);
    //取小时
    var hour = Math.floor(hourStamp / (1000 * 3600));
    //取分钟的时间戳
    var minStamp = hourStamp % (1000 * 3600);
    //取分钟
    var min = Math.floor(minStamp / (1000 * 60));
    //取秒的时间戳
    var secStamp = min % (1000 * 60);
    //取秒
    var sec = Math.floor(secStamp / 1000);
    // 判断是否超时
    if (timeStamp > 0) {
      var oTime = day + '日' + hour + '时' + min + '分';
    } else {
      var oTime = '-' + day + '日' + hour + '时' + min + '分';
    }
    return oTime;
  }

  //补零操作
  addZero = num => {
    if (parseInt(num) < 10) {
      num = '0' + num;
    }
    return num;
  };

  onSetDisply = val => {
    this.setState({ showWDY: val });
  };

  // 鼠标移入查看整改前，后的图片
  goHome = e => {
    let hope = [];
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
    // const { showWDY, seePhotoSrc } = this.state;
    const url = "/workOrder/community/detail/";
    const columns = [
      {
        title: '剩余时间',
        dataIndex: 'time',
      },
      {
        title: '巡查编号',
        dataIndex: 'workOrderId',
        render: (text, record) => (
          <div className="source">
            <Link
              to={record.isCheck == 0 ? url + record.workOrderId + '/' + sessionStorage.getItem('userRole') + "/0" : url + record.workOrderId + '/' + sessionStorage.getItem('userRole') + "/1"}
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
      },
      {
        title: '诉求事件发生时间',
        dataIndex: 'reportTime',
      },
      {
        title: '诉求地址',
        dataIndex: 'addressDesc',
      },
      {
        title: '诉求内容',
        dataIndex: 'reportContent',
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
        dataIndex: 'assistDepartmentDesc',
      },
    ];
    return (
      <div id="listTable">
        <Table
          rowSelection={{}}
          columns={columns}
          dataSource={dataSource}
          rowKey={record => record.id}
        // pagination={pagination}
        // onChange={pageChange}
        />
      </div>
    );
  }
}

const Bodylist = Form.create()(app);
export default Bodylist;
