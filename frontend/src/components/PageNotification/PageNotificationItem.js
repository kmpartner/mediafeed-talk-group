import React, { Fragment } from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next/hooks";
import Img from "react-cool-img";

import { useStore } from "../../hook-store/store";

// import { authSignupPageLink, authPageLink } from '../../../App';
import { BASE_URL } from "../../App";

import './PageNotification.css';

const PageNotificationItem = (props) => {
  const { notify, setShowPageNotification } = props;

  const [t] = useTranslation("translation");

  const [store, dispatch] = useStore();
  // const { pageNotification } = store.pageNotificationStore;

  useEffect(() => {}, []);

  // console.log(notify)

  let displayPage;
  let pageNotifyItemBody;

  if (notify) {
    const currentPath = window.location.pathname + window.location.search;
    let notifyLink = currentPath;

    if (notify.page === 'feed' && notify.dataForNotification && notify.dataForNotification.postId) {
      notifyLink = `/feed/${notify.dataForNotification.postId}`;
      // console.log(notify.dataForNotification.postId)
      displayPage = 'Feed';
    }


    pageNotifyItemBody = (
      <div className="pageNotifyItem">
        <div>
          <Link className="pageNotifyItemLink"
            to={notifyLink}
            target="_blank" rel="noopener noreferrer"
            onClick={() => {
              // setShowPageNotification(false);
            }}
          >
            <strong>
              {notify.title}
            </strong>
          </Link>
        </div>
        <div>
          <Link className="pageNotifyItemLink"
            to={notifyLink}
            target="_blank" rel="noopener noreferrer"
            onClick={() => {
              // setShowPageNotification(false);
            }}
          >
            {notify.message}
          </Link>
        </div>
        <div>
          <Link className="pageNotifyItemLink"
            to={notifyLink}
            target="_blank" rel="noopener noreferrer"
            onClick={() => {
              // setShowPageNotification(false);
            }}
          >
            {new Date(notify.creationTime).toLocaleString()} ({displayPage})
          </Link>
        </div>
      </div>
    );
  }

  return (
    <Fragment>
      <div>{pageNotifyItemBody}</div>
    </Fragment>
  );
};

export default PageNotificationItem;
