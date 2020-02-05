import React, { PureComponent } from 'react';
import { Icon, Divider } from 'antd';
import Link from 'umi/link';
import Debounce from 'lodash-decorators/debounce';
import styles from './index.less';
import RightContent from './RightContent';

export default class GlobalHeader extends PureComponent {
  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }
  /* eslint-disable*/
  @Debounce(600)
  triggerResizeEvent() {
    // eslint-disable-line
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }
  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  };
  render() {
    const { collapsed, isMobile, logo } = this.props;
    const tsIcon = require('../../../public/userHead.png');
    return (
      <div className={styles.header}>
        <Link to="/" className={styles.logo} key="logo">
          <div>
            <h1>综合执法</h1>
          </div>
        </Link>
        {/* <div className={styles.headerRight}>
          <div className={styles.headerRightName}>
            <span>admin</span>
            <span>政务服务管理员</span>
          </div>
          <div className={styles.headerRightHeader}>
            <img  src={tsIcon} alt="" />
          </div>
          <Divider type="vertical" style={{height:'36px',marginRight:'10px'}} />
          <div className={styles.headerRightName}>
            <Icon type="bell" style={{fontSize:'16px'}} />
          </div>
        </div> */}
      </div>
    );
  }
}
