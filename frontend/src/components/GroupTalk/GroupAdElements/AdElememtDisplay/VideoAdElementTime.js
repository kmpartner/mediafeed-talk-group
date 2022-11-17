import React, { Fragment, useState, useEffect } from 'react';
// import { useTranslation } from 'react-i18next/hooks';

// import AdElementDisplay from './AdElementDisplay';
import VideoAdElementDisplay from './VideoAdElementDisplay';

const intervalTime = 1000 * 60 * 1;
const nextPlayDelay = 1000 * 10;

const VideoAdElementTime = (props) =>
{
	// console.log('AdElementTime-props', props);

	const { adType, adPlaceId } = props;

	// const [ t ] = useTranslation('translation');

	// const [ store, dispatch ] = useStore();
	// console.log('store-in AdElementDisplay.js', store);
	// const adList = store.adStore.adList;

	const [ adEl, setAdEl ] = useState();

  const [playState, setPlayState] = useState('');

	// const [ timerCount, setTimerCount ] = useState(0);

	// useEffect(() =>
	// {

	// 	const ele = (
	// 		<VideoAdElementDisplay
	// 			adType={adType}
	// 			adPlaceId={adPlaceId}
  //       setPlayState={setPlayState}
	// 		/>
	// 	);

	// 	setAdEl(ele);

	// 	const adInterval = setInterval(() =>
	// 	{
	// 		setAdEl(null);
	// 		setAdEl(ele);

	// 	}, intervalTime);

	// 	return () => clearInterval(adInterval);
	// }, []);

  useEffect(() => {
    // console.log('playState', playState);

    if (playState === 'ended') {
      setTimeout(() => {
        setAdEl(null);
      }, nextPlayDelay);
    }

  },[playState]);



  useEffect(() => {
    if (!adEl) {
      const ele = (
        <VideoAdElementDisplay
          adType={adType}
          adPlaceId={adPlaceId}
          setPlayState={setPlayState}
        />
      );

      setAdEl(ele);
    }
  },[adEl]);



	let adElementTimeBody;

	// eslint-disable-next-line prefer-const
	adElementTimeBody= (adEl);

	return (
		<Fragment>
			{adElementTimeBody}
		</Fragment>
	);
};

export default VideoAdElementTime;