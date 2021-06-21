/*
 * @author: zhujunjie
 * @email: 1121883342@qq.com
 * @explain: 注册界面
 * @date: 2021/04/24 11:47
 */

import React from 'react';
import RegisterForm from '../../../baseComponent/formItem/registerForm/index';
import { inject, Observer } from 'mobx-react';
import './index.css';

@inject('userLoginStore')
@Observer
class RegisterPage extends React.Component {
  constructor(props) {
    super(props);

    this.userstore = this.props.userLoginStore;
    this.register = this.register.bind(this);
    this.sendVerificationcode = this.sendVerificationcode.bind(this);
  }
  register(username, useremail, userage, usersex, verificationcode, userpassword) {
    this.userstore.Register(username, useremail, userage, usersex, verificationcode, userpassword);
  }
  sendVerificationcode(useremail) {
    this.userstore.SendVerificationCode(useremail);
  }
  render() {
    return (
      <div className={'registerPageFullStyle'}>
        <div className={'registerform'}>
          <RegisterForm
            register={this.register}
            sendVerificationcode={this.sendVerificationcode}
          ></RegisterForm>
        </div>
      </div>
    );
  }
}

export default RegisterPage;
