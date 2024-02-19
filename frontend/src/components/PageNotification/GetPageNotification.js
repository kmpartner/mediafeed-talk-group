import React, { Fragment, useEffect } from "react";

import { useStore } from "../../hook-store/store";
import { getPageNotification } from "../../util/page-notification/page-notification-util";

import { BASE_URL } from "../../App";

function GetPageNotification(props) {
    const { isAuth } = props;

    const [store, dispatch] = useStore();

    useEffect(() => {
      if (isAuth) {
        getPageNotificationHandler();
      }
    },[isAuth]);

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

    return (
        <Fragment>
        </Fragment>
    );
}

export default GetPageNotification;