import React from 'react';
import { Fragment, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next/hooks';
import Img from "react-cool-img";

// import GroupListControllContents from './GroupListControllContents';
import TalkModal from '../TalkModal';
import TalkUserListControllContents from './TalkUserListControlContents';
import TalkUserListControlAccept from './TalkUserListControlAccept';

import { marks } from '../../../../images/marks';
import classes from './TalkUserListControl.module.css'


const TalkUserListControl = (props) => {
  // console.log('TalkUserListControll-props', props);

  const { 
    userId,
    usersData,
    favoriteUsers, 
    editFavoriteUsersHandler,
    editFavoriteUsersResult,
    noconnectGetUserDestTalkHandler,
    showNoconnectTextTalk,
    showNoconnectTextTalkHandler,
    noconnectDestUserIdHandler,
    isLoading,
  } = props;

  const [t] = useTranslation('translation');

  const [showTalkUserListControllModal, setShowTalkUserListControllModal] = useState('');

  const [showTalkNotifyModal, setShowTalkNotifyModal] = useState(false);

  const showTalkUserListControllModalHandler = () => {
    setShowTalkUserListControllModal(!showTalkUserListControllModal);
  }

  const showTalkNotifyModalHandler = () => {
    setShowTalkNotifyModal(!showTalkNotifyModal);
  }


  const talkUserListControllContents = (
    // <div>talk-user-list-controll-contents</div>
    <TalkUserListControllContents
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
  );

  const talkUserListControllAccept = (
    // <div>talk-user-list-controll-contents</div>
    <TalkUserListControlAccept
      // userId={userId}
      usersData={usersData}
      // favoriteUsers={favoriteUsers} 
      // editFavoriteUsersHandler={editFavoriteUsersHandler}
      // editFavoriteUsersResult={editFavoriteUsersResult}
      noconnectGetUserDestTalkHandler={noconnectGetUserDestTalkHandler}
      // showNoconnectTextTalk={showNoconnectTextTalk}
      showNoconnectTextTalkHandler={showNoconnectTextTalkHandler}
      noconnectDestUserIdHandler={noconnectDestUserIdHandler}
      isLoading={isLoading}
    />
  );

  let infoButtonBody;

  const infoButton = (      
    <div className={classes.infoButton}>
      <span onClick={showTalkUserListControllModalHandler}>
      &#9881; 
      {/* ⚙️ */}
      </span>
    </div>
  );
 
  infoButtonBody = (
    <div>
      
      {!isLoading && infoButton}

      {showTalkUserListControllModal && 
        <TalkModal 
          showModalHandler={showTalkUserListControllModalHandler}
        >
          {talkUserListControllContents}
          {talkUserListControllAccept}
        </TalkModal>
      }
    </div>
  );

  // const notifyButton = (
  //   <div onClick={showTalkNotifyModalHandler}>
  //     other-content {marks.bellMrak} {marks.bellRedMrak}
  //   </div>
  // );

  // let talkNotifyBody;

  // talkNotifyBody = (
  //   <div>
  //     {!isLoading && notifyButton}
  
  //     {showTalkNotifyModal && 
  //       <TalkModal 
  //         showModalHandler={showTalkNotifyModalHandler}
  //       >
  //         <div>notify-modal-content</div>
  //       </TalkModal>
  //     }
  //   </div>
  // )




  return (
    <Fragment>
      {/* {talkNotifyBody} */}
      {infoButtonBody}
    </Fragment>
  );
}

export default TalkUserListControl;