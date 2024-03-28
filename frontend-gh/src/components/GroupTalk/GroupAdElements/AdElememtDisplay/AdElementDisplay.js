import React from 'react';
import { Fragment, useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next/hooks';


// import Loader from '../../../Loader/Loader';
// import TopBarContents from '../GroupTopElements/TopBarContents';
// import RightContents from '../GroupRightElements/RightContents';

import AdItems from '../AdItems/AdItems';
// import GetAdList from '../GetAds/GetAdList';

import { storeClickData, createDisplayAd } from '../../../../util/ad-visit';
import { storeAdDisplay } from '../../../../util/ad-display';

import { useStore } from '../../../../hook-store/store';
import { useOnScreen } from '../../../../custom-hooks/useOnScreen';

import { ADNETWORK_URL } from '../../../../App';

// import classes from './GroupTopElements.module.css';

const AdElementDisplay = (props) => {
  // console.log('AdElementDisplay-props', props);

  const { adType, adPlaceId } = props;

  const currentUrl = new URL(window.location.href);
  const queryParams = currentUrl.searchParams;
  const roomIdParam = queryParams.get('groupRoomId');
  // console.log('queryParams', queryParams.get('groupRoomId'));

  const [t] = useTranslation('translation');

  const [store, dispatch] = useStore();
  // console.log('store-in AdElementDisplay.js', store);
  const adList = store.adStore.adList;
  // const videoAdList = store.adStore.videoAdList;

  const ref = useRef();
  const isVisible = useOnScreen(ref);

  const [isLoading, setIsLoading] = useState(true);
  const [activeList, setActiveList] = useState([]);
  const [displayAd, setDisplayAd] = useState();
  
  const [isDisplayed, setIsDisplayed] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000* 60);

    if (adList.length > 0) {
      setIsLoading(false);
    }
  },[adList]);


  useEffect(() => {
    // console.log('isVisible', isVisible, displayAd)
    if (isVisible && activeList.length > 0 && displayAd && adType) {
      console.log('isVisible displayAd', displayAd);
      console.log('isVisible, displayAd exists ...');

      if (!isDisplayed) {
        console.log('isVisible, now displayed, adplaceId', adPlaceId);
        setIsDisplayed(true);

        // storeAdDisplay(ADNETWORK_URL, localStorage.getItem('token'), displayAd.adElementId, adPlaceId);
        storeAdDisplayHandler(
          ADNETWORK_URL, 
          localStorage.getItem('token'), 
          displayAd.adElementId, 
          adPlaceId
        );
        
      } else {
        console.log('isVisible, already displayed, adplaceId', adPlaceId);
      }
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


  const adClickHandler = async (displayAd) => {
    try {
      if (isClicked) {
        console.log('already clicked');
        return;
      }

      if (isVisible && activeList.length > 0 && displayAd && adType) {
        setIsClicked(true);

        await storeClickData(
          ADNETWORK_URL, 
          localStorage.getItem('token'), 
          displayAd.adElementId, 
          adPlaceId, 
          adType,
        );
      }

    } catch(err) {
      console.log(err);

      if (err.message === 'budget-error' && displayAd) {
        //// adlist change
        const deletedList = adList.filter(ad => {
          return ad.adElementId !== displayAd.adElementId;
        });

        dispatch('SET_ADLIST', deletedList);
      }
    }
  };


  const storeAdDisplayHandler = async (url, token, adElementId, adPlaceId) => {
    try {
      await storeAdDisplay(url, token, adElementId, adPlaceId);
      // console.log(resData);
    } catch(err) {
      console.log(err);

      if (err.message === 'budget-error') {
        //// adlist change
        const deletedList = adList.filter(ad => {
          return ad.adElementId !== adElementId;
        });

        dispatch('SET_ADLIST', deletedList);
      }
    }
  };


  let adElementDisplayBody;

  adElementDisplayBody = (
    <AdItems 
      // ad={adList[0]} 
      ad={displayAd}
      // adType={adType ? adType : '300x65'} 
      adType={adType} 
      // roomIdParam={roomIdParam}
      activeList={activeList}
    />
  );


  return (
    <Fragment>
      {/* <div ref={ref}>{isVisible && `Yep, I'm on screen`}</div> */}
      <span ref={ref}>{isVisible && ``}</span>
      <div onClick={() => {adClickHandler(displayAd); }}>
        {adElementDisplayBody}
      </div>
    </Fragment>
  );
}

export default AdElementDisplay;