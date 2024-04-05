import React from "react";
import { Fragment, useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { useTranslation } from "react-i18next/hooks";
import axios from "axios";

import Button from "../../components/Button/Button";
import Loader from "../../components/Loader/Loader";
import FeedEdit from "../../components/Feed/FeedEdit/FeedEdit";
// import PostMessageRecieve from "./PostMessageRecieve";

import { useStore } from "../../hook-store/store";
// import { getUserDataForStore } from "../../util/user";
import { getTalkAcceptedUsers } from '../../util/talk/talk-user';
import { updateLsNameDataList } from '../../util/user-name-data/user-name-data-util';

import { authPageLink, authSignupPageLink, BASE_URL } from "../../App";
import SharePageTalkUsers from "./SharePageTalkUsers";


const SharePageTalk = (props) => {
  // console.log('PostMessageRecieve-props', props);
  const [t] = useTranslation("translation");

  const { 
    isAuth, 
    history, 
    isFeedPost, 
    setIsFeedHandler 
  } = props;

  const [store, dispatch] = useStore();
  const { shareFile } = store.shareStore;

  const [acceptedUsers, setAcceptedUsers] = useState([]);
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {

  },[]);

  const getAcceptedUsersHandler = async () => {
    try {

      setShowUsersModal(true);

      if (acceptedUsers.length > 0) {
        return;
      }

      setIsLoading(true);
      const resData = await getTalkAcceptedUsers(
        BASE_URL,
        localStorage.getItem('token'),
      );

      console.log(resData);

      if (resData && resData.data && resData.data.length > 0) {
        setAcceptedUsers(resData.data);
      }

      if (resData?.userNameDataList?.length > 0) {
        updateLsNameDataList(resData.userNameDataList);
      }

      setIsLoading(false);
    } catch(err) {
      console.log(err);
      setIsLoading(false);
    }
  }

  let sharePageTalkBody;

  if (shareFile) {
    sharePageTalkBody = (
      <div>
        <Button design="raised" type="submit" 
          disabled={isLoading}
          onClick={getAcceptedUsersHandler}
        >
          Share at talk page
        </Button>
        {/* {isLoading && (
          <div><Loader /></div>
        )} */}
        {showUsersModal && (
          <SharePageTalkUsers 
            acceptedUsers={acceptedUsers}
            setShowUsersModal={setShowUsersModal}
            isLoading={isLoading}
          />
        )}
      </div>
    )
  }

  return (
    <Fragment>
      <div>{sharePageTalkBody}</div>
    </Fragment>
  );
};

export default SharePageTalk;



