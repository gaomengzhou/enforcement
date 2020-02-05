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
import Ellipsis from '../../components/Ellipsis'

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
        width: '16%',
        title: '网格名称1',
        dataIndex: 'ownGridNameDesc',
        render: (t, record) => {
          return (
            <a
              onClick={showModal.bind(this, 'edit', record)}
            >
              {t}
            </a>
          )
        },
      },
      {
        width: '34%',
        title: '网格地址',
        dataIndex: 'ownGridLocation',
        render: t => <Ellipsis lines={1} tooltip>{t}</Ellipsis>
      },
      {
        width: '10%',
        title: '网格长',
        dataIndex: 'ownGridOftenDesc',
      },
      {
        width: '10%',
        title: '联系方式',
        dataIndex: 'ownOftenPhone',
      },
      {
        width: '10%',
        title: '网格员',
        dataIndex: 'ownGridUserDesc',
        render: t => <Ellipsis lines={1} tooltip>{t}</Ellipsis>
      },
      {
        width: '10%',
        title: '联系方式',
        dataIndex: 'ownUserPhone',
        render: t => <Ellipsis lines={1} tooltip>{t}</Ellipsis>
      },
      {
        width: '10%',
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
