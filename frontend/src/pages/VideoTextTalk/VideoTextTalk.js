import React from 'react';
import { Fragment, useState, useEffect, } from 'react';
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
import TalkUserListControl from '../../components/VideoTextTalk/TalkUserList/TalkUserListControl/TalkUserListControl';
import TalkUserListNotify from '../../components/VideoTextTalk/TalkUserList/TalkUserListNotify/TalkUserListNotify';
import TalkPermission from '../../components/VideoTextTalk/TalkPermission/TalkPermission';
import TalkShare from '../../components/VideoTextTalk/TalkShare/TalkShare';
// import TopBarContents from '../../components/GroupTalk/GroupAdElements/GroupTopElements/TopBarContents';
import VideoTextTalkInput from '../../components/VideoTextTalk/TalkTextList/VideoTextTalkInput';
import VideoTextTalkTextList from '../../components/VideoTextTalk/TalkTextList/VideoTextTalkTextList';
import VideoTextTalkSocket from './VideoTextTalkSocket';

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

// import * as firebase from "firebase/app";
// // Add the Firebase services that you want to use
// import "firebase/auth";
// import "firebase/firestore";

import AdElementDisplay from '../../components/GroupTalk/GroupAdElements/AdElememtDisplay/AdElementDisplay';
// import TalkRightElements from '../../components/VideoTextTalk/TalkRightElements/TalkRightElements';



let isAlreadyCalling = false;
let getCalled = false;

const existingCalls = [];

const { RTCPeerConnection, RTCSessionDescription } = window;
const peerConnection = new RTCPeerConnection();



const VideoTextTalk = (props) => {

  // const videoRef = React.createRef();
  // let socket

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
  
  const [getMoreNum, setGetMoreNum] = useState(1);
  const [isMoreText, setIsMoreText] = useState(false);
  
  const [listScrollTop, setListScrollTop] = useState(0);

  const [initialLoad, setInitialLoad] = useState(true);

  const [connectClick, setConnectClick] = useState(false);
  // const [emitUserInfo, setEmitUserInfo] = useState({});
  // let socket;

  useEffect(() => {
    document.title = 'Talk page'
  },[]);
  

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

  // useEffect(() => {
  //   // // match both front and backend
  //   const initialLoadNum = 25;
  //   // const initialLoadNum = 6;
    
  //   if (textInputList.length <= initialLoadNum) {
  //     scrollToBottom('text-talk');
  //   }
  // }, 
  // // [showTextTalk]
  // [showTextTalk, textInputList.length]
  // );

  useEffect(() => {
    const textTalkEl = document.getElementById('text-talk');

    if (textTalkEl && textInputList.length > 0 && initialLoad) {
      scrollToBottom('text-talk');
      setInitialLoad(false);
    }
  },[showTextTalk, textInputList]);


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



  useEffect(() => {
    const textTalkEl = document.getElementById('text-talk');
    // console.log('refl testTalkEl', textTalkEl)
    
    if (textTalkEl) {
      // console.log('refl ', textTalkEl.target)
      textTalkEl.addEventListener('scroll', (event) => {
        // console.log('refl', textTalkEl.scrollTop);
        setListScrollTop(textTalkEl.scrollTop);

      })
    }
  },[showNoconnectTextTalk]);



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

    setGetMoreNum(1);
    setIsMoreText(false);

    setListScrollTop(0);

    setInitialLoad(true);

    setConnectClick(false);
  }




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
    console.log('input', input);
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

  const noconnectTextPostHandler = (text, toUserId, filePaths, fileSizes) => {
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
      token: localStorage.getItem('token'),
      fileUrls: filePaths ? filePaths : [],
      filePaths: filePaths ? filePaths : [],

      fileSizes: fileSizes ? fileSizes : [],

      getMoreNum: getMoreNum,
    });

    deleteDraftInput('talk', textTalkId);
    setIsTextPosting(true);
  };


  const noconnectTextDeleteHandler = (text, toUserId) => {
    socketState.emit('text-delete', {
      userId: userId,
      text: text,

      getMoreNum: getMoreNum,
    });

    setIsLoading(true);

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

  const noconnectGetMoreHandler = (destUserId, getMoreNum) => {
    socketState.emit('noconnect-get-more', {
      user: {
        userId: userId,
        userName: userName,
        socketId: userSocketId,
      },
      destUser: {
        socketId: '',
        userId: destUserId,
      },
      getMoreNum: getMoreNum,
    });

    setIsLoading(true);
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
    
    const currentUrl = new URL(window.location.href);
    const queryParams = currentUrl.searchParams;
    const shareUserIdParam = queryParams.get('shareUserId');

    //// when shareUserId param exist, go to user list to proceed for user select
    if (shareUserIdParam && !connectClick) {
      setConnectClick(true);
    }

    connectButton = (
      <div>
        <Button mode="raised" type="submit" 
          // onClick={socketConnectHandler}
          onClick={() => { setConnectClick(true); }}
        >
          {/* Start Connect */}
          {t('videoTalk.text1')}
        </Button>

        <div className="textTalk__bottomElement">
          {/* <TopBarContents /> */}
          {store.windowValues && (store.windowValues.width < 768) && (
            <AdElementDisplay 
              adType='300x65'
              adPlaceId='talkpage-bottom'
            />
          )}
        </div>
        
        {/* <TalkShare 
          setConnectClick={setConnectClick}
        /> */}
      </div>
    );
  }
  if (userSocketId && userId && userName && usersData.length > 0) {

  }


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
    <Fragment>
      <div className="talk-appContainer">
        <TalkPermission />
        
        <div>

          {store.windowValues && (store.windowValues.width >= 768) && (
            <AdElementDisplay 
              adType='300x300'
              adPlaceId='talkpage-right' 
            />
          )}

          {isLoading &&
            <div className="textTalk__loader">
              <Loader />
            </div>
          }

          {callingTo &&
            <Prompt 
            // message="You are still talking. Do you want to stop talking?" 
              message={t('videoTalk.text11')}
            />
          }

          <div className="textTalk_NoconnectMessage">
            {noconnectMessageNotify}
          </div>

          <div className="textTalk__ConnectButton">
            {noUserMessage}
            {connectButton}
          </div>

          {userSocketId && !showUserTextTalkList  && !callGet && (
            <div className={!isCalling && !tryingToCallUser ? "textTalk-OnlineUser-Container" : ""}>
              {!isCalling && !tryingToCallUser && (
              <div>
                {listForSuggest.length > 0 && 
                  <div className={suggestList.length > 0 ? "textTalk__UserTalkListSuggest" : "textTalk__UserTalkListNoSuggest"} >
                    <AutoSuggestVideoTextTalk
                      userList={listForSuggest}
                      listType="listForSuggest"
                      callUser={callUser}
                      startTalkButton={startTalkButton}
                      getSuggestList={getSuggestList}
                    />
                  </div>
                }
                </div>
                )
              }

              {userListElement2}
            </div>
          )}



          <div>
              <div className="textTalk__ConnectUserInfo">
                <div>
                  {tryingToCallUser &&
                    <div>
                      {/* Your are trying to talk: {tryingToCallUser.userName} */}
                      {t('videoTalk.text5')}: {tryingToCallUser.userName}
                    </div> 
                  }

                  {callingTo && !showTextTalk && 
                    <div>
                      {/* You are talking to: {callingTo.userName} */}
                      {t('videoTalk.text7')}: {callingTo.userName}
                    </div>
                  }

                  {talkStartAt && !showTextTalk &&
                    <div>
                      {/* You started to talk: {getLocalTimeElements(talkStartAt).hour}:{getLocalTimeElements(talkStartAt).minute} {getLocalTimeElements(talkStartAt).xm} */}
                      {t('videoTalk.text8')}: {getLocalTimeElements(talkStartAt).hour}:{getLocalTimeElements(talkStartAt).minute} {getLocalTimeElements(talkStartAt).xm}
                    </div>
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

            <div>
      
              {callingTo && showTextTalk && (
                  <div>
                    <div id="text-talk" className="textTalk-container"
                      style={!showTextInputElement ? {bottom: "15px"} : {}}
                    >
                      <VideoTextTalkTextList 
                        textInputList={textInputList}
                        userName={userName}
                        userId={userId}
                        favoriteUsers={favoriteUsers}
                        editFavoriteUsersHandler={editFavoriteUsersHandler}
                        editFavoriteUsersResult={editFavoriteUsersResult}
                        getMoreNum={getMoreNum}
                        setGetMoreNum={setGetMoreNum}
                        noconnectGetMoreHandler={noconnectGetMoreHandler}
                        isMoreText={isMoreText}
                        listScrollTop={listScrollTop}
                        isLoading={isLoading}
                      />
                    </div>

                    <div className="">
                      
                      {showTextInputElement &&
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
                      }

                      {!showTextInputElement && (
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
                      )}
                    </div>
                  </div>
                  
              )}
    


              
              {showNoconnectTextTalk &&
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
                      style={!showTextInputElement ? {bottom: "15px"} : {}}
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
                        getMoreNum={getMoreNum}
                        setGetMoreNum={setGetMoreNum}
                        noconnectGetMoreHandler={noconnectGetMoreHandler}
                        isMoreText={isMoreText}
                        listScrollTop={listScrollTop}
                        isLoading={isLoading}
                      />
                    </div>

                      {showTextInputElement && (
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
                      )}
                      {!showTextInputElement && (
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
                      )}
                  </div>
              }


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




        {userSocketId && !isCalling && !tryingToCallUser && !callGet && 
          !showNoconnectTextTalk && (
          <div> 
            <div>
              <TalkUserListControl
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

              <TalkUserListNotify
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
          </div>
        )}


          <VideoTextTalkSocket 
            setIsLoading={setIsLoading}
            setSocketState={setSocketState}
            setUserSocketId={setUserSocketId}
            userId={userId}
            userName={userName}
            userImageUrl={userImageUrl}
            userListObj={userListObj}
            setCallReject={setCallReject}
            userSocketId={userSocketId}
            setCallGet={setCallGet}
            setIsCalling={setIsCalling}
            setUserListObj={setUserListObj}
            textInputList={textInputList}
            setTextInputList={setTextInputList}
            setTextInput={setTextInput}
            setIsMoreText={setIsMoreText}
            setIsTextPosting={setIsTextPosting}
            setNoconnectMessageNotify={setNoconnectMessageNotify}
            setFavoriteUsers={setFavoriteUsers}
            setEditFavoriteUsersResult={setEditFavoriteUsersResult}
            connectClick={connectClick}
            scrollToBottom={scrollToBottom}
          />
        </div>
    </Fragment>
  );
};

export default VideoTextTalk;