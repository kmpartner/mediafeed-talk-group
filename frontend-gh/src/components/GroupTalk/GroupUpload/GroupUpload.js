import React, { Fragment } from 'react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next/hooks';
import axios from 'axios';

import Button from '../../Button/Button';
import ImageEditorLink from '../../../pages/NotPageFound/ImageEditorLink';
import InputEmoji from '../../Form/Input/InputEmoji';
import Loader from '../../Loader/Loader';
import GroupUpladPreview from './GroupUploadPreview';
// import { talkFileUpload } from '../../../util/talk-upload';

// import { 
//   createCompressedImage,
//   generateBase64FromImage,
// } from '../../../util/image';

import {
  createImagePreviews,
} from '../../../util/talk/talk-file';

import { useStore } from '../../../hook-store/store';

import { SOCKET_GROUP_URL } from '../../../App';

import { marks } from '../../../images/marks';
import classes from './GroupUpload.module.css';

const GroupUpload = props => {
  // console.log('VideoTextTalkUpload.js-props', props);
  const { 
    showUploadModalHandler,
    // noconnectDestUserId,
    // noconnectTextPostHandler,
    joinGroupId,
    groupTextPostHandler,
    isTextPosting,
  } = props;

  const [t] = useTranslation('translation');

  const [store, dispatch] = useStore();
  const userData = store.userData;

  const [selectedType, setSelectedType] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [textInput, setTextInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [imagesData, setImagesData] = useState();
  const [errorMessage, setErrorMessage] = useState('');
  const [sizeError, setSizeError] = useState('');

  useEffect(() => {
    if (selectedFiles.length > 0) {
      console.log('selectedFiles', selectedFiles);
      createImagePreviewsHandler(selectedFiles);
      setErrorMessage('');
      setSizeError('');

      if (selectedFiles[0].size > 100*10**6) {
        setSizeError('file size should be less than 100MB');
      }
    }
  },[selectedFiles]);

  useEffect(() => {
    if (imagesData) {
      console.log('iamgesData', imagesData);
      // createImagePreviewsHandler(selectedFiles);
    }
  },[imagesData]);


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

  const textInputHandlerEmoji = (input, value) => {
    setTextInput(value);
    // console.log(commentInput);
  }

  const getInputHandler = (input) => {
    setTextInput(input);
  }

  const talkFileUploadHandler = async (url, token, files) => {
    try {
      setIsLoading(true);
      setErrorMessage('');
      // const fileList = [];
      
      // for (const file of files) {
      //   fileList.push(file);
      // }

      const formData = new FormData();
      
      console.log('files[0]', files[0]); 

      for (const file of files) {
        formData.append('files', file);
      }

      if (userData) {
        formData.append('userId', userData.userId);
      }

      formData.append('joinGroupId', joinGroupId);

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
        const fileSizes = result.data.data.fileSizes;

        const forText = textInput.trim() ? textInput : 'your file';
        
        // noconnectTextPostHandler(
        //   forText, 
        //   noconnectDestUserId, 
        //   fileUrls,
        //   fileSizes,
        // );

        groupTextPostHandler(
          forText, 
          joinGroupId,
          fileUrls,
          fileSizes,
        );
        // console.log(fileUrls);
      }
      
      setIsLoading(false);
      showUploadModalHandler(false);

      return result;

    } catch(err) {
      console.log(err);
      setIsLoading(false);
      setErrorMessage('File Upload Failed');
      throw err;
    }
  };

  const createImagePreviewsHandler = async (files) => {
    try {
      setIsLoading(true);

      const previews = await createImagePreviews(files);
      console.log(previews);
      // setFilePreviews(previews);
      setFilePreviews(previews.b64Images);
      setImagesData(previews);

      setIsLoading(false);
    } catch(err) {
      console.log(err);
      setIsLoading(false);
    }
  }
  


  const resetSelectedFiles = () => {
    setSelectedType('');
    setSelectedFiles([]);
    setFilePreviews([]);
  };

  // let previewBody;

  // if (selectedFiles) {
  //   previewBody = (
  //     <div className={classes.talkUploadPreview}>
  //       <img src={filePreviews[0]} alt="selected file preview" />
  //     </div>
  //   );
  // }

  let uploadBody;
  
  uploadBody = (
    <div>
      <div className={classes.talkUploadClose}>
        <span className={classes.talkUploadCloseButton}
          onClick={() => {showUploadModalHandler(false); }}
        >
          X
        </span>
      </div>

      {!selectedType && (
        <div>
          <div className={classes.talkUploadTitle}>
            {t('talkUpload02', 'Select file type')}
          </div>
          <div className={classes.talkUploadSelectButtons}>
            <Button mode="raised" type="submit"
              onClick={() => { setSelectedTypeHandler('image') }}
            >
              {marks.fileImage} {t('talkUpload03', 'Image')}
            </Button>
            <Button mode="raised" type="submit"
              onClick={() => { setSelectedTypeHandler('video') }}
            >
              {marks.fileVideo} {t('talkUpload04', 'Video')}
            </Button>
            <Button mode="raised" type="submit"
              onClick={() => { setSelectedTypeHandler('audio') }}
            >
              {marks.fileAudio} {t('talkUpload05', 'Audio')}
            </Button>
            {/* <Button mode="raised" type="submit"
              onClick={() => { setSelectedTypeHandler('other') }}
            >
              {t('talkUpload14', 'other file')} 
            </Button> */}
          </div>
        </div>
      )}

      {selectedType === 'image' && (
        <div>
          <div className={classes.talkUploadSelectFileTitle}>
            {t('talkUpload03', 'Image')}
          </div>
          <input 
            type='file' 
            onChange={fileSelectHandler} 
            accept="image/jpg,image/jpeg,image/png,image/gif" 
          />
          <div className={classes.talkUploadAboutFile}>
            <div>{t('talkUpload06', 'File size should be less than 100MB.')}</div>
            <div>{t('talkUpload07', 'File will be resized to smaller size.')}</div>
            <div>{t('talkUpload08', 'accept file type')} (jpeg, jpg, png)</div>
            <br/>
            <ImageEditorLink />
            {sizeError && (
              <div><strong>{sizeError}</strong></div>
            )}
          </div>
        </div>
      )}
      {selectedType === 'video' && (
        <div>
          <div className={classes.talkUploadSelectFileTitle}>
            {t('talkUpload04', 'Video')}
          </div>
          <input 
            type='file' 
            onChange={fileSelectHandler} 
            accept="video/mp4,video/webm" 
          />
          <div className={classes.talkUploadAboutFile}>
            <div>{t('talkUpload06', 'File size should be less than 100MB.')}</div>
            <div>{t('talkUpload09', 'File with more than 90 seconds length will be trimed.')}</div>
            <div>{t('talkUpload10', 'File will be deleted after 1 month.')}</div>
            <div>{t('talkUpload08', 'accept file type')} (mp4)</div>
            {sizeError && (
              <div><strong>{sizeError}</strong></div>
            )}
          </div>
        </div>
      )}
      {selectedType === 'audio' && (
        <div>
          <div className={classes.talkUploadSelectFileTitle}>
            {t('talkUpload05', 'Audio')}
          </div>
          <input 
            type='file' 
            onChange={fileSelectHandler} 
            accept="audio/mp3,audio/wav,audio/weba" 
          />
          <div className={classes.talkUploadAboutFile}>
            <div>{t('talkUpload06', 'File size should be less than 100MB.')}</div>
            <div>{t('talkUpload09', 'File with more than 90 seconds length will be trimed.')}</div>
            <div>{t('talkUpload10', 'File will be deleted after 1 month.')}</div>
            <div>{t('talkUpload08', 'accept file type')} (mp3, wav)</div>
            {sizeError && (
              <div><strong>{sizeError}</strong></div>
            )}
          </div>
        </div>
      )}
      {/* {selectedType === 'other' && (
        <div>
          <div className={classes.talkUploadSelectFileTitle}>
            {t('talkUpload14', 'other file')} 
          </div>
          <input 
            type='file' 
            onChange={fileSelectHandler} 
            // accept=".pdf" 
          />
          <div>
            <div>{t('talkUpload06', 'File size should be less than 100MB.')}</div>
            <div>{t('talkUpload09', 'File with more than 90 seconds length will be trimed.')}</div>
            <div>({t('talkUpload08', 'accept file type')}, image: (jpeg, jpg, png, gif, webp), video: (mp4, webm), audio:(mp3, wav) )</div>
            {sizeError && (
              <div><strong>{sizeError}</strong></div>
            )}
          </div>
        </div>
      )} */}


      {selectedFiles && (
        <GroupUpladPreview 
          filePreviews={filePreviews}
          selectedType={selectedType}
          selectedFiles={selectedFiles}
        />
      )}

      {selectedType && (
        <div className={classes.talkUploadGoback}>
          <Button mode="" type=""
            onClick={() => { resetSelectedFiles(); }}
          >
            {t('talkUpload11', 'Go back')}
          </Button>
        </div>
      )}

      {selectedFiles.length > 0 && (
        <div className={classes.talkUploadTextInput}>
          <InputEmoji
            type="text"
            label=""
            // placeholder="text input...."
            placeholder={t('videoTalk.text10')}
            control="textarea"
            getInput={getInputHandler}
            onChange={textInputHandlerEmoji}
            value={textInput}
            rows="3"
            pickerStyle={{ position: 'fixed', top: '60px', bottom:'90px', left: '0px', zIndex: '300', maxHeight:'90vh', maxWidth:'75%', overflow:'auto'}}
          />
        </div>
      )}


      {(isTextPosting || isLoading) && (
        <div>
          <Loader />
        </div>
      )}


      {selectedFiles.length > 0 && (
        <div className={classes.talkUploadActionButtons}>
          <Button mode="flat" type="submit"
            disabled={isTextPosting || isLoading}
            loading={isTextPosting || isLoading}
            onClick={() => {showUploadModalHandler(false); }}
          >
            {t('talkUpload12', 'Cancel')}
          </Button>
          <Button mode="raised" type="submit"
            disabled={isTextPosting || isLoading || sizeError}
            loading={isTextPosting || isLoading}
            onClick={() => {
                talkFileUploadHandler(
                  // BASE_URL,
                  SOCKET_GROUP_URL,
                  localStorage.getItem('token'),
                  imagesData.imageFiles, //selectedFiles,
                );
            }}
          >
            {t('talkUpload13', 'Upload')}
          </Button>
        </div>
      )}

      {selectedFiles.length > 0 && errorMessage && (
        <strong className={classes.talkUploadError}>
          {errorMessage}
        </strong>
      )}

    </div>
  );

  return (
    <Fragment>
      <div>{uploadBody}</div>
    </Fragment>

  );
}

export default GroupUpload;