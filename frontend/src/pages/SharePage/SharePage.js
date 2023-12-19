import React from "react";
import { Fragment, useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { useTranslation } from "react-i18next/hooks";

import Button from "../../components/Button/Button";
import Loader from "../../components/Loader/Loader";
// import FeedEdit from "../../components/Feed/FeedEdit/FeedEdit";
import PostMessageRecieve from "./PostMessageRecieve";
import SharePageFeed from "./SharePageFeed";

import { useStore } from "../../hook-store/store";
// import { getUserDataForStore } from "../../util/user";


import { authPageLink, authSignupPageLink, BASE_URL } from "../../App";


const SharePage = (props) => {
  // console.log('PostMessageRecieve-props', props);
  const [t] = useTranslation("translation");

  const { isAuth, history } = props;

  const [store, dispatch] = useStore();
  const { shareFile } = store.shareStore;

  const [isFileLoading, setIsFileLoading] = useState(true);
  const [isFeedPost, setIsFeedPost] = useState(false);

  useEffect(() => {
    if (shareFile) {
      setIsFileLoading(false);
    }
  },[shareFile]);

  const setIsFeedHandler = (value) => {
    setIsFeedPost(value);
  }

  return (
    <Fragment>
      <div>
        {isFileLoading && isAuth &&  <Loader />}
        
        <PostMessageRecieve 
          isAuth={isAuth}
        />

        <div>
          {shareFile && (
            <Button design="raised" type="submit" 
            onClick={() => { setIsFeedHandler(true); }}
            >
              Post image to feed
            </Button>
          )}
        </div>


        {shareFile && isFeedPost && (
          <SharePageFeed
            isAuth={isAuth}
            history={history}
            isFeedPost={isFeedPost}
            setIsFeedHandler={setIsFeedHandler}
          />
        )}
      </div>
    </Fragment>
  );
};

export default SharePage;
