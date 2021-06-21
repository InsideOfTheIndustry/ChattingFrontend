/*
 * @author: zhujunjie
 * @email: 1121883342@qq.com
 * @explain: 用户显示好友的tab
 * @date: 2021/05/06 09:33
 */
import React from 'react';
import { Input, Tabs, Badge, Collapse } from 'antd';
import PropTypes, { bool } from 'prop-types';
import { UserOutlined } from '@ant-design/icons';
import CommonInfoCard from './friendsInfoCard';
import './index.css';
import { inject, Observer } from 'mobx-react';

const { Search } = Input;
const { TabPane } = Tabs;
const { Panel } = Collapse;

// 朋友信息字段
// Avatar: "xxx"
// Signature: "保护环境人人有责"
// UserAccount: 100004
// UserAge: 18
// UserEmail: ""
// UserName: "捡垃圾小猪"
// UserPassword: ""
// UserSex: 1

@inject('userLoginStore')
@Observer
class UserTab extends React.Component {
  static propsType = {
    messageOfAllChatting: PropTypes.object, // 正在联系的朋友们，包括发给你消息的以及你发出消息的。
    friendsinfo: PropTypes.array, // 朋友信息
    groupinfo: PropTypes.array, // 朋友信息
    friendRequestList: PropTypes.array, // 好友请求信息列表
    haveNewRequestMessage: bool, // 是否有新的好友请求信息
    acceptOrReject: PropTypes.func, // 最终统一 但是这儿需要加以区分
    openNewChattingModal: PropTypes.func,
  };

  static defaultProps = {
    messageOfAllChatting: {},
    friendsinfo: [],
    groupinfo: [],
    friendRequestList: [],
    acceptOrReject() {},
    openNewChattingModal() {},
  };
  constructor(props) {
    super(props);

    this.state = {
      activeKey: 'friendList',
    };

    this.tabChange = this.tabChange.bind(this);
  }

  // tab界面切换时的回调函数
  tabChange(activeKey) {
    this.setState({
      activeKey: activeKey,
    });
  }

  render() {
    var messageOfAllChatting = [];
    var friendRequestList = [];
    var haveNewMessage = false;
    for (let key in this.props.messageOfAllChatting) {
      if (this.props.messageOfAllChatting[key].ifHaveNewMessage === true) {
        haveNewMessage = true;
      }
      messageOfAllChatting.push(this.props.messageOfAllChatting[key]);
    }

    // 排序最后需要换成时间
    messageOfAllChatting.sort(function (a, b) {
      return b.unReadMessageCount - a.unReadMessageCount;
    });

    for (let key in this.props.friendRequestList) {
      friendRequestList.push({
        userAccount: key,
        sendTime: this.props.friendRequestList[key].sendTime,
        friendCode: this.props.friendRequestList[key].friendCode,
      });
    }
    // 排序最后需要换成时间
    friendRequestList.sort(function (a, b) {
      return b.sendTime - a.sendTime;
    });
    var onlinefriend = [];
    var notonlinefriend = [];
    for (var i = 0; i < this.props.friendsinfo.length; i++) {
      if (this.props.friendsinfo[i].Online === 0) {
        notonlinefriend.push(this.props.friendsinfo[i]);
      } else {
        onlinefriend.push(this.props.friendsinfo[i]);
      }
    }

    return (
      <div className={'friendsmaincontent'}>
        <Search placeholder='搜索好友' />
        <Tabs
          defaultActiveKey='friendList'
          onChange={this.tabChange}
          centered={true}
          activeKey={this.state.activeKey}
          tabBarStyle={{ width: 300 }}
          tabBarGutter={20}
        >
          <TabPane
            tab='联系人'
            key='friendList'
            style={{ width: 300, minHeight: 400, overflow: 'auto' }}
          >
            <div className={'subtab'}>
              <Collapse>
                <Panel header='好友列表' key='friendlist'>
                  {onlinefriend.map((item) => {
                    return (
                      <CommonInfoCard
                        width={'266px'}
                        avatarUrl={item.Avatar}
                        commonName={item.UserName}
                        signature={item.Signature}
                        openNewChattingModal={this.props.openNewChattingModal}
                        commonAccount={item.UserAccount}
                        messageList={[]}
                        type={'infoList'}
                        onlinestatus={true}
                        showonline={true}
                        hasHoverCard={true}
                      ></CommonInfoCard>
                    );
                  })}
                  {notonlinefriend.map((item) => {
                    return (
                      <CommonInfoCard
                        width={'266px'}
                        avatarUrl={item.Avatar}
                        commonName={item.UserName}
                        signature={item.Signature}
                        openNewChattingModal={this.props.openNewChattingModal}
                        commonAccount={item.UserAccount}
                        messageList={[]}
                        type={'infoList'}
                        hasHoverCard={true}
                        showonline={true}
                      ></CommonInfoCard>
                    );
                  })}
                </Panel>
                <Panel header='群聊列表' key='grouplist'>
                  {this.props.groupinfo.map((item) => {
                    return (
                      <CommonInfoCard
                        width={'266px'}
                        avatarUrl={'item.Avatar'}
                        commonName={item.GroupName}
                        signature={item.GroupIntro}
                        openNewChattingModal={this.props.openNewChattingModal}
                        commonAccount={'group' + item.Groupid}
                        messageList={[]}
                        type={'infoListgroup'}
                        hasHoverCard={false}
                      ></CommonInfoCard>
                    );
                  })}
                </Panel>
              </Collapse>
            </div>
          </TabPane>
          <TabPane
            tab={haveNewMessage ? <Badge dot>消息</Badge> : <span>消息</span>}
            key='message'
            className={'subtab'}
          >
            <p>
              {messageOfAllChatting.map((item) => {
                return (
                  <CommonInfoCard
                    avatarUrl={item.avatarUrl}
                    commonName={item.friendName}
                    messageList={item.chattingRecord}
                    signature={
                      item.chattingRecord.length > 0
                        ? item.chattingRecord[item.chattingRecord.length - 1].message
                        : ''
                    }
                    openNewChattingModal={this.props.openNewChattingModal}
                    commonAccount={item.friendAccount}
                    type={'messageList'}
                    unReadMessageCount={item.unReadMessageCount}
                  ></CommonInfoCard>
                );
              })}
            </p>
          </TabPane>
          <TabPane
            tab={
              this.props.haveNewRequestMessage ? (
                <Badge dot>好友请求信息</Badge>
              ) : (
                <span>好友请求信息</span>
              )
            }
            key='friendRequest'
            className={'subtab'}
          >
            {friendRequestList.map((item) => {
              return (
                <CommonInfoCard
                  commonName={item.userAccount}
                  openNewChattingModal={this.props.acceptOrReject}
                  commonAccount={item.userAccount}
                  signature={'请求添加您为好友!'}
                  messageList={[]}
                  avatarUrl={item.friendCode}
                  type={'friendrequest'}
                ></CommonInfoCard>
              );
            })}
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default UserTab;
