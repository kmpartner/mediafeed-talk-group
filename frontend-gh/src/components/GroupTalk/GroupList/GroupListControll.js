import React from 'react';
import { Fragment, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next/hooks';
import Img from "react-cool-img";

import GroupListControllContents from './GroupListControllContents';
import GroupInfoModal from '../GroupInfo/GroupInfoModal';

import classes from './GroupListControll.module.css'


const GroupListControll = (props) => {
  console.log('GroupListControll-props', props);

  const { 
    groupList,
    showGroupTalkTextHandler,
    getGroupInfoHandler,
    editFavoriteGroupsHandler,
    editFavoriteGroupsResult,
    groupUserInfo,
    isLoading,
  } = props;

  const [t] = useTranslation('translation');

  const [showGroupListControllModal, setShowGroupListControllModal] = useState('');


  const showGroupListControllModalHandler = () => {
    setShowGroupListControllModal(!showGroupListControllModal);
  }


  const groupListControllContents = (
    // <div>group-list-controll-contents</div>
    <GroupListControllContents
      groupList={groupList}
      groupUserInfo={groupUserInfo}
      showGroupTalkTextHandler={showGroupTalkTextHandler}
      getGroupInfoHandler={getGroupInfoHandler}
      editFavoriteGroupsHandler={editFavoriteGroupsHandler}
      editFavoriteGroupsResult={editFavoriteGroupsResult}
      isLoading={isLoading}
    />
  );

  let infoButtonBody;

  const infoButton = (      
    <div className={classes.infoButton}>
      <span className={classes.infoButtonMark}
        onClick={showGroupListControllModalHandler}
      >
        &#9881; 
        {/* ⚙️ */}
      </span>
    </div>
  );
 
  infoButtonBody = (
    <div>
      
      {!isLoading && infoButton}

      {showGroupListControllModal && 
        <GroupInfoModal 
          showModalHandler={showGroupListControllModalHandler}
          modalContent={groupListControllContents}
        />
      }
    </div>
  );


  return (
    <Fragment>
      {infoButtonBody}
    </Fragment>
  );
}

export default GroupListControll;