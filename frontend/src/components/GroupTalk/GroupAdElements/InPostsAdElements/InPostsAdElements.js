import React from 'react';
import { Fragment, useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next/hooks';


import Loader from '../../../Loader/Loader';
// import TopBarContents from './TopBarContents';
// import RightContents from '../GroupRightElements/RightContents';

import AdItems from '../AdItems/AdItems';
import GetAdList from '../GetAds/GetAdList';

import { storeClickData, getNearAdElements, createDisplayAd } from '../../../../util/ad-visit';
import { useStore } from '../../../../hook-store/store';

import { ADNETWORK_URL } from '../../../../App';

import classes from './InPostsAdElements.module.css';

// import remeetImage1 from '../../../images/webinar-100.png';
// import remeetImage2 from '../../../images/remeet-crop2-100.png';

const InPostsAdElements = (props) => {
  // console.log('GroupTopElements-props', props);

  const { adElementId, adType } = props;

  const currentUrl = new URL(window.location.href);
  const queryParams = currentUrl.searchParams;
  const roomIdParam = queryParams.get('groupRoomId');
  // console.log('queryParams', queryParams.get('groupRoomId'));

  const [t] = useTranslation('translation');

  const topElementRef = useRef(null);

  const [store, dispatch] = useStore();

  const [isLoading, setIsLoading] = useState(true);
  // const [adList, setAdList] = useState([]);
  const adList = store.adStore.adList;

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000* 10);

    // if (adList.length > 0) {
    //   setIsLoading(false);
    // }
  },[adList]);

  useEffect(() => {
    if (adList.length > 0) {
      setIsLoading(false);
    }
  },[adList]);


  const activeList = adList.filter(ad => {
    return ad.start < Date.now() && ad.end > Date.now();
  });
  console.log('activeList', activeList);


  const displayAd = createDisplayAd(activeList);

  let inPostsElementBody;

  if(isLoading) {
    inPostsElementBody = <div>...Loading...</div>
  } else {
    inPostsElementBody = (
      <div>
        <GetAdList />
        {!roomIdParam && activeList.length === 0 && (
          <div></div>
          // <a className={classes.groupTalkRightElementLink}
          //   id={adElementId}
  
          //   href="https://remeet.watakura.xyz/your-room-from-above-link"
          //   target="_blank"
          //   rel="noopener noreferrer"
          // >
          //   <div className={classes.groupTalkTopBarElementContainer}>
          //     <div className={classes.groupTalkTopBarElement}>
          //       <TopBarContents />
          //     </div>
          //   </div>
          // </a>
        )}
        
        {!roomIdParam && activeList.length > 0 && (
          <div className={classes.inPostsAdElementContainer}
            // onClick={() => storeClickData(ADNETWORK_URL, 'token', adList[2].adElementId, 'some-placeId', '300x65')}
          > 
            <AdItems 
              ad={displayAd} 
              adType={adType ? adType : 'inPosts'} 
            />
          </div>
        )}
  
      </div>
    );
  }

  return (
    <Fragment>
      {inPostsElementBody}
      </Fragment>
  );
}

export default InPostsAdElements;