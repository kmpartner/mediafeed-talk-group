import React, { Fragment } from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Img from "react-cool-img";

import Linkify from 'react-linkify';
import { useTranslation } from 'react-i18next/hooks';

import GroupTalkTextFile from './GroupTalkTextFile';
import GroupTalkTextModal from './GroupTalkTextModal';
import Loader from '../../Loader/Loader';

import { useStore } from '../../../hook-store/store';
import { getDateTime } from '../../../util/timeFormat';

import classes from './GroupTalkTextItem.module.css';

const GroupTalkTextItem = (props) => {
  // console.log('GroupTalkTextItem-props', props);

  const { 
    inputData, 
    userId, 
    userColorList, 
    groupAllMemberList,
    groupTextReactions,
    createGroupTextReactionHandler,
    groupTextDeleteHandler,
    isLoading,
   } = props;

  const [t] = useTranslation('translation');

  const [store, dispatch] = useStore();
  // console.log('store in GroupTalkTextItem', store);

  const [clickedTextId, setClickedTextId] = useState('');
  const [textReactions, setTextReactions] = useState([]);
  const [showTextSettings, setShowTextSettings] = useState(false);
  const [showDeleteTextModal, setShowDeleteTextModal] = useState(false);

  useEffect(() => {
    if (groupTextReactions.length > 0) {
      const textReactions = groupTextReactions.filter(reaction => {
        return reaction.groupTalkTextId === inputData._id;
      });
      // console.log('textReactions', textReactions);
  
      setTextReactions(textReactions);
    }
  },[groupTextReactions]);

  let userImageSrc;
  if (store.groupMemberImageUrls && store.groupMemberImageUrls.length > 0) {
    const userImageUrl = store.groupMemberImageUrls.find(iurl => {
      return iurl.userId === inputData.fromUserId;
    });

    if (userImageUrl) {
      userImageSrc = userImageUrl.imageUrl;
    }
  }
  // console.log('userImageSrc', userImageSrc, inputData)


  // console.log(groupTalkInputList);
  let elementStyle = "textTalk-listElement-remote";
  let colorStyle = null;

  if (inputData.fromUserId === userId) {
    elementStyle = "textTalk-listElement-local"
    colorStyle={ 
      color: 'var(--color)',
      border: '0.5px solid lightgray',
     }
  }

  // console.log('groupAllMemberList', groupAllMemberList);
  if (inputData.fromUserId !== userId && groupAllMemberList.length > 0
  ) {
    const userColorElement = groupAllMemberList.find(element => {
      return element.userId === inputData.fromUserId;
    });
    // console.log('userColorElement', userColorElement, inputData.fromUserId);
    
    if (userColorElement) {
      colorStyle = {
        // color: 'black', 
        // backgroundColor: userColorElement.bgColor,
        border: `1px solid ${userColorElement.userColor}`,
      };
    } else {
      colorStyle = {
        // color: 'black', 
        // backgroundColor: userColorElement.bgColor,
        border: `1px solid lightgray`,
      };
    }
  }



    // const lsDarkMode = localStorage.getItem('darkMode');
    // if (lsDarkMode) {
    //   colorStyle = null;
    // }

    // console.log('darkMode, colorStyle', localStorage.getItem('darkMode'), colorStyle);
    // console.log('userColor[0]', userColorList[0].bgColor);
  const sendTime = new Date(inputData.sendAt);

  let [month, date, year] = (new Date(inputData.sendAt)).toLocaleDateString().split("/")
  let [hour, minute, second] = (new Date(inputData.sendAt)).toLocaleTimeString().slice(0, 7).split(":")
  let xm = (new Date(inputData.sendAt)).toLocaleTimeString().split(' ')[1];
  
  const componentDecorator = (href, text, key) => (
    <a href={href} key={key} target="_blank" rel="noopener noreferrer" style={{color: 'gray', fontWeight: ''}}>
        {text}
    </a>
  );

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
          <GroupTalkTextModal
            modalName='delete-text'
            modalTitle='Is it no problem to delete text?'
            showModalHandler={showDeleteTextModalHandler}
            onCancel={showDeleteTextModalHandler}
            onConfirm={groupTextDeleteHandler}
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
  
  const talkElement = (
    <div className={elementStyle} style={colorStyle}>

      <GroupTalkTextFile 
        inputData={inputData}
      />

      <div className="textTalk-listElement-text">
      <Linkify componentDecorator={componentDecorator}>
        {inputData.text}
      </Linkify>
      </div>

      <div className={classes.groupTalkTextItmeName}>
        <span className={classes.groupTalkTextItmeNameElement}>{inputData.fromName}</span>
        {userImageSrc &&
          <span className={classes.groupTalkTextItmeNameElement}>
          <Img
            className={classes.groupTalkTextItmeNameImage}
            src={userImageSrc} 
            // height="12.5" 
            alt='user-img' 
          /> 
          </span>
        }
        {/* <span className={classes.groupTalkTextItmeTimeElement}>
          ({month}/{date} {hour}:{minute} {xm})
        </span> */}
      </div>

      <div className={classes.groupTalkTextItmeTimeElement}>
          {/* {month}/{date} {hour}:{minute} {xm} */}
          {getDateTime(sendTime)}
      </div>


      <div className={classes.groupTalkTextItemReactionButtonsContainer}>
        <span
          className={classes.groupTalkTextItemReactionButton} 
          role="img" aria-label="thumbs-up" 
          disabled={isLoading}
          onClick={() => {
            createGroupTextReactionHandler(
              userId, 
              inputData.groupRoomId, 
              inputData._id, 
              'like'
            );
            setClickedTextId(inputData._id);
          }}
        >
          &#128077;
        </span>
        <span>
          {textReactions && textReactions.length > 0 && <span> {textReactions.length}</span>}
          {clickedTextId === inputData._id && isLoading && <Loader loaderStyle="loaderSmall" />}
        </span>
      </div>
      
      {inputData.fromUserId === userId && 
        textSettingsBody
      }


 

      {/* user-reaction-test */}
      {/* <button
        onClick={() => {
          createGroupTalkTextUserReaction(
            BASE_URL, 
            localStorage.getItem('token'),
            props.userId,
            'like',
            inputData._id
            );
        }}
      >
        reaction-cre-test
      </button>
      <button
        onClick={() => {
          deleteGroupTalkTextUserReaction(
            BASE_URL, 
            localStorage.getItem('token'),
            props.userId,
            'like',
            inputData._id
            );
        }}
      >
        reaction-del-test
      </button> */}

    </div>
  );


  
  if (inputData.fromUserId === userId) {
    talkElementBody = (
      <div
        className="textTalk-listElement-container"
      >
        <div></div>
        {talkElement}
      </div>
    );
  } else {
    talkElementBody = (
      <div 
        className="textTalk-listElement-container"
      >
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
}

export default GroupTalkTextItem;