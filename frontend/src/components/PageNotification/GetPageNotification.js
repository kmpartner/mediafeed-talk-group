import React, { Fragment, useEffect } from "react";

import { useStore } from "../../hook-store/store";
import { getPageNotification } from "../../util/page-notification/page-notification-util";

import { BASE_URL } from "../../App";

function GetPageNotification(props) {
    const { isAuth } = props;

    const [store, dispatch] = useStore();
    const { 
      pageNotification,
      pageNotificationCreatorUserNameDataList,
    } = store.pageNotificationStore;

    useEffect(() => {
      if (isAuth) {
        getPageNotificationHandler();
      }
    },[isAuth]);

    useEffect(() => {
      if (pageNotification?.pageNotificationList?.length > 0 && 
          pageNotificationCreatorUserNameDataList.length === 0
      ) {
        getCreatorUserNameDataList();
      }
    },[pageNotification, pageNotificationCreatorUserNameDataList]);

    const getPageNotificationHandler = async () => {
      try {
        const resData = await getPageNotification(
          BASE_URL,
          localStorage.getItem('token'),
        );

        // console.log(resData)
        if (resData.data) {
          dispatch('SET_PAGENOTIFICATION', resData.data);
        }
      } catch(err) {
        console.log(err);
        throw err;
      }
    }



  const getCreatorUserNameDataList = async () => {
    try {
      const result = await fetch(BASE_URL + '/page-notification/creator-user-name-data-list', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
          'Content-Type': 'application/json'
        },
      });
  
      const resData = await result.json();
  
      console.log(result, resData);

      if (resData?.data?.length > 0) {
        dispatch('SET_PAGENOTIFICATION_CREATORUSERNAMEDATALIST', resData.data);
      }
  
      if (!result.ok) {
        throw new Error('error occured');
      }
  
      return resData;
    } catch(err) {
      console.log(err);
      throw err;
    }
  };

    return (
        <Fragment>
        </Fragment>
    );
}

export default GetPageNotification;