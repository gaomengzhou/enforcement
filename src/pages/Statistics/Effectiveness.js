/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/sort-comp */
/* eslint-disable no-unused-vars */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Select, Button, DatePicker, Breadcrumb, Modal } from 'antd';
import moment from 'moment';
import styles from './Effectiveness.less';
import range from './range';

const echarts = require('echarts');

const { RangePicker } = DatePicker;

@connect(({ effectivenes, numEchats, select }) => ({
    effectivenes, numEchats, select
}))
@Form.create()
class Effectiveness extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            startTime: moment().subtract('days', 7).format('YYYY-MM-DD'),
            endTime: moment().format().substring(0, 10),
            startTime2: moment().subtract('days', 7).format('YYYY-MM-DD'),
            endTime2: moment().format().substring(0, 10),
            Community: '2',
            range: range(7),
            eight: 500,
            eightCity: 500,
            eightLess: 400,
            eightLessCity: 400,
            fortyEight: 300,
            fortyEightCity: 300,
            outTime: 200,
            outTimeCity: 200,
            twentyFour: 100,
            twentyFourCity: 100,
            visibleExcel: false,
        }
    }

    handleDepDateChange = (dayDep) => {
        const start = moment(dayDep[0]).format('YYYY-MM-DD');
        const end = moment(dayDep[1]).format('YYYY-MM-DD');

        this.setState({
            startTime: start,
            endTime: end,
        });

    };

    handleDepDateChange2 = (dayDep) => {
        const start = moment(dayDep[0]).format('YYYY-MM-DD');
        const end = moment(dayDep[1]).format('YYYY-MM-DD');

        this.setState({
            startTime2: start,
            endTime2: end,
        });
    };

    onChange = (value) => {
        this.setState({
            Community: value
        })
    }

    onCheck = () => {
        this.props.dispatch({
            type: 'effectivenes/quantityOfWorkOrderProcessing',
            payload: {
                startTime: this.state.startTime,
                endTime: this.state.endTime,
                performanceChose: this.state.Community
            }
        })
    }

    onCheck2 = () => {
        this.props.dispatch({
            type: 'effectivenes/processingRate',
            payload: {
                startTime: this.state.startTime2,
                endTime: this.state.endTime2,
            }
        });

        new Promise(resolve => {
            this.props.dispatch({
                type: 'effectivenes/processingRateTime',
                payload: {
                    startTime: this.state.startTime2,
                    endTime: this.state.endTime2,
                    resolve
                }
            });
        }).then(res => {
            this.setState({
                eight: res.data.eight,
                eightCity: res.data.eightCity,
                eightLess: res.data.eightLess,
                eightLessCity: res.data.eightLessCity,
                fortyEight: res.data.fortyEight,
                fortyEightCity: res.data.fortyEightCity,
                outTime: res.data.outTime,
                outTimeCity: res.data.outTimeCity,
                twentyFour: res.data.twentyFour,
                twentyFourCity: res.data.twentyFourCity
            })
        });

    }

    componentDidMount() {
        // 今日新增工单
        this.props.dispatch({
            type: 'effectivenes/newWorkOrderToday',
            payload: {}
        });

        // 工单处理数量
        this.props.dispatch({
            type: 'effectivenes/quantityOfWorkOrderProcessing',
            payload: {
                startTime: this.state.startTime,
                endTime: this.state.endTime,
            }
        })

        // 工单处理速率
        this.props.dispatch({
            type: 'effectivenes/processingRate',
            payload: {
                startTime: this.state.startTime2,
                endTime: this.state.endTime2,
            }
        })

        // 处理时间情况
        new Promise(resolve => {
            this.props.dispatch({
                type: 'effectivenes/processingRateTime',
                payload: {
                    startTime: this.state.startTime2,
                    endTime: this.state.endTime2,
                    resolve
                }
            });
        }).then(res => {
            this.setState({
                eight: res.data.eight,
                eightCity: res.data.eightCity,
                eightLess: res.data.eightLess,
                eightLessCity: res.data.eightLessCity,
                fortyEight: res.data.fortyEight,
                fortyEightCity: res.data.fortyEightCity,
                outTime: res.data.outTime,
                outTimeCity: res.data.outTimeCity,
                twentyFour: res.data.twentyFour,
                twentyFourCity: res.data.twentyFourCity
            })
        });

    }

    componentDidUpdate() {
        const myChartOne = echarts.init(document.getElementById('echarsLeft'));
        const myChartTwo = echarts.init(document.getElementById('echarsRight'));
        const myChart3 = echarts.init(document.getElementById('echart3'));
        const myChart4 = echarts.init(document.getElementById('echart4'));
        const myChart5 = echarts.init(document.getElementById('echart5'));
        const { effectivenes } = this.props;
        const { orderToday, numEchats, pieRateDatas, sources } = effectivenes;
        const { columnarData, columnarDataNum, pieData } = numEchats;
        const { pieRateData } = pieRateDatas;


        // 工单处理数量左侧柱状条
        myChartOne.setOption({
            color: ['#3398DB'],
            title: {
                text: '工单处理数量'
            },
            tooltip: {},
            xAxis: [{
                data: columnarData,
                type: 'category',
                axisTick: {
                    alignWithLabel: true
                },
                axisLabel: {
                    interval: 0,  // 类目全显
                    rotate: -45   // 顺时针旋转45度
                },
            }],
            yAxis: [{
                type: 'value',
                scale: true,
                // min: 200,
                // max: 1600,
                splitNumber: 8
            }],
            series: [{
                name: '处理工单数量',
                // barWidth: '50%',
                type: 'bar',
                data: columnarDataNum,
                itemStyle: {        // 上方显示数值
                    normal: {
                        label: {
                            show: true, // 开启显示
                            position: 'top', // 在上方显示
                            textStyle: { // 数值样式
                                color: 'black',
                                fontSize: 16
                            }
                        }
                    }
                }
            }]
        });
        // 工单处理数量右侧饼状图
        myChartTwo.setOption({
            title: {
                x: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            series: [
                {
                    name: '工单处理数量',
                    type: 'pie',
                    radius: '50%',
                    center: ['50%', '50%'],
                    label: {
                        normal: {
                            formatter: '{b}-{c}',
                            rich: {
                                a: {
                                    color: '#999',
                                    lineHeight: 22,
                                    align: 'center'
                                },

                            }
                        }
                    },
                    data: pieData,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        });
        // 工单处理速率左侧饼状图
        myChart3.setOption({
            title: {
                x: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            grid: { containLabel: true },
            series: [
                {
                    name: '工单处理数量',
                    type: 'pie',
                    radius: '40%',
                    center: ['50%', '50%'],
                    label: {
                        normal: {
                            formatter: '{b}-{c} ',
                            rich: {
                                a: {
                                    color: '#999',
                                    lineHeight: 22,
                                    align: 'center'
                                },

                            }
                        }
                    },
                    data: pieRateData,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        });

        myChart4.setOption({
            title: {
                text: '市工单处理时间情况',
                x: 'center'
            },
            dataset: {
                source: [
                    ['score', 'amount', 'product'],
                    [10, this.state.eightLessCity, '8小时以下'],
                    [20, this.state.eightCity, '8-24小时'],
                    [5, this.state.twentyFourCity, '24-48小时'],
                    [8, this.state.fortyEightCity, '48小时以上'],
                    [40, this.state.outTimeCity, '超过时限'],
                ]
            },
            grid: { containLabel: true },
            xAxis: {
                show: true,
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#000'
                    }
                },
                // min: 0,
                // max: 1000
            },
            yAxis: { type: 'category' },
            visualMap: {
                orient: 'horizontal',
                left: 'center',
                min: 8,
                max: 50,
                text: ['高', '低'],
                // Map the score column to color
                dimension: 0,
                inRange: {
                    color: ['#D7DA8B', '#E15457']
                }
            },
            label: {
                show: true, // 开启显示
                position: 'right', // 在右方显示
                textStyle: { // 数值样式
                    color: 'aqua',
                    fontSize: 20
                }
            },
            series: [
                {

                    type: 'bar',
                    encode: {
                        // Map the "amount" column to X axis.
                        x: 'amount',
                        // Map the "product" column to Y axis
                        y: 'product'
                    }
                }
            ]
        });

        myChart5.setOption({
            title: {
                text: '全部工单处理时间情况',
                x: 'center'
            },
            dataset: {
                source: [
                    ['score', 'amount', 'product'],
                    [10, this.state.eightLess, '8小时以下'],
                    [20, this.state.eight, '8-24小时'],
                    [5, this.state.twentyFour, '24-48小时'],
                    [8, this.state.fortyEight, '48小时以上'],
                    [40, this.state.outTime, '超过时限'],
                ]
            },
            grid: { containLabel: true },
            xAxis: {
                show: true,
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#000'
                    }
                },
                // min: 0,
                // max: 1000
            },
            yAxis: { type: 'category' },
            visualMap: {
                orient: 'horizontal',
                left: 'center',
                min: 8,
                max: 50,
                text: ['高', '低'],
                // Map the score column to color
                dimension: 0,
                inRange: {
                    color: ['#D7DA8B', '#E15457']
                }
            },
            label: {
                show: true, // 开启显示
                position: 'right', // 在右方显示
                textStyle: { // 数值样式
                    color: 'aqua',
                    fontSize: 20
                }
            },
            series: [
                {
                    type: 'bar',
                    encode: {
                        // Map the "amount" column to X axis.
                        x: 'amount',
                        // Map the "product" column to Y axis
                        y: 'product'
                    }
                }
            ]
        });

    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                // eslint-disable-next-line no-console
                console.log('Received values of form: ', values);
            }
        });
    };

    exportData = () => {
        this.setState({
            visibleExcel: true,
        });
    }

    handleExcelOk = () => {
        this.props.dispatch({
            type: 'source/exprotData',
            payload: {}
        });
        this.setState({
            visibleExcel: false,
        });
    }

    handleExcelCancel() {
        this.setState({
            visibleExcel: false,
        });
    }

    render() {
        const { Option } = Select;
        const { effectivenes } = this.props;
        const { orderToday, numEchats } = effectivenes;
        const { orderStatistics, sectoralStatistics } = orderToday;
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { select } = this.props
        const { communityList } = select
        const that = this

        return (
          <div id="listTitleContent">
            <Breadcrumb separator=">">
              <span id="breadcrumbIcon" />
              <Breadcrumb.Item>统计分析</Breadcrumb.Item>
              <Breadcrumb.Item>成效分析</Breadcrumb.Item>
            </Breadcrumb>
            <div id="tableForm">
              <h3 id="listTitle" style={{ paddingBottom: 0 }}>成效分析</h3>
            </div>
            <div id='listTitleDetailTab'>
              <div className={styles.newWorkOrderToday}>
                <h6 className={styles.titleH6}>今日新增工单</h6>
                <div style={{ width: '100%', height: 250, paddingLeft: '10%', paddingTop: '2%' }}>
                  {
                    sectoralStatistics ? (sectoralStatistics.map(item => (
                      <p key={item.departType} style={{ fontSize: 20, float: 'left', width: '25%', fontWeight: 'bold' }}>{item.departType}:<span>{item.departNum}</span></p>
                    ))) : []
                 }
                </div>
                {
                    orderStatistics ? (orderStatistics.map(val => (
                      <div key={val.departType} className={styles.workOrderBorder}>
                        <div>
                          <h5>{val.orderNum}</h5>
                          <span>{val.departType}</span>
                        </div>
                      </div>
                    ))) : []
                }
                <Button style={{ marginLeft: '90%', marginBottom: '1%' }} type="primary" onClick={this.exportData}>导出</Button>
              </div>
              <Modal
                title="导出excel表格"
                visible={this.state.visibleExcel}
                onOk={this.handleExcelOk.bind(this)}
                onCancel={this.handleExcelCancel.bind(this)}
              >
                <p>请确定是否导出表格.</p>
              </Modal>
              <div className={styles.newWorkOrderToday}>
                <h6 className={styles.titleH6}>工单处理数量</h6>
                <div className={styles.numBorder}>
                  <Form onSubmit={this.handleSubmit}>
                    <Row>
                      <Col span={6}>
                        <span style={{ marginLeft: '2%' }}>部门选择: </span>
                        <Select
                          defaultValue="2"
                          showSearch
                          style={{ width: '50%' }}
                          placeholder="选择社区"
                          optionFilterProp="children"
                          onChange={this.onChange}
                          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                          <Option value='2'>社区</Option>
                          <Option value='1'>科室</Option>
                        </Select>
                      </Col>
                      <Col span={10}>
                        <Form.Item>
                          <span style={{ marginLeft: '5%' }}>时间区间: </span>
                          {getFieldDecorator('timer', {
                                initialValue: this.state.range || "",
                            })(
                              <RangePicker style={{ display: 'inlineBlock' }} onChange={this.handleDepDateChange} />
                            )}
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Button type="primary" onClick={this.onCheck} style={{ marginLeft: '18%' }}>查询</Button>
                      </Col>
                    </Row>
                  </Form>
                </div>
                <div id="echarsLeft" style={{ height: 500, width: '60%', display: 'inline-block' }} />
                <div id="echarsRight" style={{ height: 500, width: '40%', display: 'inline-block' }} />
              </div>
              <div className={styles.newWorkOrderToday} style={{ marginBottom: '5%' }}>
                <h6 className={styles.titleH6}>工单处理效率</h6>
                <div className={styles.numBorder}>
                  <Form.Item>
                    <span style={{ marginLeft: '5%' }}>时间区间: </span>
                    {getFieldDecorator('timer2', {
                        initialValue: this.state.range || "",
                    })(
                      <RangePicker style={{ display: 'inlineBlock' }} onChange={this.handleDepDateChange2} />
                    )}
                    <Button onClick={this.onCheck2} type="primary" style={{ marginLeft: '42.4%' }}>查询</Button>
                  </Form.Item>
                </div>
                <div>
                  <div id="echart3" style={{ display: 'inline-block', height: 500, width: '33.333%' }} />
                  <div id="echart4" style={{ display: 'inline-block', height: 500, width: '33.333%' }} />
                  <div id="echart5" style={{ display: 'inline-block', height: 500, width: '33.333%' }} />
                </div>
              </div>
            </div>
          </div>
        )
    }
}
export default Effectiveness;
