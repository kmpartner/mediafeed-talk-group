import React, { Fragment } from 'react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next/hooks';

// import Button from '../../Button/Button';
// import Loader from '../../Loader/Loader';

import { useStore } from '../../../hook-store/store';


import classes from './GroupUploadPreview.module.css';

const GroupUploadPreview = props => {
  // console.log('VideoTextTalkUploadPreview.js-props', props);
  const { 
    filePreviews,
    selectedType,
    selectedFiles,
  } = props;

  const [t] = useTranslation('translation');

  const [store, dispatch] = useStore();

  const [videoDimenstions, setVideoDimensions] = useState();
  // const userData = store.userData;

  useEffect(() => {
    const videoEl = document.getElementById('video-preview');

    if (videoEl && filePreviews && filePreviews.length > 0) {
  
      videoEl.addEventListener("loadedmetadata", function() {     // when enough data loads
        console.log(videoEl, videoEl.duration, videoEl.videoWidth, videoEl.videoHeight);
        
        setVideoDimensions({
          duration: videoEl.duration,
          videoWidth: videoEl.videoWidth,
          videoHeight: videoEl.videoHeight,
        })
      });
    }
  },[filePreviews]);

  let previewBody;

  if (filePreviews && filePreviews.length > 0) {
    if (selectedType === 'image') {
      previewBody = (
        <div>
          <img className={classes.talkUploadPreview}
            src={filePreviews[0]} alt="selected file preview" 
          />
        </div>
      );
    }

    if (selectedType === 'video') {
      let videoStyle = null;
      
      if (videoDimenstions && videoDimenstions.videoHeight > videoDimenstions.videoWidth) {
        videoStyle = {
          width: "250px"
        };
      }

      previewBody = (
        <div >
          <video className={classes.talkUploadPreview}
            style={videoStyle}
            id="video-preview"
            src={filePreviews[0]} 
            controls  
            muted 
            alt="selected file preview" 
          />
        </div>
      );
    }

    if (selectedType === 'audio') {
      previewBody = (
        <div>
          <audio className={classes.talkUploadPreview}
            // className={classes.talkUploadPreview}
            src={filePreviews[0]} controls height=""
            alt="selected file preview" 
          />
        </div>
      );
    }

    if (selectedType === 'other' && selectedFiles && selectedFiles.length > 0) {
      previewBody = (
        <div>
          {selectedFiles[0].name}
        </div>
      );
    }
  }


  return (
    <Fragment>
      <div className={classes.talkUploadPreviewContainer}>
        {previewBody}
      </div>
      {/* <div>
        {JSON.stringify(videoDimenstions)}
      </div> */}
      
    </Fragment>

  );
}

export default GroupUploadPreview;