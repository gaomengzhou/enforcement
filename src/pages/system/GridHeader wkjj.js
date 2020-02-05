import React, { Component } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import {
  Row,
  Col,
  Form,
  Input,
  Select,
  Button,
  DatePicker,
  Table,
  Radio,
  Modal,
  Icon,
  Pagination,
  Popconfirm,
  Tabs,
  message,
  Breadcrumb,
  Upload
} from 'antd';

const FormItem = Form.Item;
const {Option} = Select;

let id = 0;
class app extends Component {
  remove = k => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    if (keys.length === 1) {
      return;
    }
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };

  delClass = (e) => {
    // for (let w in this.props.userSource) {
    //   if (this.props.userSource[w].userId == e) {
    //     this.props.userSource.splice(w, 1)
    //   }
    // }
  }

  add = () => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    console.log('keys', keys);
    // debugger;
    const nextKeys = keys.concat(id++);
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  render() {
    const {
      parentBank, query, reset, title, handleCancel,
      gridList, userSource, gridMarkdate, handleOk,
      detail, deleteList, gridSelects
    } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    if (detail.userGridVos) {
      const {userGridVos} = detail;
      getFieldDecorator('keys', { initialValue: userGridVos });
    } else {
      getFieldDecorator('keys', { initialValue: [gridSelects] });
    }

    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => (
      <Row key={index}>
        <Col span={24}>
          <Col span={12}>
            <Form.Item
              // labelCol={{ span: 10 }}
              // wrapperCol={{ span: 14 }}
              label="网格员"
              required={false}
              key={index}
            >
              {getFieldDecorator(`ownGridUsers[${index}]`, {
                initialValue: k.ownGridUser || undefined,
                rules: [
                  {
                    required: true,
                    message: "请填写网格员"
                  }
                ]
              })(<Select
                style={{ width: '150px' }}
                showSearch
                placeholder="请选择"
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {userSource &&
                  userSource.map(item =>
                    <Option value={item.userId} key={item.userId}>
                      {item.lastName}
                    </Option>
                  )}
                 </Select>)}
            </Form.Item>
          </Col>
          <Col span={9}>
            <Form.Item
              // labelCol={{ span: 10 }}
              // wrapperCol={{ span: 14 }}
              // label="网格员"
              required={false}
              key={index}
            >
              {getFieldDecorator(`desp[${index}]`, {
                initialValue: k.gridMark || undefined,
                rules: [
                  {
                    required: true,
                    message: "请填写网格员身份"
                  }
                ]
              })(<Select
                style={{ width: '150px' }}
              >
                {gridMarkdate &&
                  gridMarkdate.map(item => {
                    return (
                      <Option value={item.code} key={item.code}>
                        {item.desp}
                      </Option>
                    );
                  })}
                 </Select>)}
            </Form.Item>
          </Col>
          {index > 0 && (
            <Col span={3} push={1} style={{ marginTop: 10 }}>
              <a onClick={() => this.remove(k)}>删除</a>
            </Col>
          )}
        </Col>
      </Row>
    ));
    // const Uploadprops = {
    //   name: 'file',
    //   action: '/services/enforcement/rightMatter/importLe',
    //   showUploadList:false,
    //   // headers: {
    //   //   authorization: 'authorization-text',
    //   // },
    //   onChange(info) {
    //     if (info.file.status !== 'uploading') {
    //       // console.log(info.file, info.fileList);
    //     }
    //     if (info.file.status === 'done') {
    //       message.success(`文件导入成功`);
    //       handleCancel();
    //       getList();
    //     } else if (info.file.status === 'error') {
    //       message.error(`文件导入失败`);
    //       handleCancel();
    //     }
    //   },
    // };
    return (
      <div>
        <Breadcrumb separator=">">
          <span id="breadcrumbIcon" />
          <Breadcrumb.Item>网格员管理</Breadcrumb.Item>
        </Breadcrumb>
        <div id="tableForm">
          <h3 id="listTitle">网格员管理</h3>
          <div layout="inline">
            <Form layout="inline">
              <Row>
                <Col span={24}>
                  <Col md={8} sm={8}>
                    <FormItem label="网格名称">
                      {getFieldDecorator('ownGridName')(<Select
                        showSearch
                        placeholder="请选择"
                        filterOption={(input, option) =>
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {gridList &&
                          gridList.map(item => {
                            return (
                              <Option value={item.id} key={item.id}>
                                {item.name}
                              </Option>
                            );
                          })}
                                                        </Select>)}
                    </FormItem>
                  </Col>
                  <Col md={8} sm={8}>
                    <FormItem label="网格地址">
                      {getFieldDecorator('ownGridLocation')(<Input placeholder="请输入" />)}
                    </FormItem>
                  </Col>
                  <Col md={8} sm={8}>
                    <FormItem label="网格长">
                      {getFieldDecorator('ownGridOften')(<Input placeholder="请输入" />)}
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <FormItem label="所属社区" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
                      {getFieldDecorator('ownCommunity')(
                        <Select placeholder="请选择">
                          {parentBank &&
                            parentBank.map(item => {
                              return (
                                <Option value={item.code} key={item.code}>
                                  {item.desp == '总行' ? '' : item.desp}
                                </Option>
                              );
                            })}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                </Col>
                <Col span={24}>
                  <Col span={7} push={17}>
                    <Button
                      type="primary"
                      style={{ marginRight: 15 }}
                      onClick={query.bind(null, this.props.form)}
                    >
                      查询
                    </Button>
                    <Button
                      onClick={reset.bind(null, this.props.form)}
                    >
                      清空
                    </Button>
                  </Col>
                </Col>
              </Row>
            </Form>
            <div id="listOperator">
              <Button
                type="primary"
                onClick={this.props.showModal}
              >
                新增
              </Button>
              {
                // <Button
                //   type="primary"
                //   // onClick={this.props.ImportshowModal}
                // >
                //   导入
                // </Button>
                // <Button
                //   type="primary"
                //   // onClick={this.props.ExcelshowModal}
                // >
                //   导出
                // </Button>
                // <Button
                //   type="primary"
                //   // onClick={this.props.ExcelshowModalall}
                // >
                //   导出全部
                // </Button>
              }
              <Popconfirm
                onConfirm={deleteList.bind(this)}
                title="你确定要删除吗？删除将不能恢复！"
                okText="确定"
                cancelText="取消"
              >
                <Button type="primary">删除</Button>
              </Popconfirm>
            </div>
          </div>
        </div>
        <Modal
          title={title}
          visible={this.props.visible}
          onOk={handleOk.bind(null, this.props.form, title)}
          onCancel={handleCancel}
          destroyOnClose
          maskClosable={false}
        >
          <Form layout="inline">
            <Row>
              <Col span={24}>
                <Col span={12}>
                  <FormItem label="网格名称" labelCol={{ span: 7 }} wrapperCol={{ span: 17 }}>
                    {getFieldDecorator('ownGridNames', {
                      initialValue: detail.ownGridName || undefined,
                      rules: [
                        {
                          required: true,
                          message: "请填写网格名称"
                        }
                      ]
                    })(<Select
                      style={{ width: '150px' }}
                      showSearch
                      placeholder="请选择"
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {gridList &&
                        gridList.map(item => {
                          return (
                            <Option value={item.id} key={item.id}>
                              {item.name}
                            </Option>
                          );
                        })}
                       </Select>)}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem label="网格长" labelCol={{ span: 7 }} wrapperCol={{ span: 17 }}>
                    {getFieldDecorator('ownGridOftens', {
                      initialValue: detail.ownGridOften || undefined,
                      rules: [
                        {
                          required: true,
                          message: "请填写网格长"
                        }
                      ]
                    })(<Select
                      style={{ width: '150px' }}
                      showSearch
                      placeholder="请选择"
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      onChange={this.delClass}
                    >
                      {userSource && userSource.map(item =>
                        <Option value={item.userId} key={item.userId}>
                          {item.lastName}
                        </Option>
                      )}
                       </Select>)}
                  </FormItem>
                </Col>
              </Col>
            </Row>
            <Row>
              <Col>
                {formItems}
                <Form.Item>
                  <Button type="dashed" onClick={this.add} style={{ width: '100%' }}>
                    添加
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
        <Modal
          title="权力事项-导出excel表格"
        //   visible={visibleExcel}
        //   onOk={handleExcel.bind(this)}
        //   onCancel={handleCancel}
        >
          <p>请确定是否导出表格.</p>
        </Modal>
        <Modal
          title="权力事项-导出全部excel表格"
        //   visible={visibleExcelall}
        //   // onOk={handleExcelall.bind(this)}
        //   onOk={handleExcelall.bind(null, this.props.form)}
        //   onCancel={handleCancel}
        >
          <p>请确定是否导出表格.</p>
        </Modal>
        <Modal
          title="导入"
        //   visible={visibleImport}
        //   onOk={handleCancel}
        //   onCancel={handleCancel}
        >
          <div style={{ position: 'relative', height: 40, lineHeight: '30px', marginTop: 10 }}>
            <Button
              type='primary'
              style={{ position: 'absolute', top: 0, left: 0, textAlign: 'center', width: 'auto' }}
            //  onClick={downloadExcel.bind(this)}
            >
              模板下载
            </Button>
            <Upload>
              <Button
                type='primary'
                style={{ position: 'absolute', top: 0, left: 100, textAlign: 'center', width: 'auto' }}
              >
                上传文件
              </Button>
            </Upload>
          </div>
        </Modal>
      </div>
    );
  }
}

const GridHeader = Form.create()(app);
export default GridHeader;
