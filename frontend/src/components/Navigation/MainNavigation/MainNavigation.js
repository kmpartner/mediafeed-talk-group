import React from 'react';
import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next/hooks';
import Img from "react-cool-img";

import Button from '../../Button/Button';
import MobileToggle from '../MobileToggle/MobileToggle';
import SmallModal from '../../Modal/SmallModal';
import TransBackdrop from '../../Backdrop/TransBackdrop';
import Logo from '../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';
import { getUserData, getUserDataForStore } from '../../../util/user';
import { useStore } from '../../../hook-store/store';

import { GQL_URL, BASE_URL } from '../../../App';
import './MainNavigation.css';

const mainNavigation = props => {
  // console.log('mainNavigation-props', props);

  const currentUrl = new URL(window.location.href);
  const firstPath = currentUrl.pathname.split('/')[1];

  const [t] = useTranslation('translation');

  const [store, dispatch] = useStore();
  
  const [userData, setUserData] = useState('');
  const [showSmallModal, setShowSmallModal] = useState(false);

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

  const showSmallModalHandler = () => {
    setShowSmallModal(!showSmallModal);
  };

  const directStartEditHandler = () => {
    localStorage.setItem('directStartEdit', 'directStartEdit');
    props.history.push('/feed/posts');
    
  }

  return <nav className="main-nav">

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
    <div className="main-nav__logo">
      {/* <NavLink to="/feed/posts">
        <Logo />
      </NavLink> */}
      <Logo />
    </div>

    {props.isAuth ? 
    <span>
      {userData.imageUrl ? 
        // <img className="userImage" src={BASE_URL + '/' + userData.imageUrl} alt="" height="25"
        //   onClick={props.onOpenMobileNav}
        // /> 
        // <img className="userImage" src={userData.imageUrl} alt="" height="25"
        // onClick={props.onOpenMobileNav}
        // /> 
        <Img className="userInfo__userImage" 
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
    <ul className="main-nav__items">
      <NavigationItems isAuth={props.isAuth} onLogout={props.onLogout} />
    </ul>
  </nav>
};

export default mainNavigation;
