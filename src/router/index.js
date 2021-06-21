/*
 * @author: zhujunjie
 * @email: 1121883342@qq.com
 * @explain: 前端文件路由
 * @date: 2021/04/24 19:15
 */

import Loadable from 'react-loadable';
import Loading from '../baseComponent/loading/index';

// 登录页
global.Login = Loadable({
  loader: () => import('../pages/userControl/login/index.js'),
  loading: Loading,
});

// 注册页
global.Register = Loadable({
  loader: () => import('../pages/userControl/register/index.js'),
  loading: Loading,
});

// 聊天主界面
global.Chatting = Loadable({
  loader: () => import('../pages/chattingPage/index.js'),
  loading: Loading,
});
