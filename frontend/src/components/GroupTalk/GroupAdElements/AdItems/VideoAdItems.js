import React, { Fragment, useEffect, useState } from "react";
import { withI18n } from "react-i18next";

import { storeAdVideoViewVisit } from '../../../../util/ad-visit';

import { useStore } from '../../../../hook-store/store';


import { ADNETWORK_URL, ADNETWORKLINK_URL } from "../../../../App";

// import GrayImage from '../../../../images/light-gray-square-300.jpg';
import RemeetAdVideo from '../../../../images/remeet-test2-2-darkintro.mp4';

import classes from "./AdItems.module.css";
// import "../FeedEdit.css";
// import "./ImagePreviewContents.css"

const VideoAdItems = (props) => {
  // console.log("VideoAdItems.js-props", props);
  const { 
    ad, 
    adType, 
    activeList, 
    isVisible,
    setPlayState,

    adPlaceId,
  } = props;

  const [store, dispatch] = useStore();
  const videoAdList = store.adStore.videoAdList;

  const [listenStart, setListenStart] = useState(false);
  const [fallbackDesc, setFallbackDesc] = useState(null);

  const [isMinSec, setIsMinSec] = useState(false);
  const [playCurrentTime, setPlayCurrentTime] = useState(0);

  const [isClicked, setIsClicked] = useState(false);

  // // play and pause controll on visible state
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

  // // listen video playing state
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

        // // // 10 second pause and rerender in VideoAdElementTime.js
        // setTimeout(() => {
        //   console.log('playing... 10-sec');
        //   videoEl.pause();
        //   setPlayState('10-sec');
        // },1000*10);

        // videoEl.play();
      });

      // videoEl.addEventListener('pause', (e) => {
      //   console.log('paused...', e);
      //   // setPlayState('paused')
      //   // setPlayEnd(true);
      // });

      setListenStart(true);
    }

    // // detect updated currentTime
    videoEl.addEventListener("timeupdate", function (e) {
      // console.log('timeupdate currentTime', e.target.currentTime);
      setPlayCurrentTime(e.target.currentTime);

      if (e.target.currentTime > 10) {
        setIsMinSec(true);
      }
    });

  },[ad, adType, activeList, listenStart]);


  useEffect(() => {
    if (isMinSec && !isClicked) {
      //// store view data;
      adVideoViewClickHandler(ad);
    }
  },[isMinSec, isClicked]);


  // // display fallback desc when adlist not exist 
  useEffect(() => {
    if (!ad && activeList.length === 0 && adType === 'video300') {
      setTimeout(() => {
        setFallbackDesc(
          <div className="body300x300TextContainer">
            <span className="body300x300TextTitle">
              Video Talk & Meeting
            </span>
            <span className="body300x300TextDescription">
              REMEET: Web meetings & talks with text chat, file & screen sharing
            </span>
          </div>
        );
      },1000*10);
    }

  },[ad, adType, activeList]);



  const adVideoViewClickHandler = async (ad) => {
    try {
      if (isClicked) {
        console.log('already store visit');
        return;
      }

      if (isVisible && activeList.length > 0 && ad && adType) {
        setIsClicked(true);

        await storeAdVideoViewVisit(
          ADNETWORK_URL, 
          localStorage.getItem('token'), 
          ad.adElementId, 
          adPlaceId, 
          adType,
        );

      }
    } catch(err) {
      console.log(err);

      if (err.message === 'budget-error' && ad) {
        //// adlist change (video)
        const deletedList = videoAdList.filter(vad => {
          return vad.adElementId !== ad.adElementId;
        });

        dispatch('SET_VIDEOADLIST', deletedList);
      }
    }

  };


  let bodyVideo300;

  if (ad && activeList && activeList.length > 0) {
    bodyVideo300 = (
      <a className={classes.adLink}
        // href={ad.linkUrl}
        href={`${ADNETWORKLINK_URL}?altk=${ad.token}`}
        target="_blank" rel="noopener noreferrer"
        onClick={() => {adVideoViewClickHandler(ad); }}
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
  else {
    // // some fallback
    bodyVideo300 = (
      <a className={classes.adLink}
        // href={ad.linkUrl}
        href={`https://remeet.watakura.xyz/your-room-from-above-link`}
        target="_blank" rel="noopener noreferrer"
      >
        <video 
          // className="body300x300Image"
          className="body300Video"
          id='adVideo'
          src={RemeetAdVideo}
          // controls
          autoPlay
          loop
          muted
          alt="ad video"
        />
          {/* <div className="body300x300TextContainer">
           <span className="body300x300TextTitle">
             Video Talk & Meeting
           </span>
           <span className="body300x300TextDescription">
             REMEET: Web meetings & talks with text chat, file & screen sharing
           </span>
         </div> */}
         {fallbackDesc}
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

        {/* <div>
          <div>cur-time: {playCurrentTime}</div>
          {isMinSec && (<div>is-min-sec</div>)}
        </div> */}

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
