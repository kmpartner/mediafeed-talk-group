import React, { useState, useEffect, Fragment } from 'react';
import { withI18n } from "react-i18next";

import ImageEditorLink from '../../../../pages/NotPageFound/ImageEditorLink';
import FilePicker from '../../../Form/Input/FilePicker';
import EmbedMedia from './EmbedMedia';

import { isVideoFile } from '../../../../util/image';

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
  let isVideo = false;

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

  console.log('state.postForm', state.postForm, state.postForm.image.value);
  if (state.postForm.image.value && 
    state.postForm.image.value.length > 0 && 
    state.postForm.image.value[0].name
  ) {
    const fileType = state.postForm.image.value[0].name
      .split('.')[state.postForm.image.value[0].name.split('.').length -1].toLowerCase();
    
    isVideo = isVideoFile(fileType);
    console.log('state.postForm', state.postForm, state.postForm.image.value[0].name, isVideo);
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

        <div className="feedEdit__aboutMediaFile">
          <div>
            {t('feed.text45', 'Accept Image file, or Video (mp4, webm) file')}
          </div>
          <div>
            {!isVideo && (
              <div>
                {t('feed.text46', 'Image files should be jpg, jpeg, png, gif file.')}
                {' '} 
                {t('feed.text47', 'One file size should be less than 5MB. (Large file will be resized)')}
                {' '}
                <br/>
                {t('feed.text48', 'Accept up to 6 files. In the case of gif file, accept one file.')}
              </div>
            )}

            {isVideo && (
              <div> 
                {t('feed.text49', 'Accept one video file. File size should be less than 250MB')}
                {' '}
                {t('feed.text50', '(file will be resized to smaller size)')}
              </div>
            )}
          </div>

          <p>
              <ImageEditorLink />
          </p>
        </div>
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