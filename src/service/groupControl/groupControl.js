/*
 * @author: zhujunjie
 * @email: 1121883342@qq.com
 * @explain: 群组控制api
 * @date: 2021/06/21 21:38
 */

import axios from 'axios';
import moment from 'moment';
import { successMessage, errNotification } from '../utils.js';

// SendGroupCreateVerifyCodeEmail 创建群聊时向用户的邮箱发送验证码
export async function SendGroupCreateVerifyCodeEmail(token, useraccount) {
  var response = await axios({
    url: '/group/newgroupverificationcode',
    headers: {
      token: token,
      account: String(useraccount),
    },
    data: {
      useraccount: parseInt(useraccount),
    },
    method: 'post',
  }).catch(function (error) {
    if (error.response) {
      var responseerror = error.response;
      errNotification('发送验证码失败', responseerror.data.code, responseerror.data.message);
    }
  });

  if (typeof response === 'undefined') {
    return;
  }
  successMessage('已发送验证码至您的邮箱!');
}

// CreateNewGroup 创建新的群聊
export async function CreateNewGroup(token, useraccount, groupname, verificationcode, groupintro) {
  var response = await axios({
    url: '/group/group',
    data: {
      useraccount: parseInt(useraccount),
      groupname: groupname,
      verificationcode: verificationcode,
      groupintro: groupintro,
      createat: moment().format('YYYY-MM-DDTHH:mm:ssZ'),
    },
    headers: {
      account: String(useraccount),
      token: token,
    },
    method: 'post',
  }).catch(function (error) {
    if (error.response) {
      var responseerror = error.response;
      errNotification('创建群聊失败!', responseerror.data.code, responseerror.data.message);
      return;
    }
  });
  if (typeof response === 'undefined') {
    // errNotification('创建群聊失败!', 'unknow', '出现未知错误');
    return undefined;
  }
  successMessage('已成功创建群聊!');
  return true;
}

// QueryGroupInfo 查询群信息
export async function QueryGroupInfo(groupid) {
  var response = await axios({
    url: '/group/groupinfo/' + String(groupid),
    method: 'get',
  }).catch(function (error) {
    if (error.response) {
      var responseerror = error.response;
      errNotification('查询群信息失败!', responseerror.data.code, responseerror.data.message);
      return;
    }
  });

  if (typeof response === 'undefined') {
    return undefined;
  }

  return response.data.groupinfo;
}

// QueryGroupMemberInfo 查询群成员信息
export async function QueryGroupMemberInfo(groupid) {
  var response = await axios({
    url: '/group/groupmemberinfo/' + String(groupid),
    method: 'get',
  }).catch(function (error) {
    if (error.response) {
      var responseerror = error.response;
      errNotification('查询群成员信息失败!', responseerror.data.code, responseerror.data.message);
      return;
    }
  });

  if (typeof response === 'undefined') {
    return undefined;
  }
  // console.log(response.data);
  return response.data.groupmembers;
}

// UpdateGroupInfo 更新群资料 不包括头像
export async function UpdateGroupInfo(useraccount, token, groupid, groupname, groupintro) {
  var response = await axios({
    method: 'put',
    url: '/group/groupinfo',
    data: {
      useraccount: parseInt(useraccount),
      groupid: parseInt(groupid),
      groupname: groupname,
      groupintro,
    },
    headers: {
      account: String(useraccount),
      token: token,
    },
  }).catch(function (error) {
    if (error.response) {
      var responseerror = error.response;
      errNotification('更新群聊资料失败!', responseerror.data.code, responseerror.data.message);
      return;
    }
  });

  if (typeof response !== 'undefined') {
    successMessage(response.data.message);
  }
}

// UpdateGroupAvatar 更新群头像
export async function UpdateGroupAvatar(useraccount, token, groupid, groupavatar) {
  var response = await axios({
    method: 'put',
    url: '/group/groupavatar',
    data: {
      useraccount: parseInt(useraccount),
      groupid: parseInt(groupid),
      avatar: groupavatar,
    },
    headers: {
      token: token,
      account: String(useraccount),
    },
  }).catch(function (error) {
    if (error.response) {
      var responseerror = error.response;
      errNotification('更新群聊头像失败!', responseerror.data.code, responseerror.data.message);
      return;
    }
  });

  if (typeof response !== 'undefined') {
    successMessage(response.data.message);
  }
}

// UpdateUserNameInGroup 更新群内聊天昵称
export async function UpdateUserNameInGroup(useraccount, token, groupid, usernameingroup) {
  var response = await axios({
    method: 'put',
    url: '/group/usernameingroup',
    data: {
      useraccount: parseInt(useraccount),
      groupid: parseInt(groupid),
      usernameingroup: usernameingroup,
    },
    headers: {
      token: token,
      account: String(useraccount),
    },
  }).catch(function (error) {
    if (error.response) {
      var responseerror = error.response;
      errNotification('更新昵称失败!', responseerror.data.code, responseerror.data.message);
      return;
    }
  });

  if (typeof response !== 'undefined') {
    successMessage(response.data.message);
  }
}
