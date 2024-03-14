import React from 'react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next/hooks';
import Img from "react-cool-img";

import i18n from '../../i18n';
import Input from '../../components/Form/Input/Input';
import InputEmoji from '../../components/Form/Input/InputEmoji';
import Button from '../../components/Button/Button';
import DarkModeToggle from '../../components/DarkModeToggle/DarkModeToggle';
import ErrorHandler from '../../components/ErrorHandler/ErrorHandler';
import FollowUsersList from '../../components/Follow/FollowUsersList';
import Loader from '../../components/Loader/Loader';
import UserImageUpload from './UserImageUpload';
import UserModalContents from '../../components/Modal/UserModalContents';
import LanguageList from '../../translation/LanguageList';
import { resources } from '../../translation/translation';
import SmallModal from '../../components/Modal/SmallModal';
import TransBackdrop from '../../components/Backdrop/TransBackdrop';
import PushNotificationControl from '../../components/PushNotification/PushNotificationControl';

import { useStore } from '../../hook-store/store';
import {
  getUserData,
  getUserLocation,
  updateUserName,
  updateUserDescription,
  getFollowingUsers,
  getUsers
} from '../../util/user';
import { getFollowedUserList } from '../../util/follow'
import {
  BASE_URL,
  USERACCOUNTPAGE_URL,
  // GQL_URL,
} from '../../App'

import { marks } from '../../images/marks';
import './UserInfo.css';


import SampleImage from '../../components/Image/person-icon-50.jpg';

const UserInfo = props => {
  console.log('userinfo-props', props);

  const selectedLanguage = resources[i18n.language].translation.LANGUAGE;

  const [t] = useTranslation('translation');

  const [store, dispatch] = useStore();
  const { userNameData } = store;

  const [showSmallModal, setShowSmallModal] = useState(false);
  const [followingUsers, setFollowingUsers] = useState([]);
  const [showFollowingUsers, setShowFollowingUsers] = useState(false);
  const [followedByUserList, setFollowedByUserList] = useState([]);
  const [showFollowedByUserList, setShowFollowedByUserList] = useState(false);
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [userImageUrl, setUserImageUrl] = useState('');
  const [userCreationDate, setUserCreationDate] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [isNameUpdate, setIsNameUpdate] = useState(false);
  const [userDescription, setUserDescription] = useState('');
  const [descriptionInput, setDescriptionInput] = useState('');
  const [isDescriptionUpdate, setIsDescriptionUpdate] = useState(false);
  const [showUserDescription, setShowUserDescription] = useState(false);
  const [isImageUpdate, setIsImageUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedUserName, setSelectedUserName] = useState('');
  const [selectedUserImageUrl, setSelectedUserImageUrl] = useState('');
  const [darkMode, setDarkMode] = useState();
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  // const [selectedLanguageName, setSelectedLanguageName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'User information page';
  },[]);
  
  useEffect(() => {
    console.log('in useeffect in userinofo.js');
    setIsLoading(true);

    getUserData(BASE_URL, props.token)
      .then(result => {
        console.log(result);
        userInfoSet(result.userData);

        setIsLoading(false);

        props.userInfoAction(result.userData);
      })
      .catch(err => {
        console.log(err);
        // catchError(err);
      })
  }, [userName, userImageUrl, userDescription]);

  useEffect(() => {
    updateLocationHandler();
    // getFollowedUserListHandler();
  }, []);

  const userInfoSet = (userInfo) => {
    setUserId(userInfo._id);
    setUserName(userInfo.name);
    setNameInput(userInfo.name);

    setUserImageUrl(userInfo.imageUrl);
    setUserCreationDate(userInfo.createdAt);

    setUserDescription(userInfo.description);
    setDescriptionInput(userInfo.description);
  }

  const nameInputChangeHandler = (input, value) => {
    setNameInput(value);
  }

  const descriptionInputChangeHandler = (input, value) => {
    setDescriptionInput(value);
    // console.log(descriptionInput.length)
  }

  const getNewImageUrl = (imageUrl) => {
    console.log('getNewImageUrl')
    setUserImageUrl(imageUrl);
  }

  const hideImageUpdateButton = () => {
    setIsImageUpdate(false);
  }

  const catchError = error => {
    setError(error);
  };

  const errorHandler = () => {
    setError(null);
  };

  const updateLocationHandler = () => {
    getUserLocation()
      .then(result => {
        console.log(result);
        // const locationData = result.data;

        // return updateUserLocation('', locationData, BASE_URL, props.token)
        //   .then(res => {
        //     console.log(res)
        //   })
        //   .catch(err => {
        //     console.log(err);
        //     catchError(err);
        //   });

      })
      .catch(err => {
        console.log(err);
        catchError(err);
      });
  }

  const updateUserNameHandler = (name) => {
    setIsLoading(true);
    updateUserName(name, BASE_URL, props.token)
      .then(result => {
        console.log(result);
        setUserName(result.data.data.user.name);
        localStorage.setItem('name', result.data.data.user.name);

        setIsNameUpdate(false);
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
        setIsNameUpdate(false);
        setIsLoading(false);
        catchError(err);
      })
  }

  const updateUserDescriptionHandler = (description) => {
    setIsLoading(true);
    updateUserDescription(description, BASE_URL, props.token)
      .then(result => {
        console.log(result);
        setUserDescription(result.data.data.user.description);
        // localStorage.setItem('name', result.data.data.user.);

        setIsDescriptionUpdate(false);
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
        setIsDescriptionUpdate(false);
        setIsLoading(false);
        catchError(err);
      })
  }

  const setShowUserDescriptionHandler = () => {
    setShowUserDescription(!showUserDescription);
  };

  const moveTestHandler = () => {
    localStorage.setItem('tempUserName', userName);

    // props.history.replace('/');
    props.history.push(`/feed/userposts/${userId}`);
  };

  const selectUserHandler = (userObj) => {
    setSelectedUserId(userObj.userId);
    setSelectedUserName(userObj.name);
    setSelectedUserImageUrl(userObj.imageUrl);
    setShowSmallModal(!showSmallModal);
  };

  const showSelectedUserPosts = (uid, uName) => {
    localStorage.setItem('tempUserName', uName);

    // props.history.replace('/');
    props.history.push(`/feed/userposts/${uid}`);
  }

  const getFollowingUsersHandler = () => {

    if (!showFollowingUsers) {
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
        setIsLoading(false);
      });
    }

    setShowFollowingUsers(!showFollowingUsers);
  }

  const showSmallModalHandler = () => {
    setShowSmallModal(!showSmallModal);
  };

  const showLanguageModalHandler = () => {
    setShowLanguageModal(!showLanguageModal);
  };

  // const getLanguageNameHandler = (name) => {
  //   setSelectedLanguageName(name);
  // }

  const setDarkModeHandler = (darkModeInput) => {
    setDarkMode(darkModeInput)
  };

  const getFollowedUserListHandler = () => {
    // getUsers(BASE_URL, props.token)
    if (!showFollowedByUserList) {
      setIsLoading(true);
      getFollowedUserList(BASE_URL, localStorage.getItem('token'), userId)
      .then(result => {
        console.log(result);
        setIsLoading(false);
        setFollowedByUserList(result.data.followedByList);
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      })
    }

    setShowFollowedByUserList(!showFollowedByUserList);
  }

  const usersModalBody = (
    <div>
      <TransBackdrop onClick={showSmallModalHandler} />
      <SmallModal style="modal2">
        <UserModalContents
          // {...props}
          postCreatorUserId={selectedUserId} 
          author={selectedUserName}
          creatorImageUrl={selectedUserImageUrl}
          setSelectedCreatorId={showSelectedUserPosts}
          resetPostPage={() => {}}
          showSmallModalHandler={showSmallModalHandler}
        />
      </SmallModal>
    </div>
  );

  const languageModalBody = (
    <div>
    <TransBackdrop onClick={showLanguageModalHandler} />
    <SmallModal style="languageModal">
      <div className="userInfo__closeModalButton"
      onClick={showLanguageModalHandler}
      >
        X
      </div>
      <LanguageList 
        showLanguageModalHandler={showLanguageModalHandler}
        // getLanguageNameHandler={getLanguageNameHandler}
        // i18n={props.i18n}
      />
    </SmallModal>
  </div>
  );

  const followingUsersBody = followingUsers.map(user => {
    return (
   
        <div key={user.userId}>
          <span onClick={() => { 
            selectUserHandler(user);
            }}
          >
            {user.name}
          </span>
          {/* <button onClick={() => {
            showSelectedUserPosts(user.userId, user.name);
            }}
          >
            user-posts
          </button> */}
        </div>
      
    );
    });

    // const followedByUsersBody = followedByUserList.map(user => {
    //   return (
     
    //       <div key={user.userId}>
    //         <span onClick={() => { 
    //           selectUserHandler(user);
    //           }}
    //         >
    //           {user.name}
    //         </span>
    //         {/* <button onClick={() => {
    //           showSelectedUserPosts(user.userId, user.name);
    //           }}
    //         >
    //           user-posts
    //         </button> */}
    //       </div>
        
    //   );
    //   });


  let body;
  if (isLoading) {
    body = (
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <Loader />
      </div>
    );
  } else {
    body = (
      <div>
        <div className="userInfo__infoContent">
          <span>
            {t('userInfo.text2', 'name')}:
            </span>
          <span className="userInfo__userImage">
            {!userNameData && (
                <span>{userName}</span>
            )} 

            {userNameData && (
              <span>
                <span>
                  {userNameData.name}
                </span>
                {/* <a
                  href={`${USERACCOUNTPAGE_URL}?tokenForCasTGT=${localStorage.getItem('tokenForCasTGT')}&TGTexp=${localStorage.getItem('TGTexp')}`}
                  target="_blank" rel="noopener noreferrer"
                >
                  <Button mode="flat" type="submit"
                    title={'go to user account page for update'}
                  >
                    {t('general.text5', '(edit)')} {marks.externalLinkMark}
                  </Button>
                </a> */}
              </span>
            )} 
          </span>
        </div>
        
        {/* <div>
          {isNameUpdate ?
            <section>
              <Input
                type="text"
                placeholder="Name, less than 20 characters..."
                // placeholder={t('userInfo.text6')}
                control="input"
                onChange={nameInputChangeHandler}
                value={nameInput}
              />
              <div className="userInfo__actions">

                <Button
                  mode="raised" type="submit"
                  disabled={!nameInput || !nameInput.trim() || nameInput.length > 20}
                  onClick={() => { updateUserNameHandler(nameInput) }}
                >
                  {t('general.text6', 'Update')}
                </Button>
              </div>

            </section>
            : null
          }
        </div> */}

        {userNameData && (
          <div className="userInfo__infoContent">
            <span>
              {t('userInfo.text3', 'image')}:
            </span>

            {userNameData.imageUrl && (
              <Img className="userInfo__userImageFile" 
                src={userNameData.imageUrl}
                alt="" // height="25" 
              />
            )}
            {!userNameData.imageUrl && (
              <Img className="userInfo__userImage" 
                src={SampleImage}
                alt="" height="25" 
              />
            )}

            {/* <a
              href={`${USERACCOUNTPAGE_URL}?tokenForCasTGT=${localStorage.getItem('tokenForCasTGT')}&TGTexp=${localStorage.getItem('TGTexp')}`}
              target="_blank" rel="noopener noreferrer"
            >
              <Button mode="flat" type="submit"
                title={'go to user account page for update'}
              >
                {t('general.text5', '(edit)')} {marks.externalLinkMark}
              </Button>
            </a> */}
          </div>
        )}

        {/* <div className="userInfo__infoContent">
          <span>
            {t('userInfo.text3', 'image')}:
          </span>
          <span>
            {userImageUrl
              ? (
                  <Img className="userInfo__userImageFile" 
                    src={userImageUrl}
                    // src={userImageUrl && userImageUrl.startsWith('https://') ? userImageUrl : BASE_URL + '/' + userImageUrl}
                    alt="" 
                    // height="25" 
                  />
                )
              : (
                  <Img className="userInfo__userImage" 
                    src={SampleImage}
                    alt="" height="25" 
                  />
                )
            }
          </span>
        </div>

        <div>
          {isImageUpdate ?
            <div className="userInfo__editText">
              <UserImageUpload
                userId={props.userId}
                token={props.token}
                isAuth={props.isAuth}
                userImageUrl={userImageUrl}
                getNewImageUrl={getNewImageUrl}
                hideImageUpdateButton={hideImageUpdateButton}
              />
            </div>
            : null}
        </div> */}


        <div className="userInfo__infoContent">
          <span>
            {/* About User: */}
            {t('userInfo.text9')}:
            </span>
          <span className="userInfo__userDescription">
            {userDescription && userDescription.length > 50 ? 
                <span onClick={setShowUserDescriptionHandler} >
                  {userDescription.slice(0,50)}... &#9662;
                </span> 
              : userDescription
            }
          </span>
          <span className="userInfo__editText" onClick={() => { setIsDescriptionUpdate(!isDescriptionUpdate) }}>
            <Button mode="flat" type="submit">
              {/* (edit) */}
              ({t('general.text5')})
          </Button></span>
        </div>

        {showUserDescription ? 
          <div className="userInfo__infoContent">{userDescription}</div>
        : null
        }

        <div>
          {isDescriptionUpdate ?
            <section>
              <Input
                type="text"
                // placeholder="additional information about you, description bio etc... (less than 300 characters)"
                placeholder={t('userInfo.text10')}
                // control="input"
                control="textarea"
                rows="4"
                onChange={descriptionInputChangeHandler}
                value={descriptionInput}
              />

              {descriptionInput ? descriptionInput.length : null}

              <div className="userInfo__actions">

                <Button
                  mode="raised" type="submit"
                  disabled={descriptionInput ? descriptionInput.length > 300 : null}
                  onClick={() => { updateUserDescriptionHandler(descriptionInput) }}
                >
                  {/* Update */}
                  {t('general.text6')}
                </Button>
              </div>

            </section>
            : null
          }
        </div>

        <div className="userInfo__infoContent">
          <span>
            {/* creation date:  */}
            {t('userInfo.text4')}:
          </span>
          <span className="userInfo__userImage">
            {userCreationDate ? userCreationDate.split('T')[0] : null}
          </span>
        </div>

        <div className="userInfo__infoContent">
          <PushNotificationControl {...props}  isAuth={props.isAuth} />
        </div>
        
        <div className="userInfo__infoContent">
          <DarkModeToggle 
            setDarkMode={setDarkModeHandler}
          />
        </div>

        <div className="userInfo__infoContent">
          <span>
            {/* Language: */}
            {t('userInfo.text11')}:
          </span>
          <span className="userInfo__infoContent">{selectedLanguage}</span>

          <div className="userInfo__actions">
            <Button
              mode="flat" type="submit"
              disabled={descriptionInput ? descriptionInput.length > 300 : null}
              onClick={showLanguageModalHandler}
            >
              {/* (change) */}
              ({t('userInfo.text12')})
            </Button>
          </div>

          {showLanguageModal ? languageModalBody : null}
        </div>

        {/* <button onClick={moveTestHandler}>move-test</button> */}
        {/* <div onClick={getFollowingUsersHandler}>following-users-test</div>
        {showFollowingUsers ? followingUsersBody : null} */}

        <div className="userInfo__infoContent">
          <FollowUsersList 
            setSelectedCreatorId={showSelectedUserPosts}
            resetPostPage={() => {}}
            showSmallModalHandler={showSmallModalHandler}
          /> 
        </div>
        
        {/* <button onClick={showSmallModalHandler}>modal-test</button> */}
        {showSmallModal ? usersModalBody : null}

      </div>
    );
  }

  return (
    <div>
      <ErrorHandler error={error} onHandle={errorHandler} />

        <div>
          {/* User Information */}
          {t('userInfo.text1')}
          {body}
        </div>
 

      {/* <img src={SampleImage}></img> */}

 
      {/* <div>followed-by-users-test</div>
      <button onClick={getFollowedUserListHandler}>test-followed</button>
      {showFollowedByUserList ? 
        <div>
          {followedByUserList.length}
          {followedByUsersBody}
        </div> 
      : null
      } */}

    <div>

    </div>
    </div>
  );
}

export default UserInfo;