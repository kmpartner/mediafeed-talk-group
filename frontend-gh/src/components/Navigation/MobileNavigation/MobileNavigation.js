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

const MobileNavigation = props => {
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

  const lsNameDataList = localStorage.getItem('lsNameDataList');
  let nameData;
  if (lsNameDataList && JSON.parse(lsNameDataList).length > 0) {
    nameData = JSON.parse(lsNameDataList).find(element => {
      return element.userId === localStorage.getItem('userId');
    });
  }

  return (
    <nav className={['mobile-nav', props.open ? 'open' : ''].join(' ')}>
      {/* <div className="navigation-item">{props.name}</div> */}
      <div>

        {props.isAuth && nameData &&
          <span>
            <span className="mobile-nav__name">
                {nameData.name}
            </span>
          </span>
          // : <NavLink to="/login"><span className="name">
          //   {/* Login */}
          //   {t('nav.text2')}
          // </span></NavLink>
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

export default MobileNavigation;
