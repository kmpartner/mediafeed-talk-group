import React, { Fragment, useState } from 'react';

import { useTranslation } from 'react-i18next/hooks';
import Linkify from 'react-linkify';

import VideoTextTalkModal from './VideoTextTalkModal';
import VideoTextTalkTextFile from './VideoTextTalkTextFile';

import classes from './VideoTextTalkTextItem.module.css';
// import './VideoTextTalk.css'




const VideoTextTalkTextItem = (props) => {
  // console.log('VideoTextTalkTextListItem.js props', props);
  const {
    textInputList,
    inputData,
    userId,
    destUser,
    noconnectTextDeleteHandler,
    isLoading,
  } = props;
  

  const [t] = useTranslation('translation');

  const [showTextSettings, setShowTextSettings] = useState(false);
  const [showDeleteTextModal, setShowDeleteTextModal] = useState(false);


  const showDeleteTextModalHandler = () => {
    setShowDeleteTextModal(!showDeleteTextModal);
  }

  let textSettingsBody;
  
  if (!showTextSettings) {
    textSettingsBody = (
      <div>
        <div className={classes.groupTalkTextItemSettingButtonContainer}>
          <span className={classes.groupTalkTextItemSettingButton}
            onClick={() => { setShowTextSettings(!showTextSettings); }}
          >
            &#8942;
          </span>
        </div>
        {showDeleteTextModal &&
          <VideoTextTalkModal
            modalName='delete-text'
            modalTitle='Is it no problem to delete text?'
            showModalHandler={showDeleteTextModalHandler}
            onCancel={showDeleteTextModalHandler}
            onConfirm={noconnectTextDeleteHandler}
            groupRoomId={inputData.groupRoomId}
            groupTalkTextId={inputData._id}
            fromUserId={inputData.fromUserId}
            // groupTextDeleteHandler={groupTextDeleteHandler}
            inputData={inputData}
            isLoading={isLoading}
            // modalContent={deleteMemberModalContent}
          />
        }
      </div>
    );
  } else {
    textSettingsBody= (
      <div>
        <div className={classes.groupTalkTextItemSettingButtonContainer}>
          <span className={classes.groupTalkTextItemSettingButton}
            onClick={() => { setShowTextSettings(!showTextSettings); }}
          >
            &#8942;
          </span>
        </div>
        
        <div className={classes.groupTalkTextItemTextDeleteButton}
          onClick={() => { 
            showDeleteTextModalHandler();
            setShowTextSettings(false);
          }}
        >
          Delete Text
        </div>
      </div>
    );
  }
   

  let talkElementBody;

  let elementStyle = "textTalk-listElement-remote";
  let colorStyle = null;

  if (inputData.fromUserId === userId) {
    elementStyle = "textTalk-listElement-local"
    colorStyle={ 
      color: 'var(--color)',
      border: '0.5px solid gray',
     }
  }

  if (inputData.fromUserId !== userId) {
    elementStyle = "textTalk-listElement-local"
    colorStyle={ 
      color: 'var(--color)',
      // border: `0.5px solid #00b359`,
      border: `0.5px solid ${destUser.userColor}`,
     }
  }

  let [month, date, year] = (new Date(inputData.sendAt)).toLocaleDateString().split("/")
  let [hour, minute, second] = (new Date(inputData.sendAt)).toLocaleTimeString().slice(0, 7).split(":")
  let xm = (new Date(inputData.sendAt)).toLocaleTimeString().split(' ')[1];

  const componentDecorator = (href, text, key) => (
    <a href={href} key={key} target="_blank" rel="noopener noreferrer" style={{ color: 'gray', fontWeight: '' }}>
      {text}
    </a>
  );

  const talkElement = (
    // <li className={elementStyle}>
    <div className={elementStyle} style={colorStyle}>
      
      <VideoTextTalkTextFile 
        inputData={inputData}
      />

      <div className="textTalk-listElement-text">
        <Linkify componentDecorator={componentDecorator}>
          {inputData.text}
        </Linkify>
      </div>

      <div className="textTalk-listElement-time">
        {inputData.fromName} ({month}/{date} {hour}:{minute} {xm})
        </div>

      {inputData.fromUserId === userId &&
        <div>{textSettingsBody}</div>
      }

    </div>
    // </li>
  );

  if (inputData.fromUserId === userId) {
    talkElementBody = (
      <div className="textTalk-listElement-container">
        <div></div>
        {/* <div> */}
        {talkElement}
        {/* </div> */}
      </div>
    );
  } else {
    talkElementBody = (
      <div className="textTalk-listElement-container">
        {talkElement}
        <div></div>
      </div>
    );
  }


  return (
    <Fragment>
      {talkElementBody}
    </Fragment>
  );
};

export default VideoTextTalkTextItem;