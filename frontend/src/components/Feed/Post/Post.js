import React from 'react';
import { useState } from 'react';
import { withI18n } from "react-i18next";
import { Link } from 'react-router-dom';
import Img from "react-cool-img";

import Button from '../../Button/Button';
import Loader from '../../Loader/Loader';
import Modal from '../../Modal/Modal';
import SmallModal from '../../Modal/SmallModal';
import TransBackdrop from '../../Backdrop/TransBackdrop';
import UserModalContents from '../../Modal/UserModalContents';

import DeletePostImages from './DeletePostImages';
import { getUserLocation } from '../../../util/user';
import { isImageFile, isVideoFile } from '../../../util/image';
import { getDate, getDateTime } from '../../../util/timeFormat';
import './Post.css';

import { BASE_URL } from '../../../App';


const post = props => {
  // console.log('prop-Post.js', props, window.location)
  
  const { t } = props;
  // console.log(t);
  // const imagePlace = BASE_URL + '/' + props.image;
  // const fileType = imagePlace.split('.')[imagePlace.split('.').length - 1].toLowerCase();
  const imagePlace = props.image.split('?')[0];
  const fileType = imagePlace.split('.')[imagePlace.split('.').length - 1].toLowerCase();
  const linkToPost = `/feed/${props.id}`;

  // console.log(imagePlace, fileType);

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
  }

  let smallImage;

  if (isImageFile(fileType)) {
    smallImage = (
      <div>
        <Link to={linkToPost}>
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
        <Link to={linkToPost}>
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
        />
      </SmallModal>
    </div>
  );

  let postImagesBody;
  if (props.modifiedImageUrls && props.modifiedImageUrls.length > 0) {
    postImagesBody = <ul>{props.modifiedImageUrls.map(url => {
      
      let fileType;
      if (props.modifiedImagePaths && props.modifiedImagePaths.length > 0) {
        fileType = props.modifiedImagePaths[0].split('.')[props.modifiedImagePaths[0].split('.').length -1];
        // console.log(fileType, props.modifiedImagePaths[0]);
      }

      let imageHeight = "100"
      if (props.modifiedImageUrls.length > 1) {
        imageHeight = "75"
      }

      if (isVideoFile(fileType)) {
        return (
          <span className="post__SmallVideos">
            {/* <Img src={props.thumbnailImageUrls[0]} alt="post videos"/> */}
            {/* <video src={url} autoPlay height={imageHeight} alt="post videos"/> */}

            {url.startsWith('https://')
              ? <Img src={props.thumbnailImageUrls[0]} alt="post videos"/>
              : <Img src={BASE_URL + '/' + props.thumbnailImageUrls[0]} alt="post videos"/>
            }
            <span className="post__SmallVideosVideoMark"
              // role="img" aria-label="video indicator"
            >
              &#9654;
            </span>
          </span>
        );
      } 
      else {
        return (
          <span className="post__SmallImages">
            {/* <Img src={url} height={imageHeight} alt="post images"/> */}

            {url.startsWith('https://')
              ? <Img src={url} height={imageHeight} alt="post images"/>
              : <Img src={BASE_URL + '/' + url} height="50" alt="" />
            }
          </span>
        );
      }
    })}</ul>
  }

  return (
    <article className="post">
      {smallImage}

      <Link to={linkToPost}>
      {postImagesBody}
      </Link>

      <header className="post__header">
        <Link to={linkToPost} className="post__title">{props.title}</Link>
      </header>
      <div className="post__contentContainer">
        <Link to={linkToPost} className="post__content">
          {props.content.length > 50 ? 
            props.content.slice(0,50) + '.....'
          : props.content
          }</Link>
      </div>
      <h3 className="post__meta" onClick={showSmallModalHandler}>
        {/* Posted by {props.author} on {props.date} {props.public === 'private' &&  props.postCreatorUserId === localStorage.getItem('userId') ? 'private' : null} */}
        {t('feed.text8')} {props.author} 
        <br/> 
        ({props.postDate && getDate(props.postDate)}) {props.public === 'private' && props.postCreatorUserId === localStorage.getItem('userId') ? 'private' : null}
        {/* <img src={BASE_URL + '/' + props.creatorImageUrl} alt="" height="20"></img> */}
        
        {/* {props.postDate && getDateTime(props.postDate)} */}

      </h3>
      {/* <video src={BASE_URL + '/' + props.image} height="50" ></video>
      <img src={BASE_URL + '/' + props.image} width="50" alt="videofile"></img> */}
      <div className="post__actions">
        <Button mode="flat" link={props.id} action="viewpost">
          {/* View  */}
          {t('feed.text4')}
        </Button>
        {props.postCreatorUserId === localStorage.getItem('userId') ?
          <span>
            <Button mode="flat" onClick={props.onStartEdit}>
              {/* Edit */}
              {t('feed.text5')}
            </Button>
            <Button mode="flat" design="danger" onClick={showDeleteModalHandler}>
              {/* Delete */}
              {t('feed.text6')}
            </Button>

            {props.modifiedImageUrls && props.modifiedImageUrls.length > 0
              &&
              <Button mode="flat" design="danger" onClick={() => {setShowDeleteImagesModal(!showDeleteImagesModal)}}>
                Delete Images
              </Button>
            }
            
          </span>
          : null
        }
      </div>
      {showDeleteModal ?
        <div>
          {/* <Modal
            acceptEnabled={true}
            onCancelModal={hideDeleteModalHandler}
            // onAcceptModal={!props.imageUrls || props.imageUrls.length === 0 ? props.onDelete : props.deleteMultiImagePostHandler}
            onAcceptModal={props.deleteMultiImagePostHandler}
            // isLoading={this.props.postsLoading}
            title="Delete Post"
          // style="confirmModal"
          >
            <div className="userImageUpload__confirmContent">
              Is is no problem to delete post completely?
              {t('feed.text7')}
            </div>
          </Modal> */}
          <SmallModal style="modal2">
            <div>
              <div className="userImageUpload__confirmContent">
                  {t('feed.text7', 'Is is no problem to delete post completely?')}
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
                onClick={props.deleteMultiImagePostHandler}
              >
                {/* Delete */}
                {t('feed.text17')}
              </Button>

              <div>{props.isPostDeleting && <Loader />}</div>
              <div>{props.postDeleteResult}</div>
            </div>
          </SmallModal>
        </div>
        : null}

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
          />
        }
    </article>
  )
};

export default withI18n()(post);
// export default post;
