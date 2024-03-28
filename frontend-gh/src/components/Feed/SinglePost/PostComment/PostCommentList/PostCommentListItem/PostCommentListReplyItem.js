import React, { Fragment, useState } from 'react';
// import openSocket from 'socket.io-client';
import { useTranslation } from 'react-i18next/hooks';
import Linkify from 'react-linkify';

import Button from '../../../../../Button/Button';

import { BASE_URL } from '../../../../../../App';

import SampleImage from '../../../../../Image/person-icon-50.jpg';

// import './PostComment.css';
import classes from './PostCommentListItem.module.css'



const PostCommentListReplyItem = props => {
  console.log('postCommentListReplyItem-props', props);

  const [t] = useTranslation('translation');

  const [error, setError] = useState('');

  const [showFullCommentId, setShowFullCommentId] = useState('');

  // const addComment = (commentData) => {
  //   console.log(postCommentList, commentData);
  //   const addPosts = postCommentList.unshift(commentData);
  //   // setPostCommentList(addPosts);
  // }



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


  let replyElement;
  if (props.isAuth) {
    //// how to filter loader...
    replyElement = (
      <div className="comment__replyElement">
        <span className="comment__contentText">
          <Linkify componentDecorator={componentDecorator}>
            {/* {comment.content} */}
            {/* {comment.content.split("\n").map((i,key) => {
              return <div key={key} className="single-post__content">{i}</div>;
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
        {/* <br /> */}

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
        <div className="comment__actions">
          {canDelete(props.comment.creatorId) && !props.showDeleteModal ?
            <Button
              mode="flat" design="danger" type="submit"
              disabled={!canDelete(props.comment.creatorId)}
              onClick={() => {
                props.showDeleteModalHandler();
                props.setSelectedCommentId(props.comment._id);
              }}
            >
              {/* Delete */}
              {t('comment.text2')}
            </Button>
            : null
          }

          {props.deleteConfirmButtons}

        </div>

      </div>
    );
  } else {
    replyElement = (
      <div className="comment__replyElement">
        <span className="comment__contentText">
          <Linkify componentDecorator={componentDecorator}>
            {/* {comment.content} */}
            {/* {comment.content.split("\n").map((i,key) => {
              return <div key={key} className="single-post__content">{i}</div>;
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
    );
  }


  return (
    <Fragment>{replyElement}</Fragment>
  )
};

export default PostCommentListReplyItem;
