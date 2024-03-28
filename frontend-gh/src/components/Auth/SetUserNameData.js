import React from "react";
import { useState, useEffect, Fragment } from "react";
import { useTranslation } from "react-i18next/hooks";

// import jwt from "jsonwebtoken";

import { useStore } from "../../hook-store/store";
import { 
  getUserNameData,
  updateLsNameDataList,
} from '../../util/user-name-data/user-name-data-util';
// import { logoutHandler } from "../../util/user/user";

import { BASE_URL } from "../../App";


const SetUserNameData = (props) => {
  const { } = props;

  const [t] = useTranslation("translation");

  const [store, dispatch] = useStore();
  const { 
    isAuth, 
    userNameData,
  } = store;

  // const lsToken = localStorage.getItem("tokenForCasTGT");

  // useEffect(() => {
  //   let tgtExpireTime;
  //   if (localStorage.getItem("TGTexp")) {
  //     tgtExpireTime = Number(localStorage.getItem("TGTexp")) * 1000;
  //   }
  //   console.log("tgtExpireTime", tgtExpireTime);

  //   if (!tgtExpireTime || tgtExpireTime < Date.now()) {
  //     // deleteCasData();
  //     logoutHandler();
  //     window.location.reload();
  //   }

  //   // if (localStorage.getItem('casTGT') && tgtExpireTime < Date.now()) {
  //   //   getCasTgtStatus(localStorage.getItem('casTGT'));
  //   // }
  // }, []);


  // useEffect(() => {
  //   if (isAuth && lsToken && !userData) {
  //     setUserDataHandler();
  //   }
  // }, [isAuth, userData, lsToken]);


  // // setAuthToken();
  // const setUserDataHandler = () => {
  //   if (lsToken) {
  //     const jwtdecoded = jwt.decode(lsToken);
  //     console.log(jwtdecoded);
  //     dispatch("SET_USERDATA", jwtdecoded);

  //     getUserNameDataHandler();
  //   }
  // };

  useEffect(() => {
    if (isAuth) {
      getUserNameDataHandler();
    }
  },[isAuth]);

  //// add user's userNameData in lsNameDataList
  useEffect(() => {
    if (userNameData) {
      updateLsNameDataList([], userNameData);
    }
  },[userNameData]);

  const getUserNameDataHandler = async () => {
    try {
      dispatch('SET_GLOADING', true);
      const resData = await getUserNameData(
        BASE_URL,
        localStorage.getItem('token'),
      );

      console.log(resData);

      if (resData.data) {
        dispatch('SET_USERNAMEDATA', resData.data);  
      }

      dispatch('SET_GLOADING', false);

    } catch(err) {
      console.log(err);
      dispatch('SET_GLOADING', false);
      // throw err;
    }
  };





  return (
    <Fragment></Fragment>
  );
};

export default SetUserNameData;
