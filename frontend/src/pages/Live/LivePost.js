import React from 'react';
import { useEffect, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { useTranslation } from 'react-i18next/hooks';

import Button from '../../components/Button/Button';
// import Feed from '../Feed/Feed';
import Loader from '../../components/Loader/Loader';
import Post from '../../components/Feed/Post/Post';

import { useStore } from '../../hook-store/store';

import AdElementDisplay from '../../components/GroupTalk/GroupAdElements/AdElememtDisplay/AdElementDisplay';

import { BASE_URL } from '../../App';
// import './NotPageFound.css';

import LiveEmbed from '../../components/LiveEmbed/LiveEmbed';


const LivePost = props => {
  // console.log('need-to-login-props', props);
  const currentUrl = new URL(window.location.href);
  const queryParams = currentUrl.searchParams;
  const roomId = queryParams.get('roomId');
  const locationPass = queryParams.get('locationPass');

  const liveUrl = process.env.REACT_APP_LIVE_URL;

  const [t] = useTranslation('translation');

  const [store, dispatch] = useStore();

  const [liveInfo, setLiveInfo] = useState();
  const [livePost, setLivePost] = useState();
  const [presenterPosts, setPresenterPosts] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    getLivePostHandler(roomId, locationPass);
  },[]);

  useEffect(() => {
    if (livePost) {
      getPresenterPosts(livePost.creatorId);
    }
  },[livePost]);


  const getLivePostHandler = async (liveRoomId, liveLocationPass) => {
    try {
      console.log('in createLivePostHandler');
      const result = await fetch(BASE_URL + `/feed/live-post?liveRoomId=${liveRoomId}&liveLocationPass=${liveLocationPass}&userLocation=${localStorage.getItem('userLocation')}`, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
          'Content-Type': 'application/json'
        },
      });
  
      const resData = await result.json();

      console.log(result, resData);

      if (resData.liveInfo) {
        setLiveInfo(resData.liveInfo);
      }
      if (resData.livePost) {
        setLivePost(resData.livePost);
      }

    } catch(err) {
      console.log(err);
    }
  };

  const getPresenterPosts = (presenterId) => {
    // const queryEnd = BASE_URL + '/feed/posts?page=' + page + `&userpost=${this.state.userOnly.toString()}&userId=${lsUserId}`;
    const queryEnd = BASE_URL + `/feed/presenter-posts?page=1&userpost=true&userId=${presenterId}`;
    
    fetch(queryEnd, {
      headers: {
        // Authorization: 'Bearer ' + props.token
      }
    })
      .then(res => {
        if (res.status !== 200) {
          throw new Error('Failed to fetch live presenter posts.');
        }
        return res.json();
      })
      .then(resData => {
        console.log('live presenter posts resData', resData);
        setPresenterPosts(resData.posts);
      })
      .catch(err => {
        console.log(err);
      });
  }



  let presenterPostsBody;

  if (presenterPosts.length > 0) {
    presenterPostsBody = (
      <ul>{presenterPosts.map(post => {
        return (
          <div key={post._id} className="feed-container">
            {/* {post.title} */}
            <Post
              key={post._id}
              id={post._id}
              author={post.creatorName}
              creatorImageUrl={post.creatorImageUrl}
              date={new Date(post.createdAt).toLocaleDateString('en-US')}
              postDate={post.createdAt}
              title={post.title}
              image={post.imageUrl}
              modifiedImageUrl={post.modifiedImageUrl}
              thumbnailImageUrl={post.thumbnailImageUrl}
              imageUrls={post.imageUrls}
              modifiedImageUrls={post.modifiedImageUrls}
              thumbnailImageUrls={post.thumbnailImageUrls}
              imagePaths={post.imagePaths}
              modifiedImagePaths={post.modifiedImagePaths}
              thumbnailImagePaths={post.thumbnailImagePaths}
              embedUrl={post.embedUrl}
              content={post.content}
              b64Simage={post.b64Simage}
              postCreatorUserId={post.creatorId}
              public={post.public}
              onStartEdit={() => {}}
              onDelete={() => {}}
              // deleteMultiImagePostHandler={this.deleteMultiImagePostHandler.bind(this, post._id)}
              deleteMultiImagePostHandler={() => {}}
              updatePostElementHandler={() => {}}
              isPostDeleting={''}
              postDeleteResult={''}
              setSelectedCreatorId={''}
              resetPostPage={''}
              postData={post}
              postFilter={''}
            />
          </div>
        );
      })}</ul>
    );
  }




  let body;
  if (props.isLoading) {
    body = (<div className="notPageFound__Loader">
      <Loader />
      </div>);
  } 
  else {
    body = ( 
    <div className="notPageFound__container">
    </div>
    );
  }

  return (
    <div>
      
      {/* <GetWindowData 
        setWindowValues={() => {}}
      /> */}

      {store.windowValues && (store.windowValues.width < 768) && (
        <AdElementDisplay
          adType='300x65' 
          adPlaceId='toppage-top' 
        />
      )}
      {store.windowValues && (store.windowValues.width >= 768) && (
        <AdElementDisplay 
          adType='300x300'
          adPlaceId='toppage-right' 
        />
      )}
      
      <LiveEmbed
        liveEmbedUrl={`${liveUrl}/${roomId}?locationPass=${locationPass}`}
        start={liveInfo && liveInfo.start}
        end={liveInfo && liveInfo.end}
      />

      <section>
        <div>presenter-posts</div>
        {presenterPostsBody}
      </section>

      {/* <Feed 
        {...props} 
        userId={props.userId} 
        token={props.token} 
        isAuth={props.isAuth} 
        darkMode={props.darkMode}
      /> */}
    </div>
  );
}

export default LivePost;
