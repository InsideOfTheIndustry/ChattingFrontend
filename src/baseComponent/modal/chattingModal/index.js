/*
 * @author: zhujunjie
 * @email: 1121883342@qq.com
 * @explain: 用于聊天的聊天框
 * @date: 2021/05/07 09:27
 */

import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Modal, Tabs, Divider, Input, Button, Space, Row, message } from 'antd';
import ChattingPop from './chattingPop';
import './index.css';

const { TabPane } = Tabs;
const { TextArea } = Input;

class ChattingModal extends React.Component {
  static propsTypes = {
    handleOnCancel: PropTypes.func,
    onChangeChattingFriend: PropTypes.func,
    onRemoveOneChattingTab: PropTypes.func,
    handleOnOk: PropTypes.func,
    visible: PropTypes.bool,
    messageInTheChattingModal: PropTypes.object,
    avatarUrl: PropTypes.string,
    nowChattingFriend: PropTypes.string,
    websocketclient: PropTypes.object,
    userAccount: PropTypes.string,
  };

  static defaultProps = {
    handleOnCancel() {},
    handleOnOk() {},
    onRemoveOneChattingTab() {},
    onChangeChattingFriend() {},
    visible: false,
    messageInTheChattingModal: {},
    avatarUrl:
      'https://img-nos.yiyouliao.com/inforec-20210507-273518ceaa80bdcc4c9b2f5626ff6911.jpg?time=1620385882&signature=632C21F981722DF6A09E5954FBCDB9A1',
    nowChattingFriend: '11218842',
    websocketclient: {},
    userAccount: '',
  };

  constructor(props) {
    super(props);

    this.state = {
      textAreaMessage: '',
      activeTabKey: '',
    };
    this.handleOnCancel = this.handleOnCancel.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.renderScrollBar = this.renderScrollBar.bind(this);
    this.onChangeTab = this.onChangeTab.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.textAreaChange = this.textAreaChange.bind(this);
  }
  componentDidMount() {
    this.renderScrollBar();
  }
  componentDidUpdate() {
    this.renderScrollBar();
  }

  // 取消操作
  handleOnCancel() {
    this.props.handleOnCancel();
  }

  // 直接将滚动条拉到最低
  renderScrollBar() {
    var chattingposition = document.getElementById(
      this.props.nowChattingFriend + 'chattingposition'
    );
    if (chattingposition !== null) {
      chattingposition.scrollTop = chattingposition.scrollHeight;
      chattingposition.scrollIntoView();
    }
  }

  // 发送消息操作
  // 发送信息操作：需要 将聊天框窗体内容 更新，同时还需要 将信息列表内容 更新
  sendMessage(friendAccount) {
    var sendMessageItem = document.getElementById(friendAccount + 'message');
    var sendMessage = sendMessageItem.value;
    if (sendMessage === '') {
      this.setState({
        textAreaMessage: '',
      });
      return;
    }

    var nowTime = moment().format('YYYY-MM-DDTHH:mm:ssZ');
    if (this.props.websocketclient !== {}) {
      var index = friendAccount.substring(0, 5);

      if (index === 'group') {
        var groupid = friendAccount.substring(5);

        this.props.websocketclient.send(
          '{"messagetype":' +
            22 +
            ', "token": "' +
            localStorage.getItem(String(this.props.userAccount) + 'token') +
            '", "message": "' +
            sendMessage +
            '", "sender":"' +
            this.props.userAccount +
            '", "receiver":"",' +
            '"groupid":"' +
            groupid +
            '","time":"' +
            nowTime +
            '"}'
        );
      } else {
        this.props.websocketclient.send(
          '{"messagetype":' +
            2 +
            ', "token": "' +
            localStorage.getItem(String(this.props.userAccount) + 'token') +
            '", "message": "' +
            sendMessage +
            '", "sender":"' +
            this.props.userAccount +
            '", "receiver":"' +
            friendAccount +
            '","groupid":""' +
            ',"time":"' +
            nowTime +
            '"}'
        );
      }

      this.setState({
        textAreaMessage: '',
      });
    } else {
      // TODO:需要来个提示框 暗示没有连接
      message.error('您已断开连接');
    }
  }

  // 修改tabs时的回调，比如增加一个对话，或者删除一个对话
  onEdit(targetKey, action) {
    switch (action) {
      case 'remove':
        this.props.onRemoveOneChattingTab(targetKey);

        break;
      default:
        alert('未知操作');
    }
  }

  // 改变tab时触发的函数
  onChangeTab(activeKey) {
    this.props.onChangeChattingFriend(activeKey);
  }

  // 文本内容发生变化时的回调
  textAreaChange(e) {
    this.setState({
      textAreaMessage: e.target.value,
    });
  }

  render() {
    var messageInTheChattingModal = [];
    for (let key in this.props.messageInTheChattingModal) {
      messageInTheChattingModal.push(this.props.messageInTheChattingModal[key]);
    }

    return (
      <Modal visible={this.props.visible} onCancel={this.handleOnCancel} footer={null}>
        <Tabs
          hideAdd
          type='editable-card'
          onEdit={this.onEdit}
          activeKey={this.props.nowChattingFriend}
          onChange={this.onChangeTab}
        >
          {messageInTheChattingModal.map((pane) => {
            return (
              <TabPane
                tab={pane.friendName + '(' + pane.friendAccount + ')'}
                key={pane.friendAccount}
                closable={pane.closable}
              >
                <div className={'chattingarea'} id={pane.friendAccount + 'chattingposition'}>
                  {pane.chattingRecord.map((Record) => {
                    return (
                      <ChattingPop
                        userName={Record.userName}
                        userAccount={Record.userAccount}
                        message={Record.message}
                        ifFriend={Record.userAccount !== this.props.userAccount}
                        useravatar={this.props.avatarUrl}
                        friendavatar={Record.avatar}
                        sendSuccess={Record.sendSuccess}
                      ></ChattingPop>
                    );
                  })}
                </div>
                <Divider style={{ borderWidth: 2, borderColor: '#7cb305' }} />
                <div className={'inputarea'}>
                  <TextArea
                    style={{ height: 100 }}
                    bordered={false}
                    autoSize={{ minRows: 5, maxRows: 5 }}
                    id={pane.friendAccount + 'message'}
                    placeholder='请输入消息'
                    maxLength={100}
                    onChange={this.textAreaChange}
                    onPressEnter={(e) => {
                      e.preventDefault();
                      this.sendMessage(pane.friendAccount);
                    }}
                    value={this.state.textAreaMessage}
                  ></TextArea>
                  <div>
                    <Row justify={'end'}>
                      <Space>
                        <Button type='primary' size={'middle'} onClick={this.handleOnCancel} danger>
                          取消
                        </Button>
                        <Button
                          type='primary'
                          size={'middle'}
                          onClick={() => {
                            this.sendMessage(pane.friendAccount);
                          }}
                        >
                          发送
                        </Button>
                      </Space>
                    </Row>
                  </div>
                </div>
              </TabPane>
            );
          })}
        </Tabs>
      </Modal>
    );
  }
}

export default ChattingModal;
