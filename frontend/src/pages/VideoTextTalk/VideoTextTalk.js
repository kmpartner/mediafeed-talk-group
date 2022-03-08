import React from 'react';
import { useState, useEffect } from 'react';
import { Prompt } from 'react-router'
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next/hooks';
import openSocket from 'socket.io-client';
import Img from "react-cool-img";

import WebStream from './WebStream';

import AutoSuggestVideoTextTalk from '../../components/AutoSuggest/AutoSuggestVideoTextTalk';
import Button from '../../components/Button/Button';
import Loader from '../../components/Loader/Loader';
import TalkDestInfo from '../../components/VideoTextTalk/TalkDestInfo/TalkDestInfo';
import TalkUserList from '../../components/VideoTextTalk/TalkUserList/TalkUserList';
import TalkUserListControll from '../../components/VideoTextTalk/TalkUserList/TalkUserListControll';
import TopBarContents from '../../components/GroupTalk/GroupAdElements/GroupTopElements/TopBarContents';
import VideoTextTalkInput from '../../components/VideoTextTalk/TalkTextList/VideoTextTalkInput';
import VideoTextTalkTextList from '../../components/VideoTextTalk/TalkTextList/VideoTextTalkTextList';

import { getUserData, getUserDataForStore, getUsers, getUserLocation, updateUserColor } from '../../util/user';
import { getLocalTimeElements } from '../../util/timeFormat';
import { getRandomBgColor } from '../../util/color-style';

import { 
  storeDraftInput, 
  getDraftInput, 
  deleteDraftInput 
} from '../../util/style';
import { useStore } from '../../hook-store/store';

import { GQL_URL, BASE_URL, SOCKET_URL, SOCKET_SURL, PUSH_URL } from '../../App';
import './VideoTextTalk.css'

import SampleImage from '../../components/Image/person-icon-50.jpg';

import * as firebase from "firebase/app";
// Add the Firebase services that you want to use
import "firebase/auth";
import "firebase/firestore";

import AdElementDisplay from '../../components/GroupTalk/GroupAdElements/AdElememtDisplay/AdElementDisplay';
import TalkRightElements from '../../components/VideoTextTalk/TalkRightElements/TalkRightElements';

let isAlreadyCalling = false;
let getCalled = false;

const existingCalls = [];

const { RTCPeerConnection, RTCSessionDescription } = window;
const peerConnection = new RTCPeerConnection();



const VideoTextTalk = (props) => {

  // const videoRef = React.createRef();
  let socket

  const [t] = useTranslation('translation');

  const [store, dispatch] = useStore();
  // console.log('store in VideoTextTalk', store);

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
  // const [groupList, setGroupList] = useState([]);
  // const [joinGroupId, setJoinGroupId] = useState('');

  const [showTextInputElement, setShowTextInputElement] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isTextPosting, setIsTextPosting] = useState(false);

  const [textTalkId, setTextTalkId] = useState('');

  const [favoriteUsers, setFavoriteUsers] = useState([]);
  const [editFavoriteUsersResult, setEditFavoriteUsersResult] = useState('');
  // const [emitUserInfo, setEmitUserInfo] = useState({});
  // let socket;

  useEffect(() => {
    document.title = 'Talk page'
  },[]);
  
  useEffect(() => {
    console.log(textTalkId, textInput);
    if (textTalkId) {

      //// check draft text in localstorage and set draft in input
      if (!textInput) {
        const lsDraft = getDraftInput('talk', textTalkId);

        if (lsDraft) {
          setTextInput(lsDraft);
        }
      }

      //// text input length is longer than x store draft in localstorage
      if (textInput && textInput.length >= 2) {
        storeDraftInput('talk', textTalkId, textInput);
      }

      //// text input length is less than x delete draft from localstorage
      if (textInput && textInput.length < 2) {
        deleteDraftInput('talk', textTalkId);
      }

    }
  },[textTalkId, textInput]);

  useEffect(() => {
    // socketConnectHandler();
    
    window.scrollTo(0, 0);
    console.log('vedoTextTalk.js-props', props);
    console.log(new Date().toUTCString());

    return () => {
      console.log('cleanup socketTest');
      // socketDisconnectHandler();
      window.location.reload();
    }
  }, []);

  useEffect(() => {
    if (userId) {
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

    if (props.isAuth) {

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
  
        });
      }
  
      if (store.userData) {
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
  
  
  
      if (store.usersData.length === 0) {
        setIsLoading(true);
        
        getUsers(BASE_URL, localStorage.getItem('token'))
        .then(result => {
          console.log(result);
          setUsersData(result.usersData);
  
          dispatch('SET_USERSDATA', result.usersData);
  
          setIsLoading(false);
        })
        .catch(err => {
          console.log(err);
          setIsLoading(false);
          // setNoUserMessage('need to login');
        })
      }
    }


  }, [userId, props.isAuth]);

  // // set local usersData state when users data exist in store
  useEffect(() => {
    if (store.usersData.length > 0 && usersData.length === 0) {
      setUsersData(store.usersData);
    }
  },[userId, store.usersData]);

  useEffect(() => {
    setIsLoading(true);

    if (userId && usersData.length > 0 && userName) {
      setIsLoading(false);
    }

    if (!userSocketId && userId && userName && usersData.length > 0) {
      // socketConnectHandler()
    }

    if (!props.isAuth) {
      setIsLoading(false);
    }

  }, [userId, usersData, userSocketId, userName, props.isAuth]);

  // useEffect(() => {
  //   // setIsLoading(true);

  //   if (userId && usersData.length > 0) {
  //     setIsLoading(false);
  //   }
  // }, [userId, usersData]);

  // useEffect(() => {
  //   if (userId) {
  //     getUserTextTalksHandler(userId, SOCKET_URL, localStorage.getItem('token'));
  //   }
  // }, [userId]);

  useEffect(() => {
    if (callGet) {
      // getTextListHandler(userId, callingTo.userId, localStorage.getItem('token'), SOCKET_URL);
      setShowNoconnectTextTalk(false);
      setShowNoconnectTextTalk(false);
      setNoconnectDestUserId('');
    }

  }, [callGet]);

  useEffect(() => {
    console.log(textInputList);
  }, [textInputList.length])

  useEffect(() => {
    // var div = document.getElementById('text-talk');
    // console.log('div', div);
    scrollToBottom('text-talk');
  }, [showTextTalk, textInputList.length]);


  useEffect(() => {

    const userObj = userListObj.find(user => {
      return user.userId === userId;
    });


    if (userObj && userObj.calling) {
      const destUserObj = userListObj.find(user => {
        return user.userId === userObj.destUser.userId;
      });
      // console.log('user', userObj, 'destUser', destUserObj);

      if (destUserObj && destUserObj.calling && 
          destUserObj.destUser.userId === userId
        ) {
          setCallingTo(destUserObj);
      }
    }

    //// disconnect and reload when callingTo user disconnect
    const callingToUser = userListObj.find(user => {
      return user.userId === callingTo.userId && user.socketId === callingTo.socketId;
    });

    if (callingTo && !callingToUser) {
      // setCallingTo('');
      alert('calling user disconnected');
      socketState.disconnect();
      // resetSocket();
      window.location.reload();
      // socketCloseHandler2();
    }

    //// disconnect and reload when useObj's socketId is 
    //// different from cilent's socketId
    if (userObj && userObj.socketId !== userSocketId) {
      socketState.disconnect();
      // resetSocket()
      window.location.reload();
  }


    //// find connecton-made user and if destuser is userId, connect
    if (userObj && !userObj.calling) {
      const connectionMadeUser = userListObj.find(user => {
        if (user.destUser && user.destUser.userId === userId) {
          return user;
        }
      });
      
      if (connectionMadeUser && !callReject) {
        callUser(connectionMadeUser.socketId);
      }
    }

    //// find trying to call user, not yet start talking, set tryingToCallUser for display
    if (userObj && userObj.calling) {
      const destinationUser = userListObj.find(user => {
        return user.userId === userObj.destUser.userId;
      });

      if (destinationUser && !destinationUser.destUser || destinationUser.destUser.userId !== userObj.userId) {
        setTryingToCallUser(userObj.destUser);
      }

      if (destinationUser && destinationUser.destUser && destinationUser.destUser.userId === userObj.userId) {
        setTryingToCallUser('');

        if (destinationUser.talkStartAt) {
          setTalkStartAt(destinationUser.talkStartAt);
        }
        if (userObj.talkStartAt) {
          setTalkStartAt(userObj.talkStartAt);
        }
      }
      
    }

  }, [userListObj]);

  async function callUser(socketId) {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(new RTCSessionDescription(offer));

    socketState.emit("call-user", {
      offer,
      to: socketId,
      user: {
        userId: userId,
        userName: userName,
        socketId: userSocketId,
      }
    });
  }


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

    const lsToken = localStorage.getItem('token');

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

    // navigator.getUserMedia(
    //   { video: true, audio: true },
    //   stream => {
    //     const localVideo = document.getElementById("local-video");
    //     if (localVideo) {
    //       // localVideo.srcObject = stream;
    //       // console.log('localVideo.srcObject', localVideo, localVideo.srcObject);
    //     }

    //     // videoRef.current = stream

    //     // console.log('videoRef', videoRef);
    //     // console.log('stream', stream);
    //     // console.log(videoRef);
    //     // videoRef.current = stream;
    //     // console.log('videoref current', videoRef.current)



    //     stream.getTracks().forEach(track => {
    //       // console.log('track, stream', track, stream);
    //       // return peerConnection.addTrack(track, stream)
    //     });
    //   },
    //   error => {
    //     console.warn(error.message);
    //   }
    // );

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

    socket.on("update-text-list", data => {
      console.log('update-text-list data', data);

      setIsLoading(false);
      setIsTextPosting(false);

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

      // setTextInputList(data.textList);
    });

    socket.on('new-text-send', data => {
      console.log('new-text-send, data', data);
      // console.log(userId, callingTo);

      console.log(textInputList);
      // const beforeList = textInputList.map(element => {
      //   return element;
      // });
      // console.log('beforeList', beforeList);
      // const addList = beforeList.push(data.textData);
      // console.log('addList');

      // setTextInputList(addList);

      // getTextListHandler(userId, callingTo.userId, localStorage.getItem('token'), SOCKET_URL);
    })

    socket.on('textTalks-data', data => {
      console.log('textTalks-data data', data);
    });

    socket.on('send-text-forPush', data => {
      console.log('send-text-forPush data', data);

      socket.emit('send-text-forPush-recieved', {
        textData: data.text,
        user: {
          userId: userId,
          socketId: userSocketId,
          userName: userName
        }
      });

        // sendTextPushHandler(
        //   PUSH_URL,
        //   // BASE_URL, 
        //   localStorage.getItem('token'),
        //   data.text.fromUserId,
        //   data.text
        // )
        // .then(res => {
        //   console.log(res);
        // })
        // .catch(err => {
        //   console.log(err);
        // })
      
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





  }



  const socketDisconnectHandler = () => {
    if (socketState) {
      socketState.disconnect();
      initUseState();
      props.history.replace('/talk-page');
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
    // setGroupList([]);
    // setJoinGroupId('');
  
    setShowTextInputElement(true);
    setIsLoading(false);
    setIsTextPosting(false);

    setTextTalkId('');

    setFavoriteUsers([]);
    setEditFavoriteUsersResult('');
  }





  const showUserListObj = () => {
    console.log('userListObj', userListObj);
  }

  // const getCallingInfoHandler = (socketId) => {

  //   const callingInfo = userListObj.find(element => {
  //     return socketId === element.socketId;
  //   })
  //   console.log(socketId, callingInfo);
  //   setCallingToInfo(callingInfo);
  // }

  const scrollToBottom = (id) => {
    var div = document.getElementById(id);
    if (div) {
      div.scrollTop = div.scrollHeight - div.clientHeight;
    }
  }

  const showTextTalkHandler = () => {
    setShowTextTalk(!showTextTalk);
    window.scrollTo(0, 0);
  }


  const textInputHandler = (event) => {
    setTextInput(event.target.value);
    console.log(event.target.value);
  }

  const textInputHandlerEmoji = (input, value) => {
    setTextInput(value);
    // console.log(commentInput);
  }
  const getInputHandler = (input) => {
    setTextInput(input);
  }

  const textPostHandler = (text) => {

    if (socketState) {
      socketState.emit('text-send', {
        from: userSocketId,
        fromUserId: userId,
        to: callingTo.socketId,
        toUserId: callingTo.userId,
        text: text,
        fromName: userName,
        sendAt: Date.now(),
        language: navigator.languages[0],
        geolocation: JSON.parse(localStorage.getItem('userLocation')),
      });
    }

    deleteDraftInput('talk', textTalkId);
    setIsTextPosting(true);

    // else {
    //   const textData = {
    //     from: '',
    //     fromUserId: userId,
    //     to: '',
    //     toUserId: 'no socket toUserId',
    //     text: text,
    //     fromName: userName,
    //     sendAt: Date.now()
    //   };

    //   fetch(url + `/text-talk`, {
    //     method: 'POST',
    //     headers: {
    //       Authorization: 'Bearer ' + token
    //     },
    //     // body: JSON.stringify(textData)
    //     body: JSON.stringify(textData)
    //   })
    //     .then(res => {
    //       if (res.status !== 200 && res.status !== 201) {
    //         throw new Error('Posting data failed!');
    //       }
    //       return res.json();
    //     })
    //     .then(resData => {
    //       console.log(resData);

    //       socketState.emit('text-send', {
    //         textData: textData
    //       });
    //     })
    //     .catch(err => {
    //       console.log(err);
    //     })
    // }


    // console.log('textData', textData);
    // console.log('json stringify', JSON.stringify({
    //       from: userSocketId,
    //       fromUserId: userId,
    //       to: callingTo.socketId,
    //       toUserId: callingTo.userId,
    //       text: text,
    //       fromName: userName,
    //       sendAt: Date.now()
    //   })
    //   );

    // fetch(url + `/text-talk`, {
    //   method: 'POST',
    //   headers: {
    //     Authorization: 'Bearer ' + token
    //   },
    //   // body: JSON.stringify(textData)
    //   body: JSON.stringify({
    //     from: userSocketId,
    //     fromUserId: userId,
    //     to: callingTo.socketId,
    //     toUserId: callingTo.userId,
    //     text: text,
    //     fromName: userName,
    //     sendAt: Date.now()
    //   })
    // })
    //   .then(res => {
    //     if (res.status !== 200 && res.status !== 201) {
    //       throw new Error('Posting data failed!');
    //     }
    //     return res.json();
    //   })
    //   .then(resData => {
    //     console.log(resData);

    //     socketState.emit('text-send', {
    //       textData: textData
    //     });
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   })

  }

  const textDeleteHandler = (textId, fromUSerId, toUserId, token, url) => {
    fetch(url + `/text-talk?textId=${textId}&toUserId=${toUserId}&fromUserId=${fromUSerId}`, {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + token
      },
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Posting data failed!');
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);

        //   socketState.emit('text-send', {
        //     textData: textData
        //   });
      })
      .catch(err => {
        console.log(err);
      })
  }

  const getUserTextTalkListHandler = () => {
    // console.log('in get usertexttalkshandler');
    if (socketState) {
      socketState.emit('get-textTalks', {
        user: {
          socketId: userSocketId,
          userId: userId,
          userName: userName
        }
      })
    }
  };

  const noconnectGetUserDestTalkHandler = (destUserId) => {

    // setTextInputList(textList);
    if (socketState) {      
      setTextTalkId(`${userId}-${destUserId}`);

      socketState.emit('noconnect-get-userDestTalk', {
        user: {
          socketId: userSocketId,
          userId: userId,
          userName: userName
        },
        destUser: {
          socketId: '',
          userId: destUserId,
        }
      })
    }

    setIsLoading(true);
  };

  const noconnectTextPostHandler = (text, toUserId) => {
    socketState.emit('text-send', {
      from: userSocketId,
      fromUserId: userId,
      to: '',
      toUserId: toUserId,
      text: text,
      fromName: userName,
      sendAt: Date.now(),
      language: navigator.languages[0],
      geolocation: JSON.parse(localStorage.getItem('userLocation')),
    });

    deleteDraftInput('talk', textTalkId);
    setIsTextPosting(true);
  };


  const noconnectTextDeleteHandler = (text, toUserId) => {
    socketState.emit('text-delete', {
      userId: userId,
      text: text,
    });

    setIsLoading(true);

  };



  const getFavoriteUsersHandler = (userId) => {
    if (props.isAuth) {
      if (userSocketId && userId) {
        setIsLoading(true);

        socketState.emit('edit-favorite-users', {
          userId: userId,
        });
      }
    }
  };

  const editFavoriteUsersHandler = (userId, favoriteTalkUsers) => {
    if (props.isAuth) {
      if (userSocketId && userId) {
        setIsLoading(true);
        setEditFavoriteUsersResult('');
  
        socketState.emit('edit-favorite-users', {
          userId: userId,
          favoriteTalkUsers: favoriteTalkUsers,
        });
      }
    }
  };







  const showUserTextTalkListHandler = () => {
    setShowUserTextTalkList(!showUserTextTalkList);

    if (showUserTextTalkList) {
      setShowNoconnectTextTalk(false);
      setTextInputList([]);
    }
  };

  const showNoconnectTextTalkHandler = () => {
    setShowNoconnectTextTalk(!showNoconnectTextTalk);
  }

  const noconnectDestUserIdHandler = (id) => {
    setNoconnectDestUserId(id);
  }

  const getTextListHandler = (fromUserId, toUserId, token, url) => {
    console.log('in get TextListhandler');
    // socketState.emit("get-textList", {
    //   fromUserId: fromUserId,
    //   toUserId: toUserId
    // });

    fetch(url + `/text-talk?fromUserId=${fromUserId}&toUserId=${toUserId}`, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Getting data failed!');
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);
        setTextInputList(resData.data);
      })
      .catch(err => {
        console.log(err);
      })
  }


  const getUserTextTalksHandler = (userId, url, token) => {
    fetch(url + `/text-talk/usertalks?userId=${userId}`, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Getting data failed!');
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);
        setUserTextTalkList(resData.data);
      })
      .catch(err => {
        console.log(err);
      })
  };

  const getSuggestList = (list) => {
    setSuggestList(list);
  }

  const showTextInputElementHandler = () => {
    setShowTextInputElement(!showTextInputElement);
  };







  let userListElement2;
  let listForSuggest =[];
  let startTalkButton;
  if (userListObj && userListObj.length <= 1) {
    userListElement2 = (<div>
      {/* no other online users */}
      {t('videoTalk.text6')}
    </div>);
  }

  if (userListObj && userListObj.length > 1) {
    // console.log(userListObj);
    const connectList = userListObj.filter(user => {
      // return user.userId !== userId;
      return user.socketId !== userSocketId && !user.calling;
    })
    .reverse();
    console.log(connectList);



    if (connectList.length > 0) {
      connectList.forEach((element) => {
        listForSuggest.push({
            // _id: element.userId,
            // _id: element._id,
            userId: element.userId,
            name: element.userName,
            imageUrl: element.userImageUrl,
            socketId: element.socketId
        })
      })
    }
    console.log(listForSuggest);



    userListElement2 = <ul>
      {connectList.map(user => {        
        // console.log('user', user);
        

        const userObj = userListObj.find(user => {
          return user.userId === userId;
        });
        if (!userObj.calling) {
          if (user.calling && user.destUser.userId === userId) {
            startTalkButton = (
            <Button design='raised' mode='' size='smaller' onClick={() => {
              callUser(user.socketId);
              }}
            >
              {/* Start to talk */}
              {t('videoTalk.text4')}
            </Button>
            );
          }
          if (!user.calling) {
            startTalkButton = (
            <Button design='raised' mode='' size='smaller' onClick={() => {
              callUser(user.socketId);
              }}
            >
              {/* Start to talk */}
              {t('videoTalk.text4')}
            </Button>
              );
          } 
          else {

          }
        }

        let aboutUser;
        if (usersData) {
          aboutUser = usersData.find(element => {
            // console.log('usersData element', element);
            // return element._id === user.userId;
            return element.userId === user.userId;
          });
          // console.log('aboutUser', aboutUser);
        }


        // if (!callingTo) {
        if (!userObj.calling) {
          // console.log('userObj', userObj);
          return (
            <div key={user.socketId}>
              <li className="textTalk-OnlineUser-list" 
                // onClick={() => {callUser(user.socketId);}}
              >
                {aboutUser && aboutUser.imageUrl ?
                  <span className="textTalk__UserImageContainer">
                    {/* <img className="textTalk__UserImageElement" src={BASE_URL + '/' + aboutUser.imageUrl} alt='user-img'></img> */}
                    <Img className="textTalk__UserImageElement" src={BASE_URL + '/' + aboutUser.imageUrl} alt='user-img' />
                  </span>
                : 
                  <span className="textTalk__UserImageContainer">
                    {/* <img style={{paddingTop:"0.5rem"}} className="textTalk__UserImageElement" src={SampleImage} alt='user-img'></img> */}
                    <Img style={{paddingTop:"0.5rem"}} className="textTalk__UserImageElement" src={SampleImage} alt='user-img' />
                  </span>
                }
                <span className="textTalk__UserName">{user.userName}</span> 
                <span>{startTalkButton}</span>
                
                
                {/* <button onClick={() => {callUser(user.socketId);}}>connect-to</button> */}
                
                

              </li>
            </div>
          );
        } 
        
        else {
          return;
        }
      })}
    </ul>
  }

  let showTextTalkButton;
  if (callingTo && showTextTalk) {
    // showTextTalkButton = <button onClick={showTextTalkHandler}>video-talk</button>
  }
  if (callingTo && !showTextTalk) {
    showTextTalkButton = (
      <Button mode="flat" type="" onClick={showTextTalkHandler}>
        {/* show text talk */}
        {t('videoTalk.text9')}
      </Button>
    );
  }

  let connectButton;
  if (!userSocketId && userId && userName && usersData.length > 0) {
    connectButton = (
      <div>
        <Button mode="raised" type="submit" onClick={socketConnectHandler}>
          {/* Start Connect */}
          {t('videoTalk.text1')}
        </Button>

        <div className="textTalk__bottomElement">
          {/* <TopBarContents /> */}
          <AdElementDisplay 
            adType='300x65'
            adPlaceId='talkpage-bottom'
          />
        </div>
        
      </div>
    );
  }
  if (userSocketId && userId && userName && usersData.length > 0) {
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
  // if (
  //       userSocketId && userId && userName 
  //       && usersData.length > 0 && textInputList.length > 0
  //   ) {
  //       connectButton = (
  //         <Button mode="raised" design="" type="submit" 
  //           // onClick={socketCloseHandler}
  //           onClick={socketDisconnectHandler}
  //         >
  //           {/* Back to List */}
  //           {t('groupTalk.text11')}
  //         </Button>
  //       );
  // }

  if (
      userSocketId && userId && userName 
      && usersData.length > 0 && textTalkId
  ) {
      connectButton = (
        <Button mode="raised" design="" type="submit" 
          // onClick={socketCloseHandler}
          onClick={socketDisconnectHandler}
        >
          {/* Back to List */}
          {t('groupTalk.text11')}
        </Button>
      );
  }

  if (!props.isAuth) {
    // connectButton = 'need to login';
    connectButton = (<div>
      <Link to="/" className="notPageFound__linkButton">
        <Button
              mode="raised" type="submit" design="success"
              // disabled={!props.replyInput || props.commentLoading}
        >
          Go to Homepage to Login
        </Button>
      </Link>
    </div>);
  }

  if (isLoading) {
    connectButton = null;
  }

  

  let remoteVideoStyle;
  if (!callingTo) {
    remoteVideoStyle = {
      display: 'none'
    };
  }


  return (
    <div className="talk-appContainer">
      <div>

        <AdElementDisplay 
          adType='300x300'
          adPlaceId='talkpage-right' 
        />
        {/* <TalkRightElements
          userSocketId={userSocketId}
          showNoconnectTextTalk={showNoconnectTextTalk}
        /> */}


        {/* <TalkUserListControll 
          isLoading={isLoading}
        /> */}
        
        {/* <div style={{textAlign:"right"}}>
            <button onClick={() => {
                socketDisconnectHandler();
                }}>disconnect-test</button>
        </div> */}

        {isLoading ?
          <div className="textTalk__loader">
            <Loader />
          </div>
          : null 
        }

        {callingTo ?
          <Prompt 
          // message="You are still talking. Do you want to stop talking?" 
            message={t('videoTalk.text11')}
          />
        : null
        }

        <div className="textTalk_NoconnectMessage">
          {noconnectMessageNotify}
        </div>

        <div className="textTalk__ConnectButton">
          {noUserMessage}
          {connectButton}
        </div>

        {userSocketId && !showUserTextTalkList  && !callGet ?
          <div className={!isCalling && !tryingToCallUser ? "textTalk-OnlineUser-Container" : ""}>
            {!isCalling && !tryingToCallUser ? (<div>


              {listForSuggest.length > 0 ? 
                <div className={suggestList.length > 0 ? "textTalk__UserTalkListSuggest" : "textTalk__UserTalkListNoSuggest"} >
                  <AutoSuggestVideoTextTalk
                    userList={listForSuggest}
                    listType="listForSuggest"
                    callUser={callUser}
                    startTalkButton={startTalkButton}
                    getSuggestList={getSuggestList}
                  />
                </div>
              : null}


              {/* Online Users */}
              {/* {t('videoTalk.text3')} */}
              </div>)
            : null}

            {/* <div>
              <div className={suggestList.length > 0 ? "textTalk__UserTalkListSuggest" : "textTalk__UserTalkListNoSuggest"} >
                <AutoSuggestVideoTextTalk
                  userList={listForSuggest}
                  listType="listForSuggest"
                  callUser={callUser}
                  startTalkButton={startTalkButton}
                  getSuggestList={getSuggestList}
                />
              </div>
            </div> */}

            {userListElement2}
          </div>

          : null
        }
        <div>

          {/* {callingTo ?
            <div>
              <div>calling-to: {callingTo.userName}</div>
              <div className="remote-videoContainer" onClick={showTextTalkHandler}>
                <WebStream
                  id='remote-video'
                  videoType={showTextTalk ? "remote-video-small" : "remote-video"}
                  peerConnection={peerConnection}
                />
              </div>
            </div>
            : null
          } */}

            <div className="textTalk__ConnectUserInfo">
              <div>
                {tryingToCallUser ? 
                  <div>
                    {/* Your are trying to talk: {tryingToCallUser.userName} */}
                    {t('videoTalk.text5')}: {tryingToCallUser.userName}
                  </div> 
                : null
                }
                {callingTo && !showTextTalk ? 
                  <div>
                    {/* You are talking to: {callingTo.userName} */}
                    {t('videoTalk.text7')}: {callingTo.userName}
                  </div>
                : null
                }
                {talkStartAt && !showTextTalk ? 
                  <div>
                    {/* You started to talk: {getLocalTimeElements(talkStartAt).hour}:{getLocalTimeElements(talkStartAt).minute} {getLocalTimeElements(talkStartAt).xm} */}
                    {t('videoTalk.text8')}: {getLocalTimeElements(talkStartAt).hour}:{getLocalTimeElements(talkStartAt).minute} {getLocalTimeElements(talkStartAt).xm}
                  </div>
                : null
                }
              </div>

              <div style={remoteVideoStyle} className="remote-videoContainer" onClick={showTextTalkHandler}>
                
                {showTextTalkButton}
                
                <WebStream
                  id='remote-video'
                  videoType={showTextTalk ? "remote-video-small" : "remote-video"}
                  // videoType={remoteVideoType}
                  peerConnection={peerConnection}
                  callingTo={callingTo}
                />

              </div>


            </div>

          {/* <div className="remote-videoContainer" onClick={showTextTalkHandler}>
        <WebStream
          id='remote-video'
          videoType={showTextTalk ? "remote-video-small" : "remote-video"}
          peerConnection={peerConnection}
        />
      </div> */}


          <div>
            {/* <div>
              {showTextTalkButton}
            </div> */}

            <div>
            {callingTo && showTextTalk ?
                <div>

                  {/* <TalkDestInfo 
                    // usersData={usersData}
                    // noconnectDestUserId={noconnectDestUserId}
                    // isLoading={isLoading}
                  /> */}

                  <div id="text-talk" className="textTalk-container"
                    style={!showTextInputElement ? {bottom: "5px"} : {}}
                  >
                    {/* {textList} */}
                    <VideoTextTalkTextList 
                      textInputList={textInputList}
                      userName={userName}
                      userId={userId}
                      favoriteUsers={favoriteUsers}
                      editFavoriteUsersHandler={editFavoriteUsersHandler}
                      editFavoriteUsersResult={editFavoriteUsersResult}
                      isLoading={isLoading}
                    />
                  </div>

                  <div className="">

                    {showTextInputElement ?
                      <div>
                        <div className="groupTalk__textInputContainer">
                          <VideoTextTalkInput
                            getInputHandler={getInputHandler}
                            textInputHandlerEmoji={textInputHandlerEmoji}
                            textInput={textInput}
                            noconnectDestUserId={noconnectDestUserId}
                            textPostHandler={textPostHandler}
                            noconnectTextPostHandler=""
                            isTextPosting={isTextPosting}
                          />
                        </div>
                        <div
                          className="groupTalk__showInputButton"
                          // style={{position: "fixed", bottom:"75px", right:"1px"}}
                          onClick={() => {
                            showTextInputElementHandler();
                            // textPostHandler(textInput);
                          }}
                        >
                          <Button
                            mode="raised" type="submit"
                            disabled={textInput}
                            onClick={() => {
                              showTextInputElementHandler();
                              // textPostHandler(textInput);
                            }}
                          >
                            {/* hide */}
                            {t('groupTalk.text36', 'hide')}
                      </Button>
                        </div>
                      </div>
                      :
                      <div className="groupTalk__showInputButton"
                      // style={{fontSize:"0.75rem", width:"40%", bottom:"1px"}}
                      >
                        <Button
                          mode="raised" type="submit"
                          // disabled={!groupTextInput}
                          onClick={() => {
                            showTextInputElementHandler();
                            // textPostHandler(textInput);
                          }}
                        >
                          {/* write text */}
                          {t('groupTalk.text37', 'write text')}
                      </Button>
                      </div>
                    }

                    {/* <button onClick={() => {scrollToBottom('text-talk')}}>bottom-to</button> */}
                  </div>
                </div>
                : null
              }
            </div>


            <div>
            {showNoconnectTextTalk ?
                <div>

                  <TalkDestInfo
                    userId={userId}
                    usersData={usersData}
                    favoriteUsers={favoriteUsers}
                    editFavoriteUsersHandler={editFavoriteUsersHandler}
                    editFavoriteUsersResult={editFavoriteUsersResult}
                    noconnectDestUserId={noconnectDestUserId}
                    isLoading={isLoading}
                  />

                  <div id="text-talk" className="textTalk-container"
                    style={!showTextInputElement ? {bottom: "5px"} : {}}
                  >
                    <VideoTextTalkTextList 
                      textInputList={textInputList}
                      userName={userName}
                      userId={userId}
                      noconnectDestUserId={noconnectDestUserId}
                      usersData={usersData}
                      favoriteUsers={favoriteUsers}
                      editFavoriteUsersHandler={editFavoriteUsersHandler}
                      editFavoriteUsersResult={editFavoriteUsersResult}
                      noconnectTextDeleteHandler={noconnectTextDeleteHandler}
                      isLoading={isLoading}
                    />
                  </div>

                  <div className="">

                    {showTextInputElement ?
                      <div>
                        <div className="groupTalk__textInputContainer">
                          <VideoTextTalkInput
                            getInputHandler={getInputHandler}
                            textInputHandlerEmoji={textInputHandlerEmoji}
                            textInput={textInput}
                            noconnectDestUserId={noconnectDestUserId}
                            textPostHandler=""
                            noconnectTextPostHandler={noconnectTextPostHandler}
                            isTextPosting={isTextPosting}
                          />
                        </div>
                        <div
                          className="groupTalk__showInputButton"
                          // style={{position: "fixed", bottom:"75px", right:"1px"}}
                          onClick={() => {
                            showTextInputElementHandler();
                            // textPostHandler(textInput);
                          }}
                        >
                          <Button
                            mode="raised" type="submit"
                            disabled={textInput}
                            onClick={() => {
                              showTextInputElementHandler();
                              // textPostHandler(textInput);
                            }}
                          >
                            {/* hide */}
                            {t('groupTalk.text36', 'hide')}
                      </Button>
                        </div>
                      </div>
                      :
                      <div className="groupTalk__showInputButton"
                      // style={{fontSize:"0.75rem", width:"40%", bottom:"1px"}}
                      >
                        <Button
                          mode="raised" type="submit"
                          // disabled={!groupTextInput}
                          onClick={() => {
                            showTextInputElementHandler();
                            // textPostHandler(textInput);
                          }}
                        >
                          {/* write text */}
                          {t('groupTalk.text37', 'write text')}
                      </Button>
                      </div>
                    }

                    {/* <button onClick={() => {scrollToBottom('text-talk')}}>bottom-to</button> */}
                  </div>
                </div>
                : null
              }
            </div>

          </div>


        </div>
      </div>


      <div style={showTextTalk || showUserTextTalkList ? {display: "none"}: null}>
        <WebStream
          id='local-video'
          videoType="local-video"
          peerConnection={peerConnection}
        />
      </div>




      {userSocketId && !isCalling && !tryingToCallUser && !callGet ?   
        <div> 
          {!showNoconnectTextTalk &&
            <div>
              <TalkUserListControll
                userId={userId}
                usersData={usersData}
                favoriteUsers={favoriteUsers}
                editFavoriteUsersHandler={editFavoriteUsersHandler}
                editFavoriteUsersResult={editFavoriteUsersResult}
                noconnectGetUserDestTalkHandler={noconnectGetUserDestTalkHandler}
                showNoconnectTextTalk={showNoconnectTextTalk}
                showNoconnectTextTalkHandler={showNoconnectTextTalkHandler}
                noconnectDestUserIdHandler={noconnectDestUserIdHandler}
                isLoading={isLoading}
              />

              <TalkUserList
                userTextTalkList={userTextTalkList}
                usersData={usersData}
                socketId={userSocketId}
                userId={userId}
                userName={userName}
                getUserTextTalkListHandler={getUserTextTalkListHandler}
                showUserTextTalkListHandler={showUserTextTalkListHandler}
                showUserTextTalkList={showUserTextTalkList}
                noconnectGetUserDestTalkHandler={noconnectGetUserDestTalkHandler}
                showNoconnectTextTalk={showNoconnectTextTalk}
                showNoconnectTextTalkHandler={showNoconnectTextTalkHandler}
                noconnectDestUserIdHandler={noconnectDestUserIdHandler}
                // isLoading={isLoading}
              />
            </div>
          }
        </div>
      : null}



    </div>
  );
};

export default VideoTextTalk;