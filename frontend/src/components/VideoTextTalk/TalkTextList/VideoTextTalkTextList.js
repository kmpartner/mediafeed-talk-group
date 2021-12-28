import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next/hooks';

import Loader from '../../Loader/Loader';
import VideoTextTalkTextItem from './VideoTextTalkTextItem';

// import './VideoTextTalk.css'




const VideoTextTalkTextList = (props) => {
  // console.log('VideoTextTalkTextList.js props', props);
  const {
    textInputList,
    userName,
    userId,
    noconnectDestUserId,
    usersData,
    noconnectTextDeleteHandler,
    isLoading,
  } = props;
  

  const [t] = useTranslation('translation');

  const destUser = usersData.find(user => {
    return user.userId === noconnectDestUserId;
  });

  let textListBody;

  if (textInputList.length > 0) {
    textListBody = (
      <ul className="textTalk-list">{textInputList.map((inputData, index) => {
        // console.log(inputData);
        return (
          <div key={inputData._id}>
            <VideoTextTalkTextItem 
              inputData={inputData}
              userId={userId}
              destUser={destUser}
              noconnectTextDeleteHandler={noconnectTextDeleteHandler}
              isLoading={isLoading}
            />
          </div>
        );
      })}
      </ul>
    );
  }


  return (
    <Fragment>

      {isLoading &&
        <div className="textTalk__loader">
          <Loader />
        </div>
      }
      {textListBody}
    </Fragment>
  );
};

export default VideoTextTalkTextList;