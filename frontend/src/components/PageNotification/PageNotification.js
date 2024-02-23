import React, { Fragment } from "react";
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next/hooks";
import Img from "react-cool-img";

import Backdrop from "../Backdrop/Backdrop";
import Loader from "../Loader/Loader";
import SmallModal from "../Modal/SmallModal";
import PageNotificationItem from "./PageNotificationItem";

import { useStore } from "../../hook-store/store";
import { updatePageNotificationLastOpenTime } from '../../util/page-notification/page-notification-util';

// import { authSignupPageLink, authPageLink } from '../../../App';
import { BASE_URL } from "../../App";

import './PageNotification.css';

const PageNotification = (props) => {
  const { setShowPageNotification } = props;

  const [t] = useTranslation("translation");

  const [store, dispatch] = useStore();
  const { pageNotification } = store.pageNotificationStore;

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    pageNotifyUpdateTimeHandler();
  }, []);

  const pageNotifyUpdateTimeHandler = async () => {
    try {
      setIsLoading(true);
      const resData = await updatePageNotificationLastOpenTime(
        BASE_URL,
        localStorage.getItem('token'),
      );

      if (resData.data) {
        dispatch('SET_PAGENOTIFICATION', resData.data);
      }

      setIsLoading(false);

    } catch(err) {
      console.log(err);
      setIsLoading(false);
      throw err;
    }
  }
  let pageNotifyListBody;

  // if (
  //   pageNotification && pageNotification.pageNotificationList &&
  //   pageNotification.pageNotificationList.length > 0 
  // ) {
    if (
      pageNotification?.pageNotificationList?.length > 0 
    ) {

    pageNotifyListBody = (
      <div>
        <div className="pageNotifyListClose">
          <strong className="pageNotifyListCloseButton"
            onClick={() => { setShowPageNotification(false); }}
          >
            X
          </strong>
        </div>
        <ul className="pageNotifyList">
          {pageNotification.pageNotificationList.reverse().map((notify) => {
            return (
              <li key={notify.creationTime}>
                <PageNotificationItem 
                  notify={notify}
                  setShowPageNotification={setShowPageNotification}
                />
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  let pageNotificationBody;

  pageNotificationBody = (
    <div>
      <Backdrop
        onClick={() => {
          setShowPageNotification(false);
        }}
      />
      <SmallModal style="modal2">
        {/* <div>page-notification-content</div> */}
        <div>{pageNotifyListBody}</div>
      </SmallModal>
    </div>
  );

  return (
    <Fragment>
      {isLoading && (
        <Loader />
      )}
      <div>{pageNotificationBody}</div>
    </Fragment>
  );
};

export default PageNotification;
