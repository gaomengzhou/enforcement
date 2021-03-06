import React, { PureComponent } from 'react';
import {
  Form,
  Table,
} from 'antd';


class app extends PureComponent {
  render() {
    const {
      courseInfo,
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
        title: '所属社区',
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
        title: '图片',
        dataIndex: 'photo',
        key: 'photo',
        render: (text, record) => <a onClick={seePhopto.bind(this, record)}>{record.photo && "查看"}</a>,
      },
      {
        title: '下载',
        dataIndex: 'download',
        key: 'download',
        render: (text, record) => <a onClick={loopDownPhopto.bind(this, record.photo)}>{record.photo && "下载"}</a>,
      },
      {
        title: '处理描述',
        dataIndex: 'processingDescription',
        key: 'processingDescription',
      },
    ];
    return (
      <div id="tableListForm" style={{ background: '#fff', paddingBottom: 28 }}>
        <h3 style={{ paddingTop: 20, paddingLeft: 20 }}>工作过程</h3>
        <div style={{ marginTop: 12, padding: "0 33px" }}>
          <Table
            columns={columns}
            rowKey={record => record.businessOperations}
            dataSource={courseInfo}
          />
        </div>
      </div>
    )
  }
}

const DetailCourse2 = Form.create()(app);
export default DetailCourse2;
