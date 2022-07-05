import React, { useState } from 'react';
// import openSocket from 'socket.io-client';
import { useTranslation } from 'react-i18next/hooks';
import Linkify from 'react-linkify';

import Input from '../../../../Form/Input/Input';
import InputEmoji from '../../../../Form/Input/InputEmoji';
import ErrorHandler from '../../../../ErrorHandler/ErrorHandler';
import Button from '../../../../Button/Button';
import Loader from '../../../../Loader/Loader';
import { BASE_URL, authPageLink, authSignupPageLink } from '../../../../../App';
// import './PostComment.css';

import PostCommentListInput from './PostCommentInput/PostCommentListInput';
import PostCommentListItem from './PostCommentListItem/PostCommentListItem';
import PostCommentListReplyItem from './PostCommentListItem/PostCommentListReplyItem';
import PostCommentListReplyInput from './PostCommentInput/PostCommentListReplyInput';

const PostCommentList = props => {
  console.log('postCommentList-props', props);

  const [t] = useTranslation('translation');

  const [error, setError] = useState('');
  const [showReplyIndex, setShowReplyIndex] = useState(null);
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [showFullCommentId, setShowFullCommentId] = useState('');

  // const addComment = (commentData) => {
  //   console.log(postCommentList, commentData);
  //   const addPosts = postCommentList.unshift(commentData);
  //   // setPostCommentList(addPosts);
  // }

  const showFullCommentIdHandler = (id) => {
    if (showFullCommentId && id === showFullCommentId) {
      setShowFullCommentId('');
    } else {
      setShowFullCommentId(id);
    }
  }

  const catchError = error => {
    setError(error);
  };

  const errorHandler = () => {
    setError(null);
  };


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


  //// rearrange comment list
  let listThree = [];
  const postCommentList = props.postCommentList;

  postCommentList.forEach(com => {
    let temporalArray = [];
    // console.log(com);
    if (!com.parentCommentId) {
      temporalArray.push(com);

      postCommentList.forEach(element => {
        // console.log(element._id, element.parentCommentId);
        if (element.parentCommentId === com._id && element._id !== temporalArray[0]._id) {
          temporalArray.push(element);
        }
      });
      // console.log(temporalArray);
      listThree.push(temporalArray);
    }
  });
  console.log(listThree);
  // console.log(window, 'yoffset ', window.pageYOffset);


  let commentList3 = [];
  let deleteModal;

  if (listThree.length > 0) {
    // commentList2 = listThree.forEach(list => {
    listThree.forEach(list => {
      // console.log(list);
      const listElement = list.map(comment => {
        

        //// for limit longer comment and show full comment button
        const lengthLimit = 200
        let displayComment = comment.content;
        if (comment.content.length > lengthLimit) {
          displayComment = comment.content.slice(0, lengthLimit) + '.....';
        }
        if (showFullCommentId && showFullCommentId === comment._id) {
          displayComment = comment.content;
        }
        // console.log(displayComment);

        
        let showFullCommentButton;
        if (comment.content.length > lengthLimit && showFullCommentId === comment._id) {
          showFullCommentButton = (<span onClick={() => {
            showFullCommentIdHandler(comment._id)
            }}>
              Hide
              </span>);
        }
        if (comment.content.length > lengthLimit && showFullCommentId !== comment._id) {
          showFullCommentButton = (<span onClick={() => {
            showFullCommentIdHandler(comment._id)
            }}>
              Show All
              </span>);
        }



        // console.log(comment._id);
        const commentParam = comment.parentCommentId ? comment.parentCommentId : comment._id;
        // console.log(commentParam);

        let deleteConfirmButtons;
        if (props.showDeleteModal && comment._id === selectedCommentId) {
          deleteConfirmButtons = (
            <div>
              <div className="comment__deleteConfirm">
                {!comment.parentCommentId && list.length > 1 ?
                  <span>
                    {/* Is it no problem to delete this comment and replies of this comment completely? */}
                    {t('comment.text9')}
                  </span>
                  :
                  <span>
                    {/* Is it no problem to delete this comment completely? */}
                    {t('comment.text10')}
                  </span>

                }
              </div>
              <div className="comment__deleteButtons">
                <Button
                  mode="flat" design="danger" type="submit"
                  disabled={props.commentLoading}
                  onClick={() => {
                    props.hideDeleteModalHandler();
                    setSelectedCommentId(null);
                  }}
                >
                  {/* Cancel */}
                  {t('comment.text1')}
                </Button>
                <Button
                  mode="raised" design="" type="submit"
                  disabled={props.commentLoading}
                  onClick={() => { props.commentDeleteHandler(props.postId, comment._id) }}
                >
                  {/* Delete */}
                  {t('comment.text2')}
                </Button>
              </div>

              {props.commentLoading && comment.parentCommentId ?
                <div className="comment__loader">
                  <Loader />
                </div>
                : null
              }

            </div>
          );
        }








        let replyShowControlElement;
        if (!comment.parentCommentId) {
          if (showReplyIndex !== comment._id) {
            if (list.length > 1) {
              replyShowControlElement = (
                <span>
                  <Button
                    mode="flat" design="" type=""
                    onClick={() => {
                      setShowReplyIndex(comment._id);
                      setSelectedCommentId(comment._id);
                      // setYOffsetValue(window.pageYOffset);
                    }}
                  >
                    {/* Show Reply */}
                    {t('comment.text4')}
                  </Button>
                  <span>
                    {/* total: {list.length - 1} */}
                    {t('comment.text5')}: {list.length - 1}
                  </span>

                </span>
              );
            } else {
              if (props.isAuth) {
                replyShowControlElement = (
                  <span>
                    <Button
                      mode="flat" design="" type=""
                      onClick={() => {
                        setSelectedCommentId(comment._id);
                        setShowReplyIndex(comment._id);
                        // setYOffsetValue(window.pageYOffset);
                      }}
                    >
                      {/* Write Reply */}
                      {t('comment.text6')}
                    </Button>
                  </span>
                );
              }
            }
          } else {
            replyShowControlElement = (
              <span>
                <Button
                  mode="flat" design="" type=""
                  onClick={() => {
                    setShowReplyIndex(null);
                    setSelectedCommentId(null);
                    // setYOffsetValue(window.pageYOffset);
                  }}
                >
                  {/* Hide Reply */}
                  {t('comment.text7')}
                </Button>
              </span>
            );
          }
        }




        //// display comment
        if (!comment.parentCommentId) {

          let replyInputElement;
          if (props.isAuth && showReplyIndex && showReplyIndex === comment._id) {
            replyInputElement = (
              <PostCommentListReplyInput
                replyInput={props.replyInput}
                commentLoading={props.commentLoading}
                getReplyInputHandler={props.getReplyInputHandler}
                replyInputChangeHandler={props.replyInputChangeHandler}
                commentParam={commentParam}
                commentPostHandler={props.commentPostHandler}
              />
            );
          }
          // console.log(showReplyIndex);
          return (
            <div key={comment._id} style={{ fontWeight: "" }}>
              
              {/* {parentElement} */}
              <PostCommentListItem 
                comment={comment}
                displayComment={displayComment}
                replyShowControlElement={replyShowControlElement}
                deleteConfirmButtons={deleteConfirmButtons}
                replyInputElement={replyInputElement}
                showDeleteModalHandler={props.showDeleteModalHandler}
                setShowReplyIndex={setShowReplyIndex}
                setSelectedCommentId={setSelectedCommentId}
                createPostCommentUserReactionHandler={props.createPostCommentUserReactionHandler}
                allCommentReactions={props.allCommentReactions}
                isAuth={props.isAuth}
              />


            </div>
          );
        } 
        
        //// display reply comment conditionally
        if (showReplyIndex === comment.parentCommentId) {
          // console.log(showReplyIndex);
          return (
            <div key={comment._id}>

              {/* {replyElement} */}
              <PostCommentListReplyItem 
                comment={comment}
                displayComment={displayComment}
                replyShowControlElement={replyShowControlElement}
                deleteConfirmButtons={deleteConfirmButtons}
                showFullCommentButton={showFullCommentButton}
                showDeleteModalHandler={props.showDeleteModalHandler}
                isAuth={props.isAuth}

                setShowReplyIndex={setShowReplyIndex}
                setSelectedCommentId={setSelectedCommentId}
                allCommentReactions={props.allCommentReactions}
              />
            </div>
          );
        }

        return (<div></div>);
      });

      commentList3.push(listElement);

    });
  }
  console.log('commentList3', commentList3);

  return (
    <div>
      {/* <button onClick={() => {window.scrollTo(0,window.pageYOffset + 20)}}>sc-to</button>
      <button onClick={() => {console.log(window, 'yoffset', window.pageYOffset)}}>pos-pos</button>
      <button onClick={() => {setYOffsetValue(230)}}>to-230</button> */}

      {/* <hr /> */}

      <div>
        {/* Comments */}
        {t('comment.text8')}
      </div>
      <div>
        {/* total: {props.postCommentList.length} */}
        {t('comment.text5')}: {props.postCommentList.length}
      </div>
      <ErrorHandler error={error} onHandle={errorHandler} />

      {!props.isAuth && (
        <div>
          <div>Login to write comment</div>
          <div>
            <a href={authPageLink} >
            <Button
                  mode="raised" type="submit" design="success"
                  // disabled={!props.replyInput || props.commentLoading}
            >
                {/* Login */}
                {t('general.text11')}
              </Button>
            </a>
          </div>
          <div>OR</div>
          <div>
            <a href={authSignupPageLink} >
              <Button
                    mode="raised" type="submit" design="success"
                    // disabled={!props.replyInput || props.commentLoading}
              >
                {/* Signup */}
                {t('general.text12')}
              </Button>
            </a>
          </div>
        </div>
      )}

      {props.isAuth ?
        <PostCommentListInput
          getInputHandler={props.getInputHandler}
          commentInputChangeHandler={props.commentInputChangeHandler}
          commentInput={props.commentInput}
          commentLoading={props.commentLoading}
          setSelectedCommentId={setSelectedCommentId}
          commentPostHandler={props.commentPostHandler}
        />
          : null
        }

      {props.commentLoading && !selectedCommentId ?
        <div className="comment__loader">
          <Loader />
        </div>
        : null
      }

      <div>
        {commentList3}
        {deleteModal}
      </div>
    </div>
  )
};

export default PostCommentList;
