import React, { Fragment, useEffect } from 'react';
import { withI18n } from "react-i18next";
import openSocket from 'socket.io-client';

import { useStore } from '../../../hook-store/store';
import { BASE_URL } from '../../../App';
// import classes from './PostSelect.module.css';

function PostSelect(props) {
  const {} = props;

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
            message: `Image uploaded ${data.imageData.filename}`,
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



 

  return (
    <Fragment>
      <div>Feed-socket-action</div>
    </Fragment>
 
  );
}

export default withI18n()(PostSelect);