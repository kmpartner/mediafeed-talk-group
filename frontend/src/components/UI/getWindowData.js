// import { useContext } from 'react';
import React from 'react';
import { Fragment, useEffect } from 'react';
import Bowser from "bowser";

import { useWindowDimensions } from '../../custom-hooks/useWindowDimensions';

import { useStore } from '../../hook-store/store';

// import classes from './notification.module.css';
// import NotificationContext from '../../store/notification-context';

function GetWindowData(props) {
  // const notificationCtx = useContext(NotificationContext);
  
  const { setWindowValues } = props;

  const { height, width, scrollX, scrollY } = useWindowDimensions();
  // console.log(useWindowDimensions());
  const [store, dispatch] = useStore();

  useEffect(() => {

    const values = {
      height: height,
      width: width,
      scrollX: scrollX,
      scrollY: scrollY,
    };
    // console.log('height, width in GetWindowData', height, width);
    setWindowValues(values);
    dispatch('SET_WINDOW_VALUES', values);
    
  },[height, width]);

  useEffect(() => {
    const browser = Bowser.getParser(window.navigator.userAgent);
    dispatch('SET_BOWSERDATA', browser.parsedResult);
  },[]);


  // const [store, dispatch] = useStore();
  // // console.log(store);

  return (
    <Fragment></Fragment>
  );
}

export default GetWindowData;