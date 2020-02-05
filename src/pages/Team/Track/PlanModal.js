import React, { Component } from 'react';
import { Form, Input, Button, Row, Col, Modal, DatePicker,Select,Avatar,Table,Pagination,Popconfirm } from 'antd';
import moment from 'moment';
const Option = Select.Option;
const { MonthPicker } = DatePicker;
const FormItem = Form.Item;
class app extends React.Component { 
    render() {
        const {
        visible,
        handleCancel,
        current,
        total,
        pageSize,
        plandataSource,
        onChange,
        planQuery,
        planReset,
        palanDelete,
        planDisable,
        planEnable,
        showPlanModal,
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
                    onClick={showPlanModal.bind(null, r)}
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
              width:140,
              dataIndex: 'status',
              render: (t, r) => {
                  return(
                    <div>
                        <Popconfirm
                        onConfirm={palanDelete.bind(null,r)}
                        title="你确定要删除吗？删除将不能恢复！"
                        okText="确定"
                        cancelText="取消"
                        >
                            <a href="javascriput:;"
                                // onClick={this.showModal}
                            style={{marginRight:"20px"}}
                            >
                                删除
                            </a>
                        </Popconfirm>
                        {
                            t === '01' ? (<Popconfirm
                                onConfirm={planDisable.bind(null,t)}
                                title="你确定要禁用？"
                                okText="确定"
                                cancelText="取消"
                                >
                                <a href="javascriput:;" 
                                // onClick={showModals.bind( this,'edit', r)}
                                    >
                                    已启用
                                </a>
                                </Popconfirm>) : (<Popconfirm
                                    onConfirm={planEnable.bind(null,t)}
                                    title="你确定要启用？"
                                    okText="确定"
                                    cancelText="取消"
                                    >
                                    <a href="javascriput:;" 
                                    // onClick={showModals.bind( this,'edit', r)}
                                        >
                                        禁用
                                    </a>
                                    </Popconfirm>)
                        }
                    </div>
                  )
              }
            },
          ];
        return (
        <Modal
            title="计划管理"
            visible={visible}
            width='520'
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
                        <Col span={6}>
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
                            <Button onClick={planQuery.bind(null, this.props.form)}>查询</Button>
                            <Button style={{marginLeft:18}} onClick={planReset.bind(null, this.props.form)}>清空</Button>
                        </Col>
                    </Col>
                </Row>
            </Form>
            <h4 style={{ fontWeight: 700, borderBottom: '1px dashed #000' }}>任务列表</h4>
            <Table
              dataSource={plandataSource}
              columns={columns}
              pagination={pagination}
              onChange={onChange}
            >
            </Table>
        </Modal>
        );
    }
}

const PlanModal = Form.create()(app);
export default PlanModal;
