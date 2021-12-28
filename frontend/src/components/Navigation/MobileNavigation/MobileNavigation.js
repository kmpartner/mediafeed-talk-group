import React from 'react';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next/hooks';

import DarkModeToggle from '../../DarkModeToggle/DarkModeToggle';
import NavFooter from '../Footer/NavFooter';
import NavigationItems from '../NavigationItems/NavigationItems';
import './MobileNavigation.css';
import { getUserData, getUserDataForStore } from '../../../util/user';
import { useStore } from '../../../hook-store/store';

import { GQL_URL, BASE_URL } from '../../../App';

const mobileNavigation = props => {
  // console.log('mobileNavigation-props', props)
  const [t] = useTranslation('translation');

  const [store, dispatch] = useStore();

  const [userData, setUserData] = useState('');
  const [darkMode, setDarkMode] = useState();

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

  return (
    <nav className={['mobile-nav', props.open ? 'open' : ''].join(' ')}>
      {/* <div className="navigation-item">{props.name}</div> */}
      <div>

        {props.isAuth ? 
          <span>
            {userData.imageUrl ?
              // <img className="userImage" src={BASE_URL + '/' + userData.imageUrl} alt="" height="25" />
              <span className="mobile-nav__userImageContainer">
                <img className="userImage" src={userData.imageUrl} alt="" height="25" />
                <span className="mobile-nav__name">{userData.name}</span>
              </span>
              : <span className="mobile-nav__name">{userData.name}</span>
            }
          </span>
          : <NavLink to="/login"><span className="name">
            {/* Login */}
            {t('nav.text2')}
          </span></NavLink>
          }

        <ul
          className={['mobile-nav__items', props.mobile ? 'mobile' : ''].join(' ')}
        >
          <NavigationItems
            mobile
            onChoose={props.onChooseItem}
            isAuth={props.isAuth}
            onLogout={props.onLogout}
          />
        </ul>
        
        <div className="mobile-nav__separator" />

        <div className={['navigation-item', props.mobile ? 'mobile' : ''].join(' ')}> 
          <DarkModeToggle 
            setDarkMode={setDarkMode}
          />
        </div>
      </div>
      
      <div>
        <div className="mobile-nav__footer">
          <NavFooter 
            onChoose={props.onChooseItem}
          />
        </div>
      </div>
      
    </nav>
  );
}

export default mobileNavigation;
