import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import Link from 'umi/link';
import { Row, Col, Form, Input, Select, Button, DatePicker,Table, Radio } from 'antd';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const RadioGroup = Radio.Group;
@connect(({ }) => ({
}))
@Form.create()
class Workplace extends PureComponent {
  state = {
    formValues: {},
    pageNum: 1,
    pageSize: 10,
    selectedRowKeys: [],
    value: 1,
  };
  start=()=>{
    this.setState({
      selectedRowKeys:[],
    })
  }
  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  };
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chart/clear',
    });
  };
  onChange = (e) => {
    console.log('radio checked', e.target.value);
    this.setState({
      value: e.target.value,
    });
  };
  //分页
  handleTableChange=(page,size)=>{
    this.setState({
      pageNum:page,
      pageSize:size,
    })
    this.props.dispatch({
      // type:'enterprise/basicList',
      payload:Object.assign({pageNum:page,pageSize:size},this.state.formValues)
    })
  };
  //查询
  handleSearch=(e)=>{
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if(values.establishedTime){
        values.establishedTime=moment(values.establishedTime).format('YYYY-MM-DD')
      }
      if(values.createDate){
        values.createDate=moment(values.createDate).format('YYYY-MM-DD')
      }
      // this.props.dispatch({
      //   // type:'enterprise/basicList',
      //   payload:Object.assign({pageNum:1,pageSize:10},values)
      // })
      this.setState({
        pageNum:1,
        pageSize:10,
        formValues:values,
      })
    });
  };
  //重置
  handleReset = () =>{
    this.props.form.resetFields();
    // this.props.dispatch({
    //   type:'enterprise/basicList',
    //   payload:{pageNum:1,pageSize:10}
    // })
    this.setState({
      pageNum:1,
      pageSize:10,
      formValues:{},
    })
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const { selectedRowKeys, pageNum, pageSize } = this.state;
    const that = this;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const columns = [
      {
        title: '片区',
        dataIndex: 'name',
      },
      {
        title: '市级工单',
        dataIndex: 'age',
      },
      {
        title: '区级工单',
        dataIndex: 'address',
        children:[
          {
            title: '城管工单',
            dataIndex: 'streets',
            key: 'streets',
          },
          {
            title: '综合执法工单',
            dataIndex: 'buildings',
            key: 'buildings',
          }
        ]
      },
      {
        title: '街道工单',
        dataIndex: 'statu',
        children:[
          {
            title: '城管工单',
            dataIndex: 'street',
            key: 'street',
          },
          {
            title: '综合执法工单',
            dataIndex: 'building',
            key: 'building',
          }
        ]
      },
      {
        title: '今日工单总量',
        dataIndex: 'time',
      },
      {
        title: '今日应处理工单',
        dataIndex: 'stree',
      },
      {
        title: '今日已处理工单',
        dataIndex: 'Community',
      },
      {
        title: '明日计划量',
        dataIndex: 'report',
      }
    ];
    const data = [
      {
        key: '1',
        name: '尧化社区',
        age: '50',
        address: '50',
        sign:'a'
      },
      {
        key: '2',
        name: '尧化社区',
        age: '50',
        address: '50',
        sign:'b'
      },
      {
        key: '3',
        name: '尧化社区',
        age: '50',
        address: '50',
        sign:'c'
      },
      {
        key: '4',
        name: '尧化社区',
        age: '50',
        address: '50',
        sign:'d'
      },
      {
        key: '5',
        name: '尧化社区',
        age: '50',
        address: '50',
        sign:'e'
      }
      ,
      {
        key: '6',
        name: '尧化社区',
        age: '50',
        address: '50',
        sign:'f'
      }
    ];
    return (
      <div>
        <h3 id="listTitle">定时生成</h3>
        <div id="tableForm">
          <Form onSubmit={this.handleSearch} layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={6} sm={8}>
                <FormItem label="创建时间">
                  {getFieldDecorator('number')(
                    <DatePicker placeholder="请输入创建时间" style={{width:'100%'}} />
                  )}
                </FormItem>
              </Col>
              <Col md={6} sm={8}>
                <div id="listOperator" style={{ padding: '4px 0' }}>
                  <Button type="primary">前一天</Button>
                  <Button type="primary">后一天</Button>
                </div>
              </Col>
              <Col md={12} sm={8} style={{ textAlign: 'right',padding: '4px 0' }}>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button style={{ marginRight:0, marginLeft:16 }} onClick={this.handleFormReset}>
                  重置
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
        <div id="listTableStatistics">
          <Table
            columns={columns}
            dataSource={data}
            pagination={{
              current: pageNum,
              pageSize,
              onShowSizeChange(current,pageSize) {
                that.handleTableChange(current, pageSize);
              },
              onChange(current,pageSize){
                that.handleTableChange(current, pageSize);
              },
              size: 'small',
              showSizeChanger: true,
              showQuickJumper: true,
              pageSizeOptions: ['10','15','20'],
            }} />
        </div>
      </div>
    );
  }
}

export default Workplace;
