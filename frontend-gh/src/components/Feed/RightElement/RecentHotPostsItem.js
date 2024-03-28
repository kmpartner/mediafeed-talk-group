import React, { useState, useEffect, Fragment } from "react";
import { Link } from 'react-router-dom';
// import Select from 'react-select';
import { withI18n } from "react-i18next";
import Img from 'react-cool-img';


import { isAudioFile, isImageFile,  isVideoFile,  } from "../../../util/image";
import { BASE_URL } from "../../../App";

import classes from "./RecentHotPostsItem.module.css";

function RecentHotPostsItem(props) {
  const { 
    t, 
    post,
    creatorImageUrls,
   } = props;
  // console.log('RcentHotPostsItem-props', props);

  let creatorImageUrl;

  const isCreatorImageUrl = creatorImageUrls.find(ele => {
    return ele.userId === post.creatorId;
  });

  if (isCreatorImageUrl && isCreatorImageUrl.imageUrl) {
    creatorImageUrl = isCreatorImageUrl.imageUrl;
  }

  // console.log('isCreatorImageUrl', isCreatorImageUrl);

  const postLinkTarget = '_blank';

  let linkToPost = `/feed/${post._id}`;

  if (post.postType === 'live') {
    linkToPost = `/livepost?roomId=${post.liveRoomId}&locationPass=${post.liveLocationPass}`;
  }

  // console.log('embedUrl', post.embedUrl)
  let youTubeThumbnailUrl;
  if (post.embedUrl) {
    const ytId = post.embedUrl.split('/').pop();
    youTubeThumbnailUrl = 'http://img.youtube.com/vi/' + ytId + '/0.jpg';
  }
  // http://img.youtube.com/vi/Xt9Hk7zCItM/0.jpg

  // const adPlaceId = post.withAdIndex ? `feedList-${post.withAdIndex}-${post.id}` : null;
  
  // const postLinkTarget = window.innerWidth < 768 && '_blank';
  


  let postImagesBody;

  let postImagesStyle = null;

  if (post.modifiedImageUrls.length > 0) {
    postImagesStyle = { maxWidth:"100px" };
  }
  // //// audio file case
  // const firstImageUrl = post.imageUrls[0];
  // // console.log(imageFileName);
  // if (firstImageUrl) {
  //   const imageFileType = firstImageUrl.split('.').pop();
  //   // console.log(imageFileType);
  //   if (isAudioFile(imageFileType)) {
  //     postImagesBody = (
  //       <span className="post__SmallImages">
  //         {/* <div>audio-file</div> */}
  //         <audio src={firstImageUrl} controls height={'50'} alt="post images"/>
  //     </span>
  //     );
  //   }
  // }

  if (post.modifiedImageUrls && post.modifiedImageUrls.length > 0) {

    // postImagesBody = <ul>{post.modifiedImageUrls.map(url => {
      postImagesBody = <ul>{post.imageUrls.map((url, index) => {
      
      // console.log('url', url);
      let fileType;
      if (post.modifiedImagePaths && post.modifiedImagePaths.length > 0) {
        fileType = post.modifiedImagePaths[0].split('.')[post.modifiedImagePaths[0].split('.').length -1];
        // console.log(fileType, post.modifiedImagePaths[0]);
      }

      let imageStyle = {
        width: '100%',
        maxWidth: '30px',
        maxHeight: '30px',
        width: "30px",
        height: "30px",
        objectFit: 'cover',
        borderRadius: '4px'
      };

      // if (post.modifiedImageUrls.length === 1 && window.innerWidth > 768) {
      //   imageStyle = {
      //     width: '100%',
      //     maxWidth: '300px',
      //     // maxHeight: '400px',
      //     // objectFit: 'cover',
      //     // borderRadius: '4px'
      //   };
      // }

      if (post.modifiedImageUrls.length > 1) {

        // imageStyle = {height: '175px', maxHeight: '175px'};
        imageStyle = {
          height: '30px', 
          width: '30px',
          objectFit: 'cover',
          borderRadius: '4px'
        };
      }

      if (post.modifiedImageUrls.length > 2) {

        // imageStyle = {height: '100px', maxHeight: '100px'};
        imageStyle = {
          height: '30px', 
          width: '30px',
          objectFit: 'cover',
          borderRadius: '4px'
        };
      }

      if (isVideoFile(fileType)) {
        return (
          <div className="post__SmallVideos">
            {/* <Img src={post.thumbnailImageUrls[0]} alt="post videos"/> */}
            <Link to={linkToPost} target={postLinkTarget} rel="noopener noreferrer">
              <video 
                style={{ maxWidth: '100%', maxHeight: '60px'}}
                // src={post.imageUrls[0]} 
                src={post.modifiedImageUrls[0]} 
                muted 
                autoPlay={isVideoFile ? true : false}
                // loop={isVideoFile ? true : false}
                // autoPlay 
                // loop
              />
              <div className={classes.hotPostSmallVideosVideoMark}
                // role="img" aria-label="video indicator"
              >
                &#9654;
              </div>
            </Link>
          </div>
        );
      } 

      if (isImageFile(fileType)) {
        return (
          <span className="post__SmallImages">
            {/* <Img 
              // style={{width: "100%", maxWidth:"350px"}}
              // style={{imageStyle}}
              // style={{width: '50%', maxWidth:"75px"}}
              style={imageStyle}
              src={url} 
              alt="post images"
            /> */}
            <Link to={linkToPost} target={postLinkTarget} rel="noopener noreferrer">
              <img 
                style={imageStyle}
                src={post.modifiedImageUrls.length > 2 ? post.modifiedImageUrls[index] :url} 
                alt="post images"
              />
            </Link>

            {/* {url.startsWith('https://')
              ? <Img src={url} height={imageHeight} alt="post images"/>
              : <Img src={BASE_URL + '/' + url} height="50" alt="" />
            } */}
          </span>
        );
      }

      if (isAudioFile(fileType)) {
        return (
          <span className="post__SmallImages">
            <span className="post__SmallImages">
              {/* <div>audio-file</div> */}
              <audio src={url} controls height={'50'} alt="post images"/>
            </span>
          </span>
        );
      }

    })
    }</ul>
  }

  let recentHotPostsItemBody;

  if (post) {
    recentHotPostsItemBody = (
      <div className={classes.hotPostsItem}>
        <div className={classes.hotPostsItemName}>
          <div style={postImagesStyle}>
            {postImagesBody}
          </div>

          {post.embedUrl &&
              <div style={{maxWidth: "100px"}}>
                <Link to={linkToPost} target={postLinkTarget} rel="noopener noreferrer">
                  <div className="post__SmallVideos">
                    {/* <Img src={youTubeThumbnailUrl} alt="post videos" width="160" /> */}
                    <Img 
                      style={{ maxWidth: '100%', maxHeight: '60px'}}
                      src={youTubeThumbnailUrl} alt="post videos" 
                      // width="200"
                      // height="150" 
                    />
                    <div className={classes.hotPostSmallVideosYouTubeMark}
                        // role="img" aria-label="video indicator"
                    >
                      &#9654;
                    </div>
                  </div>
                </Link>
              </div>
            }

            <Link className={classes.hotPostTextLink}
              to={linkToPost} target={postLinkTarget} rel="noopener noreferrer"
            >
              {post.title.length > 30 && (
                <span>
                  {post.title.slice(0,30)}....
                </span>
              )}
              {post.title.length <= 30 && (
                <span>
                  {post.title}
                </span>
              )}
            </Link>

        </div>


        <div className={classes.hotPostsItemCreatorName}>
          <Link className={classes.hotPostTextLink}
            to={linkToPost} target={postLinkTarget} rel="noopener noreferrer"
          >
            {post.creatorName}
            {' '}
            {/* ({post.totalVisit}) */}
            {' '}
            {creatorImageUrl && (
              <img 
                style={{ height: "0.8rem", width: "0.8rem"}} 
                src={creatorImageUrl} 
                alt="creator image" 
              />
            )}
          </Link>
        </div>

      </div>
  );
  }

  return (
    <Fragment>
      <div>{recentHotPostsItemBody}</div>
    </Fragment>
  );
}

export default withI18n()(RecentHotPostsItem);
