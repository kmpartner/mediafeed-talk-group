import React, { Fragment } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next/hooks';
import axios from 'axios';

import Button from '../../Button/Button';

import { talkFileUpload } from '../../../util/talk-upload';

import { BASE_URL, SOCKET_URL } from '../../../App';

import classes from './VideoTextTalkUpload.module.css';

const VideoTextTalkUpload = props => {
  // console.log('VideoTextTalkUpload.js-props', props);
  const { 
    showUploadModalHandler,
    noconnectDestUserId,
    noconnectTextPostHandler,
  } = props;

  const [t] = useTranslation('translation');

  const [selectedType, setSelectedType] = useState('');
  const [selectedFiles, setSelectedFiles] = useState();
  const [textInput, setTextInput] = useState('');

  const fileSelectHandler = (event) => {
    // console.log(event.target.files);
    setSelectedFiles(event.target.files);
  };

  const setSelectedTypeHandler = (value) => {
    setSelectedType(value);
  }

  const textInputChangeHandler = (event) => {
    setTextInput(event.target.value);
    console.log(event.target.value)
  };

  const talkFileUploadHandler = async (url, token, files) => {
    try {
      const fileList = [];
      
      for (const file of files) {
        fileList.push(file);
      }

      const formData = new FormData();
      
      console.log('files[0]', files[0]); 

      for (const file of files) {
        formData.append('files', file);
      }

      // formData.append('file', files[0]);
  
      const result = await axios.request({
        method: 'POST',
        url: url + `/file-upload`,
        data: formData,
        headers: {
          Authorization: 'Bearer ' + token,
        },
        onUploadProgress: (p) => {
          console.log('onUploadProgress', (p.loaded/p.total*100).toFixed(0), p); 
          // this.setState({
          //     uploadProgress: p.loaded / p.total * 100
          // });
        }
      });
  
      console.log(result);

      if (result.data) {
        const fileUrls = result.data.data.fileUrls;

        const forText = textInput ? textInput : 'write text here';
        noconnectTextPostHandler(forText, noconnectDestUserId, fileUrls);
        // console.log(fileUrls);
      }
  
      return result;
    } catch(err) {
      console.log(err);
      throw err;
    }


  };

  let uploadBody;

  uploadBody = (
    <div>
      <div onClick={() => {showUploadModalHandler(false); }}>close</div>
      <div>select-file-type</div>
      <div>
        <button 
          onClick={() => { setSelectedTypeHandler('image') }}
        >
          image-file
        </button>
        <button
          onClick={() => { setSelectedTypeHandler('video') }}
        >
          video-file
        </button>
        <button
          onClick={() => { setSelectedTypeHandler('audio') }}
        >
          audio-file
        </button>
      </div>
      {selectedType === 'image' && (
        <div>
          <label>for-image</label>
          <input 
            type='file' 
            onChange={fileSelectHandler} 
            accept="image/jpg,image/jpeg,image/png,image/gif" 
          />
        </div>
      )}
      {selectedType === 'video' && (
        <div>
          <label>for-video</label>
          <input 
            type='file' 
            onChange={fileSelectHandler} 
            accept="video/mp4,vido/webm" 
          />
        </div>
      )}
      {selectedType === 'audio' && (
        <div>
          <label>for-audio</label>
          <input 
            type='file' 
            onChange={fileSelectHandler} 
            accept="audio/mp3,audio/wav,audio/weba" 
          />
        </div>
      )}

      <div>
        <input 
        type="text" 
        placeholder='text-here'
        onChange={textInputChangeHandler}
        />
      </div>

      <div>
        <button
         onClick={() => {
            talkFileUploadHandler(
              // BASE_URL,
              SOCKET_URL,
              localStorage.getItem('token'),
              selectedFiles,
            );
         }}
        >
          upload-and-post-button
        </button>
      </div>
    </div>
  );

  return (
    <Fragment>
      <div>{uploadBody}</div>
    </Fragment>

  );
}

export default VideoTextTalkUpload;