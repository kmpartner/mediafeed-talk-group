import React, { Fragment, useRef, useEffect } from 'react';
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
    getMoreNum,
    setGetMoreNum,
    noconnectGetMoreHandler,
    isMoreText,
    listScrollTop,
    isLoading,
  } = props;
  

  const [t] = useTranslation('translation');

  const ref = useRef(null);

  // // get older text when scrolled to top
  useEffect(() => {
    // console.log('refl listScrollTop', listScrollTop);
    if (listScrollTop === 0 && isMoreText) {
      noconnectGetMoreHandler(noconnectDestUserId, getMoreNum + 1);
      setGetMoreNum(getMoreNum + 1); 
      scrollToRef();
    }
  },[listScrollTop]);


  const destUser = usersData.find(user => {
    return user.userId === noconnectDestUserId;
  });

  const scrollToRef = () => {
    ref.current.scrollIntoView({
      // behavior: 'smooth',
      // block: 'center',
    });
  };




  let textListBody;

  if (textInputList.length > 0) {

    const lsNameDataList = localStorage.getItem('lsNameDataList');

    let lsDestUserNameData;
    let lsUserNameData;
  
    if (lsNameDataList && JSON.parse(lsNameDataList).length > 0) {
      lsDestUserNameData = JSON.parse(lsNameDataList).find(ele => {
        return ele.userId === noconnectDestUserId;
      });
     
      lsUserNameData = JSON.parse(lsNameDataList).find(ele => {
        return ele.userId === userId;
      });
      
    }

    textListBody = (
      <ul className="textTalk-list">
        {textInputList.map((inputData, index) => {
        // console.log(inputData);
        if (index === 0) {
          return (
            <div ref={ref} key={inputData._id}>
              <VideoTextTalkTextItem 
                inputData={inputData}
                userId={userId}
                destUser={destUser}
                noconnectTextDeleteHandler={noconnectTextDeleteHandler}
                lsDestUserNameData={lsDestUserNameData}
                lsUserNameData={lsUserNameData}
                isLoading={isLoading}
              />
            </div>
          );
        } else {
          return (
            <div key={inputData._id}>
              <VideoTextTalkTextItem 
                inputData={inputData}
                userId={userId}
                destUser={destUser}
                noconnectTextDeleteHandler={noconnectTextDeleteHandler}
                lsDestUserNameData={lsDestUserNameData}
                lsUserNameData={lsUserNameData}
                isLoading={isLoading}
              />
            </div>
          );
        }
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

      {/* {textInputList.length > 0 && isMoreText && (
        <span>
          <button
            onClick={() => { 
              noconnectGetMoreHandler(noconnectDestUserId, getMoreNum + 1);
              setGetMoreNum(getMoreNum + 1); 
              scrollToRef();
            }}
          >
            show-more-num-button
          </button> {getMoreNum}
        </span>
      )} */}

      {textListBody}
      {/* <button onClick={handleClick}>Scroll to element</button> */}
    </Fragment>
  );
};

export default VideoTextTalkTextList;