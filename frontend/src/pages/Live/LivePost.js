import React from 'react';
import { Fragment, useEffect, useState } from 'react';
// import { Link, Redirect } from 'react-router-dom';
import { useTranslation } from 'react-i18next/hooks';

// import Button from '../../components/Button/Button';
// import Feed from '../Feed/Feed';
import Loader from '../../components/Loader/Loader';
import LivePresenterPosts from './LivePresenterPosts';
// import Post from '../../components/Feed/Post/Post';
import PostComments from '../../components/Feed/SinglePost/PostComment/PostComments';

// import { useOnScreen } from '../../custom-hooks/useOnScreen';
import { useStore } from '../../hook-store/store';

import AdElementDisplay from '../../components/GroupTalk/GroupAdElements/AdElememtDisplay/AdElementDisplay';
import AdElementTime from '../../components/GroupTalk/GroupAdElements/AdElememtDisplay/AdElementTime';
import LiveEmbed from '../../components/LiveEmbed/LiveEmbed';

import { BASE_URL, LIVE_URL } from '../../App';

import classes from './LivePost.module.css';

const LivePost = props => {
  // console.log('need-to-login-props', props);
  const currentUrl = new URL(window.location.href);
  const queryParams = currentUrl.searchParams;
  const roomId = queryParams.get('roomId');
  const locationPass = queryParams.get('locationPass');

  const { token, isAuth } = props;

  // const liveUrl = process.env.REACT_APP_LIVE_URL;

  const [t] = useTranslation('translation');

  // const ref = useRef();
  // const isBottomVisible = useOnScreen(ref);

  const [store, dispatch] = useStore();
  // console.log('store in LivePost.js', store);

  const [liveInfo, setLiveInfo] = useState();
  const [livePost, setLivePost] = useState();
  const [presenterPosts, setPresenterPosts] = useState([]);
  const [error, setError] = useState('');

  const [underEmbedBottom, setUnderEmbedBottom] = useState(false);
  const [targetRect, setTargetRect] = useState();

  const [isLoading, setIsLoading] = useState(false);

  // const targetEl = document.getElementById(`live-embed-bottom`);
  // let targetRect;
  // if (targetEl) {
  //   targetRect = targetEl.getBoundingClientRect();
  // }

  useEffect(() => {
    const targetEl = document.getElementById(`live-embed-bottom`);
    const rectInterval = setInterval(() => {

      setTargetRect(targetEl.getBoundingClientRect());
    
    }, 1000*3);

    return () => {
      clearInterval(rectInterval);
    };
  },[]);

  useEffect(() => {

    // console.log('live-embed-bottom targetRect', targetRect);
    // console.log('windowValues in livePost.js', store.windowValues);

    if (targetRect && targetRect.top < -100) {
      console.log('embmed bottom is close to screen top')
      if (!underEmbedBottom) {
        setUnderEmbedBottom(true);
      }
    } else {
      console.log('not embmed bottom is close to screen top')
      if (underEmbedBottom) {
        setUnderEmbedBottom(false);
      }
    }
  },[store.windowValues, targetRect]);


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
      setIsLoading(true);
      setError('');

      // console.log('in createLivePostHandler');
      const result = await fetch(BASE_URL + `/feed/live-post?liveRoomId=${liveRoomId}&liveLocationPass=${liveLocationPass}&userLocation=${localStorage.getItem('userLocation')}`, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
          'Content-Type': 'application/json'
        },
      });
  
      if (result.status === 400) {
        setError('Live not found.');
      }

      const resData = await result.json();

      console.log(result, resData);

      if (resData.liveInfo) {
        setLiveInfo(resData.liveInfo);
      }
      if (resData.livePost) {
        setLivePost(resData.livePost);
      }

      setIsLoading(false);

    } catch(err) {
      console.log(err);
      setIsLoading(false);
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


  let nearStart = false;
  let afterStart = false;

  let liveEmbedBody;

  if (!isLoading) {
    liveEmbedBody = (
      <div>
        Live broadcast not found, or Live broadcast already finished.
      </div>
    );
  }

  if (liveInfo && liveInfo.start < Date.now() + 1000*60*10) {
    nearStart = true;
  }

  if (liveInfo && liveInfo.start < Date.now()) {
    afterStart = true;
  }


  if (liveInfo && nearStart) {
    liveEmbedBody = (
      <div>
        {/* <div>
          live-info-found {JSON.stringify(liveInfo)}
        </div> */}
        <LiveEmbed
          liveEmbedUrl={`${LIVE_URL}/${roomId}?locationPass=${locationPass}`}
          underEmbedBottom={underEmbedBottom}
        />
      </div>
    );
  }

  if (liveInfo && !nearStart) {
    liveEmbedBody = (
      <div>
        Live broadcast not started.
        {/* , start-time: {new Date(liveInfo.start).toLocaleString()} */}
      </div>
    );
  }


  return (
    <Fragment>

      {isLoading && (
        <div><Loader /></div>
      )}

      {liveInfo && store.windowValues && (store.windowValues.width < 768) && (
        // <AdElementDisplay
        //   adType='300x65' 
        //   adPlaceId='toppage-top' 
        // />
          <AdElementTime
          adType='300x65' 
          adPlaceId='livepage-top' 
        />
      )}
      {liveInfo && store.windowValues && (store.windowValues.width >= 768) && (
        // <AdElementDisplay 
        //   adType='300x300'
        //   adPlaceId='toppage-right' 
        // />
          <AdElementTime
          adType='300x300'
          adPlaceId='livepage-right' 
        />
      )}

      <div>
        {/* <strong>{error}</strong> */}
      </div>

      <section className="feed-container">
        {/* {livePost && livePost.public === 'public' && (
          <div>{t('feed.text10', 'Title')}: {livePost.title}</div>
        )} */}

        {liveInfo && (
          <div>
            <div>
              {t('general.text22', 'Start')} {new Date(liveInfo.start).toLocaleString()}
            </div>
            <div>
              {t('general.text23', 'End')} {new Date(liveInfo.end).toLocaleString()}
            </div>
          </div>
        )}
        {liveEmbedBody}
        {/* <LiveEmbed
          liveEmbedUrl={`${LIVE_URL}/${roomId}?locationPass=${locationPass}`}
          underEmbedBottom={underEmbedBottom}
        /> */}
      </section>

      <div id="live-embed-bottom"
        // ref={ref}
      >
        {/* bottom-of-live-embed */}
      </div>


      <section className="feed-container">
        {/* <div>live-comment-list</div> */}
        
        {livePost && afterStart && (
          <div className={classes.livePostComment}
  >
            <PostComments
              token={token}
              postId={livePost._id}
              postCreatorId={livePost.creatorId}
              isAuth={isAuth}
            />
          </div>
        )}
      </section>

      <section>
        <LivePresenterPosts 
          presenterPosts={presenterPosts}
        />
        {/* <div>presenter-posts</div> */}
        {/* {presenterPostsBody} */}
      </section>

      {/* <Feed 
        {...props} 
        userId={props.userId} 
        token={props.token} 
        isAuth={props.isAuth} 
        darkMode={props.darkMode}
      /> */}
    </Fragment>
  );
}

export default LivePost;
