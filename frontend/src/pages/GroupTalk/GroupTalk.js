import React from 'react';
import { useState, useEffect } from 'react';
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

import SampleImage from '../../components/Image/person-icon-50.jpg';

import * as firebase from "firebase/app";
// Add the Firebase services that you want to use
import "firebase/auth";
import "firebase/firestore";
import { isNull, join } from 'lodash';


let isAlreadyCalling = false;
let getCalled = false;

const existingCalls = [];

const { RTCPeerConnection, RTCSessionDescription } = window;
const peerConnection = new RTCPeerConnection();



const GroupTalk = (props) => {
  // console.log('GroupTalk.js-props', props);
  // const videoRef = React.createRef();
  const currentUrl = new URL(window.location.href);
  const queryParams = currentUrl.searchParams;
  const roomIdParam = queryParams.get('groupRoomId');
  // console.log('query grouproomid', roomIdParam);


  let socket

  const lsToken = localStorage.getItem('token');

  const [t] = useTranslation('translation');

  const [store, dispatch] = useStore();
  console.log('store in GroupTalk.js', store);

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


  useEffect(() => {
    setIsLoading(true);

    if (userId && usersData.length > 0 && userName) {
      setIsLoading(false);
    }

    if (!userSocketId && userId && userName && usersData.length > 0) {
      console.log(userId, userName);
      socketConnectHandler();
    }
  }, [userId, usersData, userSocketId, userName]);


  // useEffect(() => {
  //   setIsLoading(true);

  //   if (userId && usersData.length > 0) {
  //     setIsLoading(false);
  //   }

  // }, [userId, usersData]);

  // useEffect(() => {
  //   if (userId) {
  //     getUserTextTalksHandler(userId, SOCKET_URL, localStorage.getItem('token'));
  //   }
  // }, [userId]);







  // useEffect(() => {
  //   if (callGet) {
  //     setShowNoconnectTextTalk(false);
  //     setShowNoconnectTextTalk(false);
  //     setNoconnectDestUserId('');
  //   }
  // }, [callGet]);

  // useEffect(() => {
  //   console.log(textInputList);
  // }, [textInputList.length])

  // // useEffect(() => {
  // //   // var div = document.getElementById('text-talk');
  // //   // console.log('div', div);
  // //   scrollToBottom('text-talk');
  // // }, [groupTalkInputList.length]);

  // useEffect(() => {

  //   const userObj = userListObj.find(user => {
  //     return user.userId === userId;
  //   });

  //   if (userObj && userObj.calling) {
  //     const destUserObj = userListObj.find(user => {
  //       return user.userId === userObj.destUser.userId;
  //     });
  //     // console.log('user', userObj, 'destUser', destUserObj);

  //     if (destUserObj && destUserObj.calling &&
  //       destUserObj.destUser.userId === userId
  //     ) {
  //       setCallingTo(destUserObj);
  //     }
  //   }

  //   //// disconnect and reload when callingTo user disconnect
  //   const callingToUser = userListObj.find(user => {
  //     return user.userId === callingTo.userId && user.socketId === callingTo.socketId;
  //   });

  //   if (callingTo && !callingToUser) {
  //     // setCallingTo('');
  //     alert('Calling user disconnected');

  //     socketState.disconnect();
  //     resetSocket();
  //     window.location.reload();
  //     // socketCloseHandler2();
  //   }

  //   //// disconnect and reload when useObj's socketId is 
  //   //// different from cilent's socketId
  //   if (userObj && userObj.socketId !== userSocketId) {
  //     socketState.disconnect();
  //     resetSocket()
  //     window.location.reload();
  //   }


  //   //// find connecton-made user and if destuser is userId, connect
  //   if (userObj && !userObj.calling) {
  //     const connectionMadeUser = userListObj.find(user => {
  //       if (user.destUser && user.destUser.userId === userId) {
  //         return user;
  //       }
  //     });

  //     if (connectionMadeUser && !callReject) {
  //       callUser(connectionMadeUser.socketId);
  //     }
  //   }

  //   //// find trying to call user, not yet start talking, set tryingToCallUser for display
  //   if (userObj && userObj.calling) {
  //     const destinationUser = userListObj.find(user => {
  //       return user.userId === userObj.destUser.userId;
  //     });

  //     if (destinationUser && !destinationUser.destUser || destinationUser.destUser.userId !== userObj.userId) {
  //       setTryingToCallUser(userObj.destUser);
  //     }

  //     if (destinationUser && destinationUser.destUser && destinationUser.destUser.userId === userObj.userId) {
  //       setTryingToCallUser('');

  //       if (destinationUser.talkStartAt) {
  //         setTalkStartAt(destinationUser.talkStartAt);
  //       }
  //       if (userObj.talkStartAt) {
  //         setTalkStartAt(userObj.talkStartAt);
  //       }
  //     }

  //   }

  // }, [userListObj]);








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

      // for (const ele of store.groupListData) {
      //   if (ele.members.length > 0) {

      //     const isUser = ele.members.find(mem => {
      //       return mem.userId === userId
      //     });
      //     if (isUser) {
      //       // isUserInList = true;
      //       // isUserGroup = ele;
      //       setJoinGroupId(ele.groupRoomId);
      //       setJoinGroupName(ele.groupName);
      //       setJoinGroupOnlineMember(ele.members);
      //     }
      //   }
      // }

    }

  }, [userSocketId, userId])


  useEffect(() => {
    // console.log(isMember, groupTalkId, showGroupTalkText);
    if (isMember && groupTalkId && showGroupTalkText) {
      joinGroupHandler(groupTalkId);
    }
  }, [isMember]);


  //// store draft text in localstorage
  // useEffect(() => {
  //   if (groupTalkId) {

  //     //// check draft text in localstorage and set draft in input
  //     if (!groupTextInput) {
  //       const lsDraft = getDraftInput('group', groupTalkId);

  //       if (lsDraft) {
  //         setGroupTextInput(lsDraft);
  //       }
  //     }

  //     //// text input length is longer than x store draft in localstorage
  //     if (groupTextInput && groupTextInput.length >= 10) {
  //       storeDraftInput('group', groupTalkId, groupTextInput);
  //     }

  //     //// text input length is less than x delete draft from localstorage
  //     if (groupTextInput && groupTextInput.length < 10) {
  //       deleteDraftInput('group', groupTalkId);
  //     }

  //   }
  // },[groupTalkId, groupTextInput]);
  
  // useEffect(() => {
  //   if (!userSocketId && userId && userName && usersData) {
  //     socketConnectHandler()
  //   }
  // }, [userSocketId, userId, userName, usersData]);


  // async function callUser(socketId) {
  //   const offer = await peerConnection.createOffer();
  //   await peerConnection.setLocalDescription(new RTCSessionDescription(offer));

  //   socketState.emit("call-user", {
  //     offer,
  //     to: socketId,
  //     user: {
  //       userId: userId,
  //       userName: userName,
  //       socketId: userSocketId,
  //     }
  //   });
  // }


  // const callRejectHandler = () => {
  //   socketState.emit("reject-call", {
  //     from: userSocketId
  //   });
  // }

  const socketConnectHandler = () => {
    // socket = openSocket.connect("localhost:4001");

    // let socket

    // if (!socketState) {
    //   socket = openSocket.connect("localhost:4001");
    //   console.log('socket', socket, 'socket.id', socket.id);
    //   console.log(socket.id);
    //   setSocketState(socket);

    // } else {
    //   socket = socketState;
    //   console.log('userId, userName', userId, userName);

    //   socket.emit('user-info', {
    //     socketId: userSocketId,
    //     userId: userId,
    //     userName: userName,
    //     connectAt: Date.now()
    //   });
    // }

    // socket = openSocket.connect("localhost:4001");
    // socket = openSocket.connect(SOCKET_SURL);
    // socket = openSocket.connect(SOCKET_SURL, {

    setIsLoading(true);

    socket = openSocket.connect(SOCKET_GROUP_SURL, {
      reconnection: true,
      reconnectionDelay: 500,
      transports: ['websocket']
    });
    console.log('socket', socket);
    setSocketState(socket);


    socket.on('user-socket', (data) => {
      console.log('user-socket :', data);
      const userSocketId = data.userSocketId;
      setUserSocketId(data.userSocketId);

      // console.log('userId, userName', userId, userName);
      // setUserSocket(data.socket);
      // updateUser(data.userSocketId);
      const sendData = {
        socketId: userSocketId,
        userId: userId,
        userName: userName,
        userImageUrl: userImageUrl,
        connectAt: Date.now(),
        token: lsToken,
      };
      // setEmitUserInfo(sendData);
      socket.emit('user-info', sendData);


      // // send request to get group user info
      socket.emit('get-group-user', {
        userId: userId,
        token: lsToken,
      });


    });

    socket.on('new-connection', (data) => {
      console.log('new-connection data', data);
    })

    // // console.log('userObj', userObj);

    socket.on("update-user-list", ({ users }) => {
      console.log("update-user-list", users);
      // setUserList(users);

      const userObj = userListObj.find(element => {
        return element.userId === userId;
      });

      socket.emit('update-user-list-recieved', {
        users: users,
        // user: {
        //   userId: userId,
        //   socketId: userSocketId,
        //   userName: userName
        // }
        user: userObj
      });

      // if (users.indexOf(callingTo) < 0) {
      //   setCallingTo('');
      // }

      // updateUserList(users);

      // socket.emit('hey', {
      //   to: users
      // });
    });

    socket.on("remove-user", ({ socketId, activeSockets }) => {
      console.log('remove-user socketId', socketId);
      console.log('remove-user activeSockets', activeSockets);

      // socket.emit("user-removed", {
      //   activeSockts: activeSockets
      // });


      // const elToRemove = document.getElementById(socketId);
      // console.log('elToRemove', elToRemove);
      // if (elToRemove) {
      //   elToRemove.remove();
      // }
    });



    // socket.on("call-made", async data => {
    //   console.log('call-made data', data);
    //   // setCallFrom(data.socket);

    //   setCallReject(false);

    //   const confirmed = window.confirm(
    //     // `User name: ${data.user.userName} wants to call you. Do you accept this call?`
    //     `${data.user.userName} ${t('videoTalk.text13')}`
    //   );
    //   console.log('confirmed', confirmed);

    //   if (!confirmed) {

    //     setCallReject(true);

    //     socket.emit("reject-call", {
    //       from: data.socket,
    //       user: {
    //         userId: userId,
    //         userName: userName,
    //         socketId: userSocketId
    //       }
    //     });

    //     return;
    //   }

    //   if (getCalled) {
    //     // const confirmed = window.confirm(
    //     //   `User "Socket: ${data.socket}" wants to call you. Do accept this call?`
    //     // );


    //     if (!confirmed) {

    //       setCallReject(true);

    //       socket.emit("reject-call", {
    //         from: data.socket,
    //         user: {
    //           userId: userId,
    //           userName: userName,
    //           socketId: userSocketId
    //         }
    //       });

    //       return;
    //     }
    //   }

    //   await peerConnection.setRemoteDescription(
    //     new RTCSessionDescription(data.offer)
    //   );

    //   const answer = await peerConnection.createAnswer();
    //   await peerConnection.setLocalDescription(new RTCSessionDescription(answer));

    //   // console.log('before make-anser peerConnection', peerConnection);

    //   socket.emit("make-answer", {
    //     answer,
    //     to: data.socket,
    //     // user: {
    //     //   userId: userId,
    //     //   userName: userName,
    //     //   socketId: userSocketId
    //     // }
    //   });
    //   getCalled = true;

    //   setCallGet(true);

    // });

    // socket.on("answer-made", async data => {
    //   console.log("answer-made data", data);
    //   await peerConnection.setRemoteDescription(
    //     new RTCSessionDescription(data.answer)
    //   );

    //   console.log('anser-made peerConnection', peerConnection);

    //   // setCallingTo(data.socket);
    //   console.log('data.destUser', data.destUser);
    //   // setCallingTo(data.destUser);


    //   if (!isAlreadyCalling) {
    //     // callUser(data.socket);
    //     isAlreadyCalling = true;
    //     setIsCalling(true);
    //   }

    //   // const user = userListObj.find(element => {
    //   //   return element.socketId === userSocketId;
    //   // });
    //   // console.log('user', user);

    //   socket.emit('connection-made', {
    //     destUser: data.destUser
    //   });

    // });

    // socket.on("call-rejected", data => {
    //   console.log('call-rejected data', data);
    //   alert(
    //     // `${data.user.userName} reject your call.`
    //     `${data.user.userName} ${t('videoTalk.text14')}.`
    //   );
    //   window.location.reload();
    //   // unselectUsersFromList();
    // });


    // // peerConnection.ontrack = function ({ streams: [stream] }) {
    // //   console.log('stream peeronnection.ontrack', [stream]);
    // //   const remoteVideo = document.getElementById("remote-video");
    // //   console.log('remoteVideo', remoteVideo);
    // //   if (remoteVideo) {
    // //     remoteVideo.srcObject = stream;
    // //   }
    // // };

    // // const localVideo = document.getElementById("local-video");
    // // console.log('localVideo.srcObject o', localVideo, localVideo.srcObject);
    // // console.log('peerConnection', peerConnection);

    // // navigator.getUserMedia(
    // //   { video: true, audio: true },
    // //   stream => {
    // //     const localVideo = document.getElementById("local-video");
    // //     if (localVideo) {
    // //       // localVideo.srcObject = stream;
    // //       // console.log('localVideo.srcObject', localVideo, localVideo.srcObject);
    // //     }

    // //     // videoRef.current = stream

    // //     // console.log('videoRef', videoRef);
    // //     // console.log('stream', stream);
    // //     // console.log(videoRef);
    // //     // videoRef.current = stream;
    // //     // console.log('videoref current', videoRef.current)



    // //     stream.getTracks().forEach(track => {
    // //       // console.log('track, stream', track, stream);
    // //       // return peerConnection.addTrack(track, stream)
    // //     });
    // //   },
    // //   error => {
    // //     console.warn(error.message);
    // //   }
    // // );




    socket.on('update-usersObj-list', data => {
      console.log('update-usersObj-list data', data);

      setUserListObj(data.usersObj);

      // const userObj = data.usersObj.find(element => {
      //   return element.userId === userId;
      // });

      socket.emit('update-usersObj-list-recieved', {
        usersObj: data.usersObj,
        user: {
          userId: userId,
          socketId: userSocketId,
          userName: userName
        },
        // user: userObj
      });
      // const callingToUser = data.usersObj.find(user => {
      //   return user.userId === callingTo.userId;
      // });
      // console.log('callingToUser', callingToUser, 'callingTo', callingTo);
      // if (callingTo && !callingToUser) {
      //   setCallingTo('');
      // }

      // if (data.usersObj.indexOf(callingTo) < 0) {
      //   setCallingTo('');
      // }

    });


    socket.on('new-user-info', data => {
      console.log('new-user-info data', data);

      // console.log('emitUserInfo', emitUserInfo)

      socket.emit('new-user-info-recieved', {
        newUser: data.newUser,
        user: {
          userId: userId,
          socketId: userSocketId,
          userName: userName
        },
        usersObj: data.usersObj
        // recievedUser: emitUserInfo
      });
    });

    socket.on('ask-usersObj', data => {
      console.log('ask-usersObj data', data);

      socket.emit('ask-usersObj-recieved', {
        askUser: data,
        user: {
          userId: userId,
          socketId: userSocketId,
          userName: userName
        }
      });
    });







    // socket.on("update-text-list", data => {
    //   console.log('update-text-list data', data);

    //   if (data.textList.length > 0 && data.textList.length !== textInputList.length &&
    //     data.textList[data.textList.length - 1].fromUserId === userId
    //   ) {
    //     setTextInput('');
    //   }

    //   const lastListElement = data.textList[data.textList.length - 1];

    //   if (lastListElement && lastListElement.fromUserId && lastListElement.toUserId) {
    //     if (lastListElement.fromUserId === userId || lastListElement.toUserId === userId) {
    //       setTextInputList(data.textList);

    //     }
    //   }

    //   // setTextInputList(data.textList);
    // });

    // socket.on('new-text-send', data => {
    //   console.log('new-text-send, data', data);
    //   // console.log(userId, callingTo);

    //   console.log(textInputList);
    //   // const beforeList = textInputList.map(element => {
    //   //   return element;
    //   // });
    //   // console.log('beforeList', beforeList);
    //   // const addList = beforeList.push(data.textData);
    //   // console.log('addList');

    //   // setTextInputList(addList);

    //   // getTextListHandler(userId, callingTo.userId, localStorage.getItem('token'), SOCKET_URL);
    // })

    // socket.on('textTalks-data', data => {
    //   console.log('textTalks-data data', data);
    //   setUserTextTalkList(data.talkList);
    // });

    // socket.on('send-text-forPush', data => {
    //   console.log('send-text-forPush', data);

    //   sendTextPushHandler(
    //     PUSH_URL,
    //     // BASE_URL, 
    //     localStorage.getItem('token'),
    //     data.text.fromUserId,
    //     data.text
    //   )
    //     .then(res => {
    //       console.log(res);
    //     })
    //     .catch(err => {
    //       console.log(err);
    //     })

    // });







    socket.on('text-from-noconnect-user', data => {
      console.log('text-from-noconnect-user data', data);

      //// implement to display message notify 
      setNoconnectMessageNotify(<div>
        new message from user
          <br />
        {data.text.fromName}
      </div>
      );

      setTimeout(() => {
        setNoconnectMessageNotify('');
      }, 1000 * 5);

    });







    socket.on('create-group-result', data => {
      console.log('create-group-result data', data);

      setCreateGroupReslut(data.message);
      setIsLoading(false);

    });

    socket.on('upgrade-group-result', data => {
      console.log('upgrade-group-result data', data);

      setCreateGroupReslut(data.message);
      setIsLoading(false);
    });

    socket.on('update-group-list', data => {
      console.log('update-group-list data', data);

      setIsLoading(false);
      setGroupList(data.groups);


      dispatch('SET_GROUP_LISTDATA', data.groups);


      for (const ele of data.groups) {
        if (ele.members.length > 0) {

          const isUser = ele.members.find(mem => {
            return mem.userId === userId
          });
          if (isUser) {
            // isUserInList = true;
            // isUserGroup = ele;
            setJoinGroupId(ele.groupRoomId);
            setJoinGroupName(ele.groupName);
            setJoinGroupOnlineMember(ele.members);
          }

        }
      }

    });

    socket.on('update-group', data => {
      console.log('update-group data', data);

      const talks = data.group.talks;

      // ////check user wrote last text of talks
      // if (talks.length > 0 &&
      //   talks.length !== groupTalkInputList.length &&
      //   talks[talks.length - 1].fromUserId === userId
      // ) {

      //   setGroupTextInput('');
      // }

      setGroupTalkInputList(talks);

      if (!groupInfo || !groupTalkId || !groupAllMemberList.length === 0) {
        setGroupInfo(data.group);
        setGroupTalkId(data.group.groupRoomId);


        //// get group text reactions
        socket.emit('get-group-text-reactions', {
          userId: userId,
          groupRoomId: data.group.groupRoomId,
        });
        

        if (groupAllMemberList.length === 0) {
  
          const allMemberList = [];
  
          for (const user of data.group.allMemberUserIds) {
            const userInUsersData = usersData.find(element => {
              return element.userId === user.userId;
            });
    
            if (userInUsersData) {
              allMemberList.push(userInUsersData);
            }
          }
    
          setGroupAllMemberList(allMemberList);
        }
      }
  
      setIsLoading(false);
      
      


      // const isUserInGroup = data.group.members.find(member => {
      //   return member.userId === userId;
      // });

      // if (isUserInGroup) {
      //   setJoinGroupId(data.group.groupRoomId);
      //   setJoinGroupName(data.group.groupName);
      // }
    });


    socket.on('join-group-result', data => {
      console.log('join-group-result', data);

      setIsLoading(false);

      // setTimeout(() => {
      //   setDeleteMemberResult('');
      //   if (!data.error) {
      //     window.location.reload();
      //   }
      // }, 3000);
    });

    socket.on('delete-group-result', data => {
      console.log('delete-group-result', data);
 
      setDeleteGroupResult(data.message);     
      setIsLoading(false);

      setTimeout(() => {
        setDeleteMemberResult('');
        if (!data.error) {
          window.location.reload();
        }
      }, 3000);

    });


    socket.on('delete-group-member-result', data => {
      console.log('delete-group-member-result', data);

      setDeleteMemberResult(data.message);
      setIsLoading(false);

      setTimeout(() => {
        setDeleteMemberResult('');
        if (!data.error) {
          window.location.reload();
        }
      }, 3000);
    });


    socket.on('group-text-send-result', data => {
      console.log('group-text-send-result', data);

      setIsTextPosting(false);

      if (data.textData) {
        setGroupTextInput('');

        socket.emit('group-text-send-result-recieved', data);

        // sendGroupTextPushHandler(
        //   PUSH_URL,  // BASE_URL, 
        //   // SOCKET_GROUP_URL,
        //   localStorage.getItem('token'),
        //   userId,
        //   data.idsForPush,
        //   data.textData,
        // )
        //   .then(res => {
        //     console.log(res);
        //   })
        //   .catch(err => {
        //     console.log(err);
        //   });

      }

    });

    socket.on('group-text-delete-result', data => {
      console.log('group-text-delete-result', data);

      setIsLoading(false);
    });

    socket.on('group-push-result', data => {
      console.log('group-push-result data', data);

    });



    socket.on('get-group-user-result', data => {
      console.log('get-group-user-result data', data);

      if (data.groupUserInfo) {
        // console.log('data.groupUser', data);
        setGroupUserInfo(data.groupUserInfo);
      }
      setIsLoading(false);
    });

    socket.on('edit-favorite-groups-result', data => {
      console.log('edit-favorite-groups-result data', data);
      
      setEditFavoriteGroupsResult(data.message);

      setTimeout(() => {
        setEditFavoriteGroupsResult('');

        if (data.groupUserInfo) {
          setGroupUserInfo(data.groupUserInfo);
        }
      }, 1000*5);

      setIsLoading(false);

    });



    socket.on('get-group-text-reactions-result', data => {
      console.log('get-group-text-reactions-result data', data);

      setGroupTextReactions(data.groupRoomReactions);
      setIsLoading(false);
    });

    socket.on('create-group-text-reaction-result', data => {
      console.log('create-group-text-reaction-result data', data);

      setIsLoading(false);

      if (!data.error) {

        setIsLoading(true);

        socket.emit('get-group-text-reactions', {
          userId: userId,
          groupRoomId: data.reactionData.groupRoomId,
        });
      }
    });



  }





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
    // setIsReactionPosting(false);
  };





  // const socketCloseHandler = () => {
  //   // console.log('in socketCloseHandler');
  //   if (socketState) {
  //     console.log('socketState', socketState);

  //     if (callingTo) {
  //       const confirmed = window.confirm(
  //         // `You are still talking. Do you want to stop talking?`
  //         `${t('videoTalk.text11')}`
  //       );

  //       if (confirmed) {
  //         socketState.disconnect();
  //         resetSocket()
  //         window.location.reload();
  //       }

  //     } else {
  //       socketState.disconnect();
  //       resetSocket()
  //       window.location.reload();
  //     }


  //   }
  // }

  // const resetSocket = () => {
  //   setSocketState('');
  //   setUserSocketId('');
  //   setUserList([]);
  //   setCallingTo('');
  //   setIsCalling(false);
  // }


  // const showTextTalkHandler = () => {
  //   setShowTextTalk(!showTextTalk);
  //   window.scrollTo(0, 0);
  // }


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

  // const leaveGroupHandler = (groupRoomId) => {
  //   const userObj = userListObj.find(user => {
  //     return user.userId === userId;
  //   });

  //   // if (userObj) {

  //   // if (userSocketId && userId) {
  //   //   socketState.emit('leave-group', {
  //   //     groupRoomId: groupRoomId,
  //   //     user: {
  //   //       socketId: userSocketId,
  //   //       userId: userId,
  //   //       userName: userName
  //   //     },
  //   //   });

  //   //   // setJoinGroupId('');
  //   //   // setJoinGroupName('');
  //   //   // setJoinGroupOnlineMember([]);

  //   // }

  //   window.location.reload();
  // };

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

  const groupTextPostHandler = (text, groupRoomId) => {
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

    // if (props.isAuth) {
    //   if (userSocketId && userId) {
    //     setIsLoading(true);
    //     setEditFavoriteGroupsResult('');
  
    //     socketState.emit('edit-favorite-groups', {
    //       userId: userId,
    //       favoriteGroups: favoriteGroups,
    //       // user: {
    //       //   socketId: userSocketId,
    //       //   userId: userId,
    //       //   userName: userName
    //       // },
    //       token: lsToken,
    //     });
    //   }
    // }
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

  const showGroupTalkTextHandler = (groupRoomId) => {
    if (!showGroupTalkText) {
      props.history.push(`/group-talk-page/?groupRoomId=${groupRoomId}`);
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
    // connectButton = (<Button mode="raised" type="submit" onClick={socketConnectHandler}>
    //   {/* Start Connect */}
    //   {t('videoTalk.text1')}
    // </Button>);
  }
  if (userSocketId && userId && userName && usersData.length > 0) {
  // if (userSocketId && usersData) {
    // connectButton = (
    //   <Button mode="raised" design="danger" type="submit" 
    //     // onClick={socketCloseHandler}
    //     onClick={socketDisconnectHandler}
    //   >
    //     {/* Stop Connect */}
    //     {t('videoTalk.text2')}
    //   </Button>
    // );
  }
  if (!props.isAuth) {
    // connectButton = (<div>
    //   <Link to="/" className="notPageFound__linkButton">
    //     <Button
    //       mode="raised" type="submit" design="success"
    //     // disabled={!props.replyInput || props.commentLoading}
    //     >
    //       {/* Go to Homepage to Login */}
    //       {t('groupTalk.text16')}
    //     </Button>
    //   </Link>
    // </div>);

  }





  
  return (
    <div className="groupTalk__appContainer">
      <div>

      {!roomIdParam && store.windowValues && (store.windowValues.width < 768) && (
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



      {/* <div style={{textAlign:"center"}}>
      <button onClick={() => {
          socketDisconnectHandler();
          }}>disconnect-test</button>
      </div> */}

      {/* <button onClick={() => {setShowAuthModal(!showAuthModal)}}>auth-modal-test</button> */}
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
  );
};

export default GroupTalk;