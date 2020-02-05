import React, { Component } from 'react';
import {mapIp} from '@/utils/ipConfig'
import {
  Form, Row, Col, Button, Divider, Select, Input, Table, Tag, DatePicker, Tabs
} from 'antd';
import { connect } from 'dva';
import Link from 'umi/link';
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
import moment from "moment";

const dateFormat = 'YYYY-MM-DD';
const baseSrc = `${mapIp}trajectory.html`;

@connect(({ TrackListmodels, loading }) => ({
  TrackListmodels,
  loading: loading.models.TrackListmodels,
}))
class app extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // iframeSrc: "http://58.213.107.106:60019/dcs_dataShow/pages/datashow/trajectory.html",
      // iframeSrc: "https://www.yhszpt.cn:8443/map/trajectory.html",
      iframeSrc: baseSrc,
      TrackDepartment: [], // 部门数据
      niubi: '',
      startTime:'',
      endTime:'',
      person:'',
      org:'',
      listData:[],
      polygonData: [],
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
    return  y+"-"+m+"-"+d;  
}

  componentDidMount() {
    this.getTrackDepartment();
    const niubi = document.body.clientHeight;
    this.setState({
      niubi,
      startTime:moment(this.getData(1)).format(dateFormat)+' 00:00:00',
      endTime:moment(this.getData(7)).format(dateFormat)+' 23:59:59',
    });
    this.queryPathByDate();
  }

  initIframe = () => {
    const { polygonData } = this.state;
    const data = {
      modelType: 'trajectory',
      data: polygonData,
    };
    const childFrame = document.getElementById("mapIframe");
    childFrame.contentWindow.postMessage(data, "*");
    // childFrame.addEventListener("load", function () {
    //   childFrame.contentWindow.postMessage(data, "*");
    // }, false);
  }

  // 获取部门
  getTrackDepartment = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'TrackListmodels/getTrackDepartment',
      payload: {},
      callback: res => {
        if (res) {
          res.list.unshift({orgName:'全部',id:''});
          this.setState({ TrackDepartment: res.list });
        }
      },
    });
  };

  // 搜索查询
    queryPathByDate = ()=>{
      const { dispatch } = this.props;
      const { org,person,startTime,endTime, } = this.state;
      const self =this;
      dispatch({
        type: 'TrackListmodels/trajectoryList',
        payload: {
          page:1,
          pageSize:10,
          orgId_L_EQ:org,
          playerName_S_LK:person,
          startTime_D_GE:startTime,
          startTime_D_LE:endTime,
        },
        callback: res => {
          if (res) {
            const data = [];
            const polygonData = [];
            res.list.forEach((item,i)=>{
                const obj={};
                const lineobj={};
                obj.key=i;
                obj.name=item.playerName;
                obj.address=item.name;
                obj.tags=item.trajectoryStatus;
                obj.planTrajectory=item.planTrajectory;
                if(item.questTrajectory){
                  obj.questTrajectory = item.questTrajectory;
                }
                data.push(obj);
                lineobj.title = item.name;
                lineobj.person = item.playerName;
                lineobj.state = item.trajectoryStatus;
                lineobj.type = '2';
                lineobj.title = item.name;
                lineobj.line=item.planTrajectory;
                polygonData.push(lineobj);
                if(item.questTrajectory){
                  const qlineobj={};
                  qlineobj.title = item.name;
                  qlineobj.person = item.playerName;
                  qlineobj.state = item.trajectoryStatus;
                  qlineobj.title = item.name;
                  qlineobj.line=item.questTrajectory;
                  qlineobj.type = '1';
                  polygonData.push(qlineobj);
                  }
              }
            );

            this.setState({
            listData:data,
            polygonData,
            },this.initIframe);
          }
        },
      });
    }

    dataRangeChange=(value, dateString)=> {
      this.setState({
        startTime:dateString[0],
        endTime:dateString[1],
      });
    }
    inputChange =(event)=>{
      this.setState({
        person:event.target.value,
      });
    }

    sleonChange =(value)=>{
      this.setState({
        org:value,
      });
    }

  render() {
    const {
      iframeSrc, niubi, TrackDepartment, polygonData,listData
    } = this.state
    const columns = [
      {
        title: '任务名称',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: '状态',
        key: 'tags',
        dataIndex: 'tags',
        // render: tags => (
        //   <span>
        //     {tags.map(tag => {
        //       let color = 'geekblue';
        //       if (tag === 'loser') {
        //         color = 'volcano';
        //       }
        //       return (
        //         <Tag color={color} key={tag}>
        //           {tag.toUpperCase()}
        //         </Tag>
        //       );
        //     })}
        //   </span>
        // ),
      },
      {
        title: '执行人',
        dataIndex: 'name',
        key: 'name',
      },
    ];

    const { Option } = Select;
    const tableProps = {
      dataSource: listData,
      columns,
      pagination:false,
      onRow: record => {
        return { onClick: () => {
          const data = {
            modelType: 'newTrajectory',
            data: record,
          };
          const childFrame = document.getElementById("mapIframe");
          childFrame.contentWindow.postMessage(data, "*");
          } 
        }
      }
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
    // 筛选的时候 代码参考
    function handleChange(value) {
      let thedata;
      const childFrame = document.getElementById("mapIframe");
      if (value === '0') {
        thedata = {
          modelType: 'trajectory',
          data: polygonData,
        };
      }
      else {
        const polygon = [];
        polygonData.forEach(item => {
          if (item.type === value) {
            polygon.push(item);
          }
        });
        thedata = {
          modelType: 'trajectory',
          data: polygon,
        };
      }
      childFrame.contentWindow.postMessage(thedata, "*");
    }
    return (
      <div style={{ width: "100%", height: niubi }}>
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.65)',
          height: "100%",
          width: "25%",
          padding: 4,
          float: "left",
        }}>
          <div>
            <p style={{
              backgroundColor: `#2B49C4`,
              color: '#fff',
              fontSize: 16,
              paddingLeft: 6,
            }}>轨迹列表
            </p>
            <div>
              <Link to="/everyDay/team/track/add">
                <Button type="primary" style={{ fontSize: '12px' }}>巡查任务设置</Button>
              </Link>
              <Button type="primary" style={{ marginLeft: '10px', fontSize: '12px' }}>巡查任务历史</Button>
            </div>
            <div>
              <Divider style={{ margin: '12px 0 8px 0' }} dashed />
              <span>部门 : </span>
              <Select
                showSearch
                style={{ width: "75%" }}
                placeholder="请选择"
                optionFilterProp="children"
                onChange={this.sleonChange}
                onFocus={onFocus}
                onBlur={onBlur}
                onSearch={onSearch}
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {TrackDepartment && TrackDepartment.map(item => (
                  <Option value={item.id} key={item.id}>
                    {item.orgName}
                  </Option>
                ))}
              </Select>
            </div>
            <div style={{ marginTop: 6 }}>
              <span>队员 : </span>
              <Input style={{ width: "75%", height: 30 }} placeholder="请输入队员名称"  onChange={this.inputChange}/>
            </div>
            <div style={{ marginTop: 6 }}>
              <span>时间 : </span>
              <RangePicker
                 onChange={this.dataRangeChange}
                 defaultValue={[moment(this.getData(1), dateFormat), moment(this.getData(7), dateFormat)]}
                 format={dateFormat}
              />
            </div>
            <Button type="primary" style={{ fontSize: 15, width: 80, marginTop: 8, marginLeft: "10%" }}  onClick={this.queryPathByDate}>搜索</Button>
            <div style={{ marginTop: 10, fontSize: "12px" }}>
              <Table {...tableProps} />
            </div>

          </div>
        </div>
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.65)',
          height: niubi,
          width: "75%",
          padding: 4,
          float: "left",
        }}>
          <Select defaultValue="0" onChange={handleChange} style={{ position: "absolute", width: 180, right: 20, }}>
            <Option value="0">显示计划和实际轨迹</Option>
            <Option value="1">显示实际轨迹</Option>
            <Option value="2">显示计划轨迹</Option>
          </Select>
          <iframe
            id='mapIframe'
            title="mapframe"
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

const StaffAppraisal = Form.create()(app);
export default StaffAppraisal;
