import React from 'react';
import { Fragment, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next/hooks';


// import Loader from '../../../Loader/Loader';
// import TopBarContents from '../GroupTopElements/TopBarContents';
import RightContents from './RightContents';
import AdItems from '../AdItems/AdItems';
import GetAdList from '../GetAds/GetAdList';

import { storeClickData, getNearAdElements, createDisplayAd } from '../../../../util/ad-visit';
import { useStore } from '../../../../hook-store/store';

import { ADNETWORK_URL } from '../../../../App';

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

  const [store, dispatch] = useStore();

  const adList = store.adStore.adList;

  const [isLoading, setIsLoading] = useState(true);
  
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
  // console.log('activeList', activeList);


  const displayAd = createDisplayAd(activeList);


  let rightElementsBody;
  if (isLoading) {
    rightElementsBody = <div>...loading...</div>;
  }
  else {
    rightElementsBody = (
      <div className={classes.rightAdsContainer}>
        <GetAdList />
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
        {adList.length === 0 ? (
            <div className={classes.groupTalkRightElements}>
              <a className={classes.groupTalkRightElementLink} 
                href="https://remeet.watakura.xyz/your-room-from-above-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <RightContents />
              </a>
            </div>
          )
        : 
          (
            <section>
              <div className={classes.rightAdsItem}>
                <AdItems 
                  ad={displayAd} 
                  adType='300x300' 
                />
              </div>
            {window.innerHeight > 800 && (
              <div className={classes.rightAdsItem}>
                <AdItems 
                  ad={displayAd} 
                  adType='300x300' 
                />
              </div>
            )}
            </section>
          )
        }
      </div>
    );
  }

  return (
    <Fragment>
      {rightElementsBody}
    </Fragment>
  );
}

export default GroupRightElements;