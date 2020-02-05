import React, { Component } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import {
  Layout,
  Row,
  Col,
  Form,
  Input,
  Checkbox,
  Select,
  Button,
  DatePicker,
  Table,
  Radio,
  Tree,
  Modal,
  Icon,
  Pagination,
  Tabs,
  message,
  Breadcrumb,
  Divider,
} from 'antd';
import moment from 'moment';

const { TreeNode } = Tree;
const FormItem = Form.Item;

@connect(({ departmodels, loading }) => ({
  departmodels,
  loading: loading.models.departmodels,
}))
class app extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedNodes: [],
      selected: false,
      treeList: [],
    };
  }
  componentDidMount() {
    this.getTreeList();
  }
  onSelect = (selectedKeys, info) => {
    this.setState({
      selectedNodes: info.selectedNodes[0].props.dataRef,
      selected: info.selectedNodes[0].props.dataRef.enforcement,
    })
  };
  onChange = (e) => {
    this.setState({
      selected: e.target.checked,
    })
  }
  // 获取tree数据
  getTreeList() {
    const { dispatch } = this.props;
    dispatch({
      type: 'departmodels/getTreeList',
      payload: {},
      callback: res => {
        if (res) {
          this.setState(() => {
            let arr = [];
            arr.push(res.data);
            return { treeList: arr, }
          })
        }
      },
    });
  }
  //提交
  submintList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'departmodels/submintList',
      payload: {
        "id": this.state.selectedNodes.id,
        "orgName": this.state.selectedNodes.orgName,
        "orgNote": this.state.selectedNodes.leafNode,
        "isLeader": this.state.selectedNodes.leader,
        "isCommunity": this.state.selectedNodes.community,
        "pId": this.state.selectedNodes.pId,
        "isEnforcement": this.state.selected,
      },
      callback: res => {
        if (res) {
          if (res.retCode == 1) {
            this.getTreeList();
            message.success('操作成功');
          } else {
            message.error(res.retMsg);
          }
        }
      },
    });
  }
  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.orgName} key={item.orgCode} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      } else {
        return (
          <TreeNode title={item.orgName} key={item.id} dataRef={item}>
          </TreeNode>
        );
      }
      return <TreeNode {...item} />;
    });
  render() {
    const {
      selectedNodes,
      treeList,
    } = this.state;
    const {

    } = this.props;
    return (
      <div>
        <div id="listTable">
          <Row>
            <Col span={24}>
              <Col span={7} style={{ overflowY: "auto", height: "500px", background: " rgb(255, 255, 255)", padding: "15px", boxShadow: "rgba(59, 1, 0, 0.2) 0px 5px 5px 0px" }}>
                <h3 style={{ fontWeight: "700" }}>名称</h3>
                <Divider dashed />
                {console.log(treeList)}
                <Tree showLine
                  onSelect={this.onSelect}
                >
                  {this.renderTreeNodes(treeList)}
                </Tree>
              </Col>
              <Col span={16} style={{ height: "400px", marginLeft: '30px', background: "rgb(255, 255, 255)", padding: "15px", boxShadow: "rgba(59, 1, 0, 0.2) 0px 5px 5px 0px" }}>
                <h3 style={{ fontWeight: "700" }}>{selectedNodes.orgName}</h3>
                <Divider dashed />
                <Checkbox
                  onChange={this.onChange}
                  checked={this.state.selected}
                >
                  是否为综合执法工单以及相关统计所关联的部门
                        </Checkbox>
                <Col push={19} style={{ marginTop: '200px' }}>
                  <Button type="primary" onClick={this.submintList} >
                    确定
                        </Button>
                </Col>
              </Col>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

const departBody = Form.create()(app);
export default departBody;
