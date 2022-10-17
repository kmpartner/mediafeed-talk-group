import React from 'react';
import { Fragment, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next/hooks';
import Img from "react-cool-img";


import TalkModal from '../TalkModal';
import TalkUserListNotifyRequest from './TalkUserListNotifyRequest';

import { useStore } from "../../../../hook-store/store";

import { marks } from '../../../../images/marks';
import classes from './TalkUserListNotify.module.css'


const TalkUserListNotify = (props) => {
  // console.log('TalkUserListControll-props', props);

  const { 
    // userId,
    usersData,
    // favoriteUsers, 
    // editFavoriteUsersHandler,
    // editFavoriteUsersResult,
    // noconnectGetUserDestTalkHandler,
    // showNoconnectTextTalk,
    // showNoconnectTextTalkHandler,
    // noconnectDestUserIdHandler,
    isLoading,
  } = props;

  const [t] = useTranslation('translation');

  const [store, dispatch] = useStore();
  const talkPermission = store.talkPermission;

  const [showTalkNotifyModal, setShowTalkNotifyModal] = useState(false);



  const showTalkNotifyModalHandler = () => {
    setShowTalkNotifyModal(!showTalkNotifyModal);
  }

  let isNotification = false;

  if (talkPermission && talkPermission.talkRequestedUserIds.length > 0) {
    isNotification = true;
  }

  const notifyButton = (
    <div className={classes.notifyButton}
      onClick={showTalkNotifyModalHandler}
    >
      {isNotification && (
        <span>{marks.bellRedMark}</span>
      )}
      
      {!isNotification && (
        <span>{marks.bellMark}</span>
      )}
    </div>
  );

  let talkNotifyBody;

  talkNotifyBody = (
    <div>
      {!isLoading && notifyButton}
  
      {showTalkNotifyModal && 
        <TalkModal 
          showModalHandler={showTalkNotifyModalHandler}
        >
          {/* <div>notify-modal-content</div> */}
          <TalkUserListNotifyRequest
            // userId={userId}
            usersData={usersData}
            // favoriteUsers={favoriteUsers} 
            // editFavoriteUsersHandler={editFavoriteUsersHandler}
            // editFavoriteUsersResult={editFavoriteUsersResult}
            // noconnectGetUserDestTalkHandler={noconnectGetUserDestTalkHandler}
            // showNoconnectTextTalk={showNoconnectTextTalk}
            // showNoconnectTextTalkHandler={showNoconnectTextTalkHandler}
            // noconnectDestUserIdHandler={noconnectDestUserIdHandler}
            isLoading={isLoading}
          />
        </TalkModal>
      }
    </div>
  )




  return (
    <Fragment>
      {talkNotifyBody}
      {/* {infoButtonBody} */}
    </Fragment>
  );
}

export default TalkUserListNotify;