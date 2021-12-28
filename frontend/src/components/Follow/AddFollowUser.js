import React from 'react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next/hooks';

import AutoSuggestUser from '../AutoSuggest/AutoSuggestUser';
import Button from '../Button/Button';
import ErrorHandler from '../ErrorHandler/ErrorHandler';

import Loader from '../Loader/Loader';
import { 
  getUsers, 
  addFollowingUserId, 
  deleteFollowingUserId,
  getFollowingUsers,
  getFollowingUser,
} from '../../util/user';
import { BASE_URL } from '../../App';

const FollowUser = props => {
  console.log('FollowUserjs-props', props);

  const [t] = useTranslation('translation');

  // const [userList, setUserList] = useState([]);
  // const [searchSelectedUser, setSearchSelectedUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getFollowUserHandler();
      
  },[]);

  const getFollowIdsHandler = () => {
    setIsLoading(true);

    getFollowingUsers(
      localStorage.getItem('userId'), 
      BASE_URL, 
      localStorage.getItem('token')
    )
    .then(result => {
      console.log(result);
      setIsLoading(false);
    })
    .catch(err => {
      console.log(err);
      catchError(err);
      setIsLoading(false);
    });
  };

  const getFollowUserHandler = () => {
    setIsLoading(true);

    getFollowingUser(
      localStorage.getItem('userId'), 
      props.postCreatorUserId,
      BASE_URL, 
      localStorage.getItem('token')
    )
    .then(result => {
      console.log(result);
      setIsLoading(false);
      setIsFollowing(true);
    })
    .catch(err => {
      console.log(err);
      // catchError(err);
      setIsLoading(false);
    });
  };

  const addFollowIdHandler = () => {
    setIsLoading(true);

    addFollowingUserId(
      localStorage.getItem('userId'), 
      props.postCreatorUserId, 
      BASE_URL, 
      localStorage.getItem('token')
    )    
    .then(result => {
      console.log(result);
      setIsLoading(false);
      setIsFollowing(true);
    })
    .catch(err => {
      console.log(err);
      catchError(err);
      setIsLoading(false);
    });
  };

  const deleteFollowIdHandler = () => {
    setIsLoading(true);

    deleteFollowingUserId(
      localStorage.getItem('userId'), 
      props.postCreatorUserId, 
      BASE_URL, 
      localStorage.getItem('token')
    )
    .then(result => {
      console.log(result);
      setIsLoading(false);
      setIsFollowing(false);
    })
    .catch(err => {
      console.log(err);
      catchError(err);
      setIsLoading(false);
    });
  };

  const catchError = error => {
    setError(error);
  };

  const errorHandler = () => {
    setError(null);
  };

  let body;
  if (isLoading) {
    body = (
        <div className="follow__loader">
          <Loader />
        </div>
    );
  } else {
    body = (
      <div>
      <ErrorHandler error={error} onHandle={errorHandler} />
      
        {/* <div>
          {!isLoading && isFollowing && 
            props.postCreatorUserId !== localStorage.getItem('userId') ? 
            'following-indicate-test' 
          : 'not-follow'
          }
        </div> */}
      
        <div className="post__FavoriteButton">

          {!isLoading && !isFollowing && 
            props.postCreatorUserId !== localStorage.getItem('userId') ?
          <Button design='flat' mode='' size='smaller' onClick={addFollowIdHandler}>
            {/* Add to favorite user */}
            {t('follow.text3')}
          </Button>
          : null
          }
          {!isLoading && isFollowing && 
            props.postCreatorUserId !== localStorage.getItem('userId') ?
            <Button design='flat' mode='danger' size='smaller' onClick={deleteFollowIdHandler}>
              {/* Delete from favorite user */}
              {t('follow.text4')}
            </Button>
          : null
          }
        
        </div>

    </div>
    );
  }

  return (
    <div>
      {body}
    </div>
  )
};

export default FollowUser;