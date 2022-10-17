import React, { Fragment, useState } from 'react';
// import openSocket from 'socket.io-client';
import { useTranslation } from 'react-i18next/hooks';
import Linkify from 'react-linkify';

import Button from '../../../../../Button/Button';
// import './PostComment.css';



const PostCommentListReplyItem = props => {
  // console.log('postCommentListReplyItem-props', props);

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
        {props.comment.creatorName} ({new Date(props.comment.createdAt).toLocaleString()})
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
        {/* <br /> */}
        {props.comment.creatorName} ({new Date(props.comment.createdAt).toLocaleString()})
      </div>
    );
  }


  return (
    <Fragment>{replyElement}</Fragment>
  )
};

export default PostCommentListReplyItem;
