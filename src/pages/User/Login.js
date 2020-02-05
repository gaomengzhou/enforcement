import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Input,  Button, } from 'antd';
const FormItem = Form.Item;
@connect(({ login, }) => ({
  login,
}))
@Form.create()
class LoginPage extends Component {
  loginIn(){
    const {form,dispatch} = this.props;
    form.validateFields((err, values) => {
      if(!err){
        dispatch({
          type:'login/loginInFetch',
          payload:values,
        })
      }
    })
  }
render(){
    const { getFieldDecorator } = this.props.form;
    return (
      <div id="loginContent">
        <Form layout="inline" style={{ paddingTop: 20,textAlign:'center'}}>
          <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
            <Col md={24} sm={24}>
              <FormItem label="用户名">
                {getFieldDecorator('username', {
                  rules: [
                    {
                      required: false,
                      message: '',
                    },
                  ],
                })(
                  <Input placeholder="请输入" />
                )}
              </FormItem>
            </Col>
            <Col md={24} sm={24}>
              <FormItem label="密码">
                {getFieldDecorator('password', {
                  rules: [
                    {
                      required: false,
                      message: '',
                    },
                  ],
                })(
                  <Input placeholder="请输入" />
                )}
              </FormItem>
            </Col>
            <Col md={24} sm={24}>
              <Button type="primary" onClick={this.loginIn.bind(this)}>
                登录
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

export default LoginPage;
