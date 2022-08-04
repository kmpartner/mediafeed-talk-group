import React, { Fragment, useState, useEffect } from 'react';
// import { useTranslation } from 'react-i18next/hooks';

import AdElementDisplay from './AdElementDisplay';

const intervalTime = 1000 * 60 * 1;


const AdElementTime = (props) =>
{
	// console.log('AdElementTime-props', props);

	const { adType, adPlaceId } = props;

	// const [ t ] = useTranslation('translation');

	// const [ store, dispatch ] = useStore();
	// console.log('store-in AdElementDisplay.js', store);
	// const adList = store.adStore.adList;

	const [ adEl, setAdEl ] = useState();
	// const [ timerCount, setTimerCount ] = useState(0);

	useEffect(() =>
	{

		const ele = (
			<AdElementDisplay
				adType={adType}
				adPlaceId={adPlaceId}
			/>
		);

		setAdEl(ele);

		const adInterval = setInterval(() =>
		{
			setAdEl(null);
			setAdEl(ele);

		}, intervalTime);

		return () => clearInterval(adInterval);
	}, []);

	// useEffect(() =>
	// {
	// 	const ele = (
	// 		<AdElementDisplay
	// 			adType={adType}
	// 			adPlaceId={adPlaceId}
	// 			// timerCount={0}
	// 		/>
	// 	);

	// 	setAdEl(ele);

	// 	const ele2 = (
	// 		<AdElementDisplay
	// 			adType={adType}
	// 			adPlaceId={adPlaceId}
	// 			timeCount={1}
	// 		/>
	// 		// <div style={{ color: 'white' }}>ele2</div>
	// 	);

	// 	const ele3 = (
	// 		<AdElementDisplay
	// 			adType={adType}
	// 			adPlaceId={adPlaceId}
	// 			timeCount={2}
	// 		/>
	// 		// <div style={{ color: 'white' }}>ele2</div>
	// 	);

	// 	// setTimeout(() =>
	// 	// {
	// 	// 	setAdEl(ele2);
	// 	// }, 10000);

	// 	// setTimeout(() =>
	// 	// {
	// 	// 	setAdEl(ele3);
	// 	// }, 15000);
	// }, []);

	let adElementTimeBody;

	// eslint-disable-next-line prefer-const
	adElementTimeBody= (adEl);

	return (
		<Fragment>
			{adElementTimeBody}
		</Fragment>
	);
};

export default AdElementTime;