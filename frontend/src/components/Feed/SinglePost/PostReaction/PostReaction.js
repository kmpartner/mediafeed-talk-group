import React from 'react';
import { useEffect, useState } from 'react';

import Loader from '../../../Loader/Loader';

import {
  createPostUserReaction,
  deletePostUserReaction,
  getPostUserReaction,
} from '../../../../util/userReaction';

import { BASE_URL, GQL_URL } from '../../../../App';

import './PostReaction.css';

const PostResponse = (props) => {

  const [likeReactionNum, setLikeReactionNum] = useState('');
  const [isUserLike, setIsUserLike] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getPostReactionHandler('like');
  }, []);

  const createPostReactionHandler = (type) => {
      if (!isUserLike) {
        setIsLoading(true);
  
        createPostUserReaction(
          BASE_URL,
          localStorage.getItem('token'),
          props.userId,
          type,
          props.postId,
        )
          .then(result => {
            console.log(result);
            getPostReactionHandler(type);
            setIsLoading(false);
          })
          .catch(err => {
            console.log(err);
            setIsLoading(false);
          });
      }

  };

  const deletePostReactionHandler = (type) => {
    if (props.isAuth && isUserLike) {
      setIsLoading(true);

      deletePostUserReaction(
        BASE_URL,
        localStorage.getItem('token'),
        props.userId,
        type,
        props.postId,
      )
        .then(result => {
          console.log(result);
          getPostReactionHandler(type);
          setIsLoading(false);
        })
        .catch(err => {
          console.log(err);
          setIsLoading(false);
        });
    }
  };

  const getPostReactionHandler = (type) => {
    setIsLoading(true);

    getPostUserReaction(
      BASE_URL,
      localStorage.getItem('token'),
      props.userId,
      type,
      props.postId,
    )
      .then(result => {
        console.log(result);
        // console.log(result.data.length);
        if (type === 'like') {
          setLikeReactionNum(result.data.length);

          const isUserInLikelist = result.data.find(element => {
            // console.log(element);
            return element.userId === props.userId;
          });
          // console.log(isUserInLikelist, props.userId);
          if (isUserInLikelist) {
            setIsUserLike(true);
          } else {
            setIsUserLike(false);
          }
        }

        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  };

  let postReactionBody;

  if (isLoading) {
    postReactionBody = (
      <span><Loader loaderStyle="loaderSmall" /></span>
    );
  }
  if (!isLoading) {
    postReactionBody = (
      <div>
        <span className="post-reaction__reactionButton"
          onClick={() => { createPostReactionHandler('like') }}
        >
          Like &#128077; {likeReactionNum} {isUserLike && '(already liked)'}
        </span>

        {/* {isUserLike ? <div>
          <div>
            you added like to this post
        </div>
          <div
            className="post-reaction__reactionButton"
            onClick={() => { deletePostReactionHandler('like') }}
          >
            delete like
        </div>
        </div>
          : null
        } */}
      </div>

    );
  }

  return (
    <div>
      {postReactionBody}
    </div>
  );
}

export default PostResponse;