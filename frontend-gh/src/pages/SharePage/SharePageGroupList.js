import React from "react";
import { Fragment, useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { useTranslation } from "react-i18next/hooks";
import axios from "axios";
import Img from "react-cool-img";

import Backdrop from "../../components/Backdrop/Backdrop";
import Button from "../../components/Button/Button";
import Loader from "../../components/Loader/Loader";
import SmallModal from "../../components/Modal/SmallModal";
// import PostMessageRecieve from "./PostMessageRecieve";

import { useStore } from "../../hook-store/store";
// import { getUserDataForStore } from "../../util/user";
import { getTalkAcceptedUsers } from '../../util/talk/talk-user';

import { authPageLink, authSignupPageLink, BASE_URL } from "../../App";

import SampleImage from '../../components/Image/person-icon-50.jpg';
// import SampleImage from "../Image/person-icon-50.jpg";
import classes from './SharePageTalkUsers.module.css';

const SharePageGroupList = (props) => {
  // console.log('PostMessageRecieve-props', props);
  const [t] = useTranslation("translation");

  const { 
    isAuth, 
    history, 
    isFeedPost, 
    setIsFeedHandler ,
    // acceptedUsers,
    joinedGroups,
    setShowUsersModal,
    isLoading,
  } = props;

  console.log('sharepageGroupList-props', props);

  const [store, dispatch] = useStore();
  const { shareFile } = store.shareStore;

  // const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {

  },[]);


  let joinedGroupListBody = (
    <div>
      {t('videoTalk.text25', 'no joined favorite group')}
    </div>
  );

  if (joinedGroups.length > 0) {
    joinedGroupListBody = (
      <div>
        <div>Your favorite groups</div>
        <ul>
          {joinedGroups.map((group) => {
            return (
              <div key={group._id}>
                <div className={classes.shareUserInfoContainer}>
                  <Img
                    className={classes.shareUserImageElement}
                    // style={!favoriteUserInfo.imageUrl ? { paddingTop: "0.25rem" } : null}
                    src={
                      group.imageUrl
                        ? // BASE_URL + '/' + element.imageUrl
                          group.imageUrl
                        : SampleImage
                    }
                    alt="user-img"
                  />
                  <span >
                    {group.groupName}
                  </span>
                  <Link to={`/group-talk-page?shareGroupId=${group._id}&shareFileType=image`}>
                    <Button design='raised' mode='' size='smaller'
                      disabled={isLoading} 
                      // onClick={() => {}}
                    >
                      Write share post
                    </Button>
                  </Link>
                
                </div>
    
              </div>
            );
          })}
        </ul>
      </div>
    )
  }

  return (
    <Fragment>
      <Backdrop 
        onClick={() => { 
          setShowUsersModal(false);
        }}
      />
      <SmallModal 
        style="modal2"
        // style={classes.sepImageModal}
      >
        {isLoading && (
          <div><Loader /></div>
        )}
        <div>{joinedGroupListBody}</div>

      </SmallModal>
    </Fragment>
  );
};

export default SharePageGroupList;





