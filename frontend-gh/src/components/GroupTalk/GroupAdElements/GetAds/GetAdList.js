import React from 'react';
import { Fragment, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next/hooks';

import { 
  getNearAdElements,
 } from '../../../../util/ad-visit';
import { useStore } from '../../../../hook-store/store';

import { ADNETWORK_URL } from '../../../../App';

// import classes from './InPostsAdElements.module.css';

const GetAdList = (props) => {
  // console.log('GetAdList-props', props);

  const [t] = useTranslation('translation');

  const [store, dispatch] = useStore();
  // console.log('store GetAdList.js', store);

  useEffect(() => {
    if (store.adStore.adList.length === 0 && store.bowserData) {
      const nearAds = getNearAdElementsHandler();
      dispatch('SET_ADLIST', nearAds);

      getNearAdElementsHandler('video');
    }
  },[store.bowserData]);

  
  const getNearAdElementsHandler = async (adType) => {
    try {
      // const adsData = await getNearAdElements(ADNETWORK_URL, 'token');
      const adsData = await getNearAdElements(ADNETWORK_URL, 'token', adType);
      console.log(adsData);
      // setAdList(adsData.data.ads);

      let adList = adsData.data.ads;

      const deviceType = store.bowserData.platform.type;

      //// filter not end ads and device type
      if (adList.length > 0) {
        // adList = adList.filter(ad => {
        //   return ad.end > Date.now();
        //   // return ad.start < Date.now() && ad.end > Date.now();
        // });

        if (deviceType === 'mobile' || window.innerWidth <= 480)
				{
					adList = adList.filter((ad) =>
					{
						return ad.targetDevice !== 'desktop' && ad.end > Date.now();
					});
				}
				if (deviceType === 'desktop' || window.innerWidth > 480)
				{
					adList = adList.filter((ad) =>
					{
						return ad.targetDevice !== 'mobile' && ad.end > Date.now();
					});
				}
      }

      console.log('adList after filter', adList);
      if (adType === 'video') {
        dispatch('SET_VIDEOADLIST', adList);
      } else {
        dispatch('SET_ADLIST', adList);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
  <Fragment></Fragment>);
}

export default GetAdList;