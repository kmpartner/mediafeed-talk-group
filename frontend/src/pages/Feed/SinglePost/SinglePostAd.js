import React, { Component, Fragment, useState, useEffect } from "react";
import { withI18n } from "react-i18next";
import Img from "react-cool-img";

import AdElementDisplay from "../../../components/GroupTalk/GroupAdElements/AdElememtDisplay/AdElementDisplay";
import GetWindowData from "../../../components/UI/getWindowData";

import { useStore } from "../../../hook-store/store";
// import "./FeedEdit.css";

const SinglePostAd = (props) => {
  // console.log('SinglePostAd.js-props', props);
  const { adPlaceId, postData } = props;

  const [store, dispatch] = useStore();

  console.log('store in SinglePostAd', store);

  // const [initialHeight, setInitialHeight] = useState(0);
  const [singlePostAdBody, setSinglePostAdBody] = useState();

  // useEffect(() => {
  //   if (store.windowValues && !initialHeight) {
  //     console.log('store.windowValues', store.windowValues);
  //     setInitialHeight(store.windowValues.height);
  //   }
  // },[store.windowValues]);


  // let singlePostAdBody;

  if (!singlePostAdBody) {
    setTimeout(() => {
      setSinglePostAdBody(<AdElementDisplay adType="inPosts" adPlaceId={adPlaceId} />)
    },1000*3);
  }

  // if (!singlePostAdBody && postData && postData.imageUrls.length === 0) {
  //     // setSinglePostAdBody(<AdElementDisplay adType="inPosts" adPlaceId={adPlaceId} />)
  
  //     setTimeout(() => {
  //       setSinglePostAdBody(<AdElementDisplay adType="inPosts" adPlaceId={adPlaceId} />)
  //     },1000*3);
  // } 

  // if (!singlePostAdBody && postData && postData.imageUrls.length > 0) {
  //     setTimeout(() => {
  //       setSinglePostAdBody(<AdElementDisplay adType="inPosts" adPlaceId={adPlaceId} />)
  //     },1000*3);
  // }
  

  return (
    <Fragment>
      {singlePostAdBody}
      {/* <AdElementDisplay adType="inPosts" adPlaceId={adPlaceId} /> */}
      

      {/* <GetWindowData setWindowValues={() => {}} />
      
      {store.windowValues && store.windowValues.height < 400 && (
        <AdElementDisplay adType="inPosts" adPlaceId={adPlaceId} />
      )}

      {store.windowValues &&
        store.windowValues.height >= 400 &&
        store.windowValues.scrollY > 0 && (
          <AdElementDisplay adType="inPosts" adPlaceId={adPlaceId} />
      )} */}


    </Fragment>
  );
};

export default withI18n()(SinglePostAd);
// export default FeedEdit;
