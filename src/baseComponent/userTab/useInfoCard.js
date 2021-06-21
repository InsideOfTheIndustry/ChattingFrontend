/*
 * @author: zhujunjie
 * @email: 1121883342@qq.com
 * @explain: 用户信息
 * @date: 2021/05/06 10:40
 */

import React from 'react';
import { Card, Avatar, Row, Col, Input, Space, Button } from 'antd';
import {
  UserOutlined,
  FormOutlined,
  HomeOutlined,
  SettingOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import PropTypes from 'prop-types';
import './index.css';

class UserInfoCard extends React.Component {
  static propTypes = {
    avatarUrl: PropTypes.string,
    signature: PropTypes.string,
    username: PropTypes.string,
    usersex: PropTypes.number,
    onOpenChangeAvatar: PropTypes.func,
    onOpenEditUserinfoModal: PropTypes.func,
  };

  static defaultProps = {
    avatarUrl: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    signature: '这是一段签名。',
    username: 'Coward',
    usersex: 1,
    onOpenChangeAvatar() {},
    onOpenEditUserinfoModal() {},
  };

  constructor(props) {
    super(props);

    this.changeAvatar = this.changeAvatar.bind(this);
  }

  // 改变头像
  changeAvatar() {
    this.props.onOpenChangeAvatar();
  }

  render() {
    return (
      <Card style={{ height: 200, background: '#afdfe4' }}>
        <Row justify={'end'}>
          <Button
            icon={<FormOutlined />}
            type={'link'}
            onClick={this.props.onOpenEditUserinfoModal}
          >
            修改资料
          </Button>
          <Button icon={<MenuOutlined />} type={'link'}></Button>
        </Row>
        <Row>
          <Col span={6}>
            <div className={'friendinfoavatar'} onClick={this.changeAvatar}>
              <Avatar size={60} icon={<UserOutlined />} src={this.props.avatarUrl} />
            </div>
          </Col>
          <Col span={18}>
            <font size={5}>{this.props.username}</font>
            <br></br>
            {this.props.signature.length !== 0 ? (
              <font style={{ border: '1px solid black' }}>
                {this.props.signature.length > 10
                  ? this.props.signature.substring(0, 10) + '...'
                  : this.props.signature}
              </font>
            ) : (
              <font style={{ border: '0px solid black' }}>{this.props.signature}</font>
            )}
          </Col>
        </Row>
        <Row></Row>
        <Row justify={'end'}>
          <Space>
            <SettingOutlined />
            <HomeOutlined />
          </Space>
        </Row>
      </Card>
    );
  }
}

export default UserInfoCard;
