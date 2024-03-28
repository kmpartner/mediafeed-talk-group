import React from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next/hooks";

import { appInstallHandler } from '../../../util/ui-util';
import { useStore } from "../../../hook-store/store";

import { authSignupPageLink, authPageLink } from "../../../App";
import "./NavigationItems.css";

import GroupIcon from "../../../images/icons/groupIcon-48.png";
import FeedIcon from "../../../images/icons/feedIcon-48.png";
import UserInfoIcon from "../../../images/icons/userInfoIcon-48.png";
import TalkIcon from "../../../images/icons/talkIcon-48.png";
import LoginIcon from "../../../images/icons/loginIcon-48.png";
import LogoutIcon from "../../../images/icons/logoutIcon-48.png";
import SignupIcon from "../../../images/icons/signupIcon-48.png";
import HomeIcon from "../../../images/icons/homeIcon-48.png";

// const navItems = [
//   { id: 'feed', text: t('test.text1'), link: '/feed/posts', auth: true },
//   { id: 'login', text: 'Login', link: '/login', auth: false },
//   { id: 'signup', text: 'Signup', link: '/signup', auth: false },
//   { id: 'userinfo', text: 'User Info', link: '/userinfo', auth: true },
//   // { id: 'othernav', text: 'othernav', link: '/feed/posts', auth: true },
//   // { id: 'othernav2', text: 'othernav2', link: '/feed/posts', auth: true },
// ];

const NavigationItems = (props) => {
  const [t] = useTranslation("translation");

  const [store, dispatch] = useStore();
  console.log('NavigationItems-store', store);
  const { deferredPrompt } = store;

  const navItems = [
    {
      id: "home",
      text: "Home",
      // text: t('nav.text1'),
      link: "/",
      auth: false,
    },
    {
      id: "home",
      text: "Home",
      // text: t('nav.text1'),
      link: "/",
      auth: true,
    },
    {
      id: "feed",
      // text: 'feed',
      // text: t('nav.text1'),
      text: t("feed.text44", "media post feed"),
      link: "/feed/posts",
      auth: true,
    },
    // { id: 'login',
    //   // text: 'Login',
    //   text: t('nav.text2'),
    //   link: '/login', auth: false },
    // { id: 'signup',
    //   // text: 'Signup',
    //   text: t('nav.text3'),
    //   link: '/signup', auth: false },
    {
      id: "userinfo",
      // text: 'User Info',
      text: t("nav.text4"),
      link: "/userinfo",
      auth: true,
    },
    {
      id: "talk-page",
      // text: 'Talk',
      text: t("general.text24", "Talk"),
      link: "/talk-page",
      auth: true,
    },
    {
      id: "group-talk-page",
      // text: 'Group',
      text: t("general.text25", "Group Talk"),
      link: "/group-talk-page",
      auth: true,
    },
    {
      id: "feed",
      // text: 'feed',,
      text: t("feed.text44", "media post feed"),
      link: "/feed/posts",
      auth: false,
    },
    {
      id: "group-talk-page",
      // text: 'Group',
      text: t("general.text25", "Group Talk"),
      link: "/group-talk-page",
      auth: false,
    },
    {
      id: "login-auth-sso",
      // text: 'login',
      text: t("nav.text2"),
      link: `${authPageLink}`,
      auth: false,
    },
    {
      id: "signup-auth-sso",
      // text: 'signup',
      text: t("nav.text3"),
      link: `${authSignupPageLink}`,
      auth: false,
    },

    // { id: 'othernav', text: 'othernav', link: '/feed/posts', auth: true },
    // { id: 'othernav2', text: 'othernav2', link: '/feed/posts', auth: true },
  ];

  const logoutConfirm = () => {
    if (window.confirm("Is it no problem to logout?")) {
      // console.log('confirm true');
      props.onLogout();
    }
  };

  let navigationItemsBody;
  navigationItemsBody = [
    ...navItems
      .filter((item) => item.auth === props.isAuth)
      .map((item) => {
        if (item.id === "login-auth-sso" || item.id === "signup-auth-sso") {
          let titleIconImage;
          if (item.id === "login-auth-sso") {
            titleIconImage = <img src={LoginIcon} alt="icon" />;
          }

          if (item.id === "signup-auth-sso") {
            titleIconImage = <img src={SignupIcon} alt="icon" />;
          }

          return (
            <li
              key={item.id}
              className={["navigation-item", props.mobile ? "mobile" : ""].join(
                " "
              )}
            >
              <a href={item.link}>
                {/* {titleIcon} {item.text} */}
                <span className="navigation-item-mobile-titleContainer">
                  <span className="navigation-item-mobile-titleIcon">
                    {titleIconImage}
                  </span>
                  <span>{item.text}</span>
                </span>
              </a>
            </li>
          );
        } else {
          let titleIconImage;
          if (item.id === "group-talk-page") {
            titleIconImage = <img src={GroupIcon} alt="icon" />;
          }

          if (item.id === "talk-page") {
            titleIconImage = <img src={TalkIcon} alt="icon" />;
          }

          if (item.id === "feed") {
            titleIconImage = <img src={FeedIcon} alt="icon" />;
          }

          if (item.id === "userinfo") {
            titleIconImage = <img src={UserInfoIcon} alt="icon" />;
          }

          if (item.id === "home") {
            titleIconImage = <img src={HomeIcon} alt="icon" />;
          }

          return (
            <li
              key={item.id}
              className={["navigation-item", props.mobile ? "mobile" : ""].join(
                " "
              )}
            >
              <NavLink to={item.link} exact onClick={props.onChoose}>
                <span className="navigation-item-mobile-titleContainer">
                  <span className="navigation-item-mobile-titleIcon">
                    {titleIconImage}
                  </span>
                  <span>{item.text}</span>
                </span>
              </NavLink>
            </li>
          );
        }
      }),
    props.isAuth && (
      <li
        className={["navigation-item", props.mobile ? "mobile" : ""].join(" ")}
        key="logout"
      >
        <button onClick={logoutConfirm}>
          {/* Logout */}
          {/* {t('nav.text5')} */}

          <span className="navigation-item-mobile-titleContainer">
            <span className="navigation-item-mobile-titleIcon">
              <img src={LogoutIcon} alt="icon" />
            </span>
            <span>{t("nav.text5", "Logout")}</span>
          </span>
        </button>
      </li>
    ),

    deferredPrompt && (
      <li
        className={["navigation-item", props.mobile ? "mobile" : ""].join(" ")}
        key="logout"
      >
        <button onClick={() => { appInstallHandler(deferredPrompt); }}>
          {/* Logout */}
          {/* {t('nav.text5')} */}

          <span className="navigation-item-mobile-titleContainer">
            <span className="navigation-item-mobile-titleIcon">
              {/* <img src={LogoutIcon} alt="icon" /> */}
            </span>
            <span>Install App</span>
          </span>
        </button>
      </li>
    ),
  ];

  return navigationItemsBody;
  //   [
  //   ...navItems
  //     .filter(item => item.auth === props.isAuth)
  //     .map(item => {
  //       if (item.id === 'login-auth-sso' || item.id === 'signup-auth-sso') {
  //         return (
  //           <li key={item.id} className={['navigation-item', props.mobile ? 'mobile' : ''].join(' ')}>
  //             <a href={item.link}>{item.text}</a>
  //           </li>
  //         )
  //       } else {
  //           return (
  //             <li key={item.id} className={['navigation-item', props.mobile ? 'mobile' : ''].join(' ')}>
  //               <NavLink to={item.link} exact onClick={props.onChoose}>
  //                 <span className="navigation-item-mobile-titleContainer">
  //                   <span className="navigation-item-mobile-titleIcon">
  //                     {/* <img src={GroupIcon} alt='icon'/> */}
  //                   </span>
  //                   <span>
  //                      {item.text}
  //                   </span>
  //                 </span>
  //               </NavLink>
  //             </li>
  //           )

  //       }
  //   }),
  //   props.isAuth && (
  //       <li className={['navigation-item', props.mobile ? 'mobile' : ''].join(' ')} key="logout">
  //         <button onClick={logoutConfirm}>
  //           {/* Logout */}
  //           {t('nav.text5')}
  //         </button>
  //       </li>
  //   )
  // ]
};

export default NavigationItems;
