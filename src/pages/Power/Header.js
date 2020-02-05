import React, { PureComponent } from 'react';
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
const { TextArea } = Input;
@connect(({ powermodels, loading }) => ({
  powermodels,
  loading: loading.models.powermodels,
}))
class app extends PureComponent {
  render() {
    const {
      form, query, reset, deleteList,
      handleOk, handleCancel, visibleExcel,
      visibleExcelall, visibleImport, handleExcelall,
      handleExcel, downloadExcel,
      detail, title, getList
    } = this.props;
    const { getFieldDecorator } = this.props.form;
    const Uploadprops = {
      name: 'file',
      action: '/services/enforcement/rightMatter/importLe',
      showUploadList: false,
      // headers: {
      //   authorization: 'authorization-text',
      // },
      onChange(info) {
        if (info.file.status !== 'uploading') {
          // console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success(`文件导入成功`);
          handleCancel();
          getList();
        } else if (info.file.status === 'error') {
          message.error(`文件导入失败`);
          handleCancel();
        }
      },
    };
    return (
      <div>
        <Breadcrumb separator=">">
          <span id="breadcrumbIcon" />
          <Breadcrumb.Item>权力事项</Breadcrumb.Item>
        </Breadcrumb>
        <div id="tableForm">
          <h3 id="listTitle">权力事项</h3>
          <div layout="inline">
            <Form layout="inline">
              <Row>
                <Col md={6} sm={8} style={{ marginRight: 40 }}>
                  <FormItem label="权力编码">
                    {getFieldDecorator('powerCode')(<Input placeholder="请输入" />)}
                  </FormItem>
                </Col>
                <Col md={6} sm={8}>
                  <FormItem label="权力说明">
                    {getFieldDecorator('powerNote')(<Input placeholder="请输入" />)}
                  </FormItem>
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
                    <Button onClick={reset.bind(null, this.props.form)}>
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
              <Button
                type="primary"
                onClick={this.props.ImportshowModal}
              >
                导入
              </Button>
              <Button
                type="primary"
                onClick={this.props.ExcelshowModal}
              >
                导出
              </Button>
              <Button
                type="primary"
                onClick={this.props.ExcelshowModalall}
              >
                导出全部
              </Button>
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
          destroyOnClose={true}
          maskClosable={false}
        >
          <Form layout="inline">
            <Row>
              <Col>
                <FormItem label="权力编码">
                  {getFieldDecorator('powerCodes', {
                    initialValue: detail && detail.powerCode || "",
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col>
                <FormItem label="权力说明">
                  {getFieldDecorator('powerNotes', {
                    initialValue: detail && detail.powerNote || "",
                  })(<TextArea rows={8} cols={50} />)}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
        <Modal
          title="权力事项-导出excel表格"
          visible={visibleExcel}
          onOk={handleExcel.bind(this)}
          onCancel={handleCancel}
        >
          <p>请确定是否导出表格.</p>
        </Modal>
        <Modal
          title="权力事项-导出全部excel表格"
          visible={visibleExcelall}
          // onOk={handleExcelall.bind(this)}
          onOk={handleExcelall.bind(null, this.props.form)}
          onCancel={handleCancel}
        >
          <p>请确定是否导出表格.</p>
        </Modal>
        <Modal
          title="导入"
          visible={visibleImport}
          onOk={handleCancel}
          onCancel={handleCancel}
        >
          <div style={{ position: 'relative', height: 40, lineHeight: '30px', marginTop: 10 }}>
            <Button type='primary'
              style={{ position: 'absolute', top: 0, left: 0, textAlign: 'center', width: 'auto' }}
              onClick={downloadExcel.bind(this)}
            >
              模板下载
            </Button>
            <Upload {...Uploadprops}>
              <Button type='primary'
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

const Header = Form.create()(app);
export default Header;
