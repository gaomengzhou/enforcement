import React, { Component } from 'react';
import { Form, Input, Button, Row,Col, Modal, DatePicker,Select,Avatar,Table,Pagination,InputNumber } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
const Option = Select.Option;
const { MonthPicker } = DatePicker;
const FormItem = Form.Item;

@connect(({ TrackListmodels, loading }) => ({
  TrackListmodels,
  loading: loading.models.TrackListmodels,
}))
class app extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visibleDay: false,
            Dayvalue:1,
            relevanceVisible: false,
            RehandId:'',
            taskplayerId:'',
            planId:'',
            questId:'',
        };
      }
    showDay = () => {
        this.setState({
            visibleDay: true,
        });
    }
    showRelevance = (r) => {
        this.setState({
            taskplayerId: ( r.playerId === undefined ? '' : r.playerId ),
            relevanceVisible: true,
            planId:r.planId,
            questId:r.questId,
        });
    }
    RehandleCancel = (value) => {
        if(this.state.taskplayerId){
            const { dispatch } = this.props;
            dispatch({
                type: 'TrackListmodels/taskUpdate',
                payload: {
                    id:this.state.questId,
                    playerId:this.state.RehandId,
                    frequency:this.state.Dayvalue,
                    planId:this.state.planId,
                },
                    callback: res => {
                        if (res) {
                        if (res.retCode == 1) {
                        } else {
                        }
                        }
                    },
            })
            this.setState({
                relevanceVisible: false,
            });
        }else{
            const { dispatch } = this.props;
            dispatch({
                type: 'TrackListmodels/taskAdd',
                payload: {
                    playerId:this.state.RehandId,
                    frequency:this.state.Dayvalue,
                    planId:this.state.planId,
                },
                    callback: res => {
                        if (res) {
                        if (res.retCode == 1) {
                        } else {
                        }
                        }
                    },
            })
            this.setState({
                relevanceVisible: false,
            });
        }     
    }
    onChangeRehand = (value) => {
        this.setState({
            RehandId: value,
        });
    }
    handleCancelDay = () => {
        this.setState({
            visibleDay: false,
        });
      };
    onChangDay = (value) => {
        this.setState({
            Dayvalue: value,
        });
    }    
    render() {
        const {
        visible,
        handleCancel,
        current,
        total,
        pageSize,
        onChange,
        taskdataSource,
        taskQuery,
        taskReset,
        temporaryData,
        showTaskModal,
        } = this.props;
        const { getFieldDecorator } = this.props.form;
        const pagination = {
            current: current,
            total: total,
            pageSize: pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
          };
        const columns = [
            {
              title: '计划名称',
              dataIndex: 'name',
              render: (t, r) => (
                <a href="javascriput:;" 
                onClick={showTaskModal.bind(null,r)}
                >
                  {t}
                </a>
              ),
            },
            {
              title: '制定人',
              dataIndex: 'username',
            },
            {  
              title: '制定时间',
              dataIndex: 'createDate',
            },
            {
              title: '操作',
              width:300,
              dataIndex: 'status',
              render: (t, r) => {
                return(
                    <div>
                        <a href="javascriput:;"
                        onClick={this.showRelevance.bind(null,r)}
                        style={{marginRight:"20px"}}
                        >
                            关联队员
                        </a>
                        <a className="ant-dropdown-link" href="javascriput:;" onClick={this.showDay}>
                        每天 
                        </a>
                    </div>
                )
              }
            },
          ];  
        return (
        <Modal
            title="任务设置"
            width='520'
            visible={visible}
            onCancel={handleCancel}
            cancelText="关闭"
            footer={[
                <Button key="submit" onClick={handleCancel}>
                    关闭 
                </Button>,
            ]} 
        >
            <Form>
                <Row>
                    <Col span={24}>
                        <Col span={6}>
                            <FormItem label="队员姓名" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
                            {getFieldDecorator('username')(
                                <Input />
                            )}
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem label="计划名称" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
                            {getFieldDecorator('name')(
                                <Input />
                            )}
                            </FormItem>
                        </Col>
                    </Col>    
                    <Col span={24}>
                        <Col span={6}>
                            <FormItem label="执行时间" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
                            {getFieldDecorator('createDate')(
                                <DatePicker
                                placeholder="请选择"
                                allowClear
                                format="YYYY/MM/DD"
                                />
                            )}
                            </FormItem>
                        </Col>
                        <Col span={6} style={{paddingLeft:'10px'}}>
                            <FormItem label="至" labelCol={{ span: 7 }} wrapperCol={{ span: 17 }}>
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
                    <Col span={24}>
                        <Col span={12} />
                        <Col span={12}>
                            <Button onClick={taskQuery.bind(null, this.props.form)}>查询</Button>
                            <Button style={{marginLeft:18}} onClick={taskReset.bind(null, this.props.form)}>清空</Button>
                        </Col>
                    </Col>
                </Row>
            </Form>
            <h4 style={{ fontWeight: 700, borderBottom: '1px dashed #000' }}>任务列表</h4>
            <Table
              rowKey={(record, index) => `complete${record.id}${index}`}
              dataSource={taskdataSource}
              columns={columns}
              pagination={pagination}
              onChange={onChange}
            >
            </Table>
            <Modal
                visible={this.state.visibleDay}
                onCancel={this.handleCancelDay}
                cancelText="关闭"
                footer={[
                    <Button key="submit" onClick={this.handleCancelDay}>
                        确定 
                    </Button>
                ]} 
            >
                <InputNumber defaultValue={1} onChange={this.onChangDay}/>天一次
            </Modal>
            <Modal
                visible={this.state.relevanceVisible}
                onCancel={this.RehandleCancel}
                cancelText="关闭"
                footer={[
                    <Button key="submit" onClick={this.RehandleCancel}>
                        确定 
                    </Button>
                ]} 
            >
                <Select
                    showSearch
                    style={{ width: 200 }}
                    placeholder="请选择"
                    optionFilterProp="children"
                    onChange={this.onChangeRehand}
                    filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                >
                    {temporaryData &&
                        temporaryData.map(item => (
                            <Option value={item.id} key={item.id}>
                                {item.name}
                            </Option>
                    ))}
                </Select>
            </Modal>
        </Modal>
        );
    }
}

const TaskModal = Form.create()(app);
export default TaskModal;
