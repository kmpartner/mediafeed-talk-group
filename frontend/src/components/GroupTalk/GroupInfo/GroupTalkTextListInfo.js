import React from 'react';
import { Fragment, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next/hooks';
import Img from "react-cool-img";

import GroupInfoContents from './GroupInfoContents';
import GroupInfoModal from './GroupInfoModal';

import classes from './GroupTalkTextListInfo.module.css'


const GroupTalkTextListInfo = (props) => {
  // console.log('GroupTalkTextListInfo-props', props);

  const { 
    userId,
    groupInfo,
    groupAllMemberList,
    getIsMemberHandler,
    editFavoriteGroupsHandler,
    editFavoriteGroupsResult,
    // creatorInfo,
    // usersData,
    groupUserInfo,
    isLoading,
  } = props;

  const [t] = useTranslation('translation');

  const [showGroupInfoModal, setShowGroupInfoModal] = useState('');

  useEffect(() => {
    // scrollToTop('group-info')

    if (groupAllMemberList && groupAllMemberList.length > 0) {
      const userIsMemberIndex = groupAllMemberList.findIndex(element => {
        return element.userId === userId;
      });

      console.log(userIsMemberIndex);
      if (userIsMemberIndex > -1) {
        getIsMemberHandler(true);
      } else {
        getIsMemberHandler(false);
      }
    }

  },[groupAllMemberList]);


  const showGroupInfoModalHandler = () => {
    setShowGroupInfoModal(!showGroupInfoModal);
  }


  const groupInfoContents = (
    <GroupInfoContents 
      groupInfo={groupInfo}
      // creatorInfo={creatorInfo}
      // usersData={usersData}
      groupAllMemberList={groupAllMemberList}
      groupUserInfo={groupUserInfo}
      editFavoriteGroupsHandler={editFavoriteGroupsHandler}
      editFavoriteGroupsResult={editFavoriteGroupsResult}
      isLoading={isLoading}
    />
  );

  let infoButtonBody;

  const infoButton = (      
    <div className={classes.infoButton} onClick={showGroupInfoModalHandler}>
      &#8942;
    </div>
  );
 
  infoButtonBody = (
    <div>
      
      {!isLoading && infoButton}

      {showGroupInfoModal && 
        <GroupInfoModal 
          showModalHandler={showGroupInfoModalHandler}
          modalContent={groupInfoContents}
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

export default GroupTalkTextListInfo;