import React,{PureComponent,Fragment} from 'react';
import {Table,Button,Form, Row, Col, Input, Breadcrumb,DatePicker,Select,message,Popconfirm} from 'antd';
import {connect} from 'dva';

import styles from './List.less';
const { MonthPicker, RangePicker } = DatePicker;
const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  state = {
    editing: false,
  }

  componentDidMount() {
    if (this.props.editable) {
      document.addEventListener('click', this.handleClickOutside, true);
    }
  }

  componentWillUnmount() {
    if (this.props.editable) {
      document.removeEventListener('click', this.handleClickOutside, true);
    }
  }

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  }

  handleClickOutside = (e) => {
    const { editing } = this.state;
    if (editing && this.cell !== e.target && !this.cell.contains(e.target)) {
      this.save();
    }
  }

  save = () => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  }

  render() {
    const { editing } = this.state;
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      ...restProps
    } = this.props;
    return (
      <td ref={node => (this.cell = node)} {...restProps}>
        {editable ? (
          <EditableContext.Consumer>
            {(form) => {
              this.form = form;
              return (
                editing ? (
                  <FormItem style={{ margin: 0 }}>
                    {form.getFieldDecorator(dataIndex, {
                      rules: [{
                        required: true,
                        message: `${title} 是必填项`,
                      }],
                      initialValue: record[dataIndex],
                    })(
                      <Input
                        ref={node => (this.input = node)}
                        onPressEnter={this.save}
                      />
                    )}
                  </FormItem>
                ) : (
                  <div
                    className="editable-cell-value-wrap"
                    style={{ paddingRight: 24 }}
                    onClick={this.toggleEdit}
                  >
                    {restProps.children}
                  </div>
                )
              );
            }}
          </EditableContext.Consumer>
        ) : restProps.children}
      </td>
    );
  }
}

@connect(({system,loading})=>({
  system,
}))
export default class List extends PureComponent{
  constructor(props) {
    super(props);
    this.columns = [{
      title: '序号',
      dataIndex: 'key',
    }, {
      title: '字典项名称',
      dataIndex: 'dictname',
      editable: true,
    }, {
      title: '字典项代码',
      dataIndex: 'dictid',
      editable: true,
    }, {
      title: '操作',
      dataIndex: 'operation',
      render: (text, record) => {
        return (
          this.state.eachDicList.list.length >= 1
            ? (
              <Popconfirm title="确定删除吗?" onConfirm={() => this.handleDelete(record.dictentryid)}>
                <a href="''">删除</a>
              </Popconfirm>
            ) : null
        );
      },
    }];
    this.column = [{
      title: '序号',
      dataIndex: 'key',
    }, {
      title: '字典类型名称',
      dataIndex: 'dicttypename',
      editable: true,
    }, {
      title: '字典类型代码',
      dataIndex: 'dicttypeid',
      editable: false,
    }, {
      title: '操作',
      dataIndex: 'operation',
      render: (text, record) => {
        return (
          this.state.dictionaryLists.length >= 1
            ? (
              <span>
              <Popconfirm title="确定删除吗?" onConfirm={() => this.handleCatDelete(record.dicttypeid)}>
                <a href="''">删除</a>
              </Popconfirm>
                <a style={{marginLeft:8}} href="''" onClick={()=>this.handleDetail(record.dicttypeid)}>查看</a>
              </span>
            ) : null
        );
      },
    }]
    this.state = {
      eachDicList:{
        list:[],
        total:0,
      },
      dictionaryLists:[],
      dicType:null,
      pageNum:1,
      pageSize:10,
    };
  }
  componentDidMount(){
    const {dispatch} = this.props;
    new Promise(resolve=>{
      dispatch({
        type:'system/dictionary',
        payload:{
          resolve
        }
      })
    }).then((res)=>{
      this.setState({
        dictionaryLists:res.data,
      })
    })
    new Promise(resolve=>{
      dispatch({
        type:'system/dicLists',
        payload:{
          resolve,
          pageNum:1,
          pageSize:10,
        }
      })
    }).then((res)=>{
      this.setState({
        eachDicList:res.data,
      })
    })
  }
  handleDicChange = (id)=>{
    const {dispatch} = this.props
    new Promise(resolve=>{
      dispatch({
        type:'system/dicLists',
        payload:{
          resolve,
          pageNum:1,
          pageSize:10,
          dicttypeid:id,
        }
      })
    }).then((res)=>{
      this.setState({
        eachDicList:res.data,
        pageNum:1,
        pageSize:10,
        dicType:id,
      })
    })
  };
  handleDetail=(id)=>{
    const {dispatch} = this.props;
    new Promise(resolve=>{
      dispatch({
        type:'system/dicLists',
        payload:{
          resolve,
          pageNum:1,
          pageSize:10,
          dicttypeid:id,
        }
      })
    }).then((res)=>{
      this.setState({
        eachDicList:res.data,
        pageNum:1,
        pageSize:10,
        dicType:id,
      })
    })
  };
  handleCatDelete= (id) => {
    const {dispatch} = this.props
    new Promise(resolve=>{
      const arr=[]
      arr.push(id)
      dispatch({
        type:'system/delDicCat',
        payload:{
          resolve,
          ids:arr,
        }
      })
    }).then((res)=>{
      this.setState({
        dictionaryLists: res.data,
      });
    })
  }
  handleDelete = (id) => {
    const {dispatch} = this.props
    const {pageNum,pageSize,dicType} = this.state
    new Promise(resolve=>{
      const arr=[]
      arr.push(id)
      dispatch({
        type:'system/delMyDic',
        payload:{
          resolve,
          data:{ids:arr},
          list:{pageNum,pageSize,dicttypeid:dicType,}
        }
      })
    }).then((res)=>{
      this.setState({
        pageNum,
        pageSize,
        eachDicList: res.data,
      });
    })
  }
  handleAdd = () => {
    const { dictionaryLists } = this.state;
    const arr=[]
    for(let i=0;i<dictionaryLists.length;i++){
       arr.push(dictionaryLists[i].dicttypeid.substring(3))
    }
    var max=parseInt(arr[0])?parseInt(arr[0]):0
    for(let j=0;j<arr.length;j++){
      if(arr[j]>max){
        max=parseInt(arr[j])
      }
    }
    const MAX=max+1
    const {dispatch} = this.props
    const newData = {
      key: 'DM_'+(MAX>99?MAX:`0${MAX}`),
      dicttypename: 'TYPE'+(MAX>99?MAX:`0${MAX}`),
      dicttypeid: 'DM_'+(MAX>99?MAX:`0${MAX}`),
    };
    new Promise(resolve=>{
      dispatch({
        type:'system/addDicCat',
        payload:{
          resolve,
          data:newData,
        }
      })
    }).then((res)=>{
      this.setState({
        dictionaryLists: res.data,
      });
    })
  }
  handleCatAdd = () => {

    const { dicType } = this.state;
    const {dispatch} = this.props
    if(dicType) {
      const newData = {
        dictname: `${dicType}-${Math.round(Math.random()*100)}`,
        dictid: Math.round(Math.random()*100),
        dicttypeid:dicType,
        seq:1,
      };
      new Promise(resolve=>{
        dispatch({
          type:'system/addMyDic',
          payload:{
            resolve,
            data:newData,
            list:{pageNum:1,pageSize:10,dicttypeid:dicType}
          }
        })
      }).then((res)=>{
        this.setState({
          pageNum:1,
          pageSize:10,
          eachDicList:res.data,
        });
      })
    }else{
      message.error('请先选择需要添加的字典类型')
    }
  }
  handleCatSave= (row) => {
    const {dispatch} = this.props
    new Promise(resolve=>{
      dispatch({
        type:'system/editDicCat',
        payload:{
          resolve,
          data:row,
        }
      })
    }).then((res)=>{
      this.setState({
        dictionaryLists: res.data,
      });
    })
  }
  handleSave = (row) => {
    const {dispatch} = this.props
    const {pageNum,pageSize,dicType} = this.state
    new Promise(resolve=>{
      dispatch({
        type:'system/editMyDic',
        payload:{
          resolve,
          data:{dictid:row.dictid,dictname:row.dictname,dicttypeid:row.dicttypeid,dictentryid:row.dictentryid},
          list:{pageNum:pageNum,pageSize:pageSize,dicttypeid:dicType,}
        }
      })
    }).then((res)=>{
      this.setState({
        eachDicList: res.data,
      });
    })
  }
  handleTableChange=(page,size)=>{
    const {dispatch} = this.props;
    new Promise(resolve=>{
      dispatch({
        type:'system/dicLists',
        payload:{
          resolve,
          pageNum:page,
          pageSize:size,
          dicttypeid:this.state.dicType,
        }
      })
    }).then((res)=>{
      this.setState({
        eachDicList:res.data,
        pageNum:page,
        pageSize:size,
      })
    })
  }
  render(){
    const { pageNum,pageSize,dictionaryLists,eachDicList } = this.state;
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
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });
    const column = this.column.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleCatSave,
        }),
      };
    });

    const that=this
    return(
      <div id="listTitleContent">
        <Breadcrumb separator=">">
          <span id="breadcrumbIcon"></span>
          <Breadcrumb.Item>系统设置</Breadcrumb.Item>
          <Breadcrumb.Item>数据字典表</Breadcrumb.Item>
        </Breadcrumb>
        <div style={{ padding: '20px 32px',background: '#fff' }}>
          <div  style={{display:'flex',justifyContent:'space-around',}}>
            <div className={styles.tableListForm} style={{width:'40%'}}>
              <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
                新建
              </Button>
              <Table
                components={components}
                rowClassName={() => 'editable-row'}
                bordered
                dataSource={dictionaryLists}
                columns={column}
                pagination={{
                  size:'small',
                }}
              />
            </div>
            <div className={styles.tableListForm} style={{width:'50%'}}>
              <Button onClick={this.handleCatAdd} type="primary" style={{ marginBottom: 16 }}>
                新建
              </Button>
              <Select placeholder="请选择字典类型" allowClear style={{width:200}} onChange={this.handleDicChange}>
                {dictionaryLists.map((val)=>(
                  <Select.Option key={val.dicttypeid} value={val.dicttypeid}>{val.dicttypename}</Select.Option>
                ))}
              </Select>
              <Table
                components={components}
                rowClassName={() => 'editable-row'}
                bordered
                dataSource={eachDicList.list}
                columns={columns}
                pagination={{
                  current:pageNum,
                  pageSize,
                  onShowSizeChange(current, pageSize) {
                    that.handleTableChange(current, pageSize);
                  },
                  onChange(current, pageSize){
                    that.handleTableChange(current, pageSize)
                  },
                  total:eachDicList.total,
                  showTotal:total => `共 ${total} 条数据`,
                  size:'small',
                  showSizeChanger:true,
                  showQuickJumper:true,
                  pageSizeOptions:['10','15','20']
                }}
              />
        </div>
          </div>
        </div>
      </div>
    )
  }
}
List = Form.create({})(List);
