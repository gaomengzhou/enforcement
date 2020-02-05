import React, { Component } from 'react';
import {
  Form,
  Divider,
  Tabs,

} from 'antd';

import AssessmentOrder from "./AssessmentOrder.js";
import OnlineRate from "./OnlineRate.js";


const TabPane = Tabs.TabPane;
// const echarts = require('echarts');
// const echarts = require('https://echarts.baidu.com/dist/echarts.min.js');


class app extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  printDeparment() {
    window.print();
  }

  componentDidMount() {

  }

  render() {
    const printDeparmentForm = {
      printDeparment: this.printDeparment
    }
    return (
      <div id="listTitleContent" style={{ backgroundColor: "#fff", paddingRight: 18 }}>
        <h3 id="listTitle" style={{ paddingBottom: 6 }}>
          人员考核<Divider style={{ height: 2, backgroundColor: "black", margin: "12px 0" }} /></h3>
        <Tabs defaultActiveKey="1" type="card" size="default">
          <TabPane tab="在线率统计" key="1" >
            <OnlineRate {...printDeparmentForm}/>
          </TabPane>
          <TabPane tab="工单考核统计" key="2" >
            <AssessmentOrder {...printDeparmentForm} />
          </TabPane>
        </Tabs>
      </div>
    )
  }
}

const Track = Form.create()(app);
export default Track;