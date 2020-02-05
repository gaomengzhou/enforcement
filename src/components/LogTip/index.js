import React, { PureComponent } from 'react';
import { Avatar, Dropdown, Badge, Icon, Menu, Button, Row, Col } from 'antd';
import styles from './index.less';
import LessModules from 'react-css-modules';
import router from 'umi/router';

@LessModules(styles, { allowMultiple: true })
class LogTip extends PureComponent {
  redirect = key => {
    switch (key) {
      //球
      case 'home':
        window.open('/yaohuaweb#/nav/first', '_self');
        break;
      case 'loginout':
        window.open('/yaohuaweb#/user/login', '_self');
        break;
      case 'back':
        window.open('/yaohuaweb#/nav/third', '_self');
        break;
    }
  };
  menu = () => (
    <Menu style={{ padding: 0 }}>
      <Menu.Item>
        <a rel="noopener noreferrer" onClick={this.redirect.bind(this, 'home')}>
          返回首页
        </a>
      </Menu.Item>
      <Menu.Item>
        <a rel="noopener noreferrer" onClick={this.redirect.bind(this, 'back')}>
          返回上级
        </a>
      </Menu.Item>
      <Menu.Item>
        <a rel="noopener noreferrer" onClick={this.redirect.bind(this, 'loginout')}>
          退出登录
        </a>
      </Menu.Item>
    </Menu>
  );
  render() {
    return (
      <div styleName="container">
        <div className="clearfix">
          <div styleName="line" style={{ padding: '2px' }}>
            <Avatar size={45} icon="user" />
          </div>
          <div styleName="line">
            <h3>{sessionStorage.getItem('lastname')}</h3>
            <h3>{`${new Date().getFullYear()}年${(new Date().getMonth() + 101 + '').substring(
              1,
              3
            )}月${(new Date().getDate() + 100 + '').substring(1, 3)}日`}</h3>
          </div>
        </div>
        <h3 style={{ padding: 6, marginTop: 10}}>用户：{sessionStorage.getItem('acount')}</h3>
        <Row style={{ marginTop: 10 }}>
          <Col span={8}>
            <Badge dot><Button style={{ width: 72, backgroundColor: '#46a2ec' ,fontSize: 12, color: '#FFF',border: 'none', padding: 6}}>消息提醒</Button></Badge>
          </Col>
          <Col span={8}>
            <Button style={{ width: 72, backgroundColor: '#46a2ec' ,fontSize: 12, color: '#FFF',border: 'none', padding: 6}}>修改密码</Button>
          </Col>
          <Col span={8}>
            <Dropdown overlay={this.menu()} placement="topLeft">
              <Button style={{ width: 66, backgroundColor: '#46a2ec' ,fontSize: 12, color: '#FFF',border: 'none', padding: 6}}>
                返回&nbsp;
                <Icon type="down" />
              </Button>
            </Dropdown>
          </Col>
        </Row>
      </div>
    );
  }
}

export default LogTip;
