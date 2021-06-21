/*
 * @author: zhujunjie
 * @email: 1121883342@qq.com
 * @explain: 创建群聊时使用的对话框
 * @date: 2021/06/19 20:14
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Input, Button, Space, Row, Form } from 'antd';
import './index.css';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

class CreateNewGroupModal extends React.Component {
  formRef = React.createRef();
  static propsTypes = {
    visible: PropTypes.bool,
    handleOnCancel: PropTypes.func,
  };

  static defaultProps = {
    visible: false,
    handleOnCancel() {},
  };

  constructor(props) {
    super(props);
    this.state = {
      buttonName: '获取验证码',
    };

    this.handleOnCancel = this.handleOnCancel.bind(this);
  }

  handleOnCancel() {
    this.props.handleOnCancel();
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

  render() {
    return (
      <Modal visible={this.props.visible} onCancel={this.handleOnCancel} footer={null}>
        <div className={'newgroup'}>
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
              label='群名称'
              name='username'
              rules={[{ required: true, message: '请输入群聊名称!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label='群简介'
              name='userintro'
              rules={[{ required: true, message: '请输入群聊简介!' }]}
            >
              <Input />
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
              创建
            </Button>
          </Row>
        </div>
      </Modal>
    );
  }
}

export default CreateNewGroupModal;
