/*
 * @author: zhujunjie
 * @email: 1121883342@qq.com
 * @explain: 修改群资料对话框
 * @date: 2021/07/03 10:40
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Divider, Input, Button, Space, Row, message, Avatar, Upload } from 'antd';
import { UserOutlined, UploadOutlined } from '@ant-design/icons';
import './index.css';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
class EditGroupModal extends React.Component {
  formRef = React.createRef();
  static propsTypes = {
    groupId: PropTypes.string,
    userAccount: PropTypes.string,
    visible: PropTypes.bool,
    onCancel: PropTypes.func,
    groupinfo: PropTypes.object,
    updateGroupInfo: PropTypes.func,
    onUploadAvatar: PropTypes.func,
  };

  static defaultProps = {
    groupId: '',
    userAccount: '',
    visible: false,
    onCancel() {},
    groupinfo: { GroupName: '', GroupIntro: '' },
    updateGroupInfo() {},
    onUploadAvatar() {},
  };
  constructor(props) {
    super(props);

    this.state = {
      updateButton: false,
    };

    this.onUploadFile = this.onUploadFile.bind(this);
    this.beforeUpload = this.beforeUpload.bind(this);
    this.onEdit = this.onEdit.bind(this);
  }

  // 上传前先检查
  beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只支持jpg文件或png格式头像上传!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('您上传的头像文件过大!');
    }
  }

  // 上传头像文件
  onUploadFile(file) {
    var fileInfo = file.file;
    var reader = new FileReader();
    reader.readAsDataURL(fileInfo);

    // 上传 头像
    reader.onload = (e) => {
      this.props.onUploadAvatar(reader.result);
    };
  }

  onEdit() {
    this.setState({
      updateButton: true,
    });
    this.formRef.current.validateFields().then((value) => {
      this.props.updateGroupInfo(value.groupname, value.groupintro);
    });
    var count = 5;
    var intervalVerificationCode = setInterval(() => {
      count -= 1;
      if (count <= 0) {
        clearInterval(intervalVerificationCode);
        this.setState({
          updateButton: false,
        });
      }
    }, 1000);
  }

  render() {
    return (
      <Modal visible={this.props.visible} footer={null} onCancel={this.props.onCancel}>
        <div className={'changeuserinfobody'}>
          <Space direction={'vertical'}>
            <Avatar size={64} icon={<UserOutlined />} src={this.props.groupinfo.GroupAvatar} />
            <Upload
              customRequest={this.onUploadFile}
              showUploadList={false}
              beforeUpload={this.beforeUpload}
            >
              <Button icon={<UploadOutlined />}>点击上传群头像</Button>
            </Upload>

            <Form
              {...layout}
              ref={this.formRef}
              initialValues={{
                groupname: this.props.groupinfo.GroupName,
                groupintro: this.props.groupinfo.GroupIntro,
              }}
            >
              <Form.Item
                label='群聊名称'
                name='groupname'
                rules={[{ required: true, message: '请输入群聊名称!' }]}
              >
                <Input style={{ width: 180 }} />
              </Form.Item>
              <Form.Item label='群聊简介' name='groupintro'>
                <Input style={{ width: 180 }} />
              </Form.Item>
            </Form>
          </Space>
        </div>
        <Row justify='center'>
          <Button type='primary' onClick={this.onEdit} disabled={this.state.updateButton}>
            修改信息
          </Button>
        </Row>
      </Modal>
    );
  }
}

export default EditGroupModal;
