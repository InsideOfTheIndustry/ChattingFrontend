/*
 * @author: zhujunjie
 * @email: 1121883342@qq.com
 * @explain: 注册表单
 * @date: 2021/04/25 10:51
 */
import React from 'react';
import { withRouter } from 'react-router-dom';
import { PropTypes } from 'prop-types';
import { PageHeader, Form, Input, Button, Row, Space, Select, InputNumber, message } from 'antd';
import './index.css';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

class RegisterForm extends React.Component {
  formRef = React.createRef();
  static propTypes = {
    register: PropTypes.func,
    sendVerificationcode: PropTypes.func,
  };
  static defaultProps = {
    register() {},
    sendVerificationcode() {},
  };
  constructor(props) {
    super(props);
    this.state = {
      buttonName: '获取验证码',
    };

    this.sendVerificationcode = this.sendVerificationcode.bind(this);
    this.register = this.register.bind(this);
    this.gobackToLogin = this.gobackToLogin.bind(this);
  }

  // 注册用户
  register() {
    this.formRef.current
      .validateFields()
      .then((value) => {
        this.props.register(
          value.username,
          value.useremail,
          value.userage,
          value.usersex,
          value.verificationcode,
          value.userpassword
        );
      })
      .catch((info) => {
        message.error({
          placement: 'bottomRight',
          message: '校验用户注册数据失败',
          description: '具体失败原因为：' + JSON.stringify(info.errorFields, null, 4),
        });
      });
  }

  // 发送验证码
  sendVerificationcode() {
    this.formRef.current
      .validateFields(['useremail'])
      .then((value) => {
        this.props.sendVerificationcode(value.useremail);
        var count = 60;
        var intervalVerificationCode = setInterval(() => {
          count -= 1;
          this.setState({
            buttonName: String(count) + 's后重新发送',
          });
          if (count <= 0) {
            clearInterval(intervalVerificationCode);
            this.setState({
              buttonName: '发送验证码',
            });
          }
        }, 1000);
      })
      .catch((info) => {
        message.error({
          placement: 'bottomRight',
          message: '邮箱验证失败',
          description: '具体失败原因为：' + JSON.stringify(info.errorFields, null, 4),
        });
      });
  }

  gobackToLogin() {
    this.props.history.push({ pathname: '/' });
  }
  render() {
    return (
      <div>
        <div>
          <PageHeader
            className='site-page-header'
            onBack={this.gobackToLogin}
            title={'返回登录界面'}
            subTitle=''
          />
        </div>
        <Form {...layout} ref={this.formRef}>
          <Form.Item
            label='邮箱'
            name='useremail'
            rules={[
              {
                required: true,
                message: '请输入您的邮箱!',
                pattern: /^[\w\-]+@[a-zA-Z\d\-]+(\.[a-zA-Z]{2,8}){1,2}$/,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label='用户名'
            name='username'
            rules={[{ required: true, message: '请输入您的昵称!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label='密码'
            name='userpassword'
            rules={[{ required: true, message: '请输入您的密码!' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label='性别'
            name='usersex'
            rules={[{ required: true, message: '请输入您的性别!' }]}
          >
            <Select style={{ width: 120 }}>
              <Select.Option value={1}>男</Select.Option>
              <Select.Option value={0}>女</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label='年龄'
            name='userage'
            rules={[{ required: true, message: '请输入您的年龄!' }]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            label='验证码'
            name='verificationcode'
            rules={[{ required: true, message: '请输入验证码！' }]}
          >
            <Space>
              <Input style={{ width: 220 }} />
              <Button type={'primary'} onClick={this.sendVerificationcode}>
                {this.state.buttonName}
              </Button>
            </Space>
          </Form.Item>
        </Form>
        <Row justify='center'>
          <Button type='primary' onClick={this.register}>
            注册
          </Button>
        </Row>
      </div>
    );
  }
}

export default withRouter(RegisterForm);
