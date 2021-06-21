/*
 * @author: zhujunjie
 * @email: 1121883342@qq.com
 * @explain: 全局内容引入 全局入口组件
 * @date: 2021/04/24 19:29
 */

import FullPageLayout from './layout/fullPageLayout/index';
import React from 'react';

// 全局路由配置文件
import './router/index';
import '../public/config';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import './service/Api';

// 样式文件引入
import 'antd/dist/antd.css';
import 'antd/dist/antd.min.css';
import 'antd/dist/antd.js';

class App extends React.Component {
  render() {
    return (
      <div>
        <HashRouter>
          <FullPageLayout></FullPageLayout>
        </HashRouter>
      </div>
    );
  }
}

export default App;
