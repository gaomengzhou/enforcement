import React, { Component } from 'react';
import { Form, Input, Button, Row, Col, Modal, DatePicker,Select,Avatar,Table,Pagination } from 'antd';
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
            value: undefined,
        };
    }    
    
    onChange = value => {
        this.setState({ value });
    }; 
    render() {
        const {
        visible,
        handleCancel,
        current,
        total,
        pageSize,
        TemporarydataSource,
        TemporaryCancel,
        temporaryData
        } = this.props;
        const { getFieldDecorator } = this.props.form;
       
        return (
        <Modal
            title="临时任务"
            visible={visible}
            onCancel={TemporaryCancel}
            cancelText="关闭"
            onokText="确定"
            onOk={handleCancel.bind(null, this.props.form)}
            destroyOnClose={true}
            maskClosable={false}
        >
            <Form>
                <Row>
                    <Col span={24}>
                        <Col span={12}>
                            <FormItem label="选择计划" labelCol={{ span: 7 }} wrapperCol={{ span: 17 }}>
                            {getFieldDecorator('planName')(
                                <Select placeholder="请选择">
                                    {TemporarydataSource &&
                                        TemporarydataSource.map(item => (
                                            <Option value={item.planId} key={item.id}>
                                            {item.planName}
                                      </Option>
                                    ))}
                                </Select>
                            )}
                            </FormItem>
                        </Col>
                    </Col>
                    <Col span={24}>
                        <Col span={12}>
                            <FormItem label="巡查队员" labelCol={{ span: 7 }} wrapperCol={{ span: 17 }}>
                            {getFieldDecorator('name')(
                                <Select
                                    showSearch
                                    style={{ width: 200 }}
                                    placeholder="请选择"
                                    optionFilterProp="children"
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
                            )}
                            </FormItem>
                        </Col>
                    </Col>    
                    <Col span={24}>
                        <Col span={10}>
                            <FormItem label="巡查时间" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                            {getFieldDecorator('startTime')(
                                <DatePicker
                                placeholder="请选择"
                                allowClear
                                format="YYYY/MM/DD"
                                />
                            )}
                            </FormItem>
                        </Col>
                    </Col>
                </Row>
            </Form>    
        </Modal>
        );
    }
}

const TemporaryModal = Form.create()(app);
export default TemporaryModal;
