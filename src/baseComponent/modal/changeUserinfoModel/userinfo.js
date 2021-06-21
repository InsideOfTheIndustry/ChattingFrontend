/*
 * @author: zhujunjie
 * @email: 1121883342@qq.com
 * @explain: 修改用户信息的表格
 * @date: 2021/06/02 15:17
 */

import React from 'react';
import { Modal, Form, Input, Button, Row, Space, Select, InputNumber } from 'antd';

import PropTypes from 'prop-types';
import './index.css';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

class UserInfoEditModal extends React.Component {
  formRef = React.createRef();
  static propsTypes = {
    handleOnCancel: PropTypes.func,
    visible: PropTypes.bool,
    userinfo: PropTypes.object,
    updataInfo: PropTypes.func,
    onCancelEditUserinfoModal: PropTypes.func,
  };

  static defaultProps = {
    handleOnCancel() {},
    visible: false,
    userinfo: {},
    updataInfo() {},
    onCancelEditUserinfoModal() {},
  };
  constructor(props) {
    super(props);
    this.onEdit = this.onEdit.bind(this);
  }

  onEdit() {
    this.formRef.current.validateFields().then((value) => {
      this.props.updataInfo(value.signature, value.username, value.usersex, value.userage);
    });
  }
  render() {
    return (
      <Modal
        title='修改用户资料'
        visible={this.props.visible}
        footer={null}
        onCancel={this.props.onCancelEditUserinfoModal}
      >
        <div className={'changeuserinfobody'}>
          <Form
            {...layout}
            ref={this.formRef}
            initialValues={{
              username: this.props.userinfo.UserName,
              usersex: this.props.userinfo.UserSex,
              userage: this.props.userinfo.UserAge,
              signature: this.props.userinfo.Signature,
            }}
          >
            <Form.Item
              label='用户名'
              name='username'
              rules={[{ required: true, message: '请输入您的昵称!' }]}
            >
              <Input style={{ width: 180 }} />
            </Form.Item>
            <Form.Item label='个性签名' name='signature'>
              <Input style={{ width: 180 }} />
            </Form.Item>
            <Form.Item
              label='性别'
              name='usersex'
              rules={[{ required: true, message: '请输入您的性别!' }]}
            >
              <Select style={{ width: 180 }}>
                <Select.Option value={1}>男</Select.Option>
                <Select.Option value={0}>女</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              label='年龄'
              name='userage'
              rules={[{ required: true, message: '请输入您的年龄!' }]}
            >
              <InputNumber style={{ width: 180 }} />
            </Form.Item>
          </Form>{' '}
        </div>
        <Row justify='center'>
          <Button type='primary' onClick={this.onEdit}>
            修改信息
          </Button>
        </Row>
      </Modal>
    );
  }
}

export default UserInfoEditModal;
