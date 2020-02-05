/* eslint-disable no-shadow */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-param-reassign */
/* eslint-disable react/sort-comp */
/* eslint-disable no-script-url */
/* eslint-disable react/no-unused-state */
/* eslint-disable no-plusplus */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import Link from 'umi/link';
import { Row, Col, Form, Input, Select, Button, DatePicker,Table, Radio,Tabs,Modal, InputNumber, Popconfirm } from 'antd';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const RadioGroup = Radio.Group;
const {TabPane} = Tabs;
const {Option} = Select;
// 投诉
const complainData = [];
for (let i = 0; i < 12; i++) {
  complainData.push({
    key: i.toString(),
    name: `城建城管-房产部门-物业管理-物业管理-（小区）小区内群租房问题`,
    age: 1,
    address: 20,
  });
}
// 城管
const inspectorData = [];
for (let i = 0; i < 12; i++) {
  inspectorData.push({
    key: i.toString(),
    name: `城建城管-房产部门-物业管理-物业管理-（小区）小区内群租房问题`,
    age: 1,
    address: 20,
  });
}
// 综合执法
const comprehensiveData = [];
for (let i = 0; i < 12; i++) {
  comprehensiveData.push({
    key: i.toString(),
    name: `城建城管-房产部门-物业管理-物业管理-（小区）小区内群租房问题`,
    age: 1,
    address: 20,
  });
}
const EditableContext = React.createContext();
const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  getInput = () => {
    if (this.props.inputType === 'number') {
      return (
        <Select style={{ width: 120 }}>
          <Option value={1}>天</Option>
          <Option value={2}>周</Option>
          <Option value={3}>月</Option>
        </Select>
      );
    }
    return <Input />;
  };

  render() {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      ...restProps
    } = this.props;
    return (
      <EditableContext.Consumer>
        {(form) => {
          const { getFieldDecorator } = form;
          return (
            <td {...restProps}>
              {editing ? (
                <FormItem style={{ margin: 0 }}>
                  {getFieldDecorator(dataIndex, {
                    rules: [{
                      required: true,
                      message: `Please Input ${title}!`,
                    }],
                    initialValue: record[dataIndex],
                  })(this.getInput())}
                </FormItem>
              ) : restProps.children}
            </td>
          );
        }}
      </EditableContext.Consumer>
    );
  }
}
@connect(({select,timing,inspectors }) => ({
  select,timing,inspectors
}))
@Form.create()
class Workplace extends PureComponent {
  state = {
    formValues: {},
    pageNum: 1,
    pageSize: 10,
    selectedRowKeys: [],
    value: 1,
    visible: false,
    listbigAllClass:[],// 查询列表 所有案件大类
    listSmallAllClass:[],// 查询列表 所有案件小类
    complainDataModalList:{
      list:[],
      total:0,
    },
  };

  constructor(props) {
    super(props);
    // this.state = { complainDataModalList, editingKey: '' };
    this.columns = [
      {
        title: '归口类型',
        dataIndex: 'underCentralizedType',
        editable: false,
      },
      {
        title: '智能生成周期',
        dataIndex: 'buildCycle',
        editable: true,
        width:200,
      },
      {
        title: '智能生成阀值',
        dataIndex: 'buildThreshold',
        editable: true,
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) => {
          const editable = this.isEditing(record);
          return (
            <div>
              {editable ? (
                <span>
                  <EditableContext.Consumer>
                    {form => (
                      <a
                        href="''"
                        onClick={() => this.complainSave(form, record.id)}
                        style={{ marginRight: 8 }}
                      >
                        保存
                      </a>
                    )}
                  </EditableContext.Consumer>
                  <Popconfirm
                    title="Sure to cancel?"
                    onConfirm={() => this.cancel(record.id)}
                  >
                    <a>取消</a>
                  </Popconfirm>
                </span>
              ) : (
                <a onClick={() => this.edit(record.id)}>编辑</a>
              )}
            </div>
          );
        },
      },
    ];
    // 综合执法
    this.columnsComprehensive = [
      {
        title: '案件类型',
        dataIndex: 'name',
        editable: false,
      },
      {
        title: '智能生成周期',
        dataIndex: 'age',
        editable: true,
        width:200,
      },
      {
        title: '智能生成阀值',
        dataIndex: 'address',
        editable: true,
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) => {
          const editable = this.isEditing(record);
          return (
            <div>
              {editable ? (
                <span>
                  <EditableContext.Consumer>
                    {form => (
                      <a
                        href="''"
                        onClick={() => this.save(form, record.key)}
                        style={{ marginRight: 8 }}
                      >
                        保存
                      </a>
                    )}
                  </EditableContext.Consumer>
                  <Popconfirm
                    title="Sure to cancel?"
                    onConfirm={() => this.cancel(record.key)}
                  >
                    <a>取消</a>
                  </Popconfirm>
                </span>
              ) : (
                <a onClick={() => this.edit(record.key)}>编辑</a>
              )}
            </div>
          );
        },
      },
    ];
    this.state = {
      complainDataModalList:{
        list:[],
        total:0,
      },
      pageNum:1,
      pageSize:10,
    };
  }

  isEditing = record => record.key === this.state.editingKey;

  cancel = () => {
    this.setState({ editingKey: '' });
  };

  save(form, key) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...this.state.data];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        this.setState({ data: newData, editingKey: '' });
      } else {
        newData.push(row);
        this.setState({ data: newData, editingKey: '' });
      }
    });
  }

  // 投诉工单 智能生成规则
  complainSave = (row) => {
    new Promise(resolve=>{
      this.props.dispatch({
        type:'timing/editComplainDataModalFetch',
        payload:{
          resolve,
          data:row,
          pageNum:1,
          pageSize:10,
        }
      })
    }).then((res)=>{
      this.setState({
        complainDataModalList: res.data,
      });
    })

  };

  edit(key) {
    this.setState({ editingKey: key });
  }

  // 设置
  setUp = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = () => {
    this.setState({
      visible: false,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  componentDidMount(){
    // 投诉工单智能生成规则 弹框
    const {dispatch} = this.props;
    new Promise(resolve=>{
      dispatch({
        type:'timing/complainDataModalFetch',
        payload:{
          resolve,
          pageNum:1,
          pageSize:10,
        }
      })
    }).then((res)=>{
      this.setState({
        complainDataModalList:res.data,
      })
    });
    // 投诉工单定时生成规则列表
    this.props.dispatch({
      type: 'timing/complainGeneratingRuleFetch',
      payload:{
        pageNum:1,
        pageSize:10,
      }
    });
    // 城管工单定时生成规则列表
    this.props.dispatch({
      type: 'timing/inspectorsGeneratingRuleFetch',
      payload:{
        pageNum:1,
        pageSize:10,
      }
    });
    // 综合执法工单定时生成规则列表
    this.props.dispatch({
      type: 'timing/comprehensiveGeneratingRuleFetch',
      payload:{
        pageNum:1,
        pageSize:10,
      }
    });
    // 查询列表 查询所有案件大类 bigAllClassFetch
    new Promise(resolve => {
      this.props.dispatch({
        type:'inspectors/bigAllClassFetch',
        payload: {
          resolve,
        }
      })
    }).then((res) => {
      this.setState({
        listbigAllClass: res.data,
      })
    });
    // 社区
    this.props.dispatch({
      type:'select/community',
    });
    // 归口类型
    this.props.dispatch({
      type:'select/convergenceProgram',
    });
    // 案件类别
    this.props.dispatch({
      type:'select/bigClass',
    });
  }

  // 投诉工单 分页
  handleTableComplainChange=(page,size)=>{
    this.setState({
      pageNum:page,
      pageSize:size,
    });
    this.props.dispatch({
      type: 'timing/complainGeneratingRuleFetch',
      payload:Object.assign({pageNum:page,pageSize:size},this.state.formValues)
    })
  };

  // 投诉工单 查询
  handleComplain=(e)=>{
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if(values.complainCreateDate){
        values.startTime=moment(values.complainCreateDate[0]).format('YYYY-MM-DD')
      }
      if(values.complainCreateDate){
        values.endTime=moment(values.complainCreateDate[1]).format('YYYY-MM-DD')
      }
      const area = values.complainArea;
      const underCentralizedType = values.complainUnderCentralizedType;
      this.props.dispatch({
        type: 'timing/complainGeneratingRuleFetch',
        payload:{
          pageNum:1,
          pageSize:10,
          area:area || '',
          underCentralizedType:underCentralizedType || '',
          startTime:values.startTime ? values.startTime : '',
          endTime:values.endTime ? values.endTime : '',
        }
      });
      this.setState({
        pageNum:1,
        pageSize:10,
      })
    });
  };

  // 定时生成投诉工单 重置
  handleComplainReset(){
    this.props.form.resetFields();
    this.props.dispatch({
      type: 'timing/complainGeneratingRuleFetch',
      payload:{pageNum:1,pageSize:10}
    });
    this.setState({
      pageNum:1,
      pageSize:10,
      formValues:{},
    })
  }

  // 城管工单 分页
  handleTableInspectorChange=(page,size)=>{
    this.setState({
      pageNum:page,
      pageSize:size,
    });
    this.props.dispatch({
      type: 'timing/inspectorsGeneratingRuleFetch',
      payload:Object.assign({pageNum:page,pageSize:size},this.state.formValues)
    })
  };

  // 城管工单 查询
  handleInspector=(e)=>{
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if(values.inspectorsCreateDate){
        values.startTime=moment(values.complainCreateDate[0]).format('YYYY-MM-DD')
      }
      if(values.inspectorsCreateDate){
        values.endTime=moment(values.complainCreateDate[1]).format('YYYY-MM-DD')
      }
      const area = values.inspectorCommunity;
      const {largeClass} = values;
      const {smallClass} = values;
      this.props.dispatch({
        type: 'timing/inspectorsGeneratingRuleFetch',
        payload:{
          pageNum:1,
          pageSize:10,
          area:area || '',
          largeClass:largeClass || '',
          smallClass:smallClass || '',
          startTime:values.startTime ? values.startTime : '',
          endTime:values.endTime ? values.endTime : '',
        }
      });
      this.setState({
        pageNum:1,
        pageSize:10,
      })
    });
  };

  // 定时生成 城管工单 重置
  handleInspectorReset(){
    this.props.form.resetFields();
    this.props.dispatch({
      type: 'timing/inspectorsGeneratingRuleFetch',
      payload:{pageNum:1,pageSize:10}
    });
    this.setState({
      pageNum:1,
      pageSize:10,
      formValues:{},
    })
  }
;
  // 综合执法 分页
  handleTableComprehensiveChange=(page,size)=>{
    this.setState({
      pageNum:page,
      pageSize:size,
    });
    this.props.dispatch({
      type: 'timing/comprehensiveGeneratingRuleFetch',
      payload:Object.assign({pageNum:page,pageSize:size},this.state.formValues)
    })
  };

  // 综合执法 查询
  handleCcomprehensive=(e)=>{
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if(values.ccomprehensiveCreateDate){
        values.startTime=moment(values.ccomprehensiveCreateDate[0]).format('YYYY-MM-DD')
      }
      if(values.ccomprehensiveCreateDate){
        values.endTime=moment(values.ccomprehensiveCreateDate[1]).format('YYYY-MM-DD')
      }
      const area = values.ccomprehensiveCommunity;
      const caseType = values.ccomprehensiveCaseType;
      this.props.dispatch({
        type: 'timing/comprehensiveGeneratingRuleFetch',
        payload:{
          pageNum:1,
          pageSize:10,
          area:area || '',
          caseType:caseType || '',
          startTime:values.startTime ? values.startTime : '',
          endTime:values.endTime ? values.endTime : '',
        }
      });
      this.setState({
        pageNum:1,
        pageSize:10,
      })
    });
  };

  // 定时生成 综合执法 重置
  handleCcomprehensiveReset(){
    this.props.form.resetFields();
    this.props.dispatch({
      type: 'timing/comprehensiveGeneratingRuleFetch',
      payload:{pageNum:1,pageSize:10}
    });
    this.setState({
      pageNum:1,
      pageSize:10,
      formValues:{},
    })
  }
;
  // 列表案件大类 查询 案件小类
  bigClassSearch =(value)=>{
    const {form} = this.props;
    // 案件小类
    if(value){
      new Promise(resolve => {
        this.props.dispatch({
          type: 'inspectors/smallClassFetch',
          payload: {
            resolve,
            largeClassCode:value,
          }
        })
      }).then((res) => {
        this.setState({
          listSmallAllClass: res.data,
        });
      });
    }else{
      this.setState({
        listSmallAllClass:[],
      })
    }
    form.setFieldsValue({smallClass:''});
    form.setFieldsValue({smallClassModal:''})
  };

  start=()=>{
    this.setState({
      selectedRowKeys:[],
    })
  };

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  };

  onChange = (e) => {
    this.setState({
      value: e.target.value,
    });
  };

  // 返回
  goBackList(){
    this.props.history.go(-1);
  }
;
  render() {
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };

    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex === 'buildCycle' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });
    const columnsComprehensive = this.columnsComprehensive.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex === 'age' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });
    const { getFieldDecorator } = this.props.form;
    const { select,timing ,inspectors} = this.props;
    const { communityList,convergenceProgramList,bigClassListSelect } = select;
    const { selectedRowKeys, pageNum, pageSize,listbigAllClass,listSmallAllClass,complainDataModalList } = this.state;
    const { complainGeneratingRuleList,inspectorsGeneratingRuleList,comprehensiveGeneratingRuleList } = timing;
    const that = this;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const columnsComplain = [
      {
        title: '片区',
        dataIndex: 'areaId',
      },
      {
        title: '归口类型',
        dataIndex: 'underCentralizedTypeId',
      },
      {
        title: '本周工作量',
        dataIndex: 'orderNum',
      },
      {
        title: '智能生成数量',
        dataIndex: 'generaNum',
      },
      {
        title: '创建时间',
        dataIndex: 'createDate',
      },
    ];
    const columnsCityManagement = [
      {
        title: '片区',
        dataIndex: 'areaId',
      },
      {
        title: '案件大类',
        dataIndex: 'largeClassId',
      },
      {
        title: '案件小类',
        dataIndex: 'smallClassId',
      },
      {
        title: '本周工单数量',
        dataIndex: 'orderNum',
      },
      {
        title: '智能生成数量',
        dataIndex: 'generaNum',
      },
      {
        title: '创建时间',
        dataIndex: 'createDate',
      },
    ];
    const columnsLawEnforcement = [
      {
        title: '片区',
        dataIndex: 'areaId',
      },
      {
        title: '案件类别',
        dataIndex: 'caseTypeId',
      },
      {
        title: '本周工单数量',
        dataIndex: 'orderNum',
      },
      {
        title: '智能生成数量',
        dataIndex: 'generaNum',
      },
      {
        title: '创建时间',
        dataIndex: 'createDate',
      },
    ];
    const data = [
      {
        key: '1',
        name: '翠林山庄',
        age: '城建城管-房产部门-物业管理-（小区）小区内群租房问题',
        address: '20',
      },
      {
        key: '2',
        name: '金尧花园',
        age: '城建城管-房产部门-物业管理-（小区）小区内群租房问题',
        address: '34',
      },
      {
        key: '3',
        name: '青田雅居',
        age: '城建城管-房产部门-物业管理-（小区）小区内群租房问题',
        address: '45',
      },
      {
        key: '4',
        name: '王子楼社区',
        age: '城建城管-房产部门-物业管理-（小区）小区内群租房问题',
        address: '56',
      },
      {
        key: '5',
        name: '吴边社区',
        age: '城建城管-房产部门-物业管理-（小区）小区内群租房问题',
        address: '56',
      }
      ,
      {
        key: '6',
        name: '尧化社区',
        age: '城建城管-房产部门-物业管理-（小区）小区内群租房问题',
        address: '22',
      }
    ];
    return (
      <div>
        <h3 id="listTitle">定时生成统计</h3>
        <div id="listTitleDetailBanner">
          <Button type="primary" onClick={this.goBackList.bind(this)}>返回</Button>
          <Button type="primary" onClick={this.setUp}>设置</Button>
        </div>
        <div id="listTitleDetailTab">
          <Tabs defaultActiveKey="1" onChange={this.callback} type="card">
            <TabPane tab="投诉工单" key="1">
              <div id="tableForm">
                <Form layout="inline">
                  <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={6} sm={8}>
                      <FormItem label="查询时间">
                        {getFieldDecorator('complainCreateDate')(
                          <RangePicker placeholder={['开始时间', '结束时间']} />
                        )}
                      </FormItem>
                    </Col>
                    <Col md={6} sm={8}>
                      <FormItem label="所属社区">
                        {getFieldDecorator('complainArea')(
                          <Select placeholder="请选择" allowClear>
                            {communityList.map((val)=>(
                              <Select.Option key={val.dictid} value={val.dictid}>{val.dictname}</Select.Option>
                            ))}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col md={6} sm={8}>
                      <FormItem label="归口类型">
                        {getFieldDecorator('complainUnderCentralizedType')(
                          <Select placeholder="请选择" allowClear>
                            {convergenceProgramList.map((val)=>(
                              <Select.Option key={val.dictid} value={val.dictid}>{val.dictname}</Select.Option>
                            ))}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col md={6} sm={8} style={{ textAlign: 'right' }}>
                      <Button type="primary" onClick={this.handleComplain.bind(this)}>
                        查询
                      </Button>
                      <Button style={{ marginRight:0, marginLeft:16 }} onClick={this.handleComplainReset.bind(this)}>
                        重置
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </div>
              <div id="listTable">
                <Table
                  columns={columnsComplain}
                  dataSource={complainGeneratingRuleList.list}
                  rowKey={(record) => record.id}
                  pagination={{
                    current: pageNum,
                    pageSize,
                    onShowSizeChange(current,pageSize) {
                      that.handleTableComplainChange(current, pageSize);
                    },
                    onChange(current,pageSize){
                      that.handleTableComplainChange(current, pageSize);
                    },
                    total:complainGeneratingRuleList.total,
                    showTotal:total => `共 ${total} 条数据`,
                    size: 'small',
                    showSizeChanger: true,
                    showQuickJumper: true,
                    pageSizeOptions: ['10','15','20'],
                  }}
                />
              </div>
            </TabPane>
            <TabPane tab="城管工单" key="2">
              <div id="tableForm" style={{ paddingBottom: 20 }}>
                <Form layout="inline">
                  <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={6} sm={8}>
                      <FormItem label="查询时间">
                        {getFieldDecorator('inspectorsCreateDate')(
                          <RangePicker placeholder={['开始时间', '结束时间']} />
                        )}
                      </FormItem>
                    </Col>
                    <Col md={6} sm={8}>
                      <FormItem label="所属社区">
                        {getFieldDecorator('inspectorCommunity')(
                          <Select placeholder="请选择" allowClear>
                            {communityList.map((val)=>(
                              <Select.Option key={val.dictid} value={val.dictid}>{val.dictname}</Select.Option>
                            ))}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col md={6} sm={8}>
                      <FormItem label="案件大类">
                        {getFieldDecorator('largeClass')(
                          <Select placeholder="请选择" allowClear style={{width: '100%'}} onChange={this.bigClassSearch}>
                            {
                              listbigAllClass ? (listbigAllClass.map((val)=>(
                                <Select.Option key={val.largeClassCode} value={val.largeClassCode}>{val.largeClassName}</Select.Option>
                              ))): []
                            }
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col md={6} sm={8}>
                      <FormItem label="案件小类">
                        {getFieldDecorator('smallClass')(
                          <Select placeholder="请选择" allowClear style={{width: '100%'}}>
                            {
                             listSmallAllClass ? ( listSmallAllClass.map((val)=>(
                               <Select.Option key={val.smallClassCode} value={val.smallClassCode}>{val.smallClassName}</Select.Option>
                             ))):[]
                            }
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col md={24} sm={24} style={{ textAlign: 'right' }}>
                      <Button type="primary" onClick={this.handleInspector.bind(this)}>
                        查询
                      </Button>
                      <Button style={{ marginRight:0, marginLeft:16 }} onClick={this.handleInspectorReset.bind(this)}>
                        重置
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </div>
              <div id="listTable">
                <Table
                  columns={columnsCityManagement}
                  dataSource={inspectorsGeneratingRuleList.list}
                  rowKey={(record) => record.id}
                  pagination={{
                    current: pageNum,
                    pageSize,
                    onShowSizeChange(current,pageSize) {
                      that.handleTableInspectorChange(current, pageSize);
                    },
                    onChange(current,pageSize){
                      that.handleTableInspectorChange(current, pageSize);
                    },
                    total:inspectorsGeneratingRuleList.total,
                    showTotal:total => `共 ${total} 条数据`,
                    size: 'small',
                    showSizeChanger: true,
                    showQuickJumper: true,
                    pageSizeOptions: ['10','15','20'],
                  }}
                />
              </div>
            </TabPane>
            <TabPane tab="综合执法工单" key="3">
              <div id="tableForm">
                <Form layout="inline">
                  <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={6} sm={8}>
                      <FormItem label="查询时间">
                        {getFieldDecorator('ccomprehensiveCreateDate')(
                          <RangePicker placeholder={['开始时间', '结束时间']} />
                        )}
                      </FormItem>
                    </Col>
                    <Col md={6} sm={8}>
                      <FormItem label="所属社区">
                        {getFieldDecorator('ccomprehensiveCommunity')(
                          <Select placeholder="请选择" allowClear>
                            {communityList.map((val)=>(
                              <Select.Option key={val.dictid} value={val.dictid}>{val.dictname}</Select.Option>
                            ))}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col md={6} sm={8}>
                      <FormItem label="案件类别">
                        {getFieldDecorator('ccomprehensiveCaseType')(
                          <Select placeholder="请选择" allowClear>
                            {bigClassListSelect.map((val)=>(
                              <Select.Option key={val.dictid} value={val.dictid}>{val.dictname}</Select.Option>
                            ))}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col md={6} sm={8} style={{ textAlign: 'right' }}>
                      <Button type="primary" onClick={this.handleCcomprehensive.bind(this)}>
                        查询
                      </Button>
                      <Button style={{ marginRight:0, marginLeft:16 }} onClick={this.handleCcomprehensiveReset.bind(this)}>
                        重置
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </div>
              <div id="listTable">
                <Table
                  columns={columnsLawEnforcement}
                  dataSource={comprehensiveGeneratingRuleList.list}
                  rowKey={(record) => record.id}
                  pagination={{
                    current: pageNum,
                    pageSize,
                    onShowSizeChange(current,pageSize) {
                      that.handleTableComprehensiveChange(current, pageSize);
                    },
                    onChange(current,pageSize){
                      that.handleTableComprehensiveChange(current, pageSize);
                    },
                    total:comprehensiveGeneratingRuleList.total,
                    showTotal:total => `共 ${total} 条数据`,
                    size: 'small',
                    showSizeChanger: true,
                    showQuickJumper: true,
                    pageSizeOptions: ['10','15','20'],
                  }}
                />
              </div>
            </TabPane>
          </Tabs>
        </div>
        <Modal
          width={1000}
          title="设置智能规则"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <div id="listTitleDetailTab">
            <Tabs defaultActiveKey="1" type="card">
              <TabPane tab="投诉工单" key="1">
                <div id="tableListForm" style={{ padding: '0 10px 0 0' }}>
                  <Form layout="inline" style={{ paddingTop: 20 }}>
                    <Row gutter={{ md: 48, lg:48, xl: 48 }}>
                      <Col md={8} sm={8} style={{float:'right'}}>
                        <FormItem label="归口类型">
                          {getFieldDecorator('completeTime', {
                            rules: [
                              {
                                required: false,
                                message: '请填写单据编号',
                              },
                            ],
                          })(
                            <Select placeholder="请选择" allowClear>
                              {convergenceProgramList.map((val)=>(
                                <Select.Option key={val.dictid} value={val.dictid}>{val.dictname}</Select.Option>
                              ))}
                            </Select>
                          )}
                        </FormItem>
                      </Col>
                    </Row>
                    <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                      <Col md={16} sm={16}>
                        <Button type="primary">
                          模板下载
                        </Button>
                        <Button type="primary" style={{ marginRight:0, marginLeft:16 }}>
                          导入设置
                        </Button>
                      </Col>
                      <Col md={8} sm={8} style={{ textAlign: 'right' }}>
                        <Button type="primary">
                          查询
                        </Button>
                        <Button style={{ marginRight:0, marginLeft:16 }}>
                          重置
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                  <div id="listTable" style={{ margin:'20px 0 20px 0' }}>
                    <Table
                      components={components}
                      bordered
                      dataSource={this.state.complainDataModalList}
                      columns={columns}
                      rowClassName="editable-row"
                    />
                  </div>
                </div>
              </TabPane>
              <TabPane tab="城管工单" key="2">
                <div id="tableListForm" style={{ padding: '0 10px 0 0' }}>
                  <Form layout="inline" style={{ paddingTop: 20 }}>
                    <Row gutter={{ md: 48, lg:48, xl: 48 }}>
                      <Col md={48} sm={48} style={{float:'right',width: '100%'}}>
                        <Col md={8} sm={8} style={{float:'right'}}>
                          <FormItem label="案件大类">
                            {getFieldDecorator('largeClassModal')(
                              <Select placeholder="请选择" allowClear style={{width: '100%'}} onChange={this.bigClassSearch}>
                                {
                                  listbigAllClass ? (listbigAllClass.map((val)=>(
                                    <Select.Option key={val.largeClassCode} value={val.largeClassCode}>{val.largeClassName}</Select.Option>
                                  ))): []
                                }
                              </Select>
                            )}
                          </FormItem>
                        </Col>
                        <Col md={8} sm={8} style={{float:'right'}}>
                          <FormItem label="案件小类">
                            {getFieldDecorator('smallClassModal')(
                              <Select placeholder="请选择" allowClear style={{width: '100%'}}>
                                {
                                  listSmallAllClass ? ( listSmallAllClass.map((val)=>(
                                    <Select.Option key={val.smallClassCode} value={val.smallClassCode}>{val.smallClassName}</Select.Option>
                                  ))):[]
                                }
                              </Select>
                            )}
                          </FormItem>
                        </Col>
                      </Col>
                    </Row>
                    <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                      <Col md={16} sm={16}>
                        <Button type="primary">
                          模板下载
                        </Button>
                        <Button type="primary" style={{ marginRight:0, marginLeft:16 }}>
                          导入设置
                        </Button>
                      </Col>
                      <Col md={8} sm={8} style={{ textAlign: 'right' }}>
                        <Button type="primary">
                          查询
                        </Button>
                        <Button style={{ marginRight:0, marginLeft:16 }}>
                          重置
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                  <div id="listTable" style={{ margin:'20px 0 20px 0' }}>
                    <Table
                      components={components}
                      bordered
                      dataSource={this.state.inspectorData}
                      columns={columns}
                      rowClassName="editable-row"
                    />
                  </div>
                </div>
              </TabPane>
              <TabPane tab="综合执法工单" key="3">
                <div id="tableListForm" style={{ padding: '0 10px 0 0' }}>
                  <Form layout="inline" style={{ paddingTop: 20 }}>
                    <Row gutter={{ md: 48, lg:48, xl: 48 }}>
                      <Col md={8} sm={8} style={{float:'right'}}>
                        <FormItem label="案件类别">
                          {getFieldDecorator('completeTime', {
                            rules: [
                              {
                                required: false,
                                message: '请填写单据编号',
                              },
                            ],
                          })(
                            <Select placeholder="请选择">
                              <Option value="1">市容环境</Option>
                            </Select>
                          )}
                        </FormItem>
                      </Col>
                    </Row>
                    <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                      <Col md={16} sm={16}>
                        <Button type="primary">
                          模板下载
                        </Button>
                        <Button type="primary" style={{ marginRight:0, marginLeft:16 }}>
                          导入设置
                        </Button>
                      </Col>
                      <Col md={8} sm={8} style={{ textAlign: 'right' }}>
                        <Button type="primary">
                          查询
                        </Button>
                        <Button style={{ marginRight:0, marginLeft:16 }}>
                          重置
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                  <div id="listTable" style={{ margin:'20px 0 20px 0' }}>
                    <Table
                      components={components}
                      bordered
                      dataSource={this.state.comprehensiveData}
                      columns={columnsComprehensive}
                      rowClassName="editable-row"
                    />
                  </div>
                </div>
              </TabPane>
            </Tabs>
          </div>
        </Modal>
      </div>
    );
  }
}

export default Workplace;
