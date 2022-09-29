import React from 'react';
import { Fragment, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next/hooks';

import { getUserAccessPermission } from '../../../util/talk/talk-permission';
import { useStore } from '../../../hook-store/store';
import { BASE_URL } from '../../../App';
// import './VideoTextTalk.css'


const TalkAccessPermission = props => {
  // console.log('UserTalkList.js-props', props);

  const [t] = useTranslation('translation');

  const [store, dispatch] = useStore();

  useEffect(() => {
    // props.getUserTextTalkListHandler();
    getUserAccessPermissionHandler(
      BASE_URL,
      localStorage.getItem('token'),
      localStorage.getItem('userId'),
    );
  },[]); 


  const getUserAccessPermissionHandler = async (url, token, userId) => {
    try {
      const result = await getUserAccessPermission(url, token, userId);
      // const result = await fetch(url + '/talk-permission/', {
      //   method: 'GET',
      //   headers: {
      //     Authorization: 'Bearer ' + token,
      //     'Content-Type': 'application/json'
      //   },
      // });
  
      // const resData = await result.json();

      console.log(result);
      dispatch('SET_TALKPERMISSION', result.data);

      // if (!result.ok) {
      //   throw new Error('error occured');
      // }

      // return resData;
    } catch(err) {
      console.log(err);
      // throw err;
    }
  };


  return (
    <Fragment>
      {/* <button style={{paddingTop: "10rem" }}onClick={() => {
        addAcceptUserId(
          BASE_URL,
          localStorage.getItem('token'),
          '60e110d91892a4426830768c',
          // '60dfe34f948acf20fc03acde',
        )
      }}>add-accept</button>

      <button style={{paddingTop: "10rem" }}onClick={() => {
        deleteAcceptUserId(
          BASE_URL,
          localStorage.getItem('token'),
          '60e110d91892a4426830768c',
          // '60dfe34f948acf20fc03acde',
        )
      }}>delete-accept</button>
      
      <button style={{paddingTop: "10rem" }}onClick={() => {
        addRequestingUserId(
          BASE_URL,
          localStorage.getItem('token'),
          // '60dfe34f948acf20fc03acde',
          // '60e110d91892a4426830768c',
          '61b41d950c71d544c5c32496',
        )
      }}>add-request</button>

      <button style={{paddingTop: "10rem" }}onClick={() => {
        deleteRequestingUserId(
          BASE_URL,
          localStorage.getItem('token'),
          // '60dfe34f948acf20fc03acde',
          '60e110d91892a4426830768c',
        )
      }}>delete-request</button> */}
    </Fragment>
    );
}

export default TalkAccessPermission;