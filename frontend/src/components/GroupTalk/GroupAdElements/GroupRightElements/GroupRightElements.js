import React from 'react';
import { Fragment, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next/hooks';


// import Loader from '../../../Loader/Loader';
// import TopBarContents from '../GroupTopElements/TopBarContents';
import RightContents from './RightContents';
import AdItems from '../AdItems/AdItems';
import GetAdList from '../GetAdList/GetAdList';

import { storeClickData, getNearAdElements } from '../../../../util/ad-visit';
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

  // const [adList, setAdList] = useState([]);
  const adList = store.adStore.adList;

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
    <div className={classes.rightAdsContainer}>
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
              <AdItems ad={adList[2]} adType='300x300' />
            </div>
          {window.innerHeight > 800 && (
            <div className={classes.rightAdsItem}>
              <AdItems ad={adList[0]} adType='300x300' />
            </div>
          )}
          </section>
        )
      }


       

    
      



      
      
    </div>
  );

  return (
    <Fragment>
      <GetAdList />
      {rightElementsBody}
    </Fragment>
  );
}

export default GroupRightElements;