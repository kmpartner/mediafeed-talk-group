import React from 'react';
import { Fragment, useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next/hooks';


import Loader from '../../../Loader/Loader';
import TopBarContents from './TopBarContents';
import RightContents from '../GroupRightElements/RightContents';

import { storeClickData } from "../../../../util/ad-visit";

import classes from './GroupTopElements.module.css';

// import remeetImage1 from '../../../images/webinar-100.png';
// import remeetImage2 from '../../../images/remeet-crop2-100.png';

const GroupTopElements = (props) => {
  // console.log('GroupTopElements-props', props);

  const { adElementId } = props;

  const currentUrl = new URL(window.location.href);
  const queryParams = currentUrl.searchParams;
  const roomIdParam = queryParams.get('groupRoomId');
  // console.log('queryParams', queryParams.get('groupRoomId'));

  const [t] = useTranslation('translation');

  const topElementRef = useRef(null);

  useEffect(() => {
    if (topElementRef) {
      // topElementRef.current.setAttribute('adType', 'topBar300x65');
      // console.log("topElementRef..", topElementRef.current, topElementRef.current.id);
    }

  },[]);

  let rightElementsBody;

  rightElementsBody = (
    <div>
      {!roomIdParam &&
            <a className={classes.groupTalkRightElementLink}
              id={adElementId}

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
      }

      {/* <div className={classes.groupTalkRightElements}>
        <a className={classes.groupTalkRightElementLink} 
          href="https://remeet.watakura.xyz"
          target="_blank"
          rel="noopener noreferrer"
        >
          <RightContents />
        </a>
      </div> */}

      {/* <div className={classes.groupTalkRightElements2}
        >
        aaa-bbb-ccc-content
      </div> */}
    
      



      
      
    </div>
  );

  return (
    <Fragment>{rightElementsBody}</Fragment>
  );
}

export default GroupTopElements;