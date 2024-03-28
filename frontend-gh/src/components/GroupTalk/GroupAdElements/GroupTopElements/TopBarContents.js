import React from "react";
import { Fragment, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next/hooks";

import Loader from "../../../Loader/Loader";
import { storeClickData } from "../../../../util/ad-visit";

import classes from "./TopBarContents.module.css";

import remeetImage1 from "../../../../images/webinar-100.png";
// import remeetImage2 from "../../../images/remeet-crop2-100.png";

const TopBarContents = (props) => {
  // console.log('GroupTalkTextList-props', props);

  const [t] = useTranslation("translation");

  // const myContainer = useRef(null);

  // useEffect(() => {
  //   // const abcd = document.getElementById('abcd');
  //   // console.log('abcd', abcd);
  //   myContainer.current.setAttribute('testType', 'topBar300x65');
  //   console.log("myContainer..", myContainer.current, myContainer.current.id);
  // },[]);

  let topBarContentsBody;

  topBarContentsBody = (
    <div
      className={classes.topBarContentsContainer}
      // id='remeetTopbar-123321'
      // ref={myContainer}
      // onClick={() => {
      //   storeClickData(
      //     'http://localhost:4000',
      //     'token',
      //     `${myContainer.current.id}`,
      //     `${myContainer.current.getAttribute('testType')}`,
      //     'https://test.site',
      //   );
      // }}
    >
      <span className={classes.topBarContentsLeft}>
        <span>
          <a className={classes.groupTalkRightElementLink}
            style={{fontWeight:"bolder"}}
            href="https://remeet.watakura.xyz/your-room-from-above-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div>REMEET - Web Meeting</div>
            <div style={{fontSize:'0.8rem', fontWeight:"bold"}}>
              Simple Remote Video Talk
            </div>
          </a>
        </span>
        <span>
          <a className={classes.groupTalkRightElementLink}
            style={{fontSize:'0.8rem', fontWeight:"bold"}}
            href="https://bookremeet.spaceeight.net/trial-information"
            target="_blank"
            rel="noopener noreferrer"
          >
            Free Trial Subscription for 30 days
          </a>
        </span>
      </span>
      <span className={classes.topBarContentsImage}>
        <a
          href="https://remeet.watakura.xyz/your-room-from-above-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={remeetImage1} alt="pic" height="65px" />
        </a>
        {/* <img src={remeetImage2} alt="pic" height="35px" /> */}
      </span>
    </div>
  );

  return <Fragment>{topBarContentsBody}</Fragment>;
};

export default TopBarContents;
