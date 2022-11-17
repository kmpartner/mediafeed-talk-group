import React from 'react';
import { Fragment, useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next/hooks';


import Loader from '../../../Loader/Loader';
// import TopBarContents from '../GroupTopElements/TopBarContents';
// import RightContents from '../GroupRightElements/RightContents';

import AdItems from '../AdItems/AdItems';
import VideoAdItems from '../AdItems/VideoAdItems';
// import GetAdList from '../GetAds/GetAdList';

import { storeClickData, getNearAdElements, createDisplayAd } from '../../../../util/ad-visit';
import { storeAdDisplay } from '../../../../util/ad-display';

import { useStore } from '../../../../hook-store/store';
import { useOnScreen } from '../../../../custom-hooks/useOnScreen';

import { ADNETWORK_URL } from '../../../../App';

// import classes from './GroupTopElements.module.css';

const VideoAdElementDisplay = (props) => {
  // console.log('AdElementDisplay-props', props);

  const { adType, adPlaceId, setPlayState } = props;

  const currentUrl = new URL(window.location.href);
  const queryParams = currentUrl.searchParams;
  const roomIdParam = queryParams.get('groupRoomId');
  // console.log('queryParams', queryParams.get('groupRoomId'));

  const [t] = useTranslation('translation');

  const [store, dispatch] = useStore();
  // console.log('store-in AdElementDisplay.js', store);
  const adList = store.adStore.adList;
  const videoAdList = store.adStore.videoAdList;

  const ref = useRef();
  const isVisible = useOnScreen(ref);

  const [isLoading, setIsLoading] = useState(true);
  const [activeList, setActiveList] = useState([]);
  const [displayAd, setDisplayAd] = useState();
  
  const [isDisplayed, setIsDisplayed] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const [displayVideoAd, setDisplayVideoAd] = useState();
  const [activeVideoList, setActiveVideoList] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000* 60);

    if (adList.length > 0) {
      setIsLoading(false);
    }
  },[adList]);

  // useEffect(() => {
  //   console.log('AdElementDisplay-props', props);
  //   //// send display info
  // },[]);

  
  useEffect(() => {
    // console.log('isVisible', isVisible, displayAd)
    if (isVisible && activeList.length > 0 && displayAd && adType) {
      console.log('isVisible displayAd', displayAd);
      console.log('isVisible, displayAd exists ...');

      if (!isDisplayed) {
        console.log('isVisible, now displayed, adplaceId', adPlaceId);
        setIsDisplayed(true);

        storeAdDisplay(ADNETWORK_URL, 'token', displayAd.adElementId, adPlaceId);
        
      } else {
        console.log('isVisible, already displayed, adplaceId', adPlaceId);
      }

      // if (adType === 'feedList') {
      //   dispatch('SET_FEEDLIST_DISPLAYED_ADLIST', displayAd);

      //   const feedListDiplayedAdList = store.adStore.feedListDisplayedAdList;

      //   const isExistInList = feedListDiplayedAdList.find(ad => {
      //     return ad.adElementId === displayAd.adElementId;
      //   });

      //   if (!isExistInList) {
      //     console.log('not displayed feedList ads');
      //   }

      // }
    }
  },[isVisible, activeList, displayAd, adType])

  useEffect(() => {
    if (adList.length > 0) {
      const activeList = adList.filter(ad => {
        return ad.start < Date.now() && ad.end > Date.now();
      });
      console.log('activeList', activeList);
      setActiveList(activeList);
    
      if (activeList.length > 0) {
        const displayAd = createDisplayAd(activeList);
        setDisplayAd(displayAd);
        console.log('displayAd', displayAd);
      }
    }
  },[adList]);


  useEffect(() => {
    if (videoAdList.length > 0) {
      const activeVideoList = videoAdList.filter(ad => {
        return ad.start < Date.now() && ad.end > Date.now();
      });
      console.log('activeVideoList', activeVideoList);
      setActiveVideoList(activeVideoList);
    
      if (activeVideoList.length > 0) {
        const displayVideoAd = createDisplayAd(activeVideoList);
        setDisplayVideoAd(displayVideoAd);
        console.log('displayVideoAd', displayVideoAd);
      }
    }
  },[videoAdList]);

  // const activeList = adList.filter(ad => {
  //   return ad.start < Date.now() && ad.end > Date.now();
  // });
  // console.log('activeList', activeList);

  // const displayAd = createDisplayAd(activeList);
  // console.log('displayAd', displayAd);

  const adClickHandler = () => {
    if (isClicked) {
      console.log('already clicked');
      return;
    }

    if (isVisible && activeList.length > 0 && displayAd && adType) {
      storeClickData(
        ADNETWORK_URL, 
        localStorage.getItem('token'), 
        displayAd.adElementId, 
        adPlaceId, 
        adType,
      );

      setIsClicked(true);
    }
  };


  const adElementDisplayBody = (
    <VideoAdItems
      // ad={adList[0]} 
      ad={displayVideoAd}
      // adType={adType ? adType : '300x65'} 
      adType={adType} 
      // roomIdParam={roomIdParam}
      activeList={activeVideoList}
      isVisible={isVisible}
      setPlayState={setPlayState}
    />
  );
  
  // adElementDisplayBody = (
  //   <AdItems 
  //     // ad={adList[0]} 
  //     ad={displayAd}
  //     // adType={adType ? adType : '300x65'} 
  //     adType={adType} 
  //     // roomIdParam={roomIdParam}
  //     activeList={activeList}
  //   />
  // );

  // // if (adType === 'video') {
  // if (adType.startsWith('video')) {
  //   adElementDisplayBody = (
  //     <VideoAdItems
  //       // ad={adList[0]} 
  //       ad={displayVideoAd}
  //       // adType={adType ? adType : '300x65'} 
  //       adType={adType} 
  //       // roomIdParam={roomIdParam}
  //       activeList={activeVideoList}
  //       isVisible={isVisible}
  //       setPlayState={setPlayState}
  //     />
  //   );
  // }

  // if (isLoading) {
  //   adElementDisplayBody = <div>...loading...</div>;
  // }
  // if (isLoading && !roomIdParam) {
  //   adElementDisplayBody = (
  //     <AdItems 
  //       // ad={adList[0]} 
  //       ad={displayAd}
  //       adType={adType ? adType : '300x65'} 
  //       // roomIdParam={roomIdParam}
  //       activeList={activeList}
  //   />
  //   );
  // }
  // else {
  //   adElementDisplayBody = (
  //     <div>
  //       <GetAdList />
  //       {/* {!roomIdParam && activeList.length === 0 && (
  //         <a className={classes.groupTalkRightElementLink}
  //           id={adElementId}
  
  //           href="https://remeet.watakura.xyz/your-room-from-above-link"
  //           target="_blank"
  //           rel="noopener noreferrer"
  //         >
  //           <div className={classes.groupTalkTopBarElementContainer}>
  //             <div className={classes.groupTalkTopBarElement}>
  //               <TopBarContents />
  //             </div>
  //           </div>
  //         </a>
  //       )} */}
        
  //       {/* {!roomIdParam && activeList.length > 0 && ( */}
  //       {!roomIdParam && (
  //         <div
  //           // onClick={() => storeClickData(ADNETWORK_URL, 'token', adList[2].adElementId, 'some-placeId', '300x65')}
  //         > 
  //           <AdItems 
  //             // ad={adList[0]} 
  //             ad={displayAd}
  //             adType={adType ? adType : '300x65'} 
  //             // roomIdParam={roomIdParam}
  //             activeList={activeList}
  //           />
  //         </div>
  //       )}
  
  //     </div>
  //   );
  // }

  return (
    <Fragment>
      {/* <div ref={ref}>{isVisible && `Yep, I'm on screen`}</div> */}
      <span ref={ref}>{isVisible && ``}</span>
      <div onClick={adClickHandler}>
        {adElementDisplayBody}
      </div>
    </Fragment>
  );
}

export default VideoAdElementDisplay;