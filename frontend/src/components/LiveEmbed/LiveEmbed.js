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
  console.log('LiveEmbed-props', props);
  const { liveEmbedUrl, underEmbedBottom } = props;

  // const liveEmbedUrl ='http://localhost:4444/embedlive/testroomid/testroomid';

  const [t] = useTranslation('translation');

  const [store, dispatch] = useStore();

  // console.log('store in NotPageFound.js', store);
  // const [videoEl, setVideoEl] = useState();
  
  let iframeStyle = {
    width: '100%',
    height: `${window.innerWidth*15/16}px`,
    borderRadius: '6px',
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

  if (underEmbedBottom) {
    if (window.innerWidth > 768) { 
      iframeStyle = {
        borderRadius: '4px',
        border: '1px solid gray',
        position: 'fixed',
        top: '70px',
        // bottom: '10px',
        // right: '5px',
        left: '5px',
        width: '200px',
        height: '200px',
        zIndex: '100',
        transitionDuration: '0.75s',
      }
    } else {
      iframeStyle = {
        borderRadius: '4px',
        border: '1px solid gray',
        position: 'fixed',
        top: '5px',
        // bottom: '10px',
        right: '5px',
        width: '200px',
        height: '200px',
        zIndex: '100',
        transitionDuration: '0.75s',
      }
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

