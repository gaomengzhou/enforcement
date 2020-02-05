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

const FormItem = Form.Item;
const Option = Select.Option;


class app extends Component {
  componentDidMount() {
    var myChart = echarts.init(document.getElementById('box2'));
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
        data: ["2018-07-09", "2018-07-10", "2018-07-11", "2018-07-12", "2018-07-13", "2018-07-14", "2018-07-15"]
      },
      yAxis: {
        type: 'value',
        scale: true,
        name: '趋势图',
        max: 2500,
        min: 0,
      },
      series: [{
        name: '完成工单数',
        type: 'line',
        data: [Math.round(Math.random() * 2500), Math.round(Math.random() * 2500), Math.round(Math.random() * 2500), Math.round(Math.random() * 2500), Math.round(Math.random() * 2500), Math.round(Math.random() * 2500), Math.round(Math.random() * 2500)]
      }]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
  }

  render() {
    const { printDeparment } = this.props
    const { getFieldDecorator } = this.props.form;
    const dataSource = [
      {
        key: '1',
        name: '1',
        loging: "2",
        day: '3',
        days: "4",
        app: "5",
      },
    ];
    const columns = [
      {
        title: '队员姓名',
        dataIndex: 'name',
      },
      {
        title: '每天是否在线',
        dataIndex: 'loging',
      },
      {
        title: '在线天数',
        dataIndex: 'day',
      },
      {
        title: '准时在线天数',
        dataIndex: 'days',
      },
      {
        title: 'App在线率',
        dataIndex: 'app',
      },
    ];
    var listNum = [
      { text: "累计待处理工单", num: 200 },
      { text: "累计已处理工单", num: 20000 },
      { text: "累计已结案工单", num: 8000 },
      { text: "累计已废案工单", num: 1200 },
      { text: "近7天新增工单（增加）", num: "+1600" },
      { text: "近7天结案工单（减少）", num: "-300" },
    ]
    // var box = getElementById()
    return (
      <div>
        <Form>
          <Row>
            <Col span={24}>
              <Col span={6}>
                <FormItem label="部门" labelCol={{ span: 5 }} wrapperCol={{ span: 16 }}>
                  {getFieldDecorator('a1')(
                    <Select placeholder="请选择">
                      <Option value="1">1</Option>
                      <Option value="2">2</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label="队员姓名" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
                  {getFieldDecorator('a2')(
                    <Input />
                  )}
                </FormItem>
              </Col>
              <Col span={5}>
                <FormItem label="统计时间" labelCol={{ span: 7 }} wrapperCol={{ span: 17 }}>
                  {getFieldDecorator('a3')(
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
                  {getFieldDecorator('a4')(
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
                <Button >查询</Button>
                <Button style={{ textAlign: "center", width: "38%", marginLeft: 18 }}>清空查询条件</Button>
              </Col>
            </Col>
          </Row>
        </Form>
        <div style={{ border: "1px solid black", height: "200px", width: "100%", marginBottom: "28px" }} >
          <h3>&nbsp;&nbsp;&nbsp;关键指标（本页数据根据实时数据计算。）</h3>
          <div style={{ border: "1px solid black", height: 1, width: "100%" }}></div>
          <Row style={{ padding: "32px 0" }}>
            <Col span={24} style={{ height: "100%" }}>
              {listNum && listNum.map(item => (
                <Col span={4} style={{ height: "100%", borderRight: "1px solid black" }} last-child={{ borderRight: "0 solid black" }}>
                  <Col style={{ textAlign: "center", padding: "10px 0", fontSize: 16 }}>{item.text}</Col>
                  <Col style={{ textAlign: "center", padding: "6px 0", fontSize: 32 }}>{item.num}</Col>
                </Col>
              ))}
            </Col>
          </Row>
        </div>
        <div style={{ border: "1px solid black", marginBottom: 28 }}>
          <h4 style={{ padding: "10px 0", borderBottom: "1px solid black", margin: 0, position: "relative" }}>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**** 至 **** 尧化社区巡查队员共n1人，共处理n2笔工单。
            <Button
              style={{ width: 90, height: 28, position: "absolute", top: 7, right: 22, color: "#1890FF", border: "1px solid #000", borderRadius: 5, textAlign: "center", lineHeight: "28px" }}
              onClick={printDeparment}
            >打印</Button>
          </h4>
          <div id="box2" style={{ height: 460, width: "100%" }}>
          </div>
        </div>
        <Table
          dataSource={dataSource}
          columns={columns}
        >

        </Table>
      </div>
    )
  }
}

const OnlineRate = Form.create()(app);
export default OnlineRate;