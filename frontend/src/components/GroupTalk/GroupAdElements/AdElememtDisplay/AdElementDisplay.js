import React from 'react';
import { Fragment, useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next/hooks';


import Loader from '../../../Loader/Loader';
// import TopBarContents from '../GroupTopElements/TopBarContents';
// import RightContents from '../GroupRightElements/RightContents';

import AdItems from '../AdItems/AdItems';
// import GetAdList from '../GetAds/GetAdList';

import { storeClickData, getNearAdElements, createDisplayAd } from '../../../../util/ad-visit';
import { useStore } from '../../../../hook-store/store';

// import { ADNETWORK_URL } from '../../../../App';

// import classes from './GroupTopElements.module.css';

const AdElementDisplay = (props) => {
  // console.log('GroupTopElements-props', props);

  const { adElementId, adType } = props;

  const currentUrl = new URL(window.location.href);
  const queryParams = currentUrl.searchParams;
  const roomIdParam = queryParams.get('groupRoomId');
  // console.log('queryParams', queryParams.get('groupRoomId'));

  const [t] = useTranslation('translation');

  const topElementRef = useRef(null);

  const [store, dispatch] = useStore();
  console.log('store-in AdElementDisplay.js', store);
  const adList = store.adStore.adList;

  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000* 60);

    if (adList.length > 0) {
      setIsLoading(false);
    }
  },[adList]);



  const activeList = adList.filter(ad => {
    return ad.start < Date.now() && ad.end > Date.now();
  });
  console.log('activeList', activeList);


  const displayAd = createDisplayAd(activeList);


  let adElementDisplayBody;

  adElementDisplayBody = (
    <AdItems 
      // ad={adList[0]} 
      ad={displayAd}
      // adType={adType ? adType : '300x65'} 
      adType={adType} 
      // roomIdParam={roomIdParam}
      activeList={activeList}
    />
  );

  // if (isLoading) {
  //   adElementDisplayBody = <div>...loading...</div>;
  // }
  // if (isLoading && !roomIdParam) {
  //   adElementDisplayBody = (
  //     <AdItems 
  //       // ad={adList[0]} 
  //       ad={displayAd}
  //       adType={adType ? adType : '300x65'} 
  //       // roomIdParam={roomIdParam}
  //       activeList={activeList}
  //   />
  //   );
  // }
  // else {
  //   adElementDisplayBody = (
  //     <div>
  //       <GetAdList />
  //       {/* {!roomIdParam && activeList.length === 0 && (
  //         <a className={classes.groupTalkRightElementLink}
  //           id={adElementId}
  
  //           href="https://remeet.watakura.xyz/your-room-from-above-link"
  //           target="_blank"
  //           rel="noopener noreferrer"
  //         >
  //           <div className={classes.groupTalkTopBarElementContainer}>
  //             <div className={classes.groupTalkTopBarElement}>
  //               <TopBarContents />
  //             </div>
  //           </div>
  //         </a>
  //       )} */}
        
  //       {/* {!roomIdParam && activeList.length > 0 && ( */}
  //       {!roomIdParam && (
  //         <div
  //           // onClick={() => storeClickData(ADNETWORK_URL, 'token', adList[2].adElementId, 'some-placeId', '300x65')}
  //         > 
  //           <AdItems 
  //             // ad={adList[0]} 
  //             ad={displayAd}
  //             adType={adType ? adType : '300x65'} 
  //             // roomIdParam={roomIdParam}
  //             activeList={activeList}
  //           />
  //         </div>
  //       )}
  
  //     </div>
  //   );
  // }

  return (
    <Fragment>
      {adElementDisplayBody}
    </Fragment>
  );
}

export default AdElementDisplay;