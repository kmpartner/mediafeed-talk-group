import React, { Fragment } from "react";
import { withI18n } from "react-i18next";

import Input from "../../../Form/Input/Input";

import { isImageFile } from "../../../../util/image";

import classes from "./AdItems.module.css";
// import "../FeedEdit.css";
// import "./ImagePreviewContents.css"

const AdItems = (props) => {
  // console.log("AdItems.js-props", props);
  const { ad, adType } = props;

  let body300x65;
  if (ad) {
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
              src={ad.adImageUrl}
              alt="300x65 image"
            ></img>
          </div>
        </div>
      </a>
    );
  }

  let body300x300;
  if (ad) {
    body300x300 = (
      <a className={classes.adLink}
        href={ad.linkUrl}
        target="_blank" rel="noopener noreferrer"
      >
       <div className={classes.body300x300Container}>
         <div>
           <img
             className={classes.body300x300Image}
             src={ad.adImageUrl}
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
  }
  
  let bodyInPosts;
  if (ad) {
    bodyInPosts = (
      <a className={classes.adLink}
        href={ad.linkUrl}
        target="_blank" rel="noopener noreferrer"
      >
        <div className={classes.bodyInPostContainer}>
          <div className={classes.bodyInPostContents}>
            <img
              className={classes.bodyInPostImageContainer}
              src={ad.adImageUrl}
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
  }



  let imagePreviewContentsBody;
  if (adType === '300x65') {
    imagePreviewContentsBody = (
        <div className={classes.bodyContainer}>
          {body300x65}
          {/* {body300x300} */}
          {/* {bodyInPosts} */}
        </div>
    );
  }

  if (adType === '300x300') {
    imagePreviewContentsBody = (
        <div className={classes.bodyContainer}>
          {/* {body300x65} */}
          {body300x300}
          {/* {bodyInPosts} */}
        </div>
    );
  }

  if (adType === 'inPosts') {
    imagePreviewContentsBody = (
        <div className={classes.bodyContainer}>
          {/* {body300x65} */}
          {/* {body300x300} */}
          {bodyInPosts}
        </div>
    );
  }
  

  return <Fragment>{imagePreviewContentsBody}</Fragment>;
};

export default withI18n()(AdItems);
