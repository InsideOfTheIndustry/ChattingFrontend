/*
 * @author: zhujunjie
 * @email: 1121883342@qq.com
 * @explain:  改变用户头像对话框
 * @date: 2021/05/31 14:24
 */

import React from 'react';
import { Modal, Avatar, Upload, Button, Space, message } from 'antd';
import { UserOutlined, UploadOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import './index.css';

class ChangeAvatarModal extends React.Component {
  static propsTypes = {
    handleOnCancel: PropTypes.func,
    visible: PropTypes.bool,
    userAvatar: PropTypes.string,
    onUploadAvatar: PropTypes.func,
  };

  static defaultProps = {
    handleOnCancel() {},
    visible: false,
    userAvatar: '',
    onUploadAvatar() {},
  };
  constructor(props) {
    super(props);
    this.handleOnCancel = this.handleOnCancel.bind(this);
    this.beforeUpload = this.beforeUpload.bind(this);
    this.onUploadFile = this.onUploadFile.bind(this);
  }

  // 关闭改变头像的窗口
  handleOnCancel() {
    this.props.handleOnCancel();
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

  render() {
    return (
      <Modal
        visible={this.props.visible}
        onCancel={this.handleOnCancel}
        footer={null}
        title={'更改头像'}
        width={400}
      >
        <div className={'changeAvatarBody'}>
          <Space direction={'vertical'}>
            <Upload
              customRequest={this.onUploadFile}
              showUploadList={false}
              beforeUpload={this.beforeUpload}
            >
              <Button icon={<UploadOutlined />}>点击上传头像</Button>
            </Upload>
            <Avatar size={128} icon={<UserOutlined />} src={this.props.userAvatar} />
          </Space>
        </div>
      </Modal>
    );
  }
}

export default ChangeAvatarModal;
