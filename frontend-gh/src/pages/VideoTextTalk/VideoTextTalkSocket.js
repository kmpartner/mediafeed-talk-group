import React from 'react';
import { Fragment, useState, useEffect } from 'react';
import { Prompt } from 'react-router'
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next/hooks';
import openSocket from 'socket.io-client';

import { useStore } from '../../hook-store/store';

import { GQL_URL, BASE_URL, SOCKET_URL, SOCKET_SURL, PUSH_URL } from '../../App';
import './VideoTextTalk.css'


let isAlreadyCalling = false;
let getCalled = false;

const existingCalls = [];

const { RTCPeerConnection, RTCSessionDescription } = window;
const peerConnection = new RTCPeerConnection();



const VideoTextTalkSocket = (props) => {
  const {
    setIsLoading,
    setSocketState,
    setUserSocketId,
    userId,
    userName,
    userImageUrl,
    userListObj,
    setCallReject,
    userSocketId,
    setCallGet,
    setIsCalling,
    setUserListObj,
    textInputList,
    setTextInputList,
    setTextInput,
    setIsMoreText,
    setIsTextPosting,
    setNoconnectMessageNotify,
    setFavoriteUsers,
    setEditFavoriteUsersResult,
    connectClick,
    scrollToBottom,
  } = props;
  // const videoRef = React.createRef();
  let socket

  const [t] = useTranslation('translation');


  const [store, dispatch] = useStore();
  // console.log('store in VideoTextTalk', store);

  useEffect(() => {
    if (connectClick) {
      socketConnectHandler();
    }
  },[connectClick]);


  const socketConnectHandler = () => {

    const lsToken = localStorage.getItem('token');

    const lsNameDataList = localStorage.getItem('lsNameDataList');

    // socket = openSocket.connect("localhost:4001");
    // socket = openSocket.connect(SOCKET_SURL);
    // socket = openSocket('/your-namespace');

    setIsLoading(true);

    socket = openSocket.connect(SOCKET_SURL, {
      reconnection: true,
      reconnectionDelay: 500,
      transports: ['websocket'],
      query: { token: lsToken },
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
      };
      // setEmitUserInfo(sendData);
      socket.emit('user-info', sendData);


      //// request user's favorite users
      socket.emit('get-favorite-users', {
        userId: userId
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
        user: userObj
      });

      //// for loader of initial socket connection
      setIsLoading(false);

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

    socket.on("call-made", async data => {
      console.log('call-made data', data);
      // setCallFrom(data.socket);

      setCallReject(false);

      const confirmed = window.confirm(
        // `user is calling you. Do you accept this call?  ${t('videoTalk.text13')}`
        `${data.user.userName} ${t('videoTalk.text13')}`
      );
      console.log('confirmed', confirmed);

      if (!confirmed) {

        setCallReject(true);

        socket.emit("reject-call", {
          from: data.socket,
          user: {
            userId: userId,
            userName: userName,
            socketId: userSocketId
          }
        });

        return;
      }

      if (getCalled) {
        // const confirmed = window.confirm(
        //   `User "Socket: ${data.socket}" wants to call you. Do accept this call?`
        // );


        if (!confirmed) {

          setCallReject(true);

          socket.emit("reject-call", {
            from: data.socket,
            user: {
              userId: userId,
              userName: userName,
              socketId: userSocketId
            }
          });

          return;
        }
      }

      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.offer)
      );

      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(new RTCSessionDescription(answer));

      socket.emit("make-answer", {
        answer,
        to: data.socket,
        // user: {
        //   userId: userId,
        //   userName: userName,
        //   socketId: userSocketId
        // }
      });
      getCalled = true;

      setCallGet(true);

    });

    socket.on("answer-made", async data => {
      console.log("answer-made data", data);
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.answer)
      );

      console.log('anser-made peerConnection', peerConnection);

      // setCallingTo(data.socket);
      console.log('data.destUser', data.destUser);
      // setCallingTo(data.destUser);


      if (!isAlreadyCalling) {
        // callUser(data.socket);
        isAlreadyCalling = true;
        setIsCalling(true);
      }

      // const user = userListObj.find(element => {
      //   return element.socketId === userSocketId;
      // });
      // console.log('user', user);

      socket.emit('connection-made', {
        destUser: data.destUser
      });

    });

    socket.on("call-rejected", data => {
      console.log('call-rejected data', data);
      alert(
        // `User ${data.user.userName} reject your call.`
        `${data.user.userName} ${t('videoTalk.text14')}.`
      );
      // socketState.disconnect();
      // resetSocket();
      window.location.reload();
      // unselectUsersFromList();
    });


    peerConnection.ontrack = function ({ streams: [stream] }) {
      console.log('stream peeronnection.ontrack', [stream]);
      const remoteVideo = document.getElementById("remote-video");
      console.log('remoteVideo', remoteVideo);
      if (remoteVideo) {
        remoteVideo.srcObject = stream;
      }
    };

    const localVideo = document.getElementById("local-video");
    console.log('localVideo.srcObject o', localVideo, localVideo.srcObject);
    console.log('peerConnection', peerConnection);


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

    socket.on("update-text-list", data => {
      console.log('update-text-list data', data);

      // setIsLoading(false);
      // setIsTextPosting(false);

      if (data.textList.length > 0 && data.textList.length !== textInputList.length && 
        data.textList[data.textList.length -1].fromUserId === userId
      ) {
        setTextInput('');
      }

      const lastListElement = data.textList[data.textList.length -1];
      if (lastListElement && lastListElement.fromUserId && lastListElement.toUserId) {
        if (lastListElement.fromUserId === userId || lastListElement.toUserId === userId) {
          setTextInputList(data.textList);
        }

      }

      setIsMoreText(data.isMoreText);

      if (data.socketOnName === 'text-send') {
        scrollToBottom('text-talk');
      }

      
      setIsLoading(false);
      setIsTextPosting(false);

    });

    socket.on('new-text-send', data => {
      console.log('new-text-send, data', data);
      // console.log(userId, callingTo);

      console.log(textInputList);

    })

    socket.on('textTalks-data', data => {
      console.log('textTalks-data data', data);
    });

    socket.on('send-text-forPush', data => {
      console.log('send-text-forPush data', data);


      let fromUserNameData;
      if (lsNameDataList && JSON.parse(lsNameDataList).length > 0) {
        fromUserNameData = JSON.parse(lsNameDataList).find(ele => {
          return ele.userId === data.text.fromUserId;
        });
      }
      
      socket.emit('send-text-forPush-recieved', {
        textData: data.text,
        user: {
          userId: userId,
          socketId: userSocketId,
          userName: userName
        },
        fromUserNameData: fromUserNameData,
      });

    });

    socket.on('text-push-result', data => {
      console.log('text-push-result', data);
    });



    socket.on('text-from-noconnect-user', data => {
      console.log('text-from-noconnect-user data', data);
    
      //// implement to display message notify 
      setNoconnectMessageNotify(<div>
          new message from user
          <br/>
          {data.text.fromName}
        </div>
      );

      setTimeout(() => {
        setNoconnectMessageNotify('');
      },1000*10);  
         
    });



    socket.on('get-favorite-users-result', data => {
      console.log('get-favorite-users-result data', data);
      
      setFavoriteUsers(data.favoriteTalkUsers);

      setIsLoading(false);

    });

    socket.on('edit-favorite-users-result', data => {
      console.log('edit-favorite-users-result data', data);
      
      setEditFavoriteUsersResult(data.message);

      setTimeout(() => {
        setEditFavoriteUsersResult('');

        if (data.favoriteTalkUsers) {
          //// request user's favorite users
          socket.emit('get-favorite-users', {
            userId: userId
          });
        }
      }, 1000*5);

      setIsLoading(false);

    });

    socket.on('error-user-accepted', data => {
      console.log('error-user-accepted data', data);
      
      setIsLoading(false);
      setIsTextPosting(false);

    });



  }


  return (<Fragment>
    </Fragment>
  );
};

export default VideoTextTalkSocket;