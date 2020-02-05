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
        title: '网格名称1',
        dataIndex: 'ownGridNameDesc',
        render: (t, r) => {
          return (
            <a
              onClick={showModal.bind(this, 'edit', r)}
            >
              {t}
            </a>
          )
        },
      },
      {
        title: '网格地址',
        dataIndex: 'ownGridLocation',
      },
      {
        title: '网格长',
        dataIndex: 'ownGridOftenDesc',
      },
      {
        title: '联系方式',
        dataIndex: 'ownOftenPhone',
      },
      {
        title: '网格员',
        dataIndex: 'ownGridUserDesc',
      },
      {
        title: '联系方式',
        dataIndex: 'ownUserPhone',
      },
      {
        title: '所属社区',
        dataIndex: 'ownCommunity',
      },
    ];

    return (
      <div>
        <div id="listTable">
          <Table
            rowKey={r => r.id}
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

const GridBody = Form.create()(app);
export default GridBody;
