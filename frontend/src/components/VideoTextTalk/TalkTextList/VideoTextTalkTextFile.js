import React, { Fragment, useState } from 'react';

import { useTranslation } from 'react-i18next/hooks';

import Backdrop from '../../Backdrop/Backdrop';
import Img from "react-cool-img";
import SmallModal from '../../Modal/SmallModal';

import { isImageFile, isVideoFile, isAudioFile } from '../../../util/image';
import { SOCKET_URL } from '../../../App';
import classes from './VideoTextTalkTextFile.module.css';
// import './VideoTextTalk.css'




const VideoTextTalkTextFile = (props) => {
  // console.log('VideoTextTalkTextFile.js props', props);
  const {
    // textInputList,
    inputData,
    // userId,
    // destUser,
    // noconnectTextDeleteHandler,
    // isLoading,
  } = props;
  

  const [t] = useTranslation('translation');

  const [showSepImage, setShowSepImage] = useState(false);

  const setShowSepImageHandler = (value) => {
    setShowSepImage(value);
  };

  const pictureInPictureHandler = () => {
    const videoEl = document.getElementById('video');
    
    videoEl.requestPictureInPicture();
  };

  
  let fileImageBody;

  if (inputData && inputData.fileUrls && inputData.fileUrls.length > 0) {

    // let fileImageUrl = inputData.fileUrls[0];
    let fileImageUrl = SOCKET_URL + '/' + inputData.fileUrls[0];
    let sFileImageUrl = SOCKET_URL + '/' + inputData.fileUrls[0];

    if (inputData.fileUrls[0].startsWith('https')) {
      const beforeQueryList = inputData.fileUrls[0].split('?');
      beforeQueryList.pop();

      sFileImageUrl = beforeQueryList.join('?');
      fileImageUrl = inputData.fileUrls[0];
    }
    
    // const fileNameList = fileImageUrl.split('.');
    // const fileExt = fileNameList.pop();
    const fileNameList = sFileImageUrl.split('.');
    const fileExt = fileNameList.pop();




    if (isImageFile(fileExt)) {
      if (!showSepImage) {
        fileImageBody = (
          <div 
            onClick={() => {
              setShowSepImageHandler(true);
            }}
          >
            <Img className={classes.textTalkFileImage}
            // style={{ maxWidth: "200px"}} 
            // src={inputData.fileUrls[0]} 
            src={fileImageUrl}
            alt="image in text" 
            />
          </div>
        );
      }

      if (showSepImage) {
        fileImageBody = (
          <div>
            <Backdrop 
            onClick={() => { 
              setShowSepImage(!showSepImage); 
            }}
            />
            <SmallModal style={classes.sepImageModal}>
              <div>
                <div>
                  <span 
                    onClick={() => { 
                      setShowSepImageHandler(false);
                    }}
                  >
                    close
                  </span>
                </div>
                <div>
                  <Img
                  // src={inputData.fileUrls[0]} 
                  src={fileImageUrl}
                  alt="image in text" 
                  />
                </div>

                <div>
                  <a style={{color: 'gray', textDecoration: "none" }}
                    href={fileImageUrl} target="_blank" rel="noopener noreferrer">
                    downlad-file
                  </a>
                </div>
              </div>
            </SmallModal>
          </div>
        )
      }
    }

    if (isVideoFile(fileExt)) {
      fileImageBody = (
        <div>
          <video className={classes.textTalkFileVideo}
            // style={{ maxWidth : "200px" }}
            // id="video"
            id={fileImageUrl}
            controls
            muted 
            src={fileImageUrl}
            alt="video in text" 
          />
          <div
            onClick={() => {
              const videoEl = document.getElementById(fileImageUrl);
              videoEl.requestPictureInPicture();
            }}
          >
            p-in-p
          </div>
        </div>
      );

      // if (!showSepImage) {
      //   fileImageBody = (
      //     <div>
      //       <video style={{height: "150px"}}
      //         // id="video"
      //         id={fileImageUrl}
      //         controls
      //         muted 
      //         src={fileImageUrl}
      //         alt="video in text" 
      //       />
      //       {/* <div
      //         onClick={() => {
      //           setShowSepImageHandler(true);
      //         }}
      //       >
      //         large-image
      //       </div> */}
      //       <div
      //         onClick={ () => {
      //           // pictureInPictureHandler
      //           const videoEl = document.getElementById(fileImageUrl);
    
      //           videoEl.requestPictureInPicture();
      //         }
      //         }
      //       >
      //         p-in-p
      //       </div>
      //     </div>
      //   );
      // }

      // if (showSepImage) {
      //   fileImageBody = (
      //     <div>
      //       <Backdrop 
      //       onClick={() => { 
      //         setShowSepImage(!showSepImage); 
      //       }}
      //       />
      //       <SmallModal style={classes.sepImageModal}>
      //         <div>
      //           <div>
      //             <span 
      //               onClick={() => { 
      //                 setShowSepImageHandler(false);
      //               }}
      //             >
      //               close
      //             </span>
      //           </div>
      //           <div>
      //             <video style={{maxWidth: "100%", maxHeight:"100%"}} 
      //               // src={inputData.fileUrls[0]}
      //               controls
      //               muted 
      //               src={fileImageUrl}
      //               alt="video in text" 
      //             />
      //           </div>
      //         </div>
      //       </SmallModal>
      //     </div>
      //   );
      // }
    }

    if (isAudioFile(fileExt)) {
      fileImageBody = (
        <audio className={classes.textTalkFile}
        // style={{maxWidth:"100%"}}
        // src={inputData.fileUrls[0]}
        controls
        src={fileImageUrl}
        alt="audio in text" 
        />
      );
    }

    if (!isImageFile(fileExt) && 
        !isVideoFile(fileExt) && 
        !isAudioFile(fileExt)
    ) {
      if (fileImageUrl) {
        const fileUrl = new URL(fileImageUrl);
        const fileName = fileUrl.pathname.split('/').pop();
        // console.log('fileName', fileName);
        const cridIndex = fileName.indexOf('crid');
        // console.log('cridIndex', cridIndex); 
        const originalName = fileName.slice(cridIndex + 5);
        
        fileImageBody = (
          <div className={classes.textTalkFile}>
            <div>
              {originalName}
            </div>
            <div>
              <a style={{color: 'gray', textDecoration: "none" }}
                href={fileImageUrl} target="_blank" rel="noopener noreferrer">
                downlad-file
              </a>
            </div>
          </div>
        );
      }
      
    }

  }



  return (
    <Fragment>
      {fileImageBody}
    </Fragment>
  );
};

export default VideoTextTalkTextFile;