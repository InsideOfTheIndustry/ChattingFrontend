/*
 * @author: zhujunjie
 * @email: 1121883342@qq.com
 * @explain:  组件加载样式
 * @date: 2021/04/24 20:09
 */

import React from 'react';
import { Spin } from 'antd';

class Loading extends React.Component {
  render() {
    return (
      <div>
        <Spin tip='加载中...'></Spin>
      </div>
    );
  }
}

export default Loading;
