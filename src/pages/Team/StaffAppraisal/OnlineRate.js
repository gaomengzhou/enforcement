import React, { Component } from 'react';
import {
  Form,
  Row,
  Col,
  Select,
  Input,
  DatePicker,
  Button,
  Table,
} from 'antd';
import moment from 'moment';
var echarts = require('echarts');
import 'echarts/lib/chart/line';
import { connect } from 'dva';

const FormItem = Form.Item;
const Option = Select.Option;

@connect(({ StaffAppraisalmodels, loading }) => ({
  StaffAppraisalmodels,
  loading: loading.models.StaffAppraisalmodels,
}))
class app extends Component {
  constructor(props) {
    super(props);
    this.state = {
      StaffDepartment: [], //部门
      form: '',
      dataSource: [], //列表数据
      page: 1,
      pageSize: 10,
      OnlineX:[], //在线率X轴数据
      OnlineY:[], //在线率Y轴数据
      sTime:'',
      eTime:'',
      onlineRadioDesp:'',
      totalPeople:'',
    };
  }

  //获取部门
  getStaffDepartment = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'StaffAppraisalmodels/getStaffDepartment',
      payload: {},
      callback: res => {
        if (res) {
          this.setState({ StaffDepartment: res.list });
        }
      },
    });
  };

  //获取在线率统计
  getStaffOnlineList = () => {
    const { getFieldsValue } = this.props.form;
    const values = getFieldsValue();
    const { dispatch } = this.props;
    const obj = {};
    values.ids && (obj.id_S_LK = values.ids);
    values.names && (obj.name_S_LK = values.names);
    values.startTimes = moment(values.startTimes).format("YYYY-MM-DD");
    values.endTimes = moment(values.endTimes).format("YYYY-MM-DD");
    this.setState({
      sTime:values.startTimes,
      eTime:values.endTimes
    })
    dispatch({
      type: 'StaffAppraisalmodels/getStaffOnlineList',
      payload: {
        orgId:values.ids,
        date:{
          start:values.startTimes,
          end:values.endTimes,
          name:values.names !== null ? values.names : "",
        },
      },
      callback: res => {
        if (res) {
          if (res.retCode == 1) {
            let OnlineX = [];
            let OnlineY = [];
            res.data.data.map(item => (
              OnlineX.push(item.key),
              OnlineY.push(parseFloat(item.value))
            ))
            this.setState({
              OnlineX:OnlineX,
              OnlineY:OnlineY,
              onlineRadioDesp:res.data.onlineRadioDesp,
              totalPeople:res.data.totalPeople,
            })
            this.chart();

          } else {
            message.error('获取数据失败');
          }
        }
      },
    });
  }
  //查询
  query = () => {
    this.setState({ dataSource:'' });
    const { getFieldsValue } = this.props.form;
    const values = getFieldsValue();
    const { dispatch } = this.props;
    const obj = {};
    values.id && (obj.id_S_LK = values.id);
    values.name && (obj.name_S_LK = values.name);
    values.startTime = moment(values.startTime).format("YYYY-MM-DD");
    values.endTime = moment(values.endTime).format("YYYY-MM-DD");
    console.log('Received values of form: ', values);
    dispatch({
      type: 'StaffAppraisalmodels/getStaffList',
      payload: {
        page: 1,
        pageSize: this.state.pageSize,
        orgId:values.id,
        date:{
          start:values.startTime,
          end:values.endTime,
          name:values.name !== null ? values.name : "",
        },
      },
      callback: res => {
        if (res) {
          if (res.retCode == 1) {
            const dataSource = [
              {
                key: '1',
                name:this.state.dataSource !== undefined ? res.list[0].name : '',
                onlineEveryDay:this.state.dataSource !== undefined ? (res.list[0].onlineEveryDay == true ? '是' :'否') : '' ,
                onlineDays:this.state.dataSource !== undefined ? res.list[0].onlineDays:'',
                punctualOnlineDays:this.state.dataSource !== undefined ? res.list[0].punctualOnlineDays:'',
                onlineRadioDesp:this.state.dataSource !== undefined ? res.list[0].onlineRadioDesp:'',
              },
            ];
            this,this.setState({
              dataSource:dataSource
            })
          } else {
            message.error('获取数据失败');
          }
        }
      },
    });
  }

  // 清空查询条件
  reset = () => {
    this.props.form.resetFields();
    this.getStaffDepartment();
  }

  chart = () =>{
    var myChart = echarts.init(document.getElementById('box1'));
    console.log(myChart);
    var option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#283b56'
          }
        }
      },
      xAxis: {
        // data: ["2018-07-09", "2018-07-10", "2018-07-11", "2018-07-12", "2018-07-13", "2018-07-14", "2018-07-15"]
        data: this.state.OnlineX
      },
      yAxis: {
        type: 'value',
        axisLabel:{formatter:'{value}%'},
        scale: true,
        name: '百分比',
        max: 100,
        min: 0,
      },
      series: [{
        name: 'app在线率',
        type: 'line',
        // data: [String(Math.round(Math.random() * 100)), Math.round(Math.random() * 100), Math.round(Math.random() * 100), Math.round(Math.random() * 100), Math.round(Math.random() * 100), Math.round(Math.random() * 100), Math.round(Math.random() * 100)]
        data: this.state.OnlineY
      }]
    };

    // // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
  }
  componentDidMount() {
    this.chart();
    this.getStaffDepartment();
  }

  render() {
    const { printDeparment } = this.props
    const { getFieldDecorator } = this.props.form;
    const columns = [
      {
        title: '队员姓名',
        dataIndex: 'name',
      },
      {
        title: '每天是否在线',
        dataIndex: 'onlineEveryDay',
      },
      {
        title: '在线天数',
        dataIndex: 'onlineDays',
      },
      {
        title: '准时在线天数',
        dataIndex: 'punctualOnlineDays',
      },
      {
        title: 'App在线率',
        dataIndex: 'onlineRadioDesp',
      },
    ];

    return (
      <div>
        <Form>
          <Row>
            <Col span={24}>
              <Col span={6}>
                <FormItem label="部门" labelCol={{ span: 5 }} wrapperCol={{ span: 16 }}>
                  {getFieldDecorator('ids')(
                    <Select placeholder="请选择">
                      {this.state.StaffDepartment &&
                        this.state.StaffDepartment.map(item => (
                          <Option value={item.id} key={item.id}>
                            {item.orgName}
                          </Option>
                        ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label="队员姓名" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
                  {getFieldDecorator('names')(
                    <Input />
                  )}
                </FormItem>
              </Col>
              <Col span={5}>
                <FormItem label="统计时间" labelCol={{ span: 7 }} wrapperCol={{ span: 17 }}>
                  {getFieldDecorator('startTimes')(
                    <DatePicker
                      placeholder="请选择"
                      allowClear
                      format="YYYY/MM/DD"
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={5}>
                <FormItem label="至" labelCol={{ span: 4 }} wrapperCol={{ span: 17 }}>
                  {getFieldDecorator('endTimes')(
                    <DatePicker
                      placeholder="请选择"
                      allowClear
                      format="YYYY/MM/DD"
                    />
                  )}
                </FormItem>
              </Col>
            </Col>
            <Col span={24} style={{ paddingBottom: 18 }}>
              <Col span={16} />
              <Col span={8}>
                <Button onClick={this.getStaffOnlineList}>查询</Button>
                <Button style={{ textAlign: "center", width: "38%", marginLeft: 18 }}  onClick={this.reset}>清空查询条件</Button>
              </Col>
            </Col>
          </Row>
        </Form>
        <div style={{ border: "1px solid black", marginBottom: 28 }}>
          <h4 style={{ padding: "10px 0", borderBottom: "1px solid black", margin: 0, position: "relative" }}>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{this.state.sTime} 至 {this.state.eTime} 尧化社区巡查队员共{this.state.totalPeople}人，App总在线率 {this.state.onlineRadioDesp}。
            <Button
            style={{ width: 90, height: 28, position: "absolute", top: 7, right: 22, color: "#1890FF", border: "1px solid #000", borderRadius: 5, textAlign: "center", lineHeight: "28px" }}
            onClick={printDeparment}
            >打印</Button>
          </h4>
          <div id="box1" style={{ height: 460, width: "100%" }}>
          </div>
        </div>
        <Form>
          <Row>
            <Col span={24}>
              <Col span={6}>
                <FormItem label="部门" labelCol={{ span: 5 }} wrapperCol={{ span: 16 }}>
                  {getFieldDecorator('id')(
                    <Select placeholder="请选择">
                      {this.state.StaffDepartment &&
                        this.state.StaffDepartment.map(item => (
                          <Option value={item.id} key={item.id}>
                            {item.orgName}
                          </Option>
                        ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label="队员姓名" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
                  {getFieldDecorator('name')(
                    <Input />
                  )}
                </FormItem>
              </Col>
              <Col span={5}>
                <FormItem label="统计时间" labelCol={{ span: 7 }} wrapperCol={{ span: 17 }}>
                  {getFieldDecorator('startTime')(
                    <DatePicker
                      placeholder="请选择"
                      allowClear
                      format="YYYY/MM/DD"
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={5}>
                <FormItem label="至" labelCol={{ span: 4 }} wrapperCol={{ span: 17 }}>
                  {getFieldDecorator('endTime')(
                    <DatePicker
                      placeholder="请选择"
                      allowClear
                      format="YYYY/MM/DD"
                    />
                  )}
                </FormItem>
              </Col>
            </Col>
            <Col span={24} style={{ paddingBottom: 18 }}>
              <Col span={16} />
              <Col span={8}>
                <Button onClick={this.query}>查询</Button>
                <Button style={{ textAlign: "center", width: "38%", marginLeft: 18 }} onClick={this.reset}>清空查询条件</Button>
              </Col>
            </Col>
          </Row>
        </Form>
        <Table
          dataSource={this.state.dataSource}
          columns={columns}
        >
        </Table>
      </div>
    )
  }
}

const AssessmentOrder = Form.create()(app);
export default AssessmentOrder;