/*
 * @author: zhujunjie
 * @email: 1121883342@qq.com
 * @explain: 入口文件
 * @date: 2021/04/24 19:31
 */

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'mobx-react';
import { stores } from './store/index';

ReactDOM.render(
  <React.StrictMode>
    <Provider {...stores}>
      <App></App>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
