import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { withI18n } from "react-i18next";

import classes from './PostSelect.module.css';

function PostSelect(props) {
  const {
    t,
    showRecentPostsHandler,
    showUserPostsHandler,
    showFavoritePostsHandler,
    showMostViewedPostsHandler,
    isAuth
  } = props;

  const customStyles = {
    control: (styles) => ({ 
      ...styles, 
      backgroundColor: 'var(--background-color)',
    }),
    option: (provided, state) => {
      return {
        ...provided,
        borderBottom: '0.25px dotted var(--color)',
        // color: state.isSelected ? 'red' : 'blue',
        color: 'var(--color)',
        backgroundColor: 'var(--background-color)',
        padding: '1rem',
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
    { value: 'most-visit-posts', label: `Most Viewed Posts` },
    // { value: 'other-post-select', label: 'other-post1' },
    // { value: 'other-post-select2', label: 'other-post2' },
  ];

  if (isAuth) {
    options = [
      { value: 'posts', label: `${t('feed.text3')}` },
      { value: 'user-posts', label: `${t('feed.text2')}` },
      { value: 'favorite-posts', label: `${t('general.text18')}` },
      { value: 'most-visit-posts', label: `Most Viewed Posts` },
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

    }

  },[selectedOption]);

  return (
    <div className={classes.postSelectContainer}>
        <Select
          defaultValue={selectedOption}
          onChange={setSelectedOption}
          options={options}
          placeholder={placeholder}
          styles={customStyles}
        />
    </div>
  );
}

export default withI18n()(PostSelect);