import React from 'react';
import { Fragment, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next/hooks';

import { getNearAdElements } from '../../../../util/ad-visit';
import { useStore } from '../../../../hook-store/store';

import { ADNETWORK_URL } from '../../../../App';

// import classes from './InPostsAdElements.module.css';

const GetAdList = (props) => {
  // console.log('GetAdList-props', props);

  const [t] = useTranslation('translation');

  const [store, dispatch] = useStore();

  useEffect(() => {
    if (store.adStore.adList.length === 0) {
      getNearAdElementsHandler();
    }
  },[]);

  const getNearAdElementsHandler = async () => {
    try {
      const adsData = await getNearAdElements(ADNETWORK_URL, 'token');
      console.log(adsData);
      // setAdList(adsData.data.ads);

      let adList = adsData.data.ads;

      //// filter not end ads
      if (adList.length > 0) {
        adList = adList.filter(ad => {
          return ad.end > Date.now();
          // return ad.start < Date.now() && ad.end > Date.now();
        });
      }

      dispatch('SET_ADLIST', adList);
    } catch (err) {
      console.log(err);
    }
  };

  return (
  <Fragment></Fragment>);
}

export default GetAdList;