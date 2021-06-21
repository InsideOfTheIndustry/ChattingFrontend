/*
 * @author: zhujunjie
 * @email: 1121883342@qq.com
 * @explain: 用户tab下部位的组件
 * @date: 2021/05/06 14:38
 */

import React from 'react';
import { Button, Space } from 'antd';
import { UserAddOutlined, UsergroupAddOutlined, TeamOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

class UserTabFoot extends React.Component {
  static propsTypes = {
    addfriendOnclick: PropTypes.func,
    createNewGroup: PropTypes.func,
    joinAGroup: PropTypes.func,
  };

  static defaultProps = {
    addfriendOnclick() {},
    createNewGroup() {},
    joinAGroup() {},
  };
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={'usertabfoot'}>
        <Space>
          <Button onClick={this.props.addfriendOnclick} type='primary' icon={<UserAddOutlined />}>
            添加好友
          </Button>
          <Button onClick={this.props.createNewGroup} type='primary' icon={<TeamOutlined />}>
            创建群
          </Button>
          <Button onClick={this.props.joinAGroup} type='primary' icon={<UsergroupAddOutlined />}>
            加入群
          </Button>
        </Space>
      </div>
    );
  }
}

export default UserTabFoot;
