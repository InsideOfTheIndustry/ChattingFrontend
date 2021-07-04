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
  QueryGroupMemberInfo,
  QueryGroupInfo,
  UpdateGroupInfo,
  UpdateGroupAvatar,
  UpdateUserNameInGroup,
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

  @action
  async QueryGroupInfo(groupid) {
    return await QueryGroupInfo(groupid);
  }

  @action
  async QueryGroupMemberInfo(groupid) {
    var response = await QueryGroupMemberInfo(groupid);
    if (typeof response === 'undefined') {
      return response;
    } else {
      var groupmemberinfomap = {};
      var GroupMembers = response.GroupMembers;
      this.groupWithMemberList = GroupMembers;
      for (var i = 0; i < GroupMembers.length; i++) {
        groupmemberinfomap[GroupMembers[i].UserAccount] = GroupMembers[i];
      }
      // console.log(groupmemberinfomap);
      this.groupWithMember[groupid] = groupmemberinfomap;
      return response;
    }
  }

  @action
  async UpdateGroupInfo(useraccount, token, groupid, groupname, groupintro) {
    await UpdateGroupInfo(useraccount, token, groupid, groupname, groupintro);
  }

  @action
  async UpdateGroupAvatar(useraccount, token, groupid, groupavatar) {
    await UpdateGroupAvatar(useraccount, token, groupid, groupavatar);
  }

  @action
  async UpdateUserNameInGroup(useraccount, token, groupid, usernameingroup) {
    await UpdateUserNameInGroup(useraccount, token, groupid, usernameingroup);
  }
}

export default GroupStore;
