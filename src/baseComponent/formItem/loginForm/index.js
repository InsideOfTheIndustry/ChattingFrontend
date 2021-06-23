/*
 * @author: zhujunjie
 * @email: 1121883342@qq.com
 * @explain: 登录表单
 * @date: 2021/04/25 10:51
 */

import React from 'react';
import { Link, withRouter } from 'react-router-dom';

import { Form, Input, Button, Space, Col, Row, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './index.css';
import { inject, Observer } from 'mobx-react';

// const history = useHistory();

@inject('userLoginStore')
@Observer
class LoginForm extends React.Component {
  loginFormRef = React.createRef();

  constructor(props) {
    super(props);

    this.state = {
      isLogin: false,
      account: '',
    };

    this.userLoginStore = this.props.userLoginStore;

    this.login = this.login.bind(this);
  }

  // 实现登录
  async login() {
    this.loginFormRef.current.validateFields().then(async (value) => {
      var response = await this.userLoginStore.UserLogin(value.account, value.password); // 获取登录结果
      if (typeof response === 'undefined') {
        return;
      }

      message.success('登录成功!');
      this.props.history.push({ pathname: '/Chatting/' + value.account });
    });
  }

  render() {
    return (
      <div>
        <Row>
          <Col span={5}></Col>
          <Col span={14}>
            <Form ref={this.loginFormRef} name='LoginForm'>
              <Form.Item name='account' rules={[{ required: true, message: '请输入账号！' }]}>
                <Input placeholder='输入账号' prefix={<UserOutlined />} />
              </Form.Item>
              <Form.Item name='password' rules={[{ required: true, message: '请输入密码！' }]}>
                <Input.Password placeholder='输入密码' prefix={<LockOutlined />} />
              </Form.Item>
            </Form>
          </Col>
          <Col span={5}></Col>
        </Row>
        <Space>
          <Button type='primary' shape='round' onClick={this.login}>
            登录
          </Button>
          <Button type='primary' shape='round'>
            <Link to='/Register'>注册</Link>
          </Button>
        </Space>
      </div>
    );
  }
}

export default withRouter(LoginForm);
