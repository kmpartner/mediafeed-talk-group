import React from 'react';
import { Fragment, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next/hooks';


import Loader from '../../../Loader/Loader';
// import TopBarContents from './TopBarContents';
// import RightContents from '../GroupRightElements/RightContents';

// import AdItems from '../AdItems/AdItems';

import { getNearAdElements } from '../../../../util/ad-visit';
import { useStore } from '../../../../hook-store/store';

import { ADNETWORK_URL } from '../../../../App';

// import classes from './InPostsAdElements.module.css';

// import remeetImage1 from '../../../images/webinar-100.png';
// import remeetImage2 from '../../../images/remeet-crop2-100.png';

const GetAdList = (props) => {
  // console.log('GetAdList-props', props);

  // const { adElementId, adType } = props;

  // const currentUrl = new URL(window.location.href);
  // const queryParams = currentUrl.searchParams;
  // const roomIdParam = queryParams.get('groupRoomId');
  // console.log('queryParams', queryParams.get('groupRoomId'));

  const [t] = useTranslation('translation');

  // const topElementRef = useRef(null);

  const [store, dispatch] = useStore();

  // const [adList, setAdList] = useState([]);
  // const adList = store.adStore.adList;

  useEffect(() => {
    // if (window.innerWidth <= 768) {
    //   getNearAdElementsHandler();
    // }
    if (store.adStore.adList.length === 0) {
      getNearAdElementsHandler();
    }
  },[]);

  const getNearAdElementsHandler = async () => {
    try {
      const adsData = await getNearAdElements(ADNETWORK_URL, 'token');
      console.log(adsData);
      // setAdList(adsData.data.ads);

      dispatch('SET_ADLIST', adsData.data.ads);
    } catch (err) {
      console.log(err);
    }
  };

  return (<Fragment></Fragment>);
}

export default GetAdList;