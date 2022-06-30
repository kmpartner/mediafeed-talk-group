import React from 'react';
import { useEffect, useState, Fragment } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { useTranslation } from 'react-i18next/hooks';

import Button from '../../components/Button/Button';
import Loader from '../../components/Loader/Loader';
import { useStore } from '../../hook-store/store';

import classes from './LiveEmbed.module.css';
// import './NotPageFound.css';


const LiveEmbed = props => {
  // console.log('need-to-login-props', props);
  const { liveEmbedUrl, start, end, uid } = props;

  // const liveEmbedUrl ='http://localhost:4444/embedlive/testroomid/testroomid';

  const [t] = useTranslation('translation');

  const [store, dispatch] = useStore();

  // console.log('store in NotPageFound.js', store);
  // const [videoEl, setVideoEl] = useState();
  
  let iframeStyle = {
    width: '100%',
    height: `${window.innerWidth*20/16}px`,
    borderRadius: '2px',
    // border: '3px solid red',
  };

  if (window.innerWidth > 768) {
    iframeStyle = {
      width: '100%',
      maxWidth: '40rem',
      height: `${(window.innerWidth-320)*14/16}px`,
      borderRadius: '6px',
      // border: '3px solid red',

    }
  }



  useEffect(() => {
  },[]);


  const delay = ms => new Promise((resolve, reject) => setTimeout(resolve, ms));

  async function access() {
    while (true) {
      const videoExist = addVideoTag();

      if (videoExist) {
        break;
      }
  
      await delay(5000);
    }
 }

 const addVideoTag = () => {
  // var iframe = document.getElementById("iframe");
  // // iframe.contentWindow.postMessage({postMessage: 'postMessage-message'}, '*');
  
  // let videoExist = false;

  // console.log('iframe', iframe);
  // var innerDoc = iframe.contentDocument || iframe.contentWindow.document;
  // console.log('iframe', innerDoc.body);
  // const navEl = innerDoc.getElementsByTagName("nav")[0];
  // const videoEls = innerDoc.getElementsByTagName('video');
  // console.log('iframe navEl', navEl, typeof(navEl));
  // console.log('iframe videoEls', videoEls);
  // console.log('iframe logoid', navEl.getElementsByTagName('div'));
  
  // if (videoEls && videoEls.length > 0) {
  //   videoExist = true;

  //   iframe.contentWindow.postMessage('postMessage-message2', '*');
  //   // const navShowEl = document.getElementById('navshow');
  //   // navShowEl.appendChild(videoEls[0]);

  // }
  // return videoExist;
 }


  return (
    <Fragment>

      <div className={classes.liveContainer}>
        <div>
          start-time: {new Date(start).toLocaleString()}, 
          end-time: {new Date(end).toLocaleString()}
          {/* uid: {uid} */}
        </div>
        {/* <iframe src="https://www.youtube.com/embed/cWDJoK8zw58"></iframe> */}
        <iframe style={iframeStyle} id='iframe' src={liveEmbedUrl} onLoad={() => {}}></iframe>
        {/* <div className={classes.someContent}
          onClick={() => {console.log('clicked') }}
        >
          some-content
        </div> */}
      </div>
    </Fragment>
  );
}

export default LiveEmbed;

