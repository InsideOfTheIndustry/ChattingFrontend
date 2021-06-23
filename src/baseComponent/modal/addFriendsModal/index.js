/*
 * @author: zhujunjie
 * @email: 1121883342@qq.com
 * @explain: 添加用户对话框
 * @date: 2021/05/23 20:40
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Input, Modal, Divider, notification } from 'antd';
import { inject, observer } from 'mobx-react';
import CommonInfoCard from '../../formItem/userinfoForm/index';

const { Search } = Input;

@inject('userLoginStore')
@observer
class AddFriendModal extends React.Component {
  static propsTypes = {
    visible: PropTypes.bool,
    account: PropTypes.string,
    handleOnCancel: PropTypes.func,
    sendAddFriendRequest: PropTypes.func,
  };

  static defaultProps = {
    visible: false,
    account: '11',
    handleOnCancel() {},
    sendAddFriendRequest() {},
  };
  constructor(props) {
    super(props);

    this.state = {
      showinfo: false,
      userinfo: {},
    };

    this.userStore = this.props.userLoginStore;

    this.handleOnCancel = this.handleOnCancel.bind(this);
    this.onSearch = this.onSearch.bind(this);
  }

  // 取消操作
  handleOnCancel() {
    this.setState({
      showinfo: false,
      userinfo: {},
    });
    this.props.handleOnCancel();
  }
  // 搜索用户 以后做
  async onSearch(value) {
    var response = await this.userStore.GetUserInfo(
      localStorage.getItem(String(this.props.account) + 'token'),
      this.props.account,
      value
    );
    if (typeof response === 'undefined' || response.UserAccount === 0) {
      notification.error({
        message: 'Notification',
        description: '无此用户',
      });
      this.setState({
        showinfo: false,
      });
      return;
    }

    this.setState({
      buttonDisabled: false,
    });
    if (value === this.props.account) {
      this.setState({
        buttonDisabled: true,
      });
    }
    for (var i = 0; i < this.userStore.friends.length; i++) {
      if (this.userStore.friends[i].UserAccount === value) {
        this.setState({
          buttonDisabled: true,
        });
      }
    }
    this.setState({
      showinfo: true,
      userinfo: response,
    });
  }

  render() {
    const { userinfo, buttonDisabled } = this.state;
    console.log(userinfo);

    return (
      <Modal
        visible={this.props.visible}
        onCancel={this.handleOnCancel}
        footer={null}
        title='添加好友'
      >
        <Search
          id='searchinput'
          placeholder='输入查询对象账号'
          onSearch={this.onSearch}
          style={{ width: 200 }}
        />

        <Divider />
        {this.state.showinfo ? (
          <CommonInfoCard
            account={this.props.account}
            avatarUrl={userinfo.Avatar}
            signature={userinfo.Signature}
            username={userinfo.UserName}
            friendAccount={String(userinfo.UserAccount)}
            age={userinfo.UserAge}
            usersex={userinfo.UserSex}
            sendAddFriendRequest={this.props.sendAddFriendRequest}
            buttonDisabled={buttonDisabled}
            useronline={userinfo.Online}
          ></CommonInfoCard>
        ) : (
          ''
        )}
      </Modal>
    );
  }
}

export default AddFriendModal;
