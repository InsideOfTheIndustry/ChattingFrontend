/*
 * @author: zhujunjie
 * @email: 1121883342@qq.com
 * @explain: 登录后的主要聊天界面
 * @date: 2021/04/25 17:00
 */

import { inject, observer } from 'mobx-react';
import React from 'react';
import { Layout, notification } from 'antd';
import moment from 'moment';
import UserTab from '../../baseComponent/userTab/userTabMainContent';
import UserInfoCard from '../../baseComponent/userTab/useInfoCard';
import UserTabFoot from '../../baseComponent/userTab/userFoot';
import ChattingModal from '../../baseComponent/modal/chattingModal/index';
import AddFriendModal from '../../baseComponent/modal/addFriendsModal/index';
import AcceptFriendRequestModal from '../../baseComponent/modal/ifAcceptFriendRequest/index';
import ChangeAvatarModal from '../../baseComponent/modal/changeUserinfoModel/useravatar';
import UserInfoEditModal from '../../baseComponent/modal/changeUserinfoModel/userinfo';
import CreateNewGroupModal from '../../baseComponent/modal/newGroupModal/index';
import ContentPageRouter from '../contentPage/contentPageInit';
import AcceptOrNotForGroupInviteModal from '../../baseComponent/modal/acceptorrejectgroupinvite/index';
import PermitOrNotAskForInviteModal from '../../baseComponent/modal/permitornotaskinvitemodal/index';

import './index.css';

const { Sider, Content } = Layout;
//const Websocket_Url = window.apiConfig.Websocket_Url;

@inject('userLoginStore')
@inject('groupStore')
@observer
class ChattingPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userInfo: {},
      addFriendModalVisible: false,
      chattingModalVisible: false,
      acceptFriendReqModalVisible: false,
      acceptOrNotForGroupInviteModalVisible: false,
      PermitOrNotAskForInviteModalVisible: false,
      changeAvatarModalvisible: false,
      editUserinfoModalVisible: false,
      createNewGroupModalVisible: false,
      nowChattingFriend: '',
      account: '',
      // websocketClient
      websocketClient: {},
      baseAveterUrl: 'https://img0.baidu.com/it/u=233301930,3031623456&fm=11&fmt=auto&gp=0.jpg',

      // 聊天对象 显示在对话框中的聊天情况
      // 使用键值对 查询会比较方便
      // 包含字段：friendName、friendAccount、closable、avatarUrl、chattingRecord、ifHaveNewMessage、unReadMessageCount
      // chattingRecord字段包含：userName、userAccount、message、sendSuccess、time 、avatar
      messageInTheChattingModal: {},
      // 所有的聊天对话信息 字段与messageInTheChattingModal同 数量上有差异
      // 还用于在消息一侧显示
      messageOfAllChatting: {},

      // 添加好友相关
      friendRequestList: {}, // 字典形式: 以userAccount为key 具体内部 包含 sendTime等字段
      AskForGroupInvitPermissionList: {}, // 询问是否允许添加请求 字典形式: 以请求用户+受邀请用户+群聊id作为key以冒号隔开
      InviteRequestList: {}, // 某好友邀请你进入某群 字典形式: 以请求用户+群聊id作为key 以冒号隔开
      haveNewFriendRequest: false,
      nowOpenFriendReqAccount: '111', // 目前打开的想要添加您为好友的用户账号
      nowOpenFriendReqFriendCode: '111', // 目前打开的想要添加您为好友的用户的随机好友码

      GroupInvitePermissionAsker: '',
      GroupInvitePermissionGroupid: '',
      GroupPermissionInviter: '',

      GroupInviter: '',
      GroupInviteCode: '',
      GroupInviteGroupid: '',
    };

    this.userStore = this.props.userLoginStore;
    this.groupStore = this.props.groupStore;

    this.onOpenChattingModal = this.onOpenChattingModal.bind(this);
    this.onCloseChattingModal = this.onCloseChattingModal.bind(this);
    this.onChangeChattingFriend = this.onChangeChattingFriend.bind(this);
    this.onRemoveOneChattingTab = this.onRemoveOneChattingTab.bind(this);
    this.connectToWebsocket = this.connectToWebsocket.bind(this);
    this.onReceiveMessageFromWebServer = this.onReceiveMessageFromWebServer.bind(this);
    this.updateMessageList = this.updateMessageList.bind(this);
    this.onCancelAddFriendModal = this.onCancelAddFriendModal.bind(this);
    this.onOpenAddFriendModal = this.onOpenAddFriendModal.bind(this);
    this.onSendMessage = this.onSendMessage.bind(this);
    this.acceptOrReject = this.acceptOrReject.bind(this);
    this.acceptFriendRequest = this.acceptFriendRequest.bind(this);
    this.rejectFriendRequest = this.rejectFriendRequest.bind(this);
    this.onOpenChangeAvatarModal = this.onOpenChangeAvatarModal.bind(this);
    this.onCancelChangeAvatarModal = this.onCancelChangeAvatarModal.bind(this);
    this.onUploadAvatar = this.onUploadAvatar.bind(this);
    this.onOpenEditUserinfoModal = this.onOpenEditUserinfoModal.bind(this);
    this.onCancelEditUserinfoModal = this.onCancelEditUserinfoModal.bind(this);
    this.onUpdateUserinfo = this.onUpdateUserinfo.bind(this);
    this.onOpenCreateNewGroupModal = this.onOpenCreateNewGroupModal.bind(this);
    this.sendGroupCreateVerificationcode = this.sendGroupCreateVerificationcode.bind(this);
    this.createNewGroup = this.createNewGroup.bind(this);
    this.onCloseCreateNewGroupModal = this.onCloseCreateNewGroupModal.bind(this);
    this.onExit = this.onExit.bind(this);
    this.onOpenAcceptOrRejectGroupInvite = this.onOpenAcceptOrRejectGroupInvite.bind(this);
    this.acceptOrRejectGroupInvite = this.acceptOrRejectGroupInvite.bind(this);
    this.onOpenPermitOrNotForInvitAsk = this.onOpenPermitOrNotForInvitAsk.bind(this);
    this.permitOrNotForInvitAsk = this.permitOrNotForInvitAsk.bind(this);
  }

  async componentDidMount() {
    var account = this.userStore.userlogininfo.useraccount;
    if (typeof account === 'undefined') {
      this.props.history.push('/');
    }
    var response = await this.userStore.GetUserInfo(
      localStorage.getItem(String(account) + 'token'),
      account,
      account
    );

    var nowtime = new Date();
    var timeint = nowtime.getTime();
    response.Avatar = response.Avatar + '?' + String(timeint);
    this.setState({
      userInfo: response,
    });
    await this.userStore.GetUserFriendInfo(
      localStorage.getItem(String(account) + 'token'),
      account
    );

    await this.userStore.GetUserGroupInfo(localStorage.getItem(String(account) + 'token'), account);

    this.setState({
      account: account,
    });
    this.connectToWebsocket(account);
  }

  // 建立websocket连接
  connectToWebsocket(account) {
    var websocket = new WebSocket(window.apiConfig.Websocket_Url);
    websocket.onopen = function () {
      // 登录
      websocket.send(
        '{"messagetype": 1, "token": "' +
          localStorage.getItem(String(account) + 'token') +
          '", "message": "", "sender":"' +
          account +
          '", "receiver":"","groupid":"","time":"' +
          moment().format('YYYY-MM-DDTHH:mm:ssZ') +
          '"}'
      );
    };

    websocket.onmessage = this.onReceiveMessageFromWebServer;

    this.setState({ websocketClient: websocket });
    var heartbeat = setInterval(() => {
      websocket.send(
        '{"messagetype": 0, "token": "' +
          localStorage.getItem(String(account) + 'token') +
          '", "message": "", "sender":"' +
          account +
          '", "receiver":"","groupid":"","time":"' +
          moment().format('YYYY-MM-DDTHH:mm:ssZ') +
          '"}'
      );
    }, 10000);
    websocket.onclose = () => {
      clearInterval(heartbeat);
    };
  }

  // 接收消息的回调函数
  /* 下面是信息传递的格式
  {
    message: ""
    messagetype: 2
    receiver: ""
    sender: ""
    time: ""
    token: ""
  }
  */
  async onReceiveMessageFromWebServer(message) {
    var messageWithoutSpace = message.data.replace('', '');

    var replyMessage = JSON.parse(messageWithoutSpace);
    // console.log(replyMessage.messagetype);
    switch (replyMessage.messagetype) {
      case 2:
        // 2 代表聊天信息
        var ifExist = this.state.messageInTheChattingModal[replyMessage.sender];
        // 对话出现在对话框内时 同时也要添加进消息列表
        if (typeof ifExist !== 'undefined') {
          var messageInTheChattingModal = this.state.messageInTheChattingModal;
          // 对话框内添加 因为是引用了messageOfAllChatting的记录 因此不需要在这里添加

          // 消息列表内添加
          if (this.state.chattingModalVisible === true) {
            var messageOfAllChatting = await this.updateMessageList(
              this.state.messageOfAllChatting,
              replyMessage.time,
              replyMessage.message,
              replyMessage.sender,
              false,
              ''
            );
          } else {
            var messageOfAllChatting = await this.updateMessageList(
              this.state.messageOfAllChatting,
              replyMessage.time,
              replyMessage.message,
              replyMessage.sender,
              true,
              ''
            );
          }

          this.setState({
            messageInTheChattingModal: messageInTheChattingModal,
            messageOfAllChatting: messageOfAllChatting,
          });
        } else {
          // 不在对话框内 就添加到消息列表
          var messageOfAllChatting = await this.updateMessageList(
            this.state.messageOfAllChatting,
            replyMessage.time,
            replyMessage.message,
            replyMessage.sender,
            true,
            ''
          );
          this.setState({
            messageOfAllChatting: messageOfAllChatting,
          });
          notification.info({
            message: 'Notification',
            description: '您有一条新消息',
          });
        }

        break;

      case 6:
        // 邀请加入群聊
        var InviteRequestList = this.state.InviteRequestList;
        var groupid = replyMessage.groupid;
        var inviter = replyMessage.sender;

        var inviterinfo = await this.userStore.GetUserInfo(
          this.userStore.userlogininfo.token,
          this.userStore.userlogininfo.useraccount,
          inviter
        );

        var groupinfo = await this.groupStore.QueryGroupInfo(groupid);
        InviteRequestList[inviter + ':' + groupid] = {
          InviterName: inviterinfo.UserName,
          InviterNameAccount: String(inviterinfo.UserAccount),
          GroupInfo: String(groupinfo.GroupName) + '(' + String(groupinfo.Groupid) + ')',
          InviterAvatar: String(inviterinfo.Avatar),
          GroupCode: replyMessage.message,
          Groupid: groupid,
        };
        this.setState({
          InviteRequestList: InviteRequestList,
          haveNewFriendRequest: true,
        });
        break;

      case 7:
        // 征询群主同意
        var AskForGroupInvitPermissionList = this.state.AskForGroupInvitPermissionList;
        var groupid = replyMessage.groupid;
        var asker = replyMessage.sender;
        var inviter = replyMessage.message;
        var askerinfo = await this.userStore.GetUserInfo(
          this.userStore.userlogininfo.token,
          this.userStore.userlogininfo.useraccount,
          replyMessage.sender
        );

        var inviterinfo = await this.userStore.GetUserInfo(
          this.userStore.userlogininfo.token,
          this.userStore.userlogininfo.useraccount,
          inviter
        );
        console.log(inviterinfo);
        var groupinfo = await this.groupStore.QueryGroupInfo(groupid);

        AskForGroupInvitPermissionList[asker + ':' + inviter + ':' + groupid] = {
          AskerName: String(askerinfo.UserName),
          AskerAccount: String(askerinfo.UserAccount),
          AskerAvatar: String(askerinfo.Avatar),
          InviterInfo: String(inviterinfo.UserName) + '(' + String(inviterinfo.UserAccount) + ')',
          GroupInfo: String(groupinfo.GroupName) + '(' + String(groupinfo.Groupid) + ')',
          InviterAccount: String(inviterinfo.UserAccount),
          Groupid: groupid,
        };
        this.setState({
          AskForGroupInvitPermissionList: AskForGroupInvitPermissionList,
          haveNewFriendRequest: true,
        });
        break;
      case 8:
        notification.error({
          message: 'Notification',
          description: '群主拒绝' + replyMessage.message + '加入群聊：' + replyMessage.groupid,
        });
        break;
      case 11:
        notification.info({
          message: 'Notification',
          description: '用户' + replyMessage.sender + '拒绝加入群聊：' + replyMessage.groupid,
        });
        break;
      case 12:
        // 用户同意入群
        await this.groupStore.QueryGroupMemberInfo(replyMessage.groupid);

      case 22:
        // 22 代表群聊信息
        // console.log(replyMessage);
        var ifExist = this.state.messageInTheChattingModal['group' + replyMessage.groupid];
        // 对话出现在对话框内时 同时也要添加进消息列表
        if (typeof ifExist !== 'undefined') {
          var messageInTheChattingModal = this.state.messageInTheChattingModal;

          // 消息列表内添加
          if (this.state.chattingModalVisible === true) {
            var messageOfAllChatting = await this.updateMessageList(
              this.state.messageOfAllChatting,
              replyMessage.time,
              replyMessage.message,
              replyMessage.sender,
              false,
              replyMessage.groupid
            );
          } else {
            var messageOfAllChatting = await this.updateMessageList(
              this.state.messageOfAllChatting,
              replyMessage.time,
              replyMessage.message,
              replyMessage.sender,
              true,
              replyMessage.groupid
            );
          }

          this.setState({
            messageInTheChattingModal: messageInTheChattingModal,
            messageOfAllChatting: messageOfAllChatting,
          });
        } else {
          // 不在对话框内 就添加到消息列表
          var messageOfAllChatting = await this.updateMessageList(
            this.state.messageOfAllChatting,
            replyMessage.time,
            replyMessage.message,
            replyMessage.sender,
            true,
            replyMessage.groupid
          );
          this.setState({
            messageOfAllChatting: messageOfAllChatting,
          });
          notification.info({
            message: 'Notification',
            description: '您有一条新消息',
          });
        }

        break;
      case 200:
        // 200 表示消息发送成功

        var messageInTheChattingModal = this.state.messageInTheChattingModal;
        messageInTheChattingModal[replyMessage.sender].chattingRecord.push({
          message: replyMessage.message,
          userName: messageInTheChattingModal[replyMessage.sender].friendName,
          userAccount: replyMessage.receiver,
          sendSuccess: true,
          time: replyMessage.time,
        });
        this.setState({
          messageInTheChattingModal: messageInTheChattingModal,
        });

        break;
      case 404:
        // 404 表示信息发送失败

        var messageInTheChattingModal = this.state.messageInTheChattingModal;
        // console.log(replyMessage);

        messageInTheChattingModal[replyMessage.sender].chattingRecord.push({
          message: replyMessage.message,
          userName: messageInTheChattingModal[replyMessage.sender].friendName,
          userAccount: replyMessage.receiver,
          sendSuccess: false,
          time: replyMessage.time,
        });
        this.setState({
          messageInTheChattingModal: messageInTheChattingModal,
        });

        notification.error({
          message: 'Notification',
          description: '信息发送失败！',
        });

        break;
      case 220:
        // 群聊发送成功
        var messageInTheChattingModal = this.state.messageInTheChattingModal;

        messageInTheChattingModal['group' + replyMessage.groupid].chattingRecord.push({
          message: replyMessage.message,
          userAccount: replyMessage.receiver,
          sendSuccess: true,
          time: replyMessage.time,
        });
        this.setState({
          messageInTheChattingModal: messageInTheChattingModal,
        });
        break;
      case 440:
        var messageInTheChattingModal = this.state.messageInTheChattingModal;

        messageInTheChattingModal['group' + replyMessage.groupid].chattingRecord.push({
          message: replyMessage.message,
          userAccount: replyMessage.receiver,
          sendSuccess: false,
          time: replyMessage.time,
        });
        this.setState({
          messageInTheChattingModal: messageInTheChattingModal,
        });

        notification.error({
          message: 'Notification',
          description: '信息发送失败！',
        });
        break;
      case 3:
        // 3 表示有人对你发起添加好友请求
        notification.info({
          message: 'Notification',
          description: '用户' + replyMessage.sender + '请求添加您为好友',
        });

        var friendreqlist = this.state.friendRequestList;
        friendreqlist[replyMessage.sender] = {
          sendTime: moment().format('YYYY-MM-DDTHH:mm:ssZ'),
          friendCode: replyMessage.message,
        };
        this.setState({
          friendRequestList: friendreqlist,
          haveNewFriendRequest: true,
        });

        break;
      case 33:
        //33 对方同意添加你为好友
        notification.success({
          message: 'Notification',
          description: '对方已添加您为好友!',
        });
        await this.userStore.GetUserFriendInfo(
          localStorage.getItem(String(this.state.account) + 'token'),
          this.state.account
        );
        break;
      case 333:
        //333 对方拒绝添加你为好友
        notification.info({
          message: 'Notification',
          description: '对方拒绝添加您为好友!',
        });
        break;
      case 402:
        //402 与添加好友相关的指令发送是否不成功 后续可能扩展为所有的命令指令
        notification.error({
          message: 'Notification',
          description: '信息发送失败！',
        });
        break;
      case 201:
        //201 与添加好友相关的指令发送是否成功 后续可能扩展为所有的命令指令
        notification.success({
          message: 'Notification',
          description: '信息发送成功！',
        });
        break;
      case 500:
        notification.info({
          message: 'Notification',
          description: 'token验证失败！',
        });
        break;
      case 88:
        // 在其他地方登录
        notification.error({
          message: 'Notification',
          description: replyMessage.message,
        });
      case 222:
        // 有好友上线了
        await this.userStore.GetUserFriendInfo(
          localStorage.getItem(this.state.account + 'token'),
          this.state.account
        );
        break;
      case 444:
        // 离线
        await this.userStore.GetUserFriendInfo(
          localStorage.getItem(this.state.account + 'token'),
          this.state.account
        );
        break;
    }
  }

  // 更新列表值
  async updateMessageList(messageOfAllChatting, time, message, sender, ifHaveNewMessage, groupid) {
    if (groupid === '') {
      var messageOfAllChattingsender = messageOfAllChatting[sender];
      if (typeof messageOfAllChattingsender !== 'undefined') {
        messageOfAllChatting[sender].ifHaveNewMessage = ifHaveNewMessage;
        if (ifHaveNewMessage) {
          messageOfAllChatting[sender].unReadMessageCount =
            messageOfAllChatting[sender].unReadMessageCount + 1;
        } else {
          messageOfAllChatting[sender].unReadMessageCount = 0;
        }

        messageOfAllChatting[sender].chattingRecord.push({
          userAccount: sender,
          message: message,
          time: time,
          sendSuccess: true,
          userName:
            this.userStore.friendsforsearch[sender].UserName === undefined
              ? '未知用户'
              : this.userStore.friendsforsearch[sender].UserName,
          avatar:
            this.userStore.friendsforsearch[sender].Avatar === undefined
              ? ''
              : this.userStore.friendsforsearch[sender].Avatar,
        });
      } else {
        messageOfAllChatting[sender] = {
          friendName: this.userStore.friendsforsearch[sender].UserName,
          friendAccount: sender,
          closable: true,
          avatarUrl: this.userStore.friendsforsearch[sender].Avatar,
          chattingRecord: [
            {
              userName:
                this.userStore.friendsforsearch[sender].UserName === undefined
                  ? '未知用户'
                  : this.userStore.friendsforsearch[sender].UserName,
              avatar:
                this.userStore.friendsforsearch[sender].Avatar === undefined
                  ? ''
                  : this.userStore.friendsforsearch[sender].Avatar,
              userAccount: sender,
              message: message,
              time: time,
            },
          ],
          ifHaveNewMessage: true,
          unReadMessageCount: 1,
        };
      }
      return messageOfAllChatting;
    }
    var messageOfAllChattingsender = messageOfAllChatting['group' + groupid];
    if (typeof messageOfAllChattingsender !== 'undefined') {
      messageOfAllChatting['group' + groupid].ifHaveNewMessage = ifHaveNewMessage;
      if (ifHaveNewMessage) {
        messageOfAllChatting['group' + groupid].unReadMessageCount =
          messageOfAllChatting['group' + groupid].unReadMessageCount + 1;
      } else {
        messageOfAllChatting['group' + groupid].unReadMessageCount = 0;
      }

      messageOfAllChatting['group' + groupid].chattingRecord.push({
        userAccount: sender,
        userName:
          this.groupStore.groupWithMember[groupid] === undefined
            ? '未知用户'
            : this.groupStore.groupWithMember[groupid][sender].UserName,
        avatar:
          this.groupStore.groupWithMember[groupid] === undefined
            ? '未知用户'
            : this.groupStore.groupWithMember[groupid][sender].Avatar,
        message: message,
        time: time,
        sendSuccess: true,
      });
    } else {
      // 查询群成员 维护一个群成员列表
      await this.groupStore.QueryGroupMemberInfo(groupid);
      // 查询群信息
      var groupinfo = await this.groupStore.QueryGroupInfo(groupid);
      if (typeof groupinfo === 'undefined') {
        notification.error({
          message: 'Notification',
          description: '查询群信息失败!',
        });
        var groupname = '';
        for (var i = 0; i < this.userStore.usergroup.length; i++) {
          if (this.userStore.usergroup[i].Groupid === groupid) {
            groupname = this.userStore.usergroup[i].GroupName;
          }
        }
        groupinfo = { GroupAvatar: '', GroupName: groupname };
      }

      messageOfAllChatting['group' + groupid] = {
        friendName: groupinfo.GroupName,
        friendAccount: 'group' + groupid,
        closable: true,
        avatarUrl: groupinfo.GroupAvatar,
        chattingRecord: [
          {
            userName:
              this.groupStore.groupWithMember[groupid] === undefined
                ? '未知用户'
                : this.groupStore.groupWithMember[groupid][sender].UserName,
            userAccount: sender,
            message: message,
            time: time,
            avatar:
              this.groupStore.groupWithMember[groupid] === undefined
                ? '未知用户'
                : this.groupStore.groupWithMember[groupid][sender].Avatar,
            sendSuccess: true,
          },
        ],
        ifHaveNewMessage: true,
        unReadMessageCount: 1,
      };
    }
    return messageOfAllChatting;
  }

  // 关闭发送信息对话框
  onCloseChattingModal() {
    this.setState({
      chattingModalVisible: false,
    });
  }

  // 打开发送信息对话框
  // TODO:重点看这里 这里公用了底层数组
  async onOpenChattingModal(friendAccount, friendName, friendavatarUrl, chattingRecord) {
    var messageInTheChattingModal = this.state.messageInTheChattingModal;
    var messageOfAllChatting = this.state.messageOfAllChatting;

    // 聊天对话框列表中没有这个好友的对话信息
    if (typeof messageInTheChattingModal[friendAccount] === 'undefined') {
      // 在总的聊天消息中查询 并插入
      var messageOfAllChatting = this.state.messageOfAllChatting;
      if (typeof messageOfAllChatting[friendAccount] !== 'undefined') {
        messageOfAllChatting[friendAccount].ifHaveNewMessage = false;
        messageOfAllChatting[friendAccount].unReadMessageCount = 0;
        messageInTheChattingModal[friendAccount] = {
          friendName: friendName,
          friendAccount: friendAccount,
          closable: true,
          avatarUrl: friendavatarUrl,
          chattingRecord: messageOfAllChatting[friendAccount].chattingRecord,
          ifHaveNewMessage: false,
          unReadMessageCount: 0,
        };
      } else {
        var index = friendAccount.substring(0, 5);
        if (index === 'group') {
          var groupid = friendAccount.substring(5);
          // 查询群成员 维护一个群成员列表
          await this.groupStore.QueryGroupMemberInfo(groupid);
          // 查询群信息
          var groupinfo = await this.groupStore.QueryGroupInfo(groupid);
          if (typeof groupinfo === 'undefined') {
            notification.error({
              message: 'Notification',
              description: '查询群信息失败!',
            });
            var groupname = '';
            for (var i = 0; i < this.userStore.usergroup.length; i++) {
              if (this.userStore.usergroup[i].Groupid === groupid) {
                groupname = this.userStore.usergroup[i].GroupName;
              }
            }
            groupinfo = { GroupAvatar: '', GroupName: groupname };
          }
          messageOfAllChatting[friendAccount] = {
            friendName: this.userStore.usergroupforsearch[groupid].GroupName,
            friendAccount: friendAccount,
            closable: true,
            avatarUrl: groupinfo.GroupAvatar,
            chattingRecord: chattingRecord,
            ifHaveNewMessage: true,
            unReadMessageCount: 1,
          };
          messageInTheChattingModal[friendAccount] = {
            friendName: friendName,
            friendAccount: friendAccount,
            closable: true,
            avatarUrl: friendavatarUrl,
            chattingRecord: messageOfAllChatting[friendAccount].chattingRecord,
            ifHaveNewMessage: false,
            unReadMessageCount: 0,
          };
        } else {
          messageOfAllChatting[friendAccount] = {
            friendName: friendName,
            friendAccount: friendAccount,
            closable: true,
            avatarUrl: friendavatarUrl,
            chattingRecord: chattingRecord,
            ifHaveNewMessage: false,
            unReadMessageCount: 0,
          };
          messageInTheChattingModal[friendAccount] = {
            friendName: friendName,
            friendAccount: friendAccount,
            closable: true,
            avatarUrl: friendavatarUrl,
            chattingRecord: messageOfAllChatting[friendAccount].chattingRecord,
            ifHaveNewMessage: false,
            unReadMessageCount: 0,
          };
        }
      }
    }
    messageOfAllChatting[friendAccount].ifHaveNewMessage = false;
    messageOfAllChatting[friendAccount].unReadMessageCount = 0;

    // 更新聊天信息
    this.setState({
      messageOfAllChatting: messageOfAllChatting,
      chattingModalVisible: true,
      nowChattingFriend: friendAccount,
      messageInTheChattingModal: messageInTheChattingModal,
    });
  }

  // 改变聊天对象
  onChangeChattingFriend(friendAccount) {
    this.setState({
      nowChattingFriend: friendAccount,
    });
  }

  // 删除一个对话框
  onRemoveOneChattingTab(targetKey) {
    // 过滤对应的对话
    var newmessageInTheChattingModal = this.state.messageInTheChattingModal;
    delete newmessageInTheChattingModal[targetKey];

    var newmessageInTheChattingModalLength = 0;
    for (let key in newmessageInTheChattingModal) {
      newmessageInTheChattingModalLength = newmessageInTheChattingModalLength + 1;
    }

    // 还需要设置当前的messageInTheChattingModal
    if (newmessageInTheChattingModalLength === 0) {
      this.setState({
        chattingModalVisible: false,
        messageInTheChattingModal: newmessageInTheChattingModal,
        nowChattingFriend: '',
      });
    } else {
      var nowChattingFriend = targetKey;

      if (this.state.nowChattingFriend === targetKey) {
        var count = 0;
        for (let key in newmessageInTheChattingModal) {
          count = count + 1;
          if (count === newmessageInTheChattingModalLength) {
            nowChattingFriend = key;
          }
        }
        this.setState({
          nowChattingFriend: nowChattingFriend,
        });
      }
      this.setState({
        messageInTheChattingModal: newmessageInTheChattingModal,
      });
    }
  }

  // 关闭添加朋友对话框
  onCancelAddFriendModal() {
    this.setState({
      addFriendModalVisible: false,
    });
  }

  // 打开添加好友对话框
  onOpenAddFriendModal() {
    this.setState({
      addFriendModalVisible: true,
    });
  }

  // 添加好友时 打开添加好友确认框
  acceptOrReject(userAccount, second, friendCode, fourth) {
    this.setState({
      acceptFriendReqModalVisible: true,
      nowOpenFriendReqAccount: userAccount,
      nowOpenFriendReqFriendCode: friendCode,
    });
  }
  // 拒绝添加 点击x号默认拒绝
  rejectFriendRequest() {
    var friendRequestList = this.state.friendRequestList;
    delete friendRequestList[this.state.nowOpenFriendReqAccount];
    this.onSendMessage(
      333,
      localStorage.getItem(String(this.state.account) + 'token'),
      this.state.nowOpenFriendReqFriendCode,
      this.state.account,
      this.state.nowOpenFriendReqAccount,
      ''
    );
    this.setState({
      friendRequestList: friendRequestList,
      acceptFriendReqModalVisible: false,
      haveNewFriendRequest: false,
    });
  }

  // 接受用户好友请求
  async acceptFriendRequest() {
    var friendRequestList = this.state.friendRequestList;
    delete friendRequestList[this.state.nowOpenFriendReqAccount];
    this.onSendMessage(
      33,
      localStorage.getItem(String(this.state.account) + 'token'),
      this.state.nowOpenFriendReqFriendCode,
      this.state.account,
      this.state.nowOpenFriendReqAccount,
      ''
    );
    this.setState({
      friendRequestList: friendRequestList,
      acceptFriendReqModalVisible: false,
      haveNewFriendRequest: false,
    });
    await this.userStore.GetUserFriendInfo(
      localStorage.getItem(String(this.state.account) + 'token'),
      this.state.account
    );
  }

  // onOpenPermitOrNotForInvitAsk 同意或者拒绝邀请询问邀请框
  async onOpenPermitOrNotForInvitAsk(userAccount, second, groupid, Inviterlist) {
    var groupinfo = await this.groupStore.QueryGroupInfo(groupid);
    var groupinfoshortly = String(groupinfo.GroupName) + '(' + String(groupinfo.Groupid) + ')';

    var inviter = await this.userStore.GetUserInfo(
      localStorage.getItem(String(this.state.account) + 'token'),
      this.state.account,
      Inviterlist[0]
    );

    var asker = await this.userStore.GetUserInfo(
      localStorage.getItem(String(this.state.account) + 'token'),
      this.state.account,
      userAccount
    );

    this.setState({
      PermitOrNotAskForInviteModalVisible: true,
      GroupInvitePermissionAsker: userAccount,
      GroupInvitePermissionAskerinfo:
        String(asker.UserName) + '(' + String(asker.UserAccount) + ')',
      GroupPermissionInviter: Inviterlist[0],
      GroupPermissionInviterInfo:
        String(inviter.UserName) + '(' + String(inviter.UserAccount) + ')',
      GroupInvitePermissionGroupid: groupid,
      GroupInvitePermissionGroupinfo: groupinfoshortly,
    });
  }

  // 同意或拒绝权限
  permitOrNotForInvitAsk(status) {
    var askForGroupInvitPermissionList = this.state.AskForGroupInvitPermissionList;
    delete askForGroupInvitPermissionList[
      this.state.GroupInvitePermissionAsker +
        ':' +
        this.state.GroupPermissionInviter +
        ':' +
        this.state.GroupInvitePermissionGroupid
    ];
    if (status === true) {
      this.onSendMessage(
        9,
        localStorage.getItem(String(this.state.account) + 'token'),
        this.state.GroupPermissionInviter,
        this.state.account,
        this.state.GroupInvitePermissionAsker,
        this.state.GroupInvitePermissionGroupid
      );
    } else {
      this.onSendMessage(
        8,
        localStorage.getItem(String(this.state.account) + 'token'),
        this.state.GroupPermissionInviter,
        this.state.account,
        this.state.GroupInvitePermissionAsker,
        this.state.GroupInvitePermissionGroupid
      );
    }
    this.setState({
      AskForGroupInvitPermissionList: askForGroupInvitPermissionList,
      PermitOrNotAskForInviteModalVisible: false,
      haveNewFriendRequest: false,
    });
  }

  // 打开接受或拒绝加入群聊对话框
  async onOpenAcceptOrRejectGroupInvite(userAccount, second, groupid, codelist) {
    var groupinfo = await this.groupStore.QueryGroupInfo(groupid);
    console.log(groupid);
    var groupinfoshortly = String(groupinfo.GroupName) + '(' + String(groupinfo.Groupid) + ')';

    var response = await this.userStore.GetUserInfo(
      localStorage.getItem(String(this.state.account) + 'token'),
      this.state.account,
      userAccount
    );
    this.setState({
      acceptOrNotForGroupInviteModalVisible: true,
      GroupInviter: userAccount,
      GroupInviteCode: codelist[0],
      GroupInviteGroupid: groupid,
      GroupInviteGroupinfo: groupinfoshortly,
      GroupInviterinfo: String(response.UserName) + '(' + String(response.UserAccount) + ')',
    });
  }

  // 接受或拒绝加入群聊
  acceptOrRejectGroupInvite(status) {
    var InviteRequestList = this.state.InviteRequestList;
    delete InviteRequestList[this.state.GroupInviter + ':' + this.state.GroupInviteGroupid];
    if (status === true) {
      this.onSendMessage(
        10,
        localStorage.getItem(String(this.state.account) + 'token'),
        this.state.GroupInviteCode,
        this.state.account,
        this.state.GroupInviter,
        this.state.GroupInviteGroupid
      );
    } else {
      this.onSendMessage(
        11,
        localStorage.getItem(String(this.state.account) + 'token'),
        this.state.GroupInviteCode,
        this.state.account,
        this.state.GroupInviter,
        this.state.GroupInviteGroupid
      );
    }
    this.setState({
      InviteRequestList: InviteRequestList,
      acceptOrNotForGroupInviteModalVisible: false,
      haveNewFriendRequest: false,
    });
  }

  // 发送信息函数
  onSendMessage(messageType, token, sendMessage, userAccount, friendAccount, groupid) {
    var nowTime = moment().format('YYYY-MM-DDTHH:mm:ssZ');
    this.state.websocketClient.send(
      '{"messagetype":' +
        messageType +
        ', "token": "' +
        token +
        '", "message": "' +
        sendMessage +
        '", "sender":"' +
        userAccount +
        '", "receiver":"' +
        friendAccount +
        '","groupid":"' +
        groupid +
        '","time":"' +
        nowTime +
        '"}'
    );
  }

  // 打开改变头像对话框
  onOpenChangeAvatarModal() {
    this.setState({
      changeAvatarModalvisible: true,
    });
  }

  // 关闭改变头像对话框
  onCancelChangeAvatarModal() {
    this.setState({
      changeAvatarModalvisible: false,
    });
  }

  // 执行头像上传 上传结束后，会返回新的头像链接，然后修改 state中的头像链接
  async onUploadAvatar(avatar) {
    var response = await this.userStore.UpdateUserAvatar(
      localStorage.getItem(String(this.state.account) + 'token'),
      this.state.account,
      avatar
    );
    if (typeof response === 'undefined') {
      notification.error({
        message: 'Notification',
        description: '头像上传失败!',
      });
      return;
    }
    var userinfo = this.state.userInfo;
    var nowtime = new Date();
    var timeint = nowtime.getTime();
    userinfo.Avatar = response + '?' + String(timeint);
    this.setState({
      userInfo: userinfo,
    });
    notification.success({
      message: 'Notification',
      description: '头像上传成功!',
    });
  }

  // 打开修改用户信息对话框
  onOpenEditUserinfoModal() {
    this.setState({
      editUserinfoModalVisible: true,
    });
  }

  // 关闭修改用户信息窗口
  onCancelEditUserinfoModal() {
    this.setState({
      editUserinfoModalVisible: false,
    });
  }

  // 更新用户信息
  async onUpdateUserinfo(signature, username, usersex, userage) {
    var response = await this.userStore.UpdateUserInfo(
      localStorage.getItem(this.state.account + 'token'),
      this.state.account,
      signature,
      username,
      usersex,
      userage
    );
    if (typeof response === 'undefined') {
      notification.error({
        message: 'Notification',
        description: '信息修改失败!',
      });
      return;
    }

    this.setState({
      userInfo: response,
    });

    notification.success({
      message: 'Notification',
      description: '信息修改成功!',
    });
  }

  // 打开创建群聊页面
  onOpenCreateNewGroupModal() {
    if (this.userStore.userInfo.OwnGroups >= 2) {
      notification.error({
        message: 'Notification',
        description: '您创建的群聊已达上限，不可再创建群聊了！',
      });
      return;
    }
    this.setState({
      createNewGroupModalVisible: true,
    });
  }

  // 打开创建群聊页面
  onCloseCreateNewGroupModal() {
    this.setState({
      createNewGroupModalVisible: false,
    });
  }

  // 发送群聊创建验证码
  async sendGroupCreateVerificationcode(useraccount) {
    await this.groupStore.SendGroupCreateVerifyCodeEmail(
      localStorage.getItem(useraccount + 'token'),
      useraccount
    );
  }

  // 创建群聊
  async createNewGroup(useraccount, groupname, verificationcode, groupintro) {
    var response = await this.groupStore.CreateNewGroup(
      localStorage.getItem(useraccount + 'token'),
      useraccount,
      groupname,
      verificationcode,
      groupintro
    );

    if (typeof response === 'undefined' || response === false) {
      return;
    }
    await this.userStore.GetUserGroupInfo(
      localStorage.getItem(String(useraccount) + 'token'),
      useraccount
    );
    await this.userStore.GetUserInfo(
      localStorage.getItem(String(useraccount) + 'token'),
      useraccount,
      useraccount
    );
    this.setState({
      createNewGroupModalVisible: false,
    });
  }

  // 退出登录
  onExit() {
    this.state.websocketClient.send(
      '{"messagetype": 4, "token": "' +
        this.userStore.userlogininfo.token +
        '", "message": "", "sender":"' +
        this.userStore.userlogininfo.useraccount +
        '", "receiver":"","groupid":"","time":"' +
        moment().format('YYYY-MM-DDTHH:mm:ssZ') +
        '"}'
    );
    this.state.websocketClient.close();
    this.userStore.userlogininfo = {};
  }

  render() {
    const { userInfo } = this.state;
    return (
      <Layout>
        <Sider className={'site-layout-background'}>
          <UserInfoCard
            onOpenChangeAvatar={this.onOpenChangeAvatarModal}
            onOpenEditUserinfoModal={this.onOpenEditUserinfoModal}
            usersex={userInfo.UserSex}
            avatarUrl={userInfo.Avatar}
            username={userInfo.UserName}
            signature={userInfo.Signature}
            onExit={this.onExit}
          ></UserInfoCard>
          <UserTab
            openNewChattingModal={this.onOpenChattingModal}
            messageOfAllChatting={this.state.messageOfAllChatting}
            acceptOrReject={this.acceptOrReject}
            acceptOrRejectGroupInvite={this.onOpenAcceptOrRejectGroupInvite}
            permitOrNotForInvitAsk={this.onOpenPermitOrNotForInvitAsk}
            friendsinfo={this.userStore.friends}
            groupinfo={this.userStore.usergroup}
            friendRequestList={this.state.friendRequestList}
            InviteRequestList={this.state.InviteRequestList}
            AskForGroupInvitPermissionList={this.state.AskForGroupInvitPermissionList}
            haveNewRequestMessage={this.state.haveNewFriendRequest}
          ></UserTab>
          <UserTabFoot
            addfriendOnclick={this.onOpenAddFriendModal}
            createNewGroup={this.onOpenCreateNewGroupModal}
          ></UserTabFoot>
        </Sider>
        <Layout>
          <Content>
            <ContentPageRouter></ContentPageRouter>
          </Content>
        </Layout>
        <ChattingModal
          usergroupforsearch={this.userStore.usergroupforsearch}
          messageInTheChattingModal={this.state.messageInTheChattingModal}
          handleOnCancel={this.onCloseChattingModal}
          visible={this.state.chattingModalVisible}
          nowChattingFriend={this.state.nowChattingFriend}
          onChangeChattingFriend={this.onChangeChattingFriend}
          onRemoveOneChattingTab={this.onRemoveOneChattingTab}
          websocketclient={this.state.websocketClient}
          userAccount={this.state.account}
          avatarUrl={userInfo.Avatar}
        ></ChattingModal>
        <AddFriendModal
          visible={this.state.addFriendModalVisible}
          handleOnCancel={this.onCancelAddFriendModal}
          sendAddFriendRequest={this.onSendMessage}
          account={this.state.account}
        ></AddFriendModal>
        <AcceptFriendRequestModal
          visible={this.state.acceptFriendReqModalVisible}
          userAccount={this.state.nowOpenFriendReqAccount}
          acceptRequest={this.acceptFriendRequest}
          rejectRequest={this.rejectFriendRequest}
          handleOnCancel={this.rejectFriendRequest}
        ></AcceptFriendRequestModal>
        <AcceptOrNotForGroupInviteModal
          visible={this.state.acceptOrNotForGroupInviteModalVisible}
          userAccount={this.state.account}
          groupid={this.state.GroupInviteGroupid}
          inviterAccount={this.state.GroupInviter}
          acceptOrRejectRequest={this.acceptOrRejectGroupInvite}
          handleOnCancel={this.acceptOrRejectGroupInvite}
          groupinfo={this.state.GroupInviteGroupinfo}
          inviterinfo={this.state.GroupInviterinfo}
        ></AcceptOrNotForGroupInviteModal>
        <PermitOrNotAskForInviteModal
          visible={this.state.PermitOrNotAskForInviteModalVisible}
          userAccount={this.state.account}
          groupid={this.state.GroupInvitePermissionGroupid}
          inviterAccount={this.state.GroupPermissionInviter}
          askerAccount={this.state.GroupInvitePermissionAsker}
          groupinfo={this.state.GroupInvitePermissionGroupinfo}
          inviterinfo={this.state.GroupPermissionInviterInfo}
          askerinfo={this.state.GroupInvitePermissionAskerinfo}
          acceptOrRejectRequest={this.permitOrNotForInvitAsk}
          handleOnCancel={this.permitOrNotForInvitAsk}
        ></PermitOrNotAskForInviteModal>
        <ChangeAvatarModal
          visible={this.state.changeAvatarModalvisible}
          handleOnCancel={this.onCancelChangeAvatarModal}
          userAvatar={userInfo.Avatar}
          onUploadAvatar={this.onUploadAvatar}
        ></ChangeAvatarModal>
        <UserInfoEditModal
          visible={this.state.editUserinfoModalVisible}
          onCancelEditUserinfoModal={this.onCancelEditUserinfoModal}
          updataInfo={this.onUpdateUserinfo}
          userinfo={userInfo}
        ></UserInfoEditModal>
        <CreateNewGroupModal
          visible={this.state.createNewGroupModalVisible}
          userAccount={this.state.account}
          sendVerificationcode={this.sendGroupCreateVerificationcode}
          createNewGroup={this.createNewGroup}
          handleOnCancel={this.onCloseCreateNewGroupModal}
        ></CreateNewGroupModal>
      </Layout>
    );
  }
}

export default ChattingPage;
