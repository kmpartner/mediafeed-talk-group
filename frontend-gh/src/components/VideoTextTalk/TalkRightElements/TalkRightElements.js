import React from 'react';
import { Fragment, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next/hooks';

import Loader from '../../Loader/Loader';

import TopBarContents from '../../GroupTalk/GroupAdElements/GroupTopElements/TopBarContents';
import RightContents from '../../GroupTalk/GroupAdElements/GroupRightElements/RightContents';

// import GroupTalkTextItem from './GroupTalkTextItem';
import classes from './TalkRightElements.module.css';

const TalkRightElements = (props) => {
  // console.log('GroupTalkTextList-props', props);
  const { 
    showNoconnectTextTalk,
    userSocketId
   } = props;

  // const currentUrl = new URL(window.location.href);
  // const queryParams = currentUrl.searchParams;
  // const roomIdParam = queryParams.get('groupRoomId');
  // console.log('queryParams', queryParams.get('groupRoomId'));

  const [t] = useTranslation('translation');

  let rightElementsBody;

  rightElementsBody = (
    <div>
      {!showNoconnectTextTalk && userSocketId 
        &&
        <div className={classes.talkTopBarElementContainer}>
          <div className={classes.talkTopBarElement}>
            <TopBarContents />
          </div>
        </div>
      }

      <div className={classes.talkRightElements}>
        <a className={classes.talkRightElementLink} 
            href="https://remeet.watakura.xyz"
            target="_blank"
            rel="noopener noreferrer"
          >
          <RightContents />
        </a>
      </div>
    </div>
  );

  return (
    <Fragment>{rightElementsBody}</Fragment>
  );
}

export default TalkRightElements;