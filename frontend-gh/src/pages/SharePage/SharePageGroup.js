import React from "react";
import { Fragment, useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { useTranslation } from "react-i18next/hooks";
import axios from "axios";

import Button from "../../components/Button/Button";
import Loader from "../../components/Loader/Loader";
import FeedEdit from "../../components/Feed/FeedEdit/FeedEdit";
// import PostMessageRecieve from "./PostMessageRecieve";
import SharePageGroupList from "./SharePageGroupList";

import { useStore } from "../../hook-store/store";
// import { getUserDataForStore } from "../../util/user";
import { getTalkAcceptedUsers } from '../../util/talk/talk-user';
import { getUserFavoriteGroups } from '../../util/group/group-user';

import { authPageLink, authSignupPageLink, BASE_URL, SOCKET_GROUP_URL } from "../../App";
import SharePageTalkUsers from "./SharePageTalkUsers";


const SharePageGroup = (props) => {
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
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {

  },[]);

  const getFavoriteGroupsHandler = async () => {
    try {

      setShowUsersModal(true);

      if (joinedGroups.length > 0) {
        return;
      }

      setIsLoading(true);
      const resData = await getUserFavoriteGroups(
        SOCKET_GROUP_URL,
        localStorage.getItem('token'),
      );

      console.log(resData);

      if (resData && resData.data && resData.data.length > 0) {
        const userJoinedGroups = getJoinedGroupsHandler(
          resData.data,
          localStorage.getItem('userId'),
        );

        if (userJoinedGroups && userJoinedGroups.length > 0) {
          setJoinedGroups(userJoinedGroups);
        }
        // setAcceptedUsers(resData.data);
      }

      setIsLoading(false);
    } catch(err) {
      console.log(err);
      setIsLoading(false);
    }
  }


  const getJoinedGroupsHandler = (groups, userId) => {
    const joinedGroups = [];

    for (const group of groups) {
      const isJoined = group.allMemberUserIds.find(element => {
        return element.userId === userId;
      });

      if (isJoined) {
        joinedGroups.push(group);
      }
    }

    return joinedGroups;
  };

  let sharePageGroupBody;

  if (shareFile) {
    sharePageGroupBody = (
      <div>
        <Button design="raised" type="submit" 
          disabled={isLoading}
          onClick={getFavoriteGroupsHandler}
        >
          Share at group
        </Button>
        {/* {isLoading && (
          <div><Loader /></div>
        )} */}
        {showUsersModal && (
          <SharePageGroupList 
            joinedGroups={joinedGroups}
            setShowUsersModal={setShowUsersModal}
            isLoading={isLoading}
          />
        )}
      </div>
    )
  }

  return (
    <Fragment>
      <div>{sharePageGroupBody}</div>
    </Fragment>
  );
};

export default SharePageGroup;



