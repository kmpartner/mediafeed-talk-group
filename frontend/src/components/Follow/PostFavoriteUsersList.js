import React from 'react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next/hooks';

import Button from '../Button/Button';
import ErrorHandler from '../ErrorHandler/ErrorHandler';
import Loader from '../Loader/Loader';

import './Follow.css'

import SampleImage from '../Image/person-icon-50.jpg';

const PostFavoriteUsersList = props => {
  console.log('FollowUsersListjs-props', props);

  const { favoriteUsers, getFavoriteUsers } = props;

  const [t] = useTranslation('translation');

  // const [favoriteUsers, setFavoriteUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showUsers, setShowUsers] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    getFavoriteUsers(props.postId)
      .then(res => {
        console.log(res);
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  }, []);

  // const getPostFavoriteUserListHandler = () => {
  //   setIsLoading(true);

  //   const postId = props.postId;
  //   getPostFavoriteUserList(BASE_URL, postId)
  //     .then(result => {
  //       console.log(result);
  //       setFavoriteUsers(result.data.favoritedByList);

  //       // setIsGetList(true);
  //       setIsLoading(false);
  //     })
  //     .catch(err => {
  //       console.log(err);
  //       // catchError(err);
  //       setIsLoading(false);
  //     });
  // }

  const showUsersHandler = () => {
    setShowUsers(!showUsers);
  };

  const catchError = error => {
    setError(error);
  };

  const errorHandler = () => {
    setError(null);
  };

  let favoriteUsersList;

  if (favoriteUsers.length === 0) {
      favoriteUsersList = (<div>no users</div>);
    } else {
      favoriteUsersList = favoriteUsers.map(user => {
        return (
          <div key={user.userId}>
            {/* <div onClick={() => {
              props.setSelectedCreatorId(user.userId, user.name);
              props.resetPostPage();
              props.showSmallModalHandler();
            }}>
              {user.name}</div> */}
  
            <div className="post__AuthorElement">
              <span className="post__AuthorImageContainer">
                
                {user.imageUrl ?
                  // <img className="post__AuthorImageElement"
                  //   src={BASE_URL + '/' + user.imageUrl} alt=""
                  // />
                  <img className="post__AuthorImageElement"
                    src={user.imageUrl} alt=""
                  />
                :  
                  <img className="post__AuthorImageElement"
                    src={SampleImage} alt=""
                  />
                }
                
              </span>
              <span className="post__AuthorName">{user.name}</span>
              <span>
                <Button mode="flat" design="" size="smaller" onClick={() => {
                  props.setSelectedCreatorId(user.userId, user.name);
                  props.resetPostPage();
                  props.showSmallModalHandler();
                }}
                >
                  {/* show user posts */}
                  {t('feed.text2')}
                </Button>
              </span>
  
            </div>
          </div>
        );
      });
    }

    if (isLoading) {
      favoriteUsersList = (
        <div className="follow__loader">
          <Loader />
        </div>
      );
    } 

  


  return (
    <div>
      {/* <div>following-users</div> */}
      <div className="follow__FollowUsersTitle" onClick={showUsersHandler}>
        {/* Post Favorite Users &#9662; */}
        {t('follow.text7')} &#9662;
      </div>
      {/* <div>follow-users-list-test</div> */}

      {showUsers ? favoriteUsersList : null}
    </div>
  )
};

export default PostFavoriteUsersList;