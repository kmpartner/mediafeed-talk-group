import React, { Fragment, useState, useEffect } from 'react';
import Select from 'react-select';
import { withI18n } from "react-i18next";

import Backdrop from '../../Backdrop/Backdrop';
import SmallModal from '../../Modal/SmallModal';
import RecentHotPostsModalContent from '../RightElement/RecentHotPostsModalContent';

import { getRecentMostVisitLngPosts } from '../../../util/feed/feed-filter-recent';
import { BASE_URL } from '../../../App';

import classes from './PostSelect.module.css';

function PostSelect(props) {
  const {
    t,
    showRecentPostsHandler,
    showUserPostsHandler,
    showFavoritePostsHandler,
    showMostViewedPostsHandler,
    showMostLikedPostsHandler,
    showRecentVisitPostsHandler,
    isAuth
  } = props;

  const [hotPosts, setHotPosts] = useState([]);
  const [showHotPostsModal, setShowHotPostsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const customStyles = {
    // control: (styles) => ({ 
    //   ...styles, 
    //   backgroundColor: 'var(--background-color)',
    // }),
    control: (styles, state) => {
      // console.log('styles, state', styles, state)
      return {
        ...styles, 
        backgroundColor: 'rgb(219, 219, 219)',
        // backgroundColor:  'var(--background-color)',
        cursor: 'pointer',
      }
    },
    option: (provided, state) => {
      return {
        ...provided,
        borderBottom: '0.25px dotted var(--color)',
        // color: state.isSelected ? 'red' : 'blue',
        color: 'var(--color)',
        backgroundColor: 'var(--background-color)',
        padding: '1rem',
        cursor: 'pointer',
      }
    },
    // control: () => ({
    //   // none of react-select's styles are passed to <Control />
    //   // width: 200,
    // }),
    // singleValue: (provided, state) => {
    //   const opacity = state.isDisabled ? 0.5 : 1;
    //   const transition = 'opacity 300ms';
  
    //   return { ...provided, opacity, transition };
    // },
  }

  let options = [
    { value: 'posts', label: `${t('feed.text3')}` },
    { value: 'most-visit-posts', label: `${t('feed.text26', 'Most Visited Posts')}` },
    { value: 'most-like-posts', label: `${t('feed.text27', 'Most Favorited Posts')}` },
    { value: 'recent-visit-posts', label: `${t('feed.text28', 'Recent Visit Posts')}` },
    { value: 'recent-hot-posts', label: `${t('feed.text58', 'Hot Posts You May Like')}` },
    // { value: 'other-post-select', label: 'other-post1' },
    // { value: 'other-post-select2', label: 'other-post2' },
  ];

  if (isAuth) {
    options = [
      { value: 'posts', label: `${t('feed.text3')}` },
      { value: 'user-posts', label: `${t('feed.text2')}` },
      { value: 'favorite-posts', label: `${t('general.text18')}` },
      { value: 'most-visit-posts', label: `${t('feed.text26', 'Most Visited Posts')}` },
      { value: 'most-like-posts', label: `${t('feed.text27', 'Most Favorited Posts')}` },
      { value: 'recent-visit-posts', label: `${t('feed.text28', 'Recent Visit Posts')}` },
      { value: 'recent-hot-posts', label: `${t('feed.text58', 'Hot Posts You May Like')}` },
      // { value: 'other-post-select', label: 'other-post1' },
      // { value: 'other-post-select2', label: 'other-post2' },
    ]
  }

  const placeholder = `${t('feed.text3')}`;
             
  const [selectedOption, setSelectedOption] = useState(null);


  useEffect(() => {

    if (selectedOption) {
      console.log(selectedOption);
      if (selectedOption.value === 'posts') {
        showRecentPostsHandler();
      }
  
      if (selectedOption.value === 'user-posts') {
        showUserPostsHandler();
      }
  
      if (selectedOption.value === 'favorite-posts') {
        showFavoritePostsHandler();
      }

      if (selectedOption.value === 'most-visit-posts') {
        showMostViewedPostsHandler();
      }

      if (selectedOption.value === 'most-like-posts') {
        showMostLikedPostsHandler();
      }

      if (selectedOption.value === 'recent-visit-posts') {
        showRecentVisitPostsHandler();
      }

      if (selectedOption.value === 'recent-hot-posts') {
        if (hotPosts.length === 0) {
          getRecentHotPostsHandler();
        }
        setShowHotPostsModal(true);
      }

      //// set default posts path if pathname is diffrent from '/feed/posts'
      if (window.location.pathname !== '/feed/posts') {
        props.history.push(`/feed/posts`);
      }

    }

  },[selectedOption]);


  const getRecentHotPostsHandler = async () => {
    try {
      setIsLoading(true);

      const resData = await getRecentMostVisitLngPosts(
        BASE_URL,
        localStorage.getItem('token'),
      );

      // console.log('you may like', resData);
      if (resData && resData.posts) {
        setHotPosts(resData.posts);
      }

      setIsLoading(false);

    } catch(err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  return (
    <Fragment>
      <div className={classes.postSelectContainer}>
          <Select
            defaultValue={selectedOption}
            onChange={setSelectedOption}
            options={options}
            placeholder={placeholder}
            styles={customStyles}
            isSearchable={false}
          />
      </div>

      {showHotPostsModal && (
        <div>
          <Backdrop onClick={() => {
            setShowHotPostsModal(false);
          }} />
          <SmallModal style="hotPostsModal">
            <div>
              <div className={classes.postSelectModalClose}
                onClick={() => {
                  setShowHotPostsModal(false);
                }}
              >
                <span className={classes.postSelectModalCloseButton}>
                  X
                </span>
              </div>

              {/* <div>Recent Hot Posts You May Like</div> */}
              <div>
                <RecentHotPostsModalContent 
                  hotPosts={hotPosts}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </SmallModal>
        </div>
      )}

    </Fragment>
  );
}

export default withI18n()(PostSelect);