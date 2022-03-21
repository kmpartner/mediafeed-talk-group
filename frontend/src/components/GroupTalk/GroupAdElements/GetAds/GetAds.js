import React from "react";
import { Fragment, useState, useEffect } from "react";
import { useTranslation } from "react-i18next/hooks";

import GetAdList from "./GetAdList";

// import { getNearAdElements } from "../../../../util/ad-visit";
import { useStore } from "../../../../hook-store/store";
import * as adVisitUtils from "../../../../util/ad-visit"
import { ADNETWORK_URL } from "../../../../App";

const GetAd = (props) => {
  // console.log('GetAdList-props', props);
  const [t] = useTranslation("translation");

  const [store, dispatch] = useStore();
  // console.log('store GetAd.js', store);

  const [isTimerStart, setIsTimerStart] = useState(false);
  // const [timerTime, setTimerTime] = useState(0);

  // useEffect(() => {
  //   setTimeout(() => {
  //     if (store.adStore.adList.length === 0) {
  //       getNearAdElementsHandler();
  //     }
  //   }, 1000 * 60);
  // }, []);

  useEffect(() => {
    if (!isTimerStart) {
      setIsTimerStart(true);

      setInterval(() => {
        // setTimerTime(Date.now());
        getNearAdElementsHandler();
      }, 1000 * 60 * 15);
    }
  }, []);

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

      //// filter not end ads
      if (adList.length > 0) {
        adList = adList.filter((ad) => {
          return ad.end > Date.now();
          // return ad.start < Date.now() && ad.end > Date.now();
        });
      }

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
