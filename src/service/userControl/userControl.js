/*
 * @author: zhujunjie
 * @email: 1121883342@qq.com
 * @explain: 用户控制相关api
 * @date: 2021/04/25 13:56
 */

import axios from 'axios';
import { successMessage, errNotification } from '../utils.js';
import sha256 from 'crypto-js/sha256';
import hmacSHA512 from 'crypto-js/hmac-sha512';
import Base64 from 'crypto-js/enc-base64';
import { notification } from 'antd';
import { formatTimeStr } from 'antd/lib/statistic/utils';

// 用户登录api
export async function UserLogin(useraccount, userpassword) {
  // 密码加密
  var sha256userpassword = sha256(userpassword);
  var sha256userpasswordfinal = Base64.stringify(
    hmacSHA512(sha256userpassword, window.apiConfig.PrivateKey)
  );

  var response = await axios({
    url: '/user/login',
    data: {
      useraccount: parseInt(useraccount),
      userpassword: sha256userpasswordfinal,
    },
    method: 'post',
  }).catch(function (error) {
    if (error.response) {
      var responseerror = error.response.data;
      errNotification('登录失败!', responseerror.code, responseerror.message);
    }
  });
  if (typeof response === 'undefined') {
    return undefined;
  }

  return {
    token: response.data.token,
    message: response.data.message,
    statuscode: response.data.statuscode,
  };
}

//Register 用户注册
export async function Register(
  username,
  useremail,
  userage,
  usersex,
  verificationcode,
  userpassword
) {
  // 密码先加密
  var sha256userpassword = sha256(userpassword);
  var sha256userpasswordfinal = Base64.stringify(
    hmacSHA512(sha256userpassword, window.apiConfig.PrivateKey)
  );
  var response = await axios({
    method: 'post',
    data: {
      username: username,
      useremail: useremail,
      userage: userage,
      usersex: usersex,
      verificationcode: verificationcode,
      userpassword: sha256userpasswordfinal,
    },
    url: '/user/register',
  }).catch(function (error) {
    if (error.response) {
      var responseerror = error.response;
      errNotification('注册失败!', responseerror.data.code, responseerror.data.message);
    }
  });
  if (typeof response === 'undefined') {
    return undefined;
  }
  successMessage(response.data.message);

  return response.data;
}

// SendVerificationCode 发送邮箱验证码
export async function SendVerificationCode(email) {
  var response = await axios({
    method: 'post',
    data: {
      useremail: email,
    },
    url: '/user/verificationcode',
  }).catch(function (error) {
    //TODO： 错误处理需要完善
    if (error.response) {
      var responseerror = error.response;
      errNotification('发送验证码失败！', responseerror.data.code, responseerror.data.message);
    }
  });
  if (typeof response === 'undefined') {
    return;
  }
  successMessage(response.data.message);
}

// GetUserInfo  获取用户信息
export async function GetUserInfo(token, useraccount, searchUser) {
  var searchUserint = parseInt(searchUser);
  var response = await axios({
    method: 'post',
    data: {
      useraccount: searchUserint,
    },
    headers: {
      token: token,
      account: String(useraccount),
    },
    url: '/user/userinfo',
  }).catch(function (error) {
    if (error.response) {
      var responseerror = error.response;
      errNotification('请求用户信息失败！', responseerror.data.code, responseerror.data.message);
    }
  });

  if (typeof response === 'undefined') {
    return undefined;
  }

  var data = response.data.userinfo;
  return data;
}

// GetUserFriendInfo 获取用户好友信息
export async function GetUserFriendInfo(token, useraccount) {
  var useraccountint = parseInt(useraccount);
  var response = await axios({
    url: '/user/userfriend',
    method: 'post',
    headers: {
      token: token,
      account: String(useraccount),
    },
    data: {
      useraccount: useraccountint,
    },
  }).catch(function (error) {
    if (error.response) {
      var responseerror = error.response;
      errNotification(
        '获取用户好友列表失败！',
        responseerror.data.code,
        responseerror.data.message
      );
    }
  });
  if (typeof response === 'undefined') {
    return undefined;
  }
  var data = response.data;
  if (data.friends === null) {
    return data.friends;
  }
  for (var i = 0; i < data.friends.length; i++) {
    data.friends[i].UserAccount = String(data.friends[i].UserAccount);
  }
  return data.friends;
}

// GetUserGroupInfo 获取用户群聊信息
export async function GetUserGroupInfo(token, useraccount) {
  var useraccountint = parseInt(useraccount);
  var response = await axios({
    url: '/user/usergroup',
    method: 'post',
    headers: {
      token: token,
      account: String(useraccount),
    },
    data: {
      useraccount: useraccountint,
    },
  }).catch(function (error) {
    if (error.response) {
      var responseerror = error.response;
      errNotification(
        '获取用户群聊信息失败！',
        responseerror.data.code,
        responseerror.data.message
      );
    }
  });
  if (typeof response === 'undefined') {
    return undefined;
  }
  var data = response.data;
  if (data.groupinfo === null) {
    return data.groupinfo;
  }

  for (var i = 0; i < data.groupinfo.length; i++) {
    data.groupinfo[i].Groupid = String(data.groupinfo[i].Groupid);
  }

  return data.groupinfo;
}

// UpdateUserAvatar 修改用户的头像
export async function UpdateUserAvatar(token, useraccount, avatar) {
  var response = await axios({
    url: '/user/useravatar',
    method: 'put',
    data: {
      useraccount: parseInt(useraccount),
      avatar: String(avatar),
    },
    headers: {
      token: token,
      account: String(useraccount),
    },
  }).catch(function (error) {
    if (error.response) {
      var responseerror = error.response;
      errNotification('上传头像失败!', responseerror.data.code, responseerror.data.message);
    }
  });

  if (typeof response === 'undefined') {
    return undefined;
  }

  return response.data.avatar;
}

// UpdateUserInfo 修改用户的信息
export async function UpdateUserInfo(token, useraccount, signature, username, usersex, userage) {
  var response = await axios({
    url: '/user/userinfo',
    method: 'put',
    data: {
      useraccount: parseInt(useraccount),
      signature: signature,
      username: username,
      usersex: parseInt(usersex),
      userage: parseInt(userage),
    },
    headers: {
      token: token,
      account: String(useraccount),
    },
  }).catch(function (error) {
    if (error.response) {
      var responseerror = error.response;
      errNotification('更新用户信息失败!', responseerror.data.code, responseerror.data.message);
    }
  });

  if (typeof response === 'undefined') {
    return undefined;
  }

  return response.data.userinfo;
}
