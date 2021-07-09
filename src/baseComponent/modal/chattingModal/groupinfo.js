/*
 * @author: zhujunjie
 * @email: 1121883342@qq.com
 * @explain: 群聊信息展示
 * @date: 2021/06/29 21:49
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Button, Row, Avatar, Divider, Popover, Col, Input } from 'antd';
import { PlusOutlined, ManOutlined, WomanOutlined } from '@ant-design/icons';
import './index.css';
import { inject, observer } from 'mobx-react';
import EditGroupModal from './editGroupModal';
import InviteFriendIntoGroupModal from './inviteFriendIntoGroupModal';

@inject('userLoginStore')
@inject('groupStore')
@observer
class GroupInfoOnTheSide extends React.Component {
  static propsTypes = {
    websocketclient: PropTypes.object,
    groupId: PropTypes.string,
    userAccount: PropTypes.string,
    type: PropTypes.string,
  };

  static defaultProps = {
    websocketclient: {},
    groupId: '',
    userAccount: '',
    type: 'friend',
  };

  constructor(props) {
    super(props);

    this.state = {
      groupinfo: {},
      groupWithMemberList: [],
      editButtonDisable: true,
      editGroupModalVisible: false,
      inviteFriendIntoGroupModalVisible: false,
    };

    this.userStore = this.props.userLoginStore;
    this.groupStore = this.props.groupStore;

    this.onCloseEditGroupModal = this.onCloseEditGroupModal.bind(this);
    this.openEditGroupModal = this.openEditGroupModal.bind(this);
    this.updateGroupInfo = this.updateGroupInfo.bind(this);
    this.onUploadAvatar = this.onUploadAvatar.bind(this);
    this.onCloseInviteFriendModal = this.onCloseInviteFriendModal.bind(this);
    this.onOpendInviteFriendModal = this.onOpendInviteFriendModal.bind(this);
  }

  async componentDidMount() {
    var groupinfo = await this.groupStore.QueryGroupInfo(this.props.groupId);

    if (this.props.userAccount === String(groupinfo.GroupOwner)) {
      this.setState({
        editButtonDisable: false,
      });
    }
    groupinfo.GroupOwner =
      this.groupStore.groupWithMember[this.props.groupId][groupinfo.GroupOwner].UserName;

    groupinfo.CreateAt = groupinfo.CreateAt.slice(0, 10);

    this.setState({
      groupinfo: groupinfo,
    });
  }

  // 打开编辑群聊信息框
  openEditGroupModal() {
    this.setState({
      editGroupModalVisible: true,
    });
  }

  // 关闭编辑群聊对话框
  onCloseEditGroupModal() {
    this.setState({
      editGroupModalVisible: false,
    });
  }

  // 更新群资料
  async updateGroupInfo(groupname, groupintro) {
    await this.groupStore.UpdateGroupInfo(
      this.props.userAccount,
      localStorage.getItem(this.props.userAccount + 'token'),
      this.props.groupId,
      groupname,
      groupintro
    );

    // TODO:通知群成员 更新群资料信息
    await this.userStore.GetUserGroupInfo(
      localStorage.getItem(this.props.userAccount + 'token'),
      this.props.userAccount
    );

    var groupinfo = await this.groupStore.QueryGroupInfo(this.props.groupId);
    groupinfo.CreateAt = groupinfo.CreateAt.slice(0, 10);

    groupinfo.GroupOwner =
      this.groupStore.groupWithMember[this.props.groupId][groupinfo.GroupOwner].UserName;
    var nowtime = new Date();
    var timeint = nowtime.getTime();
    groupinfo.GroupAvatar = groupinfo.GroupAvatar + '?' + String(timeint);
    this.setState({
      groupinfo: groupinfo,
    });
  }

  // 更新群头像
  async onUploadAvatar(picinfo) {
    // 更新头像
    await this.groupStore.UpdateGroupAvatar(
      this.props.userAccount,
      localStorage.getItem(this.props.userAccount + 'token'),
      this.props.groupId,
      picinfo
    );

    // TODO:通知群成员 更新群资料信息
    await this.userStore.GetUserGroupInfo(
      localStorage.getItem(this.props.userAccount + 'token'),
      this.props.userAccount
    );

    // 更新当前显示的群资料信息
    var groupinfo = await this.groupStore.QueryGroupInfo(this.props.groupId);
    groupinfo.CreateAt = groupinfo.CreateAt.slice(0, 10);

    groupinfo.GroupOwner =
      this.groupStore.groupWithMember[this.props.groupId][groupinfo.GroupOwner].UserName;
    var nowtime = new Date();
    var timeint = nowtime.getTime();
    groupinfo.GroupAvatar = groupinfo.GroupAvatar + '?' + String(timeint);

    this.setState({
      groupinfo: groupinfo,
    });
  }

  // 打开邀请界面
  onOpendInviteFriendModal() {
    this.setState({
      inviteFriendIntoGroupModalVisible: true,
    });
  }

  // 关闭邀请界面
  onCloseInviteFriendModal() {
    this.setState({
      inviteFriendIntoGroupModalVisible: false,
    });
  }

  render() {
    var groupmemberlist = [];
    for (let key in this.groupStore.groupWithMember[this.props.groupId]) {
      groupmemberlist.push(this.groupStore.groupWithMember[this.props.groupId][key]);
    }
    return this.props.type === 'group' ? (
      <div>
        <Row justify='space-between'>
          <div className={'groupmembershowstyle'}>
            <Button icon={<PlusOutlined />} onClick={this.onOpendInviteFriendModal}></Button>
            <div>添加</div>
          </div>

          {groupmemberlist.map((member) => {
            return (
              <div className={'groupmembershowstyle'}>
                <Popover
                  content={
                    <div>
                      <Row>
                        <Col span={'12'}>群内昵称</Col>
                        <Col span={'12'}>{member.UserNameInGroup}</Col>
                      </Row>
                    </div>
                  }
                  title={
                    <Row>
                      <Col span={'16'}>
                        <Row>
                          <div className={'usernamefont'}>
                            {member.UserName}
                            {member.UserSex === 1 ? <ManOutlined /> : <WomanOutlined />}
                          </div>
                        </Row>
                        <Row>
                          <div className={'useraccountfont'}>
                            {'用户账号:' + member.UserAccount}
                          </div>
                        </Row>
                      </Col>
                      <Col span={'8'} justify='end'>
                        <Avatar shape='square' size={60} src={member.Avatar}></Avatar>
                      </Col>
                    </Row>
                  }
                  trigger='click'
                  style={{ width: '300px' }}
                >
                  <Avatar shape='square' src={member.Avatar}></Avatar>
                  <div>
                    {member.UserNameInGroup.length !== 0
                      ? member.UserNameInGroup.length > 4
                        ? member.UserNameInGroup.slice(0, 4) + '...'
                        : member.UserNameInGroup
                      : member.UserName.length > 4
                      ? member.UserName.slice(0, 4) + '...'
                      : member.UserName}
                  </div>
                </Popover>
              </div>
            );
          })}
        </Row>
        <Divider style={{ borderWidth: 2, borderColor: 'rgb(102, 98, 98)' }} />
        <Row>
          <Col span={'12'}>群聊名称</Col>
          <Col span={'12'}>{this.state.groupinfo.GroupName}</Col>
        </Row>
        <Row>
          <Col span={'12'}>群简介</Col>
          <Col span={'12'}>{this.state.groupinfo.GroupIntro}</Col>
        </Row>
        <Row>
          <Col span={'12'}>创建时间</Col>
          <Col span={'12'}>{this.state.groupinfo.CreateAt}</Col>
        </Row>
        <Row>
          <Col span={'12'}>群主</Col>
          <Col span={'12'}>{this.state.groupinfo.GroupOwner}</Col>
        </Row>
        <br></br>
        <Row justify='center'>
          <Button
            disabled={this.state.editButtonDisable}
            type='primary'
            onClick={() => {
              this.openEditGroupModal();
            }}
          >
            修改群资料
          </Button>
        </Row>
        <Divider style={{ borderWidth: 2, borderColor: 'rgb(102, 98, 98)' }} />
        <Row>
          <Col span={'12'}>群内昵称:</Col>
          <Col span={'12'}>
            <Input
              size='small'
              defaultValue={
                this.groupStore.groupWithMember[this.props.groupId][this.props.userAccount]
                  .UserNameInGroup
              }
              id='usernameingroupinput'
              onPressEnter={() => {
                this.groupStore.UpdateUserNameInGroup(
                  this.props.userAccount,
                  localStorage.getItem(this.props.userAccount + 'token'),
                  this.props.groupId,
                  document.getElementById('usernameingroupinput').value
                );
                document.getElementById('usernameingroupinput').blur();
              }}
            />
          </Col>
        </Row>
        <EditGroupModal
          visible={this.state.editGroupModalVisible}
          onCancel={this.onCloseEditGroupModal}
          groupinfo={this.state.groupinfo}
          updateGroupInfo={this.updateGroupInfo}
          onUploadAvatar={this.onUploadAvatar}
        ></EditGroupModal>
        <InviteFriendIntoGroupModal
          visible={this.state.inviteFriendIntoGroupModalVisible}
          onCancel={this.onCloseInviteFriendModal}
          userfriend={this.userStore.friends}
          memberInGroup={this.groupStore.groupWithMember[this.props.groupId]}
          websocketclient={this.props.websocketclient}
          userAccount={this.props.userAccount}
          groupId={this.props.groupId}
        ></InviteFriendIntoGroupModal>
      </div>
    ) : (
      ''
    );
  }
}

export default GroupInfoOnTheSide;
