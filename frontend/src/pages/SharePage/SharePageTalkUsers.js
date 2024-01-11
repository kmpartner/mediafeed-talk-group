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

const SharePageTalkUsers = (props) => {
  // console.log('PostMessageRecieve-props', props);
  const [t] = useTranslation("translation");

  const { 
    isAuth, 
    history, 
    isFeedPost, 
    setIsFeedHandler ,
    acceptedUsers,
    setShowUsersModal,
    isLoading,
  } = props;

  const [store, dispatch] = useStore();
  const { shareFile } = store.shareStore;

  // const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {

  },[]);


  let acceptListBody = <div>{t('videoTalk.text25', 'no user')}</div>

  if (acceptedUsers.length > 0) {
    acceptListBody = (
      <ul>
        {acceptedUsers.map((user) => {
          return (
            <div key={user.userId}>
              <div className={classes.shareUserInfoContainer}>
                <Img
                  className={classes.shareUserImageElement}
                  // style={!favoriteUserInfo.imageUrl ? { paddingTop: "0.25rem" } : null}
                  src={
                    user.imageUrl
                      ? // BASE_URL + '/' + element.imageUrl
                        user.imageUrl
                      : SampleImage
                  }
                  alt="user-img"
                />
                <span >
                  {user.name}
                </span>
                <Link to={`/talk-page?shareUserId=${user.userId}&shareFileType=image`}>
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
        <div>{acceptListBody}</div>

      </SmallModal>
    </Fragment>
  );
};

export default SharePageTalkUsers;





