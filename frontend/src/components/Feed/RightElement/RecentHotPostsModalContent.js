import React, { useState, useEffect, Fragment } from "react";
// import { Link } from 'react-router-dom';
// import Select from 'react-select';
import { withI18n } from "react-i18next";

import Loader from "../../Loader/Loader";
import Post from '../Post/Post';

import { getRecentMostVisitLngPosts } from '../../../util/feed/feed-filter-recent';

import { BASE_URL } from "../../../App";

import classes from "./RecentHotPosts.module.css";

function RecentHotPostsModalContent(props) {
  const { t, 
    hotPosts,
    isLoading,
   } = props;


  let recentHotPostsModalContentBody;

  if (hotPosts.length > 0) {
    recentHotPostsModalContentBody = (
      <ul>{hotPosts.slice(0,20).map(post => {
        return (
          <div key={post._id}>
            <Post
              key={post._id}
              id={post._id}
              author={post.creatorName}
              creatorImageUrl={post.creatorImageUrl}
              date={new Date(post.createdAt).toLocaleDateString('en-US')}
              postDate={post.createdAt}
              title={post.title}
              image={post.imageUrl}
              modifiedImageUrl={post.modifiedImageUrl}
              thumbnailImageUrl={post.thumbnailImageUrl}
              imageUrls={post.imageUrls}
              modifiedImageUrls={post.modifiedImageUrls}
              thumbnailImageUrls={post.thumbnailImageUrls}
              imagePaths={post.imagePaths}
              modifiedImagePaths={post.modifiedImagePaths}
              thumbnailImagePaths={post.thumbnailImagePaths}
              embedUrl={post.embedUrl}
              content={post.content}
              b64Simage={post.b64Simage}
              postCreatorUserId={post.creatorId}
              public={post.public}
              onStartEdit={() => {}}
              onDelete={() => {}}
              deleteMultiImagePostHandler={() => {}}
              updatePostElementHandler={() => {}}
              isPostDeleting={null}
              postDeleteResult={null}
              setSelectedCreatorId={''}
              resetPostPage={''}
              postData={post}
              postFilter={''}
            />
          </div>
        );
      })}</ul>
    );
  }


  return (
    <Fragment>
      {isLoading && <Loader />}
      <div>{recentHotPostsModalContentBody}</div>
    </Fragment>
  );
}

export default withI18n()(RecentHotPostsModalContent);
