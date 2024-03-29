import React from "react";
import { Fragment, useState, useEffect } from "react";
import { useTranslation } from "react-i18next/hooks";

import GetAdList from "./GetAdList";

// import { getNearAdElements } from "../../../../util/ad-visit";
import { useStore } from "../../../../hook-store/store";
import * as adVisitUtils from "../../../../util/ad-visit"
import { ADNETWORK_URL, BASE_URL } from "../../../../App";

const GetAd = (props) => {
  // console.log('GetAdList-props', props);
  const [t] = useTranslation("translation");

  const [store, dispatch] = useStore();
  // console.log('store GetAd.js', store);

  const [isTimerStart, setIsTimerStart] = useState(false);
  // const [timerTime, setTimerTime] = useState(0);

  useEffect(() => {
    const adTestGet = async() => {
      const result = await fetch(BASE_URL + '/ad/test-get');

      const resData = await result.json();
      console.log(resData, result);
    };

    // adTestGet();
  },[]);

  // useEffect(() => {
  //   setTimeout(() => {
  //     if (store.adStore.adList.length === 0) {
  //       getNearAdElementsHandler();
  //     }
  //   }, 1000 * 60);
  // }, []);

  useEffect(() => {
    if (!isTimerStart && store.bowserData) {
      setIsTimerStart(true);

      setInterval(() => {
        // setTimerTime(Date.now());
        getNearAdElementsHandler();
      }, 1000 * 60 * 15);
    }
  }, [store.bowserData]);

  // useEffect(() => {
  //   console.log('timerTime', timerTime);
  //   const lastGetTime = store.adStore.adListGetDate;
  //   console.log('adListGetDate', lastGetTime);
  //   if (lastGetTime && (timerTime - lastGetTime) > 1000 * 60 * 15) {
  //     console.log("15min");
  //     // getNearAdElementsHandler();
  //   }

  // },[timerTime]);

  const getNearAdElementsHandler = async () => {
    try {
      // const adsData = await getNearAdElements(ADNETWORK_URL, "token");
      const adsData = await adVisitUtils.getNearAdElements(ADNETWORK_URL, "token");
      console.log(adsData);
      // setAdList(adsData.data.ads);

      let adList = adsData.data.ads;

      const deviceType = store.bowserData.platform.type;

      // console.log('adList before filter', adList);

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

      // console.log('adList', adList);

      dispatch("SET_ADLIST", adList);
    } catch (err) {
      console.log(err);
    }
  };


  return (
    <Fragment>
      <GetAdList />
    </Fragment>
  );
};

export default GetAd;
