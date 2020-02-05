/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-unused-expressions */
/* eslint-disable radix */
/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
/* eslint-disable global-require */
/* eslint-disable array-callback-return */
/* eslint-disable eqeqeq */
/* eslint-disable no-redeclare */
/* eslint-disable block-scoped-var */
/* eslint-disable no-var */
/* eslint-disable vars-on-top */
/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
/* eslint-disable func-names */
/* eslint-disable no-shadow */
/* eslint-disable react/no-unused-state */
/* eslint-disable import/no-extraneous-dependencies */
import React, { PureComponent } from 'react';
import Link from 'umi/link';
import { Button, Form, Table, Icon, Modal, message } from 'antd';
import moment from 'moment/moment';
import { connect } from 'dva/index';
import styles from './home.less';

import { picIp, mapIp } from '@/utils/ipConfig';

const baseSrc = `${mapIp}homePage.html`;

@Form.create()
@connect(({ home }) => ({
  home,
}))

class Home extends PureComponent {
  state = {
    dataSource: [],
    visibleOnline: false,
    visibleNotOnline: false,
    pageNum: 1,
    pageSize: 5,
    dataSourceList: [],
    pointData: [],
    UserInfo: {},
    UU: [],
    baseSrc,
    userRole: sessionStorage.getItem('userRole'), // 身份id
  };

  componentWillMount() {
    this.getUserList();
    this.getTodoList();
    this.getUserInfo();
    this.props.dispatch({
      type: 'home/toDoListFetch',
      payload: {
        pageNum: 1,
        pageSize: 5,
      },
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'home/getauthInfo',
      payload: {},
      callback: res => {
        if (res) {
          sessionStorage.setItem('userId', res.userId)
          sessionStorage.setItem('roleMerged', res.roleMerged)
          dispatch({
            type: 'home/getuserRole',
            payload: {
              id: res.userId,
            },
            callback: res => {
              if (res) {
                sessionStorage.setItem('userRole', res.data.role)
              }
            }
          })
        }
      }
    })
  }

  componentDidMount() {
    const self = this;
    const childFrame = document.getElementById("mapIframe");
    childFrame.addEventListener("load", function () {
      self.initIframe();
    }, false);

  }

  // 处置时限时间处理
  getDateStr(timeStamp) {
    const time = Math.abs(timeStamp)
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
      var oTime = `-${day}日${hour}时${min}分`;
    }
    return oTime;
  }

  initIframe = () => {
    const { dispatch } = this.props;
    const self = this;
    dispatch({
      type: 'home/getUserPosition',
      payload: {},
      callback: res => {
        self.initIframeData(res)
      }
    });
  }

  initIframeData = (list) => {
    const thedata = {
      modelType: 'homoePage',
      data: list,
    };
    const childFrame = document.getElementById("mapIframe");
    childFrame.contentWindow.postMessage(thedata, "*");
  }

  // receiveMessageFromIndex = event => {
  //   if (event.data.origin === 'homoePage') {
  //     if (event.data.type === 'call')
  //       console.log(`电话：${event.data.point}`);
  //     else if (event.data.type === 'messege')
  //       console.log(`短信：${event.data.point}`);
  //     else if (event.data.type === 'App')
  //       console.log(`App：${event.data.point}`);
  //   }
  // }

  // 获取待办事项表单数据
  getTodoList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'home/getTodoList',
      payload: {
        page: 1,
        pageSize: 5,
        role: this.state.userRole,
      },
      callback: res => {
        if (res) {
          if (res.retCode == 1) {
            this.setState({
              dataSourceList: res.list,
              totalNumList: res.length,
            });
          } else {
            message.error(res.retMsg);
          }
        }
      },
    })
  }

  // 获取用户信息表单数据
  getUserList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'home/getUserList',
      payload: {
        role: this.state.userRole,
      },
      callback: res => {
        if (res) {
          // console.log("res",res.list)
          if (res.retCode == 1) {
            res.list.map(item => {
              this.state.UU.push({ area: Math.abs(item.area), orderTypeDesc: item.orderTypeDesc, city: Math.abs(item.city), street: Math.abs(item.street) })
            })
            // this.setState({
            //   UserTable: res.list,
            // });
          } else {
            message.error(res.retMsg);
          }
        }
      },
    })
  }

  // 获取用户信息
  getUserInfo = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'home/getUserInfo',
      payload: {
      },
      callback: res => {
        if (res) {
          if (res.retCode == 1) {
            this.setState({
              UserInfo: res.data,
            });
          } else {
            message.error(res.retMsg);
          }
        }
      },
    })
  }


  // 查询
  handleSearchFooter = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => { });
  };

  handleSearch = value => {
    this.setState({
      dataSource: value || [],
    });
  };

  // 分页
  handleTableChange = pagination => {
    const { dispatch } = this.props;
    this.setState({ page: pagination }, function () {
      dispatch({
        type: 'home/getTodoList',
        payload: {
          page: this.state.page,
          pageSize: this.state.pageSize,
          role: this.state.userRole,
        },
        callback: res => {
          if (res) {
            this.setState({ dataSourceList: res.list, totalNumList: res.length });
          }
        },
      });
    });
  };

  // 重置
  handleResetFooter = () => {
    this.props.form.resetFields();
  };

  handleCancelOnline() {
    this.setState({
      visibleOnline: false,
    });
  }

  // 不在线
  showModalNotOnline() {
    this.setState({
      visibleNotOnline: true,
    });
  }

  handleOkNotOnline() {
    this.setState({
      visibleNotOnline: false,
    });
  }

  handleCancelNotOnline() {
    this.setState({
      visibleNotOnline: false,
    });
  }

  handleOkOnline() {
    this.setState({
      visibleOnline: false,
    });
  }


  showModalOnline() {
    this.setState({
      visibleOnline: true,
    });
  }

  render() {
    // console.log(this.props.home)
    const { getFieldDecorator } = this.props.form;
    const { pageNum, pageSize, UserInfo, baseSrc, } = this.state;
    const { home } = this.props;
    const { todoList } = home;
    const bgImg = require('../../../public/bgimg.jpg');
    const tsIcon = require('../../../public/userHeader.png');
    const phone = require('../../../public/phone.png');
    const email = require('../../../public/email.png');
    const app = require('../../../public/app.png');
    const map = require('../../../public/map.jpg');
    const that = this;
    const url = '/workOrder/department/inspectors/detail/';
    const columns = [
      {
        title: '工单编号',
        dataIndex: 'workOrderId',
        render: (text, record) => {
          if (record.workType == '4') {
            return (
              <Link
                to={record.isCheck == 1 ? `/workOrder/leader/detail/${record.workOrderId}/${this.state.userRole}/1` : `/workOrder/leader/detail/${record.workOrderId}/${this.state.userRole}/0`}
              >
                {text}
              </Link>
            )
          }
          if (record.workType == '1') {
            return (
              <Link
                to={record.isCheck == 1 ? `/workOrder/department/inspectors/detail/${record.workOrderId}/${this.state.userRole}/1` : `/workOrder/department/inspectors/detail/${record.workOrderId}/${this.state.userRole}/0`}
              >
                {text}
              </Link>
            )
          }
          if (record.workType == '2') {
            return (
              <Link
                to={record.isCheck == 1 ? `/workOrder/department/comprehensive/detail/${record.workOrderId}/${this.state.userRole}/1` : `/workOrder/department/comprehensive/detail/${record.workOrderId}/${this.state.userRole}/0`}
              >
                {text}
              </Link>
            )
          }
          if (record.workType == '3') {
            return (
              <Link
                to={record.isCheck == 1 ? `/workOrder/department/complain/detail/${record.workOrderId}/${this.state.userRole}/1` : `/workOrder/department/complain/detail/${record.workOrderId}/${this.state.userRole}/0`}
              >
                {text}
              </Link>
            )
          }
        },
      },
      {
        title: '工单来源',
        dataIndex: 'workOrderSourceDesc',
        render: (text, record) => {
          if (record.workType == 1) {
            return (<span> {record.workOrderSourceDesc}</span>)
          } if (record.workType == 2) {
            return (<span> {record.workOrderSourceDesc}</span>)
          } if (record.workType == 3) {
            return (<span> {record.appealSourceDesc}</span>)
          } if (record.workType == 4) {
            return (<span> {record.workSourceDesc}</span>)
          }
        }
      },
      {
        title: '工单类型',
        dataIndex: 'workTypeDesc',
      },
      {
        title: '执行队员',
        dataIndex: 'executorDesc',
        // render: (text, record) => <span>{text || '未分派'}</span>,
      },
      {
        title: '剩余时间',
        key: 'tags',
        dataIndex: 'tags',
        // render: (text, record) => (
        //   <div>
        //     {text ? (
        //       <p id="remainingTime">
        //         <span id="remainingTimeStatus">
        //           {residue(record.deadline).status === '0' ? (
        //             <span className="remainingTimeStatusZero" />
        //           ) : residue(record.deadline).status === '1' ? (
        //             <span className="remainingTimeStatusOne" />
        //           ) : residue(record.deadline).status === '2' ? (
        //             <span className="remainingTimeStatusTwo" />
        //           ) : residue(record.deadline).status === '3' ? (
        //             <span className="remainingTimeStatusThree" />
        //           ) : residue(record.deadline).status === '4' ? (
        //             <span className="remainingTimeStatusZero" />
        //           ) : (
        //                       ''
        //                     )}
        //         </span>
        //         <span>{residue(record.deadline).str}</span>
        //       </p>
        //     ) : (
        //         ''
        //       )}
        //   </div>
        // ),
        render: (text, record) => {
          // if (record.selfDisposal) {
          //   if (record.selfDisposal == 1) {
          //     return ( // 自处置
          //       <span> </span>
          //     );
          //   }
          // }
          // let str = this.getDateStr(new Date(record.deadline).getTime() - new Date().getTime());
          const str = this.getDateStr(new Date(record.deadline).getTime() - new Date().getTime());
          // if (record.status == "5" || this.state.userRole == "2") {
          //   if (record.deadline) {

          //   } else {
          //     return (<span></span>)
          //   }
          // }
          // if (record.status == "1" || record.status == "2") {
          //   return (
          //     <span></span>
          //   )
          // }
          // if (record.status != '7' && record.status != '1') {
          if (record.deadline) {
            const _substr = parseInt(str.substring(str.indexOf('时') + 1, str.indexOf('分')));
            const substr = parseInt(str.substring(str.indexOf('日') + 1, str.indexOf('时')));
            const dsubstr = parseInt(str.split('日')[0]);
            if (str.indexOf("已超时") != -1) {
              return ( // 超时为红色
                <div>
                  <span style={{ color: 'red' }}>已超时</span>
                </div>
              );
            } if (str.indexOf("-") != -1) {
              return ( // 超时为红色
                <div>
                  <span style={{ color: 'red' }}>已超时</span>
                </div>
              );
            } if (dsubstr == 0 && substr == 0 && _substr > 30) {
              return ( // 半小时到一小时为黄色
                <div>
                  <span style={{ color: 'orange' }}>{str}</span>
                </div>
              );
            }
            // else if (str.indexOf("NaN") != -1) {
            //   return ( // 未派单
            //     <div>
            //       <span></span>
            //     </div>
            //   );
            // }
            if (dsubstr == 0 && substr == 0 && _substr <= 30) {
              return ( // 半小时以内红色
                <div>
                  <span style={{ color: 'red' }}>{str}</span>
                </div>
              );
            }
            return ( // 大于1小时
              <div>
                <span style={{ color: 'green' }}>{str}</span>
              </div>
            );

          }
            <span />;

        },
      },
    ];
    // 在线人员
    const columnsOnline = [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        render: text => <a>{text}</a>,
      },
      {
        title: '部门',
        dataIndex: 'age',
        key: 'age',
      },
      {
        title: '职位',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: '片区',
        dataIndex: 'person',
        key: 'person',
      },
    ];
    const dataOnline = [
      {
        key: '1',
        name: '王金龙',
        age: '综合执法第一中队',
        address: '执法队员',
        person: '尧化社区',
      },
      {
        key: '2',
        name: '王金龙',
        age: '综合执法第一中队',
        address: '执法队员',
        person: '尧化社区',
      },
      {
        key: '3',
        name: '王金龙',
        age: '综合执法第一中队',
        address: '执法队员',
        person: '尧化社区',
      },
      {
        key: '4',
        name: '王金龙',
        age: '综合执法第一中队',
        address: '执法队员',
        person: '尧化社区',
      },
      {
        key: '5',
        name: '王金龙',
        age: '综合执法第一中队',
        address: '执法队员',
        person: '尧化社区',
      },
    ];
    // 不在线人员
    const columnsNotOnline = [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        render: text => <a>{text}</a>,
      },
      {
        title: '部门',
        dataIndex: 'age',
        key: 'age',
      },
      {
        title: '职位',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: '片区',
        dataIndex: 'person',
        key: 'person',
      },
    ];
    // 用户信息表格数据
    const tabledate = [
      {
        title: '',
        width: 50,
        dataIndex: 'orderTypeDesc',
      },
      {
        width: 90,
        title: '今日市级工单',
        dataIndex: 'city',
      },
      {
        width: 90,
        title: '今日区级工单',
        dataIndex: 'area',
      },
      {
        width: 90,
        title: '今日街道工单',
        dataIndex: 'street',
      },
    ]
    const dataNotOnline = [
      {
        key: '1',
        name: '王金龙',
        age: '综合执法第一中队',
        address: '执法队员',
        person: '尧化社区',
      },
      {
        key: '2',
        name: '王金龙',
        age: '综合执法第一中队',
        address: '执法队员',
        person: '尧化社区',
      },
      {
        key: '3',
        name: '王金龙',
        age: '综合执法第一中队',
        address: '执法队员',
        person: '尧化社区',
      },
      {
        key: '4',
        name: '王金龙',
        age: '综合执法第一中队',
        address: '执法队员',
        person: '尧化社区',
      },
      {
        key: '5',
        name: '王金龙',
        age: '综合执法第一中队',
        address: '执法队员',
        person: '尧化社区',
      },
    ];
    return (
      <div>
        <div id={styles.home}>
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <div
                style={{
                  marginBottom: 10,
                  height: '32px',
                  lineHeight: '26px',
                  color: '#999',
                  fontSize: '16px',
                }}
              >
                <Icon type="calendar" style={{ marginRight: 10 }} />
                <span>当前日期：</span>
                <span>{moment().format('LL')}</span>
                <span style={{ marginLeft: 6 }}>{moment().format('dddd')}</span>
              </div>
              <div className={styles.headerLeftContent}>
                <div className={styles.headerLeftContentArrow}>
                  <h3>用户信息</h3>
                  {/* <span /> */}
                </div>
                <div className={styles.headerInf}>
                  <div className={styles.headerUser}>
                    <div className={styles.headerUserImg}>
                      <img src={UserInfo.picAttachmentIds ? (picIp + (UserInfo.picAttachmentIds && UserInfo.picAttachmentIds[0].filePath)) : bgImg} alt="" />
                    </div>
                    {
                      //   <div style={{ marginTop: 14, display: 'flex', justifyContent: 'space-between' }}>
                      //   <img src={phone} alt="" />
                      //   <img src={email} alt="" />
                      //   <img src={app} alt="" />
                      // </div>
                    }
                  </div>
                  <div className={styles.headerDetail}>
                    <div>
                      <span>姓名：</span>
                      <span>{this.state.UserInfo.lastName}</span>
                    </div>
                    <div style={{ width: "100%", position: "relative" }}>
                      <span style={{ position: "absolute" }}>部门：</span>
                      <span style={{ display: "block", width: "140px", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden", marginLeft: "42px" }}>
                        {this.state.UserInfo.orgName}
                      </span>
                    </div>
                    <div>
                      <span>性别：</span>
                      <span>{this.state.UserInfo.sexDesc}</span>
                    </div>
                    <div>
                      <span>年龄：</span>
                      <span>{this.state.UserInfo.age}</span>
                    </div>
                    <div>
                      <span>职位：</span>
                      <span>{this.state.UserInfo.position}</span>
                    </div>
                    {
                      // <div>
                      //   <span>片区：</span>
                      //   <span>尧化社区</span>
                      // </div>
                    }
                  </div>
                </div>
                <div className={styles.workOrder}>
                  {
                    // <ul>
                    //   <li>
                    //     <span style={{ height: 10 }} />
                    //     {/* <span>今日市级工单</span>
                    //     <span>今日区级工单</span>
                    //     <span>今日街道工单</span> */}
                    //   </li>
                    //   {/* <li>
                    //     <span>应处理</span>
                    //     <span>50</span>
                    //     <span>50</span>
                    //     <span>30</span>
                    //   </li> */}
                    //   <li style={{marginBottom:'8%'}}>
                    //     <span>今日已处理</span>
                    //     <span>40</span>
                    //     <span>0</span>
                    //     <span>0</span>
                    //   </li>
                    //   <li>
                    //     <span>待处理</span>
                    //     <span>10</span>
                    //     <span>50</span>
                    //     <span>0</span>
                    //   </li>
                    // </ul>
                  }
                  <Table columns={tabledate} dataSource={this.state.UU} pagination={false} />
                </div>
              </div>
            </div>
            <div className={styles.headerRight}>
              <div className={styles.headerRightSearch} style={{ marginBottom: 8 }}>
                <div className="global-search-wrapper">
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <div style={{ width: '300px', height: 33 }}>
                      {/* <AutoComplete
                        className="global-search"
                        style={{ width: '100%' }}
                        dataSource={this.state.dataSource}
                        // onSelect={onSelect}
                        onSearch={this.handleSearch}
                        placeholder=""
                        optionLabelProp="text"
                      >
                        <Input
                          suffix={
                            <Button
                              className="search-btn"
                              type="primary"
                              style={{ marginRight: '-12px' }}
                            >
                              查询
                            </Button>
                          }
                        />
                      </AutoComplete> */}
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.headerRightContent}>
                <div className={styles.headerLeftContentArrow}>
                  <h3>待办事项</h3>
                  {/* <span /> */}
                </div>
                <div className={styles.headerRightContentTable}>
                  <Table
                    columns={columns}
                    // dataSource={todoList.list}
                    dataSource={this.state.dataSourceList}
                    rowKey={record => record.id}
                    pagination={{
                      current: this.state.page,
                      pageSize,
                      onChange(current, pageSize) {
                        that.handleTableChange(current, pageSize);
                      },
                      total: this.state.totalNumList,
                      showTotal: total => `共 ${total} 条数据`,
                      size: 'small',
                      showQuickJumper: true,
                      // pageSizeOptions: ['10','15','20'],
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className={styles.indexCenter}>
            <div>
              <h3>第一中队</h3>
              <ul>
                <li onClick={this.showModalOnline.bind(this)}>
                  <div>今日在线</div>
                  <div>25</div>
                </li>
                <li onClick={this.showModalNotOnline.bind(this)}>
                  <div>今日未在线</div>
                  <div>25</div>
                </li>
              </ul>
            </div>
            <div>
              <h3>第二中队</h3>
              <ul>
                <li>
                  <div>今日在线</div>
                  <div>25</div>
                </li>
                <li>
                  <div>今日未在线</div>
                  <div>25</div>
                </li>
              </ul>
            </div>
            <div>
              <h3>第三中队</h3>
              <ul>
                <li>
                  <div>今日在线</div>
                  <div>25</div>
                </li>
                <li>
                  <div>今日未在线</div>
                  <div>25</div>
                </li>
              </ul>
            </div>
            <div>
              <h3>第四中队</h3>
              <ul>
                <li>
                  <div>今日在线</div>
                  <div>25</div>
                </li>
                <li>
                  <div>今日未在线</div>
                  <div>25</div>
                </li>
              </ul>
            </div>
          </div>
          <div className={styles.indexFooter} style={{ padding: '30px 24px 0 24px' }}>
            {/* <div
              id="tableListForm"
              style={{ paddingBottom: '30px', borderBottom: '1px solid #DCDCDC' }}
            >
              <Form layout="inline" id="tableListFormIndex">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                  <Col md={6} sm={8}>
                    <FormItem label="工单编号">
                      {getFieldDecorator('completeTime', {})(<Input placeholder="请输入" />)}
                    </FormItem>
                  </Col>
                  <Col md={6} sm={8}>
                    <FormItem label="工单来源">
                      {getFieldDecorator('phone', {})(<Input placeholder="请输入" />)}
                    </FormItem>
                  </Col>
                  <Col md={12} sm={8} style={{ textAlign: 'right' }}>
                    <Button type="primary" onClick={this.handleSearchFooter}>
                      查询
                    </Button>
                    <Button
                      style={{
                        marginRight: 0,
                        marginLeft: 16,
                        width: 120,
                        border: '1px solid #2B49C4',
                        color: '#2B49C4',
                      }}
                      onClick={this.handleResetFooter}
                    >
                      清空全部条件
                    </Button>
                  </Col>
                </Row>
              </Form>
            </div> */}
            <div style={{ width: '100%', height: '800px', }}>
              {/* <img style={{ width: '100%', height: '100%' }} src={map} alt="" /> */}
              <iframe
                title="mapFrame"
                id="mapIframe"
                width="100%"
                height="99%"
                scrolling="no"
                frameBorder="0"
                src={baseSrc}
                marginHeight="0"
                marginWidth="0"
              />
            </div>
          </div>
        </div>
        <Modal
          title="今日在线"
          width={600}
          visible={this.state.visibleOnline}
          onOk={this.handleOkOnline.bind(this)}
          onCancel={this.handleCancelOnline.bind(this)}
          footer={[
            <Button key="submit" type="primary" onClick={this.handleOkOnline.bind(this)}>
              关闭
            </Button>,
          ]}
        >
          <div>
            <Table columns={columnsOnline} dataSource={dataOnline} />
          </div>
        </Modal>
        <Modal
          title="今日不在线"
          width={600}
          visible={this.state.visibleNotOnline}
          onOk={this.handleOkNotOnline.bind(this)}
          onCancel={this.handleCancelNotOnline.bind(this)}
          footer={[
            <Button key="submit" type="primary" onClick={this.handleCancelNotOnline.bind(this)}>
              关闭
            </Button>,
          ]}
        >
          <div>
            <Table columns={columnsOnline} dataSource={dataOnline} />
          </div>
        </Modal>
      </div>
    );
  }
}
export default Home;
