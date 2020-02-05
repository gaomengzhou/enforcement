import React, { PureComponent } from 'react';
import Link from 'umi/link';
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
  Tabs,
  message,
  Breadcrumb,
  Divider,
} from 'antd';
import styles from './Detail.less';

const FormItem = Form.Item;

class app extends PureComponent {
  render() {
    const {
      // dataSourceCourse,
    } = this.props;
    const columns = [
      {
        title: '业务操作',
        dataIndex: 'businessOperationsDec',
        key: 'businessOperationsDec',
      },
      {
        title: '执行部门',
        dataIndex: 'executiveDepartment',
        key: 'executiveDepartment',
      },
      {
        title: '处理结果',
        dataIndex: 'processingResults',
        key: 'processingResults',
      },
      {
        title: '操作员',
        dataIndex: 'operator',
        key: 'operator',
      },
      {
        title: '操作时间',
        dataIndex: 'operatingDate',
        key: 'operatingDate',
      },
      {
        title: '受理部门',
        dataIndex: 'acceptanceDepartment',
        key: 'acceptanceDepartment',
      },
      {
        title: '图片',
        dataIndex: 'photo',
        key: 'photo',
        render: text => <a href="''">{text}</a>,
      },
      {
        title: '下载',
        dataIndex: 'download',
        key: 'download',
        render: text => <a href="''">下载</a>,
      },
      {
        title: '处理描述',
        dataIndex: 'processingDescription',
        key: 'processingDescription',
      },
    ];
    return (
      <div id="tableListForm" style={{ background: '#fff', paddingBottom: 28 }}>
        <h3 className="gEditLineColor">工作过程
        <Divider style={{ margin: '12px 0 8px 0' }} dashed />
        </h3>
        <div style={{ marginTop: 18 }}>
          <Table
            columns={columns}
          // dataSource={dataSourceCourse}
          />
        </div>
      </div>
    )
  }
}

const DetailCourse2 = Form.create()(app);
export default DetailCourse2;
