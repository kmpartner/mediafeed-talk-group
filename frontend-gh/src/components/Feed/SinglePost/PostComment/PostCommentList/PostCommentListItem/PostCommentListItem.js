import React, { Fragment, useState, useEffect } from 'react';
// import openSocket from 'socket.io-client';
import { useTranslation } from 'react-i18next/hooks';
import Linkify from 'react-linkify';

import Button from '../../../../../Button/Button';
import Loader from '../../../../../Loader/Loader';
import PostCommentReaction from '../../PostCommentReaction/PostCommentReaction';

import { BASE_URL } from '../../../../../../App';

import SampleImage from '../../../../../Image/person-icon-50.jpg';

// import './PostComment.css';
import classes from './PostCommentListItem.module.css'

const PostCommentListItem = props => {
  console.log('postCommentListItem-props', props);

  const [t] = useTranslation('translation');

  const [showReplyIndex, setShowReplyIndex] = useState(null);
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  
  // console.log(commentLikeNum);


  const canDelete = (creatorId) => {
    if (
      creatorId === localStorage.getItem('userId') ||
      props.postCreatorId === localStorage.getItem('userId')
    ) {
      return true;
    } else {
      return false;
    }
  }

  const componentDecorator = (href, text, key) => (
    <a href={href} key={key} target="_blank" rel="noopener noreferrer" style={{color: 'gray', fontWeight: ''}}>
        {text}
    </a>
  );


  let commentCreatorImageUrl = '';

  if (props.commentUserImageUrlList && props.comment) {
    const isInImageUrlList = props.commentUserImageUrlList.find(obj => {
      return obj.userId === props.comment.creatorId;
    });
  
    if (isInImageUrlList) {
      commentCreatorImageUrl = isInImageUrlList.imageUrl;
    }
  }


  const parentElement = (
    <div>
      <div className="comment__parentContent">
        {/* {console.log('IMAGEURL', comment)} */}
        <span className="comment__contentText">
          <Linkify componentDecorator={componentDecorator}>
            {/* {comment.content} */}
            {/* {comment.content.split("\n").map((i,key) => {
              return <div key={key} className="single-post__content">
                {i}
                </div>;
            })} */}

            {props.displayComment.split("\n").map((i,key) => {
              return <div key={key} className="single-post__content">
                {i}
                </div>;
            })}

            <div className="comment__showFullCommentButton">
              {props.showFullCommentButton}
            </div>

          </Linkify>
        </span>
        
        <span className={classes.postCommentListItemUser}>
          <img
            className={classes.postCommentListItemImage}
            src={commentCreatorImageUrl ? commentCreatorImageUrl : SampleImage}
            alt="" 
          />
          <span title={new Date(props.comment.createdAt).toLocaleString()}>
            {props.comment.creatorName} ({new Date(props.comment.createdAt).toLocaleDateString()})
          </span>
        </span>
      </div>
      

      <PostCommentReaction 
        isAuth={props.isAuth}
        createPostCommentUserReactionHandler={props.createPostCommentUserReactionHandler}
        comment={props.comment}
        allCommentReactions={props.allCommentReactions}
        postCreatorId={props.postCreatorId}
        commentLoading={props.commentLoading}
      />

      <div className="comment__actionButtons">
        {props.replyShowControlElement}

        {canDelete(props.comment.creatorId) && !props.showDeleteModal &&
          <Button
            mode="flat" design="danger" type="submit"
            disabled={!canDelete(props.comment.creatorId)}
            onClick={() => {
              props.setShowReplyIndex(null);
              props.setSelectedCommentId(props.comment._id);
              props.showDeleteModalHandler();
              // setYOffsetValue(window.pageYOffset);
            }}
          >
            {/* Delete */}
            {t('comment.text2')}
          </Button>
        }


      </div>

      <div>
        {canDelete(props.comment.creatorId) && !showReplyIndex &&
          props.deleteConfirmButtons
        }
      </div>

      <div>
        {props.replyInputElement}

      </div>

      {props.commentLoading && selectedCommentId === props.comment._id &&
        <div className="comment__loader">
          <Loader />
        </div>
      }

    </div>
  );


  return (
    <div>{parentElement}</div>
  )
};

export default PostCommentListItem;
