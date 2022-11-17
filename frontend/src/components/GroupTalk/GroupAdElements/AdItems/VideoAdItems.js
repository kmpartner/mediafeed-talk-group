import React, { Fragment, useEffect, useState } from "react";
import { withI18n } from "react-i18next";

import RightContents from "../GroupRightElements/RightContents";
import TopBarContents from "../GroupTopElements/TopBarContents";

import { ADNETWORKLINK_URL } from "../../../../App";

import GrayImage from '../../../../images/light-gray-square-300.jpg';

import classes from "./AdItems.module.css";
// import "../FeedEdit.css";
// import "./ImagePreviewContents.css"

const VideoAdItems = (props) => {
  console.log("VideoAdItems.js-props", props);
  const { 
    ad, 
    adType, 
    activeList, 
    isVisible,
    setPlayState,
  } = props;

  const [listenStart, setListenStart] = useState(false);

  useEffect(() => {
    const videoEl = document.getElementById('adVideo');
    
    if (ad && adType && activeList && videoEl && isVisible) {
      videoEl.play();
      console.log('playing... isVisible', isVisible);
      // setTimeout(() => {
      // },5000);
    }

    if (ad && adType && activeList && videoEl && !isVisible) {
      videoEl.pause();
      console.log('paused... isVisible', isVisible);
      // setTimeout(() => {
      // },5000);
    }

  },[ad, adType, activeList, isVisible]);

  useEffect(() => {
    const videoEl = document.getElementById('adVideo');

    if (ad && adType && activeList && videoEl && !listenStart) {
      videoEl.addEventListener('ended', (e) => {
        console.log('ended');
        // videoEl.play();
        setPlayState('ended');
      });

      videoEl.addEventListener('playing', (e) => {
        console.log('playing...');
        setPlayState('playing');
        // videoEl.play();
      });

      // videoEl.addEventListener('pause', (e) => {
      //   console.log('paused...', e);
      //   // setPlayState('paused')
      //   // setPlayEnd(true);
      // });

      setListenStart(true);
    }

  },[ad, adType, activeList, listenStart]);



  let bodyVideo300;

  if (ad && activeList && activeList.length > 0) {
    bodyVideo300 = (
      <a className={classes.adLink}
        // href={ad.linkUrl}
        href={`${ADNETWORKLINK_URL}?altk=${ad.token}`}
        target="_blank" rel="noopener noreferrer"
      >
        <video 
          // className="body300x300Image"
          className="body300Video"
          id='adVideo'
          src={ad.adImageUrl}
          // controls
          // autoPlay
          muted
          alt="ad video"
        />
          {/* <div className="body300x300TextContainer">
           <span className="body300x300TextTitle">
             {ad.title}
           </span>
           <span className="body300x300TextDescription">
             {ad.description}
           </span>
         </div> */}
      </a>
    )
  }


  let adItemsBody;

  if (adType === 'video300') {
    adItemsBody = (
      <div className={classes.rightAdsContainer}>
        <div className={classes.rightAdsItem}>
          {bodyVideo300}
        </div>
      </div>
    );
    // adItemsBody = (
    //     <div >
    //       {bodyVideo}
    //     </div>
    // );
  }
  

  return <Fragment>{adItemsBody}</Fragment>;
};

export default withI18n()(VideoAdItems);
