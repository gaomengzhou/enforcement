import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';

@connect()
class Architecture extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {
    const imgUrl = require('../../assets/workjiaGou.jpg');
    return (
      <div>
        <Card style={{ width: `${100}%` }}>
          <img src={imgUrl} style={{ width: `${80}%` }} alt='尧化街道综合行政检查执法工作架构一览表' />
        </Card>
      </div>
    )
  }
}

export default Architecture;