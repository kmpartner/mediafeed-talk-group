import React, { Component, Fragment, useState, useEffect } from "react";
import { withI18n } from "react-i18next";
import Img from "react-cool-img";

import TransBackdrop from '../../../components/Backdrop/TransBackdrop';
import SmallModal from '../../../components/Modal/SmallModal';
import SinglePostAd from './SinglePostAd';

import { isVideoFile, isImageFile, isAudioFile } from "../../../util/image";
import { BASE_URL } from '../../../App';

// import "./FeedEdit.css";

import CanvasTouchDraw from "../../../components/Canvas/CanvasTouchDraw";
import { getFixedT } from "i18next";

const SinglePostImages = (props) => {
  console.log('SinglePostImages.js-props', props);

  const { 
    imageUrls,
    modifiedImagePaths,
    postData,
    isLoading,
  } = props;

  const [showFullImageModal, setShowFullImageModal] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState();
  const [videoStyleChange ,setVideoStyleChange] = useState(false);

  // console.log(selectedImageIndex);
  const smallVideoStyle = {
    position: 'fixed',
    bottom: '5px',
    right: '15px',
    width: '300px',
    maxWidth: '90vw',
  };

  const smallVideoShadow = {
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.26)',
  }


  useEffect(() => {
    // detectSwipe('idtest');

    // console.log(document.getElementById("canvas"));
    swipeImage('fullimage');
  },[selectedImageUrl]);


  const swipeImage = (elId) => {
    // const elementId = elId;
    const element = document.getElementById(elId);

    if (element) {
      // document.addEventListener("DOMContentLoaded", startup);
      var el = element;
      el.addEventListener("touchstart", handleStart, {once: true});
      el.addEventListener("touchend", handleEnd, {once: true});
    }

    
    var ongoingTouches = [];
    let touchStartX;
    let touchStartY;

    function handleStart(evt) {
      evt.preventDefault();
      console.log("touchstart.");
      // var el = element;
      // var ctx = el.getContext("2d");
      var touches = evt.changedTouches;
    
      for (var i = 0; i < touches.length; i++) {
        console.log("touchstart:" + i + "...");
        ongoingTouches.push(copyTouch(touches[i]));
        // var color = colorForTouch(touches[i]);
        // ctx.beginPath();
        // ctx.arc(touches[i].pageX, touches[i].pageY, 4, 0, 2 * Math.PI, false);  // a circle at the start
        // ctx.fillStyle = color;
        // ctx.fill();
        console.log("touchstart:" + i + ".");


        touchStartX = touches[i].pageX;
        touchStartY = touches[i].pageY;
        console.log('touch start position', touches[i].pageX, touches[i].pageY)
      }
    }

    function handleEnd(evt) {
      evt.preventDefault();
      // log("touchend");
      // var el = element;
      // var ctx = el.getContext("2d");
      var touches = evt.changedTouches;
    
      for (var i = 0; i < touches.length; i++) {
        // var color = colorForTouch(touches[i]);
        var idx = ongoingTouchIndexById(touches[i].identifier);
    
        if (idx >= 0) {
          // ctx.lineWidth = 4;
          // ctx.fillStyle = color;
          // ctx.beginPath();
          // ctx.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);
          // ctx.lineTo(touches[i].pageX, touches[i].pageY);
          // ctx.fillRect(touches[i].pageX - 4, touches[i].pageY - 4, 8, 8);  // and a square at the end
          ongoingTouches.splice(idx, 1);  // remove it; we're done


          console.log('touch end position: ',touches[i].pageX, touches[i].pageY);
          if (touches[i].pageX > touchStartX + 40) {
            console.log('moved right');
            console.log('swiped left');
            slideFullImage('down');
          }
          if (touches[i].pageX < touchStartX - 40) {
            console.log('moved left');
            console.log('swiped right');
            slideFullImage('up');
          }
          if (touches[i].pageX === touchStartX && 
            touches[i].pageY === touchStartY) {
              showFullImageModalHandler('');
          }

          if (touches[i].pageY > touchStartY) {
              console.log('moved bottom');
          }
          if (touches[i].pageY < touchStartY) {
            console.log('moved top');
        }
          
          touchStartX = null;
          touchStartY = null;

        } else {
          console.log("can't figure out which touch to end");
        }
      }
    }

    function copyTouch({ identifier, pageX, pageY }) {
      return { identifier, pageX, pageY };
    }

    function ongoingTouchIndexById(idToFind) {
      for (var i = 0; i < ongoingTouches.length; i++) {
        var id = ongoingTouches[i].identifier;
    
        if (id == idToFind) {
          return i;
        }
      }
      return -1;    // not found
    }

  };


  const showFullImageModalHandler = (imageUrl) => {
    if (!showFullImageModal) {
      setShowFullImageModal(true);
      setSelectedImageUrl(imageUrl);
    } else {
      setShowFullImageModal(false);
      setSelectedImageUrl('');
    }
  };

  const slideFullImage = (direction) => {
    // console.log(selectedImageIndex, imageUrls);

    if (direction === 'up') {
      if (selectedImageIndex >= imageUrls.length - 1) {
        setSelectedImageIndex(0);
        setSelectedImageUrl(imageUrls[0]);      
      }
      else {
        setSelectedImageIndex(selectedImageIndex + 1);
        setSelectedImageUrl(imageUrls[selectedImageIndex + 1]);
      }
    }
    if (direction === 'down') {
      if (selectedImageIndex <= 0) {
        setSelectedImageIndex(imageUrls.length - 1);
        setSelectedImageUrl(imageUrls[imageUrls.length - 1]);      
      }
      else {
        setSelectedImageIndex(selectedImageIndex - 1);
        setSelectedImageUrl(imageUrls[selectedImageIndex - 1]);
      }
    }


  };

  const getFileType = (value) => {
    const fileType = value.split('.')[value.split('.').length -1].toLowerCase();
    return fileType;
  };

  let singlePostImagesBody;
  let fileType;
  if (imageUrls && imageUrls.length > 0) {

    // let fileType
    if (modifiedImagePaths && modifiedImagePaths.length > 0) {
      fileType = modifiedImagePaths[0].split('.')[modifiedImagePaths[0].split('.').length -1];
      // console.log(fileType, props.modifiedImagePaths[0]);
    }

    let imageWidth = '';
    let imagesStyle = {
      // width: '400px',
      width: ''
    };

    if (imageUrls.length > 1) {
      imagesStyle = {
        // height: '200px',
        // width: '100%',
        // maxHeight: "20rem",
        // maxWidth: "45%",
        // width: "45%",
      };
      imageWidth = '45%'
    }

    let ulClass = 'single-post__Images';
    if (isVideoFile(fileType) || imageUrls.length === 1) {
      ulClass = '';
    }

    singlePostImagesBody = (
      <span>
        <ul className={ulClass}>
          {imageUrls.map((imageUrl, index) => {

            if (isVideoFile(fileType)) {
              return (
                <span style={videoStyleChange ? smallVideoStyle : null}>
                  {videoStyleChange &&
                    (<div
                      className="changeStyleButton"
                        onClick={() => {setVideoStyleChange(!videoStyleChange); }}
                    >
                      &#8689;
                    </div>)
                  }
                  <video
                    style={videoStyleChange ? smallVideoShadow : null}
                    // onClick={() => { showFullImageModalHandler(imageUrl); }}
                    // style={{width: `${imageWidth}`}}
                    // style={{height: "100%", width: "100%", maxWidth:"40rem"}}
                    // style={{height: "", width: "", maxWidth:"40rem"}}
                    className="single-post__Video"
                    src={imageUrl} 
                    // src={imageUrl.startsWith('https://') ? imageUrl : BASE_URL + '/' + imageUrl}
                    height="" width="" alt="pictures of previews" 
                    controls
                  />
                  {!videoStyleChange && (
                    <div className="changeStyleButton"
                      onClick={() => {setVideoStyleChange(!videoStyleChange); }}
                    >
                      &#8690;
                    </div>
                  )}

                </span>
              );
            }

            if (isImageFile(fileType)) {
              return (
                <span>
                  <Img 
                    onClick={() => { 
                      showFullImageModalHandler(imageUrl); 
                      setSelectedImageIndex(index);
                    }}
                    // style={{width: `${imageWidth}`}}
                    style={imagesStyle}
                    src={imageUrl} 
                    // src={imageUrl.startsWith('https://') ? imageUrl : BASE_URL + '/' + imageUrl}
                    height="" alt="pictures of previews" 
                  />
                </span>
              );
            }

            if (isAudioFile(fileType)) {
              return (
                <span>
                  <audio src={imageUrl} controls alt="post images"/>
                </span>
              );
            }



            // let imagesBody;
            // if (imagePreview.split("/")[0] === "data:image") {
            //   imagePreviewBody = (
            //     <span>
            //       <Img src={imagePreview} height="" alt="pictures of previews" />
            //     </span>
            //   );
            // }
            // if (imagePreview.split("/")[0] === "data:video") {
            //   imagePreviewBody = (
            //     <span>
            //       <video src={imagePreview} height=""></video>
            //     </span>
            //   );
            // }

            // return imagePreviewBody;
          })}
        </ul>
        
        {isImageFile(fileType) 
          && <div>click image for full image</div>
        }
      </span>
    );
  }


  let selectedImageModalBody;
  if (showFullImageModal) {
    selectedImageModalBody = (
      <div>

        <div onClick={() => {showFullImageModalHandler(''); }}>
          <TransBackdrop 
            backdropClassName='fullImageBackdrop'
          />
          <SmallModal style="fullImageModal">
            {/* image modal */}
            <div id="fullimage" className="single-post__FullImageContainer">
              <Img 
                src={selectedImageUrl}
                // src={selectedImageUrl.startsWith('https://') ? selectedImageUrl : BASE_URL + '/' + selectedImageUrl}
                alt="selected full size" 
              />
            </div>
          </SmallModal>
        </div>

        <div className="single-post__FullImageMoveUp"
          onClick={() => {slideFullImage('up'); }} 
        >
          &#x21E8;
        </div>
        <div className="single-post__FullImageMoveDown"
          onClick={() => { slideFullImage('down'); }} 
        >
          &#x21E6;
        </div>
        <div className="single-post__FullImageNumber">
          ({selectedImageIndex + 1}/{imageUrls.length})
          {' '}
          <span className="single-post__FullImageBackButton" style={{textDecoration:'underline', cursor:'pointer'}}
            onClick={() => {showFullImageModalHandler('');}}
          >
              back to post
          </span>
        </div>

      </div>
    );   
  }


  return <Fragment>

    {/* <div>
      canvas-touch-draw
      <CanvasTouchDraw />
    </div> */}

    <div>{singlePostImagesBody}</div>
    <span >{selectedImageModalBody}</span>

    {postData && postData.embedUrl && (
      <div>
        <div
          className={videoStyleChange ? '' : 'videoWrapper'} 
          style={videoStyleChange ? smallVideoStyle : null}
        >
          <div className="changeStyleButton"
            onClick={() => {setVideoStyleChange(!videoStyleChange); }}>
              &#8689;
          </div>
          <iframe width="" height=""
            src={postData.embedUrl + '?controls=1&mute=0&showinfo=0&rel=0&autoplay=0&loop=0'}
            title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen
            mute="1"
          >
          </iframe>
          
          {/* <img src="http://img.youtube.com/vi/Xt9Hk7zCItM/0.jpg" /> */}
        </div>
        {!videoStyleChange && (
          <div className="changeStyleButton" 
            onClick={() => {setVideoStyleChange(!videoStyleChange); }}>
              &#8690;
          </div>
        )}
      </div>
    )}

    
    {!isLoading && (isVideoFile(fileType) || postData.embedUrl) && (
      <div style={{padding: "1rem 0"}}>
        <SinglePostAd adPlaceId={`single-post-under-media-${postData._id}`} postData={postData} /> 
      </div>
    )}

    </Fragment>;
};

export default withI18n()(SinglePostImages);
// export default FeedEdit;
