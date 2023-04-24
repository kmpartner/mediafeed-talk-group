/* eslint-disable max-len */
// const React = window.React = require('react');
import React, { Fragment } from "react";

// import { useTranslation } from "react-i18next";
import { useTranslation } from 'react-i18next/hooks';

// import "./TermsOfUse.css";
// import classes from './AboutPage.module.css';

const ImageEditorLink = (props) => {

  const [t] = useTranslation("translation");

  return <Fragment>
      <span>
        When you need to edit your image files before upload, you can use simple image editor
        {' '}
        at Kura Image Photo
        {' '}
        (<a 
          href='https://kura-image-photo.spaceeight.net'
          target="_blank"
          rel="nofollow noopener noreferrer"
        >
          Link to image editor site
        </a>)

      </span>
  </Fragment>;
};
export default ImageEditorLink;
