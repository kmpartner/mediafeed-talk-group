import React, { Fragment } from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next/hooks";
import Img from "react-cool-img";

import { useStore } from "../../hook-store/store";

// import { authSignupPageLink, authPageLink } from '../../../App';
import { BASE_URL } from "../../App";

import './PageNotification.css';

// import SampleImage from '../Image/person-icon-50.jpg';

const PageNotificationItem = (props) => {
  const { 
    notify, 
    lsNameDataList,
    // setShowPageNotification,
   } = props;

  const [t] = useTranslation("translation");

  const [store, dispatch] = useStore();
  // const { pageNotification } = store.pageNotificationStore;

  useEffect(() => {}, []);

  // console.log(notify)

  let displayPage;
  let pageNotifyItemBody;
  let nameData;

  if (notify) {
    const currentPath = window.location.pathname + window.location.search;
    let notifyLink = currentPath;

    if (notify.page === 'feed' && notify.dataForNotification?.postId) {
      notifyLink = `/feed/${notify.dataForNotification.postId}`;
      // console.log(notify.dataForNotification.postId)
      displayPage = 'Feed';

      //// set nameData for comment creator from lsNameDataList
      if (notify.dataForNotification?.commentCreatorId) {
        if (lsNameDataList && JSON.parse(lsNameDataList).length > 0) {
          nameData = JSON.parse(lsNameDataList).find(ele => {
            return ele.userId === notify.dataForNotification.commentCreatorId;
          });
        }
      }

      //// set nameData for post creator from lsNameDataList
      if (!notify.dataForNotification?.commentCreatorId && 
            notify.dataForNotification?.postCreatorId
      ) {
        if (lsNameDataList && JSON.parse(lsNameDataList).length > 0) {
          nameData = JSON.parse(lsNameDataList).find(ele => {
            return ele.userId === notify.dataForNotification.postCreatorId;
          });
        }
      }
      
    }

    if (notify.page === 'talk' ) {
      notifyLink = `/talk-page`;
      
      if (notify.dataForNotification?.fromUserId) {
        notifyLink = `/talk-page?pageNotificationUserId=${notify.dataForNotification.fromUserId}`;
      }
      // console.log(notify.dataForNotification.postId)
      displayPage = 'talk';

      if (lsNameDataList && JSON.parse(lsNameDataList).length > 0) {
        nameData = JSON.parse(lsNameDataList).find(ele => {
          return ele.userId === notify.dataForNotification?.fromUserId;
        });
      }

    }

    if (notify.page === 'group' ) {
      notifyLink = `/group-talk-page`;

      if (notify.dataForNotification?.groupRoomId) { 
        notifyLink = `/group-talk-page?pageNotificationGroupRoomId=${notify.dataForNotification.groupRoomId}`;
      }

      // notifyLink = `/feed/${notify.dataForNotification.postId}`;
      // console.log(notify.dataForNotification.postId)
      
      displayPage = 'group';

      if (notify.dataForNotification?.groupName) {
        displayPage = `group, ${notify.dataForNotification.groupName}`;
      }

      if (lsNameDataList && JSON.parse(lsNameDataList).length > 0) {
        nameData = JSON.parse(lsNameDataList).find(ele => {
          return ele.userId === notify.dataForNotification?.fromUserId;
        });
      }

    }

    // console.log('nameData', nameData, displayPage)


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
            <span className="pageNotifyUserTitle">
              <strong>
                {notify.title}
              </strong>
              {nameData?.imageUrl && (
                <img className="pageNotifyUserImage"
                  // style={{height: "1rem", width: "1rem", objectFit: "cover"}}
                  src={nameData.imageUrl} 
                />
              )}
              {/* {!nameData?.imageUrl && (
                <img className="pageNotifyUserImage"
                  src={SampleImage} alt=""
                />
              )} */}
            </span>
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
