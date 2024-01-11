import React from 'react';
import { Fragment, useState, useEffect } from 'react';
import { Prompt } from 'react-router'
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next/hooks';
import openSocket from 'socket.io-client';
import Linkify from 'react-linkify';
import Img from "react-cool-img";

// import WebStream from './WebStream';

import AutoSuggestVideoTextTalk from '../../components/AutoSuggest/AutoSuggestVideoTextTalk';
import Button from '../../components/Button/Button';
import Input from '../../components/Form/Input/Input';
import InputEmoji from '../../components/Form/Input/InputEmoji';
// import UserTalkList from './UserTalkList';

import CreateGroupForm from '../../components/GroupTalk/EditGroup/CreateGroupForm';
import EditGroupForm from '../../components/GroupTalk/EditGroup/EditGroupForm';

// import GroupAdElements from '../../components/GroupTalk/GroupAdElements/GroupAdElements';
import AdElementDisplay from '../../components/GroupTalk/GroupAdElements/AdElememtDisplay/AdElementDisplay';

import GroupList from '../../components/GroupTalk/GroupList/GroupList';
import GroupListControll from '../../components/GroupTalk/GroupList/GroupListControll';
import GroupInfoMemberList from '../../components/GroupTalk/GroupInfo/GroupInfoMemberList';
import GroupJoinControll from '../../components/GroupTalk/GroupInfo/GroupJoinControll';
import GroupTalkTextInput from '../../components/GroupTalk/GroupTextList/GroupTalkTextInput';
import GroupTalkTextListInfo from '../../components/GroupTalk/GroupInfo/GroupTalkTextListInfo';
import GroupTalkTextList from '../../components/GroupTalk/GroupTextList/GroupTalkTextList';
import GroupTalkAuthModal from './GroupTalkAuthModal';
import GroupTopElements from '../../components/GroupTalk/GroupAdElements/GroupTopElements/GroupTopElements';
import GroupRightElements from '../../components/GroupTalk/GroupAdElements/GroupRightElements/GroupRightElements';
import GroupTalkSocket from './GroupTalkSocket';
import Loader from '../../components/Loader/Loader';
import { getUserData, getUserDataForStore, getUsers, getUsersRest, getUsersForGroup, getUserLocation, updateUserColor } from '../../util/user';
import { getLocalTimeElements } from '../../util/timeFormat';
import { getRandomBgColor } from '../../util/color-style';

import {
  sendTextPushHandler,
  sendGroupTextPushHandler
} from '../../util/pushNotification';
import { 
  storeDraftInput, 
  getDraftInput, 
  deleteDraftInput 
} from '../../util/style';
import { useStore } from '../../hook-store/store';

import { 
  GQL_URL, 
  BASE_URL, 
  SOCKET_URL, 
  SOCKET_SURL, 
  SOCKET_GROUP_SURL, 
  PUSH_URL, 
  SOCKET_GROUP_URL 
} from '../../App';

import '../VideoTextTalk/VideoTextTalk.css'
import './GroupTalk.css';

// import SampleImage from '../../components/Image/person-icon-50.jpg';

// import * as firebase from "firebase/app";
// // Add the Firebase services that you want to use
// import "firebase/auth";
// import "firebase/firestore";
// import { isNull, join } from 'lodash';


let isAlreadyCalling = false;
let getCalled = false;

const existingCalls = [];

const { RTCPeerConnection, RTCSessionDescription } = window;
const peerConnection = new RTCPeerConnection();



const GroupTalk = (props) => {
  console.log('GroupTalk.js-props', props);
  // const videoRef = React.createRef();
  const currentUrl = new URL(window.location.href);
  const queryParams = currentUrl.searchParams;
  const roomIdParam = queryParams.get('groupRoomId');
  // console.log('query grouproomid', roomIdParam);



  const lsToken = localStorage.getItem('token');

  const [t] = useTranslation('translation');

  const [store, dispatch] = useStore();
  // console.log('store in GroupTalk.js', store);

  const [userSocket, setUserSocket] = useState('');
  const [userSocketId, setUserSocketId] = useState('');
  const [userList, setUserList] = useState([]);
  const [socketState, setSocketState] = useState('');
  const [callFrom, setCallFrom] = useState('');
  const [callingTo, setCallingTo] = useState('');
  const [isCalling, setIsCalling] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [textInputList, setTextInputList] = useState([]);
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [userImageUrl, setUserImageUrl] = useState('');
  const [userListObj, setUserListObj] = useState([]);
  const [showTextTalk, setShowTextTalk] = useState(false);
  const [isTextTalkDiv, setIsTextTalkDiv] = useState(false);
  const [tryingToCallUser, setTryingToCallUser] = useState('');
  const [talkStartAt, setTalkStartAt] = useState('');
  const [callReject, setCallReject] = useState(false);
  const [usersData, setUsersData] = useState([]);
  const [noUserMessage, setNoUserMessage] = useState('');
  const [userTextTalkList, setUserTextTalkList] = useState([]);
  const [showUserTextTalkList, setShowUserTextTalkList] = useState(true);
  const [showNoconnectTextTalk, setShowNoconnectTextTalk] = useState(false);
  const [noconnectDestUserId, setNoconnectDestUserId] = useState('');
  const [callGet, setCallGet] = useState(false);
  const [suggestList, setSuggestList] = useState([]);
  const [noconnectMessageNotify, setNoconnectMessageNotify] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [showGroupCreation, setShowGroupCreation] = useState(false);
  const [createGroupReslut, setCreateGroupReslut] = useState('');
  // const [showGroupCreationConfirm, setShowGroupCreationConfirm] = useState(false);
  const [isCreateGroup, setIsCreateGroup] = useState(false);
  // const [previousGroupName, setPreviousGroupName] = useState('');
  const [isMember, setIsMember] = useState(false);
  const [showGroupTalkText, setShowGroupTalkText] = useState(false);
  const [deleteMemberResult, setDeleteMemberResult] = useState('');
  const [selectedGroupForEdit, setSelectedGroupForEdit] = useState();
  const [deleteGroupResult, setDeleteGroupResult] = useState('');
  // const [previousDescription, setPreviousDescription] = useState('');

  const [groupList, setGroupList] = useState([]);
  const [joinGroupId, setJoinGroupId] = useState('');
  const [joinGroupName, setJoinGroupName] = useState('');
  const [joinGroupOnlineMember, setJoinGroupOnlineMember] = useState([]);
  // const [groupNameInput, setGroupNameInput] = useState('');
  // const [groupDescriptionInput, setGroupDescriptionInput] = useState('');
  const [groupTextInput, setGroupTextInput] = useState('');
  const [groupTalkInputList, setGroupTalkInputList] = useState([]);
  const [groupTalkId, setGroupTalkId] = useState('');
  const [groupInfo, setGroupInfo] = useState('');
  const [groupAllMemberList, setGroupAllMemberList] = useState([]);

  const [showGroupTextInputElement, setShowGroupTextInputElement] = useState(true);
  const [isTextPosting, setIsTextPosting] = useState(false);

  const [showAuthModal, setShowAuthModal] = useState(false);

  const [groupUserInfo, setGroupUserInfo] = useState();
  const [editFavoriteGroupsResult, setEditFavoriteGroupsResult] = useState('');
  
  const [groupTextReactions, setGroupTextReactions] = useState([]);
  
  // const [getMoreNum, setGetMoreNum] = useState(1);
  // const [isMoreText, setIsMoreText] = useState(false);
  
  // const [listScrollTop, setListScrollTop] = useState(0);

  // const [initialLoad, setInitialLoad] = useState(true);
  // const [isReactionPosting, setIsReactionPosting] = useState(false);
  // const [emitUserInfo, setEmitUserInfo] = useState({});
  // let socket;

  useEffect(() => {
    document.title = 'Group page'
  },[]);


  useEffect(() => {
    // socketConnectHandler();
    window.scrollTo(0, 0);
    console.log(new Date().toUTCString());

    return () => {
      console.log('cleanup socketTest');
      // socketState.disconnect();
      // resetSocket();
      window.location.reload();
    }
  }, []);

  useEffect(() => {
    if (userId && !userId.startsWith('na-')) {
      getUserLocation()
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    }
  },[userId]);

  useEffect(() => {

    if (!userId) {

      //// get users data if there is not in store
      if (store.groupUsersData.length === 0) {
        // getUsersRest(BASE_URL, localStorage.getItem('token'))
        getUsersForGroup(BASE_URL, localStorage.getItem('token'))
        .then(result => {
          console.log(result);
          setUsersData(result.usersData);

          dispatch('SET_GROUP_USERSDATA', result.usersData);
        })
        .catch(err => {
          console.log(err);
        });
      }

      // // set local usersData state when users data exist in store
      if (store.groupUsersData.length > 0 && usersData.length === 0) {
        setUsersData(store.groupUsersData);
      }


      if (!store.userData) {
        // getUserData(GQL_URL, localStorage.getItem('token'))
        getUserDataForStore(BASE_URL, localStorage.getItem('token'))
        .then(result => {
          console.log(result);

          dispatch('SET_USERDATA', result.userData);

          setUserName(result.userData.name);
  
          // setUserId(result.userData.data.user._id);
          setUserId(result.userData.userId);
  
          if (result.userData.imageUrl) {
            setUserImageUrl(result.userData.imageUrl);
          }

          if (!result.userData.userColor) {
            updateUserColor(
              BASE_URL,
              localStorage.getItem('token'),
              result.userData.userId,
              getRandomBgColor(),
            );
          }
          // socketConnectHandler();
        })
        .catch(err => {
          console.log('getUserDataForStore err', err);
          // setNoUserMessage('need to login');
          setNoUserMessage('');

          //// if user data not found (not login), set non-auth userId and name
          const noAuthUserId = `na-${Math.floor(Date.now()/100).toString()}`;
          setUserId(noAuthUserId);
          setUserName('na');
        });
      }

      if (props.isAuth && store.userData) {
        setUserName(store.userData.name);
        // setUserId(store.userData._id);
        setUserId(store.userData.userId);

        if (store.userData.imageUrl) {
          setUserImageUrl(store.userData.imageUrl);
        }

        if (!store.userData.userColor) {
          updateUserColor(
            BASE_URL,
            localStorage.getItem('token'),
            store.userData.userId,
            getRandomBgColor(),
          );
        }
      }

      
    } 

  }, [userId]);




  //// get group list after socketId obtained
  useEffect(() => {
    // if (userSocketId) {
    //   getGroupListHandler();
    // }

    if (userId && userSocketId && store.groupListData.length === 0) {
      getGroupListHandler();
    }
    if (userId && userSocketId && store.groupListData.length > 0) {
      setGroupList(store.groupListData);


    }

  }, [userSocketId, userId])


  useEffect(() => {
    // console.log(isMember, groupTalkId, showGroupTalkText);
    if (isMember && groupTalkId && showGroupTalkText) {
      joinGroupHandler(groupTalkId);
    }
  }, [isMember]);


  useEffect(() => {
    if (!roomIdParam) {
      setShowGroupTalkText(false);
      socketDisconnectHandler();
    }
  },[roomIdParam]);


  const socketDisconnectHandler = () => {
    // socketState.emit('disconnect', {});
    if (socketState) {
      socketState.disconnect();
      initUseState();

      dispatch('SET_GROUPMEMBER_IMAGEURLS', []);
      
      props.history.replace('/group-talk-page');
    }
  };

  const initUseState = () => {
    setUserSocket('');
    setUserSocketId('');
    setUserList([]);
    setSocketState('');
    setCallFrom('');
    setCallingTo('');
    setIsCalling(false);
    setTextInput('');
    setTextInputList([]);
    setUserName('');
    setUserId('');
    setUserImageUrl('');
    setUserListObj([]);
    setShowTextTalk(false);
    setIsTextTalkDiv(false);
    setTryingToCallUser('');
    setTalkStartAt('');
    setCallReject(false);
    setUsersData([]);
    setNoUserMessage('');
    setUserTextTalkList([]);
    setShowUserTextTalkList(true);
    setShowNoconnectTextTalk(false);
    setNoconnectDestUserId('');
    setCallGet(false);
    setSuggestList([]);
    setNoconnectMessageNotify('');
  
    setIsLoading(false);
    setShowGroupCreation(false);
    setCreateGroupReslut('');
    // setShowGroupCreationConfirm(false);
    setIsCreateGroup(false);
    // setPreviousGroupName('');
    setIsMember(false);
    setShowGroupTalkText(false);
    setDeleteMemberResult('');
    setDeleteGroupResult('');
    // setPreviousDescription('');
  
    setGroupList([]);
    setJoinGroupId('');
    setJoinGroupName('');
    setJoinGroupOnlineMember([]);
    // setGroupNameInput('');
    // setGroupDescriptionInput('');
    setGroupTextInput('');
    setGroupTalkInputList([]);
    setGroupTalkId('');
    setGroupInfo('');
    setGroupAllMemberList([]);
  
    setShowGroupTextInputElement(true);
    setIsTextPosting(false);

    setShowAuthModal(false);

    setGroupUserInfo();
    setEditFavoriteGroupsResult('');

    setGroupTextReactions([]);


    // setGetMoreNum(1);
    // setIsMoreText(false);

    // setListScrollTop(0);

    // setInitialLoad(true);
    // setIsReactionPosting(false);
  };




  const textInputHandlerEmoji = (input, value) => {
    // setTextInput(value);
    setGroupTextInput(value);
    // console.log(commentInput);
  }
  const getInputHandler = (input) => {
    // setTextInput(input);
    setGroupTextInput(input);
  }




  const createGroupHandler = (userId, groupName, keywords) => {
    if (props.isAuth) {
      const userObj = userListObj.find(user => {
        return user.userId === userId;
      });
  
      console.log(userId, userObj, userListObj);
  
      // if (userObj) {
      if (userSocketId && userId) {
        setIsLoading(true);
        setCreateGroupReslut('');
  
        socketState.emit('create-group', {
          userId: userId,
          groupName: groupName,
          user: {
            socketId: userSocketId,
            userId: userId,
            userName: userName
          },
          language: navigator.languages[0],
          keywords: keywords,
          token: lsToken,
        });
      }
    } else {
      setShowAuthModal(true);
    }

  }

  const upgradeGroupHandler = (
    userId,
    previousGroupName,
    newGroupName,
    newDescription,
    newKeywords,
    groupRoomId,
  ) => {
    if (props.isAuth) {

      const userObj = userListObj.find(user => {
        return user.userId === userId;
      });
  
      console.log(userId, userObj, userListObj);
  
      // if (userObj) {
      if (userSocketId && userId) {
        setIsLoading(true);
        setCreateGroupReslut('');
        // console.log(previousGroupName, newGroupName);
  
        socketState.emit('upgrade-group', {
          userId: userId,
          previousGroupName: previousGroupName,
          newGroupName: newGroupName,
          newDescription: newDescription,
          newKeywords: newKeywords,
          groupRoomId: groupRoomId,
          user: {
            socketId: userSocketId,
            userId: userId,
            userName: userName
          },
          token: lsToken,
        });
      }

    }
    else {
      setShowAuthModal(true);
    }

  };


  const joinGroupHandler = (groupRoomId) => {
    if (props.isAuth) {
      const userObj = userListObj.find(user => {
        return user.userId === userId;
      });
  
      // if (userObj) {
      if (userSocketId && userId) {
        setIsLoading(true);
  
        socketState.emit('join-group', {
          groupRoomId: groupRoomId,
          user: {
            socketId: userSocketId,
            userId: userId,
            userName: userName
          },
          token: lsToken,
        });
      }
    }
    else {
      setShowAuthModal(true);
    }

  };


  const getGroupListHandler = () => {
    if (userSocketId && userId) {
      setIsLoading(true);

      socketState.emit('get-group-list', {
        user: {
          socketId: userSocketId,
          userId: userId,
          userName: userName
        },
      })
    }
  };

  const getGroupInfoHandler = (groupRoomId) => {
    if (userSocketId && userId) {
      setIsLoading(true);

      socketState.emit('get-group-info', {
        groupRoomId: groupRoomId,
        user: {
          socketId: userSocketId,
          userId: userId,
          userName: userName,

          language: navigator.languages[0],
          geolocation: JSON.parse(localStorage.getItem('userLocation')),
          userAgent: navigator.userAgent,
        },
      })
    }
  };

  const groupTextPostHandler = (text, groupRoomId, filePaths, fileSizes) => {
    if (props.isAuth) {
      if (userSocketId && userId) {
      
        socketState.emit('group-text-send', {
          from: userSocketId,
          fromUserId: userId,
          // to: '',
          // toUserId: toUserId,
          text: text,
          fromName: userName,
          groupRoomId: groupRoomId,
          sendAt: Date.now(),
          language: navigator.languages[0],
          geolocation: JSON.parse(localStorage.getItem('userLocation')),
          token: lsToken,

          fileUrls: filePaths ? filePaths : [],
          filePaths: filePaths ? filePaths : [],
    
          fileSizes: fileSizes ? fileSizes : [],
        });
  
        deleteDraftInput('group', groupTalkId);
        setIsTextPosting(true);

      }
    }
    else {
      setShowAuthModal(true);
    }
   
  };


  const groupTextDeleteHandler = (groupRoomId, groupTalkTextId, fromUserId) => {
    if (props.isAuth) {

      if (userSocketId && userId) {
      
        socketState.emit('group-text-delete', {
          user: {
            socketId: userSocketId,
            userId: userId,
            userName: userName
          },
          token: lsToken,
          groupRoomId: groupRoomId,
          groupTalkTextId: groupTalkTextId,
          fromUserId: fromUserId,
        });

        setIsLoading(true);
  
      }
    }
    else {
      setShowAuthModal(true);
    }
   
  };


  const deleteGroupHandler = (groupRoomId, userId) => {
    if (props.isAuth) {
      if (userSocketId && userId) {
        setIsLoading(true);
        setDeleteGroupResult('');
  
        socketState.emit('delete-group', {
          groupRoomId: groupRoomId,
          user: {
            socketId: userSocketId,
            userId: userId,
            userName: userName
          },
          token: lsToken,
        });
      }
    }
    else {
      setShowAuthModal(true);
    }

  };

  const deleteGroupMemberHandler = (groupRoomId, deleteUserId) => {
    if (props.isAuth) {

      if (userSocketId && userId) {
        setIsLoading(true);
        setDeleteMemberResult('');
  
        socketState.emit('delete-group-member', {
          groupRoomId: groupRoomId,
          deleteUserId: deleteUserId,
          user: {
            socketId: userSocketId,
            userId: userId,
            userName: userName
          },
          token: lsToken,
        });
      }
    }
    else {
      setShowAuthModal(true);
    }
    
  };


  const getGroupUserHandler = (userId) => {
    if (props.isAuth) {

      if (userSocketId && userId) {
        setIsLoading(true);
        // setDeleteMemberResult('');
  
        socketState.emit('get-group-user', {
          userId: userId,
          token: lsToken,
        });
      }
    }
  };

  const editFavoriteGroupsHandler = (userId, favoriteGroups) => {
    if (props.isAuth) {
      if (userSocketId && userId) {
        setIsLoading(true);
        setEditFavoriteGroupsResult('');
  
        socketState.emit('edit-favorite-groups', {
          userId: userId,
          favoriteGroups: favoriteGroups,
          // user: {
          //   socketId: userSocketId,
          //   userId: userId,
          //   userName: userName
          // },
          token: lsToken,
        });
      }
    }
  };


  const createGroupTextReactionHandler = (userId, groupRoomId, groupTalkTextId, type) => {
    if (socketState) {
      // setIsReactionPosting(true);
      setIsLoading(true);

      socketState.emit('create-group-text-reaction', {
        userId: userId,
        groupRoomId: groupRoomId,
        groupTalkTextId: groupTalkTextId,
        type: type,
        token: lsToken,
      });
    }  

  };





  const groupTextInputHandler = (event) => {
    setGroupTextInput(event.target.value);
  };

  const hideGroupCreationHandler = () => {
    window.scrollTo(0, 0);

    setShowGroupCreation(false);
    // setIsUpdateGroup(false);
  }

  // const showGroupCreationConfirmHandler = () => {
  //   setShowGroupCreationConfirm(!showGroupCreationConfirm);
  // }

  const createGroupStartHandler = () => {

    setShowGroupCreation(true);
    setIsCreateGroup(true);

    setCreateGroupReslut('');
  };

  const updateGroupStartHandler = (groupInfo) => {
    // console.log(groupInfo);

    setShowGroupCreation(true);
    setIsCreateGroup(false);

    setSelectedGroupForEdit(groupInfo);

    setCreateGroupReslut('');
  };

  const getIsMemberHandler = (memberState) => {
    setIsMember(memberState);
  };

  const showGroupTalkTextHandler = (groupRoomId, shareGroupId, shareFileType) => {
    if (!showGroupTalkText) {
      if (shareGroupId && shareFileType) {
        props.history.push(`/group-talk-page/?groupRoomId=${groupRoomId}&shareGroupId=${shareGroupId}&shareFileType=${shareFileType}`);  
      } else {
        props.history.push(`/group-talk-page/?groupRoomId=${groupRoomId}`);
      }
      // props.history.push(`/group-talk-page/${groupRoomId}`);
    }
    else {
      props.history.push('/group-talk-page');
    }

    setShowGroupTalkText(!showGroupTalkText);
  };

  const showGroupTextInputElementHandler = () => {
    setShowGroupTextInputElement(!showGroupTextInputElement);
  };





  let groupControlBody;
  // if (socketState && userSocketId && !joinGroupId) {
  if (socketState && userSocketId && !showGroupTalkText) {
    if (showGroupCreation) {
      groupControlBody = (
        <div>

        {isCreateGroup 
          ? 
            <CreateGroupForm 
              userId={userId}
              createGroupHandler={createGroupHandler}
              createGroupReslut={createGroupReslut}
              hideGroupCreationHandler={hideGroupCreationHandler}
              getGroupListHandler={getGroupListHandler}
              isLoading={isLoading}
            />
          :
            <EditGroupForm
              userId={userId}
              selectedGroupForEdit={selectedGroupForEdit}
              createGroupReslut={createGroupReslut}
              hideGroupCreationHandler={hideGroupCreationHandler}
              getGroupListHandler={getGroupListHandler}
              upgradeGroupHandler={upgradeGroupHandler}
              isLoading={isLoading}
            />
        }

        </div>
      )
    }

    else {
      groupControlBody = (
        <div>

          {props.isAuth 
            ?  (  
                <div>
                  <GroupListControll
                    groupList={groupList}
                    groupUserInfo={groupUserInfo}
                    showGroupTalkTextHandler={showGroupTalkTextHandler}
                    getGroupInfoHandler={getGroupInfoHandler} 
                    editFavoriteGroupsHandler={editFavoriteGroupsHandler}
                    editFavoriteGroupsResult={editFavoriteGroupsResult}
                    isLoading={isLoading}
                  />

                  <div className="groupTalk__showGroupCreate groupTalk__buttonSmall">
                    <Button mode="flat" type="submit"
                      onClick={() => { 
                        if (!props.isAuth) {
                          setShowAuthModal(true);
                        } else {
                          createGroupStartHandler() 
                        }
                      }}
                    >
                      {/* Create Group */}
                      {t('groupTalk.text13')}
                    </Button>
                  </div>
                </div>
                )
            : null
          }

          <GroupList
            usersData={usersData}
            groupList={groupList}
            joinGroupId={joinGroupId}
            // joinGroupHandler={joinGroupHandler}
            userId={userId}
            updateGroupStartHandler={updateGroupStartHandler}
            showGroupTalkTextHandler={showGroupTalkTextHandler}
            getGroupInfoHandler={getGroupInfoHandler}
            deleteGroupHandler={deleteGroupHandler}
            showGroupTalkText={showGroupTalkText}
            deleteGroupResult={deleteGroupResult}
            isLoading={isLoading}
            // groupUserInfo={groupUserInfo}
            getGroupUserHandler={getGroupUserHandler}
          />
        </div>
      );
    }

  }


  let backToListButton;
  if (showGroupTalkText && !isMember) {
    backToListButton = (
      <div className="groupTalk__BackToListButton groupTalk__buttonSmall">
        <Button mode="flat" type="submit"
          className="groupTalk__BackToListButton"
          onClick={() => {
            showGroupTalkTextHandler();
            socketDisconnectHandler();
          }}
        >
          {/* Back to List */}
          {t('groupTalk.text11')}
        </Button>
      </div>
    );
  }
  if (showGroupTalkText && isMember) {
    backToListButton = (
      <div className="groupTalk__BackToListButton groupTalk__buttonSmall">
        <Button mode="flat" type="submit"
          onClick={() => {
            showGroupTalkTextHandler();
            // leaveGroupHandler();
            socketDisconnectHandler();

            //// notify draft save and delte notification
            if (getDraftInput('group', groupTalkId)) {
              // dispatch('SHOW_NOTIFICATION', {
              //   status: 'pending',
              //   title: '',
              //   message: 'Draft saved in device',
              // });

              // setTimeout(() => {
              //   dispatch('CLEAR_NOTIFICATION');
              // }, 1000*3);
            }
          }}
        >
          {/* Back to List */}
          {t('groupTalk.text11')}
        </Button>
      </div>
    )
  }


  let groupTextBody;
  // if (joinGroupId) {
  if (showGroupTalkText) {

    // const creatorInfo = usersData.find(element => {
    //   return element.userId === groupInfo.creatorUserId;
    // });

    // console.log(groupUserInfo);

    groupTextBody = (
      <div>

        {backToListButton}

        <GroupJoinControll 
          userId={userId}
          // usersData={usersData}
          joinGroupId={joinGroupId}
          groupTalkId={groupTalkId}
          groupInfo={groupInfo}
          groupAllMemberList={groupAllMemberList}
          isAuth={props.isAuth}
          joinGroupHandler={joinGroupHandler}
          deleteGroupMemberHandler={deleteGroupMemberHandler}
          deleteMemberResult={deleteMemberResult}
          isMember={isMember}
          // getIsMemberHandler={getIsMemberHandler}
          setShowAuthModal={setShowAuthModal}
          isLoading={isLoading}
        />

        <GroupInfoMemberList
          groupAllMemberList={groupAllMemberList}
          userId={userId}
          // usersData={usersData}
          groupInfo={groupInfo}
          // getIsMemberHandler={getIsMemberHandler}
          joinGroupOnlineMember={joinGroupOnlineMember}
          allMemberUserIds={groupInfo.allMemberUserIds}
          deleteGroupMemberHandler={deleteGroupMemberHandler}
          deleteMemberResult={deleteMemberResult}
          isAuth={props.isAuth}
          isLoading={isLoading}
        />

        {props.isAuth &&
          <GroupTalkTextListInfo
            userId={userId}
            groupInfo={groupInfo}
            groupAllMemberList={groupAllMemberList}
            getIsMemberHandler={getIsMemberHandler}
            // usersData={usersData}
            // creatorInfo={creatorInfo}
            groupUserInfo={groupUserInfo}
            editFavoriteGroupsHandler={editFavoriteGroupsHandler}
            editFavoriteGroupsResult={editFavoriteGroupsResult}
            isLoading={isLoading}
          />
        }

        <GroupTalkTextList
          groupTalkInputList={groupTalkInputList}
          userName={userName}
          userId={userId}
          groupAllMemberList={groupAllMemberList}
          showGroupTextInputElement={showGroupTextInputElement}
          groupTextReactions={groupTextReactions}
          createGroupTextReactionHandler={createGroupTextReactionHandler}
          getGroupInfoHandler={getGroupInfoHandler}
          groupTalkId={groupTalkId}
          groupTextDeleteHandler={groupTextDeleteHandler}
          // getMoreNum={getMoreNum}
          // setGetMoreNum={setGetMoreNum}
          isLoading={isLoading}
        />

        {/* {isMember && showGroupTextInputElement ? */}
        {showGroupTextInputElement ?
          <div className="groupTalk__textInputContainer">
            <GroupTalkTextInput
              getInputHandler={getInputHandler}
              textInputHandlerEmoji={textInputHandlerEmoji}
              groupTextInput={groupTextInput}
              groupTextPostHandler={groupTextPostHandler}
              joinGroupId={joinGroupId}
              showGroupTextInputElement={showGroupTextInputElement}
              showGroupTextInputElementHandler={showGroupTextInputElementHandler}
              isTextPosting={isTextPosting}
              isAuth={props.isAuth}
              isMember={isMember}
              setShowAuthModal={setShowAuthModal}
              isLoading={isLoading}
            />
          </div>
          : null
        }

        {showGroupTextInputElement ?
          <div
            className="groupTalk__showInputButton"
            // style={{position: "fixed", bottom:"75px", right:"1px"}}
            onClick={() => {
              showGroupTextInputElementHandler();
              // textPostHandler(textInput);
            }}
          >
            <Button
              mode="raised" type="submit"
              disabled={groupTextInput}
              onClick={() => {
                showGroupTextInputElementHandler();
                // textPostHandler(textInput);
              }}
            >
              {/* hide */}
              {t('groupTalk.text36', 'hide')}
            </Button>
          </div>
          :
          <div className="groupTalk__showInputButton"
          // style={{fontSize:"0.75rem", width:"40%", bottom:"1px"}}
          >
            <Button
              mode="raised" type="submit"
              // disabled={!groupTextInput}
              onClick={() => {
                showGroupTextInputElementHandler();
                // textPostHandler(textInput);
              }}
            >
              {/* write text */}
              {t('groupTalk.text37', 'write text')}
              </Button>
          </div>
        }


      </div>
    );
  }





  let connectButton;
  if (!userSocketId && userId && userName && usersData.length > 0) {
 
  }
  if (userSocketId && userId && userName && usersData.length > 0) {

  }
  if (!props.isAuth) {

  }





  
  return (
    <Fragment>
      <div className="groupTalk__appContainer">
        <div>

        {!showGroupTalkText && !roomIdParam && store.windowValues && (store.windowValues.width < 768) && (
          <AdElementDisplay
            adType='300x65' 
            adPlaceId='grouppage-top' 
          />
        )}
        {store.windowValues && (store.windowValues.width >= 768) && (
        <AdElementDisplay 
            adType='300x300'
            adPlaceId='grouppage-right' 
          />
        )}

      

        {showAuthModal && 
          <GroupTalkAuthModal 
            setShowAuthModal={setShowAuthModal}
          />
        }

          {isLoading &&
            <div className="groupTalk__loader">
              <Loader />
            </div>
          }

          <div>
            <div className="textTalk_NoconnectMessage">
              {noconnectMessageNotify}
            </div>

            <div className="groupTalk__ConnectButton">
              {noUserMessage}
              {connectButton}
            </div>

            {groupControlBody}

            {groupTextBody}
          </div>

        </div>
      </div>

      <GroupTalkSocket 
        setIsLoading={setIsLoading}
        setSocketState={setSocketState}
        setUserSocketId={setUserSocketId}
        userId={userId}
        userName={userName}
        userImageUrl={userImageUrl}
        userListObj={userListObj}
        setUserListObj={setUserListObj}
        userSocketId={userSocketId}
        setNoconnectMessageNotify={setNoconnectMessageNotify}
        setCreateGroupReslut={setCreateGroupReslut}
        setGroupList={setGroupList}
        setJoinGroupId={setJoinGroupId}
        setJoinGroupName={setJoinGroupName}
        setJoinGroupOnlineMember={setJoinGroupOnlineMember}
        setGroupTalkInputList={setGroupTalkInputList}
        groupInfo={groupInfo}
        groupTalkId={groupTalkId}
        groupAllMemberList={groupAllMemberList}
        setGroupInfo={setGroupInfo}
        setGroupTalkId={setGroupTalkId}
        usersData={usersData}
        setGroupAllMemberList={setGroupAllMemberList}
        setDeleteGroupResult={setDeleteGroupResult}
        setDeleteMemberResult={setDeleteMemberResult}
        setIsTextPosting={setIsTextPosting}
        setGroupTextInput={setGroupTextInput}
        setGroupUserInfo={setGroupUserInfo}
        setEditFavoriteGroupsResult={setEditFavoriteGroupsResult}
        setGroupTextReactions={setGroupTextReactions}
      />
    </Fragment>
  );
};

export default GroupTalk;