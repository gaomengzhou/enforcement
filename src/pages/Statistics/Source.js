/* eslint-disable react/jsx-no-bind */
/* eslint-disable class-methods-use-this */
/* eslint-disable eqeqeq */
/* eslint-disable no-param-reassign */
/* eslint-disable react/sort-comp */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-use-before-define */
/* eslint-disable func-names */
/* eslint-disable no-plusplus */
/* eslint-disable react/no-unused-state */
/* eslint-disable import/no-extraneous-dependencies */
import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import echarts from 'echarts';
import { Row, Col, Form, Select, Button, DatePicker, Table, Modal, Breadcrumb } from 'antd';
import range from './range';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
@connect(({ source, select }) => ({
  source, select
}))
@Form.create()
class Workplace extends PureComponent {
  state = {
    range: range(7),
    formValues: {},
    pageNum: 1,
    pageSize: 10,
    value: 1,
    sourceChart: [],
    datasCharts: [],
    visibleExcel: false,
    startTime: moment().subtract('days', 7).format('YYYY-MM-DD'),
    endTime: moment().format().substring(0, 10),
    ownCommunity: '',
  };

  componentDidMount() {
    // 社区
    this.props.dispatch({
      type: 'select/community',
    });
    new Promise(resolve => {
      this.props.dispatch({
        type: 'source/sourceChartFetch',
        payload: {
          resolve,
          startTime: this.state.startTime,
          endTime: this.state.endTime,
        },
      })
    }).then((res) => {
      if (res) {
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].id = i + 1
        };
        const datasCharts = res.data.map(item => {
          return {
            value: item.orderRatioNum,
            name: item.orderSource
          }
        })
        this.setState({
          sourceChart: res.data,
          datasCharts,
        });
      }
    });
  }

  componentDidUpdate() {
    // 多图表自适应
    window.addEventListener("resize", function () {
      source.resize();
    });
    const source = echarts.init(document.getElementById('source'));
    source.setOption({
      title: {
        text: '工单来源分析',
        x: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: {
        selectedMode: false,// 禁止点击
        orient: 'vertical',
        right: '6%',
        top: '5%',
        data: this.state.sourceChart ? (this.state.sourceChart.orderSource ? this.state.sourceChart.orderSource : '') : '',
      },
      series: [
        {
          name: '工单来源分析',
          type: 'pie',
          radius: '65%',
          center: ['50%', '50%'],
          label: {
            normal: {
              formatter: '{b}-{d}%',
              rich: {
                a: {
                  color: '#999',
                  lineHeight: 22,
                  align: 'center'
                },

              }
            }
          },
          data: this.state.datasCharts,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    })
  }
;
  // 查询
  handleSearch() {
    this.props.form.validateFields((err, values) => {
      if (values.time) {
        values.startTime = moment(values.time[0]).format('YYYY-MM-DD')
      }
      if (values.time) {
        values.endTime = moment(values.time[1]).format('YYYY-MM-DD')
      }
      new Promise(resolve => {
        this.props.dispatch({
          type: 'source/sourceChartFetch',
          payload: {
            resolve,
            community: this.state.ownCommunity != '' ? this.state.ownCommunity : null,
            startTime: this.state.startTime,
            endTime: this.state.endTime,
          },
        })
      }).then((res) => {
        if (res) {
          const datasCharts = res.data.map(item => {
            return {
              value: item.orderRatioNum,
              name: item.orderSource
            }
          })
          this.setState({
            sourceChart: res.data,
            datasCharts,
          });
        };
      });
    });
  }
;
  // 重置
  handleReset() {
    this.props.form.resetFields();
    new Promise(resolve => {
      this.props.dispatch({
        type: 'source/sourceChartFetch',
        payload: {
          resolve,
          startTime: moment().subtract('days', 7).format('YYYY-MM-DD'),
          endTime: moment().format().substring(0, 10),
        },
      })
    }).then((res) => {
      if (res) {
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].id = i + 1
        };
        const datasCharts = res.data.map(item => {
          return {
            value: item.orderRatioNum,
            name: item.orderSource
          }
        })
        this.setState({
          sourceChart: res.data,
          datasCharts,
        });
      }
    });
  }
;
  onChangeDate(date) {
    this.setState({
      startTime: moment(date[0]).format('YYYY-MM-DD'),
      endTime: moment(date[1]).format('YYYY-MM-DD'),
    })
  }

  onChangeCommunity(val) {
    if (+val < 10) {
      val = `0${  val}`
    }
    this.setState({
      ownCommunity: val,
    })
  }

  // 导出表格
  downExcel() {
    this.setState({
      visibleExcel: true,
    });
  }

  handleExcelOk() {

    this.props.dispatch({
      type: 'source/downloadExcelFetch',
      payload: {
        startT: this.state.startTime,
        endT: this.state.endTime,
        community: this.state.ownCommunity == '' ? null : this.state.ownCommunity,
      }
    })
    this.setState({
      visibleExcel: false,
      ownCommunity: '',
      startTime: '',
      endTime: '',
    });
  }

  handleExcelCancel() {
    this.setState({
      visibleExcel: false,
    });
  }

  // 打印
  print() {
    window.print();
  }

  // disabledDate = current => current && current < moment().endOf('day');
  disabledDepDate = current => current && current > moment().endOf('day') || current < moment().subtract(this.state.dayDepDisabled + 1, 'day');

  render() {
    const { getFieldDecorator } = this.props.form;
    const { select } = this.props;
    const { communityList } = select;
    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
      },
      {
        title: '工单来源',
        dataIndex: 'orderSource',
      },
      {
        title: '工单占比',
        dataIndex: 'orderRatio',
      },
      {
        title: '废案数',
        dataIndex: 'wasteCase',
      },
      {
        title: '结案数',
        dataIndex: 'closeCase',
      },
    ];
    return (
      <div id="listTitleContent">
        <Breadcrumb separator=">">
          <span id="breadcrumbIcon" />
          <Breadcrumb.Item>统计分析</Breadcrumb.Item>
          <Breadcrumb.Item>来源分析</Breadcrumb.Item>
        </Breadcrumb>
        <div id="tableForm">
          <h3 id="listTitle" style={{ paddingBottom: 0 }}>来源分析</h3>
        </div>
        <div id="listTitleDetailTabAnimate" style={{ background: '#fff', marginTop: 20, padding: '0 20px',boxShadow:'0 2px 6px 0 rgba(0, 0, 0, 0.3)',marginBottom:'5%' }}>
          <div id="tableListForm" className="noPrint" style={{ padding: '20px 20px 20px 40px', borderBottom: '1px solid #DCDCDC' }}>
            <Form layout="inline">
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={8} sm={8}>
                  <FormItem label="起止时间">
                    {getFieldDecorator('time', {
                      initialValue: this.state.range || "",
                    })(
                      <RangePicker placeholder={["开始时间", "结束时间"]} style={{ width: '100%' }} disabledDate={this.disabledDate} onChange={this.onChangeDate.bind(this)} />
                    )}
                  </FormItem>
                </Col>
                <Col md={8} sm={8}>
                  <FormItem label="社区">
                    {getFieldDecorator('ownCommunity')(
                      <Select placeholder="请选择" allowClear onChange={this.onChangeCommunity.bind(this)}>
                        {
                          communityList ?
                            (communityList.map((val) => (
                              <Select.Option key={val.id} value={val.code}>{val.desp}</Select.Option>
                            ))) : ''
                        }
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col md={8} sm={8} style={{ textAlign: 'right' }}>
                  <Button type="primary" onClick={this.handleSearch.bind(this)}>
                    查询
                  </Button>
                  <Button id="buttonReset" style={{ marginRight: 0, marginLeft: 16 }} onClick={this.handleReset.bind(this)}>
                    重置
                  </Button>
                </Col>
              </Row>
            </Form>
          </div>
          <div id="source" style={{ width: '100%', height: 500, paddingTop: 20 }} className="noPrint" />
          <div id="listOperator" style={{ textAlign: 'right', padding: '30px 16px 10px 30px' }} className="noPrint">
            <Button type="primary" onClick={this.downExcel.bind(this)}>导出表格</Button>
            <Button id="buttonReset" onClick={this.print.bind(this)}>打印</Button>
          </div>
          <div id="listTable" style={{ padding: '0 30px', boxShadow: '0 2px 6px 0 transparent' }}>
            <Table
              columns={columns}
              dataSource={this.state.sourceChart}
              pagination={false}
            />
          </div>
        </div>
        <Modal
          title="导出excel表格"
          visible={this.state.visibleExcel}
          onOk={this.handleExcelOk.bind(this)}
          onCancel={this.handleExcelCancel.bind(this)}
        >
          <p>请确定是否导出表格.</p>
        </Modal>
      </div>
    );
  }
}

export default Workplace;
