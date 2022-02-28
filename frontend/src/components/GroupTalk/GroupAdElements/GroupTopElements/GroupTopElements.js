import React from 'react';
import { Fragment, useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next/hooks';


import Loader from '../../../Loader/Loader';
import TopBarContents from './TopBarContents';
import RightContents from '../GroupRightElements/RightContents';

import AdItems from '../AdItems/AdItems';
import GetAdList from '../GetAdList/GetAdList';

import { storeClickData, getNearAdElements } from '../../../../util/ad-visit';
import { useStore } from '../../../../hook-store/store';

import { ADNETWORK_URL } from '../../../../App';

import classes from './GroupTopElements.module.css';

// import remeetImage1 from '../../../images/webinar-100.png';
// import remeetImage2 from '../../../images/remeet-crop2-100.png';

const GroupTopElements = (props) => {
  // console.log('GroupTopElements-props', props);

  const { adElementId, adType } = props;

  const currentUrl = new URL(window.location.href);
  const queryParams = currentUrl.searchParams;
  const roomIdParam = queryParams.get('groupRoomId');
  // console.log('queryParams', queryParams.get('groupRoomId'));

  const [t] = useTranslation('translation');

  const topElementRef = useRef(null);

  const [store, dispatch] = useStore();
  console.log('store-in groupTopElements.js', store);

  
  // const [adList, setAdList] = useState([]);
  const adList = store.adStore.adList;

  const activeList = adList.filter(ad => {
    return ad.start < Date.now() && ad.end > Date.now();
  });
  console.log('activeList', activeList);


  const createDisplayAdElement = (list) => {

    //// weight, other factors filter...
    const randomIndex = Math.floor(Math.random() * list.length);
    const randomValue = list[randomIndex];

    return randomValue;
  };

  const displayAdElement = createDisplayAdElement(activeList);

  // console.log('randomIndex, randomValue', randomIndex, randomValue);

  // useEffect(() => {
  //   if (topElementRef) {
  //     // topElementRef.current.setAttribute('adType', 'topBar300x65');
  //     // console.log("topElementRef..", topElementRef.current, topElementRef.current.id);
  //   }

  // },[]);

  // useEffect(() => {
  //   // if (window.innerWidth <= 768) {
  //   //   getNearAdElementsHandler();
  //   // }
  //   if (store.adStore.adList.length === 0) {
  //     getNearAdElementsHandler();
  //   }
  // },[]);

  // const getNearAdElementsHandler = async () => {
  //   try {
  //     const adsData = await getNearAdElements(ADNETWORK_URL, 'token');
  //     console.log(adsData);
  //     // setAdList(adsData.data.ads);

  //     dispatch('SET_ADLIST', adsData.data.ads);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  let rightElementsBody;

  rightElementsBody = (
    <div>
      {!roomIdParam && activeList.length === 0 && (
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
      )}
      
      {!roomIdParam && activeList.length > 0 && (
        <div className={classes.topAdElementContainer}
          // onClick={() => storeClickData(ADNETWORK_URL, 'token', adList[2].adElementId, 'some-placeId', '300x65')}
        > 
          <AdItems 
            ad={adList[0]} 
            // ad={displayAdElement}
            adType={adType ? adType : '300x65'} />
        </div>
      )}

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
    <Fragment>
      <GetAdList />
      {rightElementsBody}
      </Fragment>
  );
}

export default GroupTopElements;