import React from 'react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next/hooks';

import AutoSuggestUser from '../AutoSuggest/AutoSuggestUser';
import Button from '../Button/Button';
import ErrorHandler from '../ErrorHandler/ErrorHandler';
import Loader from '../Loader/Loader';
import { 
  // getUsers, 
  // addFollowingUser, 
  // deleteFollowingUser,
  getFollowingUsers,
  // getFollowingUser,
} from '../../util/user';
import { updateLsNameDataList } from '../../util/user-name-data/user-name-data-util';
// import { useStore } from '../../hook-store/store';
import { BASE_URL, GQL_URL } from '../../App';
import './Follow.css'

import SampleImage from '../Image/person-icon-50.jpg';

const FollowUsersList = props => {
  console.log('FollowUsersListjs-props', props);

  // const { followingUsers } = props;
  const lsUserId = localStorage.getItem('userId');

  const [t] = useTranslation('translation');

  // const [store, dispatch] = useStore();
  // console.log('store in FollowUsersList.js', store);

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
    if (lsUserId) {
      const lsFollowingUsers = localStorage.getItem('followingUsers');
      
      if (lsFollowingUsers) {
        const parsedData = JSON.parse(lsFollowingUsers);
  
        if (
          (parsedData.userId && parsedData.userId !== lsUserId) ||
          parsedData.getDate < Date.now() - 1000 * 60 * 60 * 24
        ) {
          retrieveFollowingUsers();
        } else {
          setFollowingUsers(parsedData.data);
        }
      } else {
        retrieveFollowingUsers();
      }
    } else {
      localStorage.removeItem('followingUsers');
    }
  };

  const retrieveFollowingUsers = () => {
    setIsLoading(true);
    
    getFollowingUsers(
      lsUserId,
      BASE_URL, 
      localStorage.getItem('token')
    )
    .then(result => {
      console.log(result);
      setFollowingUsers(result.data);

      localStorage.setItem(
        'followingUsers', 
        JSON.stringify({
          userId: lsUserId,
          getDate: Date.now(),
          data: result.data
        })
      );

      if (result.userNameDataList?.length > 0) {
        updateLsNameDataList(result.userNameDataList, null);
      }

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
      // props.getFollowIdsHandler();
      getFollowUsersHandler();
    }
    
    setShowUsers(!showUsers);
  };


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
      
      const lsNameDataList = localStorage.getItem('lsNameDataList');

      followingUsersBody = followingUsers.map(user => {
        
        let nameData;

        if (lsNameDataList && JSON.parse(lsNameDataList).length > 0) {
          nameData = JSON.parse(lsNameDataList).find(element => {
            return element.userId === user.userId;
          });
        }

        // console.log(user, nameData);
        
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

                {/* {user.imageUrl ?
                  <img className="post__AuthorImageElement"
                    src={user.imageUrl} alt=""
                  />
                :  
                  <img className="post__AuthorImageElement"
                    src={SampleImage} alt=""
                  />
                } */}
                {nameData?.imageUrl && (
                  <img className="post__AuthorImageElement"
                    // style={{height: "1rem", width: "1rem", objectFit: "cover"}}
                    src={nameData.imageUrl} 
                  />
                )}
                {!nameData?.imageUrl && (
                  <img className="post__AuthorImageElement"
                    src={SampleImage} alt=""
                  />
                )}
                
              </span>
              <span className="post__AuthorName">
                {/* {user.name} */}
                {nameData && (
                  <span>{nameData.name}</span>
                )}
              </span>
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