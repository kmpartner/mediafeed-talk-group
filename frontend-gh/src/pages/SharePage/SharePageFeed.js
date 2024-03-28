import React from "react";
import { Fragment, useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { useTranslation } from "react-i18next/hooks";
import axios from "axios";

// import Button from "../../components/Button/Button";
// import Loader from "../../components/Loader/Loader";
import FeedEdit from "../../components/Feed/FeedEdit/FeedEdit";
// import PostMessageRecieve from "./PostMessageRecieve";

import { useStore } from "../../hook-store/store";
// import { getUserDataForStore } from "../../util/user";


import { authPageLink, authSignupPageLink, BASE_URL } from "../../App";


const SharePageFeed = (props) => {
  // console.log('PostMessageRecieve-props', props);
  const [t] = useTranslation("translation");

  const { 
    isAuth, 
    history, 
    isFeedPost, 
    setIsFeedHandler 
  } = props;

  const [store, dispatch] = useStore();
  const { shareFile } = store.shareStore;

  const [isLoading, setIsLoading] = useState(false);


  const shareFileFeedPostHandler = postData => {

    setIsLoading(true);

    let isAudioFile 

    console.log('postData in SharePageFeed.js', postData);
  
    const formData = new FormData();

    formData.append('title', postData.title);
    formData.append('content', postData.content);
    formData.append('public', postData.public);
  
  
    if (!postData.image || postData.image.length > 1 || postData.image.length === 1) {
      
      if (postData.image && postData.image.length > 0) {
        for (const file of postData.image) {
          formData.append('images', file)
        }
      }
  
      if (postData.embedUrl) {
        formData.append('embedUrl', postData.embedUrl)
      }
  
      if (
        // this.state.editPost && 
        postData.imagePaths.length > 0
      ) {
        
        let totalFileNumber = 0;
  
        if (postData.image && postData.image !== 'undefined') {
          totalFileNumber = postData.image.length + postData.imagePaths.length;
        } else {
          totalFileNumber = postData.imagePaths.length;
        }
        console.log('totalFileNumber in Feed.js', totalFileNumber);
        formData.append('totalFileNumber', totalFileNumber);
      }
      // formData.append('images', postData.image);
  
      let url = BASE_URL + `/feed-images/post-images?userLocation=${localStorage.getItem('userLocation')}`;
      
      //// video post upload url
      if (postData.image && postData.image !== 'undefined' && postData.image[0].type.split('/')[0] === 'video') {
        url = BASE_URL + `/feed-video-upload?userLocation=${localStorage.getItem('userLocation')}`;
      }
  
      //// audio post upload url
      if (postData.image && postData.image !== 'undefined' && postData.image[0].type.split('/')[0] === 'audio') {
        url = BASE_URL + `/feed-audio-upload?userLocation=${localStorage.getItem('userLocation')}`;
      }
  
  
      let method = 'POST'
  
      // if (this.state.editPost) {
      //   url = BASE_URL + '/feed-images/post-images/' + this.state.editPost._id + `?userLocation=${localStorage.getItem('userLocation')}`;
      //   method = 'put'
  
      //   //// video update upload url
      //   if (postData.image && postData.image !== 'undefined' && postData.image[0].type.split('/')[0] === 'video') {
      //     url = BASE_URL + '/feed-video-upload/' + this.state.editPost._id + `?userLocation=${localStorage.getItem('userLocation')}`;
      //   }
  
      //   //// audio update upload url
      //   if (postData.image && postData.image !== 'undefined' && postData.image[0].type.split('/')[0] === 'audio') {
      //     url = BASE_URL + '/feed-audio-upload/' + this.state.editPost._id + `?userLocation=${localStorage.getItem('userLocation')}`;
      //   }
  
      //         // console.log(postData.imagePaths);
      //   if (!postData.image && postData.imagePaths.length > 0) {
      //     const fileName = postData.imagePaths[0];
      //     const fileType = fileName.split('.').pop();
      //     // console.log('fileName, fileType', fileName, fileType);
      //     if (isAudioFile(fileType)) {
      //       url = BASE_URL + '/feed-audio-upload/' + this.state.editPost._id + `?userLocation=${localStorage.getItem('userLocation')}`;
      //       }
      //   }
      // }
  

  
  
      axios.request({
        method: method,
        url: url,
        data: formData,
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
        onUploadProgress: (p) => {
          console.log('onUploadProgress', (p.loaded/p.total*100).toFixed(0), p); 
          
          dispatch('SHOW_NOTIFICATION', {
            status: 'pending',
            title: '',
            message: `uploading... ${(p.loaded/p.total*100).toFixed(0)}%`,
          });
        }
      })
        .then(resData => {
          console.log(resData);
    
          // for axios
          if (resData.status !== 200 && resData.status !== 201) {
            throw new Error('Creating or editing a post failed!');
          }

          const updatedPostData = resData.data.post;

          dispatch('SHOW_NOTIFICATION', {
            status: 'pending',
            title: '',
            message: `upload success`,
          });

          setTimeout(() => {
            dispatch('CLEAR_NOTIFICATION')

            const postUrl = window.location.origin + `/feed/${updatedPostData._id}`
            window.open(postUrl);
            
            window.close();
          }, 5000);
  
  
          if (updatedPostData.public === 'public') {
            // return postUpdatePushHandler(
            //   // BASE_URL,
            //   PUSH_URL,
            //   localStorage.getItem('token'),
            //   localStorage.getItem('userId'),
            //   updatedPostData
            // )
          }

        })
        .then(res => {
          console.log(res);

          setIsLoading(false);
        })
        .catch(err => {
          console.log(err);
          // this.catchError(err);  
  
          const errmessage = { message: 'Creating or editing a post failed!'}
          // this.catchError(errmessage);

          setIsLoading(false);

          dispatch('SHOW_NOTIFICATION', {
            status: 'error',
            title: '',
            message: `upload failed`,
          });
          
          setTimeout(() => {
            dispatch('CLEAR_NOTIFICATION')
          }, 5000);
  
   
          //// // delete selectedId, postData edit from single postpage
          const selectedPostId = localStorage.getItem('selectedPostId');
          if (selectedPostId) {
            localStorage.removeItem('selectedPostId');
            localStorage.removeItem('selectedPostData');
            
            // setTimeout(() => {
            //   this.props.history.push(`/feed/${selectedPostId}`);
            // }, 1000*5);
          }
        });
    
    }
  
  };

  return (
    <Fragment>
      <div>
        {shareFile && isFeedPost && (
          <FeedEdit 
            editing={true}
            selectedPost={null}
            loading={false}
            onCancelEdit={() => { setIsFeedHandler(false); }}
            onFinishEdit={shareFileFeedPostHandler}
            deletePostImageHandler={() => {}}
            imageDeleted={false}
            imageDeletedHandler={() => {}}
            postsLoading={false}
            history={history}
            shareFile={shareFile}
          />
        )}
      </div>
    </Fragment>
  );
};

export default SharePageFeed;



