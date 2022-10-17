import React, { useState, useEffect, Fragment } from 'react';
import { withI18n } from "react-i18next";

import FilePicker from '../../../Form/Input/FilePicker';
import EmbedMedia from './EmbedMedia';

import classes from './FeedEditSelectFile.module.css';

function FeedEditSelectFile(props) {
  console.log('FeedEditSelectFile.js-props', props);
  const {
    t,
    postInputChangeHandler,
    inputBlurHandler,
    state,
    embedUrlChangeHandler,
    // isAuth
  } = props;

  const [showEmbed, setShowEmbed] = useState(false);

  useEffect(() => {
    if (state.postForm.embedUrl.value) {
      setShowEmbed(true);
    }
  },[state.postForm.embedUrl.value]);

  const showEmbedHandler = () => {
    if (state.postForm && !state.postForm.embedUrl.value) {
      setShowEmbed(!showEmbed);
    }
  }
  // const embedUrl = state.postForm['embedUrl'].value;
  let imageExist = false;

  if (state.postForm) {
    if (state.postForm.image.value || 
      state.postForm.imagePaths.value.length > 0
    ) {
      imageExist = true;
    }

    if (state.postForm.image.value === 'undefined' && 
    state.postForm.imagePaths.value.length === 0) {
      imageExist = false;
    }
  }

  return (
    <Fragment>
      {!state.postForm.embedUrl.value &&
      <div>
        <FilePicker
          id="image"
          // label="Media File"
          label={t('feed.text32', 'Media Files')}
          control="input"
          onChange={postInputChangeHandler}
          onBlur={inputBlurHandler.bind(this, 'image')}
          valid={state.postForm['image'].valid}
          touched={state.postForm['image'].touched}
        />

        <span className="feedEdit__aboutMediaFile">
          {/* think about later about size video and web thing */}
          {/* (Media File should be jpg, jpeg, png, mp4 file, and less than 3MB) */}
          {/* (Media File should be jpg, jpeg, png, mp4 file) */}
          {/* (Media File should be jpg, jpeg, png file, less than 1MB, up to 6 files) */}
          {/* (Image files should be jpg, jpeg, png file, up to 6 files (Image will be resized when file size exceed 1MB)) */}
          {/* (Image files should be jpg, jpeg, png file, less than 5MB, up to 6 files (Images with more than 1400px of width or height will be resized)) */}
          {t('feed.text34', 'Image files should be jpg, jpeg, png file, less than 5MB, up to 6 files')} ({t('feed.text35', 'Images with more than 1400px of width or height will be resized')})
        </span>
      </div>
      }

      {!imageExist && 
        <div className={classes.feedEditselectFileOpen}>
          <span onClick={showEmbedHandler}>
            {/* {!showEmbed && <span>OR,</span>}  */}
            <br/>
            {t('feed.text33', 'Embed Media')} &#9662;
          </span>
        </div>
      }

      {(!imageExist && showEmbed) && 
        <EmbedMedia
          id="embedUrl"
          // postInputChangeHandler={postInputChangeHandler}
          state={state}
          embedUrlChangeHandler={embedUrlChangeHandler}
          inputBlurHandler={inputBlurHandler}
        />
      }
    </Fragment>
  );
}

export default withI18n()(FeedEditSelectFile);