import React, { Component, Fragment } from "react";
import { withI18n } from "react-i18next";
import Img from "react-cool-img";

import Backdrop from "../../Backdrop/Backdrop";
import Button from "../../Button/Button";
import Modal from "../../Modal/Modal";
import Input from "../../Form/Input/Input";
import InputEmoji from "../../Form/Input/InputEmoji";
import FilePicker from "../../Form/Input/FilePicker";
import Loader from "../../Loader/Loader";
// import Image from '../../Image/Image';
import { isVideoFile, isImageFile } from "../../../util/image";
import { BASE_URL } from '../../../App';

import "./FeedEdit.css";

const ImagePreviews = (props) => {
  console.log('ImagePreviews.js-props', props);

  const { 
    imagePreviews, 
    modifiedImageUrls, 
    modifiedImagePaths,
    thumbnailImageUrls,
  } = props;

  const getFileType = (value) => {
    const fileType = value.split('.')[value.split('.').length -1].toLowerCase();
    return fileType;
  };

  let imagePreviewsBody;
  if (imagePreviews.length > 0) {
    imagePreviewsBody = (
      <ul className="feedEdit__imagePreviews">
        {imagePreviews.map((imagePreview) => {
          let imagePreviewBody;
          if (imagePreview.split("/")[0] === "data:image") {
            imagePreviewBody = (
              <span>
                <img src={imagePreview} height="" alt="pictures of previews" />
              </span>
            );
          }
          if (imagePreview.split("/")[0] === "data:video") {
            imagePreviewBody = (
              <span>
                <video src={imagePreview} controls height="75"></video>
              </span>
            );
          }

          return imagePreviewBody;
        })}
      </ul>
    );
  }

  let previousImagesBody;
  if (modifiedImagePaths && modifiedImagePaths.length > 0) {
    previousImagesBody = (
      <div>
        <div className="feedEdit__previousImagesTitle">
          Previously Uploaded Images
        </div>
        <ul className="feedEdit__previousImages">
          {modifiedImagePaths.map(imagePath => {

            const imageUrl = modifiedImageUrls.find(url => {
              return url.includes(imagePath.split('/')[1]);
            });

            const fileType = getFileType(imagePath);

            let previousPreviewBody;
            // if (getFileType(imagePath) === "jpg" 
            // || getFileType(imagePath) === "jpeg"
            // || getFileType(imagePath) === "png"
            // || getFileType(imagePath) === "webp"
            // ) 
            if (isImageFile(fileType))
            {
              previousPreviewBody = (
                <span>
                  <img 
                  src={imageUrl}
                  // src={imageUrl.startsWith('https://') ? imageUrl : BASE_URL + '/' + imageUrl}
                  height="" alt="previously uploaded picthres" 
                  />
                </span>
              );
            }
            // if (getFileType(imagePath) === "mp4" 
            // || getFileType(imagePath) === "webm"
            // ) 
            if (isVideoFile(fileType))
            {
              previousPreviewBody = (
                <span>
                  <span>Delete previous video bofore uploading new video</span>
                  {/* <Img src={thumbnailImageUrls[0]} alt="previous videos"/> */}
                  {/* <video src={imageUrl} height="50"></video> */}
                </span>
              );
            }

            return previousPreviewBody;
        })}
        </ul>
      </div>
    );
  }

  return <Fragment>
    <div>{imagePreviewsBody}</div>
    <div>{previousImagesBody}</div>
    </Fragment>;
};

export default withI18n()(ImagePreviews);
// export default FeedEdit;
