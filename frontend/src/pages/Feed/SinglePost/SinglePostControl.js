import React, { Fragment, useState, useEffect } from "react";
import { withI18n } from "react-i18next";

import Button from '../../../components/Button/Button';
import DeletePostImages from "../../../components/Feed/Post/DeletePostImages";
import Loader from "../../../components/Loader/Loader";
import SmallModal from "../../../components/Modal/SmallModal";

import { useStore } from "../../../hook-store/store";
import "./SinglePost.css";

const SinglePostControl = (props) => {
  // console.log('SinglePostControl.js-props', props);
  const { 
    t,
    storePostIdHandler,
    storeDeletePostIdHandler,
    postData,
   } = props;

  const [store, dispatch] = useStore();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteImagesModal, setShowDeleteImagesModal] = useState(false);

  const updatePostElementHandler = () => {
    setTimeout(() => {
      window.location.reload();
    },3000);
  };

  let singlePostControlBody;

  singlePostControlBody = (
    <div className="single-post__editButton">
      <Button
        mode="raised" design="" type="submit"
        onClick={storePostIdHandler}
      >
        {t('general.text5', 'Edit')}
      </Button>
      <Button
        mode="raised" design="" type="submit"
        onClick={() => { setShowDeleteModal(true); }}
      >
        {/* {t('general.text5', 'Edit')} */}
        delete
      </Button>
      {postData && postData.imageUrls.length > 0 && (
        <Button
          mode="raised" design="" type="submit"
          onClick={() => { setShowDeleteImagesModal(true); }}
        >
          {/* {t('general.text5', 'Edit')} */}
          delete Image
        </Button>
      )}

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
                  onClick={() => { setShowDeleteModal(false); }}
                >
                  {/* Cancel */}
                  {t('general.text1')}
                </Button>
                <Button mode="raised" design=""
                  disabled={props.isPostDeleting}
                  onClick={storeDeletePostIdHandler}
                >
                  {/* Delete */}
                  {t('feed.text17')}
                </Button>

                {/* <div>{props.isPostDeleting && <Loader />}</div>
                <div>{props.postDeleteResult}</div> */}
              </div>
            </SmallModal>
          </div>
         }

          {showDeleteImagesModal && 
            <DeletePostImages
              id={postData._id}
              imageUrls={postData.imageUrls}
              modifiedImageUrls={postData.modifiedImageUrls}
              thumbnailImageUrls={postData.thumbnailImageUrls}
              imagePaths={postData.imagePaths}
              modifiedImagePaths={postData.modifiedImagePaths}
              thumbnailImagePaths={postData.thumbnailImagePaths}
              setShowDeleteImagesModal={setShowDeleteImagesModal}
              // updatePostElementHandler={postData.updatePostElementHandler}
              updatePostElementHandler={updatePostElementHandler}
            />
          }
    </div>
  );
  

  return (
    <Fragment>
      {singlePostControlBody}

    </Fragment>
  );
};

export default withI18n()(SinglePostControl);
// export default FeedEdit;
