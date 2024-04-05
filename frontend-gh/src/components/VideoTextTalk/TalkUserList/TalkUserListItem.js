import React from 'react';
import { useState, useEffect, Fragment } from 'react';
import { useTranslation } from 'react-i18next/hooks';
import Img from "react-cool-img";

// import AutoSuggestVideoTextTalk from '../../AutoSuggest/AutoSuggestVideoTextTalk';
import Button from '../../Button/Button';
import TalkUserListPermission from './TalkUserListPermission';

import { addRecentVisitTalkUserId } from '../../../util/user-recent-visit';
import { useStore } from '../../../hook-store/store';

import { BASE_URL } from '../../../App';
// import './VideoTextTalk.css'

import SampleImage from '../../Image/person-icon-50.jpg';


const TalkUserListItem = props => {
  // console.log('UserTalkListItem.js-props', props);
  const { 
    element, 
    noconnectGetUserDestTalkHandler,
    showNoconnectTextTalkHandler,
    noconnectDestUserIdHandler,
    addVisitUserIdHandler,
    nameData,
    // isAccepted,
  } = props;

  const [t] = useTranslation('translation');

  const [store, dispatch] = useStore();

  let isRequesting = false;
  let isRequested = false;
  let isAccepted = false;
  let isAccept = false;

  if (store.talkPermission) {
    // console.log(store.talkPermission.talkRequestingUserIds);
    const isInRequsting = store.talkPermission.talkRequestingUserIds.find(requesting => {
      return requesting.userId === element.userId;
    });

    if (isInRequsting) {
      isRequesting = true;
    }

    const isInRequested = store.talkPermission.talkRequestedUserIds.find(requested => {
      return requested.userId === element.userId;
    })

    if (isInRequested) {
      isRequested = true;
    }

    const isInAccepted = store.talkPermission.talkAcceptedUserIds.find(accepted => {
      return accepted.userId === element.userId;
    })

    if (isInAccepted) {
      isAccepted = true;
    }

    const isInAccept = store.talkPermission.talkAcceptUserIds.find(accept => {
      return accept.userId === element.userId;
    })

    if (isInAccept) {
      isAccept = true;
    }
  }

  const startWriteTextHandler = () => {
    noconnectGetUserDestTalkHandler(element.userId);
    showNoconnectTextTalkHandler();
    noconnectDestUserIdHandler(element.userId);

    addVisitUserIdHandler(element.userId);
  };

  
  //// start write text when shareUserId param exist
  const currentUrl = new URL(window.location.href);
  const queryParams = currentUrl.searchParams;
  const shareUserIdParam = queryParams.get('shareUserId');

  const pageNotificationUserIdParam = queryParams.get('pageNotificationUserId');

  if (element && element.userId === shareUserIdParam) {
    startWriteTextHandler();
  }

  if (element && element.userId === pageNotificationUserIdParam) {
    startWriteTextHandler();
  }

  let talkUserListItemBody

  talkUserListItemBody = (
    <div key={element._id}>
    <li className="textTalk-OnlineUser-list">

      <span className="textTalk__UserImageContainer">
        {/* <Img className="textTalk__UserImageElement" 
          // style={!element.imageUrl ? { paddingTop:"0.5rem" } : null} 
          src={element.imageUrl ? 
            // BASE_URL + '/' + element.imageUrl
            element.imageUrl
            : SampleImage
            }
          alt='user-img'
        /> */}
        {localStorage.getItem('userId') && nameData?.imageUrl && (
          <Img className="textTalk__UserImageElement"
            // style={{height: "1rem", width: "1rem", objectFit: "cover"}}
            src={nameData.imageUrl} 
          />
        )}
        {localStorage.getItem('userId') && !nameData?.imageUrl && (
          <Img className="textTalk__UserImageElement"
            // style={{height: "1rem", width: "1rem", objectFit: "cover"}}
            src={SampleImage} 
          />
        )}
      </span>

      <span className="textTalk__UserName">
        {/* {element.name}  */}
        {localStorage.getItem('userId') && nameData && (
          <span> 
            {nameData.name}
          </span>
        )}
      </span>

      <span>
        <Button design='raised' mode='' size='smaller' 
          onClick={() => {
            // props.noconnectGetUserDestTalkHandler(element.userId);
            // props.showNoconnectTextTalkHandler();
            // props.noconnectDestUserIdHandler(element.userId);

            // addVisitUserIdHandler(element.userId);

            startWriteTextHandler();
          }}
          disabled={!isAccepted}
        >
          {/* write text */}
          {t('groupTalk.text37', 'write text')}
        </Button>
      </span>

      <TalkUserListPermission 
        // userId={props.userId}
        destUserId={element.userId}
        isRequesting={isRequesting}
        isRequested={isRequested}
        isAccepted={isAccepted}
        isAccept={isAccept}
      />
      {/* {isRequesting ? 'requesting' : 'not-req'}
      {', '}
      {isAccepted ? 'accepted' : 'not-accepted'}
      {', '}
      {isRequested ? 'requested' : 'not-requested'} */}
    </li>
  </div>
  );

  return (
    <Fragment>
      {talkUserListItemBody}
    </Fragment>
    );
}

export default TalkUserListItem;