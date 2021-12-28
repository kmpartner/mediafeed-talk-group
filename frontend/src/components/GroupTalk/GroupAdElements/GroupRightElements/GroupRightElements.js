import React from 'react';
import { Fragment, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next/hooks';


// import Loader from '../../../Loader/Loader';
// import TopBarContents from '../GroupTopElements/TopBarContents';
import RightContents from './RightContents';

import classes from './GroupRightElements.module.css';

// import remeetImage1 from '../../../images/webinar-100.png';
// import remeetImage2 from '../../../images/remeet-crop2-100.png';

const GroupRightElements = (props) => {
  // console.log('GroupTalkTextList-props', props);

  const currentUrl = new URL(window.location.href);
  const queryParams = currentUrl.searchParams;
  const roomIdParam = queryParams.get('groupRoomId');
  // console.log('queryParams', queryParams.get('groupRoomId'));

  const [t] = useTranslation('translation');

  let rightElementsBody;

  rightElementsBody = (
    <div>
      {/* {!roomIdParam &&
        <div className={classes.groupTalkTopBarElementContainer}>
          <div className={classes.groupTalkTopBarElement}>
            <a className={classes.groupTalkRightElementLink} 
              href="https://remeet.watakura.xyz"
              target="_blank"
              rel="noopener noreferrer"
            >
            <TopBarContents />
            </a>
          </div>
        </div>
      } */}

      <div className={classes.groupTalkRightElements}>
        <a className={classes.groupTalkRightElementLink} 
          href="https://remeet.watakura.xyz/your-room-from-above-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          <RightContents />
        </a>
      </div>

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

export default GroupRightElements;