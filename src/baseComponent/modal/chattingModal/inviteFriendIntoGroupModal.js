/*
 * @author: zhujunjie
 * @email: 1121883342@qq.com
 * @explain: 邀请好友入群对话框
 * @date: 2021/07/06 18:55
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Transfer, Row, message } from 'antd';
import moment from 'moment';

class InviteFriendIntoGroupModal extends React.Component {
  static propsTypes = {
    groupId: PropTypes.string,
    userAccount: PropTypes.string,
    visible: PropTypes.bool,
    onCancel: PropTypes.func,
    groupinfo: PropTypes.object,
    memberInGroup: PropTypes.object,
    updateGroupInfo: PropTypes.func,
    onUploadAvatar: PropTypes.func,
    userfriend: PropTypes.array,
    websocketclient: PropTypes.object,
  };

  static defaultProps = {
    groupId: '',
    userAccount: '',
    visible: false,
    memberInGroup: {},
    onCancel() {},
    groupinfo: { GroupName: '', GroupIntro: '' },
    updateGroupInfo() {},
    onUploadAvatar() {},
    userfriend: [],
    websocketclient: {},
  };
  constructor(props) {
    super(props);

    this.state = {
      targetKeys: [],
    };

    this.handleChange = this.handleChange.bind(this);
    this.sendInviteRequest = this.sendInviteRequest.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  // 元素转移
  handleChange(targetKeys, direction, moveKeys) {
    console.log(targetKeys);
    this.setState({
      targetKeys: targetKeys,
    });
  }

  // 搜索过滤情况
  filterOption(inputValue, option) {
    var Item = option.UserName;
    var AccountItem = option.UserAccount;

    return Item.search(inputValue) > -1 || AccountItem.search(inputValue) > -1;
  }

  // 发起邀请请求
  sendInviteRequest() {
    if (this.state.targetKeys.length === 0) {
      message.error('邀请对象为空');
      return;
    }
    var lengthn = this.state.targetKeys.length;
    var stringlist = '';
    for (var i = 0; i < lengthn - 1; i++) {
      stringlist = stringlist + this.state.targetKeys[i] + ',';
    }
    stringlist = stringlist + this.state.targetKeys[lengthn - 1];

    // 发送邀请信息
    var nowTime = moment().format('YYYY-MM-DDTHH:mm:ssZ');
    this.props.websocketclient.send(
      '{"messagetype":' +
        6 +
        ', "token": "' +
        localStorage.getItem(String(this.props.userAccount) + 'token') +
        '", "message": "' +
        stringlist +
        '", "sender":"' +
        this.props.userAccount +
        '", "receiver":""' +
        ',"groupid":"' +
        this.props.groupId +
        '","time":"' +
        nowTime +
        '"}'
    );
    this.setState({
      targetKeys: [],
    });
    this.props.onCancel();
  }

  onCancel() {
    this.setState({
      targetKeys: [],
    });
    this.props.onCancel();
  }

  render() {
    var friendlist = [];
    for (var i = 0; i < this.props.userfriend.length; i++) {
      var friend = this.props.userfriend[i];
      if (this.props.memberInGroup[friend.UserAccount] === undefined) {
        friend.disabled = false;
      } else {
        friend.disabled = true;
      }
      friendlist.push(friend);
    }
    return (
      <Modal visible={this.props.visible} footer={null} onCancel={this.onCancel} width={600}>
        <Transfer
          dataSource={friendlist}
          showSearch
          filterOption={this.filterOption}
          targetKeys={this.state.targetKeys}
          onChange={this.handleChange}
          onSearch={this.handleSearch}
          rowKey={(record) => record.UserAccount}
          render={(item) => item.UserName + '(' + item.UserAccount + ')'}
          listStyle={{
            width: 250,
            height: 500,
          }}
        />
        <br></br>
        <Row justify='center'>
          <Button onClick={this.sendInviteRequest}>确定</Button>
        </Row>
      </Modal>
    );
  }
}

export default InviteFriendIntoGroupModal;
