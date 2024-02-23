import React from 'react';
import { Fragment, useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next/hooks';
import Img from "react-cool-img";

import Button from '../../Button/Button';
import MenuButton from '../MobileToggle/MenuButton';
import MobileToggle from '../MobileToggle/MobileToggle';
import SmallModal from '../../Modal/SmallModal';
import TransBackdrop from '../../Backdrop/TransBackdrop';
import Logo from '../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';
import PageNotification from '../../PageNotification/PageNotification';

import { useStore } from '../../../hook-store/store';
import { getUserData, getUserDataForStore } from '../../../util/user';

import { authSignupPageLink, authPageLink } from '../../../App';
import { GQL_URL, BASE_URL } from '../../../App';

import LoginIcon from '../../../images/icons/loginIcon-48.png';
import SignupIcon from '../../../images/icons/signupIcon-48.png';

import './MainNavigation.css';
import { marks } from '../../../images/marks';

const MainNavigation = props => {
  // console.log('mainNavigation-props', props);

  const currentUrl = new URL(window.location.href);
  const firstPath = currentUrl.pathname.split('/')[1];

  const [t] = useTranslation('translation');

  const [store, dispatch] = useStore();
  const { 
    pageNotification,
  } = store.pageNotificationStore;
  
  const [userData, setUserData] = useState('');
  const [showSmallModal, setShowSmallModal] = useState(false);
  const [showPageNotification, setShowPageNotification] = useState(false);
  const [isPageNotfyOpen, setIsPageNotifyOpen] = useState(false);
  const [newPageNotifyList, setNewpageNotifyList] = useState([]);

  useEffect(() => {
    localStorage.removeItem('directStartEdit');
  },[]);

  useEffect(() => {
    // if (props.isAuth) {
    //   getUserData(GQL_URL, props.token)
    //   .then(res => {
    //     console.log(res);
    //     setUserData(res.userData.data.user);
    //   })
    //   .catch(err => console.log(err))
    // }

    if (props.isAuth && !store.userData) {
      // getUserData(GQL_URL, props.token)
      getUserDataForStore(BASE_URL, props.token)
      .then(res => {
        console.log(res);

        dispatch('SET_USERDATA', res.userData);
        
        setUserData(res.userData);
      })
      .catch(err => console.log(err))
    }
    
    if (props.isAuth && store.userData) {
      setUserData(store.userData);
    }

  },[props.isAuth, props.userUpdateAction]);


  useEffect(() => {
    if (pageNotification) {
      console.log('notify', pageNotification.pageNotificationList.length)
      // setNewPageNotifyListHandler(pageNotification);
    }
  },[pageNotification]);

  const showSmallModalHandler = () => {
    setShowSmallModal(!showSmallModal);
  };

  const directStartEditHandler = () => {
    localStorage.setItem('directStartEdit', 'directStartEdit');
    props.history.push('/feed/posts');
    
  }

  // const setNewPageNotifyListHandler = (pageNotification) => {
  //   // let isNewPageNotifyNum = 0;
  //   if (pageNotification && pageNotification.pageNotificationList && 
  //       pageNotification.pageNotificationList.length > 0
  //   ) {
  //       const newNotifyList = [];
        
  //       for (const notify of pageNotification.pageNotificationList) {
  //         if (notify.creationTime >= pageNotification.lastOpenTime) {
  //           newNotifyList.push(notify);
  //         }
  //       }
  //       // isNewPageNotifyNum = newNotifyList.length;
  //       if (newNotifyList.length > 0) {
  //         setNewpageNotifyList(newNotifyList);
  //       }
  //     }
  // };
  
  let notifyNum = 0;

  if (pageNotification?.pageNotificationList?.length > 0) {
    notifyNum = pageNotification?.pageNotificationList?.length;
  }

  return (
    <Fragment>
      <nav className="main-nav">

        {showSmallModal ? 
          <div>
            <TransBackdrop onClick={showSmallModalHandler} />
            <SmallModal style="createModal">
              {/* <div onClick={showSmallModalHandler}>close-modal</div> */}
              <Button mode="raised" design="accent" 
                onClick={() => {
                  directStartEditHandler();
                  showSmallModalHandler();
                }}
              >
                {/* New Post  */}
                {t('feed.text1')}
              </Button>
            </SmallModal>
          </div>

        : null
        }
        
        <MobileToggle onOpen={props.onOpenMobileNav} />
        <div id="logoid" className="main-nav__logo">
          {/* <NavLink to="/feed/posts">
            <Logo />
          </NavLink> */}
          <Logo />
        </div>

        {props.isAuth ? 
        <span className="main-nav__user">
          {userData.imageUrl ? 
            // <img className="userImage" src={BASE_URL + '/' + userData.imageUrl} alt="" height="25"
            //   onClick={props.onOpenMobileNav}
            // /> 
            // <img className="userImage" src={userData.imageUrl} alt="" height="25"
            // onClick={props.onOpenMobileNav}
            // /> 
            <Img className="main-nav__userImage" 
              src={userData.imageUrl}
              // src={userData.imageUrl && userData.imageUrl.startsWith('https://') ? userData.imageUrl : BASE_URL + '/' + userData.imageUrl}
              alt="" height="25" 
            />
          : <span className="name" onClick={props.onOpenMobileNav}>{userData.name}</span>
          }
        </span>
        : <span>
            {/* <NavLink to="/login">
              <span className="name">
              Login
              {t('nav.text2')}
              </span>
            </NavLink>
            <NavLink to="/signup">
              <span className="name">
              Signup
              {t('nav.text3')}
              </span>
            </NavLink> */}
          </span>
        }

        {/* plus button for create post */}
        {props.isAuth && firstPath === 'feed' ? 
          <span className="createButton"
            onClick={showSmallModalHandler}
          >
            &#43; 
          </span>
        : null
        }
        
        <div className="spacer" />
        {/* <ul className="main-nav__items">
          <NavigationItems isAuth={props.isAuth} onLogout={props.onLogout} />
        </ul> */}

        {!props.isAuth && (
          <a className="navigation-item-mobile-titleContainer"
            href={authPageLink}
          >
            {/* <img className="navigation-item-mobile-titleIcon"
              src={LoginIcon} alt='icon'
            />  */}
            <div className="main-nav__authLink">
              {t('nav.text2', 'Login')}
            </div>
          </a>
        )}
        {!props.isAuth && (
          <a className="navigation-item-mobile-titleContainer"
            href={authSignupPageLink}
          >
            {/* <img className="navigation-item-mobile-titleIcon"
              src={SignupIcon} alt='icon'
            />  */}
            <div className="main-nav__authLink">
              {t('nav.text3', 'Signup')}
            </div>
          </a>
        )}

        {props.isAuth && (
          <span className='main-nav__notify'>
            <span
              onClick={() => {
                setShowPageNotification(!showPageNotification);
                setIsPageNotifyOpen(true);
              }}
            >
              {marks.bellMark}
              {!isPageNotfyOpen && notifyNum > 0 && (
                <span className='main-nav__notifyNum'>
                  {notifyNum > 20 && (
                    <span>20+</span>
                  )}
                  {notifyNum <= 20 && (
                    <span>{notifyNum}</span>
                  )}
                </span>
              )}
            </span>
            {showPageNotification && (
              <PageNotification 
                setShowPageNotification={setShowPageNotification}
              />
            )}
          </span>
        )}

        <MenuButton onOpen={props.onOpenMobileNav} />

      </nav>
    </Fragment>
  );
};

export default MainNavigation;
