/*
 * @author: zhujunjie
 * @email: 1121883342@qq.com
 * @explain: 登录界面
 * @date: 2021/04/24 11:47
 */

import React from 'react';

import './index.css';

import LoginForm from '../../../baseComponent/formItem/loginForm/index';

class LoginPage extends React.Component {
  render() {
    return (
      <div className={'loginPageFullStyle'}>
        <div className={'iconPosition'}></div>
        <div className={'loginformPostion'}>
          <h2 className={'loginText'}>Chatting账号登录</h2>
          <LoginForm></LoginForm>
        </div>
      </div>
    );
  }
}

export default LoginPage;
