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
    url: '/user/newgroupverificationcode',
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
    url: '/user/group',
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
