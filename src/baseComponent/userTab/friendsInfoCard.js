/*
 * @author: zhujunjie
 * @email: 1121883342@qq.com
 * @explain: 显示好友信息的基本的信息卡片
 * @date: 2021/05/06 15:23
 */

import React from 'react';
import { Row, Col, Avatar, Space, Badge, Popover } from 'antd';
import { UserOutlined, SmileTwoTone, MehTwoTone } from '@ant-design/icons';
import './index.css';
import PropTypes from 'prop-types';

class CommonInfoCard extends React.Component {
  static propTypes = {
    avatarUrl: PropTypes.string,
    commonName: PropTypes.string,
    signature: PropTypes.string,
    commonAccount: PropTypes.string,
    openNewChattingModal: PropTypes.func, // 统一的双击后打开信息接口
    type: PropTypes.string,
    hasHoverCard: PropTypes.bool,
    messageList: PropTypes.array, // 对话信息列表
    ifHaveNewMessage: PropTypes.bool, // 是否有新消息
    unReadMessageCount: PropTypes.number, // 未读信息数目
    width: PropTypes.string,
    showonline: PropTypes.bool, // 是否显示在线情况 在头像上
    onlinestatus: PropTypes.bool, // 是否在线
  };

  static defaultProps = {
    avatarUrl: '',
    commonName: 'examplename',
    signature: '我要用所有美好的一切，换走迩伤心的泪水。',
    commonAccount: '11218883342',
    openNewChattingModal() {},
    type: 'messageList',
    hasHoverCard: false,
    messageList: [],
    ifHaveNewMessage: false,
    unReadMessageCount: 0,
    width: '300px',
    showonline: false,
    onlinestatus: false,
  };
  constructor(props) {
    super(props);

    this.state = {
      onHover: false,
    };
    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onDoubleClick = this.onDoubleClick.bind(this);
    this.renderTitle = this.renderTitle.bind(this);
  }

  // 鼠标移动到对应朋友框时 放大显示
  onMouseOver() {
    document.getElementById(this.props.commonAccount + this.props.type).style.height = '90px';
    document.getElementById(this.props.commonAccount + this.props.type).style.border =
      '1px solid blue';
    this.setState({
      onHover: true,
    });
  }

  // 鼠标移移开时 恢复原样
  onMouseLeave() {
    document.getElementById(this.props.commonAccount + this.props.type).style.height = '45px';
    document.getElementById(this.props.commonAccount + this.props.type).style.border = '';
    this.setState({
      onHover: false,
    });
  }

  // 双击调出对话框
  onDoubleClick() {
    this.props.openNewChattingModal(
      this.props.commonAccount,
      this.props.commonName,
      this.props.avatarUrl,
      this.props.messageList
    );
  }

  renderTitle() {
    return this.props.type === 'infoList' ? (
      <div>
        <font size={3}>{this.props.commonName}</font>
        <br></br>
        <font size={1}>{this.props.signature}</font>
        <br></br>
        <font size={1}>
          当前:
          {this.props.onlinestatus ? (
            <SmileTwoTone twoToneColor='green' style={{ fontSize: '20px' }} />
          ) : (
            <MehTwoTone twoToneColor='grey' style={{ fontSize: '20px' }} />
          )}
          {this.props.onlinestatus ? '在线' : '离线'}
        </font>
      </div>
    ) : (
      ''
    );
  }

  render() {
    return (
      <div>
        {this.props.hasHoverCard ? (
          <Popover placement='right' title={this.renderTitle} content={'welcome to my space'}>
            <div
              className={'singfriend'}
              onMouseOver={this.onMouseOver}
              onMouseLeave={this.onMouseLeave}
              onDoubleClick={() => this.onDoubleClick(this.props.commonAccount)}
              id={this.props.commonAccount + this.props.type}
              style={{ width: this.props.width }}
            >
              {this.state.onHover ? (
                <div className={'singfriendcontenthover'}>
                  <Row>
                    <Col span={4}>
                      <Avatar size='large' icon={<UserOutlined />} src={this.props.avatarUrl} />
                    </Col>
                    <Col span={20}>
                      <Row>
                        <font>{this.props.commonName}</font>
                      </Row>
                      <Row>
                        <font>
                          {this.props.signature.length > 10
                            ? this.props.signature.slice(0, 10) + '...'
                            : this.props.signature}
                        </font>
                        {this.props.unReadMessageCount === 0 ? (
                          ''
                        ) : (
                          <Badge count={this.props.unReadMessageCount} />
                        )}
                      </Row>
                    </Col>
                  </Row>
                </div>
              ) : (
                <div className={'singfriendcontentleave'}>
                  <Row>
                    <Col span={3}>
                      <Badge
                        offset={[0, 20]}
                        status={this.props.onlinestatus ? 'success' : 'default'}
                        size={100}
                      >
                        <Avatar size='small' icon={<UserOutlined />} src={this.props.avatarUrl} />
                      </Badge>
                    </Col>
                    <Col span={21}>
                      {this.props.unReadMessageCount === 0 ? (
                        <Row>
                          <Space>
                            <font>{this.props.commonName}</font>
                            <font>
                              {this.props.signature.length > 5
                                ? this.props.signature.slice(0, 5) + '...'
                                : this.props.signature}
                            </font>
                          </Space>
                        </Row>
                      ) : (
                        <Row>
                          <Col span={20}>
                            <Space>
                              <font>{this.props.commonName}</font>
                              <font>
                                {this.props.signature.length > 5
                                  ? this.props.signature.slice(0, 5) + '...'
                                  : this.props.signature}
                              </font>
                            </Space>
                          </Col>
                          <Col span={4}>
                            <Badge count={this.props.unReadMessageCount} />
                          </Col>
                        </Row>
                      )}
                    </Col>
                  </Row>
                </div>
              )}
            </div>
          </Popover>
        ) : (
          <div
            className={'singfriend'}
            onMouseOver={this.onMouseOver}
            onMouseLeave={this.onMouseLeave}
            onDoubleClick={() => this.onDoubleClick(this.props.commonAccount)}
            id={this.props.commonAccount + this.props.type}
          >
            {this.state.onHover ? (
              <div className={'singfriendcontenthover'}>
                <Row>
                  <Col span={4}>
                    <Avatar size='large' icon={<UserOutlined />} src={this.props.avatarUrl} />
                  </Col>
                  <Col span={20}>
                    <Row>
                      <font>{this.props.commonName}</font>
                    </Row>
                    <Row>
                      <font>
                        {this.props.signature.length > 10
                          ? this.props.signature.slice(0, 10) + '...'
                          : this.props.signature}
                      </font>
                      {this.props.unReadMessageCount === 0 ? (
                        ''
                      ) : (
                        <Badge count={this.props.unReadMessageCount} />
                      )}
                    </Row>
                  </Col>
                </Row>
              </div>
            ) : (
              <div className={'singfriendcontentleave'}>
                <Row>
                  <Col span={3}>
                    <Avatar size='small' icon={<UserOutlined />} src={this.props.avatarUrl} />
                  </Col>
                  <Col span={21}>
                    {this.props.unReadMessageCount === 0 ? (
                      <Row>
                        <Space>
                          <font>{this.props.commonName}</font>
                          <font>
                            {this.props.signature.length > 5
                              ? this.props.signature.slice(0, 5) + '...'
                              : this.props.signature}
                          </font>
                        </Space>
                      </Row>
                    ) : (
                      <Row>
                        <Col span={20}>
                          <Space>
                            <font>{this.props.commonName}</font>
                            <font>
                              {this.props.signature.length > 5
                                ? this.props.signature.slice(0, 5) + '...'
                                : this.props.signature}
                            </font>
                          </Space>
                        </Col>
                        <Col span={4}>
                          <Badge count={this.props.unReadMessageCount} />
                        </Col>
                      </Row>
                    )}
                  </Col>
                </Row>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default CommonInfoCard;
