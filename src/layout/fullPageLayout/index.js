/*
 * @author: zhujunjie
 * @email: 1121883342@qq.com
 * @explain: 整页内容页面的路由控制
 * @date: 2021/04/24 19:22
 */

import React from 'react';
import { Switch, Route } from 'react-router-dom';

class FullPageLayout extends React.Component {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path='/' component={global.Login} />
          <Route exact path='/Register' component={global.Register} />
          <Route path='/Chatting' component={global.Chatting} />
        </Switch>
      </div>
    );
  }
}

export default FullPageLayout;
