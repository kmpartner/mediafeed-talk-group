import React from "react";
import { Fragment, useState, useEffect } from "react";
import { useTranslation } from "react-i18next/hooks";

import Loader from "../../../Loader/Loader";
import { makeQrcode } from "../../../../util/image";

import classes from "./RightContents.module.css";

import remeetImage1 from "../../../../images/webinar-100.png";
import remeetImage2 from "../../../../images/remeet-crop2-100.png";
// import remeetUrlQrcode from '../../../images/remeet-url-qrcode.png';

const RightContents = (props) => {
  // console.log('GroupTalkTextList-props', props);

  const [t] = useTranslation("translation");

  const [qrImageData, setQrImageData] = useState();

  useEffect(() => {
    makeQrcodeHandler('https://remeet.watakura.xyz')
  },[]);

  const makeQrcodeHandler = (textData) => {
    makeQrcode(textData)
      .then(data => {
        // console.log(data);
        setQrImageData(data);
      })
      .catch(err => {
        console.error(err);
      });
  }



  let rightContentsBody;

  rightContentsBody = (
    <div style={{padding:"0.25rem"}}>
      
      <div className={classes.rightContentsTitle}
      // style={{ fontSize: "1.5rem", textAlign: "center" }}
      >
        REMEET
      </div>
      <div className={classes.rightContentsText}>
        Simple Video Meeting</div>
      <div className={classes.rightContentsText}>
        Remote Talk with Chat & Screen Share
      </div>
      <div className={classes.rightContentsImageContainer}>
          <img
            className={classes.rightContentsImage}
            src={remeetImage1}
            alt="pic"
            height="100px"
          />
          <img
            className={classes.rightContentsImage}
            src={remeetImage2}
            alt="pic"
            height="100px"
          />
      </div>
      <div className={classes.rightContentsText}>
        <a
          className={classes.groupTalkRightElementLink}
          href="https://bookremeet.spaceeight.net/trial-information"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div>
            Start Your Next Web Meeting
          </div>
          <div>
            Free Trial Subscription for 30 days
          </div>
        </a>
      </div>
      <div className={classes.groupTalkRightElementLinkContainer}>
        <div className={classes.rightContentsText}>
          <a
            className={classes.groupTalkRightElementLink}
            href="https://remeet.watakura.xyz/your-room-from-above-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://remeet.watakura.xyz
          </a>
        </div>
        <div>
          {/* <img src={remeetUrlQrcode} alt='remmetqrcode' height='50' /> */}
          <img src={qrImageData} alt='remmetqrcode' height='50' />
        </div>
      </div>
    </div>
  );

  return <Fragment>{rightContentsBody}</Fragment>;
};

export default RightContents;
