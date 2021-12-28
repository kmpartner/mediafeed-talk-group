import React from 'react';
import { Fragment, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next/hooks';
import Img from "react-cool-img";

// import GroupListControllContents from './GroupListControllContents';
import TalkModal from '../TalkUserList/TalkModal';
import TalkUserListControllContents from './TalkUserListControllContents';

import classes from './TalkUserListControll.module.css'


const TalkUserListControll = (props) => {
  console.log('TalkUserListControll-props', props);

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


  const showTalkUserListControllModalHandler = () => {
    setShowTalkUserListControllModal(!showTalkUserListControllModal);
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
        </TalkModal>
      }
    </div>
  );


  return (
    <Fragment>
      {infoButtonBody}
    </Fragment>
  );
}

export default TalkUserListControll;