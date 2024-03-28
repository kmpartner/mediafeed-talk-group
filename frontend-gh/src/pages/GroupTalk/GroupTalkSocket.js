import React from 'react';
import { Fragment, useState, useEffect } from 'react';

import { useTranslation } from 'react-i18next/hooks';
import openSocket from 'socket.io-client';

// import WebStream from './WebStream';

import { useStore } from '../../hook-store/store';
import { getUsersForGroup } from '../../util/user';

import { 
  SOCKET_GROUP_SURL, 
  BASE_URL,
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



const GroupTalkSocket = (props) => {
  const {
    setIsLoading,
    setSocketState,
    setUserSocketId,
    userId,
    userName,
    userImageUrl,
    userListObj,
    setUserListObj,
    userSocketId,
    setNoconnectMessageNotify,
    setCreateGroupReslut,
    setGroupList,
    setJoinGroupId,
    setJoinGroupName,
    setJoinGroupOnlineMember,
    setGroupTalkInputList,
    groupInfo,
    groupTalkId,
    groupAllMemberList,
    setGroupInfo,
    setGroupTalkId,
    usersData,
    setGroupAllMemberList,
    setDeleteGroupResult,
    setDeleteMemberResult,
    setIsTextPosting,
    setGroupTextInput,
    setGroupUserInfo,
    setEditFavoriteGroupsResult,
    setGroupTextReactions,
  } = props;

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
  // console.log('store in GroupTalk.js', store);

 
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

    socket.on('update-group', async (data) => {
      try {
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
          
          const memberIdList = [];
  
          for (const id of data.group.allMemberUserIds) {
            memberIdList.push(id.userId);
          }
  
          const resData = await getUsersForGroup(
            BASE_URL,
            localStorage.getItem('token'),
            memberIdList,
          );
  
          console.log('resData', resData);
          
          if (resData.usersData) {
            setGroupAllMemberList(resData.usersData);
          }
  
  
          // if (groupAllMemberList.length === 0) {
    
          //   const allMemberList = [];
  
          //   for (const user of data.group.allMemberUserIds) {
          //     const userInUsersData = usersData.find(element => {
          //       return element.userId === user.userId;
          //     });
      
          //     if (userInUsersData) {
          //       allMemberList.push(userInUsersData);
          //     }
          //   }
      
          //   setGroupAllMemberList(allMemberList);
          // }
        }
    
        setIsLoading(false);

      } catch(err) {
        console.log(err);
        setIsLoading(false);
      }
      
      
      
    });


    socket.on('join-group-result', data => {
      console.log('join-group-result', data);

      setIsLoading(false);


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

  
  return ( <Fragment></Fragment>);
};

export default GroupTalkSocket;