import React, { Component } from 'react';
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
} from 'antd';
import moment from 'moment';

const FormItem = Form.Item;

class app extends Component {
  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };
  render() {
    const {
      dataSource,
      rowSelection,
      pagination,
      onChange,
      showModal
    } = this.props;
    const columns = [
      {
        title: '权力编码',
        dataIndex: 'powerCode',
        render: (t, r) => (
          <a
            onClick={showModal.bind(this, 'edit', r)}
          >
            {t}
          </a>
        ),
      },
      {
        title: '权力说明',
        dataIndex: 'powerNote',
      },
    ];

    return (
      <div>
        <div id="listTable">
          <Table
            scroll={{ x: '100%' }}
            rowSelection={rowSelection}
            columns={columns}
            dataSource={dataSource}
            pagination={pagination}
            onChange={onChange}
          />
        </div>
      </div>
    );
  }
}

const Bodylist = Form.create()(app);
export default Bodylist;
