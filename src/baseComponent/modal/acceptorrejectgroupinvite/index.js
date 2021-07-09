/*
 * @author: zhujunjie
 * @email: 1121883342@qq.com
 * @explain: 好友添加信息确认框
 * @date: 2021/05/26 22:10
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'antd';
import { inject, observer } from 'mobx-react';

@inject('userLoginStore')
@inject('groupStore')
@observer
class AcceptOrNotForGroupInviteModal extends React.Component {
  static propsTypes = {
    visible: PropTypes.bool,
    userAccount: PropTypes.string,
    inviterAccount: PropTypes.string,
    handleOnCancel: PropTypes.func,
    acceptOrRejectRequest: PropTypes.func,
    groupid: PropTypes.string,
    inviterinfo: PropTypes.string,
    groupinfo: PropTypes.string,
  };

  static defaultProps = {
    visible: false,
    userAccount: '11',
    inviterAccount: '',
    handleOnCancel() {},
    acceptOrRejectRequest() {},
    groupid: '',
    inviterinfo: '',
    groupinfo: '',
  };

  constructor(props) {
    super(props);

    this.state = {
      acceptButton: false,
      rejectButton: false,
    };

    this.groupStore = this.props.groupStore;
    this.userStore = this.props.userLoginStore;

    this.accept = this.accept.bind(this);
    this.reject = this.reject.bind(this);
    this.handleOnCancel = this.handleOnCancel.bind(this);
  }

  accept() {
    var count = 3;
    this.setState({
      acceptButton: true,
    });
    this.props.acceptOrRejectRequest(true);
    var intervalVerificationCode = setInterval(() => {
      count -= 1;
      if (count <= 0) {
        clearInterval(intervalVerificationCode);
        this.setState({
          acceptButton: false,
        });
      }
    }, 1000);
  }

  reject() {
    var count = 3;
    this.setState({
      rejectButton: true,
    });
    this.props.acceptOrRejectRequest(false);
    var intervalVerificationCode = setInterval(() => {
      count -= 1;
      if (count <= 0) {
        clearInterval(intervalVerificationCode);
        this.setState({
          rejectButton: false,
        });
      }
    }, 1000);
  }

  handleOnCancel() {
    this.props.handleOnCancel(false);
  }

  render() {
    return (
      <Modal
        visible={this.props.visible}
        onCancel={this.handleOnCancel}
        footer={null}
        title='群聊邀请'
      >
        <p>
          {'用户' +
            this.props.inviterinfo +
            '邀请您进入群聊' +
            this.props.groupinfo +
            '，是否同意?'}
        </p>
        <Button type='primary' onClick={this.accept} disabled={this.state.acceptButton}>
          同意
        </Button>
        <Button type='dashed' onClick={this.reject} disabled={this.state.rejectButton}>
          拒绝
        </Button>
      </Modal>
    );
  }
}

export default AcceptOrNotForGroupInviteModal;
