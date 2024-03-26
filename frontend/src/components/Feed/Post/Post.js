import React from 'react';
import { Fragment, useState, useRef } from 'react';
import { withI18n } from "react-i18next";
import { Link } from 'react-router-dom';
import Img from "react-cool-img";

import Button from '../../Button/Button';
import Loader from '../../Loader/Loader';
import Modal from '../../Modal/Modal';
import PostMetrics from './PostMetrics';
import SmallModal from '../../Modal/SmallModal';
import TransBackdrop from '../../Backdrop/TransBackdrop';
import UserModalContents from '../../Modal/UserModalContents';

import DeletePostImages from './DeletePostImages';
import AdElementDisplay from '../../GroupTalk/GroupAdElements/AdElememtDisplay/AdElementDisplay';
import { getUserLocation } from '../../../util/user';
import { isImageFile, isVideoFile, isAudioFile } from '../../../util/image';
import { getDate, getDateTime } from '../../../util/timeFormat';
import { useOnScreen } from '../../../custom-hooks/useOnScreen';

import './Post.css';

import { BASE_URL } from '../../../App';



const Post = props => {
  // console.log('prop-Post.js', props)
  
  const { t } = props;
  // console.log(t);
  // const imagePlace = BASE_URL + '/' + props.image;
  // const fileType = imagePlace.split('.')[imagePlace.split('.').length - 1].toLowerCase();
  const imagePlace = props.image.split('?')[0];
  const fileType = imagePlace.split('.')[imagePlace.split('.').length - 1].toLowerCase();
  
  const ref = useRef();
  const isVisible = useOnScreen(ref);

  let linkToPost = `/feed/${props.id}`;

  if (props.postData.postType === 'live') {
    linkToPost = `/livepost?roomId=${props.postData.liveRoomId}&locationPass=${props.postData.liveLocationPass}`;
  }

  // console.log('embedUrl', props.embedUrl)
  let youTubeThumbnailUrl;
  if (props.embedUrl) {
    const ytId = props.embedUrl.split('/').pop();
    youTubeThumbnailUrl = 'http://img.youtube.com/vi/' + ytId + '/0.jpg';
  }
  // http://img.youtube.com/vi/Xt9Hk7zCItM/0.jpg

  const adPlaceId = props.withAdIndex ? `feedList-${props.withAdIndex}-${props.id}` : null;
  
  // const postLinkTarget = window.innerWidth < 768 && '_blank';
  const postLinkTarget = '_blank';

  const lsNameDataList = localStorage.getItem('lsNameDataList');
  let nameData;
  if (lsNameDataList && JSON.parse(lsNameDataList).length > 0) {
    nameData = JSON.parse(lsNameDataList).find(element => {
      return element.userId === props.postData?.creatorId;
    });
  }
  // console.log('nameData', nameData);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSmallModal, setShowSmallModal] = useState(false);
  const [showDeleteImagesModal, setShowDeleteImagesModal] = useState(false);

  const showDeleteModalHandler = () => {
    setShowDeleteModal(!showDeleteModal);

    getUserLocation()
      .then(result => {
        console.log(result);
        // const locationData = result.data;
      })
      .catch(err => {
        console.log(err);
        this.catchError(err);
      });

  };
  const hideDeleteModalHandler = () => {
    setShowDeleteModal(false);
  };

  const showSmallModalHandler = () => {
    setShowSmallModal(!showSmallModal);
  };

  const deletePostHandler = () => {
    if (props.modifiedImageUrls && props.modifiedImageUrls.length > 0) {
      const fileType = props.modifiedImagePaths[0].split('.')[props.modifiedImagePaths[0].split('.').length -1];
      
      if (isImageFile(fileType)) {
        props.deleteMultiImagePostHandler(props.id, false);
      }

      if (isVideoFile(fileType)) {
        props.deleteMultiImagePostHandler(props.id, true);
      }

      if (isAudioFile(fileType)) {
        props.deleteMultiImagePostHandler(props.id, false);
      }
      
    } else {
      props.deleteMultiImagePostHandler(props.id, false);
    }

  };


  let smallImage;

  if (isImageFile(fileType)) {
    smallImage = (
      <div>
        <Link to={linkToPost} target={postLinkTarget} rel="noopener noreferrer">
          {/* <img src={BASE_URL + '/' + props.modifiedImageUrl} height="50" alt=""></img> */}
          {/* <img src={props.modifiedImageUrl} height="100" alt="post-image"></img> */}
          <Img src={props.modifiedImageUrl} height="100" alt="post-image"></Img>
        </Link>   
      </div>

    )
  }

  if (isVideoFile(fileType)) {
    smallImage = (
      <div>
        <Link to={linkToPost} target={postLinkTarget} rel="noopener noreferrer">
          {/* <video src={BASE_URL + '/' + props.modifiedImageUrl} height="50" autoPlay muted={true} ></video> */}
          <video src={props.modifiedImageUrl} height="50" autoPlay muted={true}></video>

          {/* <div className="post__ImageContainer">
            <span className="post__SmallVideo">
              <video src={BASE_URL + '/' + props.modifiedImageUrl} height="50" autoPlay muted={true} ></video>
            </span>
            <span className="post__VideoImage">
              <img src={BASE_URL + '/' + props.thumbnailImageUrl} height="100%" width="100%" alt=""></img>
            </span>
            <div className="post__VideoOverlay">Video</div>
          </div> */}
        </Link>
      </div>
    )
  }

  const authorModalBody = (
    <div>
      <TransBackdrop onClick={showSmallModalHandler} />
      <SmallModal style="modal2">
        <UserModalContents
          {...props}
          postCreatorUserId={props.postCreatorUserId} 
          author={props.author}
          creatorImageUrl={props.creatorImageUrl}
          // setSelectedCreatorId={props.setSelectedCreatorId}
          // resetPostPage={props.resetPostPage}
          showSmallModalHandler={showSmallModalHandler}
          nameData={nameData}
        />
      </SmallModal>
    </div>
  );





  let postImagesBody;

  // //// audio file case
  // const firstImageUrl = props.imageUrls[0];
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

  if (props.modifiedImageUrls && props.modifiedImageUrls.length > 0) {
    // postImagesBody = <ul>{props.modifiedImageUrls.map(url => {
      postImagesBody = <ul>{props.imageUrls.map((url, index) => {
      
      let fileType;
      if (props.modifiedImagePaths && props.modifiedImagePaths.length > 0) {
        fileType = props.modifiedImagePaths[0].split('.')[props.modifiedImagePaths[0].split('.').length -1];
        // console.log(fileType, props.modifiedImagePaths[0]);
      }

      let imageStyle = {
        width: '100%',
        maxWidth: '350px',
        maxHeight: '350px',
        objectFit: 'cover',
        borderRadius: '4px'
      };

      // if (props.modifiedImageUrls.length === 1 && window.innerWidth > 768) {
      //   imageStyle = {
      //     width: '100%',
      //     maxWidth: '300px',
      //     // maxHeight: '400px',
      //     // objectFit: 'cover',
      //     // borderRadius: '4px'
      //   };
      // }

      if (props.modifiedImageUrls.length > 1) {

        // imageStyle = {height: '175px', maxHeight: '175px'};
        imageStyle = {
          height: '175px', 
          width: '175px',
          objectFit: 'cover',
          borderRadius: '4px'
        };
      }

      if (props.modifiedImageUrls.length > 2) {

        // imageStyle = {height: '100px', maxHeight: '100px'};
        imageStyle = {
          height: '50px', 
          width: '50px',
          objectFit: 'cover',
          borderRadius: '4px'
        };
      }

      if (isVideoFile(fileType)) {
        return (
          <div className="post__SmallVideos">
            {/* <Img src={props.thumbnailImageUrls[0]} alt="post videos"/> */}
            <Link to={linkToPost} target={postLinkTarget} rel="noopener noreferrer">
              <video 
                style={{ maxWidth: '100%', maxHeight: '350px'}}
                // src={props.imageUrls[0]} 
                src={props.modifiedImageUrls[0]} 
                muted 
                autoPlay={isVideoFile ? true : false}
                loop={isVideoFile ? true : false}
                // autoPlay 
                // loop
              />
              <div className="post__SmallVideosVideoMark"
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
                src={props.modifiedImageUrls.length > 2 ? props.modifiedImageUrls[index] :url} 
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


  return (
    <Fragment>

      <article ref={ref} className="post">
        {/* <Link to={linkToPost} target="_blank" rel="noopener noreferrer"> */}
        
        {postImagesBody}
        

        {props.embedUrl &&
          <div>
            <Link to={linkToPost} target={postLinkTarget} rel="noopener noreferrer">
              <div className="post__SmallVideos">
                {/* <Img src={youTubeThumbnailUrl} alt="post videos" width="160" /> */}
                <Img 
                  style={{ maxWidth: '100%', maxHeight: '350px'}}
                  src={youTubeThumbnailUrl} alt="post videos" 
                  // width="200"
                  // height="150" 
                />
                <div className="post__SmallVideosYouTubeMark"
                    // role="img" aria-label="video indicator"
                >
                  &#9654;
                </div>
              </div>
            </Link>
          </div>
        }

        {smallImage}

        <header className="post__header">
          <Link to={linkToPost} target={postLinkTarget} rel="noopener noreferrer"
            className="post__title"
            >
              {props.title}
            </Link>
        </header>
        <div className="post__contentContainer">
          <Link to={linkToPost} target={postLinkTarget} rel="noopener noreferrer" 
          className="post__content">
            {props.content.length > 50 ? 
              props.content.slice(0,50) + '.....'
            : props.content
            }</Link>
        </div>
        <h3>
          {/* {t('feed.text8', 'Posted by')} {props.author}  */}
          <span className="post__meta"
            onClick={showSmallModalHandler}
          >
            {nameData && (
              <span> 
                {t('feed.text8', 'Posted by')} {nameData.name}
              </span>
            )}
            {' '}
            {nameData?.imageUrl && (
              <img 

                style={{height: "1rem", width: "1rem", objectFit: "cover"}}
                src={nameData.imageUrl} 
              />
            )}
          </span>
          <br/> 
          <span className="post__meta"
            onClick={showSmallModalHandler}
          >
            ({props.postDate && getDate(props.postDate)}) {props.public === 'private' && props.postCreatorUserId === localStorage.getItem('userId') ? 'private' : null}
          </span>
          {/* <img src={BASE_URL + '/' + props.creatorImageUrl} alt="" height="20"></img> */}
          
          {/* {props.postDate && getDateTime(props.postDate)} */}

        </h3>

        {/* {props.postFilter !== 'recent-visit-posts' && (
          <div className="post__metrics">
            <div className="post__metricsItem">{t('feed.29', 'Visits')}: {props.postData && props.postData.totalVisit ? props.postData.totalVisit : 0}</div>
            {likeCount && likeCount.reactionCount > 0 && (
              <div className="post__metricsItem">
                <span className="post__reactionButton">&#128077; </span>
                {likeCount.reactionCount}
              </div>
            )}
          </div>
        )} */}
        {props.postData.postType === 'live' && (
          <div>Live</div>
        )}

        {!(props.postFilter === 'recent-visit-posts' || props.postData.postType === 'live') && (
          <PostMetrics t={props.t} postData={props.postData} />
        )}

        {/* <video src={BASE_URL + '/' + props.image} height="50" ></video>
        <img src={BASE_URL + '/' + props.image} width="50" alt="videofile"></img> */}
        <div className="post__actions">
          {/* <Button mode="flat" link={props.id} action="viewpost">
            View 
            {t('feed.text4')}
          </Button> */}
          {props.postCreatorUserId === localStorage.getItem('userId') &&
            !props.hideActionButtons && (
              <span>
                {/* <Button mode="flat" onClick={props.onStartEdit}>
                  {t('feed.text5', 'Edit')}
                </Button>
                <Button mode="flat" design="danger" onClick={showDeleteModalHandler}>
                  {t('feed.text6', 'Delete')}
                </Button>

                {props.modifiedImageUrls && props.modifiedImageUrls.length > 0
                  &&
                  <Button mode="flat" design="danger" onClick={() => {setShowDeleteImagesModal(!showDeleteImagesModal)}}>
                    Delete Images
                  </Button>
                } */}
              </span>
          )}
        </div>
        {showDeleteModal &&
          <div>
            <SmallModal style="modal2">
              <div>
                <div className="userImageUpload__confirmContent">
                    <div>
                      {t('feed.text7', 'Is is no problem to delete post completely?')}
                    </div>
                    <div>
                      ({t('feed.text39', 'Post comments are also deleted.')})
                    </div>
                </div>

                <Button mode="flat" design=""
                  disabled={props.isPostDeleting}
                  onClick={hideDeleteModalHandler}
                >
                  {/* Cancel */}
                  {t('general.text1')}
                </Button>
                <Button mode="raised" design=""
                  disabled={props.isPostDeleting}
                  onClick={deletePostHandler}
                >
                  {/* Delete */}
                  {t('feed.text17')}
                </Button>

                <div>{props.isPostDeleting && <Loader />}</div>
                <div>{props.postDeleteResult}</div>
              </div>
            </SmallModal>
          </div>
         }

          {showSmallModal ? authorModalBody : null}
          
          {showDeleteImagesModal && 
            <DeletePostImages
              id={props.id}
              imageUrls={props.imageUrls}
              modifiedImageUrls={props.modifiedImageUrls}
              thumbnailImageUrls={props.thumbnailImageUrls}
              imagePaths={props.imagePaths}
              modifiedImagePaths={props.modifiedImagePaths}
              thumbnailImagePaths={props.thumbnailImagePaths}
              setShowDeleteImagesModal={setShowDeleteImagesModal}
              updatePostElementHandler={props.updatePostElementHandler}
            />
          }
      </article>

      {props.withAdIndex && (
        <div className="post__adContainer">
          <AdElementDisplay 
            adType='feedList'
            adPlaceId={adPlaceId}
          />
        </div>
      )
      }

    </Fragment>
  )
};

export default withI18n()(Post);
// export default post;
