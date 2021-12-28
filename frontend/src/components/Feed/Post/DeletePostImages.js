import React, { Fragment } from "react";
import { useState, useEffect } from "react";
import { withI18n } from "react-i18next";
import { Link } from "react-router-dom";
import Img from "react-cool-img";

import Button from "../../Button/Button";
import Loader from "../../Loader/Loader";
import Modal from "../../Modal/Modal";
import SmallModal from "../../Modal/SmallModal";
import TransBackdrop from "../../Backdrop/TransBackdrop";
import UserModalContents from "../../Modal/UserModalContents";
import { getUserLocation } from "../../../util/user";
import { isImageFile, isVideoFile } from "../../../util/image";
import "./Post.css";

import { BASE_URL } from "../../../App";

import classes from './DeletePostImages.module.css';

const deletePostImages = (props) => {
  console.log("deleteImages-prop.js", props);

  const {
    t,
    imageUrls, 
    modifiedImageUrls, 
    thumbnailImageUrls,
    modifiedImagePaths,
    imagePaths,
    thumbnailImagePaths,
    setShowDeleteImagesModal
  } = props;

  const [pathUrls, setPathUrls] = useState([]);
  const [selectedPathUrls, setSelectedPathUrls] = useState([]);
  const [deleteResult, setDeleteResult] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    createPathUrls();
  },[imageUrls, imagePaths]);


  // console.log(t);

  const createPathUrls = () => {
    if (imagePaths && imagePaths.length > 0 
      && imageUrls && imageUrls.length > 0
    ) {
      const pathUrls = [];
      
      for (const path of imagePaths) {
        // console.log(encodeURIComponent(path.split('/')[1]));
        const crid = path.split('/')[1].split('crid')[0];
        console.log('crid', crid);

        const matchUrls = imageUrls.filter(url => {
          // console.log('include() ', s.includes(uriPath));
          if (url.includes(crid)) {
            return url;
          } else {
            return null;
          }
        });


        const matchModifiedUrls = modifiedImageUrls.filter(url => {
          // console.log('include() ', s.includes(uriPath));
          if (url.includes(crid)) {
            return url;
          } else {
            return null;
          }
        });

        const matchModifiedPaths = modifiedImagePaths.filter(url => {
          // console.log('include() ', s.includes(uriPath));
          if (url.includes(crid)) {
            return url;
          } else {
            return null;
          }
        });

        const matchThumbnailUrls = thumbnailImageUrls.filter(url => {
          // console.log('include() ', s.includes(uriPath));
          if (url.includes(crid)) {
            return url;
          } else {
            return null;
          }
        });

        const matchThumbnailPaths = thumbnailImagePaths.filter(url => {
          // console.log('include() ', s.includes(uriPath));
          if (url.includes(crid)) {
            return url;
          } else {
            return null;
          }
        });

        console.log('matchUrls', matchUrls);
        pathUrls.push({
          imageUrl: matchUrls[0],
          modifiedImageUrl: matchModifiedUrls[0],
          thumbnailImageUrl: matchThumbnailUrls[0],
          imagePath: path,
          modifiedImagePath: matchModifiedPaths[0],
          thumbnailImagePath: matchThumbnailPaths[0],

          crid: crid,
        });
      }

      console.log('pathUrls', pathUrls);
      setPathUrls(pathUrls);
    }
  }

  const editDeleteImages = (crid) => {
    console.log('in addDeleteImage');
    const deleteItem = pathUrls.find(pathUrl => {
      return pathUrl.crid === crid;
    });

    const isSelected = selectedPathUrls.find(pathUrl => {
      return pathUrl.crid === crid;
    })

    if (deleteItem && !isSelected) {
      const addedList = selectedPathUrls.concat(deleteItem);
      console.log('addedList', addedList);
      setSelectedPathUrls(addedList);
    }

    if (deleteItem && isSelected) {
      const removedList = selectedPathUrls.filter(pathUrl => {
        return pathUrl.crid !== crid;
      });
      console.log('removedList', removedList);
      setSelectedPathUrls(removedList);
    }

  };


  const deleteMultiplePostImages = (deletePathUrls) => {
    setIsDeleting(true);

    const deleteImageUrls = [];
    const deleteModifiedImageUrls = []; 
    const deleteThumbnailImageUrls = [];
    
    const formData = new FormData();

    for (const pu of deletePathUrls) {
      if (pu.imagePath) {
        deleteImageUrls.push(pu.imagePath);
        // formData.append('deleteImageUrls', deleteImageUrls);
      }
      if (pu.modifiedImagePath) {
        deleteModifiedImageUrls.push(pu.modifiedImagePath);
        // formData.append('deleteModifiedImageUrls', deleteModifiedImageUrls);
      }
      if (pu.thumbnailImagePath) {
        deleteThumbnailImageUrls.push(pu.thumbnailImagePath);
        // formData.append('deleteThumbnailImageUrls', deleteThumbnailImageUrls);
      }
    }



    formData.append('deleteImageUrls', deleteImageUrls);
    formData.append('deleteModifiedImageUrls', deleteModifiedImageUrls);
    formData.append('deleteThumbnailImageUrls', deleteThumbnailImageUrls);
    
    console.log('deletePathUrls', deletePathUrls);
    console.log(formData.get('deleteImageUrls'), formData.get('deleteImageUrls').split(','));
    // return;
    fetch(BASE_URL + `/feed-images/delete-post-images/${props.id}?userLocation=${localStorage.getItem('userLocation')}`, {
      method: 'PUT',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
      body: formData,
    })
      .then(res => {
        console.log(res);
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Creating or editing a post failed!');
        }
        return res.json();
      })
      .then(res => {
        console.log(res);

        setIsDeleting(false);
        setShowDeleteConfirm(false);
        setDeleteResult('Delete Image Success');
        setTimeout(() => {
          setDeleteResult('');
          // setShowDeleteImagesModal(false);
        },1000*5);

        // const deletedPathUrls = pathUrls.filter(function(val) {
        //   return deleteImageUrls.crid.indexOf(val.crid) === -1;
        // });
        // console.log('deletedPathUrls', deletedPathUrls);

      })
      .catch(err => {
        console.log(err);
        setIsDeleting(false);
        setShowDeleteConfirm(false);
        setDeleteResult('Delete Image Failed');
      })
    
    
  }




  let deletePostImagesBody;
  if (pathUrls.length > 0) {
    deletePostImagesBody = <ul>
      {pathUrls.map(pathUrl => {

      let fileType;
      if (pathUrl.modifiedImagePath) {
        fileType = pathUrl.modifiedImagePath.split('.')[pathUrl.modifiedImagePath.split('.').length -1];
      }

        const isSelected = selectedPathUrls.find(pu => {
          return pu.crid === pathUrl.crid;
        });
        // console.log('isSelected', isSelected);
        if (isVideoFile(fileType)) {
          return (
            <span 
              // className={classes.feedImages__column} 
              onClick={() => { editDeleteImages(pathUrl.crid); }}
            >
              {/* <div>{pathUrl.crid}</div> */}
              <span className={classes.deletePostImagesImageContainer}>
                <Img src={pathUrl.thumbnailImageUrl} alt="post videos"/>
                {/* <video src={pathUrl.modifiedImageUrl} height="100" alt="small post video"/> */}
                <span className={classes.deletePostImagesVideoMark} 
                  // role="img" aria-label="video indicator"
                >
                  &#9654;
                </span>
                {isSelected && <div>selected &#10003;</div>}
              </span>
            </span>
          );
        } 
        else {
          return (
            <span 
              // className={classes.feedImages__column} 
              onClick={() => { editDeleteImages(pathUrl.crid); }}
            >
              {/* <div>{pathUrl.crid}</div> */}
              <span className={classes.deletePostImagesImageContainer}>
                <Img src={pathUrl.modifiedImageUrl} alt="small post image"/>
                {isSelected && <div>selected &#10003;</div>}
              </span>
            </span>
          );
        }
      })}
    </ul>
  }


  return (
    <Fragment>
      <TransBackdrop onClick={() => {
        // setShowDeleteImagesModal(false); 
        }}
      />
      <SmallModal style="deleteImageModal">
        <div className={classes.deletePostImagesContainer}>
          <div>Select Images for deletion</div>
          <div>
            {deletePostImagesBody}
          </div>
          <div>
            <Button mode="flat" design=""
              disabled={isDeleting || showDeleteConfirm}
              onClick={() => {
                setShowDeleteImagesModal(false); 
              }}
            >

              {t('general.text1', 'Cancel')}
            </Button>
            <Button mode="raised" design=""
              disabled={isDeleting || selectedPathUrls.length === 0 || showDeleteConfirm}
              onClick={() => { setShowDeleteConfirm(!showDeleteConfirm) }}
            >
              {t('feed.text17', 'Delete')}
            </Button>
          </div>
            {showDeleteConfirm && 
              <div className={classes.deletePostImagesConfirmContainer}>
                <strong>Delete Selected Images?</strong>
                <div className={classes.deletePostImagesConfirmButtons}>
                  <Button mode="flat" design=""
                    disabled={isDeleting}
                    onClick={() => {
                      setShowDeleteConfirm(false); 
                    }}
                  >
                    {t('general.text1', 'Cancel')}
                  </Button>
                  <Button mode="raised" design=""
                    disabled={isDeleting || selectedPathUrls.length === 0}
                    onClick={() => { deleteMultiplePostImages(selectedPathUrls); }}
                  >
                    {t('feed.text17', 'Delete')}
                  </Button>
                </div>
              </div>
            }

            {isDeleting && <div><Loader /></div>}
            <div>{deleteResult}</div>
        </div>
      </SmallModal>
    </Fragment>
  );
};

export default withI18n()(deletePostImages);
// export default post;
