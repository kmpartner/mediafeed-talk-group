import React from 'react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next/hooks';

import Button from '../../components/Button/Button'
import Loader from '../Loader/Loader';
import {
  getUserLocation,
  addFavoritePost,
  deleteFavoritePost,
  getFavoritePosts,
  getFavoritePost
} from '../../util/user';
import { addLsFavoritePost, deleteLsFavoritePost } from '../../util/feed/favorite-post'

import { BASE_URL, GQL_URL } from '../../App';

const AddFavoritePost = props => {
  console.log('addFavoritePost-props', props);

  const [t] = useTranslation('translation');

  const [isLoading, setIsLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('userId')) {
      getFavoritePostHandler();
    }
  },[]);

  const getFavoritePostHandler = () => {
    // this.setState({ isLoading: true });
    setIsLoading(true);

    getFavoritePost(
      props.postId,
      localStorage.getItem('userId'),
      BASE_URL,
      // props.token
      localStorage.getItem('token')
    )
      .then(result => {
        console.log(result);
        setIsFavorite(true);
        setIsLoading(false);


      })
      .catch(err => {
        console.log(err);
        // catchError(err);
        setIsLoading(false);
      });
  }

  const addFavoritePostHandler = () => {
    setIsLoading(true);

    addFavoritePost(
      props.postId,
      localStorage.getItem('userId'),
      BASE_URL,
      props.token
    )
      .then(result => {
        console.log(result);
        setIsFavorite(true);
        setIsLoading(false);

        // addLsFavoritePost(props.postData, localStorage.getItem('userId'))
        return getFavoritePosts(
          localStorage.getItem('userId'),
          BASE_URL,
          props.token 
        );
      })
      .catch(err => {
        console.log(err);
        // this.catchError(err);
        setIsLoading(false);
      })
  }

  const deleteFavoritePostHandler = () => {
    setIsLoading(true);

    deleteFavoritePost(
      props.postId,
      localStorage.getItem('userId'),
      BASE_URL,
      props.token
    )
      .then(result => {
        console.log(result);
        setIsFavorite(false);
        setIsLoading(false);

        // deleteLsFavoritePost(props.postId);
        return getFavoritePosts(
          localStorage.getItem('userId'),
          BASE_URL,
          props.token 
        );
      })
      .catch(err => {
        console.log(err);
        // this.catchError(err);
        setIsLoading(false);
      })

  }

  return (
    <div>
      {/* {isFavorite ? 'favorite' : 'not-favorite'} */}
            <div className="single-post__FavoriteButton">
              <div className="follow__loader">
                {isLoading ?
                  <Loader />
                : null
                }
              </div>

            <div>
              {localStorage.getItem('userId') &&  !isLoading && !isFavorite ?
                <Button mode="flat" design="" size="smaller" onClick={addFavoritePostHandler}>
                  {/* Add to Favorite Post */}
                  {t('follow.text1')}
                </Button>
              :
              null
              }

              {localStorage.getItem('userId') && !isLoading && isFavorite ?
                <Button mode="flat" design="danger" size="smaller" onClick={deleteFavoritePostHandler}>
                  {/* Delete from favorite post */}
                  {t('follow.text2')}
                </Button>
                :null
              }
            </div>

          </div>
    </div>
  );
}

export default AddFavoritePost;