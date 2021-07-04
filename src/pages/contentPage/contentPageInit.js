/*
 * @author: zhujunjie
 * @email: 1121883342@qq.com
 * @explain: 主页呈现内容路由
 * @date: 2021/07/04 19:09
 */

import React from 'react';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
class ContentPageRouter extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path='/' component={global.ContentHome}></Route>
        </Switch>
      </Router>
    );
  }
}

export default ContentPageRouter;
