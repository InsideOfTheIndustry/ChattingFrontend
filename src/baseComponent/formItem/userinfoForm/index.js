/*
 * @author: zhujunjie
 * @email: 1121883342@qq.com
 * @explain: 通用用户信息卡片
 * @date: 2021/06/18 16:32
 */

import React from 'react';
import { Card, Avatar, Row, Col, Input, Space, Button } from 'antd';
import { UserOutlined, FormOutlined, HomeOutlined, SettingOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import './index.css';

class CommonInfoCard extends React.Component {
  static propTypes = {
    account: PropTypes.string,
    avatarUrl: PropTypes.string,
    signature: PropTypes.string,
    username: PropTypes.string,
    friendAccount: PropTypes.string,
    age: PropTypes.number,
    usersex: PropTypes.number,
    sendAddFriendRequest: PropTypes.func,
    buttonDisabled: PropTypes.bool,
    useronline: PropTypes.number,
  };

  static defaultProps = {
    account: '',
    avatarUrl: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    signature: '这是一段签名啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊。',
    username: 'Coward',
    friendAccount: '',
    usersex: 1,
    age: 19,
    sendAddFriendRequest() {},
    buttonDisabled: false,
    useronline: 0,
  };

  constructor(props) {
    super(props);
    this.state = {
      buttonDisabled: false,
    };

    this.addFriend = this.addFriend.bind(this);
  }

  // addFriend 添加好友 根据用户账号
  addFriend() {
    this.setState({
      buttonDisabled: true,
    });
    var token = localStorage.getItem(this.props.account + 'token');
    this.props.sendAddFriendRequest(
      3,
      token,
      '添加好友',
      this.props.account,
      this.props.friendAccount,
      ''
    );
    var count = 5;
    var intervalVerificationCode = setInterval(() => {
      count -= 1;
      if (count <= 0) {
        clearInterval(intervalVerificationCode);
        this.setState({
          buttonDisabled: false,
        });
      }
    }, 1000);
  }

  render() {
    return (
      <Card>
        <Row justify={'center'}>
          <Avatar size={60} icon={<UserOutlined />} src={this.props.avatarUrl} />
        </Row>
        <br></br>
        <Row>
          <Col span={6}>姓名:</Col>
          <Col span={18}>
            <font>{this.props.username}</font>
          </Col>
        </Row>
        <br></br>
        <Row>
          <Col span={6}>用户签名:</Col>
          <Col span={18}>{this.props.signature}</Col>
        </Row>
        <br></br>
        <Row>
          <Col span={6}>性别:</Col>
          <Col span={18}>{this.props.usersex === 1 ? '男' : '女'}</Col>
        </Row>
        <br></br>
        <Row>
          <Col span={6}>年龄:</Col>
          <Col span={18}>{this.props.age}</Col>
        </Row>
        <br></br>
        <Row>
          <Col span={6}>当前状态:</Col>
          <Col span={18}>{this.props.useronline === 1 ? '在线' : '离线'}</Col>
        </Row>
        <Row justify='center'>
          <Button
            type='primary'
            onClick={() => {
              this.addFriend();
            }}
            disabled={this.props.buttonDisabled || this.state.buttonDisabled}
          >
            添加好友
          </Button>
        </Row>
      </Card>
    );
  }
}

export default CommonInfoCard;
