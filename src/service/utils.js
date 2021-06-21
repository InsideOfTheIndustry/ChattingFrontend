/*
 * @author: zhujunjie
 * @email: 1121883342@qq.com
 * @explain: 消息提示
 * @date: 2021/05/19 11:10
 */

import { notification, message } from 'antd';

const successMessageDuration = 3; // 成功消息显示时长(单位为秒)

export function errNotification(title, code, message) {
  notification.error({
    title: title,
    description: '错误码: ' + code + ' 失败原因: ' + message,
    placement: 'bottomRight',
  });
}

export function successMessage(content) {
  message.success({
    content: content,
    duration: successMessageDuration,
  });
}
