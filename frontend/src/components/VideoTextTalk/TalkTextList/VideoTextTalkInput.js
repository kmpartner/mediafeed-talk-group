import React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next/hooks';

import Backdrop from '../../Backdrop/Backdrop';
import Button from '../../Button/Button';
import InputEmoji from '../../Form/Input/InputEmoji';
import SmallModal from '../../Modal/SmallModal';
import VideoTextTalkUpload from '../TalkUpload/VideoTextTalkUpload';

import classes from './VideoTextTalkInput.module.css';

const VideoTextTalkInput = props => {
  // console.log('VideoTextTalkInput.js-props', props);

  const [t] = useTranslation('translation');

  const [showUploadModal, setShowUploadModal] = useState(false);

  const showUploadModalHandler = (value) => {
    setShowUploadModal(value);
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
          Post
        </Button>
        <Button mode="" type=""
        onClick={() => { showUploadModalHandler(true); }}
        >
          upload-file
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
    </div>
  );
}

export default VideoTextTalkInput;