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
    userAccount: PropTypes.string,
    createNewGroup: PropTypes.func,
  };

  static defaultProps = {
    visible: false,
    handleOnCancel() {},
    userAccount: '',
    createNewGroup() {},
  };

  constructor(props) {
    super(props);
    this.state = {
      buttonName: '获取验证码',
    };

    this.handleOnCancel = this.handleOnCancel.bind(this);
    this.sendVerificationcode = this.sendVerificationcode.bind(this);
    this.createNewGroup = this.createNewGroup.bind(this);
  }

  handleOnCancel() {
    this.props.handleOnCancel();
  }

  // 发送验证码
  sendVerificationcode() {
    this.props.sendVerificationcode(this.props.userAccount);
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
  }

  // 创建群聊
  createNewGroup() {
    this.formRef.current.validateFields().then((value) => {
      this.props.createNewGroup(
        this.props.userAccount,
        value.groupname,
        value.verificationcode,
        value.groupintro
      );
    });
  }

  render() {
    return (
      <Modal visible={this.props.visible} onCancel={this.handleOnCancel} footer={null}>
        <div className={'newgroup'}>
          <Form {...layout} ref={this.formRef}>
            <Form.Item
              label='群名称'
              name='groupname'
              rules={[{ required: true, message: '请输入群聊名称!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label='群简介'
              name='groupintro'
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
            <Button type='primary' onClick={this.createNewGroup}>
              创建
            </Button>
          </Row>
        </div>
      </Modal>
    );
  }
}

export default CreateNewGroupModal;
