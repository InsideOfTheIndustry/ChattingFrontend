/*
 * @author: zhujunjie
 * @email: 1121883342@qq.com
 * @explain: 聊天气泡
 * @date: 2021/05/07 16:52
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Row, Avatar } from 'antd';
import { ExclamationOutlined } from '@ant-design/icons';
import './index.css';

class ChattingPop extends React.Component {
  static propsTypes = {
    userName: PropTypes.string,
    userAccount: PropTypes.string,
    message: PropTypes.string,
    ifFriend: PropTypes.bool,
    useravatar: PropTypes.string,
    friendavatar: PropTypes.string,
    sendSuccess: PropTypes.bool,
  };

  static defaultProps = {
    userName: '张三',
    userAccount: '100001',
    message: '聊天信息丢失...',
    ifFriend: false,
    useravatar: '',
    friendavatar: '',
    sendSuccess: true,
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        {this.props.ifFriend ? (
          <Row justify={'start'}>
            <div className={'chattingmessagefriend'}>
              <Avatar size={'large'} src={this.props.friendavatar}></Avatar>
              <div className={'chattingmessage'}>
                <div className={'chattingmessagename'}>{this.props.userName}</div>
                <div className={'chattingmessagepopfriend'}>{this.props.message}</div>
              </div>
            </div>
          </Row>
        ) : (
          <Row justify={'end'}>
            {this.props.sendSuccess ? (
              <div className={'chattingmessageme'}>
                <div className={'chattingmessagepopme'}>{this.props.message}</div>
                <div style={{ display: 'inline-block' }}>
                  <Avatar size={'large'} src={this.props.useravatar}></Avatar>
                </div>
              </div>
            ) : (
              <div className={'chattingmessageme'}>
                <ExclamationOutlined style={{ color: 'red', fontWeight: 'bolder' }} />
                <div className={'chattingmessagepopme'}>{this.props.message}</div>
                <div style={{ display: 'inline-block' }}>
                  <Avatar size={'large'} src={this.props.useravatar}></Avatar>
                </div>
              </div>
            )}
          </Row>
        )}
      </div>
    );
  }
}

export default ChattingPop;
