import React from 'react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next/hooks';
import Img from "react-cool-img";

import AutoSuggestVideoTextTalk from '../../AutoSuggest/AutoSuggestVideoTextTalk';
import Button from '../../Button/Button';
import TalkUserListPermission from './TalkUserListPermission';
import TalkUserListItem from './TalkUserListItem';

import { addRecentVisitTalkUserId } from '../../../util/user-recent-visit';
import { useStore } from '../../../hook-store/store';

import { BASE_URL } from '../../../App';
// import './VideoTextTalk.css'

import SampleImage from '../../Image/person-icon-50.jpg';


const TalkUserList = props => {
  // console.log('UserTalkList.js-props', props);

  const [t] = useTranslation('translation');

  const [store, dispatch] = useStore();
  // const [suggestInput, setSuggestInput] = useState('');
  const [suggestList, setSuggestList] = useState([]);
  const [selectedSuggest, setSelectedSuggest] = useState();

  // const [displayList, setDisplayList] = useState([]);
  // const [user30List, setUser30List] = useState([]);
  const [userTrimList, setUserTrimList] = useState([]);
  const [withoutUserList, setWithoutUserList] = useState([]);

  useEffect(() => {

    if (props.usersData && withoutUserList.length === 0) {
      const withoutUserList = props.usersData.filter(user => {
        // return user._id !== props.userId;
        return user.userId !== props.userId;
      });
      setWithoutUserList(withoutUserList);
  
      setUserTrimList(withoutUserList.slice(0,30));
      // setDisplayList(withoutUserList.slice(0,30));
    }
  },[props.usersData]);

  // useEffect(() => {
  //   if (selectedSuggest) {
  //     // const withoutSelect = props.usersData.filter(user => {
  //     //   return user.userId !== selectedSuggest.userId;
  //     // });

  //     const selectedUser = props.usersData.filter(user => {
  //       return user.userId === selectedSuggest.userId;
  //     });

  //     setDisplayList(selectedUser);
  //     // setDisplayList(selectedUser.concat(withoutSelect));
  //   } else {
  //     setDisplayList(user30List);
  //   }
  //   // props.getUserTextTalkListHandler();
  // },[selectedSuggest]); 

  // const withoutUserList = props.usersData.filter(user => {
  //   // return user._id !== props.userId;
  //   return user.userId !== props.userId;
  // });

  const isSuggestInput = (input) => {
      // setSuggestInput(input.trim());
  };

  const getSuggestList = (list) => {
    setSuggestList(list);
  }


  const addVisitUserIdHandler = async (destUserId) => {
    try {
      if (localStorage.getItem('userId') && localStorage.getItem('userId') !== destUserId) {
        await addRecentVisitTalkUserId(
          BASE_URL,
          localStorage.getItem('token'),
          destUserId,
        );
      }
    } catch(err) {
      console.log(err);
    }
  };

  // console.log('displayList', displayList);
  console.log('userTrimList', userTrimList);

  let talkUserList;

  // if (props.usersData.length > 0) {
  if (userTrimList.length > 0) {

    talkUserList = <ul>
      {userTrimList.map((element) => {

        // let isRequesting = false;
        // let isRequested = false;
        // let isAccepted = false;
        // let isAccept = false;

        // if (store.talkPermission) {
        //   // console.log(store.talkPermission.talkRequestingUserIds);
        //   const isInRequsting = store.talkPermission.talkRequestingUserIds.find(requesting => {
        //     return requesting.userId === element.userId;
        //   });

        //   if (isInRequsting) {
        //     isRequesting = true;
        //   }

        //   const isInRequested = store.talkPermission.talkRequestedUserIds.find(requested => {
        //     return requested.userId === element.userId;
        //   })

        //   if (isInRequested) {
        //     isRequested = true;
        //   }

        //   const isInAccepted = store.talkPermission.talkAcceptedUserIds.find(accepted => {
        //     return accepted.userId === element.userId;
        //   })

        //   if (isInAccepted) {
        //     isAccepted = true;
        //   }

        //   const isInAccept = store.talkPermission.talkAcceptUserIds.find(accept => {
        //     return accept.userId === element.userId;
        //   })

        //   if (isInAccept) {
        //     isAccept = true;
        //   }
        // }

        // console.log(element);

        // const userInfo = props.usersData.find(user => {
        //   return user._id === element.pairId.split('-')[1]
        // });
        // console.log(userInfo);
        // if (element._id !== props.userId) {
        if (element.userId !== props.userId) {
          return (
            <div key={element._id}>
              <TalkUserListItem 
                element={element}
                noconnectGetUserDestTalkHandler={props.noconnectGetUserDestTalkHandler}
                showNoconnectTextTalkHandler={props.showNoconnectTextTalkHandler}
                noconnectDestUserIdHandler={props.noconnectDestUserIdHandler}
                addVisitUserIdHandler={addVisitUserIdHandler}
              />
            </div>

          // <div key={element._id}>
          //   <li className="textTalk-OnlineUser-list">

          //     <span className="textTalk__UserImageContainer">
          //       {/* <img className="textTalk__UserImageElement" style={!element.imageUrl ? { paddingTop:"0.5rem" } : null} 
          //         src={element.imageUrl ? 
          //           // BASE_URL + '/' + element.imageUrl
          //           element.imageUrl
          //           : SampleImage
          //           }
          //         alt='user-img'
          //       ></img> */}
          //       <Img className="textTalk__UserImageElement" 
          //         // style={!element.imageUrl ? { paddingTop:"0.5rem" } : null} 
          //         src={element.imageUrl ? 
          //           // BASE_URL + '/' + element.imageUrl
          //           element.imageUrl
          //           : SampleImage
          //           }
          //         alt='user-img'
          //        />
          //     </span>

          //     <span className="textTalk__UserName">
          //       {element.name} 
          //     </span>

          //     <span>
          //       <Button design='raised' mode='' size='smaller' 
          //         onClick={() => {
          //           // props.noconnectGetUserDestTalkHandler(element._id);
          //           // props.showNoconnectTextTalkHandler();
          //           // props.noconnectDestUserIdHandler(element._id);

          //           props.noconnectGetUserDestTalkHandler(element.userId);
          //           props.showNoconnectTextTalkHandler();
          //           props.noconnectDestUserIdHandler(element.userId);

          //           addVisitUserIdHandler(element.userId);
          //         }}
          //         disabled={!isAccepted}
          //       >
          //         {/* write text */}
          //         {t('groupTalk.text37', 'write text')}
          //       </Button>
          //     </span>

          //     <TalkUserListPermission 
          //       // userId={props.userId}
          //       destUserId={element.userId}
          //       isRequesting={isRequesting}
          //       isRequested={isRequested}
          //       isAccepted={isAccepted}
          //       isAccept={isAccept}
          //     />
          //     {/* {isRequesting ? 'requesting' : 'not-req'}
          //     {', '}
          //     {isAccepted ? 'accepted' : 'not-accepted'}
          //     {', '}
          //     {isRequested ? 'requested' : 'not-requested'} */}
          //   </li>
          // </div>
          );
        }
      })
      }
  </ul>
  }


  return (
    <div>
      



      {props.showUserTextTalkList && !props.showNoconnectTextTalk ? 
        <div>
          <div className="textTalk__UserTalkList-Container">
            {talkUserList}
          </div>
        </div>
      : null
      }

      {props.showUserTextTalkList && !props.showNoconnectTextTalk ? 
        <div className={suggestList.length > 0 ? "textTalk__UserTalkListSuggest" : "textTalk__UserTalkListNoSuggest"} >
          <AutoSuggestVideoTextTalk
            // userList={props.usersData}
            userList={withoutUserList}
            noconnectGetUserDestTalkHandler={props.noconnectGetUserDestTalkHandler}
            showNoconnectTextTalkHandler={props.showNoconnectTextTalkHandler}
            noconnectDestUserIdHandler={props.noconnectDestUserIdHandler}
            userId={props.userId}
            setSelectedSuggest={setSelectedSuggest}
            getSuggestList={getSuggestList}

            addVisitUserIdHandler={props.addVisitUserIdHandler}
          />
        </div>
      : null
      }

    </div>
    );
}

export default TalkUserList;