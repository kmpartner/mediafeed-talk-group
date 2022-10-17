import React from 'react';
import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next/hooks';

import MobileToggle from '../MobileToggle/MobileToggle';
import Logo from '../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';
import { GQL_URL, BASE_URL } from '../../../App';
import { getUserData } from '../../../util/user';
import './NavFooter.css';

const NavFooter = props => {
  // console.log('Footer-props', props);
  const [t] = useTranslation('translation');
  
  const [userData, setUserData] = useState('');

  // useEffect(() => {
  //   if (props.isAuth) {
  //     getUserData(GQL_URL, props.token)
  //     .then(res => {
  //       console.log(res);
  //       setUserData(res.userData.data.user);
  //     })
  //     .catch(err => console.log(err))
  //   }
  // },[props.isAuth, props.userUpdateAction]);

  return (
    <div>
      
  <div className="footer">

    <div className="footer__items" onClick={props.onChoose}>
      <Link to="/privacypolicy" className="footer__text">
        {/* Privacy Policy */}
        {t('privacyPolicy.text1')}
      </Link>
    </div>
    <div className="footer__items" onClick={props.onChoose}>
      <Link to="/termsofuse" className="footer__text">
        {/* Terms of Use */}
        {t('termsOfUse.text1')}
      </Link>
    </div>

  </div>
  <div className="footer__items" >watakura.xyz (part of SpaceEight)</div>

    </div>

  );
};

export default NavFooter;
