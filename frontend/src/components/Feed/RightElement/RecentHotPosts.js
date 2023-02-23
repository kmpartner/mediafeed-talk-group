import React, { useState, useEffect, Fragment } from "react";
// import { Link } from 'react-router-dom';
// import Select from 'react-select';
import { withI18n } from "react-i18next";

import Backdrop from "../../Backdrop/Backdrop";
import Button from "../../Button/Button";
import Loader from "../../Loader/Loader";
import SmallModal from "../../Modal/SmallModal";
import RecentHotPostsItem from "./RecentHotPostsItem";
import RecentHotPostsModalContent from "./RecentHotPostsModalContent";

import { getRecentMostVisitLngPosts } from '../../../util/feed/feed-filter-recent';
import { postGetUserImageUrls } from "../../../util/user";

import { BASE_URL } from "../../../App";

import classes from "./RecentHotPosts.module.css";

function RecentHotPosts(props) {
  const { t } = props;

  const [hotPosts, setHotPosts] = useState([]);
  const [creatorImageUrls, setCreatorImageUrls] = useState([]);
  const [showHotPostsModal, setShowHotPostsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getRecentHotPostsHandler();
  },[]);

  const getRecentHotPostsHandler = async () => {
    try {
      setIsLoading(true);

      const resData = await getRecentMostVisitLngPosts(
        BASE_URL,
        localStorage.getItem('token'),
      );

      // console.log('you may like', resData);
      if (resData && resData.posts) {
        setHotPosts(resData.posts);

        // getCreatorsImageUrlHandler(resData.posts);
      }

      setIsLoading(false);

    } catch(err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  const getCreatorsImageUrlHandler = async (postList) => {
    try {
      // const imageUrlList = [];

      const creatorIdList = [];

      for (const post of postList) {
        const isInList = creatorIdList.find(id => {
          return id === post.creatorId;
        });

        if (!isInList) {
          creatorIdList.push(post.creatorId);
        }
      }


      const resData = await postGetUserImageUrls(
        BASE_URL,
        localStorage.getItem('token'),
        creatorIdList,
      );

      console.log('resData postGetImageUrls', resData);

      if (resData) {
        // imageUrlList.push(resData);
        setCreatorImageUrls(resData.data);
      }
      

    } catch(err) {
      console.log(err);
    }
  };

  let recentHotPostsBody;

  if (hotPosts.length > 0) {
    recentHotPostsBody = (
    <div className={classes.recentHotPosts}>
      
      <div className={classes.recentHotPostsTitle}>
        Recent Hot Posts
      </div>

      <ul>
        {hotPosts.slice(0,5).map(post => {
          return (
            <li key={post._id}>
              <RecentHotPostsItem 
                post={post}
                creatorImageUrls={creatorImageUrls}
              />
            </li>
          );
        })}
      </ul>

      <Button mode="flat" design="" size="smaller" 
        onClick={() => { setShowHotPostsModal(true); }}
      >
        Display More Hot Posts
      </Button>

      {showHotPostsModal && (
        <div >
          <Backdrop onClick={() => {
            setShowHotPostsModal(false);
          }} />
          <SmallModal style="hotPostsModal">
            <div>
              <div className={classes.recentHotPostsModalClose}
                onClick={() => {
                  setShowHotPostsModal(false);
                }}
              >
                <span className={classes.recentHotPostsModalCloseButton}>
                  X
                </span>
              </div>
              <div>
                <RecentHotPostsModalContent 
                  hotPosts={hotPosts}
                />
              </div>
            </div>
          </SmallModal>
        </div>
      )}

    </div>
    
    );
  }


  
  return (
    <Fragment>
      <div>{recentHotPostsBody}</div>

      {isLoading && (<Loader />)}
      
    </Fragment>
  );
}

export default withI18n()(RecentHotPosts);
