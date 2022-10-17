import React, { Fragment, useState, useEffect } from 'react';
// import openSocket from 'socket.io-client';
import { useTranslation } from 'react-i18next/hooks';

import Loader from '../../../../Loader/Loader';

// import './PostComment.css';
import classes from './PostCommentReaction.module.css'

const PostCommentReaction = props => {
  console.log('postCommentReaction-props', props);

  const [t] = useTranslation('translation');

  const [commentLikeNum, setCommentLikeNum] = useState();
  const [isUserLikeComment, setIsUserLikeComment] = useState(false);
  // console.log(commentLikeNum);

  useEffect(() => {
    getCommentReaction('like');
  },[props.allCommentReactions]);


  const getCommentReaction = (type) => {
    if (props.allCommentReactions.length > 0) {
      if (type === 'like') {
        const commentLikeReactions = props.allCommentReactions.filter(reaction => {
          return (
            reaction.commentId === props.comment._id 
            && reaction.typeIdNumber === 1
          );
        });

        if (commentLikeReactions.length > 0) {
          const isUserContain = commentLikeReactions.find(like => {
            return like.userId === localStorage.getItem('userId');
          });
          console.log(isUserContain);
          if (isUserContain) {
            setIsUserLikeComment(true);
          } else {
            setIsUserLikeComment(false);
          }

          setCommentLikeNum(commentLikeReactions.length);
        }
  
        // console.log(commentLikeReactions);
      }
    }
  };

  let likeBody
  if (props.isAuth) {
    likeBody = (
      <div className={classes.commentlistReactionButton}>
        <span role="img" aria-label="parent-reaction-button"
          onClick={() => { 
            if (!isUserLikeComment) {
              props.createPostCommentUserReactionHandler('like', props.comment._id);
            }
          }}
        >
          &#128077;
        </span> 
        {commentLikeNum && <span> {commentLikeNum}</span>}
        {isUserLikeComment && <span> (already liked)</span>}
      </div>
    );
  }


  if (props.commentLoading) {
    likeBody = (
      <span><Loader loaderStyle="loaderSmall" /></span>
    );
  }


  return (<Fragment>{likeBody}</Fragment>);
};

export default PostCommentReaction;
