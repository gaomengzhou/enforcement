import React, { Component } from 'react';
import { Form, Row, Col, Button, Divider, Select, Input, Table, Tag } from 'antd';


class app extends Component {
  constructor(props) {
    super(props);
    this.state = {
      niubi: "",
    };
  }
  componentDidMount() {
    const niubi = document.body.clientHeight;
    console.log(niubi)
    this.setState({
      niubi,
    })
  }

  render() {
    const {
      niubi,
    } = this.state
    const columns = [
      {
        title: '地点名称',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: '状况',
        key: 'tags',
        dataIndex: 'tags',
        render: tags => (
          <span>
            {tags.map(tag => {
              let color = tag.length > 5 ? 'geekblue' : 'green';
              if (tag === 'loser') {
                color = 'volcano';
              }
              return (
                <Tag color={color} key={tag}>
                  {tag.toUpperCase()}
                </Tag>
              );
            })}
          </span>
        ),
      },
      {
        title: '上报人',
        dataIndex: 'name',
        key: 'name',
      },
    ];

    const data = [
      {
        key: '1',
        name: '王金龙',
        address: '尧化门街1号金龙饭店',
        tags: ['有人受伤'],
      },
      {
        key: '2',
        name: '王金龙',
        address: '尧化门街132号南50米',
        tags: ['车祸'],
      },
      {
        key: '3',
        name: '程红',
        address: '枫林新寓1栋楼下',
        tags: ['非法占位'],
      },
    ];

    const { Option } = Select;

    function onChange(value) {
      console.log(`selected ${value}`);
    }

    function onBlur() {
      console.log('blur');
    }

    function onFocus() {
      console.log('focus');
    }

    function onSearch(val) {
      console.log('search:', val);
    }

    return (
      <div style={{
        background: 'rgba(255, 255, 255, 0.65)',
        padding: 4,
        width: "25%",
        height: niubi,
        overflow: "hidden"
      }}>
        <div>
          <p style={{
            backgroundColor: `#2B49C4`,
            color: '#fff',
            fontSize: 16,
            paddingLeft: 6
          }}>
            应急处理
            </p>
          <div style={{ marginLeft: 8 }}>
            <Button style={{ marginRight: "2%", textAlign: "center", fontSize: 10, marginLeft: "20%" }}>预设范围设置</Button>
            <Button style={{ fontSize: 10 }}>应急处理历史</Button>
            <Divider dashed />
          </div>
          <div>
            <span>部门 : </span>
            <Select
              showSearch
              style={{ width: "75%" }}
              placeholder="..."
              optionFilterProp="children"
              onChange={onChange}
              onFocus={onFocus}
              onBlur={onBlur}
              onSearch={onSearch}
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              <Option value="jack">xx社区</Option>
              <Option value="lucy">xx社区</Option>
              <Option value="tom">xx社区</Option>
            </Select>
          </div>
          <div style={{ marginTop: 6 }}>
            <span>地点 : </span>
            <Input style={{ width: "75%", height: 30 }} placeholder="..." />
          </div>
          <Button type="primary" style={{ fontSize: 15, width: 80, marginTop: 8, marginLeft: "10%" }}>搜索</Button>
          <div style={{ marginTop: 10 }}>
            <Table
              columns={columns}
              dataSource={data}
              pagination={false}
            />
          </div>
        </div>
      </div>
    )
  }
}

const Integrated = Form.create()(app);
export default Integrated;