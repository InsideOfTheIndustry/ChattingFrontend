/*
 * @author: zhujunjie
 * @email: 1121883342@qq.com
 * @explain: 主页内容
 * @date: 2021/07/03 15:37
 */

import React from 'react';
import { Button, Row, Card, Divider, Popover, Col, Input } from 'antd';

class ContentHome extends React.Component {
  render() {
    return (
      <div>
        <Row justify='center'>感谢您使用Web Chtiting</Row>
        <Row justify='center'>
          <Card size='small' style={{ width: 500 }}>
            <p>使用过程中如发现什么问题，请联系开发者。</p>
            <p>开发者邮箱: 15968865116@163.com</p>
            <p>开发者qq:1121883342</p>
            <p>本项目github地址为: https://github.com/InsideOfTheIndustry</p>
          </Card>
        </Row>
      </div>
    );
  }
}

export default ContentHome;
