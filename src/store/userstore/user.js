/*
 * @author: zhujunjie
 * @email: 1121883342@qq.com
 * @explain: 用户存储库
 * @date: 2021/04/25 15:02
 */

import { observable, action, makeObservable } from 'mobx';

import {
  UserLogin,
  SendVerificationCode,
  Register,
  GetUserInfo,
  GetUserFriendInfo,
  UpdateUserAvatar,
  UpdateUserInfo,
  GetUserGroupInfo,
} from '../../service/userControl/userControl';

class UserLoginStore {
  constructor() {
    makeObservable(this);
  }

  @observable
  token = ''; // token信息 登录后token不为空

  @observable
  friends = []; // 好友列表

  @observable
  userInfo = {}; // 用户信息

  @observable
  usergroup = []; // 用户群聊列表

  @action // 用户登录
  async UserLogin(useraccount, password) {
    var response = await UserLogin(useraccount, password);
    if (typeof response === 'undefined') {
      return undefined;
    }
    this.token = response.token;
    localStorage.setItem(String(useraccount) + 'token', response.token);
    return response;
  }

  @action
  async GetUserFriendInfo(token, useraccount) {
    var friendslist = await GetUserFriendInfo(token, useraccount);
    if (friendslist === null || friendslist === undefined) {
      this.friends = [];
    } else {
      this.friends = friendslist;
    }
  }

  @action
  async Register(username, useremail, userage, usersex, verificationcode, userpassword) {
    await Register(username, useremail, userage, usersex, verificationcode, userpassword);
  }

  @action
  async SendVerificationCode(email) {
    await SendVerificationCode(email);
  }

  @action
  async GetUserInfo(token, useraccount, searchUserint) {
    var response = await GetUserInfo(token, useraccount, searchUserint);
    if (typeof response === 'undefined') {
      return undefined;
    }
    if (String(useraccount) === String(searchUserint)) {
      this.userInfo = response;
    }
    return response;
  }

  @action
  async UpdateUserAvatar(token, useraccount, avatar) {
    var response = await UpdateUserAvatar(token, useraccount, avatar);
    return response;
  }

  @action
  async UpdateUserInfo(token, useraccount, signature, username, usersex, userage) {
    var response = await UpdateUserInfo(token, useraccount, signature, username, usersex, userage);

    return response;
  }

  @action
  async GetUserGroupInfo(token, useraccount) {
    var grouplist = await GetUserGroupInfo(token, useraccount);
    if (grouplist === null || grouplist === undefined) {
      this.usergroup = [];
    } else {
      this.usergroup = grouplist;
    }
  }
}

export default UserLoginStore;
