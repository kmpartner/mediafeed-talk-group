import React from 'react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next/hooks';

import AutoSuggestUser from '../AutoSuggest/AutoSuggestUser';
import Button from '../Button/Button';
import ErrorHandler from '../ErrorHandler/ErrorHandler';
import Loader from '../Loader/Loader';
import { 
  // getUsers, 
  addFollowingUser, 
  deleteFollowingUser,
  getFollowingUsers,
  getFollowingUser,
} from '../../util/user';
import { BASE_URL, GQL_URL } from '../../App';
import './Follow.css'

import SampleImage from '../Image/person-icon-50.jpg';

const FollowUsersList = props => {
  console.log('FollowUsersListjs-props', props);

  const [t] = useTranslation('translation');

  // const [userList, setUserList] = useState([]);
  // const [searchSelectedUser, setSearchSelectedUser] = useState(null);
  const [followingUsers, setFollowingUsers] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showUsers, setShowUsers] = useState(false);

  useEffect(() => {
    // getFollowUsersHandler();
  },[]);

  const getFollowUsersHandler = () => {
    setIsLoading(true);

    getFollowingUsers(
      localStorage.getItem('userId'),
      BASE_URL, 
      localStorage.getItem('token')
    )
    .then(result => {
      console.log(result);
      setFollowingUsers(result.data);
      setIsLoading(false);
    })
    .catch(err => {
      console.log(err);
      // catchError(err);
      setIsLoading(false);
    });
  };

  const showUsersHandler = () => {
    if(!showUsers) {
      getFollowUsersHandler();
    }
    
    setShowUsers(!showUsers);
  };

  // const getFollowUserHandler = () => {
  //   setIsLoading(true);

  //   getFollowingUser(
  //     props.postCreator_id,
  //     GQL_URL, 
  //     localStorage.getItem('token')
  //   )
  //   .then(result => {
  //     console.log(result);
  //     setIsLoading(false);
  //     setIsFollowing(true);
  //   })
  //   .catch(err => {
  //     console.log(err);
  //     // catchError(err);
  //     setIsLoading(false);
  //   });
  // };

  // const addFollowIdHandler = () => {
  //   setIsLoading(true);

  //   addFollowingUser(
  //     localStorage.getItem('userId'), 
  //     props.postCreator_id, 
  //     GQL_URL, 
  //     localStorage.getItem('token')
  //   )    
  //   .then(result => {
  //     console.log(result);
  //     setIsFollowing(true);
  //     setIsLoading(false);
  //   })
  //   .catch(err => {
  //     console.log(err);
  //     catchError(err);
  //     setIsLoading(false);
  //   });
  // };

  // const deleteFollowIdHandler = () => {
  //   setIsLoading(true);

  //   deleteFollowingUser(
  //     localStorage.getItem('userId'), 
  //     props.postCreator_id, 
  //     GQL_URL, 
  //     localStorage.getItem('token')
  //   )
  //   .then(result => {
  //     console.log(result);
  //     setIsFollowing(false);
  //     setIsLoading(false);
  //   })
  //   .catch(err => {
  //     console.log(err);
  //     catchError(err);
  //     setIsLoading(false);
  //   });
  // };

  const catchError = error => {
    setError(error);
  };

  const errorHandler = () => {
    setError(null);
  };

  let followingUsersBody;
  if (isLoading) {
    followingUsersBody = (
      <div className="follow__loader">
        <Loader />
      </div>
    );
  } else {
    if (followingUsers.length === 0) {
      followingUsersBody = (<div>no users</div>);
    } else {
      followingUsersBody = followingUsers.map(user => {
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

  }


  return (
    <div>
      {/* <div>following-users</div> */}
      <div className="follow__FollowUsersTitle" onClick={showUsersHandler}>
        {/* Your Favorite Users &#9662; */}
        {t('follow.text6')} &#9662;
      </div>
      {/* <div>follow-users-list-test</div> */}

      {showUsers ? followingUsersBody : null}
    </div>
  )
};

export default FollowUsersList;