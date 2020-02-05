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
      ListCourse,
      seePhopto,
      loopDownPhopto,
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
      // {
      //   title: '处理结果',
      //   dataIndex: 'processingResults',
      //   key: 'processingResults',
      // },
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
        render: (text, record) => <a onClick={seePhopto.bind(this, record)} href="''">{record.photo && "查看"}</a>,
      },
      {
        title: '下载',
        dataIndex: 'download',
        key: 'download',
        render: (text, record) => <a onClick={loopDownPhopto.bind(this, record.photo)} href="''">{record.photo && "下载"}</a>,
      },
      {
        title: '处理描述',
        dataIndex: 'processingDescription',
        key: 'processingDescription',
      },
    ];
    return (
      <div id="tableListForm" style={{ background: '#fff', paddingBottom: 28 }}>
        <div style={{ marginTop: 18 }}>
          <Table
            columns={columns}
            dataSource={ListCourse}
          />
        </div>
      </div>
    )
  }
}

const DetailCourse2 = Form.create()(app);
export default DetailCourse2;
