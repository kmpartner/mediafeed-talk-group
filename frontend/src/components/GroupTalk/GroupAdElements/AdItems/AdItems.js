import React, { Fragment } from "react";
import { withI18n } from "react-i18next";

import RightContents from "../GroupRightElements/RightContents";
import TopBarContents from "../GroupTopElements/TopBarContents";

import GrayImage from '../../../../images/light-gray-square-300.jpg';

import classes from "./AdItems.module.css";
// import "../FeedEdit.css";
// import "./ImagePreviewContents.css"

const AdItems = (props) => {
  // console.log("AdItems.js-props", props);
  const { ad, adType, activeList } = props;

  let body300x65;
  if (ad && activeList && activeList.length > 0) {
    body300x65 = (
      <a className={classes.adLink}
        href={ad.linkUrl}
        target="_blank" rel="noopener noreferrer"
      >
        <div className={classes.body300x65Container}>
          <div className={classes.body300x65Text}>
            <div className={classes.body300x65TextContents}>
              <div className={classes.body300x65TextTitle}>
                {ad.title}
              </div>
              <div className={classes.body300x65TextDescription}>
                {ad.description}
              </div>
            </div>
          </div>
          <div>
            <img
              className={classes.body300x65Image}
              //  src={ad.adImageUrl}
              src={ad.adImageUrl ? ad.adImageUrl : GrayImage}
              alt="300x65 image"
            ></img>
          </div>
        </div>
      </a>
    );
  } 
  else {
    // some fallback

      body300x65 = (
      <a className={classes.groupTalkRightElementLink}
        href="https://remeet.watakura.xyz/your-room-from-above-link"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className={classes.groupTalkTopBarElementContainer}>
          <div className={classes.groupTalkTopBarElement}>
            <TopBarContents />
          </div>
        </div>
      </a>
    );
    

  }

  let body300x300;
  if (ad && activeList && activeList.length > 0) {
    body300x300 = (
      <a className={classes.adLink}
        href={ad.linkUrl}
        target="_blank" rel="noopener noreferrer"
      >
       <div className={classes.body300x300Container}>
         <div>
           <img
             className={classes.body300x300Image}
            //  src={ad.adImageUrl}
             src={ad.adImageUrl ? ad.adImageUrl : GrayImage}
             alt="300x300 image"
           ></img>
         </div>
         <div className={classes.body300x300TextContainer}>
           <span className={classes.body300x300TextTitle}>
             {ad.title}
           </span>
           <span className={classes.body300x300TextDescription}>
             {ad.description}
           </span>
         </div>
       </div>
     </a>
   );
  } else {
    // some fallback
    body300x300 = (
      <div className={classes.groupTalkRightElements}>
        <a className={classes.groupTalkRightElementLink} 
          href="https://remeet.watakura.xyz/your-room-from-above-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          <RightContents />
        </a>
      </div>
    );
  }
  
  let bodyInPosts;
  if (ad && activeList && activeList.length > 0) {
    bodyInPosts = (
      <a className={classes.adLink}
        href={ad.linkUrl}
        target="_blank" rel="noopener noreferrer"
      >
        <div className={classes.bodyInPostContainer}>
          <div className={classes.bodyInPostContents}>
            <img
              className={classes.bodyInPostImageContainer}
              // src={ad.adImageUrl}
              src={ad.adImageUrl ? ad.adImageUrl : GrayImage}
              alt="inPosts-image"
            ></img>
            <div className={classes.bodyInPostTextContainer}>
                <div className={classes.bodyInPostTextTitle}>
                  {ad.title}
                </div>
                <div className={classes.bodyInPostTextDescription}>
                  {ad.description}
                </div>
            </div>
          </div>
        </div>
      </a>
    );
  } else {
    // some fallback
    bodyInPosts = (
      <a className={classes.groupTalkRightElementLink}
      href="https://remeet.watakura.xyz/your-room-from-above-link"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className={classes.groupTalkTopBarElementContainer}>
        <div className={classes.groupTalkTopBarElement}>
          <TopBarContents />
        </div>
      </div>
    </a>
    )
  }



  let adItemsBody;
  if (adType === '300x65') {
    adItemsBody = (
        <div className={classes.topAdElementContainer}>
          {body300x65}
        </div>
    );
  }

  if (adType === '300x300') {
    adItemsBody = (
      <div className={classes.rightAdsContainer}>
        <div className={classes.rightAdsItem}>
          {body300x300}
        </div>
      </div>
    );
  }

  if (adType === 'inPosts') {
    adItemsBody = (
        <div className={classes.inPostsAdElementContainer}>
          {bodyInPosts}
        </div>
    );
  }

  if (adType === 'feedList' && activeList.length > 0) {
    adItemsBody = (
        <div className={classes.inPostsAdElementContainer}>
          {bodyInPosts}
        </div>
    );
  }
  

  return <Fragment>{adItemsBody}</Fragment>;
};

export default withI18n()(AdItems);
