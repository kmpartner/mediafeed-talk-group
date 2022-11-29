import React, { Component, Fragment } from "react";
import { withI18n } from "react-i18next";
// import Img from "react-cool-img";

// import Image from '../../Image/Image';
import { isVideoFile, isImageFile, isAudioFile } from "../../../util/image";
import { BASE_URL } from '../../../App';

import "./FeedEdit.css";

const ImagePreviews = (props) => {
  console.log('ImagePreviews.js-props', props);

  const { 
    imagePreviews, 
    modifiedImageUrls, 
    modifiedImagePaths,
    thumbnailImageUrls,
    state,
  } = props;

  const getFileType = (value) => {
    const fileType = value.split('.')[value.split('.').length -1].toLowerCase();
    return fileType;
  };

  let isValidImagePreview = false;

  if (state && state.postForm && state.postForm.image.valid) {
    isValidImagePreview = true;
  }

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
                <video style={{maxWidth:"70%", maxHeight: "140px", marginLeft:"3rem"}}
                  src={imagePreview} controls 
                  // height="100" 
                />
              </span>
            );
          }

          if (imagePreview.split("/")[0] === "data:audio") {
            imagePreviewBody = (
              <span>
                <audio src={imagePreview} controls height=""></audio>
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
          Previously Uploaded file
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
            if (fileType === 'gif')
            {
              previousPreviewBody = (
                <strong>
                  Delete previous gif file bofore uploading new file
                </strong>
              );
            }
            // if (getFileType(imagePath) === "mp4" 
            // || getFileType(imagePath) === "webm"
            // ) 
            if (isVideoFile(fileType))
            {
              previousPreviewBody = (
                <span>
                  {/* <video 
                    src={imageUrl}
                    controls
                    height="100" alt="previously uploaded video"
                  /> */}
                  <strong>
                    Delete previous video bofore uploading new file
                  </strong>
                  {/* <Img src={thumbnailImageUrls[0]} alt="previous videos"/> */}
                  {/* <video src={imageUrl} height="50"></video> */}
                </span>
              );
            }
            if (isAudioFile(fileType))
            {
              previousPreviewBody = (
                <span>
                  <strong>
                    Delete previous audio file bofore uploading new file
                  </strong>
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
    {isValidImagePreview && (
      <div>
        {imagePreviewsBody}
      </div>
    )}
    <div>{previousImagesBody}</div>
    </Fragment>;
};

export default withI18n()(ImagePreviews);
// export default FeedEdit;
