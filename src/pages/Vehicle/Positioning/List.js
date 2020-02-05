import React, { Component } from 'react';
import { Form, Row, Col, Button, Divider, Select, Input, Table, Tag, DatePicker } from 'antd';
import { connect } from 'dva';
import moment from "moment";
import {mapIp} from '@/utils/ipConfig'

const { RangePicker } = DatePicker;

const dateFormat = 'YYYY-MM-DD';
const baseSrc = `${mapIp}vehiclePosition.html`;

@connect(({ position, loading }) => ({
  position,
  loading: loading.models.position,
}))

class app extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // iframeSrc: "http://58.213.107.106:60019/dcs_dataShow/pages/datashow/trajectory.html",
      // iframeSrc: "https://www.yhszpt.cn:8443/map/vehiclePosition.html",
      iframeSrc: baseSrc,
      niubi: "",
      Department:[],
      startTime:'',
      endTime:'',
      carnum:'',
      org:'',
      listData:[],
      pointData: [
        {
          id: '11',
          carNo: '苏A23343', // 车牌号
          person: '王金城',  //  驾驶员
          vehicleNo: '7865',  // 车辆编号
          vehicleVinNo: 'LB1WA5884A80087',  // 车架号
          vehicleType: '大众帕萨特FA6500',   // 车辆类型
          userDepartment: '第一中队',  // 使用部门
          LATITUDE: "32.131170120031705",  //  所在位置纬度
          LONGITUDE: "118.88690107064532",  // 所在位置经度
          state: '0' // 是否在线0为不在线 1为在线
        }, {
          id: '11',
          carNo: '苏A88843',
          person: '蔡明',
          vehicleNo: '2365',
          vehicleVinNo: 'LB1WA5884A80087',
          vehicleType: '奥迪A8',
          userDepartment: '第二中队',
          LATITUDE: "32.12831109",
          LONGITUDE: "118.88206688",
          state: '1' // 是否在线0为不在线 1为在线
        }],
    };
  }

  getData= (i)=> {
    const now = new Date();
    const nowTime = now.getTime();
    const day = now.getDay();
    const oneDayLong = 24 * 60 * 60 * 1000;
    const SundayTime = new Date(nowTime + (i - day) * oneDayLong);
    const y = SundayTime.getFullYear();
    const m = SundayTime.getMonth() + 1;
    const d = SundayTime.getDate();
    return  `${y}-${m}-${d}`;
}


  componentDidMount() {
    this.getTrackDepartment();
    const niubi = document.body.clientHeight;
    this.setState({
      niubi,
      startTime:`${moment(this.getData(1)).format(dateFormat)} 00:00:00`,
      endTime:`${moment(this.getData(7)).format(dateFormat)} 23:59:59`,
    });
    this.initIframe();
    // this.queryPathByDate();
  }

  initIframe = () =>{
    const childFrame = document.getElementById("mapIframe");
    const self =this;
    childFrame.addEventListener("load", function () {
      self.queryPathByDate();
    }, false);
  }

  initIframeData = () => {
    const { listData } = this.state;
    const data = {
      modelType: 'vehiclePosition',
      data: listData,
    };
    const childFrame = document.getElementById("mapIframe");
    childFrame.contentWindow.postMessage(data, "*");
    // window.addEventListener("message", this.receiveMessageFromIndex, false);
  }

  // 搜索查询
  queryPathByDate = ()=>{
    const { dispatch } = this.props;
    const { org,carnum,startTime,endTime, } = this.state;
    const self =this;
    dispatch({
      type: 'position/getcarPosition',
      payload: {
        page:1,
        pageSize:10,
        obj:{
          orgId_L_EQ:org,
          plateId_S_EQ:carnum,
          // startTime_D_GE:startTime,
          // startTime_D_LE:endTime,
        }
      },
      callback: res => {
        if (res) {
            console.log(res);
            const listData = [];
            res.list.forEach((item,i)=>{
               item.LATITUDE =item.position.latitude;
               item.LONGITUDE =item.position.longitude;
               item.plateIds = [item.plateId];
               if(item.online){
                    item.state ='1';
               }
              else{
                item.state ='0';
              }
               listData.push(item);
              }
            );
            this.setState({
            listData,
            },this.initIframeData);
          }
        }
    });
  }

 // 获取部门
 getTrackDepartment = () => {
  const { dispatch } = this.props;
  dispatch({
    type: 'position/getTrackDepartment',
    payload: {},
    callback: res => {
      if (res) {
        res.list.unshift({orgName:'全部',id:''});
        this.setState({ Department: res.list });
      }
    },
  });
};


dataRangeChange=(value, dateString)=> {
  this.setState({
    startTime:dateString[0],
    endTime:dateString[1],
  });
}

inputChange =(event)=>{
  this.setState({
    carnum:event.target.value,
  });
}

sleonChange =(value)=>{
  this.setState({
    org:value,
  });
}

  // receiveMessageFromIndex = event => {
  //   if (event.data.origin === 'vehicle') {
  //     if (event.data.type === 'call')
  //       console.log(`电话：${event.data.point}`);
  //     else if (event.data.type === 'messege')
  //       console.log(`短信：${event.data.point}`);
  //     else if (event.data.type === 'App')
  //       console.log(`App：${event.data.point}`);
  //   }
  // }

  render() {
    const {
      iframeSrc,
      niubi,
      Department,
      listData,
    } = this.state
    const columns = [
      {
        title: '车辆编号',
        dataIndex: 'carNo',
        key: 'carNo',
      },
      {
        title: '车牌号',
        key: 'plateIds',
        dataIndex: 'plateIds',
        render: plateIds => (
          <span>
            {plateIds.map(plateId => {
              let color = 'geekblue';
              if (plateId === 'loser') {
                color = 'volcano';
              }
              return (
                <Tag color={color} key={plateId}>
                  {plateId.toUpperCase()}
                </Tag>
              );
            })}
          </span>
        ),
      },
      {
        title: '驾驶人',
        dataIndex: 'pilotDesc',
        key: 'pilotDesc',
      },
    ];


    const { Option } = Select;

    function onChange(value) {
      console.log(`selected ${value}`);
    }

    function onBlur() {
      console.log('blur');
    }

    function onFocus() {
      console.log('focus');
    }

    function onSearch(val) {
      console.log('search:', val);
    }
    return (
      <div style={{ width: "100%", height: niubi, overflow: "hidden" }}>
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.65)',
          height: "100%",
          width: "25%",
          padding: 4,
          float: "left",
        }}
        >
          <div>
            <p style={{
              backgroundColor: `#2B49C4`,
              color: '#fff',
              fontSize: 16,
              paddingLeft: 6,
            }}
            >
              定位列表
            </p>
            <div>
              <span>部门 : </span>
              <Select
                showSearch
                style={{ width: "75%" }}
                placeholder="..."
                optionFilterProp="children"
                onChange={this.sleonChange}
                onFocus={onFocus}
                onBlur={onBlur}
                onSearch={onSearch}
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {Department && Department.map(item => (
                  <Option value={item.id} key={item.id}>
                    {item.orgName}
                  </Option>
                ))}
              </Select>
            </div>
            <div style={{ marginTop: 6 }}>
              <span>车辆 : </span>
              <Input style={{ width: "75%", height: 30 }} placeholder="请输入车牌号" onChange={this.inputChange} />
            </div>
            {/* <div style={{ marginTop: 6 }}>
              <span>时间 : </span>
              <RangePicker
                 onChange={this.dataRangeChange}
                 defaultValue={[moment(this.getData(1), dateFormat), moment(this.getData(7), dateFormat)]}
                 format={dateFormat}
              />
            </div> */}
            <Button type="primary" style={{ fontSize: 15, width: 80, marginTop: 8, marginLeft: "10%" }} onClick={this.queryPathByDate}>搜索</Button>
            <div style={{ marginTop: 10 }}>
              <Table
                columns={columns}
                dataSource={listData}
                pagination={false}
              />
            </div>
          </div>
        </div>
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.65)',
          float: "left",
          height: niubi,
          width: "75%",
          padding: 4,
        }}
        >
          <iframe
            title="mapFrame"
            id="mapIframe"
            width="100%"
            height="100%"
            scrolling="no"
            frameBorder="0"
            src={iframeSrc}
            marginHeight="0"
            marginWidth="0"
          />
        </div>
      </div>
    )
  }
}

const Positioning = Form.create()(app);
export default Positioning;
