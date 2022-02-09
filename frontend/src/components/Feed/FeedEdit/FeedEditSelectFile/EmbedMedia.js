import React, { useState, useEffect, Fragment } from "react";
import { withI18n } from "react-i18next";

import Input from '../../../Form/Input/Input';
// import classes from './FeedEditSelectFile.module.css';


function EmbedMedia(props) {
  const {
    t,
    state,
    embedUrlChangeHandler,
    inputBlurHandler,
    // isAuth
  } = props;

  const embedUrl = state.postForm['embedUrl'].value;

  const [embedUrlInput, setEmbedUrlInput] = useState('');
  const [embedMediaUrl, setEmbedMediaUrl] = useState(embedUrl);

  const inputLabel = 'Embed youTube video';
  const inputPlaceholder = 'Copy YouTube url here';
  const previewTitle = 'Preview';

  function getYouTubeId(url) {
    var regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);

    if (match && match[2].length == 11) {
      return match[2];
    } else {
      return "error";
    }
  }
  ////   https://www.youtube.com/watch?v=Xt9Hk7zCItM
  ////  http://www.youtube.com/watch?v=zbYf5_S7oJo
  // var myId = getYouTubeId("http://www.youtube.com/watch?v=zbYf5_S7oJo");
  // const youTubeEmbedUrl = "https://www.youtube.com/embed/" + myId;
  // console.log("myId", myId);

  const createYouTubeEmbedUrl = (url) => {
    const youTubeId = getYouTubeId(url);
    // console.log(youTubeId);
    if (youTubeId === 'error') {
      setEmbedMediaUrl('');
      embedUrlChangeHandler('');
    } else {
      const youTubeEmbedUrl = "https://www.youtube.com/embed/" + youTubeId;
      // console.log(youTubeEmbedUrl);
      setEmbedMediaUrl(youTubeEmbedUrl);
      embedUrlChangeHandler(youTubeEmbedUrl);
    }
  }

  const embedYouTubeUrlInputHandler = (input, value) => {
    console.log(value);
    createYouTubeEmbedUrl(value);
  }

  return (
    <Fragment>
      {/* <div>embed YouTube Video</div> */}
      <Input
        id="embed"
        label={inputLabel}
        // label={t('feed.text10')}
        control="input"
        placeholder={inputPlaceholder}
        // placeholder={t('feed.text15')}
        onChange={embedYouTubeUrlInputHandler}
        onBlur={inputBlurHandler.bind(this, 'embedUrl')}
        valid={state.postForm['embedUrl'].valid}
        touched={state.postForm['embedUrl'].touched}
        value={embedMediaUrl}
      />
      {/* <button onClick={createEmbedUrl}>generate-embed-url</button> */}
      <div>{previewTitle}</div>
      <div>
        {/* <iframe width="569" height="315" src="https://www.youtube.com/embed/Xt9Hk7zCItM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> */}
        <iframe
          width="190"
          height="105"
          src={embedMediaUrl}
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
    </Fragment>
  );
}

export default withI18n()(EmbedMedia);
