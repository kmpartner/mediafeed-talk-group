import React from 'react';
import { Fragment, useState } from 'react';
import { withI18n } from "react-i18next";
import { Link } from 'react-router-dom';
import Img from "react-cool-img";

import Button from '../../Button/Button';
import Loader from '../../Loader/Loader';
import Modal from '../../Modal/Modal';

import './Post.css';



const PostMetrics = props => {
  // console.log('prop-PostMetrics.js', props)
  
  const { t, postData } = props;

  const commentCount = postData.totalComment ? postData.totalComment : '';
  const reactionCounts = props.postData.userReactionCounts;
  let likeCount;

  if (reactionCounts && reactionCounts.length > 0) {
    likeCount = reactionCounts.find(count => {
      return count.type === 'like';
    });
  }

  return (
    <Fragment>
      <div className="post__metrics">
        <div className="post__metricsItem">{t('feed.29', 'Visits')}: {props.postData && props.postData.totalVisit ? props.postData.totalVisit : 0}</div>
        {likeCount && likeCount.reactionCount > 0 && (
          <div className="post__metricsItem">
            <span className="post__reactionButton">&#128077; </span>
            <span>{likeCount.reactionCount > 0 && likeCount.reactionCount}</span>{' '}
          </div>
        )}
        {commentCount && (
          <span> {t('comment.text8', 'Comments')} {commentCount}</span>
        )}
      </div>
    </Fragment>
  )
};

export default withI18n()(PostMetrics);
// export default post;
