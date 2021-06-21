/*
 * @author: zhujunjie
 * @email: 1121883342@qq.com
 * @explain: 好友添加信息确认框
 * @date: 2021/05/26 22:10
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Button, Input, Modal } from 'antd';

class AcceptFriendRequestModal extends React.Component {
  static propsTypes = {
    visible: PropTypes.bool,
    userAccount: PropTypes.string,
    handleOnCancel: PropTypes.func,
    acceptRequest: PropTypes.func,
    rejectRequest: PropTypes.func,
  };

  static defaultProps = {
    visible: false,
    userAccount: '11',
    handleOnCancel() {},
    acceptRequest() {},
    rejectRequest() {},
  };

  render() {
    return (
      <Modal
        visible={this.props.visible}
        onCancel={this.handleOnCancel}
        footer={null}
        title='添加好友'
      >
        <p>{'用户' + this.props.userAccount + '请求添加您为好友！，是否接收?'}</p>
        <Button type='primary' onClick={this.props.acceptRequest}>
          接受
        </Button>
        <Button type='dashed' onClick={this.props.rejectRequest}>
          拒绝
        </Button>
      </Modal>
    );
  }
}

export default AcceptFriendRequestModal;
