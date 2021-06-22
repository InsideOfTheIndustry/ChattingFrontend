/*
 * @author: zhujunjie
 * @email: 1121883342@qq.com
 * @explain: 群组信息存储
 * @date: 2021/06/21 21:50
 */

import { observable, action, makeObservable } from 'mobx';

import {
  SendGroupCreateVerifyCodeEmail,
  CreateNewGroup,
} from '../../service/groupControl/groupControl';

class GroupStore {
  constructor() {
    makeObservable(this);
  }

  @observable
  groupWithMember = {};

  @action
  async SendGroupCreateVerifyCodeEmail(token, useraccount) {
    await SendGroupCreateVerifyCodeEmail(token, useraccount);
  }

  @action
  async CreateNewGroup(token, useraccount, groupname, verificationcode, groupintro) {
    return await CreateNewGroup(token, useraccount, groupname, verificationcode, groupintro);
  }
}

export default GroupStore;
