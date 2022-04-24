import React, { Fragment, useEffect } from 'react';
import { withI18n } from "react-i18next";
import openSocket from 'socket.io-client';

import { useStore } from '../../../hook-store/store';
import { BASE_URL } from '../../../App';
// import classes from './PostSelect.module.css';

function FeedSocketAction(props) {
  const { uploadProgress } = props;

  const [store, dispatch] = useStore();

  useEffect(() => {
    const socket = openSocket(BASE_URL);
    socket.on('posts', data => {

      //// other actions in Feed.js
      
      if (data.action === 'create-action' || data.action === 'update-action') {
        console.log('socket-action-data create update', data);
          dispatch('SHOW_NOTIFICATION', {
            status: 'pending',
            title: '',
            message: `Stored ${data.imageData.originalname}`,
          });

      }

      if (data.action === 'upload-finish') {
        console.log('socket-action-data create update', data);
        
        // dispatch('SHOW_NOTIFICATION', {
        //   status: 'pending',
        //   title: '',
        //   message: `Images upload finished`,
        // });
        
        setTimeout(() => {
          dispatch('CLEAR_NOTIFICATION');
        }, 1000*3);
      }
  
  
    })
  },[]);


  useEffect(() => {
    if (uploadProgress > 0) {
      dispatch('SHOW_NOTIFICATION', {
        status: 'pending',
        title: '',
        message: `uploading... ${uploadProgress.toFixed(0)}%`,
      });
      if (uploadProgress >= 100) {
        dispatch('SHOW_NOTIFICATION', {
          status: 'pending',
          title: '',
          message: `upload finished, storing...`,
        });
      }
    }
    else {
      dispatch('CLEAR_NOTIFICATION');
    }

  },[uploadProgress]);



 

  return (
    <Fragment>
      {/* <div>Feed-socket-action</div> */}
    </Fragment>
 
  );
}

export default withI18n()(FeedSocketAction);