import React from 'react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next/hooks';

import Backdrop from '../../Backdrop/Backdrop';
import Button from '../../Button/Button';
import InputEmoji from '../../Form/Input/InputEmoji';
import SmallModal from '../../Modal/SmallModal';
import VideoTextTalkUpload from '../TalkUpload/VideoTextTalkUpload';
import VideoTextTalkShareUpload from '../TalkUpload/VideoTextTalkShareUpload';

import { useStore } from '../../../hook-store/store';

import classes from './VideoTextTalkInput.module.css';

const VideoTextTalkInput = props => {
  // console.log('VideoTextTalkInput.js-props', props);
  const currentUrl = new URL(window.location.href);
  const queryParams = currentUrl.searchParams;
  const shareUserIdParam = queryParams.get('shareUserId');
  // const shareFileTypeParam = queryParams.get('shareFileType');

  const [t] = useTranslation('translation');

  const [store, dispatch] = useStore();
  const { shareFile } = store.shareStore;

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showShareUploadModal, setShowShareUploadModal] = useState(false);


  useEffect(() => {
    if (shareUserIdParam && shareFile) {
      setShowShareUploadModal(true);
    } else {
      setShowShareUploadModal(false);
    }
  },[shareUserIdParam, shareFile]);

  const showUploadModalHandler = (value) => {
    setShowUploadModal(value);
  };

  const showShareUploadModalHandler = (value) => {
    setShowShareUploadModal(value);
  };

  return (
    <div className="groupTalk__textInputElements">
      <div className="groupTalk__textInputTextarea">
        <InputEmoji
          type="text"
          label=""
          // placeholder="text input...."
          placeholder={t('videoTalk.text10')}
          control="textarea"
          getInput={props.getInputHandler}
          onChange={props.textInputHandlerEmoji}
          value={props.textInput}
          rows="3"
          pickerStyle={{ position: 'fixed', top: '60px', bottom:'90px', left: '0px', zIndex: '300', maxHeight:'90vh', maxWidth:'75%', overflow:'auto'}}
        />
      </div>
      <div className="groupTalk__textInputPostButton">
        <Button
          mode="raised" type="submit"
          disabled={!props.textInput || props.isTextPosting}
          loading={props.isTextPosting}
          onClick={() => {
            if (props.noconnectTextPostHandler) {
              props.noconnectTextPostHandler(props.textInput, props.noconnectDestUserId);
            }
            // if (props.textPostHandler) {
            //   props.textPostHandler(textInput);
            // }
          }}
        >
          {t('general.text26', 'Send')}
        </Button>
        <Button mode="" type=""
          onClick={() => { showUploadModalHandler(true); }}
        >
          {t('talkUpload01', 'upload file')}
        </Button>
        {showUploadModal && (
          <div>
            <Backdrop onClick={() => { showUploadModalHandler(false); }}/>
            <SmallModal style={classes.uploadModal}>
              <VideoTextTalkUpload
                showUploadModalHandler={showUploadModalHandler}
                // textInput={props.textInput}
                noconnectDestUserId={props.noconnectDestUserId}
                noconnectTextPostHandler={props.noconnectTextPostHandler}
                isTextPosting={props.isTextPosting}
              />
            </SmallModal>
          </div>
        )}
        {/* {!showUploadModal && (
          <SmallModal>small-modal-content</SmallModal>
        )} */}
      </div>
      

      
      {shareFile && showShareUploadModal && (
        <div>
          <Backdrop onClick={() => { showShareUploadModalHandler(false); }}/>
            <SmallModal style={classes.uploadModal}>
              <VideoTextTalkShareUpload
                showUploadModalHandler={showShareUploadModalHandler}
                // textInput={props.textInput}
                noconnectDestUserId={props.noconnectDestUserId}
                noconnectTextPostHandler={props.noconnectTextPostHandler}
                isTextPosting={props.isTextPosting}
              />
            </SmallModal>
          </div>
      )}
    </div>
  );
}

export default VideoTextTalkInput;